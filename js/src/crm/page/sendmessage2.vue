<template>
  <el-dialog
    title="发短信"
    class="ui_dialog_02"
    :visible.sync="sendVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
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
          style="width: 22%;display:inline-block;">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <ever-subject-select
          v-model="form.deptId"
          type="select"
          fields="orgSubjectCode"
          style="width: 22%;display:inline-block;"></ever-subject-select>
        <el-select
          v-model="form.tempObj"
          value-key="id"
          placeholder="请选择短信模板"
          filterable
          clearable
          style="width: 54%;display:inline-block;">
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
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'

export default {
  props: {
    'data': {
      type: Object
    }
  },
  data () {
    return {
      editContentFlag: false,
      tableData: [],
      sendVisible: false,
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
      classList: [], // 分类的下拉列表
      patientId: '',
      rules: {
        content: [
          { required: true, message: '请填写短信内容', trigger: 'blur' }
        ]
      },
      singleFlag: false,
      ccMobileFlag: true,
      signlePatientId: '',
      defaultDeptId: '',
      sendRecordNumberFlag: false, // 是否显示更多的链接
      clinicId: localStorage.getItem('CLINICID') || '',
      sendFlag: false
    }
  },
  watch: {
    'sendVisible' (val) {
      if (val) {
        this.init1()
      }
    },
    'form.name' (val) {
      this.getById() // 调用模糊搜索接口
    },
    'form.deptId': {
      handler: function (val) {
        // todo 选中默认科室，如果传了模板id，选中默认模板，content赋值（无这种需求，暂不实现）
        this.getTemplateList()
        this.form.tempObj = {}
        this.form.content = ''
      },
    },
    'form.tempObj': {
      handler: function (val) {
        if (val) {
          this.form.content = val.content
          this.getTrueVal() // 值改变 就翻译
          if (this.data.receivers.length === 1) {
            this.editContentFlag = false
          } else {
            this.editContentFlag = true
          }
        } else {
          this.form.content = ''
        }
      },
      deep: true
    },
    // 'form.content' (val) {
    //   if (val && this.data.receivers.length === 1) {
    //     this.getTrueVal() // 值改变 就翻译
    //     this.editContentFlag = false
    //   } else {
    //     this.getTrueVal() // 值改变 就翻译
    //     this.editContentFlag = true
    //   }
    // },
  },
  created () {
    // 获取分类
    request(urlMap.msg.msgTemplate.getTypeList, {}, 'get').then(rs => {
      this.classList = rs.data
    })
  },
  methods: {
    init1 () {
      this.form.tempObj = {}
      this.form.content = ''
      if (!this.data.receivers.length) {
        this.$messageTips(this, 'error', '参数传值有问题，请联系工程师查看。')
        console.error('参数传值有问题，请查看demo写法')
        return
      }

      this.form.msgType = this.data.msgType // 给短信分类赋值
      this.form.deptId = this.data.deptId // 给科室赋值
      let _receiveName = [] // 给发送人拼装名字赋值
      this.data.receivers.forEach((item, index) => {
        let _tmpName = item.name
        let _tmpPhone = item.mobile
        _receiveName.push(_tmpName + '(' + _tmpPhone + ')')
        this.form.receiverName = Array.from(new Set(_receiveName)).join('，')
      })
      // 如果是单条（判断receivers数组的长度，1表示给单人发，>1表示群发）
      if (this.data.receivers.length === 1) {
        this.patientId = this.data.receivers[0].id
        this.doSingleUserJobs(this.patientId)
      } else {
        this.doMultipleUserJobs()
      }
      this.getTemplateList()
    },
    handleClose () {
      this.$emit('update:sendVisible', false)
      this.sendVisible = false
    },
    // 跳转到客户中心客户详情页面
    goCrmUserMessagePage () {
      let _url = this.$ever.crmIndex + '/crm/memberinfo/snslist/' + this.patientId
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
      this.form.content = this.data.content
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
    },
    // 下拉选择短信模板内容
    getTemplateList () {
      request(urlMap.msg.msgTemplate.getTemplateListByDept, {
        deptId: this.form.deptId || '',
        tempTypeId: this.data.msgType || ''
      }).then(res => {
        this.templateList = res.data
      })
    },
    createFilter (queryString) {
      return (rs) => {
        return rs.name.indexOf(queryString.toLowerCase()) > -1
      }
    },
    // 翻译短信内容
    getTrueVal () {
      if (!this.data.receivers || !this.form.content || this.form.content.indexOf('{') === -1 && this.form.content.indexOf('}') === -1) {
        return false
      }
      // let _tmp = this.data.receivers[0].payload
      let _tmpArr = []
      this.data.receivers.forEach((item, index) => {
        if (this.data.receivers.length === 1) {
          _tmpArr.push(this.replaceValueByKey(item.payload))
        } else {
          _tmpArr.push('短信' + (index + 1) + '：' + this.replaceValueByKey(item.payload))
        }
      })
      this.form.content = _tmpArr.join('\n')
    },
    // 替换内容
    replaceValueByKey (msgObj) {
      let _tmpContent = this.form.content
      if (msgObj) {
        Reflect.ownKeys(msgObj).map((item) => {
          let newArr = _tmpContent.match(/\{(.+?)\}/g)
          if (newArr === null) { return _tmpContent }
          newArr.map((k) => {
            let m = `{${item}}`
            if (m === k && msgObj[item]) {
              _tmpContent = _tmpContent.replace(k, msgObj[item])
            }
          })
        })
      }
      return _tmpContent
    },
    // 调用短信方法
    sendMessage () {
      this.$refs.messageform.validate(valid => {
        if (valid) {
          let params = {
            templateId: this.form.tempObj.id,
            deptId: this.form.deptId,
            content: this.form.content,
            ccMobiles: this.form.ccMobiles, // '18618453594;18618453594;18618453594',
            receivers: this.data.receivers
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
  }
}
</script>

