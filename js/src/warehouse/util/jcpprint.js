import jcpjs from 'jcpjs'
import storage from '@/util/storage'
export default {
  data () {
    return {
      jcpjs,
      printers: [],
      docs: []
    }
  },
  methods: {
    playPrint (DOMS) {
      const _this = this
      DOMS.forEach(item => {
        if (!item.pages || item.pages === '<!---->') return
        this.docs.push({
          documents: item.pageId ? document : { // 页面元素在 div id="page1" 里面
            pages: item.pages
          },
          settingsId: item.settingsId,
          pageId: item.pageId,
          footer: item.pageId ? {
            html: '<div style="float:right; font-size: 12px"> <span style="font-size: 10px;">#p</span>/#P</div>'
          } : ''
        })
      })
      this.docs.length && doPrint(0)
      // cur 始终是第0个
      function doPrint (cur) {
        const doc = _this.docs[cur]
        const mydoc = {
          evalClass: 'eval-here',
          documents: doc.documents,
          settingsId: doc.settingsId,
          footer: doc.footer,
          copyrights: '杰创软件拥有版权 www.jatools.com',
          done: function () {
            _this.docs.splice(cur, 1)
            if (cur <= _this.docs.length - 1) {
              doPrint(cur)
            }
          }
        }
        if (doc.pageId) mydoc.pagePrefix = doc.pageId
        // 检测mac电脑不执行打印
        if (window.navigator.userAgent.indexOf('Mac OS') > -1) return
        setTimeout(_ => {
          if (Number(storage.getLocalStorage('printPreview')) === 1) {
            jcpjs.getJCP().printPreview(mydoc, false)
          } else {
            jcpjs.getJCP().print(mydoc)
          }
        })
      }
    }
  }
}
