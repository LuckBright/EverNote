export default {
  methods: {
    showTitleChange (val) {
      this.commonData.showTitle = val
      this._edit()
    },
    titleChange (title) {
      this.commonData.title = title
      this._edit()
    }
  }
}
