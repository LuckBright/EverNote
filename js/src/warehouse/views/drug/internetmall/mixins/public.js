/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 21:25:34
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-24 15:26:13
 */
export default {
  data () {
    return {
      listWidth: '600px',
      loading: false
    }
  },
  computed: {
    currentProcessConfig () { // 当前库房流程配置数据
      return this.$store.state.processConfig.thisStorageroomProcessConfig
    },
    currentStorageRoomId () { // 当前库房id
      return this.currentProcessConfig.storageRoomId
    },
  }
}
