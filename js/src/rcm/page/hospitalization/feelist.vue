<template>
  <div>
    <div class="settlement_detaillist">
      <el-row>
        <el-col :span="6" class></el-col>
        <el-col :span="6" class="list_item">
          <el-row>
            <el-col :span="12" class="settlement_detail_label">本次费用总额：</el-col>
            <el-col :span="12" class="settlement_detail_money">{{obj.totalFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">自费折扣：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.discountFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">活动优惠：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.promotionFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">身份卡优惠：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.benefitCardFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">会员卡支付金额：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.memberCardPayedFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">会员卡优惠金额：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.memberCardBenefitFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">优惠券：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.giftCardFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">押金总额：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.totalDeposit | formatToFinacial}}</el-col>
          </el-row>
          <!-- 中途结算不显示该字段 -->
          <el-row v-if="obj.receivableFee<0 && $route.query.source!='half'">
            <el-col :span="12" class="settlement_detail_label">退款金额：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.receivableFee | formatToFinacial}}</el-col>
          </el-row>
          <!-- 中途结算不显示该字段 -->
          <el-row v-if="obj.receivableFee>0 && $route.query.source!='half'">
            <el-col
              :span="12"
              class="settlement_detail_label"
            >{{obj.isRefund ? '退款金额：' : '实际应收金额：'}}</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.receivableFee | formatToFinacial}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="list_item">
          <el-row>
            <el-col :span="12" class="settlement_detail_label">基金支付金额：</el-col>
            <el-col :span="12" class="settlement_detail_money">{{obj.medFundFee | formatToFinacial}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="settlement_detail_label">个人账户支付金额：</el-col>
            <el-col
              :span="12"
              class="settlement_detail_money"
            >{{obj.medPersonCountFee | formatToFinacial}}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: ['obj'],
  data () {
    return {
      //   obj: {
      //     comInvChecked: true
      //   }
    }
  },
  methods: {
    changeCardStaus () { }
  }
}
</script>
<style scoped>
.settlement_detail_label {
  color: #999;
}
.settlement_detaillist .list_item {
  float: right;
  padding-right: 20px;
}
.settle_totalFee {
  height: 54px;
  line-height: 54px;
  font-size: 14px;
  color: #999;
  text-align: right;
}
.settle_needpay {
  line-height: 64px;
  height: 64px;
  color: #999;
  font-size: 14px;
  text-align: right;
}
.settlement_detaillist {
  height: 100%;
  margin-top: 15px;
  width: 100%;
  border-radius: 4px;
  background: #f8f8f8;
  clear: both;
  font-size: 14px;
  text-align: right;
  line-height: 28px;
}
.settle_needpay span {
  color: #ff9c00;
  font-size: 24px;
}
.settle_btngroup {
  clear: both;
  height: 40px;
  margin: 10px 0 10px;
}
</style>

