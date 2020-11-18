
<template>
  <div>
    <ever-bread-crumb name="预付款核销查询" path></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <h4>采购发票查询清单</h4>
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="invoiceType" label="发票类型" align="center"></el-table-column>
          <el-table-column prop label="发票编码" align="center">
            <template slot-scope="scope">
              <router-link
                :to="'/financial/payableinvoice/' + scope.row.invoiceCode + '/' + scope.row.id"
              >{{scope.row.invoiceCode}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceFee" label="发票金额" align="center"></el-table-column>
          <el-table-column prop="accountPeriod" label="发票入账期间" align="center"></el-table-column>
          <el-table-column prop="invoicePayStatus" label="发票支付状态" align="center"></el-table-column>
          <el-table-column prop="unPaiedFee" label="未支付金额" align="center"></el-table-column>
          <el-table-column prop="verifyFee" label="本次核销金额" align="center">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.verifyFee"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-row>
      </div>
      <div class="panel-body">
        <date-picker
          v-model="verifyDate"
          type="date"
          size="small"
          style="width:200px"
          placeholder="选择核销日期"
        ></date-picker>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="submitSelect()">核销</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/getinvoicelistapi'
import list from '../../util/list'
import clinicApi from '@/warehouse/store/clinicapi'
import supplierApi from '../store/payableinvoiceapi'

var schema = [
  {
    name: 'clinicID',
    label: '机构名称',
    type: 'select',
    options: [],
    disabled: true
  },
  {
    name: 'supplierID',
    label: '供应商名称',
    type: 'select',
    options: [],
    disabled: true
  },
  {
    name: 'supplierType',
    label: '供应商类型',
    type: 'systype',
    code: 'THC_WH_VENDOR_TYPE',
    disabled: true
  },
  {
    name: 'prePaymentCode',
    label: '预付款编号',
    disabled: true
  },
  {
    name: 'prePayFee',
    label: '预付款金额',
    disabled: true
  },
  {
    name: 'verifyFee',
    label: '已核销金额',
    disabled: true
  },
  {
    name: 'prePayIllustration',
    label: '预付款说明',
    disabled: true
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.apVerifactionDetails = []
    return {
      querySchema: schema,
      queryObj: obj,
      obj,
      api,
      periodArr: [],
      objId: this.$route.params.id,
      verifyDate: ''
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    submitSelect () {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.map(select => {
          this.obj.apVerifactionDetails = []
          this.obj.apVerifactionDetails.push(select)
        })
        this.obj.verifyDate = this.verifyDate ? this.$moment(this.verifyDate).format('YYYY-MM-DD') : ''
        api.saveVerify(this.obj).then(result => {
          history.go(-1)
        })
      } else {
        this.$message.error('请选择明细')
      }
    }
  },
  created () {
    api.getById(this.objId)
      .then(result => {
        result.data.prePaymentCode = result.data.prePayCode
        result.data.prePaymentId = result.data.prePayId
        Object.assign(this.queryObj, result.data)
      })
    supplierApi.getSupplierLocalByClinic()
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'supplierID').options = result.clinicArr
      })
    clinicApi.list()
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'clinicID').options = result
      })
  }
}
</script>
