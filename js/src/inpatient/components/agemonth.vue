<template>
  <div style="display:flex">
     <el-date-picker
       v-model="obj.birthday"
       align="right"
       type="date"
       placeholder="选择日期"
       :disabled="disabled ? true: false"
       style="display:inline-block;flex: 1;margin-right: 5px"
       :picker-options="pickerOptions"
      >
    </el-date-picker>
    <el-input-number v-model="obj.isMonth" :controls="false" :min="0" :max="12" :disabled="disabled ? true: false" class="times"></el-input-number>
    <span>月</span>
    <el-input-number v-model="obj.isDay" :controls="false" :min="0" :max="30" :disabled="disabled ? true: false" class="times"></el-input-number>
    <span>天</span>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        obj: {
          isMonth: '',
          birthday: '',
          isDay: ''
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now() || time.getTime() < moment(Date.now()).subtract(1, 'years')
          }
        }
      }
    },
    props: ['value', 'idno', 'disabled'],
    watch: {
      'obj.birthday': {
        handler: function (val) {
          if (val) {
            this.obj.isMonth = this.$moment().diff(this.$moment(val, 'YYYY-MM-DD'), 'days', false) >= 30 ? Math.floor(this.$moment().diff(this.$moment(val, 'YYYY-MM-DD'), 'days', false) / 30) : 0
            this.obj.isDay = this.$moment().diff(this.$moment(val, 'YYYY-MM-DD'), 'days', false) < 30 ? this.$moment().diff(this.$moment(val, 'YYYY-MM-DD'), 'days', false) : this.$moment().diff(this.$moment(val, 'YYYY-MM-DD'), 'days', false) % 30
          }
        },
        deep: true,
        immediate: true
      },
      'obj': {
        handler: function (newVal) {
          this.$emit('input', {
            isMonth: this.obj.isMonth,
            birthday: this.obj.birthday ? moment(this.obj.birthday).format('YYYY-MM-DD') : '',
            isDay: this.obj.isDay
          })
        },
        deep: true
      },
      'value': {
        handler (newVal) {
          if (newVal && typeof newVal === 'object') {
            Object.assign(this.obj, newVal)
          } else {
            Object.assign(this.obj, {
              isMonth: '',
              birthday: '',
              isDay: ''
            })
            this.$emit('input', this.obj)
          }
        },
        immediate: true
      },
      'idno': {
        handler (newVal) {
          if (newVal && String(newVal.type) === '1' && newVal.idNo.length > 14) {
            let year = this.$moment(newVal.idNo.substring(6, 14), 'YYYYMMDD')
            this.$emit('input', {
              birthday: year.format('YYYY-MM-DD'),
              isMonth: this.$moment().diff(year, 'days', true) >= 30 ? Math.floor(this.$moment().diff(year, 'days', true) / 30) : 0,
              isDay: this.$moment().diff(year, 'days', true) < 30 ? this.$moment().diff(year, 'days', true) : this.$moment().diff(year, 'days', true) % 30
            })
          }
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
.times{display:inline-block;width: 70px}
</style>

