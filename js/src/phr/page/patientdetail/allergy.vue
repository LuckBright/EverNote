<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="urls.allergyList" id="_PHR_ALLERGY" title="过敏信息"></commonTable>
  </div>
</template>

<script>
import urls from '@/phr/api/urls'
import commonTable from '@/phr/component/detail.common.table'
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
          prop: 'medicalRecordCreateTime',
          label: '记录日期',
          // slot: 'setName',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'allergenTypeName',
          label: '过敏类型',
        },
        {
          prop: 'allergenSourceName',
          label: '过敏名称',
        },
        {
          prop: 'doctorName',
          label: '记录人',
        }
      ]
    }
  }
}
</script>

