<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="invoiceDateArr">
          <ever-range-picker
            :start.sync="queryObj.invoiceDateFrom"
            :end.sync="queryObj.invoiceDateTo"
            outformat="YYYY-MM-DD hh:mm:ss"
          ></ever-range-picker>
        </template>
        <template slot="planPayDateArr">
          <ever-range-picker
            :start.sync="queryObj.planPayDateFrom"
            :end.sync="queryObj.planPayDateTo"
            outformat="YYYY-MM-DD hh:mm:ss"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list()">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <router-link to="/financial/payableinvoices/-1">
              <el-button type="primary">新建</el-button>
            </router-link>
          </el-form-item>
        </template>
      </ever-form2>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        highlight-current-row
        @current-change="handleRowCurrentChange"
      >
        <el-table-column prop="supplierCode" label="供应商编码"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
        <el-table-column prop="supplierType" label="供应商类型">
          <template slot-scope="scope">
            <sys-value type="THC_WH_VENDOR_TYPE" :code="scope.row.supplierType"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceType" label="发票类型" width="80">
          <template
            slot-scope="scope"
          >{{invoiceType[scope.row.invoiceType] && invoiceType[scope.row.invoiceType].name}}</template>
        </el-table-column>
        <el-table-column prop="code" label="发票编号">
          <template slot-scope="scope">
            <router-link
              :to="'/financial/payableinvoice/' + scope.row.code + '/' + scope.row.id"
            >{{scope.row.code}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="totalFee" label="发票金额" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.totalFee | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payedFee" label="已支付金额" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.payedFee | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" width="80">
          <template
            slot-scope="scope"
          >{{payStatus[scope.row.payStatus] && payStatus[scope.row.payStatus].name}}</template>
        </el-table-column>
        <el-table-column prop="status" label="发票状态" width="80">
          <template slot-scope="scope">{{api.statusJson[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column prop="taxRatio" label="税率" width="50" align="right">
          <template slot-scope="scope">
            <sys-value type="THC_RCM_TAX_RATIO" :code="scope.row.taxRatio"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="taxFee" label="税额" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.taxFee | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceDate" label="发票日期" width="120" :formatter="formatDate"></el-table-column>
        <el-table-column prop="invoiceDes" label="发票说明"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '../store/payableinvoiceapi'
import list from '@/util/list'
import setstatusname from '../../util/setstatusname'

var querySchema = [
  {
    name: 'supplierID',
    label: '供应商名称',
    comp: 'select',
    props: {
      options: []
    }
  },
  {
    name: 'supplierType',
    label: '供应商类型',
    comp: 'sys-type',
    props: {
      type: 'systype',
      code: 'THC_WH_VENDOR_TYPE'
    }
  },
  {
    name: 'invoiceCode',
    label: '发票编号'
  },
  {
    name: 'status',
    label: '发票状态',
    comp: 'select',
    props: {
      options: api.status
    }
  },
  {
    name: 'invoiceType',
    label: '发票类型',
    comp: 'select',
    props: {
      options: api.invoiceType
    }
  },
  {
    name: 'totalFeeFrom',
    label: '发票金额大于'
  },
  {
    name: 'totalFeeTo',
    label: '发票金额小于'
  },
  {
    name: 'payStatus',
    label: '支付状态',
    comp: 'select',
    props: {
      options: api.payStatus
    }
  },
  {
    name: 'invoiceDes',
    label: '业务说明'
  },
  {
    name: 'accountPeriod',
    label: '财务期间',
    comp: 'select',
    props: {
      options: []
    }
  },
  {
    name: 'invoiceDateArr',
    label: '发票日期',
    comp: 'custom'
  },
  {
    name: 'planPayDateArr',
    label: '预计支付日期',
    comp: 'custom'
  }
]
export default {
  mixins: [list, setstatusname],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj,
      api,
      status: api.status,
      payStatus: api.payStatus,
      invoiceType: api.invoiceType
    }
  },
  created () {
    api.getSupplierLocalByClinic()
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'supplierID').props.options = result.clinicArr
      })
    api.getPeriod()
      .then(result => {
        result.forEach(function (item) {
          item.name = item.periodName
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'accountPeriod').props.options = result
      })
  }
}
</script>
