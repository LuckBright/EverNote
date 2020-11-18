var reg = /(\/\w*){3,}/

function regRoute (pre, active) {
  if (active) {
    return active
  } else {
    if (reg.test(pre)) {
      var arr = pre.split('/')
        .filter(v => v)
      pre = '/' + arr[0] + '/' + arr[1]
    }
    return pre
  }
}

export default {
  data: function () {
    return {
      active: this.getActive()
    }
  },
  methods: {
    getActive () {
      let active
      if (this.$route.meta && this.$route.meta.noreg) {
        active = this.$route.path
      } else {
        active = regRoute(this.$route.path, this.$route.meta.active)
      }
      return active
    },
    handleOpen () {
    },
    handleClose () {
    }
  }
}
