<template>
  <div class="medical_record_detail">
    <ever-bread-crumb ref="breadCrumb" show-edit-fnt="false" :have-return="true" :isCustomBack="true" @back="back">
    </ever-bread-crumb>
    <div class="docs_wrap">
      <docs-wrapper></docs-wrapper>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import docsWrapper from '@/inpatient/page/docswrapper'
import lock from '@/inpatient/page/medicalrecord/mixins/lock.js'
export default {
  mixins: [lock],
  components: {
    docsWrapper
  },
  beforeRouteLeave (to, from, next) {
    let isSaved = this.isSaved()
    if (isSaved) {
      this.applyUnLock()
      this.clearSession()
      next()
    } else {
      this.$confirm('离开此页面将丢失更改的内容，请先执行保存操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '不保存',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        this.noLeave()
        next(false)
      }).catch(() => {
        this.applyUnLock()
        this.clearSession()

        next()
      })
    }
  },
  created () {
    window.addEventListener('beforeunload', this.onbeforeunloadhandler)
    window.addEventListener('unload', this.onbeforeunloadhandler)
  },
  methods: {
    back () {
      storage.setLocalStorage('recordTabs', JSON.stringify([]))
      let from = this.$route.query.from
      if (from === 'medicalRecall') {
        this.$store.commit('setRecall', 'second')
      } else if (from === 'medicalBorrow') {
        this.$store.commit('setBorrow', 'second')
      }
      if (window.history.length) {
        window.history.go(-1)
      }
    },
    onbeforeunloadhandler (e) {
      let isSaved = this.isSaved()
      if (!isSaved) { // 有未保存的需要提示
        (e || window.event).returnValue = '有未保存的病历，是否放弃保存'
      }
    },
    isSaved () {
      let localRecordTabs = storage.getLocalStorage('recordTabs')
      let recordTabs = localRecordTabs ? JSON.parse(localRecordTabs) : []

      if (!recordTabs.length || !recordTabs[0]) return true
      let isSaved = recordTabs.every((val) => {
        return !val.isUpdate || val.isUpdate === false
      })
      return isSaved
    },
    clearSession () {
      storage.setLocalStorage('quoteTemplates', JSON.stringify([]))
      storage.setLocalStorage('recordTabs', JSON.stringify([]))
    },
    noLeave () {
        // 阻止菜单的active变化
      this.$bus.$emit('nav:preventActiveChange')
        // this.docSaveDailogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.medical_record_detail{
  display:flex;
  flex:1;
  height:100%; 
  overflow:hidden;
  flex-direction:column;
  .docs_wrap{
    height:100%;
    flex:1;
    overflow:hidden;
  }
  /deep/.inpatient_doc_wrap{
    height:100%;
  }
}
</style>
