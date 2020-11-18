<template>
  <div class="layout_box adviceShowTable" :class="{'virtual-scroll': virtualScroll}">
    <div class="scroll-bar" v-if="virtualScroll">
      <span class="scroll-block"></span>
    </div>
    <ever-table
      :style="'transform: translateY('+ tranY +'px)'"
      class="advicetable"
      ref="taskTable"
      :table-loading="loading"
      :columns="columns"
      :data="virtualScroll ? curTableData : tableData"
      :is-pagination="false"
      :is-drag-table="true"
      :show-checkbox="showCheckbox"
      :span-method="arraySpanMethod"
      :config-option="configOption"
      :header-cell-class-name="headerCellClassName"
      :cell-class-name="cellClassName"
      :row-class-name="rowClassName"
      :selectable="selectable"
      :is-record-url-params="false"
      :not-select-checkbox="true"
      :checkbox-width="30"
      @configChange="configChange"
      @sort-change="sortChange"
      @row-click="elRowClick"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @selection-change="selectionChange"
      border
    >
      <template slot="serviceType" slot-scope="scope">
        <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :show-en="true"></sys-value>
      </template>
      <template slot="doctorAdviceName" slot-scope="scope">
        <reform-record v-if="scope.row.spanAll" :reform-id="scope.row.adviceReformId"></reform-record>
        <doctor-advice-name v-else :row="scope.row" :fuzi-data="fuziData" :set-main-group-id="setMainGroupId"></doctor-advice-name>
      </template>
      <template slot="doctorAdviceContent" slot-scope="scope">
        <span v-if="scope.row.adviceFeesDtoList && scope.row.adviceFeesDtoList[0] && String(scope.row.adviceFeesDtoList[0].feesType) === '2'">数量：{{scope.row.count}}{{scope.row.countUnitName || '项'}}</span>
        <advice-item-show :item="scope.row" :visit-type="visitType" v-else></advice-item-show>
      </template>
      <template slot="source" slot-scope="scope">
        <template v-if="scope.row.source">
          <sys-value type="THC_SYS_PRESCRIPTION_SOURCE" :code="String(scope.row.source)" :show-en="true"></sys-value>
        </template>
        <template v-else><span>--</span></template>
      </template>
      <template slot="status" slot-scope="scope">
        <template v-if="adviceStatus[String(scope.row.status)] && adviceStatus[String(scope.row.status)].txt">
          <span :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}">
            {{adviceStatus[String(scope.row.status)].txt}}
            <el-tooltip content="报告已出" placement="right" effect="light" v-if="scope.row.releaseReport">
              <i class="report-icon el-icon-document"></i>
            </el-tooltip>
          </span>
          <i class="iconfont icon-yichang cRed" v-if="scope.row.isException && +scope.row.status === 5"></i>
          <template v-else-if="['2', '70'].includes(String(scope.row.status))">
            <el-tooltip  placement="right" effect="light" v-if="visitType === 1 && (scope.row.remarks || scope.row.auditOpinion)">
              <span slot="content"><span v-html="scope.row.remarks || auditOpinionFormat(scope.row.auditOpinion)"></span></span>
              <i class="iconfont icon-yichang cRed"></i>
            </el-tooltip>
            <el-tooltip  placement="right" effect="light" v-else-if="visitType === 3 && scope.row.description">
              <span slot="content">驳回原因：<span v-html="scope.row.description"></span></span>
              <i class="iconfont icon-yichang cRed"></i>
            </el-tooltip>
            <i class="iconfont icon-yichang cRed" v-else></i>
          </template>
          <i class="iconfont icon-tuike" v-else-if="scope.row.refAdviceLogFLag" @click="refundSearch(scope.row)"></i>
        </template>
        <template v-else>--</template>
      </template>
      <template slot="executeStatus" slot-scope="scope">
        <slot name="executeStatus" :row='scope.row'></slot>
      </template>
      <template slot="completeTimes" slot-scope="scope">
        <slot name="completeTimes" :row='scope.row'></slot>
      </template>
      <template slot="executeBy" slot-scope="scope">
        <slot name="executeBy" :row='scope.row'></slot>
      </template>
      <template slot="dispenseStatus" slot-scope="scope">
        <slot name="dispenseStatus" :row='scope.row'></slot>
      </template>
      <template slot="employName" slot-scope="scope">
        <slot name="employName" :row='scope.row'></slot>
      </template>
    </ever-table>
    <!-- 右键操作按钮列表 -->
    <contextmenu v-if="!noOperate" :class-name="rowClass" :menu="contextList" @menu="getMenuList" @select="contextSelect"></contextmenu>
    <!-- 框选组件 -->
    <drag-to-select class-name="waitbg" @select="dragSelect" @cancel="dragCancel"></drag-to-select>
  </div>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import drugInfo from '@/inpatient/components/drug.info'
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import contextmenu from '@/workspace/components/contextmenu'
import dragToSelect from '@/workspace/components/drag.to.select'
import { OUTPATIENT_ADVICE_STATUS, ADVICE_STATUS, objFind } from '@/util/common'
import { specialClassify } from '@/inpatient/components/doctor.state/index.js'
import doctorAdviceName from '@/inpatient/components/medical.orders/doctor.advice.name.vue'
import reformRecord from '@/inpatient/components/reform.record.vue'
export default {
  props: {
    visitType: {                // 场景， 1：门诊，3：住院
      type: Number,
      default: 1
    },
    loading: {                  // table loading
      type: Boolean,
      default: false
    },
    showCheckbox: {             // 是否显示checkbox
      type: Boolean,
      default: false
    },
    setMainGroupId: {           // 设置的合并单元格标识，默认按照父子医嘱进行合并
      type: String,
      default: 'mainGroupId'
    },
    specCheckboxMergeFlag: {    // 显示checkbox时，checkbox的合并单元格，是否单独设置，specCheckboxMergeFlag有值，按照该值设置，没值，默认按照setMainGroupId设置
      type: String
    },
    selectable: {               // checkbox 是否可用
      type: Function
    },
    specRowClass: {             // 特殊table row class名，用于右键及框选功能识别
      type: String
    },
    showData: Array,            // table 数据
    columns: Array,             // table显示的字段及相关配置
    configOption: Object,       // table 的id标识，{id: xxxx}
    contextList: Array,         // table 右键list
    arraySpan: Array,           // 父子医嘱需合并单元格的字段
    noBorderSpan: Array,        // 父子医嘱，不需要显示下边框的字段
    isDragCancel: Boolean,      // 待提交区，是否取消框选状态
    noOperate: Boolean,         // 是否禁用所有操作，只用于展示
    defaultSort: Function, // 默认排序方法
    isVirtualScroll: {
      type: Boolean,
      default: false
    },
    statusRelation: Object // 状态关联关系
  },
  data () {
    return {
      sysvalue,
      OUTPATIENT_ADVICE_STATUS,  // 门诊医嘱执行状态
      ADVICE_STATUS,             // 住院医嘱执行状态
      specialClassify,           // 特殊药品标识
      initData: '',              // 保存table 初始化数据，用于按照类型排序
      configData: [],            // 当前表格字段设置，用于合并单元格等当前字段位置判断
      // 给定的排序顺序: 检查、检验、病理、会诊、西药/中成药、中药饮片、商品(实物类)、耗材(实物类)、治疗(处置)、手术、麻醉、收费耗材、美容、医事服务费、其它
      sortType: ['800', '801', '10003', '2467', '301', '302', '303', '304', '10008', '299', '300', '802', '2125', '10004', '10006', '10002', '799', '867'],
      curSortType: [],           // 当前排序类型
      tableData: [],             // table数据
      serviceTypeList: [],       // 医嘱分类
      rowClass: 'sendContextRow', // table默认row className
      sortDir: '', // 排序方向
      sortProp: '', // 排序字段
      tranY: 0,
      preTableData: [],
      nextTableData: [],
      curTableData: [],
      selectData: []
    }
  },
  created () {
    this.getSortType()
  },
  // mounted () {
  //   this.removeTranScroll()
  //   if (this.virtualScroll) {
  //     this.virtualScrollMode()
  //     this.addTranScroll()
  //   }
  // },
  methods: {
    // checkbox选中
    toggle (filterFn) {
      let everTable = this.$refs.taskTable.$refs.everTable
      if (everTable) {
        let rows = []
        if (filterFn) { // 过滤条件
          rows = filterFn(this.tableData)
        }
        // 清空所有选中的列
        this.clearSeleted()
        rows.forEach(row => {
          everTable.toggleRowSelection(row)
        })
      }
    },
    async getSortType () {
      this.sortType = []
      await this.sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
        this.serviceTypeList = options
        options.forEach(v => {
          this.sortType.push(v.name)
        })
      })
      // 不用给定的排序顺序，按照拼音首字母排序
      this.sortType = this.sortType.sort((a, b) => {
        return a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'})
      })
    },
    // 合并单元格处理
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.spanAll) {
        if (column.property === 'doctorAdviceName') {
          return [1, this.columns.length + 1]
        } else {
          return [1, 0]
        }
      }
      let list1 = []
      if (this.showCheckbox && !this.specCheckboxMergeFlag) {
        list1.push(0)
      } else if (this.specCheckboxMergeFlag) {
        if (columnIndex === 0 && this.checkMergeData[row[this.specCheckboxMergeFlag]].length > 1) {
          let n = this.checkMergeData[row[this.specCheckboxMergeFlag]].findIndex(val => { return row.id === val.id })
          let n0 = this.checkMergeData[row[this.specCheckboxMergeFlag]] && this.checkMergeData[row[this.specCheckboxMergeFlag]].length || 0
          if (!n) {
            return {rowspan: n0, colspan: 1}
          } else {
            return {rowspan: 0, colspan: 0}
          }
        }
      }
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (this.arraySpan.includes(item.prop)) {
            list1.push(this.showCheckbox ? index + 1 : index)
          }
        })
      }
      if (list1.includes(columnIndex)) {
        // 父子医嘱合并单元格
        if (Number(row.mainFlag) === 1) {
          let m2 = this.fuziData[row[this.setMainGroupId]] && this.fuziData[row[this.setMainGroupId]].length || 0
          return {rowspan: m2, colspan: 1}
        } else if (Number(row.mainFlag) > 1) return {rowspan: 0, colspan: 0}
      }
    },
    // 给header设置类名
    headerCellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      if (this.configData && this.configData.length) {
        this.configData.forEach(item => {
          if (!item.hidden) count++
        })
      }
      let className = []
      if (this.showCheckbox && Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      return className.join(' ')
    },
    // 给body中cell 设置类名
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      let configIndex = []
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (!item.hidden) count++
          if (this.noBorderSpan.includes(item.prop)) configIndex.push(String(index))
        })
      }
      let className = []
      if (this.showCheckbox && Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      if (String(row.status) === '210' || String(row.status) === '500' || String(row.status) === '11') {
        className.push('lineGray')
      }
      if (configIndex.includes(column.columnKey)) {
        if (Number(row.mainFlag) && this.fuziData[row[this.setMainGroupId]] && this.fuziData[row[this.setMainGroupId]].length) {
          if (this.fuziData[row[this.setMainGroupId]].length > this.fuziData[row[this.setMainGroupId]].findIndex(item => { return item.id === row.id }) + 1) {
            className.push('noBottomBorder')
          }
          // 处理父子医嘱标识问题
          if (Number(row.mainFlag) === 1) {
            className.push('topCell')
          } else {
            if (row.id === this.fuziData[row[this.setMainGroupId]][this.fuziData[row[this.setMainGroupId]].length - 1].id) {
              className.push('bottomCell')
            } else {
              className.push('middleCell')
            }
          }
        }
      }
      return className.join(' ')
    },
    // 给row设置类名
    rowClassName ({ row, rowIndex }) {
      return (this.rowClass !== '-1' ? this.rowClass : '') + (row && row.isSelect || row && row.specbg ? ' selectbg' : '') + (row.status === 0 ? ' waitbg' : '')
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    // 点击排序
    sortChange ({ column, prop, order }) {
      this.sortDir = order
      this.sortProp = prop
      if (prop === 'serviceType') {
        // 按类型排序
        if (order === 'ascending') {
          this.curSortType = this.sortType
          this.sortMethods()
        } else if (order === 'descending') {
          this.curSortType = JSON.parse(JSON.stringify(this.sortType.reverse()))
          this.sortMethods()
          // reverse 会改变原来的数组，再次reverse恢复原来的顺序
          this.sortType.reverse()
        } else {
          this.curSortType = []
          this.tableData = JSON.parse(this.initData)
        }
      } else {
        let col = objFind(this.columns, {prop: prop})
        if (!order && !col.sortRemote) {
          this.tableData = JSON.parse(this.initData)
        } else if (col.sortMethod) {
          this.tableData = col.sortMethod(this.tableData, order)
        }
      }
      this.$emit('sortChange', {column, prop, order})
    },
    // 排序方法
    sortMethods () {
      let waitDataList = []
      let sendDataList = []
      let mainGroupObj = {}
      let typeObj = {
        send: {},
        wait: {}
      }
      let otherType = {
        send: [],
        wait: []
      }

      this.tableData.forEach(item => {
        if (item.spanAll) {
          return
        }
        let groupId = item[this.setMainGroupId]
        let mainFlag = item.mainFlag
        if (!mainGroupObj[groupId]) {
          mainGroupObj[groupId] = [item]
          return
        }
        if (mainFlag === 1) {
          mainGroupObj[groupId].unshift(item)
        } else {
          mainGroupObj[groupId].push(item)
        }
      })
      Object.values(mainGroupObj).forEach(item => {
        let typeName = item[0].serviceTypeName
        let status = item[0].status === 0 ? 'wait' : 'send'
        let obj = typeObj[status]
        let other = otherType[status]
        if (!this.curSortType.includes(typeName)) {
          other.push(...item)
          return
        }
        if (!obj[typeName]) {
          obj[typeName] = []
        }
        obj[typeName].push(...item)
      })
      this.curSortType.forEach(item => {
        let typeSendArr = typeObj.send[item]
        let typeWaitArr = typeObj.wait[item]
        typeSendArr && sendDataList.push(...typeSendArr)
        typeWaitArr && waitDataList.push(...typeWaitArr)
      })
      sendDataList.push(...otherType.send)
      waitDataList.push(...otherType.wait)
      this.tableData = [].concat(sendDataList, waitDataList)
    },
    // row单击事件
    elRowClick ({row, column}) {
      this.$emit('row-click', {row, column})
    },
    // cell单击事件
    cellClick ({row, column, cell, event}) {
      this.$emit('cell-click', {row, column, cell, event})
    },
    // 双击事件
    cellDblclick ({row, column, cell, event}) {
      this.$emit('cell-dblclick', {row, column, cell, event})
    },
    // checkbox 回调
    selectionChange (selection) {
      let select = []
      selection.forEach(item => {
        if (!this.specCheckboxMergeFlag) {
          if (!this.fuziData[item[this.setMainGroupId]].findIndex(val => { return item.id === val.id })) {
          // if (item.mainFlag < 2) {
            select = select.concat(this.fuziData[item[this.setMainGroupId]])
          }
        } else {
          if (!this.checkMergeData[item[this.specCheckboxMergeFlag]].findIndex(val => { return item.id === val.id })) {
            select = select.concat(this.checkMergeData[item[this.specCheckboxMergeFlag]])
          }
        }
      })
      if (this.virtualScroll) {
        // 选中
        // 取消选中
        let selectObj = {}
        let curTableObj = {}
        let selectedObj = {}
        let selectedData = []
        select.forEach(item => {
          selectObj[item.id] = item
        })
        this.curTableData.forEach(item => {
          curTableObj[item.id] = item
        })
        this.selectData.forEach(item => {
          let id = item.id
          if (selectObj[id] || !curTableObj[id]) {
            selectedData.push(item)
          }
        })
        selectedData.forEach(item => {
          selectedObj[item.id] = item
        })
        select.forEach(item => {
          if (!selectedObj[item.id]) {
            selectedData.push(item)
          }
        })
        if (this.selectData.length === selectedData.length) {
          return
        }
        this.selectData = selectedData
        this.$emit('selectionChange', this.selectData)
        return
      }
      this.selectData = select
      this.$emit('selectionChange', select)
    },
    // 右键操作按钮列表触发事件回调
    getMenuList (index) {
      // index取实际待提交数据或已提交数据中该条数据的index值
      let curIndex = index
      if (this.tableData[index].status === 0) {
        curIndex = index - this.sendData.length
      }
      this.$emit('menu', {index: curIndex, isWait: this.tableData[index].status === 0, row: this.tableData[index]})
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      // index取实际待提交数据或已提交数据中该条数据的index值
      let curIndex = index
      if (this.tableData[index].status === 0) {
        curIndex = index - this.sendData.length
      }
      this.$emit('contextSelect', {item, index: curIndex, isWait: this.tableData[index].status === 0})
    },
    // 框选回调
    dragSelect (startIndex, endIndex) {
      if (typeof startIndex !== 'number' || typeof endIndex !== 'number') {
        return false
      }
      // 如果startIndex endIndex在子医嘱上，判断父医嘱或最后一个子医嘱的位置，框选整个父子医嘱
      startIndex = this.waitData.findIndex(item => { return item.id === this.fuziData[this.waitData[startIndex][this.setMainGroupId]][0].id })
      endIndex = this.waitData.findIndex(item => { return item.id === this.fuziData[this.waitData[endIndex][this.setMainGroupId]][this.fuziData[this.waitData[endIndex][this.setMainGroupId]].length - 1].id })
      this.tableData.forEach((item, index) => {
        if (index >= (startIndex + this.sendData.length) && index <= (endIndex + this.sendData.length)) {
          item.isSelect = true
        } else {
          item.isSelect = false
        }
        this.$set(this.tableData, index, item)
      })
      this.$emit('dragSelect', {startIndex, endIndex})
    },
    // 点击框选外区域，取消表格中选中效果
    dragCancel (flag) {
      if (typeof flag !== 'number' && !this.isDragCancel) {
        this.tableData.forEach((item, index) => {
          item.isSelect = false
          this.$set(this.tableData, index, item)
        })
        this.$emit('dragSelect', {startIndex: 0, endIndex: 0})
      }
    },
    // 数据处理，将json数据取出，将毒麻精放等特殊标识合为一个，将父子医嘱放在一起
    resetData (data) {
      let obj = {}
      data.forEach(item => {
        if (this.serviceTypeList && this.serviceTypeList.length && item.serviceType) {
          let obj = this.serviceTypeList.filter(v => {
            return item.serviceType === v.code
          })[0]
          item.serviceTypeName = obj && obj.name || ''
        }
        item = Object.assign({}, item, item.adviceJson)
        item = Object.assign({}, item, item.extendFieldJson)
        if (item.adviceFeesDtoList && item.adviceFeesDtoList.length) {
          item.adviceFeesDtoList = item.adviceFeesDtoList.map(val => {
            if (val.feesJson) {
              val = Object.assign({}, val, val.feesJson)
            }
            return val
          })
          if (!['303', '304'].includes(item.serviceType) && !item.setFlag) {
            item.chargeLevel = item.adviceFeesDtoList[0].chargeLevel
          }
        }
        if (['301', '302'].includes(item.serviceType)) {
          item.specialClassifyDrug = []
          if (item.specialClassify) {
            item.specialClassifyDrug.push(item.specialClassify)
          }
          if (item.antibioticType) {
            item.specialClassifyDrug.push(item.antibioticType)
          }
          if (item.highRisk) {
            item.specialClassifyDrug.push(item.highRisk)
          }
          item.specialClassifyDrug = item.specialClassifyDrug.join(',')
        }
        if (!obj[item[this.setMainGroupId]]) {
          obj[item[this.setMainGroupId]] = [item]
        } else {
          obj[item[this.setMainGroupId]].push(item)
        }
      })
      let finalData = []
      Object.keys(obj).forEach(item => {
        obj[item].sort((n1, n2) => {
          return Number(n1.mainFlag) - Number(n2.mainFlag)
        })
        finalData = finalData.concat(obj[item])
      })
      return finalData
    },
    // 全选事件
    toggleAllSelection () {
      this.$refs.taskTable.$refs.everTable.toggleAllSelection()
    },
    // 退库标示的查询事件
    refundSearch (row) {
      this.$bus.$emit('refundEvent', row)
    },
    virtualScrollMode (type) {
      if (!type || !this.scrollConfig) {
        this.scrollConfig = {
          loadH: 100,
          loadN: 5,
          loading: false,
          pos: 0
        }
        this.initLoadNumber = 40
      }
      let curLoadPos = this.scrollConfig.pos + this.initLoadNumber
      this.preTableData = this.tableData.slice(0, this.scrollConfig.pos)
      this.curTableData = this.tableData.slice(this.scrollConfig.pos, curLoadPos)
      this.nextTableData = this.tableData.slice(curLoadPos, this.tableData.length)
      this.$nextTick(() => {
        this.computeScroll()
      })
    },
    addTranScroll () {
      let scrollElc = document.querySelector('.adviceShowTable')
      this.tranY = 0
      scrollElc && scrollElc.addEventListener('mousewheel', this.tranScroll)
    },
    removeTranScroll () {
      let scrollElc = document.querySelector('.adviceShowTable')
      this.tranY = 0
      scrollElc && scrollElc.removeEventListener('mousewheel', this.tranScroll)
    },
    // translate滚动
    tranScroll (e) {
      let scrollElc = document.querySelector('.adviceShowTable')
      let scrollEl = document.querySelector('.advicetable')
      if (this.scrollConfig.loading) {
        return
      }
      e.preventDefault()
      let sign = e.deltaY > 0 ? 1 : -1
      if (this.tranY >= 0 && sign === -1) {
        this.tranY = 0
        this.computeScroll()
        return
      }
      if (this.tranY <= -scrollEl.offsetHeight + scrollElc.offsetHeight - 20 && sign === 1) {
        this.tranY = -scrollEl.offsetHeight + scrollElc.offsetHeight - 20
        this.computeScroll()
        return
      }
      let movY = Math.abs(e.deltaY) > 60 ? 60 : Math.abs(e.deltaY)
      this.tranY -= movY * sign
      if (this.tranY > -this.scrollConfig.loadH && sign === -1) {
        this.scrollConfig.loading = true
        this.preScroll(this.scrollConfig.loadN) && (this.tranY -= 40 * this.scrollConfig.loadN)
      }
      if (this.tranY <= -scrollEl.offsetHeight + scrollElc.offsetHeight + this.scrollConfig.loadH && sign === 1) {
        this.scrollConfig.loading = true
        this.nextScroll(this.scrollConfig.loadN) && (this.tranY += 40 * this.scrollConfig.loadN)
      }
      this.computeScroll()
    },
    // 向下滚动
    nextScroll (size) {
      let data
      data = this.nextTableData.splice(0, size)
      if (!data.length) {
        this.scrollConfig.loading = false
        return false
      }
      let mainGroupId = data[size - 1]
      let nextMainGroupId = this.nextTableData.length && this.nextTableData[0][this.setMainGroupId]
      while (mainGroupId === nextMainGroupId) {
        data.push(this.nextTableData.shift())
        nextMainGroupId = this.nextTableData.length && this.nextTableData[0][this.setMainGroupId]
      }
      this.checkedScroll(data)
      this.curTableData.push(...data)
      this.scrollConfig.pos += data.length
      data = this.curTableData.splice(0, data.length)
      mainGroupId = data[data.length - 1][this.setMainGroupId]
      nextMainGroupId = this.curTableData.length && this.curTableData[0][this.setMainGroupId]
      while (mainGroupId === nextMainGroupId) {
        data.push(this.curTableData.shift())
        nextMainGroupId = this.curTableData.length && this.curTableData[0][this.setMainGroupId]
      }
      this.initLoadNumber = this.curTableData.length
      data && this.preTableData.push(...data)
      this.$nextTick(() => {
        this.scrollConfig.loading = false
      })
      return true
    },
    // 向上滚动
    preScroll (size) {
      let data
      data = this.preTableData.splice(-size)
      if (!data.length) {
        this.scrollConfig.loading = false
        return false
      }
      let mainGroupId = data[0].mainGroupId
      let preMainGroupId = this.preTableData.length && this.preTableData[this.preTableData.length - 1][this.setMainGroupId]
      while (mainGroupId === preMainGroupId) {
        data.unshift(this.preTableData.pop())
        preMainGroupId = this.preTableData.length && this.preTableData[this.preTableData.length - 1][this.setMainGroupId]
      }
      this.checkedScroll(data)
      this.curTableData.unshift(...data)
      data = this.curTableData.splice(-data.length)
      mainGroupId = data[0][this.setMainGroupId]
      preMainGroupId = this.curTableData.length && this.curTableData[this.curTableData.length - 1][this.setMainGroupId]
      while (mainGroupId === preMainGroupId) {
        data.unshift(this.curTableData.pop())
        preMainGroupId = this.curTableData.length && this.curTableData[this.curTableData.length - 1][this.setMainGroupId]
      }
      this.initLoadNumber = this.curTableData.length
      this.scrollConfig.pos -= data.length
      data && this.nextTableData.unshift(...data)
      this.$nextTick(() => {
        this.scrollConfig.loading = false
      })
      return true
    },
    // 滚动联动的checkedbox
    checkedScroll (data) {
      window.setTimeout(() => {
        let selectedObj = {}
        this.selectData.forEach(item => {
          selectedObj[item.id] = item
        })
        data && data.forEach(item => {
          if (selectedObj[item.id]) {
            let everTable = this.$refs.taskTable.$refs.everTable
            everTable && everTable.toggleRowSelection(item)
          }
        })
      }, 300)
    },
    // 清除checkedbox
    clearSeleted () {
      let everTable = this.$refs.taskTable.$refs.everTable
      everTable && everTable.clearSelection()
      this.selectData = []
    },
    computeScroll () {
      let elBlock = document.querySelector('.scroll-block')
      let elBar = document.querySelector('.scroll-bar')
      let scrollEl = document.querySelector('.advicetable')
      if (!elBar) {
        return
      }
      let barH = elBar.offsetHeight
      let index = this.scrollConfig.pos
      let total = this.tableData.length
      let curNum = this.curTableData.length
      let blockH = barH * barH / (total * 30)
      let tranIndex = -Math.round(this.tranY / scrollEl.offsetHeight * curNum)
      let top = (index + tranIndex) / total * (barH)
      Object.assign(elBlock.style, {
        height: blockH + 'px',
        top: top + 'px'
      })
    },
    scrollToBottom () {
      let scrollElc = document.querySelector('.adviceShowTable')
      let scrollEl = document.querySelector('.advicetable')
      if (this.virtualScroll) {
        this.preTableData = this.tableData.slice(0, this.tableData.length - this.initLoadNumber)
        this.curTableData = this.tableData.slice(this.tableData.length - this.initLoadNumber, this.tableData.length)
        this.nextTableData = []
        this.scrollConfig.pos = this.tableData.length - this.curTableData.length
        this.$nextTick(() => {
          this.tranY = -scrollEl.offsetHeight + scrollElc.offsetHeight
          this.computeScroll()
        })
      } else {
        scrollElc.scrollTop = scrollEl.offsetHeight - scrollElc.offsetHeight
      }
    },
    // 驳回原因处理
    auditOpinionFormat (val) {
      if (val) {
        let obj = JSON.parse(val)
        return Object.values(obj).join('<br>')
      }
      return ''
    }
  },
  components: {
    adviceItemShow, // 内容显示组件
    drugInfo, // 药品说明书显示组件
    serviceSetItems, // 组套明细组件
    contextmenu, // 右键组件
    dragToSelect, // 框选组件
    doctorAdviceName, // 医嘱名称
    reformRecord, // 重整医嘱的显示行组件
  },
  computed: {
    fuziData () {
      let obj = {}
      JSON.parse(this.initData).forEach(item => {
        if (obj[item[this.setMainGroupId]]) {
          obj[item[this.setMainGroupId]].push(item)
        } else {
          obj[item[this.setMainGroupId]] = [item]
        }
      })
      return obj
    },
    checkMergeData () {
      let obj = {}
      if (this.specCheckboxMergeFlag) {
        JSON.parse(this.initData).forEach(item => {
          if (obj[item[this.specCheckboxMergeFlag]]) {
            obj[item[this.specCheckboxMergeFlag]].push(item)
          } else {
            obj[item[this.specCheckboxMergeFlag]] = [item]
          }
        })
      }
      return obj
    },
    sendData () {
      return JSON.parse(this.initData).filter(v => {
        return v.status !== 0
      })
    },
    waitData () {
      return JSON.parse(this.initData).filter(v => {
        return v.status === 0
      })
    },
    adviceStatus () {
      if (this.statusRelation) {
        return this.statusRelation
      } else {
        return this.visitType === 1 ? this.OUTPATIENT_ADVICE_STATUS : this.ADVICE_STATUS
      }
    },
    virtualScroll () {
      if (!this.isVirtualScroll) {
        return false
      }
      if (this.tableData.length < 220) {
        return false
      }
      let scrollElc = document.querySelector('.adviceShowTable')
      let scrollEl = document.querySelector('.advicetable')
      if (scrollElc.offsetHeight > scrollEl.height) {
        return false
      }
      return true
    }
  },
  watch: {
    showData: {
      handler (val) {
        let data = JSON.parse(JSON.stringify(val))
        let serialeData = this.resetData(data)
        if (this.defaultSort) {
          serialeData = this.defaultSort(serialeData)
        }
        this.initData = JSON.stringify(serialeData)
        this.tableData = serialeData
        if (this.sortDir && this.sortProp) {
          this.sortChange({prop: this.sortProp, order: this.sortDir})
        }
        if (this.virtualScroll) {
          this.virtualScrollMode(true)
        }
      },
      deep: true,
      immediate: true
    },
    'specRowClass': {
      handler (val) {
        if (val) {
          this.rowClass = val
        }
      },
      immediate: true,
      deep: true
    },
    'virtualScroll': {
      handler (val, oldVal) {
        this.removeTranScroll()
        this.tranY = 0
        if (val) {
          document.querySelector('.adviceShowTable').scrollTop = 0
          this.virtualScrollMode()
          this.addTranScroll()
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
.adviceShowTable {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .report-icon {
    color: #1e7bf0;
  }
  .advicetable {
    /deep/ .el-table__body-wrapper  {
      overflow: hidden;
    }
    /deep/ .el-table__body-wrapper {
      overflow: hidden;
    }
    /deep/ .el-table {
      tr {
        .noBottomBorder {
          border-bottom: none;
        }
        .pad-rt-30 {
          .cell {
            padding-right: 30px;
          }
        }
        .lineGray {
          text-decoration: line-through;
          color: #ccc;
          .labWrap {
            text-decoration: line-through;
          }
        }
        &:hover {
          td {
            background: transparent;
          }
        }
        .topCell {
          .cell {
            margin-bottom: -4px;
          }
        }
        .middleCell {
          .cell {
            margin-top: -4px;
            margin-bottom: -4px;
          }
        }
        .bottomCell {
          .cell {
            margin-top: -4px;
          }
        }
        .cell {
          .namesWrap {
            display: flex;
            .leftIcons {
              width: 6px;
              margin-right: 8px;
              position: relative;
              .top {
                border-top: 3px solid;
                border-left: 3px solid;
                width: 100%;
                position: absolute;
                top: 8px;
                bottom: 0;
              }
              .middle {
                border-left: 3px solid;
                width: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
              }
              .bottom {
                border-bottom: 3px solid;
                border-left: 3px solid;
                width: 100%;
                height: 10px;
                position: absolute;
                top: 0;
              }
            }
            .cellMain {
              flex: 1;
              .labWrap {
                position: relative;
                margin: 5px 40px 5px 0;
                line-height: 1.5;
                word-wrap: break-word;
                display: inline-block;
                .lab {
                  font-size: 12px;
                  position: absolute;
                  right: -48px;
                  width: 48px;
                  transform: scale(0.9, 0.9);
                }
              }
            }
          }
        }
      }
      .spec-pd {
        .cell {
          padding: 0 7px;
        }
      }
      .waitbg {
        background: #FEF5BE;
        &:hover {
          background: #FEF5BE !important;
        }
      }
      .selectbg {
        background: #D7EBFF !important;
        &:hover {
          background: #D7EBFF !important;
        }
      }
      .iconfont {
        color: #999;
      }
      .icon-charge {
        color: #009944;
      }
      .iconYouji {
        color: #FF4F00;
        position: absolute;
        top: 1px;
        right: 0;
        font-size: 24px;
      }
      .icon-yichang {
        font-size: 14px;
      }
      .fontMargin {
        margin: 0 2px;
        font-size: 16px;
      }
    }
  }
}
.virtual-scroll {
  overflow-y: hidden;
  height: 100%;
  position: relative;
  // transform: translateY(0);
  .scroll-bar {
    width: 9px;
    height: 100%;
    // background-color: red;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
  }
  .scroll-block {
    position: absolute;
    top: 0;
    left: 1px;
    width: 7px;
    height: 10px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.57);
  }
}
</style>
