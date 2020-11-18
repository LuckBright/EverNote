<template>
  <el-dialog
  title="锁定号源"
  :visible.sync="showDialog"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  width="25%">
    <el-form :model="form" ref="form">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="startTimeStr" :rules="rules.required">
            <el-time-select
              style="width: 100%"
              v-model="form.startTimeStr"
              :picker-options="{start: '00:00', end: '23:50',step: '00:10', maxTime: form.endTimeStr}"
              placeholder="开始时间">
            </el-time-select>          
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="endTimeStr" :rules="rules.required">
            <el-time-select
              style="width: 100%"
              v-model="form.endTimeStr"
              :picker-options="{start: '00:00', end: '23:50',step: '00:10', minTime: form.startTimeStr}"
              placeholder="结束时间">
            </el-time-select>          
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-input type="textarea" :row="8" :disabled="!value.isValid" placeholder="请输入锁定原因" :maxlength="50" v-model="form.lockReason"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-checkbox v-model="form.isCanAppoint" :disabled="!value.isValid">支持预约</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12" align="right">
          <el-form-item>
            <el-button type="primary" @click="addAppointLock(false)" v-if="!value.isValid">解锁</el-button>
            <el-button type="primary" @click="addAppointLock(true)" v-if="value.isValid">锁定</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
  import api from '@/arrange/store/appointapi'
  export default {
    props: ['show', 'value', 'date', 'organ', 'times'],
    data () {
      return {
        api,
        showDialog: false,
        form: {
          startTimeStr: '',
          endTimeStr: '',
          timeTrunkType: 1,
          resourceId: '',
          deptId: '',
          deptName: '',
          lockReason: '',
          date: '',
          organId: '',
          organName: '',
          isCanAppoint: false
        },
        rules: {
          required: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          requiredObject: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object'}
          ],
          requiredArray: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'array'}
          ]
        }
      }
    },
    watch: {
      'show' (val) {
        this.showDialog = val
        if (val) {
          this.form.lockReason = ''
          this.form.date = this.date
          this.form.organId = this.organ.organId
          this.form.organName = this.organ.organName
          this.form.isCanAppoint = false
        }
      },
      'showDialog' (val) {
        this.$emit('update:show', val)
      },
      'value' (val) {
        this.form.startTimeStr = this.value.startTime
        this.form.endTimeStr = this.value.endTime
        this.form.deptId = this.value.deptId
        this.form.deptName = this.value.deptName
        this.form.resourceId = this.value.resourceId
        this.form.lockReason = this.value.lockReason
        this.form.isCanAppoint = !!this.value.isCanAppoint
      }
    },
    methods: {
      addAppointLock (val) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.isLock = val
            this.api.lockArrangeByParam(this.form).then(rs => {
              if (rs.head.errCode) {
                return false
              }
              this.$notify({
                type: 'success',
                title: '成功',
                message: val ? '锁定成功' : '解锁成功',
                duration: 3000
              })
              this.showDialog = false
              this.$emit('success', true)
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .addblock{height: 62px; width: 136px; border: 1px dashed #aaa; border-left: 2px solid #aaa; padding: 5px; line-height: 1.2; cursor: pointer; display: inline-block; margin-bottom: 10px;  background: #fff;}
  .addblock span{display: block; font-size: 12px;margin-bottom: 8px;}
  .addblock strong{font-size: 12px; color: #666;}
  .addblock strong i.iconfont{font-size: 12px;}
  .title {font-size: 18px; font-weight: bold; margin-bottom: 20px;position: relative;}
  .title .el-icon-close{position: absolute; right: 0; top: 0; font-size: 20px; cursor: pointer;}
  .el-form-item {margin-bottom: 20px;}
  .el-form-item /deep/ >  * {line-height: 33px;}
  .footer {padding: 15px 0 4px; border-top: 1px solid #ddd;}
  .footer .el-button{width: 120px}
  .el-form /deep/ .el-radio + .el-radio,
  .el-form /deep/ .el-checkbox + .el-checkbox{margin-left: 10px;}
</style>
