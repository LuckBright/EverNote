<template>
  <el-select
    v-model="select"
    filterable
    clearable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.settlementNo"
      :label="item.settlementNo"
      :value="item.settlementNo">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: ['value', 'name', 'api', 'status', 'funcType'],
  data () {
    return {
      loading: false,
      options: []
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
      },
      get () {
        return this.value || this.value === '' ? this.value : ''
      }
    },
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        let params = { status: this.status, funcType: this.funcType }
        params[this.name] = query
        this.loading = true
        this.api(params).then(res => {
          this.loading = false
          let options = []
          res.data.map(item => {
            // 不同页面字段不统一带来的灾难
            item.settlementNo = item.settlementNo || item.settlementCode || item.innerSettleCode
            if (options.filter(v => v.settlementNo === item.settlementNo).length === 0) { // 去重
              options.push(item)
            }
          })
          this.options = options
        }, error => {
          this.loading = false
          console.log(error)
        })
      } else {
        this.options = []
      }
    }
  }
}
</script>
