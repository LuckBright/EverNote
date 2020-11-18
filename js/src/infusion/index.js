import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import tech from '@/infusion/router/tech'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'

Vue.use(Router)
let router = new Router({
  routes: [...tech]
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
