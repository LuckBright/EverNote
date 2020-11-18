var reg = /(\/\w*){3,}/

function regRoute (pre) {
  if (reg.test(pre)) {
    var arr = pre.split('/')
      .filter(v => v)
    pre = '/' + arr[0] + '/' + arr[1]
  }
  return pre
}

export default {
  data: function () {
    return {
      active: regRoute(this.$route.path)
    }
  },
  watch: {
    '$route': function (newVal) {
      this.active = regRoute(this.$route.path)
    }
  },
  methods: {
    handleOpen () {},
    handleClose () {}
  }
}
