<template>
  <div>
    <div class="table_spe ml50">
      <!-- <div class="table_spe ml50"> -->
      <h3 class="print_header center">住院日结</h3>
      <el-row class="f14">
        <el-col :span="8">
          收款员姓名:
          <span class="ml5">{{obj.cashierName}}</span>
        </el-col>
        <el-col :span="16">
          上次日结时间:
          <span
            class="ml5"
          >{{obj.lastCloseTime ? $moment(obj.lastCloseTime).format('YYYY-MM-DD HH:mm:ss'):''}}</span>
        </el-col>
        <div class="clearfix"></div>
      </el-row>
      <div class="dividing-line"></div>
      <div class="mt10">
        <el-row class="f14">
          <el-col :span="6">应收金额：{{obj.receivableFee | formatToFinacial}}元</el-col>
          <el-col :span="6">实收金额：{{obj.receivedFee | formatToFinacial}}元</el-col>
          <el-col :span="6">退款合计：{{obj.totalFeeF | formatToFinacial}}元</el-col>
          <el-col v-if="isShowInDialog" :span="6">打印收据总张数：{{obj.totalCount}}张</el-col>
          <el-col v-else :span="6">
            打印收据总张数：
            <span class="statement_number" @click="getBillDetail">{{obj.totalCount}}</span>张
          </el-col>
          <div class="clearfix"></div>
        </el-row>
        <el-row class="f14">
          <el-col :span="6">尾差金额：{{obj.diff | formatToFinacial(6)}}元</el-col>
          <el-col :span="6">抹零金额：{{obj.wipeOffFee | formatToFinacial}}元</el-col>
          <el-col :span="6">应交现金：{{obj.totalCash | formatToFinacial}}元</el-col>
          <el-col :span="6">应交现金大写：{{(obj.totalCash || 0) | intToChinese}}</el-col>
          <div class="clearfix"></div>
        </el-row>
      </div>
      <!-- 收款退款合计 -->
      <table>
        <tbody>
          <tr>
            <th colspan="4"></th>
            <th colspan="4" v-for="(item, i) of obj.paymentids" :key="i">
              <div class="salary" v-if="(i != obj.paymentids.length - 1)&&!isShowInDialog">
                <a
                  class="statement_number"
                  @click="getflowfeelist(item.payMethod,item.payName)"
                >{{item.payName}}</a>
              </div>
              <div v-else class="salary">{{item.payName}}</div>
            </th>
            <th>
              <div class="salary">
                <span v-if="isShowInDialog">冲预交金</span>
                <a v-else class="statement_number" @click="getflowfeelist(1000, '冲预交金')">冲预交金</a>
              </div>
            </th>
          </tr>
          <tr>
            <td colspan="4">收预交金</td>
            <td colspan="4" v-for="(item, i) of obj.paymentids" :key="i">
              <div class="salary">{{item.depositLog | formatToFinacial}}</div>
            </td>
            <td colspan="4" rowspan="5" class="prepaymentFee">
              <div class="salary">
                <a>{{obj.prepaymentFee | formatToFinacial}}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4">退预交金</td>
            <td colspan="4" v-for="(item, i) of obj.paymentids" class="noWrap" :key="i">
              <div class="salary">{{item.depositLogF | formatToFinacial}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">出院收款</td>
            <td colspan="4" v-for="(item, i) of obj.paymentids" class="noWrap" :key="i">
              <div class="salary">{{item.feeLogs | formatToFinacial}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">出院退款</td>
            <td colspan="4" v-for="(item, i) of obj.paymentids" class="noWrap" :key="i">
              <div class="salary">{{item.feeLogsF | formatToFinacial}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">小计</td>
            <td
              colspan="4"
              v-for="(item, i) of obj.paymentids"
              :key="i"
              :class="{noWrap:(Number(item.sumZF)<0)}"
            >
              <div class="salary">{{item.sumZF | formatToFinacial}}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 费用分类 -->
      <h5>费用分类</h5>
      <table class="center">
        <tbody>
          <tr>
            <td colspan="4" class="no_padding">
              <table class="inner_table">
                <tbody>
                  <tr>
                    <td class="no_padding alg_top">
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <th>收费类别</th>
                            <th>
                              <div class="salary">金额</div>
                            </th>
                          </tr>
                          <template>
                            <tr v-for="(item, i) in obj.dailySettlementDetail[0]" :key="i">
                              <td>{{item.itemClassName}}</td>
                              <td>
                                <div class="salary">{{item.fee | formatToFinacial(0)}}</div>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </td>
                    <td class="no_padding alg_top">
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <th>收费类别</th>
                            <th>
                              <div class="salary">金额</div>
                            </th>
                          </tr>
                          <tr v-for="(item, i) in obj.dailySettlementDetail[1]" :key="i">
                            <td>{{item.itemClassName}}</td>
                            <td>
                              <div class="salary">{{item.fee | formatToFinacial(0)}}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="no_padding alg_top">
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <th>收费类别</th>
                            <th>
                              <div class="salary">金额</div>
                            </th>
                          </tr>
                          <tr v-for="(item, i) in obj.dailySettlementDetail[2]" :key="i">
                            <td>{{item.itemClassName}}</td>
                            <td>
                              <div class="salary">{{item.fee | formatToFinacial(0)}}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr v-if="obj.subTotal || obj.subTotal === 0">
            <td>大写金额</td>
            <td class="alg_l">{{obj.subTotal | intToChinese}}</td>
          </tr>
        </tbody>
      </table>
      <!-- 预交金 -->
      <h5>预交金</h5>
      <table>
        <tbody>
          <tr>
            <td colspan="4"></td>
            <td colspan="4" v-for="(item, i) of obj.sortLogs" :key="i">
              <div class="salary">{{item.sortName}}</div>
            </td>
            <td colspan="4">
              <div class="salary">合计</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">金额</td>
            <td colspan="4" v-for="(item, i) of obj.sortLogs" :key="i">
              <div class="salary">{{item.flowFee | formatToFinacial}}</div>
            </td>
            <td colspan="4">
              <div class="salary">{{obj.sortLogsFee | formatToFinacial}}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 表底部 -->
      <div class="print_footer_txt">
        <el-row class="bom_bor">
          <el-col :span="8">
            制表：
            <span>{{obj.operator}}</span>
          </el-col>
          <el-col :span="8">
            复核：
            <span>&nbsp;&nbsp;&nbsp;</span>
          </el-col>
          <el-col :span="8">
            制表日期：
            <span>{{obj.date}}</span>
          </el-col>
          <div class="clearfix"></div>
        </el-row>
        <el-row>
          <el-col :span="6">
            应收合计:
            <span>{{obj.receivableFee | formatToFinacial}}元</span>
          </el-col>
          <el-col :span="6">
            优惠金额:
            <span>{{obj.totalBenefit | formatToFinacial}}元</span>
          </el-col>
          <el-col :span="6">
            实收金额:
            <span>{{obj.receivedFee | formatToFinacial}}元</span>
          </el-col>
          <el-col :span="6">
            预交金额:
            <span>{{obj.sortLogsFee | formatToFinacial}}元</span>
          </el-col>
          <div class="clearfix"></div>
        </el-row>
        <el-row>
          <el-col :span="12">
            收费员签字：
            <span></span>
          </el-col>
          <el-col :span="12">
            出纳签字：
            <span></span>
          </el-col>
          <div class="clearfix"></div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * props                            字段含义
 * @param totalBenefit              优惠金额
 * @param receivableFee             应收合计
 * @param receivedFee               实收金额
 * @param subTotal                  小计
 * @param closeDate                 上次日结时间
 * @param operator                  收银员，制表
 * @param paymentids                支付方式（其中）
 * @param dailySettlementDetail     收费类别
 * @param title                     标题
 * @param prepaymentFee             预交金
 */
export default {
  props: ['obj', 'isShowInDialog'],
  methods: {
    getflowfeelist (methods, name) {
      this.$emit('getflowfeelist', methods, name)
    },
    getBillDetail () {
      this.$emit('getBillDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
@media print {
  #page1 {
    width: 100%;
    .ml50 {
      margin-left: 0px;
    }
  }
}
body {
  min-width: 95% !important;
  width: 95% !important;
}
.print_header {
  display: block;
}
.table_spe {
  font-family: "微软雅黑";
  color: #000;
}
.ml50 {
  margin-left: 50px;
}
.dividing-line {
  border-bottom: 2px solid #eeeeee;
  margin: 10px 0;
}
.f14 {
  font-size: 14px;
  line-height: 22px;
}
.mt10 {
  margin: 10px 0;
}
.statement_number {
  cursor: pointer;
  color: #1c7bef;
}

td.prepaymentFee {
  color: #ee4433;
  vertical-align: middle !important;
}
td.noWrap {
  white-space: nowrap;
}
.table_spe table tbody tr th {
  font-weight: 700;
  background: #eee;
}
.salary {
  text-align: right;
  padding-right: 10px;
}
</style>
