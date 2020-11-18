<template>
  <el-dialog title="可选项目列表" :visible.sync="v" width="90%" class="ui_dialog_02 mbtariffs">
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      :api="api"
      :inline="true"
      :is-query="true"
      :info="true"
      @query="list()">
      <template slot="filterForDemensionPriceTable">
        <el-checkbox v-model="queryObj.filterForDemensionPriceTable" :true-label="1" :false-label="0" @change="list(true)" :disabled="true">仅显示未导入项目</el-checkbox>
      </template>
    </ever-form2>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        :selectable="checkSelectable"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        v-if="baseType == 2"
        prop=""
        label="物资分类">
        <template slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
        v-if="baseType == 1"
        prop=""
        label="收费项分类">
        <template slot-scope="scope">
          <sys-value type="THC_RCM_FIN_TYPE" :code="scope.row.finType"></sys-value>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
        prop="code"
        label="项目代码">
      </el-table-column>
      <el-table-column show-overflow-tooltip
         prop="name"
         label="名称">
      </el-table-column>
      <el-table-column show-overflow-tooltip
         prop="byName"
         label="通用名称">
      </el-table-column>
      <el-table-column show-overflow-tooltip
         prop="unitName"
         label="单位">
      </el-table-column>
      <el-table-column show-overflow-tooltip
        v-if="baseType == 1"
        prop="statusName"
        label="状态">
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="loadDetail('SELECTED')">导入</el-button>
      <el-button type="primary" size="small" @click="loadDetail('ALL')">导入所有</el-button>
    </span>

  </el-dialog>
</template>
<script>
import api from '@/rcm/store/tariffs/insidetariffsapi'
import list from '@/util/list'
var querySchema = [
  {
    name: 'keyword',
    label: '收费项目名称'
  }
]
export default {
  mixins: [list],
  props: ['dialogMB', 'priceTableId', 'baseType'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    // queryObj.filterForDemensionPriceTable = 1
    return {
      queryObj,
      querySchema,
      api,
      tableData: [],
      totalCount: 0,
      loading: false,
      multipleSelection: []
    }
  },
  computed: {
    v: {
      get () {
        return this.dialogMB
      },
      set (val) {
        this.$emit('update:dialogMB', val)
      }
    }
  },
  methods: {
    checkSelectable (item, index) {
      return !item.isImported
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    loadDetail (importType) {
      this.$emit('loadBaseDetail', importType, this.multipleSelection, this.queryObj)
    },
    initScheme () { // 只有首次加载的时候才做更新
      if (this.querySchema.length === 2) {
        this.querySchema.shift()
      }
      if (this.baseType === '2') {
        this.querySchema.unshift(
          {
            name: 'serviceClassification',
            label: '物资分类',
            comp: 'sys-type',
            props: {
              code: 'THC_WH_OBJECT_SUB_TYPE',
              useValue: false,
              clearable: true
            }
          }
        )
      } else {
        this.querySchema.unshift(
          {
            name: 'finType',
            label: '收费项分类',
            comp: 'sys-type',
            props: {
              code: 'THC_RCM_FIN_TYPE',
              useValue: true,
              clearable: true
            }
          }
        )
      }
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
    },
    list () {
      if (!this.dialogMB) return
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        priceTableId: this.priceTableId,
        baseType: this.baseType
      }
      params = Object.assign(params, this.queryObj)
      // if (this.queryObj.filterForDemensionPriceTable === 0) {
      //   delete params.filterForDemensionPriceTable
      // }
      for (let key in params) {
        if (params[key] === '' || key === 'requestSwitch') {
          delete params[key]
        }
      }
      this.loading = true
      // 原始是如果查询时没有数据则延用上次查询的数据，这次把这个功能取消掉了，查到什么展示什么
      api.getItemList(params).then(result => {
        this.loading = false
        this.tableData = []
        this.totalCount = 0
        const { data = {} } = result
        const { list, totalCount } = data
        if (Array.isArray(list)) {
          list.forEach(function (item) {
            item.itemUnit = item.unit
            item.pmSaleBasePriceTableDetailId = item.id
          })
          this.tableData = list
          this.totalCount = totalCount
        }
      }, errorFn => {
        this.tableData = []
        this.totalCount = 0
        this.loading = false
      })
    }
  },
  created () {
  },
  watch: {
    'dialogMB': {
      handler (v) {
        if (v) {
          this.list()
        }
      }
    },
    'baseType': {
      handler (v) {
        this.initScheme()
      }
    }
  }
}
</script>
<style scoped>
  .ui_dialog_02 .el-dialog{
    width: 800px !important;
  }
  .ui_dialog_02.mbtariffs /deep/ .el-dialog .el-dialog__body { padding-bottom: 30px; }
</style>>
