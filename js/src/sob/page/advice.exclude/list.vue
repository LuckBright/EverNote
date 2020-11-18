<template>
  <div class="layout_inner">
    <el-row class="main-head">
      <el-col :span="22">
        <ever-query-form ref="form" :schema="querySchema" v-model="queryObj" @query="list()"></ever-query-form>
      </el-col>
      <el-col :span="2" class="main-option" align="right">
        <router-link :to="{path: $route.path +'/-1'}"><el-button type="primary">新建</el-button></router-link>
      </el-col>
    </el-row>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      class="ever-table-wrap"
      style="width: 100%"
      :border="false">
      <el-table-column
        prop="name"
        label="排斥组名称">
      </el-table-column>
      <el-table-column
        prop="isValid"
        label="状态"
        width="100">
        <template slot-scope="scope">
          <sys-value type="THC_SOB_AVAILABLE_STATE" :code="scope.row.isValid"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push($route.path + `/${scope.row.id}`)">编辑</el-button>
          <ever-confirm :msg="'确定删除该项？'" action="删除" @confirm="del(scope.row.id, scope.row)"></ever-confirm>
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
</template>

<script>
  import api from '../../store/advice.exclude'
  import list from '@/util/list'

  export default {
    mixins: [list],
    data () {
      let schema = [
        {
          name: 'name',
          type: 'text',
          label: '排斥组名称',
          clearable: true
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        api,
        tableData: [],
        querySchema: schema,
        queryObj: obj
      }
    }
  }
</script>
