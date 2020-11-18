export default {
  beforeRouteEnter (to, form, next) {
    const meta = {
      'deptinfo': '/manages/simpledepartment',
      'personinfo': '/manages/staffindex',
      'materialinfo': '/manages/materialconcise'
    }
    if (form.fullPath === '/' && to.query.isConcise) {
      to.meta.thirdActiveIndex = meta[to.name]
    } else if (form.path !== to.meta.thirdActiveIndex) {
      to.meta.thirdActiveIndex = form.path
    }
    //  集团化 简洁模式下 routback跳转 回显导航 active
    if (to.meta.thirdActiveIndex === '/manages/routerback') {
      to.meta.thirdActiveIndex = meta[to.name]
      form.meta.thirdActiveIndex = meta[to.name]
    }
    next()
  }
}
