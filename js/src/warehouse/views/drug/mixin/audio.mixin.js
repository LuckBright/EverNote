import { wsConnect, objGet } from '@/util/common/'
import { getUseFreq } from '@/warehouse/views/util/index'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
const WS_CLIENT = [ // 所有socket 配置项
  {
    routerPath: 'uddprint',
    socketKey: '/exchange/exchange.thc-warehouse.business.hospital_send_drug/routingKey.thc-warehouse.business.hospital_send_drug',
    listMode: 0, // 单人操作
    recommendPath: ['uddtask'], // 分区页面 确定需要创建socket的页面
    name: '住院任务打印'
  },
  {
    routerPath: 'uddtask',
    socketKey: '/exchange/exchange.thc-warehouse.business.hospital_create_uddcode/routingKey.thc-warehouse.business.hospital_create_uddcode',
    listMode: 1, // 多人协同
    recommendPath: ['uddtask'],
    name: '住院任务列表'
  },
  {
    routerPath: 'focusback',
    socketKey: '/exchange/exchange.thc-warehouse.business.return_dispensing_task/routingKey.thc-warehouse.business.return_dispensing_task',
    name: '统一摆药住院退药'
  },
  {
    routerPath: 'uddback',
    socketKey: '/exchange/exchange.thc-warehouse.business.return_dispensing_task/routingKey.thc-warehouse.business.return_dispensing_task',
    name: '住院退药'
  },
  {
    routerPath: 'prescriptionback',
    socketKey: '/exchange/exchange.thc-warehouse.business.return_dispensing_task/routingKey.thc-warehouse.business.return_dispensing_task',
    name: '门诊退药'
  },
  {
    routerPath: 'prescriptiontask',
    ketKey: 'outpatient_drug_audit',
    socketKey: '/exchange/exchange.thc-warehouse.business.outpatient_drug_audit/routingKey.thc-warehouse.business.outpatient_drug_audit',
    name: '门诊任务列表'
  },
  {
    routerPath: 'prescriptionaudit',
    ketKey: 'outpatient_drug_send',
    socketKey: '/exchange/exchange.thc-warehouse.business.outpatient_drug_send/routingKey.thc-warehouse.business.outpatient_drug_send',
    name: '门诊任务审核'
  },
  {
    routerPathArr: ['prescriptionback', 'uddback', 'focusback'],
    mate: 1,
    socketKey: '/exchange/exchange.thc-warehouse.business.send_drug_backs_examine_notify/routingKey.thc-warehouse.business.send_drug_backs_examine_notify',
    name: '修改退药审核通知'
  },
  // {
  //   mate: 2,
  //   socketKey: '/exchange/exchange.thc-warehouse.business.send_durg_process_notify/routingKey.thc-warehouse.business.send_durg_process_notify',
  //   name: '修改发药流程通知'
  // },
  // {
  //   routerPath: 'prescriptionaudit',
  //   mate: 1,
  //   socketKey: '/exchange/exchange.thc-warehouse.business.send_system_setting_exmaine_notify/routingKey.thc-warehouse.business.send_system_setting_exmaine_notify',
  //   name: '修改处方审核通知'
  // }
]

export default {
  mixins: [getStorage],
  data () {
    return {
      audioUrl: 'static/assets/msg.mp3',
      wsClient: [],
      isPlay: true
    }
  },
  created () {
    getUseFreq() // 获取所有用药频次
  },
  beforeDestroy () {
    this.closeWsClient()
  },
  methods: {
    // 修改配置刷新当前页面
    reloadPage (data, routerPath, res) {
      const result = res.body && JSON.parse(res.body)
      if (!result || !result.body || !result.body.storageRoomIds || !result.body.storageRoomIds.includes(this.storageId)) return
      this.$alert('库房配置已被修改,请刷新当前页面', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        location.reload()
      })
    },
    closeWsClient () {
      if (this.wsClient) {
        this.wsClient.forEach(item => {
          item.disconnect && item.disconnect(rs => {
            this.wsClient = []
            console.log('连接已断开')
          })
        })
      }
    },
    palyAudio () {
      const audioDom = this.$refs.audio
      if (!audioDom || !this.isPlay) return
      this.isPlay = false
      this.$nextTick().then(_ => {
        const _this = this
        audioDom.play()
        audioDom.onended = function () {
          _this.isPlay = true
          console.log('播放完成')
        }
      })
    },
    createSocketClient (routerPath, fullPath, scene) {
      const self = this
      this.closeWsClient()
      // listMode === 0 单人操作发药模式, 任务列表需要创建 任务打印页面的socket 门诊住院配置信息中都存在该字段，所以具体区分住院、门诊虚假上路由path
      // scene是否是分库房，分库房排除设置了ketKey的socket
      // 如需求拓展需要把find条件做修改
      const ws = WS_CLIENT.filter(row => {
        const { recommendPath, routerPath: path, listMode, routerPathArr } = row
        return ((recommendPath && recommendPath.includes(routerPath) && listMode === self.listMode) ||
          (path === routerPath && (!scene || (scene && !row.ketKey))) || (routerPathArr && routerPathArr.includes(routerPath))
        )
      })
      if (ws) {
        ws.forEach(item => {
          let wsObject = wsConnect(item.socketKey, (client, res) => {
            if (item.mate) {
              this.reloadPage(item, routerPath, res)
            } else {
              res && res.body && self.notifyMsg(client, res, { item, routerPath, fullPath })
            }
          })
          wsObject.then(res => {
            self.wsClient.push(res)
          })
        })
      }
    },
    notifyMsg: function (client, res, { ws, routerPath, fullPath }) {
      const data = JSON.parse(res.body)
      const { body } = data
      const { storageRoomId, actualStorageRoomId, processConfigurationId } = body || {}
      // 不满足 路径 库房 流程三种条件任意一种， 都不进行通知
      const roomid = storageRoomId || actualStorageRoomId // 库房id

      if (
        !body ||
        this.$route.fullPath !== fullPath ||
        (this.dispenseSetting === '2' ? this.currentStorageRoomId !== (roomid) : (this.dispenseSetting === '1' && !this.moreStorageroomList.includes(roomid))) ||
        !this.processIds.includes(processConfigurationId)
      ) return
      this.wsClient.push(client)
      if (this.showAudio) this.palyAudio()
      this.$bus.$emit('notify-receive-sokect-message', Object.assign(body, { mqMsg: 1 }), { ws, routerPath, fullPath }) // 通知所有需要接收socket消息的bus
    }
  },
  watch: {
    '$route': {
      handler: function (route) {
        const { path } = route
        if (path.indexOf('/storages/hospitaludd') > -1 || path.indexOf('/storages/outpaitent') > -1) { // 住院流程 | 门诊流程 （门诊分库房流程 通知 有自己的逻辑， 所以不创建链接）
          const routes = path.split('/')
          this.createSocketClient && this.createSocketClient(routes[routes.length - 1], path, (path.indexOf('/storages/outpaitent') > -1 && this.dispenseSetting === '2'))
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    processConfig () {
      return this.$store.state.processConfig || {}
    },
    currentProcessConfig () { // 当前库房流程配置数据
      return this.processConfig.thisStorageroomProcessConfig || {}
    },
    storageroomSystemConfig () { // 库房系统设置
      return this.processConfig.storageroomSystemConfig || {}
    },
    dispenseSetting () { // 1 多库房 2 分库房
      return this.storageroomSystemConfig.dispenseSetting
    },
    listMode () { // 模式选择：0：“单人操作” | 1：“多人协同”
      return objGet(this.currentProcessConfig, 'processItemObject.listMode', 0)
    },
    showAudio () { // 只有自定义库房流程配置菜单页面才展示 音乐内容
      const { meta = {} } = this.$route
      return meta.processDataId
    },
    processConfigurationId () { // 流程id
      return this.currentProcessConfig.id
    },
    processIds () { // 流程ids
      return this.processConfig.thisStorageroomProcessIdList || []
    },
    currentStorageRoomId () { // 当前库房id
      return this.currentProcessConfig.storageRoomId
    },
    moreStorageroomList () { // 多库房发药个性设置可操作库房ids
      return this.processConfig.moreStorageroomList || []
    }
  },
}
