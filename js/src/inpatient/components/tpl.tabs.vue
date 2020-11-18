<template>
  <div class="tpl-tabs">
    <el-tabs :type="scene==='hospital'?'border-card':''" v-model="activeTab" class="flex_column_full flex_layout_scroll">
      <el-tab-pane label="模版" name="moban">
        <moban-ref v-if="activeTab=='moban'&& designerid == '1'" :schema-id="templateId" :dpt-id="dptId" :key="templateId" :code="code"></moban-ref>
        <word @save="saveEntry" v-if="designerid == '2'" :dpt-id="dptId"></word>
      </el-tab-pane>
      <template v-if="scene==='hospital'">
        <el-tab-pane label="诊断" name="zhenduan">
          <patient-zhenduan-ref :visit-id="visitId" v-if="activeTab=='zhenduan'"></patient-zhenduan-ref>
        </el-tab-pane>
      </template>
      <el-tab-pane label="体征" name="tizheng">
        <template v-if="scene==='hospital'">
          <tijian-ref :visit-id="visitId" :dpt-id="dptId" v-if="activeTab=='tizheng'"></tijian-ref>
        </template>
        <template v-if="scene==='clinic'">
          <clinic-tijian :visit-id="visitId" :dpt-id="dptId" v-if="activeTab=='tizheng'"></clinic-tijian>
        </template>
      </el-tab-pane>
      <el-tab-pane label="医嘱" name="yizhu">
        <yizhu-ref :visit-id="visitId" v-if="activeTab=='yizhu'" :scene="scene"></yizhu-ref>
      </el-tab-pane>
      <el-tab-pane label="检查" name="jiancha">
        <span slot="label">
          检查
          <sub class="twinkling" v-if="jcHasNew"></sub>
        </span>
        <patient-examination :patient-id="patientId" type="800" :visit-id="visitId" :dpt-id="dptId" v-if="activeTab=='jiancha'"></patient-examination>
      </el-tab-pane>
      <el-tab-pane label="检验" name="jianyan">
        <span slot="label">
          检验
          <sub class="twinkling" v-if="jyHasNew"></sub>
        </span>
        <patient-inspection :patient-id="patientId" type="801" :visit-id="visitId" :dpt-id="dptId" v-if="activeTab=='jianyan'"></patient-inspection>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import clinicTijian from '@/inpatient/components/clinic-tijian-ref'
import patientZhenduanRef from '@/inpatient/components/patient-zhenduan-ref'
import tijianRef from '@/inpatient/components/patient-tijian-ref'
import yizhuRef from '@/inpatient/components/patient-yizhu-ref'
import patientInspection from '@/inpatient/components/patient.inspection.ref'
import patientExamination from '@/inpatient/components/patient.examination.ref'
import mobanRef from '@/inpatient/components/mo-ban-ref'
import word from '@/inpatient/page/medicalrecord/word'
export default {
  props: {
    curTab: {// 默认展开的tab页
      type: String,
      default: 'moban'
    },
    patientId: {// 患者id
      type: String
    },
    dptId: {// 科室id
      type: String
    },
    visitId: {// 流水号
      type: String
    },
    designerId: {// '1' 普通模版 '2'小模版
      type: String
    },
    templateId: {// 模版id
      type: String
    },
    code: {// 模版code
      type: String
    },
    scene: {
      type: String,
      default: 'hospital'// hospital住院 clinic门诊
    }
  },
  data () {
    return {
      activeTab: this.curTab,
      timer: '',
      jcHasNew: false,
      jyHasNew: false,
      designerid: ''
    }
  },
  created () {
    this.designerid = this.$route.query.designerId
    this.$bus.$off('noticeMsg')
    this.$bus.$on('noticeMsg', obj => {
      this.jcHasNew = obj.jc
      this.jyHasNew = obj.jy
    })
    this.$bus.$off('menzhenbingli:designerId')
    this.$bus.$on('menzhenbingli:designerId', val => {
      this.designerid = val
    })
  },
  methods: {
    saveEntry (data) {
      this.$bus.$emit('saveEntry:obj', data)
    }
  },
  components: {
    clinicTijian,
    patientZhenduanRef,
    tijianRef,
    yizhuRef,
    patientExamination,
    patientInspection,
    mobanRef,
    word
  },
  watch: {
    designerId (val) {
      if (val !== '1') {
        this.activeTab = 'binglixiaomoban'
      } else {
        this.activeTab = 'moban'
      }
    },
    activeTab (val) {
      if (val === 'jiancha' && this.jcHasNew) this.$bus.$emit('closeNoticeMsg', val)
      if (val === 'jianyan' && this.jyHasNew) this.$bus.$emit('closeNoticeMsg', val)
      if (val === 'jiancha') this.jcHasNew = false
      if (val === 'jianyan') this.jyHasNew = false
      if (!this.jyHasNew && !this.jcHasNew) this.$bus.$emit('closeNoticeMsg', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.tpl-tabs {
  height: 100%;
}
</style>
