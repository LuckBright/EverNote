import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import root from '@/login/router'
import Router from 'vue-router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'

Vue.use(Router)
let router = new Router({
  routes: [...root]
})

beforeEach(router)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  template: '<App/>',
  components: { App },
  store
})
