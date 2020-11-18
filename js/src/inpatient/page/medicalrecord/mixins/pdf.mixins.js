import PaperJianyan from '@/inpatient/page/medicalrecord/paper.jianyan'
import PaperJiancha from '@/inpatient/page/medicalrecord/paper.jiancha'

export default {
  components: {
    PaperJianyan,
    PaperJiancha
  },
  data () {
    return {
      hideTable: false,
      showComponent: '',
      pdfHeight: 400,
      pdfUrl: '',
      columnAlign: 'left'
    }
  },
  computed: {
    leftSpan () {
      return this.hideTable ? 0 : 6
    },
    rightSpan () {
      return this.hideTable ? 23 : 18
    },
    middleSpan () {
      return this.hideTable ? 1 : 0
    }
  },
  created () {
    this.query()
  },
  methods: {
    showPdf (data) {
      this.showComponent = 'pdf'
      this.pdfUrl = this.$ever.fileUrl2 + data.url
      this.listenPdfResize()
    },
    listenPdfResize () {
      let div = document.getElementById(this.pdfId)
      this.pdfHeight = div.offsetHeight - 50
      if (this.pdfHeight < 400) this.pdfHeight = 400
    },
    headerClick (column) {
      if (column.property === 'openIcon') this.hideTable = true
    }
  }
}
