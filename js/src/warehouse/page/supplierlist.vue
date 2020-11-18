<template>
  <div>
    <div class="layout_inner">
      <div class="main-head pos_re">
        <!-- <ever-query-form></ever-query-form> -->
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          @query="customList">
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
            <el-button @click="handlerReset" size="small">重置</el-button>
          </template>
        </ever-form2>
        <div class="head-btn-right pos_ab">
          <el-button size="small" type="primary" @click="handleNewBuilt">新增供应商</el-button>
        </div>
      </div>
      <el-table 
        v-loading.body="loading" 
        border
        :data="tableData">
        <el-table-column prop label align="center" width="60"><template slot-scope="scope"><span>{{scope.$index + 1}}</span></template></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop
          align="center"
          label="供应商名称">
          <template slot-scope="scope">
            <a @click="handlerRouter(scope.$index, tableData)">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="unifiedCode"
          align="center"
          label="社会统一信用代码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="validContract"
          align="center"
          label="有效合同"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column 
          align="center"
          width="140"
          label="供应商状态">
          <template slot-scope="scope">
            <span :class="{ 'cRed': scope.row.status !== 1 }">
              {{scope.row.status === 1 ? '启用' : '停用'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          align="center"
          width="160"
          label="营业有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.operatingDateFlag" :class="{ 'red': scope.row.operatingDateFlag !== 1 }">
              {{validityType[scope.row.operatingDateFlag]}}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column 
          align="center"
          label="药品经营（生产）许可证有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.licenceFlag" :class="{ 'red': scope.row.licenceFlag !== 1 }">
              {{validityType[scope.row.licenceFlag]}}
            </span>
            <span v-else>-</span>
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
import api from '../store/supplierapi'
import customList from '@/warehouse/page/storages/util/customList'
// import list from '@/util/list'
import storage from '@/util/storage'
import sysvalue from '@/warehouse/store/sysvalueapi'
var querySchema = [
  {
    name: 'name',
    label: '供应商名称',
    placeholder: '输入供应商'
  },
  {
    name: 'unifiedCode',
    label: '社会统一信用代码'
  },
  {
    name: 'status',
    label: '供应商状态',
    comp: 'sys-select',
    props: {
      options: [{ id: '', name: '全部' }, { id: '1', name: '启用' }, { id: '0', name: '停用' }]
    }
  }
  // {
  //   name: 'contractType',
  //   label: '供销方式',
  //   comp: 'sys-select',
  //   props: {
  //     options: [
  //       { id: '', name: '全部' },
  //       { id: '1', name: '购销' },
  //       // { id: 2, name: '代销' }
  //     ],
  //     clearable: false
  //   }
  // }
]
export default {
  mixins: [customList, storage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      tableData: [],
      querySchema: querySchema,
      queryObj: obj,
      loading: true,
      sysList: [],
      validityType: { 1: '有效', 2: '过期', 3: '临近有效期' },
      listParams: {
        intelligenceStatus: 1
      }
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_VENDOR_TYPE').then(res => { // 处理供应商类型值级数据
      if (res && res.length) {
        this.sysList = res.map(item => {
          return {
            id: item.code,
            name: item.name
          }
        })
      }
    })
    this.customList()
  },
  activated () {
    this.customList()
  },
  methods: {
    handlerQuery () { // 查询
      this.customList(true)
      this.current = 1
    },
    customList (refresh) {
      if (refresh) {
        this.offset = 0
      }
      let params = {}
      params.offset = this.offset
      params.pagesize = this.pagesize
      Object.assign(params, this.queryObj)
      this.api.list(params).then(res => {
        if (res && res.list) {
          let results = JSON.parse(JSON.stringify(res.list))
          this.tableData = results
          this.totalCount = res.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.current = 1
      this.customList()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      const refresh = Object.keys(this.queryObj).find(keys => { return this.queryObj[keys] !== '' })
      this.customList(refresh)
    },
    handlerReset () { // 重置
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
    },
    handlerRouter (i, data) {
      // 王毅飞说id是供应商id也是单据id
      let supplierId = data[i].id || 0
      let id = data[i].id
      this.$router.push(`suppliers/${id}/${supplierId}`)
      this.$router.query = {}
    },
    handleNewBuilt () {
      this.$router.push('/goods/supplieradd/')
    },
    handleRouter (data) {
      storage.setSessionStorage('SUPPILERID', data.id)
      storage.setSessionStorage('SUPPILERNAME', data.name)
      this.$router.push('/goods/suppliernewcheck/')
    },
    handelEdit (id) {
      this.$router.push('/goods/suppliers/' + id)
    },
    managedPrice (i, data) {
      let supplierId = data[i].supplierLocalId || 0
      this.$router.push(`/goods/supplierprice/${supplierId}/${data[i].id}/${data[i].intelligenceId || '1'}`)
    }
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
<style lang="scss" scoped>
</style>
