<template>
  <div class="advice_resolve">
    <div class="layout_inner">
      <el-tabs class="nav_filter" v-model="activeIndex">
        <el-tab-pane name="0" label="实物医嘱分解"></el-tab-pane>
        <el-tab-pane name="1" label="非实物医嘱分解"></el-tab-pane>
        <el-tab-pane name="2" label="实物分解查询"></el-tab-pane>
        <el-tab-pane name="3" label="非实物分解查询"></el-tab-pane>
      </el-tabs>
      <el-row class="main-head">
        <el-col :span="['2'].includes(activeIndex) ? 24 : 20">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true">
            <template slot="termTypes">
              <el-radio-group v-model="queryObj.termTypes">
                <el-radio :label="1">长嘱</el-radio>
                <el-radio :label="0">临嘱</el-radio>
                <el-radio :label="-1">全部</el-radio>
              </el-radio-group>
            </template>
            <template slot="resolve">
              <el-button size="small" @click="resolveEvent">分解</el-button>
            </template>
            <div slot="default" v-if="['0', '1'].includes(activeIndex)"></div>
            <template slot="default" v-else>
              <el-button type="primary" @click="queryList" class="search-btn" size="small">查询</el-button>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="4" class="alg_r">
          <el-button type="primary" size="small" @click="submitEvent" :disabled="isComfirm|| !selectData.length" v-if="['0', '1'].includes(activeIndex)">提交</el-button>
        </el-col>
        <el-col :span="4" class="alg_r">
          <el-button type="default" size="small" @click="printApplyform" :disabled="!selectData.length" v-if="['3'].includes(activeIndex)">打印</el-button>
        </el-col>
      </el-row>
      <div class="main-wrap">
        <advice-show-table
          ref="adviceShow"
          :key="key"
          :visitType="3"
          :showData="allData"
          :specRowClass="rowClass"
          :columns="columns"
          :configOption="configOption"
          :contextList="contextList"
          :arraySpan="arraySpan"
          :noBorderSpan="noBorderSpan"
          :showCheckbox="true"
          setMainGroupId="mainGroupIdFlag"
          @menu="getMenuList"
          @contextSelect="contextSelect"
          @selectionChange="selectionChange"
        >
          <template slot="dispenseStatus"  slot-scope='scope'>
            <span :class="{'cRed': ['70', '180'].includes(String(scope.row.dispenseStatus))}">{{sendStatusList[String(scope.row.dispenseStatus)] || '--'}}</span>
            <el-tooltip  placement="right" effect="light" v-if="['70', '180'].includes(String(scope.row.dispenseStatus))">
              <span slot="content" v-if="scope.row.rejectReason">
                驳回原因：<span v-html="scope.row.rejectReason"></span>
              </span>
              <svg class="icon" aria-hidden="true" v-if="scope.row.rejectReason" style="font-size: 16px;">>
                <use xlink:href="#icon-beibohui1"></use>
              </svg>
            </el-tooltip>
            <i class="iconfont icon-tuike" v-else-if="scope.row.refAdviceLogFLag" @click="refundDrugSearch(scope.row)"></i>
          </template>
          <template slot="executeStatus" slot-scope="scope">
            <span v-if="+scope.row.status === 52" style="color: red">已删除</span>
            <span v-else>待提交</span>
          </template>
        </advice-show-table>
      </div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <!-- 皮试 -->
    <dialog-com v-model="handleVisible" title="皮试结果" @save="savePishiResult" :hospitalizedNumber="curObj.hospitalizedNumber" :patientId="curObj.patientId">
      <ever-form2
        ref="handleform"
        :schema="resultSchema"
        v-model="resultObj"
        labelWidth="80px"
        label-position="right"
        :rules="resultRules"
        :nosubmit="true"
        :showMessage="false"
      >
        <template slot="serviceNameList">
          <div class="wrap">
            <p v-for="(item, index) in resultObj.serviceNameList" :key="item.id" class="serviceName">
              <span class="leftIcon" v-if="resultObj.serviceNameList.length > 1">
                <span class="top" v-if="!index"></span>
                <span class="middle" v-else-if="index < resultObj.serviceNameList.length - 1"></span>
                <span class="bottom" v-else></span>
              </span>
              {{item.serviceName}}
            </p>
          </div>
        </template>
      </ever-form2>
    </dialog-com>
    <!-- 打印申请单 -->
    <applyform-print ref="applyformPrint" :data="applyList" :visible.sync="applyformVisible"></applyform-print>
    <!-- 退库申请 -->
    <!-- <refund-hospital ref="requestRefund" @refund="refund"></refund-hospital> -->
    <refund-dialog
      :data="currentRefund"
      :base-info="baseInfo"
      :visible.sync="refundVisible"
      :is-print="false"
      :only-search="onlySearch"
      refund-type="2"
      @submit="refundSuccess"
      @close="onlySearch = false">
    </refund-dialog>
    <operate-hospital ref="requestOperate" @operate="operate" :able-state="ableStatus"></operate-hospital>
    <!-- 患者列表监听 -->
    <inpatient-refresh
      ref="inpatientRefresh"
      :query="this.$route.query"
      :checks="['bedId', 'areaId', 'providerId']"
      @refresh="refresh"
    ></inpatient-refresh>
  </div>
</template>
<script>
import storage from '@/util/storage'
import api from '@/inpatient/store/advice/resolve'
import exeapi from '@/inpatient/store/advice/execute'
import sysvalue from '@/warehouse/store/sysvalueapi'
import resolveConfig from './resolve.config.js'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import dialogCom from '@/inpatient/components/dialog/dialog.vue'
import { objSortBy } from '@/util/common'
// import refundHospital from './refund.hospital.vue'
import refundDialog from '@/inpatient/components/medical.orders/refund.dialog.vue'
import operateHospital from './operate.hospital.vue'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'
import applyformPrint from '@/inpatient/page/advice.manage/applyform.print.dialog'
import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
import orderFeeApi from '@/inpatient/components/issued.orders/api.js'

export default {
  mixins: [resolveConfig],
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
    return {
      storage,
      api,
      sysvalue,
      activeIndex: '',
      tableData: [],
      totalCount: 0,
      selectData: [],
      selectIds: [],
      curObj: {},
      serviceTypeList: [],
      handleVisible: false,
      isComfirm: false,
      contextList: [],
      columns: [],
      rowClass: '',
      key: false,
      resolveContextList: [
        { id: 'a', name: '删除', disabled: false, methodName: 'deleteEvent' },
        { id: 'b', name: '录入皮试结果', disabled: false, methodName: 'getPishiResult' }
      ],
      searchContextList: [
        { id: '1', name: '申请出库', disabled: false, methodName: 'getMedicineEvent' },
        { id: '2', name: '取消申请', disabled: false, methodName: 'cancelEvent' },
        { id: '3', name: '申请退库', disabled: false, methodName: 'refundEvent' },
        { id: '4', name: '坚持出库', disabled: false, methodName: 'insistDispense' },
        { id: 'b', name: '录入皮试结果', disabled: false, methodName: 'getPishiResult' }
      ],
      pagesize: 20,
      current: 1,
      ableStatus: 0,
      applyformVisible: false,
      applyList: [],
      refundVisible: false,
      currentRefund: [],
      onlySearch: false
    }
  },
  components: {
    adviceShowTable, // 医嘱显示组件
    dialogCom, // dialog弹窗组件
    // refundHospital, // 退库组件
    refundDialog, // 退库组件(批次改版采用同门诊一样的退库)
    inpatientRefresh, // 患者列表监听
    applyformPrint, // 申请单打印组件
    operateHospital // 实物类右键操作弹窗（退库不包括）
  },
  async created () {
    await this.getOptions()
    this.activeIndex = '0'
    this.apiMethodsObj = {
      submitMaterials: {tipInfo: '申请成功'},
      cancelMaterials: {tipInfo: '取消成功'},
      confirmMaterials: {tipInfo: '操作成功'},
    }
  },
  methods: {
    reset () {
      this.current = 1
    },
    // 分页，获取每页页数
    handleSizeChange (pagesize) {
      this.reset()
      this.pagesize = pagesize
      this.queryList()
    },
    handleCurrentChange (current) {
      this.current = current
      this.queryList()
    },
    // 获取出库状态options
    async getOptions () {
      // 过滤值集中三级分类
      let options = await this.sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE')
      options = objSortBy(options, 'orderNumber').reverse()
      options.forEach(item => {
        if (['798', '294', '296'].includes(item.parentId)) {
          this.serviceTypeList.push(item)
        }
      })
    },
    // 查询列表
    queryList () {
      if (['0', '1'].includes(this.activeIndex)) {
        this.queryPreSubmitSplit()
      } else {
        this.queryEvent()
      }
    },
    // 获取查询参数
    getSplitParams () {
      this.queryObj.areaId = storage.getLocalStorage('inpatientKey').split(',')[0]
      this.queryObj.splitTypeFlag = this.activeIndex   // 0 实物类  1 非实物类
      this.queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      this.queryObj.patientId = this.baseInfo.patientId
      this.queryObj.patientName = this.baseInfo.patientName
      if (!this.queryObj.hospitalizedNumber) {
        this.queryObj.hospitalizedNumberList = this.hospitalizedNumberList
      } else if (this.queryObj.hospitalizedNumberList) {
        delete this.queryObj.hospitalizedNumberList
      }
      if (this.queryObj.splitTime && this.queryObj.splitTime.length) {
        this.queryObj.splitTimeFrom = this.queryObj.splitTime[0]
        this.queryObj.splitTimeEnd = this.queryObj.splitTime[1]
      } else {
        delete this.queryObj.splitTimeFrom
        delete this.queryObj.splitTimeEnd
      }
      if (this.queryObj.termTypes > -1) {
        this.queryObj.termType = String(this.queryObj.termTypes)
      } else if (this.queryObj.termType) {
        delete this.queryObj.termType
      }
    },
    // 分解医嘱事件
    async resolveEvent () {
      this.getSplitParams()
      if (this.queryObj.executeStatusList) delete this.queryObj.executeStatusList
      let res = await api.splitOutpatientExecutes(this.queryObj)
      if (res && res.head && res.data.totCount) {
        this.queryPreSubmitSplit()
      } else {
        this.$messageTips(this, 'warning', '无执行单生成', '提示')
        this.queryPreSubmitSplit()
      }
    },
    // 查询分解待提交列表
    async queryPreSubmitSplit () {
      let params = {
        page: this.current,
        pagesize: this.pagesize,
        offset: (this.current - 1) * this.pagesize
      }
      this.getSplitParams()
      params = Object.assign({}, this.queryObj, params)
      if (params.splitTimeFrom || params.splitTimeEnd) {
        params.planTimeFrom = JSON.parse(JSON.stringify(params.splitTimeFrom))
        params.planTimeEnd = JSON.parse(JSON.stringify(params.splitTimeEnd))
        delete params.splitTimeFrom
        delete params.splitTimeEnd
      }
      if (this.queryObj.showDelete) {
        params.executeStatusList = ['51', '52']    // 51待提交  52 已删除
      } else {
        params.executeStatusList = ['51']
      }
      let res = await api.queryPreSubmitSplit(params)
      if (res && res.list && res.list.length) {
        this.tableData = res.list
        this.totalCount = res.totalCount
        this.$nextTick(() => {
          this.$refs.adviceShow.toggle((data) => {
            return data
          })
        })
      } else {
        this.tableData = []
        this.totalCount = 0
      }
    },
    // 已分解列表查询
    async queryEvent () {
      let queryObj = JSON.parse(JSON.stringify(this.queryObj))
      queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
      queryObj.splitTypeFlag = String(Number(this.activeIndex) - 2)   // 0 实物类  1 非实物类
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      if (!queryObj.dispenseStatusList) {
        queryObj.dispenseStatusList = null
      }
      if (!queryObj.hospitalizedNumber) {
        queryObj.hospitalizedNumberList = this.hospitalizedNumberList
      } else if (queryObj.hospitalizedNumberList) {
        delete queryObj.hospitalizedNumberList
      }
      if (queryObj.splitTime && queryObj.splitTime.length) {
        queryObj.splitTimeFrom = queryObj.splitTime[0]
        queryObj.splitTimeEnd = queryObj.splitTime[1]
      } else {
        delete queryObj.splitTimeFrom
        delete queryObj.splitTimeEnd
      }
      if (queryObj.termTypes > -1) {
        queryObj.termType = String(queryObj.termTypes)
      } else if (queryObj.termType) {
        delete queryObj.termType
      }
      queryObj.pagesize = this.pagesize
      queryObj.offset = (this.current - 1) * this.pagesize
      let res = await api.querySplitedList(queryObj)
      if (res && res.list && res.list.length) {
        res.list.forEach((item, index) => {
          item.serialNumber = index
        })
        this.tableData = res.list
        this.totalCount = res.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
      }
    },
    // table checkbox 回调事件
    selectionChange (val) {
      this.selectIds = []
      this.selectData = val
      if (val && val.length) {
        val.map(item => {
          this.selectIds.push(item.id)
        })
      }
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({index}) {
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.fuziData[this.allData[index].mainGroupIdFlag], index, v.id)
      })
    },
    // 操作按钮显示判断逻辑
    getStatusShow (data, index, id) {
      let status = +this.allData[index].dispenseStatus
      // 待提交3、待出库0、已出库190、出库驳回70、退库中150、已退库160、退库驳回180
      if (id === 'a') {  // 删除
        return true
      } else if (id === 'b') {  // 录入皮试结果
        let n0 = 0
        data.forEach(v => {
          if (v.employ === '7') n0++
        })
        return data.length === n0
      } else if (id === '1') {
        // 待提交的，可领药
        // return status === 3
        let data = this.allData[index]
        let fuziData = this.fuziData[data.mainGroupIdFlag]
        if (fuziData.length > 1) {
          return fuziData.reduce((r, item) => {
            return r || +item.dispenseStatus === 3
          }, false)
        } else {
          return status === 3
        }
      } else if (id === '2') {
        // 已提交待出库的，可取消出库
        // return status === 0
        let data = this.allData[index]
        let fuziData = this.fuziData[data.mainGroupIdFlag]
        if (fuziData.length > 1) {
          return fuziData.reduce((r, item) => {
            return r || +item.dispenseStatus === 0
          }, false)
        } else {
          return status === 0
        }
      } else if (id === '3') {
        // 已出库的，中药不可退，可退库
        let data = this.allData[index]
        let fuziData = this.fuziData[data.mainGroupIdFlag]
        if (fuziData.length > 1) {
          return fuziData.reduce((r, item) => {
            return r || +item.dispenseStatus === 190
          }, false)
        } else {
          return status === 190
        }
      } else if (id === '4') {
        // 执行状态是出库驳回的，可坚持领药
        // return status === 70
        let data = this.allData[index]
        let fuziData = this.fuziData[data.mainGroupIdFlag]
        if (fuziData.length > 1) {
          return fuziData.reduce((r, item) => {
            return r || +item.dispenseStatus === 70
          }, false)
        } else {
          return status === 70
        }
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      if (this.requesting) {
        return
      }
      this.requesting = true
      this[item.methodName](this.allData[index], index, this.allData)
      window.setTimeout(() => {
        this.requesting = false
      }, 500)
    },
    // 批量提交
    async submitEvent () {
      if (!this.selectIds || !this.selectIds.length) {
        return this.$messageTips(this, 'warning', '请选择要操作的医嘱', '提示')
      }
      this.isComfirm = true
      const res = await api.submitExecutes(this.selectIds)
      if (res && res.head && res.head.errCode === 0) {
        if (!res.data.failed) {
          this.$messageTips(this, 'success', '提交成功', '提示')
          this.queryPreSubmitSplit()
        } else if (res.data.failed && res.data.stockTipMsg) {
          this.$messageTips(this, 'warning', res.data.stockTipMsg, '提示')
        } else if (res.data.failed === this.selectIds.length) {
          this.$messageTips(this, 'warning', res.data.overDueMsg || '提交失败', '提示')
        } else {
          this.$messageTips(this, 'warning', `提交成功${res.data.success}条，失败${res.data.failed}条，请重新提交！`, '提示')
          this.queryPreSubmitSplit()
        }
        if (res.data.succeedExecutes) {
          this.checkApplyformPrint(res.data.succeedExecutes.map(item => {
            return Object.assign({}, item.doctorAdvice, {
              patientName: item.patientName,
              patientId: item.patientId,
              hospitalizedNumber: item.hospitalizedNumber
            })
          }))
        }
        this.isComfirm = false
      } else {
        this.isComfirm = false
      }
    },
    // 删除
    async deleteEvent (item, index) {
      let postdata = {
        ids: []
      }
      this.fuziData[item.mainGroupIdFlag].forEach(v => {
        postdata.ids.push(v.id)
      })
      const res = await api.deleteSplitExecutes(postdata)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功', '提示')
        this.queryPreSubmitSplit()
      }
    },
    // 录入皮试结果
    getPishiResult (item, index) {
      this.resultObj = this.$ever.createObjFromSchema(this.resultSchema)
      this.resultObj.serviceNameList = this.fuziData[item.mainGroupIdFlag]
      this.curObj = item
      this.handleVisible = true
      this.$nextTick(() => {
        this.$refs.handleform.$refs.form.clearValidate()
      })
    },
    // 皮试结果弹窗确认
    savePishiResult () {
      this.$refs.handleform.$refs.form.validate(async valid => {
        if (valid) {
          let postdata = {
            outpatientExecuteIds: [],
            status: 1,
            result: this.resultObj.pishiResult === '1' ? '阴性' : '阳性',
            remark: this.resultObj.description
          }
          this.fuziData[this.curObj.mainGroupIdFlag].forEach(v => {
            postdata.outpatientExecuteIds.push(v.id)
          })
          const res = await exeapi.executeResultBatch(postdata)
          this.handleVisible = false
          if (res && res.head && res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功', '提示')
            if (this.activeIndex === '2') {
              this.queryEvent()
            } else {
              this.queryPreSubmitSplit()
            }
          } else {
            this.$messageTips(this, 'warning', '保存失败', '提示')
          }
        }
      })
    },
    // 组装需要打印申请单的数据
    async checkApplyformPrint (list) {
      this.applyList = []
      list.forEach(value => {
        if (['800', '801', '802', '2125'].includes(value.serviceType)) {
          this.applyList.push(value)
        }
      })
      if (this.applyList.length) {
        let res = await orderFeeApi.searchCheckConfig({
          code: 'AUTO_PRINT_REQUEST_NOTES',
          defaultValue: '1'
        }).catch(() => false)
        if (!res || +res.value === 0) {
          return
        }
        this.applyformVisible = true
      }
    },
    // 打印申请单
    printApplyform () {
      let print = this.$refs.applyformPrint.getMergePrintData(this.selectData.map(item => {
        return Object.assign({}, item, {id: item.doctorAdviceId})
      }))
      if (print && print.length) {
        mutiplePrint(print)
      }
    },
    // 领药
    async getMedicineEvent (item, index) {
      let data = this.fuziData[item.mainGroupIdFlag]
      if (!data || !data.length) {
        return
      }
      if (data.length === 1) { // 非父子医嘱直接退
        this.operate(data, 'submitMaterials')
      } else { // 父子医嘱多个退
        this.ableStatus = 3
        this.$refs.requestOperate.show(data, '申请出库', 'submitMaterials')
      }
      // let postdata = {ids: [item.id]}
      // const res = await api.submitMaterials(postdata)
      // if (res && res.head && res.head.errCode === 0) {
      //   this.$messageTips(this, 'success', '申请成功', '提示')
      //   this.queryEvent()
      // }
    },
    // 取消领药
    async cancelEvent (item, index) {
      let data = this.fuziData[item.mainGroupIdFlag]
      if (!data || !data.length) {
        return
      }
      if (data.length === 1) { // 非父子医嘱直接退
        this.operate(data, 'cancelMaterials')
      } else { // 父子医嘱多个退
        this.ableStatus = 0
        this.$refs.requestOperate.show(data, '取消申请', 'cancelMaterials')
      }
    },
    // 坚持发药
    async insistDispense (item, index) {
      let data = this.fuziData[item.mainGroupIdFlag]
      if (!data || !data.length) {
        return
      }
      if (data.length === 1) { // 非父子医嘱直接退
        this.operate(data, 'confirmMaterials')
      } else { // 父子医嘱多个退
        this.ableStatus = 70
        this.$refs.requestOperate.show(data, '坚持出库', 'confirmMaterials')
      }
    },
    async operate (data, methodName, cb) {
      if (!data || !data.length) {
        cb && cb()
        return
      }
      let params = {ids: data.map(item => item.id)}
      api[methodName](params).then(res => {
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', this.apiMethodsObj[methodName].tipInfo, '提示')
          this.queryEvent()
          cb && cb()
        }
      }).catch(() => {
        this.queryEvent()
        cb && cb()
      })
    },
    // 退库申请
    async refundEvent (item, index, list) {
      let data = this.fuziData[item.mainGroupIdFlag]
      if (!data || !data.length) {
        return
      }
      this.refundDrug(data)
    },
    // 退库
    refundDrug (item) {
      this.currentRefund = item
      this.refundVisible = true
    },
    // 退库查询
    refundDrugSearch (data) {
      this.currentRefund = [data]
      this.onlySearch = true
      this.refundVisible = true
    },
    refundSuccess () {
      this.$messageTips(this, 'success', '退库申请成功', '提示')
      this.queryEvent()
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
        this.inpatientNumber = list.length
        this.clearInfo && this.clearInfo()
        this.queryList()
        return
      }
      this.inpatientNumber = list.length
    }
  },
  computed: {
    allData () {
      let data = []
      this.tableData.forEach(v => {
        v.mainGroupIdFlag = v.mainGroupId + '_' + v.planTime
        if (v.childAdviceExecuteList && v.childAdviceExecuteList.length) {
          v.childAdviceExecuteList.forEach(m => {
            m.mainGroupIdFlag = m.mainGroupId + '_' + m.planTime
            data.push(m)
          })
        } else {
          data.push(v)
        }
      })
      return data
    },
    fuziData () {
      let obj = {}
      this.allData.forEach(v => {
        if (obj[v.mainGroupIdFlag]) {
          obj[v.mainGroupIdFlag].push(v)
        } else {
          obj[v.mainGroupIdFlag] = [v]
        }
      })
      return obj
    }
  },
  watch: {
    'activeIndex': {
      handler (val) {
        this.tableData = []
        this.columns = this['columns' + val]
        this.configOption = {id: this.tableConfigIds[val]}
        this.key++
        if (val === '0' || val === '1') {
          this.querySchema = this.resolveSchema
          this.contextList = this.resolveContextList
          this.rowClass = 'sendContextRow'
          this.$nextTick(() => {
            setTimeout(() => {
              if (val === '0') {
                this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypes').props.options = this.serviceTypeList.filter(v => {
                  return ['294', '296'].includes(v.parentId) || v.id === '3002' // 协定方放到药品中
                })
              } else {
                this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypes').props.options = this.serviceTypeList.filter(v => {
                  return ['798'].includes(v.parentId) && v.id !== '3002' // 协定方从非药品去除
                })
              }
            }, 150)
          })
        } else {
          let schema = JSON.parse(JSON.stringify(this.searchSchema))
          if (val === '2') {
            this.rowClass = 'sendContextRow'
            this.contextList = this.searchContextList
            schema.splice(2, 1)
          } else {
            this.rowClass = '-1'
            this.contextList = []
            schema.splice(4, 1)
          }
          this.querySchema = schema
        }
        this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
        this.queryObj.termTypes = -1
        this.reset()
        if (['0', '1'].includes(val)) {
          this.queryObj.splitTime = [this.$moment().format('YYYY-MM-DD') + ' 00:00', this.$moment().add(1, 'days').format('YYYY-MM-DD') + ' 00:00']
          this.queryObj.serviceTypes = []
        } else {
          this.queryObj.splitTime = []
          this.queryObj.executeStatusList = ['30']
        }
        if (val === '2') {
          this.$nextTick(() => {
            let statusList = []
            Object.keys(this.sendStatusList).forEach(v => {
              statusList.push({id: v, name: this.sendStatusList[v]})
            })
            this.$ever.getFieldFromSchema(this.querySchema, 'dispenseStatusList').props.options = statusList
          })
        }
        if (val === '3') {
          this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypes').props.options = this.serviceTypeList.filter(v => {
            return ['798'].includes(v.parentId) && v.id !== '3002' // 协定方从非药品去除
          })
          this.queryObj.serviceTypes = []
        }
        if (['0', '1'].includes(this.activeIndex) && this.hospitalizedNumberList.length) {
          this.queryList()
        }
      },
      deep: true
    },
    'queryObj.showDelete': {
      handler (val, old) {
        if (val !== undefined && old !== undefined) {
          this.queryPreSubmitSplit()
        }
      }
    },
    'queryObj': {
      handler (val) {
        this.reset()
        if (!['0', '1'].includes(this.activeIndex)) {
          this.queryEvent()
        }
      },
      deep: true
    },
    'baseInfo': {
      handler (val) {
        this.reset()
        this.queryList()
      },
      deep: true
    },
    'hospitalizedNumberList': {
      handler (val) {
        this.queryList()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.advice_resolve {
  height: 100%;
  .layout_inner {
    padding: 0 0 0 10px;
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-head {
      /deep/.el-form {
        .el-radio-group {
          .el-radio {
            margin-right: 20px;
          }
        }
        .el-checkbox-group {
          margin-top: 6px;
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
    }
  }
  /deep/ .inpatient_base_dialog {
    /deep/ .el-form {
      .wrap {
        padding: 6px 0;
        .serviceName {
          margin: 0;
          line-height: 20px;
          display: flex;
          .leftIcon {
            width: 6px;
            position: relative;
            margin-right: 6px;
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
              height: 8px;
              position: absolute;
              top: 0;
            }
          }
        }
      }
    }
  }
}
</style>
