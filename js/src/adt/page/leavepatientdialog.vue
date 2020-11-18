<template>
  <div class="dialog">
    <ever-bread-crumb name="返回" path="/adt/leaveHospita"></ever-bread-crumb>
    <common-head
      class="layout_wrap_01"
      ref="commonHead"
      :patientId="value.patientId"
      :visitNumber="value.ipNo"
      :code="'010'"
    ></common-head>
    <div class="tabs">
      <leave-details></leave-details>
    </div>
  </div>
</template>
<script>
import leaveDetails from '@/adt/page/leavedetails' // 出院管理患者详情
import commonHead from '@/inpatient/components/common.head.js'
import { getPatientInfo } from '@/rcm/store/hospital/hospital'
export default {
  data () {
    return {
      value: {},
      key: 0,
      visitNumber: '',
      // 0是医保，1商保，2是自费
      checkList: [
        { name: '全自费', value: 2 },
        { name: '本地医保', value: 0 }
      ],
      billPrintObj: {},
      billCode: 'rcm_hospital_bill', // 住院票据code
    }
  },
  created () {
    this.value = this.$route.query
    this.list()
  },
  methods: {
    async list () {
      this.cardloading = true
      let params = {
        ipNo: this.$route.query.ipNo, // 病案号
        patientId: this.$route.query.patientId, // 患者id
        recalled: 0, // 非召回
        containsOutHospitalSettle: true // 押金列表中包含出院计算
      }
      try {
        let data = await getPatientInfo(params)
        if (data && Object.getOwnPropertyNames(data.data).length > 0) {
          if (!data.data.settlementId) { // 如果还没结算，刷新的时候，就不要覆盖保险类型
            delete this.value.settlementId
          }
          data.data.billSumFeeNoSettle = data.billSumFeeNoSettle
          this.$store.commit('setGdcfInsuranceInfo', { insuranceOrgId: data.data.insuranceOrgId })
          this.value.insuranceType = Number(this.value.insuranceType) || 2 // 给默认值
          this.value = Object.assign({}, this.value, data.data)
          let chargedetail = {
            patientId: this.value.patientId,
            ipNo: this.value.ipNo,
            settlementId: this.value.settlementId,
            ipStatus: this.value.ipStatus, // 在院状态
            ipSettleStatus: this.value.ipSettleStatus // 住院结算状态
          }
          this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, ...chargedetail }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    closeDialog () {
      this.$emit('close')
    },
  },
  components: {
    leaveDetails,
    commonHead
  },
}
</script>
<style scoped>
.dialog .tabs {
  background: #fff;
  padding: 10px;
  height: 100%;
  overflow: hidden;
}
.dialog .tabs .el-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dialog .tabs .el-tabs /deep/ .el-tabs__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.dialog .tabs .el-tabs /deep/ .el-tabs__content .el-tab-pane {
  flex: 1;
  overflow-y: auto;
}
.box {
  float: left;
  margin-right: 20px;
  height: 28px;
}
.grey {
  background-color: #ccc;
}
.white {
  background-color: white;
}
</style>
