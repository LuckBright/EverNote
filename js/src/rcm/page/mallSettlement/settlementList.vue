<template>
  <div>
    <div class="layout_inner">
      <div class="main-head" v-if="!id">
        <el-button type="primary" @click="createDailySettlementFn" v-if="printData.flowFee">日结</el-button>
        <!-- <el-button type="primary" @click="showDailyDetail">查看明细</el-button> -->
        <el-button @click="printHandler" v-if="printData.flowFee">打印</el-button>
      </div>
      <div class="main-wrap mt20" v-loading.body="loading">
        <el-row :gutter="20" v-if="printData.flowFee">
          <el-col :span="20" id="page1">
            <mall-settlement-print :title="'商城收费员日结报表'" :printData="printData" @getflowfeelist="getflowfeelist"></mall-settlement-print>
          </el-col>
        </el-row>
        <ever-no-data v-else></ever-no-data>
      </div>
      <mall-settlement-detail :title="'结算日结明细'" :pTitle="'商城日结明细'"  ref="dailyDetail"></mall-settlement-detail>
      <pay-detail :dialogtosettle.sync="dialogtosettle" :payArray="payArray" :title="dialogtosettleTitle"></pay-detail>
    </div>
  </div>
</template>

<script>
import {
  getMallInfo,
  getPaymentInfo,
  close
} from '../../store/mallSettlement/mallSettlement'
import MallSettlementPrint from './mallSettlementprint'
import mallSettlementDetail from './mallSettlementDetail'
import payDetail from './payDetail'
import jcpjs from 'jcpjs'

// import api from '@/rcm/store/income/dailySettlement'

// import { doPrint } from '@/util/common'
export default {
  data () {
    return {
      title: '日结处理',
      // 打印obj
      printData: {
        // 收费类别
        accountType: {},
        // 支付方式金额
        paymethodSum: {},
        // 上次日结时间
        closeTime: '',
        // 小记
        flowFee: '',
        // 大写
        upperCase: '',
        // 数量
        count: '',
        // 制表员
        createUser: '',
        // 制表日期
        newTime: ''
      },
      loading: false,
      // 支付方式array
      payArray: [],
      dialogtosettle: false,
      dialogtosettleTitle: '',
      id: this.$route.params.id,
      excelId: ''
    }
  },
  components: {
    mallSettlementDetail,
    MallSettlementPrint,
    payDetail
  },
  created () {
    this.getInfo()
    console.log(MallSettlementPrint)
  },
  methods: {
    async getInfo () {
      this.loading = true
      let self = this
      try {
        let obj = {}
        if (self.id) {
          obj['closeNo'] = self.id
        }
        let data = await getMallInfo(obj)
        if (data.data) {
          Object.assign(this.printData, data.data)
          this.excelId = data.data.id
          this.loading = false
        } else {
          this.printData = {}
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },
    // 支付方式
    async getflowfeelist (methods) {
      this.dialogtosettle = true
      this.dialogtosettleTitle = methods
      this.payArray = []
      try {
        let params = {
          name: methods,
          id: this.excelId
        }
        let data = await getPaymentInfo(params)
        if (data.data) {
          this.payArray = data.data
        } else {
        }
      } catch (err) { }
    },
    // 打印
    printHandler () {
      // 海南现代打印纵向
      var mydoc = {
        documents: document,
        settingsId: '财务日结单',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      jcpjs.getJCP().printPreview(mydoc)
    },
    // 确定日结
    async createDailySettlementFn () {
      try {
        await this.$confirm('是否确认结账', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let data = await close()
        if (data.head && data.head.errMsg === 'Success') {
          this.getInfo()
        }
        console.log(data)
        // this.dailySettlement.feeType = this.feeType
        // this.dailySettlement.operator = this.$store.state.currentUser.id
        // const result = await api.createDailySettlement(this.dailySettlement)
        // if (result.head.errCode === 0) {
        //   this.update = !this.update
        // }
      } catch (err) {
        console.log('取消')
      }
    },
    showDailyDetail () {
      this.$refs.dailyDetail.onDialogOpen()
    }
  },
  watch: {
    '$route.params': {
      async handler (cur, old) {
        this.id = cur.id
        this.getInfo()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
