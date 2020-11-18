<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <el-button
          @click="printHandler"
          v-if="dailySettlement.details.closeBillItems.length || payment.length"
        >打印</el-button>
        <el-button type="primary" v-if="closeTime && !id" @click="showDailyDetail">查看明细</el-button>
        <el-button
          type="primary"
          @click="createDailySettlementFn"
          v-if="(dailySettlement.details.closeBillItems.length || payment.length) && !id"
        >日结</el-button>
      </div>
      <div class="main-wrap mt20" v-loading.body="loading">
        <el-row :gutter="20" v-if="dailySettlement.details.closeBillItems.length || payment.length">
          <el-col :span="20" id="page1">
            <daily-settlement-print
              :title="feeTypeTxt(feeType,'',true)"
              :operator="!id ? $store.state.currentUser.name : dailySettlement.operator"
              :closeDate="closeDate"
              :closeBillItems="dailySettlement.details.closeBillItems"
              :dailySettlementDetail="dailySettlementDetail"
              :totalNum="totalNum"
              :payment="payment"
              :paymentids="paymentids"
              :receivable="receivable"
              :totalCount="totalCount"
              :date="reportDate"
              :preCloseTime="preCloseTime"
              @getflowfeelist="getflowfeelist"
            ></daily-settlement-print>
          </el-col>
        </el-row>
        <ever-no-data v-else></ever-no-data>
      </div>
      <daily-settlement-dialog
        :title="feeTypeTxt(feeType,true)"
        :pTitle="feeTypeTxt(feeType,'',true)"
        :orderType="feeType"
        :date="closeTime"
        ref="dailyDetail"
      ></daily-settlement-dialog>
      <dailysettleto-settlecode
        :dialogtosettle.sync="dialogtosettle"
        :flowfeeData="flowfeeData"
        :title="dialogtosettleTitle"
      ></dailysettleto-settlecode>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/income/dailySettlement'
import detail from '@/rcm/store/income/dailySettlementDetail'
import DailySettlementDialog from '@/rcm/page/income/dailySettlementDialog'
import DailySettlementPrint from '@/rcm/page/income/dailySettlementPrint'
import DailysettletoSettlecode from '@/rcm/page/income/dailysettletosettlecode'
import { doPrint, dateFormat } from '@/util/common'
import jcpjs from 'jcpjs'

export default {
  data () {
    return {
      tableData: [],
      payment: [],
      paymentids: [],
      dialogtosettle: false,
      dialogtosettleTitle: '',
      flowfeeData: [],
      operatorid: '',
      receivable: [],
      loading: false,
      dailySettlementDetail: [[], []],
      id: this.$route.params.id,
      dailySettlement: {
        feeType: this.$route.params.feeType || '1',
        operator: null,
        details: {
          closeBillItems: []
        }
      },
      closeDate: null,
      closeTime: null,
      preCloseTime: null,
      totalNum: 0,
      feeType: this.$route.params.feeType || '1',
      update: true,
      totalCount: 0,
      reportDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      doPrint,
      dateFormat,
    }
  },
  components: {
    DailySettlementDialog,
    DailySettlementPrint,
    DailysettletoSettlecode
  },
  async created () {
    if (!this.id) {
      await this.getSettlement()
    } else {
      await this.getDetailById()
    }
  },
  methods: {
    async getflowfeelist (methods, name) {
      let _self = this
      _self.dialogtosettleTitle = name
      _self.loading = true
      let createBy = _self.id ? _self.operatorid : _self.$store.state.currentUser.userId
      let settlementType = ''
      if (_self.feeType === '1') {
        settlementType = 1
      } else if (_self.feeType === '3') {
        settlementType = 2
      }
      let params = {
        closeTime: _self.closeTime,
        createBy: createBy,
        payMethod: methods,
        settlementType: settlementType,
        ordertype: _self.feeType
      }
      if (!_self.id) {
        delete params.closeTime
      }
      const result = await api.payDetailsOfMethod(params)
      if (result && result.head && result.head.errCode === 0) {
        this.flowfeeData = result.data
        _self.dialogtosettle = true
        _self.loading = false
      } else {
        _self.loading = false
      }
    },
    printHandler () {
      // 海南现代打印纵向
      var mydoc = {
        documents: document,
        settingsId: 'rcm日结',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      jcpjs.getJCP().printPreview(mydoc)
    },
    async getSettlement () {
      const _self = this
      try {
        this.loading = true
        // 初始化日结数据结构
        _self.dailySettlement = {
          feeType: this.$route.params.feeType || '1',
          operator: null,
          details: {
            closeBillItems: []
          }
        }
        const result = await api.getMaxCloseTime(_self.feeType)
        if (result && result.head && result.head.errCode === 0 && result.data) {
          _self.closeDate = _self.dateFormat(result.data)
          _self.closeTime = _self.dateFormat(result.data, 'YYYY-MM-DD HH:mm:ss')
        }
        _self.totalNum = 0
        let settlementRes
        if (_self.feeType === '1') {
          settlementRes = await api.NoRegSettlementList()
        } else if (_self.feeType === '3') {
          settlementRes = await api.settlementList()
        }
        _self.dailySettlementDetail[0] = []
        _self.dailySettlementDetail[1] = []
        _self.totalCount = 0
        if (settlementRes && settlementRes.head && settlementRes.head.errCode === 0) {
          _self.totalCount = (settlementRes.docCount || 0) + (settlementRes.returnCount || 0)
          _self.dailySettlement.docCount = settlementRes.docCount || 0
          _self.dailySettlement.returnCount = settlementRes.returnCount || 0
        }
        if (settlementRes && settlementRes.head && settlementRes.head.errCode === 0 && settlementRes.data && settlementRes.data.length) {
          _self.reportDate = settlementRes.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
          _self.dailySettlement.details.closeBillItems = settlementRes.data
          // _self.dailySettlement.docCount = settlementRes.docCount || 0
          // _self.dailySettlement.returnCount = settlementRes.returnCount || 0
          // _self.totalCount = (settlementRes.docCount || 0) + (settlementRes.returnCount || 0)
          _self.dailySettlement.details.closeBillItems.forEach((item, index) => {
            item.fee = Number(item.fee)
            _self.totalNum += Number(item.fee)
            let midNum = _self.dailySettlement.details.closeBillItems.length > 7 ? Math.ceil(_self.dailySettlement.details.closeBillItems.length / 2) : 7
            if (index < midNum) {
              _self.dailySettlementDetail[0].push(item)
            } else {
              _self.dailySettlementDetail[1].push(item)
            }
          })
        }
        let paymentRes
        if (_self.feeType === '1') {
          paymentRes = await api.NoRegPaymentList()
        } else if (_self.feeType === '3') {
          paymentRes = await api.paymentList()
        }
        _self.payment = []
        _self.paymentids = []
        _self.receivable = []
        if (paymentRes && paymentRes.head && paymentRes.head.errCode === 0 && paymentRes.data) {
          let initpayDetail = []
          _self.paymentids = paymentRes.data.payArray || []
          let showPayment = [...(paymentRes.data.benefitAndReceivedArray || [])]
          showPayment.forEach(key => {
            let obj = {}
            obj[key.name] = key.fee
            initpayDetail.push(obj)
          })
          _self.payment = initpayDetail
          for (let item in paymentRes.data) {
            let num = paymentRes.data[item]
            if (item !== 'createBy' && item !== 'payDetail' && item !== 'closeTime') {
              _self.dailySettlement[item] = num
            }
            _self.dailySettlement.closeTime = _self.$moment().format('YYYY-MM-DD HH:mm:ss')
            if (item === 'comReceivable') {
              _self.receivable.push({ '商保应收': num })
            }
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async getDetailById () {
      const _self = this
      try {
        this.loading = true
        // 初始化日结数据结构
        _self.dailySettlement = {
          feeType: this.$route.params.feeType || '1',
          operator: null,
          details: {
            closeBillItems: []
          }
        }
        _self.dailySettlementDetail[0] = []
        _self.dailySettlementDetail[1] = []
        _self.totalCount = 0
        _self.payment = []
        _self.paymentids = []
        _self.receivable = []
        const printData = await detail.getFlowFeeDetail({ id: _self.id })
        if (printData && printData.head && printData.head.errCode === 0 && printData.data) {
          let initpayDetail = []
          _self.paymentids = printData.data.payArray || []
          let showPayment = [...(printData.data.benefitAndReceivedArray || [])]
          showPayment.forEach(key => {
            let obj = {}
            obj[key.name] = key.fee
            initpayDetail.push(obj)
          })
          _self.payment = initpayDetail
          _self.dailySettlement.operator = printData.data.operatorName
          _self.operatorid = printData.data.operator
          _self.closeTime = printData.data.closeTime
          _self.preCloseTime = printData.data.preCloseTime
          _self.dailySettlement.details.closeBillItems = printData.data.details.closeBillItems
          _self.closeDate = printData.data.closeTime
          if (printData.data.comReceivable) {
            _self.receivable.push({ '商保应收': printData.data.comReceivable })
          }
          _self.reportDate = printData.data.closeTime || _self.$moment().format('YYYY-MM-DD HH:mm:ss')
          _self.totalCount = (printData.data.docCount || 0) + (printData.data.returnCount || 0)
          if (printData.data.details && printData.data.details.closeBillItems && printData.data.details.closeBillItems.length) {
            _self.dailySettlement.details.closeBillItems.forEach((item, index) => {
              item.fee = Number(item.fee)
              _self.totalNum += Number(item.fee)
              let midNum = _self.dailySettlement.details.closeBillItems.length > 7 ? Math.ceil(_self.dailySettlement.details.closeBillItems.length / 2) : 7
              if (index < midNum) {
                _self.dailySettlementDetail[0].push(item)
              } else {
                _self.dailySettlementDetail[1].push(item)
              }
            })
          }
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    feeTypeTxt (val, isDetail, isPrint) {
      let str
      switch (val) {
        case '1':
          str = '门诊'
          break
        case '3':
          str = '挂号'
          break
        default:
          str = ''
      }
      if (isPrint) {
        return str + '收费员日报表'
      } else {
        if (isDetail) {
          return str + '日结明细'
        } else {
          return str + '日结'
        }
      }
    },
    async createDailySettlementFn () {
      try {
        await this.$confirm('是否确认结账', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.dailySettlement.feeType = this.feeType
        this.dailySettlement.operator = this.$store.state.currentUser.id
        const result = await api.createDailySettlement(this.dailySettlement)
        if (result.head.errCode === 0) {
          this.update = !this.update
        }
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
        this.feeType = cur.feeType
        await this.getSettlement()
        const result = await api.getMaxCloseTime(this.feeType)
        if (result.head.errCode === 0 && result.data) {
          this.closeDate = this.dateFormat(result.data)
          this.closeTime = this.dateFormat(result.data, 'YYYY-MM-DD HH:mm:ss')
        }
      },
      deep: true
    },
    'update': {
      async handler (cur, old) {
        await this.getSettlement()
      }
    }
  }
}
</script>
