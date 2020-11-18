<template>
  <div class="print-con table_spe">
    <h4 class="alg_c">预交金收费员汇总表</h4>
    <el-row class="f14">
      <el-col :span="6">
        收款员姓名:
        <!-- 优先处理日结缴款部分从url上带过来的收费员，其次才显示日结本身的收费员 -->
        <span class="ml5">{{ $route.query.operator || prepaymentData.cashierName || ''}}</span>
      </el-col>
      <el-col :span="10">
        上次日结时间:
        <span class="ml5">{{prepaymentData.lastCloseTime || ''}}</span>
      </el-col>
      <el-col v-if="!$route.query.id" :span="8">
        截止时间:
        <span class="ml5">{{$moment().format('YYYY-MM-DD HH:mm:ss')}}</span>
      </el-col>
      <div class="clearfix"></div>
    </el-row>
    <div class="dividing-line mt10"></div>
    <div class="mt10">
      <el-row class="f14">
        <el-col :span="6">打印收据总张数：{{prepaymentData.totalCount || 0}}张</el-col>
        <el-col :span="6">
          收费业务笔数:
          <span class="ml5">{{prepaymentData.chargeCount || 0}}笔</span>
        </el-col>
        <el-col :span="6">
          退费业务笔数:
          <span class="ml5">{{prepaymentData.refundCount || 0}}笔</span>
        </el-col>
        <el-col :span="6">
          应收总金额:
          <span class="ml5">{{prepaymentData.receivableFee | formatToFinacial}}元</span>
        </el-col>
      </el-row>
      <el-row class="f14">
        <el-col :span="6">应交现金：{{totalCash && totalCash.subTotal | formatToFinacial}}元</el-col>
        <el-col :span="18">应交现金大写：{{ (totalCash && totalCash.subTotal || 0) | intToChinese}}</el-col>
      </el-row>
      <div v-if="subTotal.length" class="mt10">
        <table class="calculation-con" style="width: 100%;">
          <tr>
            <th colspan="4"></th>
            <th colspan="4" v-for="(item, i) of subTotal" :key="i">
              <div class="salary" v-if="i != subTotal.length - 1">
                <span v-if="isShowInDialog">{{item.payName}}</span>
                <a v-else class="statement_number" @click="handelGetDetails(item)">{{item.payName}}</a>
              </div>
              <div v-else class="salary">{{item.payName}}</div>
            </th>
          </tr>
          <tr>
            <td colspan="4">收款合计</td>
            <td colspan="4" v-for="(item, i) of subTotal" :key="i">
              <div class="salary">{{item.charge | formatToFinacial}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">退款合计</td>
            <td colspan="4" v-for="(item, i) of subTotal" :key="i">
              <div class="salary">{{item.refund | formatToFinacial}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">小计</td>
            <td colspan="4" v-for="(item, i) of subTotal" :key="i">
              <div class="salary">{{item.subTotal | formatToFinacial}}</div>
            </td>
          </tr>
        </table>
      </div>
      <h5>详细信息</h5>
      <div class="mt10">
        <table class="calculation-con" style="width: 100%;">
          <tr class="depositLogs">
            <th colspan="4" style="word-break: break-all;">收据号</th>
            <th colspan="4">科室</th>
            <th colspan="4">病案号</th>
            <th colspan="4">姓名</th>
            <th colspan="4">业务类型</th>
            <th colspan="4">支付方式</th>
            <th colspan="4" class="detailright">金额</th>
            <th colspan="4">业务时间</th>
            <!-- <th colspan="4">收费员</th> -->
          </tr>
          <template v-if="depositLogs.length">
            <tr v-for="(item, i) of depositLogs" :key="i">
              <td colspan="4" style="word-break: break-all;">{{item.settleCode || ''}}</td>
              <td colspan="4">{{item.deptName || ''}}</td>
              <td colspan="4">{{item.patientNumber || ''}}</td>
              <td colspan="4">{{item.patientName || ''}}</td>
              <td colspan="4">{{item.type || ''}}</td>
              <td colspan="4">{{item.payName || ''}}</td>
              <td colspan="4" class="detailright">{{item.flowFee | formatToFinacial}}</td>
              <td colspan="4">{{item.operateTime || ''}}</td>
              <!-- <td colspan="4">{{item.cashierName || ''}}</td> -->
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="36">暂无数据</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['prepaymentData', 'isShowInDialog'],
  data () {
    return {
      subTotal: [],
      depositLogs: [],
      totalCash: {}
    }
  },
  watch: {
    'prepaymentData': {
      handler: function () {
        this.prepaymentDetails()
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.prepaymentDetails()
  },
  methods: {
    prepaymentDetails () {
      this.subTotal = JSON.parse(JSON.stringify(this.prepaymentData.subTotal))
      this.totalCash = this.subTotal.find((item) => {
        return item.payMethod === 1
      })
      this.depositLogs = JSON.parse(JSON.stringify(this.prepaymentData.depositLogs))
    },
    handelGetDetails (data) {
      this.$emit('getflowfeelist', data.payMethod, data.payName)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
</style>

<style lang="less" scoped>
.calculation-con {
  border-collapse: collapse;
}
.calculation-con,
td,
th {
  border: 1px solid #000000;
  text-align: center;
}
.calculation-con tr th {
  background-color: #eee;
  font-weight: 700;
}
.calculation-con tr > td,
th {
  padding: 10px;
  line-height: 20px;
  vertical-align: baseline;
  overflow: hidden;
}
.depositLogs > th {
  background-color: #eeeeee;
}
.print-con {
  padding: 0 40px;
}
.print-con .clearfix {
  clear: both;
}
.dividing-line {
  border-bottom: 2px solid #eeeeee;
}
.statement_number {
  cursor: pointer;
  color: #1c7bef;
}
.f14 {
  line-height: 22px;
}
.salary {
  text-align: right;
  padding-right: 10px;
}
.detailright {
  text-align: right;
  white-space: nowrap;
}
#app {
  min-width: 0 !important;
}
@media print {
  .f14 {
    font-size: 12px;
  }
}
</style>

