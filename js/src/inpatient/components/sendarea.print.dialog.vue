<template>
  <el-dialog
    :visible.sync="visibleFlag"
    width="900"
    class="sendarea-print-dialog"
    @close="closeDialog"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <template v-if="visibleFlag">
      <el-tabs v-model="activeTab">
        <el-tab-pane v-for="(tab, key) in tabs" :label="tab.name" :name="tab.id" :key="key">
          <span slot="label" class="tab-label" :class="{'has-data-icon': tabsCacheData[tab.id].length}">{{tab.name}}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="dilog-tabel">
        <ever-table
          ref="taskTable"
          :columns="columns"
          :data="currentData"
          :is-pagination="false"
          :span-method="arraySpanMethod"
          :header-cell-class-name="headerCellClassName"
          :cell-class-name="cellClassName"
          :show-checkbox="true"
          :is-record-url-params="false"
          :not-select-checkbox="true"
          :checkbox-width="30"
          @selection-change="selectionChange"
          border
        >
          <template slot="serviceType" slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :show-en="true"></sys-value>
          </template>
          <template slot="personalRecipe" slot-scope="scope">
            <el-checkbox v-model="scope.row.personalRecipe" @change="personalRecipeChange($event, scope.row)"></el-checkbox>
          </template>
          <template slot="doctorAdviceName" slot-scope="scope">
            <span class="namesWrap">
              <!-- 父子医嘱标识 -->
              <span
                v-if="scope.row.mainFlag && !printConfig[Number(activeTab)].isRecipe"
                class="leftIcons"
              >
                <span class="top" v-if="String(scope.row.mainFlag) === '1'"></span>
                <span
                  class="middle"
                  v-else-if="fuziData[scope.row.mainGroupId] && fuziData[scope.row.mainGroupId].length > fuziData[scope.row.mainGroupId].findIndex(item => {return item.id === scope.row.id}) + 1"
                ></span>
                <span class="bottom" v-else></span>
              </span>
              <span class="cellMain">
                <!-- 组套 -->
                <template v-if="scope.row.setFlag">
                  <service-set-items :item="scope.row"></service-set-items>
                </template>
                <!-- 药品逻辑 -->
                <template v-else-if="['301', '302', '303', '304','3002'].includes(scope.row.serviceType)">
                  <!-- 西药、中成药 -->
                  <template v-if="['301', '302'].includes(scope.row.serviceType)">
                    <drug-info class="bold" :drug-obj="scope.row"></drug-info>
                    <svg
                      class="icon fontMargin"
                      aria-hidden="true"
                      v-if="scope.row.employ === '7'"
                      style="font-size: 18px;"
                    >
                      <use xlink:href="#iconpishi" />
                    </svg>
                  </template>
                  <!-- 中药饮片、中药颗粒 -->
                  <template v-if="['303', '304' ,'3002'].includes(scope.row.serviceType)">
                    <span v-for="(drug, d) in scope.row.adviceFeesDtoList" :key="d" class="labWrap">
                      <label class="bold">{{drug.serviceName}}</label>
                      <label
                        style="top:-5px;"
                        class="lab"
                        v-if="drug.footnoteName"
                      >({{drug.footnoteName}})</label>
                      <label style="bottom:-5px;" class="lab">{{drug.count}}{{drug.countUnitName}}</label>
                    </span>
                  </template>
                  <!-- 毒麻精放等标识 -->
                  <template v-if="scope.row.specialClassifyDrug">
                    <el-tooltip v-for="code in scope.row.specialClassifyDrug.split(',')" :key="code">
                      <span slot="content">{{specialClassify[code] && specialClassify[code].name || ''}}</span>
                      <svg class="icon fontMargin" aria-hidden="true" v-if="specialClassify[code]">
                        <use :xlink:href="'#' + specialClassify[code].icon" />
                      </svg>
                    </el-tooltip>
                  </template>
                </template>
                <!-- 非药品逻辑 -->
                <template v-else>
                  <span class="bold">{{scope.row.doctorAdviceName || scope.row.serviceName}}</span>
                </template>
                <!-- 甲乙丙类标识 -->
                <i
                  class="iconfont icon-charge"
                  :class="{'icon-jia': String(scope.row.chargeLevel) === '1',
                  'icon-CombinedShape': String(scope.row.chargeLevel) === '2',
                  'icon-bing': String(scope.row.chargeLevel) === '3',
                  'icon-menzhen-lixiu': String(scope.row.chargeLevel) === '4'}"
                ></i>
                <!-- 套餐标识 -->
                <i class="iconfont icon-taocan" v-if="scope.row.shopSetItemId"></i>
                <!-- 缺货标识 -->
                <svg
                  class="icon fontMargin"
                  aria-hidden="true"
                  v-if="String(scope.row.shortageFlag) === '1'"
                >
                  <use xlink:href="#icon-que" />
                </svg>
              </span>
            </span>
          </template>
          <template slot="doctorAdviceContent" slot-scope="scope">
            <span
              v-if="scope.row.adviceFeesDtoList && scope.row.adviceFeesDtoList[0] && String(scope.row.adviceFeesDtoList[0].feesType) === '2'"
            >数量：{{scope.row.count}}{{scope.row.countUnitName || '项'}}</span>
            <advice-item-show :item="scope.row" :visit-type="1" v-else></advice-item-show>
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
      </div>
    </template>
    
    <span slot="footer">
      <el-dropdown
        split-button
        size="medium"
        type="primary"
        trigger="click"
        v-if="totalData.length && (selectData.length || selectPersonalRecipe.length)"
        @click="printAdvice(false)"
        @command="command => {printAdvice(command)}"
      >
        <slot>{{$t('打印')}}</slot>
        <el-dropdown-menu slot="dropdown" class="table-button-menu">
          <el-dropdown-item :command="true">{{$t('打印预览')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" disabled v-else>{{$t('打印')}}</el-button>
      <el-button @click="closeDialog">{{$t('取消')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getPrintData, newPrintEvent } from './sendarea.print'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import drugInfo from '@/inpatient/components/drug.info'
import autoprintsetapi from '@/sob/store/autoprintsetapi'
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import { specialClassify } from '@/inpatient/components/doctor.state/index.js'
import { presrciptionPrintConfig } from '@/inpatient/store/prescriptionprintconfig.js'
import recipeapi from '@/workspace/store/recipeapi'
import { OUTPATIENT_ADVICE_STATUS, PAY_STATUS, objRemove } from '@/util/common'

export default {
  props: {
    baseInfo: Object, // 基本信息 {visitSn 就诊编号, patientId 患者id, dptId 科室id}
    tabList: Array, // tab列表,对应tabs的id ['0'-处方打印, '1'-检查申请打印, '2'-检验申请打印, '3'-治疗打印, '4'-处置打印, '5'-手术申请打印, '6'-费用清单打印]
    isPersonalPrint: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      specialClassify,
      activeTab: '',
      waiting: false,
      visibleFlag: false,
      totalData: [],
      currentData: [],
      selectData: [],
      selectPersonalRecipe: [],
      OUTPATIENT_ADVICE_STATUS,
      PAY_STATUS,
      columns: this.getColumns(),
      tabs: [],
      printConfig: [],
      tabsCacheData: {} // 把tabs的数据做缓存
    }
  },
  computed: {
    fuziData () {
      let obj = {}
      this.totalData.forEach(item => {
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
      this.totalData.forEach(item => {
        if (obj[item.recipeId]) {
          obj[item.recipeId].push(item)
        } else {
          obj[item.recipeId] = [item]
        }
      })
      return obj
    }
  },
  components: {
    adviceItemShow,
    drugInfo,
    serviceSetItems
  },
  created () {
    let printConfig = presrciptionPrintConfig[this.$ever.getClinicConfig().PRprintConfig] || []
    if (this.tabList) {
      this.printConfig = printConfig.filter(item => this.tabList.includes(item.id))
    } else {
      this.printConfig = printConfig
    }
  },
  methods: {
    comTabClickFun (index) {
      this.selectData = []
      if (this.tabsCacheData[index]) {
        return this.tabsCacheData[index]
      }
      let currentData = getPrintData(this.totalData, this.printConfig, Number(index))
      currentData.forEach(item => {
        item = Object.assign(item, item.adviceJson || {})
      })
      let data = this.resetData(currentData)
      this.$set(this.tabsCacheData, index, data)
      return data
    },
    async getConfigList (index) {
      let parms = {
        source: 3,
        executeTypeCode: 'CHU_ZHI_DAN'
      }
      await autoprintsetapi.getConfigList(parms).then(res => {
        if (res.data.length > 0) {
          this.printConfig[index].config.serviceType = res.data[0].includeAdviceType.split(',')
          this.printConfig[index].config.employ = res.data[0].includeUsage.split(',')
        }
        this.currentData = this.comTabClickFun(index)
      })
    },
    // 将同一处方的医嘱或者同一父子医嘱的医嘱调整到顺序的位置，防止合并单元格出现问题
    resetData (list) {
      let obj = {
        data: '',
        id: ''
      }
      if (this.printConfig[Number(this.activeTab)].isRecipe) {
        // 复选框，如果配置按照处方打印，按照处方维度，合并单元格
        obj.data = 'recipeData'
        obj.id = 'recipeId'
      } else {
        // 复选框，父子医嘱，合并单元格
        obj.data = 'fuziData'
        obj.id = 'mainGroupId'
      }
      let temp = []
      list.forEach(item => {
        if (this[obj.data][item[obj.id]] && this[obj.data][item[obj.id]][0].id === item.id) {
          temp = temp.concat(this[obj.data][item[obj.id]])
        }
      })
      return temp
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 1 || column.property === 'personalRecipe') {
        let obj = {
          data: '',
          id: ''
        }
        if (this.printConfig[Number(this.activeTab)].isRecipe) {
          // 复选框，如果配置按照处方打印，按照处方维度，合并单元格
          obj.data = 'recipeData'
          obj.id = 'recipeId'
        } else {
          // 复选框，父子医嘱，合并单元格
          obj.data = 'fuziData'
          obj.id = 'mainGroupId'
        }
        if (this[obj.data][row[obj.id]] && this[obj.data][row[obj.id]].findIndex(item => { return item.id === row.id }) === 0) {
          let m = this[obj.data][row[obj.id]] && this[obj.data][row[obj.id]].length || 0
          return { rowspan: m, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    // 给header设置类名
    headerCellClassName ({ row, column, rowIndex, columnIndex }) {
      let className = []
      if (Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      return className.join(' ')
    },
    // 给body中cell 设置类名
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let className = []
      if (Number(columnIndex) === 0) {
        className.push('spec-pd')
      }
      return className.join(' ')
    },
    selectionChange (selection) {
      this.selectData = []
      selection.forEach(item => {
        if (this.printConfig[Number(this.activeTab)].isRecipe) {
          this.selectData = this.selectData.concat(this.recipeData[item.recipeId])
        } else {
          this.selectData = this.selectData.concat(this.fuziData[item.mainGroupId])
        }
      })
    },
    printAdvice (flag) {
      if (!(this.selectData.length || this.selectPersonalRecipe) || this.waiting) return
      this.selectData.length && newPrintEvent(JSON.parse(JSON.stringify(this.selectData)), this.printConfig, this.baseInfo, this.$store.state.currentUser.organizationId, flag, Number(this.activeTab))
      // 打印底方
      this.selectPersonalRecipe.length && newPrintEvent(JSON.parse(JSON.stringify(this.selectPersonalRecipe)), this.printConfig, this.baseInfo, this.$store.state.currentUser.organizationId, flag, Number(this.activeTab), true)
      this.waiting = true
      setTimeout(() => {
        this.waiting = false
        this.closeDialog()
      }, 500)
    },
    closeDialog () {
      this.visibleFlag = false
      this.selectData = []
      this.selectPersonalRecipe = []
      this.$refs.taskTable.$children[0].clearSelection()
      this.activeTab = ''
    },
    async showDialog (data) {
      if (!data) { // 没携带数据则请求接口获取已提交的医嘱
        data = await this.getRecipeData()
        data = data.filter(v => { // 过滤掉已取消的医嘱
          return String(v.status) !== '210' && String(v.status) !== '500'
        })
      }
      this.tabs = this.printConfig
      this.totalData = JSON.parse(JSON.stringify(data))
      this.tabsCacheData = {}
      this.tabs.forEach(item => {
        if (this.comTabClickFun(item.id).length && !this.activeTab) {
          this.activeTab = item.id
        }
      })
      this.currentData = this.comTabClickFun(this.activeTab)
      this.selectAll()
      this.columns = this.getColumns()
      this.visibleFlag = true
    },
    // 查询已提交打印数据
    async getRecipeData () {
      let data = []
      let res = await recipeapi.getRecipeByVisitNumber({ visitNumber: this.baseInfo.visitSn })
      if (res && res.data && res.data.length) {
        data = this.formatData(res.data)
      } else {
        data = []
      }
      return data
    },
    // 数据处理，将json数据取出，将毒麻精放等特殊标识合为一个，将父子医嘱放在一起
    formatData (data) {
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
    personalRecipeChange (val, row) {
      if (val) {
        if (this.printConfig[Number(this.activeTab)].isRecipe) {
          this.selectPersonalRecipe.push(...this.recipeData[row.recipeId])
        } else {
          this.selectPersonalRecipe.push(...this.fuziData[row.mainGroupId])
        }
      } else {
        if (this.printConfig[Number(this.activeTab)].isRecipe) {
          objRemove(this.selectPersonalRecipe, (item) => {
            return item.recipeId === row.recipeId
          })
        } else {
          objRemove(this.selectPersonalRecipe, (item) => {
            return item.mainGroupId === row.mainGroupId
          })
        }
      }
    },
    selectAll () {
      window.setTimeout(() => {
        this.currentData.forEach(item => {
          this.$refs.taskTable && this.$refs.taskTable.$refs.everTable.toggleRowSelection(item)
        })
      })
    },
    getColumns () {
      if (this.activeTab === '0') {
        return [
          {
            slot: 'serviceType',
            prop: 'serviceType',
            label: '类型',
            minWidth: '12%'
          },
          {
            slot: 'personalRecipe',
            prop: 'personalRecipe',
            label: '底方',
            minWidth: '12%'
          },
          {
            slot: 'doctorAdviceName',
            prop: 'doctorAdviceName',
            label: '名称',
            minWidth: '45%'
          },
          {
            slot: 'doctorAdviceContent',
            prop: 'doctorAdviceContent',
            label: '内容',
            minWidth: '45%'
          },
          {
            slot: 'status',
            prop: 'status',
            label: '执行状态',
            minWidth: '15%',
            showOverflowTooltip: true
          },
          {
            prop: 'payStatus',
            label: '支付状态',
            showOverflowTooltip: true,
            minWidth: '15%',
            formatter: ({value, row}) => {
              return PAY_STATUS[String(value)] || ''
            },
            customCellSpanClassFormatter ({value, row}) {
              return String(value) === '0' && String(row.status) !== '210' && String(row.status) !== '500' || ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
            }
          }
        ]
      }
      return [
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: '类型',
          minWidth: '10%'
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '45%'
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: '内容',
          minWidth: '45%'
        },
        {
          slot: 'status',
          prop: 'status',
          label: '执行状态',
          minWidth: '15%',
          showOverflowTooltip: true
        },
        {
          prop: 'payStatus',
          label: '支付状态',
          showOverflowTooltip: true,
          minWidth: '15%',
          formatter: ({value, row}) => {
            return PAY_STATUS[String(value)] || ''
          },
          customCellSpanClassFormatter ({value, row}) {
            return String(value) === '0' && String(row.status) !== '210' && String(row.status) !== '500' || ['2', '70'].includes(String(row.status)) ? 'cRed' : ''
          }
        }
      ]
    }
  },
  watch: {
    async activeTab (val) {
      this.columns = this.getColumns()
      if (val === '4') {
        await this.getConfigList(val)
      } else {
        this.currentData = this.comTabClickFun(val)
      }
      this.selectAll()
    }
  }
}
</script>
<style lang="scss" scoped>
.sendarea-print-dialog {
  .tab-label {
    position: relative;
  }
  .has-data-icon::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 0px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: red;
  }
  /deep/ .el-dialog__header {
    padding: 0;
  }
  .dilog-tabel {
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;
  }
  /deep/ .el-table {
    tr {
      .lineGray {
        text-decoration: underline;
        color: #ccc;
      }
      &:hover {
        td {
          background: transparent;
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
    .iconfont {
      color: #999;
    }
    .icon-charge {
      color: #009944;
    }
    .iconYouji {
      color: #ff4f00;
      position: absolute;
      top: 1px;
      right: 0;
      font-size: 24px;
    }
    .fontMargin {
      margin: 0 2px;
      font-size: 16px;
    }
  }
  /deep/ .el-dropdown {
    .el-button--medium {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .personal-recipe {
    margin-right: 10px;
    /deep/ .el-checkbox__label {
      font-size: 12px;
      padding-left: 4px;
    }
  }
}
</style>
