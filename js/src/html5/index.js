import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import App from './App'
import htmls from '@/html5/router'
import Router from 'vue-router'
// import { beforeEach } from '@/util/router.each'

Vue.use(Router)
let router = new Router({
  routes: htmls
})

// beforeEach(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
