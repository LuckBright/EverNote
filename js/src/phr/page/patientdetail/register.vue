<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="urls.guahaoList" id="_PHR_REGISTER" title="挂号信息"></commonTable>
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
          prop: 'visitDate',
          label: '挂号日期',
          formatter: ({value}) => {
            return value ? this.$moment(value).format('YYYY-MM-DD') : '--'
          }
        },
        {
          prop: 'registerWayName',
          label: '挂号方式',
        },
        {
          prop: 'noName',
          label: '挂号号别',
        },
        {
          prop: 'tenantSubjectName',
          label: '挂号科室',
        },
        {
          prop: 'doctorName',
          label: '挂号医师',
        },
        {
          prop: 'creatorName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建日期',
        }
      ]
    }
  }
}
</script>

