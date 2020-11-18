<template>
  <el-popover
    v-model="show"
    :disabled="addWay === 1 && (isEmploy || (!value.isValid && !value.isCanAppoint))"
    placement="right"
    width="500"
    trigger="click"
  >
    <form-content
      :value="value"
      :init-value="initValue"
      :date="date"
      :organ="organ"
      :title="title"
      :times="times"
      :add-way="addWay"
      :is-show.sync="show"
      :timerange="1"
      @success="appointSuccess"
      v-if="show"
    ></form-content>
    <div
      class="addblock"
      :class="blockStyle"
      slot="reference"
      @click="show = true"
      v-if="addWay === 1 && isShowBlock"
    >
      <div>
        <span class="time">{{value.startTime}}-{{value.endTime}}</span>
        <strong v-if="!isEmploy">
          <i class="iconfont icon-tianjia"></i>
          <label>{{title}}</label>
          <label v-if="value.sliceStockAmount > 1">(剩余：{{value.sliceStockAmount}})</label>
        </strong>
        <strong v-if="isEmploy" class="ellipsis">
          <i
            class="iconfont"
            :class="value.isPlus ? 'icon-menzhen-yizhugongxia' : 'icon-huanzheliebiao'"
          ></i>
          <label>
            {{value.isPlus ? '加号' : value.appointmentDtoList.length === 1 ? '已占用' : '已约满'}}
            <template
              v-if="value.appointmentDtoList.length === 1"
            >({{value.appointmentDtoList[0].patientName}})</template>
          </label>
        </strong>
        <span class="appointlock" @click="appointLock($event)" v-if="!isEmploy">
          <i class="iconfont icon-jiema" v-if="value.isValid"></i>
          <i class="iconfont icon-zhongzhi" v-if="!value.isValid"></i>
          <p class="reason ellipsis" v-if="!value.isValid && value.lockReason">{{value.lockReason}}</p>
        </span>
      </div>
    </div>
    <div class="addblock" @click="show = true" slot="reference" v-if="addWay === 2 || addWay === 3">
      <span class="time">{{date}}</span>
      <strong>
        <i class="iconfont icon-tianjia"></i>
        <label>{{title}}</label>
      </strong>
    </div>
  </el-popover>
</template>
<script>
import formContent from '@/arrange/page/reservation/form.vue'
import { APPOINT_STATUS_NEW_COLOR } from '@/util/common'
export default {
  props: [
    'value',
    'date',
    'organ',
    'title',
    'times',
    'addWay',
    'index',
    'isAppointNumber'
  ],
  data () {
    return {
      show: false,
      stateStyle: APPOINT_STATUS_NEW_COLOR,
      initValue: {
        addWay: this.addWay,
        appointmentDate: this.date,
        appointmentStarttime: this.value.startTime,
        appointmentEndtime: this.value.endTime,
        appointmentResourceId: this.value.resourceId,
        appointmentResourceName: this.value.resourceName,
        appointmentResourceType: this.value.resourceType,
        serviceid: this.value.serviceList
          ? this.value.serviceList[0].serviceId
          : '',
        serviceId: this.value.serviceList
          ? this.value.serviceList[0].serviceId
          : '',
        serviceName: this.value.serviceList
          ? this.value.serviceList[0].serviceName
          : '',
        deptId: this.value.deptId,
        deptName: this.value.deptName
      }
    }
  },
  watch: {
    date (val) {
      this.initValue.appointmentDate = val
    },
    value (val) {
      if (val) {
        Object.assign(this.initValue, {
          appointmentStarttime: val.startTime,
          appointmentEndtime: val.endTime,
          appointmentResourceId: val.resourceId,
          appointmentResourceName: val.resourceName,
          appointmentResourceType: val.resourceType,
          serviceid: val.serviceList ? val.serviceList[0].serviceId : '',
          serviceId: val.serviceList ? val.serviceList[0].serviceId : '',
          serviceName: val.serviceList ? val.serviceList[0].serviceName : '',
          deptId: val.deptId,
          deptName: val.deptName
        })
      }
    }
  },
  created () {
    this.show = false
  },
  methods: {
    appointSuccess (val) {
      this.$emit('success', val)
    },
    appointLock (e) {
      e.stopPropagation()
      this.$emit('lock', this.value)
    }
  },
  components: {
    formContent
  },
  computed: {
    isEmploy () {
      if (!this.value || this.value.sliceStockAmount > 0) {
        return false
      }
      let startTimes1 = this.value.startTime.split(':')
      let startTimes2 = this.value.appointmentDtoList[0].appointmentStarttime.split(
        ':'
      )
      let endTimes1 = this.value.endTime.split(':')
      let endTimes2 = this.value.appointmentDtoList[0].appointmentEndtime.split(
        ':'
      )
      let begin1 = parseInt(startTimes1[0]) * 60 + parseInt(startTimes1[1])
      let begin2 = parseInt(startTimes2[0]) * 60 + parseInt(startTimes2[1])
      let end1 = parseInt(endTimes1[0]) * 60 + parseInt(endTimes1[1])
      let end2 = parseInt(endTimes2[0]) * 60 + parseInt(endTimes2[1])
      return begin1 >= begin2 && end1 <= end2
    },
    isShowBlock () {
      if (
        this.value.appointmentDtoList &&
        this.value.appointmentDtoList[0] &&
        this.value.sliceStockAmount === 0 &&
        this.value.startTime === this.value.appointmentDtoList[0].appointmentStarttime
      ) {
        return false
      } else {
        return true
      }
    },
    blockStyle () {
      let style = []
      if (this.isEmploy || (!this.value.isValid && !this.value.isCanAppoint)) {
        style.push('disabled')
      }
      if (this.value.appointmentDtoList[0] && this.stateStyle[this.value.appointmentDtoList[0].appointmentState]) {
        style.push(this.stateStyle[this.value.appointmentDtoList[0].appointmentState].cardStyle)
      }
      return style.join(' ')
    }
  }
}
</script>
<style scoped>
.addblock {
  height: 62px;
  width: 136px;
  border: 1px dashed #aaa;
  border-left: 2px solid #aaa;
  padding: 5px;
  line-height: 1.2;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 10px;
  background: #fff;
  position: relative;
  color: #666;
}
.addblock span {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
}
.addblock strong {
  font-size: 12px;
  display: block;
}
.addblock strong i.icon-tianjia {
  font-size: 12px;
}
.addblock span.appointlock {
  display: none;
  font-size: 16px;
  position: absolute;
  z-index: 999;
  right: 5px;
  top: 5px;
  color: #aaa;
}
.addblock:hover span.appointlock {
  display: block;
}
.disabled {
  background: #d8f1bc;
  color: #61a812;
  border-color: #61a812;
}
.disabled.blue {
  background: #dfedff;
  color: #1c7bef;
  border-color: #1c7bef;
}
.disabled.green {
  background: #d8f1bc;
  color: #61a812;
  border-color: #61a812;
}
.disabled.orange {
  background: #ffeac8;
  color: #e38748;
  border-color: #e38748;
}
.disabled.red {
  background: rgba(238, 68, 51, 0.16);
  color: #ee4433;
  border-color: #ee4433;
}
.disabled.violet {
  background: #efddff;
  color: #bd10e0;
  border-color: #bd10e0;
}
.disabled.gray {
  background: #cccccc;
  color: #666666;
  border-color: #666666;
}
.disabled.deepblue {
  background: #d6e0ec;
  color: #366298;
  border-color: #366298;
}
.reason {
  font-size: 12px;
  width: 120px;
  display: none;
  line-height: 2;
  position: absolute;
  top: -17px;
  right: 20px;
  line-height: 1.7;
  border: 1px solid #ccc;
  background: #fff;
  padding: 5px 10px;
  color: #000;
  z-index: 10001;
}
.appointlock:hover .reason {
  display: block;
}
</style>
