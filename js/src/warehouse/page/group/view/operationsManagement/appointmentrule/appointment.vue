<template>
  <div class="layout_inner bg_col_02">
    <div class="middle oa">
      <div class="mb20">
        <strong>门诊客服预约</strong>
        <div class="appoint">
          <label>门诊客服预约可用排班范围：可预约</label>
          <el-input-number v-model="form.Customer_Appointment_Register_Rule.day" style="width:60px" size="mini" :min="1" :max="180" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <div style="display:inline">
            <el-time-select
              class="wid"
              size="mini"
              v-model="form.Customer_Appointment_Register_Rule.time"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '24:00'
              }"
              placeholder="时间"
            ></el-time-select>
          </div>
          <label>开放新号源</label>
        </div>
      </div>
      <div class="mb20">
        <strong>门诊线上预约</strong>
        <div class="appoint">
          <label>门诊线上预约可用排班范围：可预约</label>
          <el-input-number v-model="form.App_Appointment_Register_Rule.day" style="width:60px" size="mini" :min="1" :max="180" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.App_Appointment_Register_Rule.time"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
          <div>
            <label>是否可预约当日号源</label>
            <el-switch v-model="form.App_Appointment_Register_Rule.isAppointNow" :active-value="1" :inactive-value="0"></el-switch>
          </div>
        </div>
      </div>
      <div class="mb20">
        <strong>视频问诊预约</strong>
        <div class="appoint">
          <label>预约可用排班范围：可预约</label>
          <el-input-number v-model="form.Video_Appointment_Register_Rule.day" style="width:60px" size="mini" :min="1" :max="180" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.Video_Appointment_Register_Rule.time"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
        </div>
      </div>
      <div class="mb20">
        <strong>图文问诊预约</strong>
        <div class="appoint">
          <label>预约可用排班范围：可预约</label>
          <el-input-number v-model="form.Picture_Text_Appointment_Register_Rule.day" style="width:60px" size="mini" :min="1" :max="180" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.Picture_Text_Appointment_Register_Rule.time"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
        </div>
      </div>
      <div class="mb20">
        <strong>在线咨询预约</strong>
        <div class="appoint">
          <label>预约可用排班范围：可预约</label>
          <el-input-number v-model="form.Consult_Appointment_Register_Rule.day" style="width:60px" size="mini" :min="1" :max="180" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.Consult_Appointment_Register_Rule.time"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
        </div>
      </div>
    </div>
    <div class="btn alg_c">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
export default {
  data () {
    return {
      api,
      form: {
        Customer_Appointment_Register_Rule: {
          day: 15,
          time: '',
        },
        App_Appointment_Register_Rule: {
          day: 15,
          time: '',
          isAppointNow: 1
        },
        Video_Appointment_Register_Rule: {
          day: 15,
          time: '',
        },
        Picture_Text_Appointment_Register_Rule: {
          day: 15,
          time: '',
        },
        Consult_Appointment_Register_Rule: {
          day: 15,
          time: ''
        }
      }
    }
  },
  created () {
    this.getval()
  },
  methods: {
    getval () {
      this.api.getAppointmentRuleConfig().then(rs => {
        if (rs.head.errCode) {
          return false
        }
        if (rs.data) {
          this.form = Object.assign(this.form, rs.data)
        }
      })
    },
    submit () {
      this.api.updateAppointmentRuleConfig(this.form).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
      })
    }

  }
}
</script>
<style scoped>
.btn {
  margin-top: 15px;
  margin-bottom: 15px;
}
.work {
  background-color: #ffffff;
}
.middle {
  width: 750px;
  margin: 0 auto;
  margin-top: 50px;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 19px;
}
input {
  width: 60px;
  height: 36px;
  margin-left: 5px;
  margin-right: 5px;
}
strong {
  display: block;
  font-size: 14px;
}
.wid {
  width: 80px;
  height: 36px;
  margin-left: 5px;
  margin-right: 5px;
}
/* p {
  margin: 0px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.5px;
  line-height: 36px;
} */
.appoint {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0.5px;
  line-height: 36px;
}
</style>
