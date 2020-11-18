<template>
  <div
    class="insurance"
    v-if="!(patientIdentity.length === 1 && patientIdentity.filter(v => v.sort == 0).length == 1)"
  >
    <!-- 医保 -->
    <div class="settle_class_row" v-if="usedMedInsur">
      <span class="settle_class_item">
        <span class="settle_class_label">医保类型</span>
        <span class="settle_class_con">{{obj.medicalOrgName}}</span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">医疗保险项目合计:</span>
        <span class="settle_class_con">{{ obj.totalFee | formatToFinacial }}</span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">医保统筹:</span>
        <span class="settle_class_con">{{ obj.medInsurPubPayFee | formatToFinacial }}</span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">医保账户:</span>
        <span class="settle_class_con">{{ obj.medInsurOwnPayFee | formatToFinacial }}</span>
      </span>
      <span class="settle_class_item">
        <!-- <el-button type="text" @click="mdisdpBtn">医保分解信息</el-button> -->
        <el-button type="text" @click="mdisrbBtn">医保报销信息</el-button>
      </span>
    </div>
    <!-- 商保 -->
    <div class="settle_class_row" v-if="useComInsur">
      <span class="settle_class_item">
        <span class="settle_class_label">商业医疗保险</span>
        <span class="settle_class_con">
          <el-select
            v-model="obj.settlementComInsurDetID"
            @change="selectInsur"
            placeholder="请选择"
            value-key="productId"
            :disabled="true"
          >
            <el-option
              v-for="item in options"
              :key="item.productId"
              :label="item.productName"
              :value="item"
            ></el-option>
          </el-select>
        </span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">商业保险项目合计:</span>
        <span class="settle_class_con">{{ obj.insuranceTotalfee | formatToFinacial }}</span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">报销比例:</span>
        <el-input
          placeholder="请输入内容"
          v-model="obj.recRate"
          @input="recRateChange"
          type="number"
          :disabled="hasStatus(1)|| hasStatus(2) || obj.recollect"
          @mousewheel.native="mousewheelevent"
        >
          <template slot="append">%</template>
        </el-input>
      </span>
      <span class="settle_class_item bxje">
        <span class="settle_class_label">报销金额:</span>
        <el-input
          placeholder="请输入内容"
          v-model="obj.comInsuranceDirectFee"
          type="number"
          @change="insuranceChange"
          :disabled="hasStatus(1) || hasStatus(2) || obj.recollect"
          @mousewheel.native="mousewheelevent"
        >
          <template slot="append">元</template>
        </el-input>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">自付金额:</span>
        <span class="settle_class_con">{{ insurancegetTotalfee }}</span>
      </span>
      <!-- 20200713免单去除 -->
      <!-- <span class="settle_class_item bxje">
        <span class="settle_class_label">
          <el-checkbox
            v-model="obj.comInsuranceBenefit"
            @change="comInsuranceBenefitChange"
            :disabled="hasStatus(1) || hasStatus(2) || obj.recollect"
          >免单</el-checkbox>
        </span>
        <el-input
          placeholder="免单金额"
          v-model="obj.comInsuranceBenefitFee"
          type="number"
          :disabled="hasStatus(1) || hasStatus(2) || obj.recollect"
          @mousewheel.native="mousewheelevent"
          v-if="obj.comInsuranceBenefit"
          @input="comInsuranceBenefitFeeChange"
        >
          <template slot="append">元</template>
        </el-input>
      </span>-->
    </div>
    <!-- 大客户 -->
    <div class="settle_class_row" v-if="useMajor">
      <span class="settle_class_item">
        <span class="settle_class_label">第三方</span>
        <span class="settle_class_con">
          <el-select
            v-model="obj.productId"
            @change="majorSelectInsur"
            placeholder="请选择"
            value-key="id"
            :disabled="hasStatus(1) || hasStatus(7) || obj.recollect"
          >
            <el-option
              v-for="item in majorOptions"
              :key="item.productCode"
              :label="item.productName"
              :value="item"
            ></el-option>
          </el-select>
        </span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">第三方保险项目合计:</span>
        <span class="settle_class_con">{{ obj.majorTotalfee }}</span>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">报销比例:</span>
        <el-input
          placeholder="请输入内容"
          v-model="obj.reimburseRate"
          @input="majorRecRateChange"
          :disabled="hasStatus(1) || hasStatus(2) || hasStatus(7)"
          type="number"
          @mousewheel.native="mousewheelevent"
        >
          <template slot="append">%</template>
        </el-input>
      </span>
      <span class="settle_class_item bxje">
        <span class="settle_class_label">报销金额:</span>
        <el-input
          placeholder="请输入内容"
          v-model="obj.majorAccountFee"
          @input="majorInsuranceChange"
          type="number"
          :disabled="hasStatus(1) || hasStatus(2) || hasStatus(7)"
          @mousewheel.native="mousewheelevent"
        >
          <template slot="append">元</template>
        </el-input>
      </span>
      <span class="settle_class_item">
        <span class="settle_class_label">自付金额:</span>
        <span class="settle_class_con">{{ majorGetTotalfee }}</span>
      </span>
    </div>
    <reimburseinfo
      v-if="reimburvisiavle"
      :settlementId="obj.id"
      :reimburvisiavle.sync="reimburvisiavle"
    ></reimburseinfo>
    <!-- <medicalsettle
      :medicalsettlevisable.sync="medicalsettlevisable"
      :medicalsettleobj="obj"
      ref="medicalsettle"
    ></medicalsettle>-->
  </div>
</template>
<script>
import insurancePrice from './computeinsunance.js'
import medicalsettle from '@/rcm/otmdiscomponent/medicalsettle.vue'
import reimburseinfo from '@/rcm/otmdiscomponent/reimburseinfo.vue'
import {
  getProgrammesByPatient,
  getInsuranceByPatient
} from '@/rcm/store/outpatient/outpatient'
import { floatTool } from '@/util/common'
import {
  computedInsurance,
  mousewheelevent,
  limitInputValue
} from './settleconfig'
export default {
  mixins: [insurancePrice],
  props: {
    patientIdentity: {
      type: Array,
      default () {
        return []
      }
    },
    settleStatus: {
      type: Number,
      default: 0
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    medicalsettle,
    reimburseinfo
  },
  data () {
    return {
      reimburvisiavle: false,
      medicalsettlevisable: false,
      options: [],
      majorOptions: [],
      mousewheelevent: mousewheelevent,
      md: false
    }
  },
  watch: {
    'insurancegetTotalfee': {
      handler: function () {
        if (this.obj.settleStatus === 2) {
          this.comInsuranceBenefitChange(this.obj.comInsuranceBenefit)
        }
      }
    }
  },
  computed: {
    insurancegetTotalfee: function () {
      if (this.obj.settleStatus === 2) {
        this.obj.unFee = floatTool.subtract(
          this.obj.totalFee,
          floatTool.add(
            floatTool.add(
              floatTool.add(
                this.obj.comInsuranceDirectFee,
                this.obj.majorAccountFee
              ),
              this.obj.totalBenefit
            ),
            this.obj.exefee
          )
        )
      }
      return floatTool
        .subtract(this.obj.insuranceTotalfee, this.obj.comInsuranceDirectFee)
        .toFixed(2)
    },
    majorGetTotalfee: function () {
      // if (
      //   this.obj.majorAccountFee > this.obj.majorTotalfee ||
      //   this.obj.majorAccountFee < 0
      // ) {
      //   this.obj.majorAccountFee = ''
      // }
      if (this.obj.settleStatus === 7) {
        this.obj.unFee = floatTool.subtract(
          this.obj.totalFee,
          floatTool.add(
            floatTool.add(
              floatTool.add(
                this.obj.comInsuranceDirectFee,
                this.obj.majorAccountFee
              ),
              this.obj.totalBenefit
            ),
            this.obj.exefee
          )
        )
      }
      return floatTool.subtract(
        this.obj.majorTotalfee,
        this.obj.majorAccountFee
      )
    },
    // 是否显示医保
    usedMedInsur: function () {
      return this.hasStatus(1)
    },
    // 是否显示商保
    useComInsur: function () {
      return this.hasStatus(2) || this.settleStatus === 2
    },
    // 是否显示大客户
    useMajor: function () {
      return this.hasStatus(7) || this.settleStatus === 7
    }
  },
  methods: {
    // 报销信息
    mdisrbBtn () {
      this.reimburvisiavle = true
    },
    comInsuranceBenefitFeeChange (val) {
      let reg = /^(\d|[1-9]\d)(\.\d{1,2})*$/
      if (!val.match(reg)) {
      }
      if (
        Number(this.obj.comInsuranceBenefitFee) >
        Number(this.insurancegetTotalfee)
      ) {
        this.obj.comInsuranceBenefitFee = this.insurancegetTotalfee
      }
      if (this.obj.comInsuranceBenefitFee < 0) {
        this.obj.comInsuranceBenefitFee = 0
      }
      this.benefitFeecompute()
      // computedInsurance(this.obj.multipleSelection, this.obj)
    },
    comInsuranceBenefitChange (val) {
      if (val) {
        this.obj.comInsuranceBenefitFee = this.insurancegetTotalfee
      } else {
        this.obj.comInsuranceBenefitFee = 0
      }
      this.benefitFeecompute()
      // computedInsurance(this.obj.multipleSelection, this.obj)
    },
    benefitFeecompute () {
      if (this.obj.settleStatus === 2 || this.obj.settleStatus === 7) {
        if (this.obj.comInsuranceBenefit) {
          this.obj.totalBenefit = floatTool.add(
            this.obj.freetmoney,
            this.obj.comInsuranceBenefitFee
          )
        } else {
          this.obj.totalBenefit = this.obj.freetmoney
        }
      }
      this.obj.unFee = floatTool.subtract(
        this.obj.totalFee,
        floatTool.add(
          floatTool.add(
            floatTool.add(
              floatTool.add(
                floatTool.add(
                  this.obj.comInsuranceDirectFee,
                  this.obj.majorAccountFee
                ),
                this.obj.totalBenefit
              ),
              this.obj.exefee
            ),
            this.obj.medInsurPubPayFee || 0 // 减去医保报销费用
          ),
          this.obj.medInsurOwnPayFee || 0 // 减去医保个人付费
        )
      )
    },
    // 获取商保信息
    async getInsuranceInfo () {
      let params = {
        visitNumber: this.$route.query.visitNumber
      }
      try {
        let data = await getInsuranceByPatient(params)
        this.options = data.data
        // settlementComInsurDet是结算单上商保明细，如果有则不需要默认加载第一个
        if (this.obj.recollect) {
          if (this.obj.details.settlementComInsurDet.length <= 0) {
          } else {
            this.obj.settlementComInsurDetID = this.obj.details.settlementComInsurDet[0]
            this.obj.mergedReceiptData.map(v => {
              v.recipeDetails.map(x => {
                if (x.freeSheet === 1) {
                  // 免单
                } else {
                  this.$set(x, 'useInsuranceDiscount', this.obj.recRate)
                }
              })
            })
          }
        } else {
          if (this.obj.details.settlementComInsurDet.length <= 0) {
            if (this.obj.settleStatus === 2) {
              let defaultInsuranceOrg = data.data[0]
              this.obj.settlementComInsurDetID = defaultInsuranceOrg
              this.obj.recRate = defaultInsuranceOrg && defaultInsuranceOrg.recRate
              this.obj.mergedReceiptData.map(v => {
                v.recipeDetails.map(x => {
                  if (x.freeSheet === 1) {
                    // 免单
                  } else {
                    this.$set(x, 'useInsuranceDiscount', this.obj.recRate)
                  }
                })
              })
            } else {
              this.obj.settlementComInsurDetID = ''
              this.obj.recRate = ''
            }
          } else {
            this.obj.settlementComInsurDetID = this.obj.details.settlementComInsurDet[0]
          }
        }
      } catch (err) {
        console.log('err', err)
      }
    },
    selectInsur (val) {
      if (this.obj.settleStatus === 2) {
        this.obj.recRate = val.recRate
        this.obj.mergedReceiptData.map(v => {
          v.recipeDetails.map(x => {
            if (x.freeSheet === 1) {
              // 免单
            } else {
              this.$set(x, 'useInsuranceDiscount', val.recRate)
            }
          })
        })
        // 切换商保产品需取价
        this.getInsurPrice()
      }
    },
    recRateChange (val) {
      this.obj.recRate = limitInputValue(val, this)
      this.obj.comInsuranceDirectFee = floatTool.multiply(
        this.obj.insuranceTotalfee,
        floatTool.divide(this.obj.recRate, 100)
      )
    },
    // 报销金额
    insuranceChange (val) {
      let reg = /^(\d|[1-9]\d)(\.\d{1,2})*$/
      if (!val.match(reg)) {
        this.obj.comInsuranceDirectFee = Number(
          this.obj.comInsuranceDirectFee
        ).toFixed(2)
      }
      if (Number(val) === 0) {
        this.obj.recRate = 0
      } else {
        this.obj.recRate = floatTool.multiply(
          100,
          floatTool.divide(
            this.obj.comInsuranceDirectFee,
            this.obj.insuranceTotalfee
          )
        )
      }
    },
    // 获取患者的大客户信息
    async getProgrammesByPatient () {
      let params = {
        patientId: this.$route.query.patientId
      }
      // this.obj.reimburseRate = ''
      // this.obj.productId = ''
      getProgrammesByPatient(params).then(res => {
        // insurance模块的显示
        this.majorOptions = res.data
        // 处理明细中项目是否在大客户的报销范围中
        if (this.obj.recollect) {
          if (this.obj.details.settlementMajorAccount.length <= 0) {
          } else {
            this.majorSelectChangeHandle(res.data[0])
          }
        } else {
          if (this.obj.details.settlementMajorAccount.length <= 0) {
            if (this.obj.settleStatus === 7) {
              this.majorSelectChangeHandle(res.data[0])
            } else {
              this.obj.productId = ''
              this.obj.reimburseRate = ''
            }
          } else {
            // 估计需要转化才能回显
            this.obj.productId = this.obj.details.settlementMajorAccount[0]
            this.obj.productId.id = this.obj.details.settlementMajorAccount[0].productId
          }
        }
      })
    },
    // 大客户福利方案选择事件
    majorSelectInsur (val) {
      this.majorSelectChangeHandle(val)
    },
    // 大客户报销比例变化事件
    majorRecRateChange (val) {
      this.obj.reimburseRate = limitInputValue(val, this)
      this.obj.majorAccountFee = floatTool.multiply(
        this.obj.majorTotalfee,
        floatTool.divide(this.obj.reimburseRate, 100)
      )
    },
    // 大客户报销金额变化事件,反算折扣比例
    majorInsuranceChange (val) {
      let reg = /^(\d|[1-9]\d)(\.\d{1,2})*$/
      if (!val.match(reg)) {
        this.obj.majorAccountFee = Number(this.obj.majorAccountFee).toFixed(2)
      }
      if (Number(val) === 0) {
        this.obj.reimburseRate = 0
      } else {
        this.obj.reimburseRate = floatTool.multiply(
          100,
          floatTool.divide(val, this.obj.majorTotalfee)
        )
      }
    },
    // 大客户报报销方案select之后触发事件
    majorSelectChangeHandle (major) {
      if (!major) {
        return
      }
      this.obj.productId = major
      if (this.obj.settleStatus === 7) {
        this.obj.reimburseRate = major.reimburseRate
      }
      let targetCategoryIds = []
      let targetItemIds = []
      targetCategoryIds = targetCategoryIds.concat(
        major.serviceIdsObj.categoryIds
      )
      targetItemIds = targetItemIds.concat(major.serviceIdsObj.itemIds)
      this.obj.mergedReceiptData.map(v => {
        v.recipeDetails.map(x => {
          // 在范围内且不能是医保、商保（目前商保大客户互斥）和免单
          if (
            (targetCategoryIds.includes('0') ||
              targetCategoryIds.includes(x.itemType) ||
              targetItemIds.includes(x.itemId)) &&
            !x.useInsurance && !x.useMedInsurance &&
            x.freeSheet !== 1
          ) {
            // 重收单应该根据原单选择
            if (this.obj.recollect) {
              if (x.majorAccount) {
                this.$set(x, 'majorAccount', true) // 默认勾选
                this.$set(x, 'isInBigCustomer', true) // 显示checkBox及折扣比例
                this.$set(x, 'majorAccountDiscount', major.reimburseRate)
              } else {
                this.$set(x, 'majorAccountDiscount', 0)
                this.$set(x, 'isInBigCustomer', false)
                this.$set(x, 'majorAccount', false)
              }
            } else {
              this.$set(x, 'majorAccountDiscount', major.reimburseRate)
              this.$set(x, 'isInBigCustomer', true) // 显示checkBox及折扣比例
              this.$set(x, 'majorAccount', true) // 默认勾选
            }
          } else {
            this.$set(x, 'majorAccountDiscount', 0)
            this.$set(x, 'isInBigCustomer', false)
            this.$set(x, 'majorAccount', false)
          }
        })
      })
      computedInsurance(this.obj.multipleSelection, this.obj)
    },
    // 大客户报报销方案修改报销比例或者报销金额之后触发事件
    majorRateChangeHandle (Rate) {
      this.obj.reimburseRate = Rate
      let targetCategoryIds = []
      let targetItemIds = []
      targetCategoryIds = targetCategoryIds.concat(
        this.obj.productId.serviceIdsObj.categoryIds
      )
      targetItemIds = targetItemIds.concat(
        this.obj.productId.serviceIdsObj.itemIds
      )
      this.obj.mergedReceiptData.map(v => {
        v.recipeDetails.map(x => {
          // 在范围内且不能是商保（目前商保大客户互斥）和免单
          if (
            (targetCategoryIds.includes(x.itemType) ||
              targetItemIds.includes(x.itemId)) &&
            !x.useInsurance &&
            x.freeSheet !== 1
          ) {
            this.$set(x, 'majorAccountDiscount', Rate)
            this.$set(x, 'isInBigCustomer', true) // 显示checkBox及折扣比例
            this.$set(x, 'majorAccount', true) // 默认勾选
          } else {
            this.$set(x, 'majorAccountDiscount', 0)
            this.$set(x, 'isInBigCustomer', false)
            this.$set(x, 'majorAccount', false)
          }
        })
      })
      computedInsurance(this.obj.multipleSelection, this.obj)
    },
    hasStatus (status) {
      return this.patientIdentity.filter(v => v.sort === status && v.status === 1).length > 0
    }
  }
}
</script>
<style scoped>
.settle_class_row {
  padding-top: 10px;
}
.settle_class_label {
  display: inline-block;
  text-align: right;
}
.settle_class_row .settle_class_item:first-child .settle_class_label {
  width: 100px;
}
.settle_class_row .settle_class_item:nth-child(2) .settle_class_label {
  width: 130px;
}
.settle_class_item {
  margin-right: 20px;
  display: inline-block;
}
.settle_class_label {
  font-size: 14px;
  color: #666;
  padding-right: 10px;
}
.settle_class_con {
  color: #000;
  font-size: 14px;
}
.settle_class_row /deep/ .el-input-group__append,
.el-input-group__prepend {
  padding: 0 5px;
}
.settle_class_row /deep/ .el-input.is-disabled .el-input-group__append,
.el-input-group__prepend {
  border: 1px solid #e4e7ed;
}
.el-input-group {
  width: 80px;
}
.settle_class_row /deep/ .el-input.el-input--suffix {
  width: 280px;
}
.bxje .el-input-group {
  width: 100px;
}
</style>

