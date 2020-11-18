<template>
  <el-container class="pos_re page_layout_full_hidden">
    <el-radio-group v-model="listType" size="small" class="list-type pos_ab">
      <el-radio-button :label="0">树形列表</el-radio-button>
      <el-radio-button :label="1">普通列表</el-radio-button>
    </el-radio-group>
    <el-container v-if="!listType">
      <el-container class="groupmanages row">
        <el-aside width="800px" class="groupmanages-aside-left no-box-sha flex_column_full">
          <!-- 查询条件 -->
          <div class="groupmanages-aside-left-content">
            <el-row :gutter="20">
              <el-col :span="20">
                <ever-form2
                  onsubmit="return false;"
                  :schema="querySchema"
                  v-model="queryObj"
                  ref="form"
                  class="query-style"
                  :inline="true"
                  :is-query="true"
                  :input-query="true"
                  @query="list(true)">
                  <template slot="type">
                    <el-cascader
                      :options="typeOpts"
                      size="small"
                      clearable
                      placeholder="物资类别"
                      v-model="queryObj.type"
                      @change="queryEvent">
                    </el-cascader>
                  </template>
                  <template slot="splitFlag">
                    <el-checkbox v-model="splitFlag" :true-label="1" @change="queryEvent">查看拆零物资</el-checkbox>
                  </template>
                  <template slot="default">
                    <span></span>
                  </template>
                </ever-form2>
              </el-col>
              <el-col :span="4" align="right">
                  <router-link to="/manages/materialinfo" v-if="haveManage || (TENANTID && CLINICID && TENANTID === CLINICID)">
                    <el-button size="small" type="primary">新建物资</el-button>
                  </router-link>
              </el-col>
            </el-row>
          </div>
          <!-- 表格数据 -->
          <ever-table
            ref="section"
            :tableLoading="loading"
            :el-table-attr="elTableAttr"
            :columns="leftColumns"
            :data="tableData"
            table-class="no-margin-table flex_column_full_hidden x-hidden"
            class="flex_col_1_hidden main-wrap custom-sort-icon"
            :is-single-table="true"
            :ignore-sort="true"
            @sort-change="sortChange"
            @row-click="handlerRowClick">
            <template slot="opCol">
              <el-table-column label="操作" width="55" align="left">
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit-outline" type="text" @click="handlerLook(`/manages/materialinfo/${scope.row.id}?haveManage=${haveManage}&priceManage=${priceManage ? 1 : 0}`, scope.$index)"></el-button>
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </el-aside>
        <el-main class="flex_column_full groupmanages-main-right">
          <!-- 树形表格 -->
          <material-manage
            v-if="skuObject && tableData.length"
            :priceManage="priceManage"
            :key="skuObject.serviceId"
            :serviceId="skuObject.serviceId"
            :TENANTID="TENANTID"
            :serviceInfo="skuObject">
          </material-manage>
        </el-main>
      </el-container>
      <el-footer class="bg_col_03 footer_custom df bor_1" height="50px">
        <el-aside width="799px" class="no-box-sha">
          <ever-pagination
            :page-sizes="pageSizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :small="true"
            justify="center"
            :no-bg="true"
            :pager-count="5"
            :total-count="totalCount"
            :current="current"
          ></ever-pagination>
        </el-aside>
        <el-main>
          <div v-if="isConcise">
            <el-button size="small" type="primary" @click="handlerRelation" :loading="fetchLoading">发布价格</el-button>
          </div>
        </el-main>
      </el-footer>
    </el-container>
    <material-concise-list v-if="listType" :isClinic="false" class="flex_column_full_hidden" style="width: 100%">
    </material-concise-list>
  </el-container>
</template>

<script>
import list from '@/util/list'
import { leftColumns } from './columns.js'
import templateApi from '@/manages/api/template'
import api from '@/manages/page/material/materialapi'
import * as enumConfig from '@/util/common'
import ManageConfigMixin from '@/manages/mixin/manageconfigmixin'
import SelectionCheckboxMixin from '@/manages/mixin/selectioncheckboxmixin'
import whSwitch from '@/warehouse/page/components/wh.switch'
import storage from '@/util/storage'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import materialManage from './components/material.manage.vue'
import materialConciseList from '@/warehouse/page/institutionmaterial/materiallist'
// 查询条件
const querySchema = [
  {
    name: 'type',
    comp: 'custom',
    style: 'width: 150px'
  },
  {
    name: 'name',
    style: REMOTE_METHODS_WIDTH,
    props: {
      placeholder: REMOTE_METHODS_PLACEHOLDER,
      clearable: true,
      'suffix-icon': 'el-icon-search'
    }
  },
  {
    name: 'splitFlag',
    comp: 'custom',
  }
]
const noOtherMaterialCode = ['503', '504', '7778fdf0cc0b4bff8328cb7307da3c54', 'c9a969e9-1962-4bfd-a9aa-093f1c6fd362']
export default {
  name: 'material',
  mixins: [list, ManageConfigMixin, SelectionCheckboxMixin],
  props: {
    isConcise: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    Object.assign(queryObj, { systemType: enumConfig.STENCIL_TYPE[0].id })
    queryObj.isClinic = false
    queryObj.managePermission = 1
    queryObj.classifyId = ''
    queryObj.splitFlag = 1
    queryObj.orderType = enumConfig.ORDER_TYPE[1]
    return {
      arg: 'status',
      typeOpts: [],
      api, // 接口请求
      enumConfig, // 环境配置
      systemTypeObject: enumConfig.STENCIL_TYPE[0], // 类型
      batchObj: {},
      querySchema, // 查询条件schema
      noOtherMaterialCode,
      queryObj, // 查询条件obj
      leftColumns, // 配置列
      skuObject: null, // 当前物资数据id
      fetchLoading: false, // 请求中
      tableLoading: false,
      splitFlag: 1,
      listType: 0,
      TENANTID: '',
      CLINICID: '',
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let prevPath = from.path.split('/')
      if (prevPath[1] !== 'materialinfo' && prevPath.length < 4) {
        vm.resetQueryObj()
        vm.list(true)
      } else {
        vm.list()
      }
    })
  },
  mounted () {
    // 获取当前机构是否是集团机构
    this.TENANTID = storage.getLocalStorage('TENANTID') || ''
    this.CLINICID = storage.getLocalStorage('CLINICID') || ''
  },
  async created () {
    if (!this.isConcise) {
      this.fetchMaterialType()
    }
  },
  computed: {
    elTableAttr () { // 当前表格无数据时展示的文字
      return {
        'empty-text': this.loading ? '加载中...' : '暂无数据'
      }
    }
  },
  methods: {
    resetQueryObj () {
      this.listType = 0
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      Object.assign(queryObj, { systemType: enumConfig.STENCIL_TYPE[0].id })
      queryObj.isClinic = false
      queryObj.managePermission = 1
      queryObj.classifyId = ''
      queryObj.orderType = enumConfig.ORDER_TYPE[1]
      this.queryObj = queryObj
    },
    sortChange ({ column, prop, order }) {
      if (order === 'ascending') return
      this.queryObj.orderType = enumConfig.ORDER_TYPE[order === 'descending' ? 2 : 1]
      this.list()
    },
    // 请求物资分类
    async fetchMaterialType () {
      let options = await templateApi.getSourceByClassify(enumConfig.STENCIL_TYPE[0].id).then(res => {
        return res
      })
      this.typeOpts = this.handleMaterialType(options)
    },
    // 查询物资列表
    queryEvent: enumConfig.debounce(function () {
      if (this.splitFlag) {
        if (typeof this.queryObj.splitFlag !== 'undefined') delete this.queryObj.splitFlag
      } else {
        this.queryObj.splitFlag = 0
      }
      const size = this.queryObj.type.length
      this.queryObj.classifyId = size ? this.queryObj.type[size - 1] : ''
      this.tableData = []
      this.list(true)
    }),
    // 处理物资分类数据格式为级联组件要求格式
    handleMaterialType (options) {
      options.forEach(item => {
        item.value = item.id
        item.label = item.name
        item.children = JSON.parse(JSON.stringify(item.classifyList))
        delete item.classifyList
        if (item.children && item.children.length) this.handleMaterialType(item.children)
      })
      return options
    },
    // 点击物资列表
    handlerRowClick ({ row, column }) {
      this.skuObject = row
    }
  },
  components: {
    materialManage,
    materialConciseList,
    whSwitch
  }
}
</script>

<style lang="scss" scoped>
  .batch {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    border: 1px solid #1a7bee;
    font-size: 14px;
    ul {
      display: flex;
      padding: 0;
      margin: 0 30px;
      li {
        display: flex;
        align-items: center;
        margin-right: 20px;
        label {
          white-space: nowrap;
          margin-right: 10px;
        }
        .el-input {
          max-width: 80px;
        }
      }
    }
  }
  .el-input.error /deep/ .el-input__inner{
    border: 1px solid #ff0000;
    text-align: center;
  }
  .list-type{
    right: 10px;
    top: 10px;
    z-index: 22;
  }
  .custom-sort-icon {
    margin: 0px;
    box-sizing: border-box;
  }
</style>
