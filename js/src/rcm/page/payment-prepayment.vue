<template>
  <div>
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
    </ever-query-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="table"
      >
      <el-table-column
        label="ID"
        >
        <template slot-scope="scope">
          <el-radio v-model="selected" :label="scope.row.id">
            {{scope.row.id}}
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierCode"
        label="供应商编号"
        width="120"
        >
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商名称"
        width="180"
        >
      </el-table-column>
      <el-table-column
        label="编号"
        prop="code"
        width="180"
        >
      </el-table-column>
      <el-table-column
        label="说明"
        width="180"
        prop="illustration"
        >
      </el-table-column>
      <el-table-column
        label="开票日期"
        prop="docDate"
        width="150"
        >
      </el-table-column>
      <el-table-column
        label="金额"
        prop="paySum"
        width="100"
        align="right">
        <template slot-scope="scope">
          <span>{{scope.row.paySum | formatToFinacial}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '../store/prepaymentapi'
  import list from '../../util/list'
  import supplierApi from '../store/payableinvoiceapi'
  let querySchema = [
    {
      name: 'supplierID',
      label: '供应商名称',
      type: 'select',
      options: []
    }
  ]
  export default {
    data () {
      return {
        tableData: [],
        querySchema,
        queryObj: this.$ever.createObjFromSchema(querySchema),
        api: api,
        selected: ''
      }
    },
    created () {
      supplierApi.getSupplierLocalByClinic()
        .then(result => {
          this.$ever.getFieldFromSchema(this.querySchema, 'supplierID').options = result.clinicArr
        })
    },
    methods: {
      list () {
        let params = Object.assign({}, this.queryObj)
        for (let key in params) {
          if (params[key] === '') {
            delete params[key]
          }
        }
        api.getPreListForPay(params).then(result => {
          this.tableData = result.data
          this.afterList()
        })
      },
      afterList () {
        this.tableData = this.tableData.map(v => {
          v.invoiceNo = v.code
          v.invoiceDes = v.illustration
          v.invoiceId = v.id
          v.invoiceDate = v.docDate
          v.accountPeriod = v.periodChs
          v.invoiceSum = v.paySum
          v.payedFee = 0
          v.payStatus = v.payStatusChs
          delete v.payMethod
          this.$set(v, 'pay', v.paySum)
          return v
        })
      },
      save () {
        let sel = this.tableData.filter(v => {
          return v.id === this.selected
        })
        this.$emit('select', sel)
      }
    },
    mixins: [list]
  }
</script>
