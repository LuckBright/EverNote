/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-15 14:34:42
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-13 11:31:20
 * 采付结算管理 -- 入库付款 + 退库收款
 */

<template>
<div class="layout_inner flex_col_1_auto">
  <!-- 搜索域 -->
  <ever-form2 onsubmit="return false;" v-model="queryObj" ref="form" :schema="querySchema" :inline="true" :isQuery="true" @submit.native.prevent @query="list(true)">
    <template slot="default">
      <el-form-item>
        <el-button type="primary" @click="list(true)">查询</el-button>
        <el-button @click="resetFields">重置</el-button>
      </el-form-item>
    </template>
  </ever-form2>

  <!-- 操作域 -->
  <el-row :gutter="20" class="mt10">
    <el-col :span="18" class="f14">
      <el-row :gutter="20" style="line-height: 33px">
        <el-col :span="8">
          <!-- 合计按钮， 产品担心查询数据时数据量过大导致查询缓慢 -->
          <!-- <el-button type="primary" size="small" class="mr20">合计</el-button> -->
          <span class="cGray6">
            {{char}}款单总额
          </span>
          <strong><span class="f16">{{totalBillAmount | formatToFinacial}}</span></strong>
        </el-col>
        <el-col :span="6">
          <span class="cGray6">已{{char}}总额</span>
          <strong><span class="f16">{{totalPaidAmount | formatToFinacial}}</span></strong>
        </el-col>
        <el-col :span="6">
          <span class="cGray6">未{{char}}总额</span>
          <strong><span class="f16">{{totalUnpaidAmount | formatToFinacial}}</span></strong>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="6" class="alg_r">
      <doc-download @downFile="downFile" :exportType="3" size="small" ref="childMethods" btnTxt="导出"></doc-download>
      <!-- <el-button type="primary" size="small" @click="handleExport">导出</el-button> -->
      <el-button :disabled="!selected.length" type="primary" size="small" @click="handleOpenDialog('dialogVisible')">{{isEntry ? '付': '收'}}款</el-button>
      <el-button :disabled="!selected.length" v-if="isEntry" type="primary" size="small" @click="handleOpenDialog('invoiceVisible')">上传发票</el-button>
    </el-col>
  </el-row>

  <!-- 表格域 -->
  <!-- table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
      class="flex_scroll flex_hidden" -->
  <ever-table ref="tableList" @row-click="elRowClick" not-select-checkbox show-checkbox table-default-cell-value="-" :table-loading="loading" :columns="columns" :data="tableData" :selectable="selectable" @select-all="selectAll" @selection-change="selectionChange" @eventChange="eventChange">
  </ever-table>
  <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current" :pagesize="pagesize" :page-sizes="pageSizes">
  </ever-pagination>
  <!-- 收款、付款弹框 -->
  <payment :key="char" @notifyReload="notifyReload" :is-entry="isEntry" :visible.sync="dialogVisible" :select-data="selected" :title="`${char}款信息`"></payment>

  <!-- 上传发票 -->
  <invoice :visible.sync="invoiceVisible" @notifyReload="notifyReload" :key="currentOnlyValue" :select-data="selected"></invoice>
</div>
</template>

<script>
import Mixins from './mixins'
import Columns from './table.columns.js'
import Schema from './schema'
import Payment from './payment'
import Invoice from './invoice'

import {
  getPayment,
  getReceipt,
  getEnablePaymentMethod,
  exportPayment,
  exportRcmReceivable
} from '../api/index'

import {
  store,
  mutations
} from './observable'

/**
 * 判断全选数据是否只包含同一个供应商
 *
 * @param {Array} selection     选中的数据
 * @return Boolean
 */
function isOnlySupplier(selection) {
  const cache = []
  for (let i = 0; i < selection.length; i++) {
    const {
      supplerid
    } = selection[i]
    if (cache.includes(supplerid)) {
      continue
    } else if (cache.length < 1) {
      cache.push(supplerid)
    } else {
      return false
    }
  }
  return true
}
export default {
  mixins: [Mixins],
  components: {
    Payment,
    Invoice
  },
  data() {
    return {
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      pageSizes: [10, 20, 30, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: Number(this.$route.query.page) || 1,
      querySchema: [],
      currentOnlyValue: null,
      queryObj: null,
      tableData: [],
      loading: false,
      columns: [], // 收、付款表格列配置项
      selected: [], // 收、付款checkbox选中数据项
      dialogVisible: false, // 收、付款弹框
      invoiceVisible: false, // 发票弹框
      totalBillAmount: 0,
      totalPaidAmount: 0,
      totalUnpaidAmount: 0,
    }
  },
  computed: {
    paymentMethods() {
      return store.paymentMethods // 所有启用的支付方式
    }
  },
  mounted() {
    if (!this.paymentMethods.length) {
      getEnablePaymentMethod().then(result => {
        const {
          data
        } = result
        if (Array.isArray(data)) {
          mutations.setPaymentMethods(data.map(item => ({
            id: item.id,
            name: item.payMethod
          })))
        }
      })
    }
  },
  methods: {
    // 实现整行点击自动选中checkbox
    elRowClick({ row }) {
      const currentSupplerId = this.selected[0] && this.selected[0].supplerid
      if (row.supplerid === currentSupplerId || !currentSupplerId) {
        this.$refs.tableList.$refs.everTable.toggleRowSelection(row)
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange(val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list()
      return this.pageAfter && this.pageAfter(this.pagesize)
    },
    downFile() {
      ~(this.isEntry ? exportPayment : exportRcmReceivable)(this.queryObj).then(result => {
        const {
          data
        } = result
        if (data) {
          // 想尽一切办法拿到下载的url
          // let fileurl = this.$ever.fileUrl2 + data.fileId
          // this.$refs.childMethods.downfile(fileurl)
          window.open(this.$ever.fileUrl2 + data.fileId)
        } else {
          this.everWarning('系统异常，导出失败')
        }
      })
    },
    list(refresh) {
      this.loading = true
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      this.queryObj.offset = this.offset
      this.queryObj.pagesize = this.pagesize
      const [createStartDate, createEndDate] = this.queryObj.createDate
      const [payStartDate, payEndDate] = this.queryObj.payDate
      ~(this.isEntry ? getPayment : getReceipt)(Object.assign(this.queryObj, {
        createStartDate,
        createEndDate,
        payStartDate,
        payEndDate
      })).then(result => {
        const {
          data,
          head,
          totalCount
        } = result
        if (head.errCode === 0 && data) {
          const {
            totalBillAmount,
            totalPaidAmount,
            totalUnpaidAmount
          } = data
          this.tableData = (data.rcmPaymentResps || [])
          this.totalBillAmount = totalBillAmount
          this.totalPaidAmount = totalPaidAmount
          this.totalUnpaidAmount = totalUnpaidAmount
          this.totalCount = totalCount
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleOpenDialog(prop) { // 付款 | 收款 | 上传发票 弹框
      if (this.selected.length) {
        this.currentOnlyValue = prop
        this[prop] = true
      }
    },
    eventChange({
      prop,
      row
    }) {
      this[prop] && this[prop](row)
    },
    edit(row) {
      // 为了高亮菜单栏，使用了两个路由展示详情页面（同一个组件）
      this.$router.push(`/financial/payment${this.type[0].toUpperCase() + this.type.substr(1)}Detail/${row.id}`)
    },
    selectable(row, index) { // 是否可选
      // 当user手动选中某个供应商后，其他供应商不允许选择
      //  todo：收付款状态和发票状态是否需要判断（|| row.payStatus === 1） payStatus 收付款状态为 1  已付款或已收款 不可再继续操作
      if ((this.selected.length && row.supplerid !== this.selected[0].supplerid)) {
        return false
      }
      return true
    },
    selectAll(selection) { // 点击全选按钮
      // 当前全选数据中， 存在多个供应商时，清空全选操作
      if (!isOnlySupplier(selection)) {
        this.everWarning('多个供应商不能同时付款')
        this.$refs.tableList.$refs.everTable.clearSelection()
      } else {
        this.selected = selection
      }
    },
    selectionChange(selection) { // 具体选中
      // 当前选中项 selected
      this.selected = selection
    },
    resetFields() {
      this.$refs.form.$refs.form.resetFields()
    },
    notifyReload() {
      this.list()
    }
  },
  watch: {
    type: {
      handler() {
        // 初始化状态值
        this.selected = []
        this.tableData = []
        this.loading = false
        this.dialogVisible = false
        // this.filter在mixins文件中定义（./mixins）
        this.querySchema = this.filter(Schema, this.type)
        this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
        this.columns = this.filter(Columns, this.type)
        // 获取当前页面数据
        this.list()
      },
      immediate: true
    }
  }
}
</script>
