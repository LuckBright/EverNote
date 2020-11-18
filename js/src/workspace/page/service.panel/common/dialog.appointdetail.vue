<template>
  <el-dialog title="医保信息" :visible.sync="dialogVisible">
    <medicarecard-detail :medicare-data="medData"></medicarecard-detail>
    <div class="bdy">
      <h4 class="ti2"><span>退费确认</span> <a href="">医保费用分解</a></h4>
      {{appointData.orderid}}aaaa
      <el-row>
        <el-col :span="12">费用总金额</el-col><el-col :span="12">20.00</el-col>
        <el-col :span="12">基金支付金额</el-col><el-col :span="12">20.00</el-col>
        <el-col :span="12">现金支付金额</el-col><el-col :span="12">20.00</el-col>
        <el-col :span="12">个人账户支付金额</el-col><el-col :span="12">20.00</el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
  import medicarecardDetail from '@/components/medicarecard.detail'

  export default {
    data () {
      return {
        dialogVisible: false,
        yibaomesFlag: true
      }
    },
    props: ['medData', 'orderId', 'appointData'],
    methods: {
      open () {
        this.dialogVisible = true
      },
      close () {
        this.dialogVisible = false
      }
    },
    components: {
      medicarecardDetail
    }
  }
</script>
<style scoped>
  .bdy{line-height: 25px; font-size: 14px;text-align: left}
  .ti2{border-top: 1px solid #ccc;margin: 10px 0;height: 30px;line-height: 30px}
</style>
