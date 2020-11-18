import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import BiRouter from '@/bi/router/birouter'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals'

Vue.use(Router)
let router = new Router({
  routes: [...BiRouter]
})

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
