import Vue from 'vue'
import store from '@/store'
import '@/main.js'
import '@/comps.clinical.js'
import App from '@/App'
import Router from 'vue-router'
import TitanCareRouter from '@/titancare/router'
// import TitanCareRouter from '@/titancare/router/test.route'
import { beforeEach } from '@/util/router.each'
import i18n from '@/assets/locals'
// import '@/assets/css/app.less'
// import './assets/css/video.less'
// import './assets/css/element-variables.scss'
// import './assets/css/iconfont/iconfont.css'
require('normalize.css')
require('vue2-animate/dist/vue2-animate.min.css')
require('nprogress/nprogress.css')

require('@/assets/css/element-variables.scss')
require('@/assets/css/element-table.less')
require('@/assets/css/element-dialog.less')
require('@/assets/css/element-form.less')
require('@/assets/theme/iconfont/iconfont.css')
require('@/assets/css/app.less')

import { ever } from '@/store/common'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import rate from 'vue-rate'
import uploadFile from '@/titancare/components/uploadfile' // 1
// import everDialog from '@/titancare/components/dialog' // 1
// import everPopover from '@/titancare/components/popover' // 1
import sysNum from '@/titancare/components/sysnumber.vue' // 1
import VueClipboard from 'vue-clipboard2' // 1
import TIM from 'tim-js-sdk' // 1
import everImage from '@/titancare/components/base/ever-image.vue' // 1
// import VideoPlayer from 'vue-video-player' // 1

import { getInstance } from '@/titancare/api/api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()
axios.defaults.baseURL += prefix.cms

// require('video.js/dist/video-js.css') // 1
// require('vue-video-player/src/custom-theme.css') // 1
// Vue.use(VideoPlayer)

Vue.use(preview, {
  fullscreenEl: false
})
Vue.use(rate)
Vue.use(ever)
Vue.use(VueClipboard)
// Vue.component('everPopover', everPopover)
Vue.component('everUploadFile', uploadFile)
// Vue.component('everDialog', everDialog)
Vue.component('sysNum', sysNum)
Vue.component('everImage', everImage)
Vue.component('readonlyitem', {
  props: ['value'],
  template: '<span>{{value || ""}}</span>'
})

Vue.prototype.$_TIM = TIM
Vue.prototype.$get = axios.get
Vue.prototype.$post = axios.post
Vue.use(Router)
let router = new Router({
  routes: [...TitanCareRouter]
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
