/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 21:25:25
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-21 16:42:56
 */
<template>
  <ever-table
    ref="tableList"
    table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
    class="flex_scroll flex_hidden"
    :show-index="true"
    index-label=" "
    :checkbox-width="checkboxWidth"
    :table-loading="loading"
    :columns="columns"
    :data="tableData"
    :is-single-table="true"
    :show-checkbox="showCheckbox"
    :table-default-cell-value="tableDefaultCellValue"
    :is-record-url-params="false"
    :selectable="selectable"
    @selection-change="handlerSelectionChange"
    @row-click="handlerRowClick">
    <template v-for="column in renderColumns" :slot="column.slotName">
      <el-table-column
        :key="column.prop"
        :slot="column.prop"
        :label="column.label"
        :width="column.width"
        :prop="column.prop">
        <template slot="header" slot-scope="scope">
          <span v-if="false">{{scope}}</span>
          {{column.label}}
        </template>
        <template slot-scope="scope">
          <coltd-functional
            :row="scope.row"
            :index="scope.$index"
            :render="column.render"
            :td-key="column.prop">
          </coltd-functional>
        </template>
      </el-table-column>
    </template>
  </ever-table>
</template>

<script>
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'

export default {
  name: 'leftOrderList',
  props: {
    selectable: {
      type: Function,
    },
    checkboxWidth: {
      type: Number,
      default: 40
    },
    loading: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    curPage: { // 当前页面标识
      type: String
    },
    listColumns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  components: { ColtdFunctional },
  data () {
    return {
      tableDefaultCellValue,
    }
  },
  methods: {
    /**
     * 当某一行被点击时会触发该事件
    */
    handlerRowClick ({ row }) {
      this.$emit('row-click', row)
    },
    /**
     * 当选择项发生变化时会触发该事件
    */
    handlerSelectionChange (selection) {
      this.$emit('selection-change', selection)
    }
  },
  computed: {
    columns () {
      return this.listColumns.filter(column => !column.include || column.include.includes(this.curPage))
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
  }
}
</script>

