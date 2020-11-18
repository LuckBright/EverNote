import { request } from '@/util/req'
import urls from '@/emr/urls'
import storage from '@/util/storage'
export default{
  data () {
    return {

    }
  },
  methods: {
    applyMedicalLock ({id, updateTime}, callback, refreshFn) {
      if (this.$ever.getClinicConfig().MEDICAL_RECORD_IS_LOCK !== '1') return
      const type = this.$route.matched[0].meta.medicalType // 1住院医生，3，护理
      request(urls.unlock.medicalRecordLock, {id, updateTime, type}).then(res => {
        if (res.head.errCode === 0) {
          let code = Number(res.data.code)
          if (code !== 0) {
            refreshFn && refreshFn()
            this.$confirm(res.data.msg, '提示', {
              // confirmButtonText: '确定',
              // cancelButtonText: '不保存',
              type: 'warning',
              showCancelButton: false,
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              callback && callback(res.data)
            })
          } else {
            // this.$messageTips(this, 'success', '申请病历加锁成功', '提示')
            callback && callback(res.data)
          }
        }
      })
    },
    removeLockKey(id) {
      let localRecordTabs = JSON.parse(storage.getLocalStorage('recordTabs'))
      localRecordTabs.forEach(item => {
        if (item.id === id) {
          this.$set(item, 'lockKey', null)
          // item.lockKey = key
        }
      })
      storage.setLocalStorage('recordTabs', JSON.stringify(localRecordTabs))
    },
    applyMedicalUnLock ({id, key}, callback) {
      if (!key) return false
      request(urls.unlock.medicalRecordUnlock, {id, lockKey: key}).then(res => {
        if (res.head.errCode === 0) {
          // this.$messageTips(this, 'success', '申请病历解锁成功', '提示')
          this.removeLockKey(id)
          setTimeout(() => {
            callback && callback()
          }, 100)
        }
      })
    },
    applyUnLock (callback) { // 从本地存储获取解锁
      let localRecordTabs = storage.getLocalStorage('recordTabs')
      let recordTabs = localRecordTabs ? JSON.parse(localRecordTabs) : []
      if (recordTabs.length) {
        recordTabs.forEach(item => {
          if (item.type === 'bingli' && item.lockKey) {
            this.applyMedicalUnLock({id: item.id, key: item.lockKey}, callback)
          }
        })
      }
    },
  }
}
