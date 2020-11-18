<template>
  <div class="containHeight">
    <el-container v-loading="cardloading" style="height:100%;">
      <patient-list ref="patientlist" :hosType="3"></patient-list>
      <div @click="togglePatientList" class="mianContainer">
        <el-header>
          <ever-query-form
            :schema="querySchema"
            v-model="queryObj"
            @query="query"
            class="main-form"
          >
            <template slot-scope="scope" slot="hospitalobj">
              <hospitalselect :hosType="3" v-model="scope.obj.hospitalobj"></hospitalselect>
            </template>
          </ever-query-form>
        </el-header>
        <div style="background-color:#fff;padding:100px;" v-if="noData">
          <ever-no-data></ever-no-data>
        </div>
        <div v-if="!noData" class="dataArea">
          <common-head
            v-if="$route.query.patientId"
            :patientId="$route.query.patientId"
            :visitNumber="$route.query.ipNo"
            code="010"
            :key="$route.query.patientId"
          ></common-head>
          <div class="routerview" :key="obj.id">
            <div class="dataupper">
              <cost-list :check="check"></cost-list>
              <!-- 优惠信息 没有出院结算不展示-->
              <template v-if="obj.ipStatus==9">
                <h3 style="border-left:3px solid #1c7bef;padding-left:5px;">优惠详情</h3>
                <fee-list :obj="obj"></fee-list>
              </template>
            </div>
            <div style="text-align:right;">
              <span class="settle_totalFee">
                费用总计：
                <span>￥ {{obj.totalFee | formatToFinacial}}</span>
              </span>
              <span class="settle_totalFee">
                优惠合计：
                <span>￥ {{(obj.totalBenefitFee) | formatToFinacial}}</span>
              </span>
              <span class="settle_totalFee">
                应收金额：
                <span
                  style="margin-right:50px;font-size:25px;color:#e43;"
                >￥ {{obj.receivableFee | formatToFinacial}}</span>
              </span>
              <el-button type="primary" @click="print(obj.ipNo, obj.settlementId)">打印费用清单</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import patientList from '@/rcm/page/hospitalization/patientlist'
import CommonHead from '@/inpatient/components/common.head.js'
import costList from './costlist.vue'
import { getPatientInfo, getRecalledInfo } from '@/rcm/store/hospital/hospital'
import list from '@/util/list'
import feeList from '@/rcm/page/hospitalization/feelist'
import backChargeDetail from '@/rcm/page/hospitalization/backchargedetail'
import { everprint } from '@/util/common'
import hospitalselect from '@/components/hospitalselect'

let schema = [
  {
    label: '病案号',
    name: 'hospitalobj',
    placeholder: '输入患者姓名',
    type: 'custom'
  }
]
export default {
  mixins: [list],
  components: {
    patientList,
    feeList,
    backChargeDetail,
    CommonHead,
    costList,
    hospitalselect
  },
  data () {
    var queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    return {
      dialogVisible: false,
      querySchema: schema,
      queryObj: queryObj,
      noData: true,
      obj: {
        payType: 2,
        payObj: {
          paymethod: 1,
          remark: '',
          flowfee: 0
        },
        id: '',
        ipStatus: 0,
        receivableFee: 0,
        payTradeLog: [],
        totalFee: 0
      },
      cardloading: false,
      userInfo: {
        patientId: this.$route.query.patientId,
        visitNumber: this.$route.query.ipNo,
        providerId: this.$route.query.providerId
      },
      check: {
        showSetName: '0',
        excludeUrgent: '0',
        excludeClassC: '0',
        listTotalCount: 0
      }
    }
  },
  watch: {
    '$route.query.patientId': {
      handler: function (val, oldval) {
        if (val !== oldval) {
          this.list()
          if (String(this.$route.query.isList) === 'true') {
            this.queryObj.hospitalobj = ''
          }
        }
      }
    },
    'queryObj.hospitalobj': {
      handler: function (val, oldval) {
        if (val) {
          this.$router.push({
            path: '/adt/costlistsearch',
            query: {
              patientId: val.patientId,
              ipNo: val.hospitalizedNumber,
              ipStatus: val.status, // 在院状态
              providerId: val.admitDeptId,
              timer: Date.now()
            }
          })
          // 优惠详情中数据同步更新
          this.list()
        }
      }
    }
  },
  created () {
    this.list()
    document.onclick = event => {
      let e = event.target || event.srcElement
      if (e.className === 'containHeight') {
        this.togglePatientList()
      }
    }
  },
  methods: {
    // 患者列表
    async list () {
      // 方运哲提 乔登涛改 出院管理》费用明细》结算记录》详情 进来的这个页面的 recalled参数传
      let source = this.$route.query.source
      this.cardloading = true
      let params = {
        ipNo: this.$route.query.ipNo, // 病案号
        patientId: this.$route.query.patientId, // 患者id
        recalled: source ? 0 : 1, // 患者id
        settlementId: this.$route.query.settlementId // 结算单id
      }
      try {
        let data = await getPatientInfo(params)
        if (data && Object.getOwnPropertyNames(data.data).length > 0) {
          this.noData = false
          this.obj = data.data
          // 是否需要替换
          let chargedetail = {
            patientId: this.obj.patientId,
            ipNo: this.obj.ipNo,
            settlementId: this.obj.settlementId,
            ipStatus: this.obj.ipStatus, // 在院状态
            ipSettleStatus: this.obj.ipSettleStatus // 住院结算状态
          }
          this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, ...chargedetail }
          })
          this.getFeeInfo(this.obj.ipNo)
        } else {
          this.noData = true
        }
        this.cardloading = false
      } catch (err) {
        console.log(err)
        this.cardloading = false
      }
    },
    getFeeInfo (ipNo) {
      if (!ipNo) return
      getRecalledInfo({
        offset: 0,
        pagesize: 1,
        ipNo: ipNo
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj = Object.assign({}, this.obj, rs.data.settlement)
        }
      })
    },
    query () {
      this.list()
    },
    async print (ipNo, settlementId) {
      if (this.check.listTotalCount === 0) {
        this.$messageTips(this, 'error', '暂无明细')
        return
      }
      let params = { ipNo: ipNo, loginid: localStorage.USERID }
      everprint('hospitalFeeList', params, { preview: true })
    },
    togglePatientList () {
      if (this.$refs.patientlist.isShow) {
        this.$refs.patientlist.isShow = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main-form {
  padding: 10px 20px 0 20px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 4px;
}
.containHeight {
  height: 100%;
  .mianContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .dataArea {
      flex: 1;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .dataupper {
        flex: 1;
        overflow: scroll;
      }
    }
  }
}
.containHeight .el-header {
  height: auto !important;
  padding: 0;
}
.containHeight .el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.containHeight .el-menu-demo {
  margin-top: 20px;
}
.containHeight .el-container.is-vertical {
  position: relative;
  height: 100%;
}
.containHeight .el-menu-demo .is-active {
  background-color: #f4f4f4;
}
.el-menu-demo {
  background-color: #f4f4f4;
}
.containHeight .el-menu-demo .el-dropdown-menu__item--divided:before,
.el-menu,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #f4f4f4;
}
.routerview {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: scroll;
  background-color: #fff;
  padding: 20px;
  padding-bottom: 0;
}
.info-container {
  padding: 20px 20px 0 20px;
  background-color: #fff;
  .el-col-6 {
    padding-bottom: 20px;
    font-size: 14px;
    color: #333;
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
  color: #333;
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

