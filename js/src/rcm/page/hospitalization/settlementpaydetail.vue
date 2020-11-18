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
            <div class="routerview">
              <charge-tab @refresh="refresh" :paramsObj="obj"></charge-tab>
            </div>
          </div>
        </div>
      </el-container>
    </div>
  </div>
</template>
<script>
import { getPatientInfo, getValueByCode } from '@/rcm/store/hospital/hospital'
import commonHead from '@/inpatient/components/common.head.js'
import chargeTab from '@/rcm/page/hospitalization/chargetab.vue'
export default {
  components: {
    commonHead,
    chargeTab
  },
  watch: {
    $route: {
      handler: function (val, oldval) {
        this.activeIndex = val.path
      },
      immediate: true
    }
  },
  data () {
    return {
      obj: {},
      cardloading: false,
      info: [],
      noData: true,
      pathFrom: null
    }
  },
  beforeRouteEnter (to, from, next) {
    // 根据当前url判断返回怎么执行
    next(vm => {
      const fromPath = from.path
      vm.pathFrom = fromPath.indexOf('settlementPay') || fromPath.indexOf('inhosmanage') > -1 ? null : '/adt/hospitalSettle/settlementPay'
    })
  },
  created () {
    this.list()
    this.getCode()
  },
  methods: {
    getCode () {
      getValueByCode({ code: 'refund_method' }).then(res => {
        this.obj = Object.assign({}, this.obj, {refundMethod: res.data})
      })
    },
    // 患者列表
    async list () {
      this.cardloading = true
      let params = {
        ipNo: this.$route.query.ipNo, // 病案号
        patientId: this.$route.query.patientId, // 患者id
        recalled: 0, // 非召回
        containsOutHospitalSettle: true // 押金列表中包含出院计算
      }
      try {
        let data = await getPatientInfo(params)
        if (data && Object.getOwnPropertyNames(data.data).length > 0) {
          this.noData = false
          data.data.billSumFeeNoSettle = data.billSumFeeNoSettle
          if (!data.data.settlementId) { // 如果还没结算，刷新的时候，就不要覆盖保险类型
            delete this.obj.settlementId
          }
          this.$store.commit('setGdcfInsuranceInfo', { insuranceOrgId: data.data.insuranceOrgId })
          this.obj.insuranceType = Number(this.obj.insuranceType) || 2 // 给默认值
          // printControl是控制发票打印重打，补打按钮的
          this.obj = Object.assign({}, this.obj, data.data)
          let chargedetail = {
            patientId: this.obj.patientId,
            ipNo: this.obj.ipNo,
            ipStatus: this.obj.ipStatus, // 在院状态
            ipSettleStatus: this.obj.ipSettleStatus // 住院结算状态
          }
          if (this.obj.settlementId) { // 如果有，就是出院结算单id
            chargedetail.settlementId = this.obj.settlementId
          }
          this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, ...chargedetail }
          })
        } else {
          this.noData = true
        }
        this.cardloading = false
      } catch (err) {
        // console.log(err)
        this.cardloading = false
      }
    },
    refresh (val) {
      this.list()
    },
  }
}
</script>

<style lang="less" scoped>
.info-container {
  // padding: 20px 20px 0 20px;
  border-radius: 4px;
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
  display: flex;
  height: 100%;
  overflow: auto;
  background-color: #ffffff;
}
.containHeight .maincontainer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.containHeight .maincontainer .dataArea {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  flex-direction: column;
}
.containHeight .el-header {
  background-color: #eaeaea;
  padding: 0;
  height: auto !important;
}
.containHeight .el-header /deep/ .el-form {
  background-color: #fff;
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
.containHeight .el-container {
  background-color: #ebedef;
  flex-direction: column;
  height: 100%;
}
.containHeight .el-container.is-vertical {
  position: relative;
  height: 100%;
}
.containHeight .el-menu-demo {
  margin-top: 10px;
  background-color: #f4f4f4;
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
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  background-color: #fff;
  padding: 15px;
  overflow: hidden;
}
</style>
