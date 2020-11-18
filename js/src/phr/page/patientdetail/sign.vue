<template>
  <div class="right-main-container">
    <commonTable :columns="columns" :url="urls.tizhengList" id="_PHR_SIGN" title="体征信息"></commonTable>
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
      urls,
      columns: [
        {
          prop: 'recordTime',
          label: '记录日期',
          // slot: 'setName',
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
            return value ? value + 'KG' : '--'
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
          prop: 'respiratoryFrequency',
          label: '呼吸',
          formatter: ({value}) => {
            return value ? value + '次/分钟' : '--'
          }
        },
        {
          prop: 'pulseRate',
          label: '脉搏',
          formatter: ({value}) => {
            return value ? value + '次/分' : '--'
          }
        },
        {
          prop: 'intakeName',
          label: '入量名称',
        },
        {
          prop: 'realInputHospitalStayDayNum',
          label: '入量',
          formatter: ({value}) => {
            return value ? value + 'ML' : '--'
          }
        },
        {
          prop: 'outputName',
          label: '出量名称',
        },
        {
          prop: 'outputCode1',
          label: '出量',
          formatter: ({value}) => {
            return value ? value + 'ML' : '--'
          }
        },
        {
          prop: 'nurseSignName',
          label: '护士签名',
        },
      ]
    }
  }
}
</script>

