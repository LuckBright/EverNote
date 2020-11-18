<template>
  <div class="clearfix">
    <div class="alg_r lh35">
      <el-checkbox-group v-model="checkList" @change="change" class="inline-block mr10" v-if="isShowChecked">
        <el-checkbox v-for="(option, index) in SCREEN_TASK_CONDITIONS" :key="index" :label="option">{{option.name}}</el-checkbox>
      </el-checkbox-group>
      <template v-if="showCommonComponent">
        <div class="ml10 inline-block" v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_treatmentrecord')">
          <span class="blue cur" @click="taskGoSendCrm(reportData)">
            <i class="iconfont icon-menzhen-lishijilu"></i>
            <span class="f14">诊疗记录</span>
          </span>
        </div>
        <div class="ml10 inline-block" v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')">
          <span class="blue cur" @click="reportOpen(reportData)">
            <i class="iconfont icon-baogao"></i>
            <span class="f14">检查检验</span>
          </span>
        </div>
        <div class="ml10 inline-block" v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_prescriptionprint') && showPrint">
          <span class="blue cur" @click="prescriptionPrint()">
            <i class="iconfont icon-menzhen-dayin"></i>
            <span class="f14">打印处方</span>
          </span>
        </div>
        <div class="ml10 inline-block" v-if="cancel && pageType && pageType === 4 && $hasPermission('Auth_menu_treasury_outpatientmedicine_drugwithdrawa')">
          <span class="blue cur" @click="drugWithdrawa">
            <i class="iconfont icon-tuike"></i>
            <span class="f14">退药</span>
          </span>
        </div>
      </template>
    </div>
    <!-- 检查检验报告 -->
    <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
    <!-- 处方打印 -->
    <new-sendarea-print-dialog ref="newSendPrint" :base-info="baseInfo" :tabList="['0']"></new-sendarea-print-dialog>
    <!-- 发药记录退药 -->
    <refund-dialog-wh ref="refundDialogWh" :base-info="refundBaseInfo" :visible.sync="visible"></refund-dialog-wh>
  </div>
</template>

<script>
import { SCREEN_TASK_CONDITIONS } from '@/warehouse/views/util/constant'
import reportDialog from '@/infusion/components/report.card.vue'
import processApi from '@/warehouse/views/drug/api/processapi.js'
import newSendareaPrintDialog from '@/inpatient/components/sendarea.print.dialog.vue'
import sysvalue from '@/warehouse/store/sysvalueapi'
import refundDialogWh from '@/inpatient/components/medical.orders/refund.dialog.wh.vue' // 发药记录退药弹窗

export default {
  props: {
    showCommonComponent: Boolean, // 是否展示 诊疗记录、检验检查
    processConfig: { // 流程配置数据(Vuex)
      type: Object,
      default: () => ({})
    },
    reportData: { // 查看诊疗记录、检查检验所需要的数据
      type: Object,
      default: () => ({})
    },
    isShowChecked: { // 是否展示选择条件
      type: Boolean,
      default: false
    },
    pageType: {
      type: Number
    },
    prescriptionPrams: { // 处方打印需要的请求数据
      type: Object,
      default: () => ({})
    },
    cancel: { // 发药记录退药显示条件 5 手机端 1 是普通门诊
      type: Boolean,
      default: false
    },
  },
  components: {
    reportDialog,
    newSendareaPrintDialog,
    refundDialogWh
  },
  data () {
    return {
      checkList: [],
      reportKey: '',
      SCREEN_TASK_CONDITIONS,
      systemConfig: this.$store.state.processConfig.storageroomSystemConfig, // 是否分库房
      showPrint: null, // 是否显示打印处方
      sendData: [], // 医嘱数据
      serviceTypeList: [], // 医嘱分类
      refundBaseInfo: {}, // 退药列表查询参数
      visible: false,
      baseInfo: {} // 用户信息对象
    }
  },
  created () {
    this.getSortType()
  },
  watch: {
    reportData: {
      handler (v) {
        if (v) {
          this.baseInfo = {
            visitSn: this.reportData.visitNumber,
            patientId: this.reportData.patientId
          }
          this.refundBaseInfo = Object.assign({}, this.baseInfo)
        }
      },
      deep: true,
      immediate: true
    },
    prescriptionPrams: {
      handler (v) {
        if (v) {
          this.refundBaseInfo = {
            visitSn: v.visitSn,
            type: v.type,
            processConfigurationId: v.processConfigurationId || '',
            outStockStartDate: v.outStockStartDate,
            outStockEndDate: v.outStockEndDate
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.setCheckBoxGroupDefault()
  },
  methods: {
    drugWithdrawa () { // 退药
      this.visible = true
    },
    async getSortType () {
      await sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
        this.serviceTypeList = options
      })
    },
    prescriptionPrint () { // 处方打印
      if (this.reportData) {
        this.$refs.newSendPrint.showDialog()
      }
    },
    setCheckBoxGroupDefault () {
      // 设置checkbox-group默认值
      const processItemObject = this.processConfig.processItemObject
      SCREEN_TASK_CONDITIONS.forEach(item => {
        if (processItemObject && !processItemObject[item.field]) {
          this.checkList.push(item)
        }
      })
      // 是否显示打印处方
      const { processId } = this.processConfig
      // 自动出库 => 发药记录， 多库房统一 || 分库房 => 任务列表、发药记录、收方发药 有页面就展示打印处方按钮
      this.showPrint = ((['100003', '100001'].includes(processId) || this.systemConfig.dispenseSetting === '1') &&
      this.pageType === 5) || [4, 2].includes(this.pageType)
    },
    change (list) {
      const containObj = {}
      SCREEN_TASK_CONDITIONS.forEach(contain => {
        const hasField = list.find(item => item.field === contain.field)
        containObj[contain.field] = hasField ? 0 : 1
      })
      processApi.updateProcessItem(Object.assign({
        id: this.processConfig.id
      }, containObj)).then(res => {
        if (res.finally) {
          this.$store.commit('setThisStorageroomProcessConfig', Object.assign(this.processConfig, { processItemObject: Object.assign({}, this.processConfig.processItemObject, containObj) }))
          this.$emit('change', containObj)
        }
      })
    },
    taskGoSendCrm (data) {
      window.open(`${this.$ever.crmIndex}/crm/memberinfo/diagnosis/${data.patientId}`, '_blank')
    },
    reportOpen (data) {
      this.reportKey = true
      this.$nextTick(_ => {
        this.$refs.reportDialog.openDialog(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lh35 { height: 35px; line-height: 35px;}
</style>
