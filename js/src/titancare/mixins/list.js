export default {
  data () {
    return {
      tableData: [],
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      loading: false,
      pageSizes: [5, 20, 30, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: Number(this.$route.query.page) || 1
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.list()
      // return this.pageAfter && this.pageAfter(this.pagesize)
    }
    // list (refresh) {
    //   if (refresh) {
    //     this.current = 1
    //     this.offset = 0
    //   }
    //   var params = Object.assign({}, this.queryObj, this.listParams)
    //   params.offset = this.offset
    //   params.pagesize = this.pagesize
    //   try {
    //     this.api[this.listApiName || 'list'](params).then(res => {
    //       this.loading = false
    //       if (res && res.list) {
    //         this.totalCount = res.totalCount
    //         this.tableData = res.list || []
    //       }
    //     })
    //   } catch (err) {
    //     this.loading = false
    //     this.emptyData = false
    //   }
    // }
  }
}
