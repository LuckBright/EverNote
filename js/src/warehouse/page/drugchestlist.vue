<template>
  <div>
    <ever-bread-crumb name="货位管理" path="/warehouse/drugchests"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link :to="'/warehouse/drugchestadd'">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" border>
        <el-table-column show-overflow-tooltip prop="code" label="货位编码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="货位名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="stoargeRoomObject.name" label="库房名称"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="stoargeRoomObject.departmentObject.name"
          label="所属部门"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="purpose" label="货位用途">
          <template slot-scope="scope">
            <sys-value type="THC_WH_DRUG_CONTAINER_PURPOSE" :code="scope.row.purpose"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="enableDate"
          label="生效日期"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="disableDate"
          label="失效日期"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/warehouse/drugchests/' + scope.row.id)"
            >编辑</el-button>
            <el-button
              size="small"
              type="info"
              @click="$router.push('/warehouse/drugchests/' + scope.row.id + '/' + scope.row.stoargeRoomObject.materialType)"
            >关联物资</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '../store/drugchestapi'
import list from '@/util/list'
import storageroom from '../store/storageroomapi'
// import departement from '../store/departmentapi'
// import departement from '@/warehouse/page/agency/store/agencydepartmentapi.js'
import selectInquireList from '@/warehouse/util/selectinquirelist'
var schema = [
  {
    name: 'name',
    type: 'text',
    label: '货位名称'
  },
  {
    name: 'code',
    type: 'text',
    label: '货位编码'
  },
  {
    name: 'storageRoomId',
    type: 'remotemethod',
    api: storageroom,
    initoptions: [],
    label: '所属库房'
  },
  {
    name: 'departmentId',
    label: '所属部门',
    type: 'select',
    options: [],
    clearable: true
  },
  {
    name: 'purpose',
    type: 'systype',
    code: 'THC_WH_DRUG_CONTAINER_PURPOSE',
    label: '货位用途'
  }
]
export default {
  mixins: [list, selectInquireList],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.disableDate = ''
    obj.enableDate = ''
    return {
      schema,
      querySchema: schema,
      queryObj: obj
    }
  },
  beforeCreate () {
    this.api = api
  },
  created () {
    storageroom.list().then(results => {
      this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').initoptions = results.list
    })
    // departement.list().then(results => {
    //   this.$ever.getFieldFromSchema(this.schema, 'departmentId').initoptions = results.list
    // })
    this._departmentSelect(true).then(res => {
      this.$ever.getFieldFromSchema(this.schema, 'departmentId').options = res
    })
  }
}
</script>
