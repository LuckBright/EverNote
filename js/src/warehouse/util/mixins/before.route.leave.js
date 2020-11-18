export default {
  beforeRouteLeave (to, from, next) {
    if (this.clearupLoad) {
      this.clearupLoad.forEach(clear => {
        this[clear] = false
      })
    } else {
      this.loading = false
    }
    next()
  }
}
