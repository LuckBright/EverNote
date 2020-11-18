<template>
  <div class="chargedetail">
    <div class="besideBtns">
      <el-row class="search">
        <el-col :span="16">
          <ever-form2
            ref="form"
            :schema="schema"
            v-model="queryObj"
            :inline="true"
            :is-query="true"
            @query="list(true)"
            class="chargedetailform"
          ></ever-form2>
        </el-col>
        <el-col :span="8">
          <div class="chargerightbtn" v-if="!$route.query.source">
            <span style="float: right;margin-left:20px" v-if="useType=='settle'">
              <el-button type="text" @click="settleLogBtn">结算记录</el-button>
              <i class="el-icon-arrow-right myArrow"></i>
            </span>
            <!-- <span style="float: right;margin-left:20px" v-if="useType=='recall'">
              <el-button type="text" @click="backBtn">召回记录</el-button>
              <i class="el-icon-arrow-right myArrow"></i>
            </span>-->
            <span style="float: right;">
              <el-button type="text" @click="typeLayerBtn">类别汇总表</el-button>
              <i class="el-icon-arrow-right myArrow"></i>
            </span>
            <div class="clearfix"></div>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="itemName" label="项目名称"></el-table-column>
        <el-table-column prop="itemClassName" label="类别"></el-table-column>
        <el-table-column prop="spec" label="规格"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="quantity" label="数量" align="right"></el-table-column>
        <el-table-column prop="unitPrice" label="单价" align="right">
          <template slot-scope="scope">{{scope.row.unitPrice | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="fee" label="金额" align="right">
          <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="chargeLevelName" label="收费等级"></el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
      <!-- 优惠信息 -->
      <fee-list :obj="obj"></fee-list>
    </div>
    <div class="settle_btngroup">
      <span class="settle_totalFee">
        费用总计：
        <span>￥ {{obj.totalFee | formatToFinacial}}</span>
      </span>
      <!-- 中途结算不显示该字段 -->
      <span class="settle_needpay" v-if="$route.query.source!='half'">
        {{obj.refundFlag ? '退款金额：' : '实际应收金额：'}}
        <span
          class="cRed"
        >￥ {{obj.receivableFee | formatToFinacial}}</span>
      </span>
      <el-button
        type="primary"
        v-if="printStatus.requestType === 0 && printStatus.requestType !== 4"
        @click="createPrint(1)"
      >打印收据</el-button>
      <el-button
        type="primary"
        v-if="printStatus.allowPrintAgain && printStatus.requestType !== 0 && printStatus.requestType !== 4"
        @click="createPrint(2)"
      >收据重打</el-button>
      <el-button
        type="primary"
        v-if="printStatus.allowPrintNew && printStatus.requestType !== 0"
        @click="createPrint(3)"
      >收据补打</el-button>
      <el-button type="primary" @click="print(obj.ipNo, obj.id)">打印费用清单</el-button>
      <el-button
        type="primary"
        v-if="$route.query.source=='half'&&$route.query.ipStatus<8"
        @click="deleteHalfSettle"
      >删除中途结算</el-button>
      <el-button type="primary" v-if="$route.query.source=='final'" @click="deleteFinal">删除结算</el-button>
    </div>
    <!-- 类别汇总 -->
    <el-dialog title="类别汇总" :visible.sync="dialogVisible" width="50%">
      <type-list ref="typelist" :obj="obj"></type-list>
    </el-dialog>
    <!-- 结算记录 -->
    <el-dialog title="结算记录" :visible.sync="settleVisible" width="30%">
      <el-table :data="recordingData" style="width: 100%" v-loading="recordingLoading">
        <el-table-column prop="createTime" label="结算时间"></el-table-column>
        <el-table-column prop="totalFee" label="费用总金额"></el-table-column>
        <el-table-column label="详情" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="settleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 召回记录 -->
    <el-dialog title="召回记录" :visible.sync="recallVisible" width="60%">
      <el-table :data="recall" style="width: 100%" v-loading="recordingLoading">
        <el-table-column prop="ipTime" label="入院时间"></el-table-column>
        <el-table-column prop="ipEndTime" label="出院时间"></el-table-column>
        <el-table-column prop="diagnose" label="入院诊断"></el-table-column>
        <el-table-column prop="ipDeptName" label="入院科室"></el-table-column>
        <el-table-column prop="totalFee" label="总费用"></el-table-column>
        <el-table-column prop="totalDeposit" label="押金"></el-table-column>
        <el-table-column prop="medFee" label="医保"></el-table-column>
        <el-table-column prop="comInsuranceFee" label="商保"></el-table-column>
        <el-table-column prop="totalBenefitFee" label="优惠"></el-table-column>
        <el-table-column prop="refundFee" label="退款金额"></el-table-column>
        <el-table-column prop="receivedFee" label="实收金额"></el-table-column>
        <el-table-column prop="recalledDate" label="召回时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="settleDetail(scope.row)">结算详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import list from '@/util/list'
import typeList from '@/rcm/page/hospitalization/typelist'
import { getRecalledInfo, getHalfSettleInfo, getSettleHistory, getRecallHistory, checkCallback, recall, deleteHalfSettle, getPrintStatus, deleteSettle } from '@/rcm/store/hospital/hospital'
import feeList from '@/rcm/page/hospitalization/feelist'
import { everprint } from '@/util/common'
import commonReceiptPrint from '@/rcm/page/outpatientSettlement/common.receipt.printing'

let schema = [
  {
    name: 'itemName',
    label: '项目名称',
    labelWidth: '70px'
  },
  {
    name: 'itemClass',
    label: '业务分类',
    comp: 'sys-type',
    props: {
      code: 'THC_RCM_FIN_TYPE',
      useValue: true,
      placeholder: '业务分类'
    },
    noWrap: true
  }
]
export default {
  mixins: [list, commonReceiptPrint],
  props: ['useType', 'paramsObj'],
  components: {
    typeList,
    feeList
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
      recallVisible: false,
      obj: {
        ipNo: this.$route.query.ipNo,
        id: this.$route.query.settlementId,
        patientId: this.$route.query.patientId
      },
      tableData: [],
      recordingData: [],
      recall: [],
      recordingLoading: false,
      canCallback: false,
      isArchive: false,
      sourceMap: {
        'half': getHalfSettleInfo,
        'final': getHalfSettleInfo,
        'daily': getRecalledInfo,
        'default': getRecalledInfo
      },
      printStatus: {}
    }
  },
  created () {
    // 如果是结算单详情过来的，就不要查是否可以召回了
    // 20191122召回流程有问题，先隐藏
    // if (!this.$route.query.source) {
    //   let reallParams = {
    //     id: this.$route.query.id,
    //   }
    //   this.checkCanCallback(reallParams)
    // }
    this.list()
    this.getPrintStatus()
  },
  methods: {
    deleteHalfSettle () {
      deleteHalfSettle({ id: this.obj.id, macId: this.macId }).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除中途结算成功！')
          if (window.opener) {
            // 通知原页面更新，将中途结算的费用项还回去
            window.opener.postMessage('deleteHalfSettle', window.opener.location)
            window.open('', '_self', '')
            window.close()
          }
          if (this.$route.path.indexOf('settlementQuery') > -1) {
            // 如果当前页面是settlementQuery/detail，删除结算后跳转到结算单查询列表页去
            this.$router.push({
              path: '/adt/hospitalSettle/settlementQuery'
            })
          }
        }
      })
    },
    // 方便医保弄的删除结算
    deleteFinal () {
      deleteSettle({ id: this.obj.id, macId: this.macId }).then(res => {
        this.$messageTips(this, 'success', '操作成功！')
        if (window.opener) {
          // 删除结算完，原页面跟中途结算一样也刷新
          window.opener.postMessage('deleteHalfSettle', window.opener.location)
          window.open('', '_self', '')
          window.close()
        }
        if (this.$route.path.indexOf('settlementQuery') > -1) {
          // 如果当前页面是settlementQuery/detail，删除结算后跳转到结算单查询列表页去
          this.$router.push({
            path: '/adt/hospitalSettle/settlementQuery'
          })
        }
      }, err => {
        console.log('err', err)
      })
    },
    async settlePrint (settlementId) {
      everprint('rcm_hospital_billinner', { id: settlementId }, { preview: true })
    },
    createPrint (btnType = 1) {
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.getPrintStatus, // 发票打印成功之后刷新回调
        billPrintCall: this.settlePrint.bind(this, this.obj.id), // 没有关联模版走老票据打印的回调
        code: 'rcm_hospital_bill', // 模版code
        everPrintParams: null,
        settlementId: this.obj.id, // settlementid
        printType: 3, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info) // 调的mixin里面的公共票据打印接口
    },
    async print (ipNo, settlementId) {
      let params = { ipNo: ipNo, loginid: localStorage.USERID }
      everprint('hospitalFeeList', params, { preview: true })
    },
    getPrintStatus () {
      getPrintStatus({ settlementId: this.$route.query.settlementId, }).then(res => {
        this.printStatus = res.data
      })
    },
    // 结算详情
    settleDetail (row) { // source=half标识从结算详情跳转的,source=daily标识从日结跳转的
      let source = row.settlementType === 1 ? 'final' : 'half'
      const { ipStatus } = this.$route.query
      let route = `${this.$ever.adtIndex}/adt/hospitalSettle/settlementQuery/detail?patientId=${row.patientId}&ipNo=${row.ipNo}&settlementId=${row.id}&source=${source}${ipStatus ? `&ipStatus=${ipStatus}` : ``}`
      window.open(route)
      // console.log(route)
    },
    // 召回记录
    async backBtn () {
      this.recallVisible = true
      this.recordingLoading = true
      try {
        let params = {
          ipNo: this.obj.ipNo
        }
        let data = await getRecallHistory(params)
        if (data && data.data) {
          this.recall = data.data
        }
        this.recordingLoading = false
      } catch (err) {
        this.recordingLoading = false
      }
    },
    // 调接口是否可以召回
    checkCanCallback (params) {
      checkCallback(params).then(res => {
        this.canCallback = res.data && res.data.isLastInpatient // 是否最后一次住院
        this.isArchive = res.data && res.data.isFile // 是否归档
      })
    },
    async callBackBtn () {
      if (this.isArchive) {
        this.$messageTips(this, 'warning', '患者病例已经归档，请先召回病案信息！')
        return false
      }
      try {
        let data = await recall({ id: this.obj.id })
        if (data && data.head.errCode === 0) {
          this.list()
          this.$messageTips(this, 'success', '召回成功！')
          this.canCallback = false
          // 刷新页面
          this.$emit('refresh')
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 费用清单
    async list (type) {
      try {
        let params = {
          offset: this.offset,
          pagesize: this.pagesize,
          id: this.$route.query.settlementId,
          ipNo: this.$route.query.ipNo,
          itemClass: this.queryObj.itemClass, // 财务分类
          itemName: this.queryObj.itemName // 项目名称
        }
        let apiName = this.sourceMap[this.$route.query.source || 'default']
        let data = await apiName(params)
        if (data && data.data) {
          // console.log(data)
          this.tableData = data.data.details
          if (data.data.settlement.hasOwnProperty('ipStatus')) { delete data.data.settlement.ipStatus }
          if (data.data.hasOwnProperty('ipSettleStatus')) delete data.data.ipSettleStatus
          // 状态结算单号传递给父组件来更新按钮
          this.obj = Object.assign({}, this.obj, data.data.settlement)
          this.$emit('getFromChild', data.data.settlement)
        }
        this.totalCount = data.data.totalCount
      } catch (err) {
        console.log('err', err)
      }
    },
    // 类别汇总
    typeLayerBtn () {
      this.dialogVisible = true
      this.$nextTick(v => {
        this.$refs.typelist.getDetail(this.obj.ipNo, this.obj.id)
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
    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>
<style scoped>
.chargedetail {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: auto;
  background-color: #fff;
}
.chargedetail .chargedetailform {
  display: inline;
}
.chargedetail .besideBtns {
  overflow-y: auto;
  margin-bottom: 60px;
}
.chargedetail /deep/ .el-form-item {
  display: inline-block !important;
  margin: 0 0 0 10px;
}
.chargedetail .chargedetailform /deep/.el-button.el-button--default {
  color: #fff;
  background-color: #1c7bef;
  border-color: #1c7bef;
}
.chargerightbtn {
  text-align: right;
}
.containHeight .el-header .chargedetail .el-form {
  border: none;
}
.chargedetail
  .search
  /deep/
  .el-form
  .el-row
  .el-col.el-col-6
  .el-form-item__content {
  margin-left: 120px !important;
}
.chargedetail .search /deep/ .el-form .el-form-item__content {
  margin-left: 0 !important;
}
.settle_btngroup {
  position: absolute;
  width: calc(100vw - 60px);
  margin-left: -15px;
  padding: 10px;
  bottom: 15px;
  background: #fff;
  z-index: 20;
  border-top: 1px solid #eaeaea;
  text-align: right;
}
.settle_totalFee,
.settle_needpay {
  font-size: 14px;
  color: #000;
  font-weight: 400;
  line-height: 43px;
  height: 38px;
  vertical-align: bottom;
}
.settle_totalFee span {
  font-size: 18px;
  color: #ee4433;
  font-weight: 500;
  text-align: right;
  margin-right: 10px;
}
.settle_needpay span {
  font-size: 24px;
  font-weight: 500;
  line-height: 38px;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
}
.myArrow {
  color: #999;
}
.clearfix {
  clear: both;
}
.settle_title {
  margin-top: 10px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  font-size: 14px;
  font-weight: bold;
}
</style>
