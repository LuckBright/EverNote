<template>
  <div class="ever_date_picker">
    <el-button @click="beforeDay()" class="btn">前一天</el-button>
    <el-date-picker
      type="date"
      v-model="date"
      placeholder="选择日期"
      :size="size"
      @change="change"
      :disabled="disabled"
      :clearable="!noclear"
      :picker-options="pickerOptions"
      class="ml5 h37"
      :style="{width: autoWidth ? 'auto' : 'auto'}">
    </el-date-picker>
    <el-button @click="nextDay()" class="ml5 btn">后一天</el-button>
    <el-button @click="toDay()" class="ml5 btn">今天</el-button>
  </div>
</template>

<script>
export default {
  props: ['value', 'autoWidth', 'disabled', 'outformat', 'size', 'pickerOptions', 'start', 'end', 'noclear', 'unedit'],
  computed: {
    date: {
      set (newVal, oldVal) {
        if (newVal) {
          this.$emit('input', this.$moment(newVal).format(this.outformat || 'YYYY-MM-DD'))
        }
        if (!newVal) {
          this.$emit('input', '')
        }
      },
      get () {
        return this.value ? this.value : ''
      }
    }
  },
  methods: {
    change (val, oldVal) {
      this.$emit('change', val)
    },
    beforeDay () {
      if (!this.unedits()) return false
      if (this.date === '') {
        let tempdate = this.$moment().startOf('day').format('YYYY-MM-DD')
        this.date = this.$moment(tempdate).subtract(1, 'days')
      } else {
        this.date = this.$moment(this.date).subtract(1, 'days')
      }
    },
    nextDay () {
      if (!this.unedits()) return false
      if (this.date === '') {
        let tempdate = this.$moment().startOf('day').format('YYYY-MM-DD')
        this.date = this.$moment(tempdate).add(1, 'days')
      } else {
        this.date = this.$moment(this.date).add(1, 'days')
      }
    },
    toDay () {
      if (!this.unedits()) return false
      this.date = this.$moment().startOf('day').format('YYYY-MM-DD')
    },
    unedits () {
      this.unedit && this.$messageTips(this, 'warning', '请先保存今日看板的内容后再进行日期切换操作。')
      return !this.unedit
    }
  }
}
</script>
<style lang="scss" scoped>
  .ever_date_picker{
    display: flex;
    align-items: center;
    .el-date-editor{
      /deep/ .el-range-separator{
        line-height: 28px;
      }
      /deep/ .el-input__inner {
         border-radius: 4px;
         height:36px;
      }
    }
  }
  .btn{
    height:36px;
    width:25%;
    padding: 9px 0px;
    border: 1px solid #BCC9D7;
    border-radius: 4px;
  }
  .h37{
    height:36px;
  }
</style>
