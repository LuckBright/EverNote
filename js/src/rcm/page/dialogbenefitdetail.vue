<template>
  <div class="benefit_dialog">
    <h4 class="dialogbenefitdetailtitle" v-if="(obj.details.settlementBenefitDet.length && obj.settlestatus === '3') || obj.settlestatus === '0'">身份卡</h4>
    <el-table
      :data="obj.details.settlementBenefitDet"
      style="width: 100%"
      v-if="(obj.details.settlementBenefitDet.length && obj.settlestatus === '3') || obj.settlestatus === '0'">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
        <el-table
          :data="scope.row.showArr"
          style="width: 100%"
          label-position="left"
          inline
          class="demo-table-expand">
          <el-table-column show-overflow-tooltip
            prop="itemname"
            label="名称">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="spec"
            label="规格">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="quantity"
            label="数量">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="unit"
            label="单位">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="price"
            label="单价">
            <template slot-scope="scope">
              {{scope.row.price | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="fee"
            label="金额">
            <template slot-scope="scope">
              {{scope.row.fee | formatToFinacial}}
            </template>
          </el-table-column>
        </el-table>
        </template>
      </el-table-column>
      <el-table-column
      label="名称"
      prop="name"
      align="center">
      </el-table-column>
      <el-table-column
      label="有效期"
      prop="validPeriod"
      align="center">
      </el-table-column>
      <el-table-column
      label="单一折扣"
      prop="discount"
      align="center">
      <template slot-scope="scope">
        {{scope.row.discount && scope.row.discount/10}}
      </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
        label="折扣规则"
        align="center">
        <template slot-scope="scope">
        {{obj.selftariffsObj[scope.row.discountRule]}}
        </template>
      </el-table-column>
      <el-table-column
      label="优惠总额"
      prop="benefitFee"
      align="center">
      <template slot-scope="scope">
        {{scope.row.benefitFee | formatToFinacial}}
      </template>
      </el-table-column>
    </el-table>

    <h4 class="dialogbenefitdetailtitle" v-if="(obj.details.settlementCouponDet.length && obj.settlestatus === '3') || obj.settlestatus === '0'">优惠券</h4>
    <el-table
      :data="obj.details.settlementCouponDet"
      style="width: 100%"
      v-if="(obj.details.settlementCouponDet.length && obj.settlestatus === '3') || obj.settlestatus === '0'">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.showArr"
            style="width: 100%"
            label-position="left"
            inline
            class="demo-table-expand">
            <el-table-column show-overflow-tooltip
              prop="itemname"
              label="名称">
            </el-table-column>
            <el-table-column show-overflow-tooltip
              prop="spec"
              label="规格">
            </el-table-column>
            <el-table-column show-overflow-tooltip
              prop="quantity"
              label="数量">
            </el-table-column>
            <el-table-column show-overflow-tooltip
              prop="unit"
              label="单位">
            </el-table-column>
            <el-table-column show-overflow-tooltip
              prop="price"
              label="单价">
              <template slot-scope="scope">
                {{scope.row.price | formatToFinacial}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip
              prop="fee"
              label="金额">
              <template slot-scope="scope">
                {{scope.row.fee | formatToFinacial}}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
      label="名称"
      prop="couponName"
      align="center">
      </el-table-column>
      <el-table-column
      label="类型"
      prop="type"
      align="center">
      <template slot-scope="scope">
        {{giftcardStr[scope.row.type]}}
      </template>
      </el-table-column>
      <el-table-column
      label="面额"
      prop="amount"
      align="center">
      </el-table-column>
      <el-table-column
      label="使用数量"
      prop=""
      align="center">
      <template slot-scope="scope">
      1
      <!-- 1 默认为1 于强确认 -->
      </template>
      </el-table-column>
      <el-table-column
      label="优惠总额"
      prop="disamount"
      align="center">
        <template slot-scope="scope">
          {{scope.row.disamount | formatToFinacial}}
        </template>
      </el-table-column>
    </el-table>

    <h4 class="dialogbenefitdetailtitle" v-if="(obj.details.settlementMemberDet.length && obj.settlestatus === '3') || obj.settlestatus === '0'">储值卡</h4>
    <el-table
      :data="obj.details.settlementMemberDet"
      style="width: 100%"
      v-if="(obj.details.settlementMemberDet.length && obj.settlestatus === '3') || obj.settlestatus === '0'">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
        <el-table
          :data="scope.row.showArr"
          style="width: 100%"
          label-position="left"
          inline
          class="demo-table-expand">
          <el-table-column show-overflow-tooltip
            prop="itemname"
            label="名称">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="spec"
            label="规格">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="quantity"
            label="数量">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="unit"
            label="单位">
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="price"
            label="单价">
            <template slot-scope="scope">
              {{scope.row.price | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip
            prop="fee"
            label="金额">
            <template slot-scope="scope">
              {{scope.row.fee | formatToFinacial}}
            </template>
          </el-table-column>
        </el-table>
        </template>
      </el-table-column>
      <el-table-column
      label="名称"
      prop="name"
      align="center">
      </el-table-column>
      <el-table-column
      label="类型"
      prop="type"
      align="center">
      <template slot-scope="scope">
        {{ scope.row.type === '1' ? '储值卡' : '打折卡' }}
      </template>
      </el-table-column>
      <el-table-column
      label="有效期"
      prop="endDate"
      align="center">
      </el-table-column>
      <el-table-column
      label="折扣"
      prop="discount"
      align="center">
      <template slot-scope="scope">
        {{scope.row.discount && scope.row.discount/10}}
      </template>
      </el-table-column>
      <el-table-column
      label="可用余额"
      prop="amount"
      align="center">
        <template slot-scope="scope">
          {{scope.row.amount | formatToFinacial}}
        </template>
      </el-table-column>
      <el-table-column
      label="可用点卡"
      prop="presentAmount"
      align="center">
        <template slot-scope="scope">
          {{scope.row.presentAmount | formatToFinacial}}
        </template>
      </el-table-column>
      <el-table-column
      label="本次使用金额"
      prop="useAmount"
      align="center">
        <template slot-scope="scope">
          {{scope.row.useAmount | formatToFinacial}}
        </template>
      </el-table-column>
      <el-table-column
      label="本次使用点卡"
      prop="usePreAmount"
      align="center">
        <template slot-scope="scope">
          {{scope.row.usePreAmount | formatToFinacial}}
        </template>
      </el-table-column>
      <el-table-column
      label="剩余可用金额"
      prop=""
      align="center">
        <template slot-scope="scope">
          {{(scope.row.amount - scope.row.useAmount) | formatToFinacial}}
        </template>
      </el-table-column>
      <el-table-column
      label="剩余可用点卡"
      prop=""
      align="center">
        <template slot-scope="scope">
        {{(scope.row.presentAmount - scope.row.usePreAmount) | formatToFinacial}}
        </template>
      </el-table-column>
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
  .dialogbenefitdetailtitle { font-size: 14px; }
  .benefit_dialog .el-table .el-table { margin: 0; }
  .benefit_dialog .el-table__expanded-cell { padding: 0; }
</style>
