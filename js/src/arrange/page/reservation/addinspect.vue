<template>
  <el-popover
  v-model="show"
  placement="right"
  width="330"
  trigger="click">
    <div class="title">
      <span>
        <label v-if="value.appointmentDto">修改预约</label>
        <label v-else>预约检查</label>
      </span>
      <i class="el-icon-close" @click="show=false"></i>
    </div>
    <el-form :model="form" :rules="rules1" label-width="80px" label-position="left" ref="form">
      <el-form-item label="预约日期" prop="date">
        <el-date-picker
        style="width: 100%"
        v-model="form.date"
        type="date"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预约资源" prop="doctorId">
        <el-select v-model="form.doctorId" style="width: 100%" placeholder="请选择资源"  :clearable="true">
          <el-option v-for="(item, i) in doctorList" :key="i" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约时间" prop="time">
        <el-select v-model="form.time" style="width: 100%" placeholder="请选择时间" value-key="timesliceId" :clearable="true">
          <el-option v-for="(item, i) in timeList" :key="i" :value="item" :label="item.startTimeStr"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row class="footer">
      <el-col :span="24" align="center" v-if="value.appointmentDto &&value.appointmentDto.appointmentState==1">
        <el-button type="primary" @click="addAppointLock(true)"> 修改预约 </el-button>
        <el-button type="" @click="cancelRecord(false)"> 取消预约 </el-button>
      </el-col>
      <el-col :span="24" align="center" v-else>
        <el-button type="primary" @click="addAppointLock(true)"> 预约 </el-button>
        <el-button type="" @click="show=false"> 取消 </el-button>
      </el-col>
    </el-row>
     <div class="addblock" slot="reference">
      <a class="result" v-if="value.appointmentDto  &&value.appointmentDto.appointmentState==1" href="javascript:void(0)" slot="reference">修改预约</a>
      <a class="result" v-else href="javascript:void(0)" slot="reference">预约</a>
    </div>
  </el-popover>
</template>
<script>
  import api from '@/arrange/store/inspectapi'
  import sourceapi from '@/arrange/store/sourceapi'
  export default {
    props: ['value', 'date', 'organ'],
    data () {
      return {
        api,
        sourceapi,
        show: false,
        form: {
          date: '',
          time: ''
        },
        timeList: [],
        doctorList: [],
        rules1: {
          date: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          doctorId: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          time: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ]
        }
      }
    },
    watch: {
      show: {
        handler (val) {
          if (val && this.value && this.value.excuteProvider) {
            // this.getArrangeResource(this.value.excuteProvider, this.form.date)
            // if (this.value.appointmentDto && this.value.appointmentDto.appointmentState === 1) {
            //   let obj = {
            //     timesliceId: this.value.appointmentDto.timesliceId,
            //     startTimeStr: this.value.appointmentDto.appointmentStarttime,
            //     endTimeStr: this.value.appointmentDto.appointmentEndtime
            //   }
            //   this.form.time = JSON.parse(JSON.stringify(obj))
            //   this.$set(this.form, 'date', this.$moment(this.value.appointmentDto.appointmentDate).format('YYYY-MM-DD'))
            //   this.$set(this.form, 'doctorId', this.value.appointmentDto.appointmentResourceId)
            // }
          }
        }
      },
      value: {
        handler (val) {
        },
        deep: true
      },
      form: {
        handler (val) {
          if (val) {
            if (!val.date) {
              val.doctorId = ''
              val.time = ''
            }
            if (!val.doctorId) {
              val.time = ''
            }
            if (val.date && val.doctorId && this.value.excuteProvider && this.value.serviceId) {
              let params = {
                date: this.$moment(val.date).format('YYYY-MM-DD'),
                deptId: this.value.excuteProvider || '',
                resourceId: val.doctorId,
                timeTrunkType: 7,
                serviceId: this.value.serviceId || ''
              }
              this.getServiceTimeslieList(params)
            }
          }
        },
        deep: true
      },
      'form.doctorId' (val, old) {
        if (val && old) {
          this.form.time = ''
        }
      },
      'form.date': {
        handler (val) {
          if (!val) {
            this.doctorList = []
            this.form.doctorId = ''
          }
          if (val) {
            this.getArrangeResource(this.value.excuteProvider, this.$moment(val).format('YYYY-MM-DD'), '7')
          }
        }
      }
    },
    methods: {
      getServiceTimeslieList (params) {
        this.api.getServiceTimeslieList(params).then(rs => {
          if (rs && rs.data) {
            this.timeList = rs.data
          }
        })
      },
      getArrangeResource (deptId, date, timeTrunkType) {
        this.sourceapi.getArrangeResource({deptId: deptId, startDate: date, timeTrunkType: timeTrunkType}).then(rs => {
          if (rs && rs.data) {
            rs.data = rs.data.map((v, i) => {
              let obj = {
                id: v.resourceId,
                name: v.resourceName
              }
              return obj
            })
            this.doctorList = rs.data
          }
        })
      },
      addAppointLock (val) {
        let params = {
          patientId: this.value.patientId,
          deptId: this.value.excuteProvider,
          deptName: this.value.excuteProviderName,
          appointmentType: 2,
          timesliceId: this.form.time.timesliceId,
          appointmentStarttime: this.form.time.startTimeStr,
          appointmentEndtime: this.form.time.endTimeStr,
          appointmentResourceId: this.form.doctorId,
          appointmentDate: this.$moment(this.form.date).format('YYYY-MM-DD'),
          serviceid: this.value.serviceId, // this.value.serviceId
          executeId: this.value.id
        }
        if (this.value.appointmentDto && this.value.appointmentDto.id) {
          params.id = this.value.appointmentDto.id
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!params.id) {
              this.api.addExectueAppointmentRecord(params).then(rs => {
                if (rs && rs.head.errCode === 0) {
                  this.$notify({
                    type: 'success',
                    title: '成功',
                    message: '预约成功',
                    duration: 3000
                  })
                  this.show = false
                  this.$emit('success', true)
                }
              })
            } else {
              this.api.updateRecord(params).then(rs => {
                if (rs && rs.head.errCode === 0) {
                  this.$notify({
                    type: 'success',
                    title: '成功',
                    message: '修改预约成功',
                    duration: 3000
                  })
                  this.show = false
                  this.$emit('success', true)
                }
              })
            }
          }
        })
      },
      cancelRecord () {
        this.$refs.form.validate(valid => {
          // if (valid) {
          if (this.value && this.value.appointmentDto && this.value.appointmentDto.id) {
            this.api.cancelRecord({id: this.value.appointmentDto.id}).then(rs => {
              if (rs && rs.head.errCode === 0) {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '取消预约成功',
                  duration: 3000
                })
                this.show = false
                this.$emit('success', true)
              }
            })
          }
          // }
        })
      }
    }
  }
</script>
<style scoped>
  .title {font-size: 18px; font-weight: bold; margin-bottom: 20px;position: relative;}
  .title .el-icon-close{position: absolute; right: 0; top: 0; font-size: 20px; cursor: pointer;}
  .el-form-item {margin-bottom: 20px;}
  .el-form-item /deep/ >  * {line-height: 33px;}
  .footer {padding: 15px 0 4px; border-top: 1px solid #ddd;}
  .footer .el-button{width: 120px}
  .el-form /deep/ .el-radio + .el-radio,
  .el-form /deep/ .el-checkbox + .el-checkbox{margin-left: 10px;}
</style>
