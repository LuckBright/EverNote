import stompjs from 'stompjs'
import { baseHost } from '@/store/basehost'
const Stomp = stompjs.Stomp
const RECONNECT_TIMES = 10
let link = false
let wsClient = null
let subscribePool = {}
let recount = 1
let successCallArr = []

// 连接错误函数
async function onError () {
  wsClient = null
  link = false
  if (recount < RECONNECT_TIMES) {
    recount++
    // 错误时释放wsClient变量
    setTimeout(async _ => {
      wsClient = await createWsClient()
    }, 5000)
  }
}

// 订阅
function listen (pool) {
  let arr = successCallArr
  successCallArr = []
  arr.map(ele => { ele.successCall({ disconnect: ele.disconnect }) })
  for (let url in pool) {
    wsClient.subscribe(url, function (d) {
      pool[url].callback.map(callback => {
        callback(wsClient, d)
      })
    })
  }
}

// 取消订阅
function remove (url, callback, cb) {
  subscribePool[url].callback = subscribePool[url].callback.filter(listener => {
    return listener !== callback
  })
  if (cb)cb()
}
/**
 * 初始化 webSocket连接
 */
const createWsClient = async () => {
  if (link) return
  link = true
  return new Promise((resolve, reject) => {
    let _tmpHost = (baseHost.host.indexOf('//') > -1) ? baseHost.host.substring(baseHost.host.indexOf('//') + 2) : baseHost.host
    var socketProtocol = (location.protocol === 'https:') ? 'wss:' : 'ws:'
    const mqConfig = {
      'host': socketProtocol + '//' + _tmpHost + '/mq', // 调整后的host规则
      'username': 'mq_user',
      'password': '6lSTxJstbar0ng2I'
    }
    const url = mqConfig.host + '/ws'
    const ws = new WebSocket(url)
    let wsC = Stomp.over(ws)
    // 重新定义原型链debug方法 调试时可注销下面一行代码
    wsC.debug = function (str) { }
    wsC.heartbeat.outgoing = 2000
    wsC.heartbeat.incoming = 2000

    // 消息回调
    const onConnect = function () {
      if (recount > 1) {
        console.log('webSocket 重新连接')
      }
      recount = 1
      resolve(wsC)
      setTimeout(_ => {
        listen(subscribePool)
      })
    }
    // 创建连接
    wsC.connect(mqConfig.username, mqConfig.password, onConnect, onError)
  })
}

/**
 * 创建webSocket连接
 * @param url       subscribe RUL              required
 * @param callback            消息回调
 * @param successCall          订阅成功回调
 * @returns {disconnect}      返取消监听的方法
 */

export async function wsConnect (url, callback, successCall) {
  let obj = { url, callback: [callback] }

  function disconnect (cb) { // 注销回调方法
    remove(url, callback, cb)
  }
  let first = false  // 是否是首次订阅
  if (subscribePool[url]) {
    subscribePool[url].callback.push(callback)
  } else {
    first = true
    subscribePool[url] = obj
  }
  if (wsClient) {
    if (first)listen({ [url]: obj })
    // 存在连接就直接复用，直接回调成功函数
    if (successCall) successCall({disconnect})
  } else {
    // 不存在连接就缓存回调成功函数
    if (successCall) successCallArr.push({ successCall, disconnect })
    wsClient = await createWsClient()
  }
  return {disconnect}
}
