<template>
  <div>
    <div>
      <!-- 邮寄地址 任务列表页 -->
      <div v-if="showMailInfomation" :class="{pl100: pageType === 4}">
        <new-address
          ref="address"
          :isInvented="isInvented"
          :is-show="pageType == 5"
          :visitSn="metaData.visitSn"
          :sourceId="metaData.taskId"
          :patientId="metaData.patientId">
        </new-address>
      </div>
      <!-- 机构名称 整方（处方维度）并且不是审核页面展示 -->
      <h4 v-if="pageType != 1" class="d_t alg_l">{{metaData.clinicName}}{{metaData.actualStorageRoomName ? ' - ' + metaData.actualStorageRoomName : metaData.actualStorageRoomId ? ' - 已经指定库房，但未查询到库房名称' : ''}}<span v-if="metaData.isOwnerOrg">（本机构）</span></h4>
      <div class="prescription f14 mb5">
        <!-- 编辑处方 (收方发药和任务列表可操作) -->
        <!-- <span v-if="[2,3,5].includes(pageType) && !isColoumn" class="blue cur inline-block mr20 wh20"  :class="{cGray6: true}"><i v-if="canEditIt" @click="editPrescriptionHandler" class="iconfont icon-xiugai"></i></span> -->
        <!-- 处方已邮寄标识 -->
        <!-- <span v-if="pageType !== 1 && metaData.delivery == 1 && !canEditIt && isChineseMedicine" class="mr20 wh20 inline-block">
          <post-popover v-if="metaData.mailFlag" :row="metaData" class="font-size-custom"></post-popover>
        </span> -->
        <!-- 只有审核页才展示处方单信息 -->
        <template v-if="pageType == 1">
        <!-- 处方审核状态 -->
          <span class="inline-block mr20 statusStyle f_bold" :class="['color' + type]">{{type | formateValueToFnt({list: AUDIT_STATUS, defaultFnt: '暂无'})}}</span>
          <!-- 处方信息 -->
          <ul class="inline-block information">
            <!-- 补费单据没有执行单号 -->
            <li v-if="metaData.orderCode"><label>{{'处方号:'}}</label>{{metaData.orderCode}}</li>
            <!-- <li v-if="metaData.adviceExecuteCode && metaData.scene != 5"><label>执行单号:</label>{{metaData.adviceExecuteCode}}</li> -->
            <li><label>开单时间:</label>{{metaData.createTime | formatDateByExp}}</li>
            <li><label>医生:</label>{{metaData.doctorName}}<span v-if="metaData.providerName">（{{metaData.providerName}}）</span></li>
            <li v-if="metaData.diagnosis"><label>诊断信息:</label>
              <span v-html="getDiagnosis" v-if="metaData.diagnosis"></span>
            </li>
            <li v-if="metaData.executeProviderName"><label>执行科室:</label>
              <span>{{metaData.executeProviderName}}</span>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <div :class="{df: ![1, 4].includes(pageType)}" style="display: block">
      <div :class="{flex1: ![1, 4].includes(pageType)}">
        <!-- 审核页面才展示该中药模板 -->
        <template v-if="isChineseMedicine && pageType == 1">
          <chinese-medicine
            class="backgroud"
            :page-type="pageType"
            :not-current-mark="notCurrentMark"
            :metaData="metaData"
            :table-data="tableData"
            @delete-reject="abnormallyDeleteHandler"
            ></chinese-medicine>
        </template>
        <!-- 西药 -->
        <template v-else>
          <!-- 新增补打操作列 [4, 5].includes(pageType) 发药记录 和 任务列表页 需要做表格合并 -->
          <ever-table
            ref="table"
            border
            class="design_table"
            table-class="no-margin-table small-padding"
            :key="metaData.orderCode"
            :table-default-cell-value="tableDefaultCellValue"
            :columns="tableColumns"
            :data="tableData"
            :span-method="updateCondition ? objectSpanMethod : () => {}"
            @get-config-table-columns="getConfigTableColumns"
            @save-config="saveConfig"
            :checkbox-width="checkboxWidth"
            :is-drag-table="true"
            :is-record-url-params="false"
            :not-select-checkbox="true"
            :selectable="selectable"
            :show-checkbox="showCheckbox"
            @selection-change="handleSelectionChange"
            :config-option="isBatch ? configOption : {}"
            @eventChange="eventChange">
            <template v-for="(column, index) in renderColumns" :slot="column.slotName">
              <el-table-column
                :key="column.prop"
                :slot="column.prop"
                :label="column.label"
                :width="column.width"
                :prop="column.prop">
                <template slot="header" slot-scope="scope">
                  <!-- 只用于去除编辑器经警告操作 -->
                  <template v-if="false">{{scope}}</template>
                  {{column.label}}
                  <span
                    v-if="configOption && configOption.id && index === renderColumns.length - 1 && isBatch && !['1'].includes(`${pageType}`)"
                    @click="openConfigDialog"
                    class="icon iconfont icon-biaoge-shezhi ever-table-config">
                  </span>
                </template>
                <template slot-scope="scope">
                  <coltd-functional
                    :row="scope.row"
                    :index="scope.$index"
                    :page-type="pageType"
                    :render="column.render"
                    :config-columns="configColumns"
                    :is-hidden-table-batch-col="isHiddenTableBatchCol"
                    :td-key="column.prop">
                  </coltd-functional>
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </template>

      </div>
    </div>
    <!-- 所有操作按钮区域 -->
    <!-- 是否是审核 => 审核页面才需要 -->
    <action-buttons
      @operator-func="operatorBtnFunc"
      :type="type"
      :page-type="pageType"
      :operate-mode="operateMode"
      :selection-table="recordSelected"
      :delivery="metaData.delivery"
      :meta-data-list="metaDataList"
      :metaData="auditData"
      :has-reject="hasReject"
      :is-invented="isInvented"
      v-if="showBtns && type == 1">
    </action-buttons>
    <el-dialog
      v-if="dialogVisible"
      class="ui_dialog_02 dialogVisible"
      :visible.sync="dialogVisible"
      :key="parentIndex"
      :class="{spe: !isAbnormal}"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false">
      <!-- 弹框内具体内容 -->
      <modify-infomation
        @single-abnormal-data="singleAbnormalDataHandler"
        @full-abnormal-add-data="fullAbnormalAddDataHandler"
        @delete-abnormally="onAbnormallyDeleteHandler"
        :obj.sync="obj"
        :page-type="pageType"
        :storage-room-list="storageRoomList"
        :identification="identification"
        :parent-index="parentIndex"
        :table-data="visibleTableData"
        :is-abnormal.sync='isAbnormal'
        :is-chinese-medicine="isChineseMedicine"
        :is-layout="isChineseMedicine || pageType == 1"
        :columns="littleShowColumns"></modify-infomation>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogHandler">取 消</el-button>
        <el-button type="primary" @click="saveFullSubmitHandler">全部完成</el-button>
      </span>
    </el-dialog>

    <!-- 无法到货弹框 -->
    <unreachable
      v-if="unReachableBoolean"
      :visible.sync="unReachableBoolean"
      :row="unReachableRow">
    </unreachable>
  </div>
</template>

<script>

import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import ModifyInfomation from '@/warehouse/views/drug/component/modify.infomation.multi.vue'
import ActionButtons from '@/warehouse/views/drug/component/action.buttons.multi.vue'
import ChineseMedicine from '@/warehouse/views/drug/component/chinese.medicine.vue'
import newAddress from '@/warehouse/views/drug/component/addressdialog.vue' // 收件地址
import {
  AUDIT_STATUS,
  tableDefaultCellValue,
  CHINESE_MEDICINE_TYPE
} from '@/warehouse/views/util/constant'
import {
  statusHtml
} from '@/warehouse/views/util/html'
import { cloneDeep, isEqual, get } from 'lodash'
import { debounce } from '@/util/common'
import { createdConfigColumns, chineseSchema } from '../columnpool/dispensing.js'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import SpanMethodMixin from '@/warehouse/views/drug/mixin/span.method.mixin.js'
import PostPopover from '@/warehouse/views/drug/rendercomp/postrender.js'
import StorageRoomList from '@/warehouse/views/drug/mixin/stroageroomlist'
import Unreachable from './unreachable'
import storage from '@/util/storage'
export default {
  name: 'MdicineLIstMuiti',
  props: {
    notCurrentMark: Boolean, // 中药删除是否可以驳回
    auditData: { // 待审核数据
      type: [Array, Object],
      default: () => []
    },
    // storageRoomList: { // 所有机构库房数据
    //   type: Array,
    //   default: () => []
    // },
    showCheckbox: {
      type: Boolean,
      default: this.operateMode === 1
    },
    parentIndex: { // 表格 列表index(当前数据的父数据下标)
      type: Number,
      default: 0
    },
    parentKey: { // 表格 列表index(当前数据的父数据下标)
      type: String,
      default: '0'
    },
    isColoumn: { // 不展示表格左侧checkbox占位宽度部分内容
      type: Boolean
    },
    selectable: { // Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
      type: Function,
      default: () => true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    metaDataList: { // 一种发货方式的全部数据
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
    type: { // 审核状态 0：待审、1：驳回、2：已审核
      type: Number
    },
    pageType: { // 页面：1、任务审核  2、收方发药  3、缺货任务  4、发药记录 5、任务列表
      type: Number,
      required: true,
      default: 1
    },
    hasReject: Boolean, // 是否有驳回数据
    operateMode: Number, // 操作模式：1、 按处方明细处理  2、按处方批量处理
    columns: {
      type: Array,
      required: true
    }
  },
  mixins: [getStorage, SpanMethodMixin, StorageRoomList, storage],
  created () {
    this.identification = this.operateMode === 2 ? this.metaData.identification : 0 // 处方整单时，异常标识取metaData   明细时， 取具体某条明细
  },
  computed: {
    updateCondition () {
      let condition = null
      if (this.isBatch) {
        condition = this.pageType !== 1 && !this.isChineseMedicine
      } else {
        // 统一模式下 无父子医嘱不需要合并表格
        condition = [4, 5].includes(this.pageType) && this.mailGroupIds.size > 0
      }
      return condition
    },
    scene () { // 处方来源 4：补费
      if (this.tableData.length) return this.tableData[0].scene
    },
    // 处理诊断信息
    getDiagnosis () {
      let arr = []
      let diagnosisArray = JSON.parse(this.metaData.diagnosis)
      diagnosisArray.length && diagnosisArray.forEach((item, index) => {
        arr.push(`${index > 0 ? '/' : ''}${item.diseaseName}`)
      })
      return arr.join('')
    },
    // 打印配置 检测打印配置项（是否打印）
    // 获取打印配置
    hasSettingReprint () {
      return get(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject.isPrint', 0)
    },
    oriMetaData () {
      return this.metaData.taskType ? this.metaData : Object.assign(this.metaData, this.metaData)
    },
    taskType () {
      return this.oriMetaData.taskType ? this.oriMetaData.taskType : this.oriMetaData.taskDtoList[0].taskType
    },
    isChineseMedicine () { // 是否是中药类型
      return CHINESE_MEDICINE_TYPE.includes(this.taskType)
    },
    auditLength () { // 待审核状态数据数量
      return this.auditData.length - 1
    },
    showMailInfomation () {
      // 是否显示邮寄标识
      const { delivery, scene, addressId } = this.metaData
      // 非审核页面 并且 发货方式为邮寄
      return this.pageType !== 1 && delivery === 1 && (
        (scene !== 5 && !this.parentIndex) ||
        (scene === 5 && (!this.parentIndex || (this.parentIndex && addressId !== this.metaDataList[this.parentIndex - 1].addressId))))
    },
    canEditIt () {
      // 发货方式delivery、邮寄标记mailFlag、状态status、异常标记:identification、缺货标记:shortage
      const { delivery, mailFlag, status } = this.metaData
      // 条件一: 自取\邮寄、待出库、已完成可操作
      // 条件二: 邮寄、已邮寄 或者状态不为待出库、已完成不可操作
      if (
        (delivery === 0 &&
          ![2, 3].includes(status) &&
          [0, 1].includes(delivery)
        ) ||
        (delivery === 1 && (mailFlag || ![2, 3].includes(status)))
      ) return false
      return true
    },
    showBtns () {
      // isOwnerOrg:本机构  actualStorageRoomId: 库房  delivery:发货方式 status:状态  mailFlag:邮寄  examineFlag:审核  theLast:同一状态最后一条   identification:是否异常   shortage:缺货
      const { delivery, status, mailFlag, theLast, identification } = this.metaData
      const shortage = this.hasShortage(this.metaData.taskDtoList)
      // 非异常<`0`> 非缺货 <!23>
      // 条件一:明细、本机构、本库房、 发货方式为自取或邮寄
      // 条件二:处方、本机构、本库房、 发货方式为自取或邮寄、待发药 | 待邮寄、同一状态最后一条theLast为真<`1`>
      // 条件三:审核、待审核type===0、审核操作按钮放最后一条审核明细后面展示，需要待审核数量和待审核下标一致时展示
      // 条件四:pageType=2 收方发药页面操作时
      // 条件五:pageType!=3 | 4 缺货页面 | 发药记录页面 => 不展示操作按钮
      return (
        (
          this.type === 1 && // 处方审核
          this.pageType === 1 && // 审核页面
          this.parentIndex === this.auditLength
        ) ||
        (
          (
            this.pageType === 5 && // 任务列表界面
            [1, 0].includes(delivery)
          ) &&
          (
            (
              !this.isLayout && // 处方明细
              this.metaDataList[this.parentIndex].taskDtoList.some(task => (
                (
                  task.status === 2 &&
                  delivery === 0
                ) ||
                (
                  delivery === 1 &&
                  !task.mailFlag
                )
              ) &&
                !task.identification &&
                task.shortage !== 23
              ) // 明细中有一条数据为待出库，非异常，非缺货就展示按钮(自取 待出库) 、(邮寄 待邮寄)
            ) ||
            (
              this.isLayout && // 处方整单
              !identification &&
              !shortage &&
              status <= 3 &&
              (
                (status === 2 && delivery === 0) || // 自取 并且 状态为待发药
                (!mailFlag && delivery === 1) // 邮寄 并且 邮寄状态为待邮寄 状态为 待出库或已完成
              ) &&
              theLast
            )
          )
        ) ||
        (
          this.pageType === 2 && // 收方发药界面
          (
            (
              !this.isLayout && // 处方明细
              (
                (
                  delivery === 0 && // 自备，状态为待出库才可操作
                  this.metaData.taskDtoList.some(task => task.status === 2)
                ) ||
                (
                  delivery === 1
                )
              )
            ) ||
            (
              this.isLayout && // 处方整单
              !identification &&
              !shortage && // 非缺货数据
              status <= 3 &&
              (
                (delivery === 0 && status === 2) ||
                (delivery === 1 && !mailFlag)
              ) && // 整单操作下， 整个处方单状态统一为一个值
              theLast // 同一状态下最后一条
            )
          )
        )
      )
    },
    littleShowColumns () {
      return this.columns.filter(column => (column.little &&
        column.little.includes(1))) // little: [1] 1、修改发药方式展示列表字段
    },
    tableColumns () {
      let columns = this.columns.filter(column => {
        // 补打列展示需要根据打印配置项关联hasSettingReprint
        return (column.mark.includes(this.pageType) &&
          (this.isChineseMedicine ? column.chineseMedicine : column.isReprint ? this.hasSettingReprint : column.includ === undefined) &&
          (this.isBatch ? true : !column.isBatch))
      })
      // 中药类型 批次定价数据才需要 给操作列配置提供选项
      if (this.isChineseMedicine && this.isBatch) {
        columns.splice(0, 0, ...chineseSchema)
      }
      if (this.pageType === 1) {
        const index = columns.findIndex(row => row.prop === 'num')
        const tempColumn = columns.splice(index, 1)
        return columns.concat(tempColumn) // 审核页面 把数量放在最后面展示
      }
      return columns
    },
    renderColumns () {
      let list = this.configColumns.length ? this.configColumns : this.columns
      return list.filter(column => column.render && !column.hidden)
    },
    // id 给到人身上 拼接 + 中药和西药 + 当前流程 统一 1 分库房 2
    configOption () {
      return {
        id: this.userId + this.isChineseMedicine + '1' + '_' + this.pageType
      }
    },
    // 批次模式完成的数据中，西药类型表格生产批号是否显示
    isHiddenTableBatchCol () {
      return !!this.configColumns.find(col => col.prop === 'batchNum' && col.hidden)
    },
    // 是否是批次定价 根据列表数据来判断
    isBatch () {
      return this.tableData.some(item => item.sysBatchCode)
    }
  },
  mounted () {
    this.$bus.$on('hospital:notify-confirm-unreachable', (row, cancelAll) => {
      let { id, delivery } = row
      if (cancelAll) id = row.localMaterialId
      this.$emit('operator-func', [id], delivery, 'complete', 4, cancelAll)
    })
  },
  beforeDestroy () {
    this.$bus.$off('hospital:notify-confirm-unreachable')
  },
  data () {
    return {
      recordSelected: { // 记录table数据选中项
        0: [], // 自取
        1: [] // 邮寄
      },
      unReachableBoolean: false, // 无法到货组件显示隐藏字段
      unReachableRow: {}, // 无法到货数据明细
      identification: 0,
      statusHtml,
      CHINESE_MEDICINE_TYPE, // 中药分类  <taskType>
      isAbnormal: false, // 弹出框是否勾选异常（是：不添加spe, 否： 添加spe）
      mailIds: [], // 邮寄的ids
      prevTotal: 0, // 前置父子医嘱总条数
      dialogVisible: false,
      confirmUnReachable: false, // 无法到货弹框
      shortageContain: true, // 无法到货 => 同一物资批量操作
      maildialogVisble: false,
      currentIndex: '', // 当前点击这一个明细的下标数值 => 给按明细操作（编辑）异常使用
      visibleTableData: [], // 弹出框展示表格数据
      AUDIT_STATUS,
      tableDefaultCellValue,
      userId: storage.getStorageByClinic('USERID') || '',
      configColumns: [],
      isUpdate: false, // 异常数据是否更新
      isMany: null, //   true ,父子医嘱或者处方整单操作， false 明细单条操作
      oldObj: null, // 记录编辑弹框数据，用于对比是否有操作
      processConfig: this.$store.state.processConfig.thisStorageroomProcessConfig,
      selectionTable: [], // table明细选中数据
      obj: null, // dialog修改处方发货方式、发货库房、标记异常等数据
      singleAbnormalData: [], // 单条(处方)异常数据
      fullAbnormalAddData: [], // 整单(处方)新增异常数据（add）手动添加
      fullAbnormalDeleteData: [] // 整单(处方)删除异常记录（delete）
    }
  },
  methods: {
    saveConfig () {
      this.$emit('update-all-column')
    },
    getConfigTableColumns (config) {
      if (this.pageType === 1 || !this.isBatch) return
      // 初始化数据 处理 当前配置列的表格是否显示生产批号 不显示则把 数量这一列进行合并
      this.configColumns = createdConfigColumns(config, this.tableColumns)
    },
    openConfigDialog (e) {
      this.$refs.table.openConfigDialog(e)
    },
    hasShortage (list = []) {
      // 方法 => 判断整个处方中是否有缺货数据
      return list.some(task => task.shortage === 23)
    },
    operatorBtnFunc (ids, delivery, type) {
      // 驳回、邮寄
      if (type === 'reject') {
        this.isAbnormal = true
        this.dialogVisible = true
        this.obj = {
          auditReject: 1, // 自定义审核驳回标记，给modify.infomation中使用展示驳回原因使用
          identification: 1
        }
        this.visibleTableData = cloneDeep(this.auditData.map(audit => audit.taskDtoList).flat())
        return
      } else if (type === 'post') {
        // this.$refs.mailDialog.open()
        // this.mailIds = ids
        return
      }
      this.$emit('operator-func', ids, delivery, type)
    },
    handleSelectionChange (selection) { // 表格数据选中项
      // this.selectionTable = selection
      if (selection.length) {
        const { delivery } = selection[0]
        this.recordSelected[delivery] = selection
      }
      this.$emit('selection-change', selection)
    },
    editPrescriptionHandler () {
      this.isUpdate = false
      this.isMany = true // 处方整单操作
      this.fullAbnormalAddData = []
      // 处方维度编辑
      this.isAbnormal = false // 重置dialog状态
      this.dialogVisible = true
      const { delivery, actualStorageRoomId, identification = 0 } = this.metaData
      this.obj = {
        delivery: delivery + '',
        actualStorageRoomId: actualStorageRoomId || this.processConfig.storageRoomId, // 没有指定库房时，默认为当前库房
        identification
      }
      this.identification = identification // 异常标识取 明细时， 取具体某条明细
      this.oldObj = Object.assign({}, this.obj, { actualStorageRoomId }) //  需要把obj当前库房重置，以确保提交保存时，新 旧 obj不一致
      this.visibleTableData = cloneDeep(this.tableData)
    },
    async edit (row) {
      this.isUpdate = false
      // 明细维度编辑
      const { delivery, actualStorageRoomId, identification, taskType, status, mainFlag } = row
      // 自取 状态为待发药
      // 邮寄 邮寄标识为待邮寄
      if (
        (delivery === 0 && status === 2) ||
        (delivery === 1 && !mainFlag)
      ) {
        await this.getAllStorageRoomAndClinic({
          materialTypeList: [taskType]
        })
      }
      // 需要获取当前明细下标
      this.currentIndex = this.tableData.findIndex(item => item.taskItemId === row.taskItemId)
      this.obj = {
        delivery: delivery + '', // 为了回显发货方式，数字零会被强制转换为false: Maybe Element UI Bug
        actualStorageRoomId: actualStorageRoomId || this.processConfig.storageRoomId, // 没有指定库房时，默认为当前库房
        identification
      }
      let adivceList = [] // 父子医嘱明细
      const len = this.metaDataList.length
      for (let i = 0; i < len; i++) {
        const list = this.metaDataList[i].taskDtoList
        const hasAdivce = list.find(task => task.taskItemId === row.taskItemId)
        if (hasAdivce) {
          const { mainGroupId } = row
          const compose = mainGroupId + row.createTime
          adivceList = list.filter(task => task.mainGroupId + task.createTime === compose && task.mainFlag > 0)
          // 批次定价多批次需要过滤掉同一物资别的批次
          if (this.isBatch) {
            let findArr = []
            adivceList.forEach(item => {
              if (!findArr.some(child => child.localMaterialId === item.localMaterialId)) {
                findArr.push(item)
              }
            })
            adivceList = findArr
          }
          break
        }
      }
      this.visibleTableData = adivceList.length ? cloneDeep(adivceList) : [row]
      // 父子医嘱清空不同的数据容器 = 初始化数据
      if (this.visibleTableData.length === 1) {
        this.isMany = false // 明细 一个个任务task操作
      } else {
        this.isMany = true // 父子医嘱多条操作
      }
      this.singleAbnormalData = []
      this.fullAbnormalAddData = []
      this.isAbnormal = !!identification // 重置dialog状态
      if (this.isChineseMedicine) {
        this.isAbnormal = true
        this.isMany = true // 处方整单操作
      }
      this.dialogVisible = true
      this.oldObj = Object.assign({}, this.obj, { actualStorageRoomId }) //  需要把obj当前库房重置，以确保提交保存时，新 旧 obj不一致
    },
    confirmUnReachableHandler () {
      // TODO: 本期不做 2019-08-30
    },
    unReachableHandler (row) {
      // this.unReachableRow = row
      // this.unReachableBoolean = true
      // 无法到货 status = 4
      this.$confirm('请确认该药品已无法到货，需要医生做后续处理？', '缺货处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { taskId, delivery } = row
        this.$emit('operator-func', [taskId], delivery, 'complete', 4)
      }).catch(() => { })
    },
    singleAbnormalDataHandler (select, input) {
      // 单条处方明细异常数据
      this.isUpdate = true
      this.singleAbnormalData = select.concat([input])
    },
    fullAbnormalAddDataHandler (list) {
      // 整单处方异常数据(手动选择添加 和 输入)
      this.isUpdate = true
      this.fullAbnormalAddData = list
    },
    checkChange (v) {
      // console.log(v, 'checkChange')
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    closeDialogHandler () {
      // 清空  已选择删除异常数据（手动删除集合）
      this.fullAbnormalDeleteData = []
      this.dialogVisible = false
    },
    /**
     * saveFullSubmitHandler 提交编辑框内容
     * this.obj: 编辑框对象（包含发货方式、发货库房和标记异常）
     * this.singleAbnormalData: 处方明细模式操作下 ‘选择’ 的异常信息
     * this.fullAbnormalAddData: 处方整单模式下 ‘选择’ 的异常信息
     * this.fullAbnormalDeleteData: 处方整单模式下 ‘删除’ 的异常信息
     * this.parentIndex: 父下标（当前方式（自取、邮寄、自备）处方下标）
     * this.metaData: 当前方式（自取、邮寄、自备）下所有的数据
     * this.currentIndex: 处方明细模式下 操作的具体那条数据下标
     * isMany :  true ,父子医嘱或者处方整单操作， false 明细单条操作
     */
    saveFullSubmitHandler: debounce(function () {
      if (isEqual(this.oldObj, this.obj) && !this.fullAbnormalDeleteData.length && !this.singleAbnormalData.length && !this.fullAbnormalAddData.length) {
        return this.$messageTips(this, 'warning', '您没有任何修改')
      }
      if (this.obj.identification && (!this.isUpdate && (!this.isMany && !this.singleAbnormalData.length) || (this.isMany && !this.fullAbnormalAddData.length && !this.fullAbnormalDeleteData.length))) {
        return this.$confirm(`${this.obj.auditReject ? '您未填写驳回原因' : '您勾选了标记异常， 但是没有填写异常原因'}，是否确定继续操作？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = false
        }).catch(() => { })
      }
      if (this.obj.auditReject && !this.fullAbnormalAddData.length && !this.fullAbnormalDeleteData.length) return this.$messageTips(this, 'warning', '请选择驳回原因')
      let params = {}
      if (this.oldObj) {
        for (let key in this.obj) {
          if (this.obj[key] !== this.oldObj[key]) params[key] = this.obj[key]
        }
      }
      this.$emit('save-after', params, this.singleAbnormalData, this.fullAbnormalAddData,
        this.fullAbnormalDeleteData, this.parentIndex, this.metaData, this.currentIndex, this.isMany)
      this.dialogVisible = false
      // 清空  已选择删除异常数据（手动删除集合）
      this.fullAbnormalDeleteData = []
    }),
    onAbnormallyDeleteHandler (row, parentIndex, index) {
      // parentIndex 父级表格index
      // index 当前表格index
      // 编辑弹框删除异常数据
      this.fullAbnormalDeleteData.push(row)
    },
    abnormallyDeleteHandler (row, index, type) {
      // type: 1、驳回  0、异常
      // 删除异常
      // index: tabledata 明细下标
      // this.index: tabledata 下标
      this.$emit('delete-abnormally', row, this.parentIndex, index, type)
    }
  },
  components: {
    ColtdFunctional,
    ActionButtons,
    ModifyInfomation,
    ChineseMedicine,
    PostPopover,
    Unreachable,
    newAddress
  }
}
</script>

<style lang="scss" scoped>
@import '../../../page/assets/base.scss';
.wh20{
  width: 20px
}
.prescription {
  line-height: 28px;
}
.information {
  margin: 0;
  padding: 0;
  li {
    label {
      color: #666;
      margin-right: 10px;
    }
    margin-right: 20px;
    display: inline-block;
  }
}
.color1 {
  background-color: rgba(250, 205, 145, 1);
}
.color0 {
  background-color: rgba(236, 128, 141, 1);
}
.color2 {
  background-color: rgba(115, 199, 118, 1);
}

.statusStyle {
  width: 60px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  padding: 0 10px;
  text-align: center;
}
.ui_dialog_02.dialogVisible /deep/ .el-dialog__header {
  display: none
}

.font-size-custom /deep/ svg {
  font-size: 20px;
  position: relative;
  top: 3px;
}
.backgroud {
  background-color: #f1f1f1;
}
.design_table /deep/ .design_error_table {
  background: $col_error!important;
}
.pl100{
  padding-left: 80px;
}
</style>
