<template>
  <el-select
    v-model="select"
    size="small"
    placeholder="请选择"
    :clearable="clearable == 'undefined' ? false : clearable"
    filterable
    value-key="resourceId"
  >
    <el-option v-for="(item, i) in resourceList" :key="i" :label="item.resourceName" :value="item"></el-option>
  </el-select>
</template>
<script>
import api from '@/arrange/store/schedulingapi'
export default {
  props: ['value', 'code', 'deptId', 'organId', 'clearable'],
  data () {
    return {
      api,
      select: '',
      resourceList: []
    }
  },
  watch: {
    value (val) {
      this.select = val
    },
    select (val) {
      this.$emit('input', val)
    },
    code (val) {
      this.getSchedulingResource()
    },
    deptId (val) {
      this.getSchedulingResource()
    }
  },
  methods: {
    getSchedulingResource () {
      if (!this.code || !this.deptId) {
        return false
      }
      this.resourceList = []
      this.api.searchResource(this.code, this.deptId, this.organId).then(rs => {
        rs.data.resultList.map(item => {
          this.resourceList.push({ resourceId: item.id, resourceName: item.resourceName, resourceType: item.resourceType })
        })
      })
    }
  }
}
</script>
