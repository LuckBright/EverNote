<template>
  <el-cascader placeholder="请选择数据元" style="width:100%" v-model="select" :options="options" :props="cascaderMulProps" filterable @change="change"></el-cascader>
</template>
<script>
import api from '@/form/store/api.js'

export default {
  props: ['val', 'multiple'],
  data () {
    return {
      api,
      options: [],
      select: '',
      cascaderMulProps: {
        expandTrigger: 'hover',
        emitPath: false,
        multiple: this.multiple ? this.multiple : false
      },
      arr: []
    }
  },
  created () {
    this.list()
  },
  methods: {
    change (val) {
      let obj = this.arr.find(item => {
        if (Object.prototype.toString.call(val).slice(8, -1) === 'Array') {
        } else {
          return val === item.name
        }
      })
      if (!obj) obj = val
      this.$emit('input', obj)
    },
    async list () {
      this.arr = []
      let res = await api.elementaryList({})
      res.map(item => {
        item.value = item.typeCode
        item.label = item.typeName
        item.children = item.list
        item.children.map(val => {
          this.arr.push(val)
          val.value = val.name
          val.label = val.displayName
          return val
        })
        return item
      })
      this.options = res
    }
  },
  watch: {
    'val': {
      handler: function (val) {
        this.change(val)
        this.select = val
      }
    }
  }
}
</script>
