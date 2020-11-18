<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form ref="queryform" :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
        <div class="main-option">
          <router-link to="/financial/payments/invoice/-1" v-if="$route.path==='/financial/payments'"><el-button type="primary" size="small">由发票创建付款申请</el-button></router-link>
          <router-link to="/financial/payments/prepayment/-1" v-if="$route.path==='/financial/payments'"><el-button type="primary" size="small">由预付款创建付款申请</el-button></router-link>
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        >
        <el-table-column
          prop="batchName"
          label="付款批名">
        </el-table-column>
        <el-table-column
          prop="status"
          label="付款状态">
          <template slot-scope="scope">
            {{api.payStatus[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="paySum"
          label="付款批金额"
          align="right">
          <template slot-scope="scope">
            <span>{{scope.row.paySum | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="docDate"
          label="申请日期">
        </el-table-column>
        <el-table-column
          prop="payMethod"
          label="付款方法">
          <template slot-scope="scope">
            {{api.payMethod[scope.row.payMethod]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          label="付款类型">
          <template slot-scope="scope">
            {{api.payType[scope.row.payType]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="applicantUser"
          label="申请人">
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="$route.path==='/financial/payments'">
          <template slot-scope="scope">
            <el-button type="danger" size="small" v-if="scope.row.status===0" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="详细"
        >
          <template slot-scope="scope">
            <el-button size="small" v-if="scope.row.payType===2" @click="$router.push($route.path + '/prepayment/' + scope.row.id)">详细</el-button>
            <el-button size="small" v-if="scope.row.payType===1" @click="$router.push($route.path + '/invoice/' + scope.row.id)">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '../store/paymentapi'
import list from '../../util/list'

let schema = [
  {
    name: 'status',
    label: '付款批状态',
    type: 'select',
    options: [],
    disabled: false
  },
  {
    name: 'batchName',
    label: '付款批次'
  },
  {
    name: 'payType',
    label: '付款类型',
    options: [
      {
        id: 1,
        name: '采购付款'
      },
      {
        id: 2,
        name: '预付款'
      }
    ],
    type: 'select'
  }
]

export default {
  mixins: [list],
  data () {
    let options = []
    for (let k in api.payStatus) {
      options.push({
        id: k,
        name: api.payStatus[k]
      })
    }
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.payType = 1
    this.$ever.getFieldFromSchema(schema, 'status').options = options
    return {
      querySchema: schema,
      queryObj,
      statusArr: options,
      pageTitle: '付款申请',
      pagePath: this.$route.path
    }
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    '$route.path': {
      handler: function (val) {
        this.$refs.queryform.$refs.form.resetFields()
        if (val === '/financial/paymentsconfirm') {
          this.queryObj.status = '6'
          this.$ever.getFieldFromSchema(schema, 'status').disabled = true
        } else {
          this.queryObj.status = undefined
          this.$ever.getFieldFromSchema(schema, 'status').disabled = false
        }
        this.list(true)
      }
    }
    // '$route': function () {
    //   this.pagePath = this.$route.path
    //   if (this.$route.path === '/defray/paymentsverify') {
    //     this.pageTitle = '付款审批'
    //     this.$ever.getFieldFromSchema(schema, 'status').options = this.statusArr.filter(v => {
    //       return v.id === '2'
    //     })
    //     this.queryObj.status = '2'
    //     this.list(true)
    //   } else if (this.$route.path === '/defray/paymentsconfirm') {
    //     this.pageTitle = '付款执行'
    //     this.$ever.getFieldFromSchema(schema, 'status').options = this.statusArr.filter(v => {
    //       return v.id === '6'
    //     })
    //     this.queryObj.status = '6'
    //     this.list(true)
    //   } else {
    //     this.pageTitle = '付款申请'
    //     this.queryObj = this.$ever.createObjFromSchema(schema)
    //     this.queryObj.payType = 1
    //     this.$ever.getFieldFromSchema(schema, 'status').options = this.statusArr
    //     this.list(true)
    //   }
    // }
  }
}
</script>
