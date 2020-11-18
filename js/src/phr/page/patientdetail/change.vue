<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="url" id="_PHR_CHANGE" title="转科信息"></commonTable>
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
      url: urls.zhuankeList,
      columns: [
        {
          prop: 'transferedInDate',
          label: '转科日期',
          // slot: 'setName',
        },
        {
          prop: 'transferedSubjectTypeName',
          label: '转科类型',
        },
        {
          prop: 'transferedOutTenantSubjectName',
          label: '转出科室',
        },
        {
          prop: 'transferedInTenantSubjectName',
          label: '转入科室',
        },
        {
          prop: 'transferedOutBedName',
          label: '转出床位',
        },
        {
          prop: 'transferedInBedName',
          label: '转入床位',
          showOverflowTooltip: true,
        },
        {
          prop: 'transferedOutReason',
          label: '转出原因',
          showOverflowTooltip: true,
        }
      ]
    }
  }
}
</script>

