/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-27 11:24:37
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-03 10:11:43
 */
import RegisterMoudle from '@/store/register.module.js'
import mutations from './mouations'
import actions from './actions'
// 注册Vuex模块名称 -- 价格体系 调价
import { ModuleName } from '../enum'
import { mapActions } from 'vuex'
const SourceModule = {
  'warehouse': ['294', '296'],
  'cpoe': ['798'],
}
export default {
  data () {
    return {
      currentComponent: ''
    }
  },
  beforeCreate () {
    if (this.$store.state[ModuleName]) return
    RegisterMoudle.install(ModuleName, {
      state: {
        aceList: [], // 舍入规则 选项
        orgList: [], // 机构列表数据
        sceneList: [], // 价格维度
        serviceOptions: [], // 系统分类 （cpoe 798 wh 296 294）
        orgIds: [], // 按分类调价 或 按维度调价选中的影响机构（在调价预览中使用）
        sceneObj: {},
        priceColumns: [], // 价格配置表格列
        activeName: '', // tabs选中项，
        isTenant: '', // 是否是集团操作
        sourceModule: '' // 操作来源 warehouse | cpoe
      },
      mutations,
      actions,
      getters: {
        // warehouse 或者 cpoe系统分类数据
        serviceList (state) {
          const source = SourceModule[state.sourceModule]
          let list = state.serviceOptions.filter(service => source.includes(service.id))
          if (list.length === 1) {
            list = list[0].children
          }
          return list
        },
        // 集团调价预览中展示的机构数据
        getOrgList (state) {
          return state.orgList.filter(item => state.orgIds.includes(item.id))
        }
      }
    })
  },
  mounted () {
    this.$store.dispatch(`${ModuleName}/initItemCol`, this.sourceModule)
    this.$store.dispatch(`${ModuleName}/initGetPriceColumns`)
    this.$store.dispatch(`${ModuleName}/initSysValue`, Object.keys(SourceModule).reduce((pre, key) => {
      return pre.concat(SourceModule[key])
    }, []))
    this.$store.commit(`${ModuleName}/setTenant`, this.isTenant)
  },
  beforeDestroy () {
    // RegisterMoudle.uninstall(ModuleName)
  },
  watch: {
    orgTree: {
      handler () {
        this.$store.commit(`${ModuleName}/setOrgList`, this.unfoldTree(this.orgTree || []))
      },
      deep: true,
      immediate: true
    },
    activeName (name) {
      this.$store.commit(`${ModuleName}/activeName`, name)
    }
  },
  methods: {
    ...mapActions(ModuleName, ['initItemCol']),
    unfoldTree (tree) {
      const _arr = []
      function deepTree (data) {
        data.forEach(item => {
          const { id, name } = item
          _arr.push({
            id,
            name
          })
          const childData = item['outOrgGetOrgAndChildrenResDTOList' || 'children'] || []
          if (childData.length > 0) {
            deepTree(childData)
          }
        })
      }
      deepTree(tree)
      return _arr
    }
  }
}
