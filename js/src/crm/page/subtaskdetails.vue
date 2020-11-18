<template>
  <div>
    <ever-bread-crumb :name="`详情`" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card style="height: 100%">
      <el-row>
        <patient-header
          v-if="patientSource === 1"
          :code="`THC_PATIENT_HEAD_004`"
          :patient-id="patientId"
          :dpt-id="visitDptId"
          :hospitalized-number="visitSn"
        >
          <template slot="button">
            <el-button type="primary" @click="patientInfo">详情</el-button>
          </template>
        </patient-header>
        <patient-header
          v-if="patientSource === 2"
          :code="`THC_PATIENT_HEAD_001`"
          :patient-id="patientId"
          :dpt-id="visitDptId"
          :visit-number="visitSn"
        >
          <template slot="button">
            <el-button type="primary" @click="patientInfo">详情</el-button>
          </template>
        </patient-header>
      </el-row>
      <el-row v-if="dateList.length !== 0">
        <el-tabs :tab-position="tabPosition" style="height:100%;" @tab-click="dateTabClick">
          <el-tab-pane :label="item" :value="item" v-for="(item, index) in dateList" :key="index">
            <el-collapse>
              <el-collapse-item v-for="(sub,index) in subList" :key="index">
                <template slot="title">
                  <el-col :span="6">
                    <div class="grid-content bg-purple" v-if="sub.material.type === 2">
                      表单:
                      {{sub.material.name}}
                    </div>
                    <div class="grid-content bg-purple" v-else>
                      图文:
                      {{sub.material.name}}
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="grid-content bg-purple">随访方式:
                      <sys-value type="THC_CC_FOLLOWUP" :code="sub.visitWay"></sys-value>
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content bg-purple">
                      时间设置:
                      {{sub.visitTime == null ? '--' : $moment(sub.visitTime).format('YYYY-MM-DD')}}
                    </div>
                  </el-col>
                  <el-col :span="4" align="right">
                    任务状态:
                    <span>{{statusText(sub.status)}}</span>
                  </el-col>
                </template>
                <task-form
                  v-if="sub.material.type === 2"
                  v-model="sub.obj"
                  :schema-id="sub.material.url"
                  :id="sub.formDataId == null ? '-1' : sub.formDataId"
                  :nosubmit="true"
                ></task-form>
                <el-col align="center" :span="24" v-if="false" style="margin: 20px">
                  <el-button plain @click="draftTask(sub)" v-if="sub.status === 0">保存草稿</el-button>
                  <el-button type="primary" plain @click="execTask(sub)" v-if="sub.status === 0">确定</el-button>
                </el-col>
                <a v-if="sub.material.type === 1" :href="sub.material.url" target="_blank">点击查看图文详情</a>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import patientHeader from '@/inpatient/components/common.head.js'
import api from '@/crm/store/healthy/followapi'
import taskForm from '@/form/components/remoteform'
import taskvaluekey from '@/crm/page/healthy/taskvaluekey'
export default {
  mixins: [taskvaluekey],
  name: 'executetask',
  data () {
    return {
      tabPosition: 'left',
      code: 'THC_PATIENT_HEAD_008',
      patientId: '',
      dateList: [],
      subList: [],
      formType: 1,
      formName: '',
      url: '',
      visitSn: '',
      visitDptId: ''
    }
  },
  created () {
    const taskObj = JSON.parse(sessionStorage.getItem('executeTask'))
    this.patientSource = taskObj.patientSource
    this.visitDptId = taskObj.visitDptId
    this.visitSn = taskObj.visitSn
    this.taskId = this.$route.params.taskId
    this.patientId = this.$route.params.patientId
    this.getTask(this.taskId)
  },
  methods: {
    patientInfo () {
      window.open(
        this.$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' +
          this.patientId
      )
    },
    dateTabClick (dateVM) {
      if (this.currentDate === dateVM.$attrs.value) {
        return
      } else {
        this.currentDate = dateVM.$attrs.value
        this.getSubtaskByDate(this.task.followUpId, this.currentDate)
      }
    },
    getTask (id) {
      api
        .getTask({ id: id })
        .then(result => {
          if (result.head.errCode === 0) {
            this.task = result.data
            this.getDateByFollowUpId(this.task.followUpId)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDateByFollowUpId (id) {
      api.getDateByFollowUpId({ followUpId: id }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data == null) {
            this.dateList = []
          } else {
            this.dateList = res.data
            this.getSubtaskByDate(id, this.dateList[0])
          }
        }
      })
    },
    getSubtaskByDate (id, date) {
      api.getSubtaskByDate({ followUpId: id, date: date }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data == null) {
            this.subList = []
          } else {
            res.data.forEach(element => {
              element.obj = {}
            })
            this.subList = res.data
          }
        }
      })
    },
    execTask (item) {
      const obj = {}
      obj.data = item.obj
      obj.formTemplateId = item.material.url
      api.execTask({ id: item.id, formData: obj }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '执行成功', '提示')
          item.status = 2
        }
      })
    },
    draftTask (item) {
      const obj = {}
      obj.data = item.obj
      obj.formTemplateId = item.material.url
      api.draftTask({ id: item.id, formData: obj }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存草稿成功', '提示')
        }
      })
    }
  },
  components: {
    patientHeader,
    taskForm
  }
}
</script>

