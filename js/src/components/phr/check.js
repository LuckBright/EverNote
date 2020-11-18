export default {
  created () {
    if (!this.patientId) {
    //   this.$messageTips(this, 'warning', '请指定患者')
      return false
    }
  }
}
