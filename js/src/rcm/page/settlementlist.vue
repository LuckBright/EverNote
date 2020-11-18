<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-12-04 11:05:30
 -->
<template>
  <div class="settle">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2 :schema="querySchema" :span="6" v-model="queryObj" @query="query">
          <template slot="createBy">
            <everStaffSelect
              v-model="queryObj.createBy"
              :clearable="true"
              :type="'select'"
              :fields="'id'"
            ></everStaffSelect>
          </template>
          <template slot="exportbtn">
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" size="small" @click="exportFile">导出</el-button>
          </template>
          <div></div>
        </ever-form2>
        <div class="main-option">
          <div class="totaloutpatient">
            <span>
              总金额
              <b>￥{{totalFee | formatToFinacial}}</b>
            </span>
          </div>
        </div>
      </div>
      <ever-table
        :columns="columns"
        :data="tableData"
        border
        :loading="loading"
        :is-drag-table="true"
        table-default-cell-value=""
        :special-cell-config="specialCellConfig"
        :config-option="configOption"
        :is-record-url-params="false"
      >
        <template slot="operateColumn" slot-scope="scope">
          <el-button type="primary" v-if="checkPrint(scope.row)" @click="createPrint(scope.row, 1)">打印收据</el-button>
          <el-button type="primary" v-if="checkRefundPrint(scope.row)" @click="refundPrint(scope.row)">打印收据</el-button>
          <el-button type="primary" @click="settleDetailPrint(scope.row)">打印费用明细</el-button>
          <el-button type="primary" v-if="checkPrintAgain(scope.row)" @click="createPrint(scope.row, 2)">收据重打</el-button>
          <el-button type="primary" v-if="checkPrintPatch(scope.row)" @click="createPrint(scope.row, 3)">收据补打</el-button>
          <el-button type="primary" v-if="showMedicalPrint(scope.row)" @click="medicalPrintAgain(scope.row)">医保收据重打</el-button>
        </template>
        <template slot="settlecode" slot-scope="scope">
          <a
            href="javascript:void(0)"
            @click="settlementDetail(scope.row)"
          >{{scope.row.settlecode}}</a>
        </template>
      </ever-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
      <div v-show="false">
        <settlementtemprint :printinfo="printinfo" id="page1" :key="printinfo.id"></settlementtemprint>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/settlementapi'
import channelApi from '@/rcm/store/income/reportForms'
import list from '../../util/list'
// import billselect from './settle-billselect'
import insuranceorgapi from '@/insurance/store/insuranceorgapi'
import { everprint } from '@/util/common'
import settlementtemprint from '@/rcm/page/settlement-tem-print'
import invoice from '@/rcm/page/invoicemanage/invoice'
import commonReceiptPrinting from '@/rcm/page/outpatientSettlement/common.receipt.printing'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { RCM_SETTLEMENTS } from '@/util/table-config'

let schema = [
  {
    label: '患者姓名',
    name: 'patientId',
    comp: 'ever-patient-select'
  },
  {
    name: 'outpatientNumber',
    label: '门诊档案号'
  },
  {
    name: 'settlecode',
    label: '结算单号'
  },
  {
    label: '收费员',
    name: 'createBy',
    comp: 'custom'
  },
  {
    name: 'chargeStatus',
    label: '付费状态',
    comp: 'ever-select',
    props: {
      options: [
        { name: '待付费', id: '0' },
        { name: '已付费', id: '1' }
      ]
    }
  },
  {
    name: 'refundStatus',
    label: '退费状态',
    comp: 'ever-select',
    props: {
      options: [
        { name: '待退费', id: '0' },
        { name: '已退费', id: '1' }
      ]
    }
  },
  {
    label: '结算方式',
    name: 'settleMethod',
    comp: 'ever-select',
    props: {
      options: [
        { id: '0', name: '自费' },
        { id: '1', name: '医保' },
        { id: '2', name: '商保' }
      ]
    }
  },
  {
    label: '收费类型',
    name: 'feeType',
    comp: 'ever-select',
    props: {
      options: [
        { id: '0', name: '门诊' },
        { id: '1', name: '挂号' }
      ]
    }
  },
  {
    label: '结算单类型',
    name: 'returnFlag',
    comp: 'ever-select',
    props: {
      options: [
        { id: '0', name: '收费' },
        { id: '1', name: '退费' }
      ]
    }
  },
  {
    name: 'insurorgid',
    label: '保险公司',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'settleDate',
    label: '创建时间',
    comp: 'date-picker',
    props: {
      type: 'daterange',
      outformat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'channelId',
    label: '渠道来源',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'channel',
    label: '途径',
    comp: 'ever-select',
    props: {
      options: [
        { name: '门诊', id: '0' },
        { name: '互联网', id: '1' }
      ]
    }
  },
  {
    label: '',
    labelWidth: '15px',
    name: 'exportbtn',
    comp: 'custom'
  }
]
export default {
  mixins: [list, invoice, commonReceiptPrinting],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.settleDate = ''
    obj.treatDate = []
    return {
      api,
      querySchema: schema,
      queryObj: obj,
      dialogVisible: false,
      iframeSrcArr: [],
      totalFee: 0,
      printinfo: {
        patientName: '',
        outpatientNumber: '',
        clinicName: '',
        createUserCode: '',
        createTime: '',
        totalFee: '',
        comInsuranceDirectFee: '',
        payDetails: {},
        membergradecutfee: 0,
        benefitFee: 0,
        memberactcutfee: 0,
        promotionFee: 0,
        comInsurancePlanFee: 0,
        comInsuranceBenefitFee: 0,
        medInsurPubPayFee: 0,
        medInsurOwnPayFee: 0,
        mergedSettleDetail: [],
      },
      staffList: [],
      printInfo: { code: '' },
      noStoreQuery: true,
      id: '',
      isHcjk: false,
      hljybCode,
      columns: [],
      configOption: {
        id: RCM_SETTLEMENTS
      },
      specialCellConfig: {
        prop: 'visitType',
        value: 1,
        className: 'danger',
      }
    }
  },
  components: {
    // billselect,
    settlementtemprint
  },
  methods: {
    list () {
      this.loading = true
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.page = this.current // 兼容需要page作为分页参数的接口123
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.api.list(params).then(rs => {
        this.loading = false
        if (rs) {
          this.tableData = rs.data
          this.totalCount = rs.totalCount
          this.totalFee = rs.totalFee
        } else {
          this.totalCount = 0
        }
      })
    },
    checkRefundPrint (row) {
      return row.returnFlag && row.refundStatus && this.$hasPermission('MZ_RCM_TUI_FEI_JIE_SUAN_DAN1')
    },
    checkPrint (row) {
      return (row.settleStatus === 4 || row.settleStatus === 6) && row.requestType === 0 && row.requestType !== 4 && row.returnFlag === false
    },
    // 是否可以显示收据重打按钮
    checkPrintAgain (row) {
      return !this.isHcjk && (row.settleStatus === 4 || row.settleStatus === 6) && row.allowPrintAgain && row.requestType !== 0 && row.requestType !== 4 && row.returnFlag === false
    },
    // 是否可以显示收据补打按钮
    checkPrintPatch (row) {
      return !this.isHcjk && (row.settleStatus === 4 || row.settleStatus === 6) && row.allowPrintNew && row.requestType !== 0 && row.returnFlag === false
    },
    settlementDetail (row) {
      location.href = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${row.patientid}&visitNumber=${row.rootorderid}&showDetail=0&settlementid=${row.id}&dptId=${row.orderDept}&showlist=true`
    },
    billPrintCall (row) {
      everprint('rcm-outpatient-bill', { id: this.id, patientId: this.$route.query.patientId }, { preview: true })
    },
    query () {
      this.handleCurrentChange(1)
    },
    // 支付后打印目前存在问题
    createPrint (row, btnType) {
      if (this.isHcjk) { // 海床打印
        everprint('thc_rcm_FEIYONGQINGDAN_LNN_20181114', {id: this.obj.id}, {preview: true})
      }
      this.id = row.id
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.query, // 打印成功的回调
        billPrintCall: this.billPrintCall.bind(this, row), // 没有关联模版走老票据打印的回调
        code: 'rcm_dishui', // 模版code
        everPrintParams: null,
        settlementId: row.id, // settlementid
        printType: 2, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info)
    },
    // 退费单据打印
    // 退费单据打印
    refundPrint (row) {
      everprint('MZ_RCM_TUI_FEI_JIE_SUAN_DAN', { id: row.id }, { preview: true })
    },
    // 门诊费用明细查询
    settleDetailPrint(row) {
      everprint('outpatientFeeList', {id: row.id, patientId: row.patientid}, {preview: true})
    },
    async hcjkPrint (id) {
      let json = await api.getCountOfHaiChuangInvoiceItem({
        settlementId: id
      })
      let arr = []
      let offsize = Math.ceil(Number(json.data) / 10)
      for (let i = 0; i < offsize; i++) {
        arr.push(i * 10)
      }
      this.printInfo.id = id
      this.iframeSrcArr = arr
    },
    exportFile () {
      var params = Object.assign({}, this.queryObj)
      if (params.settleDate && params.settleDate[0]) {
        params.settleStartDate = params.settleDate[0]
        params.settleEndDate = params.settleDate[1]
      }
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      if (params.channel) {
        params.channel = Number(params.channel)
      }
      this.api.exportFile(params).then(res => {
        if (!res.data) {
          this.$messageTips(this, 'error', '未找到导出文件路径！')
        } else {
          window.open(this.$ever.fileUrl2 + res.data.fileId)
        }
      },
        err => {
          console.log('err', err)
        })
    },
    medicalPrintAgain (row) {
      let params = {
        settlementId: row.id,
        insuranceOrgId: row.insurOrgId,
        macId: this.macId
      }
      this.api.hljMedicalPrintAgain(params).then(res => {
        this.$messageTips(this, 'success', '收据补打成功')
      }, err => {
        console.log('err', err)
      })
    },
    // 是否展示黑龙江医保重打按钮
    showMedicalPrint (row) {
      return row.insurOrgId === this.hljybCode && row.settlementType !== 2 && row.payStatus === 2 && this.$hasPermission('hlj_medical_print_again')
    },
    getOptions () {
      channelApi.searchSourch().then(rs => {
        if (rs.head.errCode === 0 && rs.data) {
          this.$ever.getFieldFromSchema(this.querySchema, 'channelId').props.options = rs.data.resultList || []
        }
      })
      insuranceorgapi.list({}).then(result => {
        for (var insur of result.data) {
          insur.name = insur.insuranceOrgCnName
        }
        this.$ever.getFieldFromSchema(this.querySchema, 'insurorgid').props.options = result.data || []
      })
    },
    initColumns () {
      this.columns = [
        {
          prop: 'settlecode',
          label: '结算单号',
          width: 160,
          undraggable: true,
          slot: 'settlecode',
          required: true
        },
        {
          prop: 'totalFee',
          label: '费用总额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130,
          required: true
        },
        {
          prop: 'totalFee',
          label: '结算总额',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130,
          required: true
        },
        {
          prop: 'chargeStatus',
          label: '付费状态',
          formatter: ({ value }) => {
            return this.$options.filters.chargeStatus(value)
          },
          required: true
        },
        {
          prop: 'refundStatus',
          label: '退费状态',
          formatter: ({ value }) => {
            return this.$options.filters.refundStatus(value)
          },
          required: true
        },
        {
          prop: 'settleMethod',
          label: '结算方式',
          required: true
        },
        {
          prop: 'returnFlag',
          label: '结算单类型',
          formatter: ({ value }) => {
            return value ? '退费' : '收费'
          },
          width: 100
        },
        {
          prop: 'billCode',
          label: '发票号',
          width: 100
        },
        {
          prop: 'outpatientNumber',
          label: '门诊档案号',
          formatter: ({ row }) => {
            return row.outpatientNumber ? row.outpatientNumber : row.patientid
          },
          width: 230
        },
        {
          prop: 'patientName',
          label: '患者姓名',
          width: 160
        },
        {
          prop: 'insuranceOrgCnName',
          label: '保险机构',
          width: 100
        },
        {
          prop: 'channel',
          label: '途径',
          formatter: ({ value }) => {
            return this.$options.filters.channelStatus(value)
          },
          width: 110
        },
        {
          prop: 'channelName',
          label: '渠道名称',
          width: 110
        },
        {
          prop: 'medInsurFee',
          label: '医保支付',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'comInsuranceDirectFee',
          label: '商保支付',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'totalDiscount',
          label: '优惠金额',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'medSetFee',
          label: '预收核销',
          align: 'right',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'totalPayedFee',
          label: '自付金额',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          },
          width: 130
        },
        {
          prop: 'totalDiff',
          label: '尾差金额',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value, 6)
          },
          width: 130
        },
        {
          prop: 'wipeOff',
          label: '抹零金额',
          formatter: ({ value }) => {
            return this.$filters.formatToFinacial(value)
          }
        },
        {
          prop: 'createUser',
          label: '收费员',
          width: 130
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 160,
          required: true
        },
        {
          prop: 'operateColumn',
          label: '操作',
          width: 200,
          undraggable: true,
          slot: 'operateColumn',
          fixed: 'right',
          required: true
        }
      ]
    }
  },
  filters: {
    chargeStatus (val) {
      return val !== undefined ? (val === 1 ? '已付费' : '待付费') : ''
    },
    refundStatus (val) {
      return val !== undefined ? (val === 1 ? '已退费' : '待退费') : ''
    },
    channelStatus (val) {
      return val ? '互联网' : '门诊'
    }
  },
  mounted () {
    this.isHcjk = this.$ever.getClinicConfig().clinicType === 'hcjk'
  },
  created () {
    this.getOptions()
    this.initColumns()
  }
}
</script>
<style scoped>
  .main-option {
    text-align: left;
  }
</style>

