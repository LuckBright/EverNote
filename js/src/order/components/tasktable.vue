/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:44
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-04 10:43:25
 */
<template>
  <div>
    <!-- 西药 -->
    <ever-table
      ref="table"
      border
      table-class="no-margin-table small-padding"
      table-default-cell-value=" "
      :columns="columns"
      :data="tableData"
      :span-method="isBatch ? objectSpanMethod : () => {}"
      :is-record-url-params="false"
      :show-index="type == 5"
      index-label=""
      :not-select-checkbox="true">
      <!-- 超市收银需要展示序号 -->
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
            <coltd-functional :row="scope.row" :index="scope.$index" :render="column.render" :td-key="column.prop"></coltd-functional>
          </template>
        </el-table-column>
      </template>
    </ever-table>
  </div>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import westerntable from './columns/westerntable'
import { WEST_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE } from '@/util/common'
import { groupMap, getColIndexMaps } from '@/warehouse/views/drug/columnpool/dispensing.js'
export default {
  name: 'TaskTable',
  props: {
    orderType: { // orderType，0代表发药单，1代表退药单
      type: [Number],
      required: true,
      default: 1
    },
    taskType: { // 物资类型 301 西药  302 中成药 303 中药饮片 304 中成药
      type: String,
      default: '301'
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isBatch: { // 定价模式 批次定价 true 统一定价 false
      type: Boolean,
      default: false
    },
    type: { // 业务类型 (业务类型： 门诊／住院／超市收银／互联网商城等) => TASK_TYPE 3: 住院
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      tableDefaultCellValue,
      WEST_MEDICINE_TYPE,
      CHINESE_MEDICINE_TYPE,
      tableColumns: [],
    }
  },
  methods: {
    // 返回表格合并span
    resolveSpan (index, prev, len) {
      if (((index - prev) % len) === 0) {
        return {
          rowspan: len,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      const { localMaterialId } = row
      if (this.secondAdviceGroupMap.has(localMaterialId)) {
        const { drugMap } = this.secondAdviceGroupMap.get(localMaterialId)
        if (this.totableColumnsMaps.has(columnIndex) || column.type === 'selection') {
          const { firstIndex: startIndex, thisTableCount: endIndex } = drugMap.get(localMaterialId)
          return this.resolveSpan(rowIndex, (startIndex + endIndex), endIndex)
        }
      }
    }
  },
  computed: {
    // 按照明细进行分组
    secondAdviceGroupMap () {
      return groupMap(this.tableData)
    },
    // 缓存 表格列表中需要合并的列 map 数据 汇总
    totableColumnsMaps () {
      return getColIndexMaps(this.configcolumns)
    },
    columns () {
      /**
       * types: // 业务类型 (业务类型： 门诊／住院／超市收银／互联网商城等) => TASK_TYPE 3: 住院
       * orderType: // 单据类型 -- 订单任务数据 (DOCUMENT_TYPE) 0: 发药单  1: 退药单
      */
      let _columns = []
      // 动态计算表格列内容 -- 根据表格类型筛选列 （中药）
      if (this.isChinese && this.orderType === 0) {
        _columns = westerntable.filter(column => column.chineseMedicine)
      } else if (this.orderType === 1 && this.type !== 5) { // 退药单据 并且非 超市收银退药
        _columns = westerntable.filter(column => ((column.orderType === undefined && (!column.types || column.types.includes(this.type))) || column.orderType === this.orderType) || (this.isBatch && column.isBatch))
      } else {
        // 过滤具体业务类型表格列
        _columns = westerntable.filter(column => (
          (!column.types && column.orderType === undefined) ||
          (column.types && column.types.includes(this.type) && column.orderType === undefined) ||
          (this.isBatch && column.isBatch) ||
          (column.orderType !== undefined && column.orderType === this.orderType && (!column.types || (column.types && column.types.includes(this.type))))
        ))
      }
      // 中药类型 批次定价数据才需要 给操作列配置提供选项
      if (this.isBatch && this.isChinese) {
        _columns.splice(0, 0, {
          label: '生产批号',
          prop: 'chineseBatchNum',
          slotName: 'chineseBatchNum',
        }, {
          label: '系统批号',
          prop: 'chineseSysBatchCode',
          slotName: 'chineseSysBatchCode',
        }, {
          label: '有效期',
          prop: 'chineseValidityDate',
          slotName: 'chineseValidityDate',
        }, {
          label: '销售价',
          prop: 'chineseSaleprice',
          slotName: 'chineseSaleprice',
        })
      }
      return _columns
    },
    // 这里没有配置列 所以手动写一个默认值 并且将批次相关的字段除外的所有列都标记上合并
    configcolumns () {
      return this.columns.map(item => {
        if (!['batchNum', 'sysBatchCode', 'validityDate', 'num', 'price'].includes(item.prop)) {
          item.concatColumn = true
        }
        return item
      })
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
    isWest () {
      return WEST_MEDICINE_TYPE.includes(this.taskType)
    },
    isChinese () {
      return CHINESE_MEDICINE_TYPE.includes(this.taskType)
    }
  },
  components: {
    ColtdFunctional
  }
}
</script>

