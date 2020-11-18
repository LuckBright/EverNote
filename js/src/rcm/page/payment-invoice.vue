<template>
  <div>
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
    </ever-query-form>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%;"
      @selection-change="handleSelect"
      ref="table"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="supplierCode"
        label="供应商编号"
        width="100"
        >
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商名称"
        width="180"
        align="center"
        >
      </el-table-column>
      <!-- <el-table-column
        prop="supplierAddress"
        label="供应商地点名称"
        >
      </el-table-column> -->
      <el-table-column
        label="发票编号"
        prop="invoiceNo"
        width="150"
        >
      </el-table-column>
      <el-table-column
        label="发票说明"
        prop="invoiceDes"
        width="180"
        >
      </el-table-column>
      <el-table-column
        label="开票日期"
        prop="invoiceDate"
        width="180"
        >
      </el-table-column>
      <el-table-column
        label="预计付款日期"
        prop="planPayDate"
        width="180"
        >
      </el-table-column>
      <el-table-column
        label="发票入账期间"
        prop="accountPeriod"
        width="180"
        >
      </el-table-column>
      <el-table-column
        label="发票付款状态"
        prop="payStatus"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="发票金额"
        prop="invoiceSum"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="已经支付金额"
        prop="payedFee"
        width="150"
        >
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import purinvoiceapi from '../store/purinvoiceapi'
  import list from '../../util/list'
  import supplierApi from '@/warehouse/store/supplierapi'

  let querySchema = [
    {
      name: 'planPayDate',
      label: '预计到期日',
      type: 'date',
      outformat: 'yyyy-MM-dd'
    },
    {
      name: 'supplierID',
      label: '供应商名称',
      type: 'select',
      options: []
    },
    {
      name: 'accountPeriod',
      label: '发票入账时间',
      type: 'date'
    }
  ]
  export default {
    data () {
      return {
        tableData: [],
        querySchema,
        queryObj: this.$ever.createObjFromSchema(querySchema),
        api: purinvoiceapi,
        selected: []
      }
    },
    created () {
      supplierApi.list({})
        .then(result => {
          this.$ever.getFieldFromSchema(this.querySchema, 'supplierID').options = result.list
        })
    },
    methods: {
      handleSelect (sels) {
        this.selected = sels
      },
      afterList () {
        this.tableData = this.tableData.map(v => {
          v.invoiceNo = v.invoiceCode
          v.invoicePeriod = v.accountPeriod
          v.invoiceSum = v.totalFee
          v.invoicePaidSum = v.payedFee
          v.invoiceId = v.id
          v.supplierID = v.supplierId
          this.$set(v, 'pay', '')
          return v
        })
      },
      save () {
        this.$emit('select', this.selected)
      }
    },
    mixins: [list]
  }
</script>
