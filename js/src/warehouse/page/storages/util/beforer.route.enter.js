export default {
  data () {
    return {
      onKeepAlive: false,
      keepAliveCount: 0
    }
  },
  activated () {
    this.keepAliveCount++
    // 默认查询列表 keepAlive  重新进入
    if (this.keepAliveCount > 1) {
      this.onKeepAlive = true
      // this.keepAliveCount = 0
    } else {
      this.onKeepAlive = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 初始化查询数据
      vm._info && vm._info(false, true)
      // 清空查询条件参数
      let noClearParams = ['startDate', 'endDate']
      if (vm.noClearParams) noClearParams = [...noClearParams, ...vm.noClearParams]
      const schema = vm.querySchema ? 'querySchema' : 'schema' // 有可能querySchema变成schema （兼容处理）
      // from.path.indexOf('add') === from.path.length - 3 检查是否是新建（新建返回列表 清空查询条件）
      vm[schema] && Array.isArray(vm[schema]) && vm[schema].forEach(schema => {
        if (!vm.noClearDate || from.path.indexOf('add') === from.path.length - 3) {
          if (!noClearParams.includes(schema.name) && vm.queryObj) {
            // schema.initValue 非字符串类型值时：给定默认值
            schema.initValue ? vm.queryObj[schema.name] = schema.initValue : vm.queryObj[schema.name] = ''
          }
        }
      })
      // 默认查询列表 keepAlive  重新进入
      if (vm.onKeepAlive) {
        vm.list && vm.list()
      }
    })
  }
}
