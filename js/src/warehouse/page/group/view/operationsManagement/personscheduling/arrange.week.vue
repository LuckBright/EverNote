<template>
  <div>
    <div v-if="pre === 'normal'">
      <el-button  plain @click="getWeeks('prev')"><i class="el-icon-arrow-left"></i> 前一周</el-button>
      <el-button  plain @click="getWeeks('next')">后一周 <i class="el-icon-arrow-right"></i></el-button>
      <el-button  plain @click="getWeeks('now')">本周</el-button>
      <el-date-picker
        v-model="input"
        @change="change"
        :firstDayOfWeek="1"
        :picker-options="{
          'firstDayOfWeek': beginDay === 'Monday' ? 1 : 7
        }"
        type="date"
        value-format="yyyy-MM-dd"
        :editable="false"
        :clearable="false"
        placeholder="选择日期"
        style='margin-left:10px'>
      </el-date-picker>
    </div>
    <div v-else class="mt10 mb5">
      <span   @click="getWeeks('prev')"><i class="icon iconfont icon-date_lefe"></i></span>
      <el-date-picker
        v-model="input"
        @change="change"
        :firstDayOfWeek="1"
        :picker-options="{
          'firstDayOfWeek': beginDay === 'Monday' ? 1 : 7
        }"
        type="date"
        value-format="yyyy-MM-dd"
        :clearable="false"
        :editable="false"
        placeholder="选择日期"
        style='margin-left:10px'>
      </el-date-picker>
      <span @click="getWeeks('next')">
        <i class="icon iconfont icon-date_right ml10"></i>
      </span>
    </div>
  </div>
</template>
<script>
import { getCurrWeekDays, getWeekDates } from '@/util/common'
export default {
  props: {
    'value': {
      type: String,
      default: ''
    },
    'beginDay': {
      type: String,
      default: 'Sunday'
    },
    'pre': {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      getCurrWeekDays,
      getWeekDates,
      lastMonday: '',
      weeks: [],
      index: null,
      isContinue: '',
    }
  },
  computed: {
    input: {
      set (newVal, oldVal) {
        this.$emit('input', newVal ? this.$moment(newVal).format('YYYY-MM-DD') : '')
      },
      get () {
        return this.value ? this.value : ''
      }
    }
  },
  created () {
    this.getNowWeeks()
  },
  methods: {
    change (val) {
      this.getNowWeeks(val)
    },
    getWeeks (flag) {
      let changedate = flag === 'now' ? this.$moment().format('YYYY-MM-DD') : this.$moment(this.weeks[0].date).subtract(flag === 'prev' ? 7 : -7, 'days')
      this.input = flag === 'now' ? this.$moment().format('YYYY-MM-DD') : this.$moment(this.input).subtract(flag === 'prev' ? 7 : -7, 'days')
      this.getNowWeeks(changedate)
    },
    getNowWeeks (date) { // 本周
      let changedate = date || this.$moment().format('YYYY-MM-DD')
      this.weeks = this.beginDay === 'Monday' ? this.getWeekDates(changedate) : this.getCurrWeekDays(changedate)
      this.$emit('update', this.weeks, date)
      this.$bus.$emit('weeks', this.weeks)
    },
  }
}
</script>
<style lang="scss" scoped>
  .rotate180 {
    transform:rotate(180deg);
  }
</style>

