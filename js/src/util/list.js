import displayFormat from '@/util/displayformat'
import { debounce } from '@/util/common'

var component = {
  mounted () {
    this.pagesize = this.customPagesize || this.pagesize
    if (this.isUrlQuery() && this.$route.query.q) {
      this.offset = (this.current - 1) * this.pagesize
      try {
        let query = JSON.parse(this.$route.query.q)
        if (query.codesMatchValues) query.codesMatchValues[0].value = '' // 支持warehouse 高表数据结构查询刷新页面时，清空查询值
        query.u = true // 设置 query 是 url query 类型
        Object.assign(this.queryObj, query)
      } catch (e) {
      }
    }
    if (!(this.queryObj && this.queryObj.requestSwitch)) {
      this.list()
    }
  },
  data () {
    return {
      warningType: '',
      tableData: [],
      emptyData: false,
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      loading: false,
      pageSizes: [10, 20, 30, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: Number(this.$route.query.page) || 1,
      currentRow: []
    }
  },
  methods: {
    // 点击当前行变色 修改样式
    handleRowCurrentChange (val) {
      this.currentRow = val
    },
    toEdit: function (id) {
      this.$router.push(this.$route.path + '/' + id)
    },
    // 延迟400毫秒查询
    query: debounce(function (queryObject) {
      this.queryObj = queryObject
      this.handleCurrentChange(1)
    }, 400),
    async update (updateObj, done) {
      this.updateObj = updateObj
      await this.handleUpdate(done)
    },
    list: function (refresh) {
      this.loading = true
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      var params = Object.assign({}, this.queryObj, this.listParams)
      for (let key in params) {
        if (params[key] === '' || key === 'requestSwitch') {
          delete params[key]
        }
      }
      if (this.isUrlQuery() && !this.notUseQuery) {
        let queryObj = Object.keys(this.queryObj).reduce((acc, curr) => {
          if (this.queryObj[curr]) {
            acc[curr] = this.queryObj[curr]
          }
          return acc
        }, {})
        // 组件中用到list，但是使用者还有自定义query时候兼容一下
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...this.$route.query, // 保留url中的query参数
            q: JSON.stringify(queryObj),
            page: this.current,
            pagesize: this.pagesize
          }
        })
      }
      params.page = this.current // 兼容需要page作为分页参数的接口
      params.offset = this.offset
      params.pagesize = this.pagesize
      try {
        // 查询接口时，如未查询到数据， 不清空之前的tableData
        if (!this.noClearTableData) {
          this.tableData = []
        }
        // this.listApiName 自定义api名称
        this.api[this.listApiName || 'list'](params).then(result => {
          this.loading = false
          if (result) {
            if (result.warningType) this.warningType = result.warningType
            if ('list' in result) {
              this.tableData = result.list
            } else if ('data' in result) {
              this.tableData = result.data
            } else {
              this.tableData = result
            }
            this.totalCount = result.totalCount ? result.totalCount : 0
            if (this.tableData && 'resultList' in this.tableData) {
              this.totalCount = this.tableData.totalCount
              this.tableData = this.tableData.resultList
            }
            if (this.tableData && !this.tableData[0]) {
              this.tableData = []
              this.emptyData = true
            }
            this.afterList && this.afterList(result)
          } else {
            this.emptyData = true
            this.totalCount = 0
          }
        })
      } catch (err) {
        this.loading = false
        this.emptyData = false
        // console.log(err)
      }
    },
    async handleUpdate (done) {
      let params = Object.assign({}, this.updateObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      await this.api.update(params)
    },
    handleEdit (index, row) {
      // console.log(index, row)
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.splice(index, 1)
        // return this.api.del(row[index].id)
        return this.api.del(row.id, row)
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功！', '提示')
        this.list()
      }).catch((e) => {
        return false
      })
    },
    del (id, row) {
      return this.api.del(id, row).then(res => {
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功！', '提示')
        }
        this.list()
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list()
      return this.pageAfter && this.pageAfter(this.pagesize)
    },
    doAdd (route) {
      this.$router.push(route)
    },
    delById (id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.api.del(id)
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功！', '提示')
        this.list()
      }).catch((e) => {
        return false
      })
    },
    isUrlQuery () {
      if (this.noStoreQuery) {
        return false
      }
      if (!this.queryObj) {
        return false
      }
      return this.$el && this.$el.className && this.$el.className.indexOf('el-dialog') === -1
    },
    getNewList: debounce(function (queryObj) {
      this.list()
    }, 400),
    ...displayFormat
  },
  watch: {
    // 监听页面query对象变化，延时500ms 重新查询页面 如果data里面定义 disAutoSearch（禁用自动查询）=true 不自动查，不设置则自动查询
    // 'queryObj': {
    //   handler: debounce1(function () {
    //     if (!this.disAutoSearch) {
    //       this.list()
    //     }
    //   }, 300),
    //   deep: true
    // },
    'queryObj.requestSwitch': {
      handler (cur) {
        this.list('queryObj.requestSwitch', cur)
      }
    }
  }
}

export default component
