<template>
  <div>
    <div class="table_spe">
      <h3 class="print_header center">{{title}}</h3>
      <table class="center">
        <thead>
          <tr>
            <td>收款员</td>
            <td>{{operator}}</td>
            <td>上次日结时间</td>
            <td class="alg_r">
              <template v-if="!preCloseTime">{{closeDate}}</template>
              <template v-if="preCloseTime">{{preCloseTime}}</template>
              <span class="s">共 {{totalCount}} 张</span>
            </td>
            <!-- <td v-if="!preCloseTime">{{closeDate}}</td><td v-if="preCloseTime">{{preCloseTime}}</td><td>共 {{totalCount}} 张</td> -->
          </tr>
        </thead>
        <tbody>
          <tr v-if="closeBillItems.length">
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
                          <tr v-if="dailySettlementDetail[0] && dailySettlementDetail[0].length" v-for="item in dailySettlementDetail[0]">
                            <td>{{item.itemClassName}}</td>
                            <td>{{item.fee | formatToFinacial(0)}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="no_padding alg_top" v-if="dailySettlementDetail[1] && dailySettlementDetail[1].length">
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <td>收费类别</td>
                            <td>金额</td>
                          </tr>
                          <tr v-for="item in dailySettlementDetail[1]">
                            <td>{{item.itemClassName}}</td>
                            <td>{{item.fee | formatToFinacial(0)}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr v-if="totalNum || totalNum === 0">
            <td>小计</td>
            <td class="alg_l">{{totalNum | formatToFinacial}}</td>
            <td>大写</td>
            <td class="alg_l">{{totalNum | intToChinese}}</td>
          </tr>
          <!-- <tr v-if="totalNum || totalNum === 0">
          <td>大写</td><td colspan="3" class="alg_l">{{totalNum | intToChinese}}</td>
        </tr> -->
          <tr v-if="(paymentids && paymentids.length) || (receivable && receivable.length)">
            <td class="middle" rowspan="6">其中</td>
          </tr>
          <tr v-if="(paymentids && paymentids.length) || (receivable && receivable.length)">
            <td colspan="4" class="no_padding">
              <table class="inner_table bom_bor">
                <tbody>
                  <tr>
                    <td class="no_padding" v-if="paymentids && paymentids.length">
                      <table class="inner_table center">
                        <tbody>
                          <tr v-for="item in paymentids" key="index">
                            <template>
                              <td>
                                <a href="javascript:void(0)" @click="getflowfeelist(item.payMethod, item.name)">{{item.name}}</a>
                              </td>
                              <td>{{item.fee | formatToFinacial}}</td>
                            </template>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td v-if="receivable && receivable.length" class="no_padding">
                      <table class="inner_table center">
                        <tbody>
                          <tr v-for="(item,index) in receivable" key="index">
                            <template v-for="(key,value) in item">
                              <td>{{value}}</td>
                              <td>{{key | formatToFinacial}}</td>
                            </template>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="print_footer_txt">
        <el-row class="bom_bor">
          <el-col :span="7">制表：
            <span>{{operator}}</span>
          </el-col>
          <el-col :span="7" :offset="1">复核：
            <span>&nbsp;&nbsp;&nbsp;</span>
          </el-col>
          <el-col :span="7" :offset="1">制表日期：
            <span>{{date}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">应收合计：
            <span>{{totalNum | formatToFinacial}}</span>
          </el-col>
          <el-col v-for="(item,index) in payment" key="index" :span="4" :offset="1">
            <template v-for="(key,value) in item">
              {{value}}：
              <span>{{key | formatToFinacial}}</span>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">收费员签字：
            <span>　</span>
          </el-col>
          <el-col :span="8" :offset="8">出纳签字：
            <span>　</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'operator',
    'closeDate',
    'closeBillItems',
    'dailySettlementDetail',
    'totalNum',
    'payment',
    'paymentids',
    'receivable',
    'title',
    'totalCount',
    'date',
    'preCloseTime'
  ],
  data () {
    return {}
  },
  methods: {
    getflowfeelist (methods, name) {
      this.$emit('getflowfeelist', methods, name)
    }
  }
}
</script>
<style lang="scss" scoped>
body {
  width: 95%;
}
@import "src/assets/css/spe_table";
.print_header {
  display: block;
}
.table_spe {
  font-family: "微软雅黑";
  color: #000;
  margin-left:50px;
}
.s{display: inline-block;
    border-left: 1px solid #000;
    padding:0 30px 0 20px;
    margin: -10px 0;
    line-height: 40px;}
</style>
