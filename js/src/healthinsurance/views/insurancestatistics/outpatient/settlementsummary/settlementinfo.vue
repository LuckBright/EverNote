<template>
  <div class="containHeight">
    <el-container>
      <!-- <register-settlement-list
        v-if="!isShowInDialog"
        ref="patientlist"
        :show="show"
        :feeType="feeType"
        :updateList="updateList"
      ></register-settlement-list> -->
    </el-container>
    <div class="mainContent">
      <div class="main-head" v-if="(!isShowInDialog)&&tableTypeData.length>0 && tableData.length>0">
        <el-button @click="empty">重置</el-button>
        <el-button @click="mediacalSettle">医保明细</el-button>
        <el-button @click="details">查看明细</el-button>
        <el-button @click="printdaily(1)">打印</el-button>
        <el-button type="primary" v-if="cancelBtn" @click="cancelSelement">取消日结</el-button>
        <el-button type="primary" @click="createDailySettlementFn" v-if="!objId">日结</el-button>
      </div>
      <div class="info-content" v-if="tableTypeData.length>0 && tableData.length>0">
        <div id="page1" class="table_spe">
          <settlement-info-head :infoObj="infoObj"></settlement-info-head>
          <settlement-info-data :infoObj="infoObjTwo" @getBillDetail="getBillDetail"></settlement-info-data>
          <table>
            <tbody>
              <tr v-for="(key, $index) in tableData" :key="$index">
                <td v-for="(lab, index) in thData" :key="index">
                  <template>
                    <!-- 第一行但不包含最后一列 -->
                    <div v-if="$index==0 && index!==thData.length-1" class="salary">
                      <span v-if="isShowInDialog">{{key[lab.code]}}</span>
                      <a
                        v-else
                        class="btn-color"
                        style="cursor:pointer"
                        @click="getflowfeelist(lab.code, key[lab.code])"
                      >{{key[lab.code]}}</a>
                    </div>
                    <!-- 第二三四行但不包含第一列 -->
                    <div
                      class="salary noWrap"
                      v-if="$index!==0 && index!==0"
                    >{{key[lab.code] | formatToFinacial}}</div>
                    <!-- 第一列和第一行最后一列 -->
                    <div v-if="($index!==0 && index==0)">{{key[lab.code]}}</div>
                    <div
                      v-if="($index==0 && index==thData.length-1)"
                      :class="{textColor:($index==0)}"
                      class="salary"
                    >{{key[lab.code]}}</div>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <h4 v-if="tableTypeData.length>0">费用分类</h4>
          <table v-if="feeType==1&&tableTypeData.length>0" class="type-table-style">
            <tbody>
              <tr v-for="(key, $index) in tableTypeData" :key="$index">
                <template v-if="$index!==tableTypeData.length-1">
                  <td v-for="(lab, index) in thTypeData" :key="index">
                    <div
                      v-if="$index == 0 || ($index == tableTypeData.length - 1&& index!==1) || index % 2 == 0"
                      :class="{salary:((index % 2 != 0)&&($index ==0))}"
                    >{{key[lab]}}</div>
                    <!-- 排除第一行和最后一行的双数列 -->
                    <div
                      :class="{salary:(index!=0)}"
                      v-if="!($index == 0 || $index == tableTypeData.length - 1 || index % 2 == 0)&&key[lab]"
                    >{{key[lab] | formatToFinacial}}</div>
                  </td>
                </template>
                <template v-if="$index==tableTypeData.length-1">
                  <td>
                    <div>大写金额</div>
                  </td>
                  <td>{{Number(tableTypeData[tableTypeData.length-1]['fee0']).toFixed(2) | intToChinese}}</td>
                  <td v-if="thTypeData.length-2" :colspan="thTypeData.length-2"></td>
                </template>
              </tr>
            </tbody>
          </table>
          <table v-if="feeType==3&&tableTypeData.length>0" class="type-table-style aaa">
            <tbody>
              <tr v-for="(key, $index) in tableTypeData" :key="$index" :class="{'':($index==0)}">
                <template v-if="$index!==2">
                  <td v-for="(lab, index) in thTypeData" :key="index">
                    <template>
                      <!-- 第二行但不包含第一列 -->
                      <div
                        v-if="$index==1 && index!==0"
                        :class="
                      {salary:($index!=0)}"
                      >{{key[lab.code] | formatToFinacial}}</div>
                      <!-- 第一行和第一列 -->
                      <div
                        v-if="index==0||$index==0"
                        :class="{textColor:($index==0),salary:(index!=0)}"
                      >{{key[lab.code]}}</div>
                    </template>
                  </td>
                </template>
                <template v-if="$index==2">
                  <td>大写金额</td>
                  <td>{{Number(tableTypeData[2][thTypeData[1]['code']]).toFixed(2) | intToChinese}}</td>
                  <td :colspan="thTypeData.length-2"></td>
                </template>
              </tr>
            </tbody>
          </table>
          <settlement-info-footers :infoObj="infoObj"></settlement-info-footers>
        </div>
      </div>
      <ever-no-data v-else></ever-no-data>
    </div>
    <dailysettleto-settlecode
      :dialogtosettle.sync="dialogtosettle"
      :flowfeeData="flowfeeData"
      :title="dialogtosettleTitle"
    ></dailysettleto-settlecode>
    <type-pay-detail
      :visibile.sync="payDetailObj.visibile"
      :title="payDetailObj.title"
      :id="payDetailObj.id"
      :feeType="feeType"
      @printFrom="printFrom"
    ></type-pay-detail>
    <billDetailDialog
      v-if="billDetailShow"
      :visible.sync="billDetailShow"
      :billDetailData="billDetailData"
    ></billDetailDialog>
    <mediacalSettle v-if="medicalSettleShow" :visible.sync="medicalSettleShow"></mediacalSettle>
  </div>
</template>
<script>
import api from '@/rcm/store/income/dailysettlementapi'
import sessionapi from '@/auth/store/sessionapi'
import detail from '@/rcm/store/income/dailySettlementDetail'
// import RegisterSettlementList from './registersettlementlist'
import SettlementInfoHead from './settlementinfohead'
import SettlementInfoData from './settlementinfodata'
import SettlementInfoFooters from './settlementinfofooters'
import TypePayDetail from './typepaydetail'
import DailysettletoSettlecode from '@/rcm/page/income/dailysettletosettlecode'
import billDetailDialog from '@/rcm/page/income/dailysettlement/billdetail.dialog.vue'
import mediacalSettle from '@/rcm/page/income/dailysettlement/medical-settle-detail.vue'
import jcpjs from 'jcpjs'
import { dateFormat } from '@/util/common'
export default {
  data () {
    return {
      api,
      sessionapi,
      detail,
      dateFormat,
      thData: [],
      thTypeData: [],
      tableData: [],
      tableTypeData: [],
      loading: true,
      cancelBtn: false,
      dialogtosettle: false,
      dialogtosettleTitle: '',
      flowfeeData: [],
      objId: this.$route.query.id,
      updateList: false,
      feeType: this.$route.params.feeType || '1',
      infoObj: {
        feeType: this.$route.params.feeType || '1',
        title: '',
        createUser: '', // 默认当前登录人员
        preCloseTime: '', // 上次日结时间
        preCloseDate: '', // 上次日结时间
        closeTime: '', // 截止时间
        newTime: '', // 制表时间
        totalCount: '', // 总张数
        docCount: '',
        returnCount: '',
        flowFee: 0, // 合计
        disFee: 0, // 优惠合计
        receiveFee: 0, // 实收金额
        returnFee: 0, // 退款合计
        insuranceFee: 0, // 商保应收
        count: '',
        receiveCashFee: 0,
        regs: {}
      },
      payDetailObj: {
        visibile: false,
        title: '',
        id: '',
        feeType: ''
      },
      infoObjTwo: {},
      billDetailData: [],
      billDetailShow: false,
      isShowInDialog: this.$route.query.isShowInDialog, // 日结缴款的弹窗在用
      medicalSettleShow: false,
      show: false
    }
  },
  // 234
  components: {
    TypePayDetail,
    // RegisterSettlementList,
    SettlementInfoHead,
    SettlementInfoData,
    SettlementInfoFooters,
    DailysettletoSettlecode, // 支付流水
    billDetailDialog, // 票据详情
    mediacalSettle // 医保费用明细
  },
  methods: {
    printdaily (type) {
      if (Number(type) === 1 && !this.objId) {
        this.$confirm('尚未日结，是否直接日结打印', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.printFrom()
          this.createDailySettlement()
        }).catch(() => {
          this.printFrom()
        })
      } else {
        this.printFrom()
      }
    },
    printFrom () {
      var mydoc = {
        documents: document,
        settingsId: this.feeType === '3' ? '挂号' : '门诊' + '收费员日报表',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      if (this.feeType === '1') {
        mydoc.settings = { marginLeft: 2, marginRight: 2 }
      }
      if (window.navigator.userAgent.indexOf('Mac OS') === -1) {
        jcpjs.getJCP().printPreview(mydoc)
      }
    },
    async createDailySettlement () {
      try {
        let params = {
          feeType: this.feeType,
          docCount: this.infoObj.docCount,
          returnCount: this.infoObj.returnCount,
          cash: this.infoObj.receiveCashFee, // 记录日结现金
          startTime: this.infoObj.preCloseTime, // 本次日结开始时间
          endTime: this.infoObj.closeTime, // 本次日结截止时间
          details: {
            closeBillItems: [
              {}
            ]
          }
        }
        // 日结时间如果为空就不传
        if (!params.startTime) delete params.startTime
        if (!params.endTime) delete params.endTime
        const result = await api.createDailySettlement(params)
        if (result.head.errCode === 0) {
          this.updateList = true
          this.clearInfoObj()
          this.initInfo()
        }
      } catch (err) {

      }
    },
    async createDailySettlementFn () {
      try {
        await this.$confirm('是否确认结账', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.createDailySettlement()
      } catch (err) {
        console.log('取消')
      }
    },
    empty () {
      this.$router.push({ path: '/rcm/daily/settlement/' + this.$route.params.feeType })
    },
    details () {
      this.payDetailObj.title = this.feeType === '3' ? '挂号' : '门诊'
      this.payDetailObj.id = this.objId || 0
      this.payDetailObj.feeType = this.feeType
      this.payDetailObj.visibile = true
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableTypeData.length - 1) {
        if (columnIndex === 1) {
          return [1, this.thTypeData.length - 1]
        } else {
          return [1, 1]
        }
      }
    },
    async getflowfeelist (methods, name) { // 获取支付流水
      this.dialogtosettleTitle = name
      this.loading = true
      let createBy = this.objId ? this.operatorid : this.$store.state.currentUser.userId
      let settlementType = ''
      if (this.feeType === '1') {
        settlementType = 1
      } else if (this.feeType === '3') {
        settlementType = 2
      }
      let params = {
        closeTime: this.infoObj.closeTime,
        createBy: createBy,
        payMethod: methods,
        settlementType: settlementType,
        ordertype: this.feeType
      }
      if (!this.objId) {
        delete params.closeTime
      }
      const result = await api.payDetailsOfMethod(params)
      if (result && result.head && result.head.errCode === 0) {
        this.flowfeeData = result.data
        this.dialogtosettle = true
        this.loading = false
      } else {
        this.loading = false
      }
    },
    async getDetailById () {
      try {
        let params = { id: this.objId }
        const [printData, billDetailData] = await Promise.all([api.getFlowFeeDetail(params), api.getBillList(params)])
        if (printData.head && printData.head.errCode === 0) {
          this.initHistoryInfo(printData)
          this.initFeeData(printData)
          // 日结历史的打印张数
          if (this.feeType === '3') {
            this.initRegsterTypeData(printData.data.details.regCloseBillItems, true)
          } else {
            this.initThTypeData(printData.data.details.closeBillItems)
          }
        }
        if (billDetailData.head && billDetailData.head.errCode === 0) {
          // 获取日结票据详情的参数
          this.billDetailData = billDetailData.billNoteQueryList
          this.infoObj.totalCount = billDetailData.docCount
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    initHistoryInfo (json) {
      this.infoObj.preCloseTime = json.data.preCloseTime
      this.infoObj.createUser = json.data.operatorName
      this.infoObj.closeTime = json.data.closeTime
      this.infoObj.docCount = json.data.docCount || 0
      this.infoObj.returnCount = json.data.returnCount || 0
      this.infoObj.totalCount = this.infoObj.docCount + this.infoObj.returnCount
    },
    async getSettlement () {
      try {
        // 初始化日结数据结构
        this.getCloseTime() // 获取上次日结时间
        this.getFeeType()
        this.getFeeData()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async getCloseTime () {
      let params = {
        feeType: this.feeType,
        createBy: this.$route.query.operatorId
      }
      const result = await api.getMaxCloseTime(params) // 获取上次日结时间
      if (result && result.head && result.head.errCode === 0 && result.data) {
        this.infoObj.preCloseDate = this.dateFormat(result.data)
        this.infoObj.preCloseTime = this.dateFormat(result.data, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    async getFeeType () {
      let settlementRes
      let params = {
        createBy: this.$route.query.operatorId
      }
      if (this.feeType === '1') {
        settlementRes = await api.NoRegSettlementList(params)
        // 调用票据详情接口
        api.getBillList(params).then(res => {
          // 获取日结票据详情的参数
          this.billDetailData = res.billNoteQueryList
          this.infoObj.totalCount = res.docCount
        })
      } else if (this.feeType === '3') {
        settlementRes = await api.settlementList(params)
        if (settlementRes && settlementRes.head && settlementRes.head.errCode === 0) {
          this.infoObj.docCount = settlementRes.docCount || 0
          this.infoObj.returnCount = settlementRes.returnCount || 0
          this.infoObj.totalCount = this.infoObj.docCount + this.infoObj.returnCount
        }
      }
      if (settlementRes && settlementRes.head && settlementRes.head.errCode === 0 && settlementRes.data && settlementRes.data.length) {
        this.infoObj.newTime = this.infoObj.closeTime = settlementRes.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
        if (this.feeType === '3') {
          this.initRegsterTypeData(settlementRes)
        } else {
          this.initThTypeData(settlementRes.data)
        }
      }
    },
    async getFeeData () {
      let _self = this
      let paymentRes
      let params = {
        createBy: this.$route.query.operatorId
      }
      this.loading = true
      if (_self.feeType === '1') {
        paymentRes = await api.NoRegPaymentList(params)
      } else if (_self.feeType === '3') {
        paymentRes = await api.paymentList(params)
      }
      this.thData = []
      this.tableData = []
      if (paymentRes && paymentRes.head && paymentRes.head.errCode === 0 && paymentRes.data) {
        this.initFeeData(paymentRes)
      }
    },
    initTypeData (json) {
      let obj = json.sumGroupReg || {}
      let data = []
      for (let key in obj) {
        data.push({ itemClassName: key, fee: obj[key] })
      }
      return data
    },
    initRegsterTypeData (json, key) {
      let data = key ? json : this.initTypeData(json)
      let thData = [{ code: 'colName' }]
      let tableData = [{ colName: '项目' }, { colName: '金额' }, { colName: '大写金额' }]
      let totalFeeSum = 0
      data.forEach(item => {
        let obj = {
          code: item.itemClassName
        }
        thData.push(obj)
        tableData[0][item.itemClassName] = item.itemClassName
        tableData[1][item.itemClassName] = item.fee
        totalFeeSum += Number(item.fee)
      })
      thData.push({ code: 'sum' })
      tableData[0]['sum'] = '合计'
      tableData[1]['sum'] = totalFeeSum
      tableData[2][thData[1]['code']] = totalFeeSum.toFixed(2)
      this.thTypeData = thData
      this.tableTypeData = tableData
    },
    initThTypeData (json) {
      let thTypeData = ['name0', 'fee0']
      let tableTypeData = [{ 'name0': '费用类别', 'fee0': '金额' }]
      let feeSum = 0
      if (json.length > 1) {
        thTypeData.push(...['name1', 'fee1'])
        tableTypeData[0]['name1'] = '费用类别'
        tableTypeData[0]['fee1'] = '金额'
      }
      if (json.length > 2) {
        thTypeData.push(...['name2', 'fee2'])
        tableTypeData[0]['name2'] = '费用类别'
        tableTypeData[0]['fee2'] = '金额'
      }
      json.forEach((item, index) => {
        let colLen = index % 3
        if (colLen === 0) {
          tableTypeData.push({})
        }
        let obj = tableTypeData[tableTypeData.length - 1]
        let key = 'name' + colLen
        let fee = 'fee' + colLen
        obj[key] = item.itemClassName
        obj[fee] = item.fee
        feeSum += item.fee
      })
      tableTypeData.push({ 'name0': '大写金额', 'fee0': feeSum })
      this.thTypeData = thTypeData
      this.tableTypeData = tableTypeData
    },
    initData (json) {
      let data = []
      let obj = {}
      let negativeData = json.negative && json.negative.payArray ? json.negative.payArray : [] // 退款集合
      let positiveData = json.positive && json.positive.payArray ? json.positive.payArray : []// 收款集合
      let arr = [...negativeData, ...positiveData]
      arr.forEach(item => {
        if (!obj[item.name]) {
          let negativeFee = (negativeData.find(lab => lab.name === item.name) || { fee: 0 }).fee
          let positiveFee = (positiveData.find(lab => lab.name === item.name) || { fee: 0 }).fee
          obj[item.name] = true
          data.push({ name: item.name, negativeFee: negativeFee, positiveFee: positiveFee, payMethod: item.payMethod })
          if (item.name === '现金') {
            this.infoObj.receiveCashFee = (Number(negativeFee) + Number(positiveFee)).toFixed(2)
          }
        }
      })
      return data
    },
    initInfoObj (json) {
      if (!(json.data && json.data.benefitAndReceivedArray)) {
        return
      }
      json.data.benefitAndReceivedArray.forEach(item => {
        if (item.name === '优惠合计') {
          this.infoObj.disFee = item.fee
        } else if (item.name === '实收金额') {
          this.infoObj.receiveFee = item.fee
        } else if (item.name === '商保应收') {
          this.infoObj.insuranceFee = item.fee
        }
      })
      this.infoObj.regs = json.data.regs
      for (let key in this.infoObj.regs) {
        // 有warning表示为获取到挂号列表，会返回一堆json造成页面混乱
        if (key !== 'warning') {
          this.infoObj[key] = this.infoObj.regs[key]
        } else {
          delete this.infoObj.regs.warning
        }
      }
    },
    initFeeData (json) {
      this.initInfoObj(json)
      let data = this.initData(json)
      let thData = [{ code: 'colName' }]
      let tableData = [{ colName: '' }, { colName: '收款合计' }, { colName: '退款合计' }, { colName: '小计' }]
      let payMethodSum = 0
      let refundFeeSum = 0
      let totalFeeSum = 0
      data.forEach(item => {
        let obj = {
          code: item.payMethod
        }
        thData.push(obj)
        tableData[0][item.payMethod] = item.name
        tableData[1][item.payMethod] = item.positiveFee
        tableData[2][item.payMethod] = item.negativeFee
        tableData[3][item.payMethod] = item.negativeFee + item.positiveFee
        payMethodSum += item.positiveFee
        refundFeeSum += item.negativeFee
        totalFeeSum += item.negativeFee + item.positiveFee
      })
      thData.push({ code: 'sum' })
      tableData[0]['sum'] = '合计'
      tableData[1]['sum'] = payMethodSum
      tableData[2]['sum'] = refundFeeSum
      tableData[3]['sum'] = totalFeeSum
      this.infoObj.flowFee = totalFeeSum
      this.infoObj.returnFee = refundFeeSum
      this.infoObjTwo = this.infoObj
      this.thData = thData
      this.tableData = tableData
      this.$nextTick(_ => {
        this.loading = false
      })
    },
    async initInfo () {
      try {
        if (this.$store.state.currentUser.name) {
          // 从日结缴款查看详情，会把收费员带在url上，所以优先取url上的，再取本页面的
          this.infoObj.createUser = this.$route.query.operator || this.$store.state.currentUser.name
        } else {
          let urser = await sessionapi.user()
          this.infoObj.createUser = urser.displayName
        }
        this.infoObj.title = this.feeType === '3' ? '挂号收费员日报表' : '门诊收费员日报表'
        if (!this.objId) {
          await this.getSettlement()
        } else {
          await this.getDetailById()
          this.initBtn()
        }
      } catch (err) {

      }
    },
    clearInfoObj () {
      this.cancelBtn = false
      this.thData = []
      this.thTypeData = []
      this.tableData = []
      this.tableTypeData = []
      this.objId = ''
      this.infoObj = {
        feeType: this.$route.params.feeType || '1',
        title: '',
        createUser: '', // 默认当前登录人员
        preCloseTime: '', // 上次日结时间
        preCloseDate: '', // 上次日结时间
        closeTime: '', // 截止时间
        newTime: '', // 制表时间
        totalCount: '', // 总张数
        docCount: '',
        returnCount: '',
        flowFee: 0, // 合计
        disFee: 0, // 优惠合计
        receiveFee: 0, // 实收金额
        returnFee: 0, // 退款合计
        insuranceFee: 0, // 商保应收
        count: '',
        receiveCashFee: 0,
        regs: {}
      }
    },
    async initBtn () {
      let auth = this.feeType === '3' ? 'Auth_menu_rcm_settlements_settlements_ghrj_cancel_btn' : 'Auth_menu_rcm_settlements_settlements_mzhrj_cancel_btn'
      let users = await sessionapi.resources()
      let cancelBtnShowsHidden = await api.canYouCancel(this.objId) // 取消按钮显示接口查询
      let resources = this.initBtnInfo(auth, users.rID)
      let idInfo = true // await api.getIdInfo()
      if (idInfo && resources && cancelBtnShowsHidden && cancelBtnShowsHidden.data) { // 取消日结按钮显示隐藏判断
        this.$nextTick(() => {
          this.cancelBtn = true
        })
      }
    },
    initBtnInfo (auth, users) {
      let val = false
      users.forEach(item => {
        if (item === auth) {
          val = true
        }
      })
      return val
    },
    cancelSelement () { // 是否取消日结
      this.$confirm('您是否确认取消日结，取消日结将会使最近的日结数据删除，是否继续？', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.cancelClose(this.objId).then(res => {
          if (res && res.head && res.head.errCode === 0) {
            this.$nextTick(() => {
              this.$route.query.id = ''
              this.objId = ''
              this.cancelBtn = false
              this.clearInfoObj()
              this.initInfo()
            })
          }
        })
      }).catch(() => { })
    },
    // togglelist () {
    //   if (this.$refs.patientlist.isShow) {
    //     this.$refs.patientlist.isShow = false
    //   }
    // },
    getBillDetail () {
      this.billDetailShow = true
    },
    // 医保明细
    mediacalSettle () {
      this.medicalSettleShow = true
    }
  },
  created () {
    this.initInfo()
    // document.onclick = (event) => {
    //   // console.log(event, event.target.className, '点击事件')
    //   let e = event.target || event.srcElement
    //   if (e.className === 'containHeight') {
    //     this.togglelist()
    //   }
    // }
  },
  watch: {
    // '$route.params.feeType': {
    //   handler (val) {
    //     this.clearInfoObj()
    //     this.feeType = val
    //     this.infoObj.feeType = val
    //     if (!this.$route.query.id) {
    //       this.initInfo()
    //     }
    //   },
    //   immediate: true
    // },
    '$route': {
      handler (val) {
        this.clearInfoObj()
        this.objId = val.query.id
        this.feeType = val.params.feeType || '1'
        this.infoObj.feeType = val.params.feeType || '1'
        this.initInfo()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
.containHeight {
  min-height: 100%;
  width:100%;
  padding-bottom: 30px;
  background-color: #ffffff !important;
}
.mainContent {
  margin-bottom: 10px;
  background: #fff;
}
.content {
  height: 100vh;
  padding-top: -80px;
}
.main-head {
  margin: 20px 70px 0 0;
  text-align: right;
}
.info-content {
  padding: 15px 70px;
}
.btn-color {
  cursor: pointer;
  color: rgb(28, 123, 239);
}
.textColor {
  color: #000;
  font-weight: 700;
}
table {
  color: #000;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  line-height: 35px;
  text-align: center;
}
table tr {
  border-bottom: 1px solid #000;
}
table tr:first-child {
  color: #000;
  font-weight: 700;
  background: #eee;
}
table tr td {
  border-right: 1px solid #000;
  padding-right: 10px;
}
.salary {
  text-align: right;
  padding-right: 10px;
  white-space: nowrap;
}
</style>
