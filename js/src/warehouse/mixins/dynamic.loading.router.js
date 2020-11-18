/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-21 16:20:07
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-07 15:28:21
 */
// vue-router 动态添加 路由
import getStorage from '@/warehouse/page/storages/util/getstorage'
import processSetting from '@/warehouse/page/storages/util/process.seting'
import { routeSetting, routeSettingNavChild } from './routers.setting'
import { routeName } from './route.map'

const HOSPITAL = 'hospitaludd'
const OUT_PAITENT = 'outpaitent'
const ROUTE_NAME = {
  '100001': OUT_PAITENT,
  '100002': OUT_PAITENT,
  '100003': OUT_PAITENT,
  '100004': HOSPITAL, // udd 住院发药
  '100005': OUT_PAITENT, // 门诊统一发药流程
  '100006': HOSPITAL, // 住院统一发药流程
  '100007': OUT_PAITENT, // 门诊统一发药自动出库流程
  '100008': 'internet', // 互联网商城流程
  '100009': 'cashier', // 超市收银
}
export default {
  mixins: [getStorage, processSetting],
  computed: {
    storageroomSystemConfig () { // 库房系统设置
      return this.$store.state.processConfig.storageroomSystemConfig || {}
    },
    storageroomConfigList () { // 分库房设置 -- 流程集合
      return this.$store.state.processConfig.storageroomConfigList || []
    },
    storageroomConfigListLength () {
      return this.storageroomConfigList.length
    }
  },
  methods: {
    async storageRouterNavSet (clear, navData) {
      const storagePath = '/storages/'
      // await
      // 获取库房配置信息 - 动态生成导航路由
      /**
       * 动态根据发药流程配置项获取池子中发药流程菜单（mark）
       * 流程id
       * meta.mark.some()
       */
      const route = this.$route
      if (route.path.indexOf('/storages/') > -1) {
        const routeOptions = this.$router.options.routes
        const pos = routeOptions.findIndex(router => router.path === '/storages')

        // 流程列表数据
        if (!this.dynamicNavdata.length && !this.storageroomConfigListLength) await this.getStorageroomProcess()
        // 二次确认没有配置任何出库流程，直接跳过后续路由配置
        // if (!this.storageroomConfigListLength) return
        // 系统配置（是否预占库存，是否审核等）/warehouse/storageroomconfig => 机构 | 库房设置
        // toExamine：处方审核 0是/1否
        // dispenseSetting：发药设置总开关 多库房统一操作 1 / 分库房发药 2
        let { toExamine, onLineToExamine } = this.storageroomSystemConfig
        let process = []
        let listMode = 0 // 住院模式选择 0 单人操作 1 多人协作
        let operateMode = 1 // 门诊发药模式 1 任务明细  2 处方整单

        // 分库房流程列表数据
        this.storageroomConfigList.forEach(item => {
          if (item.processId === '100001' || item.processId === '100002') {
            operateMode = 1
          } else if (item.processId === '100003') {
            operateMode = 2
          }
          if (item.processId === '100004') {
            listMode = item.processItemObject.listMode // 更新住院模式
          }

          process.push({
            pathName: ROUTE_NAME[item.processId],
            name: item.name,
            processId: item.processId,
            operateMode,
            processDataId: item.id
          })
        })
        // }
        const baseUrlMerged = function baseUrlMerged (parentName, processDataId) {
          // if (dispenseSetting === '1') return parentName
          return parentName + processDataId
        }
        // pathName需要根据不同的processId决定，所以放此处，最后确定路径是门诊发药还是住院发药
        // const parentName = '/storages/' + pathName
        // 决断路由导航信息
        const resolvRouteNavData = function resolvRouteNavData (parentName, routeName, pro, isInvented) {
          let { processDataId, processId, name, pathName, auth } = pro
          let children = []
          routeSettingNavChild.forEach(item => {
            if (item.mark.includes(processId)) {
              // 虚拟库房 过滤掉个性设置菜单
              if (isInvented && item.name === '个性设置') return false
              children.push(Object.assign({}, item, { index: `${baseUrlMerged(parentName, processDataId)}/${routeName[item.path]}` }))
            }
          })

          // 决断返回导航子路由
          const resolveNavRouteChild = function resolveNavRouteChild (processId) {
            let list = []
            // 获取当前流程下面所有配置信息 => 住院发药任务打印页面需要通过改配置是否“单人操作” | “多人协同”来判断是否展示 任务打印页面
            children.forEach(child => {
              if (child.mark.includes(processId)) {
                // toExamine：1 不审核 | 0 审核
                // currentProcessConfig.processItemObject.mode 按UDD出库流程设置 模式选择， 当人操作不展示任务打印页面
                // isControl： json配置信息， 是否需要控制菜单是否不展示 1、门诊审核  2、住院打印
                // listMode: 0：“单人操作” | 1：“多人协同” 并且只有在住院下
                // 自动出库流程（分库房发药和多库房统一摆药） 不需要审核页面 @王强 2019-12-12 提出去掉， 因跨机构发药问题引起 （(['100007', '100002'].includes(processId) && child.isControl === 1) ||）
                // 门诊 + 审核 + isControl： 1
                // 住院 + 多人 + isControl： 2
                if (((pathName !== HOSPITAL && (toExamine && onLineToExamine) && child.isControl === 1) || (pathName === HOSPITAL && !listMode && child.isControl === 2))) return false
                list.push(child)
              }
            })
            return list
          }
          // processId => 流程标记 对应mark  发药流程所属标记（例如：属于流程一、流程二、流程三）该菜单数据某个流程才有
          return { // 导航路由配置数据
            auth, // 添加一个不存在的权限id  就会只是注入路由而不会生成导航菜单信息(nav.vue hasPermission 权限为空 )
            name, // 流程名称
            index: `${baseUrlMerged(parentName, processDataId)}`, // 门诊或者住院 + 流程ID
            processDataId, // 给warehouse.vue 组件中添加 page_layout_full class使用（addFull）
            children: resolveNavRouteChild(processId),
          }
        }

        // 动态设置路由池子children数据
        const resolvRouteChildren = function resolvRouteChildren (routeSetting, routeName, pro) {
          const { processDataId, operateMode, pathName, processId } = pro
          const _arr = []
          routeSetting.forEach(item => {
            // pathExpression：路由表达式
            const { mark, full, component, path: tPath, pathExpression = '', rid } = item
            const path = routeName[tPath]
            if (mark.includes(processId)) {
              _arr.push({
                path: path + pathExpression,
                name: path + processDataId,
                component,
                full,
                meta: {
                  mark, // 发药流程所属标记（例如：属于流程一、流程二、流程三）
                  operateMode,
                  processDataId,
                  rid,
                  // requireRedirect: true,
                  thirdActiveIndex: `${storagePath + pathName.split('/')[0]}${processDataId}/${path.split('/')[0]}`
                }
              })
            }
          })
          return _arr
        }

        // 动态路由池子
        const resolvRoutePool = function resolvRoutePool (routePath, routeName, pro) {
          return {
            path: routePath,
            name: routePath,
            component: resolve => {
              require(['@/warehouse/views/drug/index.vue'], resolve)
            },
            full: true,
            children: resolvRouteChildren(routeSetting, routeName, pro)
          }
        }

        // 设置动态路由和配置导航路径
        let newDynamicNavdata = []
        process.forEach(pro => {
          const { pathName, processDataId } = pro
          const parentName = storagePath + pathName
          newDynamicNavdata.push(resolvRouteNavData(parentName, routeName, pro, this.isInvented))
          const routePath = baseUrlMerged(parentName, processDataId)
          const hasRouter = routeOptions[pos].children.find(item => item.path === routePath)
          if (!hasRouter) {
            routeOptions[pos].children.push(resolvRoutePool(routePath, routeName, pro))
          }
        })
        // clear, navData：下拉切换库房时，清理原有的库房流程导航数据
        // if (clear) {
        // processDataId：只有库房发药导航配置json中才存在流程数据id(processDataId)
        // navData = navData.filter(item => !item.processDataId)
        // }
        // 更新路由表
        // if (newDynamicNavdata.length && JSON.stringify(this.dynamicNavdata) !== JSON.stringify(newDynamicNavdata)) {
        this.$router.$addRoutes(routeOptions)
        // this.dynamicNavdata = newDynamicNavdata
        // navData.splice(1, 0, ...this.dynamicNavdata)
        // this.$nextTick(_ => {
        //   this.computeAuthNum()
        // })
        this.$bus.$emit('update:changeNavData', newDynamicNavdata, 1)
        // }
      }
    },
    async storageroomRouteChange (item) {
      !item && (item = this.$route.meta || {})
      // processDataId：存在流程数据id，代表门诊、住院发药(发药路径在切换库房时，需要清空，使用该字段作为判断条件)
      if (item.processDataId) {
        // 获取当前流程相匹配的流程集合
        if (item.level) {
          const processIdObj = this.storageroomConfigList.find(item => item.processDataId === process.id)
          await this.getSameProcessConfigurationId({
            storageRoomId: this.storageId,
            processId: processIdObj.processId
          })
        }
        this.storageroomConfigList.forEach(process => {
          if (item.processDataId === process.id) {
            this.$store.commit('setThisStorageroomProcessConfig', Object.assign({}, process))
          }
        })
      }
    }
  },
  data () {
    return {
      dynamicNavdata: []
    }
  }
}
