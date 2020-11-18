<template>
  <div class="containHeight">
    <el-container>
      <register-settlement-list
        v-if="!isShowInDialog"
        ref="patientlist"
        :show="show"
        :feeType="feeType"
      ></register-settlement-list>
    </el-container>
    <div class="mainContent" v-loading="loading">
      <div class="main-head" v-if="!isShowInDialog && thData.length>2">
        <el-button v-if="objId" @click="empty">重置</el-button>
        <el-button @click="mediacalSettle">医保明细</el-button>
        <el-button @click="details">查看流水</el-button>
        <el-button @click="printdaily(1)">打印</el-button>
        <el-button type="primary" v-if="cancelBtn" @click="cancelSelement">取消日结</el-button>
        <el-button type="primary" @click="createDailySettlementFn" v-if="!objId">日结</el-button>
      </div>
      <div class="info-content" v-if="thData.length>2">
        <div id="page1" class="table_spe">
          <settlement-info-head :infoObj="infoHeadObj"></settlement-info-head>
          <settlement-info-data :infoObj="infoObjTwo" @getBillDetail="getBillDetail"></settlement-info-data>
          <table>
            <tbody>
              <!-- 第一行通过type.num设置定制化表头 -->
              <tr>
                <td rowspan="2"></td>
                <template v-for="(type,$key) in typeNum">
                  <td :key="$key" v-if="type.num" :colspan="type.num">{{type.text}}</td>
                </template>
                <td rowspan="2" style="vertical-align:middle;">合计</td>
              </tr>
              <!-- 填充数据 -->
              <template v-for="(key, $index) in tableData">
                <tr :key="$index">
                  <template v-for="(lab, index) in thData">
                    <!-- 第二行的第一列和最后一列的td不渲染，他的"colName": "", "sum": "" -->
                    <td :key="index" v-if="key[lab.code]!==''">
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
                        <!-- 第一列 -->
                        <div v-if="($index!==0 && index==0)">{{key[lab.code]}}</div>
                        <!-- 第二行最后一列 -->
                        <div
                          v-if="($index==0 && index==thData.length-1)"
                          :class="{textColor:($index==0)}"
                          class="salary"
                        >{{key[lab.code]}}</div>
                      </template>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
          <h4 v-if="tableTypeData.length>0">费用分类</h4>
          <!-- 门诊收费 -->
          <table v-if="feeType==1&&tableTypeData.length>0" class="type-table-style">
            <tbody>
              <tr v-for="(key, $index) in tableTypeData" :key="$index">
                <template v-if="$index!==tableTypeData.length-1 && $index!==tableTypeData.length-2">
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
                <template v-if="$index==tableTypeData.length-2">
                  <td>
                    <div>合计（小写）</div>
                  </td>
                  <td>{{Number(tableTypeData[tableTypeData.length-1]['fee0']).toFixed(2) | formatToFinacial}}</td>
                  <td v-if="thTypeData.length-2" :colspan="thTypeData.length-2"></td>
                </template>
                <template v-if="$index==tableTypeData.length-1">
                  <td>
                    <div>合计（大写）</div>
                  </td>
                  <td>{{Number(tableTypeData[tableTypeData.length-1]['fee0']).toFixed(2) | intToChinese}}</td>
                  <td v-if="thTypeData.length-2" :colspan="thTypeData.length-2"></td>
                </template>
              </tr>
            </tbody>
          </table>
          <!-- 挂号收费 -->
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
                  <td>合计（大写）</td>
                  <td>{{Number(tableTypeData[2][thTypeData[1]['code']]).toFixed(2) | intToChinese}}</td>
                  <td :colspan="thTypeData.length-2"></td>
                </template>
              </tr>
            </tbody>
          </table>
          <settlement-info-footers :infoObj="infoHeadObj"></settlement-info-footers>
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
import RegisterSettlementList from './registersettlementlist'
import SettlementInfoHead from './settlementinfohead'
import SettlementInfoData from './settlementinfodata'
import SettlementInfoFooters from './settlementinfofooters'
import TypePayDetail from './typepaydetail'
import DailysettletoSettlecode from '@/rcm/page/income/dailysettletosettlecode'
import billDetailDialog from '@/rcm/page/income/dailysettlement/billdetail.dialog.vue'
import mediacalSettle from '@/rcm/page/income/dailysettlement/medical-settle-detail.vue'
import jcpjs from 'jcpjs'
import { dateFormat, debounce } from '@/util/common'
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
      feeType: this.$route.params.feeType || '1',
      infoHeadObj: {
        title: '',
        createUser: '', // 默认当前登录人员
        preCloseTime: '', // 上次日结时间
        preCloseDate: '', // 上次日结时间
        closeTime: '', // 截止时间
        newTime: '', // 制表时间
      },
      infoObj: {
        feeType: this.$route.params.feeType || '1',
        totalCount: '', // 总张数
        docCount: '',
        returnCount: '',
        flowFee: 0, // 合计
        disFee: 0, // 优惠合计
        receiveFee: 0, // 实收金额
        returnFee: 0, // 退款合计
        insuranceFee: 0, // 商保应收
        mallFee: 0, // 商城应收
        disputeRefund: 0, // 纠纷退费
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
      show: false,
      typeNum: {
        '0': {
          text: '实收金额',
          num: 0
        },
        '2': {
          text: '预收核销',
          num: 0
        },
        '1': {
          text: '优惠金额',
          num: 0
        },
      } // 用来统计各个分类占多少个td
    }
  },
  // 234
  components: {
    TypePayDetail,
    RegisterSettlementList,
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
          startTime: this.infoHeadObj.preCloseTime, // 本次日结开始时间
          endTime: this.infoHeadObj.closeTime, // 本次日结截止时间
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
      this.clearHeadObj()
      this.$router.push({ path: '/rcm/daily/settlement/' + this.$route.params.feeType })
    },
    details () {
      this.payDetailObj.title = '门诊支付流水查询'
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
        closeTime: this.infoHeadObj.closeTime,
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
            if (billDetailData.head && billDetailData.head.errCode === 0) {
              // 获取日结票据详情的参数
              this.billDetailData = billDetailData.billNoteQueryList
              this.infoObj.totalCount = billDetailData.docCount
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    initHistoryInfo (json) {
      this.infoHeadObj.preCloseTime = json.data.preCloseTime
      this.infoHeadObj.createUser = json.data.operatorName
      this.infoHeadObj.closeTime = json.data.closeTime
      this.infoObj.docCount = json.data.docCount || 0
      this.infoObj.returnCount = json.data.returnCount || 0
      // 挂号收据张数只取docCount了
      this.infoObj.totalCount = this.infoObj.docCount
    },
    async getSettlement () {
      try {
        // 初始化日结数据结构
        await this.getCloseTime() // 获取上次日结时间
        await this.getFeeType()
        await this.getFeeData()
      } catch (e) {
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
        this.infoHeadObj.preCloseDate = this.dateFormat(result.data)
        this.infoHeadObj.preCloseTime = this.dateFormat(result.data, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    // 展示费用分类
    async getFeeType () {
      let settlementRes
      let billRes
      let params = {
        createBy: this.$route.query.operatorId
      }
      if (this.feeType === '1') {
        settlementRes = await api.NoRegSettlementList(params)
        // 调用票据详情接口
        billRes = await api.getBillList(params)
        // 获取日结票据详情的参数
        this.billDetailData = billRes.billNoteQueryList
        this.infoObj.totalCount = billRes.docCount
      } else if (this.feeType === '3') {
        settlementRes = await api.settlementList(params)
        if (settlementRes && settlementRes.head && settlementRes.head.errCode === 0) {
          this.infoObj.docCount = settlementRes.docCount || 0
          this.infoObj.returnCount = settlementRes.returnCount || 0
          // 挂号收据张数只取docCount了
          this.infoObj.totalCount = this.infoObj.docCount
        }
      }
      if (settlementRes && settlementRes.head && settlementRes.head.errCode === 0 && settlementRes.data && settlementRes.data.length) {
        this.infoHeadObj.newTime = this.infoHeadObj.closeTime = settlementRes.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
        if (this.feeType === '3') {
          this.initRegsterTypeData(settlementRes)
        } else {
          this.initThTypeData(settlementRes.data)
        }
      }
    },
    // 上面的分类合计
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
      tableData[0]['sum'] = '合计（小写）'
      tableData[1]['sum'] = totalFeeSum
      tableData[2][thData[1]['code']] = totalFeeSum.toFixed(2)
      this.thTypeData = thData
      this.tableTypeData = tableData
    },
    // 费用分类组装数据
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
      tableTypeData.push({ 'name0': '小写金额', 'fee0': feeSum })
      tableTypeData.push({ 'name0': '大写金额', 'fee0': feeSum })
      this.thTypeData = thTypeData
      this.tableTypeData = tableTypeData
    },
    // 上面的分类合计，组装数据, 表格部分
    initData (json) {
      let data = []
      let obj = {}
      let negativeData = json.negative && json.negative.payArray || [] // 退款集合
      let positiveData = json.positive && json.positive.payArray || []// 收款集合
      let arr = [...negativeData, ...positiveData]
      arr.forEach(item => {
        if (!obj[item.name]) {
          let negativeFee = (negativeData.find(lab => lab.name === item.name) || { fee: 0 }).fee
          let positiveFee = (positiveData.find(lab => lab.name === item.name) || { fee: 0 }).fee
          obj[item.name] = true
          data.push({ name: item.name, negativeFee: negativeFee, positiveFee: positiveFee, payMethod: item.payMethod, type: item.type })
          if (item.name === '现金') {
            this.infoObj.receiveCashFee = (Number(negativeFee) + Number(positiveFee)).toFixed(2)
          }
        }
      })
      return data
    },
    // // 上面的分类合计，组装数据，表格以上
    initInfoObj (json) {
      if (!(json.data && json.data.benefitAndReceivedArray)) {
        return
      }
      json.data.benefitAndReceivedArray.forEach(item => {
        if (item.name === '优惠合计') {
          this.infoObj.disFee = item.fee
        } else if (item.name === '实收金额') {
          this.infoObj.receiveFee = item.fee
        } else if (item.name === '预收核销') {
          this.infoObj.preWriteOffPay = item.fee
          // } else if (item.name === '商保应收') {
          //   this.infoObj.insuranceFee = item.fee
        } else if (item.name === '尾差金额') {
          this.infoObj.diff = item.fee
        } else if (item.name === '抹零金额') {
          this.infoObj.wipeOff = item.fee
          // } else if (item.name === '商城应收') {
          //   this.infoObj.mallFee = item.fee
        } else if (item.name === '纠纷退费') {
          this.infoObj.disputeRefund = item.fee
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
    // 上面的分类合计，组装数据
    initFeeData (json) {
      this.clearObj() // 清空obj的内容，防止切换日结表时数据错乱
      this.initInfoObj(json)
      let data = this.initData(json)
      let thData = [{ code: 'colName' }]
      let tableData = [{ colName: '' }, { colName: '收款合计' }, { colName: '退款合计' }, { colName: '小计' }]
      let payMethodSum = 0
      let refundFeeSum = 0
      let totalFeeSum = 0
      Object.keys(this.typeNum).forEach(key => { this.typeNum[key]['num'] = 0 })
      data.sort((a, b) => a.type - b.type).forEach(item => {
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
        // 统计各个分类占多少个td
        this.typeNum[item.type] ? this.typeNum[item.type]['num']++ : this.typeNum[item.type]['num'] = 1
      })
      thData = [...thData, ...[{ code: 'sum' }]]
      tableData[0]['sum'] = ''
      tableData[1]['sum'] = payMethodSum
      tableData[2]['sum'] = refundFeeSum
      tableData[3]['sum'] = totalFeeSum
      // 应收金额加上抹零
      this.infoObj.flowFee = totalFeeSum + this.infoObj.wipeOff
      // returnFee结算退费
      this.infoObj.returnFee = refundFeeSum - this.infoObj.disputeRefund
      this.infoObjTwo = this.infoObj
      this.thData = thData
      this.tableData = tableData
      this.$nextTick(_ => {
        this.loading = false
      })
    },
    initInfo: debounce(async function () {
      try {
        this.loading = true
        if (this.$store.state.currentUser.name) {
          // 从日结缴款查看详情，会把收费员带在url上，所以优先取url上的，再取本页面的
          this.infoHeadObj.createUser = this.$route.query.operator || this.$store.state.currentUser.name
        } else {
          let urser = await sessionapi.user()
          this.infoHeadObj.createUser = urser.displayName
        }
        this.infoHeadObj.title = this.feeType === '3' ? '挂号收费员日报表' : '门诊收费员日报表'
        if (!this.objId) {
          await this.getSettlement()
        } else {
          await this.getDetailById()
          this.initBtn()
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    }, 300),
    clearInfoObj () {
      this.cancelBtn = false
      this.thData = []
      this.thTypeData = []
      this.tableData = []
      this.tableTypeData = []
      this.objId = ''
      this.clearObj()
    },
    clearObj () {
      Object.keys(this.infoObj).forEach(item => {
        let arr = ['totalCount', 'docCount', 'returnCount']
        if (!arr.includes(item)) {
          this.infoObj[item] = item === 'feeType' ? this.$route.params.feeType || '1' : 0
        }
      })
    },
    clearHeadObj () {
      Object.keys(this.infoHeadObj).forEach(item => {
        this.infoHeadObj[item] = ''
      })
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
  },
  watch: {
    '$route': {
      handler (val) {
        // axios拦截器里存放了取消接口的标识，路由切换前将未返回的接口取消
        Object.keys(this.api.cancelToken).forEach(apiKey => {
          this.api.cancelToken[apiKey].cancel()
        })
        this.clearInfoObj()
        this.clearHeadObj()
        this.objId = val.query.id
        this.feeType = val.params.feeType || '1'
        this.infoObj.feeType = val.params.feeType || '1'
        this.initInfo()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
.containHeight {
  min-height: 100%;
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
@media print {
  .salary {
    color: #000;
  }
  h4 {
    margin: 10px 0;
  }
}
</style>
