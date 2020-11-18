<template>
  <el-dialog
    :title="'影响预约/挂号 (' + effectCount + ')'"
    class="appoint"
    :visible.sync="showDialog"
    width="60%"
  >
    <el-table
      :show-header="tableData.length > 0"
      :data="tableData"
      :stripe="false"
      max-height="680"
      class="mb20"
      empty-text="没有受影响的预约/挂号，是否继续提交？"
      style="width: 100%"
    >
      <el-table-column prop="patientName" label="患者姓名"></el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.sex === '1' ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄">
        <template slot-scope="scope">
          <span>{{scope.row.patient && scope.row.patient.age}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deptName" label="科室"></el-table-column>
      <el-table-column align="center" prop="appointmentResourceName" label="医生"></el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约时间">
        <template slot-scope="scope">
          <span>{{!scope.row.dataType ? $moment(scope.row.appointmentDate).format('YYYY-MM-DD') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="挂号时间">
        <template slot-scope="scope">
          <span>{{scope.row.dataType ? $moment(scope.row.appointmentDate).format('YYYY-MM-DD') : '--'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="18" align="left">
        <el-input v-model="remark" type="text" placeholder="请输入备注说明"></el-input>
      </el-col>
      <el-col :span="6" align="right">
        <el-button type="primary" @click="submitArrange" :disabled="isSubmitAudit">提交并下载</el-button>
        <el-button type @click="showDialog=false">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import api from '@/arrange/store/settingapi'
import { APPOINT_STATUS } from '@/util/common'

export default {
  props: ['show', 'params', 'template', 'organ', 'dept', 'month'],
  data () {
    return {
      api,
      showDialog: false,
      isSubmitAudit: false,
      tableData: [],
      currentPage: 1,
      totalCount: 0,
      effectCount: 0,
      remark: '',
      initParams: {
        pagesize: 20,
        offset: 0
      },
      stateStyle: APPOINT_STATUS
    }
  },
  watch: {
    'show' (val) {
      this.showDialog = val
      this.isSubmitAudit = false
      this.remark = ''
      if (val) {
        this.getTableData()
      }
    },
    'params': {
      handler (val) {
        this.initParams = Object.assign(this.initParams, this.params)
      },
      deep: true
    },
    'showDialog' (val) {
      this.$emit('update:show', val)
    }
  },
  created () {
    this.isSubmitAudit = false
    this.remark = ''
  },
  methods: {
    getTableData () {
      this.api.getAppointRelsList(this.initParams).then(rs => {
        if (rs.head.errCode || !rs.data) {
          return false
        }
        this.effectCount = rs.data.aptCount + rs.data.aptRecCount
        this.tableData = rs.data.appointmentVOList.map(item => {
          item.dataType = 1
          return item
        }).concat(rs.data.appointmentRecordVOList)
      })
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getTableData()
    },
    submitArrange () {
      this.isSubmitAudit = true
      this.api.submitArrangeToApprove({
        arrangeTempletId: this.template.id,
        arrangeTempletName: this.template.name,
        orgId: this.organ.organId,
        orgName: this.organ.organName,
        depId: this.dept.deptId,
        depName: this.dept.deptName,
        arrangeMonth: this.$moment(this.month).format('YYYY-MM'),
        remark: this.remark
      }).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.showDialog = false
        this.isSubmitAudit = true
        this.$notify({
          title: '提示',
          type: 'success',
          message: '排班修改已提交审核',
          duration: 2000
        })
        if (this.tableData[0]) {
          window.open(this.api.getDownLoadUrl(rs.data))
        }
        this.$emit('success', rs.data)
      })
    }
  }
}
</script>
<style scoped>
.appoint /deep/ .el-dialog__header {
  padding-top: 15px;
}
.appoint /deep/ .el-dialog__body {
  padding-top: 5px;
}
.blue {
  color: #1c7bef;
}
.green {
  color: #61a812;
}
.orange {
  color: #e38748;
}
.violet {
  color: #bd10e0;
}
.gray {
  color: #666666;
}
.deepblue {
  color: #366298;
}
</style>
