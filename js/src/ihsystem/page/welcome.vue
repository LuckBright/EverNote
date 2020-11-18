<template>
  <div class="ever_bg_01 login_bg">
    <div class="wel"></div>
  </div>
</template>

<script>
// http下面兼容https的页面做了很多逻辑，全站https之后welcome可以跟着公用的走
import urlMap from '@/login/store/urls'
import { request } from '@/util/req'
import sessionapi from '@/auth/store/sessionapi'
import staticvars from '@/store/staticvars'
var preFix = staticvars.prefix

export default {
  data () {
    return {}
  },
  created () {
    this.setAuthData()
  },
  methods: {
    async setAuthData () {
      let _query = this.$route.query
      Object.keys(_query).forEach(key => {
        localStorage.setItem(key, decodeURIComponent(_query[key]))
      })
      const CLINIC_ID = localStorage.getItem('CLINICID')
      if (CLINIC_ID) {
        this.$store.commit('setUser', { organizationId: CLINIC_ID })
      }
      let [resources, user, menuArr] = await Promise.all([
        sessionapi.resources(),
        sessionapi.user(),
        request(urlMap.myBench.getMenusFromToken)
      ])
      if (
        resources.head &&
        resources.head.errCode &&
        resources.head.errCode !== 0
      ) {
        window.location = preFix + '/login'
        return
      } else {
        if (resources.rID) {
          this.$store.commit('setResources', resources.rID)
        }
      }
      if (user) {
        user.name = user.displayName
        this.$store.commit('setUser', user)
        this.$store.commit('setMobile', user.telephoneNumber)
      } else {
        window.location = preFix + '/login'
        return
      }
      if (menuArr.head.errCode === 0) {
        if (!menuArr.data) {
          return
        }
        localStorage.setItem('USERMENUS', this.getMenuData(menuArr.data.menus))
      }
      this.$router.push({
        name: 'ihlist'
      })
    },
    getMenuData (menus) {
      return JSON.stringify(menus.map(item => {
        // 判断菜单是否需要打开新的页面
        if (item.parentId !== '0' && item.url && (
          item.url.includes('.html') || // 包含html
          item.url.startsWith('http') // 或者以http开头
        )) {
          item.openType = '_blank'
        }
        return item
      }))
    }
  },
}
</script>
