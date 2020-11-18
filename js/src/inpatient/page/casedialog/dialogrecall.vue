<template>
  <!-- 召回弹框 -->
  <div class="dialogrecall">
    <el-dialog
      title="病历召回审批"
      :visible.sync="dialogVisible"
      :before-close="close"
      class="ui_dialog_02 spe">
      <div style="height:410px;font-size: 14px; line-height:24px;">
        <el-row>
          <el-col :span="24" class="head">
            <h3 class="title">基本信息</h3>
          </el-col>
          <el-col :span="8">
            <span>申请科室：</span><span>{{rowData.creatorDptName}} </span>
          </el-col>
          <el-col :span="8">
            <span>申请医生：</span><span>{{rowData.creatorName}} </span>
          </el-col>
          <el-col :span="8">
            <span>申请时间：</span><span>{{rowData.createTime}} </span>
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
            <h3 class="title"><i class="start">*</i>审批:</h3>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="radio" label="1">通过</el-radio>
            <el-radio v-model="radio" label="2">不通过</el-radio>
          </el-col>
          <el-col :span="16">
            <el-input v-model="reason" placeholder="请输入理由"></el-input>
          </el-col>
        </el-row>
      </div>
        <span slot="footer" class="dialog-footer">
          <hr>
          <el-button @click="close">取消</el-button>
          <el-button @click="submit" type="primary">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['rowData', 'open'],
  data () {
    return {
      dialogVisible: false,
      radio: '1',
      reason: ''
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
    },
    submit () {
      this.$emit('submit', {
        auditStatus: this.radio,
        auditComment: this.reason
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/case.scss';
</style>
