<template>
<div>
  <span v-for="(item, index) in tableData" :key="index">
    <el-input
      v-if="tableData.length"
      style="width: 75%; margin: 3px;"
      v-model="item.name"
      :placeholder="placeholder ? placeholder : label"
      :type="type"
      @blur="handleBlur"
      :disabled="disabled"
      :clearable="clearable"></el-input>
      <i class="iconfont icon-tianjia" v-if="index == tableData.length - 1" @click="add(1)"></i>
      <i class="iconfont" v-if="index != tableData.length - 1" @click="reduce(1)">-</i>
  </span>
</div>
</template>
<script>
import {warehouse as axios} from '../../store/api.js'
export default {
  props: ['placeholder', 'disabled', 'value', 'type', 'clearable', 'label', 'addOrDelette'],
  data () {
    return {
      msg: 'barcode',
      tableData: [{name: ''}],
      arr: []
    }
  },
  methods: {
    handleBlur () {
      this.$emit('input', this.arr)
    },
    reduce (index) {
      if (this.tableData.length === 1) return
      this.tableData.splice(index - 1, 1)
      this.arr = []
      for (let i = 0; i < this.tableData.length; i++) {
        this.arr.push(this.tableData[i].name)
      }
      this.$emit('input', this.arr)
    },
    add (index) {
      this.tableData.push({name: ''})
    },
    list (url, params) {
      return axios.post(url, params).then(result => {
        return result
      })
    }
  },
  watch: {
    'tableData': {
      handler: function (val) {
        this.arr = []
        for (let i = 0; i < val.length; i++) {
          this.arr.push(val[i].name)
        }
      },
      deep: true
    },
    'value' (val) {
      let tempArr = JSON.parse(JSON.stringify(val))
      if (tempArr.length > 0) {
        let arr = []
        for (let i = 0; i < tempArr.length; i++) {
          arr.push({
            name: tempArr[i]
          })
        }
        this.tableData = arr
      }
    }
  }
}
</script>
<style scoped>
.iconfont { border: 1px solid #999; border-radius: 50%; color: #999; font-size: 12px; width: 16px; height: 16px; display: inline-block; text-align: center; line-height: 16px;}
</style>
