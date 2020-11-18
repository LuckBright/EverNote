
export default {
  data () {
    return {
      drugTableData: [], // 全部药品打印数据 -- 摆药单
      nonPaternal: [], // 非父子医嘱打印数据
      fatherAdvice: [], // 父子医嘱打印数据
      printPatientObj: {}, // 患者信息打印数据
      jcpKey: '', // 打印内容key
      curCount: 0
    }
  },
  methods: {
    _initPrint () {
      this.nonPaternal = []
      this.fatherAdvice = []
      this.drugTableData = []
    },
    _gatherSingleRePrint (data) { //  单个补打摆药单 （收方发药，处方查询补打摆药单）
      this._initPrint()
      let dispensingList = []
      data[1].forEach(drugData => {
        dispensingList.push(drugData)
      })
      this.drugTableData.push({
        adviceType: this.tableData.adviceType,
        tableData: dispensingList,
        patientObj: this.tableData.patientObject
      })
      // 开始打印
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    _gatherSinglePrintData (item) { // （收方发药，处方查询打印）
      this._initPrint()
      let dispensingList = []
      let advice = []
      item[1].forEach(drugData => {
        dispensingList.push(drugData)
        if ([1, 2].includes(drugData.outpatientDispenseItem.isMine)) {
          advice.push(drugData)
        } else {
          this.nonPaternal.push({
            storageRoomObj: this.tableData.storageRoomObject,
            tableData: drugData,
            patientObj: this.tableData.patientObject
          })
        }
      })
      if (advice.length) {
        this.fatherAdvice.push({ tableData: advice, barCode: item[0].code, patientObj: this.tableData.patientObject })
      }
      this.drugTableData.push({
        adviceType: this.tableData.adviceType,
        tableData: dispensingList,
        patientObj: this.tableData.patientObject
      })
      // 开始打印
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    gatherPrintData (res, filterArr) { // 处方发药 、住院发药   批量打印和打印
      // 打印数据收集 start
      let aArr = ['nonPaternal', 'fatherAdvice', 'drugTableData']
      this.nonPaternal = []
      this.fatherAdvice = []
      this.drugTableData = []
      let dispensingList = []
      res.outpatientDispenseInfo && res.outpatientDispenseInfo.forEach(item => {
        let advice = []
        item[1].forEach(drugData => {
          dispensingList.push(drugData)
          if ([1, 2].includes(drugData.outpatientDispenseItem.isMine)) {
            advice.push(drugData)
          } else {
            this.nonPaternal.push({
              storageRoomObj: res.storageRoomObject,
              tableData: drugData,
              patientObj: res.patientObject
            })
          }
        })
        if (advice.length) {
          this.fatherAdvice.push({ tableData: advice, barCode: item[0].code, patientObj: res.patientObject })
        }
      })
      this.drugTableData.push({
        adviceType: res.adviceType,
        tableData: dispensingList,
        patientObj: res.patientObject
      })
      aArr.forEach(item => {
        filterArr && filterArr.forEach(p => {
          if (item === p) return
          this[item] = []
        })
      })
      // 打印数据收集 end
      // 开始打印
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    handlerSendPrint (data, barCode) { // wmtemplate $on 接收 补打药签
      this._initPrint()
      if (data.length) { // 父子医嘱
        let advice = []
        this.jcpKey = barCode
        data.forEach(drugData => {
          if ([1, 2].includes(drugData.outpatientDispenseItem.isMine)) {
            advice.push(drugData)
          }
        })
        if (advice.length) {
          this.fatherAdvice.push({ tableData: advice, barCode: barCode, patientObj: this.tableData.patientObject })
        }
      } else {
        this.jcpKey = data.outpatientDispenseItem.id
        this.nonPaternal.push({
          storageRoomObj: this.tableData.storageRoomObject,
          tableData: data,
          patientObj: this.tableData.patientObject
        })
      }
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    handlerPrint () {
      const DOMS = [
        {
          parentId: '#printDocument80', // 热敏纸
          settingsId: '门诊摆药单'
        },
        {
          parentId: '#printDocument50_40',
          settingsId: '门诊小药签'
        },
        {
          parentId: '#printDocument68_52',
          settingsId: '门诊和住院父子医嘱'
        }
      ]
      this.$refs.jcpPrint.handlerPrint(DOMS)
    }
  }
}
