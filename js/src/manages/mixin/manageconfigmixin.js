// 统一查询物资、人员、科室是否有新建权
// 每个引用该mixin方法的都需要提供一个systemTypeObject业务类型对象 => warehouseconfig => STENCIL_TYPE(模版类型定义)
import configapi from '@/manages/page/configure/configapi'
export default {
  data () {
    return {
      haveManage: 0, // 管理各个页面中的新建按钮是否显示
      priceManage: 0 // 发布价格按钮是否显示
    }
  },
  created () {
    this.getManageConfig()
    this.getManageConfig(122, 'priceManage')
  },
  activated () {
    this.getManageConfig()
    this.getManageConfig(122, 'priceManage')
  },
  methods: {
    getManageConfig (id, type) {
      if (this.systemTypeObject || id) {
        configapi.manage({ type: id || this.systemTypeObject.id, isClinic: this.isClinic || false }).then(res => {
          if (res) { // 接口更换为平台朱宏伟的 && isConfig 为0有管理权1为无管理权
            const isConfig = res.isConfig || res.data.isConfig
            this[type || 'haveManage'] = !Number(isConfig)
          }
        })
      }
    }
  }
}
