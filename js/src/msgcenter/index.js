import Vue from 'vue'
import router from './router'
import store from '@/store/index'
import '@/main.js'
import App from '@/App'
import i18n from '@/assets/locals/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App },
  store
})

