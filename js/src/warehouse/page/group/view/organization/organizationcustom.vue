<template>
  <div class="row">
    <div class="layout_inner flex_column_full">
      <template v-if="!customFlag && customDetails">
        <el-button class="f14 alg_l" type="text" @click="handleInitial">&lsaquo;&lsaquo; 返回架构列表</el-button>
      </template>
      <template v-if="customFlag">
        <div class="main-head pos_re">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
          <div class="head-btn-right pos_ab">
            <el-button type="primary" size="small" @click="handleNewClinic">新建架构</el-button>
          </div>
        </div>
        <div class="flex_col_1_hidden main-wrap">
          <el-table height="100%" :data="tableData" class="x-hidden">
            <el-table-column width="10"></el-table-column>
            <el-table-column prop label="架构名称">
              <template slot-scope="scope">
                <a @click="handleFramework(scope.row)">{{scope.row.architectureName}}</a>
              </template>
            </el-table-column>
            <el-table-column prop width="80" label>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click.native.prevent="handleCancle(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </template>
      <template v-else>
        <wh-tree
          :FRAMEWORK="FRAMEWORK"
          @currentStatus="handleStatus"
          :isCustom="customLook"
          :customArr="customArr"
          :customNewBulit="isNewBulit"
        ></wh-tree>
      </template>
    </div>
    <tipDialog
      title="是否删除该架构"
      content="架构删除后不能恢复，请确认是否删除？"
      ref="dialog"
      :function="handleDeleteRow"
    ></tipDialog>
  </div>
</template>
<script>
import organizationApi from '@/warehouse/page/group/store/organizationapi'
import list from '@/util/list'
import { debounce } from '@/util/common'
import whTree from '@/warehouse/page/components/whtree'
import tipDialog from '@/warehouse/page/components/tipsdialog'

/**
 * FRAMEWORK 组织管理类型
 * {Number}}      121              集团架构
 * {Number}       122              自定义架构
 * {Number}       123              集团发药
 * **/
const FRAMEWORK = [121, 122, 123]
const FRAMEWORKNAME = [{ id: 122, name: '自定义架构' }]
let querySchema = [
  {
    name: 'architectureType',
    label: '查看方式',
    type: 'select',
    options: FRAMEWORKNAME,
    clearable: false
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      organizationApi,
      api: '',
      FRAMEWORK,
      customDetails: true,
      architectureType: FRAMEWORK[1],
      customFlag: true,
      customLook: 'see',
      customArr: {},
      removeCustom: {},
      isNewBulit: false,
      blockFlag: false,
      querySchema,
      queryObj
    }
  },
  created () {
    this.api = this.organizationApi
    this.queryObj.architectureType = FRAMEWORKNAME[0].id
    this.list()
  },
  methods: {
    handleDeleteRow: debounce(function () {
      let params = {
        architectureName: this.removeCustom.name || this.removeCustom.architectureName,
        architectureType: this.removeCustom.architectureType,
        isDelete: 1,
        id: this.removeCustom.id
      }
      this.organizationApi.createCustom(params).then(res => {
        if (res) {
          this.customFlag = true
          this.list()
        }
      })
    }),
    handleCancle (data) {
      this.removeCustom = Object.assign({}, data)
      this.$refs.dialog.open()
    },
    handleFramework (data) {
      this.customFlag = false
      this.customLook = 'look'
      this.architectureType = data.architectureType
      this.customArr = {
        name: data.architectureName,
        id: data.id,
        architectureType: data.architectureType
      }
      this.isNewBulit = true
    },
    handleNewClinic () {
      this.customFlag = false
      this.customDetails = true
      this.customArr = {}
    },
    handleInitial () {
      this.customFlag = true
      this.list()
    },
    handleStatus (type) {
      type ? this.customDetails = false : this.customDetails = true
      if (type && type.id) {
        this.handleCancle(type)
      }
    }
  },
  components: {
    whTree,
    tipDialog
  }
}
</script>
