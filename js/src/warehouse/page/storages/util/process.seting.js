import storageroomapi from '@/warehouse/store/storageroomapi'
import staffStorageroomApi from '@/warehouse/views/drug/api/staff.storageroomapi.js'
import storage from '@/util/storage'
export default {
  mixins: [storage],
  methods: {
    // 获取当前库房所有流程
    async getStorageroomProcess (id) {
      const selectstorageId = id || this.$route.query.storageId || this.storageId
      const storageroomObject = JSON.parse(storage.getSessionStorage('storageroomObject'))
      if (!selectstorageId || (storageroomObject && storageroomObject.id === selectstorageId && !selectstorageId.processConfigDtoList)) return false
      await storageroomapi.getStorageRoomInfo(selectstorageId).then(res => {
        storage.setSessionStorage('storageroomObject', JSON.stringify(res ? res[0] : {}))
        if (Array.isArray(res) && res.length) {
          let processList = res[0].processConfigDtoList || []
          this.$store.commit('setStotageroomConfigList', processList)
          if (this.$route.path.indexOf('storages/outpaitent') > -1) {
            let processId = this.$route.path.split('/').find(item => item.indexOf('outpaitent') > -1)
            if (processId) processId = processId.split('outpaitent')[1]
            this.$store.commit('setThisStorageroomProcessConfig', Object.assign({}, processList.find(item => item.id === processId) || {}))
          } else {
            this.$store.commit('setThisStorageroomProcessConfig', Object.assign({}, processList[0] || {}))
          }
        }
      })
      // 获取当前机构的库房系统配置
      await this.getStorageroomSystemConfig()
    },
    async getStorageroomSystemConfig () {
      if (this.$store.state.processConfig.storageroomSystemConfig.id) return
      let systemconfig = {}
      await storageroomapi.selectSystemSettingByClinicId().then(res => {
        if (res) {
          this.$store.commit('setStorageroomSystemConfig', Object.assign({}, res || {}))
          storage.setLocalStorage('IS_BATCHPRICE', res.pricingModel)
          systemconfig = res
        }
      })
      // 获取当前多库房发药 选择的库房列表
      if (systemconfig.dispenseSetting === '1' && this.$store.state.processConfig.moreStorageroomList && !this.$store.state.processConfig.moreStorageroomList.length) await this.getStorageRoomList()
    },
    async getStorageRoomList () {
      await staffStorageroomApi.getStorageRoomList().then(res => {
        if (res && res.length) {
          let powerTrueSelect = []
          res.forEach(item => {
            // 处理取回数据  有staffId代表有操作权限的库房
            if (item.staffId && item.selected === 0) { // selected  0 代表已经选择的库房
              powerTrueSelect.push(item.nodeId)
            }
          })
          this.$store.commit('setMoreStorageroomList', powerTrueSelect)
        }
      })
    },
    // 多库房统一发药 获取当前库房  当前流程相匹配的流程集合
    async getSameProcessConfigurationId (params) {
      await storageroomapi.getSameProcessConfigurationId(params).then(res => {
        if (res) {
          this.$store.commit('setThisStorageroomProcessIdList', res || [])
        }
      })
    }
  }
}
