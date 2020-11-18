<template>
  <div>
    <!-- <ever-bread-crumb name="检验耗材管理" path="/group/mergeitems"></ever-bread-crumb> -->
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="22">
          <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list()"></ever-form2>
        </el-col>
        <el-col class="main-option" :span="2" align="right">
          <router-link :to="{path: $route.path + '/-1'}"><el-button type="primary">新建</el-button></router-link>
        </el-col>
      </el-row>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%"
        :border="false">
        <el-table-column
          prop="name"
          label="检验耗材名称">
        </el-table-column>
        <el-table-column
          prop="isMerge"
          label="合并类型"
          width="120">
          <template slot-scope="scope">
            {{scope.row.isMerge === 1 ? '合并' : '不合并'}}
          </template>
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
  </div>
</template>

<script>
  import api from '../../store/service.merge'
  import list from '@/util/list'

  export default {
    mixins: [list],
    data () {
      let schema = [
        {
          name: 'name',
          label: '检验耗材名称'
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
