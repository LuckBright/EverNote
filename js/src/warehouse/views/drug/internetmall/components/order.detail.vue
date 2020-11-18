/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 21:25:20
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-21 17:22:05
 */
<template>
  <!-- 表格数据 -->
  <ever-table
    ref="tableList"
    table-class="no-margin-table small-padding"
    index-label=" "
    :show-index="true"
    :checkbox-width="40"
    :columns="columns"
    :data="tableData"
    :is-single-table="true"
    :show-checkbox="showCheckbox"
    :table-default-cell-value="tableDefaultCellValue"
    :is-record-url-params="false">
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
import orderDetailColumns from '../columns/order.detail'

export default {
  name: 'orderDetail',
  props: {
    columnFilterFn: {
      type: Function
    },
    tableData: {
      type: Array,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    curPage: { // 当前页面标识
      type: String
    }
  },
  components: { ColtdFunctional },
  data () {
    return {
      loading: false,
      tableDefaultCellValue,
    }
  },
  computed: {
    columns () {
      if (this.columnFilterFn) return this.columnFilterFn(orderDetailColumns)
      return orderDetailColumns.filter(column => !column.include || column.include.includes(this.curPage))
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
  }
}
</script>

