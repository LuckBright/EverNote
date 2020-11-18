import storage from '@/util/storage'
// import storageroomApi from '@/warehouse/store/storageroomapi'
import { drugOrMaterialType } from '@/util/common'
export default {
  data () {
    return {
      // 当前库房物资类型
      materialType: '',
      // 当前库房可选择物资数组
      materialTypeArr: [],
      // 当库房只有一个时候，初始化库房id为第一个条，其余为空
      initstorageId: '',
      // 库房数量为多条是，手动选择的库房id
      selectStorageId: '',
      // 库房列表数据
      storageItem: [],
      // 当前库房id  === initStorageId 或者 selectStorageId
      storageId: '',
      // 物资对象
      // 缓存库房id 用于切换库房时清除所有查询条件
      cacheCurrentStorageId: '', // 好像只有出入库需要用到此参数
      listParams: { storageId: '' },
      storageIdVuex: '',
      isInvented: 0,
      keepAliveCount: 0,
      onKeepAlive: false,
      drugOrMaterialType
    }
  },
  created () {
    this.storageIdVuex = storage.getLocalStorage('STORAGE_ID_VUEX')
    this.getLocalStorage()
  },
  activated () {
    this.keepAliveCount++
    // 默认查询列表 keepAlive  重新进入
    if (this.keepAliveCount > 1) {
      this.onKeepAlive = true
      // this.keepAliveCount = 0
    } else {
      this.onKeepAlive = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.storageId !== vm.cacheCurrentStorageId) {
        // 初始化查询数据
        vm._info && vm._info(false, true)
        // 清空查询条件参数
        let noClearParams = ['startDate', 'endDate']
        if (vm.noClearParams) noClearParams = [...noClearParams, ...vm.noClearParams]
        const schema = vm.querySchema ? 'querySchema' : 'schema' // 有可能querySchema变成schema （兼容处理）
        vm[schema] && Array.isArray(vm[schema]) && vm[schema].forEach(schema => {
          if (!vm.noClearDate || from.path.indexOf('add') === from.path.length - 3) {
            if (!noClearParams.includes(schema.name) && vm.queryObj) {
              // schema.initValue 非字符串类型值时：给定默认值
              schema.initValue ? vm.queryObj[schema.name] = schema.initValue : vm.queryObj[schema.name] = ''
            }
          }
          // if (!vm.noClearDate && !noClearParams.includes(schema.name)) {
          //   vm.queryObj[schema.name] = ''
          // }
        })
        // 更新当前缓存库房id
        vm.cacheCurrentStorageId = vm.storageId
      }
      // 默认查询列表 keepAlive  重新进入
      if (vm.onKeepAlive) {
        vm.list && vm.list()
      }
    })
  },
  methods: {
    // 从localStorage中获取库房信息
    getLocalStorage () {
      const { path, query } = this.$route
      if (path.indexOf('/storages') > -1) {
        const storageId = query.storageId
        if (storageId) {
          this.storageId = storageId
          storage.setLocalStorage('STORAGE_ID_VUEX', storageId)
          storage.setLocalStorage('STORAGE_ID', storageId)
        } else {
          this.storageId = storage.getLocalStorage('STORAGE_ID_VUEX')
        }
      }
      // this.materialType = storage.getLocalStorage('MATERIAL_TYPE')
      // this.storageRoomType = storage.getLocalStorage('STORAGE_ROOM_TYPE')
      // this.initstorageId = storage.getLocalStorage('INIT_STORAGE_ID')
      // this.selectstorageId = storage.getLocalStorage('STORAGE_ID')
      this.storageItem = JSON.parse(storage.getLocalStorage('STORAGE_ITEM')) || []
      // this.storageId = this.initstorageId ? this.initstorageId : this.selectstorageId
      // if (this.storageIdVuex && this.storageId) this.storageId = this.storageIdVuex // 如果有通过nav导航菜单选择的库房， 就使用
      // if (this.storageId && this.$store.state.dispensing.storageId) {
      //   this.storageId = this.$store.state.dispensing.storageId // vuex 里面有库房id 就取vuex中的数据
      //   storage.setLocalStorage('STORAGE_ID_VUEX', this.storageId)
      // }
      // 是否是虚拟库房 0 实体库房   1 虚拟库房
      let isInvented = this.storageItem.find(item => item.id === this.storageId)
      if (isInvented) this.isInvented = isInvented.isInvented
      this.handlerMaterialTypeArr()
      // 设置list.js 查询参数
      this.listParams.storageRoomId = this.storageId
      // this.listParams.materialType = this.materialType
      this.listParams.storageRoomType = this.storageRoomType
    },
    handlerMaterialTypeArr () {
      this.materialTypeArr = [...this.drugOrMaterialType]
      // let materialType = storage.getLocalStorage('MATERIAL_TYPE')
      // if (materialType) {
      //   this.materialTypeArr = [...this.drugOrMaterialType].filter(item => {
      //     if (materialType.indexOf('[') > -1) {
      //       return JSON.parse(materialType).includes(item.id)
      //     } else {
      //       return [materialType].includes(item.id)
      //     }
      //   })
      // }
    },
    storageRoomMaterial () {
      let materialTypeArr = [...this.drugOrMaterialType]
      if (this.$ever.getFieldFromSchema(this.schema, 'materialType')) this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = materialTypeArr
      if (!this.obj.materialType) this.obj.materialType = materialTypeArr[0].id
      // storageroomApi.getMaterialTypeListByStorageRoomId({ id: this.storageId }).then(res => {
      //   if (res) {
      //     let materialTypeArr = res
      //     if (this.$ever.getFieldFromSchema(this.schema, 'materialType')) this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = materialTypeArr
      //     materialTypeArr.map((item, index) => {
      //       if (item.id === '296') {
      //         this.obj.materialType = item.id
      //       }
      //     })
      //     if (!this.obj.materialType) this.obj.materialType = materialTypeArr[0].id
      //   }
      // })
    }
  },
  watch: {
    '$route' () {
      this.getLocalStorage()
    }
  }
}
