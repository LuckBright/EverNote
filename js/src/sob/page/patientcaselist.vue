<template>
  <div>
    <ever-bread-crumb name="病历结构" path="/warehouse/patientcases"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <ever-query-form :schema="schema" v-model="queryObj" @query="query"></ever-query-form>
          <div class="main-option alg_r">
            <router-link :to="'/warehouse/patientcases/-1'">
              <el-button type="primary">新建</el-button>
            </router-link>
          </div>
        </div>
        <el-table v-loading.body="loading" :data="tableData" border>
          <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
          <el-table-column show-overflow-tooltip label="所属科室">
            <template slot-scope="scope">
              <!-- {{scope.row.dptInfo && scope.row.dptInfo.map(v=> v.name).join(',')}} -->
              {{scope.row.dptInfo && scope.row.dptInfo.map(function(v){if(v && v.name){ return v.name } }).join(',')}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
          <el-table-column align="right" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="toEdit(scope.row.id)">编辑</el-button>
              <ever-confirm
                :msg="'确定删除 '+scope.row.name+'？'"
                @confirm="del(scope.row.id, scope.row)"
              ></ever-confirm>
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
  </div>
</template>

<script>
import api from '../store/casestructapi'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    let schema = [
      {
        name: 'name',
        placeholder: '请输入结构名称',
        type: 'text',
        options: []
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      queryObj
    }
  }
}
</script>
