<template>
  <div>
    <div class="table_spe">
      <h3 class="print_header center">{{title}}</h3>
      <table class="center">
        <thead>
          <tr>
            <td>收款员</td>
            <td>{{printData.createUser}}</td>
            <td>上次日结时间</td>
            <td class="alg_l">
              <div class="pCountBox">
                <template v-if="printData.closeTime">{{printData.closeTime}}</template>
                <span class="pCount">共 {{printData.count}} 张</span>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-if="printData.accountType">
            <td colspan="4" class="no_padding">
              <table class="inner_table">
                <tbody>
                  <tr>
                    <td class="no_padding alg_top" v-if="printData.accountType">
                      <table class="inner_table center">
                        <tbody>
                          <tr>
                            <td>收费类别</td>
                            <td>金额</td>
                          </tr>
                          <tr v-for="(value,key) in printData.accountType" :key='key'>
                            <td>{{key}}</td>
                            <td>{{value | formatToFinacial(0)}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr v-if="printData.flowFee || printData.flowFee === 0">
            <td>小计</td>
            <td class="alg_l">{{printData.flowFee | formatToFinacial}}</td>
            <td>大写</td>
            <td class="alg_l">{{printData.upperCase}}</td>
          </tr>
          <!-- <tr v-if="(paymentids && paymentids.length) || (receivable && receivable.length)">
            <td class="middle" rowspan="6">其中</td>
          </tr> -->
          <tr v-if="printData.paymethodSum">
            <td colspan="4" class="no_padding">
              <table class="inner_table bom_bor">
                <tbody>
                  <tr>
                    <td class="no_padding" v-if="printData.paymethodSum">
                      <table class="inner_table center">
                        <tbody>
                          <tr v-for="(value,key) in printData.paymethodSum" :key="key">
                            <template>
                              <td>
                                <!-- <a href="javascript:void(0)">{{key}}</a> -->
                                <a href="javascript:void(0)" @click="getflowfeelist(key)">{{key}}</a>
                              </td>
                              <td>{{value | formatToFinacial}}</td>
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
            <span>{{printData.createUser}}</span>
          </el-col>
          <el-col :span="7" :offset="1">复核：
            <span>&nbsp;&nbsp;&nbsp;</span>
          </el-col>
          <el-col :span="7" :offset="1">制表日期：
            <span>{{printData.newTime}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">总金额：
            <span>{{printData.flowFee | formatToFinacial}}</span>
          </el-col>
          <el-col v-for="(value,key) in printData.paymethodSum" :key="key" :span="4" :offset="1">
            <template>
              {{key}}：
              <span>{{value | formatToFinacial}}</span>
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
    'title',
    'printData'
  ],
  data () {
    return {}
  },
  methods: {
    getflowfeelist (methods) {
      this.$emit('getflowfeelist', methods)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
.print_header {
  display: block;
}
</style>
