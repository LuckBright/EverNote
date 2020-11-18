<template>
  <div class="chargedetail">
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :inline="true"
      :is-query="true"
      @query="list(true)"
      class="chargedetailform"
    >
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="handleBenefit(true)">查询</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button
            type="primary"
            v-if="($route.query.ipSettleStatus==-1&&insuranceType=='2')"
            @click="handleDiscountShow"
          >优惠比例</el-button>
          <div
            v-if="drpDisable"
            class="pos_re inline-block ml10 tips_active pointer"
            @click="handleDeliveryRoom"
          >
            <em class="pos_ab tips_icon twinkling">●</em>
            <i class="icon iconfont icon-chanjian" style="fontSize:21px" title="套餐结算"></i>
            <span class="temfont">套餐结算</span>
          </div>
          <el-button
            v-if="$hasPermission('Auth_menu_crm_packagesale_list') && drpDisable"
            type="primary"
            class="ml10"
            @click="handlePackageInquiry"
          >套餐查询</el-button>
          <el-button class="ml10" type="text" @click="settleLogBtn">
            结算记录
            <i class="el-icon-arrow-right myArrow"></i>
          </el-button>
          <el-button class="ml10" type="text" @click="typeLayerBtn">
            类别汇总表
            <i class="el-icon-arrow-right myArrow"></i>
          </el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="createTime" label="时间" width="160"></el-table-column>
      <el-table-column prop="itemName" label="项目名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemClassName" label="类别" width="130"></el-table-column>
      <el-table-column prop="spec" label="规格" width="120"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="100" align="right"></el-table-column>
      <el-table-column prop="unitPrice" label="单价" width="120" align="right">
        <template slot-scope="scope">{{scope.row.unitPrice | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="fee" label="应收金额" width="120" align="right">
        <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣比例" width="100" :formatter="convertToPercent"></el-table-column>
      <el-table-column prop="actualFee" label="实收金额" width="120" align="right">
        <template slot-scope="scope">{{scope.row.actualFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="chargeLevelName" label="收费等级" width="90"></el-table-column>
    </el-table>
    <ever-pagination
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
    <!-- 类别汇总 -->
    <el-dialog
      title="类别汇总"
      :modal-append-to-body="true"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <type-list ref="typelist" :obj="obj"></type-list>
    </el-dialog>
    <!-- 结算记录 -->
    <el-dialog
      title="结算记录"
      :visible.sync="settleVisible"
      :modal-append-to-body="true"
      :append-to-body="true"
      width="40%"
    >
      <el-table :data="recordingData" style="width: 100%" v-loading="recordingLoading" border>
        <el-table-column prop="createTime" label="结算时间"></el-table-column>
        <el-table-column prop="totalFee" label="费用总金额" align="right">
          <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="详情" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="settleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 优惠比例 -->
    <el-dialog
      title="优惠比例"
      :visible.sync="discountShow"
      :modal-append-to-body="true"
      :append-to-body="true"
      width="40%"
    >
      <benefit-dialog
        ref="benefitdialog"
        :discountObj="discountObj"
        @cancel="discountShow=false"
        @benefitEnsure="handleBenefit"
      ></benefit-dialog>
    </el-dialog>
    <DRP-dialog ref="drpDialog" :headerObj="patientObj"></DRP-dialog>
  </div>
</template>
<script>
import list from '@/util/list'
import typeList from '@/rcm/page/hospitalization/typelist'
import { getFeeDetails, getSettleHistory, updateDiscount } from '@/rcm/store/hospital/hospital'
import benefitDialog from './benefitdialog'
// import packageApi from '@/crm/store/packageapi'
import DRPDialog from '@/rcm/page/components/drpdialog'
// import { PREGNANCY_TEST_PACKAGE } from '@/util/common'
let schema = [
  {
    name: 'itemName',
    label: '项目名称',
    labelWidth: '70px'
  },
  {
    name: 'itemClass',
    label: '项目类别',
    comp: 'sys-type',
    props: {
      code: 'THC_RCM_FIN_TYPE',
      useValue: true
    }
  }
]
export default {
  mixins: [list],
  props: ['useType', 'insuranceType'],
  components: {
    typeList,
    benefitDialog,
    DRPDialog
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    return {
      queryObj: queryObj,
      schema: schema,
      statusArr: [],
      dialogVisible: false,
      settleVisible: false,
      obj: {},
      tableData: [],
      recordingData: [],
      recordingLoading: false,
      discountShow: false,
      discountObj: {
        ipNo: this.$route.query.ipNo,
        unPageBills: []
      },
      drpDisable: false, // 是否显示套餐结算按钮
      patientObj: {
        patientName: '',
        sexName: '',
        birthday: ''
      },
      costDetailsLen: 0
    }
  },
  created () {
    let _this = this
    _this.list()
    if (this.$route.query.patientId) { // 请求接口判断是否显示套餐结算按钮
      this.drpDisable = false
      // packageApi.list({ patientId: this.$route.query.patientId, setmealType: PREGNANCY_TEST_PACKAGE }).then(res => {
      //   if (res && res.data && res.data.resultList && res.data.resultList.length) this.drpDisable = true
      // })
    }
    window.onmessage = function (e) {
      if (e.data === 'deleteHalfSettle') {
        _this.settleVisible = false  // 关闭结算弹窗
        _this.handleBenefit() // 刷新列表，刷新顶部组件信息
      }
    }
  },
  watch: {
    insuranceType: { // 从自费切换到医保时，之前做过的自费折扣恢复
      handler: function (val) {
        if (val === 0) {
          this.handleInsurTypeChange()
        }
      }
    }
  },
  methods: {
    handleInsurTypeChange () {
      updateDiscount({ ipNo: this.$route.query.ipNo }).then(_ => {
        this.list()
      })
    },
    handleDeliveryRoom () { // 产房结算dialog
      Object.assign(this.patientObj, { patientName: this.$route.query.patientName, sexName: this.$route.query.sexName, birthday: this.$route.query.birthday })
      this.$refs.drpDialog.open()
    },
    handlePackageInquiry () { // 套餐查询按钮
      window.open(`${this.$ever.crmIndex}/crm/packagesalelist?patientId=${this.$route.query.patientId}&patientName=${this.$route.query.patientName}`, '_self')
    },
    // 结算详情
    settleDetail (row) { // source=half标识从结算详情跳转的,source=daily标识从日结跳转的
      let source = row.settlementType === 1 ? 'final' : 'half'
      const { ipStatus } = this.$route.query
      let route = `${this.$ever.adtIndex}/adt/hospitalSettle/settlementQuery/detail?patientId=${row.patientId}&ipNo=${row.ipNo}&settlementId=${row.id}&source=${source}${ipStatus ? `&ipStatus=${ipStatus}` : ``}`
      window.open(route)
    },
    // 费用清单
    async list (type) {
      try {
        let params = {
          offset: this.offset,
          pagesize: this.pagesize,
          ipNo: this.$route.query.ipNo, // 病案号
          patientId: this.$route.query.patientId, // 患者id
          itemClass: this.queryObj.itemClass, // 财务分类
          itemName: this.queryObj.itemName // 项目名称
        }
        let data = await getFeeDetails(params)
        this.tableData = data.data
        this.totalCount = data.totalCount
        if (!this.costDetailsLen && data.totalCount) {
          this.initCostDetailsLen()
        }

        // 状态结算单号传递给父组件来更新按钮1
        this.obj = Object.assign({}, data.info)
        this.discountObj.unPageBills = data.unPageBills
        let sendData = {
          info: Object.assign(data.info, { billSumFee: (data.billSumFee || 0) }),
          ipSettlementDetail: data.unPageBills,
        }

        this.$emit('getFromChild', sendData)
      } catch (err) { }
    },
    initCostDetailsLen () {
      let refundLen = this.tableData.filter(item => { return item.fee < 0 }).length
      this.$store.commit('setGdcfInsuranceInfo', { costDetailsLen: this.totalCount - 2 * refundLen })
      this.costDetailsLen = this.totalCount
    },
    // 类别汇总
    typeLayerBtn () {
      this.dialogVisible = true
      this.$nextTick(v => {
        // let params = {
        //   ipNo: this.obj.ipNo, settlementId: this.obj.settlementId
        // }
        // 配合召回的结算，更改了传参的方式
        this.$refs.typelist.getDetail(this.obj.ipNo, this.obj.settlementId)
      })
    },
    // 结算记录
    async settleLogBtn () {
      this.settleVisible = true
      this.recordingLoading = true
      try {
        let params = {
          ipNo: this.obj.ipNo
        }
        let data = await getSettleHistory(params)
        if (data && data.data) {
          this.recordingData = data.data
        }
        this.recordingLoading = false
      } catch (err) {
        this.recordingLoading = false
      }
    },
    // 处理优惠比例设置
    handleDiscountShow () {
      this.discountShow = true
      // 清空旧数据
      this.$nextTick(v => {
        this.$refs.benefitdialog.empotyData()
      })
    },
    handleBenefit (val) {
      this.list()
      // 设置成功后刷新上面的费用信息
      this.$emit('refresh')
    },
    convertToPercent (row) {
      return row.discount * 100 + '%'
    }
  }
}
</script>
<style lang="scss" scoped>
.chargedetail {
  background-color: #fff;
}
.chargedetail .chargedetailform {
  display: inline;
}
.chargedetail
  /deep/
  .el-form.chargedetailform.el-form--label-left
  .el-form-item {
  display: inline-block !important;
  margin: 0 0 0 10px;
}
.chargerightbtn {
  text-align: right;
}
.containHeight .el-header .chargedetail .el-form {
  border: none;
}
.chargedetail .search /deep/ .el-form-item {
  margin-bottom: 0;
}
.el-table .cell {
  color: #000;
}
.myArrow {
  color: #999;
}
.tips_active {
  .tips_icon {
    left: 14px;
    line-height: 10px;
    color: #eb9e05;
  }
  .icon {
    color: #ee4433;
  }
  .temfont {
    color: #e43;
  }
}
</style>
