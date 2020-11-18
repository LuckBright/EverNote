import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import qualityRoute from '@/qualitycontrol/router/route'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'
Vue.use(Router)
let router = new Router({
  routes: [...qualityRoute]
})
// router.$addRoutes = (params) => {
//   router.matcher = new Router().matcher
//   router.addRoutes(params)
// }

beforeEach(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App },
  store
})
