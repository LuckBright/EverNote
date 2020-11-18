<template>
  <div class='containHeight'>
    <el-container v-loading='cardloading'>
      <register-settlement-list ref="patientlist" :feeType="7" :updateList="updateList"></register-settlement-list>
    </el-container>
    <div class="main-head" v-if="infoObj.flowFee">
      <el-button @click="empty">重置</el-button>
      <!-- <el-button @click="printFrom">打印</el-button> -->
      <el-button type="primary" v-if="$hasPermission('Auth_menu_rcm_settlements_mallsell_rjchl_cancel_btn') && cancelBtnShowsHidden" @click="handlerCancelTheDate">取消日结</el-button>
      <el-button type="primary" @click="createDailySettlementFn" v-if="!objId">日结</el-button>
    </div>
    <div class="info-content">
      <div id="page1" class="table_spe" v-if='infoObj.flowFee'>
        <settlement-info-head :infoObj="infoObj"></settlement-info-head>
        <settlement-info-data :isMall='true' :infoObj="infoObj"></settlement-info-data>
        <table>
          <tbody>
            <tr v-for="(key, $index) in tableData" :key="$index">
              <td v-for="(lab, index) in thData" :key="index">
                <template>
                  <div v-if="$index==0 && index!==thData.length-1">
                    <a class="btn-color" @click="headBtn(key[lab.code])">{{key[lab.code]}}</a>
                  </div>
                  <div v-if="$index!==0 && index!==0">{{key[lab.code] | formatToFinacial}}</div>
                  <div v-if="$index!==0 && index==0 || ($index==0 && index==thData.length-1)" :class="{textColor:($index==0 && index==thData.length-1)}">{{key[lab.code]}}</div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <h4>费用分类</h4>
        <table class="type-table-style">
          <tbody>
            <tr v-for="(key, $index) in tableTypeData" :key="$index">
              <template v-if="$index!==2">
                <td v-for="(lab, index) in thTypeData" :key="index">
                  <template>
                    <!-- 第二行的排除第一列的所有列 -->
                    <div v-if="$index==1 && index!==0">{{key[lab.code] | formatToFinacial}}</div>
                    <!-- 第一列，第三行，第一行的最后一列 -->
                    <div v-if="index==0||$index==2||($index==0 && index == thTypeData.length-1)" :class="{textColor:($index==0 && index==thTypeData.length-1)}">{{key[lab.code]}}</div>
                    <!-- 第一行的排除第一列和最后一列 -->
                    <div v-if="$index==0 && index!==0 && index!== thTypeData.length-1">
                      <a class="btn-color" @click="headTypeBtn(key[lab.code])">{{key[lab.code]}}</a>
                    </div>
                  </template>
                </td>
              </template>
              <template v-if="$index==2">
                <td>大写金额</td>
                <td :colspan="thTypeData.length-1">
                  {{tableTypeData[2][thTypeData[1]['code']]}}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <settlement-info-footers :infoObj="infoObj"></settlement-info-footers>
      </div>
    </div>
    <ever-no-data v-if='!infoObj.flowFee'></ever-no-data>
    <pay-detail :dialogtosettle.sync="payDeatilObj.dialogtosettle" :payArray="payDeatilObj.payArray" :title="payDeatilObj.dialogtosettleTitle"></pay-detail>
    <type-pay-detail :visibile.sync="typePayDetailObj.visibile" :title="typePayDetailObj.title" :id="typePayDetailObj.id" :feeType="7" @printFrom="printFrom" :infoObj="infoObj"></type-pay-detail>
    <!-- <dailysettleto-settlecode :dialogtosettle.sync="dialogtosettle" :flowfeeData="flowfeeData" :title="dialogtosettleTitle"></dailysettleto-settlecode> -->
  </div>
</template>
<script>
import api from '@/rcm/store/income/dailysettlementapi'
import RegisterSettlementList from './registersettlementlist'
import SettlementInfoHead from './settlementinfohead'
import SettlementInfoData from './settlementinfodata'
import SettlementInfoFooters from './settlementinfofooters'
import TypePayDetail from './typepaydetail'
import PayDetail from './paydetail'
import jcpjs from 'jcpjs'
import DailysettletoSettlecode from '@/rcm/page/income/dailysettletosettlecode'
export default {
  data () {
    return {
      api,
      thData: [],
      thTypeData: [],
      tableData: [],
      tableDataaaa: [],
      tableTypeData: [],
      cardloading: false,
      updateList: false,
      cancelBtnShowsHidden: false, // 按钮显示隐藏判断
      payDeatilObj: {
        dialogtosettle: false,
        dialogtosettleTitle: '',
        payArray: []
      },
      typePayDetailObj: {
        title: '',
        visibile: false,
        id: ''
      },
      objId: this.$route.query.id,
      dayKnotId: this.$route.query.closeId, // 日结单id
      excelId: '',
      infoObj: {
        title: '',
        createBy: '', // 供套餐单独打印传参使用
        createUser: '',
        closeTime: '',
        preCloseTime: '',
        flowFee: '',
        disFee: '',
        receiveFee: '',
        returnFee: '',
        totalCount: '',
        receiveCashFee: '',
        upperCase: ''
      }
    }
  },
  components: {
    PayDetail,
    TypePayDetail,
    RegisterSettlementList,
    SettlementInfoHead,
    SettlementInfoData,
    SettlementInfoFooters,
    DailysettletoSettlecode // 支付流水
  },
  methods: {
    // 取消日结按钮
    handlerCancelTheDate () {
      this.$confirm(
        '您是否确认取消日结，取消日结将会使最近的日结数据删除，是否继续？',
        '提示',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          api.cancelCloseMarketing(this.dayKnotId).then(res => {
            if (res && res.head && res.head.errCode === 0) {
              this.dayKnotId = ''
              this.objId = ''
              this.cancelBtnShowsHidden = false
              this.getInfo()
            }
          })
        })
        .catch(() => {})
    },
    printFrom () {
      var mydoc = {
        documents: document,
        // settings: {
        //   paperName: 'A4',
        //   portrait: true
        // },
        settingsId: '商城收费员日报表',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      if (window.navigator.userAgent.indexOf('Mac OS') === -1) {
        jcpjs.getJCP().printPreview(mydoc)
      }
    },
    async headBtn (methods) {
      this.payDeatilObj.dialogtosettle = true
      this.payDeatilObj.dialogtosettleTitle = methods
      this.payDeatilObj.payArray = []
      try {
        let params = {
          name: methods,
          id: this.excelId
        }
        let json = await api.getPaymentInfo(params)
        if (json.data) {
          this.payDeatilObj.payArray = json.data
        } else {
        }
      } catch (err) {}
    },
    async createDailySettlementFn () {
      try {
        await this.$confirm('是否确认结账', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let data = await api.mallClose()
        if (data.head && data.head.errMsg === 'Success') {
          this.updateList = true
          this.getInfo()
        }
      } catch (err) {
        console.log('取消')
      }
    },
    async headTypeBtn (methods) {
      this.typePayDetailObj.title = methods
      this.typePayDetailObj.id = this.excelId
      this.typePayDetailObj.visibile = true
    },
    empty () {
      this.$router.push({ path: '/rcm/daily/rcmSettlement' })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 2) {
        if (columnIndex === 1) {
          return [1, this.thTypeData.length - 1]
        } else {
          return [1, 1]
        }
      }
    },
    getInfo () {
      if (this.dayKnotId) {
        api.canYouCancelMarketing(this.dayKnotId).then(res => {
          res && res.data
            ? (this.cancelBtnShowsHidden = true)
            : (this.cancelBtnShowsHidden = false)
        })
      }
      let params = {}
      if (this.objId) params.closeNo = this.objId
      api.getMallData(params).then(rs => {
        if (rs.head.errCode === 0 && rs.data) {
          this.excelId = rs.data.id
          this.initInfoData(rs.data)
          this.initFeeData(rs.data.paymethodSum)
          this.initThTypeData(rs)
          // console.log(this.infoObj.flowFee, 123)
        } else {
          this.infoObj.flowFee = ''
        }
      })
    },
    initInfoData (json) {
      this.infoObj.title = '商城收费员日报表'
      this.infoObj.createUser = json.createUser // 收款员
      this.infoObj.createBy = json.createBy // 收款员id,供套餐日结打印使用
      this.infoObj.preCloseTime = json.closeTime // 上次日结时间
      this.infoObj.closeTime = json.newTime // 截止时间
      this.infoObj.flowFee = json.flowFee // 应收金额
      this.infoObj.disFee = json.disFee // 优惠合计
      this.infoObj.receiveFee = json.receiveFee // 实收金额
      this.infoObj.returnFee = json.returnFee // 退款合计
      this.infoObj.totalCount = json.count // 收据总张数
      this.infoObj.receiveCashFee = json.receiveCashFee // 应交金额
      this.infoObj.upperReceiveCashFee = json.upperReceiveCashFee // 应交金额大写
    },
    initFeeData (data) {
      let thData = [{ code: 'colName' }]
      let tableData = [
        { colName: '' },
        { colName: '收款合计' },
        { colName: '退款合计' },
        { colName: '小计' }
      ]
      let payMethodSum = 0
      let refundFeeSum = 0
      let totalFeeSum = 0
      data.forEach(item => {
        let obj = {
          code: item.payMethod
        }
        thData.push(obj)
        tableData[0][item.payMethod] = item.name
        tableData[1][item.payMethod] = item.receiveFee
        tableData[2][item.payMethod] = item.refundFee
        tableData[3][item.payMethod] = item.totalFee
        payMethodSum += item.receiveFee
        refundFeeSum += item.refundFee
        totalFeeSum += item.totalFee
      })
      thData.push({ code: 'sum' })
      tableData[0]['sum'] = '合计'
      tableData[1]['sum'] = payMethodSum
      tableData[2]['sum'] = refundFeeSum
      tableData[3]['sum'] = totalFeeSum
      this.thData = thData
      this.tableData = tableData
    },
    initThTypeData (json) {
      let thTypeData = [{ code: 'colName' }]
      let tableTypeData = [
        { colName: '项目' },
        { colName: '金额' },
        { colName: '大写金额' }
      ]
      for (let key in json.data.accountType) {
        let obj = { code: key }
        thTypeData.push(obj)
        tableTypeData[0][key] = key
        tableTypeData[1][key] = json.data.accountType[key]
        tableTypeData[2][key] = json.data.upperaccountTypeFee
      }
      thTypeData.push({ code: 'sum' })
      tableTypeData[0]['sum'] = '合计'
      tableTypeData[1]['sum'] = json.data.accountTypeFee
      this.thTypeData = thTypeData
      this.tableTypeData = tableTypeData
    }
  },
  watch: {
    '$route.query.id': {
      handler: function (val, oldval) {
        if (val !== oldval) {
          this.objId = val
          this.dayKnotId = this.$route.query.closeId
          this.getInfo()
        }
      },
      immediate: true
    }
  },
  created () {
    this.getInfo()
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
.main-head {
  margin: 20px;
  float: right;
}
.info-content {
  margin-top: 80px;
  padding: 30px 70px;
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
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  line-height: 35px;
  text-align: center;
}
table tr {
  border-bottom: 1px solid #000;
}
table tr td {
  border-right: 1px solid #000;
}
</style>
