<template>
  <el-popover
  v-model="show"
  placement="bottom"
  width="420"
  :open-delay="800"
  trigger="click">
    <ul class="items clearfix" v-if="timeList[0]">
      <li v-for="(item, i) in timeList" :class="{on: item.startTimeStr === selectTime.startTimeStr}" @click="selectTimeSlice(item)" :key="i">{{item.startTimeStr}}</li>
    </ul>
    <div @click="show=false" v-else-if="show">
      <center>{{errMsg}}</center>
    </div>
    <div slot="reference">
      <div v-if="!hideText"><label style="cursor: pointer;">{{timeAreaStr}}</label> <i class="el-icon-caret-bottom"></i></div>
      <div v-else>&nbsp;</div>
    </div>
  </el-popover>
</template>
<script>
import appointapi from '@/arrange/store/appointapi'
export default {
  props: ['arrange', 'reset', 'resourceId', 'resourceType', 'deptId', 'serviceId', 'date', 'channel', 'customerService', 'hideText'],
  data () {
    return {
      appointapi,
      isAppointNumber: this.$ever.getClinicConfig().isAppointNumber,
      show: false,
      selectTime: '',
      timeList: [],
      addTimeList: [],
      timeAreaStr: '请选择看诊时段',
      errMsg: ''
    }
  },
  watch: {
    reset (val, old) {
      if (val !== old) {
        this.timeAreaStr = '请选择看诊时段'
      }
    },
    arrange (val) {
      this.selectTime = val
    },
    selectTime (val) {
      if (val && this.timeStr) {
        this.timeAreaStr = this.timeStr
      } else if (this.timeAreaStr !== '已约满可加号') {
        this.timeAreaStr = '请选择看诊时段'
      }
    },
    serviceId () {
      this.initTimeList()
    },
    timeList (val) {
      if (!val[0] && this.isAppointNumber) {
        this.getAddTimeList()
      } else {
        this.addTimeList = []
      }
    },
    addTimeList (val) {
      if (val[0]) {
        this.timeAreaStr = '已约满可加号'
        this.timeList = val
      }
    },
    show () {
      this.initTimeList()
    }
  },
  created () {
    this.selectTime = this.arrange
  },
  methods: {
    selectTimeSlice (val) {
      this.show = false
      this.selectTime = val
      this.$emit('select', val)
    },
    initTimeList () {
      if (!this.resourceId) {
        this.errMsg = '请先选择资源/医生'
        return false
      }
      if (!this.serviceId) {
        this.errMsg = '请先选择服务'
        return false
      }
      this.appointapi.getArrangeTime({
        timeTrunkType: 1,
        resourceId: this.resourceId,
        serviceId: this.serviceId,
        deptId: this.deptId,
        date: this.date,
        customerService: this.customerService !== false,
        forRegister: false,
        channelId: this.channel || 1
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.errMsg = '暂无可预约时间段'
          this.timeList = []
          this.selectTime = ''
          return false
        }
        this.timeList = rs.data
        if (!this.selectTime) {
          this.selectTime = rs.data[0]
        }
      })
    },
    getAddTimeList () {
      this.appointapi.getBasesetArrangeResource({
        timeTrunkType: 1,
        deptId: this.deptId,
        resourceId: this.resourceId,
        resourceType: this.resourceType
      }).then(rs => {
        let list = []
        if (rs.head.errCode || !rs.data || !rs.data.timerangeList[0]) {
          return false
        }
        rs.data.timerangeList.map(item => {
          list = list.concat(item.timesliceVOList)
        })
        list = list.map(item => {
          return {
            timesliceId: item.id,
            startTimeStr: item.startTimeStr,
            endTimeStr: item.endTimeStr,
            expired: item.startTimeStr < this.$moment().format('HH:mm'),
            sliceStockAmount: 1,
            isValid: 1,
            isCanAppoint: 1,
            isAdd: true
          }
        })
        this.addTimeList = list
      })
    }
  },
  computed: {
    timeStr () {
      return this.selectTime.startTimeStr || ''
    }
  }
}
</script>

<style scoped>
  .items{padding: 0; margin:0; list-style: none; margin-left: -8px; max-height: 410px;overflow: auto;}
  .items li{width: 48px; height: 30px; line-height: 30px; text-align: center; border:1px solid #ddd; border-radius: 2px; margin-left: 8px; margin-bottom: 10px; float: left; cursor: pointer;}
  .items li.on{background: #1C7BEF;border-color: #1C7BEF; color: #fff;}
  .el-form .el-form-item .el-icon-caret-bottom{vertical-align: initial; top: 0;}
</style>
