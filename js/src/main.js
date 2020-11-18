// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
require('normalize.css')
require('@livelybone/vue-select/lib/css/index.scss')
require('vue2-animate/dist/vue2-animate.min.css')
require('nprogress/nprogress.css')

require('./assets/css/element-variables.scss')
require('./assets/css/element-table.less')
require('./assets/css/element-dialog.less')
require('./assets/css/element-form.less')
require('./assets/theme/iconfont/iconfont.css')
require('./assets/css/app.less')

import basemoment from 'moment'
import moment from 'vue-moment'
import { ever } from './store/common'
import everfilter from './filter/filter'
import docDownload from './components/documentdownload'
import uploadFile2 from './components/uploadfile2'
import everUpload from '@/components/ever-upload'
import everUpload1 from '@/components/everupload1'

import sysType from './components/systype'
import systype2 from './components/systype2'
import sysTypeCascader from './components/sys-type-cascader'
import sysSelect from './components/sysselect'
import sysRemoteSelect from './components/sysremoteselect'
import sysText from './components/systext'
import sysNumber from './components/sysnumber'
import sysCascader from './components/sys.cascader'
import sysSingleMulti from './components/singleormulti'
import valueSet from './components/value.set'
import sysFloat from './components/sysfloat'
import sysValue from './components/sysvalue'
import everForm from './components/form'
import sexSelect from './components/sexselect'
import everSelect from './components/select'
import doctorSelect from './components/doctor.select'
import everPagination from './components/pagination'
import everQueryForm from './components/queryform'
import autocomplete from './components/autocomplete'

import cell from './components/cell'
import formModel from './components/form-model'
import remoteSelect from './components/remoteselect'
import whRemoteSelect from './components/whremoteselect'
import remoteMethod from './components/remotemethod'
import breadcrumb from './components/breadcrumb'
import patientSelect from '@/components/patientselect'
import patientSelectQuery from '@/components/patientselectquery'
import VueBarcode from '@chenfengyuan/vue-barcode'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import providerSelect from './components/providerselect'
import everConfirm from './components/confirm'
import everNoData from './components/nodata'
import everPrice from './components/price'
import serviceSelect from './workspace/components/serviceselect'
import dateRangePicker from './components/daterangepicker'
import dateRange from './components/daterange'
import expandselect from './components/expand-select'
import userrel from './components/userrel'
import idcard from './components/idcard'
import sourceSelect from '@/crm/components/sourcesuggest'
import '@/components/clickonce'
import address from '@/components/address'
import readonlyitem from '@/components/readonlyitem'
import everOrgSelect from '@/manages/page/organization/components/everorgselect'
import everSubjectSelect from '@/manages/page/organization/components/eversubjectselect'
import everStaffSelect from '@/manages/page/organization/components/everstaffselect'
import everRoomSelect from '@/warehouse/page/building/components/everroomselect'
import everStorageroomSelect from '@/warehouse/page/components/storageroom.select.vue'
import rate from './components/rate'
import inputrange from '@/form/components/inputrange'
import paymethodstwo from '@/rcm/page/pay/paymethodstwo'

import medicalrecordTree from '@/form/components/medicalrecordtree'
import everTable from '@/components/evertable.vue'
import datePicker from './components/datepicker'
import everNumber from '@/components/evernumber'
import exportSql from '@/components/exportsql'
import EverComp from 'ever-comp'
import VueClipboard from 'vue-clipboard2'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

require('./components/funcform')
require('./components/readform')
require('./components/bindenter')
require('./assets/theme/iconfont/iconfont.js')
basemoment.locale('zh-cn')

Vue.use(ElementUI)
Vue.use(EverComp)
Vue.use(moment, {
  moment: basemoment
})
Vue.use(ever)
Vue.use(everfilter)
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
import {
  CascaderMulti
} from '@livelybone/vue-select'
Vue.component('cascaderMulti', CascaderMulti)

Vue.component('everTable', everTable)
Vue.component('paymethodstwo', paymethodstwo)
Vue.component('inputrange', inputrange)
Vue.component('everRate', rate)
Vue.component('systype2', systype2)
Vue.component('autocomplete', autocomplete)
Vue.component('sysText', sysText)
Vue.component('sysNumber', sysNumber)
Vue.component('sysSelect', sysSelect)
Vue.component('sysCascader', sysCascader)
Vue.component('sysRemoteSelect', sysRemoteSelect)
Vue.component('everAddress', address)
Vue.component('sourceSelect', sourceSelect)
Vue.component('idcard', idcard)
Vue.component('userrel', userrel)
Vue.component('expandSelect', expandselect)
Vue.component('serviceSelect', serviceSelect)
Vue.component('datePicker', datePicker)

Vue.component('sysType', sysType)
Vue.component('sysTypeCascader', sysTypeCascader)
Vue.component('sysSingleMulti', sysSingleMulti)
Vue.component('valueSet', valueSet)
Vue.component('sysFloat', sysFloat)
Vue.component('docDownload', docDownload)
Vue.component('uploadFile2', uploadFile2)
Vue.component('ever-upload', everUpload)

Vue.component('everForm', everForm)
Vue.component('sysValue', sysValue)
Vue.component('sexSelect', sexSelect)
Vue.component('everSelect', everSelect)
Vue.component('doctorSelect', doctorSelect)
Vue.component('everPagination', everPagination)
Vue.component('everQueryForm', everQueryForm)
// Vue.component('comments', comments)
Vue.component('everCell', cell)
Vue.component('everFormModel', formModel)
Vue.component('everRemoteSelect', remoteSelect)
Vue.component('everWhRemoteSelect', whRemoteSelect)
Vue.component('everRemoteMethod', remoteMethod)
Vue.component('everBreadCrumb', breadcrumb)
Vue.component('everPatientSelect', patientSelect)
Vue.component('everPatientSelectQuery', patientSelectQuery)
Vue.component('barcode', VueBarcode)
Vue.component('qrcode', VueQrcode)
Vue.component('everOrgSelect', everOrgSelect)
Vue.component('everSubjectSelect', everSubjectSelect)
Vue.component('everStaffSelect', everStaffSelect)
Vue.component('everRoomSelect', everRoomSelect)
Vue.component('everStorageroomSelect', everStorageroomSelect)

Vue.component('providerSelect', providerSelect)
Vue.component('everConfirm', everConfirm)
Vue.component('everNoData', everNoData)
Vue.component('everPrice', everPrice)
Vue.component('medicalrecordTree', medicalrecordTree)
Vue.component('readonlyitem', readonlyitem)
Vue.component('everReadonlyItemContent', {
  props: ['value', 'defaultField', 'slotVal', 'isValLeft'], // defaultField: 默认值 slotVal: 插槽值 isValLeft: 插槽值的显示位置
  template: `<span>{{isValLeft && slotVal ? slotVal : " "}}{{value ? value : defaultField || "无"}}{{isValLeft ? " " : slotVal}}</span>`
})
Vue.component('everRangePicker', dateRangePicker)
Vue.component('dateRange', dateRange)
Vue.component('everUpload1', everUpload1)
Vue.component('everNumber', everNumber)
Vue.component('everExportSql', exportSql)
Vue.use(VueClipboard)
// 将request和url挂载到vue原型上，调用请求时更加方便
// Vue.use('evercommon')
// function formatComponentName (vm) {
//   if (vm.$root === vm) return 'root'
//   let name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name
//   return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '')
// }
// Vue.config.errorHandler = function (err, vm, info) {
//   let componentName = formatComponentName(vm)
//   let propsData = vm.$options && vm.$options.propsData
//   console.log('error：', err, 'componentName：', componentName, 'propsData：', propsData, 'info：', info)
// }
Vue.config.productionTip = false
