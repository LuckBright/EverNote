import Vuex from 'vuex'
import Vue from 'vue'
import dispensing from './modules/dispensing'
import processConfig from './modules/process.config'
import medicalrecord from './modules/medicalrecord'
import {deepClone, deepCompare} from '@/util/fns'
import TIM from 'tim-js-sdk'
import COSSDK from 'cos-js-sdk-v5'
// import api from '@/titancare/api/content/live.js'
// import wapi from '@/ihsystem/store/webapi.js'
import { requestIh } from '@/util/req'
import urlMap from '@/titancare/utils/urls.js'

Vue.use(Vuex)

var state = {
  currentUser: {},
  currentOrg: {},
  resources: [],
  mobile: '',
  pending: 0,
  // api,
  // wapi,
  clientlength: 1,
  obj: null,
  preObj: null,
  csaIsScheduling: 1, // 用于区分手术麻醉患者列表排班情况
  csaOrAna: '', // 手麻路径跳转时候区分是医生还是护士
  deviceType: '101', // 终端管理visitType标识
  borrowType: 'first', // 病历借阅tab标识
  recallType: 'first', // 病历召回tab标识
  isNeonate: '', // 用于区分病区有没有新生儿登记接口
  workbenchFlag: '', // 用于区分不同工作台
  bindPatient: {}, // 预约信息
  macAddress: '', // 医保使用收费电脑的mac地址
  phrPatientActive: {}, // phr当前患者当天看诊日期对象
  cacheData: {},
  updating: false,
  tenantStatus: '0',
  versionHash: '',
  im: '',
  imReady: false,
  imMessage: {},
  revMessage: {},
  sig: '',
  estoppel: [],
  gdcfInsuranceInfo: {} // 长峰医保住院结算数据
}

var mutations = {
  setShowNav (state, n) {
    state.showNav = n
  },
  setExternal (state, n) {
    state.isExternal = n
  },
  // 租户更新状态
  setUpdating (state, value) {
    state.updating = value
  },
  // 租户新的更新状态
  setTenantStatus (state, value) {
    state.tenantStatus = value
  },
  setVersionHash (state, value) {
    state.versionHash = value
  },
  setPhrPatientActive (state, value) {
    state.phrPatientActive = value
  },
  setWorkbenchFlag (state, value) {
    state.workbenchFlag = value
  },
  setIsNeonate (state, value) {
    state.isNeonate = value
  },
  setCsaOrAna (state, value) {
    state.csaOrAna = value
  },
  setUser (state, user) {
    state.currentUser = user
  },
  setOrg (state, org) {
    state.currentOrg = org
  },
  setCsaIsScheduling (state, csaIsScheduling) {
    state.csaIsScheduling = csaIsScheduling
  },
  setResources (state, resources) {
    state.resources = resources
  },
  setMobile (state, mobile) {
    state.mobile = mobile
  },
  setPending (state, num) {
    state.pending += num
  },
  setClilength (state, len) {
    state.clientlength = len
  },
  setDocState (state, data) {
    state.obj = data.obj
    state.preObj = data.preObj
  },
  setDevice (state, type) {
    state.deviceType = type
  },
  setBorrow(state, type) {
    state.borrowType = type
  },
  setRecall(state, type) {
    state.recallType = type
  },
  setPatient (state, data) {
    state.bindPatient = data
  },
  setMacAddress (state, data) {
    state.macAddress = data
  },
  setAxiosCache (state, data) {
    if (state.cacheData[data.url]) {
      const existCache = state.cacheData[data.url].find(item => deepCompare(deepClone(item.params, true), deepClone(data.params, true)))
      if (existCache) {
        // 若能找到对应的缓存数据，则更新result
        existCache.result = data.result
      } else {
        // 否则，加入新的缓存
        state.cacheData = {
          ...state.cacheData,
          [data.url]: [...state.cacheData[data.url], {
            params: data.params,
            result: data.result,
          }]
        }
      }
    } else {
      state.cacheData = {
        ...state.cacheData,
        [data.url]: [{
          params: data.params,
          result: data.result,
        }]
      }
    }
  },
  setEstoppel (state, estoppel) {
    state.estoppel = estoppel
  },
  SET_IM (state, im) {
    state.im = im
  },
  SET_IM_READY (state, payload) {
    state.imReady = payload
  },
  SET_IM_REVOKED (state, msg) {
    state.revMessage = msg
  },
  SET_IM_MESSAGE (state, msg) {
    state.imMessage = msg
  },
  SET_IM_SIG (state, sig) {
    state.sig = sig
  },
  setGdcfInsuranceInfo (state, data) {
    state.gdcfInsuranceInfo = Object.assign(state.gdcfInsuranceInfo, data)
  }
}

var actions = {
  setUser (context) {
    context.commit('setUser')
  },
  loginIM ({ commit, state }) {
    if (state.im) return
    const { SDKAppID, userID, userSig } = state.sig
    const MESSAGE_RECEIVED = (event) => {
      commit('SET_IM_MESSAGE', event)
    }
    const MESSAGE_REVOKED = (event) => {
      commit('SET_IM_REVOKED', event)
    }
    const SDK_READY = (event) => {
      commit('SET_IM_READY', true)
    }
    const IM_ERROR = (event) => {
      console.error('IM_ERROR:', event)
    }
    const options = {
      SDKAppID: SDKAppID
    }
    const im = TIM.create(options)
    im.setLogLevel(1)
    im.registerPlugin({ 'cos-js-sdk': COSSDK })
    im.on(TIM.EVENT.SDK_READY, SDK_READY)
    im.on(TIM.EVENT.MESSAGE_RECEIVED, MESSAGE_RECEIVED)
    im.on(TIM.EVENT.MESSAGE_REVOKED, MESSAGE_REVOKED)
    im.on(TIM.EVENT.ERROR, IM_ERROR)

    commit('SET_IM', im)
    im.login({ userID: userID, userSig: userSig }).then(() => {
    }).catch((err) => {
      console.error('IM_login_ERROR:', err)
    })
  },
  getSig ({ commit, state, dispatch }, payload = false) {
    if (state.sig) {
      if (payload) {
        dispatch('loginIM')
      }
      return
    }
    // let request = payload.isIm ? wapi.getSig() : api.getSig()
    let url = payload.isIm ? urlMap.live.getImParams : urlMap.live.getLiveUserForDoctor
    let params = payload.isIm ? { doctorId: localStorage.getItem('USERID') } : {}
    requestIh(url, params, 'get').then(result => {
      commit('SET_IM_SIG', result.data)
      if (payload) {
        dispatch('loginIM')
      }
    }).catch((err) => {
      console.warn('获取IM sig报错', err)
    })
  },
  setGdcfInsuranceInfo (context) {
    context.commit('setGdcfInsuranceInfo')
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    dispensing,
    processConfig,
    medicalrecord
  }
})

export default store
