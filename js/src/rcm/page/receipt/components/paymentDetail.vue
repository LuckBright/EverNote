  <template>
  <div v-loading="payLoading">
    <ever-bread-crumb
      :name="title"
      :showTitle="title"
      :path="$route.query.source==1?'/financial/insuranceInfoManage':'/rcm/receipt/tabs/' + $route.query.status"
      :pathTo="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="settle_detail">
        <h4 class="settle_title">收费详情</h4>
        <div class="settle_patientinfo">
          <el-row>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">用户信息：</el-col>
                <el-col :span="16">
                  {{userInfo.name}}
                  <b v-if="userInfo.patientAgeShowText">/</b>
                  {{userInfo.patientAgeShowText}}
                  <b v-if="userInfo.sex">/</b>
                  {{userInfo.sex | filterSex}}
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">申请人：</el-col>
                <el-col :span="16">{{userInfo.sellerName}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">申请时间：</el-col>
                <el-col :span="16">{{userInfo.orderTime}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">业务来源：</el-col>
                <el-col :span="16">{{userInfo.bizType | filterBiz}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">结算单号：</el-col>
                <el-col :span="16">{{obj.settlementNo}}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <ever-check
          v-for="(item,index) in tableList"
          :item="item"
          :index="index"
          @listenCheckData="getCheckData"
          :key="index"
          v-show="toggledetailStatus"
          :isShowCheck="false"
          :checked="checked"
        ></ever-check>
        <div class="toggle_settledetail" @click="toggledetail">
          <span class="setCursor">
            结算详情
            <i class="el-icon-arrow-down" :class="{active: toggledetailStatus}"></i>
          </span>
        </div>
      </div>
    </div>
    <pay-options
      :obj="obj"
      @getData="getData"
      :age="userInfo.patientAgeShowText"
      ref="settlepayment"
      :tableList="tableList"
    ></pay-options>
  </div>
</template>
<script type="text/javascript">
import { getPayment, getListInfo } from '../../../store/marketingReceiptApi'
import everCheck from './everCheck'
import payOptions from './payOptions'
export default {
  components: {
    everCheck,
    payOptions
  },
  data () {
    return {
      payLoading: false,
      title: '支付',
      toggledetailStatus: false,
      membersNo: this.$route.query.membersNo,
      settlementId: this.$route.query.settlementId,
      status: this.$route.query.status,
      patientId: this.$route.query.patientId,
      direction: this.$route.query.direction,
      bizType: this.$route.query.bizType,
      tableList: [],
      obj: {
        exeFee: '',
        // 结算单号
        settlementNo: '',
        settlementId: '',
        medicalNo: '', // 选择全自费可以填写医保卡号然后进行医保报销
        // 结算单id
        settlementid: '',
        paymethodArr: [],
        loading: false,
        payObj: {
          paymethod: 1,
          remark: '',
          flowfee: ''
        },
        payTradeLog: [],
        status: '',
        direction: this.$route.query.direction || ''
      },
      userInfo: {},
      checked: false,
      billingData: ''
    }
  },
  filters: {
    filterSex (value) {
      switch (parseInt(value)) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return ''
      }
    },
    filterBiz (value) {
      switch (parseInt(value)) {
        case 0:
          return '商城'
        case 1:
          return '营销'
        case 2:
          return '充值'
        case 3:
          return '套餐'
        default:
          return ''
      }
    }
  },
  created () {
    this.orderList().then(data => {
      this.$refs.settlepayment.receiptlist()
      // this.getData()
    }).then(data => { })
  },
  methods: {
    toggledetail () {
      this.toggledetailStatus = !this.toggledetailStatus
    },
    async orderList () {
      this.payLoading = true
      try {
        let params = {
          membersNo: this.membersNo,
          status: this.status,
          patientId: this.patientId,
          direction: this.direction,
          bizType: this.bizType,
          settlementId: this.settlementId
        }
        let payMentParams = {
          type: 3
        }
        let data = await getListInfo(params)
        let payMentData = await getPayment(payMentParams)
        if (data && data.data) {
          this.tableList = data.data
          this.userInfo = data.data[0]
          if (data && data.data && data.data.length) {
            Object.assign(this.obj, data.data[0])
          }
        } else {
          this.payLoading = false
        }
        if (payMentData && payMentData.data) {
          Object.assign(this.obj.paymethodArr, payMentData.data.default)
          // 把微信支付宝拆出来
          this.obj.payChannel = this.obj.paymethodArr.filter(item => (item.value === 3 || item.value === 4))
          // 剩下的放一起
          this.obj.paymethodArr = this.obj.paymethodArr.filter(item => item.value !== 3 && item.value !== 4)
          this.userInfo.settlementNo = payMentData.data.settlementNo
        } else {
          this.payLoading = false
        }
        this.payLoading = false
      } catch (err) {
        this.payLoading = false
        console.log(err)
      }
    },
    getCheckData (data, index) { },
    getData () {
      this.status = this.$route.query.status
      console.log(this.status)
      this.orderList()
    }
  }
}
</script>
  <style type="text/css" scoped>
.settle_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 3px 0 3px;
}
.settle_detail .settle_patientinfo {
  line-height: 24px;
  white-space: nowrap;
  color: #000;
  padding-top: 10px;
  font-size: 14px;
}
.settle_detail .settle_patientinfo b {
  font-weight: normal;
}
.settle_detail .settle_label {
  color: #999;
  text-align: right;
}
.settle_detail .settle_patientinfo > .el-row {
  margin: 10px 0 10px;
}
.settle_detail .select_settle {
  line-height: 40px;
}
.settle_detail hr {
  margin: 30px 0 30px;
}
.preferential_title {
  height: 90px;
  line-height: 90px;
  position: relative;
}
.preferential_title .el-button--text {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
#app
  .settlement_detail
  .preferential
  .preferential_title
  .el-button.is-disabled {
  color: #999;
  background-color: #fff;
}
.preferential_title span {
  padding-right: 100px;
}
.preferential_title .el-icon-arrow-down {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}
.preferential_title .el-icon-arrow-down_up {
  transform: rotateZ(180deg);
}
.preferential_title .gift_text {
  position: absolute;
  left: 10px;
  bottom: 14px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  color: #ff9c00;
}
.preferential_title .benefit_text {
  left: 10px;
}
.preferential_title .giftcard_text {
  left: 202px;
}
.preferential_title .member_text {
  left: 400px;
}
.settle_table .el-table__expand-column .cell {
  margin-left: -25px;
}
.settle_table .el-table__expanded-cell {
  padding: 0;
}
.layout_box .layout_main .settle_table .el-table {
  margin: 0;
  border: none;
}
.layout_box .layout_main .settle_table .el-table tr {
  background: #eee;
}
.layout_box .layout_main .settle_table .el-table thead th {
  background: #eee;
}
.layout_box .layout_main .settle_table .el-table thead div {
  background: #eee;
}
.el-icon-arrow-down {
  transition: all 0.5s;
}
.el-icon-arrow-down.active {
  transform: rotateZ(180deg);
}
.settle_totalFee {
  height: 54px;
  line-height: 54px;
  font-size: 14px;
  color: #999;
  text-align: right;
}
.settle_btngroup {
  clear: both;
  height: 40px;
  margin: 10px 0 10px;
}
.toggle_settledetail {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #1c7bef;
  text-align: center;
}
.toggle_settledetail .el-icon-arrow-down {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}
.toggle_settledetail .el-icon-arrow-down_up {
  transform: rotateZ(180deg);
}
.moremedicalinfo {
  padding-left: 20px;
  font-weight: bold;
  color: #1c7bef;
  cursor: pointer;
  text-decoration: underline;
}
.settle_patientinfo /deep/ .card_no_settle {
  margin-top: -6px;
}
.settle_patientinfo /deep/ .highlight {
  color: #ee4433;
}
.settle_patientinfo /deep/ .highlight .settle_label {
  color: #ee4433;
}
.settle_needpay {
  line-height: 64px;
  height: 64px;
  color: #999;
  font-size: 14px;
  text-align: right;
}
.settle_needpay span {
  color: #ff9c00;
  font-size: 24px;
}
.setCursor {
  cursor: pointer;
}
</style>

