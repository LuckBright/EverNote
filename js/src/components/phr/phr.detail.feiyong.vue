<template>
    <div class="phr_detail_feiyong">
      <template v-if="costList&&costList.length>0">
        <el-card
          v-for="item in costList"
          :key="item.outpatientFeeId"
          class="box-card"
          shadow="hover">
          <div slot="header" class="clearfix item_header">
            <span>{{item.paymentTime||item.createTime}}</span>
            <span>费用信息</span>
          </div>
          <div class="cost">
            <div class="mb20">
                <span class="title">费用分类明细:</span>
                <el-row>
                  <el-col
                      :span="6"
                      v-for="(constItem, index) in item.costCategories"
                      :key="index"
                  >
                      <span class="item_name">{{constItem.chargeFatherItemClassName}}: </span> <span class="item_price">¥ {{constItem.preAmount|formatToFinacial}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <span class="total">费用合计:¥ {{item.preAmount|formatToFinacial}}</span>
                </el-row>
            </div>
            <div class="mb20">
                <span class="title">优惠详情:</span>
                <el-row class="discount_info" v-if="item.discountAmounts&&item.discountAmounts.length>0">
                  <el-col :span="spans" v-for="(disItem,index) in item.discountAmounts" :key="index">
                    <span class="item_name"> {{disItem.amountOfMoneyName}}:</span> <span class="item_price">¥ {{disItem.medicalInsuranceOrgPaidAmount|formatToFinacial}}</span>
                  </el-col>
                  <!-- <el-col :span="spans">
                    <span class="item_name"> 医保支付金额:</span> <span class="item_price">¥ {{item.medicalInsurancePaidAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">商保支付金额:</span> <span class="item_price">¥ {{item.commercialInsurancePaidAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">大客户支付金额:</span> <span class="item_price">¥ {{item.majorCustomerPaidAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">身份卡优惠金额:</span> <span class="item_price">¥ {{item.identityCardPreferentialAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">储值卡优惠金额:</span> <span class="item_price">¥ {{item.storedValueCardPreferentialAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">优惠券优惠金额:</span> <span class="item_price">¥ {{item.couponPreferentialAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">活动优惠金额:</span> <span class="item_price">¥ {{item.promotionPreferentialAmount|formatToFinacial}}</span>
                  </el-col>
                  <el-col :span="spans">
                    <span class="item_name">套餐抵扣金额:</span> <span class="item_price">¥ {{item.packagesPreferentialAmount|formatToFinacial}}</span>
                  </el-col> -->
                </el-row>
            </div>
            <div>
                <span class="title">支付详情:</span>
                <el-row
                  v-for="(payItem, index) in item.payInfos"
                  :key="index"
                >
                  <el-col>
                      <span class="item_name">{{payItem.paymentMethodName}}:</span>
                      <span class="item_price">¥ {{payItem.paymentAmount|formatToFinacial}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      <span class="item_time">{{payItem.paymentTime}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <span class="total">已付金额:¥ {{item.payInfoAmount|formatToFinacial}}</span>
                </el-row>
            </div>
          </div>
        </el-card>
      </template>
      <template v-else>
        <everNoData tipTxt="暂无数据"></everNoData>  
      </template>   
    </div>
</template>
<script>
import phrTotalApi from '@/workspace/store/phrtotal'
export default {
  props: {
    params: {
      type: Object
    }
  },
  data () {
    return {
      costList: {},
      spans: 12
    }
  },
  created () {
    phrTotalApi.getCost({
      'visitInpatientSerialNumber': this.params.visitSerialNumber,
      'visitTypeCode': this.params.visitTypeCode,
      'orgId': this.params.visitOrgId
    }).then(res => {
      this.costList = res
      // console.log('费用详情', res)
    })
  }
}
</script>
<style lang="scss" scoped>
.cost {
  margin-bottom: 15px;
  padding:10px;
}
.cost .items {
  line-height: 32px;
  font-size: 14px;
  overflow: hidden;
}
.cost b {
  color: #000;
  display: inline-block;
  min-width: 80px;
}
.cost .itemCon {
  color: #2a2a2a;
  font-size: 14px;
  margin: 0;
  padding: 0;
  line-height: 32px;
}
.cost .title {
  display:block;
  font-size: 14px;
  color: #666666;
  font-weight:bold;
  margin-bottom:15px;
}
.phr_detail_feiyong{
  padding-top: 10px;
}
.phr_detail_feiyong /deep/.el-card{
  border-radius:0;
}
.phr_detail_feiyong /deep/.el-card__header{
  border:none;
  background: #F0F5FA;;
  padding:0 10px;
  line-height: 36px;
  border-bottom: 1px solid #DADCE0;
}
.phr_detail_feiyong /deep/.el-card__body{
  padding:0;
}
.phr_detail_feiyong /deep/.el-card__body .el-table{
  margin:0;
}

.item_name{
  font-size: 14px;
  color: #999999;
}
.item_header,.item_price{
  font-size: 14px;
  color: #000000;
}
.item_time{
  font-size: 14px;
  color: #333;
}
.total{
  font-size: 14px;
  color: #EE4433;
}
.box-card{
  margin-bottom:20px;
}
.mb20{
  margin-bottom: 20px;
}
.cost .el-col{
  margin-bottom:15px;
}
</style>

