import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import titanMallRouter from '@/titanmall/router'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals'
import '@/assets/css/app.less'
import '@/titanmall/assets/css/index.less'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueQr from 'vue-qr'
// import VueAMap from 'vue-amap'
import Public from './components/public'
import uploadFile2 from './components/uploadfile2'

Vue.component('uploadFile2', uploadFile2)

require('./components/funcform')
Vue.use(VueAwesomeSwiper /* { default global options } */)
Vue.use(VueQuillEditor, {
  placeholder: '请输入内容',
})
Vue.use(VueQr)
// Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//   key: '160cab8ad6c50752175d76e61ef92c50',
//   plugin: [ 'Geocoder' ],
//   v: '1.4.4',
// })
Vue.prototype.$_narrowPrice = Public.narrowPrice
Vue.prototype.$_enlargePrice = Public.enlargePrice
Vue.prototype.$_imgCut = Public.imgCut

Vue.use(Router)
let router = new Router({
  routes: [ ...titanMallRouter ],
})

beforeEach(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App },
  store,
})
