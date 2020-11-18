<template>
  <div class="bord_bottom10">
    <!-- 患者公共头组件 -->
    <patient-header :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
    <!-- 拼接头部内容 -->
    <div class="bWhite merge-patient-header">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="f14"><span>预执行时间：</span><span v-html="runTime"></span></div>
        </el-col>
        <el-col :span="14" v-if="!isDispensing">
          <div class="alg_r">
            <div class="ml10 inline-block" v-if="$hasPermission('Auth_menu_treasury_hospitalization_seedoctorsadvice')">
              <span class="blue" @click="handlerLookAdvice">
                <i class="iconfont icon-menzhen-lishijilu"></i>
                <span class="f14">查看医嘱</span>
              </span>
            </div>
            <div class="ml10 inline-block" v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')">
              <span class="blue" @click="reportOpen(reportData)">
                <i class="iconfont icon-baogao"></i>
                <span class="f14">检查检验</span>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
    <!-- 检查检验报告 -->
    <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
    <!-- 查看医嘱 -->
    <dialog-slot width="90%" title="医嘱信息" :dialogSlot.sync="dialogSlot">
      <waitarea-hospital
        v-if="dialogSlot"
        :user-info="baseInfo"
        :no-operate="true"
        :visit-type="3"
      ></waitarea-hospital>
    </dialog-slot>
  </div>
</template>

<script>
import reportDialog from '@/infusion/components/report.card.vue'
import PatientHeader from '@/inpatient/components/common.head.js'
import DialogSlot from '@/warehouse/page/components/dialog.slot'
import WaitareaHospital from '@/inpatient/components/waitarea.hospital.vue'
import { dateFormat } from '@/util/common'
export default {
  props: {
    reportData: { // 查看诊疗记录、检查检验所需要的数据
      type: Object,
      default: () => ({})
    },
    baseInfo: { // 患者基本信息，主要用到：providerId（当前科室id），hospitalizedNumber，patientId （查看医嘱组件）
      type: Object,
      default: () => ({})
    },
    patientId: [Number, String],
    visitNumber: [Number, String],
    implementTime: String, // 执行时间
    termType: { // 医嘱类型 0: 临时医嘱 1: 长期医嘱
      type: Number,
      default: 0
    },
    isDispensing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogSlot: false,
      reportKey: '',
      patientCode: '009'
    }
  },
  methods: {
    handlerLookAdvice () { // 查看医嘱
      this.dialogSlot = true
    },
    reportOpen (data) {
      this.reportKey = true
      this.$nextTick(_ => {
        this.$refs.reportDialog.openDialog(data)
      })
    }
  },
  computed: {
    runTime () {
      return !this.termType ? `${dateFormat(this.implementTime, 'YYYY-MM-DD')} <strong class="f16">立即执行</strong>` : `${dateFormat(this.implementTime, 'YYYY-MM-DD')} <strong class="f16">${dateFormat(this.implementTime, 'HH:mm')}</strong>`
    }
  },
  components: {
    reportDialog,
    PatientHeader,
    DialogSlot,
    WaitareaHospital
  },
}
</script>
<style lang="less" scoped>
.merge-patient-header {
  margin-top: -15px;
  padding: 10px;
}
</style>
