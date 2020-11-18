<template>
  <div class="layout_box" id="waitarea" @selectstart.prevent>
    <div class="headarea">
      <el-button size="small" @click="printAdvice" :disabled="true">打印</el-button>
      <el-button v-if="!disabled" size="small" type="primary" @click="sendWaitData" :loading="isSending" :disabled="!waitSelect || !waitSelect.length">提交</el-button>
    </div>
    <div class="mainarea">
      <advice-show-table
        ref="adviceShow"
        :visit-type="visitType"
        :loading="loading"
        :show-data="tableData"
        :columns="columns"
        :config-option="configOption"
        :context-list="contextList"
        :array-span="arraySpan"
        :no-border-span="noBorderSpan"
        :is-drag-cancel="isDragCancel"
        :show-checkbox="!noOperate"
        :selectable="selectable"
        :no-operate="noOperate"
        :status-relation="statusRelation"
        @cell-dblclick="editWaitService"
        @menu="getMenuList"
        @contextSelect="contextSelect"
        @dragSelect="dragSelect"
        @selectionChange="selectionChange"
      >
        <template slot="dispenseStatus" slot-scope="scope">
          <span v-if="!['300', '301', '302', '303', '304', '800'].includes(scope.row.serviceType)">--</span>
          <span v-else :class="{'is-error': [2, 70].includes(+scope.row.outDrugStatus)}">
            <span>{{scope.row.outDrugStatus | getOutDrugStatus}}</span>
            <i class="iconfont icon-tuike" v-if="scope.row.refoundFlag" @click="refundSearch(scope.row)"></i>
          </span>
          <el-tooltip  placement="right" effect="light" v-if="[2, 70].includes(+scope.row.outDrugStatus)">
            <span slot="content">驳回原因：<span v-html="scope.row.refuseReason"></span></span>
            <i class="iconfont icon-yichang cRed"></i>
          </el-tooltip>
        </template>
      </advice-show-table>
      <!-- 已提交区组件 -->
      <sendarea-csa
        ref="sendarea"
        v-if="!noOperate"
        :base-info="baseInfo"
        :send-data="sendData"
        :disabled="disabled"
        :visit-type="+visitType"
        @change="sendDataChange"
      ></sendarea-csa>
      <!-- 医嘱打印组件 -->
      <advice-print :visible.sync="printvisible" v-if="!noOperate"></advice-print>
    </div>
  </div>
</template>
<script>
import waitareajs from '@/inpatient/components/waitarea.new.js'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import advicePrint from '@/inpatient/components/dialog-print.vue'
import { CSA_SENDADVICE } from '@/util/table-config'
import i18n from '@/assets/locals/index'
import sendareaCsa from '@/csa/components/sendarea.csa.vue'
import api from '@/csa/store/advice'
import { PAY_STATUS, OUTPATIENT_ADVICE_STATUS } from '@/util/common'

export default {
  mixins: [waitareajs],
  props: {
    noOperate: {       // 是否不需要操作，只是展示内容，true: 只展示，false: 正常，允许操作
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    visitType: { // 场景 1门诊 2急诊 3住院
      type: Number,
      required: true
    },
    adviceStage: { // 手术医嘱阶段
      type: Number,
      required: true
    }
  },
  data () {
    return {
      queryObj: {},
      isSending: false,
      isShowSend: true,
      printvisible: false,
      selectData: [],
      selectIds: [],
      curStatus: ''
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    // 初始化
    init () {
      this.statusRelation = OUTPATIENT_ADVICE_STATUS
      this.columns = this.getColumns()
      this.arraySpan = ['startTime', 'termType', 'executeProviderName', 'stopTime', 'stopByName', 'source', 'storageRoomName', 'doctorName']
      this.noBorderSpan = ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status', 'advicePrice', 'dispenseStatus']
      this.configOption = {id: CSA_SENDADVICE}
      if (!this.noOperate && !this.disabled) {
        this.search()
      } else {
        this.getRecipeData()
      }
    },
    // 将接口返回的数据重组，父子医嘱放在一起
    resetData (data) {
      let list = []
      let obj = {}
      data.forEach((v, index) => {
        v.refoundFlag = v.refAdviceLogFLag
        v.refuseReason = v.adviceJson.remarks || v.adviceJson.description
        delete v.refAdviceLogFLag
        if (obj[v.mainGroupId]) {
          if (v.mainFlag === 1) {
            obj[v.mainGroupId].unshift(v)
          } else {
            obj[v.mainGroupId].push(v)
          }
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      Object.values(obj).forEach(item => {
        list = list.concat(item)
      })
      return list
    },
    // 获取查询医嘱列表参数
    getParams (query) {
      let params = {
        tenantId: this.$store.state.currentUser.tenantId,
        orgId: this.$store.state.currentUser.organizationId,
        patientId: this.baseInfo.patientId,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        channel: 1,    // 来源渠道，1-pc, 2-移动端
        visitType: this.visitType
      }
      if (!query) {
        return params
      }
      return Object.assign(params, query)
    },
    // 获取待提交列表
    async getWaitData () {
      let tempWaitData = []
      let params = this.getParams({
        adviceStage: this.adviceStage,
        sourceExecuteId: this.baseInfo.executeId,
        statusList: [0],
        orderByFlag: 2 // 0：按照医嘱序号反序排序（之前的排序方式）；1: 按照重整医嘱时间排序,2：按照医嘱序号正序排序（之前的排序方式）；1
      })
      let res = await this.recipeapi.getDoctorAdviceInfo(params)
      if (res && res.data && res.data.length) {
        res.data.forEach(item => {
          if (item.doctorId === this.$store.state.currentUser.userId) {
            tempWaitData.push(item)
          }
        })
        this.waitData = this.resetData(tempWaitData)
      } else {
        this.waitData = []
      }
    },
    async getRecipeData () {
      let params = {
        adviceStage: this.adviceStage,
        sourceExecuteId: this.baseInfo.executeId
      }
      let res = await api.queryDoctorAdvice(params)
      if (res.length) {
        this.sendData = this.resetData(res)
        return
      }
      this.sendData = []
    },
    // 选中列表，默认选中待提交区，参数不为0，选中已提交区
    selectWaitTable (status = 0) {
      this.$nextTick(() => {
        this.$refs.adviceShow.toggle((data) => {
          let list = []
          data.forEach(item => {
            if (status === 0) {
              if (item.status === 0) {
                list.push(item)
              }
            } else {
              if (item.status !== 0) {
                list.push(item)
              }
            }
          })
          return list
        })
      })
    },
    // checkbox 是否可用,勾选待提交区，已提交区禁用，反之
    selectable (row, index) {
      if (this.curStatus) {
        if (this.curStatus === '0') {
          return String(row.status) === '0'
        } else {
          return String(row.status) !== '0'
        }
      } else {
        return !this.disabled
      }
    },
    // checkbox 复选回调
    selectionChange (selection) {
      // 如果待提交和已提交都是未勾选状态，全选，勾选已提交区域，去掉待提交区域的勾选
      if (selection.length === this.waitData.length + this.sendData.length && selection.length !== this.waitData.length && selection.length !== this.sendData.length) {
        this.selectData = selection.filter(item => {
          return String(item.status) !== '0'
        })
        this.selectWaitTable(1)
      } else {
        this.selectData = selection
      }
      if (!selection.length) {
        this.curStatus = ''
      }
      this.selectIds = []
      this.selectData.forEach(v => {
        this.curStatus = String(v.status)
        this.selectIds.push(v.id)
      })
    },
    // 医嘱打印事件
    printAdvice () {
      this.printvisible = true
    },
    // 撤回，取消回调
    sendDataChange (flag) {
      if (!flag) {
        this.search()
      } else {
        this.getRecipeData()
      }
    },
    // 提交待提交区域数据
    async sendWaitData () {
      this.isSending = true
      let params = this.selectData.map(item => item.id)
      let res = await api.submitDoctorAdvices(params)
      if (res) {
        this.$messageTips(this, 'success', '提交成功')
        this.search()
      }
      this.isSending = false
    },
    // 查询
    async search () {
      await this.getRecipeData()
      // 添加待提交区列表更新，防止其他人操作了待提交区数据，当前只查询更新已提交列表，出现数据重复问题
      this.getWaitData()
    },
    // 通过退库标示查询退库记录
    refundSearch (row) {
      this.$refs.sendarea && this.$refs.sendarea.refundDrugSearch([row])
    },
    sortByTime (key) {
      // 排序规则：父子医嘱不能分开，默认按开始时间排序，开始时间相同按serialNumber序号排序,待提交区不参与排序
      return function (data, dir, isReform) {
        let waitDataList = []
        let sendDataList = []
        let sendGroupList = []
        let mainGroupObj = {}

        data.forEach(item => {
          if (item.spanAll && !isReform) {
            return
          }
          let groupId = item.mainGroupId
          let mainFlag = item.mainFlag
          if (!mainGroupObj[groupId]) {
            mainGroupObj[groupId] = [item]
            return
          }
          if (mainFlag === 1) {
            mainGroupObj[groupId].unshift(item)
          } else {
            mainGroupObj[groupId].push(item)
          }
        })
        let mainGroupArr = Object.values(mainGroupObj)
        let sendTimeObj = {}
        mainGroupArr.forEach(item => {
          item[0].status === 0 ? waitDataList.push(...item) : (function () {
            let time = new Date(item[0][key]).getTime()
            if (sendTimeObj[time]) {
              sendTimeObj[time].push(item)
            } else {
              sendTimeObj[time] = [item]
            }
          })()
        })
        let timeKeys = Object.keys(sendTimeObj)
        if (dir === 'descending' || !dir) {
          timeKeys.sort((aKey, bKey) => {
            return aKey > bKey ? -1 : 1
          })
        }
        if (dir === 'ascending') {
          timeKeys.sort((aKey, bKey) => {
            return aKey < bKey ? -1 : 1
          })
        }
        timeKeys.forEach(item => {
          let sameTimeArr = sendTimeObj[item]
          sameTimeArr.sort((a, b) => {
            return a[0].serialNumber < b[0].serialNumber ? -1 : 1
          })
          sendGroupList.push(...sameTimeArr)
        })
        sendGroupList.forEach(item => {
          sendDataList.push(...item)
        })
        return [].concat(sendDataList, waitDataList)
      }
    },
    // 表头列
    getColumns () {
      return [
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: i18n.t('类型'),
          minWidth: '7%',
          sortable: !this.noOperate,
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
          minWidth: '10%'
        },
        {
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'dispenseStatus',
          prop: 'dispenseStatus',
          label: i18n.t('发药状态'),
          showOverflowTooltip: true,
          minWidth: '9%'
        },
        {
          slot: 'status',
          prop: 'status',
          label: i18n.t('状态'),
          showOverflowTooltip: true,
          minWidth: '6%'
        },
        {
          prop: 'storageRoomName',
          label: i18n.t('库房'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          afterHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.storageRoomName && row.mailFlag && this.visitType === 1) {
              html += `<i class="iconfont icon-youji1 iconYouji"></i>`
            }
            return html
          }
        },
        {
          prop: 'advicePrice',
          label: i18n.t('金额'),
          showOverflowTooltip: true,
          minWidth: '8%',
          align: 'right',
          hidden: true,
          formatter: ({value}) => {
            return '¥ ' + this.$filters.formatToFinacial(value, 2)
          }
        },
        {
          prop: 'payStatus',
          label: i18n.t('支付状态'),
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({ value, row }) => {
            return PAY_STATUS[String(value)] || ''
          },
          customCellSpanClassFormatter ({ value, row }) {
            return String(value) === '0' && String(row.status) !== '210' && String(row.status) !== '500' ? 'cRed' : ''
          }
        },
        {
          prop: 'doctorName',
          label: i18n.t('提交人'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        },
        {
          prop: 'submitTime',
          label: i18n.t('提交时间'),
          showOverflowTooltip: true,
          minWidth: '8%',
          sortable: true,
          sortMethod: this.sortByTime('submitTime'),
          sortRemote: true,
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
      ]
    }
  },
  components: {
    sendareaCsa,  // 已提交区组件
    adviceShowTable,   // 医嘱展示组件
    advicePrint        // 医嘱打印组件
  },
  computed: {
    tableData () {
      let list = []
      list = [].concat(this.sendData, this.waitData)
      return list
    },
    sendSelect () {
      return this.selectData.filter(v => {
        return v.status !== 0
      })
    },
    waitSelect () {
      return this.selectData.filter(v => {
        return v.status === 0
      })
    }
  },
  filters: {
    getOutDrugStatus (status) {
      /**
       * 150 退药申请中
       * 160 已退药
       * 170 部分退药中
       * 180 退药驳回
       * 190 已发药
       * 200 部分已退药
       * 70 出库驳回
       * 2  审核不通过
       * 0,未发药/已提交
       **/
      let drugStatusRelation = {
        '150': '退药申请中',
        '160': '已退药',
        '170': '部分退药中',
        '180': '退药驳回',
        '190': '已发药',
        '200': '部分已退药',
        '70': '出库驳回',
        '2': '审核不通过',
        '0': '未发药'
      }
      return drugStatusRelation[status] || '--'
    }
  }
}
</script>

<style scoped lang="scss">
#waitarea {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .headarea {
    position: absolute;
    text-align: right;
    top: 5px;
    left: 0;
    width: 100%;
  }
  .mainarea {
    flex: 1;
    overflow: hidden;
    // padding-bottom: 60px;
    display: flex;
    flex-direction: column;
  }
  .is-error {
    color: red;
  }
}
</style>
