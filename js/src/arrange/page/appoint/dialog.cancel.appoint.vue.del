<template>
  <div class="appoint_cancel">
    <el-dialog :visible.sync="dialogVisible" class="ui_dialog_02">
        <template slot="title">
          <h2>要取消预约吗？</h2>
        </template>
        <el-form v-model="form">
          <div class="cancel_content">
            <el-row>
              <el-col :span="4">姓名：</el-col>
              <el-col :span="20">{{cancelObj.name}} {{cancelObj.patientNumber}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">生日：</el-col>
              <el-col :span="18">
                  {{cancelObj.birthday | formatDateByExp('YYYY-MM-DD') }}
                  {{cancelObj.birthday | birthdayComputed}}
                  <sys-value type="GBT.2261.1" :code="cancelObj && cancelObj.sex ? cancelObj.sex:''"></sys-value>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">时间：</el-col>
              <el-col :span="20">{{cancelObj.time}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">医生：</el-col>
              <el-col :span="18">{{cancelObj.doctor}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">备注：</el-col>
              <el-col :span="20">主要原因是因为没时间没时间主要原因是因为没时间没时间主要原因是因为没时间没时间主要原因是因为没时间没时间</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">取消原因：</el-col>
              <el-col :span="20">
                  <el-input class="remark" :autosize="{ minRows: 4.4, maxRows:4.4}" v-model="cancelObj.mark" type="textarea"></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="special">
                  <span>发送短信：
                  <el-switch v-model="cancelObj.isFa"></el-switch>
                  </span>
                  <span>手工发送：
                  <el-switch v-model="cancelObj.isHandel"></el-switch>
                  </span>
              </el-col>
            </el-row>
          </div>
          <div class="acenter">
            <el-button type="primary">取消</el-button>
            <el-button @click="submit">确认取消</el-button>
          </div>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['appoint', 'visible'],
  data () {
    return {
      dialogVisible: false,
      form: {
        id: this.appoint.id,
        cancelReason: ''
      },
      cancelObj: {
        name: '刘强东',
        patientNumber: 'E7767343424',
        birthday: '1988-11-11',
        sex: '1',
        time: '2019-11-11 (40分钟)',
        doctor: '齿科-马云医生',
        mark: '洗牙',
        isFa: true,
        isHandel: true
      }
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    submit () {
    }
  }
}
</script>
<style scoped>
.appoint_cancel /deep/ .ui_dialog_02 .el-dialog .el-dialog__header{padding:0px;padding-top: 49px;}
.appoint_cancel /deep/ .ui_dialog_02 .el-dialog .el-dialog__body{padding-bottom:20px;}
.appoint_cancel /deep/ .ui_dialog_02 .el-dialog{width:395px;background: #FFFFFF;border: 1px solid #999999;
box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);border-radius: 2px;}
.mb4{margin-bottom: 4px;}
h2{font-size: 24px;color: #000000;letter-spacing: 0.86px;line-height: 24px;font-weight: 400;text-align: center;margin:0;}
.cancel_content{margin:0 30px;font-size: 14px;margin-top: 27px;}
.cancel_content .el-row{margin-bottom: 10px;}
.cancel_content .el-row .el-col:nth-child(2n+1){font-size: 14px;color: #AAAAAA;text-align: right;line-height: 24px;}
.cancel_content .el-row .el-col:nth-child(2n){font-size: 14px;color: #000000;text-align: left;line-height: 24px;padding-left:6px;}
.cancel_content .el-row .special{text-align:left!important;vertical-align: middle;}
.cancel_content .el-row .special span:nth-child(2){margin-left:14px;}
.acenter{text-align: center;margin-top: 20px;}
.remark{border: 1px solid #C0CCD9;border-radius: 2px;outline:none;}
.remark /deep/ .el-textarea__inner{resize:none;border: none;}
</style>

