<template>
  <div class="layout_inner">
    <el-row class="main-head">
      <el-col :span="22">
        <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list()"></ever-form2>
      </el-col>
      <el-col :span="2" class="main-option" align="right">
        <router-link :to="{path: $route.path + '/-1'}"><el-button type="primary">新建</el-button></router-link>
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
        label="频次名称">
      </el-table-column>
      <el-table-column
        prop="isValid"
        label="状态">
        <template slot-scope="scope">
          {{scope.row.isValid | formateValueToFnt({list: validList})}}
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        label="执行次数">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push($route.path + '/' + scope.row.id)">编辑</el-button>
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
  import api from '../../store/frequency.core'
  import list from '@/util/list'
  const validList = [
    {
      id: 1,
      name: '启用'
    },
    {
      id: 0,
      name: '停用'
    },
  ]
  export default {
    mixins: [list],
    data () {
      let schema = [
        {
          name: 'name',
          label: '频次名称',
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        api,
        tableData: [],
        querySchema: schema,
        queryObj: obj,
        validList,
      }
    }
  }
</script>
