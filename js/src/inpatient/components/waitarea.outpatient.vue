<template>
  <div class="layout_box" id="waitarea" @selectstart.prevent>
    <div class="headarea">
      <span class="left">
        <el-checkbox v-model="isShowSend" :disabled="disabled">{{$t('显示已提交医嘱')}}</el-checkbox>
      </span>
      <span class="right">
        <el-button type="text" @click="printRecipe" :disabled="topBtnDisabled">
          <i class="iconfont icon-dayin1"></i>
          {{$t('打印处方')}}
        </el-button>
        <el-button type="text" @click="savePersonalTpl" :disabled="topBtnDisabled">
          <i class="iconfont icon-baocun"></i>
          {{$t('保存模板')}}
        </el-button>
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
    <sendarea-outpatient ref="sendarea" :base-info="baseInfo" :order-disabled="disabled" :from-history="history" :send-data="sendData" @cancel="cancelRecipe" @update="updateRecipe"></sendarea-outpatient>
    <!-- 处方打印弹窗 -->
    <send-print-dialog ref="sendPrint" :base-info="baseInfo" :is-personal-print="true"></send-print-dialog>
    <!-- 保存为个人模版弹窗 -->
    <dialog-tpl-add
      v-if="tplAddDialogShow"
      :dialogShow.sync="tplAddDialogShow"
      :table-list="sendData"
      :default-selects="tplSelects"
      :base-info="userInfo"
    ></dialog-tpl-add>
  </div>
</template>
<script>
import { getPrintData, newPrintEvent } from './sendarea.print'
import waitareajs from '@/inpatient/components/waitarea.new.js'
import autoprintsetapi from '@/sob/store/autoprintsetapi'
import sendareaOutpatient from '@/inpatient/components/sendarea.outpatient'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import sendPrintDialog from '@/inpatient/components/sendarea.print.dialog'
import dialogTplAdd from './dialog.template.add/dialog.template.add'
import { OUTPATIENT_SENDADVICE } from '@/util/table-config'
import i18n from '@/assets/locals/index'
import { PAY_STATUS } from '@/util/common'
import { presrciptionPrintConfig } from '@/inpatient/store/prescriptionprintconfig.js'
export default {
  mixins: [waitareajs],
  props: {
    visitType: Number,
    userInfo: Object,
    disabled: Boolean, // false-可以对患者进行操作 true-不能对患者进行操作
    history: Boolean  // false-今日患者 true-历史患者
  },
  data () {
    return {
      autoprintsetapi,
      isSending: false,
      isShowSend: false,
      tplAddDialogShow: false,
      tplSelects: [],
      printConfig: [],
      isAutoprint: false,
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
          minWidth: '10%'
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
          formatter: ({ value, row }) => {
            return PAY_STATUS[String(value)] || ''
          },
          customCellSpanClassFormatter ({ value, row }) {
            return String(value) === '0' && String(row.status) !== '210' && String(row.status) !== '500' ? 'cRed' : ''
          }
        },
        {
          prop: 'advicePrice',
          label: i18n.t('金额'),
          showOverflowTooltip: true,
          minWidth: '8%',
          align: 'right',
          formatter: ({ value }) => {
            return '¥ ' + this.$filters.formatToFinacial(value, 2)
          }
        },
        {
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
        },
        {
          prop: 'storageRoomName',
          label: i18n.t('库房'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          afterHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.storageRoomName) {
              if (+row.dispensingWay === 2) {
                html += ' <div style="display: inline-block;border:1px solid;color: red;font-size: 13px;line-height: 1;margin-bottom: 6px;">跨机构</div>'
              }
              if (+row.dispensingWay === 3) {
                html += ' <div style="display: inline-block;border:1px solid;color: red;font-size: 13px;line-height: 1;margin-bottom: 6px;">第三方</div>'
              }
              if (row.mailFlag) {
                html += ` <i class="iconfont icon-youji1 iconYouji"></i>`
              }
            }
            return html
          }
        },
        {
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        },
        {
          slot: 'source',
          prop: 'source',
          label: i18n.t('渠道'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        },
        {
          prop: 'doctorName',
          label: i18n.t('提交人'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        },
        {
          prop: 'executeOrgName',
          label: i18n.t('执行机构'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        }
      ],
      configOption: { id: OUTPATIENT_SENDADVICE },
      arraySpan: ['storageRoomName', 'executeProviderName', 'source', 'submitTime', 'doctorName', 'executeOrgName'],
      noBorderSpan: ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status', 'payStatus', 'advicePrice'],
      validParams: [
        {
          code: 'MASTER_SWITCH'
        },
        {
          code: 'YAO_PIN_CHU_FANG'
        },
        {
          code: 'CHU_ZHI_DAN'
        },
        {
          code: 'JIAN_CHA_SHEN_QING_DAN'
        },
        {
          code: 'JIAN_YAN_SHEN_QING_DAN'
        },
        {
          code: 'ZHI_LIAO_DAN'
        },
        {
          code: 'SHOU_SHU_SHEN_QING_DAN'
        },
        {
          code: 'FEI_YONG_QING_DAN'
        },
        {
          code: 'TUI_YAO_DAN'
        },
        {
          code: 'PRINT_PREVIEW'
        }
      ],
      tableName: {
        YAO_PIN_CHU_FANG: '处方打印',
        JIAN_CHA_SHEN_QING_DAN: '检查申请打印',
        JIAN_YAN_SHEN_QING_DAN: '检验申请打印',
        ZHI_LIAO_DAN: '治疗打印',
        CHU_ZHI_DAN: '处置打印',
        SHOU_SHU_SHEN_QING_DAN: '手术申请打印',
        FEI_YONG_QING_DAN: '费用清单打印'
      },
      isPreview: false
    }
  },
  created () {
    this.getConfigList()
    this.printConfig = presrciptionPrintConfig[this.$ever.getClinicConfig().PRprintConfig] || []
    this.getWaitData()
    if (localStorage.getItem('isShowSend')) {
      this.isShowSend = JSON.parse(localStorage.getItem('isShowSend'))
    } else {
      this.isShowSend = true
    }
    if (this.disabled) {
      this.isShowSend = true
    }
  },
  methods: {
    // 获取是否提交后自动打印设置
    async getIsAutoprint () {
      let printConfig = []
      let initPrintConfig = presrciptionPrintConfig[this.$ever.getClinicConfig().PRprintConfig]
      let res = await autoprintsetapi.getIsValidByOrgId(this.validParams)
      if (res && res.head && res.head.errCode === 0) {
        res.data.forEach((vl) => {
          if (vl.isValid && vl.code !== 'MASTER_SWITCH' && vl.code !== 'PRINT_PREVIEW') printConfig.push(initPrintConfig.find(item => item.name === this.tableName[vl.code]))
          this.isPreview = vl.code === 'PRINT_PREVIEW' && vl.isValid ? !!true : !!false
        })
        this.printConfig = printConfig
      }
    },
    getConfigList () {
      let parms = {
        source: 3,
        executeTypeCode: 'CHU_ZHI_DAN'
      }
      let initPrintConfig = presrciptionPrintConfig[this.$ever.getClinicConfig().PRprintConfig].find(item => item.name === '处置打印')
      autoprintsetapi.getConfigList(parms).then(res => {
        if (res.data.length > 0 && initPrintConfig) {
          initPrintConfig.config.serviceType = res.data[0].includeAdviceType.split(',')
          initPrintConfig.config.employ = res.data[0].includeUsage.split(',')
        }
      })
    },
    // 查询事件，更新待提交区和已提交区
    query () {
      this.getRecipeData()
      this.getWaitData()
    },
    // 点击已提交金额，展示或收起已提交医嘱
    showSend () {
      if (!this.disabled) {
        this.isShowSend = !this.isShowSend
      }
    },
    // 获取待提交列表
    async getWaitData () {
      let params = {
        tenantId: this.$store.state.currentUser.tenantId,
        orgId: this.$store.state.currentUser.organizationId,
        providerId: this.baseInfo.providerId || this.baseInfo.dptId,
        doctorId: this.$store.state.currentUser.userId,
        patientId: this.baseInfo.patientId,
        visitNumber: this.baseInfo.visitSn,
        channel: 1, // 来源渠道，1-pc, 2-移动端
        visitType: 1,
        status: 0, // 医嘱状态，0 草稿
        orderByFlag: 2, // 0：按照医嘱序号反序排序（之前的排序方式）；1: 按照重整医嘱时间排序,2：按照医嘱序号正序排序（之前的排序方式）；1
        sourceExecuteId: 'isNull'
      }
      let res = await this.recipeapi.getDoctorAdviceInfo(params)
      if (res && res.data && res.data.length) {
        this.setWaitData(res.data)
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
      let res = await this.recipeapi.getRecipeByVisitNumber({ visitNumber: this.baseInfo.visitSn })
      if (res && res.data && res.data.length) {
        this.sendData = this.$refs.adviceShow.resetData(res.data)
        if (list && list.length && this.printConfig.length > 0) {
          // 过滤哪些是最新提交的处方，组装打印数据
          let printData = []
          printData = this.sendData.filter(v => {
            return list.includes(v.recipeId)
          })
          let data = []
          data = getPrintData(printData, this.printConfig)
          newPrintEvent(data, this.printConfig, this.baseInfo, this.$store.state.currentUser.organizationId, this.isPreview)
        }
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
      let params = {
        visitNumber: this.baseInfo.visitSn,
        providerId: this.baseInfo.providerId || this.baseInfo.dptId
      }
      let res = await this.recipeapi.submitRecipeAdvice(params).catch(() => {
        this.isSending = false
      })
      if (res && res.head && res.head.errCode === 0) {
        this.isSending = false
        this.$messageTips(this, 'success', '处方项目已提交成功', '成功')
        this.waitData = []
        this.getIsAutoprint()
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
    // 处方打印
    printRecipe () {
      let data = this.sendData.filter(v => {
        return String(v.status) !== '210' && String(v.status) !== '500'
      })
      this.$refs.sendPrint.showDialog(data)
    },
    // 保存模板
    savePersonalTpl () {
      this.tplSelects = this.sendData
      this.tplAddDialogShow = true
    }
  },
  components: {
    sendareaOutpatient,  // 已提交区组件
    adviceShowTable,     // 医嘱展示组件
    dialogTplAdd,        // 保存模板组件
    sendPrintDialog      // 处方打印
  },
  computed: {
    waitTableShow () {
      return !this.disabled && !this.history
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
    },
    topBtnDisabled () {
      // return this.disabled || !this.sendData.length
      return !this.sendData.length // 不能开医嘱可以打印申请单
    }
  },
  watch: {
    isShowSend (val) {
      localStorage.setItem('isShowSend', JSON.stringify(val))
    }
  }
}
</script>

<style scoped lang="scss">
#waitarea {
  width: 100%;
  position: relative;
  .room-icon {
    display: inline-block;
    border: 1px solid;
    color: red;
    font-size: 13px;
    line-height: 1;
    margin-bottom: 6px;
  }
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
