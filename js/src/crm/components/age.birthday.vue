<template>
  <div style="display:flex">
    <ever-number
      v-model="age"
      :placeholder="'年龄'"
      :disabled="disabled"
      :max="150"
      :min="0"
      type="number"
      style="width:60px;"
    ></ever-number>
    <el-date-picker
      v-model="birthday"
      type="date"
      size="small"
      placeholder="选择生日"
      :disabled="disabled"
      style="display:inline-block;flex: 1;"
      class="ml10"
      :format="format"
      :value-format="valueFormat"
      :picker-options="pickerOptions"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
      },
      birthday: '',
      age: '',
      step: 2,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  created () {
    if (this.type === 'datetime') {
      this.format = 'yyyy-MM-dd HH:mm'
      this.valueFormat = 'yyyy-MM-dd HH:mm'
    }
  },
  watch: {
    value: {
      handler (val) {
        this.birthday = val
      },
      immediate: true,
    },
    birthday: {
      handler (val) {
        if (val) {
          this.step--
          if (this.step === 1) {
            this.age = this.$filters.formatAge(
              this.$moment(val).format('YYYY-MM-DD')
            )
          } else {
            this.step = 2
            this.age = this.$filters.formatAge(
              this.$moment(val).format('YYYY-MM-DD')
            )
          }
        } else {
          this.age = ''
        }
        this.$emit('input', val)
      },
      immediate: true,
    },
    age: {
      handler (val) {
        if (val || val === 0) {
          this.step--
          if (this.step === 1) {
            this.birthday = this.$moment()
              .add(-val, 'year')
              .format('YYYY-MM-DD')
          } else {
            this.step = 2
          }
        } else {
          this.birthday = ''
        }
      },
      immediate: true,
    },
  },
}
</script>
