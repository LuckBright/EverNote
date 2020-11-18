import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import webrouter from '@/ihsystem/router/webrouter'
import Router from 'vue-router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'
import TIM from 'tim-js-sdk' // 1
import Viewer from 'v-viewer'
import TRTC from 'trtc-js-sdk'
import 'viewerjs/dist/viewer.css'
Vue.use(Router)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Vue.prototype.$_TIM = TIM
Vue.prototype.$_TRTC = TRTC
let router = new Router({
  routes: [...webrouter]
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
