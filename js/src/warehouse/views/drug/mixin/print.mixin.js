import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
import { objGet, whComFn } from '@/util/common'
import storage from '@/util/storage'
// import JcpPrintMixin from '@/warehouse/util/jcpprint'
export default {
  mixins: [dispenseSettingMixin],
  data () {
    return {
      drugTableData: [], // 全部药品打印数据 -- 摆药单
      nonPaternal: [], // 非父子医嘱打印数据
      fatherAdvice: [], // 父子医嘱打印数据
      printPatientObj: {}, // 患者信息打印数据
      jcpKey: '', // 打印内容key
      curCount: 0,
      processItemObject: objGet(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject', {}), // 库房发药配置
    }
  },
  methods: {
    _initPrint () {
      this.nonPaternal = []
      this.fatherAdvice = []
      this.drugTableData = []
    },
    gatherPrintData (res, filterArr, reprint = false) { // 处方发药 、住院发药   批量打印和打印
      const { prescriptionList, patientObject } = res
      // 打印数据收集 start
      let aArr = ['nonPaternal', 'fatherAdvice', 'drugTableData']
      this._initPrint()
      let dispensingList = []
      let aFatherAdviceList = []
      let adviceType = ''
      let mainGroupIdList = [] // 所有的父子医嘱id
      let mainGroupIdListDay = []
      prescriptionList && prescriptionList.forEach(item => {
        if (item.taskType) adviceType = item.taskType.toString()
        let oAdvice = {}
        item.taskItemList = item.taskItemList || item.outpatientDispenseList
        const oMineObj = whComFn.adviceResetData(item.taskItemList) // 排序数组中的父子医嘱{[mainGroupId（父子医嘱id）]: {child: 父子医嘱明细数据（array）, mineNum: 父子医嘱个数（number）}}
        item.taskItemList.forEach((drugData) => {
          drugData.oMineObj = oMineObj
          // 父子医嘱id
          const mainGroupId = drugData.mainGroupId
          mainGroupIdList.push(drugData.mainGroupId)
          mainGroupIdListDay.push({mainGroupId: drugData.mainGroupId, useDay: drugData.useDay, useFreq: drugData.useFreq})
          // if (objGet(this.processItemObject, 'dispensePreparePrint', '') === 1 && drugData.oMineObj) { // 打印备药单
          if (objGet(this.processItemObject, 'dispensePreparePrint', '') === 1) { // 打印备药单
            // if (drugData.oMineObj[mainGroupId]) {
            //   drugData.oMineObj[mainGroupId].child.map((adviceData, sub) => {
            //     if (adviceData.id === drugData.id) dispensingList.push(Object.assign(adviceData, { mineNum: drugData.oMineObj[mainGroupId].mineNum, sub }))
            //   })
            // }
            dispensingList.push(drugData)
          }
          if ([1, 2].includes(drugData.mainFlag) && objGet(this.processItemObject, 'dispensePatient', '') === 1 && drugData.oMineObj) { // 配置开启打印父子医嘱
            // advice.push(drugData)
            // 统计一个处方单中有多少个父子医嘱
            if (drugData.oMineObj[mainGroupId]) {
              if (!oAdvice[mainGroupId]) {
                drugData.oMineObj[mainGroupId].child[0].customBarcode = item.code // 给每个父子医嘱第一条添加处方code（barcode） 打印时需要展示code生成的二维码图片
                oAdvice[mainGroupId] = drugData.oMineObj[mainGroupId].child
              }
            }
          } else if (objGet(this.processItemObject, 'dispensePaste', '') === 1) { // 配置开启打印药贴
            // {此代碼可以提取公共方法 todo}
            // 每种药打一张
            if (objGet(this.processItemObject, 'processItemPasteObject.value', '') === '1') {
              this.nonPaternal.push({
                adviceType,
                storageRoomObj: item.storageRoom,
                tableData: Object.assign(drugData, { doctorData: { doctorName: item.doctorName } }),
                patientObj: patientObject
              })
            } else if (objGet(this.processItemObject, 'processItemPasteObject.value', '') === '2') {
              // 每盒药打一张
              for (let i = 0; i < drugData.num; i++) {
                this.nonPaternal.push({
                  adviceType,
                  storageRoomObj: item.storageRoom,
                  tableData: Object.assign({}, drugData, { doctorData: { doctorName: item.doctorName }, num: 1 }),
                  patientObj: patientObject
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
        if (objGet(this.processItemObject, 'dispensePatient', '') === 1) { // 父子医嘱开启，所有的父子医嘱单独打印一张药贴
          let arr = []
          let mainGroupArr = Array.from(new Set(mainGroupIdList))
          aFatherAdviceList.map(list => {
            arr.push(...list) // 所有父子医嘱的集合
          })
          mainGroupArr.map(item => {
            let data = arr.filter(aa => item === aa.mainGroupId) // 过滤每张父子医嘱数据
            // 父子医嘱每次用药打一张
            if (objGet(this.processItemObject, 'processItemPatientObject.value', '') === '2') {
              let findDayObj = mainGroupIdListDay.find(child => item === child.mainGroupId) // 取出每个父子医嘱的天数
              if (data && data.length) {
                // 查找当前父子医嘱开的天数  根据天数打印对应多少分父子医嘱
                if (findDayObj) {
                  // 取出需要用药的天数
                  var useDay = this.$filters.subZeroAndDot(findDayObj.useDay)
                  // 取出频次所有list
                  let FREQUENCY_LIST = JSON.parse(storage.getSessionStorage('FREQUENCY_LIST')) || []
                  // 查出频次对应的num
                  let useFreq = FREQUENCY_LIST.find(item => item.code === findDayObj.useFreq)
                  // 频次useFreq*天数useDay  需要打印的份数
                  for (let i = 0; i < useDay * useFreq.num || 0; i++) {
                    this.fatherAdvice.push({
                      adviceType,
                      tableData: data,
                      barCode: data[0].customBarcode,
                      patientObj: res.patientObject
                    })
                    if (reprint) break
                  }
                }
              }
            // 父子医嘱所有药打一张
            } else {
              this.fatherAdvice.push({
                adviceType,
                tableData: data,
                barCode: data[0].customBarcode,
                patientObj: res.patientObject
              })
            }
          })
        } else {
          aFatherAdviceList.map(list => { // 这种是每条父子医嘱打印一张药贴
            this.fatherAdvice.push({
              adviceType,
              tableData: list,
              barCode: list[0].customBarcode,
              patientObj: res.patientObject
            })
          })
        }
      }
      // 本期无备药流程，不打印备药单
      // this.drugTableData.push({
      //   adviceType,
      //   tableData: dispensingList,
      //   patientObj: res.patientObject
      // })
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
        if (objGet(this.processItemObject, 'processItemPasteObject.value', '') === '1') {
          this.nonPaternal.push({
            adviceType,
            storageRoomObj,
            tableData: Object.assign(data, { doctorData }),
            patientObj
          })
        } else if (objGet(this.processItemObject, 'processItemPasteObject.value', '') === '2') {
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
          settingsId: '标签50*40'
        },
        {
          parentId: '#printDocument100_40',
          settingsId: '标签100*40'
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
