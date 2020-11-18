<template>
  <div class="settlement_detail">
    <div class="preferential">
      <div class="preferential_title">
        <el-button type="text" @click="changeCardStaus(2)" :disabled="obj.benefitCardStatus">
          1.身份卡
          <i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 2}"></i>
        </el-button>
        <el-button
          type="text"
          class="choose"
          v-if="obj.details.settlementBenefitDet&&obj.details.settlementBenefitDet.length>0"
        >已选{{obj.details.settlementBenefitDet.length}}张</el-button>
        <el-button type="text" @click="changeCardStaus(3)" :disabled="obj.giftCardStatus">
          2.优惠券
          <i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 3}"></i>
        </el-button>
        <el-button
          type="text"
          class="choose"
          v-if="obj.details.settlementCouponDet&&obj.details.settlementCouponDet.length>0"
        >已选{{obj.details.settlementCouponDet.length}}张</el-button>
        <el-button type="text" @click="changeCardStaus(1)" :disabled="obj.memberCardStatus">
          3.储值卡
          <i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 1}"></i>
        </el-button>
        <el-button
          type="text"
          class="choose"
          v-if="obj.details.settlementMemberDet&&obj.details.settlementMemberDet.length>0"
        >已选{{obj.details.settlementMemberDet.length}}张</el-button>
        <el-button type="text" @click="changeCardStaus(4)" :disabled="obj.activeCardStatus">
          4.活动
          <i class="el-icon-arrow-down" v-bind:class="{ active: obj.cardStatus === 4}"></i>
        </el-button>
        <el-button
          type="text"
          class="choose"
          v-if="obj.details.settlementPromotion&&obj.details.settlementPromotion.length>0"
        >已选{{obj.details.settlementPromotion.length}}张</el-button>
      </div>
      <div class="bindgitcard">
        <el-input v-model="bindgitcardcode" placeholder="请输入优惠券码">
          <el-button slot="append" class="bindgitcardbtn" @click="bindgitcardFn">绑券</el-button>
        </el-input>
      </div>
      <div class="bindgitcard">
        <el-button plain @click="computeBenfit" :loading="computeBenfitLoading">推荐组合</el-button>
      </div>
    </div>
    <patientbenefit :obj="obj" :reset="reset" ref="patientbenefit"></patientbenefit>
  </div>
</template>
<script>
import patientbenefit from './patientbenefit'
import api from '@/workspace/store/useraccountapi'
import { getBestBenfit } from '@/rcm/store/outpatient/outpatient'
export default {
  props: ['obj'],
  data () {
    return {
      computeBenfitLoading: false,
      settlementId: this.$route.query.settlementId,
      patientId: this.$route.query.patientId,
      providerId: this.$route.query.providerId,
      orderType: this.$route.query.orderType,
      ipNo: this.$route.query.ipNo,
      status: this.$route.query.ipStatus,
      dialogBenefitVisible: false,
      bindgitcardcode: '',
      benfitfee: 0,
      reset: false
    }
  },
  methods: {
    // 计算最优组合
    async computeBenfit () {
      this.reset = true
      this.computeBenfitLoading = true
      let params = {
        settleType: 1, // 结算类型 0 门诊，1住院
        patientId: this.$route.query.patientId, // 患者id
        deptId: this.obj.ipDept, // 科室id
        billDetails: this.obj.details.ipSettlementDetail,
        insuranceType: this.obj.insuranceType
      }
      try {
        let data = await getBestBenfit(params)
        if (data && data.data) {
          this.benfitfee = data.data.benefitFee
          let { type, index } = { ...data.data }
          switch (type) {
            case 0:
              // 活动
              this.$refs.patientbenefit.activeCardArrSelectionChange(this.obj.benfitArr.activeArr && this.obj.benfitArr.activeArr[index], index, true)
              break
            case 1:
              // 身份卡
              this.$refs.patientbenefit.benefitCardArrSelectionChange(this.obj.benfitArr.benefitCardArr && this.obj.benfitArr.benefitCardArr[index], index, true)
              break
            case 2:
              // 优惠券
              this.$refs.patientbenefit.giftcardSelect(this.obj.benfitArr.giftCardArr && this.obj.benfitArr.giftCardArr[index], index)
              break
            case 3:
              // 会员卡
              this.$refs.patientbenefit.userCardArrSelectionChange(this.obj.benfitArr.userCardArr && this.obj.benfitArr.userCardArr[index], index, true)
              break
            default:
              break
          }
        }
        this.reset = false
        this.computeBenfitLoading = false
      } catch (err) {
        this.computeBenfitLoading = false
      }
    },
    bindgitcardFn () {
      let that = this
      if (that.bindgitcardcode) {
        api
          .bind({
            code: that.bindgitcardcode,
            patientId: this.patientId
          })
          .then(result => {
            if (result.head.errCode === 0) {
              this.$notify({
                message: 'success',
                type: 'success'
              })
              this.refreshBenefitList()
            }
          })
      } else {
        that.$notify({ message: '请填写优惠券码', type: 'error' })
      }
    },
    changeCardStaus (status) {
      if (status === this.obj.cardStatus) {
        this.obj.cardStatus = ''
      } else {
        this.obj.cardStatus = status
      }
    },
    refreshBenefitList () {
      this.reset = true
      window.setTimeout(_ => {
        this.reset = false
        this.$refs.patientbenefit && this.$refs.patientbenefit.queryMarketInfo()
      }, 300)
    }
  },
  components: {
    patientbenefit
    // dialogbenefit
  },
  created () {
    let that = this
    if (that.obj.settlestatus === '3') {
      that.obj.benefitCardStatus = true
      that.obj.giftCardStatus = true
      that.obj.memberCardStatus = true
    }
  },
}
</script>
<style scoped>
.settlement_detail /deep/ .el-button.choose span {
  font-size: 12px;
  color: #f56c6c;
}
.bindgitcard_left {
  font-size: 14px;
  margin-left: 20px;
  display: inline;
  padding-top: 20px;
}
.settlement_detail .choose_fee {
  font-size: 14px;
  color: #f56c6c;
}
.settle_title .el-button--text {
  text-decoration: underline;
  padding: 0;
}
.settle_title .iconfont {
  font-size: 12px;
  color: #1c7bef;
}
.bindgitcard {
  display: inline-block;
  height: 28px;
}
.bindgitcard /deep/ .el-button {
  padding: 6px 10px;
}
.bindgitcard /deep/ .el-input-group__append,
.el-input-group__prepend {
  padding: 0 20px;
}
.bindgitcard /deep/ .el-input-group__append button.el-button.bindgitcardbtn {
  background-color: #1c7bef;
  border-color: #1c7bef;
  color: #fff;
  border-radius: 0;
  padding: 7px 10px;
  margin: -10px -21px;
}
.bindgitcard /deep/ .el-input__inner {
  height: 28px;
}
.preferential_title {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
}
.preferential .preferential_title /deep/ .el-button--text {
  font-size: 14px;
  color: #000;
  font-weight: bold;
}
#app
  .settlement_detail
  .preferential
  .preferential_title
  .el-button.is-disabled {
  color: #999;
  background-color: #fff;
}
.preferential_title /deep/ span {
  padding-right: 10px !important;
}
.preferential_title .el-icon-arrow-down {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}
.preferential_title .el-icon-arrow-down_up {
  transform: rotateZ(180deg);
}
.preferential_title .gift_text {
  position: absolute;
  left: 10px;
  bottom: 14px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  color: #ff9c00;
}
.preferential_title .benefit_text {
  left: 10px;
}
.preferential_title .giftcard_text {
  left: 202px;
}
.preferential_title .member_text {
  left: 400px;
}
.preferential_title /deep/ span {
  padding-right: 100px;
}
.el-icon-arrow-down.active {
  transform: rotateZ(180deg);
}
.preferential_title .el-icon-arrow-down {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}
.el-icon-arrow-down {
  transition: all 0.5s;
}
</style>
