<template>
  <div>
    <!-- <ever-bread-crumb name="会计科目定义" path="/warehouse/coaaccounts"></ever-bread-crumb> -->
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/financeistall/coaaccountadd'">
            <el-button size="small" type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="code" label="会计科目表代码" align="center"></el-table-column>
        <el-table-column prop="name" label="会计科目表名称" align="center"></el-table-column>
        <el-table-column prop label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="queryDetail(scope.row)"
            >明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        :current="current"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '../store/coaaccountapi'
import list from '../../util/list'

var schema = [
  {
    name: 'name',
    label: '会计科目表名称'
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
      tableData: []
    }
  },
  methods: {
    queryDetail (row) {
      this.$router.push({
        path: '/financeistall/coaaccount/' + row.id,
        query: {
          code: row.code,
          name: row.name
        }
      })
    }
  },
  created () { }
}
</script>
