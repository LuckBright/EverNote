import Vue from 'vue'
import store from '@/store/index'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import inpatient from '@/inpatient/router' // 住院护士功工作台
import resident from '@/router/resident' // 住院医生工作台
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals/index'
import MedRecManage from '@/medrecmanage/router/caserouter' // 病历管理工作站
import msgrouter from '@/message/router/msgrouter.js'

Vue.use(Router)
let router = new Router({
  routes: [...inpatient, ...resident, ...MedRecManage, ...msgrouter]
})
router.$addRoutes = (params) => {
  router.matcher = new Router().matcher
  router.addRoutes(params)
}

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
