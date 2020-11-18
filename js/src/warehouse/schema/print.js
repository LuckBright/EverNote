import printFormat from './printConfig'
let format
export default {
  data () {
    format = this._printInfo()
    return {
      recordData: format.recordData,
      printData: format.printData,
      tableHead: format.tableHead,
      printFooter: format.printFooter,
      pHeader: format.pHeader,
      printFooterData: format.printFooterData,
      footerSign: format.printFooterSign
    }
  },
  methods: {
    _printInfo () {
      let format
      let printModel = this.$ever.getClinicConfig().printModel
      let source = Number(this.$route.meta.source)
      let purchase = Number(this.$route.meta.purchase)
      // 光熙康复
      if (printModel === 2) {
        switch (source) {
          case 2:
            format = printFormat.format2
            break
          default:
            format = printFormat.format3
        }
      }
      // 心合堂
      if (printModel === 1) {
        switch (source) {
          case 2:
            format = printFormat.format1
            break
          default:
            format = printFormat.format3
        }
      }
      // 美尔目
      if (printModel === 3) {
        // 采购入库单据增加供应商
        if (purchase === 1) {
          printFormat.format_3_10.pHeader = [
            { name: '入库库房', data: '', width: '35%' },
            { name: '供应商', data: '', width: '40%' },
            { name: '入库时间', data: '', width: '25%' }
          ]
        } else {
          printFormat.format_3_10.pHeader = [
            { name: '入库库房', data: '', width: '50%' },
            { name: '入库时间', data: '', width: '50%' }
          ]
        }
        // 采购单
        switch (source) {
          case 1:
            format = printFormat.format_3_1
            break
          case 2:
            format = printFormat.format1
            break
          case 4:
            format = printFormat.format_3_4
            break
          case 6:
            format = printFormat.format_3_6
            break
          case 7:
            format = printFormat.format_3_7
            break
          case 10:
            format = printFormat.format_3_10
            break
          case 100:
            format = printFormat.format_3_100
            break
          default:
            format = printFormat.format3
        }
      }
      this.recordData = format.recordData
      this.printData = format.printData
      this.tableHead = format.tableHead
      this.printFooter = format.printFooter
      this.pHeader = format.pHeader
      this.printFooterData = format.printFooterData
      this.footerSign = format.printFooterSign
      return format
    }
  },
  watch: {
    '$route' (val) {
      format = this._printInfo()
    }
  }
}
