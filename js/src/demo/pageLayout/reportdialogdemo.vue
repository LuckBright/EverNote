<template>
  <div>
    <el-button type="primary" size="mini" @click="openReportDialog">查看报告组件</el-button>
    <report-card ref='reportCard' :isPrint='true'></report-card>
  </div>
</template>
<script>
import reportCard from '@/infusion/components/report.card.vue'

export default {
  methods: {
    openReportDialog () {
      // isPrint参数是判断检查表格是否显示打印 默认不显示
      // appendBody参数是弹窗套弹窗显示有问题时传true
      this.$refs.reportCard.openDialog({
        patientId: 'imH32GOzg4s9tBWzuN3', // 必传 患者id  默认this.$route.query.patientId
        serviceType: '', // 800(检查)  801(检验) 802(治疗) --- 字符串格式  默认 801
        serviceId: '', // 必传
        executeId: '', // 执行单id
        code: '', // 执行单code  第三方回传的报告会用这个code
      }, true) // 第二个参数是 bool 是判断是否显示报告解读
    },
  },
  components: {
    reportCard
  }
}
</script>
