import Vue from 'vue'
import evereditor from 'evereditor'
// https://www.npmjs.com/package/multi-cascader-base-ele
import whCodeToName from '@/warehouse/page/components/code.to.name'
import whSingleCodeToName from '@/warehouse/page/components/single.code.to.name'
import materialSelect from '@/warehouse/page/components/material.select'
import materialShowName from '@/warehouse/page/components/material.show.name'
import whPopover from '@/warehouse/page/components/wh.popover'
import materialIcons from '@/warehouse/page/components/material.icons'
import multiCascader from 'multi-cascader-base-ele'
import whUploadFile from '@/warehouse/page/components/whuploadfile'
import whCascaderMulti from '@/warehouse/page/components/wh.cascader.multi'

Vue.use(multiCascader)
Vue.component('whCodeToName', whCodeToName)
Vue.component('whSingleCodeToName', whSingleCodeToName)
Vue.component('everWhUploadFile', whUploadFile)
Vue.component('evereditor', evereditor)
Vue.component('whCascaderMulti', whCascaderMulti)
Vue.component('materialSelect', materialSelect)
Vue.component('whPopover', whPopover)
Vue.component('materialShowName', materialShowName)
Vue.component('materialIcons', materialIcons)
