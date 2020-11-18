<template>
  <el-dialog title="操作日志" :visible.sync="dialogVisible" width="1000px" :before-close="closeEvent">
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" border>
          <el-table-column prop="taskName" label="任务" :span="3" align="center"></el-table-column>
          <el-table-column label="随访方式" :span="1" prop="name">
            <template slot-scope="scope">
              <sys-value type="THC_CC_FOLLOWUP" :code="scope.row.visitWay"></sys-value>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="任务状态" :span="1">
            <template slot-scope="scope">
              <span>{{statusText(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="反馈状态" :span="2">
            <template slot-scope="scope">
              <span>{{feedbackStatusText(scope.row.feedbackStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="visitTime" label="预执行时间" width="200px" align="center" :span="2"></el-table-column>
          <el-table-column prop="execTime" width="200px" label="实际执行时间" align="center" :span="2"></el-table-column>
          <el-table-column prop="execDoctorName" label="执行人" align="center" :span="2"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import taskvaluekey from '@/crm/page/healthy/taskvaluekey'
import api from '@/crm/store/healthy/followapi'
export default {
  mixins: [taskvaluekey],
  props: ['visible', 'followupId'],
  data () {
    return {
      api,
      tableData: [],
      dialogVisible: false
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        this.dialogVisible = val
        this.getTaskLog(this.followupId)
      },
      deep: true
    }
  },
  methods: {
    closeEvent () {
      this.$emit('close', false)
    },
    getTaskLog (val) {
      api.taskLog({ 'followUpId': this.followupId }).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
        }
      })
    }
  }
}
</script>
