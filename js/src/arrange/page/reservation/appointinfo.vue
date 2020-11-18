<template>
  <el-popover v-model="show" placement="right" width="320" @show="initForm" trigger="click">
    <div class="header clearfix">
      <a
        class="ellipsis fl"
        :href="'#/crm/memberinfo/userinfo/memberbaseinfo/'+ appoint.patientId"
        target="_blank"
      >{{appoint.patientName}}</a>
      <span class="fr">
        <label>{{appoint.patientSex === '1' ? '男' : '女'}}</label>
        <label>{{appoint.patientAge}} 岁</label>
        <label>{{appoint.patientPhone}}</label>
        <label class="el-icon-message" @click="sendMessage"></label>
      </span>
      <i class="el-icon-close" @click="show=false"></i>
    </div>
    <el-row class="body">
      <el-col
        :span="24"
      >患者档案：{{appoint.patient && appoint.patient.patientOrg ? appoint.patient.patientOrg.outpatientNumber : ''}}</el-col>
      <!-- <el-col :span="24">预约服务：{{appoint.serviceName}}</el-col> -->
      <el-col :span="24">
        预约信息：{{appoint.deptName}} {{appoint.appointmentDoctorName}}
        <span
          v-if="appoint.appointmentStarttime"
        >{{appoint.appointmentStarttime}}-{{appoint.appointmentEndtime}}</span>
        <span
          v-if="!appoint.appointmentStarttime"
        >{{$moment(appoint.appointmentDate).format('YYYY-MM-DD') || date}}</span>
      </el-col>
      <el-col :span="24" v-if="images.length">上传图片：</el-col>
      <el-col :span="24" v-if="images.length">
        <div class="imgbox">
          <img v-for="src in images" :src="src" :key="src" @click="clickpic(src)">
        </div>
      </el-col>
      <el-col
        :span="24"
        v-if="appoint.appointmentState === -5 && appoint.distance"
      >预计到达：{{appoint.distance}} 分钟</el-col>
      <el-col
        :span="24"
      >当前状态：{{stateStyle[appoint.appointmentState] ? stateStyle[appoint.appointmentState].text : ''}}</el-col>
      <el-col
        :span="24"
        v-if="appoint.appointmentState !== 9 && appoint.appointmentState !== 2 && appoint.appointmentState !== -3"
      >
        <el-time-select
          style="width: 100%"
          v-model="form.confirmAppointmentStarttime"
          :picker-options="options"
          placeholder="选择预约时间"
        ></el-time-select>
      </el-col>
      <el-col
        :span="24"
        v-if="appoint.appointmentState !== 9 && appoint.appointmentState !== 2 && appoint.appointmentState !== -3"
      >
        <el-time-select
          style="width: 100%"
          v-model="form.confirmAppointmentEndtime"
          :picker-options="options"
          placeholder="选择预约时间"
        ></el-time-select>
      </el-col>
      <el-col :span="24">
        <el-input v-model="form.symptom" type="textarea" maxlength="50" placeholder="预约备注"></el-input>
      </el-col>
      <el-col :span="24">
        历史操作人：
        <label>{{appoint.updaterName || '无'}}</label>
        <label class="ml10">{{$moment(appoint.updateTime).format('YYYY/MM/DD HH:mm:ss')}}</label>
      </el-col>
      <el-col :span="24">
        <el-checkbox v-model="form.isCrossAppoint" :true-label="1" :false-label="0">交叉看诊</el-checkbox>
      </el-col>
      <el-col
        :span="24"
        align="left"
        v-if="appoint.appointmentState !== 9 && appoint.appointmentState !== 2 && appoint.appointmentState !== -3"
      >
        <el-button
          v-if="appoint.appointmentState !== -1"
          type="primary"
          @click="confirmAppoint"
        >确定预约</el-button>
        <el-button
          v-if="appoint.appointmentState === -1"
          type="primary"
          @click="reConfirmAppoint"
        >重新预约</el-button>
        <el-button v-if="appoint.appointmentState !== -1" type @click="cannelAppoint">取消预约</el-button>
      </el-col>
    </el-row>

    <template slot="reference">
      <span v-if="$slots.reference">
        <slot name="reference"></slot>
      </span>
      <template v-else>
        <div
          class="card"
          :class="stateStyle[appoint.appointmentState] ? stateStyle[appoint.appointmentState].cardStyle : ''"
        >
          <span class="icon" v-if="appoint.appointmentState === -5">
            <i class="el-icon-caret-left" v-if="index > 0" @click="prveMove"></i>
            <i class="el-icon-caret-right" v-if="index < count - 1" @click="nextMove"></i>
          </span>
          <span class="time clearfix">
            <label
              class="fl"
              v-if="appoint.appointmentStarttime"
            >{{appoint.appointmentStarttime}}-{{appoint.appointmentEndtime}}</label>
            <label class="fl" v-else>{{date}}</label>
            <label
              class="fr"
              v-if="appoint.appointmentState === -5 && appoint.distance"
              style="margin-right: 18px"
            >{{appoint.distance}}分钟到达</label>
            <label class="fr" v-else-if="appoint.isCrossAppoint">
              <i class="iconfont icon-jiaochacross14"></i>
            </label>
          </span>
          <span class="name ellipsis">
            <label>{{appoint.patientName}}</label>
            <em>{{appoint.patient && appoint.patient.patientOrg ? appoint.patient.patientOrg.outpatientNumber : ''}}</em>
          </span>
          <span class="dist ellipsis">{{appoint.symptom}}</span>
        </div>
      </template>
    </template>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/appointapi'
import { APPOINT_STATUS } from '@/util/common'
export default {
  props: ['appoint', 'date', 'times', 'index', 'count'],
  data () {
    return {
      api,
      show: false,
      images: [],
      isEditSymptom: false,
      isSendMessage: true,
      stateStyle: APPOINT_STATUS,
      form: {
        timeTrunkType: 1,
        appointmentId: this.appoint.id,
        confirmAppointmentStarttime: this.appoint.appointmentStarttime,
        confirmAppointmentEndtime: this.appoint.appointmentEndtime,
        isCrossAppoint: false,
        symptom: this.appoint.symptom
      },
      options: {
        start: '08:00',
        step: '00:10',
        end: '23:50'
      }
    }
  },
  methods: {
    clickpic (src) {
      this.$emit('ctrlpic', src)
    },
    initForm () {
      this.getAppointmentById({ id: this.appoint.id })
      this.options.end = this.times && this.times[1] ? this.times[1] : '23:50'
      this.form = {
        timeTrunkType: 1,
        appointmentId: this.appoint.id,
        confirmAppointmentStarttime: this.appoint.appointmentStarttime,
        confirmAppointmentEndtime: this.appoint.appointmentEndtime,
        isCrossAppoint: this.appoint.isCrossAppoint,
        symptom: this.appoint.symptom
      }
    },
    getAppointmentById (p) {
      this.api.getAppointmentById(p)
        .then(rs => {
          if (rs.head.errCode || !rs.data || !rs.data.appointmenImages || rs.data.appointmenImages.length === 0) {
            return false
          }
          this.form.appointmenImages = rs.data.appointmenImages
          let imgarr = []
          rs.data.appointmenImages.map(item => {
            imgarr.push(item.imageUrl)
          })
          this.images = imgarr
          this.images = [
            'https://picsum.photos/200/200',
            'https://picsum.photos/300/200',
            'https://picsum.photos/250/200'
          ]
        })
    },
    reConfirmAppoint () {
      let appoint = {
        timeTrunkType: 1,
        addWay: 1,
        patient: this.appoint.patient,
        organId: this.appoint.organId,
        organName: this.appoint.organName,
        deptId: this.appoint.deptId,
        deptName: this.appoint.deptName,
        appointmentType: 1,
        appointmentResourceId: this.appoint.appointmentResourceId,
        appointmentDate: this.appoint.appointmentDate,
        appointmentStarttime: this.form.confirmAppointmentStarttime,
        appointmentEndtime: this.form.confirmAppointmentEndtime,
        serviceid: this.appoint.serviceid,
        subsequentVisit: this.appoint.subsequentVisit,
        isSceneAppoint: 0
      }
      this.api.createAppoint(appoint).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '预约成功',
          duration: 3000
        })
        this.show = false
        this.$emit('recongirm')
        this.sendMessage()
      })
    },
    confirmAppoint () {
      this.api.confirmAppoint(this.form).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          type: 'success',
          title: '预约成功',
          message: '预约已确认',
          duration: 3000
        })
        this.show = false
        this.$emit('success', true)
      })
    },
    cannelAppoint () {
      this.$confirm('提示', {
        message: '是否取消该患者的预约?',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.cannelAppoint({ id: this.appoint.id }).then(rs => {
          this.$notify({
            type: 'success',
            title: '取消成功',
            message: '患者' + this.appoint.patientName + '的预约已取消',
            duration: 3000
          })
          this.show = false
          this.sendMessage()
          this.$emit('success', true)
        })
      })
        .catch(() => {
          this.show = false
        })
    },
    sendMessage () {
      this.$emit('sendMessage', [this.appoint])
    },
    prveMove (e) {
      e.stopPropagation()
      this.$emit('prve', this.index)
    },
    nextMove (e) {
      e.stopPropagation()
      this.$emit('next', this.index)
    },
    initStartTime () {
      let date = new Date()
      let datetime = Math.ceil(date.getMinutes() / 10) * 10
      date.setMinutes(datetime)
      return this.$moment(date).format('HH:mm')
    }
  }
}
</script>
<style scoped>
.header {
  height: 33px;
  line-height: 33px;
  padding-bottom: 10px;
  padding-right: 25px;
  border-bottom: 1px solid #ddd;
  position: relative;
}
.header a {
  font-size: 18px;
  width: 5em;
  display: inline-block;
  color: #1c7bef;
  font-weight: bold;
}
.header span {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}
.header span label {
  display: inline-block;
  margin-left: 5px;
}
.header span label.el-icon-message {
  font-size: 16px;
  color: #1c7bef;
  cursor: pointer;
}
.header .el-icon-close {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  cursor: pointer;
}
.addblock {
  height: 62px;
  width: 136px;
  border: 1px dashed #aaa;
  border-left: 2px solid #aaa;
  padding: 5px;
  line-height: 1.2;
  cursor: pointer;
  display: inline-block;
}
.addblock span {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
}
.addblock strong {
  font-size: 12px;
  color: #666;
}
.addblock strong i.iconfont {
  font-size: 12px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.el-form-item {
  margin-bottom: 20px;
}
.el-form-item /deep/ > * {
  line-height: 33px;
}
.footer {
  padding: 15px 0 4px;
  border-top: 1px solid #ddd;
}
.footer .el-button {
  width: 185px;
}

.card {
  height: 64px;
  width: 136px;
  border-left: 2px solid #fff;
  padding: 5px;
  margin-bottom: 10px;
  line-height: 1.2;
  display: inline-block;
  float: left;
  cursor: pointer;
  position: relative;
}
.card span {
  display: block;
}
.card span.time {
  font-size: 12px;
  margin-bottom: 8px;
}
.card span.name {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: bold;
}
.card span.name em {
  font-style: normal;
}
.card span.dist {
  font-size: 12px;
}
.card span.icon {
  position: absolute;
  width: 50px;
  right: 4px;
  top: 4px;
  text-align: right;
  z-index: 999;
}
.card span.icon i {
  font-size: 16px;
}

.card.blue {
  background: #dfedff;
  color: #1c7bef;
  border-color: #1c7bef;
}
.card.green {
  background: #d8f1bc;
  color: #61a812;
  border-color: #61a812;
}
.card.orange {
  background: #ffeac8;
  color: #e38748;
  border-color: #e38748;
}
.card.red {
  background: rgba(238, 68, 51, 0.16);
  color: #ee4433;
  border-color: #ee4433;
}
.card.violet {
  background: #efddff;
  color: #bd10e0;
  border-color: #bd10e0;
}
.card.gray {
  background: #cccccc;
  color: #666666;
  border-color: #666666;
}
.card.deepblue {
  background: #d6e0ec;
  color: #366298;
  border-color: #366298;
}

.body {
  padding: 10px;
}
.body .el-col {
  padding: 10px 0;
}
.imgbox {
  width: 100%;
}
.imgbox img {
  height: 60px;
  margin-left: 5px;
}
</style>
