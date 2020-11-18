<template>
  <div>
    <el-row v-model="select">
      <el-radio-group v-model="radio" @change="handleRadioChange" :disabled="disabled">
        <el-radio :label="1">全部终端</el-radio>
        <el-radio :label="2">自定义终端</el-radio>
      </el-radio-group>
      <el-checkbox-group v-model="secondCheckbox" v-show="radio == 2" @change="handleCheckboxChange" :disabled="disabled">
        <el-checkbox v-for="(item, i) in typeOptions" :label="item.id" :key="i">{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </el-row>
  </div>
</template>

<script>
import { TERMINAL_TYPE } from '@/card/util/cardcommon'
export default {
  props: ['value', 'disabled'],
  data () {
    return {
      typeOptions: TERMINAL_TYPE,
      radio: 1,
      secondCheckbox: []
    }
  },
  created () {},
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        let arr = this.value || []
        if (arr.length) {
          if (arr.indexOf('0') > -1) {
            this.radio = 1
          } else {
            this.radio = 2
            this.secondCheckbox = arr
          }
        }
        return arr
      }
    }
  },
  methods: {
    handleRadioChange (val) {
      if (val === 1) {
        this.secondCheckbox = []
        this.select = ['0']
      }
    },
    handleCheckboxChange (arr) {
      this.select = arr
    },
  }
}
</script>

