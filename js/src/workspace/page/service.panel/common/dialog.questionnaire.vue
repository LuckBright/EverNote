<template>
  <div class="question_title" v-if="patientInfo !== ''">
    <el-dialog title="问卷" :visible.sync="dialogVisible" :close-on-click-modal="false" width="35%">
      <div class="print_title">
        <el-row class="mb4">
          <el-col :span="24">
            <span>姓名：</span>
            <p>{{patientInfo.patientName}}  {{patientInfo.patient.patientNumber}}</p>
          </el-col>
          <el-col :span="24">
            <span>生日：</span>
            <p><span v-if="patientInfo.patient.birthday">{{$moment(patientInfo.patient.birthday).format('YYYY-MM-DD')}} {{patientInfo.patientAge}}岁</span><span v-else>--</span> {{patientInfo.patientSex | formatSex}}</p>
          </el-col>
          <el-col :span="24">
            <span>时间：</span>
            <p>{{patientInfo.dateStr}}  {{patientInfo.startTimeStr}} （{{patientInfo.timeLength}}分钟）</p>
          </el-col>
          <el-col :span="24">
            <span>医生：</span>
            <p>{{patientInfo.deptName}} - {{patientInfo.doctorName}}</p>
          </el-col>
          <el-col :span="24">
            <span>备注：</span>
            <p>{{patientInfo.symptom}}</p>
          </el-col>
        </el-row>
        <ever-table ref="table" :columns="columns" :data="tableData">
          <template slot="opCol">
            <el-table-column prop label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.content!==''" type="primary" @click="gocheck(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </template>
        </ever-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/sob/store/service.panel'
export default {
  data () {
    return {
      api,
      dialogVisible: false,
      tableData: [],
      patientInfo: '',
      columns: [
        {
          prop: 'qnaireName',
          label: '问卷名称'
        },
        {
          prop: 'status',
          label: '填写状态',
          formatter ({ value }) {
            if (value === 1) {
              return '失败'
            } else if (value === 2) {
              return '成功'
            } else if (value === 3) {
              return '未填写'
            } else if (value === 4) {
              return '已填写'
            }
          }
        },
        {
          slotName: 'opCol',
          isOperate: true,
        }
      ]
    }
  },
  methods: {
    open (val) {
      this.dialogVisible = true
      this.patientInfo = val
      api.questionnaire({ 'visitNumber': val.visitNumber }).then((res) => {
        this.tableData = res.data
      })
    },
    gocheck (val) {
      window.location.href = val.content
    }
  }
}
</script>
<style lang="scss" scoped>
.print_title {
  padding: 0px 20px 20px;
}
.mb4 {
  font-size: 15px;
  .el-col-24 {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      color: #999999;
      flex: 0.1;
    }
    p {
      flex: 0.9;
      line-height: 21px;
      color: #303133;
    }
    font-weight: bold;
  }
}
.el-dialog__title {
  font-size: 26px !important;
}
</style>

