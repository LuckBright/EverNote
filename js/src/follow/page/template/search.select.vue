<template>
  <div>
    <el-select
      class="select"
      v-model="obj"
      multiple
      filterable
      remote
      :multiple-limit="5"
      value-key="id"
      :reserve-keyword="false"
      default-first-option
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { debounce } from '@/util/common'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
export default {
  props: {
    value: {
      type: Array,
      default: []
    },
    propertyId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      obj: [],
      options: [],
      selectList: [],
      loading: false,
    }
  },
  watch: {
    'obj': {
      handler (val) {
        this.$emit('input', this.obj)
        if (!val.length) this.options = []
      },
      deep: true
    },
    'value': {
      handler (val) {
        this.obj = val
      },
      deep: true,
    }
  },
  created () {
    this.options = []
  },
  methods: {
    remoteMethod: debounce(function (query) {
      if (query !== '') {
        this.loading = true
        request(urlMap.follow.property.getDynamicData, {
          propertyId: this.propertyId,
          keyword: query
        }, 'get').then(rs => {
          this.loading = false
          if (rs.head.errCode === 0) {
            this.options = this.value || []
            let resultList = []
            if (rs.data.customAnalysis.primaryColumn !== 'id') {
              resultList = rs.data.customData.map(item => {
                item.id = item[rs.data.customAnalysis.primaryColumn]
                item.name = item[rs.data.customAnalysis.showColumn]
                return item
              })
            } else {
              resultList = rs.data.customData ? rs.data.customData : []
            }
            let diagnosisOptions1 = resultList.filter(item => !this.options.some(ele => ele.id === item.id))
            this.options = [...this.options, ...diagnosisOptions1]
          } else {
            this.options = []
          }
        })
      }
    }, 200),
    setOptions (val) {
      this.options = val
    }
  }
}
</script>
<style lang="scss" scoped>
  .select{width:300px;}
</style>

