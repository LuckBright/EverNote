export const ACCOUNT_NOTICE = [
  {
    curPath: '/storages', // 当前工作台主路由(一级路由，判断是在哪个工作台)
    newPath: '/storages' // 需要跳转的新路由
  }
]
/**
 * 重新跳转指定路由方法
 *
 * @param {String} path 当前页面路由
 * @returns
 */
const cacheNotice = {}
const len = ACCOUNT_NOTICE.length
export const resetPath = function resetPath (path) {
  if (cacheNotice[path]) return cacheNotice[path]
  for (let i = 0; i < len; i++) {
    const account = ACCOUNT_NOTICE[i]
    // 只获取工作台主路由
    if (path.indexOf(account.curPath) === 0) {
      cacheNotice[path] = account.newPath
      break
    }
  }
  return cacheNotice[path]
}
