<template>
  <span>
    <!-- <span class="cGray6">医生：</span><span style="font-weight: bold">{{propData.doctorName}}</span>（{{propData.providerName}}） -->
    <skin-test class="mr10" :prop-data="testResult" v-if="testResult.length && showSkinTest"></skin-test>
    <span class="mr10 inline-block" v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_treatmentrecord')">
      <el-button type="text" @click="taskGoSendCrm(propData)">
        <i class="iconfont icon-menzhen-lishijilu"></i>
        <span class="cBlack f_nor">诊疗记录</span>
      </el-button>
    </span>
    <span class="mr10 inline-block" v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')">
      <el-button type="text" @click="reportOpen(propData)">
        <i class="iconfont icon-baogao"></i>
        <span class="cBlack f_nor">检查检验</span>
      </el-button>
    </span>
    <!-- 检查检验报告 -->
    <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
  </span>
</template>

<script>
import reportDialog from '@/infusion/components/report.card.vue'
import skinTest from './skin.test'
import { patch } from '@/util/common'
export default {
  props: {
    propData: {
      type: Object,
      default () {
        return {}
      }
    },
    outTest: {
      type: Boolean,
      default: false
    },
    testResult: {
      type: Array,
      default () {
        return []
      }
    },
    patientData: { // 处方明细
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      reportKey: ''
    }
  },
  computed: {
    showSkinTest () {
      // 4.26改动：去掉“|| item.employ === '1460'”，只有物资带有皮试属性时，才展示皮试结果
      return this.patientData.some(item => this.isSkinTestMaterial(item))
    }
  },
  methods: {
    ...patch,
    taskGoSendCrm (data) {
      if (data.patientId) window.open(`${this.$ever.crmIndex}/crm/memberinfo/diagnosis/${data.patientId}`, '_blank')
    },
    reportOpen (data) {
      this.reportKey = true
      this.$nextTick(_ => {
        this.$refs.reportDialog.openDialog(data)
      })
    }
  },
  components: {
    reportDialog,
    skinTest
  }
}
</script>
