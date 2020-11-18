<template>
  <docs ref="docs" :doctype1="1" :space-name="spaceName" :baseroute="baseroute">
    <el-dialog
      :visible.sync="docSaveDailogShow"
      :show-close="false"
      width="420px">
      <div class="leave-dialog-body">
        <i class="el-icon-info"></i>
        <div class="leave-dialog-text">
          <div class="main-title">您要保存在电子病历中所做的更改吗？</div>
          <div class="sub-title">如果不保存，您更改的内容将会丢失</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noLeave">取 消</el-button>
        <el-button type="primary" @click="leave">不保存</el-button>
        <el-button type="primary" @click="saveAll">保 存</el-button>
      </span>
    </el-dialog>
  </docs>

</template>
<script>
  import docs from '@/inpatient/page/docs'
  import storage from '@/util/storage'
  import lock from '@/inpatient/page/medicalrecord/mixins/lock.js'
  // let csa = ['nurse', 'anesthetist']
  export default {
    name: 'docswrapper',
    mixins: [lock],
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
    components: {
      docs
    },
    data () {
      return {
        docSaveDailogShow: false,
        baseroute: this.$route.meta && this.$route.meta.secActiveIndex,
        spaceName: this.$route.matched[0].meta.space
      }
    },
    created () {
      window.addEventListener('beforeunload', this.onbeforeunloadhandler)
      window.addEventListener('unload', this.onbeforeunloadhandler)
    },
    methods: {
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
      },
      leave () {
        this.clearSession()
        this.docSaveDailogShow = false
        this.$emit('leave')
      },
      saveAll () {
        this.clearSession()
        this.docSaveDailogShow = false
        this.$bus.$emit('docMulSave', () => {
          this.$emit('leave')
        })
      },
      // 浏览器回退事件拦截
      preventBrowseGo () {
        console.log('触发浏览器事件')
      }
    },
    beforeDestroy () {
      // debugger
      // this.applyUnLock()
       // 浏览器关闭或刷新时
      window.removeEventListener('beforeunload', this.onbeforeunloadhandler)
      // 退出页面时触发
      window.removeEventListener('unload', this.onbeforeunloadhandler)
    }
  }
</script>
<style lang="scss" scoped>
  .leave-dialog-body {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-info {
      font-size: 48px;
      color: #1C7BEF;
    }
    .main-title {
      font-size: 16px;
      color: #000;
      display: inline-block;
    }
    .sub-title {
      color: #666;
      font-size: 14px;
      display: inline-block;
      margin-top: 10px;
    }
  }
  .leave-dialog-text {
    width: 276px;
    margin-left: 15px;
  }
</style>

