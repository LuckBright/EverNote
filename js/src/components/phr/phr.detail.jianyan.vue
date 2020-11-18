<template>
    <div class="phr_detail_jianyan">
        <ever-table
        :columns="columns"
        :data="tableData"
        @eventChange="eventChange"
        border
      ></ever-table>
      <jianyan-dialog :id.sync="currentObjId" :review="doctorReview"></jianyan-dialog>
    </div>
</template>
<script>
import phrapi from '@/workspace/store/component'
import jianyanDialog from './jianyandialog'
import moment from 'moment'
let formatter = ({value}) => {
  if (!value) return ''
  return moment(value).format('YYYY-MM-DD HH:mm')
}
export default {
  props: {
    params: {
      type: Object
    },
    queryObj: {
      type: Object
    }
  },
  components: {
    jianyanDialog
  },
  data () {
    return {
      currentObjId: '',
      doctorReview: '',
      tableData: [],
      currentObj: {},
      columns: [
        {
          prop: 'inspectionServiceName',
          label: '检验内容',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceStatusName',
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
          prop: 'specimenGatherTime',
          label: '采样日期',
          formatter,
          showOverflowTooltip: true
        },
        {
          prop: 'inspectionExecuteDate',
          label: '检验日期',
          formatter,
          showOverflowTooltip: true
        },
        {
          prop: 'inspectionReportDate',
          label: '报告日期',
          formatter,
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
      offset: 0,
      pagesize: 10000
      // status: 60
    }
    phrapi.inspectionSearch(params).then(res => {
      this.tableData = res.data.resultList || []
      // this.count = res.data.totalCount
    })
  },
  methods: {
    eventChange ({prop, row, col}) {
      if (prop !== 'check') return false
      this.currentObjId = row.inspectionRecorderId
      this.doctorReview = row.doctorReview
    }
  }
}
</script>

