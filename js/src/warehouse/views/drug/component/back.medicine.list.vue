<template>
  <div class="main10 bWhite">
    <div>
      <div class="nohover">
        <!-- 西药 -->
        <template>
          <ever-table
            :class="addAbnormalCls"
            ref="table"
            border
            :key="metaData.sourceCode"
            :table-default-cell-value="tableDefaultCellValue"
            :columns="tableColumns"
            :data="tableData"
            table-class="no-margin-table small-padding"
            :checkbox-width="40"
            :is-drag-table="true"
            :is-record-url-params="false"
            :not-select-checkbox="true"
            :selectable="selectable"
            :show-checkbox="showCheckbox"
            @selection-change="handleSelectionChange"
            :config-option="isBatch ? configOption : {}"
            @get-config-table-columns="getConfigTableColumns"
            @save-config="saveConfig"
            @eventChange="eventChange">
            <template v-for="(column, index) in renderColumns" :slot="column.slotName">
              <el-table-column
                :key="column.prop"
                :slot="column.prop"
                :label="column.label"
                :width="column.width"
                :prop="column.prop">
                <template slot="header" slot-scope="{}">
                  {{column.label}}
                  <span
                    v-if="configOption && configOption.id && isBatch && index === renderColumns.length - 1"
                    @click="openConfigDialog"
                    class="icon iconfont icon-biaoge-shezhi ever-table-config"
                  ></span>
                </template>
                <template slot-scope="scope">
                  <coltd-functional :row="scope.row" :index="scope.$index" :render="column.render" :td-key="column.prop"></coltd-functional>
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { tableDefaultCellValue, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant'
// import SpanMethodMixin from '@/warehouse/views/drug/mixin/span.method.mixin.js'
import { createdConfigColumns } from '../columnpool/dispensing.js'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import storage from '@/util/storage'
export default {
  props: {
    scene: Number,
    showCheckbox: {
      type: Boolean,
      default: true
    },
    parentIndex: { // 表格 列表index(当前数据的父数据下标)
      type: Number,
      default: 0
    },
    selectable: { // Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
      type: Function,
      default: () => true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    metaData: { // 元数据，完整的一条数据集
      type: Object,
      default: () => ({})
    },
    tableConfigId: { // 动态表格id
      type: String,
      required: true
    },
    type: { // 审核状态 8：待审  9: 待入库
      type: Number
    },
    operateMode: Number, // 操作模式：1、 按处方明细处理  2、按处方批量处理
    columns: {
      type: Array,
      required: true
    }
  },
  mixins: [storage],
  created () {
  },
  computed: {
    oriMetaData () {
      // return this.metaData.taskType ? this.metaData : Object.assign(this.metaData, this.metaData.backStocksItemDtoList[0])
      return true
    },
    addAbnormalCls () { // 异常添加间距样式
      // const { identification, taskType } = this.metaData
      const cls = {
        design_table: true,
        flex1: false,
        design_error_table: false
      }
      return cls
    },
    tableColumns () {
      return this.columns.filter(column => (!column.scene || column.scene === this.scene) && (!column.isBatch || this.isBatch === column.isBatch))
    },
    renderColumns () {
      let list = this.configCloumns.length ? this.configCloumns : this.columns
      return list.filter(column => column.render && !column.hidden)
    },
   // 是否是批次定价 根据列表数据来判断
    isBatch () {
      return this.tableData.some(item => item.sysBatchCode)
    },
    configOption () {
      return {
        id: 'back_storage_' + this.scene
      }
    }
  },
  data () {
    return {
      tableDefaultCellValue,
      CHINESE_MEDICINE_TYPE,
      configCloumns: [],
      selectionTable: [], // table明细选中数据
    }
  },
  methods: {
    saveConfig () {
      this.$emit('update-all-column')
    },
    getConfigTableColumns (config) {
      if (!this.isBatch) return
      // 初始化数据 处理 当前配置列的表格是否显示生产批号 不显示则把 数量这一列进行合并
      this.configCloumns = createdConfigColumns(config, this.tableColumns)
    },
    openConfigDialog (e) {
      this.$refs.table.openConfigDialog(e)
    },
    handleSelectionChange (selection) {
      selection = selection.filter(item => {
        return !item.checkBoxId || item.countArr
      })
      this.selectionTable = selection
      this.$emit('selection-change', selection, this.type)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
  },
  components: {
    ColtdFunctional
  }
}
</script>

<style lang="scss" scoped>

.ui_dialog_02.dialogVisible /deep/ .el-dialog__header {
  display: none
}

.backgroud {
  background-color: #f1f1f1;
}
.nohover {
  /deep/ .el-table__body /deep/ tr:hover>td{
    background-color: transparent !important;
  }
}
</style>
