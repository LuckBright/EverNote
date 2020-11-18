<template>
  <el-dialog
    title=""
    id="dialogPay"
    :visible.sync="showDialog"
    :show-close="false"
    :close-on-click-modal="false"
    width="520px">
    <el-row class="header">
      <el-col :span="24">
        <strong>{{value.patient.name}} - {{value.patient.outpatientNumber}}</strong>
        <strong class="ml10">
          <span>{{value.patient.sex | formatSex}}</span>
          <span class="ml10">{{value.patient.ageShowText}}</span>
        </strong> <br>
        <label>{{value.deptName}}</label> <label>{{value.resourceName}}</label> <label class="ml10">{{value.serviceName}}</label> <label class="ml20">{{value.date}} {{value.startTimeStr}}</label>
      </el-col>
    </el-row>
    <div class="main">
      <el-form :model="form" label-width="140px" :show-message="true" label-position="right" ref="payform">
        <el-row>
          <el-col :span="18">
            <el-form-item label="号别：">
              <label>{{value.deptName}}</label> <label>{{value.resourceName}}</label> <label class="ml10">{{value.serviceName}}</label>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">￥{{servicePrice}}</el-col>
        </el-row>
        <el-row v-if="!form.insuranceType">
          <el-col :span="18">
            <el-form-item label="套餐及保障计划：">
              <el-select
                size="small"
                v-model="form.shopSetItemId"
                placeholder="套餐信息">
                <el-option :value="-1" label="不使用"></el-option>
                <el-option
                  :value="item.setmealOrderDetailId"
                  :label="item.setMealName"
                  v-for="(item, i) in serviceSetList"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!form.insuranceType">
          <el-col :span="18">
            <el-form-item label="折扣：">
              <el-select v-model="discountCard" value-key="id" size="small">
                <el-option :value="{id: '', name: '无折扣'}" label="无折扣"></el-option>
                <el-option
                  :label="item.name"
                  :value="item"
                  v-for="(item, i) in discountList"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <el-row class="lh32" v-if="type==='register'">
          <el-col :span="18">
            <el-form-item>
              <el-checkbox v-model="form.jiuZhenCard" :true-label="1" :false-label="0">就诊卡</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right" style="color: #EE4433;" v-if="jiuZhenCardPrice">+ ￥{{jiuZhenCardPrice.toFixed(2)}}</el-col>
        </el-row>
        <el-row class="lh32" v-if="type==='register'">
          <el-col :span="18">
            <el-form-item>
              <el-checkbox v-model="form.medicalRecordBook" :true-label="1" :false-label="0">病历本</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right" style="color: #EE4433;"  v-if="recordBookPrice">+ ￥{{recordBookPrice.toFixed(2)}}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col>
            <el-form-item>
              <el-button size="small" type="primary" :disabled="isSubmit" @click="submitRegister">{{type==='register' ? '挂号' : '预约'}}</el-button>
              <el-button size="small" type="" @click="showDialog=false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import sobapi from '@/sob/store/serviceapi'
export default {
  props: ['show', 'value', 'serviceSetList', 'type'],
  data () {
    return {
      api,
      sobapi,
      isSubmit: false,
      showDialog: false,
      discountCard: '',
      settlementInfo: '',
      recordBookPrice: 0,
      jiuZhenCardPrice: 0,
      servicePrice: 0,
      discountList: [],
      form: {
        shopSetItemId: -1,
        discount: 0,
        benefitId: '',
        jiuZhenCard: 0,
        medicalRecordBook: 0
      }
    }
  },
  watch: {
    'show' (val) {
      this.showDialog = val
      this.isSubmit = false
      this.discountCard = ''
      this.recordBookPrice = 0
      this.jiuZhenCardPrice = 0
      Object.assign(this.form, this.value)
      if (val) {
        this.getDiscountList()
        this.getServicePrice()
      }
    },
    'showDialog' (val) {
      this.$emit('update:show', val)
    },
    'value' (val) {
      this.form = Object.assign(this.form, val)
    },
    'form.medicalRecordBook' (val) {
      if (!val) {
        this.recordBookPrice = 0
      } else {
        this.getItemPrice('bingliben').then(price => {
          this.recordBookPrice = price
        })
      }
    },
    'form.jiuZhenCard' (val) {
      if (!val) {
        this.jiuZhenCardPrice = 0
      } else {
        this.getItemPrice('jiuzhenka').then(price => {
          this.jiuZhenCardPrice = price || 0
        })
      }
    },
    'discountCard' (val) {
      this.form.discount = val && val.id ? val.value : 100
      this.form.benefitId = val ? val.id : ''
    }
  },
  methods: {
    getServicePrice (orgId) {
      if (!this.value.serviceId || !this.value.organId) {
        this.servicePrice = 0
        return false
      }
      this.api.getServicePrice(
        orgId || this.value.organId,
        this.value.serviceId,
        this.value.serviceName
      ).then(rs => {
        if (!rs.data || !rs.data.itemPriceList || !rs.data.itemPriceList[0]) {
          this.servicePrice = 0
          return false
        }
        this.servicePrice = rs.data.itemPriceList[0].price
      })
    },
    getItemPrice (code) {
      return this.sobapi.listByCode({ code: code }).then(rs => {
        if (!rs.head.errCode && rs.data) {
          return this.api.getServicePrice(
            this.value.organId,
            rs.data.id,
            rs.data.name
          ).then(rs => {
            return !rs.head.errCode ? rs.data.itemPriceList[0].price : 0
          })
        } else {
          return 0
        }
      })
    },
    getDiscountList () {
      if (this.value.patientId && this.value.serviceId) {
        this.api.getPatientDiscounts({ patientId: this.value.patientId, itemId: this.value.serviceId }).then(rs => {
          if (!rs.head.errCode && rs.data[0]) {
            this.discountList = rs.data.map(item => {
              item.name = (item.discount / 10).toFixed(1) + '折'
              item.value = item.discount
              item.id = item.patientBenefitId
              return item
            })
            this.discountCard = this.discountList[0] || {id: '', name: '无折扣'}
          } else {
            this.discountList = []
            this.discountCard = {id: '', name: '无折扣'}
          }
        })
      }
    },
    submitRegister () {
      this.showDialog = false
      this.isSubmit = true
      this.$emit('submit', this.form)
    }
  },
  computed: {
    discountPrice () {
      if (this.value.discount !== '' && this.servicePrice) {
        return (this.servicePrice - this.servicePrice * this.value.discount / 100).toFixed(2)
      } else {
        return 0
      }
    },
    currentPrice () {
      if (this.value.shopSetItemId !== -1) {
        return 0
      } else {
        return this.servicePrice
      }
    }
  }
}
</script>

<style scoped>
  #dialogPay /deep/ .el-dialog__header{padding: 0;}
  #dialogPay /deep/ .el-dialog__body {padding: 0;}
  #dialogPay /deep/ .el-form-item {margin-bottom: 0;}
  #dialogPay /deep/ .el-form-item__label {line-height: 40px; height: 40px; color: #A3A3A3;}
  #dialogPay .main .lh32 .el-col {line-height: 32px;}
  #dialogPay .lh32 /deep/ .el-form-item__content{line-height: 32px;}
  #dialogPay .header {padding: 16px 10px 10px 77px; background: #F0F5FA; line-height: 1.7; border-bottom: 1px solid #C0CCD9;}
  #dialogPay .header label {font-size: 12px; color: #666;}
  #dialogPay .main {padding: 20px; background: #fff;}
  #dialogPay .main .el-col {line-height: 40px;}
</style>
