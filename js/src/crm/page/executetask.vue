<template>
  <div>
    <ever-bread-crumb
      :name="task.status === 0 ? '执行' : '详情'"
      show-edit-fnt="false"
      :have-return="true"
    ></ever-bread-crumb>
    <el-card>
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
      <el-row style="margin: 20px">
        <el-col :span="6">
          <div class="grid-content bg-purple" v-if="formType === 2">
            表单:
            {{formName}}
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">随访方式:
            <sys-value type="THC_CC_FOLLOWUP" :code="task.visitWay"></sys-value>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            时间设置:
            {{task.visitTime == null ? '--' : $moment(task.visitTime).format('YYYY-MM-DD')}}
          </div>
        </el-col>
        <el-col align="right">
          任务状态:
          <span>{{statusText(task.status)}}</span>
          <el-button type="primary" @click="getSubtaskDetails">随访计划详情</el-button>
        </el-col>
      </el-row>
      <el-row style="margin: 20px" v-if="formType === 2">
        <task-form v-if="url" v-model="obj" :schema-id="url" :id="formDataId" :nosubmit="true"></task-form>
        <el-col align="center">
          <el-button plain @click="draftTask" v-if="task.status === 0">保存草稿</el-button>
          <el-button type="primary" plain @click="execTask" v-if="task.status === 0">确定</el-button>
        </el-col>
      </el-row>
      <el-row style="margin: 20px" v-if="formType === 1">
        <a :href="url" target="_blank">点击查看图文详情</a>
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
      patientId: '',
      queryObj: {
        name: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      formType: 1, // 图文 1 表单 2
      url: '',
      dateRange: [],
      queryStatus: [
        {
          value: 0,
          label: '待执行'
        },
        {
          value: 2,
          label: '已完成'
        },
        {
          value: 3,
          label: '已终止'
        },
        {
          value: 5,
          label: '已过期'
        },
        {
          value: 6,
          label: '已取消'
        }
      ],
      tableData: [],
      followupId: '',
      dialogVisible: false,
      selectedItem: [],
      task: {
        type: ''
      },
      formName: '',
      schema: [],
      obj: {},
      formDataId: `-1`,
      visitSn: '',
      visitDptId: ''
    }
  },
  created () {
    const taskObj = JSON.parse(sessionStorage.getItem('executeTask'))
    this.visitDptId = taskObj.visitDptId
    this.visitSn = taskObj.visitSn
    this.patientSource = taskObj.patientSource
    this.patientId = taskObj.patientId
    this.taskId = taskObj.id
    this.getTask(this.taskId)
  },
  methods: {
    patientInfo () {
      window.open(
        this.$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' +
          this.patientId
      )
    },
    getTask (id) {
      api
        .getTask({ id: id })
        .then(result => {
          if (result.head.errCode === 0) {
            this.patientSource = result.data.patientSource
            this.task = result.data
            this.formType = this.task.task.type
            this.formName = this.task.task.name
            this.url = this.task.task ? this.task.task.url : ''
            this.formDataId =
              this.task.formDataId == null ? `-1` : this.task.formDataId
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSubtaskDetails () {
      this.$router.push({
        name: 'subtaskdetails',
        path: `subtaskdetails`,
        params: { taskId: this.task.id, patientId: this.task.patientId }
      })
    },
    execTask () {
      const obj = {}
      obj.data = this.obj
      obj.formTemplateId = this.url
      api.execTask({ id: this.task.id, formData: obj }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '执行成功', '提示')
          this.getTask(this.taskId)
        }
      })
    },
    draftTask () {
      const obj = {}
      obj.data = this.obj
      obj.formTemplateId = this.url
      api.draftTask({ id: this.task.id, formData: obj }).then(res => {
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
