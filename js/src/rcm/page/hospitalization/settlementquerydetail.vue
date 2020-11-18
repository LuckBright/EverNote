<template>
  <div class="layout_inner">
    <ever-bread-crumb name="返回" :path="pathFrom" :haveReturn="true"></ever-bread-crumb>
    <div class="containHeight">
      <el-container v-loading="cardloading">
        <div class="maincontainer">
          <div v-if="!noData" class="dataArea">
            <div class="info-container">
              <common-head
                v-if="$route.query.patientId"
                :patientId="$route.query.patientId"
                :visitNumber="$route.query.ipNo"
                code="010"
                :key="$route.query.patientId"
              ></common-head>
            </div>
            <div class="routerview" :key="obj.id">
              <charge-tab  v-if="$route.query.ipStatus === 8 || $route.query.source == 'final'" @refresh="refresh" :paramsObj="obj"></charge-tab>
              <backChargeDetail
                v-else
                @refresh="refresh"
                :paramsObj="obj"
                :useType="useType"
              ></backChargeDetail>
            </div>
          </div>
        </div>
      </el-container>
    </div>
  </div>
</template>
<script>
import { getPatientInfo } from '@/rcm/store/hospital/hospital'
import list from '@/util/list'
import chargeTab from '@/rcm/page/hospitalization/chargetab.vue'
import backChargeDetail from '@/rcm/page/hospitalization/backchargedetail'
import CommonHead from '@/inpatient/components/common.head.js'

export default {
  mixins: [list],
  components: {
    chargeTab,
    backChargeDetail,
    CommonHead
  },
  data () {
    return {
      noData: true,
      obj: {
        payType: 2,
        payObj: {
          paymethod: 1,
          remark: '',
          flowfee: 0,
          auth_code: ''
        },
        id: '',
        ipStatus: 0,
        /** 优惠信息字段 */
        medFundFee: 0,
        memberCardPayedFee: 0,
        memberCardBenefitFee: 0,
        medPersonCountFee: 0,
        medFee: 0,
        comInsurancePayedFee: 0,
        comInsuranceFee: 0,
        comInsuranceBenefitFee: 0,
        totalFee: 0,
        promotionFee: 0,
        benefitCardFee: 0,
        giftCardFee: 0,
        totalDeposit: 0,
        refundFee: 0,
        receivableFee: 0,
        payTradeLog: []
      },
      cardloading: false,
      // 新页面
      info: [],
      useType: 'recall',
      pathFrom: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const fromPath = from.path
      vm.pathFrom = fromPath.indexOf('settlementQuery') > -1 ? null : '/adt/hospitalSettle/settlementQuery'
    })
  },
  created () {
    this.list()
  },
  methods: {
    getFromChild (data) {
      this.obj = Object.assign({}, this.obj, data)
    },
    // 患者列表
    async list () {
      // 方运哲提 乔登涛改 出院管理》费用明细》结算记录》详情 进来的这个页面的 recalled参数传
      let source = this.$route.query.source // 跳转过来的标志
      this.cardloading = true
      let params = {
        ipNo: this.$route.query.ipNo, // 病案号
        patientId: this.$route.query.patientId, // 患者id
        recalled: source ? 0 : 1, // 患者id
        settlementId: this.$route.query.settlementId, // 结算单id
        containsOutHospitalSettle: true // 押金列表中包含出院计算
      }
      try {
        let data = await getPatientInfo(params)
        if (data && Object.getOwnPropertyNames(data.data).length > 0) {
          this.noData = false
          data.data.billSumFeeNoSettle = data.billSumFeeNoSettle
          // 如果url上本身就有，就不用覆盖了，这块儿是中途结算跳转的时候，加入这个人本身又有了出院结算id，data.data就会带有出院结算的结算单id
          if (this.$route.query.settlementId) {
            delete data.data.settlementId
          }
          // printControl是控制发票打印重打，补打按钮的
          this.obj = Object.assign({}, this.obj, data.data)
          // 是否需要替换
          let chargedetail = {
            patientId: this.obj.patientId,
            ipNo: this.obj.ipNo,
            ipStatus: this.obj.ipStatus, // 在院状态
            ipSettleStatus: this.obj.ipSettleStatus // 住院结算状态
          }
          if (this.obj.settlementId) { // 如果有就是出院结算的结算单，把它带到url上
            chargedetail.settlementId = this.obj.settlementId
          }
          this.$router.replace({
            path: this.$route.path,
            query: Object.assign(this.$route.query, chargedetail)
          })
        } else {
          this.noData = true
        }
        this.cardloading = false
      } catch (err) {
        console.log(err)
        this.cardloading = false
      }
    },
    refresh (val) {
      this.list()
    },
    handlePatientChange (val) {
      if (val) {
        this.$router.push({
          path: '/adt/recall/dischargemanage',
          query: {
            id: val.id,
            patientId: val.patientId,
            ipNo: val.hospitalizedNumber, // 住院流水号
            providerId: val.admitDeptId,
            visitNumber: val.visitNumber,
            ipStatus: val.status, // 在院状态
            patientName: val.patientName || '',
            birthday: val.birthday || '',
            sexName: val.sex === '1' ? '男' : '女',
          }
        })
        this.list()
      }
    },
    handleSelect (key, keyPath) {
      this.$router.replace({
        path: key,
        query: this.$route.query
      })
    }
  }
}
</script>
<style lang="less" scoped>
.info-container {
  // padding: 20px 20px 0 20px;
  background-color: #fff;
  .box {
    float: left;
    margin-right: 20px;
    height: 28px;
    .boxContent {
      color: #000;
    }
  }
  .el-col-6 {
    padding-bottom: 20px;
    font-size: 14px;
    color: #000;
    .el-col-8 {
      text-align: right;
      padding-right: 10px;
      color: #666;
    }
    .depositBalance {
      font-weight: bold;
      color: #ff9c00;
    }
  }
}
</style>
<style scoped>
.main-form {
  padding: 10px 20px 0 20px;
  background-color: #fff;
  margin-bottom: 10px;
}
.containHeight {
  overflow: auto;
  background: white;
}
.containHeight .maincontainer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.containHeight .maincontainer .dataArea {
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.containHeight .el-header {
  /* height: 40px !important; */
  height: auto !important;
  background-color: #eaeaea;
  padding: 0;
  margin-bottom: 10px;
}
.containHeight .el-header /deep/ .el-form {
  background-color: #fff;
  /* border-bottom: 1px solid #eaeaea; */
}
.containHeight
  .el-header
  /deep/
  .el-form
  .el-form-item--mini
  .el-form-item__label {
  height: 28px;
  line-height: 28px;
}
.containHeight .el-menu--horizontal > .el-menu-item {
  color: #000;
  height: 40px;
  line-height: 40px;
}
.containHeight .el-menu-demo {
  margin-top: 10px;
  background-color: #f4f4f4;
}
.containHeight .el-container {
  background-color: #ebedef;
  flex-direction: column;
  height: 100%;
}
.containHeight .el-container.is-vertical {
  position: relative;
  height: 100%;
}
.containHeight .el-menu-demo .is-active {
  font-weight: bold;
  color: #1c7bef;
  background-color: #f4f4f4;
}
.containHeight .el-menu-demo .el-dropdown-menu__item--divided:before,
.el-menu,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #1c7bef;
}
.routerview {
  background-color: #fff;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.list_item {
  float: right;
  padding-right: 20px;
  padding-top: 14px;
  text-align: right;
}
.settlement_detail_label {
  font-size: 14px;
  color: #999;
}
.settlement_detail_money {
  color: #000;
  font-size: 14px;
}
.settle_totalFee,
.settle_needpay {
  font-size: 16px;
  color: #999;
  font-weight: 400;
  line-height: 50px;
  vertical-align: middle;
}
.settle_totalFee span {
  color: #666;
  line-height: 50px;
  font-weight: 500;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
}
.settle_needpay span {
  font-size: 24px;
  font-weight: 500;
  line-height: 40px;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
}
</style>
