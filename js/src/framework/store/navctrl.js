import {
  EVER_MENU_SEC_STORAGES_DRUG,
  EVER_MENU_SEC_STORAGES_BLOOD,
  EVER_MENU_SEC_STORAGES_EQUIP,
  EVER_MENU_SEC_STORAGES_MATERIAL
} from '@/framework/store/navdata.storages.js' // 库房工作站
import i18n from '@/assets/locals/index'
import storage from '@/util/storage'

export default {
  data () {
    return {
      EVER_MENU: [],
      benchName: '',
      navData: [],
      navThirdArr: [],
      secActiveIndex: '',
      thirdActiveIndex: '',
      storagesSelectConfig: {
        flag: false,
        options: []
      },
      navPluginShowFlag: true,
      menus: [],
    }
  },
  created () {
    this.renderNavData(this.$route)
    // 阻止active状态变化
    this.$bus.$on('nav:preventActiveChange', () => {
      let val = this.$route
      this.secActiveIndex = val.meta && val.meta.secActiveIndex ? val.meta.secActiveIndex : this.oldActiveIndex
      this.computeAuthNum()
    })
    this.$bus.$on('nav:preventhirdtActiveChange', (val) => {
      this.thirdActiveIndex = ''
      this.$nextTick(() => {
        this.renderNavData(this.$route, val)
        this.computeAuthNum()
      })
    })
    this.oldActiveIndex = this.secActiveIndex
    // 修正二级菜单高亮状态 by lvjiangtao@everjiankang.com
    this.$bus.$on('nav:changeSecActiveHasParam', (val) => {
      this.$nextTick(() => {
        this.secActiveIndex = val
      })
    })
    // 如果三级菜单中包含变量，在router.js的meta内无法添加变量，可以调用这个修正高亮状态 by lvjiangtao@everjiankang.com
    this.$bus.$on('nav:changeThirdActiveHasParam', (val) => {
      this.$nextTick(() => {
        this.thirdActiveIndex = val
      })
    })
  },
  methods: {
    warehouseNavData (obj = {}) {
      this.$bus.$emit('nav:warehouseRouteChange', obj)
    },
    // 跳转方法
    goRouter (item) {
      this.$router.push({
        path: item.index
      })
    },
    hasPermission (auth) {
      return this.$hasPermission(auth)
    },
    // 点击二级菜单 判断有无child 分别做跳转或者展示三级菜单 自动跳转到有权限的第一个三级地址
    triggerSecNav (item) {
      if (item.openType === '_blank') {
        return
      }
      this.warehouseNavData({ meta: item })
      this.navThirdArr = item.children ? item.children : []
      if (!item.url) {
        if (!item.children) {
          this.goRouter(item)
        }
      }
      var _tmp = this.navThirdArr.filter(obj => {
        if (this.hasPermission(obj.auth)) {
          return obj
        }
      })
      if (_tmp.length > 0) {
        if (item.index === '/phr/chart') {
          this.goRouter(item)
        } else {
          this.goRouter(_tmp[0])
        }
      }
      // el-menu监听defaultAtive的变化，此处是为了触发这个监听
      this.secActiveIndex = item.index
    },
    // 点击三级菜单 跳转到对应router
    triggerThirdNav (item) {
      if (item.openType === '_blank') {
        return
      }
      if (item.index) {
        this.goRouter(item)
      }
    },
    // 根据某一个router地址 返回二级菜单和三级菜单 和对应的active菜单
    renderNavData (val, val1) {
      // val1为true，并且路由有自定义的$addRoutes才走下面的逻辑，修复3级菜单高亮的问题
      if (this.$router.$addRoutes && val1) {
        this.$router.$addRoutes(this.$router.options.routes)
        this.$nextTick(() => {
          this.computeAuthNum()
        })
      }

      this.warehouseNavData({ meta: val.meta }) // warehouse 库发发药 刷新页面时，需要获取当前url上面的流程id
      let path =
        val.meta && val.meta.thirdActiveIndex
          ? val.meta.thirdActiveIndex
          : val.path
      // 控制库房下拉选择器隐藏
      this.storagesSelectConfig.flag = false
      this.setBenchData(path)
      document.title = i18n.t(this.benchName)
      let arr = this.navData
      let second = []
      // let third = []
      let secondArr = arr.filter(v => v.index === path)
      if (secondArr.length) {
        second = secondArr[0]
      } else {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            var thirdArr = arr[i].children.filter(v => {
              return (v.index === path)
            })
            if (thirdArr.length) {
              second = arr[i]
              // third = thirdArr[0]
              break
            }
          }
        }
      }
      this.navThirdArr = second.children || []
      this.secActiveIndex =
        val.meta && val.meta.secActiveIndex
          ? val.meta.secActiveIndex
          : second.index

      this.thirdActiveIndex = (this.$route.path.indexOf('/phr/analysis') !== -1) ? val.path : path
      // return {
      //   second,
      //   third
      // }
    },
    setBenchData (path) {
      this.menus = JSON.parse(storage.getLocalStorage('USERMENUS')) || []
      // if ((!Array.isArray(this.menus) || this.menus.length === 0) && localStorage.getItem('debug') !== '1') {
      //   window.location = this.$ever.mainIndex + '/myclinic'
      // }
      this.EVER_MENU = this.menus.filter(item => item.parentId === '0').map(item => ({
        name: item.name,
        index: item.url,
        auth: item.menuId,
      }))
      // 根据path获取工作站对应的特性url，形如 /rcm /warehouse 等
      let benchUrl = path.slice(0, path.slice(1).indexOf('/') + 1)
      // 先处理特殊路由
      if (path.startsWith('/myclinic') || path.startsWith('/welcome')) {
        this.navData = []
        this.benchName = '全部工作站'
      } else if (path.startsWith('/storages') || path.startsWith('/blood')) {
        if (path.startsWith('/storages/')) {
          this.storagesSelectConfig.flag = true
        }
        this.handleStoragesRoute(path)
      } else {
        if (path !== '/') {
          // 处理常规路由
          // 工作站url要求以 `/web/ + 特性名称 + / + index.html# + / + 特性名称` 开头 例如系统设置工作站的url： /web/systemset/index.html#/systemset
          // 二级菜单url要求以 `/web/ + 特性名称` 开头 例如系统设置工作站下的值集管理的url： /systemset/setlist
          // if (benchUrl === '/phr') {
          //   benchUrl = '/manages'
          // }
          const crtBench = this.menus.find(item => item.parentId === '0' && item.url && item.url.includes(`/index.html#${benchUrl}`))
          if (crtBench) {
            // 此工作站的url配置正确，根据该对象递归查找其所有的子节点生成一个可用的对象
            this.benchName = crtBench.name
            this.navData = this.getCrtBenchList(crtBench, this.menus)
          } else {
            if (!path.includes('/demo/') && !path.includes('/msgcenter/') && !path.includes('/approval/') && !path.includes('/ihsystem/')) {
              // window.location = this.$ever.mainIndex + '/myclinic'
            }
            // 工作站url配置错误
            // 或者是特殊url 需要特殊处理
            console.error(`当前path为：${path}，在菜单中无法匹配到正确的项，工作站url配置错误或需要特殊处理`)
          }
        }
      }
    },
    getCrtBenchList (parent, list) {
      return list.filter(item => item.parentId === parent.rid).map(item => {
        const children = this.getCrtBenchList(item, list)
        return {
          name: item.name,
          index: item.url,
          auth: item.menuId,
          sort: item.indexNum,
          openType: item.openType,
          ...(children.length ? { children } : {})
        }
      }).sort((a, b) => a.sort - b.sort)
    },
    getRealNavList (navList) {
      return navList.map(item => {
        let children = []
        if (item.children && item.children.length) {
          children = this.getRealNavList(item.children)
        }
        const result = this.menus.find(menu => menu.menuId === item.auth)
        return result && {
          name: result.name,
          index: result.url,
          auth: result.menuId,
          openType: result.openType,
          ...(children.length ? { children } : {})
        }
      }).filter(item => !!item)
    },
    // 处理库房路由
    async handleStoragesRoute (path) {
      if (path.indexOf('/storages/') > -1) {
        switch (localStorage.getItem('STORAGE_ROOM_TYPE')) {
          case EVER_MENU_SEC_STORAGES_DRUG.navType:
            this.navData = this.getRealNavList(EVER_MENU_SEC_STORAGES_DRUG.navList.slice(0))
            break
          case EVER_MENU_SEC_STORAGES_BLOOD.navType:
            this.goRouter({
              path: '/blood/home'
            })
            break
          default:
            this.navData = this.getRealNavList(EVER_MENU_SEC_STORAGES_DRUG.navList.slice(0))
            break
        }
        // 设置动态路由navdata
        // await this.storageRouterNavSet()
        this.warehouseNavData()
      } else if (path.indexOf('/blood') > -1) {
        switch (localStorage.getItem('STORAGE_ROOM_TYPE')) {
          case EVER_MENU_SEC_STORAGES_DRUG.navType:
          case EVER_MENU_SEC_STORAGES_EQUIP.navType:
          case EVER_MENU_SEC_STORAGES_MATERIAL.navType:
            this.goRouter({
              path: '/storages'
            })
            break
          case EVER_MENU_SEC_STORAGES_BLOOD.navType:
            this.navData = this.getRealNavList(EVER_MENU_SEC_STORAGES_BLOOD.navList.slice(0))
            break
        }
      }
      this.storagesSelectConfig.options = localStorage.STORAGE_ITEM ? JSON.parse(localStorage.STORAGE_ITEM) : []
      this.benchName = this.EVER_MENU.find(item => item.index.includes('/warehouse/index.html#/storages')).name
      document.title = i18n.t(this.benchName)
    },
  },
  watch: {
    $route: {
      handler (val) {
        if (val.path.includes('/myclinic')) {
          this.navPluginShowFlag = false
        } else {
          this.navPluginShowFlag = true
        }
        this.messageBox = false
        if (!this.$route) {
          return
        }
        if (val.path) {
          this.renderNavData(val)
        }
        // url变化时，把页面对应的menuId/rid写到sessionstorage里面
        // 1. 从USERMENUS 根据url找出菜单id
        // 2. 如果meta里面写了rid就用meta里面的值
        // 3. 如果meta里面传了abandonRid 表示不需要写入x-rid，清空缓存
        let tmp = (JSON.parse(localStorage.getItem('USERMENUS')) || []).filter(item => {
          if (val.path === item.url) {
            return item
          }
        })
        if (tmp.length > 0) {
          sessionStorage.setItem('x-rid', tmp[0].rid)
        } else {
          sessionStorage.removeItem('x-rid')
        }
        if (val.meta.rid) {
          sessionStorage.setItem('x-rid', val.meta.rid)
        }
        if (val.meta.abandonRid) {
          sessionStorage.removeItem('x-rid')
        }
        this.rid = sessionStorage.getItem('x-rid')
      },
      immediate: true,
      deep: true
    },
  }
}
