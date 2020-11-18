<template>
  <!-- 召回详情弹出框 -->
  <div class="dialoghistory">
    <el-dialog
      title="病历召回审批"
      :visible.sync="dialogVisible"
      :before-close="close"
      class="ui_dialog_02 spe">
      <div style="font-size: 14px; line-height:24px;">
        <el-row>
          <el-col :span="24" class="head">
            <h3 class="title">基本信息</h3>
          </el-col>
          <el-col :span="8">
            <span>申请科室：</span><span>{{rowData.creatorDptName}} </span>
          </el-col>
          <el-col :span="8">
            <span>申请医生：</span><span>{{rowData.creatorName}}  </span>
          </el-col>
          <el-col :span="8">
            <span>申请时间：</span><span>{{rowData.createTime}}  </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="head">
            <h3 class="title">病历信息</h3>
          </el-col>
          <el-col :span="14">
            <span>患者档案号：</span><span>{{rowData.patientSn}}</span>
          </el-col>
          <el-col :span="8">
            <span>住院病案号：</span><span>{{rowData.medicalSn}}</span>
          </el-col>
          <el-col :span="8">
            <span>患者姓名：</span><span>{{rowData.name}}</span>
          </el-col>
          <el-col :span="8">
            <span>性别：</span><span>{{rowData.sex==1?'男':'女'}}</span>
          </el-col>
          <el-col :span="8">
            <span>年龄：</span><span>{{rowData.age}}</span>
          </el-col>
          <el-col :span="14">
            <span>入院时间:</span><span>{{rowData.admissionTime}}</span>
          </el-col>
          <el-col :span="10">
            <span>出院时间:</span><span>{{rowData.dischargeTime}}</span>
          </el-col>
        </el-row>
        <el-row class="reason_box">
          <el-col :span="24" class="head">
            <h3 class="title">申请原因:</h3>
          </el-col>
          <el-col :span="24">
            <span>{{rowData.createComment}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="head">
            <h3 class="title">审批信息</h3>
          </el-col>
          <el-col :span="12">
            <span>审批人：</span><span>{{rowData.auditorName}}</span>
          </el-col>
          <el-col :span="12">
            <span>审批时间：</span><span>{{rowData.auditTime}}</span>
          </el-col>
          <el-col :span="24">
            <span>审批结果：</span><span>{{rowData.auditStatus==1?'已通过':'待审批'}},{{rowData.auditComment}}</span>
          </el-col>
          <el-col :span="12">
            <span>再次归档：</span><span>{{rowData.lockTwice==1?'是':'否'}}</span>
          </el-col>
          <el-col :span="12">
            <span>再次归档时间：</span><span>{{rowData.lockTwiceTime}}</span>
          </el-col>
        </el-row>
      </div>
        <span slot="footer" class="dialog-footer">
          <hr>
          <el-button @click="close" type="primary">关闭</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['rowData', 'open'],
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    open: function (val) {
      this.dialogVisible = val
    },
    rowData: function (val) {

    }
  },
  methods: {
    close (done) {
      this.$emit('close', false)
      if (typeof done === 'function')done()
    }
  }
}
</script>
<style lang="sass" scoped>
 @import '../../assets/case.scss';
</style>

