import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import demoRouter from '@/demo/router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-light.css'
// import 'highlight.js/styles/color-brewer.css'
Vue.use(VueHighlightJS)

Vue.use(Router)
let router = new Router({
  routes: [...demoRouter]
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
