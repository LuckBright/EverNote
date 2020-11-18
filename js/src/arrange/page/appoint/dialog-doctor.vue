<template>
  <el-popover
    v-model="show"
    :open-delay="300"
    placement="bottom"
    width="450"
    trigger="click">
      <template solt="title">
        <div class="doctor_title" v-if="doctor.staffInfo">
          <div><span>{{doctor.staffInfo.name}}</span> <span v-if="doctor.staffInfo.professionalName">（{{doctor.staffInfo.professionalName}}）</span></div>
        </div>
      </template>
      <div class="mainbox">
        <el-table :data="doctor.timerangeList" stripe style="width: 100%" v-if="doctor.timerangeList">
          <el-table-column
            width="80"
            label="班次">
            <template slot-scope="scope">
              {{scope.row.timetrunkName}}
            </template>              
          </el-table-column>
           <el-table-column
            label="时段">
            <template slot-scope="scope">
              <div v-for="(item, i) in scope.row.timeranges" :key="scope.$index + '-' + i">
                {{item.startTime | formatTime}} - {{item.endTime | formatTime}}
              </div>              
            </template>              
          </el-table-column>                 
          <el-table-column
            width="128"
            label="服务">
            <template>
              {{doctor.service.name}}
            </template>              
          </el-table-column>
          <el-table-column
            width="128"
            label="频次">
            <template slot-scope="scope">
              <label v-if="scope.row.frequencyType === 1">每{{scope.row.frequencyAmount}}分钟{{scope.row.frequencyVolume}} 人</label>
              <label v-if="scope.row.frequencyType === 2">每班次共{{scope.row.frequencyVolume}}人</label>
            </template>              
          </el-table-column>
        </el-table>     
        <div class="doctor_introduct" v-if="show && doctor.staffInfo.id">
          <textviews :id="doctor.staffInfo.id" type="2"></textviews>
        </div>
        <el-alert type="error" :closable="false" v-if="doctor.staffInfo.reservationPromptContent" :title="doctor.staffInfo.reservationPromptContent"></el-alert>
      </div>
      <i class="el-icon-info" slot="reference"></i>
    </el-popover>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import Textviews from '@/components/textviews.js'
export default {
  props: ['params'],
  data () {
    return {
      api,
      show: false,
      cache: false,
      doctor: {
        staffInfo: '',
        service: '',
        timerangeList: ''
      }
    }
  },
  watch: {
    show (val) {
      if (val && !this.cache) {
        this.api.getDoctorArrangeInfo({
          orgId: this.params.organId,
          serviceId: this.params.serviceId,
          tenantDeptId: this.params.deptId,
          doctorId: this.params.resourceId,
          startDate: this.params.date,
          endDate: this.params.date
        }).then(rs => {
          this.doctor.staffInfo = rs.data.doctorVo
          this.doctor.timerangeList = rs.data.frequencies
          this.doctor.service = {id: rs.data.serviceId, name: rs.data.serviceName}
        })
      }
    }
  },
  components: {
    Textviews
  },
  filters: {
    formatTime (value) {
      if (!value) return ''
      return value.substring(0, 5)
    }
  }
}
</script>
<style scoped>
.aleft{text-align:left;}
.mb4 {margin-bottom: 4px;}
.doctor_title{font-size: 14px;color: #000000;font-weight: 700;}
.doctor_title>div:nth-child(1){margin-bottom:4px;font-family: PingFangSC-Medium;font-size: 14px;color: #000000;
letter-spacing: 0.5px;}
.doctor_skill{font-family: PingFangSC-Regular;font-size: 14px;color: #000000;letter-spacing: 0.5px;text-align: justify;
line-height: 22px;margin-top: 13px;}
.doctor_time{font-family: PingFangSC-Regular;font-size: 14px;color: #000000;letter-spacing: 0.5px;text-align: justify;line-height: 36px;margin-top: 9px;}
.doctor_time>div{background: #EBEBEB;padding:0 11px;}
.doctor_time>div:nth-child(1){margin-bottom: 1px;}
.doctor_introduct{font-family: PingFangSC-Regular;font-size: 14px;color: #999999;letter-spacing: 0.5px;text-align: justify;line-height: 24px;margin-top: 9px; margin-bottom: 10px;}
.el-icon-info {color: #98AEC3; cursor: pointer;}
</style>

