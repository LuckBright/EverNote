// import sessionapi from '@/auth/store/sessionapi'
// import storage from '@/util/storage'
// import { objGet } from '@/util/common'

export function beforeEach (router) {
  router.beforeEach(async (to, from, next) => {
    // const DISPENSE_SETTING = JSON.parse(storage.getLocalStorage('DISPENSE_SETTING')) || {}
    // const outPatient = objGet(DISPENSE_SETTING, 'outPatientDispenseSettingObject.dispenseWorkbench', 2) // 门诊发药工作台 显示：1 不显示：2
    // const uddDispense = objGet(DISPENSE_SETTING, 'uddDispenseSettingObject.dispenseWorkbench', 2) // 住院发药工作台 显示：1 不显示：2
    // if ( // 库房工作站发药配置修改不展示门诊发药或者住院发药工作站，默认跳转到库房首页
    //   to.meta.requireRedirect &&
    //   ((outPatient === 2 && to.path.indexOf('/storages/dispensingopd') > -1) ||
    //     (uddDispense === 2) &&
    //     to.path.indexOf('/storages/dispensingipd') > -1)) {
    //   next({
    //     path: '/storages/home'
    //   })
    // } else {
    //   next()
    // }
    next()
  })
}
