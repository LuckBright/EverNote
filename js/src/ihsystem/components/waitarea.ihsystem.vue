<template>
  <div class="layout_box" id="waitarea" @selectstart.prevent>
    <div class="headarea">
      <span class="left">
        <el-checkbox v-model="isShowSend" :disabled="disabled">{{$t('显示已提交医嘱')}}</el-checkbox>
      </span>
    </div>
    <advice-show-table
      ref="adviceShow"
      :visitType="1"
      :loading="loading"
      :showData="tableData"
      :columns="columns"
      :configOption="configOption"
      :contextList="contextList"
      :arraySpan="arraySpan"
      :noBorderSpan="noBorderSpan"
      :isDragCancel="isDragCancel"
      @cell-dblclick="editWaitService"
      @menu="getMenuList"
      @contextSelect="contextSelect"
      @dragSelect="dragSelect"
    ></advice-show-table>
    <div class="footarea">
      <el-button
        type="primary"
        @click="sendWaitData"
        v-show="waitTableShow"
        :disabled="!waitData.length"
        :loading="isSending"
      >{{$t('提交')}}</el-button>
      <p class="prices">
        <span v-if="waitTableShow">
          <span class="con">{{$t('待提交金额')}}：</span>
          <span class="cou">{{waitTotalPrice}}</span>
        </span>
        <span class="underline" @click="showSend" :class="{'disabled': disabled}">
          <span class="con">{{$t('已提交金额')}}：</span>
          <span class="cou">{{sendTotalPrice}}</span>
        </span>
      </p>
    </div>
    <!-- 已提交区组件 -->
    <sendarea-ihsystem ref="sendarea" :base-info="baseInfo" :order-disabled="disabled" :send-data="sendData" @cancel="cancelRecipe" @update="updateRecipe"></sendarea-ihsystem>
  </div>
</template>
<script>
import waitareajs from '@/inpatient/components/waitarea.new.js'
import sendareaIhsystem from '@/ihsystem/components/sendarea.ihsystem.vue'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table.vue'
import { IHSYSTEM_SENDADVICE } from '@/util/table-config'
import i18n from '@/assets/locals/index'
import { PAY_STATUS } from '@/util/common'
import api from '@/ihsystem/store/advice.js'

export default {
  components: {
    sendareaIhsystem, // 已提交区组件
    adviceShowTable // 医嘱展示组件
  },
  mixins: [waitareajs],
  props: {
    dispensingWay: {
      type: String,
      default: '1'
    },
    userInfo: Object,
    disabled: Boolean, // false-可以对患者进行操作 true-不能对患者进行操作
  },
  data () {
    return {
      isSending: false,
      isShowSend: false,
      tplAddDialogShow: false,
      tplSelects: [],
      columns: [],
      waitContextList: [
        { id: '1', name: '上移', disabled: false, methodName: 'moveupChange' },
        { id: '2', name: '下移', disabled: false, methodName: 'movedowmChange', border: true },
        { id: '5', name: '删除医嘱', disabled: false, methodName: 'delWaitService' }
      ]
    }
  },
  created () {
    this.init()
  },
  computed: {
    waitTableShow () {
      return !this.disabled
    },
    tableData () {
      let list = []
      if (this.isShowSend) {
        list = this.sendData.concat(this.waitData)
      } else {
        list = this.waitData
      }
      return list
    },
    waitTotalPrice () {
      let price = 0
      this.waitData.forEach(item => {
        if (item.advicePrice) {
          price += item.advicePrice || 0
        }
      })
      return '¥ ' + this.$filters.formatToFinacial(price, 2) || '0.00'
    },
    sendTotalPrice () {
      let price = 0
      this.sendData.forEach(item => {
        if (item.advicePrice && String(item.status) !== '210' && String(item.status) !== '500' && String(item.source) !== '2') {
          price += item.advicePrice || 0
        }
      })
      return '¥ ' + this.$filters.formatToFinacial(price, 2) || '0.00'
    }
  },
  methods: {
    init () {
      this.columns = this.getColums()
      this.configOption = { id: IHSYSTEM_SENDADVICE }
      this.arraySpan = ['storageRoomName', 'executeProviderName', 'source', 'submitTime', 'doctorName', 'executeOrgName']
      this.noBorderSpan = ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status', 'payStatus', 'advicePrice']
      // this.getWaitData()
      this.query()
      if (localStorage.getItem('isShowSend')) {
        this.isShowSend = JSON.parse(localStorage.getItem('isShowSend'))
      } else {
        this.isShowSend = true
      }
      if (this.disabled) {
        this.isShowSend = true
      }
    },
    // 查询事件，更新待提交区和已提交区
    async query () {
      await Promise.all([this.getRecipeData(), this.getWaitData()])
      return true
    },
    // 点击已提交金额，展示或收起已提交医嘱
    showSend () {
      if (!this.disabled) {
        this.isShowSend = !this.isShowSend
      }
    },
    // 获取待提交列表
    async getWaitData () {
      const currentUser = this.$store.state.currentUser
      const baseInfo = this.baseInfo
      if (!currentUser.userId) {
        this.waitData = []
        return
      }
      let params = {
        tenantId: currentUser.tenantId,
        orgId: currentUser.organizationId,
        providerId: baseInfo.providerId,
        doctorId: currentUser.userId,
        patientId: baseInfo.patientId,
        visitNumber: baseInfo.visitNumber,
        serviceOrderId: this.baseInfo.serviceOrderId,
        groupId: baseInfo.groupId
      }
      let res = await api.getDoctorAdviceInfo(params)
      if (res && res.length) {
        this.setWaitData(res)
      } else {
        this.waitData = []
      }
    },
    // 处理待提交数据
    setWaitData (data) {
      this.waitData = this.$refs.adviceShow.resetData(data)
      this.$refs.adviceShow.sortMethods()
    },
    // 查询已提交数据
    async getRecipeData (list) {
      const currentUser = this.$store.state.currentUser
      const baseInfo = this.baseInfo
      if (!currentUser.userId) {
        this.sendData = []
        return
      }
      let params = {
        tenantId: currentUser.tenantId,
        orgId: currentUser.organizationId,
        providerId: baseInfo.providerId,
        doctorId: currentUser.userId,
        patientId: baseInfo.patientId,
        visitNumber: baseInfo.visitNumber,
        serviceOrderId: this.baseInfo.serviceOrderId,
        groupId: baseInfo.groupId,
        queryIhSource: 1 // 1=pc互联网查询处方
      }
      let res = await api.getRecipeAvailableByVisitNumber(params)
      if (res && res.length) {
        this.sendData = this.$refs.adviceShow.resetData(res)
      } else {
        this.sendData = []
      }
    },
    // 更新已提交数据
    updateRecipe () {
      this.getRecipeData()
    },
    // 提交待提交区域数据
    async sendWaitData () {
      await this.setTicketCode()
      this.isSending = true
      const currentUser = this.$store.state.currentUser
      const baseInfo = this.baseInfo
      let params = {
        dispensingWay: this.dispensingWay,
        doctorAdviceDtoList: this.waitData,
        doctorId: currentUser.userId, // 医生id
        doctorName: currentUser.displayName, // 医生名字
        groupId: baseInfo.groupId,
        orgId: currentUser.organizationId, // 机构id
        orgName: currentUser.organizationName, // 机构名称
        patientId: baseInfo.patientId, // 患者id
        patientName: baseInfo.patientName, // 患者姓名
        providerId: baseInfo.providerId, // 开单科室id
        providerName: baseInfo.providerName, // 开单科室
        serviceOrderId: this.baseInfo.serviceOrderId,
        visitNumber: baseInfo.visitNumber
      }
      let res = await api.submitRecipe(params).catch(() => {
        this.isSending = false
      })
      if (res) {
        this.isSending = false
        this.$messageTips(this, 'success', '处方项目已提交成功', '成功')
        this.waitData = []
        this.getRecipeData(res.data)
      } else {
        this.isSending = false
      }
    },
    // 提交区，处方撤回成功，更新待提交区列表
    cancelRecipe (data) {
      this.sendData = data
      this.getWaitData()
    },
    getColums () {
      return [{
        slot: 'serviceType',
        prop: 'serviceType',
        label: i18n.t('类型'),
        minWidth: '6%',
        sortable: true,
        undraggable: true,
        required: true
      }, {
        slot: 'doctorAdviceName',
        prop: 'doctorAdviceName',
        label: i18n.t('名称'),
        minWidth: '15%',
        undraggable: true,
        required: true
      }, {
        slot: 'doctorAdviceContent',
        prop: 'doctorAdviceContent',
        label: i18n.t('内容'),
        minWidth: '20%',
        undraggable: true,
        required: true
      }, {
        prop: 'entrust',
        label: i18n.t('嘱托'),
        showOverflowTooltip: true,
        minWidth: '10%'
      }, {
        slot: 'status',
        prop: 'status',
        label: i18n.t('执行状态'),
        showOverflowTooltip: true,
        minWidth: '6%'
      }, {
        prop: 'payStatus',
        label: i18n.t('支付状态'),
        showOverflowTooltip: true,
        minWidth: '6%',
        formatter: ({ value, row }) => {
          return PAY_STATUS[String(value)] || ''
        },
        customCellSpanClassFormatter ({ value, row }) {
          return String(value) === '0' && String(row.status) !== '210' && String(row.status) !== '500' ? 'cRed' : ''
        }
      }, {
        prop: 'advicePrice',
        label: i18n.t('金额'),
        showOverflowTooltip: true,
        minWidth: '8%',
        align: 'right',
        formatter: ({ value }) => {
          return '¥ ' + this.$filters.formatToFinacial(value, 2)
        }
      }, {
        prop: 'submitTime',
        label: i18n.t('提交时间'),
        showOverflowTooltip: true,
        minWidth: '8%',
        formatter: ({ value }) => {
          if (value) {
            return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
          } else {
            return ''
          }
        }
      }, {
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
        }
      }, {
        prop: 'executeProviderName',
        label: i18n.t('执行科室'),
        showOverflowTooltip: true,
        minWidth: '8%',
        hidden: true
      }, {
        slot: 'source',
        prop: 'source',
        label: i18n.t('渠道'),
        showOverflowTooltip: true,
        minWidth: '8%',
        hidden: true
      }, {
        prop: 'doctorName',
        label: i18n.t('提交人'),
        showOverflowTooltip: true,
        minWidth: '8%',
        hidden: true
      }, {
        prop: 'executeOrgName',
        label: i18n.t('执行机构'),
        showOverflowTooltip: true,
        minWidth: '8%',
        hidden: true
      }]
    }
  },
  watch: {
    isShowSend (val) {
      localStorage.setItem('isShowSend', JSON.stringify(val))
    },
    '$store.state.currentUser': {
      handler (val) {
        if (val && val.userId) {
          this.query()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
#waitarea {
  width: 100%;
  position: relative;
  .headarea {
    font-size: 12px;
    color: #2b333d;
    padding-bottom: 0;
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    .left,
    .right {
      height: 100%;
    }
    .left {
      /deep/.el-checkbox .el-checkbox__label {
        font-size: 12px;
        padding-left: 5px;
      }
    }
    .right {
      /deep/ .el-button {
        color: #2b333d;
        font-size: 12px;
        padding: 5px 0;
        .iconfont {
          color: #1c7bef;
          font-size: 14px;
          margin-right: 5px;
        }
      }
    }
  }
  .footarea {
    overflow: hidden;
    /deep/ .el-button {
      padding: 8px 19px;
      height: 32px;
      float: left;
    }
    .prices {
      float: right;
      .con {
        color: #919191;
        margin-left: 20px;
      }
      .cou {
        color: #222222;
      }
      .underline {
        text-decoration: underline;
        cursor: pointer;
      }
      .disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
