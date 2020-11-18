<template>
  <div class="layout_box" id="sendarea">
    <ever-table
      id="sendtable"
      ref="taskTable"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :is-pagination="false"
      :is-drag-table="true"
      :span-method="arraySpanMethod"
      :config-option="configOption"
      :header-cell-class-name="headerCellClassName"
      :cell-class-name="cellClassName"
      :row-class-name="rowClassName"
      @configChange="configChange"
      @sort-change="sortChange"
      border
    >
      <template slot="serviceType" slot-scope="scope">
        <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :show-en="true" :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}"></sys-value>
      </template>
      <template slot="doctorAdviceName" slot-scope="scope">
        <span class="namesWrap">
          <!-- 父子医嘱标识 -->
          <span v-if="scope.row.mainFlag" class="leftIcons">
            <span class="top" v-if="String(scope.row.mainFlag) === '1'"></span>
            <span class="middle" v-else-if="fuziData[scope.row.mainGroupId] && fuziData[scope.row.mainGroupId].length > fuziData[scope.row.mainGroupId].findIndex(item => {return item.id === scope.row.id}) + 1"></span>
            <span class="bottom" v-else></span>
          </span>
          <span class="cellMain">
            <!-- 组套 -->
            <template v-if="scope.row.setFlag">
              <service-set-items :item="scope.row"></service-set-items>
            </template>
            <!-- 药品逻辑 -->
            <template v-else-if="['301', '302', '303', '304'].includes(scope.row.serviceType)">
              <!-- 西药、中成药 -->
              <template v-if="['301', '302'].includes(scope.row.serviceType)">
                <drug-info class="bold" :drug-obj="scope.row"></drug-info>
                <svg class="icon fontMargin" aria-hidden="true" v-if="scope.row.employ === '1460'" style="font-size: 18px;">
                  <use xlink:href="#iconpishi"></use>
                </svg>
              </template>
              <!-- 中药饮片、中药颗粒 -->
              <template v-if="['303', '304'].includes(scope.row.serviceType)">
                <span v-for="(drug, d) in scope.row.adviceFeesDtoList" :key="d" class="labWrap">
                  <label class="bold">{{drug.serviceName}}</label>
                  <label style="top:-5px;" class="lab" v-if="drug.footnoteName">({{drug.footnoteName}})</label>
                  <label style="bottom:-5px;" class="lab">{{drug.count}}{{drug.countUnitName}}</label>
                </span>
              </template>
              <!-- 毒麻精放等标识 -->
              <template v-if="scope.row.specialClassifyDrug">
                <el-tooltip v-for="code in scope.row.specialClassifyDrug.split(',')" :key="code">
                  <span slot="content">{{specialClassify[code] && specialClassify[code].name || ''}}</span>
                  <svg class="icon fontMargin" aria-hidden="true" v-if="specialClassify[code]">
                    <use :xlink:href="'#' + specialClassify[code].icon"></use>
                  </svg>
                </el-tooltip>
              </template>
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
            <!-- 套餐标识 -->
            <i class="iconfont icon-taocan" v-if="scope.row.shopSetItemId"></i>
            <!-- 缺货标识 -->
            <svg class="icon fontMargin" aria-hidden="true" v-if="String(scope.row.shortageFlag) === '1'">
              <use xlink:href="#icon-que"></use>
            </svg>
          </span>
        </span>
      </template>
      <template slot="doctorAdviceContent" slot-scope="scope">
        <span v-if="scope.row.adviceFeesDtoList && scope.row.adviceFeesDtoList[0] && String(scope.row.adviceFeesDtoList[0].feesType) === '2'">数量：{{scope.row.count}}{{scope.row.countUnitName || '项'}}</span>
        <advice-item-show :item="scope.row" :visit-type="1" v-else></advice-item-show>
      </template>
      <template slot="source" slot-scope="scope">
        <template v-if="scope.row.source">
          <sys-value type="THC_SYS_PRESCRIPTION_SOURCE" :code="String(scope.row.source)" :show-en="true" :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}"></sys-value>
        </template>
        <template v-else><span :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}">--</span></template>
      </template>
      <template slot="status" slot-scope="scope">
        <template v-if="OUTPATIENT_ADVICE_STATUS[String(scope.row.status)] && OUTPATIENT_ADVICE_STATUS[String(scope.row.status)].txt">
          <span :class="{'cRed': ['2', '70'].includes(String(scope.row.status))}">{{OUTPATIENT_ADVICE_STATUS[String(scope.row.status)].txt}}</span>
          <i class="iconfont icon-yichang cRed" v-if="scope.row.isException"></i>
          <template v-else-if="['2', '70'].includes(String(scope.row.status))">
            <el-tooltip  placement="right" effect="light" v-if="scope.row.remarks">
              <span slot="content"><span v-html="scope.row.remarks"></span></span>
              <i class="iconfont icon-yichang cRed"></i>
            </el-tooltip>
            <i class="iconfont icon-yichang cRed" v-else></i>
          </template>
          <i class="iconfont icon-tuike" v-else-if="scope.row.refAdviceLogFLag"></i>
        </template>
        <template v-else>--</template>
      </template>
    </ever-table>
    <!-- 右键操作按钮列表 -->
    <contextmenu :class-name="rowClass" :menu="contextList" @menu="getMenuList" @select="contextSelect"></contextmenu>
    <!-- 退库退费dialog组件 -->
    <refund-dialog :data="currentRefund" :base-info="baseInfo" :visible.sync="refundVisible" @submit="refundSuccess"></refund-dialog>
    <!-- 执行记录dialog -->
    <excute-record-dialog :data="excuteRecordData" :visible.sync="excuteRecordVisible" :currentObj="currentHandleObj" @update="excuteRecord(currentHandleObj)" @viewReport="viewReport"></excute-record-dialog>
    <!-- 操作日志dialog -->
    <operation-log :data="currentHandleObj" :visible.sync="logVisible"></operation-log>
    <!-- 查看报告dialog -->
    <reportcard ref="reportcard" :isPrint="true" :special="true" :append-body="true"></reportcard>
    <!-- 坚持发药dialog -->
    <el-dialog title="坚持发药" :visible.sync="handleVisible" class="ui_dialog_02 spe" @close="handleClosehandle" :close-on-click-modal="false" :close-on-press-escape="false">
      <ever-form2
        :schema="handleSchema"
        v-model="handleObj"
        label-position="right"
        :nosubmit="true"
      ></ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmAdvice" type="primary" :disabled="!handleObj.reason">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPrintData, newPrintEvent, singlePrint } from './sendarea.print'
import medicalapi from '@/workspace/store/medicalapi'
import recipeapi from '@/workspace/store/recipeapi'
import storage from '@/util/storage'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import drugInfo from '@/inpatient/components/drug.info'
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import contextmenu from '@/workspace/components/contextmenu'
import refundDialog from '@/inpatient/components/medical.orders/refund.dialog'
import excuteRecordDialog from '@/inpatient/components/medical.orders/excute.record.dialog'
import operationLog from '@/inpatient/components/medical.orders/operation.log'
import reportcard from '@/infusion/components/report.card.vue'
import { OUTPATIENT_ADVICE_STATUS, PAY_STATUS, objSortBy, objFind } from '@/util/common'
import { OUTPATIENT_SENDADVICE } from '@/util/table-config'
import { specialClassify } from '@/inpatient/components/doctor.state/index.js'
import i18n from '@/assets/locals/index'
import { presrciptionPrintConfig } from '@/inpatient/store/prescriptionprintconfig.js'

export default {
  props: {
    baseInfo: Object,
    disabled: Boolean,
    fromQuick: Boolean,
    orderDisabled: Boolean
  },
  data () {
    let handleSchema = [
      {
        name: 'reason',
        label: '请填写原因',
        comp: 'el-input'
      }
    ]
    let handleObj = this.$ever.createObjFromSchema(handleSchema)
    return {
      medicalapi,
      recipeapi,
      storage,
      handleSchema,
      handleObj,
      OUTPATIENT_ADVICE_STATUS,
      specialClassify,
      loading: false,
      tableData: [],
      initData: '',
      configData: [],
      currentRefund: [],
      refundVisible: false,
      currentHandleObj: {},
      excuteRecordData: [],
      excuteRecordVisible: false,
      logVisible: false,
      handleVisible: false,
      rowClass: 'sendContextRow',
      printConfig: [],
      columns: [
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: i18n.t('类型'),
          minWidth: '6%',
          sortable: true,
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: i18n.t('名称'),
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: i18n.t('内容'),
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: i18n.t('嘱托'),
          showOverflowTooltip: true,
          minWidth: '10%',
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          slot: 'status',
          prop: 'status',
          label: i18n.t('执行状态'),
          showOverflowTooltip: true,
          minWidth: '6%'
        },
        {
          prop: 'payStatus',
          label: i18n.t('支付状态'),
          showOverflowTooltip: true,
          minWidth: '6%',
          formatter: ({value, row}) => {
            return PAY_STATUS[String(value)] || ''
          },
          customCellSpanClassFormatter ({value, row}) {
            return String(value) === '0' && String(row.status) !== '210' && String(row.status) !== '500' || ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          prop: 'advicePrice',
          label: i18n.t('金额'),
          showOverflowTooltip: true,
          minWidth: '8%',
          align: 'right',
          formatter: ({value}) => {
            return '¥ ' + this.$filters.formatToFinacial(value, 2)
          },
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          prop: 'submitTime',
          label: i18n.t('提交时间'),
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          },
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          prop: 'storageRoomName',
          label: i18n.t('库房'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          afterHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.storageRoomName && row.mailFlag) {
              html += `<i class="iconfont icon-youji1 iconYouji"></i>`
            }
            return html
          },
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          slot: 'source',
          prop: 'source',
          label: i18n.t('渠道'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        },
        {
          prop: 'doctorName',
          label: i18n.t('提交人'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          customCellSpanClassFormatter ({value, row}) {
            return ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        }
      ],
      configOption: {id: OUTPATIENT_SENDADVICE},
      // 给定的排序顺序: 检查、检验、病理、会诊、西药/中成药、中药饮片、商品(实物类)、耗材(实物类)、治疗(处置)、手术、麻醉、收费耗材、美容、医事服务费、其它
      sortType: ['800', '801', '10003', '2467', '301', '302', '303', '304', '10008', '299', '300', '802', '2125', '10004', '10006', '10002', '799', '867'],
      contextList: [
        {id: '1', name: '撤回', disabled: false, methodName: 'removeAdvice'},
        {id: '2', name: '整方撤回', disabled: false, isRecipe: true, methodName: 'removeRecipe'},
        {id: '3', name: '取消', disabled: false, methodName: 'cancelAdvice'},
        {id: '4', name: '整方取消', disabled: false, isRecipe: true, methodName: 'cancelRecipe'},
        {id: '5', name: '退库', disabled: false, methodName: 'refundDrug'},
        {id: '6', name: '执行记录', disabled: false, methodName: 'excuteRecord'},
        {id: '7', name: '查看报告', disabled: false, methodName: 'viewReport'},
        {id: '8', name: '操作日志', disabled: false, methodName: 'operationLog'}
      ]
    }
  },
  created () {
    this.printConfig = presrciptionPrintConfig[this.$ever.getClinicConfig().PRprintConfig] || []
  },
  methods: {
    // 合并单元格处理
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let list1 = []
      let config1 = ['storageRoomName', 'executeProviderName', 'source', 'submitTime', 'doctorName']
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (config1.includes(item.prop)) {
            list1.push(index)
          }
        })
      }
      if (list1.includes(columnIndex)) {
        // 执行科室字段，父子医嘱合并单元格
        if (row.mainFlag === 1) {
          let m2 = this.fuziData[row.mainGroupId] && this.fuziData[row.mainGroupId].length || 0
          return {rowspan: m2, colspan: 1}
        } else if (row.mainFlag > 1) return {rowspan: 0, colspan: 0}
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
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        return 'pad-rt-30'
      }
    },
    // 给body中cell 设置类名
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      let config = ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status', 'payStatus', 'advicePrice']
      let configIndex = []
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (!item.hidden) count++
          if (config.includes(item.prop)) configIndex.push(String(index))
        })
      }
      let className = []
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      if (String(row.status) === '210' || String(row.status) === '500') {
        className.push('lineGray')
      }
      if (configIndex.includes(column.columnKey)) {
        if (row.mainFlag && this.fuziData[row.mainGroupId] && this.fuziData[row.mainGroupId].length) {
          if (this.fuziData[row.mainGroupId].length > this.fuziData[row.mainGroupId].findIndex(item => { return item.id === row.id }) + 1) {
            className.push('noBottomBorder')
          }
          // 处理父子医嘱标识问题
          if (String(row.mainFlag) === '1') {
            className.push('topCell')
          } else {
            if (row.id === this.fuziData[row.mainGroupId][this.fuziData[row.mainGroupId].length - 1].id) {
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
    rowClassName () {
      return this.rowClass
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    // 点击类型排序
    sortChange ({ column, prop, order }) {
      if (order === 'ascending') {
        this.sortMethods(this.sortType)
      } else if (order === 'descending') {
        this.sortMethods(this.sortType.reverse())
        // reverse 会改变原来的数组，再次reverse恢复原来的顺序
        this.sortType.reverse()
      } else {
        this.tableData = JSON.parse(this.initData)
      }
    },
    // 排序方法
    sortMethods (arr) {
      arr.forEach((item, index) => {
        this.tableData.map(value => {
          if (item === value.serviceType) {
            if (String(value.mainFlag) !== '2') {
              value.sortIndex = index
            }
            return value
          }
        })
      })
      this.tableData.map(val => {
        if (String(val.mainFlag) === '2') {
          val.sortIndex = this.tableData.find(v => { return String(v.mainFlag) === '1' && val.mainGroupId === v.mainGroupId }).sortIndex
          return val
        }
      })
      this.tableData = objSortBy(this.tableData, 'sortIndex')
    },
    // 查询接口
    async getRecipeData (list) {
      this.loading = true
      let res = await this.recipeapi.getRecipeByVisitNumber({ visitNumber: this.baseInfo.visitSn })
      if (res && res.data && res.data.length) {
        this.loading = false
        this.tableData = this.setRecipeData(res.data)
        this.initData = JSON.stringify(this.tableData)
        if (list && list.length) {
          // 过滤哪些是最新提交的处方，组装打印数据
          let printData = []
          printData = JSON.parse(this.initData).filter(v => {
            return list.includes(v.recipeId)
          })
          let data = []
          data = getPrintData(printData, this.printConfig)
          newPrintEvent(data, this.printConfig, this.baseInfo, this.$store.state.currentUser.organizationId, false)
        }
      } else {
        this.tableData = []
      }
      this.$emit('getSendData', this.tableData)
    },
    // 数据处理，将同一处方，同一父子医嘱的数据放在一起
    setRecipeData (data) {
      let obj = {}
      data.forEach(item => {
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
        if (!obj[item.mainGroupId]) {
          obj[item.mainGroupId] = [item]
        } else {
          obj[item.mainGroupId].push(item)
        }
      })
      let finalData = []
      Object.keys(obj).forEach(val => {
        obj[val].forEach(v => {
          finalData.push(v)
        })
      })
      return finalData
    },
    // 右键操作按钮列表触发事件回调
    getMenuList (index) {
      this.contextList.forEach((v) => {
        if (!v.isRecipe) {
          v.disabled = !this.getStatusShow(this.fuziData[this.tableData[index].mainGroupId], v.id)
        } else {
          if (this.tableData[index].mainFlag) {
            v.disabled = true
          } else {
            v.disabled = !this.getStatusShow(this.recipeData[this.tableData[index].recipeId], v.id)
          }
        }
        // 历史和非本人患者只允许查看
        if (!['7', '8'].includes(v.id)) {
          v.disabled = v.disabled || this.orderDisabled
        }
      })
      // 动态添加 打印标签 按钮
      if (this.tableData[index].barCode || this.tableData[index].serviceType === '10003') {
        if (!objFind(this.contextList, { id: '9' })) {
          this.contextList.push({id: '9', name: '打印标签', disabled: false, methodName: 'printBarcode'})
        }
      } else {
        if (objFind(this.contextList, { id: '9' })) {
          this.contextList.splice(this.contextList.findIndex(val => { return val.id === '9' }), 1)
        }
      }
      // 动态添加 坚持发药 按钮
      if (String(this.tableData[index].status) === '2' || String(this.tableData[index].status) === '70') {
        if (!objFind(this.contextList, { id: '10' })) {
          this.contextList.push({id: '10', name: '坚持发药', disabled: false, methodName: 'insistDispense'})
        }
      } else {
        if (objFind(this.contextList, { id: '10' })) {
          this.contextList.splice(this.contextList.findIndex(val => { return val.id === '10' }), 1)
        }
      }
    },
    // 操作按钮显示判断逻辑
    getStatusShow (list, id) {
      if (id === '1' || id === '2') { // 撤回或整方撤回
        // 明细中都是未支付状态，且已提交（未发药），或者自备药，支付状态为null，且已提交，可撤回
        let n1 = 0
        list.forEach(m => {
          if ((String(m.payStatus) === '0' && String(m.status) === '1') || (String(m.source) === '2' && String(m.status) === '1' && m.payStatus === null) || (String(m.payStatus) === '0' && (String(m.status) === '2' || String(m.status) === '70'))) {
            n1++
          }
        })
        return list.length === n1
      } else if (id === '3' || id === '4') { // 取消或整方取消
        // 明细中，已支付的状态，执行状态已提交，或出库异常，或者处方驳回，可取消
        let n2 = 0
        list.forEach(m => {
          if (['301', '302', '303', '304', '300', '10008'].includes(m.serviceType)) {
            if (String(m.payStatus) === '1' && (String(m.status) === '1' || String(m.status) === '70' || String(m.status) === '2')) {
              n2++
            }
          } else {
            if (String(m.payStatus) === '1' && String(m.status) === '1') {
              n2++
            }
          }
        })
        return list.length === n2
      } else if (id === '5') { // 退库
        let n3 = 0
        // 院外，已发药，本机构的自提的药，非自备药，可退库
        list.forEach(m => {
          if (String(m.status) === '190' && !m.mailFlag && m.executeProviderId === 'SOB_EXTUDE_PROVIDER_OUT' && !['303', '304'].includes(m.serviceType) && String(m.source) !== '2') {
            n3++
          }
        })
        return list.length === n3
      } else if (id === '6') {  // 执行记录
        let n4 = 0
        // 药品 执行科室是院内的科室 且执行中，或已完成  可以查看执行记录
        // 治疗 执行中，或报告已出
        list.forEach(m => {
          if (['301', '302', '303', '304'].includes(m.serviceType)) {
            if (m.executeProviderId !== 'SOB_EXTUDE_PROVIDER_OUT' && (String(m.status) === '10' || String(m.status) === '5')) {
              n4++
            }
          } else if (['802'].includes(m.serviceType)) {
            if (String(m.status) === '10' || String(m.status) === '60') {
              n4++
            }
          }
        })
        return list.length === n4
      } else if (id === '7') { // 查看报告
        // 检验，检查，手术  60 报告已出，可查看报告
        let n5 = 0
        list.forEach(m => {
          if (String(m.status) === '60' && ['800', '801', '2125', '10003'].includes(m.serviceType)) {
            n5++
          }
        })
        return list.length === n5
      } else if (id === '8') { // 操作日志
        return true
      } else if (id === '9') { // 打印标签
        return true
      } else if (id === '10') {  // 坚持发药
        return true
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      this[item.methodName](this.tableData[index])
    },
    // 撤回
    removeAdvice (item) {
      let ids = []
      this.fuziData[item.mainGroupId].forEach(val => {
        ids.push(val.id)
      })
      if (ids.length) this.remove(item, ids, 'mainGroupId')
    },
    // 整方撤回
    removeRecipe (item) {
      let ids = []
      let flag = false
      this.recipeData[item.recipeId].forEach(val => {
        ids.push(val.id)
        if (val.mainFlag) flag = true
      })
      if (flag) {
        return this.$messageTips(this, 'warning', '处方中包含父子医嘱，不能整方撤回', '提示')
      }
      if (ids.length) this.remove(item, ids, 'recipeId')
    },
    // 撤回，更新待提交及已提交数据
    remove (item, params, str) {
      this.recipeapi.removeRecipeAdvice({doctorAdviceIds: params}).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        // 门诊处方撤回后，如果返回列表，就展示在执行记录dialog
        if (rs.data && rs.data.length && item.serviceType !== '802') {
          this.currentHandleObj = item
          this.excuteRecord(item, rs.data)
          return false
        }
        this.tableData = this.tableData.filter(v => {
          return v[str] !== item[str]
        })
        this.initData = JSON.stringify(JSON.parse(this.initData).filter(v => {
          return v[str] !== item[str]
        }))
        this.$emit('cancel', this.tableData)
        this.$messageTips(this, 'success', '处方已成功撤回', '成功')
      })
    },
    // 取消
    cancelAdvice (item) {
      let ids = []
      this.fuziData[item.mainGroupId].forEach(val => {
        ids.push(val.id)
      })
      if (ids.length) this.cancel(item, ids)
    },
    // 整方取消
    cancelRecipe (item) {
      let ids = []
      let flag = false
      this.recipeData[item.recipeId].forEach(val => {
        ids.push(val.id)
        if (val.mainFlag) flag = true
      })
      if (flag) {
        return this.$messageTips(this, 'warning', '处方中包含父子医嘱，不能整方取消', '提示')
      }
      if (ids.length) this.cancel(item, ids)
    },
    // 取消
    cancel (item, params) {
      this.recipeapi.cancelRecipeAdvice({doctorAdviceIds: params}).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        // 门诊处方取消后，如果返回列表，就展示在执行记录dialog
        if (rs.data && rs.data.length && item.serviceType !== '802') {
          this.currentHandleObj = item
          this.excuteRecord(item, rs.data)
          return false
        }
        this.getRecipeData()
        this.$messageTips(this, 'success', '处方已成功取消', '成功')
      })
    },
    // 退库
    refundDrug (item) {
      this.currentRefund = this.fuziData[item.mainGroupId]
      this.refundVisible = true
    },
    // 退库 提交成功回调
    refundSuccess () {
      this.getRecipeData()
    },
    // 查看报告
    viewReport (item) {
      if (!item.executeId) {
        item.executeId = item.outpatientExecutes && item.outpatientExecutes.length && item.outpatientExecutes[0].id || ''
      }
      this.$refs.reportcard.openDialog(item, true)
    },
    // 执行记录
    async excuteRecord (item, data) {
      this.currentHandleObj = item
      let list
      if (!data) {
        let ids = []
        this.fuziData[item.mainGroupId].forEach(val => {
          ids.push(val.id)
        })
        let result = await this.recipeapi.getExecuteRecordsByAdviceIds({ doctorAdviceIds: ids })
        if (result.head.errCode === 0 && result.data && result.data.length) {
          list = result.data
        }
      } else {
        list = data
      }
      if (list && list.length) {
        this.excuteRecordData = list
        this.excuteRecordVisible = true
      } else {
        this.$messageTips(this, 'warning', '未获取到执行记录', '提示')
      }
    },
    // 操作日志
    operationLog (item) {
      this.currentHandleObj = item
      this.logVisible = true
    },
    // 打印标签
    printBarcode (item) {
      let params = {
        id: this.baseInfo.doctorId,
        visitNumber: this.baseInfo.visitSn,
        patientId: this.baseInfo.patientId,
        serviceType: [item.serviceType],
        doctorAdviceIds: [item.id]
      }
      singlePrint('JIAN_YAN_TIAO_MA', params)
    },
    // 坚持发药
    insistDispense (item) {
      this.currentHandleObj = item
      this.handleVisible = true
    },
    handleClosehandle () {
      this.handleObj = this.$ever.createObjFromSchema(this.handleSchema)
    },
    confirmAdvice () {
      let params = {
        reason: this.handleObj.reason,
        doctorAdviceId: this.currentHandleObj.id,
        recipeId: this.currentHandleObj.recipeId
      }
      this.recipeapi.confirmMaterialOutStatus(params).then(res => {
        this.handleVisible = false
        if (res.head.errCode === 0) {
          this.getRecipeData()
          this.$messageTips(this, 'success', '保存成功', '成功')
        } else {
          this.$messageTips(this, 'warning', '保存失败', '提示')
        }
      })
    }
  },
  components: {
    adviceItemShow,     // 内容显示组件
    drugInfo,           // 药品说明书显示组件
    serviceSetItems,    // 组套明细组件
    refundDialog,       // 退库退费dialog组件
    excuteRecordDialog, // 执行记录dialog组件
    operationLog,       // 操作日志dialog组件
    reportcard,         // 查看报告dialog组件
    contextmenu         // 右键组件
  },
  computed: {
    fuziData () {
      let obj = {}
      JSON.parse(this.initData).forEach(item => {
        if (obj[item.mainGroupId]) {
          obj[item.mainGroupId].push(item)
        } else {
          obj[item.mainGroupId] = [item]
        }
      })
      return obj
    },
    recipeData () {
      let obj = {}
      JSON.parse(this.initData).forEach(item => {
        if (obj[item.recipeId]) {
          obj[item.recipeId].push(item)
        } else {
          obj[item.recipeId] = [item]
        }
      })
      return obj
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss">
#sendarea {
  width: 100%;
  #sendtable {
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
</style>
