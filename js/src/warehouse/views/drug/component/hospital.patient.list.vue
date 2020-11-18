<template>
  <div class="pos_re flex_column_full">
    <div class="flex_column_full">
      <ever-table
        ref="tableList"
        table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
        class="flex_scroll flex_hidden"
        :table-loading="loading"
        :columns="columns"
        :data="tableData"
        :is-single-table="true"
        :show-checkbox="showCheckbox"
        :checkbox-width="checkboxWidth"
        :table-default-cell-value="tableDefaultCellValue"
        :selectable="selectable"
        :is-record-url-params="false"
        @selection-change="handleSelectionChange"
        @row-click="handlerRowClick"
        @eventChange="eventChange">
        <template v-for="column in renderColumns" :slot="column.slotName">
          <el-table-column
            :key="column.prop"
            :slot="column.prop"
            :label="column.label"
            :width="column.width"
            :prop="column.prop">
            <template slot="header" slot-scope="scope">
              {{column.label}}
            </template>
            <template slot-scope="scope">
              <coltd-functional :row="scope.row" :index="scope.$index" :pageType="pageType" :render="column.render" :td-key="column.prop"></coltd-functional>
            </template>
          </el-table-column>
        </template>
      </ever-table>
    </div>
    <!-- 分页 -->
    <ever-pagination
      class="pagination"
      justify="center"
      layout="total, prev, pager, next, sizes"
      :pagesize="pagesize"
      :no-bg="true"
      :small="true"
      :pager-count="5"
      :total-count="totalCount"
      :current="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </ever-pagination>
    <el-alert
      v-if="showAlert"
      class="pos_ab alert"
      :closable="false"
      type="info"
      center>
      <slot>
        <div class="cGray6" v-html="alertTitle"></div>
      </slot>
    </el-alert>
  </div>
</template>

<script>
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
import { pick, debounce } from 'lodash'
import Parameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'
import list from '@/util/list'
const PAGE_FIELD = { // 不同页面不同参数
  3: {
    name: 'getLackPatient',
    field: ['storageRoomId', 'processConfigurationId', 'offset', 'pagesize', 'patientId', 'uddCode', 'executeProviderId'] // 缺货页面 缺货接口参数
  },
  4: {
    name: 'getUddRecord',
    field: ['storageRoomId', 'localMaterialId', 'processConfigurationId', 'patientId', 'executeProviderId', 'uddCode', 'termType', 'recordStartDate', 'recordEndDate', 'offset', 'pagesize']
  },
  5: {
    name: 'getLackPatients',
    field: ['storageRoomId', 'processConfigurationId', 'offset', 'pagesize', 'patientId', 'uddCode', 'executeProviderId'] // 缺货页面 缺货接口参数
  },
}
export default {
  props: {
    name: String, // api接口名称
    isDispensing: {
      type: Boolean,
      default: false
    },
    pageType: { // 页面标识
      type: Number,
      default: 0
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    customParams: { // 每个业务场景有不同的参数(发药记录、缺货任务等)个性化参数
      type: Object,
      default: () => ({})
    },
    columns: { // evertable列
      type: Array,
      default: () => []
    },
  },
  mixins: [Parameters, list],
  data () {
    return {
      tableDefaultCellValue,
      checkboxWidth: 25,
      tableData: [],
      queryObj: { requestSwitch: true },
      loading: false,
      processConfig: this.$store.state.processConfig.thisStorageroomProcessConfig, // 流程配置
      activeId: null,
      showAlert: false,
      showAlertNum: 0,
      queryParams: null,
      timer: null,
      tipTimer: null
    }
  },
  mounted () {
    this.$bus.$on('hospital:get-patient-task-list', (params) => { // 接收重新查询患者列表命令
      this.list(this.queryParams = params)
    })
    this.$bus.$on('hospital:batch-print-after-get-patient-task-list', (flag, num) => {
      // length 任务打印页面批量打印后 由于左边患者列表为走接口更新，手动传递需要减去 totalCount 的数量
      this.totalCount = this.totalCount - num
      // flag 任务打印页面批量打印后 1: 更新患者列表、0：不更新患者列表，但清空所有选择列表
      flag ? this.list(this.queryParams) : this.$refs.tableList.$refs.everTable.clearSelection()
    })
    this.$bus.$on('hospital:notify-patient-list-mark', (changeObj, delFlag, selected) => { // 添加或删除患者列表异常／缺货标识
      this.setTableDataMark(changeObj, delFlag, selected)
    })
    this.onNotifyReceiveSokectMessage() // 接收socket消息
  },
  destroyed () {
    this.$bus.$off('hospital:get-patient-task-list')
    this.$bus.$off('hospital:batch-print-after-get-patient-task-list')
    this.$bus.$off('hospital:notify-patient-list-mark')
    this.$bus.$off('notify-receive-sokect-message')
  },
  methods: {
    onNotifyReceiveSokectMessage () { // 接收socket派发消息内容
      this.$bus.$on('notify-receive-sokect-message', (data, setting) => {
        const index = this.getPatientIndex(data)
        if (index > -1) {
          this.tableData.splice(index, 1, data)
          if (this.isEqual(this.commonParams, data)) { // 当前查看患者有新数据
            if (!this.tipTimer) {
              this.tipTimer = true
              this.$alert(`患者数据有更新，请刷新页面查看新数据。`, '提示', {
                type: 'warning',
                confirmButtonText: '确定'
              }).then(() => {})
              setTimeout(() => {
                this.tipTimer = null
              }, 2000)
            }
          }
        } else {
          this.tableData.push(data)
          if (this.tableData.length === 1) {
            this.setCurrentRow(data)
          }
        }
        this.emitNotifySearchComponent(data, true) // 派发通知给住院搜索组件(更新病区、给药途径、执行时间等查询参数)
      })
    },
    isEqual (conf, conf1) { // 是否是同一个患者
      const { patientId, hospitalizedNumber, employ, implementTime, areaId } = conf
      const { patientId: nPatientId, hospitalizedNumber: nHospitalizedNumber, employ: nEmploy, implementTime: nImplementTime, areaId: nAreaId } = conf1
      return patientId === nPatientId && hospitalizedNumber === nHospitalizedNumber && employ === nEmploy && implementTime === nImplementTime && areaId === nAreaId
    },
    getPatientIndex (data) {
      const { patientId, hospitalizedNumber, employ, implementTime, areaId } = data
      return this.tableData.findIndex(item => item.patientId === patientId && item.hospitalizedNumber === hospitalizedNumber && item.employ === employ && item.implementTime === implementTime && item.areaId === areaId)
    },
    setTableDataMark (obj, delFlag, selected) { // 操作患者列表异常或缺货标识
      const index = this.getPatientIndex(this.commonParams)
      if (obj) {
        const row = this.tableData[index]
        // 当标记异常标识时，清除患者列表选中项数据（本条
        this.$refs.tableList.$refs.everTable.toggleRowSelection(row, !!(obj.identification ? 0 : selected))
        Object.assign(row, obj)
        this.selectable(row)
      }
      if (delFlag) {
        this.emitNotifySearchComponent(this.tableData[index], !!(this.tableData.length - 1)) // 派发通知给住院搜索组件(更新病区、给药途径、执行时间等查询参数)
        this.tableData.splice(index, 1)
        this.totalCount = this.totalCount - 1
        if (this.tableData.length) {
          const rowIndex = index === this.tableData.length ? index - 1 : index
          this.setCurrentRow(this.tableData[rowIndex])
        }
      }
    },
    /**
     *  emitNotifySearchComponent 派发通知给住院搜索组件
     * {Object} row 当前行患者数据
     * {Boolean} isPush  true：添加  false：删除
    */
    emitNotifySearchComponent: debounce(function (row, isPush) { // 派发通知给住院搜索组件(更新病区、给药途径、执行时间等查询参数)
      if (!row) return
      this.$bus.$emit('notify-update-search-params', row, isPush)
    }, 500),
    selectable (row) {
      const { identification, shortage, status } = row
      return !(identification || shortage === 23 || status === 4)
    },
    handleSelectionChange (selection) {
      // 1:患者列表选择项 2:发药明细选择项noPrintCode
      this.$emit('selection-change', selection, 1)
    },
    list (params) {
      if (!params) params = Object.assign({}, this.queryParams)
      params.pagesize = this.pagesize
      params.offset = this.offset
      const hasField = PAGE_FIELD[this.isDispensing ? 5 : this.pageType] // 是否需要使用自定义页面接口请求和参数请求
      this.uddApi[(hasField && hasField.name) || 'getPatientTaskList']((hasField && hasField.field) ? pick(params, hasField.field) : params).then(res => {
        this.tableData = res
        this.totalCount = res.totalCount || 0
        if (res.length) {
          this.$nextTick(_ => {
            clearTimeout(this.timer)
            const { patientId, hospitalizedNumber } = params
            if (!patientId || hospitalizedNumber) {
              this.showAlert = true
              this.showAlertNum = this.tableData.length
              this.timer = setTimeout(_ => {
                this.showAlert = false
              }, 2000)
            }
            this.setCurrentRow(this.tableData[0])
          })
        } else {
          clearTimeout(this.timer)
          this.showAlert = false
          this.setCurrentRow(null)
        }
      })
    },
    handlerRowClick ({ row }) {
      const { mqMsg } = row
      if (mqMsg) {
        const index = this.getPatientIndex(row)
        this.tableData.splice(index, 1, Object.assign(row, { mqMsg: 0 }))
      }
      this.setCurrentRow(row)
    },
    setCurrentRow (row) {
      if (row) {
        // 更新公共患者信息数据
        // 患者id 患者住院号 执行途径 给药时间四个字段确定一条数据
        Object.assign(this.commonParams, pick(row, ['patientId', 'hospitalizedNumber', 'employ', 'implementTime', 'areaId']))
        this.$nextTick(() => {
          this.$refs.tableList && this.$refs.tableList.$refs && this.$refs.tableList.$refs.everTable.setCurrentRow(row)
        })
      }
      // row为null时通知清空页面右侧 所有 udd 和 task
      this.$bus.$emit('hospital:paitent-row-click', row, this.queryParams)
    },
    eventChange () {
      console.log('eventChange')
    }
  },
  computed: {
    alertTitle () {
      return `符合条件的结果 <strong>${this.showAlertNum}</strong> 条`
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
  },
  components: {
    ColtdFunctional
  },
}
</script>
<style lang="scss" scoped>
.pagination /deep/ .el-pagination .el-input__inner {
  height: 20px;
}
.el-alert--info.is-light {
  opacity: .9;
}
.alert {
  left: 50%; top: 50%; width: 300px; margin-top: -17px; margin-left: -150px;
  /deep/ .el-alert__description {
    margin: 0
  }
}
</style>
