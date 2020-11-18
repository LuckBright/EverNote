<template>
  <div style="display:flex">
    <el-date-picker
      v-model="birthday"
      :type="type"
      size="small"
      placeholder="选择日期"
      :disabled="disabled"
      style="display:inline-block;flex: 1;"
      :format="format"
      :value-format="valueFormat"
      :picker-options="pickerOptions"
    >
    </el-date-picker>
    <span class="pl10" v-if="agestr">{{agestr}}</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      showAgeTextFlag: false,
      birthday: '',
      agestr: '',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
    }
  },
  props: {
    'value': {
      type: String,
      default: ''
    },
    // 'birthtime': {
    //   type: String,
    //   default: ''
    // },
    'disabled': {
      type: Boolean,
      default: false
    },
    'ageShowText': {
      type: String,
      default: ''
    },
    'type': {
      type: String,
      default: 'date'
    }
  },
  methods: {
  },
  created () {
    if (this.type === 'datetime') {
      this.format = 'yyyy-MM-dd HH:mm'
      this.valueFormat = 'yyyy-MM-dd HH:mm'
    }
  },
  watch: {
    'value': {
      handler (val) {
        this.birthday = val
      },
      immediate: true
    },
    'birthday' (val) {
      if (val) {
        this.agestr = this.$filters.birthdayComputed(val)
      } else {
        this.agestr = ''
      }
      this.$emit('input', val)
    },
    'ageShowText': {
      handler (val) {
        this.agestr = val || ''
      },
      immediate: true
    },
  }
}
</script>
