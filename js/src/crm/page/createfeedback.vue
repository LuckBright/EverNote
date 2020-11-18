<template>
  <div id="createvisit">
    <ever-bread-crumb :name="!id ? '添加反馈' : '反馈详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
        <el-row slot="header">
          <el-col :span="18"><strong class="title">反馈内容</strong></el-col>
        </el-row>
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            :rules="rules"
            ref="feedbackform"
            label-position="right">
            <template slot="patientName" slot-scope="scope">
              <div @click="showUserPop">
                <el-input placeholder="请选择客户" v-model="scope.obj.patientName" :readonly="true">
                </el-input>
              </div>
            </template>
            <template slot="involvePerson" slot-scope="scope">
              <div @click="showQuestionPop">
                <el-input placeholder="涉及人员" v-model="scope.obj.involvePerson" :readonly="true">
                </el-input>
              </div>
            </template>
            <template slot="callRecordId" slot-scope="scope">
              <div @click="showCalledPop">
                <el-input :placeholder="!scope.obj.patientId ? '请先选择客户' : '选择通话录音'" v-model="scope.obj.callRecordId.url" :disabled="!scope.obj.patientId || scope.obj.way !=833" :readonly="true">
                </el-input>
              </div>
            </template>
            <template slot="img" slot-scope="scope">
              <!-- {{obj.img}} -->
              <ever-upload1 v-model="obj.img" split="#"></ever-upload1>
            </template>
            <template slot="replyImg" slot-scope="scope">
              <span>无</span>
            </template>
            <template slot="handlPersonList" slot-scope="scope">
              <div @click="showpersonPop">
                <el-input placeholder="处理人员" v-model="handlPersonList" :readonly="true">
                </el-input>
              </div>
            </template>
            <el-form-item >
              <el-button type="primary" class="submit-btn" @click="createFeed"><i class="iconfont icon-baocunweimoban"></i> 保存</el-button>
              <el-button type="" class="cancel-btn" @click="prevBack"><i class="iconfont icon-quxiao"></i> 取消</el-button>
            </el-form-item>
          </ever-form-model>
          <user-select ref="user" :visible="userPop" :initdata="obj.callRecordId" :patient-id="obj.patientId" @close="closeUserPop" @select="setUserItem" @update="updateUserDia" :isradio="true"></user-select>
          <staff-select :initdata="involveList" @close="closeQuestionPop" @select="setQuestionItem" title="涉及人员" :visible.sync="questionPop" @update="updateStaff"></staff-select>
          <person-select ref="person" :visible.sync="personPop" :title="'处理人员'" :initdata="handleList" @close="closepersonPop" @select="sethandlePerson"  @update="updatePerson"></person-select>
          <call-select :visible.sync="calledPop" :initdata="obj.callRecordId" v-if="obj.patientId" :patient-id="obj.patientId"  @select="setCalledItem" @update="updateCalledDia" @close="closeCallPop" :isradio="true"></call-select>
      </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/createfeedbackapi'
import depart from '../../warehouse/store/departmentapi'
import form from '../../util/form'
import staffSelect from '../page/staffselect'
import personSelect from '../page/personselect'
import userSelect from '../page/userselect'
import callSelect from '../page/callselect.vue'

let schema = [
  {
    name: 'type',
    type: 'systype',
    code: 'THC_FEEDBACK_TYPE',
    span: 6,
    useValue: true,
    label: '类型：',
    placeholder: '类型'
  },
  {
    name: 'way',
    type: 'systype',
    code: 'THC_CC_FOLLOWUP',
    span: 6,
    label: '方式：',
    placeholder: '方式'
  },
  {
    name: 'patientName',
    type: 'custom',
    span: 20,
    label: '客户：'
  },
  {
    name: 'involveDpt',
    type: 'select',
    multiple: true,
    options: [],
    needObjFlag: true,
    span: 20,
    label: '涉及部门：'
  },
  {
    name: 'involvePerson',
    type: 'custom',
    span: 20,
    label: '涉及人员：'
  },
  {
    name: 'content',
    type: 'textarea',
    label: '反馈内容：',
    rows: 3,
    max: 2000,
    placeholder: '请填写反馈内容',
    span: 20
  },
  {
    name: 'img',
    type: 'custom',
    label: '内容截图：',
    span: 24
  },
  {
    name: 'callRecordId',
    type: 'custom',
    span: 20,
    label: '通话记录：'
  },
  {
    type: 'slice',
    label: '处理',
    className: 'panel-hr'
  },
  {
    name: 'handlPersonList',
    type: 'custom',
    label: '处理人员：',
    span: 20
  },
  {
    type: 'slice',
    label: '反馈给客户',
    className: 'panel-hr'
  },
  {
    label: '反馈部门',
    type: 'systype',
    code: 'THC_CC_FOLLOWUP',
    disabled: true
  },
  {
    label: '反馈人',
    type: 'systype',
    code: 'THC_CC_FOLLOWUP',
    disabled: true
  },
  {
    label: '反馈方式',
    type: 'systype',
    code: 'THC_CC_FOLLOWUP',
    disabled: true
  },
  {
    label: '客户反应',
    type: 'text',
    disabled: true
  },
  {
    name: 'replyImg',
    label: '内容截图',
    type: 'label',
    append: true,
    disabled: true
  },
  {
    type: 'slice',
    label: '反馈总结',
    className: 'panel-hr'
  },
  {
    label: '总结',
    type: 'text',
    disabled: true
  }
]
export default {
  mixins: [form],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.patientId = ''
    obj.callRecordId = ''
    obj.involveDpt = []
    return {
      aceViewUrl: '',
      uploadImgUrl: [],
      schema,
      api: api,
      depart: depart,
      id: this.$route.query.id,
      obj: obj,
      userPop: false,
      questionPop: false,
      personPop: false,
      calledPop: false,
      ids: [],
      doctorIds: [],
      feedbackRelevantList: [],
      feedbackHandleList: [],
      handlPersonList: '',
      handleList: [],
      handlepersonname: [],
      involveList: [],
      involvedpt: [],
      submitImg: [],
      patientId: '',
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'click', type: 'string' }
        ],
        way: [
          { required: true, message: '请选择方式', trigger: 'click', type: 'string' }
        ],
        patientName: [
          { required: true, message: '请选择客户', trigger: 'change', type: 'string' }
        ],
        content: [
          { required: true, message: '请填写反馈内容', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'obj.involveDpt': {
      handler: function (val) {
        this.involvedpt = []
        val.forEach(dptobj => {
          const involveObj = {}
          involveObj['type'] = 1
          involveObj['dptId'] = dptobj.id
          this.involvedpt.push(involveObj)
        })
      },
      deep: true
    },
    'obj.callRecord' (val) {
      if (val) {
        this.obj.callRecordId = val.id
      } else {
        val = { id: '', name: '' }
      }
    }
  },
  created () {
    if (this.id) {
      this.initData()
    }
    this.getDptList(schema, 'involveDpt')
  },
  methods: {
    afterSave (id) {
      this.$router.push({ name: 'feedbackdetail', path: 'feedbackdetail', query: { id: id } })
    },
    prevBack () {
      window.history.go(-1)
    },
    showUserPop () {
      this.userPop = true
    },
    showCalledPop () {
      if (this.obj.patientId && this.obj.way === '833') {
        this.calledPop = true
      }
    },
    updateCalledDia (val) {
      this.calledPop = val
    },
    closeCallPop (val) {
      this.calledPop = val
    },
    showQuestionPop () {
      this.questionPop = true
    },
    showpersonPop () {
      this.personPop = true
    },
    closepersonPop () {
      this.personPop = false
    },
    closeQuestionPop () {
      this.questionPop = false
    },
    closeUserPop () {
      this.userPop = false
    },
    listFilter () {
      const unique = {}
      this.feedbackHandleList.forEach(doctorId => {
        unique[JSON.stringify(doctorId)] = doctorId
      })
      this.feedbackHandleList = Object.keys(unique).map(u => {
        return JSON.parse(u)
      })
    },
    updateUserDia (val) {
      this.userPop = val
    },
    updatePerson (val) {
      this.personPop = val
    },
    updateStaff (val) {
      this.questionPop = val
    },
    initData () {
      this.id && this.api.request({ id: this.id }).then(rs => {
        let names = []
        let handNames = []
        this.involveList = []
        this.getDptList(schema, 'involveDpt')
        rs.data.feedbackRelevantList && rs.data.feedbackRelevantList.forEach(users => {
          if (users.type === 1) {
            const involeObj = {}
            involeObj['type'] = 1
            involeObj['id'] = users.dptId
            involeObj['dptId'] = users.dptId
            this.obj.involveDpt.push(involeObj)
          } else {
            const docobj = {}
            docobj['type'] = 2
            docobj['doctorId'] = users.doctorId
            docobj['dptId'] = users.dptId
            names.push(users.dptName + '    ' + users.doctorName)
            this.involveList.push(docobj)
          }
        })
        rs.data.feedbackHandleList && rs.data.feedbackHandleList.forEach(users => {
          handNames.push(users.doctorName)
          let doctorId = {}
          doctorId['doctorId'] = users.doctorId
          this.feedbackHandleList.push(doctorId)
          this.handleList.push(doctorId)
        })

        this.obj.img = rs.data.img
        this.obj.id = this.id
        this.obj.way = rs.data.way
        this.obj.content = rs.data.content
        this.obj.patientId = rs.data.patientId
        this.obj.type = rs.data.type.toString()
        this.obj.involvePerson = names.join()
        this.obj.patientName = rs.data.patientName
        this.obj.callRecordId = rs.data.callRecord ? rs.data.callRecord : ''
        this.handlPersonList = handNames && handNames.join()
      })
    },
    setQuestionItem (users) {
      let names = []
      this.involveList = []
      users.forEach(user => {
        const personobj = {}
        let str = (user.departmentObject === undefined) ? ' ' + user.name : user.departmentObject.name + ' ' + user.name
        names.push(str)
        personobj['type'] = 2
        personobj['dptId'] = (user.departmentObject === undefined) ? '' : user.departmentObject.id
        personobj['doctorId'] = user.id
        this.involveList.push(personobj)
      })
      this.obj.involvePerson = names.join()
      this.questionPop = false
    },
    sethandlePerson (users) {
      let names = []
      this.feedbackHandleList = []
      users.forEach(user => {
        const handleobj = {}
        names.push(user.name)
        handleobj['doctorId'] = user.id
        this.feedbackHandleList.push(handleobj)
      })
      this.handlPersonList = names && names.join()
      this.personPop = false
    },
    setUserItem (users) {
      this.userPop = false
      let ids = []
      let names = []
      users.forEach(user => {
        ids.push(user.id)
        names.push(user.name)
      })
      this.obj.patientId = ids.join('')
      this.obj.patientName = names.join()
    },
    getDptList (schema, name) {
      let dpt = this.$ever.getFieldFromSchema(schema, name)
      this.depart.list().then(rs => {
        dpt.options = rs
      })
    },
    createFeed () {
      this.$refs.feedbackform.$refs.form.validate(valid => {
        // if (this.$refs.upload.process) {
        //   this.$messageTips(this, 'info', '图片还在上传中，请稍后再提交。')
        // } else {
        // if (valid) {
        //   delete this.obj.involveDpt
        //   delete this.obj.involvePerson
        //   this.listFilter()
        //   this.obj.feedbackHandleList = this.feedbackHandleList
        //   this.obj.feedbackRelevantList = this.involveList.concat(this.involvedpt)
        //   let imgList = []
        //   this.submitImg.forEach(item => {
        //     imgList.push(item.upload.name)
        //   })
        //   this.obj.img = imgList.join()
        //   this.obj.callRecordId = this.obj.callRecordId.id ? this.obj.callRecordId.id : ''
        //   this.api.create(this.obj).then(rs => {
        //     if (rs.head.errCode === 0) {
        //       this.$messageTips(this, 'success', '操作成功', '成功')
        //       this.afterSave(rs.data.id)
        //     }
        //   })
        // }
        // }
        if (valid) {
          delete this.obj.involveDpt
          delete this.obj.involvePerson
          this.listFilter()
          this.obj.feedbackHandleList = this.feedbackHandleList
          this.obj.feedbackRelevantList = this.involveList.concat(this.involvedpt)
          // let imgList = []
          // this.submitImg.forEach(item => {
          //   imgList.push(item.upload.name)
          // })
          // this.obj.img = imgList.join()
          // let imgList = []
          // this.obj.img = ''
          // this.uploadImgUrl && this.uploadImgUrl.forEach(item => {
          //   imgList.push(item.url)
          // })
          this.obj.callRecordId = this.obj.callRecordId.id ? this.obj.callRecordId.id : ''
          this.api.create(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功', '成功')
              this.afterSave(rs.data.id)
            }
          })
        }
      })
    },
    submitFeed () {
      this.$confirm('请确定内容不需要修改后再提交?', '提示', {
        confirmButtonText: '继续提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.submit(this.id).then(rs => {
          if (rs.head.errCode === 0) { }
        }).then(() => {
          this.$messageTips(this, 'success', '提交成功')
        })
      }).catch((e) => {
        this.$messageTips(this, 'info', '已取消提交')
      })
    },
    setCalledItem (val) {
      this.obj.callRecordId = val ? val[0] : { id: '', name: '' }
    },
    unique (array) {
      const arr = []
      for (let i = 0, l = array.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          if (array[i] === array[j]) j = ++i
        }
        arr.push(array[i])
      }
      return arr
    }
  },
  components: {
    staffSelect,
    personSelect,
    userSelect,
    callSelect,
  }
}
</script>
<style scoped>
#createvisit .el-input-group__append .el-button {
  background: #1c7bef;
  border-radius: 0;
  color: #fff;
}
#createvisit .el-input-group__append .is-disabled {
  background: rgb(238, 240, 246) !important;
  color: #bbb !important;
}
#createvisit .el-dialog__header .el-dialog__title {
  padding-left: 10px;
  font-size: 16px;
}
#createvisit .el-card__header strong.title {
  border-left: 3px solid #1c7bef;
  padding-left: 12px;
}
.uploadImgWar .el-dialog__body {
  margin: 0;
  background: #fff;
  padding: 15px;
}
.uploadImgWar .el-dialog__footer {
  text-align: center;
}
.uploadImgWar .uploadImgView {
  border: 1px solid #ddd;
  background: #f6f6f6;
  border-radius: 5px;
  height: 258px;
  margin-top: 15px;
  overflow: hidden;
  position: relative;
}
.uploadImgWar .uploadImgView .avatar {
  height: 258px;
  width: 366px;
  text-align: center;
}
.uploadImgWar .uploadImgView img {
  max-width: 100%;
  max-height: 100%;
}
.avatarWar .avatar {
  height: 140px;
  width: 140px;
  border-radius: 0;
  border: none;
  display: inline-block;
  margin-right: 20px;
}
.avatarWar .avatar img {
  height: 140px;
  width: 140px;
  border: 1px solid #dddddd;
}
.avatarWar .avatar img.bradius {
  border-radius: 50%;
}
.userAvatarWar {
  width: 100%;
  float: left;
}
.userAvatarWar.mr60 {
  margin-right: 60px;
}
.userAvatarWar .img-title {
  color: #666;
  font-size: 14px;
  text-align: left;
}
.userAvatarWar .avatarWar {
  margin-bottom: 10px;
}
.userAvatarWar .el-button {
  width: 60px;
}
</style>
