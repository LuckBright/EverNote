<template>
  <el-select
    v-model="select"
    filterable
    remote
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    value-key="id"
    :loading="loading"
    style="width:100%"
  >
    <el-option v-for="item in options" :key="item.id" :value="item" :label="item.name">
      <span style="margin-right:10px;">{{item.diseaseCode}}</span>
      <span>{{item.name}}</span>
    </el-option>
  </el-select>
</template>

<script>
import api from '@/crm/store/healthy/followapi.js'
export default {
  props: {
    value: {
      type: [String, Object],
      default: ''
    },
    insuranceOrgId: [String]
  },
  data () {
    return {
      loading: false,
      options: []
    }
  },
  methods: {
    remoteMethod (query) {
      this.loading = true
      setTimeout(() => {
        this.getMedicalDiagnoseList(query)
      }, 200)
    },
    getMedicalDiagnoseList (query) {
      let queryParams = { origId: localStorage.getItem('CLINICID'), name: '' }
      if (query) {
        queryParams.name = query.trim()
      }
      api.diseaseSearch(queryParams).then(res => {
        let result = res.data.resultList.map(item => {
          item.id = item.diseaseCode
          item.name = item.diseaseName
          return item
        })
        this.options = result
        this.loading = false
      }, _ => {
        this.loading = false
        this.options = []
      })
    }
  },
  computed: {
    select: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: {
      handler: function (val, oldval) {
        if (val.id && val.name) {
          this.getMedicalDiagnoseList(val.name)
        }
      },
      immediate: true
    }
  }
}
</script>
