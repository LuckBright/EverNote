
import update from '@/emr/mixins/update.js'// vuex存储数据
import confirm from '@/util/confirm'
export default{
  mixins: [update],
  beforeRouteLeave (to, from, next) {
    if (this.templateChange) {
      confirm(this, {
        confirmCallBack: () => {
          this.noLeave()
          this.saveTpl()
        },
        cancelCallBack: () => {
          this.setAsyncChange(false)
          next()
        }
      })
    } else {
      this.setAsyncChange(false)
      // this.initUpDate()
      next()
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.onbeforeunloadhandler)
    window.addEventListener('unload', this.onbeforeunloadhandler)
  },
  methods: {
    noLeave () {
      // 阻止菜单的active变化
      this.$bus.$emit('nav:preventhirdtActiveChange', true)
    },
    saveTpl () {
      console.error('保存模版方法缺失')
    },
    onbeforeunloadhandler (e) {
      if (this.templateChange) { // 有未保存的需要提示
        (e || window.event).returnValue = '有未保存的模版，是否放弃保存'
      }
    }
  }
}
