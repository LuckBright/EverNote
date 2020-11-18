<template>
  <div :class="{'dis-plist-item': pageType === 2, 'send': pageType === 2, 'table-content': true}">
    <div :class="{'tab-btns': true, 'has-height':pageType === 1 && !isChinese() }" v-if="pageType !== 3">
      <el-radio-group v-show="isChinese()"  v-model="tabActive" @change="tabClick">
        <el-radio-button label="first">发药明细</el-radio-button>
        <el-radio-button label="second">发药汇总</el-radio-button>
      </el-radio-group>
    </div>
    <div class="dis-title-info" v-if=" pageType === 2 || pageType === 4">
      <div class="dis-title-item">摆药单：<span :class="{ 'danger': pageType === 2 && showCheckbox }">{{currentData.code}}</span>
        <el-button
          type="text"
          class="ml10 print-btn"
          v-if="!(pageType === 2 && showCheckbox)"
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint"
          @click="printCenter(pageType, currentData.id, true)">
          <i class="iconfont icon-menzhen-dayin ml10" title="打印"></i>
        </el-button>
      </div>
      <div v-if="pageType === 2 && showCheckbox" class="dis-title-item re-dis-btn">
        <el-button
          type="text"
          class="ml10"
          v-if="!(totalObj.errTotal.length === tableData.length&&tableData.length === 1)"
          v-ever-click-once="disabledPrint"
          :disabled="disabledPrint || totalObj.errTotal.length === tableData.length"
          @click="goDispensing">
          重新生成摆药单
        </el-button>
        </div>
      <div class="dis-title-item">{{pageType === 4 ? '发药时间' : '打印时间'}}：{{currentData[pageType === 4 ? 'sendTime' : 'dispensingTime']}}</div>
      <div class="dis-title-item">病区：{{currentData.areaName}}</div>
      <div class="dis-title-item">药房：{{currentData.storageRoomName}}</div>
    </div>
    <div v-show="tabActive === 'first'" label="发药明细" name="first">
      <div class="table-box">
        <ever-table
          ref="table"
          border
          table-class="no-margin-table small-padding"
          v-if="newTableData[0]"
          :key="currentComponentKey"
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
          @select-all="handleSelectionChange"
          @select="handleSelectionChange"
          @selection-change="getCheckRes"
          :config-option="isBatch ? configOption : {}"
          @get-config-table-columns="getConfigTableColumns($event, 'table')"
          @save-config="saveConfig"
        >
          <!--          :max-height="handelMaxHeight()"-->
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
                  v-if="configOption && configOption.id  && index === renderColumns.length - 1 && isBatch"
                  @click="openConfigDialog($event, 'table')"
                  class="icon iconfont icon-biaoge-shezhi ever-table-config">
                </span>
              </template>
              <template slot-scope="scope">
                <coltd-functional
                  :row="scope.row"
                  :index="scope.$index"
                  :pageType="pageType"
                  :data-map="adviceGroupMap"
                  :config-columns="configColumns"
                  :is-hidden-table-batch-col="isHiddenTask"
                  :render="column.render"
                  :td-key="column.prop">
                </coltd-functional>
              </template>
            </el-table-column>
          </template>
        </ever-table>

      </div>
    </div>
    <div v-show="tabActive === 'second'" label="发药汇总" name="second">
      <div class="table-box">
        <ever-table
          ref="totalTable"
          border
          table-class="no-margin-table small-padding"
          :table-default-cell-value="tableDefaultCellValue"
          :columns="renderTotalcolumns"
          :data="totalTableData"
          :checkbox-width="checkboxWidth"
          :span-method="objectSpanMethod"
          :is-drag-table="true"
          :is-record-url-params="false"
          :not-select-checkbox="true"
          :selectable="selectable"
          :show-checkbox="showCheckbox"
          :row-class-name="rowClassName"
          @select="handleTotalSelectionChange"
          @select-all="handleTotalSelectionChange"
          :config-option="isBatch ? totalConfigOption : {}"
          @get-config-table-columns="getTotalConfigTableColumns($event, 'totalTable')"
          @save-config="saveConfig($event, 'totalTable')"
        >
          <template v-for="(column, index) in renderTotalcolumns" :slot="column.slotName">
            <el-table-column
              :key="column.prop"
              :slot="column.prop"
              :label="column.label"
              :width="column.width"
              :prop="column.prop">
              <template slot="header" slot-scope="{}">
                {{column.label}}
                <span
                  v-if="configOption && configOption.id && index === renderTotalcolumns.length - 1 && isBatch"
                  @click="openConfigDialog($event, 'totalTable')"
                  class="icon iconfont icon-biaoge-shezhi ever-table-config">
                </span>
              </template>
              <template slot-scope="scope">
                <coltd-functional
                  :row="scope.row"
                  :index="scope.$index"
                  :pageType="pageType"
                  :is-hidden-table-batch-col="isHiddenTotal"
                  :config-columns="totalConfigColumns"
                  :data-map="adviceGroupMap"
                  :render="column.render"
                  :td-key="column.prop">
                </coltd-functional>
              </template>
            </el-table-column>
          </template>
        </ever-table>
      </div>
    </div>
    <div class="dis-btn-box">
      <el-button type="primary" size="medium" @click="goDispensing" v-if="pageType === 1" :loading="sendDisable"  :disabled="sendDisable">
        摆药
      </el-button>
      <el-button type="primary" size="medium" @click="goSend"  v-if="pageType === 2 && !showCheckbox" :loading="sendDisable"  :disabled="sendDisable">
        发药
      </el-button>
    </div>
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
import checkCdssApi from '@/warehouse/views/drug/api/processapi.js'
import { size, get } from 'lodash' // uniqBy
import ModifyTableDialog from './modify.table.dialog'
import { UDD_OPTIONS, FATHER_SON_OPTIONS, ZH_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant.js'
import Unreachable from './unreachable'
import { everprint } from '@/util/print'
import { floatTool } from '@/util/common'
import { groupMap, getColIndexMaps, createdConfigColumns, isHidden, computedNum, packSourceData, chineseSchema } from '../columnpool/dispensing.js'

// 打印预览
const preview = { preview: true, }

export default {
  name: 'DispensingTaskTable',
  props: {
    columns: { // 表格展示列配置项
      type: Array,
      required: true
    },
    listData: {
      type: [Object, Array],
      default: () => []
    },
    totalcolumns: { // 表格展示列配置项
      type: Array,
      required: true
    },
    currentData: {
      type: [Object, Array],
      default: () => { }
    },
    totalObj: {
      type: [Object, Array],
      default: () => { return { errTotal: [], cancelTotal: [] } }
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
    storageRoomId: String, // 当前库房id 或者 摆药单code
    pageType: { // 页面标识 1、任务打印 2、发药列表 3、缺货任务 4、发药记录
      type: Number,
      default: 1
    }
  },
  mixins: [HospitalParameters],
  data () {
    return {
      sendDisable: false,
      zhongyaotype: ['303', '304'],
      tabActive: 'first',
      currentIndex: 0, // 当前点击这一个明细的下标数值 => 给（编辑）异常使用
      currentRow: {},
      disabledPrint: false,
      dialogVisibleTable: false,
      modifyIsUddPackage: false,
      unReachableBoolean: false, // 无法到货组件显示隐藏字段
      unReachableRow: {}, // 无法到货数据明细
      totalTableData: [], // 汇总表格数据
      unCheckTotal: [], // 汇总表格没被选中数据
      totalCheckArr: [], // 汇总中表格被选中数据
      tableChecked: [],
      tableCacheArr: [], // 缓存的一份明细table数据
      openDialogStorageRoomId: '', // 当前打开库房id
      formateTableData: [],
      floatTool,
      processConfig: this.$store.state.processConfig.thisStorageroomProcessConfig || {},
      batchKey: {
        'batchNum': 'batchNum',
        'sysBatchCode': 'sysBatchCode',
        'validityDate': 'validityDate',
        'price': 'price'
      },
      configColumns: [], // 表格配置弹窗数据
      totalConfigColumns: [], // 汇总表格配置弹窗数据
    }
  },
  mounted () {
    this.onBus()
  },
  updated () {
    this.onBus()
  },
  beforeDestroy () {
    this.$bus.$off('notify-chinese-medicine-edit')
    this.$bus.$off('focus-dispensing-close-modify-dialog')
  },
  methods: {
    openConfigDialog (e, refName) {
      this.$refs[refName].openConfigDialog(e)
    },
    saveConfig () {
      this.$emit('update-all-column')
    },
    getConfigTableColumns (config) {
      if (!this.isBatch) return
      // 初始化数据 处理 当前配置列的表格是否显示生产批号 不显示则把 数量这一列进行合并
      this.configColumns = createdConfigColumns(config, this.tableColumns)
    },
    getTotalConfigTableColumns (config) {
      // 初始化数据 处理 当前配置列的表格是否显示生产批号 不显示则把 数量这一列进行合并
      this.totalConfigColumns = createdConfigColumns(config, this.newTotalColumns)
    },
    onBus () {
      this.$bus.$off('notify-chinese-medicine-edit')
      this.$bus.$off('focus-dispensing-close-modify-dialog')
      this.$bus.$on('notify-chinese-medicine-edit', (row) => { // 接收中药组件派发的修改事件
        this.$nextTick(_ => {
          this.handlerTableEdit(row)
        })
      })
      this.$bus.$on('focus-dispensing-close-modify-dialog', (row) => { // 接收中药组件派发的修改事件
        if (this.$refs.modifyDialog) {
          this.$refs.modifyDialog.handlerCloseDialog()
        }
        this.dialogVisibleTable = false
      })
    },
    formateNewTableData () {
      const hasCancel = this.tableData.find(item => item.status === 5) // 存在已取消数据
      // 表格 选择列 如果存在已取消数据，在每第一个条明上添加 自定义字段 isCustomCancel , 提供给hospital.column.js中处理是否渲染checkbox
      if (hasCancel) this.tableData[0].isCustomCancel = 1
      // 中药并且是中药包， 把整个药包所有明细数据放入第一条的tableData中
      let _table = this.chineseMedicinePackage && this.isUddPackage ? [Object.assign({}, this.tableData[0], { tableData: this.tableData })] : this.chineseMedicinePackage && !this.isUddPackage ? this.groupingChineseMedicine() : this.addCustomFieldForTableData(this.tableData)
      // 中药任务需要在每条数据上拼接进 configcolumns
      return _table
    },
    handelMaxHeight () {
      if (this.listData.length === 1) return 1000000
      let clientHeight = document.body.clientHeight
      let listHeight = (clientHeight - 130) / 2 - 130 - (this.pageType === 2 ? 10 : 0)
      return listHeight > 150 ? listHeight : 150
    },
    isChinese () {
      if (this.tableData.length !== 0 && this.zhongyaotype.includes(this.tableData[0].taskType)) {
        return false
      } else {
        return true
      }
    },
    unReachableHandler (row) { // 无法到货
      this.unReachableRow = row
      this.unReachableBoolean = true
    },
    makeUpPrint () { // 补打udd药包
      // mainFlag：父子医嘱标识 taskType: 物资类型 uddCode: udd code
      const { mainFlag, taskType, uddCode } = this.tableData[0]
      let code
      this.uddApi.createUdd({ uddCode }).then(res => {
        if (size(res)) {
          if (ZH_MEDICINE_TYPE.includes(`${taskType}`)) { // 中药 (中药打印处方)
            code = this.getProcessCode(UDD_OPTIONS, 'processItemPasteObject', 'code_zh')
          } else {
            if (mainFlag > 0 && this.dispensePatient) { // 父子医嘱, 并且需要按照父子医嘱模板打印
              code = this.getProcessCode(FATHER_SON_OPTIONS, 'processItemPatientObject', 'code')
            } else {
              code = this.getProcessCode(UDD_OPTIONS, 'processItemPasteObject', 'code')
            }
          }
          if (code) {
            everprint(code, [uddCode])
          } else {
            this.$messageTips(this, '', '请联系系统管理员设置库房打印信息')
          }
        }
      })
    },
    getProcessCode (list, name, key) {
      const configObj = this.currentProcessConfig.processItemObject
      return configObj[name] ? list.find(row => +configObj[name].value === row.id)[key] : ''
    },
    updateReprintUdd () { // 重新生成udd药包
      this.uddApi.updateReprintUdd({ uddCode: this.uddCode }).then(res => {
        this.$bus.$emit('hospital:notify-reprintUdd', res) // 派发给公共methods.mixin执行打印udd包
      })
    },
    rowClassName ({ row, column, rowIndex, columnIndex }) {
      if (row.status === 5) return 'cGray'
    },
    handlerTableEdit (row) { // table 修改操作 （标记异常、删除异常、补打等）
      const { storageRoomId, dispensingDrugBillsCode } = row
      // 集中摆药情况下， 可能存在多个库房 或 多个摆药单，每次编辑会把当前页面所有的编辑框都打开导致需要点击多次才能关闭（每次只打开一个当前操作库房的弹框）
      // if ((this.pageType === 1 && storageRoomId !== this.storageRoomId) || (this.pageType === 2 && dispensingDrugBillsCode !== this.storageRoomId)) return
      // 表格列 “改” 事件 src/warehouse/views/drug/columnpool/hospital.column.js
      // beforeHtmlEvent: 'handlerTableEdit'
      // 需要获取当前明细下标
      this.currentIndex = this.tableData.findIndex(item => item.id === row.id)
      this.currentRow = row
      this.dialogVisibleTable = true
      this.openDialogStorageRoomId = this.pageType === 1 ? storageRoomId : dispensingDrugBillsCode
      this.$nextTick(_ => {
        this.$refs.modifyDialog && (this.$refs.modifyDialog.dialogVisible = true)
        this.modifyIsUddPackage = this.isUddPackage
      })
    },
    handlerCloseDialog () {
      this.dialogVisibleTable = false
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
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
    secondMergeRowsData ({ row, column, rowIndex, columnIndex }) {
      const { localMaterialId } = row
      if (this.secondAdviceGroupMap.has(localMaterialId)) {
        const { drugMap } = this.secondAdviceGroupMap.get(localMaterialId)
        if (this.totableColumnsMaps.has(columnIndex) || column.type === 'selection') {
          const { firstIndex: startIndex, thisTableCount: endIndex } = drugMap.get(localMaterialId)
          return this.resolveSpan(rowIndex, (startIndex + endIndex), endIndex)
        }
      }
    },
    // 合并数据：同一处方 + 同一患者 + 同一药品 + 多个批次信息
    mergeRowsData ({ row, column, rowIndex, columnIndex }, tabActive) {
      const { orderId, localMaterialId } = row
      // const orderId = implementTime + orderId
      const { startIndex, endIndex, previousNum, drugMap } = this.adviceGroupMap.get(orderId)
      // 当前列(columnIndex)如果能在tableColumnsMaps中找到， 则需要进行合并，checkbox 显示时 tableColumnsMaps 中不包含 则需要进行合并，checkbox 列
      if (this.tableColumnsMaps.has(columnIndex) || column.type === 'selection') {
        // 开始和结束相等， 说明只有一条明细
        if (startIndex === endIndex) return
        // 物资列可能存在多个物资，需要分开合并逻辑
        // checkbox 选择框也跟随药品明细合并(****需要按照药品明细合并的在此处处理)
        if (['indexNum', 'name', 'num', 'channel', 'status'].includes(column.property) || column.type === 'selection') {
          // 药品标记信息
          const { startIndex: start, endIndex: end, previousNum: prev } = drugMap.get(localMaterialId)
          // 药品明细数量
          const drugLen = end - start + 1
          return this.resolveSpan(rowIndex, prev, drugLen)
        } else {
          // ****此处是按照执行单号的维度进行合并
          // 执行单明细数量
          const len = endIndex - startIndex + 1
          // 当前行下标和当前执行单号标记结束下标相等
          return this.resolveSpan(rowIndex, previousNum, len)
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.isUddPackage) { // udd包，合并第一列(标题选择)
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: this.tdLen,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else {
        // 非udd包任务
        const { mainFlag, mainGroupId, createTime } = row
        // 父子医嘱id + 创建时间
        const mapMainGroup = this.getMainGroupIds.get(mainGroupId + createTime)
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
          if (!this.isBatch) return
          if (this.tabActive === 'second') {
            return this.secondMergeRowsData({ row, column, rowIndex, columnIndex })
          } else {
            // 非父子医嘱（同一个药品多个批次），按照同一个执行号、同一个患者合并行
            return this.mergeRowsData({ row, column, rowIndex, columnIndex })
          }
        }
      }
    },
    selectable (row) {
      const { mainFlag, mainGroupId, createTime, identification, shortage, status } = row
      // 父子医嘱id + 创建时间
      // const mapMainGroup = this.getMainGroupIds.get(mainGroupId + createTime)
      const disabled = this.newTableData.filter(item => (item.mainGroupId + item.createTime === mainGroupId + createTime)).some(item => (item.identification || item.shortage === 23))
      return mainFlag ? !disabled : !(identification || shortage === 23 || status === 5)
    },
    filterColumns () {
      let _columns = []
      _columns = this.columns.filter(column => {
        // 没有定义pageType 代表所有页面都需要展示该表格列
        // isUddPackage, 并且有uddchecked字段：如果是udd包表格列表 展示自定义checkbox按钮
        return this.chineseMedicinePackage ? column.webShowTbaleChinese : !column.pageType || (
          this.isUddPackage ? column.pageType.includes(this.pageType) : !column.uddChecked && column.pageType.includes(this.pageType) && !column.isChineseMedicine
        )
      })
      if (!this.isBatch) {
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
      let objMap = new Map()
      let tempData = list.map(item => {
        const { localMaterialId, orderId } = item
        const onceId = orderId + localMaterialId
        if (objMap.has(onceId)) {
          let indexFlag = objMap.get(onceId)
          item.indexFlag = indexFlag.index + 1
        } else {
          item.indexFlag = 1
          // 初始化同一物资下标
          objMap.set(onceId, {
            index: 1
          })
        }
        return {...item, _sourceData: [...item]}
      })
      this.formateTableData = [...tempData]
      return tempData
    },
    // 门诊统一摆药中药分方
    groupingChineseMedicine () {
      return packSourceData(this.tableData)
    },
    /**
     * 找到选中物资的所有执行单中对应的药品
     * @param {Array} data：批次模式下如果是多批次的话，选中的就是该批次中的第一条数据
     * @returns {Map} Map: 执行单下的一个药品的id
     */
    getCheckDrugMap (data) {
      let checkDataMap = new Map()
      data.forEach(task => {
        // 需要找到执行单中所有的药品
        // indexFlag 不为 1 则是呗取消的数据需要过滤掉
        const { orderId, localMaterialId, indexFlag } = task
        let advice = checkDataMap.has(orderId)
        if (advice) {
          const checkMap = checkDataMap.get(orderId)
          const { idMap } = checkMap
          // 同一个执行单相同的药品
          if (idMap.has(localMaterialId)) {
            idMap.get(localMaterialId).index++
          } else {
            // 同一个执行单不同的药品
            idMap.set(localMaterialId, {
              index: 1
            })
          }
        } else {
          let idMap = new Map()
          if (indexFlag === 1) {
            idMap.set(localMaterialId, {
              index: 1
            })
            checkDataMap.set(orderId, {
              idMap,
              localMaterialId
            })
          }
        }
      })
      return checkDataMap
    },
    getToltalCheckMap (data) {
      let checkMap = new Map()
      data.forEach(item => {
        const { localMaterialId, indexFlag } = item
        const localMater = checkMap.has(localMaterialId)
        if (indexFlag === 1 && !localMater) {
          checkMap.set(localMaterialId, localMaterialId)
        }
      })
      return checkMap
    },
    handlerCheckBatchData (data) {
      let temp = []
      const checkMap = this.getCheckDrugMap(data)
      // this.adviceGroupMap 包装了每一个执行单下面的每一个药品的 长度
      this.newTableData.forEach(item => {
        const { orderId, localMaterialId } = item
        // 同一执行单 下面的药
        if (checkMap.has(orderId)) {
          const { idMap } = checkMap.get(orderId)
          if (idMap && idMap.has(localMaterialId)) {
            temp.push(item)
          }
        }
      })
      return temp
    },
    /************************************************
     * 住院集中摆药 新加方法
     */
    // 调用父组件 传已选数据
    getCheckRes (data) {
      const len = data.length
      let newData = []
      if (len === 0) {
        this.totalTableData = []
      } else if (len < this.newTableData.length && this.isBatch) {
        newData = this.handlerCheckBatchData(data)
      }
      this.tableCacheArr = newData.length ? newData : data
      this.tableChecked = newData.length ? newData : data
    },
    // 明细表 手动选择处理数据
    handleSelectionChange (data) {
      let newData = this.isBatch ? this.handlerCheckBatchData(data) : data
      let tempdata = this.handelTotalList(newData)
      this.totalTableData = tempdata
      this.totalCheckArr = [...tempdata]
      this.checkAllTotal()
    },
    // 选中 所有汇总表格
    checkAllTotal () {
      this.$nextTick(() => {
        this.$refs.totalTable.$refs.everTable.toggleAllSelection(true)
      })
    },
    // 明细表 手动选择具体处理数据
    handelTotalList (data) {
      let tempTotalCount = {}
      let tempTotalCountArr = []
      // 批次定价的需要所有明细
      if (this.isBatch) {
        tempTotalCountArr = computedNum(data)
        // 排序，相同物资挨在一起
        tempTotalCountArr = tempTotalCountArr.sort((a, b) => {
          if (a['localMaterialId'] !== b['localMaterialId']) {
            return b['localMaterialId'].localeCompare(a['localMaterialId'])
          }
        })
      } else {
        data.forEach(item => {
          let key = item.localMaterialId
          if (tempTotalCount[key]) {
            tempTotalCount[key].num = floatTool.add(tempTotalCount[key].num, Number(item.num))
          } else {
            tempTotalCount[key] = { ...item }
            tempTotalCount[key].num = Number(item.num)
          }
        })
        for (let key in tempTotalCount) {
          tempTotalCountArr.push(tempTotalCount[key])
        }
      }
      return tempTotalCountArr
    },
    // 汇总表格 选中处理数据
    handleTotalSelectionChange (data) {
      this.unCheckTotal = this.getUnCheckTotal(data)
      if (this.tabActive === 'second') {
        this.tableChecked = this.newTableData.filter(item => {
          return this.unCheckTotal.some(child => child.localMaterialId !== item.localMaterialId)
        })
      }
    },
    // 获取汇总没选中数据 兼容统一定价和批次定价
    getUnCheckTotal (data) {
      let tempTotal = []
      this.totalCheckArr = this.isBatch ? [] : data
      const checkMap = this.getToltalCheckMap(data)
      this.totalTableData.forEach(item => {
        if (this.isBatch) {
          const { localMaterialId } = item
          if (!checkMap.has(localMaterialId)) {
            tempTotal.push(item)
          }
        } else {
          let findres = data.find((subitem, subindex) => {
            return subitem.id === item.id
          })
          if (!findres) {
            tempTotal.push(item)
          }
        }
      })
      if (this.isBatch) {
        let unCheckObj = this.getUnCheckObj(tempTotal)
        this.totalTableData.forEach(check => {
          if (unCheckObj.id !== check.localMaterialId) {
            this.totalCheckArr.push(check)
          }
        })
      }
      return tempTotal
    },
    getUnCheckObj (list) {
      let unCheckObj = {}
      list.forEach(unCheck => {
        const { localMaterialId, orderId, itemId } = unCheck
        unCheckObj['id'] = localMaterialId
        unCheckObj['orderId'] = orderId
        unCheckObj['itemId'] = itemId
      })
      return unCheckObj
    },
    // tab切换
    tabClick (data) {
      if (this.tabActive === 'first') {
        if (this.showCheckbox) {
          let unCheckObj = this.getUnCheckObj(this.unCheckTotal)
          this.newTableData.forEach(task => {
            if (unCheckObj.id === task.localMaterialId) {
              this.$refs.table.$refs.everTable.toggleRowSelection(task, false)
            }
          })
          this.totalTableData = this.totalCheckArr
          this.checkAllTotal()
        }
      }
    },
    /**
     * @param tabActive 发药明细数据全部摆药完成恢复tab 到first
     */
    printCenter (type = false, id = false, tips = false, resetDisable = false, tabActive = false) {
      if (tabActive) this.tabActive = tabActive
      // 摆药完成恢复到发药明细
      this.sendDisable = false
      // 中药汇总
      let chinese = { '1': 'JZ_ZYBY_HZ', '2': 'WH_BATCH_JZ_ZYBY_HZ' }
      // 西药汇总
      let drugHz = { '1': 'JZ_XYBY_HZ', '2': 'WH_BATCH_JZ_XYBY_HZ' }
      // 西药明细
      let drugMx = { '1': 'JZ_XYBY_MX', '2': 'WH_BATCH_JZ_XYBY_MX' }
      if (resetDisable) return
      let nowProcessConfig = this.processConfig
      /** code分三种打印   中药汇总 JZ_ZYBY_HZ   西药汇总 JZ_XYBY_HZ  西药明细 JZ_XYBY_MX  **
       * 批次定价根据配置调用批次专用 中药汇总 WH_BATCH_JZ_ZYBY_HZ   西药汇总 WH_BATCH_JZ_XYBY_HZ  西药明细 WH_BATCH_JZ_XYBY_MX
       * nowProcessConfig.processItemObject.dispense_prepare_print 打印汇总
       * nowProcessConfig.processItemObject.dispense_paste 打印明细
       * */
      /**
       * 统一定价模式完成的数据依旧只能打印普通样式摆药单
       */
      // 摆药单明细打印配置
      let taskPrint = this.isBatch ? nowProcessConfig.processItemObject.processItemPasteObject.value || '1' : '1'
      // 摆药单汇总打印配置
      let hzPrint = this.isBatch ? nowProcessConfig.processItemObject.processItemPreparePrintObject.value || '1' : '1'
      /** type 分三种 1.正常打印  2.补打   4.补打已发 和 pageType 对应除了重新生成 **/
      let nowTaskType = this.tableData[0].taskType
      let params = { frontMess: type || this.pageType } // 分三种 1.正常打印  2.补打   3.补打已发
      params.id = id || this.currentData.id // 当前摆药单id  还是  重新生成（第一次摆药）后的 id
      let isZy = this.zhongyaotype.includes(nowTaskType)
      let code = isZy ? chinese[hzPrint] : drugHz[hzPrint]
      if (!nowProcessConfig.processItemObject) return
      if (nowProcessConfig.processItemObject.dispensePreparePrint === 1 || nowProcessConfig.processItemObject.dispensePaste === 1) {
        if (isZy) {
          everprint(code, Object.assign({}, params, { value: hzPrint }), preview)
        } else {
          const runPrint = function runPrint () {
            if (nowProcessConfig.processItemObject.dispensePaste === 1) {
              everprint(drugMx[taskPrint], Object.assign({}, params, { value: taskPrint }), preview)
            }
          }
          if (nowProcessConfig.processItemObject.dispensePreparePrint === 1) {
            everprint(drugHz[hzPrint], Object.assign({}, params, { value: hzPrint }), Object.assign({}, preview, {
              eventCb: (type) => {
                // 打印回调队列
                // 打印成功 或者 其他事件操作 会执行cb
                if (type === 'window-close') {
                  runPrint()
                }
              },
              cb: () => {
                runPrint()
              }
            }))
          }
        }
      }
      if (tips) {
        this.$messageTips(this, 'success', '打印成功')
      }
    },
    /**
     * 摆药 或者 重新摆药  注：摆药后 进行打印
     * http://jira.everjiankang.com/browse/WAR-263?filter=-1
     * 住院集中摆药摆药单打印（包含明细和汇总），增加打印预览功能
     */
    goDispensing () {
      if (this.tableChecked.length !== 0) {
        this.$confirm(this.pageType === 2 ? '重新生成摆药单？' : '确认摆药？', '请确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.sendDisable = true
          // 增加十八反、十九畏 用药提醒
          let localMaterialIds = this.tableChecked.filter(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType))).map(item => {
            return item.localMaterialId
          }).flat()
          if (localMaterialIds.length) {
            checkCdssApi.checkCdssRule({ bizCode: 'THC_RULE_MZCFSH', localMaterialIds }).then(res => {
              if (res && res.length) {
                let message = res.map(item => item.message).join('<br>')
                return this.$confirm(message + '<br>"确认执行"将为您继续执行，"取消"则可返回修改。', '用药提示', {
                  confirmButtonText: '确认执行',
                  customClass: 'w_500',
                  dangerouslyUseHTMLString: true,
                }).then(() => {
                  this.$emit('goDispensing', { checkData: this.tableChecked, currentData: this.currentData, tableCacheArr: this.tableCacheArr.length, newTableData: this.newTableData.length }, this.printCenter)
                }).catch(() => {
                  this.sendDisable = false
                })
              } else {
                this.$emit('goDispensing', { checkData: this.tableChecked, currentData: this.currentData, tableCacheArr: this.tableCacheArr.length, newTableData: this.newTableData.length }, this.printCenter)
              }
            })
          } else {
            this.$emit('goDispensing', { checkData: this.tableChecked, currentData: this.currentData, tableCacheArr: this.tableCacheArr.length, newTableData: this.newTableData.length }, this.printCenter)
          }
        }).catch(() => { })
      } else {
        this.$messageTips(this, 'warning', '请选择药品')
      }
    },
    /**
     *  发药
     */
    goSend () {
      this.$confirm('确认发药？', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendDisable = true
        // 增加十八反、十九畏 用药提醒
        let localMaterialIds = this.tableData.filter(item => CHINESE_MEDICINE_TYPE.includes(String(item.taskType))).map(item => item.localMaterialId)
        if (localMaterialIds.length) {
          checkCdssApi.checkCdssRule({ bizCode: 'THC_RULE_MZCFSH', localMaterialIds }).then(res => {
            if (res && res.length) {
              let message = res.map(item => item.message).join('<br>')
              return this.$confirm(message + '<br>"确认执行"将为您继续执行，"取消"则可返回修改。', '用药提示', {
                confirmButtonText: '确认执行',
                customClass: 'w_500',
                dangerouslyUseHTMLString: true,
              }).then(() => {
                this.$emit('goSend', { tableData: this.tableData, currentData: this.currentData }, this.changeDisable)
              }).catch(() => {
                this.sendDisable = false
              })
            } else {
              this.$emit('goSend', { tableData: this.tableData, currentData: this.currentData }, this.changeDisable)
            }
          })
        } else {
          this.$emit('goSend', { tableData: this.tableData, currentData: this.currentData }, this.changeDisable)
        }
      }).catch(() => { })
    },
    changeDisable () {
      this.sendDisable = false
    },
  },
  computed: {
    // 批次模式完成的数据中，西药类型表格生产批号是否显示
    isHiddenTask () {
      return isHidden(this.configColumns)
    },
    // 批次模式完成的数据中，西药类型表格生产批号是否显示
    isHiddenTotal () {
      return isHidden(this.totalConfigColumns)
    },
    // 缓存 表格列中标记需要合并的列 map数据
    tableColumnsMaps () {
      return getColIndexMaps(this.configColumns, this.showCheckbox)
    },
    // 缓存 表格列表中需要合并的列 map 数据 汇总
    totableColumnsMaps () {
      return getColIndexMaps(this.totalConfigColumns)
    },
    // id 给到人身上 拼接 + 中药和西药 + 当前流程 统一 1 udd 2 + 具体的页面
    configOption () {
      return {
        id: (this.chineseMedicinePackage ? 'chinese' : 'Western') + '1' + '_' + this.pageType
      }
    },
    // id 给到人身上 拼接 + 中药和西药 + 当前流程 统一 1 udd 2 + 具体的页面
    totalConfigOption () {
      return {
        id: 'configWestern' + 'second' + '1' + '_' + this.pageType
      }
    },
    chineseMedicinePackage () { // 中药包
      const taskType = this.tableData[0].taskType
      return CHINESE_MEDICINE_TYPE.includes(taskType)
    },
    // 是否是批次定价 根据列表数据来判断
    isBatch () {
      return this.tableData.some(item => item.sysBatchCode)
    },
    currentComponentKey () {
      return this.newTableData[0] ? get(this.newTableData[0], 'id', '') : ''
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
    // 汇总 显示列 数据
    renderTotalcolumns () {
      let list = this.totalConfigColumns.length ? this.totalConfigColumns : this.newTotalColumns
      return list.filter(column => !column.hidden)
    },
    // 统一定价的剔除 系统批号 有效期 销售价 生产批次 列
    newTotalColumns () {
      if (this.isBatch) return this.totalcolumns
      return this.totalcolumns.filter(item => {
        return !this.batchKey[item.prop]
      })
    },
    tdLen () {
      return this.newTableData.length
    },
    resetUddPackage () {
      const cancelSize = this.newTableData.filter(item => item.status === 5).length
      return this.isUddPackage && cancelSize && cancelSize < this.tdLen
    },
    // 按照明细进行分组
    secondAdviceGroupMap () {
      return groupMap(this.totalTableData)
    },
    // 按照一次执行单（同一个患者的药包明细）分组
    adviceGroupMap () {
      // 存储按一次执行（adviceExecuteId）分组后的数据
      const data = new Map()
      if (!this.isBatch) return data
      // 记录前一个adviceExecuteId组的数量（用于表格合并行）
      let previousNum = 0
      // 记录药品前一个组（同一个药品）有几条数据
      let previousDrugNum = 0
      // 初始化下标
      let initIndex = 0
      // 同一物资的数量和
      let totalNum = 0
      this.newTableData.forEach((task, index) => {
        // 让index从1开始计算
        index++
        const { orderId, localMaterialId, num } = task
        // 先按 执行时间 implementTime 再按 orderId
        // const orderId = implementTime + orderId
        if (data.has(orderId)) {
          // 更新结束下标 和 上一个 执行单组的数量
          const adviceData = data.get(orderId)
          const { drugMap } = adviceData
          // 更新当前执行单的结束下标
          adviceData.endIndex = index

          // 更新物资map对象
          if (drugMap.has(localMaterialId)) {
            totalNum += +num
            // 同一个执行单，相同的药品
            const drugData = drugMap.get(localMaterialId)
            drugData.endIndex = index
            drugData.num = totalNum
            drugData.localMaterialindex++
          } else {
            // 每一个新数据就把初始化下标+1
            initIndex++
            totalNum = +num
            // 同一个执行单，不同的药品
            drugMap.set(localMaterialId, {
              num: totalNum, // 用于表格展示药品合并后的总数量
              index: initIndex, // 重新计算表格行下标
              startIndex: index, // 当前执行单开始的下标
              endIndex: index, // 当前执行单结束的下标
              localMaterialindex: 1,
              previousNum: previousDrugNum// 前一个执行单有几条药品明细
            })
          }
        } else {
          // 每一个新数据就把初始化下标+1
          initIndex++
          totalNum = +num
          const drugMap = new Map()
          drugMap.set(localMaterialId, {
            num: totalNum,
            localMaterialindex: 1,
            index: initIndex, // 重新计算表格行下标
            startIndex: index, // 当前执行单开始的下标
            endIndex: index, // 当前执行单结束的下标
            // 当数据为第一条时，默认取初始化的previousDrugNum否则，如果previousDrugNum === 0 则初始胡默认以1条
            previousNum: previousDrugNum // 前一个执行单当前药品有几条明细
          })
          data.set(orderId, {
            startIndex: index, // 当前执行单开始的下标
            endIndex: index, // 当前执行单结束的下标
            drugMap,
            previousNum // 前一个执行单有几条药品明细
          })
        }
        previousNum++
        previousDrugNum++
      })
      return data
    },
    getMainGroupIds () {
      const obj = new Map()
      if (!this.isUddPackage) {
        let prev = 0 //
        let prevGroupId = '' // 上一条父子医嘱数据id
        this.newTableData.forEach(task => {
          const { mainGroupId, mainFlag, createTime } = task
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId + createTime
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
    }
  },
  watch: {
    tableData: {
      handler (data) {
        if (data && data.length !== 0) {
          this.newTableData = this.formateNewTableData(data)
          let unCheckCol = false
          if (this.pageType === 2) {
            unCheckCol = data.find((item, index) => {
              return (item.identification || item.shortage === 23)
            })
          }
          if (!unCheckCol && this.pageType !== 1 && this.pageType !== 3) {
            this.totalTableData = this.handelTotalList(data)
          } else {
            this.totalCheckArr = []
            this.totalTableData = []
          }
        }
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
<style lang="less" scoped>
  .table-content{
    padding: 5px;
  }
  .table-content /deep/ .el-header.flex_scroll{
    overflow: auto;
  }
  .table-content /deep/ .el-main.border-main ,
  .table-content /deep/ .el-main.flex_column_full_hidden,
  .table-content /deep/ .el-main.flex_scroll{
    padding: 0 !important;
  }
  .table-content /deep/ .el-container .flex_column_full_hidden{
    padding: 10px;
  }
  .table-content /deep/  .common-tree-box .el-tree{
    border-top: none;
  }
  .table-content /deep/ .el-checkbox__inner{
    transition: none;
  }
  .table-content /deep/ .el-checkbox__inner:after{
    transition: none;
  }
  .table-content.send /deep/.el-tabs__header {
    margin: 0 0 44px;
  }
  .dis-btn-box{
    text-align: center;
    margin-top: 15px;
  }
  .dis-title-info{
    /*position: absolute;*/
    /*top: 55px;*/
    margin-bottom: 10px;
    .dis-title-item{
      display: inline-block;
      color: #333;
      margin-right: 20px;
      font-size: 14px;
      &.re-dis-btn{
        color: #1c7bef;
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
  .tab-btns{
    margin-bottom: 10px;
  }
  .has-height{
    height: 35px;
  }
  .print-btn{
    margin-left: 0px;
  }
  .dis-plist-item{
    background: #fff;
    padding: 10px;
    border-bottom: solid 1px #ededed;
  }
</style>
