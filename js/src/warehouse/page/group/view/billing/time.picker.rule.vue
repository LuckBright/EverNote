<template>
  <el-time-picker
    style="width:120px;"
    v-model="time"
    :picker-options="pickerOptions"
    :clearable="false"
    format="HH:mm"
    placeholder="选择时间"
  ></el-time-picker>
</template>
<script>
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      pickerOptions: {
        format: 'HH:mm'
      }
    }
  },
  computed: {
    time: {
      set (newVal) {
        this.$emit('input', this.$moment(newVal).format('HH:mm'))
      },
      get () {
        let moment = this.$moment()
        let y = moment.year()
        let m = moment.month()
        let d = moment.day()
        return new Date(y, m, d, ...this.value.split(':'))
      }
    }
  }
}
</script>
