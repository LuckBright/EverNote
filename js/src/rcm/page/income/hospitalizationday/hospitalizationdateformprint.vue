<template>
  <div>
    <div class="table_spe ml50">
      <!-- <div class="table_spe ml50"> -->
      <h3 class="print_header center">{{dateForm.title}}</h3>
      <el-row class="f14">
        <el-col :span="8">
          收款员姓名:
          <span class="ml5">{{dateForm.operator}}</span>
        </el-col>
        <el-col :span="16">
          上次日结时间:
          <span
            class="ml5"
          >{{(dateForm.closeDate!=='--') ?$moment(dateForm.closeDate).format('YYYY-MM-DD HH:mm:ss'):''}}</span>
        </el-col>
        <div class="clearfix"></div>
      </el-row>
      <div class="dividing-line"></div>
      <div class="mt10">
        <el-row class="f14">
          <el-col :span="6">应收金额：{{dateForm.receivableFee | formatToFinacial}}元</el-col>
          <el-col :span="6">实收金额：{{dateForm.receivedFee | formatToFinacial}}元</el-col>
          <el-col :span="6">退款合计：{{dateForm.totalFeeF | formatToFinacial}}元</el-col>
          <el-col v-if="isShowInDialog" :span="6">打印收据总张数：{{dateForm.totalCount}}张</el-col>
          <el-col v-else :span="6">
            打印收据总张数：
            <span class="statement_number" @click="getBillDetail">{{dateForm.totalCount}}</span>张
          </el-col>
          <div class="clearfix"></div>
        </el-row>
        <el-row class="f14">
          <el-col :span="6">尾差金额：{{dateForm.diff | formatToFinacial(6)}}元</el-col>
          <el-col :span="6">抹零金额：{{dateForm.wipeOffFee | formatToFinacial}}元</el-col>
          <el-col :span="6">应交现金：{{dateForm.totalCash | formatToFinacial}}元</el-col>
          <el-col :span="6">应交现金大写：{{(dateForm.totalCash || 0) | intToChinese}}</el-col>
          <div class="clearfix"></div>
        </el-row>
      </div>
      <table>
        <tbody>
          <tr>
            <th colspan="4"></th>
            <th colspan="4" v-for="(item, i) of dateForm.paymentids" :key="i">
              <div class="salary" v-if="i != dateForm.paymentids.length - 1">
                <span v-if="isShowInDialog">{{item.payName}}</span>
                <a
                  v-else
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
            <td colspan="4">收款合计</td>
            <td colspan="4" v-for="(item, i) of dateForm.paymentids" :key="i">
              <div class="salary">{{item.flowFee | formatToFinacial}}</div>
            </td>
            <td colspan="4" rowspan="3" class="prepaymentFee">
              <div class="salary">
                <a>{{dateForm.prepaymentFee | formatToFinacial}}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4">退款合计</td>
            <td colspan="4" v-for="(item, i) of dateForm.paymentids" class="noWrap" :key="i">
              <div class="salary">{{item.flowFeeF | formatToFinacial}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="4">小计</td>
            <td
              colspan="4"
              v-for="(item, i) of dateForm.paymentids"
              :key="i"
              :class="{noWrap:(Number(item.sumZF)<0)}"
            >
              <div class="salary">{{item.sumZF | formatToFinacial}}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <h5>详细信息</h5>
      <table class="center">
        <tbody>
          <tr v-if="dateForm.closeBillItems.length">
            <td colspan="4" class="no_padding">
              <table class="inner_table">
                <tbody>
                  <tr>
                    <td class="no_padding alg_top">
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <td>收费类别</td>
                            <td>金额</td>
                          </tr>
                          <template
                            v-if="dateForm.dailySettlementDetail[0] && dateForm.dailySettlementDetail[0].length"
                          >
                            <tr v-for="(item, i) in dateForm.dailySettlementDetail[0]" :key="i">
                              <td>{{item.itemClassName}}</td>
                              <td>
                                <div class="salary">{{item.fee | formatToFinacial(0)}}</div>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </td>
                    <td
                      class="no_padding alg_top"
                      v-if="dateForm.dailySettlementDetail[1] && dateForm.dailySettlementDetail[1].length"
                    >
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <td>收费类别</td>
                            <td>金额</td>
                          </tr>
                          <tr v-for="(item, i) in dateForm.dailySettlementDetail[1]" :key="i">
                            <td>{{item.itemClassName}}</td>
                            <td>
                              <div class="salary">{{item.fee | formatToFinacial(0)}}</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td
                      class="no_padding alg_top"
                      v-if="dateForm.dailySettlementDetail[2] && dateForm.dailySettlementDetail[2].length"
                    >
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <td>收费类别</td>
                            <td>金额</td>
                          </tr>
                          <tr v-for="(item, i) in dateForm.dailySettlementDetail[2]" :key="i">
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
          <tr v-if="dateForm.subTotal">
            <td>大写金额</td>
            <td class="alg_l">{{dateForm.subTotal | intToChinese}}</td>
          </tr>
        </tbody>
      </table>
      <div class="print_footer_txt">
        <el-row class="bom_bor">
          <el-col :span="8">
            制表：
            <span>{{dateForm.operator}}</span>
          </el-col>
          <el-col :span="8">
            复核：
            <span>&nbsp;&nbsp;&nbsp;</span>
          </el-col>
          <el-col :span="8">
            制表日期：
            <span>{{dateForm.date}}</span>
          </el-col>
          <div class="clearfix"></div>
        </el-row>
        <el-row>
          <el-col :span="6">
            应收合计:
            <span>{{dateForm.receivableFee | formatToFinacial}}</span>
          </el-col>
          <el-col :span="6">
            优惠金额:
            <span>{{dateForm.totalBenefit | formatToFinacial}}元</span>
          </el-col>
          <el-col :span="6">
            实收金额:
            <span>{{dateForm.receivedFee | formatToFinacial}}元</span>
          </el-col>
          <el-col :span="6">
            预交金额:
            <span>{{dateForm.prepaymentFee | formatToFinacial}}元</span>
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
  props: ['dateForm', 'isShowInDialog'],
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
.table_spe table tbody tr th {
  font-weight: 700;
  background: #eee;
}
td.prepaymentFee {
  color: #ee4433;
  vertical-align: middle !important;
}
td.noWrap {
  white-space: nowrap;
}
.salary {
  text-align: right;
  padding-right: 10px;
}
</style>
