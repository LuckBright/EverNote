import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import SystemsetRouter from '@/systemset/router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals'
import prototypeFn from '@/warehouse/prototype.fn'
Vue.use(Router)
Vue.use(prototypeFn)
let router = new Router({
  routes: [...SystemsetRouter]
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
