// import bus from '@/util/eventbus'
import storage from '@/util/storage'
// import api from '@/titancare/api/common/common'
import store from '@/titancare/store'

export function beforeEach (router) {
  router.beforeEach(async (to, from, next) => {
    // isWelcome 判断是否需要token鉴权
    store.commit('setUser', { userName: storage.getLocalStorage('DISPLAYNAME') })
    next()
  })
}
