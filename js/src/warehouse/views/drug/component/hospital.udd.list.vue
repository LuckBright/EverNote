/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-15 16:20:01
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-20 18:32:35
 */
<template>
  <div class="main10">
    <slot></slot>
    <div class="f14" v-if="isUddPackage">
      <template v-if="uddCode !== 'noPrintCode'">
        <span :class="{red: resetUddPackage}"><label class="cGray">UDD：</label><strong >{{uddCode}}</strong></span>
        <el-button
          type="text"
          class="ml10"
          v-if="resetUddPackage"
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint"
          @click="updateReprintUdd">重新生成UDD</el-button>
        <el-button
          type="text"
          size="small"
          v-else
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint"
          @click="makeUpPrint">
          <i class="iconfont icon-menzhen-dayin ml10" title="打印"></i></el-button>
          <span class="ml10" v-if="pageType == 4"><label class="cGray">发药完成时间：</label>{{finishTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
        </template>
    </div>
    <ever-table
      ref="table"
      border
      table-class="no-margin-table small-padding"
      class="design_table"
      v-if="newTableData[0]"
      :key="newTableData[0].id"
      :table-default-cell-value="tableDefaultCellValue"
      :columns="tableColumns"
      :data="newTableData"
      :checkbox-width="checkboxWidth"
      :span-method="objectSpanMethod"
      :is-drag-table="true"
      :is-record-url-params="false"
      :not-select-checkbox="true"
      :selectable="selectable"
      :show-checkbox="showCheckbox"
      :row-class-name="rowClassName"
      @eventChange="eventChange"
      :config-option="isBatch ? configOption : {}"
      @get-config-table-columns="getConfigTableColumns"
      @save-config="saveConfig"
      @selection-change="handleSelectionChange">
      <template v-for="(column, index) in renderColumns" :slot="column.slotName">
        <el-table-column
          :key="column.prop"
          :slot="column.prop"
          :label="column.label"
          :width="column.width"
          :prop="column.prop">
          <template slot="header" slot-scope="scope">
            {{column.label}}
            <span
              v-if="configOption && configOption.id && index === renderColumns.length - 1 && isBatch"
              @click="openConfigDialog"
              class="icon iconfont icon-biaoge-shezhi ever-table-config">
            </span>
          </template>
          <template slot-scope="scope">
            <coltd-functional
              :row="scope.row"
              :index="scope.$index"
              :pageType="pageType"
              :config-columns="configColumns"
              :is-hidden-table-batch-col="isHiddenTask"
              :render="column.render"
              :td-key="column.prop">
            </coltd-functional>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <!-- 修改 编辑表格数据弹框 -->
    <modify-table-dialog
      ref="modifyDialog"
      v-if="dialogVisibleTable"
      :is-udd-package="modifyIsUddPackage"
      :current-index="currentIndex"
      :current-row="currentRow"
      @close-dialog="handlerCloseDialog">
    </modify-table-dialog>
    <!-- 无法到货弹框 -->
    <unreachable
      v-if="unReachableBoolean"
      :visible.sync="unReachableBoolean"
      :row="unReachableRow">
    </unreachable>
  </div>
</template>

<script>
import HospitalParameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import { size } from 'lodash'
import ModifyTableDialog from './modify.table.dialog'
import { UDD_OPTIONS, FATHER_SON_OPTIONS, ZH_MEDICINE_TYPE, CHINESE_DRUG_OPTIONS, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant.js'
import Unreachable from './unreachable'
import { everprint } from '@/util/print'
import { getColIndexMaps, createdConfigColumns, isHidden, computedNum, packSourceData, chineseSchema } from '../columnpool/dispensing.js'
export default {
  props: {
    columns: { // 表格展示列配置项
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    isUddPackage: { // 是否是udd药包
      type: Boolean,
      default: false
    },
    pageType: { // 页面标识 1、任务打印 2、发药列表 3、缺货任务 4、发药记录
      type: Number,
      default: 1
    }
  },
  mixins: [HospitalParameters],
  data () {
    return {
      currentIndex: 0, // 当前点击这一个明细的下标数值 => 给（编辑）异常使用
      currentRow: {},
      disabledPrint: false,
      dialogVisibleTable: false,
      modifyIsUddPackage: false,
      unReachableBoolean: false, // 无法到货组件显示隐藏字段
      unReachableRow: {}, // 无法到货数据明细
      configColumns: [],
      batchKey: {
        'batchNum': 'batchNum',
        'sysBatchCode': 'sysBatchCode',
        'validityDate': 'validityDate',
        'price': 'price'
      },
    }
  },
  mounted () {
    this.$bus.$on('notify-chinese-medicine-edit', (row) => { // 接收中药组件派发的修改事件
      this.handlerTableEdit(row)
    })
  },
  beforeDestroy () {
    this.$bus.$off('notify-chinese-medicine-edit')
  },
  methods: {
    openConfigDialog (e) {
      this.$refs.table.openConfigDialog(e)
    },
    saveConfig () {
      this.$emit('update-all-column')
    },
    getConfigTableColumns (config) {
      if (!this.isBatch) return
      // 初始化数据 处理 当前配置列的表格是否显示生产批号 不显示则把 数量这一列进行合并
      this.configColumns = createdConfigColumns(config, this.tableColumns)
    },
    unReachableHandler (row) { // 无法到货
      this.unReachableRow = row
      this.unReachableBoolean = true
    },
    makeUpPrint () { // 补打udd药包
      // mainFlag：父子医嘱标识 taskType: 物资类型   uddCode
      const { mainFlag, uddCode } = this.tableData[0]
      let code
      this.uddApi.createUdd({ uddCode, storageRoomId: this.currentStorageRoomId }).then(res => {
        if (size(res)) {
          if (ZH_MEDICINE_TYPE.includes(`${Object.keys(res)[0]}`)) { // 中药 (中药打印处方)
            code = this.getProcessCode(CHINESE_DRUG_OPTIONS, 'processItemChinDispensePrintObject')
          } else {
            if (mainFlag > 0 && this.dispensePatient) { // 父子医嘱, 并且需要按照父子医嘱模板打印
              code = this.getProcessCode(FATHER_SON_OPTIONS, 'processItemPatientObject')
            } else {
              code = this.getProcessCode(UDD_OPTIONS, 'processItemPasteObject')
            }
          }
          if (code) {
            everprint(code, { sourceCodeList: [uddCode] })
          } else {
            this.$messageTips(this, '', '请联系系统管理员设置库房打印信息')
          }
        }
      })
    },
    getProcessCode (list, name) {
      const configObj = this.currentProcessConfig.processItemObject
      return configObj[name] ? list.find(row => +configObj[name].value === row.id).code : ''
    },
    updateReprintUdd () { // 重新生成udd药包
      this.$confirm('原UDD药包内的全部未取消药品会生成新的UDD药包，所有取消的药品将不会再显示', '重新生成', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uddApi.updateReprintUdd({ uddCode: this.uddCode }).then(res => {
          if (size(res)) {
            this.$messageTips(this, 'success', '重新生成UDD成功')
            this.$bus.$emit('hospital:notify-recreate-reprintUdd', res) // 派发给公共methods.mixin执行打印udd包
          }
        })
      }).catch(_ => { })
    },
    rowClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.status === 5) return 'cGray'
    },
    handlerTableEdit (row) { // table 修改操作 （标记异常、删除异常、补打等）
      // 表格列 “改” 事件 src/warehouse/views/drug/columnpool/hospital.column.js
      // beforeHtmlEvent: 'handlerTableEdit'
      // 需要获取当前明细下标
      this.currentIndex = this.tableData.findIndex(item => item.id === row.id)
      this.currentRow = row
      this.dialogVisibleTable = true
      this.$nextTick(_ => {
        this.$refs.modifyDialog.dialogVisible = true
        this.modifyIsUddPackage = this.isUddPackage
      })
    },
    handlerCloseDialog () {
      this.dialogVisibleTable = false
    },
    handleSelectionChange (selection) {
      // 1:患者列表选择项 2:发药明细选择项noPrintCode
      this.$emit('selection-change', selection, 2)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 非udd包任务
      const { mainFlag, mainGroupId } = row
      // 父子医嘱id + 创建时间
      const mapMainGroup = this.getMainGroupIds.get(mainGroupId)
      if (
        columnIndex === 0 &&
        mapMainGroup &&
        mainFlag > 0
      ) { // 住院发药任务
        const { len: adviceLength, prev } = mapMainGroup
        if (adviceLength === 1) return
        if (((rowIndex - prev) % adviceLength) === 0) {
          return {
            rowspan: adviceLength,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else {
        // 只要不是父子医嘱就得 走这个
        return this.drugMergeRowsData({ row, column, rowIndex, columnIndex })
      }
    },
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
    // 汇总列表合并同一药品 + 多批次信息
    drugMergeRowsData ({ row, column, rowIndex, columnIndex }) {
      const { otherId, mainGroupId, createTime, mainFlag } = row
      const { startIndex, endIndex, previousNum, drugMap } = this.drugGroupMap.get(otherId)
      // 当前列(columnIndex)如果能在tableColumnsMaps中找到， 则需要进行合并，checkbox 显示时 totableColumnsMaps 中不包含 则需要进行合并，checkbox 列
      // 父子医嘱合并前两列
      // 父子医嘱id + 同状态 + 创建时间
      const compose = mainGroupId + createTime
      const onlyId = mainGroupId + otherId
      const mapMainGroup = this.mailGroupIds.get(compose)
      let _columns = [0, 1]
      // 当前数据是否父子医嘱
      let isMainGroup = false
      // 发药记录页面自取数据不需要合并前两列（checkobx 、标识）
      if (this.metaData && this.metaData.delivery === 0 && this.pageType === 4) {
        _columns = []
      }
      if (
        this.pageType !== 3 &&
        this.operateMode === 1 &&
        mapMainGroup &&
        mainFlag > 0 &&
        _columns.includes(columnIndex)
        ) {
        // 父子医嘱合并
        isMainGroup = true
        return this.mainSpan(mapMainGroup, rowIndex)
      }
      // 前面是父子医嘱前两 2 列，下面是药品明细 按处方合并
      if ((this.totableColumnsMaps.has(columnIndex) || column.type === 'selection') && (isMainGroup ? !_columns.includes(columnIndex) : true)) {
        // 开始和结束相等， 说明只有一条明细
        if (startIndex === endIndex) return
        // 物资列可能存在多个物资，需要分开合并逻辑
        // checkbox 选择框也跟随药品明细合并(****需要按照药品明细合并的在此处处理)
        if (column.type === 'selection' || ['name', 'num', 'measure', 'rate', 'days', 'channel', 'spec', 'status', 'custom_da', 'custom_prop'].includes(column.property) || column.label === '改') {
          // 药品标记信息
          const { startIndex: start, endIndex: end, previousNum: prev } = drugMap.get(onlyId)
          // 药品明细数量
          const drugLen = end - start + 1
          return this.resolveSpan(rowIndex, prev, drugLen)
        } else {
          // ****此处是按照处方单号的维度进行合并
          // 执行单明细数量
          const len = endIndex - startIndex + 1
          // 当前行下标和当前处方单号标记结束下标相等
          return this.resolveSpan(rowIndex, previousNum, len)
        }
      }
    },
    selectable (row) {
      const { mainFlag, mainGroupId, identification, shortage, status, _sourceData } = row
      // 父子医嘱id mainFlag > 0
      const disabled = this.newTableData.filter(item => (item.mainGroupId === mainGroupId && mainFlag > 0)).some(item => (item.identification || item.shortage === 23 || item.status === 4))
      const hasCancel = _sourceData.some(task => { // 中药中存在无法到货数据
        return task.status === 4
      })
      return mainFlag > 0 ? !disabled : !(identification || shortage === 23 || status === 4 || hasCancel)
    },
    filterColumns () {
      let _columns = []
      _columns = this.columns.filter(column => {
        // 没有定义pageType 代表所有页面都需要展示该表格列
        // isUddPackage, 并且有uddchecked字段：如果是udd包表格列表 展示自定义checkbox按钮
        return !column.pageType || (
          this.isUddPackage ? column.pageType.includes(this.pageType) : !column.uddChecked && column.pageType.includes(this.pageType) && !column.isChineseMedicine
        )
      })
      if (!this.isBatch || this.chineseMedicinePackage) {
        // 批次定价 colums 列 的 key
        _columns = _columns.filter(item => {
          return !this.batchKey[item.prop]
        })
      }
       // 中药类型 批次定价数据才需要 给操作列配置提供选项
      if (this.chineseMedicinePackage && this.isBatch) {
        _columns.splice(0, 0, ...chineseSchema)
      }
      return _columns
    },
    addCustomFieldForTableData (list) { // 自定义表格udd数据选择框字段: customSelectionValue
      if (!this.isUddPackage) {
        return list.map(item => {
          const { mainFlag, mainGroupId } = item
          if (mainFlag > 0) { // 父子医嘱
            return {
              ...item,
              _sourceData: list.filter(row => row.mainGroupId === mainGroupId && mainFlag > 0)
            }
          } else {
            return {
              ...item,
              _sourceData: [item]
            }
          }
        })
      }
      return list.map(item => ({ ...item, customSelectionValue: true, _sourceData: JSON.parse(JSON.stringify(list)) }))
    },
    groupingChineseMedicine () { // 组合中药数据，this.tableData[0]._sourceData 整包中药数据集
      if (this.pageType === 3) {
        return this.tableData.map(row => ({
          ...row,
          _sourceData: [row]
        }))
      }
      let _arr = []
      this.tableData.forEach(row => { // 数据中的 _sourceData 是中药所有数据集合
        const { taskType, orderId } = row
        if (CHINESE_MEDICINE_TYPE.includes(String(taskType))) {
          const index = _arr.findIndex(item => item.orderId === orderId)
          if (index > -1) {
            _arr[index]._sourceData.push(row)
          } else {
            _arr.push(Object.assign({}, row, { _sourceData: [row] }))
          }
        } else {
          _arr.push(row)
        }
      })
      return _arr
    }
  },
  computed: {
    isHiddenTask () {
      return isHidden(this.configColumns)
    },
    chineseMedicinePackage () { // 中药包
      return this.tableData.some(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType)))
    },
    totableColumnsMaps () {
      return getColIndexMaps(this.configColumns, this.showCheckbox)
    },
    drugGroupMap () {
      // 存储按一次执行（adviceExecuteId）分组后的数据
      const data = new Map()
      // 记录前一个adviceExecuteId组的数量（用于表格合并行）
      let previousNum = 0
      // 记录药品前一个组（同一个药品）有几条数据
      let previousDrugNum = 0
      // 初始化下标
      let initIndex = 0
      // 同一物资的数量和
      let totalNum = 0
      this.tableData.forEach((task, index) => {
        // 让index从1开始计算
        index++
        const { num, mainGroupId, otherId } = task
        // 区分同一处方 父子医嘱和非父子医嘱
        const onlyId = mainGroupId + otherId
        if (data.has(otherId)) {
          // 更新结束下标 和 上一个 处方单组的数量
          const adviceData = data.get(otherId)
          const { drugMap } = adviceData
          // 更新当前处方单的结束下标
          adviceData.endIndex = index
          // 更新物资map对象
          if (drugMap.has(onlyId)) {
            totalNum += +num
            // 同一个处方单，相同的药品
            const drugData = drugMap.get(onlyId)
            drugData.endIndex = index
            drugData.num = totalNum
          } else {
            // 每一个新数据就把初始化下标+1
            initIndex++
            totalNum = +num
            // 同一个处方单，不同的药品
            drugMap.set(onlyId, {
              num: totalNum, // 用于表格展示药品合并后的总数量
              index: initIndex, // 重新计算表格行下标
              startIndex: index, // 当前处方单开始的下标
              endIndex: index, // 当前处方单结束的下标
              previousNum: previousDrugNum// 前一个处方单有几条药品明细
            })
          }
        } else {
          // 每一个新数据就把初始化下标+1
          initIndex++
          totalNum = +num
          const drugMap = new Map()
          drugMap.set(onlyId, {
            num: totalNum,
            index: initIndex, // 重新计算表格行下标
            startIndex: index, // 当前处方单开始的下标
            endIndex: index, // 当前处方单结束的下标
            // 当数据为第一条时，默认取初始化的previousDrugNum否则，如果previousDrugNum === 0 则初始胡默认以1条
            previousNum: previousDrugNum // 前一个处方单当前药品有几条明细
          })
          data.set(otherId, {
            startIndex: index, // 当前处方单开始的下标
            endIndex: index, // 当前处方单结束的下标
            drugMap,
            previousNum // 前一个处方单有几条药品明细
          })
        }
        previousNum++
        previousDrugNum++
      })
      return data
    },
    newTableData () {
      const hasCancel = this.tableData.find(item => item.status === 5) // 存在已取消数据
      // 表格 选择列 如果存在已取消数据，在每第一个条明上添加 自定义字段 isCustomCancel , 提供给hospital.column.js中处理是否渲染checkbox
      if (hasCancel) this.tableData[0].isCustomCancel = 1
      // 中药并且是中药包， 把整个药包所有明细数据放入第一条的tableData中
      // 在这里包装一层，计算一次同一物资所有数量的总和
      let tableList = []
      tableList = ((
        this.chineseMedicinePackage
      ) ? packSourceData(this.tableData) : this.addCustomFieldForTableData(this.tableData))
      return this.chineseMedicinePackage ? tableList : computedNum(tableList)
    },
    mailGroupIds () {
      const obj = new Map()
      if ((this.operateMode === 1)) {
        let prev = 0 // 上一条父子医嘱数据数量
        this.newTableData.forEach(task => {
          const { mainGroupId, mainFlag } = task
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId + task.createTime
          if (mainFlag > 0) {
            if (!obj.has(compose)) {
              obj.set(compose, {
                list: [task],
                prev,
                len: 1
              })
            } else {
              const map = obj.get(compose)
              map.list.push(task)
              map.len = map.list.length
            }
          }
          prev++
        })
        return obj
      }
      return obj
    },
    uddCode () {
      return this.tableData[0].uddCode
    },
    tableColumns () {
      return this.filterColumns()
    },
    renderColumns () {
      let list = this.configColumns.length ? this.configColumns : this.tableColumns
      return list.filter(column => this.chineseMedicinePackage ? (column.render && !column.noChineseMedicine) : (!column.isChineseMedicine && column.render && !column.hidden))
    },
    tdLen () {
      return this.newTableData.length
    },
    resetUddPackage () {
      const cancelSize = this.newTableData.filter(item => item.status === 5).length
      return this.isUddPackage && cancelSize && cancelSize < this.tdLen
    },
    getMainGroupIds () {
      const obj = new Map()
      if (!this.isUddPackage) {
        let prev = 0 // 上一条父子医嘱数据数量
        let prevGroupId = '' // 上一条父子医嘱数据id
        this.newTableData.forEach(task => {
          const { mainGroupId, mainFlag } = task
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId
          if (mainFlag > 0) {
            if (!obj.has(compose)) {
              const map = obj.get(prevGroupId)
              obj.set(compose, {
                list: [task],
                prev: map ? map.prev + prev : prev,
                len: 1
              })
            } else {
              const map = obj.get(compose)
              map.list.push(task)
              map.len = prev = map.list.length
              prevGroupId = compose
            }
          } else {
            // 非父子医嘱下，给prev++ 以保证下一个父子医嘱合并单元格能以正确的开始数开始
            prev++
          }
        })
        return obj
      }
      return obj
    },
    finishTime () { // 发药完成时间
      return this.tableData[0].finishTime
    },
    // id 给到人身上 拼接 + 中药和西药 + 当前流程 统一 1 udd 2
    configOption () {
      return {
        id: (this.chineseMedicinePackage ? 'chinese' : 'Western') + '2' + '_' + this.pageType
      }
    },
    // 是否是批次定价 根据列表数据来判断
    isBatch () {
      return this.tableData.some(item => item.sysBatchCode)
    },
  },
  watch: {
    newTableData: {
      handler (data) {
        this.$nextTick(_ => {
          if (!this.isUddPackage) {
            const nData = data.filter(row => {
              const { mainFlag } = row
              return mainFlag === 0 || mainFlag === 1
            })
            nData.forEach(row => {
              // canSelected: src/warehouse/views/drug/mixin/hospital.parameters.js
              if (this.canSelected(row._sourceData)) {
                this.$refs.table.$refs.everTable.toggleRowSelection(row, true)
              }
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    ColtdFunctional,
    ModifyTableDialog,
    Unreachable
  }
}
</script>
