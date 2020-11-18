<template>
    <div class="phr_detail_jiancha">
        <ever-table
        :columns="columns"
        :data="tableData"
        @eventChange="eventChange"
        bordder
      ></ever-table>
      <jiancha-dialog v-model="currentObj"></jiancha-dialog>
    </div>
</template>
<script>
import phrapi from '@/workspace/store/component'
import jianchaDialog from './jianchadialog'
import moment from 'moment'
let formatter = ({value}) => {
  if (!value) return ''
  return moment(value).format('YYYY-MM-DD HH:mm')
}
export default {
  props: {
    params: {
      type: Object
    }
  },
  components: {
    jianchaDialog
  },
  data () {
    return {
      currentObj: {},
      tableData: [],
      columns: [
        {
          prop: 'doctorAdviceContent',
          label: '检查项目',
          showOverflowTooltip: true
        },
        {
          prop: 'operationPositionName',
          label: '部位',
          showOverflowTooltip: true
        },
        {
          prop: 'statusName',
          label: '状态',
          showOverflowTooltip: true
        },
        {
          prop: 'applicationDate',
          label: '申请日期',
          formatter,
          showOverflowTooltip: true
        },
        {
          prop: 'examineResults',
          label: '检查日期',
          formatter ({ value }) {
            return (value && value[0]) ? moment(value[0].examineExecuteDatetime).format('YYYY-MM-DD HH:mm') : ''
          },
          showOverflowTooltip: true
        },
        {
          prop: 'examineResults',
          label: '报告日期',
          formatter ({ value }) {
            return (value && value[0]) ? moment(value[0].examineReportDate).format('YYYY-MM-DD HH:mm') : ''
          },
          showOverflowTooltip: true
        },
        {
          prop: 'ever-op',
          label: '操作',
          type: 'btns',
          undraggable: true,
          // 使用formatter进行按钮组的自定义
          btns: ({row}) => {
            let baseBtns = [
              {
                prop: 'check',
                label: '查看'
              }
            ]
            return baseBtns
          }
        }
      ]
    }
  },
  created () {
    let params = {
      orgId: this.params.visitOrgId,
      visitNumber: this.params.visitSerialNumber,
      // status: 4,
      offset: 0,
      pagesize: 10000
    }
    phrapi.examineView(params).then(res => {
      this.tableData = res.data.resultList ? res.data.resultList : []
    })
  },
  methods: {
    eventChange ({prop, row, col}) {
      if (prop !== 'check') return false
      this.currentObj = row
    }
  }
}
</script>

