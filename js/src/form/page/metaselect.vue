<template>
  <el-select v-model="selected"
    filterable
    remote
    clearable
    :remote-method="remoteMethod"
    :multiple="multiple || false"
    value-key="id"
    style="width: 100%"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="labelName ? `${item.displayName}(${item.name})` : item.displayName"
      :value="valueName ? item[valueName] : item">
    </el-option>
  </el-select>
</template>
<script>
import formapi from '../store/api'
export default {
  props: ['value', 'multiple', 'labelName', 'valueName'],
  data () {
    return {
      options: []
    }
  },
  created () {
    this.remoteMethod()
  },
  methods: {
    remoteMethod (query) {
      formapi.getMetas(query).then(result => {
        this.options = result
      })
    }
  },
  computed: {
    selected: {
      get () {
        // console.log('selected get', this.value)
        if (this.value) {
          let exist = this.options.filter(v => {
            return v.id === this.value.id
          }).length
          if (!exist && !this.multiple) {
            this.options.push(this.value)
          }
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
