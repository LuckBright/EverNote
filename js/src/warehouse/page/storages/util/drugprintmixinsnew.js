import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
import { objGet, whComFn } from '@/util/common'
export default {
  mixins: [dispenseSettingMixin],
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
    gatherPrintData (res, filterArr) { // 处方发药 、住院发药   批量打印和打印
      // 打印数据收集 start
      let aArr = ['nonPaternal', 'fatherAdvice', 'drugTableData']
      this._initPrint()
      let dispensingList = []
      let aFatherAdviceList = []
      let adviceType = ''
      res.outpatientDispenseInfo && res.outpatientDispenseInfo.forEach(item => {
        if (item.adviceType) adviceType = item.adviceType
        let oAdvice = {}
        item.outpatientDispenseItemList = item.outpatientDispenseItemList || item.outpatientDispenseList
        const oMineObj = whComFn.adviceResetData(item.outpatientDispenseItemList) // 排序数组中的父子医嘱{[adviceid（父子医嘱id）]: {child: 父子医嘱明细数据（array）, mineNum: 父子医嘱个数（number）}}
        item.outpatientDispenseItemList.forEach((drugData) => {
          drugData.oMineObj = oMineObj
          if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePreparePrint', '') === 1 && drugData.oMineObj) { // 打印备药单
            // dispensingList.push(Object.assign(drugData, { id: item.id }))
            if (drugData.oMineObj[drugData.adviceId]) {
              drugData.oMineObj[drugData.adviceId].child.map((adviceData, sub) => {
                if (adviceData.id === drugData.id) dispensingList.push(Object.assign(adviceData, { mineNum: drugData.oMineObj[drugData.adviceId].mineNum, sub }))
              })
            }
          }
          if ([1, 2].includes(drugData.isMine) && objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePatient', '') === 1 && drugData.oMineObj) { // 配置开启打印父子医嘱
            // advice.push(drugData)
            // 统计一个处方单中有多少个父子医嘱
            if (drugData.oMineObj[drugData.adviceId]) {
              if (!oAdvice[drugData.adviceId]) {
                drugData.oMineObj[drugData.adviceId].child[0].customBarcode = item.code // 给每个父子医嘱第一条添加处方code（barcode） 打印时需要暂时code生成的二维码图片
                oAdvice[drugData.adviceId] = drugData.oMineObj[drugData.adviceId].child
              }
            }
          } else if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePaste', '') === 1) { // 配置开启打印药贴
            // {此代碼可以提取公共方法 todo}
            // 每种药打一张
            if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispenseSettingPasteObject.value', '') === '1') {
              this.nonPaternal.push({
                adviceType,
                storageRoomObj: res.storageRoomObject,
                tableData: Object.assign(drugData, { doctorData: { doctorName: item.doctorName } }),
                patientObj: res.patientObject
              })
            } else if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispenseSettingPasteObject.value', '') === '2') {
              // 每盒药打一张
              for (let i = 0; i < drugData.num; i++) {
                this.nonPaternal.push({
                  adviceType,
                  storageRoomObj: res.storageRoomObject,
                  tableData: Object.assign({}, drugData, { doctorData: { doctorName: item.doctorName }, num: 1 }),
                  patientObj: res.patientObject
                })
              }
            }
          }
        })
        // 一个处方中拆分出多个父子医嘱，打印多张父子医嘱药贴
        Object.keys(oAdvice).forEach(item => {
          aFatherAdviceList.push(oAdvice[item])
        })
      })
      if (aFatherAdviceList.length) { // 所有处方中所有父子医嘱明细
        aFatherAdviceList.map(list => {
          this.fatherAdvice.push({
            adviceType,
            tableData: list,
            barCode: list[0].customBarcode,
            patientObj: res.patientObject
          })
        })
      }
      this.drugTableData.push({
        adviceType,
        tableData: dispensingList,
        patientObj: res.patientObject
      })
      // 过滤掉传入参数中的值重置为空
      aArr.forEach(item => {
        if (filterArr && filterArr.includes(item)) return
        if (filterArr && filterArr.length) this[item] = []
      })
      // 打印数据收集 end
      // 开始打印
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    handlerSendPrint (data, barCode, adviceType, patientObj = {}, storageRoomObj = {}, doctorData = {}) { // wmtemplate $on 接收 补打药签
      this._initPrint()
      if (data.length) { // 父子医嘱
        let advice = []
        this.jcpKey = barCode
        data.forEach(drugData => {
          if ([1, 2].includes(drugData.isMine)) {
            advice.push(drugData)
          }
        })
        if (advice.length) {
          this.fatherAdvice.push({ tableData: advice, adviceType, barCode, patientObj })
        }
      } else {
        this.jcpKey = data.id
        // 每种药打一张
        if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispenseSettingPasteObject.value', '') === '1') {
          this.nonPaternal.push({
            adviceType,
            storageRoomObj,
            tableData: Object.assign(data, { doctorData }),
            patientObj
          })
        } else if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispenseSettingPasteObject.value', '') === '2') {
          // 每盒药打一张
          for (let i = 0; i < data.num; i++) {
            this.nonPaternal.push({
              adviceType,
              storageRoomObj,
              tableData: Object.assign({}, data, { doctorData, num: 1 }),
              patientObj
            })
          }
        }
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
          parentId: '#printDocument68_52_opd',
          settingsId: '门诊和住院父子医嘱'
        }
      ]
      this.$refs.jcpPrint.handlerPrint(DOMS)
    }
  }
}
