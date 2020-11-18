<template>
  <div id="createvisit">
    <ever-bread-crumb :name="'反馈详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
          <el-row slot="header">
            <el-col :span="18">
              <strong class="title">反馈内容</strong>
            </el-col>
          </el-row>
          <ever-form2 :schema="schema" v-model="obj" :api="api" ref="form" label-position="right">
            <template slot="type">
              <sys-value type="THC_FEEDBACK_TYPE" :code="obj.type"></sys-value>
            </template>
            <template slot="way">
              <sys-value type="THC_CC_FOLLOWUP" :code="obj.way"></sys-value>
            </template>
            <div class="avatarWar" slot="img">
              <span v-if="uploadImgUrl.length === 0">无</span>
              <div class="avatar" v-for="(item, i) in uploadImgUrl" :key="i">
                <a :href="$ever.fileUrl2 + item" target="_blank">
                  <img :src="$ever.fileUrl2 + item">
                </a>
              </div>
            </div>
            <template slot="status">
              <sys-value type="THC_FEEDBACK_STATUS" :code="obj.status"></sys-value>
            </template>
            <template slot="handperson">
              <label>{{obj.handperson}}</label>
            </template>
            <template slot="processResult">
              <label>{{obj.processResult}}</label>
            </template>
            <template slot="invoPerson">
              <label>{{obj.invoPerson}}</label>
            </template>
            <template slot="invoDpt">
              <label>{{obj.invoDpt}}</label>
            </template>
            <template slot="url">
              <a
                v-if="obj.callRecord"
                :href="obj.callRecord.url"
                class="col-blue"
                target="_blank"
              >{{obj.callRecord.url}}</a>
              <a v-else>无</a>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <div class="border-b"></div>
          <h4 class="panel-hr">处理</h4>
          <el-form
            :model="handData"
            :rules="rules"
            ref="handData"
            label-width="100px"
            class="el-form--label-right"
          >
            <div class="el-row">
              <el-form-item prop="handnames" label="处理人员：">
                <label>{{allHandNames.join()}}</label>
              </el-form-item>
              <div
                v-for="(item, index) in handData.processResult"
                :key="index"
                class="el-col el-col-20"
              >
                <div v-if="item.content">
                  <el-form-item :label="'处理结果' + (index + 1) + '：'">
                    <span>{{item.content}}</span>
                  </el-form-item>
                  <el-form-item label="提交人：">
                    <span>{{item.doctorName}}</span>
                  </el-form-item>
                  <el-form-item label="提交时间：">
                    <span>{{item.updateTime}}</span>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item :label="'处理结果' + (index + 1) + '：'">
                    <span></span>
                  </el-form-item>
                  <el-form-item label="提交人：">
                    <span></span>
                  </el-form-item>
                  <el-form-item label="提交时间：">
                    <span></span>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
          <div class="border-b"></div>
          <ever-form-model
            :schema="schema2"
            v-model="obj2"
            ref="form2"
            :api="api"
            :rules="rules"
            label-position="right"
          >
            <template slot="replyName" slot-scope="scope">
              <div>
                <el-input
                  placeholder="反馈人"
                  v-model="scope.obj.replyName"
                  :readonly="true"
                  :disabled="!clickedEdit"
                ></el-input>
              </div>
            </template>
            <template slot="replyImg">
              <div class="avatarWar" v-if="feedbackStatus === '3' || feedbackStatus === '2'">
                <span v-if="replyImg.length === 0 && feedbackStatus !== '2' && !clickedEdit">无</span>
                <el-row v-else-if="!clickedEdit && replyImg.length !== 0">
                  <el-col>
                    <div class="avatar" v-for="(item, i) in replyImg" :key="i">
                      <a :href="$ever.fileUrl2 + item" target="_blank">
                        <img :src="$ever.fileUrl2 + item">
                      </a>
                    </div>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col>
                    <ever-upload1 v-model="obj.replyImg" @success="handleSuccess"></ever-upload1>
                    <!-- <upload-file
                      ref="upload"
                      @change="uploadChange"
                      listType="picture-card"
                      uploadApiType="ever"
                      isMultiple="true"
                      :list="replyImg"
                    ></upload-file> -->
                  </el-col>
                </el-row>
              </div>
              <div v-else>
                <span v-if="replyImg.length === 0">无</span>
              </div>
            </template>
            <template slot="replyCallRecordId" slot-scope="scope">
              <div @click="showCalledPop">
                <el-input
                  :placeholder="!scope.obj.patientId ? '请先选择客户' : '选择通话录音'"
                  v-model="scope.obj.replyCallRecordId.url"
                  :disabled="!scope.obj.patientId || scope.obj.way != 833 || !clickedEdit"
                  :readonly="true"
                ></el-input>
              </div>
            </template>
            <el-form-item v-if="feedbackStatus !== '1' && feedbackStatus !== '4'">
              <div v-if="clickedEdit || feedbackStatus === '2'">
                <el-button type="primary" class="submit-btn" @click="saveFeed(id)">
                  <i class="iconfont icon-baocunweimoban"></i> 保存
                </el-button>
                <el-button class="cancel-btn" @click="modifyEdit(feedbackStatus)">
                  <i class="iconfont icon-quxiao"></i> 取消
                </el-button>
              </div>
              <div v-else-if="isShowEdit">
                <el-button type="primary" class="submit-btn" @click="feedSubmit(id)">
                  <i class="iconfont icon-baocunweimoban"></i> 提交
                </el-button>
                <el-button
                  v-if="feedbackStatus === '3' || feedbackStatus === '0'"
                  type="primary"
                  class="submit-btn"
                  @click="linkAddPage(feedbackStatus)"
                >
                  <i class="iconfont icon-baocunweimoban"></i> 编辑
                </el-button>
                <el-button
                  v-if="feedbackStatus === '0'"
                  type
                  class="cancel-btn"
                  @click="feedbackDelete"
                >
                  <i class="iconfont icon-quxiao"></i> 删除
                </el-button>
              </div>
            </el-form-item>
          </ever-form-model>
          <el-dialog title="选择人员" :visible.sync="questionPop" size="small">
            <staff-select
              :feed="obj.patient"
              @close="closeQuestionPop"
              @select="setQuestionItem"
              :isradio="true"
            ></staff-select>
          </el-dialog>
          <call-select
            :visible.sync="calledPop"
            :initdata="obj2.replyCallRecordId"
            v-if="obj.patientId"
            :patient-id="obj.patientId"
            @select="setCalledItem"
            @update="updateCalledDia"
            @close="closeCallPop"
            :isradio="true"
            :disabled="!clickedEdit"
          ></call-select>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/feedbackapi'
import depart from '../../warehouse/store/departmentapi'
import staff from '../../warehouse/store/staffapi'
import feedhandleapi from '../store/feedbackhandleapi'
import form from '../../util/form'
import staffSelect from '../page/staffselect'
import callSelect from '../page/callselect.vue'

export default {
  mixins: [form],
  data () {
    let schema = [
      {
        name: 'sn',
        comp: 'readonlyitem',
        span: 8,
        label: '反馈ID：'
      },
      {
        name: 'type',
        comp: 'custom',
        span: 8,
        label: '类型：'
      },
      {
        name: 'way',
        comp: 'custom',
        span: 8,
        label: '方式：'
      },
      {
        name: 'patientName',
        comp: 'readonlyitem',
        span: 8,
        label: '客户姓名：'
      },
      {
        name: 'invoPerson',
        comp: 'readonlyitem',
        label: '涉及人员：',
        span: 8
      },
      {
        name: 'invoDpt',
        comp: 'readonlyitem',
        label: '涉及部门：',
        span: 8
      },
      {
        name: 'content',
        comp: 'readonlyitem',
        label: '反馈内容：',
        span: 20
      },
      {
        name: 'creatorName',
        comp: 'readonlyitem',
        label: '接待人：',
        span: 8
      },
      {
        name: 'createTime',
        comp: 'readonlyitem',
        label: '接待时间：',
        span: 8
      },
      {
        name: 'duration',
        comp: 'readonlyitem',
        label: '时长：',
        span: 8
      },
      {
        name: 'url',
        comp: 'custom',
        label: '录音地址：',
        span: 5
      },
      {
        name: 'img',
        comp: 'custom',
        label: '内容截图：',
        span: 24
      },
      {
        name: 'status',
        comp: 'custom',
        label: '状态：',
        span: 6
      }
    ]
    let schema2 = [
      {
        type: 'slice',
        label: '反馈给客户',
        className: 'panel-hr'
      },
      {
        name: 'replyName',
        type: 'custom',
        label: '反馈人：',
        span: 12,
        disabled: true
      },
      {
        name: 'way',
        type: 'systype',
        code: 'THC_CC_FOLLOWUP',
        disabled: true,
        span: 8,
        label: '反馈方式：',
        placeholder: '反馈方式'
      },
      {
        name: 'patientComment',
        label: '客户反应：',
        placeholder: '客户反应',
        type: 'textarea',
        rows: 3,
        max: 2000,
        span: 20,
        disabled: true
      },
      {
        name: 'replyImg',
        label: '内容截图：',
        type: 'custom',
        disabled: true
      },
      {
        name: 'replyCallRecordId',
        type: 'custom',
        span: 20,
        label: '通话记录：'
      },
      {
        type: 'slice',
        label: '反馈总结',
        className: 'panel-hr'
      },
      {
        name: 'summary',
        label: '总结：',
        placeholder: '总结',
        type: 'textarea',
        rows: 3,
        max: 2000,
        span: 20,
        disabled: true
      }
    ]
    let handData = {
      content: '',
      processResult: [],
      rules: {
        content: [
          { required: true, message: '请填写处理结果', trigger: 'change', type: 'string' }
        ]
      }
    }
    let obj = this.$ever.createObjFromSchema(schema)
    let obj2 = this.$ever.createObjFromSchema(schema2)
    obj.patient = 'feed'
    obj.patientId = []
    obj2.replyCallRecordId = ''
    return {
      schema,
      handData,
      schema2,
      api: api,
      depart: depart,
      staff: staff,
      feedhandleapi: feedhandleapi,
      id: this.$route.query.id,
      obj: obj,
      obj2: obj2,
      userPop: false,
      questionPop: false,
      calledPop: false,
      ishandlePeople: false,
      ids: [],
      userId: '',
      feedbackStatus: '',
      prostatus: '',
      handnames: [],
      allHandNames: [],
      uploadImgUrl: [],
      submitImg: [],
      replySave: false,
      clickedEdit: false,
      isShowEdit: false,
      replyImg: [],
      rules: {
        replyName: [
          { required: true, message: '请选择反馈人', trigger: 'click', type: 'string' }
        ],
        way: [
          { required: true, message: '请反馈方式', trigger: 'click', type: 'string' }
        ],
        patientComment: [
          { required: true, message: '请填写客户反响', trigger: 'change', type: 'string' }
        ],
        content: [
          { required: true, message: '请填写处理结果', trigger: 'change', type: 'string' }
        ]
      }
    }
  },
  watch: {
    'feedbackStatus': {
      handler: function (val) {
        if (this.feedbackStatus === '1' || this.feedbackStatus === '0') {
          this.schema2 = this.schema2.map(v => {
            v.disabled = true
            return v
          })
        } else if (this.feedbackStatus === '3' && this.replySave) {
          this.schema2 = this.schema2.map(v => {
            v.disabled = false
            return v
          })
        }
      },
      deep: true
    },
    'obj2.involveDpt': {
      handler: function (val) {
        this.obj2.replyDptId = val.id
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    handleSuccess () {
    },
    afterSave () {
      this.$router.push({ name: 'feedback', path: '/crm/feedback' })
    },
    prevBack () {
      if (this.prostatus.toString() === '0') {
        this.prostatus = 1
      } else {
        window.history.go(-1)
      }
    },
    showQuestionPop () {
      if (this.feedbackStatus !== '1' && this.clickedEdit) {
        this.questionPop = true
      }
    },
    showCalledPop () {
      if (this.obj.patientId && this.obj2.way === '833' && this.clickedEdit) {
        this.calledPop = true
      }
    },
    updateCalledDia (val) {
      this.calledPop = val
    },
    closeCallPop (val) {
      this.calledPop = val
    },
    closeQuestionPop () {
      this.questionPop = false
    },
    closeUserPop () {
      this.userPop = false
    },
    initData () {
      this.id && this.api.requestById({ id: this.id }).then(rs => {
        this.handData.processResult = []
        this.obj.status = rs.data.status
        this.feedbackStatus = rs.data.status
        this.obj.userId = localStorage.getItem('USERID')
        this.uploadImgUrl = rs.data.img ? rs.data.img.split('#') : []
        if (rs.data.creator.toString() === this.$store.state.currentUser.userId) {
          this.isShowEdit = true
        }
        if (rs.data.status === '2') {
          this.obj2.id = rs.data.id
          this.obj2.type = rs.data.type
          this.obj2.way = rs.data.way
          this.obj2.patientId = rs.data.patientId
          this.obj2.content = rs.data.content
          this.clickedEdit = true
          this.setReplyName()
          this.schema2 = this.schema2.map(v => {
            v.disabled = false
            return v
          })
        } else if (rs.data.status === '3') {
          this.obj2.id = rs.data.id
          this.obj2.type = rs.data.type
          this.obj2.way = rs.data.way
          this.obj2.patientId = rs.data.patientId
          this.obj2.content = rs.data.content
          this.obj2.replyName = rs.data.replyDoctorName
          this.obj2.patientComment = rs.data.patientComment
          this.obj2.summary = rs.data.summary
          this.obj2.replyDptId = rs.data.replyDptId
          this.obj2.replyDoctorId = rs.data.replyDoctorId
          this.schema2 = this.schema2.map(v => {
            v.disabled = true
            return v
          })
          this.replyImg = rs.data.replyImg ? rs.data.replyImg.split('#') : []
          // let uploadlist = []
          // uploadlist = rs.data.replyImg && rs.data.replyImg.split('#')
          // rs.data.replyImg && uploadlist.forEach(user => {
          //   let fileObj = { name: user, url: `${this.$ever.imgurl}${user}` }
          //   this.replyImg.push(fileObj)
          // })
          if (rs.data.replyDoctorId && (rs.data.replyDoctorId.toString() === this.$store.state.currentUser.userId)) {
            this.isShowEdit = true
          } else {
            this.isShowEdit = false
          }
        } else if (rs.data.status === '4') {
          if (this.replyImg) this.replyImg = rs.data.replyImg.split('#')
        }
        rs.data.feedbackHandleList && rs.data.feedbackHandleList.forEach(users => {
          if (this.obj.userId.toString() === users.doctorId.toString()) {
            this.ishandlePeople = true
          }
          this.handData.processResult.push(users)
          this.allHandNames.push(users.dptName + '    ' + users.doctorName ? users.doctorName : '')
        })
        this.allHandNames = this.unique(this.allHandNames)
        let invoPerson = []
        let invoDpt = []
        rs.data.feedbackRelevantList && rs.data.feedbackRelevantList.forEach(users => {
          if (users.type === 1) {
            invoDpt.push(users.dptName)
          } else {
            invoPerson.push(users.dptName + ' ' + users.doctorName ? users.doctorName : '')
          }
        })
        this.obj.invoPerson = invoPerson.join()
        this.obj.invoDpt = invoDpt.join()
        this.obj.handperson = this.handnames.join()
        this.obj = Object.assign(this.obj, rs.data)
        this.obj.duration = rs.data.callRecord ? rs.data.callRecord.duration + '  秒' : '无'
        this.obj.callRecord = rs.data.callRecord ? rs.data.callRecord : ''
        this.obj.patientId = rs.data.patientId
        this.obj2.replyCallRecordId = rs.data.replyCallRecord ? rs.data.replyCallRecord : ''
      })
    },
    linkAddPage (status) {
      if (status === '3') {
        this.clickedEdit = true
        this.schema2 = this.schema2.map(v => {
          v.disabled = false
          return v
        })
      } else {
        this.$router.push({ name: 'createfeedback', path: 'createfeedback', query: { id: this.id } })
      }
    },
    modifyEdit (status) {
      if (status === '3') {
        this.clickedEdit = false
        this.schema2 = this.schema2.map(v => {
          v.disabled = true
          return v
        })
      } else {
        window.history.go(-1)
      }
    },
    setQuestionItem (users) {
      let names = []
      users.forEach(user => {
        let str = (user.departmentObject === undefined) ? ' ' + user.name : user.departmentObject.name + ' ' + user.name
        names.push(str)
        this.obj2.replyDptId = user.departmentId
        this.obj2.replyDoctorId = user.id
      })
      this.obj2.replyName = names.join()
      this.questionPop = false
    },
    setUserItem (users) {
      this.userPop = false
      let names = []
      users.forEach(user => {
        this.ids = user.id
        names.push(user.name)
      })
      this.obj.patientId = names.join()
    },
    setCalledItem (val) {
      this.obj2.replyCallRecordId = val ? val[0] : { id: '', name: '' }
    },
    setReplyName () {
      this.staff.list({ id: this.$store.state.currentUser.userId }).then(rs => {
        this.obj2.replyName = rs[0].name // 部门名称 + 负责人名称
        this.obj2.replyDptId = rs[0].id // 部门id
        // this.obj2.replyDoctorId = rs.list[0].id // 部门负责人id
      })
    },
    feedSubmit () {
      this.$confirm('请确定内容不需要修改后再提交?', '提示', {
        confirmButtonText: '继续提交',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.feedbackStatus === '3') {
          this.api.replySubmit(this.id).then(rs => {
            if (rs.head.errCode === 0) this.$router.push({ name: 'feedcompete', path: 'feedcompete', query: { id: this.id } })
          })
        } else {
          this.api.submit(this.id).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'warning', '没有结算单数据')
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              })
              if (this.ishandlePeople) {
                this.$router.push({ name: 'feedbackhandle', path: 'feedbackhandle', query: { id: this.id } })
              } else {
                this.initData()
              }
            }
          })
        }
      }).catch((e) => {
        return false // bugfix 11110
      })
    },
    saveFeed () {
      this.$refs.form2.$refs.form.validate(valid => {
        let imgList = []
        this.submitImg.forEach(item => {
          imgList.push(item.upload.name)
        })
        this.obj2.replyImg = imgList.join()
        this.obj2.img = this.uploadImgUrl.join()
        this.obj2.replyWay = this.obj2.way
        this.obj2.replyCallRecordId = this.obj2.replyCallRecordId.id ? this.obj2.replyCallRecordId.id : ''
        if (this.$refs.upload.process) {
          this.$messageTips(this, 'info', '图片还在上传中，请稍后再提交。')
        } else {
          delete this.obj2.involveDpt
          !this.$refs.upload.process && valid && this.feedhandleapi.reply(this.obj2).then(rs => {
            if (rs.head.errCode === 0) {
              this.feedbackStatus = rs.data.status
              this.clickedEdit = false
              this.initData()
            }
          })
        }
      })
    },
    feedbackDelete () {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.del({ id: this.id }).then(rs => {
          this.afterSave()
        })
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功')
      }).catch((e) => {
        return false // bugfix 11110
      })
    },
    uploadChange (fileList) {
      this.submitImg = []
      this.submitImg = fileList
    },
    unique (array) {
      let arr = []
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
    callSelect
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
.border-b {
  border-bottom: 1px solid #d1dbe5;
  margin-bottom: 20px;
}
</style>
