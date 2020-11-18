<template>
  <div id="appointlist" class="layout_inner">
    <appoint-list
      :operator="true"
      :type="2"
      :reset="reset"
      @edit="editAppoint"
      @getPatient="getPatient"
    >
      <el-button type="primary" class="ml10" size="small" @click="addAppoint">预约挂号</el-button>
      <!--<el-button type class="ml10" size="small" @click="showSendMessage">发短信</el-button>-->
    </appoint-list>
    <add-appoint :show.sync="showAddAppoint" :init="init" @success="appointSuccess"></add-appoint>
    <remarks-list :show.sync="showRemarks"></remarks-list>
    <send-message ref="sendmessage" :users="sendPatient" :disabled="true" :allparams="allparams"></send-message>
  </div>
</template>
<script>
import appointList from '@/arrange/page/register/dialog-registerlist.vue'
import remarksList from '@/arrange/page/register/dialog-remarks.vue'
import addAppoint from '@/arrange/page/register/addappoint.vue'
import sendMessage from '@/crm/page/sendmessage'

export default {
  data () {
    return {
      init: '',
      reset: '',
      showAddAppoint: false,
      showRemarks: false,
      sendPatient: [],
      allparams: {}
    }
  },
  created () {
    this.$bus.$on('form:handMessage', v => {
      this.allparams = v
      this.allparams.msgType = 108
      if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
        this.$refs.sendmessage.sendVisible = true
      }
    })
  },
  methods: {
    addAppoint () {
      this.init = ''
      this.$router.push({  // 核心语句
        path: '/kanban/registerpanel'
      })
    },
    editAppoint (val) {
      this.init = val
      this.$router.push({  // 核心语句
        path: '/kanban/registerpanel'
      })
    },
    appointSuccess (val) {
      this.showAddAppoint = false
      this.reset = new Date().getTime()
    },
    showSendMessage () {
      if (!this.sendPatient || this.sendPatient.length === 0) {
        return false
      }
      this.allparams = this.sendPatient.length === 1 ? {
        msgType: 108,
        docName: this.sendPatient[0].appointmentDoctorName, // 医生姓名
        hosName: this.sendPatient[0].organName, // 医院姓名
        clinicName: this.sendPatient[0].providerName, // 诊室名称
        appointTime: `${this.$moment(this.sendPatient[0].appointmentDate).format('MM-DD')} ${this.sendPatient[0].appointmentStarttime}`, // 预约时间
        visitTime: this.$moment(this.sendPatient[0].arrivalTime).format('MM-DD HH:mm'), // 就诊时间
        appointDate: this.$moment(this.sendPatient[0].appointmentDate).format('MM-DD'), // 预约日期
        appointStartTime: this.sendPatient[0].appointmentStarttime, // 预约开始时间
        appointEndTime: this.sendPatient[0].appointmentEndtime// 预约结束时间
      } : {msgType: 108}
      this.$refs.sendmessage.sendVisible = true
    },
    sendMessage () {
      if (!this.sendPatient || this.sendPatient.length === 0) {
        return false
      }
      this.allparams = this.sendPatient.length === 1 ? {
        msgType: 108,
        docName: this.sendPatient[0].appointmentDoctorName, // 医生姓名
        hosName: this.sendPatient[0].organName, // 医院姓名
        clinicName: this.sendPatient[0].providerName, // 诊室名称
        appointTime: `${this.$moment(this.sendPatient[0].appointmentDate).format('MM-DD')} ${this.sendPatient[0].appointmentStarttime}`, // 预约时间
        visitTime: this.$moment(this.sendPatient[0].arrivalTime).format('MM-DD HH:mm'), // 就诊时间
        appointDate: this.$moment(this.sendPatient[0].appointmentDate).format('MM-DD'), // 预约日期
        appointStartTime: this.sendPatient[0].appointmentStarttime, // 预约开始时间
        appointEndTime: this.sendPatient[0].appointmentEndtime// 预约结束时间
      } : {msgType: 10}
      this.$refs.sendmessage.sendVisible = true
    },
    getPatient (val) {
      this.sendPatient = val
    }
  },
  components: {
    appointList,
    remarksList,
    addAppoint,
    sendMessage
  }
}
</script>

