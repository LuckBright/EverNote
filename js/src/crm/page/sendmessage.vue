<template>
  <el-dialog
    title="发短信"
    class="ui_dialog_02"
    :visible.sync="sendVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="form" ref="messageform" :rules="rules" size="small" label-width="120px">
      <el-form-item label="接收人：" prop="receiverName">
        <el-input v-model="form.receiverName" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="抄送人：" prop="ccMobiles" v-if="ccMobileFlag">
        <el-input
          v-model="form.ccMobiles"
          maxlength="120"
          auto-complete="off"
          placeholder="多个手机号请用分号;隔开"
        ></el-input>
      </el-form-item>
      <el-form-item label="信息模版：">
        <el-select
          v-model="form.msgType"
          disabled
          placeholder="所有类型"
          style="width: 22%;display:inline-block;"
        >
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <ever-subject-select
          v-model="form.deptId"
          type="select"
          fields="orgSubjectCode"
          style="width: 22%;display:inline-block;"
        ></ever-subject-select>
        <el-select
          v-model="form.tempObj"
          value-key="id"
          placeholder="请选择短信模板"
          filterable
          clearable
          style="width: 54%;display:inline-block;"
        >
          <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信息内容：" prop="content">
        <el-input
          v-model="form.content"
          auto-complete="off"
          type="textarea"
          :disabled="editContentFlag"
          :maxlength="250"
          :rows="6"
        ></el-input>
      </el-form-item>
      <el-form-item label="发送历史：" v-if="singleFlag">
        <el-table :data="tableData" :border="false" :stripe="false">
          <el-table-column prop="senderName" label="发送人" width="120" align="center"></el-table-column>
          <el-table-column prop="content" show-overflow-tooltip label="短信内容"></el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status ? '发送成功' : '发送失败' }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" prop="createTime" label="发送时间" align="center"></el-table-column>
        </el-table>
        <div style="text-align:right" v-if="sendRecordNumberFlag">
          <a href="javascript:;" @click="goCrmUserMessagePage()">点击查看更多短信记录</a>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="sendMessage"
        v-ever-click-once="sendFlag"
        :disabled="sendFlag"
      >发送短信</el-button>
    </div>
  </el-dialog>
</template>
<script>
import memapi from '../store/memberapi' // getByPatientId  查询基础信息
import citys from '../../util/citys'
import storage from '@/util/storage'
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'

export default {
  props: ['users', 'disabled', 'allparams', 'visible', 'isBloc'],
  data () {
    return {
      editContentFlag: false,
      tableData: [],
      memapi,
      citys,
      // checkList: ['短信'],
      sendVisible: false,
      ifArray: false,
      form: {
        receiverId: '',
        receiverName: '',
        receiverMobile: '',
        ccMobiles: '',
        msgType: '',
        deptId: '',
        tempObj: {},
        name: '',
        content: ''
      },
      templateList: [],
      phoneNumber: '',
      classList: [],
      tempList: [],
      cityData: [],
      patientId: '',
      esVal: '',
      templateParam: {},
      rules: {
        content: [
          { required: true, message: '请填写短信内容', trigger: 'blur' }
        ]
      },
      singleFlag: false,
      signlePatientId: '',
      ccMobileFlag: true,
      defaultDeptId: '',
      sendRecordNumberFlag: false, // 是否显示更多的链接
      clinicId: storage.getStorageByClinic('CLINICID') || '',
      sendFlag: false
    }
  },
  watch: {
    'sendVisible' (val) {
      if (val) {
        this.init()
      }
    },
    'form.name' (val) {
      this.getById() // 调用模糊搜索接口
    },
    'form.deptId': {
      handler: function (val) {
        this.getTemplateList()
        this.form.tempObj = {}
        this.form.content = ''
      },
    },
    'form.tempObj': {
      handler: function (val) {
        if (val) {
          this.form.content = val.content
        } else {
          this.form.content = ''
        }
      },
      deep: true
    },
    'form.content' (val) {
      if (val && this.users.length === 1) {
        this.getTrueVal() // 值改变 就翻译
        this.editContentFlag = false
      } else {
        this.editContentFlag = true
      }
    },
  },
  created () {
    // 获取分类
    request(urlMap.msg.msgTemplate.getTypeList, {}, 'get').then(rs => {
      this.classList = rs.data
    })

    citys.getData().then(result => {
      this.cityData = result
    })
  },
  methods: {
    init () {
      this.form = {
        receiverId: '',
        receiverName: '',
        receiverMobile: '',
        ccMobiles: '',
        msgType: '',
        deptId: '',
        tempObj: {},
        name: '',
        content: ''
      }
      // this.users.length = 1
      let _receiveName = []
      // let _receiveMobile = []
      // let _receiveId = []
      // console.log(objUnionBy(this.users, 'patientId'))
      this.users && this.users.forEach((item, index) => {
        this.patientId = (item.patientId && item.patientId) || (item.member && item.member.patientId) || (item.id && item.id) // 不知道这个id干啥用的，
        let _tmpName = item.name || item.patientName || ((item.patient ? item.patient.name : '') || '')
        let _tmpPhone = item.mobile || item.patientPhone || ((item.patient ? item.patient.mobile : '') || '')

        // let _tmpId = item.patientId || item.receiverId || item.id
        _receiveName.push(_tmpName + '(' + _tmpPhone + ')')
        // _receiveMobile.push(item.mobile)
        // _receiveId.push(_tmpId)
        if (this.users.length === 1) {
          this.signlePatientId = this.patientId
          this.defaultDeptId = item.deptId || ''
          this.doSingleUserJobs(this.patientId)
        } else {
          this.doMultipleUserJobs()
        }
      })
      // 下面这些逻辑，不管是单条还是多条都是一样的，所以提出来
      this.form.receiverName = Array.from(new Set(_receiveName)).join('，') // 拼装名字
      // this.form.receiverMobile = Array.from(new Set(_receiveMobile)).join(',') // 拼装手机号  不知道拼了之后有啥用（应该是以前有用）
      // this.form.receiverId = Array.from(new Set(_receiveId)).join(',') // 拼装手机号  不知道拼了之后有啥用（应该是以前有用）
      this.form.msgType = this.allparams.msgType
      // this.form.deptId = '2fc3c311-e0db-4320-b3bf-d16764bf531e'
      // this.ifArray = !!(_receiveMobile.length > 1 || _receiveName.length > 1) // 多选置灰
      // if (!this.ifArray) { // 单条 获取模板列表
      //   console.log('wodhi dantiao ')
      //   if (this.allparams && this.allparams.msgType) {
      //     this.getMessageTemp({ name: '', status: 1, sourceType: 1 }) // 初始化 读取全部模版类型
      //   }
      // }
      this.getTemplateList()
    },
    handleClose () {
      this.$emit('update:sendVisible', false)
      this.sendVisible = false
      // this.form = {}
      // this.$emit('update:visible', false)
    },
    // 跳转到客户中心客户详情页面
    goCrmUserMessagePage () {
      let _url = this.$ever.crmIndex + '/crm/memberinfo/snslist/' + this.signlePatientId
      window.open(_url, '_blank')
    },
    // 选择多个用户时处理
    doMultipleUserJobs () {
      this.singleFlag = false
      this.ccMobileFlag = false
    },
    // 选择单个用户时处理
    doSingleUserJobs (patientId) {
      this.singleFlag = true
      this.ccMobileFlag = true
      this.displaySendRecordByPatientId(patientId)
      this.form.deptId = this.defaultDeptId
    },
    // 显示发送历史
    displaySendRecordByPatientId (patientId) {
      request(urlMap.msg.sms.getRecordList, {
        receiverId: patientId,
        offset: 0,
        optType: 0,
        pagesize: 5,
      }).then(res => {
        if (res.data.resultList.length > 0) {
          this.tableData = res.data.resultList
          if (res.data.totalCount > 5) {
            this.sendRecordNumberFlag = true
          }
        }
      })
    },
    getById () {
      if (!this.patientId) {
        return false
      }
      this.memapi.getBaseInfoById({ 'patientId': this.patientId, 'needIden': true }).then(rs => {
        let province = (rs.data.address && JSON.parse(rs.data.address).province) && this.getCityName(JSON.parse(rs.data.address).province)
        let city = (rs.data.address && JSON.parse(rs.data.address).city) && this.getCityName(JSON.parse(rs.data.address).city)
        let county = (rs.data.address && JSON.parse(rs.data.address).county) && this.getCityName(JSON.parse(rs.data.address).county)
        let addressDetail = (rs.data.address && JSON.parse(rs.data.address).addressDetail) && JSON.parse(rs.data.address).addressDetail
        this.templateParam['name'] = rs.data.name
        this.templateParam['address'] = province || '' + city || '' + county || '' + addressDetail || ''
      })
    },
    // 下拉选择短信模板内容
    getTemplateList () {
      request(urlMap.msg.msgTemplate.getTemplateListByDept, {
        deptId: this.form.deptId || '',
        tempTypeId: this.allparams.msgType || ''
      }).then(res => {
        this.templateList = res.data
      })
    },
    createFilter (queryString) {
      return (rs) => {
        return rs.name.indexOf(queryString.toLowerCase()) > -1
      }
    },
    getTrueVal () { // 翻译短信内容
      if (!this.allparams || this.allparams === undefined || !this.form.content || this.form.content.indexOf('{') === -1 && this.form.content.indexOf('}') === -1) {
        return false
      }
      // this.form.msgType = this.allparams.msgType ? this.allparams.msgType : ''
      Reflect.ownKeys(this.allparams).map((item) => {
        let newArr = this.form.content.match(/\{(.+?)\}/g)
        if (newArr === null) { return }
        newArr.map((k) => {
          let m = `{${item}}`
          if (m === k && this.allparams[item]) {
            this.form.content = this.form.content.replace(k, this.allparams[item])
          }
        })
      })
    },
    sendMessage () {
      this.$refs.messageform.validate(valid => {
        if (valid) {
          let params = {
            templateId: this.form.tempObj.id,
            deptId: this.form.deptId,
            content: this.form.content,
            ccMobiles: this.form.ccMobiles, // '18618453594;18618453594;18618453594',
            receivers: []
          }
          if (this.allparams.sendListData) {
            params.receivers = this.allparams.sendListData
          } else {
            this.users.forEach(item => {
              params.receivers.push({
                id: item.patientId ? item.patientId : ((item.patient && item.patient.id) ? item.patient.id : (item.id || '')),
                name: item.name ? item.name : (item.patientName ? item.patientName : ((item.patient && item.patient.name) ? item.patient.name : '')),
                mobile: item.mobile ? item.mobile : (item.patientPhone ? item.patientPhone : ((item.patient && item.patient.mobile) ? item.patient.mobile : '')),
                payload: this.allparams
              })
            })
          }
          request(urlMap.msg.sms.setMsgManual, params).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '短信发送成功')
            }
            this.handleClose()
            this.$emit('sendMsgSuccess') // 需要的话外面可以监听这个事件 表示发送完成了
          })
        }
      })
    },
    getCityName: function (code) {
      var CITIESLIST = this.cityData
      var retObj = []
      for (var i = 0; i < CITIESLIST.length; i++) {
        if (CITIESLIST[i][0] === code) {
          retObj = CITIESLIST[i]
        }
      }
      return retObj[1]
    }
  }
}
</script>

