import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import App from '@/App'
import Router from 'vue-router'
import index from '@/healthinsurance/router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals'
import '@/phr/assets/less/index.less'
import proto from '@/warehouse/prototype.fn'
import '@/healthinsurance/store/modules/insuraneCenter/index.js'

Vue.use(proto)
Vue.use(Router)
let router = new Router({
  routes: [...index]
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
