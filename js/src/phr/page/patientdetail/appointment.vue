<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="urls.yuyueList" id="_PHR_APPOINTMENT" title="预约信息"></commonTable>
  </div>
</template>

<script>
import commonTable from '@/phr/component/detail.common.table'
import urls from '@/phr/api/urls'
export default {
  name: 'diagnosis',
  components: {
    commonTable,
  },
  data () {
    return {
      urls: urls,
      columns: [
        {
          prop: 'appointmentDate',
          label: '预约日期',
          formatter: ({value}) => {
            return value ? this.$moment(value).format('YYYY-MM-DD') : '--'
          }
        },
        {
          prop: 'visitTypeName',
          label: '预约类型',
        },
        {
          prop: 'appointmentTenantSubjectName',
          label: '预约科室',
        },
        {
          prop: 'appointmentServiceName',
          label: '预约项目',
        },
        {
          prop: 'appointmentDoctorName',
          label: '预约医师',
          showOverflowTooltip: true,
        },
        {
          prop: 'createTime',
          label: '创建日期',
        },
      ]
    }
  }
}
</script>

