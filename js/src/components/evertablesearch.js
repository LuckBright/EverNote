import {GENERATE_UUID as U} from '@/bi/util/reportsetuuid'
export default {
  methods: {
    // 查询方法
    list (searchFirstPage = true) {
      // 查询条件改变时触发查询
      this.params = {
        ...this.queryObj,
        _uuid: U(), // 当没有条件改变时也触发查询
        searchFirstPage, // 控制是否查询第一页
      }
    },
    // 此方法会在页面初始化时执行
    changeParams (params) {
      // 给表单赋值
      this.queryObj = {...this.queryObj, ...params}
      // 此时需要按照url地址栏的页码进行查询 (即不按照第一页去查)
      this.list(false)
      // 开始侦听queryObj的变化，当queryObj变化时，进行查询
      if (!this.notAutoSearch) {
        this.$watch('queryObj', function () {
          this.list()
        }, {deep: true})
      }
    },
  },
}
