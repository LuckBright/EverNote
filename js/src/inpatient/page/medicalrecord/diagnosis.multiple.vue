<template>
  <div>
    <el-select
      v-model="select"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请输入诊断名称"
      :remote-method="remoteMethod"
      :loading="loading">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.diseaseName"
        :value="item.diseaseCode">
      </el-option>
    </el-select>
  </div>
</template>
<script>

import medicalapi from '@/workspace/store/medicalapi'
export default {
  props: ['value'],
  data () {
    return {
      medicalapi,
      loading: false,
      options: [],
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    remoteMethod (query) {
      if (query) {
        this.loading = true
        this.medicalapi.searchDiagnose({
          // type: 2,  // 诊断类型   0：中西医，1：中医诊断   2：西医诊断，3手术
          origId: this.$store.state.currentUser.organizationId,
          name: query
        }).then(rs => {
          this.loading = false
          this.options = rs.data.resultList
        })
      } else {
        this.options = []
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>
