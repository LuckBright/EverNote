<template>
  <div class="patient-fee-list">
    <slot name="search">
      <el-row class="fee-search">
        <el-col class="query-wrap" :span="18">
          <ever-form2
            ref="queryForm"
            :schema="querySchema"
            v-model="queryObj"
            :nosubmit="true"
            :gutter="10"
            :rules="rules"
            :row-flex="true"
            label-width="0px"
            ></ever-form2>
        </el-col>
        <el-col :span="2">
          <el-button class="search-btn" type="primary" size="small" @click="refresh" :loading="searchLoad">查询</el-button>
        </el-col>
        <el-col class="btn-box" v-if="!disabled" :span="4">
          <el-button type="primary" size="small" :disabled="!this.waitList.length" @click="submit()" :loading="submitLoad">提交</el-button>
          <el-button v-if="hasTpl" type="default" size="small" @click="tplFeeShow = true">费用模版</el-button>
        </el-col>
      </el-row>
    </slot>
    <div class="fee-detail-table" id="fee-wait-table" :class="{'virtual-scroll': virtualScroll}">
      <div class="scroll-bar" v-if="virtualScroll">
        <span class="scroll-block"></span>
      </div>
      <div class="more-load" v-if="loadingMore">
        <i class="el-icon-loading"></i>
      </div>
      <ever-table
        border
        ref="feeTable"
        class="fee-table"
        :style="'transform: translateY('+ tranY +'px)'"
        :loading="false"
        :columns="columns"
        :data="virtualScroll ? curTableData : tableListData"
        :is-pagination="false"
        :is-drag-table="true"
        :row-class-name="rowClassName"
        :config-option="configOption"
        @configChange="configChange"
        @cell-dblclick="editFeeOrder"
      >
        <template slot="feesDoctorName" slot-scope="scope">
          <span>{{scope.row.feesJson && scope.row.feesJson.feesDoctorName || '--'}}</span>
        </template>
        <template slot="orderChargeTime" slot-scope="scope">
          <span>{{scope.row.orderChargeTime || scope.row.chargeTime || '--'}}</span>
        </template>
        <template slot="storageRoomName" slot-scope="scope">
          <span>{{scope.row.feesJson && scope.row.feesJson.storageRoomName || '--'}}</span>
        </template>
        <template slot="spec" slot-scope="scope">
          <!-- 实物类的才有规格 -->
          <span>{{['10008', '299', '300', '301', '302', '303', '304'].includes(scope.row.serviceType) && scope.row.spec || '--'}}</span>
        </template>
        <template slot="count" slot-scope="scope">
          <span>{{scope.row.count + scope.row.countUnitName}}</span>
        </template>
        <template slot="price" slot-scope="scope">
          <span>¥{{(scope.row.price || 0).toFixed(2)}}</span>
        </template>
        <template slot="total" slot-scope="scope">
          <span>¥{{(scope.row.count * scope.row.price).toFixed(2)}}</span>
        </template>
        <template slot="finType" slot-scope="scope">
          <sys-value type="THC_RCM_FIN_TYPE" :code="scope.row.feesJson && scope.row.feesJson.finType"></sys-value>
        </template>
        <template slot="orderItemCreatorName" slot-scope="scope">
          <!-- 提交数据显示计费人和草稿数据计费人不一个字段 -->
          <span v-if="scope.row.isWait">{{scope.row.doctorName}}</span>
          <span v-else>{{scope.row.orderItemCreatorName}}</span>
        </template>
        <template slot="status" slot-scope="scope">
          <span>{{getStatus(scope.row)}}</span>
        </template>
        <template slot="feesType" slot-scope="scope">
          <span>{{getFeesType(scope.row)}}</span>
        </template>
      </ever-table>
    </div>
    
    <!-- 右键操作按钮列表 -->
    <contextmenu v-if="!disabled" :class-name="rowClass" :menu="contextList" @menu="getMenuList" @select="contextSelect"></contextmenu>
    <!-- 模版引用 -->
    <tpl-fee-quote
      v-if="hasTpl && !disabled"
      :providerTypes="$attrs.providerTypes"
      :providerId="baseInfo.providerId"
      :tplFeeShow.sync="tplFeeShow"
      :provider-id="baseInfo.providerId"
      :visit-number="baseInfo.visitNumber"
      v-on="$listeners"
		></tpl-fee-quote>
		<!-- 按数量退 -->
    <fee-refund-dialog
      ref="feeRefund"
      v-bind="$attrs"
      @refund="returnFee"
    ></fee-refund-dialog>
  </div>
</template>
<script>
import i18n from '@/assets/locals/index'
import { OUTPATIENT_FEEADVICE } from '@/util/table-config'
import { objFind } from '@/util/common'
import contextmenu from '@/workspace/components/contextmenu'
import api from './api'
import tplFeeQuote from './tpl.layout.vue'
import feeRefundDialog from './fee.refund.vue'
import adviceapi from '@/inpatient/store/adviceapi'
import storage from '@/util/storage'

export default {
  components: { contextmenu, tplFeeQuote, feeRefundDialog },
  props: {
    providerList: { // 科室
      type: Array,
      default: () => []
    },
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    hasTpl: {
      type: Boolean,
      default: true
    },
    visitType: { // 1-门诊 3-住院
      type: Number,
      default: 1
    },
    getDatasList: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    tFeeLimit: { // 是否具有退费权限
      type: Boolean,
      default: true
    },
    refuseType: { // 禁止退费类型
      type: Array,
      default: () => []
    },
    workspace: String, // 工作站code
    feesType: { // 补费类型 1-医嘱本身 2-追加的 3-护士手动补 4-医技补 5-手麻补 6-门诊计费
      type: Number,
      require: true
    },
    isVirtualScroll: { // 虚拟滚动条
      type: Boolean,
      default: false
    },
    isPage: { // 是否分页
      type: Boolean,
      default: false
    },
    returnFeeTerm: { // 退费条件
      type: Function
    },
    isPart: { // 是否支持部分退
      type: Boolean,
      default: false
    }
  },
  data () {
    let schema = [
      {
        name: 'chargeTime',
        label: '计费时间', // 计费时间
        comp: 'date-picker',
        span: 12,
        labelWidth: '80px',
        props: {
          outformat: 'yyyy-MM-dd',
          showformat: 'yyyy-MM-dd',
          type: 'daterange',
          placeholder: '计费时间'
        }
      },
      {
        name: 'providerId',
        label: '', // 开单科室
        comp: 'sys-select',
        span: 4,
        props: {
          options: this.provider,
          placeholder: '开单科室'
        }
      },
      {
        name: 'executeProviderId',
        label: '', // 执行科室
        comp: 'sys-select',
        span: 4,
        props: {
          options: this.provider,
          placeholder: '执行科室'
        }
      },
      {
        name: 'serviceName',
        label: '', // 项目名称
        comp: 'sys-text',
        span: 4,
        props: {
          placeholder: '项目名称'
        }
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      columns: [],
      configData: {},
      querySchema: schema,
      queryObj: obj,
      waitList: [],
      submitList: [],
      contextList: [],
      tplFeeShow: false,
      submitLoad: false,
      tranY: 0,
      preTableData: [],
      curTableData: [],
      nextTableData: [],
      offset: 0,
      pageSize: 50,
      total: 0,
      loadingMore: false,
      searchLoad: false
    }
  },
  created () {
    this.init()
  },
  computed: {
    tableListData () {
      let list = []
      if (!this.disabled) {
        list.push(...this.submitList.map(item => {
          item.isWait = false
          item.count = item.orderItemQuantity
          item.price = item.orderItemPrice
          return item
        }), ...this.waitList.map(item => {
          item.isWait = true
          return item
        }))
      } else {
        list.push(...this.submitList.map(item => {
          item.isWait = false
          item.count = item.orderItemQuantity
          return item
        }))
      }
      return list
    },
    virtualScroll () {
      if (!this.isVirtualScroll) {
        return false
      }
      if (this.tableListData.length < 220) {
        return false
      }
      let scrollElc = document.querySelector('.fee-detail-table')
      let scrollEl = document.querySelector('.fee-table')
      if (scrollElc.offsetHeight > scrollEl.height) {
        return false
      }
      return true
    }
  },
  methods: {
    init () {
      if ([1, 5].includes(this.visitType)) {
        this.sceneNumber = {
          visitNumber: this.baseInfo.visitNumber
        }
      } else if (this.visitType === 3) {
        this.sceneNumber = {
          hospitalizedNumber: this.baseInfo.hospitalizedNumber
        }
      } else {
        this.sceneNumber = {}
      }
      this.rules = {chargeTime: [], openProviderId: [], executeProviderId: [], serviceName: []}
      this.columns = this.getColumns()
      this.configOption = {id: OUTPATIENT_FEEADVICE}
      this.initPage()
      this.getTableData()
      this.rowClass = 'fee-list-item'
    },
    async getTableData (type) {
      if (this.isPage) {
        await this.getListForPage(true)
      } else {
        await this.getList(type)
      }
      return true
    },
    initPage () {
      this.offset = 0
      this.total = 0
      this.pageSize = 50
    },
    setTicketCode () {
      adviceapi.getTicketCode().then(rs => {
        return rs.head.errCode === 0 && storage.setStorageByClinic('x-ticket-code', rs.data.xTicketCode)
      })
    },
    async getListForPage (type = true) {
      if (!this.$store.state.currentUser || !this.$store.state.currentUser.userId) {
        return
      }
      let param = Object.assign({}, this.sceneNumber, {
        feesType: this.feesType,
        patientId: this.baseInfo.patientId,
        visitType: this.visitType,
        doctorAdviceId: this.baseInfo.adviceId,
        pageSize: this.pageSize,
        offset: this.offset
      })
      if (type) {
        param = Object.assign({}, param, {
          providerId: this.queryObj.providerId,
          executeProviderId: this.queryObj.executeProviderId,
          serviceName: this.queryObj.serviceName,
          startTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).valueOf(),
          endTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[1]).add(1, 'days').valueOf()
        })
      }
      let res
      if (this.getDatasList) {
        res = await this.getDatasList(type, {
          pageSize: this.pageSize,
          offset: this.offset
        })
      } else {
        res = await Promise.all([this.getWaitList(), this.getSubmitList(param)])
      }
      if (this.offset) {
        this.total = res[1].totalCount
        if (this.isVirtualScroll) {
          this.curTableData.unshift(...res[1].data)
        }
        this.submitList.unshift(...res[1].data)
        this.waitList = res[0]
        this.$nextTick(() => {
          this.loadMoreAfter(res[1].data.length)
        })
      } else {
        this.total = res[1].totalCount
        this.submitList = res[1].data
        this.waitList = res[0]
        this.$nextTick(() => {
          this.toBottom()
        })
      }
      this.loadingMore = false
      this.offset += this.pageSize
    },
    // 获取提交区补费项目
    async getList (type) {
      if (!this.$store.state.currentUser || !this.$store.state.currentUser.userId) {
        return
      }
      let param = Object.assign({}, this.sceneNumber, {
        feesType: this.feesType,
        patientId: this.baseInfo.patientId,
        visitType: this.visitType,
        doctorAdviceId: this.baseInfo.adviceId
      })
      if (type) {
        param = Object.assign({}, param, {
          providerId: this.queryObj.providerId,
          executeProviderId: this.queryObj.executeProviderId,
          serviceName: this.queryObj.serviceName,
          startTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[0]).valueOf(),
          endTime: this.queryObj.chargeTime && this.$moment(this.queryObj.chargeTime[1]).add(1, 'days').valueOf()
        })
      }
      let res
      if (this.getDatasList) {
        res = await this.getDatasList(type)
        return
      } else {
        res = await Promise.all([this.getWaitList(), this.getSubmitList(param)])
      }
      this.waitList = res[0]
      this.submitList = res[1].data
      this.total = res[1].total
      this.$nextTick(() => {
        this.toBottom()
      })
    },
    // 费用草稿
    async getWaitList () {
      let params = {
        feesType: this.feesType,
        visitType: this.visitType,
        doctorAdviceId: this.baseInfo.adviceId,
        status: 0
      }
      params = Object.assign({}, params, this.sceneNumber)
      let list = await api.getAdviceFeesInfo(params)
      let data = []
      list && list.forEach(item => {
        if (item.doctorId === this.$store.state.currentUser.userId) {
          data.push(item)
        }
      })
      return data
    },
    // 费用明细
    async getSubmitList (param) {
      let res = await api.getHospitalFeeList(param)
      return res
    },
    loadMoreAfter (length) {
      let el = document.querySelector('.fee-detail-table')
      if (length) {
        if (this.virtualScroll) {
          this.tranY = -30 * length
          el.scrollTop = 0
        } else {
          el.scrollTop = 30 * length
        }
      }
    },
    // 双击编辑
    editFeeOrder ({row}) {
      if (!row.isWait) {
        return
      }
      let self = this
      this.$bus.$emit('edit:feeorder', row, () => {
        self.delWaitData(row)
      })
    },
    // 提交
    submit (cb) {
      this.submitLoad = true
      let currentUser = this.$store.state.currentUser
      let param = Object.assign({}, this.sceneNumber, {
        doctorId: this.$store.state.currentUser.userId,
        patientId: this.baseInfo.patientId,
        providerId: this.baseInfo.providerId,
        visitType: this.visitType,
        orgId: currentUser.organizationId, // 机构id
        tenantId: currentUser.tenantId, // 租户id
        sceneCode: this.workspace // 工作站code
      })
      api.submitSupplementFees(param).then(res => {
        cb && cb()
        this.submitLoad = false
        if (res) {
          this.refresh()
        } else {
          // window.setTimeout(() => {
          //   location.reload()
          // }, 2000)
          this.$emit('subError')
        }
      })
    },
    // 退费前
    returnFeeBefore (order, index) {
      // this.$refs.feeRefund.show([order]) // 门诊住院保持一致支持部分退费
      // 支持部分退
      if (this.isPart) {
        this.$refs.feeRefund.show([order])
        return
      }
      api.getOrderAndItemForRefund({
        adviceFeesId: order.id,
        orderItemId: order.orderItemId
      }).then(res => {
        order.materialOrderId = res.id
        order.materialOrderItemId = res.materialOrderItemId
        this.returnFee(order, order.count)
      })
    },
    // 退费
    returnFee (order, count, cb) {
      let currentUser = this.$store.state.currentUser
      let param = Object.assign({}, this.sceneNumber, {
        // id: order.id,
        orderItemId: order.orderItemId, // 费用明细的id
        orgId: currentUser.organizationId, // 机构id
        tenantId: currentUser.tenantId, // 租户id
        serviceType: order.serviceType,
        serviceId: order.serviceId,
        patientId: order.patientId,
        visitType: this.visitType,
        refundQuantity: count,
        adviceFeesDtoList: [{
          id: order.id,
          serviceType: order.serviceType,
          serviceId: order.serviceId,
          feesType: order.feesType,
          consultId: order.consultId,
          doctorAdviceId: order.doctorAdviceId
        }]
      })
      api.cancelOrRefundSupplementFees(param).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '退费成功')
        }
        this.refresh()
        cb && cb()
        this.setTicketCode()
      }).catch(() => {
        this.refresh()
        cb && cb()
        this.setTicketCode()
      })
    },
    delWaitData (order, index) {
      let param = {
        id: order.id,
        delFlag: 1
      }
      api.updateAdviceFees([param]).then(res => {
        if (res) {
          this.refresh()
        }
      })
    },
    // 刷新列表
    async refresh () {
      this.searchLoad = true
      this.initPage()
      await this.getTableData(true)
      this.searchLoad = false
      return true
    },
    // 获取状态
    getStatus (row) {
      // 草稿状态
      if (row.status === 0) {
        return '未提交'
      }
      // 已记账状态 未支付 已支付 已退费
      switch (row.orderItemStatus) {
        case 0:
          return '待支付'
        case 1:
          return '已支付'
        case -1:
          return '已退费'
        case -2:
          return '退费中'
        case -3:
          return '部分已退费'
        case -4:
          return '部分退费中'
        case -5:
          return '待退费'
        case -7:
          return '已取消'
        default:
          return '异常'
      }
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
    // 右键操作按钮列表触发事件回调
    getMenuList (index) {
      let row = this.tableListData[index]
      this.contextList.forEach((v) => {
        let eventId = v.id
        v.disabled = true
        if (row.isWait && eventId === '3') {
          v.disabled = false
        }
        if (
          !row.isWait && eventId !== '3' && // 已提交的费用
          ![-1, -2, -5].includes(+row.orderItemStatus) && // 退费的费用
          row.count > 0 // 数量大于0的费用
        ) {
          if (this.returnFeeTerm) { // 限制补费条件
            if (this.returnFeeTerm(row)) {
              v.disabled = false
            }
            return
          }
          if (!this.refuseType.includes(row.serviceType) && this.feesType === row.feesType) {
            v.disabled = false
            return
          } // 禁止退费类型（不包含本机构补的费用）
        }
      })
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index) {
      this[item.methodName](this.tableListData[index], index)
    },
    // 行class
    rowClassName ({row}) {
      if (row.isWait) {
        return 'is-wait ' + this.rowClass
      }
      if (row.count < 0 || row.orderItemStatus < 0) {
        return 'refund ' + this.rowClass
      }
      return this.rowClass
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    // 已支付退费显示删除线
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      if ([-1, -2, -5].includes(+row.orderItemStatus) && +this.visitType !== 3) {
        return 'lineGray'
      }
      return ''
    },
    virtualScrollMode (type) {
      if (!type || !this.scrollConfig) {
        this.scrollConfig = {
          loadH: 100,
          loadN: 5,
          loading: false,
          pos: 0
        }
        this.initLoadNumber = 80
      }
      let curLoadPos = this.scrollConfig.pos + this.initLoadNumber
      this.preTableData = this.tableListData.slice(0, this.scrollConfig.pos)
      this.curTableData = this.tableListData.slice(this.scrollConfig.pos, curLoadPos)
      this.nextTableData = this.tableListData.slice(curLoadPos, this.tableListData.length)
      this.$nextTick(() => {
        this.computeScroll()
      })
    },
    addTranScroll () {
      let scrollElc = document.querySelector('.fee-detail-table')
      this.tranY = 0
      scrollElc && scrollElc.addEventListener('mousewheel', this.tranScroll)
    },
    removeTranScroll () {
      let scrollElc = document.querySelector('.fee-detail-table')
      this.tranY = 0
      scrollElc && scrollElc.removeEventListener('mousewheel', this.tranScroll)
    },
    // translate滚动
    tranScroll (e) {
      let scrollElc = document.querySelector('.fee-detail-table')
      let scrollEl = document.querySelector('.fee-table')
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
      this.curTableData.push(...data)
      this.scrollConfig.pos += data.length
      data = this.curTableData.splice(0, data.length)
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
      this.curTableData.unshift(...data)
      data = this.curTableData.splice(-data.length)
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
      let scrollEl = document.querySelector('.fee-table')
      if (!elBar) {
        return
      }
      let barH = elBar.offsetHeight
      let index = this.scrollConfig.pos
      let total = this.tableListData.length
      let curNum = this.curTableData.length
      let blockH = barH * barH / (total * 30)
      let tranIndex = -Math.round(this.tranY / scrollEl.offsetHeight * curNum)
      let top = (index + tranIndex) / total * (barH)
      Object.assign(elBlock.style, {
        height: blockH + 'px',
        top: top + 'px'
      })
    },
    toBottom () {
      let scrollElc = document.querySelector('.fee-detail-table')
      let scrollEl = document.querySelector('.fee-table')
      if (this.virtualScroll) {
        this.preTableData = this.tableListData.slice(0, this.tableListData.length - this.initLoadNumber)
        this.curTableData = this.tableListData.slice(this.tableListData.length - this.initLoadNumber, this.tableListData.length)
        this.nextTableData = []
        this.scrollConfig.pos = this.tableListData.length - this.curTableData.length
        this.$nextTick(() => {
          this.tranY = -scrollEl.offsetHeight + scrollElc.offsetHeight - 20
          this.computeScroll()
        })
      } else {
        scrollElc.scrollTop = scrollEl.offsetHeight - scrollElc.offsetHeight + 20
      }
    },
    // 滚动加载
    addScrollEvent () {
      let el = document.querySelector('.fee-detail-table')
      if (el) {
        el.addEventListener('scroll', this.scrollTopLoad)
      }
    },
    removeScrollEvent () {
      let el = document.querySelector('.fee-detail-table')
      if (el) {
        el.removeEventListener('scroll', this.scrollTopLoad)
      }
    },
    scrollTopLoad (e) {
      if (e.target.scrollTop <= 0 && !this.loadingMore) {
        this.loadingMore = true
        this.getListForPage()
      }
    },
    getColumns () {
      return [
        {
          slot: 'feesType',
          prop: 'feesType',
          label: i18n.t('费用来源'),
          showOverflowTooltip: true,
          minWidth: '15%'
        },
        {
          slot: 'orderChargeTime',
          prop: 'orderChargeTime',
          label: i18n.t('计费时间'),
          minWidth: '15%',
          showOverflowTooltip: true
        },
        {
          prop: 'serviceName',
          label: i18n.t('收费项目'),
          minWidth: '20%',
          showOverflowTooltip: true,
          required: true
        },
        {
          slot: 'spec',
          prop: 'spec',
          label: i18n.t('规格'),
          minWidth: '7%',
          showOverflowTooltip: true
        },
        {
          slot: 'count',
          prop: 'count',
          label: i18n.t('数量'),
          showOverflowTooltip: true,
          minWidth: '8%',
          required: true
        },
        {
          slot: 'price',
          prop: 'price',
          label: i18n.t('单价'),
          showOverflowTooltip: true,
          minWidth: '10%',
          required: true
        },
        {
          slot: 'total',
          props: 'total',
          label: i18n.t('总价'),
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          prop: 'providerName',
          label: i18n.t('开单科室'),
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // undraggable: true
        },
        {
          slot: 'storageRoomName',
          prop: 'storageRoomName',
          label: i18n.t('库房'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // undraggable: true
        },
        {
          slot: 'feesDoctorName',
          prop: 'feesDoctorName',
          label: i18n.t('开单医生'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // undraggable: true
        },
        {
          slot: 'orderItemCreatorName',
          prop: 'orderItemCreatorName',
          label: i18n.t('计费人'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // undraggable: true
        },
        {
          slot: 'finType',
          prop: 'finType',
          label: i18n.t('业务分类'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // undraggable: true
        },
        {
          slot: 'status',
          prop: 'status',
          label: i18n.t('状态'),
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        // {
        //   prop: 'submitTime',
        //   label: i18n.t('提交时间'),
        //   minWidth: '15%',
        //   showOverflowTooltip: true,
        //   hidden: true
        // }
      ]
    }
  },
  watch: {
    'providerList': {
      handler (val) {
        if (!val) {
          return
        }
        objFind(this.querySchema, {name: 'providerId'}).props.options = val
        objFind(this.querySchema, {name: 'executeProviderId'}).props.options = val
      },
      deep: true
    },
    '$store.state.currentUser': {
      handler (val) {
        this.getTableData()
      },
      deep: true
    },
    tFeeLimit: {
      handler (val) {
        if (val) {
          this.contextList = [
            {id: '1', name: '退费', disabled: false, methodName: 'returnFeeBefore'},
            {id: '3', name: '删除', disabled: false, methodName: 'delWaitData'}
          ]
        } else {
          this.contextList = [
            {id: '3', name: '删除', disabled: false, methodName: 'delWaitData'}
          ]
        }
      },
      immediate: true
    },
    'virtualScroll': {
      handler (val, oldVal) {
        this.removeTranScroll()
        this.tranY = 0
        if (val) {
          document.querySelector('.fee-detail-table').scrollTop = 0
          this.virtualScrollMode()
          this.addTranScroll()
        }
      },
      immediate: true
    },
    'offset' (val) {
      this.removeScrollEvent()
      if (val < this.total) {
        this.addScrollEvent()
      }
    },
    'tranY' (val) {
      if (!this.isPage) return
      if (val >= 0 && this.offset < this.total && !this.loadingMore) {
        this.loadingMore = true
        this.getListForPage()
      }
    }
  },
}
</script>
<style lang="scss" scoped>
  .patient-fee-list {
    flex: 1;
    flex-direction: column;
    display: flex;
    overflow-y: auto;
    .fee-detail-table {
      overflow-y: auto;
      /deep/ .ever-table {
        display: flex;
        flex-direction: column;
      }
    }
    .virtual-scroll {
      overflow-y: hidden;
      height: 100%;
      position: relative;
      transform: translateZ(0) translateY(0);
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
    .btn-box {
      text-align: right;
      float: right;
    }
    .query-wrap {
      max-width: 800px;
    }
    .search-btn {
      margin-left: 15px;
    }
    /deep/ .el-table {
      .is-wait {
        background-color: #fef5be;
      }
      .refund {
        color: red;
      }
      .lineGray {
        text-decoration: line-through;
        color: #ccc;
        .labWrap {
          text-decoration: line-through;
        }
      }
      .el-table__body-wrapper {
        overflow-y: hidden;
      }
    }
    .tpl-wrap {
      text-align: right;
      width: 100px;
      float: right;
    }
    .more-load {
      text-align: center;
    }
  }
</style>
