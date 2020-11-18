import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import './components.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import manage from '@/manages/router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals'
import insurance from '@/insurance/router'
import '@/phr/assets/less/index.less'
import proto from '@/warehouse/prototype.fn'
Vue.use(proto)
Vue.use(Router)
let router = new Router({
  routes: [...manage, ...insurance]
})
router.$addRoutes = (params) => {
  router.matcher = new Router().matcher
  router.addRoutes(params)
}

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
