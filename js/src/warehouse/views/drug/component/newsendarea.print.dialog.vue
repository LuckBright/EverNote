<template>
  <el-dialog
    :visible.sync="visibleFlag"
    width="800"
    class="sendarea-print-dialog"
    @close="closeDialog"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
  >
    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane v-for="(tab, key) in tabs" :label="tab.name" :name="tab.id" :key="key"></el-tab-pane>
    </el-tabs>
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
      <template slot="doctorAdviceName" slot-scope="scope">
        <span class="namesWrap">
          <!-- 父子医嘱标识 -->
          <span v-if="scope.row.mainFlag && !printConfig[Number(activeTab)].isRecipe" class="leftIcons">
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
            <template v-else-if="['301', '302', '303', '304', '3002'].includes(scope.row.serviceType)">
              <!-- 西药、中成药 -->
              <template v-if="['301', '302'].includes(scope.row.serviceType)">
                <drug-info class="bold" :drug-obj="scope.row"></drug-info>
                <svg class="icon fontMargin" aria-hidden="true" v-if="scope.row.employ === '7'" style="font-size: 18px;">
                  <use xlink:href="#iconpishi"></use>
                </svg>
              </template>
              <!-- 中药饮片、中药颗粒 -->
              <template v-if="['303', '304', '3002'].includes(scope.row.serviceType)">
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
              <span class="bold">{{scope.row.doctorAdviceName || scope.row.serviceName}}</span>
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
    </ever-table>
    <span slot="footer">
      <el-dropdown split-button  size="medium" type="primary" trigger="click"
        v-if="totalData.length && selectData.length"
        @click="printAdvice(false)"
        @command="command => {printAdvice(command)}">
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
  import { getPrintData, newPrintEvent } from '@/inpatient/components/sendarea.print.js'
  import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
  import drugInfo from '@/inpatient/components/drug.info'
  import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
  import { specialClassify } from '@/inpatient/components/doctor.state/index.js'
  import { presrciptionPrintConfig } from '@/inpatient/store/prescriptionprintconfig.js'

  export default {
    props: ['baseInfo'],
    data () {
      return {
        specialClassify,
        activeTab: '0',
        waiting: false,
        visibleFlag: false,
        totalData: [],
        currentData: [],
        selectData: [],
        columns: [
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
          }
        ],
        tabs: [],
        printConfig: []
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
      this.printConfig = [presrciptionPrintConfig[1][0]]
    },
    methods: {
      tabClick (tab) {
        this.selectData = []
        let currentData = getPrintData(this.totalData, this.printConfig, Number(tab.index))
        currentData.forEach(item => {
          item = Object.assign(item, item.adviceJson || {})
        })
        this.currentData = this.resetData(currentData)
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
        if (columnIndex < 1) {
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
            return {rowspan: m, colspan: 1}
          } else {
            return {rowspan: 0, colspan: 0}
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
        if (!this.selectData.length || this.waiting) return
        newPrintEvent(JSON.parse(JSON.stringify(this.selectData)), this.printConfig, this.baseInfo, this.$store.state.currentUser.organizationId, flag, Number(this.activeTab))
        this.waiting = true
        setTimeout(() => {
          this.waiting = false
          this.closeDialog()
        }, 500)
      },
      closeDialog () {
        this.visibleFlag = false
        this.selectData = []
        this.$refs.taskTable.$children[0].clearSelection()
        this.activeTab = '0'
      },
      showDialog (data) {
        this.tabs = this.printConfig
        this.totalData = data
        let currentData = getPrintData(this.totalData, this.printConfig, 0)
        currentData.forEach(item => {
          item = Object.assign(item, item.adviceJson || {})
        })
        this.currentData = this.resetData(currentData)
        this.visibleFlag = true
      }
    },
    watch: {
    }
  }
</script>
<style lang="scss" scoped>
.sendarea-print-dialog {
  /deep/ .el-dialog__header {
    padding: 0;
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
      color: #FF4F00;
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
}
</style>
