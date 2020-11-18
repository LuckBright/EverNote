<template>
  <el-autocomplete
    v-model="obj"
    :fetch-suggestions="query"
    @select="select"
    placeholder="输入模版关键词"
  >
    <el-button slot="prepend" type="primary">
      {{ btnName || '病历模版'}}
    </el-button>
  </el-autocomplete>
</template>

<script>
  import api from '../store/medicalapi'
  export default {
    props: ['value', 'tpltype', 'dptId', 'btnName'],
    data () {
      return {
        obj: this.value,
        timeout: null
      }
    },
    methods: {
      query (queryString, cb) {
        if (!this.obj) {
          cb([])
          return false
        }
        api.searchTemplate({
          type: this.tpltype,
          name: this.obj,
          dptId: this.dptId
        }).then(rs => {
          if (rs.data.resultList) {
            rs.data.resultList.forEach(item => {
              item.value = item.name
            })
          }
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(rs.data.resultList || [])
          }, 500)
        })
      },
      select (item) {
        this.$emit('select', item)
      }
    }
  }
</script>
