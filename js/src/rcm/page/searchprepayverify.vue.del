<template>
  <div>
    <ever-bread-crumb name="预付款核销查询" path="/financial/apverifactions"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form-model
          :schema="querySchema"
          v-model="queryObj"
          :api="api"
          ref="form"
          labelWidth="140px"
          label-position="right"
        ></ever-form-model>
        <h4 class="panel-hr">
          <el-button
            style="float:right"
            size="small"
            type="primary"
            @click.native.prevent="prepayverify"
          >新建核销</el-button>预付款核销记录
        </h4>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="invoiceType" label="发票类型" align="center"></el-table-column>
          <el-table-column prop label="发票编码" align="center">
            <template slot-scope="scope">
              <router-link
                :to="'/financial/payableinvoice/' + scope.row.invoiceCode + '/' + scope.row.id"
              >{{scope.row.invoiceCode}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceFee" label="发票金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.invoiceFee | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceDate" label="发票入账时间" align="center"></el-table-column>
          <el-table-column prop="invoicePayStatus" label="发票支付状态" align="center"></el-table-column>
          <el-table-column prop="invoiceUnpaidFee" label="未付金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.invoiceUnpaidFee | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="verifyFee" label="本次核销金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.verifyFee | formatToFinacial}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="vevifyDate" label="核销日期" align="center"></el-table-column>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="cancelVerify(scope.$index, scope.row)"
              >撤销核销</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
        </el-row>-->
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/apverifactionapi'
import prepaymentApi from '../store/prepaymentapi'
import supplierApi from '../store/payableinvoiceapi'
import storage from '@/util/storage'
var schema = [
  {
    name: 'clinicID',
    label: '机构名称',
    type: 'select',
    options: []
  },
  {
    name: 'supplierID',
    label: '供应商名称',
    type: 'select',
    options: []
  },
  {
    name: 'supplierType',
    label: '供应商类型',
    type: 'systype',
    code: 'THC_WH_VENDOR_TYPE'
  },
  {
    name: 'applyDate',
    label: '申请日期'
  },
  {
    name: 'payMethod',
    label: '付款方法',
    type: 'systype',
    code: 'THC_RCM_PAYMENT_TYPE',
    useValue: true
  },
  {
    name: 'prePayIllustration',
    label: '预付款说明'
  },
  {
    name: 'prePayDescription',
    label: '业务详述'
  },
  {
    name: 'verifyStatus',
    label: '核销状态',
    type: 'select',
    options: [
      { id: 1, name: '未核销' },
      { id: 2, name: '部分核销' },
      { id: 3, name: '全部核销' }
    ]
  },
  {
    name: 'period',
    label: '财务期间',
    type: 'select',
    options: []
  },
  {
    name: 'agentId',
    label: '经办人',
    type: 'select',
    options: []
  },
  {
    name: 'prePayStatus',
    label: '预付款状态',
    type: 'select',
    options: [
      { id: '0', name: '新建' },
      { id: 1, name: '已支付' },
      { id: 2, name: '待审批' },
      { id: 3, name: '拒绝' },
      { id: 5, name: '取消' },
      { id: 6, name: '待支付' }
    ]
  },
  {
    name: 'payFee',
    label: '预付款金额'
  }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    // let arr = ['clinicID', 'supplierID', 'prePayStatus', 'supplierType', 'prePayIllustration', 'prePayDescription', 'verifyStatus', 'period', 'agentId', 'payMethod', 'applyDate', 'payFee']
    // arr.forEach(function (item) {
    //   schema.filter(function (v, i) {
    //     return v.name === item
    //   })[0].disabled = true
    // })
    return {
      querySchema: schema,
      queryObj: obj,
      api,
      objId: this.$route.params.id,
      tableData: []
    }
  },
  created () {
    api.searchPrepayVerify(this.objId)
      .then(result => {
        result.verify.clinicID += '' // 变成字符串类型才能回显
        result.verify.supplierType += ''
        result.verify.payMethod += ''
        Object.assign(this.queryObj, result.verify)
        this.tableData = result.verifyDetail
      })
    api.getClinicList({ id: storage.getLocalStorage('TENANTID') })
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'clinicID').options = result.data.pageList
      })
    prepaymentApi.getPeriod()
      .then(result => {
        result.forEach(function (item) {
          item.name = item.periodName
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'period').options = result
      })
    supplierApi.getSupplierLocalByClinic()
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'supplierID').options = result.clinicArr
      })
    prepaymentApi.getStaffList()
      .then(result => {
        this.$ever.getFieldFromSchema(this.querySchema, 'agentId').options = result.data && result.data.pageList
      })
  },
  methods: {
    prepayverify () {
      this.$router.push('/financial/getinvoicelist/' + this.objId)
    },
    cancelVerify (index, row) {
      api.cancelVerify(row.id)
        .then(result => {
          if (result.head.errCode === 0) {
            this.tableData.splice(index, 1)
          }
        })
    }
  }
}
</script>
