<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
        <div class="main-option">
          <router-link :to="'/financeistall/subledgeradd'"><el-button size="small" type="primary">新建</el-button></router-link>
        </div>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="setOfBooksName"
          label="账套名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="账套说明"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isHostSetOfBook"
          label="是否默认主账套"
          align="center">
          <template slot-scope="scope">
            {{scope.row.hostSetOfBook ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountperiodId"
          label="期间名称"
          align="center">
          <template slot-scope="scope">
            {{returnperiodname(scope.row.accountperiodId)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="币种"
          align="center">
          <template slot-scope="scope">
            <sys-value type="ISO.4217" :code="scope.row.currency"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/financeistall/subledger/' + scope.row.id)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '../store/subledgerapi'
import list from '../../util/list'
import periodsetupapi from '../store/periodsetupapi'

var schema = [
  {
    name: 'name',
    label: '账套名称'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      api,
      tableData: [],
      periodArr: []
    }
  },
  methods: {
    returnperiodname (id) {
      let periodname = ''
      this.periodArr.forEach(function (item) {
        if (item.id === id) {
          periodname = item.periodName
        }
      })
      return periodname
    }
  },
  created () {
    periodsetupapi.list()
      .then(result => {
        this.periodArr = result.data
      })
  }
}
</script>
