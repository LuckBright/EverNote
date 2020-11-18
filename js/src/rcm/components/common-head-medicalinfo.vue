<template>
  <div class="medicalinfo">
    <div class="box">
      医保机构：
      <span>{{obj.insuranceOrgName || '--'}}</span>
    </div>
    <div class="box">
      医保人员类别：
      <span>{{personType}}</span>
    </div>
    <div class="box">
      医保费用总额：
      <span class="cRed">{{(obj.totalFee) | formatToFinacial}}</span>
    </div>
    <div class="box">
      自费金额：
      <span class="cRed">{{(obj.selfpayText) | formatToFinacial}}</span>
    </div>
    <div class="box">
      统筹金额：
      <span class="cRed">{{(obj.overallPayText) | formatToFinacial}}</span>
    </div>
    <div class="box">
      账户支付金额：
      <span class="cRed">{{(obj.personcountpay) | formatToFinacial}}</span>
    </div>
    <div class="box">
      <el-button type="primary" size="small" @click="handlePreSettle">预结算</el-button>
    </div>
  </div>
</template>

<script>
import { settleList, preSettle } from '@/rcm/store/otmdiscomponent/hospital-medical.js'
import { getMedicalRegisterInfo } from '@/rcm/store/hospital/hospital.js'
import { personType as jlccPersonType } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { personType as jlsbPersonType } from '@/rcm/otmdiscomponent/config-js/jlssb-regInfo-config.js'
import { jlccybCode, jlssbCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  props: ['hospitalizedNumber'],
  data () {
    return {
      obj: {
        doctorType: 0,
        insuranceOrgId: '',
        insuranceOrgName: '',
        totalFee: 0,
        selfpayText: 0,
        overallPayText: 0,
        personcountpay: 0
      },
      personTypeMap: {},
    }
  },
  methods: {
    getData () {
      let params = { visitNumber: this.hospitalizedNumber }
      settleList(params).then(res => {
        let result = res.data && res.data[0]
        this.obj.totalFee = result && result.totalFee
        this.obj.selfpayText = result && result.selfpayText
        this.obj.overallPayText = result && result.overallPayText
        this.obj.personcountpay = result && result.personcountpay
      }, err => { console.log(err) })
    },
    getMedicalRegisterInfo () {
      let params = { visitNumber: this.hospitalizedNumber }
      getMedicalRegisterInfo(params).then(res => {
        let result = res.data && res.data[0]
        this.obj.doctorType = result && result.doctorType
        this.obj.insuranceOrgId = result && result.insuranceOrgId
        this.obj.insuranceOrgName = result && result.insuranceOrgName
      })
    },
    handlePreSettle () {
      let params = {
        ipNo: this.hospitalizedNumber,
        macId: this.macId
      }
      preSettle(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        // 重新获取预结算信息
        this.getData()
        this.$emit('refresh')
      }, err => {
        console.log(err)
      })
    }
  },
  computed: {
    personType () {
      let insuranceOrg = this.personTypeMap[this.obj.insuranceOrgId]
      return insuranceOrg && insuranceOrg[this.obj.doctorType] || '--'
    }
  },
  created () {
    this.personTypeMap[jlccybCode] = jlccPersonType
    this.personTypeMap[jlssbCode] = jlsbPersonType
  },
  mounted () {
    this.getData()
    this.getMedicalRegisterInfo()
  }
}
</script>

<style scoped>
.box {
  float: left;
  margin-right: 20px;
  height: 28px;
}
.box .boxContent {
  color: #000;
}
</style>
