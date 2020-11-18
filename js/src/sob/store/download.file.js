
export default {
  data () {
    return {
      loadingStr: '导出',
      loading: false
    }
  },
  methods: {
    exportExceling () {
      return new Promise((resolve, reject) => {
        let load = async () => {
          let res = await this.api.exportService(this.$store.state.currentUser.organizationId)
          if (res && res.head && res.head.errCode === 0) {
            res.data ? resolve(res.data) : setTimeout(load, 3000)
          } else {
            reject()
          }
        }
        load()
      })
    },
    async exportExcel () {
      this.loadingStr = '导出中...'
      this.loading = true
      let res = await this.exportExceling()
        .catch(e => {
          setTimeout(_ => {
            this.loadingStr = '导出'
            this.loading = false
          }, 100)
        })
      this.loadingStr = '导出'
      this.loading = false
      const a = document.createElement('a')
      a.setAttribute('id', new Date().getTime())
      a.setAttribute('download', '')
      a.setAttribute('target', '_self')
      a.setAttribute('href', this.$ever.fileUrl2 + res.split('=')[1])
      document.body.appendChild(a)
      a.click()
      window.setTimeout(_ => {
        a.parentNode.removeChild(a)
      }, 1000)
    },
  }
}
