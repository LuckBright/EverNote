<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
  // import topNav from '@/titanmall/components/top.nav'

  export default {
    components: {
      // topNav,
    },
    data () {
      return {
        navs: [
          {
            title: '资金对账单',
            url: '/titanmall/capital/capitalbills',
          },
          {
            title: '验证核销',
            url: '/titanmall/capital/capitalcheck',
          },
        ],
        pathUrl: '',
        showTopNav: false
      }
    },
    created () {
      this.navChange()
    },
    methods: {
      navChange () {
        let path = location.hash.substring(1)
        let arr = this.navs.filter(item => path.indexOf(item.url) > -1)
        if (!arr.length) {
          this.$router.push('/titanmall/capital/capitalbills')
          this.pathUrl = '/titanmall/capital/capitalbills'
        } else {
          this.pathUrl = arr[0].url
        }
        this.$nextTick(() => {
          this.showTopNav = true
        })
      },
    },
    watch: {
      $route: function (n, l) {
        this.showTopNav = false
        this.navChange()
      },
    },
  }
</script>

<style lang="less" scoped>
</style>
