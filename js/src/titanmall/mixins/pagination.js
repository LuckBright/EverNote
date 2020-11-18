export default {
  data () {
    return {
      tableData: [],
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      loading: false,
      pageSize: [ 10, 20, 30, 50 ],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: 1,
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.getDataValues()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize
      this.getDataValues()
    },
  },
}
