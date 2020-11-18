<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form
          :schema="querySchema"
          v-model="queryObj"
          @query="query"
        >
        </ever-query-form>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="receiptcode"
          label="收款单号"
        >
        </el-table-column>
        <el-table-column
          prop="insureOrgCode"
          label="保险公司编码"
        >
        </el-table-column>
        <el-table-column
          prop="insureOrgShortName"
          label="保险公司名称"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="收款金额"
          align="right"
        >
          <template slot-scope="scope">
            {{scope.row.receiptfee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop="receiptdate"
          label="收款日期"
          :formatter="formatDate"
        >
        </el-table-column>
        <el-table-column
          prop="insurercvcode"
          label="理赔单号"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="核销金额"
          align="right"
        >
          <template slot-scope="scope">
            {{scope.row.receiptfee | formatToFinacial}}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="核销查询"
        >
          <template slot-scope="scope">
            <router-link :to="'/financial/receiptsverificationshow/' + scope.row.receiptcode + '/' + scope.row.id">核销查询</router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-row
        type="flex"
        justify="end"
      >
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        >
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../store/receiptsverificationapi'
import insuranceorgApi from '@/insurance/store/insuranceorgapi'
import list from '../../util/list'

let schema = [
  {
    name: 'insuranceOrg',
    label: '保险公司',
    type: 'select',
    options: []
  },
  {
    startName: 'beginDate',
    endName: 'endDate',
    type: 'rangedate',
    label: '收款日期 自',
    outformat: 'YYYY-MM-DD'
  },
  {
    name: 'payStatus',
    label: '收款单状态',
    type: 'select',
    options: [
      { id: '0', name: '新建' },
      { id: '1', name: '部分核销' },
      { id: '2', name: '全部核销' }
    ]
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.beginDate = ''
    obj.endDate = ''
    return {
      querySchema: schema,
      queryObj: obj,
      tableDataList: []
    }
  },
  created () {
    insuranceorgApi.list({}).then(result => {
      if (result.data) {
        for (let insur of result.data) {
          insur.name = insur.insuranceOrgCnName
        }
        this.$ever.getFieldFromSchema(this.querySchema, 'insuranceOrg').options = result.data
      }
    })
  },
  methods: {},
  beforeCreate () {
    this.api = api
  }
}
</script>
