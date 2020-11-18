<template>
  <div class="containHeight">
    <el-container v-loading="cardloading">
      <patient-list :hosType="1" ref="patientlist" @getdata="list"></patient-list>
      <div @click="togglePatientList" class="maincontainer">
        <el-header>
          <ever-query-form
            :schema="querySchema"
            v-model="queryObj"
            @query="query"
            class="main-form"
          >
            <template slot-scope="scope" slot="hospitalobj">
              <hospitalselect
                :hosType="1"
                v-model="scope.obj.hospitalobj"
                @change="handlePatientChange"
              ></hospitalselect>
            </template>
          </ever-query-form>
          <div style="background-color:#fff;padding:100px;" v-if="noData">
            <ever-no-data></ever-no-data>
          </div>
        </el-header>
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
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            :router="false"
          >
            <el-menu-item index="/adt/dischargemanagement/dischargemanage">收款管理</el-menu-item>
            <el-menu-item index="/adt/dischargemanagement/chargedetail">费用明细</el-menu-item>
          </el-menu>
          <div class="routerview">
            <router-view @refresh="refresh" :paramsObj="obj"></router-view>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import patientList from '@/rcm/page/hospitalization/patientlist'
import { getPatientInfo } from '@/rcm/store/hospital/hospital'
import list from '@/util/list'
import commonHead from '@/inpatient/components/common.head.js'
import hospitalselect from '@/components/hospitalselect'
let schema = [
  {
    label: '病案号',
    name: 'hospitalobj',
    placeholder: '输入患者姓名',
    type: 'custom',
    options: []
  }
]
export default {
  mixins: [list],
  components: {
    patientList,
    commonHead,
    hospitalselect
  },
  filters: {
    // 0:未上传，1：已上传，2:预结算，3:已结算
    filterType (value) {
      switch (parseInt(value)) {
        case 0:
          return '未上传'
        case 1:
          return '已上传'
        case 2:
          return '预结算'
        case 3:
          return '已结算'
        default:
          return ''
      }
    }
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
    var queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    return {
      querySchema: schema,
      queryObj: queryObj,
      obj: {},
      cardloading: false,
      // 新页面
      activeIndex: '/adt/dischargemanagement/dischargemanage',
      info: [],
      noData: true,
      // 0是医保，1商保，2是自费
      checkList: [
        { name: '全自费', value: 2 },
        { name: '本地医保', value: 0 }
      ]
    }
  },
  created () {
    this.list()
    // 兼容点击列表外区域关闭左侧患者列表
    document.onclick = (event) => {
      // console.log(event, event.target.className, '点击事件')
      let e = event.target || event.srcElement
      if (e.className === 'containHeight') {
        this.togglePatientList()
      }
    }
  },
  methods: {
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
    handlePatientChange (val) {
      if (val) {
        this.$router.push({
          path: '/adt/dischargemanagement/dischargemanage',
          query: {
            id: val.id,
            patientId: val.patientId,
            ipNo: val.hospitalizedNumber, // 住院流水号
            providerId: val.admitDeptId,
            ipStatus: val.status, // 在院状态
            patientName: val.patientName || '',
            birthday: val.birthday || '',
            sexName: val.sex === '1' ? '男' : '女',
            timer: Date.now()
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
    },
    refresh (val) {
      this.list()
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
