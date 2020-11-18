<template>
  <div>
    <ever-bread-crumb name="药品分类" path="/global/classifys"></ever-bread-crumb>
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
        <el-table-column show-overflow-tooltip prop="name" label="四级分类">
          <template slot-scope="scope">
            <span v-if="scope.row.name">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="分类级别">
          <template slot-scope="scope">
            <span>{{classifyFn(scope.row.level)}}</span>
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
        ></ever-pagination>
      </el-row>
    </div>
    <dialog-drug ref="drug" :title="title" :api="api" @cb="cb" :handleId="handleId"></dialog-drug>
  </div>
</template>

<script>
import api from '../store/druglevelapi'
import list from '@/util/list'
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
    name: 'classify1',
    type: 'select',
    options: [],
    label: '一级分类'
  },
  {
    name: 'classify2',
    type: 'select',
    options: [],
    label: '二级分类'
  },
  {
    name: 'classify3',
    type: 'select',
    options: [],
    label: '三级分类'
  }
]
var THR_LIST = [{
  id: 1,
  name: '一级分类'
},
{
  id: 2,
  name: '二级分类'
},
{
  id: 3,
  name: '三级分类'
},
{
  id: 4,
  name: '四级分类'
}]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    obj.level = 4
    obj.classify1 = ''
    obj.classify2 = ''
    obj.classify3 = ''
    return {
      tableData: [],
      querySchema,
      queryObj: obj,
      DRUGTYPE,
      handleId: 0,
      api,
      title: '药品分类'
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
    },
    classifyFn (index) {
      return THR_LIST[index - 1].name
    },
    _getOptions (v, num) {
      this.api.bycode({ pcode: v }).then(res => {
        if (res.length) {
          for (let alias of res) {
            alias.id = '' + alias.code
          }
        }
        this.$ever.getFieldFromSchema(this.querySchema, `classify${num + 1}`).options = res.length ? res : []
      })
    },
    _setSchemaOpts (arr) {
      for (let i = 0; i < arr.length; i++) {
        this.$ever.getFieldFromSchema(this.querySchema, arr[i]).options = []
      }
    }
  },
  created () {
    this.api.bylevel({ level: 1 }).then(res => {
      if (res.length) {
        for (let alias of res) {
          alias.id = alias.code
          alias.label = alias.name
        }
        this.$ever.getFieldFromSchema(this.querySchema, 'classify1').options = res
      }
    })
  },
  beforeCreate () {
    this.api = api
  },
  components: {
    DialogDrug
  },
  watch: {
    'queryObj.classify1' (v, oV) {
      if (v) {
        this.queryObj.pcode = v
        this.queryObj.level = 1
        this._getOptions(v, 1)
        this._setSchemaOpts(['classify3'])
        this.queryObj.classify2 = ''
        this.queryObj.classify3 = ''
      }
    },
    'queryObj.classify2' (v, oV) {
      if (v) {
        this.queryObj.pcode = v
        this.queryObj.level = 2
        this._getOptions(v, 2)
        this.queryObj.classify3 = ''
      }
    },
    'queryObj.classify3' (v, oV) {
      if (v) {
        this.queryObj.pcode = v
        this.queryObj.level = 3
      }
    }
  }
}
</script>
