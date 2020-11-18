<template>
  <div>
    <div class="layout_inner">
      <el-table v-loading.body="loading" :data="tableData" class="disconut_table">
        <el-table-column prop="name" label="参数名称" align="left" width="300"></el-table-column>
        <el-table-column prop="sort" label="参数值" width="350">
          <template slot-scope="scope">
            <ever-select
              v-if="['med_insurance_offerrate', 'com_insurance_offerrate', 'com_insurance_offerrate', 'selfpay_offerrate'].includes(scope.row.code)"
              v-model="scope.row.value"
              :options="optionsArr.jurisdiction"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'wipe_zero_rounding_rule'"
              v-model="scope.row.value"
              :options="optionsArr.srgz"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'settlement_mode'"
              v-model="scope.row.value"
              :options="optionsArr.sm"
            ></ever-select>
            <ever-select
              v-if="['pay_mode', 'hos_pay_mode', 'shop_pay_mode'].includes(scope.row.code)"
              v-model="scope.row.value"
              :options="optionsArr.zfms"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'tax_enable'"
              v-model="scope.row.value"
              :options="optionsArr.yn"
            ></ever-select>
            <el-select
              v-model="scope.row.value"
              placeholder="请选择"
              v-if="scope.row.code=='mobilepay_select_prescription'"
            >
              <el-option
                v-for="item in optionsArr.yx"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="scope.row.value"
              placeholder="请选择"
              v-if="scope.row.code=='points_enable'"
            >
              <el-option
                v-for="item in optionsArr.qy"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="scope.row.value"
              placeholder="请输入0-6之间的正整数"
              v-if="['sale_price_precision', 'purchase_price_precision', 'quantity_precision', 'amount_precision'].includes(scope.row.code)"
              :maxlength="1"
            ></el-input>
            <!-- <el-input
              v-model="scope.row.value"
              v-if="['cacel_settlement'].includes(scope.row.code)"
              :maxlength="6"
            ></el-input> -->
            <el-input
              v-model="scope.row.value"
              v-if="scope.row.code=='setmeal_expiry_date'"
              :maxlength="4"
            ></el-input>
            <!-- 黑龙江医保预警阈值 -->
            <el-input
              v-model.number="scope.row.value"
              v-if="['warning_threshold'].includes(scope.row.code)"
            ></el-input>
            <!-- 黑龙江医保macId -->
            <el-input
              v-model="scope.row.value"
              v-if="['local_medical_macid'].includes(scope.row.code)"
            ></el-input>
            <ever-select
              v-if="scope.row.code == 'purchase_approval'"
              v-model="scope.row.value"
              :options="optionsArr.fpsp"
            ></ever-select>
            <ever-select
              v-if="['recipe_checked'].includes(scope.row.code)"
              v-model="scope.row.value"
              :options="optionsArr.recipe_check_type"
            ></ever-select>
            <ever-select
              v-if="['market_approval', 'direct_pay', 'recommend_auth'].includes(scope.row.code)"
              v-model="scope.row.value"
              :options="optionsArr.ck"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'zero_pay_page'"
              v-model="scope.row.value"
              :options="optionsArr.bl"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'drugs_refund_limit'"
              v-model="scope.row.value"
              :options="optionsArr.dlmit"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'nodrugs_refund_limit'"
              v-model="scope.row.value"
              :options="optionsArr.ndlmit"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'storedcard_swingcard_check'"
              v-model="scope.row.value"
              :options="optionsArr.iscard"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'refund_method'"
              v-model="scope.row.value"
              :options="optionsArr.refundway"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'discount_modify'"
              v-model="scope.row.value"
              :options="optionsArr.isdetail"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'coupon_apportion'"
              v-model="scope.row.value"
              :options="optionsArr.couponApportion"
            ></ever-select>
            <ever-select
              v-if="scope.row.code == 'head_info_medical'"
              v-model="scope.row.value"
              :options="optionsArr.tcje"
            ></ever-select>
            <el-select
              v-model="scope.row.value"
              placeholder="请选择"
              v-if="scope.row.code=='patient_number_show_way'"
            >
              <el-option
                v-for="item in optionsArr.jt"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="参数说明" align="left">
          <template slot-scope="scope">
            <div
              v-if="['points_enable', 'mobilepay_select_prescription', 'purchase_approval', 'coupon_apportion','settlement_mode'].includes(scope.row.code)"
            >{{scope.row.description}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button size="small" type="primary" @click="updateinfo" style="margin-right:10px;">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/store/discountproportionapi.js'

export default {
  data () {
    return {
      product: true,
      loading: false,
      details: false,
      disabled: false,
      detailskey: 1,
      api,
      tableData: [],
      loginfo: {
        dialogVisible: false,
        key: '1',
        id: '',
        disabled: false,
        tableData: []
      },
      optionsArr: {
        insurance: [], // 保险
        insurance0: [], // 保险>基本医疗保险
        insurance1: [], // 保险>商业保险
        insurance2: [], // 保险>第三方
        cooperative: [], // 合作单位
        jurisdiction: [], // 优惠比例
        cardpay: [], // 储值卡余额使用策略
        mixpay: [], // 混付策略
        yn: [],
        srgz: [], // 舍入规则
        zfms: [], // 支付的模式
        hbcl: [], // 门诊正负账单合并处理策略
        sxrq: [], // 退费重收单生效日期
        gz: [],
        zszz: [],
        jsms: [], // 结算模式
        mldw: [], // 抹零单位
        qy: [],
        yx: [],
        fj: [], // 结算流程是否包含分解信息
        fpsp: [],
        recipe_check_type: [],
        ck: [],
        bl: [],
        jt: [],
        dlmit: [],
        ndlmit: [],
        iscard: [],
        refundway: [], // 退费方式
        isdetail: [], // 是否允许修改折扣
        mealSet: [], // 套餐设置折扣还是折后金额
        couponApportion: [], // 优惠券金额分摊方式
        sm: []// 挂号单和收费单是否可以生成在一张结算单上
      }
    }
  },
  methods: {
    list (key) {
      this.loading = true
      api.search().then(rs => {
        this.loading = false
        if (rs.data) {
          this.tableData = rs.data
        }
      })
    },
    updateinfo () {
      let res1 = /^[1-9]{1}\d{0,3}$/
      if (!res1.test(this.getTable('setmeal_expiry_date').value)) {
        this.$notify({
          title: '',
          message: '套餐使用有效期需为1-9999正整数',
          type: 'error'
        })
        return
      }
      api.update(this.tableData).then(result => {
        this.$notify({
          title: '',
          message: '保存成功',
          type: 'success'
        })
      })
    },
    getinsurance () {
      api.getlist().then(result => {
        this.optionsArr.insurance = result.data
        result.data.map(item => {
          if (item.corpType === 0) {
            this.optionsArr.insurance0.push(item)
          } else if (item.corpType === 1) {
            this.optionsArr.insurance1.push(item)
          } else if (item.corpType === 2) {
            this.optionsArr.insurance2.push(item)
          }
        })
      })
    },
    getTable (val) {
      return this.tableData.find(item => item.code === val)
    }
  },
  watch: {
  },
  created () {
    this.list()
    this.getinsurance()
    this.optionsArr = Object.assign(this.optionsArr, api.codes)
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.disconut_table /deep/ .el-input {
  width: 230px;
}
.payment-module {
  padding: 20px 20px 5px 20px;
  border: 1px solid rgb(235, 237, 239);
  margin-bottom: 20px;
  label {
    margin: 0 20px;
  }
  .el-select {
    width: 250px;
  }
  .el-col-8 {
    max-width: 200px;
    height: 36px;
    line-height: 36px;
    &.max {
      max-width: 280px;
    }
  }
  .el-col-16 {
    height: 36px;
    line-height: 36px;
  }
}
.details-layer {
  span {
    display: block;
  }
  .mar {
    margin-top: 20px;
  }
}
</style>
