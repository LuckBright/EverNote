export default {
  data () {
    return {
      liveTableData: {}, // 全部药品打印数据 -- 摆药单 {tableData: 数据列表，barCode：编码}
      liveNonFatherAdvice: [], // 非父子医嘱打印数据
      fatherAdvice: [], // 父子医嘱打印数据
      printBarCode: '', // 条码编号
      hospitalType: '2', // 住院打印药包标签
      printPatientObj: {}, // 患者信息打印数据
      inpatientArea: {}, // 病区
      jcpKey: '', // 打印内容key
      liveType: false,
      jcpCount: 0
    }
  },
  methods: {
    _initPrint () {
      this.liveNonFatherAdvice = []
      this.liveTableData = {}
      this.fatherAdvice = []
      this.printBarCode = ''
      this.liveType = false
      this.printPatientObj = {}
    },
    resetGatherPrintData (data) {
      if (!data.isMain) { // 非父子医嘱
        this.liveNonFatherAdvice.push({
          tableData: data.uddDispenseItemList,
          patientObj: Object.assign(data.patientObject || {}, { hospitalizedNumber: data.hospitalizedNumber }),
          barCode: data.code,
          self: data
        })
      } else { // 父子医嘱
        this.liveType = true
        this.fatherAdvice.push({
          tableData: data.uddDispenseItemList,
          patientObj: Object.assign(data.patientObject || {}, { hospitalizedNumber: data.hospitalizedNumber }),
          barCode: data.code,
          self: data
        })
      }
    },
    gatherPrintSingle (data) { // 住院补打药包 和 单个打印药包
      this.jcpKey = this.jcpCount++
      this._initPrint()
      this.resetGatherPrintData(data)
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    handlerPrint () {
      const DOMS = [
        {
          parentId: '#printDocument_ipd_live68_52', // 住院父子医嘱
          settingsId: '门诊和住院父子医嘱'
        },
        {
          parentId: '#printDocument_live68_52', // 批量摆药单条码
          settingsId: '住院批量摆药单条码'
        },
        {
          parentId: '#printDocument_non68_52', // 住院非父子医嘱
          settingsId: '住院非父子医嘱'
        },
        {
          parentId: '#printDocumentA4', // 批量摆药单 默认A4打印机
          settingsId: '住院批量摆药单',
          pageId: 'udd_'
        },
        {
          parentId: '#printDocument_summary_A4', // 按病区汇总药品摆药单 默认A4打印机
          settingsId: '住院批量摆药单',
          pageId: 'summary_'
        }
      ]
      this.$refs.jcpPrint.handlerPrint(DOMS)
    }
  }
}
