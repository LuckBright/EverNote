<template>
  <div class="advice-info" :style="{height: dragHeight}">
    <div
      class="drag-line"
      :style="'transform: translateY('+ transY +'px)'"
      @mousedown="mousedown"
    ></div>
    <span class="iconfont icon-exit close-btn" @click="close"></span>
    <el-tabs v-model="activeName">
      <el-tab-pane label="医嘱费用" name="aboutFee">
        <fee-manage ref="feeManage" :cur-advice="curAdvice" :scene="3" :base-info="baseInfo" :disabled="true" :max-height="maxHeight > 150 ? maxHeight : 150"></fee-manage>
      </el-tab-pane>
      <el-tab-pane label="分解记录" name="history">
        <el-row type="flex" justify="end">
          <el-checkbox v-model="useless" @change="uselessChange">显示无效记录</el-checkbox>
        </el-row>
        <ever-table
          border
          :loading="false"
          :columns="columns"
          :data="tableData"
          :is-pagination="false"
          :is-drag-table="true"
          :max-height="maxHeight > 150 ? maxHeight : 150"
          :cell-class-name="cellClassName"
          :span-method="arraySpanMethod"
          :config-option="configOption"
          @configChange="configChange"
        >
          <template slot="spec" slot-scope="scope">
            <!-- 实物类的才有规格 -->
            <span>{{['10008', '299', '300', '301', '302', '303', '304'].includes(scope.row.serviceType) && scope.row.spec || '--'}}</span>
          </template>
          <template slot="count" slot-scope="scope">
            <span v-if="scope.row.count !== null && scope.row.count !== undefined">{{scope.row.count + scope.row.countUnitName}}</span>
            <span v-else>--</span>
          </template>
          <template slot="price" slot-scope="scope">
            <span>¥{{(scope.row.price || 0).toFixed(2)}}</span>
          </template>
          <template slot="finType" slot-scope="scope">
            <sys-value v-if="scope.row.finType" type="THC_RCM_FIN_TYPE" :code="scope.row.finType"></sys-value>
            <span v-else>--</span>
          </template>
          <template slot="feesType" slot-scope="scope">
            <span>{{getFeesType(scope.row)}}</span>
          </template>
        </ever-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            v-if="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="pagination.page"
            :pagesize="pagination.pagesize"
          ></ever-pagination>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import feeManage from './fee.manage.vue'
import i18n from '@/assets/locals/index'
import api from '@/inpatient/store/advice/resolve'
import { HOSPITAL_RESOLVE_HISTORY } from '@/util/table-config'

// HOSPITAL_RESOLVE_HISTORY
export default {
  components: {
    feeManage
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    curAdvice: {
      type: Array
    }
  },
  data () {
    return {
      activeName: 'aboutFee',
      tableData: [],
      columns: [],
      totalCount: 0,
      pagination: {
        page: 1,
        pagesize: 10
      },
      useless: false,
      transY: 0,
      dragHeight: 'auto',
      maxHeight: 150
    }
  },
  created () {
    this.configOption = {id: HOSPITAL_RESOLVE_HISTORY}
    this.useless = JSON.parse(localStorage.getItem('useless'))
    this.columns = this.getColumns()
    this.dragMove = {
      y: 0,
      moving: false
    }
    // 拖拽容器高度
    document.removeEventListener('mousemove', this.mousemove)
    document.addEventListener('mousemove', this.mousemove)
    document.removeEventListener('mouseup', this.mouseup)
    document.addEventListener('mouseup', this.mouseup)
  },
  methods: {
    mousedown (e) {
      this.dragMove.moving = true
      this.dragMove.y = e.pageY
    },
    mousemove (e) {
      if (!this.dragMove.moving) {
        return
      }
      this.transY = e.pageY - this.dragMove.y
    },
    mouseup (e) {
      if (!this.dragMove.moving) {
        return
      }
      let h = document.querySelector('.advice-info').clientHeight
      if (Math.abs(this.transY) > 3) { // 自适应容器的高度
        this.maxHeight -= this.transY
        this.dragHeight = h - this.transY + 'px'
      }
      this.dragMove.moving = false
      this.dragMove.y = 0
      this.transY = 0
    },
    close () {
      this.$emit('close')
    },
    async getHistory () {
      let params = {
        doctorAdviceIds: this.curAdvice.map(item => item.id),
        executeRecordFilter: this.useless ? 1 : 0,
        pagesize: this.pagination.pagesize,
        offset: this.pagination.pagesize * (this.pagination.page - 1)
      }
      let res = await api.querySplitedRecordList(params)
      let list = []
      res.data.forEach(item => {
        let executeObj = {
          splitTime: item.splitTime,
          splitName: item.splitName,
          submitTime: item.submitTime,
          submitName: item.submitName,
          completeTime: item.completeTime,
          executeName: item.executeName,
          planTime: item.planTime,
          id: item.id
        }
        if (!item.serviceOrderItemDtos || !item.serviceOrderItemDtos.length) {
          list.push(executeObj)
          return
        }
        let len = item.serviceOrderItemDtos.length
        item.serviceOrderItemDtos.forEach((v, index) => {
          list.push(Object.assign({}, executeObj, {
            serviceName: v.serviceName,
            serviceType: v.serviceClassification,
            finType: v.feesJson.finType,
            feesType: v.feesType,
            spec: v.spec,
            price: v.sellingPrice,
            count: v.quantity,
            countUnitName: v.countUnitName,
            index: index,
            len: len
          }))
        })
      })
      this.tableData = list
      this.totalCount = res.totalCount
    },
    handleSizeChange (size) {
      this.pagination.pagesize = size
      this.getHistory()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.getHistory()
    },
    uselessChange () {
      localStorage.setItem('useless', JSON.stringify(this.useless))
      this.getHistory()
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (['splitTime', 'splitName', 'submitTime', 'submitName', 'completeTime', 'executeName', 'planTime'].includes(column.property)) {
        if (!row.index) {
          return [row.len || 1, 1]
        } else {
          return [0, 0]
        }
      }
      return [1, 1]
    },
    // 行class
    cellClassName ({row, column}) {
      if (row.count < 0 && ['serviceName', 'finType', 'feesType', 'spec', 'price', 'count'].includes(column.property)) {
        return 'refund'
      }
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    // 获取费用来源
    getFeesType (row) {
      if (!row.feesType) {
        return '--'
      }
      // 已记账状态 未支付 已支付 已退费
      switch (row.feesType) {
        case 1:
          return '医嘱费用'
        case 2:
          return '自动追加'
        case 3:
          return '护士计费'
        case 4:
          return '医技计费'
        case 5:
          return '手术计费'
        case 6:
          return '门诊收费站'
        default:
          return '--'
      }
    },
    getColumns () {
      return [{
        prop: 'splitTime',
        label: i18n.t('分解时间'),
        showOverflowTooltip: true,
        minWidth: '10%',
        hidden: true
      },
      {
        prop: 'splitName',
        label: i18n.t('分解人'),
        minWidth: '10%',
        showOverflowTooltip: true,
        hidden: true
      },
      {
        prop: 'submitTime',
        label: i18n.t('分解提交时间'),
        minWidth: '10%',
        showOverflowTooltip: true
      },
      {
        prop: 'submitName',
        label: i18n.t('分解提交人'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'completeTime',
        label: i18n.t('执行时间'),
        showOverflowTooltip: true,
        minWidth: '10%',
      },
      {
        prop: 'executeName',
        label: i18n.t('执行人'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'planTime',
        label: i18n.t('计划时间'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'serviceName',
        label: i18n.t('收费项目'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        slot: 'finType',
        prop: 'finType',
        label: i18n.t('业务分类'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        slot: 'feesType',
        prop: 'feesType',
        label: i18n.t('费用来源'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'spec',
        label: i18n.t('规格'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'price',
        label: i18n.t('单价'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        slot: 'count',
        prop: 'count',
        label: i18n.t('数量'),
        showOverflowTooltip: true,
        minWidth: '10%'
      }]
    }
  },
  watch: {
    curAdvice: {
      handler (val) {
        this.activeName = 'aboutFee'
        this.tableData = []
      },
      deep: true
    },
    activeName (val) {
      if (val === 'history') {
        this.getHistory()
      } else {
        this.$refs.feeManage && this.$refs.feeManage.getTableList()
      }
    }
  },
  destroyed () {
    document.removeEventListener('mousemove', this.mousemove)
    document.removeEventListener('mouseup', this.mouseup)
  }
}
</script>
<style lang="scss" scoped>
.advice-info {
  position: relative;
  .drag-line {
    position: absolute;
    width: 100%;
    height: 3px;
    border-top: 1px dotted transparent;
    z-index: 10;
    top: 0;
    left: 0;
    &:hover {
      cursor: row-resize;
      border-top-color: red;
    }
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #999;
    font-size: 12px;
    margin-top: 3px;
    cursor: pointer;
    z-index: 10;
  }
  /deep/ .el-table{
    .refund {
      color: red;
    }
    tr:hover td {
      background: transparent;
    }
  } 
  /deep/ .fee-manage {
    padding-right: 0;
  }
}
</style>
