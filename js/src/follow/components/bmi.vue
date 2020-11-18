<template>
  <div class="bmi-range">
    <el-form :model="bmi" ref="form" :inline="true">
      <el-form-item prop="min">
        <el-input-number
        v-model="bmi.min"
        :controls="false"
        controls-position="right"
        :min="0" :max="30"></el-input-number>
      </el-form-item>
      <el-form-item prop="westernObj">
        <span>--</span>
      </el-form-item>
      <el-form-item prop="max">
        <el-input-number
        v-model="bmi.max"
        :controls="false"
        controls-position="right"
        :min="0" :max="30">
        </el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import everInputNumber from '@/components/everinputnumber'
export default {
  components: {
    everInputNumber
  },
  props: ['value'],
  data () {
    return {
      bmi: {
        min: '',
        max: ''
      }
    }
  },
  watch: {
    'bmi': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  // Todo get set 如何传递出去一个对象
  // 计算
  // computed: {
  //   max: {
  //     set (val) {
  //       this.$emit('update:value', val)
  //     },
  //     get () {
  //       return this.value
  //     }
  //   },
  //   min: {
  //     set (val) {
  //       this.$emit('update:value', val)
  //     },
  //     get () {
  //       return this.value
  //     }
  //   }
// },
}
</script>
<style scoped>
.bmi-range .el-input-number {width:80px;text-align: center;}
</style>
