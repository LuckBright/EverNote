<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="url" id="_PHR_PREVIEW_NEW" title="预检信息"></commonTable>
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
      url: urls.yujianList,
      columns: [
        {
          prop: 'preCheckTime',
          label: '预检日期'
        },
        {
          prop: 'preCheckDoctorName',
          label: '预检医师',
        },
        {
          prop: 'height',
          label: '身高',
          formatter: ({value}) => {
            return value ? value + 'CM' : '--'
          }
        },
        {
          prop: 'weight',
          label: '体重',
          formatter: ({value}) => {
            return value ? value + 'CM' : '--'
          }
        },
        {
          prop: 'diastolicPressure',
          label: '血压',
          formatter: ({value, row, col}) => {
            return row.systolicPressure ? '收缩压：' + row.systolicPressure + '，舒张压：' + row.diastolicPressure : '--'
          }
        },
        {
          prop: 'bodyTemperature',
          label: '体温',
          formatter: ({value}) => {
            return value ? value + '℃' : '--'
          }
        },
        {
          prop: 'respiratory',
          label: '呼吸',
          formatter: ({value}) => {
            return value ? value + '次/分钟' : '--'
          }
        },
        {
          prop: 'pulse',
          label: '脉搏',
          formatter: ({value}) => {
            return value ? value + '次/分' : '--'
          }
        },
        {
          prop: 'heartRate',
          label: '心率',
          formatter: ({value}) => {
            return value ? value + '次/分' : '--'
          }
        },
      ]
    }
  }
}
</script>

