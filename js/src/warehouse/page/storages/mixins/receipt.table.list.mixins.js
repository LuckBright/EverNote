import storageroomApi from '@/warehouse/store/storageroomapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { FULL_STATE } from '@/util/common'
import storage from '@/util/storage'

export default {
  mixins: [getstorage, storage],
  data () {
    return {
      FULL_STATE,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
    }
  },
  methods: {
    _info () {
      // isisInvented 是否需要查询虚拟库房
      let params = this.isisInvented ? { isInvented: this.isInvented } : {}
      storageroomApi.list(params).then(res => {
        if (res && res.list.length) {
          this.$ever.getFieldFromSchema(this.querySchema, 'toStorageRoomId').props.options = res.list.filter(item => item.id !== this.storageId)
        }
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'status').props.options = [{ id: '', name: '全部' }, ...FULL_STATE[this.businessTypes]]
      // this.querySchema[0].props.params.storageRoomId = this.storageId
    }
  },
}
