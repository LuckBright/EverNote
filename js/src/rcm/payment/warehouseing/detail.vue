/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-15 17:13:39
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-12 17:59:04
 *  采付结算管理 -- 入库付款、退库收款详情
 */
<template>
<div>
  <ever-bread-crumb :name="name" :path="path"></ever-bread-crumb>
  <div class="layout_inner flex_col_1_auto" v-loading="loading">
    <h4 class="left_high_light">{{char}}款单信息</h4>
    <ever-form2 class="readform" v-model="obj" :nosubmit="true" :schema="schema" :span="6">
    </ever-form2>

    <h4 class="left_high_light">{{char}}款记录</h4>
    <ever-table is-auto-height table-default-cell-value="-" :columns="columnsPayment" :data="paymentTableData" @eventChange="eventChange">
    </ever-table>
    <!-- 入库付款明细页面  发票信息 -->
    <template v-if="isEntry">
      <h4 class="left_high_light" v-if="isEntry">发票信息</h4>
      <ever-table is-auto-height table-default-cell-value="-" :columns="INVOICE_COLUMNS" :data="invoiceTableData" @eventChange="eventChange">
        <template slot-scope="{ row, $index}" slot="operation">
          <template v-if="row.invoiceStatus == 1">
            <template v-if="row.url">
              <!-- hack 图片预览功能 -->
              <img-see :url="row.url" name="查看发票" :style-props="{width: '60px'}"></img-see>
            </template>
            <el-button type="text" @click="toUpload(row)">修改发票</el-button>
            <el-button type="text" @click="toRevoke(row, $index)">撤销</el-button>
          </template>
          <template v-else>
            -
          </template>
        </template>
      </ever-table>
    </template>

    <h4 class="left_high_light">物资明细</h4>
    <ever-table is-auto-height table-default-cell-value="-" :columns="MATERIAL_COLUMNS" :data="materialTableData">
    </ever-table>
  </div>
  <edit-invoice :visible.sync="dialogVisible" :data-value="currentInvoiceData" @notifyReload="notifyReload" :payment-id="paymentId"></edit-invoice>
</div>
</template>

<script>
import Mixins from './mixins'
import SchemaConfig from './detail.schema'
import {
  PAYMENT_TABLE_COLUMNS,
  INVOICE_COLUMNS,
  MATERIAL_COLUMNS
} from './table.detail.columns'
import EditInvoice from './edit.invoice'
import ImgSee from '../invoice/img.see'
import {
  getReceiptDetail,
  getPaymentDetail,
  discardDetail,
  discardInvoice
} from '../api/index'

export default {
  mixins: [Mixins],
  components: {
    EditInvoice,
    ImgSee
  },
  data() {
    return {
      MATERIAL_COLUMNS,
      INVOICE_COLUMNS,
      dialogVisible: false,
      loading: true,
      obj: null, // 单据信息
      paymentTableData: [], // 付款数据
      invoiceTableData: [], // 发票数据
      materialTableData: [], // 物资数据
      currentInvoiceData: null, // 当前发票信息
    }
  },
  computed: {
    name() {
      return this.$route.meta.name
    },
    path() {
      const {
        meta = {}
      } = this.$route
      return meta.thirdActiveIndex
    },
    columnsPayment() { // 付款信息表格列
      // this.filter在mixins文件中定义
      return this.filter(PAYMENT_TABLE_COLUMNS, this.type)
    },
    columnsMaterial() {},
    schema() {
      const schema = this.filter(SchemaConfig, this.type)
      this.obj = this.$ever.createObjFromSchema(schema)
      return schema
    },
    paymentId() { // 单据id
      return this.$route.params.id
    }
  },
  mounted() {
    this.getDatial()
  },
  methods: {
    notifyReload() {
      this.getDatial()
    },
    getDatial() {
      ~(this.isEntry ? getPaymentDetail : getReceiptDetail)(this.paymentId).then(result => {
        const {
          head,
          data
        } = result
        if (head.errCode === 0) {
          // paymentInfo 收款单信息
          // paymentFlowInfos 支付流水
          // details 物资明细
          // invoiceTableData 发票明细
          const {
            details,
            paymentFlowInfos,
            paymentInfo,
            invoiceInfos
          } = data
          this.materialTableData = details
          this.paymentTableData = paymentFlowInfos
          this.invoiceTableData = invoiceInfos
          this.obj = paymentInfo
        }
      }).finally(() => {
        this.loading = false
      })
    },
    eventChange({
      prop,
      row,
      scope
    }) {
      this[prop] && this[prop](row, scope.$index)
    },
    toVoid(row, index) { // 收付款记录 - 作废操作
      this.$confirm(`${this.char}款金额：${row.paymentAmount}元，确定要作废此记录吗？`, '提示').then(() => {
        discardDetail(row.id).then(result => {
          const {
            head
          } = result
          if (head.errCode === 0) {
            this.everSuccess('作废成功')
            this.paymentTableData.splice(index, 1)
          }
        })
      }).catch()
    },
    toRevoke(row, index) { // 发票记录 --撤销操作
      this.$confirm(`确定要撤销发票信息吗？`, '提示').then(() => {
        discardInvoice(row.id).then(result => {
          const {
            head
          } = result
          if (head.errCode === 0) {
            this.invoiceTableData[index].invoiceStatus = 0
            this.everSuccess('撤销发票成功')
          }
        })
      }).catch()
    },
    toUpload(row) { // 发票记录 -- 上传操作
      this.currentInvoiceData = row
      this.dialogVisible = true
    }
  }
}
</script>
