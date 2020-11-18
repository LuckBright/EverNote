  <template>
  <div>
    <ever-bread-crumb :name="title" :showTitle="title" :path="'/rcm/receipt/tabs/' + $route.query.status"></ever-bread-crumb>
    <div class="layout_inner" v-loading="receiptLoading">
      <div class="settle_detail">
        <h4 class="settle_title">收费详情</h4>
        <div class="settle_patientinfo">
          <el-row>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">用户信息：</el-col>
                <el-col :span="16">{{obj.name}}
                  <b v-if="obj.patientAgeShowText">/</b> {{obj.patientAgeShowText}}
                  <b v-if="obj.sex">/</b> {{obj.sex | filterSex}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">申请人：</el-col>
                <el-col :span="16">{{obj.sellerName}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">申请时间：</el-col>
                <el-col :span="16">{{obj.orderTime}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row>
                <el-col :span="8" class="settle_label">业务来源：</el-col>
                <el-col :span="16">{{obj.bizType | filterBiz}}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="setCheckHead">
          <div class="checkHead">
            <el-checkbox v-model="checked" @change="handleCheckedCitiesChange">全选</el-checkbox>
          </div>
          <div class="checkCon">
            <ever-check v-for='(item,index) in tableList' :item='item' :index='index' @listenCheckData='getCheckData' :key='index' :isShowCheck='true' :checked='checked' ref="ischeck"></ever-check>
          </div>
        </div>
        <div class="settle_needpay" v-if="direction===2">退款金额
          <span>￥ {{payPrice | formatToFinacial}}</span>
        </div>
        <div class="settle_needpay" v-else>费用总计
          <span>￥ {{payPrice | formatToFinacial}}</span>
        </div>
        <div class="settle_btngroup">
          <el-button type="primary" style="float: right;" @click='paymentBtn'>结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
  <script type="text/javascript">
import { getReceiot, payment } from '../../../store/marketingReceiptApi'
import everCheck from './everCheck'
export default {
  components: {
    everCheck
  },
  data () {
    return {
      title: '结算',
      membersNo: this.$route.query.membersNo,
      orderNo: this.$route.query.orderNo,
      status: this.$route.query.status,
      settlementId: this.$route.query.settlementId,
      direction: this.$route.query.direction,
      patientId: this.$route.query.patientId,
      bizType: this.$route.query.bizType,
      tableList: [],
      checkList: [],
      payPrice: 0,
      flowFeeObj: [],
      sendFlowFee: [],
      obj: {
        name: '',
        age: '',
        sex: '',
        applicantName: '',
        orderTime: '',
        bizType: ''
      },
      receiptLoading: false,
      checked: true
    }
  },
  created () {
    this.orderList()
  },
  filters: {
    filterSex (value) {
      switch (parseInt(value)) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return '--'
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
  methods: {
    async orderList () {
      // this.receiptLoading = true
      try {
        let params = {
          membersNo: this.membersNo,
          status: this.status,
          patientId: this.patientId,
          bizType: this.bizType,
          direction: this.direction,
          orderNo: this.orderNo
        }
        let data = await getReceiot(params)
        this.tableList = data.data
        Object.assign(this.obj, data.data[0])
        this.$nextTick(() => {
          this.handleCheckedCitiesChange()
        })
        this.receiptLoading = false
      } catch (err) {
        this.receiptLoading = false
      }
    },
    getCheckData (data, index) {
      console.log(index)
      this.payPrice = 0
      this.sendFlowFee = []
      if (data.length > 0) {
        this.checkList[index] = this.tableList[index]
      } else {
        this.checkList[index] = ''
      }
      this.checkList.forEach(item => {
        if (item.payPrice) {
          this.payPrice += parseFloat(item.payPrice)
        }
          // if (item.detail && item.detail.payPrice) {
          //   item.detail.payPrice = this.payPrice
          // }
        item.detail.forEach(v => {
          v.payPrice = this.payPrice
        })
      })
      const noEmpty = [...this.checkList].filter(item => {
        return item !== ''
      })
      noEmpty.forEach(item => {
        item.detail.forEach(index => {
          this.sendFlowFee.push(index)
        })
      })
      if (noEmpty.length === this.checkList.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    handleCheckedCitiesChange () {
      if (this.checked) {
        this.$refs.ischeck.forEach(item => {
          item.toggleSelection(true)
        })
      } else {
        this.$refs.ischeck.forEach(item => {
          item.toggleSelection(false)
        })
      }
    },
    async paymentBtn () {
      let params = {
        membersNo: this.membersNo,
        patientId: this.tableList[0].patientId,
        details: this.sendFlowFee
      }
      try {
        let data = await payment(params)
        if (data && data.data && data.data.tradeSuccess) {
          this.$router.push({
            path: '/rcm/paymentDetail',
            query: {
              membersNo: this.membersNo,
              settlementId: data.data.code,
              orderNo: this.orderNo,
              status: 1,
              patientId: this.tableList[0].patientId,
              direction: this.direction,
              source: 2
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
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
  color: #ee4433;
  font-size: 24px;
}
.setCheckHead {
  border: 1px solid #eee;
  line-height: 50px;
  padding: 10px;
}
.checkHead {
  height: 50px;
  border: 1px solid #eee;
  background-color: #f5f5f5;
  padding-left: 12px;
}
.checkHead .el-checkbox {
  width: 100%;
}
.checkHead /deep/ .el-checkbox__label {
  padding-left: 40px;
  color: #1f2d3d;
  font-weight: bold;
}
.checkCon {
}
</style>

