<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="url" id="_PHR_CONSULTATIONS" title="就诊信息"></commonTable>
  </div>
</template>

<script>
import urls from '@/phr/api/urls'
import commonTable from '@/phr/component/detail.common.table'
export default {
  name: 'consultations',
  components: {
    commonTable,
  },
  data () {
    return {
      url: urls.jiuzhenList,
      columns: [
        {
          prop: 'hospitalizedTime',
          label: '就诊日期',
          // slot: 'setName',
        },
        {
          prop: 'visitTypeName',
          label: '就诊类型',
        },
        {
          prop: 'visitTenantSubjectName',
          label: '就诊科室',
        },
        {
          prop: 'visitDoctorName',
          label: '就诊医师',
        },
        {
          prop: 'visitStatusName',
          label: '就诊状态',
        },
        {
          prop: 'admissionDiagnosis',
          label: '诊断',
          showOverflowTooltip: true,
        }
      ]
    }
  }
}
</script>

