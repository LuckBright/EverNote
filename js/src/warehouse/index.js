import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import './components.js'
import init from '@/warehouse/mixins/init.js'
import App from '@/App'
import proto from './prototype.fn'
import Router from 'vue-router'
import warehouse from '@/warehouse/router/warehouse'
import goods from '@/warehouse/router/goods'
import storages from '@/warehouse/router/storages'
import { beforeEach } from '@/util/router.each'
import { beforeEach as beforeEachWarehouse } from '@/warehouse/util/router.each'
import i18n from '@/assets/locals/index'
// todo: DrugCommonPlugin
import DrugCommonPlugin from '@/warehouse/views/util/mixin.plugin.js'
require('./util/directive')
Vue.use(Router)
Vue.use(DrugCommonPlugin)
Vue.use(proto) // 一些挂载在Vue原型链上的方法
Vue.use(init) // 如需进入warehouse初始化一些东西， 在init中添加
let router = new Router({
  routes: [...warehouse, ...goods, ...storages]
})
router.$addRoutes = (params) => {
  router.matcher = new Router().matcher
  router.addRoutes(params)
}
beforeEach(router)
beforeEachWarehouse(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App },
  store
})
