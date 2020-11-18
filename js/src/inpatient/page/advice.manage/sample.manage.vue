<template>
  <div class="advice_sample">
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="18">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" :is-query="true" @query="queryListbefore">
            <template slot="default">
              <el-button type="primary" size="small" @click="search">查询</el-button>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="6" class="alg_r">
          <el-button size="small" @click="groupMethod" :disabled="isMerge || isMergeing">合并</el-button>
          <el-button size="small" @click="printMethod(false)" :disabled="isPrinting || !selectData.length">批量打印</el-button>
          <el-button size="small" @click="gatherMethod(false)" :disabled="isGathering || !selectData.length">批量采集</el-button>
          <el-button type="primary" size="small" @click="sendMethod(false)" :disabled="isSending || !selectData.length">批量配送</el-button>
        </el-col>
      </el-row>
      <div class="main-wrap">
        <ever-table
          class="showTable"
          ref="showTable"
          :columns="columns"
          :data="showTableData"
          :is-pagination="false"
          :is-drag-table="true"
          :show-checkbox="true"
          :span-method="arraySpanMethod"
          :config-option="configOption"
          :header-cell-class-name="headerCellClassName"
          :cell-class-name="cellClassName"
          :row-class-name="rowClassName"
          :is-record-url-params="false"
          :not-select-checkbox="true"
          :checkbox-width="30"
          @configChange="configChange"
          @selection-change="selectionChange"
          border
        >
          <template slot="serviceType" slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :show-en="true" :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}"></sys-value>
          </template>
          <template slot="doctorAdviceName" slot-scope="scope">
            <!-- 组套 -->
            <template v-if="scope.row.setFlag">
              <service-set-items :item="scope.row"></service-set-items>
            </template>
            <!-- 非药品逻辑 -->
            <template v-else>
              <span class="bold" :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}">{{scope.row.doctorAdviceName || scope.row.serviceName}}</span>
            </template>
            <!-- 甲乙丙类标识 -->
            <i class="iconfont icon-charge"
              :class="{'icon-jia': String(scope.row.chargeLevel) === '1',
              'icon-CombinedShape': String(scope.row.chargeLevel) === '2',
              'icon-bing': String(scope.row.chargeLevel) === '3',
              'icon-menzhen-lixiu': String(scope.row.chargeLevel) === '4'}"></i>
          </template>
        </ever-table>
        <!-- 右键操作按钮列表 -->
        <contextmenu :class-name="rowClass" :menu="contextList" @menu="getMenuList" @select="contextSelect"></contextmenu>
      </div>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
      <!-- 患者列表监听 -->
      <inpatient-refresh
        ref="inpatientRefresh"
        :query="this.$route.query"
        :checks="['bedId', 'areaId', 'providerId']"
        @refresh="refresh"
      ></inpatient-refresh>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import api from '@/inpatient/store/advice/sample'
import contextmenu from '@/workspace/components/contextmenu'
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import { HOSPITAL_SAMPLE } from '@/util/table-config'
import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    hospitalizedNumberList: {
      type: Array,
      default: () => { return [] }
    },
    clearInfo: Function
  },
  data () {
    let querySchema = [
      {
        name: 'specimenTypeList',
        label: '',
        comp: 'sys-type',
        props: {
          code: 'THC_SOB_SPECIMEN_TYPE',
          placeholder: '标本类型',
          clearable: true,
          multiple: true,
          collapsetags: true
        }
      },
      {
        name: 'specimenStatusList',
        label: '',
        comp: 'sys-select',
        props: {
          options: [],
          placeholder: '标本状态',
          field: {
            multiple: true,
            collapsetags: true
          }
        }
      },
      {
        name: 'startTime',
        label: '开始时间',
        comp: 'el-date-picker',
        props: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          placeholder: ''
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.specimenTypeList = []
    queryObj.specimenStatusList = []
    queryObj.startTime = []
    if (this.baseInfo) {
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
    }
    return {
      storage,
      api,
      querySchema,
      queryObj,
      tableData: [],
      selectData: [],
      selectIds: [],
      configData: [],
      isMergeing: false,
      isPrinting: false,
      isGathering: false,
      isSending: false,
      columns: [
        {
          prop: 'patientName',
          label: '患者信息',
          showOverflowTooltip: true,
          minWidth: '10%',
          formatter: ({value, row}) => {
            return (row.bedName ? row.bedName + ' ' : '') + value
          }
        },
        {
          prop: 'specimenTypeName',
          label: '标本类型',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '项目名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          prop: 'startTime',
          label: '开始时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'executeProviderName',
          label: '执行科室',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'barCode',
          label: '条码号',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'specimenStatus',
          label: '标本状态',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            return this.specimenStatusList[value] || ''
          }
        },
        {
          prop: 'printTime',
          label: '打印时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'printName',
          label: '打印人',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'collectTime',
          label: '采集时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'collectName',
          label: '采集人',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'deliveryTime',
          label: '配送时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'deliveryName',
          label: '配送人',
          showOverflowTooltip: true,
          minWidth: '8%'
        }
      ],
      configOption: {id: HOSPITAL_SAMPLE},
      rowClass: 'sampleContextRow',
      arraySpan: ['patientName', 'specimenTypeName', 'barCode', 'specimenStatus', 'printTime', 'printName', 'collectTime', 'collectName', 'deliveryTime', 'deliveryName'],
      noBorderSpan: ['doctorAdviceName', 'startTime', 'executeProviderName'],
      contextList: [
        { id: '1', name: '打印标签', disabled: false, methodName: 'printMethod' },
        { id: '2', name: '取消打印', disabled: false, methodName: 'cancelPrint' },
        { id: '3', name: '采集', disabled: false, methodName: 'gatherMethod' },
        { id: '4', name: '取消采集', disabled: false, methodName: 'cancelGather' },
        { id: '5', name: '配送', disabled: false, methodName: 'sendMethod' },
        { id: '6', name: '取消配送', disabled: false, methodName: 'cancelSend' },
        { id: '7', name: '解除合并', disabled: false, methodName: 'cancelGroup' },
      ],
      specimenStatusList: {
        '1': '未打印',
        '2': '已打印',
        '3': '已采集',
        '4': '已配送',
        '5': '已作废'
      },
      totalCount: 0,
      pageSizes: [10, 20, 30, 50, 100],
      pagesize: 20,
      current: 1,
    }
  },
  components: {
    contextmenu,      // 右键组件
    serviceSetItems,  // 组套显示组件
    inpatientRefresh // 患者列表监听
  },
  created () {
  },
  mounted () {
    this.getOptions()
  },
  methods: {
    queryListbefore () {
      this.reset()
      this.queryList()
    },
    reset () {
      this.current = 1
    },
    handleCurrentChange (val) {
      this.current = val
      this.queryList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.queryList()
    },
    // 合并单元格处理
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let list1 = [0]
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (this.arraySpan.includes(item.prop)) {
            list1.push(index + 1)
          }
        })
      }
      if (list1.includes(columnIndex)) {
        // 合管医嘱合并单元格
        if (!this.mergeGroupData[row.mergeGroupId].findIndex(val => { return val.id === row.id })) {
          let m1 = this.mergeGroupData[row.mergeGroupId] && this.mergeGroupData[row.mergeGroupId].length || 0
          return {rowspan: m1, colspan: 1}
        } else if (this.mergeGroupData[row.mergeGroupId].findIndex(val => { return val.id === row.id })) {
          return {rowspan: 0, colspan: 0}
        }
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
      if (Number(columnIndex) === 0) {
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
      if (Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      if (configIndex.includes(column.columnKey)) {
        if (Number(row.mergeFlag) && this.mergeGroupData[row.mergeGroupId] && this.mergeGroupData[row.mergeGroupId].length) {
          if (this.mergeGroupData[row.mergeGroupId].length > this.mergeGroupData[row.mergeGroupId].findIndex(item => { return item.id === row.id }) + 1) {
            className.push('noBottomBorder')
          }
        }
      }
      return className.join(' ')
    },
    // 给row设置类名
    rowClassName ({ row, rowIndex }) {
      return this.rowClass
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    // 获取标本状态options
    getOptions () {
      let statusList = []
      Object.keys(this.specimenStatusList).forEach(v => {
        statusList.push({id: v, name: this.specimenStatusList[v]})
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'specimenStatusList').props.options = statusList
    },
    // 查询列表
    queryList () {
      let queryObj = JSON.parse(JSON.stringify(this.queryObj))
      if (queryObj.startTime && queryObj.startTime.length) {
        queryObj.startTimeFrom = queryObj.startTime[0]
        queryObj.startTimeEnd = queryObj.startTime[1]
      } else {
        delete queryObj.startTimeFrom
        delete queryObj.startTimeEnd
      }
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      queryObj.page = this.current
      queryObj.pagesize = this.pagesize
      queryObj.offset = (this.current - 1) * this.pagesize
      if (!queryObj.hospitalizedNumber) {
        queryObj.hospitalizedNumberList = this.hospitalizedNumberList
      } else if (queryObj.hospitalizedNumberList) {
        delete queryObj.hospitalizedNumberList
      }
      if (queryObj.hospitalizedNumber || queryObj.hospitalizedNumberList.length) {
        this.queryEvent(queryObj)
      }
    },
    async queryEvent (queryObj) {
      let res = await api.list(queryObj)
      if (res && res.list && res.list.length) {
        this.tableData = res.list
        this.totalCount = res.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
      }
    },
    // table checkbox 回调事件
    selectionChange (selection) {
      this.selectIds = []
      this.selectData = []
      if (selection && selection.length) {
        selection.map(item => {
          if (!this.mergeGroupData[item.mergeGroupId].findIndex(val => { return item.id === val.id })) {
            this.selectData = this.selectData.concat(this.mergeGroupData[item.mergeGroupId])
          }
        })
      }
      this.selectData.forEach(val => {
        this.selectIds.push(val.id)
      })
    },
    // 右键操作按钮列表触发事件回调
    getMenuList (index) {
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.mergeGroupData[this.showTableData[index].mergeGroupId], index, v.id)
      })
    },
    // 操作按钮显示判断逻辑
    getStatusShow (data, index, id) {
      if (id === '1') {   // 打印标签
        let n1 = 0
        // 未打印，已打印，可打印标签
        data.forEach(v => {
          if (['1', '2'].includes(String(v.specimenStatus))) n1++
        })
        return data.length === n1
      } else if (id === '2') {   // 取消打印
        let n2 = 0
        // 已打印，可取消打印
        data.forEach(v => {
          if (String(v.specimenStatus) === '2') n2++
        })
        return data.length === n2
      } else if (id === '3') {   // 采集
        let n3 = 0
        // 已打印，可采集
        data.forEach(v => {
          if (String(v.specimenStatus) === '2') n3++
        })
        return data.length === n3
      } else if (id === '4') {    // 取消采集
        let n4 = 0
        // 已采集，可取消采集
        data.forEach(v => {
          if (String(v.specimenStatus) === '3') n4++
        })
        return data.length === n4
      } else if (id === '5') {   // 配送
        let n5 = 0
        // 已采集，可配送
        data.forEach(v => {
          if (String(v.specimenStatus) === '3') n5++
        })
        return data.length === n5
      } else if (id === '6') {    // 取消配送
        let n6 = 0
        // 已配送，可取消配送
        data.forEach(v => {
          if (String(v.specimenStatus) === '4') n6++
        })
        return data.length === n6
      } else if (id === '7') {   // 解除合并
        let n7 = 0
        // 已合并且未打印，可解除合并
        data.forEach(v => {
          if (String(v.specimenStatus) === '1' && v.mergeFlag) n7++
        })
        return data.length === n7
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      this[item.methodName](this.showTableData[index], index)
    },
    // 标签打印/批量打印
    async printMethod (item, index) {
      let ids = []
      let printData = []
      if (!item) {
        if (!this.selectIds || !this.selectIds.length) {
          return this.$messageTips(this, 'warning', '请选择要操作的医嘱', '提示')
        }
        let flag = 0
        this.selectData.forEach(val => {
          if (['1', '2'].includes(String(val.specimenStatus))) flag++
          if (String(val.specimenStatus) === '1') {
            ids.push(val.id)
          }
        })
        if (flag !== this.selectData.length) {
          return this.$messageTips(this, 'warning', '只有未打印/已打印的检验项可以打印标签，请重新选择', '提示')
        }
        this.isPrinting = true
        printData = this.selectData
      } else {
        if (String(item.specimenStatus) === '1') {
          this.mergeGroupData[item.mergeGroupId].forEach(v => {
            ids.push(v.id)
          })
        }
        printData = this.mergeGroupData[item.mergeGroupId]
      }
      if (ids && ids.length) {
        let postdata = {
          ids: ids
        }
        const res = await api.printBarCode(postdata)
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '打印成功', '提示')
          this.queryList()
          this.isPrinting = false
        } else {
          this.isPrinting = false
        }
      }
      this.isPrinting = false
      this.printBarcode(printData)
    },
    // 标签打印，打印事件
    printBarcode (data) {
      let printDataObj = {}
      let printData = []
      data.forEach(item => {
        if (!printDataObj[item.mergeGroupId]) {
          printDataObj[item.mergeGroupId] = {ids: [item.id], doctorIds: [item.doctorId]}
        } else {
          printDataObj[item.mergeGroupId].ids.push(item.id)
          if (!printDataObj[item.mergeGroupId].doctorIds.includes(item.doctorId)) {
            printDataObj[item.mergeGroupId].doctorIds.push(item.doctorId)
          }
        }
      })
      Object.keys(printDataObj).forEach(v => {
        printData.push({
          code: 'ZY_CPOE_JIAN_YAN_TIAO_MA',
          params: {
            executeIdList: printDataObj[v].ids,
            patientId: data[0].patientId,
            idList: printDataObj[v].doctorIds
          }
        })
      })
      mutiplePrint(printData)
    },
    // 取消打印
    async cancelPrint (item, index) {
      let postdata = {
        ids: []
      }
      this.mergeGroupData[item.mergeGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.cancelPrint(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '取消打印成功', '提示')
        this.queryList()
      }
    },
    // 采集/批量采集
    async gatherMethod (item, index) {
      let ids = []
      if (!item) {
        if (!this.selectIds || !this.selectIds.length) {
          return this.$messageTips(this, 'warning', '请选择要操作的医嘱', '提示')
        }
        let flag = 0
        this.selectData.forEach(val => {
          if (String(val.specimenStatus) === '2') flag++
        })
        if (flag !== this.selectData.length) {
          return this.$messageTips(this, 'warning', '只有已打印的检验项可以采集，请重新选择', '提示')
        }
        this.isGathering = true
        ids = this.selectIds
      } else {
        this.mergeGroupData[item.mergeGroupId].forEach(v => {
          ids.push(v.id)
        })
      }
      let postdata = {
        ids: ids
      }
      const res = await api.collectSpeciment(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '采集成功', '提示')
        this.queryList()
        this.isGathering = false
      } else {
        this.isGathering = false
      }
    },
    // 取消采集
    async cancelGather (item, index) {
      let postdata = {
        ids: []
      }
      this.mergeGroupData[item.mergeGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.cancelCollectSpeciment(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '取消采集成功', '提示')
        this.queryList()
      }
    },
    // 配送/批量配送
    async sendMethod (item, index) {
      let ids = []
      if (!item) {
        if (!this.selectIds || !this.selectIds.length) {
          return this.$messageTips(this, 'warning', '请选择要操作的医嘱', '提示')
        }
        let flag = 0
        this.selectData.forEach(val => {
          if (String(val.specimenStatus) === '3') flag++
        })
        if (flag !== this.selectData.length) {
          return this.$messageTips(this, 'warning', '只有已采集的检验项可以配送，请重新选择', '提示')
        }
        this.isSending = true
        ids = this.selectIds
      } else {
        this.mergeGroupData[item.mergeGroupId].forEach(v => {
          ids.push(v.id)
        })
      }
      let postdata = {
        ids: ids
      }
      const res = await api.sendSpeciment(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '配送成功', '提示')
        this.queryList()
        this.isSending = false
      } else {
        this.isSending = false
      }
    },
    // 取消配送
    async cancelSend (item, index) {
      let postdata = {
        ids: []
      }
      this.mergeGroupData[item.mergeGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.cancelSendSpeciment(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '取消配送成功', '提示')
        this.queryList()
      }
    },
    // 合并
    async groupMethod () {
      this.isMergeing = true
      let postdata = {
        ids: this.selectIds
      }
      const res = await api.mergeSpeciment(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '合并成功', '提示')
        this.queryList()
        this.isMergeing = false
      } else {
        this.isMergeing = false
      }
    },
    // 取消合并
    async cancelGroup (item, index) {
      let postdata = {
        ids: []
      }
      this.mergeGroupData[item.mergeGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.cancelMerge(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '取消合并成功', '提示')
        this.queryList()
      }
    },
    // 查询
    search () {
      this.queryList()
    },
    // 患者状态发生变化
    refresh (key, patient, list) {
      if (key === 'storage') {
        this.$router.push({query: {
          areaId: storage.getLocalStorage('inpatientKey').split(',')[0]
        }})
        this.queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
        this.clearInfo && this.clearInfo()
        return
      }
      if (!patient && this.inpatientNumber !== list.length) {
        this.$router.push({query: {
          areaId: this.$route.query.areaId
        }})
        this.clearInfo && this.clearInfo()
        this.inpatientNumber = list.length
        this.queryList()
        return
      }
      this.inpatientNumber = list.length
    }
  },
  computed: {
    showTableData () {
      let data = []
      this.tableData.filter(item => {
        if (item.mergeGroupId) {
          data.push(Object.assign({}, item, item.adviceJson))
        }
      })
      return data
    },
    mergeGroupData () {
      let obj = {}
      this.showTableData.forEach(v => {
        if (obj[v.mergeGroupId]) {
          obj[v.mergeGroupId].push(v)
        } else {
          obj[v.mergeGroupId] = [v]
        }
      })
      return obj
    },
    // 是否可以合并，同一患者，标本类型相同，未打印，才可以合并
    isMerge () {
      let n = 0
      this.selectData.forEach((item, index) => {
        if (index && !item.mergeFlag) {
          if (item.patientId === this.selectData[0].patientId && item.specimenType === this.selectData[0].specimenType && String(item.specimenStatus) === String(this.selectData[0].specimenStatus) && String(item.specimenStatus) === '1') {
            n++
          }
        }
      })
      return this.selectData.length !== n + 1 || !n
    }
  },
  watch: {
    'baseInfo': {
      handler (val) {
        this.reset()
        this.queryList()
      },
      deep: true
    },
    'hospitalizedNumberList': {
      handler (val) {
        this.reset()
        this.queryList()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.advice_sample {
  height: 100%;
  .layout_inner {
    padding: 0 0 0 10px;
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-head {
      margin-top: 12px;
      /deep/.el-form {
        .el-radio-group {
          .el-radio {
            margin-right: 20px;
          }
        }
        .el-form-item {
          margin: 0 10px 2px 0;
        }
      }
      .alg_r {
        line-height: 30px;
      }
    }
    .main-wrap {
      overflow: auto;
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
          &:hover {
            td {
              background: transparent;
            }
          }
          .icon-charge {
            color: #009944;
          }
        }
        .spec-pd {
          .cell {
            padding: 0 7px;
          }
        }
      }
    }
  }
}
</style>
