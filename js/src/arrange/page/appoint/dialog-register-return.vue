<template>
  <el-dialog
  title=""
  id="dialogReturn"
  :visible.sync="showDialog"
  :show-close="false"
  v-if="value"
  :close-on-click-modal="false"
  width="395px">
    <h3 class="title">确认退号</h3>
    <el-form :model="value" label-width="100px" label-position="right" ref="cancel">
      <el-form-item label="患者姓名：">{{value.patient.name}} {{value.patient.outpatientNumber}}</el-form-item>
      <el-form-item label="挂号方式：">{{value.apptTypeDesc}}</el-form-item>
      <el-form-item label="挂号科室：">{{value.deptName}}</el-form-item>
      <el-form-item label="医生：">{{value.resourceName}}</el-form-item>
      <el-form-item label="号源类型：">{{value.serviceName}}</el-form-item>
      <el-form-item label="就诊时间：">{{value.dateStr}} {{value.startTimeStr}}</el-form-item>
      <el-form-item label="是否到院：">
        <span class="color" v-if="value.arrivalTime" style="color: #61a812">已到院</span>
        <span class="color" v-else style="color: #EE4433">未到院</span>
      </el-form-item>
      <el-form-item label="就诊卡：" v-if="value.serviceOrder">{{value.jiuZhenCard ? '有': '无'}}</el-form-item>
      <el-form-item label="病历本：" v-if="value.serviceOrder">{{value.medicalRecordBook ? '有': '无'}}</el-form-item>
      <!--
      <el-form-item label="需退费金额：" v-if="value.serviceOrder && value.serviceOrder.isPaid && settlementInfo"><strong class="color" style="color: #EE4433;">￥{{getServiceItemPrice(settlementInfo.mergedSettleDetail)}}</strong></el-form-item>
      -->
      <el-form-item label="">
        <el-button size="small" type="primary" @click="submitCannel">确定</el-button>
        <el-button size="small" type="" @click="showDialog=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/appointmentapi'
import { getMacAddress } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import storage from '@/util/storage'
export default {
  props: ['value', 'show'],
  data () {
    return {
      api,
      storage,
      showDialog: false,
      isSubmit: false,
      appointmentInfo: '',
      settlementInfo: ''
    }
  },
  watch: {
    'show' (val) {
      this.showDialog = val
      if (val && this.value.serviceOrder && this.value.serviceOrder.isPaid) {
        this.api.getSettlementInfo({ id: this.value.id, returnFlag: 0 }).then(rs => {
          this.settlementInfo = rs.data
        })
      }
    },
    'showDialog' (val) {
      this.$emit('update:show', val)
    }
  },
  methods: {
    getServiceItemPrice (items) {
      let data = items ? items.filter(item => {
        return item.itemId === this.value.serviceId
      })[0] : null
      return data ? data.fee.toFixed(2) : '0.00'
    },
    submitCannel () {
      this.$refs.cancel.validate(valid => {
        if (!valid) {
          return false
        }
        this.isSubmit = true
        let macId = this.storage.getLocalStorage('macId')
        if (this.value.insuranceType !== 1) {
          this.submitCannelEvent('')
        } else if (macId) {
          this.submitCannelEvent(macId)
        } else {
          getMacAddress().then(mac => {
            this.submitCannelEvent(mac.data)
          })
        }
      })
    },
    submitCannelEvent (macId) {
      this.api.cannelAppoint({
        id: this.value.id,
        macId: macId,
        cancelReason: ''
      }).then(rs => {
        this.showDialog = false
        this.isSubmit = false
        this.appointmentInfo = rs.data.appointmentInfo
        this.settlementInfo = rs.data.settlementInfo
        if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
          this.settlementInfo.action = 'cancel'
          this.settlementInfo.isRefund = 1
          this.$bus.$emit('appoint:pay', this.settlementInfo)
          return false
        }
        this.$bus.$emit('appoint:success', this.appointmentInfo, 'cancel')
        // this.$messageTips(this, 'success', '预约/挂号已取消', '提示')
      })
    }
  }
}
</script>

<style scoped>
  #dialogReturn h3.title {text-align: center; margin: 0; padding: 20px 0; font-size: 24px;}
  #dialogReturn .el-form {padding: 0 30px 30px 30px;}
  #dialogReturn /deep/ .el-dialog__header{padding: 0;}
  #dialogReturn /deep/ .el-dialog__body {padding: 0;}
  #dialogReturn /deep/ .el-form-item {margin-bottom: 0;}
  #dialogReturn /deep/ .el-form-item span.color{display: block; line-height: 33px;}
  #dialogReturn /deep/ .el-form-item__label {line-height: 33px; height: 33px; color: #A3A3A3;}
  #dialogReturn /deep/ .el-form-item__content {line-height: 33px; height: 33px;}
</style>
