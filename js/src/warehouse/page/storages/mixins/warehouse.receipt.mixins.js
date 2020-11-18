import getstorage from '@/warehouse/page/storages/util/getstorage'
import storageroomApi from '@/warehouse/store/storageroomapi'
import storage from '@/util/storage'
import { btnGray } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  mixins: [getstorage, storage],
  data () {
    return {
      unRepeatedBtn: false,
      storageArr: [],
      tableData: [],
      oldVal: '',
      btn: '',
      storageRoom: JSON.parse(storage.getStorageByClinic('MATERIAL_TYPE')) || [], // 本库房物资类型
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
    }
  },
  computed: {
    btnGray () {
      return btnGray(this.tableData, this.isBatch)
    }

  },
  methods: {
    // 数量输入框报错提示
    titleTips (row, text) {
      row.num = ''
      this.$set(row, 'red', true)
      return this.everWarning(`${text}，请重新录入`)
    },
    // 更改库房提示取消，恢复原库房
    handlerCancelStorage () {
      if (this.btn !== 3) {
        this.obj[this.name] = this.oldVal
        this.btn = 7
      }
    },
    // 重置参数
    initInfo () {
      if (this.name === 'destroy') return
      Object.assign(this.queryParams, { isInvented: this.isInvented, storageRoomId: this.storageId })
      storageroomApi.list(this.queryParams).then(res => {
        if (res && res.list) {
          this.storageArr = res.list
          let toStorageRoomId = this.$ever.getFieldFromSchema(this[this.schemaName], this.name).props
          toStorageRoomId.options = res.list.filter(item => item.id !== this.storageId)
          if (toStorageRoomId.options.length === 1) {
            this.obj[this.name] = toStorageRoomId.options[0].id
          }
        }
      })
    },
    // 处理物资查询所需参数classifyIds
    getClassifyIds (v) {
      if (this.obj[this.name]) {
        let data = v || this.obj
        this.tableData = [{ add: true }]
        let toStorageRoom // 收货库房
        this.storageArr.forEach(item => {
          if (item.id === data[this.name]) {
            toStorageRoom = JSON.parse(item.materialType)
          }
        })
        let materArr = []
        toStorageRoom && toStorageRoom.map(mater => {
          const index = this.storageRoom.findIndex(keys => { return mater === keys })
          if (~index) {
            materArr.push(this.storageRoom[index])
          }
        })
        this.queryParams.classifyIds = materArr
      } else {
        this.tableData = []
      }
    }
  }
}
