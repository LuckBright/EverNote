/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-11-09 11:13:59
 * @LastEditTime: 2020-11-14 17:54:26
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */

export default {
  computed: {
    storageroomSystemConfig () {
      return this.$store.state.processConfig.storageroomSystemConfig || {}
    },
    // printName 目前只在出入库显示序号和其搜索条件 其他页面暂时隐藏
    printCodeSetting () {
      return ['outputs', 'entrys'].includes(this.$route.name) ? this.storageroomSystemConfig.printCodeSetting || 2 : 2
    }
  },
  methods: {
    createdSchema (schema, printCode) {
      if (printCode !== 1) {
        let printCodeIndex = schema.findIndex(key => key.name === 'printCode')
        if (~printCodeIndex) {
          schema.splice(printCodeIndex, 1)
        }
      }
      return schema
    }
  },
}
