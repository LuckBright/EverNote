import storage from '@/util/storage'
import Store from '@/titanmall/store'

export function beforeEach (router) {
  router.beforeEach(async (to, from, next) => {
    const TOKEN = storage.getStorageByClinic('TOKEN')
    // noRequireAuth 判断是否需要token鉴权
    // titancare
    // if (to.meta && to.meta.thirdActiveIndex !== '/content') { // 加快直播进群速度
    //   store.state.im && store.state.im.logout()
    //   store.commit('SET_IM', '')
    //   store.commit('SET_IM_READY', false)
    // }
    // titanmall
    // 营销管理工作站优惠券中引入优惠券
    if (to.fullPath.includes('external')) {
      // 隐藏导航
      Store.state.isExternal = true
    }
    if (to.meta && !to.meta.noRequireAuth) {
      if (!TOKEN || TOKEN === 'null') {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}
