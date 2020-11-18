import { prefix as commonPrefix } from '@/util/urls'
const prefix = {
  ...commonPrefix,
}

export default {
  myBench: {
    // 新菜单数据
    getLevelOneMenus: { url: 'unify/getLevelOneMenus', isStatic: false, prefix: prefix.core },
    getMenusFromToken: { url: 'unify/getMenusFromToken', isStatic: false, prefix: prefix.core },
    updatePasswordByOldPassword: { url: 'unify/updatePasswordByOldPassword', isStatic: false, prefix: prefix.core },
    switchOrgToReplaceToken: { url: 'unify/switchOrgToReplaceToken', isStatic: false, prefix: prefix.core },
  }
}
