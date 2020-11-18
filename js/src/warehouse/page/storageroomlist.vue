<template>
  <div class="layout_inner">
    <div class="main-head pos_re">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      <div class="pos_ab head-btn-right">
        <el-button type="primary" size="small" @click="$router.push('/warehouse/storageroomadd')">新建库房</el-button>
      </div>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData">
      <!-- <el-table-column show-overflow-tooltip prop="code" label="库房编码"></el-table-column> -->
      <el-table-column show-overflow-tooltip prop="name" label="库房名称"></el-table-column>
      <!-- <el-table-column show-overflow-tooltip prop label="所属部门">
        <template slot-scope="scope">
          <span>{{scope.row.localDepartmentObject ? scope.row.localDepartmentObject.name : ''}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column show-overflow-tooltip prop label="库房位置">
        <template slot-scope="scope">
          <span>{{scope.row.address || '-'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip prop label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/warehouse/storagerooms/' + scope.row.id)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
  </div>
</template>

<script>
import api from '../store/storageroomapi'
import list from '@/util/list'
// import department from '../store/departmentapi'
import selectInquireList from '@/warehouse/util/selectinquirelist'

var schema = [
  {
    name: 'name',
    label: '库房名称',
    placeholder: '输入库房名称'
  },
  // {
  //   name: 'code',
  //   type: 'text',
  //   label: '库房编码'
  // },
  // {
  //   name: 'departmentId',
  //   label: '所属部门',
  //   type: 'select',
  //   options: [],
  //   clearable: true
  // }
]

export default {
  mixins: [list, selectInquireList],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      querySchema: schema,
      queryObj: obj
    }
  },
  created () {
    // department.list().then(result => {
    //   this.$ever.getFieldFromSchema(this.schema, 'departmentId').initoptions = result.list
    // })
    // this._departmentSelect(true).then(res => {
    //   this.$ever.getFieldFromSchema(this.schema, 'departmentId').options = res
    // })
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
