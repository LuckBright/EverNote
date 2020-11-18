<template>
  <div id="createvisit">
    <ever-bread-crumb :name="'反馈详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
        <el-row slot="header">
          <el-col :span="18"><strong class="title">反馈内容</strong></el-col>
        </el-row>
          <ever-form2
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="right">
            <template slot="type">
              <sys-value type="THC_FEEDBACK_TYPE" :code="obj.type"></sys-value>
            </template>
            <template slot="way">
              <sys-value type="THC_CC_FOLLOWUP" :code="obj.way"></sys-value>
            </template>
            <template slot="img">
              <div class="avatarWar">
                <span v-if="uploadImgUrl.length == 0">无</span>
                <div v-else class="avatar" v-for="(item, i) in uploadImgUrl" :key="i">
                  <a :href="$ever.fileUrl2 + item" target="_blank">
                    <img :src="$ever.fileUrl2 + item">
                  </a>
                </div>
              </div>
            </template>
            <template slot="handperson" slot-scope="scope">
              <label>{{scope.obj.handperson}}</label>
            </template>
            <template slot="invoPerson">
              <label>{{obj.invoPerson}}</label>
            </template>
            <template slot="invoDpt">
              <label>{{obj.invoDpt}}</label>
            </template>
            <template slot="status">
              <sys-value type="THC_FEEDBACK_STATUS" :code="obj.status"></sys-value>
            </template>
            <template slot="url">
              <a v-if="obj.callRecord" :href="obj.callRecord.url" class="col-blue" target="_blank">{{obj.callRecord.url}}</a>
              <a v-else>无</a>
            </template>
            <div slot="default"></div>
          </ever-form2>
          <div class="border-b"></div>
          <h4 class="panel-hr">处理</h4>
          <el-form :model="handData" ref="handData" label-width="100px" class="el-form--label-right">
            <div class="el-row">
              <el-form-item
                prop="handnames"
                label="处理人员：">
                <label>{{handData.handnames}}</label>
              </el-form-item>
              <div v-for="(item, i) in handData.processResult" :key="i" class="el-col el-col-20">
                <el-form-item label="处理内容：">
                  <span>{{item.content}}</span>
                </el-form-item>
                <el-form-item label="处理人：">
                  <span>{{item.doctorName}}</span>
                </el-form-item>
                <el-form-item label="处理时间：">
                  <span>{{item.updateTime}}</span>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="border-b"></div>
          <h4 class="panel-hr">反馈给客户</h4>
          <ever-form2
            :schema="schema2"
            v-model="obj2"
            :api="api"
            label-position="right">
            <template slot="replyWay">
              <sys-value type="THC_CC_FOLLOWUP" :code="obj.replyWay"></sys-value>
            </template>
            <template slot="replyUrl">
              <a v-if="this.obj.replyCallRecordId" :href="this.obj.replyCallRecord.url" class="col-blue" target="_blank">{{this.obj.replyCallRecord.url}}</a>
              <a v-else>无</a>
            </template>
            <template slot="replyImg">
              <div class="avatarWar">
                <span v-if="replyImg.length == 0">无</span>
                <div v-else class="avatar" v-for="(item, i) in replyImg" :key="i">
                  <a :href="$ever.fileUrl2 + item" target="_blank">
                    <img :src="$ever.fileUrl2 + item">
                  </a>
                </div>
              </div>
            </template>
            <div slot="default"></div>
          </ever-form2>
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
let schema = [
  {
    name: 'sn',
    comp: 'readonlyitem',
    span: 6,
    label: '反馈ID：'
  },
  {
    name: 'type',
    comp: 'custom',
    span: 6,
    label: '类型：'
  },
  {
    name: 'way',
    comp: 'custom',
    span: 6,
    label: '方式：'
  },
  {
    comp: 'div',
    label: '',
    style: {
      height: '36px'
    },
    span: 6
  },
  {
    name: 'patientName',
    comp: 'readonlyitem',
    span: 6,
    label: '客户姓名：'
  },
  {
    name: 'invoPerson',
    comp: 'readonlyitem',
    label: '涉及人员：',
    span: 6
  },
  {
    name: 'invoDpt',
    comp: 'readonlyitem',
    label: '涉及部门：',
    span: 6
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
    span: 6
  },
  {
    name: 'createTime',
    comp: 'readonlyitem',
    label: '接待时间：',
    span: 6
  },
  {
    name: 'duration',
    comp: 'readonlyitem',
    label: '时长：',
    span: 6
  },
  {
    name: 'url',
    comp: 'custom',
    label: '录音地址：',
    span: 20
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
    name: 'replyName',
    comp: 'readonlyitem',
    label: '反馈人：',
    span: 8
  },
  {
    name: 'replyWay',
    comp: 'custom',
    span: 8,
    label: '反馈方式：'
  },
  {
    comp: 'div',
    label: '',
    style: {
      height: '36px'
    },
    span: 8
  },
  {
    name: 'patientComment',
    label: '客户反应：',
    comp: 'readonlyitem',
    span: 20
  },
  {
    name: 'replyTime',
    comp: 'readonlyitem',
    label: '反馈时间：',
    span: 8
  },
  {
    name: 'duration',
    comp: 'readonlyitem',
    label: '时长：',
    span: 8
  },
  {
    name: 'replyUrl',
    comp: 'custom',
    label: '录音地址：',
    span: 20
  },
  {
    name: 'replyImg',
    label: '内容截图：',
    comp: 'custom',
    span: 24,
    disabled: true
  },
  {
    name: 'summary',
    label: '总结：',
    comp: 'readonlyitem',
    span: 20
  }
]
let handData = {
  handnames: '',
  content: '',
  processResult: []
}
export default {
  mixins: [form],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    let obj2 = this.$ever.createObjFromSchema(schema2)
    obj.patient = 'feed'
    obj.patientId = []
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
      ids: [],
      userId: '',
      prostatus: '',
      ishandlePeople: false,
      handnames: [],
      uploadImgUrl: [],
      replyImg: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.id && this.api.requestById({ id: this.id }).then(rs => {
        this.uploadImgUrl = rs.data.img && rs.data.img.split('#')
        if (rs.data.replyImg) this.replyImg = rs.data.replyImg.split('#')
        this.obj.status = this.obj.status.toString()
        this.obj.userId = localStorage.getItem('USERID')
        this.obj2.summary = rs.data.summary
        this.handData.processResult = []
        rs.data.feedbackHandleList && rs.data.feedbackHandleList.forEach(users => {
          const handObj = {}
          handObj['content'] = users.content
          handObj['doctorName'] = users.doctorName
          handObj['updateTime'] = users.updateTime
          this.handData.processResult.push(handObj)
          this.handnames.push(users.dptName + '    ' + users.doctorName)
        })
        this.handData.handnames = this.handnames.join(',')
        const invoPerson = []
        const invoDpt = []
        rs.data.feedbackRelevantList && rs.data.feedbackRelevantList.forEach(users => {
          if (users.type === 1) {
            invoDpt.push(users.dptName)
          } else {
            invoPerson.push(users.dptName && users.dptName + ' ' + users.doctorName)
          }
        })
        this.obj.invoPerson = invoPerson.join(',')
        this.obj.invoDpt = invoDpt.join(',')
        this.obj.handperson = this.handnames.join(',')
        this.obj.duration = rs.data.callRecord ? rs.data.callRecord.duration + '  秒' : '无'
        this.obj.callRecord = this.obj.callRecord = rs.data.callRecord ? rs.data.callRecord : ''
        this.handData.handnames = this.unique(this.handnames).join(',')
        this.obj = Object.assign(this.obj, rs.data)
        this.obj2.replyWay = rs.data.replyWay
        this.obj2.patientComment = rs.data.patientComment
        this.obj2.replyName = rs.data.replyDoctorName
        this.obj2.replyCallRecordId = rs.data.replyCallRecordId ? rs.data.replyCallRecordId : ''
        this.obj2.duration = rs.data.replyCallRecord ? rs.data.replyCallRecord.duration + '  秒' : '无'
        this.obj2.replyTime = rs.data.replyTime
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
