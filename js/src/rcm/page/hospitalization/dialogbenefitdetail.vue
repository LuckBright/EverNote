<template>
  <div class="benefit_dialog">
    <h4 class="dialogbenefitdetailtitle">身份卡</h4>
    <el-table border :data="obj.details.ipSettleBenefitcard" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.showArr"
            style="width: 100%"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-table-column show-overflow-tooltip prop="itemName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
            <el-table-column show-overflow-tooltip prop="quantity" label="数量" align="right"></el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
            <el-table-column show-overflow-tooltip prop="price" label="单价" align="right">
              <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="fee" label="金额" align="right">
              <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center"></el-table-column>
      <el-table-column label="有效期" prop="validPeriod" align="center"></el-table-column>
      <el-table-column label="折扣" prop="discount" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.discount">{{scope.row.discount && scope.row.discount/10}}</template>
          <template v-else-if="scope.row.discountRule">{{scope.row.discountRuleName}}</template>
          <template v-else>无</template>
        </template>
      </el-table-column>
      <el-table-column label="优惠总额" prop="benefitFee" align="center">
        <template slot-scope="scope">{{scope.row.benefitFee | formatToFinacial}}</template>
      </el-table-column>
    </el-table>

    <h4 class="dialogbenefitdetailtitle">优惠券</h4>
    <el-table :data="obj.details.ipSettleGiftcard" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.showArr"
            style="width: 100%"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-table-column show-overflow-tooltip prop="itemName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
            <el-table-column show-overflow-tooltip prop="quantity" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
            <el-table-column show-overflow-tooltip prop="price" label="单价">
              <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="fee" label="金额">
              <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center"></el-table-column>
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope">{{giftcardStr[scope.row.type]}}</template>
      </el-table-column>
      <el-table-column label="面额" prop="money" align="center"></el-table-column>
      <el-table-column label="使用数量" prop="useCount" align="center"></el-table-column>
      <el-table-column label="优惠总额" prop="giftcardFee" align="center">
        <template slot-scope="scope">{{scope.row.giftcardFee | formatToFinacial}}</template>
      </el-table-column>
    </el-table>

    <h4 class="dialogbenefitdetailtitle">储值卡</h4>
    <el-table :data="obj.details.ipSettleMembercard" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.showArr"
            style="width: 100%"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-table-column show-overflow-tooltip prop="itemName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
            <el-table-column show-overflow-tooltip prop="quantity" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
            <el-table-column show-overflow-tooltip prop="price" label="单价">
              <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="fee" label="金额">
              <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center"></el-table-column>
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope">{{ scope.row.type === '1' ? '储值卡' : '打折卡' }}</template>
      </el-table-column>
      <el-table-column label="有效期" prop="endDate" align="center"></el-table-column>
      <el-table-column label="折扣" prop="discount" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.discount">{{scope.row.discount && scope.row.discount/10}}</template>
          <template v-else-if="scope.row.discountRule">{{scope.row.discountRuleName}}</template>
          <template v-else>无</template>
        </template>
      </el-table-column>
      <el-table-column label="可用余额" prop="storedMoney" align="center">
        <template slot-scope="scope">{{scope.row.storedMoney | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="可用点卡" prop="givedMoney" align="center">
        <template slot-scope="scope">{{scope.row.givedMoney | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="本次使用金额" prop="usedStoredMoney" align="center">
        <template slot-scope="scope">{{scope.row.usedStoredMoney | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="本次使用点卡" prop="usedGivedMoney" align="center">
        <template slot-scope="scope">{{scope.row.usedGivedMoney | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="剩余可用金额" prop align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.storedMoney - scope.row.usedStoredMoney) | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="剩余可用点卡" prop align="center">
        <template
          slot-scope="scope"
        >{{(scope.row.givedMoney - scope.row.usedGivedMoney) | formatToFinacial}}</template>
      </el-table-column>
    </el-table>
    <h4 class="dialogbenefitdetailtitle">活动</h4>
    <el-table :data="obj.details.ipSettlePromotion" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.showArr"
            style="width: 100%"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-table-column show-overflow-tooltip prop="itemName" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
            <el-table-column show-overflow-tooltip prop="quantity" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
            <el-table-column show-overflow-tooltip prop="price" label="单价">
              <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="fee" label="金额">
              <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center"></el-table-column>
      <el-table-column label="活动开始时间" prop="startDate" align="center"></el-table-column>
      <el-table-column label="活动结束时间" prop="endDate" align="center"></el-table-column>
      <el-table-column label="折扣" prop="discount" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.discount">{{scope.row.discount && scope.row.discount/10}}</template>
          <template v-else-if="scope.row.discountRule">{{scope.row.discountRuleName}}</template>
          <template v-else>无</template>
        </template>
      </el-table-column>
      <el-table-column label="减免金额" prop="saleMoney" align="center">
        <template slot-scope="scope">{{scope.row.saleMoney | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="活动金额" prop="promotionFee" align="center">
        <template slot-scope="scope">{{scope.row.promotionFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="备注" prop="remarks" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script type="text/javascript">
export default {
  props: ['obj'],
  data () {
    return {
      giftcardStr: {
        1: '满减券',
        2: '立减券',
        3: '体验券'
      }
    }
  }
}
</script>
<style scoped>
.dialogbenefitdetailtitle {
  font-size: 14px;
}
.benefit_dialog .el-table .el-table {
  margin: 0;
}
.benefit_dialog .el-table__expanded-cell {
  padding: 0;
}
</style>
