var component = {
  data () {
    return {
      loading: false,
      current: Number(this.$route.query.page) || 1,
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      pageSizes: [10, 20, 30, 50, 100],
      tableData: []
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.customList()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.customList()
    },
    _encodeSearchParams (obj) {
      let queryObj = Object.keys(obj).reduce((acc, curr) => {
        if (obj[curr]) {
          acc[curr] = obj[curr]
        }
        return acc
      }, {})
      this.$router.replace({
        path: this.$route.path,
        query: {
          q: JSON.stringify(queryObj),
          page: this.current,
          pagesize: this.pagesize
        }
      })
    }
  }
}

export default component
