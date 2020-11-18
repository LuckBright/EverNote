<template>
  <div>
    <ever-bread-crumb name="药品通用名称" path="/global/generals"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <el-button type="primary" @click="newBuilt">新建</el-button>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column show-overflow-tooltip label="通用名称编码" prop="code"></el-table-column>
        <el-table-column show-overflow-tooltip prop label="一级分类">
          <template slot-scope="scope">
            <span>{{transformationFn(scope.row.typeList, 0)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="二级分类">
          <template slot-scope="scope">
            <span>{{transformationFn(scope.row.typeList, 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="三级分类">
          <template slot-scope="scope">
            <span>{{transformationFn(scope.row.typeList, 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="四级分类">
          <template slot-scope="scope">
            <span>{{transformationFn(scope.row.typeList, 3)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="通用名称"></el-table-column>
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
        <el-table-column show-overflow-tooltip prop label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
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
    <dialog-drug ref="drug" :title="title" :api="api" @cb="cb" :handleId="handleId"></dialog-drug>
  </div>
</template>

<script>
import api from '../store/druglevelapi'
import list from '@/util/list'
import sysvalue from '@/warehouse/store/sysvalueapi'
import { DRUGTYPE } from '@/util/common'
import DialogDrug from './dialog-drug'
var querySchema = [
  {
    name: 'name',
    label: '通用名称'
  },
  {
    name: 'code',
    label: '通用名称编码'
  },
  {
    name: 'drugType',
    type: 'select',
    options: [],
    label: '药品分类'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    obj.level = 5
    return {
      tableData: [],
      querySchema,
      queryObj: obj,
      DRUGTYPE,
      api,
      handleId: 0,
      title: '药品通用名称'
    }
  },
  methods: {
    cb () {
      this.list()
    },
    handleEdit (id) {
      this.handleId = 0
      this.handleId = id
      this.$refs.drug.open()
    },
    newBuilt () {
      this.handleId = 0
      this.$refs.drug.open()
    },
    transformationFn (arr, num) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null) {
          return ''
        } else {
          return arr[num] ? arr[num].name : ''
        }
      }
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      this.typeoptions = []
      res.forEach(item => {
        if (item.parentId === DRUGTYPE) {
          this.typeoptions.push(item)
        }
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'drugType').options = this.typeoptions
    })
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    DialogDrug
  }
}
</script>
