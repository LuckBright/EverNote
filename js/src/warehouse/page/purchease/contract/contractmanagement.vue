<template>
  <div>
    <div class="layout_inner">
      <el-button type="primary" size="small" @click="$router.push(`/goods/addcontract?supplierId=${supplierId}`)" v-if="!isNew && showBtn">新增合同</el-button>
      <div class="main-head pos_re">
        <ever-form2
          :schema="schema"
          v-model="obj"
          v-if="isNew"
          class="form"
          @query="customList"
          :inline="true">
          <span slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
            <el-button @click="handlerReset" size="small">重置</el-button>
            <el-button type="primary" size="small" class="fr" @click="$router.push('/goods/addcontract')">新增合同</el-button>
          </span>
        </ever-form2>
        <!-- 表单表单 -->
        <el-table
          v-loading.body="loading"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            width="60"
            label>
            <template slot-scope="scope"><span>{{scope.$index + 1}}</span></template>
          </el-table-column>
          <el-table-column
            prop
            align="center"
            label="合同编号">
            <template slot-scope="scope">
              <a @click="handlerRouter(scope.row)">{{scope.row.contractNo}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="合同名称">
          </el-table-column>
          <el-table-column
            prop="supplierLocalId"
            align="center"
            label="供应商">
          </el-table-column>
          <el-table-column
            prop
            width="110"
            align="center"
            label="供销方式">
            <template slot-scope="scope">
              <span>{{scope.row.purchaseSaleType === 1 ? '购销' : '代销'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop
            width="160"
            align="center"
            label="开始日期">
            <template slot-scope="scope">
              {{scope.row.startDate | formatDateByExp('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column
            prop
            width="160"
            align="center"
            label="结束日期">
            <template slot-scope="scope">
              {{scope.row.endDate | formatDateByExp('YYYY-MM-DD')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createBy"
            align="center"
            width="110"
            label="录入人">
          </el-table-column>
          <el-table-column
            prop
            width="180"
            align="center"
            label="录入时间">
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop
            width="110"
            align="center"
            label="合同状态">
            <template slot-scope="scope">
              {{scope.row.status | formateValueToFnt({list: cntractStatus})}}
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部分页 -->
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
  </div>
</template>

<script>
import supplierpriceapi from '@/warehouse/store/supplierpriceapi.js'
import api from './api/contrct.js'
import customList from '@/warehouse/page/storages/util/customList'

const MODE = [
  // { id: '', name: '全部' },
  { id: '1', name: '购销' },
  // { id: 2, name: '代销' }
]
const CNTRACT_STATUE = [{ id: '', name: '全部' }, { id: 1, name: '有效' }, { id: 2, name: '未开始' }, { id: 3, name: '过期' }, { id: 4, name: '终止' }]
let schema = [
  {
    name: 'contractNo',
    label: '合同编号',
    comp: 'ever-remote-method',
    props: {
      api: api,
      apiName: 'getContractNo',
      simpleList: true
    }
  },
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'sys-select',
    props: {
      placeholder: '请选择供应商',
      options: [],
      filterable: true
    }
  },
  {
    name: 'purchaseSaleType',
    label: '供销方式',
    comp: 'sys-select',
    props: {
      options: MODE,
      clearable: false
    }
  },
  {
    name: 'status',
    label: '合同状态',
    comp: 'sys-select',
    props: {
      options: CNTRACT_STATUE
    }
  }
]
export default {
  mixins: [customList],
  props: {
    isNew: { // 供应商详情调用合同列表
      type: Boolean,
      default: true
    },
    showBtn: { // 供应商停用不显示新增合同按钮
      type: Boolean,
      default: true
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      cntractStatus: CNTRACT_STATUE,
      api,
      supplierpriceapi,
      supplierOptions: [], // 供应商options
      tableData: [],
      loading: false,
      supplierId: this.$route.params.supplierId
    }
  },
  created () {
    this.obj.purchaseSaleType = MODE[0].id
    this.customList()
    supplierpriceapi.queryLocal({ filterOverdueRecord: true }).then(res => { // 获取供应商
      if (res && res.length) {
        res = res.map(supplier => {
          return {
            id: supplier.id,
            name: supplier.supplierObject ? supplier.supplierObject.name : ''
          }
        })
        this.supplierOptions = res
        this.$ever.getFieldFromSchema(this.schema, 'supplierLocalId').props.options = this.supplierOptions
      }
    })
  },
  activated () {
    this.customList()
  },
  methods: {
    // 查询
    customList (flag) {
      let params = Object.assign({}, this.obj, {offset: flag ? 0 : this.offset, pagesize: this.pagesize})
      this.loading = true
      if (!this.isNew) params.supplierLocalId = this.supplierId
      api.queryList(params).then(res => {
        if (res && res.length) {
          this.tableData = res
          this.totalCount = res['totalCount']
          if (flag) this.current = 1
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
      this.loading = false
    },
    // 查询
    handlerQuery () {
      this.customList(true)
    },
    handlerRouter (v) { // 合同编号跳转
      this.$router.push(`/goods/addcontract/${v.id}`)
    },
    // 重置
    handlerReset () {
      this.obj = this.$ever.createObjFromSchema(schema)
    },
  },
}
</script>
