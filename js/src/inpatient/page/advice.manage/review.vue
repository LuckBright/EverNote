<template>
  <div class="advice_review">
    <div class="review-header">
      <el-tabs class="nav_filter" v-model="activeIndex">
        <el-tab-pane name="0">
          <span slot="label"><el-badge :is-dot="newAdviceFlag" class="tabItem">新开医嘱审核</el-badge></span>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label"><el-badge :is-dot="stopAdviceFlag" class="tabItem">停止医嘱审核</el-badge></span>
        </el-tab-pane>
      </el-tabs>
      <el-row class="main-head">
        <el-col :span="18">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" :is-query="true" @query="queryListbefore">
            <template slot="termTypes" v-if="activeIndex==='0'">
              <el-radio-group v-model="queryObj.termTypes">
                <el-radio :label="1">长嘱</el-radio>
                <el-radio :label="0">临嘱</el-radio>
                <el-radio :label="-1">全部</el-radio>
              </el-radio-group>
            </template>
            <template slot="default">
              <el-button type="primary" @click="search" class="search-btn" size="small">查询</el-button>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="6" class="alg_r">
          <!-- <el-button size="small" @click="adviceReject">批量驳回</el-button> -->
          <el-button type="primary" size="small" @click="verifyAdvice(false)" :disabled="isComfirm || !selectData.length">批量通过</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="review-body">
      <advice-show-table
        ref="adviceShow"
        :visit-type="3"
        :show-data="showTableData"
        :row-class="rowClass"
        :columns="columns"
        :config-option="configOption"
        :context-list="contextList"
        :array-span="arraySpan"
        :no-border-span="noBorderSpan"
        :show-checkbox="true"
        @cell-dblclick="cellDblclick"
        @menu="getMenuList"
        @contextSelect="contextSelect"
        @selectionChange="selectionChange"
      ></advice-show-table>
    </div>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total-count="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
    <div class="review-footer" v-if="curClickHandle.length && activeIndex === '0'">
      <!-- 基于医嘱补费 -->
      <fee-manage
        ref="feeManage"
        v-bind="$attrs"
        :cur-advice="curClickHandle"
        :scene="3"
        :base-info="baseInfo"
        @close="closeFee"
      ></fee-manage>
    </div>
    <dialog-com class="rejectDialog" v-model="handleVisible" title="驳回医嘱" :patient="selectData[0]" @save="adviceRejectConfirm" :hospitalizedNumber="curHandle.hospitalizedNumber" :patientId="curHandle.patientId">
      <ever-form2
        ref="handleform"
        :schema="handleSchema"
        v-model="handleObj"
        label-width="80px"
        label-position="right"
        :rules="rules"
        :nosubmit="true"
        :show-message="true"
      ></ever-form2>
    </dialog-com>
    <applyform-print ref="applyformPrint" :data="applyList" :visible.sync="applyformVisible"></applyform-print>
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
import api from '@/inpatient/store/advice/review'
import sysvalue from '@/warehouse/store/sysvalueapi'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import dialogCom from '@/inpatient/components/dialog/dialog.vue'
import applyformPrint from '@/inpatient/page/advice.manage/applyform.print.dialog'
import feeManage from './fee.manage.vue'
import { HOSPITAL_REVIEW } from '@/util/table-config'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
import { wsConnect, objSortBy } from '@/util/common'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    clearInfo: Function
  },
  data () {
    let handleSchema = [
      {
        name: 'description',
        label: '驳回原因',
        comp: 'textarea',
        props: {
          placeholder: '请输入驳回原因'
        }
      }
    ]
    let handleObj = this.$ever.createObjFromSchema(handleSchema)
    let querySchema = [
      {
        name: 'termTypes',
        label: '',
        comp: 'custom'
      },
      {
        name: 'serviceTypes',
        label: '',
        comp: 'sys-select',
        props: {
          options: [],
          placeholder: '医嘱类型',
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
    queryObj.termTypes = -1
    queryObj.startTime = []
    queryObj.statusList = [1]
    if (this.baseInfo) {
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
    }
    return {
      api,
      sysvalue,
      querySchema,
      queryObj,
      handleSchema,
      handleObj,
      activeIndex: '0',
      tableData: [],
      selectData: [],
      selectIds: [],
      applyList: [],
      curHandle: {},
      curClickHandle: [],
      newAdviceObj: {},
      handleVisible: false,
      isComfirm: false,
      applyformVisible: false,
      newAdviceFlag: false,
      stopAdviceFlag: false,
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
          prop: 'termType',
          label: '长/临',
          showOverflowTooltip: true,
          minWidth: '5%',
          formatter: ({value}) => {
            return value === 0 ? '临时' : '长期'
          }
        },
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: '类型',
          minWidth: '6%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: '内容',
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          prop: 'executeProviderName',
          label: '执行科室',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'stopTime',
          label: '停止时间',
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
          prop: 'stopByName',
          label: '停止医生',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'source',
          prop: 'source',
          label: '渠道',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'storageRoomName',
          label: '库房',
          showOverflowTooltip: true,
          minWidth: '8%'
        }
      ],
      configOption: {id: HOSPITAL_REVIEW},
      rowClass: 'reviewContextRow',
      arraySpan: ['patientName', 'startTime', 'termType', 'executeProviderName', 'stopTime', 'stopByName', 'source', 'storageRoomName', 'doctorName'],
      noBorderSpan: ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust'],
      contextList: [
        { id: '1', name: '通过', disabled: false, methodName: 'verifyAdvice' },
        { id: '2', name: '驳回', disabled: false, methodName: 'adviceReject' }
        // { id: '3', name: '打印申请单', disabled: false, methodName: 'printApplyform' }
      ],
      rules: {
        description: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { max: 150, message: '不能大于150个字符', trigger: 'blur' }
        ]
      },
      totalCount: 0,
      pageSizes: [10, 20, 30, 50, 100],
      pagesize: 20,
      current: 1,
    }
  },
  components: {
    adviceShowTable,   // 医嘱显示组件
    dialogCom,         // dialog弹窗组件
    applyformPrint,    // 申请单打印组件
    feeManage,          // 基于医嘱补费组件
    inpatientRefresh
  },
  created () {
    this.activeIndex = this.$route.query.tabIndex
  },
  mounted () {
    this.getOptions()
    // this.receiveSocket()
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
    // 监听是否有新的待审核的医嘱
    receiveSocket () {
      wsConnect('/exchange/exchange.thc-queue.business.queue.en_queue/routingKey.thc-queue.business.queue.en_queue', (client, d) => {
        if (client) {
          this.newAdviceObj = client
          if (client.new && this.activeIndex === '0' || client.stop && this.activeIndex === '1') {
            this.queryListbefore()
          }
          this.stopAdviceFlag = client.new && this.activeIndex === '1'
          this.newAdviceFlag = client.stop && this.activeIndex === '0'
        }
      })
    },
    // 获取医嘱类型和医嘱状态options
    getOptions () {
      let serviceTypeList = []
      // 过滤值集中三级分类
      this.sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
        options = objSortBy(options, 'orderNumber').reverse()
        options.forEach(item => {
          if (['798', '294', '296'].includes(item.parentId)) {
            serviceTypeList.push(item)
          }
        })
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypes').props.options = serviceTypeList
    },
    // 查询列表
    async queryList () {
      let queryObj = JSON.parse(JSON.stringify(this.queryObj))
      if (queryObj.startTime && queryObj.startTime.length) {
        queryObj.startTimeFrom = queryObj.startTime[0]
        queryObj.startTimeEnd = queryObj.startTime[1]
      } else {
        delete queryObj.startTimeFrom
        delete queryObj.startTimeEnd
      }
      if (queryObj.termTypes > -1) {
        queryObj.termType = String(queryObj.termTypes)
      } else if (queryObj.termType) {
        delete queryObj.termType
      }
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      queryObj.page = this.current
      queryObj.pagesize = this.pagesize
      queryObj.offset = (this.current - 1) * this.pagesize
      this.queryEvent(queryObj)
    },
    async queryEvent (queryObj) {
      let res = await api.list(queryObj)
      this.curClickHandle = []
      if (res && res.list && res.list.length) {
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
        v.disabled = !this.getStatusShow(this.fuziData[this.allData[index].mainGroupId], index, v.id)
      })
    },
    // 操作按钮显示判断逻辑
    getStatusShow (data, index, id) {
      if (id === '1') {
        return true
      } else if (id === '2') {
        return true
      } else if (id === '3') {
        let n = 0
        data.forEach(value => {
          if (['800', '801', '10000', '10001', '10003'].includes(value.serviceType)) {
            n++
          }
        })
        return data.length === n
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      this[item.methodName](this.allData[index], index)
    },
    // 驳回
    adviceReject (item, index) {
      this.curHandle = item
      this.handleObj = this.$ever.createObjFromSchema(this.handleSchema)
      if (this.activeIndex === '0') {
        this.handleVisible = true
        this.$nextTick(() => {
          this.$refs.handleform.$refs.form.clearValidate()
        })
      } else {
        this.adviceRejectConfirm()
      }
    },
    // 驳回弹窗确认
    adviceRejectConfirm () {
      let postdata = {
        ids: [],
        isVerified: 0,
        description: this.handleObj.description
      }
      this.fuziData[this.curHandle.mainGroupId].forEach(v => {
        postdata.ids.push(v.id)
      })
      this.confirmAdvice(postdata, '医嘱驳回')
    },
    // 驳回原因弹窗close事件
    handleClosehandle () {
      this.handleObj.description = ''
    },
    // 审核通过/批量审核
    verifyAdvice (item, index) {
      let ids = []
      this.closeFee()
      if (!item) {
        ids = this.selectIds
      } else {
        this.fuziData[item.mainGroupId].forEach(v => {
          ids.push(v.id)
        })
      }
      this.isComfirm = true
      let postdata = {
        ids: ids,
        isVerified: 1
      }
      this.confirmAdvice(postdata, '医嘱审核')
    },
    // 医嘱审核/医嘱驳回接口调用
    async confirmAdvice (params, tips) {
      let flag = params.isVerified
      // 只有新开医嘱，驳回时需要填写驳回原因，需要校验必填项
      if (!flag && this.activeIndex === '0') {
        this.$refs.handleform.$refs.form.validate(valid => {
          if (valid) {
            flag = true
          }
        })
      }
      if (!flag && this.activeIndex === '0') return false
      const res = await api.confirmAdvice(params).catch(() => false)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', tips + '成功', '提示')
        this.isComfirm = false
        this.handleVisible = false
        this.queryListbefore()
        if (params.isVerified) {
          // 审核通过，判断是否需要打印申请单
          // 此功能暂时不做，后期出新的方案
          // this.checkApplyformPrint()
        }
      } else {
        this.isComfirm = false
        this.handleVisible = false
      }
    },
    // 组装需要打印申请单的数据
    checkApplyformPrint () {
      this.applyList = []
      this.selectData.forEach(value => {
        if (['800', '801', '10000', '10001', '10003'].includes(value.serviceType)) {
          this.applyList.push(value)
        }
      })
      if (this.applyList.length) {
        this.applyformVisible = true
      }
    },
    // 打印申请单
    printApplyform (item, index) {
      let print = this.$refs.applyformPrint.getPrintData([item])
      if (print && print.length) {
        singlePrint(print[0].code, print[0].params)
      }
    },
    // cell双击 click事件
    cellDblclick ({row, column, cell, event}) {
      if (this.activeIndex === '0') {
        let data = []
        this.showTableData.forEach(item => {
          if (item.mainGroupId === row.mainGroupId) {
            data.push(item)
          }
        })
        this.curClickHandle = data
      }
      this.$refs.adviceShow.$refs.taskTable.$refs.everTable.toggleRowSelection(row)
    },
    // 补费组件关闭事件
    closeFee () {
      this.curClickHandle = []
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
    }
  },
  computed: {
    allData () {
      let data = []
      this.tableData.forEach(v => {
        if (v.childAdvices && v.childAdvices.length) {
          data.push(...v.childAdvices)
        } else {
          data.push(v)
        }
      })
      return data
    },
    fuziData () {
      let obj = {}
      this.allData.forEach(v => {
        if (obj[v.mainGroupId]) {
          obj[v.mainGroupId].push(v)
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      return obj
    },
    showTableData () {
      let data = []
      Object.keys(this.fuziData).forEach(item => {
        this.fuziData[item].sort((n1, n2) => {
          return n1.mainFlag - n2.mainFlag
        })
        data = data.concat(this.fuziData[item])
      })
      return data
    }
  },
  watch: {
    activeIndex (val) {
      if (val === '0') {
        this.queryObj.statusList = [1]
        this.queryObj.termTypes = -1
      } else {
        this.queryObj.statusList = [12]
        this.queryObj.termTypes = 1
      }
      this.queryObj.serviceTypes = []
      this.queryObj.startTime = []
      this.reset()
      this.queryList()
    },
    'queryObj.termTypes': {
      handler (val) {
        this.reset()
        this.queryList()
      }
    },
    'baseInfo': {
      handler (val) {
        this.reset()
        this.queryList()
      },
      deep: true
    },
    // 小红点清除(1130不做)
    allData (val) {
      // 如果当前是所有患者，当前是新开，就清除新开小红点，当前是停止，就清除停止小红点
      // 如果当前是某个患者，过滤数据，数据中，只包含当前患者，且医嘱状态与当前一致（当前新开，医嘱都是新开的，当前是停止，医嘱都是停止的），清除当前小红点
      if (!this.queryObj.hospitalizedNumber) {
        if (this.activeIndex === '0') {
          this.newAdviceFlag = false
        } else {
          this.stopAdviceFlag = false
        }
      } else {
        if (Object.keys(this.newAdviceObj).length === 1) {
          let newFlag = 0
          let stopFlag = 0
          this.newAdviceObj[this.queryObj.hospitalizedNumber].forEach(item => {
            if (item.new) {
              newFlag++
            } else {
              stopFlag++
            }
          })
          if (this.newAdviceObj[this.queryObj.hospitalizedNumber] === newFlag) {
            this.newAdviceFlag = false
          }
          if (this.newAdviceObj[this.queryObj.hospitalizedNumber] === stopFlag) {
            this.stopAdviceFlag = false
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.advice_review {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  height: 100%;
  .review-header {
    /deep/ .nav_filter {
      /deep/ .tabItem {
        .el-badge__content {
          top: 8px;
          right: 4px;
        }
      }
    }
  }
  .review-body {
    flex: 1;
    overflow-y: auto;
  }
  .review-footer {
    max-height: 400px;
    margin-top: 10px;
    border-top: 1px solid #d9d9d9;
  }
}
/deep/ .rejectDialog {
  /deep/ .el-dialog__body {
    overflow: visible;
    /deep/ .el-textarea {
      textarea {
        overflow: hidden;
      }
    }
  }
}
</style>
