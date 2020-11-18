import domtoimage from './domtoimage'
import jcpTool from 'jcpjs'

export default {
  props: {
    visitId: {
      type: String,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    dptId: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    back: {
      // 反面
      type: Boolean,
      default: false
    }
  },
  async created () {
    this.form.patientId = this.patientId
    this.form.visitId = this.form.visitId
    this.form.dptId = this.form.dptId
    await this.getData()
    this.$nextTick(_ => {
      this.domToCanvas('main')
      setTimeout(() => {
        this.backShow = true
      }, 1000)
    })
  },
  data () {
    return {
      backShow: false, // 等页面正面加载完 再懒加载背面,
      printCanvasObj: {
        main: null,
        back: null
      }
    }
  },
  methods: {
    print () {
      this.$bus.$emit('medicalLoading', true)
      setTimeout(() => {
        this.printTodo()
      }, 500)
    },
    async setPrintObj (type) {
      this.printCanvasObj[type] = null
      // 放大比例 为了打印时显示更清晰一些
      let dom = this.$refs[type]
      if (!dom) return
      let scale = 2
      let imageOpt = {
        width: dom.clientWidth * scale,
        height: dom.clientHeight * scale,
        bgcolor: '#fff',
        style: {
          transform: `scale(${scale})`,
          transformOrigin: '0 0'
        },
        filter: function (node) {
          let classNameArr = ['el-popper', 'el-input__suffix']
          if (!node.className) return true
          return (
            !node.className.includes(classNameArr[0]) &&
            !node.className.includes(classNameArr[1])
          )
        }
      }
      let canvas = await domtoimage.draw(dom, imageOpt)
      this.printCanvasObj[type] = canvas
    },
    async domToCanvas (type) {
      this.$nextTick(async _ => {
        setTimeout(async () => {
          await this.setPrintObj(type)
        }, 400)
      })
    },
    async domToImageHandle (canvas, id, container) {
      let src = await canvas.toDataURL()
      let img = new Image()
      img.src = src
      img.style.width = '100%'
      img.style.height = '100%'
      let page = document.createElement('div')
      page.id = id
      page.appendChild(img)
      if (id === 'page1') container.insertBefore(page, container.childNodes[0])
      if (id === 'page2') container.appendChild(page)
    },
    async printTodo () {
      if (!this.printCanvasObj.back) await this.setPrintObj('back')
      if (!this.printCanvasObj.main || !this.printCanvasObj.back) {
        this.$bus.$emit('medicalLoading', false)
        return this.$messageTips(
          this,
          'warning',
          '预览生成中，请稍后！',
          '提示'
        )
      }
      let div = document.createElement('div')
      await Promise.all([
        this.domToImageHandle(this.printCanvasObj.main, 'page1', div),
        this.domToImageHandle(this.printCanvasObj.back, 'page2', div)
      ])
      this.$bus.$emit('medicalLoading', false)
      let printConfig = {
        documents: {
          pages: div.innerHTML,
          style: 'img{width: 99%;height:99%}'
        },
        settings: {
          marginBottom: 6,
          marginLeft: 6,
          marginRight: 6,
          marginTop: 6,
          paperName: 'A4',
          portrait: true
        },
        copyrights: '杰创软件拥有版权  www.jatools.com'
      }
      console.log('病案首页打印参数：', printConfig)
      jcpTool.getJCP().printPreview(printConfig)
    },
    change (key, val) {
      if (this.readonly) return
      this.form[key] = val
      this.$emit('update', true)
    }
  },
  watch: {
    printCanvasObj: {
      handler (val) {
        let status = !val.main
        this.$bus.$emit('printStatus', status)
      },
      deep: true
    }
  }
}
