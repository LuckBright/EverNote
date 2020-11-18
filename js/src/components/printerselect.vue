<template>
  <span>
    <el-select
      v-model="printer"
      placeholder="请选择打印机"
      clearable
      @change="change"
      style="width: 100%"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </span>
</template>
<script>
import jcp from 'jcpjs'

export default {
  props: ['value', 'disabled'],
  data () {
    return {
      options: []
    }
  },
  created () {
    this.initPrinter()
  },
  computed: {
    'printer': {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  methods: {
    initPrinter () {
      if (this.isWindows()) {
        jcp.getJCP().getPrinters(printers => {
          this.options = printers.map(item => {
            return {
              value: item,
              label: item
            }
          })
        })
      } else {
        this.options = [
          { value: '-1', label: '请选择打印机' }
        ]
      }
    },
    isWindows () {
      return /windows|win32/i.test(navigator.userAgent)
    },
    change (val) {
      this.$emit('change', val)
    }
  }
}
</script>
