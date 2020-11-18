import Vue from 'vue'

import sizhen from '@/components/medical/sizhen'
import eyeballcheck from '@/components/medical/eyeballcheck'
import eyedcx from '@/components/medical/eyedcx'
import eyeocuexam from '@/components/medical/eyeocuexam'
import toothvalue from '@/components/medical/toothvalue/index'

import inputrange from '@/form/components/inputrange'
import phrform from '@/form/components/phrform'
import phrformDialog from '@/form/components/phrform.dialog'
import phrformApply from '@/components/schema.apply.form'
import remoteform from '@/form/components/remoteform'
import phrref from '@/form/components/phrref'
import phrdoc from '@/form/components/phrdoc'
import shoushujilu from '@/inpatient/components/sugery.show'
import everDiagnosis from '@/components/medical/sys.diagnosis'
import everAllergen from '@/components/medical/sys.allergen'
import everSkintest from '@/components/medical/skintest'
import breathinput from '@/form/components/breathinput'
import pulseinput from '@/form/components/pulseinput'
import eventinput from '@/form/components/eventinput'
Vue.component('shoushujilu', shoushujilu)
Vue.component('eyeocuexam', eyeocuexam)
Vue.component('phrref', phrref)
Vue.component('remoteForm', remoteform)
Vue.component('phrform', phrform)
Vue.component('phrformDialog', phrformDialog)
Vue.component('phrformApply', phrformApply)
Vue.component('phrdoc', phrdoc)
Vue.component('inputrange', inputrange)
Vue.component('toothvalue', toothvalue)
Vue.component('eyedcx', eyedcx)
Vue.component('eyeballcheck', eyeballcheck)
Vue.component('sizhen', sizhen)
Vue.component('ever-diagnosis', everDiagnosis)
Vue.component('ever-allergen', everAllergen)
Vue.component('ever-skintest', everSkintest)
Vue.component('breathinput', breathinput)
Vue.component('pulseinput', pulseinput)
Vue.component('eventinput', eventinput)
