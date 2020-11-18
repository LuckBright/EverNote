import { wsConnect } from '@/util/common'
const SET_HOSPITAL_DATA = 'SET_HOSPITAL_DATA' // 住院
const SET_DOOR_DATA = 'SET_DOOR_DATA' // 门诊
const SET_MATERIAL_TYPE = 'SET_MATERIAL_TYPE'
const STORAGE_CONFIG = 'STORAGE_CONFIG'

const state = {
  hospitalData: {}, // 住院
  doorData: {}, // 门诊
  storageId: '', // 库房ID
  materialType: '',
  wsClient: '',
  dispenseCode: '', // UDD 备药单号
  storageConfig: [],
  dispenseSetting: {}
}

const mutations = {
  setDispenseSetting (state, value) { // 发药配置数据
    state.dispenseSetting = value
  },
  setStorageId (state, value) {
    state.storageId = value
  },
  updateDispenseCode (state, value) { // 住院数据查询摆药单，更新摆药单号
    state.dispenseCode = value
  },
  // 住院
  [SET_HOSPITAL_DATA] (state, data) {
    state.wsClient = data.client
    state.hospitalData = (JSON.parse(data.res.body))
  },
  // 门诊
  [SET_DOOR_DATA] (state, data) {
    state.wsClient = data.client
    state.doorData = (JSON.parse(data.res.body))
  },
  [SET_MATERIAL_TYPE] (state, data) {
    state.materialType = data
  },
  [STORAGE_CONFIG] (state, data) {
    state.storageConfig = data
  }
}
const actions = {
  // 住院消息
  getTableData (context) {
    // websocket链接
    wsConnect('/exchange/exchange.warehouse.dispense/warehouse.queue.dispense.exchange', (client, res) => {
      context.commit(SET_HOSPITAL_DATA, { client, res })
    })
    wsConnect('/exchange/exchange.warehouse.dispense/warehouse.queue.outdispense.exchange', (client, res) => {
      context.commit(SET_DOOR_DATA, { client, res })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
