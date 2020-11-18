<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :labelWidth="140"
          label-position="right"
          v-ever-bind-enter
          :inline="true"
          :is-query="true"
          @query="list(true)"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <router-link :to="'/card/selftariffsadd'">
                <el-button type="primary">新建</el-button>
              </router-link>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="masterName" label="规则名称"></el-table-column>
        <el-table-column prop="validDateStart" label="有效期自"></el-table-column>
        <el-table-column prop="validDateEnd" label="有效期至"></el-table-column>
        <el-table-column prop label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
              type="primary"
              @click="$router.push('/card/selftariffsedit/' + scope.row.id)"
            >维护</el-button>
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
  </div>
</template>
<script>
import api from '@/card/store/selftariffsapi'
import list from '@/util/list'

let schema = [
  {
    name: 'masterName',
    label: '自费折扣表名称'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      api
    }
  },
  created () {
    // let that = this
  },
  methods: {}
}
</script>
<style  scoped>
</style>

