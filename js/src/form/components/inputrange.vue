<template>
  <el-form :model="obj" :rules="rules" ref="form" :size="size || 'small'">
    <el-row>
      <el-col :span="10">
        <el-form-item :prop="blood1"><el-input v-model="obj[blood1]" :placeholder="placeholderLeft" type="number" :disabled="disabled||false" title=""></el-input></el-form-item>
      </el-col>
      <el-col :span="4">
        <div style="text-align:center">-</div>
      </el-col>
      <el-col :span="10">
        <el-form-item :prop="blood2"><el-input v-model="obj[blood2]" :placeholder="placeholderRight" type="number" :disabled="disabled||false" title=""></el-input></el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
  import {blood1, blood2} from '@/emr/config/temperaturedata.js'
  export default {
    props: ['value', 'type', 'size', 'disabled'],
    data () {
      let validateHighBlood = (rule, value, callback) => {
        if (value) {
          value = Number(value)
          if (value < 0 || value > 300) {
            callback(new Error('有效值为0-300'))
          } else {
            if (isNaN(value)) {
              callback(new Error('请输入数字'))
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
      let obj = {}
      obj[blood1] = null
      obj[blood2] = null
      let rules = {}
      if (this.type === 1) {
        rules[blood1] = [
            {trigger: 'change', validator: validateHighBlood}
        ]
        rules[blood2] = [
            {trigger: 'change', validator: validateHighBlood}
        ]
        // rules = {
        //   blood1: [
        //     {trigger: 'change', validator: validateHighBlood}
        //   ],
        //   blood2: [
        //     {trigger: 'change', validator: validateHighBlood}
        //   ]
        // }
      }
      return {
        blood1,
        blood2,
        placeholderLeft: '',
        placeholderRight: '',
        obj,
        rules
      }
    },
    created () {
      if (this.type === 1) {
        this.placeholderLeft = '收缩压（mmHg）'// max
        this.placeholderRight = '舒张压（mmHg）'// min
      }
    },
    watch: {
      obj: {
        handler (val) {
          if (val) {
            if (!val[blood1]) {
              val[blood1] = null
            }
            if (!val[blood2]) {
              val[blood2] = null
            }
            if (!val[blood1] && !val[blood2]) {
              this.$emit('input', null)
            } else {
              this.$emit('input', val)
            }
          }
        },
        deep: true
      },
      value: {
        handler () {
          if (this.value) {
            Object.assign(this.obj, this.value)
            delete this.obj.min
            delete this.obj.max
          } else {
            this.obj[blood1] = null
            this.obj[blood2] = null
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      getStringVal () {
        if (!this.value) {
          return null
        }
        return this.value[blood1] + ',' + this.value[blood2]
      }
    }
  }
</script>
<style scoped>
  .el-form-item{
    margin-bottom: 0 !important;
  }
</style>
