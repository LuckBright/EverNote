import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
// import '@/rcm/components/index.js'
import '@/rcm/assets/index.scss'
import App from '@/App'
import Router from 'vue-router'
import rcm from '../rcm/router/rcmrouter'
import financial from '../rcm/router/financial'
import financeistallrouter from './router/financeistallrouter' // 财务设置工作站
import reconstruct from '../rcm/router/reconstruct'
import accountmanage from '../rcm/router/accountmanage'
import proto from '@/warehouse/prototype.fn'

import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'

let arr = [...rcm, ...financeistallrouter, ...financial, ...reconstruct, ...accountmanage]
Vue.use(Router)
let router = new Router({
  routes: arr
})
Vue.use(proto)
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
