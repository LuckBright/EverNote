<template>
  <el-popover
  v-model="show"
  placement="right"
  width="330"
  trigger="click">
    <div class="title">
      <label>添加/取消锁定</label>
      <i class="el-icon-close" @click="show=false"></i>
    </div>
    <el-form :model="form" :rules="rules1" label-width="80px" label-position="right" ref="form">
      <el-form-item label="开始时间" prop="startTimeStr">
        <el-time-select
          style="width: 100%"
          v-model="form.startTimeStr"
          :picker-options="{
              start: '00:00',
              end: '23:50',
              step: '00:10',
              maxTime: form.endTimeStr
          }"
          placeholder="开始时间">
        </el-time-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTimeStr">
        <el-time-select
          style="width: 100%"
          v-model="form.endTimeStr"
          :picker-options="{
            start: '00:00',
            step: '00:10',
            end: '23:50',
            minTime: form.startTimeStr
          }"
          placeholder="结束时间">
        </el-time-select>
      </el-form-item>      
    </el-form>
    <el-row class="footer">
      <el-col :span="24" align="center">
        <el-button type="primary" @click="addAppointLock(true)"> 添加锁定 </el-button>
        <el-button type="" @click="addAppointLock(false)"> 取消锁定 </el-button>
      </el-col>
    </el-row>
    <div class="addblock" slot="reference">
      <span class="time">{{date}}</span>
      <strong><i class="iconfont icon-suo"></i> 添加/取消锁定</strong>
    </div>
  </el-popover>
</template>
<script>
  import api from '@/arrange/store/appointapi'
  export default {
    props: ['value', 'date', 'organ', 'times'],
    data () {
      return {
        api,
        show: false,
        form: {
          startTimeStr: '',
          endTimeStr: '',
          timeTrunkType: 1,
          resourceId: this.value.resourceId,
          date: this.date,
          organId: this.organ.organId,
          organName: this.organ.organName,
          deptId: this.value.deptId,
          deptName: this.value.deptName
        },
        options: {
          start: this.times[0] || '08:00',
          end: this.endTimeStr || this.times[1] || '23:50',
          step: '00:10'
        },
        options2: {
          start: this.startTimeStr || this.times[0] || '08:00',
          end: this.times[1] || '23:50',
          step: '00:10'
        },
        rules1: {
          startTimeStr: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          endTimeStr: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
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
      show: {
        handler (val) {
          if (!val) {
            this.form.startTimeStr = ''
            this.form.endTimeStr = ''
          }
        }
      },
      organ: {
        handler (val) {
          this.form.organId = val.organId
          this.form.organName = val.organName
        },
        deep: true
      },
      value: {
        handler (val) {
          this.form.deptId = val.deptId
          this.form.deptName = val.deptName
          this.form.resourceId = val.resourceId
        },
        deep: true
      },
      date (val) {
        this.form.date = val
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
              if (val) {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '锁定成功',
                  duration: 3000
                })
              } else {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '解锁成功',
                  duration: 3000
                })
              }
              this.show = false
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
