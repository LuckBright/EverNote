<template>
  <div>
    <div class="content clearfix">
      <div class="week_con fl">
        <div class="content_title">星期范围</div>
        <div class="time_content">
          <ever-select v-model="weekStart" :options="weekData" :clearable="true" width="42%" class="week_start"></ever-select>
          <span>-</span>
          <ever-select v-model="weekEnd" :options="weekData" :clearable="true" width="42%" class="week_end"></ever-select>
          <i class="icon iconfont icon-tianjia1 add_time"></i>
        </div>
      </div>
      <div class="minute_con fr">
        <div class="content_title">时间范围</div>
        <div class="time_content2" v-for="(minuteTime, i) in minute" :key="i">
          <el-time-select
            style="width: 40%"
            v-model="minuteTime.startTime"
            :placeholder="placeholderStart"
            :clearable="clearable ? true : false"
            :editable="editable ? true : false"
            :disabled="disabled"
            :readonly="readonly"
            :size="size"
            @change="changeStart(minuteTime.startTime, i)"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }">
          </el-time-select>
          <span>-</span>
          <el-time-select
            style="width: 40%"
            :placeholder="placeholderEnd"
            v-model="minuteTime.endTime"
            :clearable="clearable ? true : false"
            :editable="editable ? true : false"
            :disabled="disabled"
            :readonly="readonly"
            :size="size"
            @change="changeEnd(minuteTime.endTime, i)"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30',
              minTime: minuteTime.startTime
            }">
          </el-time-select>
          <i v-if="i == minute.length - 1" class="icon iconfont icon-tianjia1 add_time" @click="handelAddMinute"></i>
          <i v-else class="el-icon-minus add_time" @click="handelReduceMinute(i)"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// let arr = [{startTime: '', endTime: ''}]
export default {
  props: ['value', 'placeholderStart', 'placeholderEnd', 'clearable', 'editable', 'disabled', 'readonly', 'size', 'index'],
  data () {
    return {
      minute: [
        {
          startTime: '',
          endTime: ''
        }
      ],
      weekData: [
        {
          id: '1',
          name: '星期一'
        },
        {
          id: '2',
          name: '星期二'
        },
        {
          id: '3',
          name: '星期三'
        },
        {
          id: '4',
          name: '星期四'
        },
        {
          id: '5',
          name: '星期五'
        },
        {
          id: '6',
          name: '星期六'
        },
        {
          id: '7',
          name: '星期日'
        }
      ],
      weekStart: '',
      weekEnd: ''
    }
  },
  created () {
    console.log(this.value)
    if (this.value && this.value[0]) {
      this.minute = this.value
    }
  },
  methods: {
    changeStart (v, i) {
      if (!v) return
      this.minute[i].endTime = ''
      this._checkTime(v, i, 'start')
    },
    changeEnd (v, i) {
      if (!v) return
      this._checkTime(v, i, 'end')
    },
    handelAddMinute (type) {
      console.log(this.minute)
      if (type === 'week') {

      } else {
        this.minute.push({
          startTime: '',
          endTime: ''
        })
      }
    },
    handelReduceMinute (i, type) {
      if (type === 'week') {

      } else {
        this.minute.splice(i, 1)
      }
    },
    _checkTime (v, i, type) {
      console.log(this.minute)
      if (type === 'start') {
        this.minute[i].startTime = v
      } else {
        this.minute[i].endTime = v
      }
      this.$emit('changeMinute', this.minute)
    }
  }
}
</script>
<style lang="less" scoped>
.content {height: 100%; border: 1px solid #cccccc;}
.week_con {width: 50%; height: 100%;}
.minute_con {width: 50%; height: 100%;}
.content_title {width: 100%; background-color: #cccccc; text-align: center; padding: 10px 0}
.time_content {padding: 20px 10px; background-color: #ffffff;}
.time_content2 {padding: 20px 10px; border-top: 1px solid #cccccc; border-left: 1px solid #cccccc;}
.time_content2:nth-child(2) {border-top: none;}
.add_time {font-size: 24px; color: #cccccc; cursor: pointer;}
</style>
