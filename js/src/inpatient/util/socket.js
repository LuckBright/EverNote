import {wsConnect} from '@/util/socket.js'
export default {
  data () {
    return {
      wsClient: null
    }
  },
  mounted () {
    if (this.wsClient) {
      this.wsClient.disconnect()
    }
    wsConnect(this.wsUrl, (client, d) => {
      try {
        let queueData = JSON.parse(d.body).body
        this.wscallback(JSON.parse(queueData))
      } catch (e) {
        console.error(e, '格式转换错误')
      }
    },
   (wsClient) => { this.wsClient = wsClient })
  },
  beforeDestroy () {
    if (this.wsClient) {
      this.wsClient.disconnect()
    }
  },
}
