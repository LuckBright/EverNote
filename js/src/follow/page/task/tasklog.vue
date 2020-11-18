<template>
 <el-popover
 class="task-log"
  placement="bottom"
  popper-class="task-popper-follow"
  width="600"
  trigger="hover">
  <ever-table
    :columns="recordsColumns"
    :is-record-url-params="false"
    :show-index="false"
    :data="value"
    ></ever-table>
    <span slot="footer" class="dialog-footer"></span>
    <el-button class="log_task_btn" slot="reference">查看日志记录</el-button>
</el-popover>
</template>
<script>
import { listDestValue } from '@/util/common'
import { executeTypeList, taskStatus } from '@/follow/util/model'
export default {
  props: ['id', 'value'],
  data () {
    return {
      recordsColumns: [
        {
          prop: 'executeTime',
          label: '执行时间',
        },
        {
          prop: 'executorName',
          label: '执行人',
        },
        {
          prop: 'executeType',
          label: '执行方式',
          formatter: ({ value }) => listDestValue(executeTypeList, value)
        },
        {
          prop: 'executeStatus',
          label: '执行状态',
          formatter: ({ value }) => listDestValue(taskStatus, value)
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.task-log{
    /deep/ .el-button.log_task_btn{
      background: #FCFDFE;border:1px solid #217DE3;
      span{
        color:#217DE3!important;border-radius: 2px;
      }
    }
}
.task-log{
  z-index:5001!important;
  /deep/ .el-tooltip__popper {
  z-index: 5001 !important;
 }
}
</style>
