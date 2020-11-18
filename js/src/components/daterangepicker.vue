<template>
  <div class="ever_date_picker">
    <el-date-picker
      :type="dateType || 'daterange'"
      v-model="date"
      :placeholder="placeholder || '_年_月_日'"
      :size="size"
      @change="change"
      :disabled="disabled"
      :clearable="!noclear"
      :picker-options="pickerOptions"
      :style="{width:customWidth ? customWidth : autoWidth ? 'auto' : '260px'}"
      range-separator="至"
      :start-placeholder="startPlaceholder || '_年_月_日'"
      :end-placeholder="endPlaceholder || '_年_月_日'"
      :unlink-panels="unlinkPanels ? true : false"
      :default-time="defaultTime || []"
    ></el-date-picker>
    <template v-if="shortcut">
      <el-button-group class="ml10">
        <el-button @click="lastWeek()" icon="arrow-left">上一周</el-button>
        <el-button @click="nextWeek()" icon="arrow-right">下一周</el-button>
        <el-button @click="currWeek()">本周</el-button>
      </el-button-group>
    </template>
    <template v-if="showday">
      <el-button-group class="ml10">
        <el-button @click="beforeDay()" icon="arrow-left">前一天</el-button>
        <el-button @click="nextDay()" icon="arrow-right">后一天</el-button>
        <el-button @click="toDay()">今天</el-button>
      </el-button-group>
    </template>
  </div>
</template>

<script>
export default {
  /**
   * props                        字段含义
   * @param unlinkPanels          在范围选择器里取消两个日期面板之间的联动
   * @param startPlaceholder      范围选择时开始日期的占位内容
   * @param endPlaceholder        范围选择时结束日期的占位内容
   * @param defaultTime           选中日期后的默认具体时刻如：['00:00:00', '23:59:59']
   * @param placeholder           非范围选择时的占位内容
   */
  props: ['value', 'customWidth', 'autoWidth', 'disabled', 'outformat', 'size', 'pickerOptions', 'start', 'end', 'shortcut', 'showday', 'noclear', 'unlinkPanels', 'dateType', 'placeholder', 'startPlaceholder', 'endPlaceholder', 'defaultTime'],
  computed: {
    date: {
      set (newVal) {
        if (newVal && newVal.length && newVal[0]) {
          this.$emit('input', [this.$moment(newVal[0]).format(this.outformat || 'YYYY-MM-DD'), this.$moment(newVal[1]).format(this.outformat || 'YYYY-MM-DD')])
          this.$emit('update:start', this.$moment(newVal[0]).format(this.outformat || 'YYYY-MM-DD'))
          this.$emit('update:end', this.$moment(newVal[1]).format(this.outformat || 'YYYY-MM-DD'))
        }
        if (!newVal || !newVal.length || !newVal[0]) {
          this.$emit('input', [])
          this.$emit('update:start', '')
          this.$emit('update:end', '')
        }
      },
      get () {
        return this.value ? this.value : [this.start, this.end]
      }
    }
  },
  methods: {
    change () {
      this.$emit('change')
    },
    lastWeek () {
      this.date = [this.$moment(this.date[0]).subtract(7, 'days'), this.$moment(this.date[0]).subtract(1, 'days')]
    },
    nextWeek () {
      this.date = [this.$moment(this.date[1]).add(1, 'days'), this.$moment(this.date[1]).add(7, 'days')]
    },
    currWeek () {
      let dayNum = this.$moment().day()
      let start = this.$moment().subtract(dayNum - 1, 'days')
      let end = this.$moment(start).add(6, 'days')
      this.date = [start, end]
    },
    beforeDay () {
      this.date = [this.$moment(this.date[0]).subtract(1, 'days'), this.$moment(this.date[0]).subtract(1, 'days')]
    },
    nextDay () {
      this.date = [this.$moment(this.date[1]).add(1, 'days'), this.$moment(this.date[1]).add(1, 'days')]
    },
    toDay () {
      let start = this.$moment().startOf('day').format('YYYY-MM-DD')
      let end = this.$moment().startOf('day').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_date_picker {
  display: flex;
  align-items: center;
  .el-date-editor {
    /deep/ .el-range-separator {
      line-height: 28px;
    }
  }
}
</style>
