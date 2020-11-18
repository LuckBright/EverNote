<template>
    <div class="phr_detail.zhenduan">
        <ever-table
        :columns="columns"
        :data="tableData"
        border
      ></ever-table>
    </div>
</template>
<script>
import api from '@/workspace/store/component'
export default {
  props: {
    params: {
      type: Object
    }
  },
  data () {
    return {
      tableData: [],
      columns: [
        {
          prop: 'typeName',
          label: '诊断类型',
          showOverflowTooltip: true
        },
        {
          prop: 'diseaseName',
          label: '诊断名称',
          showOverflowTooltip: true
        },
        {
          prop: 'diagnosisCode',
          label: '诊断编码',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorName',
          label: '医生',
          showOverflowTooltip: true
        },
        {
          prop: 'recordTime',
          label: '诊断时间',
          showOverflowTooltip: true
        }
      ]
    }
  },
  created () {
    let params = {
      patientId: this.params.patientId,
      orgId: this.params.visitOrgId,
      visitNumber: this.params.visitSerialNumber,
      offset: 0,
      pagesize: 10000
    }
    api.diagonoseSearch(params).then(res => {
      this.tableData = res.data.resultList || []
    })
  }
}
</script>

