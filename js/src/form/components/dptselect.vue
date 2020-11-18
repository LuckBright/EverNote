<template>
<div>
  <el-select 
    v-model="dptId" 
    placeholder="请选择科室"
    clearable
    @change="getVal">
      <el-option
        v-for="item in dptList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
  </el-select>
</div>
</template>
<script>
import tplapi from '../store/phrtplapi'
export default {
  props: ['dptId'],
  data () {
    return {
      dptList: []
    }
  },
  created () {
    this.getDptList()
  },
  methods: {
    getVal (val) {
      this.$emit('change', val)
    },
    getDptList () {
      tplapi.dptList().then(res => {
        res.map((item, index) => {
          this.dptList[index] = {
            name: item.name,
            id: item.id
          }
        })
      })
    }
  }
}
</script>
