import processApi from '@/warehouse/views/drug/api/processapi.js'
export default {
  data () {
    return {
      processConfig: this.$store.state.processConfig.thisStorageroomProcessConfig,
      storageRoomList: [], // 编辑弹窗中库房列表
    }
  },
  methods: {
    async getAllStorageRoomAndClinic (params) {
      // 获取查询所有库房 => 编辑弹框发货库房option
      await processApi.getAllStorageRoomAndClinic(Object.assign({}, params, {
        processItemId: this.processConfig.processItemObject.id,
        isInvented: 0, // 新增只查询实体库房数据
      })).then(res => {
        if (Array.isArray(res)) {
          this.storageRoomList = res
        }
      })
    },
  }
}
