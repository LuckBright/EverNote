/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:48:02
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-20 17:14:43
 */
import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import App from '@/App'
import Router from 'vue-router'
import Order from './router'
import i18n from '@/assets/locals/index'
import { beforeEach } from '@/util/router.each'
export * from '@/warehouse/comps'
import proto from '@/warehouse/prototype.fn'

Vue.use(proto)
Vue.use(Router)

let router = new Router({
  routes: Order
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

