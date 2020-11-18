<template>
  <div id="createvisit">
    <ever-bread-crumb :name="'反馈详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
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
            ref="form"
            label-position="right">
            <div class="avatarWar" slot="img" slot-scope="scope">
              <span v-if="uploadImgUrl.length === 0">无</span>
              <div v-else class="avatar" v-for="(item, i) in uploadImgUrl" :key="i">
                <a :href="item | fixImgSrc(2)" target="_blank">
                  <img :src="item | fixImgSrc(2)">
                </a>
              </div>
            </div>
            <template slot="handperson" slot-scope="scope">
              <label>{{scope.obj.handperson}}</label>
            </template>
            <template slot="processResult" slot-scope="scope">
              <label>{{scope.obj.processResult}}</label>
            </template>
            <template slot="invoPerson" slot-scope="scope">
              <label>{{scope.obj.invoPerson}}</label>
            </template>
            <template slot="invoDpt" slot-scope="scope">
              <label>{{scope.obj.invoDpt}}</label>
            </template>
            <template slot="url" slot-scope="scope">
              <a v-if="scope.obj.callRecord" :href="scope.obj.callRecord.url" class="col-blue" target="_blank">{{scope.obj.callRecord.url}}</a>
            </template>
          </ever-form-model>
          <el-form :model="handData" :rules="rules" ref="handData" label-width="100px" class="demo-dynamic">
            <el-form-item
              prop="handnames"
              label="处理人员：">
              <label>{{allHandNames.join(',')}}</label>
            </el-form-item>
            <div v-if="ishandlePeople">
              <el-form-item :label="'处理结果' +1+ '：'" prop="content">
                <el-input v-if="this.prostatus === 0" v-model="handData.content"
                  type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入内容"></el-input>
                <label v-else>{{handData.content}}</label>
              </el-form-item>
              <el-form-item v-if="this.prostatus !== 0" label="提交人：">
                 <lable>{{$store.state.currentUser.name}}</lable>
              </el-form-item>
              <el-form-item v-if="this.prostatus !== 0" label="提交时间：">
                 <lable>{{handData.updateTime}}</lable>
              </el-form-item>
              <div v-for="(item, index) in handData.processResult" :key="index">
                  <div v-if="item.content">
                    <el-form-item :label="'处理结果' + (index + 2) + '：'">
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
                    <el-form-item :label="'处理结果' + (index + 2) + '：'">
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
            <div v-else v-for="(item, index) in handData.processResult" :key="index">
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
          </el-form>
          <ever-form-model
            :schema="schema2"
            v-model="obj2"
            ref="form2"
            :api="api"
            label-position="right">
            <template slot="replyName" slot-scope="scope">
              <div>
                <el-input placeholder="反馈人" v-model="scope.obj.replyName" :readonly="true" :disabled="true">
                  <el-button slot="append">选择人员</el-button>
                </el-input>
              </div>
            </template>
            <template slot="replyImg">
              <div>
                <span>无</span>
              </div>
            </template>
            <template slot="callRecordId" slot-scope="scope">
              <div>
                <el-input :placeholder="'请选择通话录音'" v-model="scope.obj.callRecordId.url" :disabled="true" :readonly="true">
                  <!-- <el-button slot="append" :disabled="true">选择通话</el-button> -->
                </el-input>
              </div>
            </template>
            <el-form-item v-if="ishandlePeople && this.prostatus !== 2">
                <div v-if="!clickedEdit && this.prostatus === 0">
                  <el-button type="primary" @click="savefeedbackhandle()">保存</el-button>
                  <el-button class="cancel-btn" @click="prevBack"><i class="iconfont icon-quxiao"></i> 取消</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" @click="submitHandle()">提交</el-button>
                  <el-button type="primary" @click="changeProstatus()">编辑</el-button>
                </div>
            </el-form-item>
          </ever-form-model>
      </el-card>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/feedbackapi'
  import depart from '../../warehouse/store/departmentapi'
  import feedhandleapi from '../store/feedbackhandleapi'
  import form from '../../util/form'

  export default {
    mixins: [form],
    data () {
      let schema = [
        {
          name: 'sn',
          type: 'label',
          span: 8,
          label: '反馈ID：'
        },
        {
          name: 'type',
          type: 'systype',
          code: 'THC_FEEDBACK_TYPE',
          disabled: true,
          useValue: true,
          span: 8,
          label: '类型：'
        },
        {
          name: 'way',
          type: 'systype',
          code: 'THC_CC_FOLLOWUP',
          disabled: true,
          span: 8,
          label: '方式：'
        },
        {
          name: 'patientName',
          type: 'label',
          span: 8,
          label: '客户姓名：'
        },
        {
          name: 'invoPerson',
          type: 'label',
          label: '涉及人员：',
          span: 8
        },
        {
          name: 'invoDpt',
          type: 'label',
          label: '涉及部门：',
          span: 8
        },
        {
          name: 'content',
          type: 'label',
          label: '反馈内容：',
          span: 20
        },
        {
          name: 'creatorName',
          type: 'label',
          label: '接待人：',
          span: 8
        },
        {
          name: 'createTime',
          type: 'label',
          label: '接待时间：',
          span: 8
        },
        {
          name: 'duration',
          type: 'label',
          label: '时长：',
          span: 8
        },
        {
          name: 'url',
          type: 'custom',
          label: '录音地址：',
          span: 20
        },
        {
          name: 'img',
          type: 'custom',
          label: '内容截图：',
          span: 24
        },
        {
          name: 'status',
          type: 'systype',
          code: 'THC_FEEDBACK_STATUS',
          label: '状态：',
          disabled: true,
          span: 6,
          useValue: true
        },
        {
          type: 'slice',
          label: '处理',
          className: 'panel-hr'
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
          name: 'callRecordId',
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
        processResult: []
      }
      let obj = this.$ever.createObjFromSchema(schema)
      let obj2 = this.$ever.createObjFromSchema(schema2)
      obj.patient = 'feed'
      obj.patientId = []
      obj2.callRecordId = ''
      return {
        schema,
        handData,
        schema2,
        api: api,
        depart: depart,
        feedhandleapi: feedhandleapi,
        id: this.$route.query.id,
        obj: obj,
        obj2: obj2,
        userPop: false,
        ishandlePeople: false,
        ids: [],
        userId: '',
        feedbackStatus: '',
        prostatus: '',
        handnames: [],
        allHandNames: [],
        uploadImgUrl: [],
        replySave: false,
        clickedEdit: false,
        rules: {
          content: [
           {required: true, message: '请填写处理结果', trigger: 'change', type: 'string'}
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
      afterSave () {
        this.$router.push({name: 'feedback', path: '/crm/feedback'})
      },
      prevBack () {
        if (this.prostatus.toString() === '0') {
          this.prostatus = 1
        } else {
          window.history.go(-1)
        }
      },
      closeUserPop () {
        this.userPop = false
      },
      initData () {
        this.id && this.api.requestById({id: this.id}).then(rs => {
          this.handData.processResult = []
          this.obj.status = rs.data.status
          this.feedbackStatus = rs.data.status
          this.obj.userId = localStorage.getItem('USERID')
          this.uploadImgUrl = rs.data.img ? rs.data.img.split(',') : []
          this.schema2 = this.schema2.map(v => {
            v.disabled = true
            return v
          })
          rs.data.feedbackHandleList && rs.data.feedbackHandleList.forEach(users => {
            if (this.obj.userId.toString() === users.doctorId.toString()) {
              if (users.status !== 0) {
                this.handData.content = users.content
                this.handData.updateTime = users.updateTime
              }
              this.handnames = []
              this.ishandlePeople = true
              this.prostatus = users.status
              this.handData.id = users.id
              this.handData.feedbackId = users.feedbackId
              this.handData.dptId = users.dptId
              this.handData.doctorId = users.doctorId
              this.handnames.push(users.dptName ? users.dptName : '' + '    ' + users.doctorName)
            } else {
              this.handData.processResult.push(users)
            }
            this.allHandNames.push(users.dptName ? users.dptName : '' + '    ' + users.doctorName)
          })
          this.allHandNames = this.unique(this.allHandNames)
          const invoPerson = []
          const invoDpt = []
          rs.data.feedbackRelevantList && rs.data.feedbackRelevantList.forEach(users => {
            if (users.type === 1) {
              invoDpt.push(users.dptName)
            } else {
              invoPerson.push(users.dptName ? users.dptName : '' + ' ' + users.doctorName)
            }
          })
          this.obj.invoPerson = invoPerson.join(',')
          this.obj.invoDpt = invoDpt.join(',')
          this.obj.handperson = this.handnames.join(',')
          this.obj = Object.assign(this.obj, rs.data)
          this.obj.duration = rs.data.callRecord ? rs.data.callRecord.duration + '  秒' : '无'
          this.obj.callRecord = rs.data.callRecord ? rs.data.callRecord : ''
          this.obj.patientId = rs.data.patientId
        })
      },
      savefeedbackhandle () {
        delete this.handData.processResult
        this.$refs.handData.validate(valid => {
          valid && this.feedhandleapi.handle(this.handData).then(rs => {
            if (rs.head.errCode === 0) {
              this.clickedEdit = true
              this.prostatus = rs.data.status
              this.handData.updateTime = rs.data.updateTime
              this.initData()
            }
          })
        })
      },
      changeProstatus () {
        this.prostatus = 0
        this.clickedEdit = false
      },
      submitHandle () {
        this.$confirm('请确定内容不需要修改后再提交?', '提示', {
          confirmButtonText: '继续提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.feedhandleapi.submit(this.handData.id).then(rs => {
            if (rs.head.errCode === 0) {
              this.prostatus = rs.data.status
              this.handData.content = rs.data.content
              this.initData()
            }
          })
        }).catch((e) => {
          this.$messageTips(this, 'info', '已取消提交')
        })
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
    }
  }
</script>
<style scoped>
  #createvisit .el-input-group__append .el-button{background: #1C7BEF;border-radius: 0;color: #fff;}
  #createvisit .el-input-group__append .is-disabled{background: rgb(238, 240, 246) !important;color: #bbb !important;}
  #createvisit .el-dialog__header .el-dialog__title{padding-left: 10px;font-size: 16px;}
  #createvisit .el-card__header strong.title{border-left: 3px solid #1C7BEF;padding-left: 12px;}
  .mempanel{margin-bottom: 20px;background-color: #fff;border: 1px solid transparent;border-radius: 4px;-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);box-shadow: 0 1px 1px rgba(0, 0, 0, .05);}
  .avatarWar .avatar{height: 140px;width: 140px;border-radius: 0;border: none;display: inline-block;margin-right: 20px;}
  .avatarWar .avatar img{height: 140px;width: 140px;border: 1px solid #DDDDDD;}
  .avatarWar .avatar img.bradius{border-radius: 50%;}
</style>
