<template>
  <!-- 申请召回弹框 -->
  <div class="dialogapply">
    <el-dialog
      title="病历召回"
      :visible.sync="dialogVisible"
      :before-close="close"
      class="ui_dialog_02 spe">
      <div style="height:280px;font-size: 14px; line-height:30px;">
        <el-row>
          <el-col :span="24">
            <h3 class="title">病历信息</h3>
          </el-col>
          <el-col :span="14">
            <span>患者档案号：</span><span>{{rowData.patientSn}}</span>
          </el-col>
          <el-col :span="10">
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
          <el-col :span="4">
            <span class="title"><i class="start">*</i>申请原因:</span>
          </el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="createComment" size="medium"></el-input>
          </el-col>
        </el-row>
      </div>
        <span slot="footer" class="dialog-footer">
          <hr>
          <el-button @click="close">取消</el-button>
          <el-button @click="submit" type="primary">申请召回</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import { Notification } from 'element-ui'
export default {
  props: ['rowData', 'open'],
  data () {
    return {
      dialogVisible: false,
      createComment: ''
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
    close: function () {
      this.$emit('close', false)
    },
    submit: function () {
      if (this.createComment === '') {
        Notification.warning('申请原因不能为空')
      } else {
        this.$emit('submit', this.createComment)
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../assets/case.scss'
</style>

