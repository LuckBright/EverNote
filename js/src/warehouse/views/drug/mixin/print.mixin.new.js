import { objGet, whComFn, CONSUMABLES_TYPE } from '@/util/common'
import { everprint } from '@/util/print' // 平台打印控件
import storage from '@/util/storage'
import { PRINT_PLASTER_TYPE, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant'

export default {
  data () {
    return {
      isFinish: true,
      printData: [],
      preview: storage.getStorageByClinic('preview') || false, // 是否需要预览，默认不预览，需要的话在Local Storage 增加参数preview:true
      processItemObject: objGet(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject', {}), // 库房发药配置
    }
  },
  computed: {
    frequencyList () { // 取出频次所有list
      return JSON.parse(storage.getSessionStorage('FREQUENCY_LIST')) || []
    }
  },
  methods: {
    initPrint () {
      this.printData = []
    },
    getPrintData (list = [], reprint = false) {
      const len = this.printData.length
      if (len || (!len && !this.isFinish)) return
      this.isFinish = false
      this.initPrint()
      // 药贴不打印中药、耗材 && 715版本不打印补费
      let printList = list.filter(task => {
        const { taskType, scene } = task
        return ![...CONSUMABLES_TYPE, ...CHINESE_MEDICINE_TYPE].includes(`${taskType}`) && scene !== 6
      })
      if (printList && printList.length) {
        let mainGroupIdList = [] // 所有的父子医嘱id
        let mainGroupIdListDay = []
        let aFatherAdviceList = []
        printList && printList.forEach(item => {
          let oAdvice = {}
          let copyItem = Object.assign({}, item)
          // taskItemList 数据重新组装
          item.taskItemList = item.taskItemList.map(task => {
            delete copyItem.taskItemList
            return Object.assign({}, task, copyItem)
          })
          const oMineObj = whComFn.adviceResetData(item.taskItemList) // 排序数组中的父子医嘱{[mainGroupId（父子医嘱id）]: {child: 父子医嘱明细数据（array）, mineNum: 父子医嘱个数（number）}}
          item.taskItemList.forEach(drugData => {
            drugData.oMineObj = oMineObj
            // 父子医嘱id
            const mainGroupId = drugData.mainGroupId
            mainGroupIdList.push(mainGroupId)
            mainGroupIdListDay.push({mainGroupId: mainGroupId, useDay: drugData.useDay, useFreq: drugData.useFreq})
            if ([1, 2].includes(drugData.mainFlag) && objGet(this.processItemObject, 'dispensePatient', '') === 1 && drugData.oMineObj) { // 配置开启打印父子医嘱
              // 统计一个处方单中有多少个父子医嘱
              if (drugData.oMineObj[mainGroupId]) {
                if (!oAdvice[mainGroupId]) {
                  oAdvice[mainGroupId] = drugData.oMineObj[mainGroupId].child
                }
              }
            } else if (objGet(this.processItemObject, 'dispensePaste', '') === 1) { // 配置开启打印药贴
              // {此代碼可以提取公共方法 todo}
              // 每种药打一张
              if (objGet(this.processItemObject, 'processItemPasteObject.value', '') === '1') {
                this.nonPaternalPrint(drugData)
              } else if (objGet(this.processItemObject, 'processItemPasteObject.value', '') === '2') {
                // 每盒药打一张
                for (let i = 0; i < drugData.num; i++) {
                  this.nonPaternalPrint(drugData)
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
                    // 查出频次对应的num
                    let useFreq = this.frequencyList.find(item => item.code === findDayObj.useFreq)
                    // 频次useFreq*天数useDay  需要打印的份数
                    if (useFreq) {
                      for (let i = 0; i < useDay * useFreq.num || 0; i++) {
                        this.fatherAdvicePrint(data)
                        if (reprint) break
                      }
                    }
                  }
                }
              // 父子医嘱所有药打一张
              } else {
                this.fatherAdvicePrint(data)
              }
            })
          }
        }
      }
      // 发货单数据组装
      this.deliverPrint()
      // 数据收集完毕，开始打印
      if (this.printData.length) {
        this.goToPrint()
      }
    },
    nonPaternalPrint (data) {
      this.printData.push({
        name: 'nonPaternal',
        params: {
          ids: [data.taskId],
          value: objGet(this.processItemObject, 'processItemPasteObject.value', ''),
          dispenseSetting: objGet(this.$store.state || {}, 'processConfig.storageroomSystemConfig.dispenseSetting', ''),
        },
        preview: this.preview,
        code: PRINT_PLASTER_TYPE[objGet(this.processItemObject, 'processItemPasteObject.processItemPasteObject.value', '')]
      })
    },
    fatherAdvicePrint (data) {
      if (data && data.length) {
        let fatherAdviceIds = []
        data.forEach(task => {
          fatherAdviceIds.push(task.taskId)
        })
        this.printData.push({
          name: 'fatherAdvice',
          params: {
            ids: fatherAdviceIds,
            value: objGet(this.processItemObject, 'processItemPatientObject.value', ''),
            dispenseSetting: objGet(this.$store.state || {}, 'processConfig.storageroomSystemConfig.dispenseSetting', ''),
          },
          preview: this.preview,
          code: PRINT_PLASTER_TYPE[4]
        })
      }
    },
    // 循环调取打印操作
    /**
     * 由于目前并发队列会造成jcp崩溃的情况，现在暂时改成单队列，按顺序打印
     */
    goToPrint () {
      console.log('=====')
      let goToPrint = this.printData.shift()
      if (goToPrint) {
        everprint(goToPrint.code, goToPrint.params, {
          eventCb: (type) => {
            // 打印回调队列
            // 打印成功 或者 其他事件操作 会执行cb
            if (type === 'window-close') {
              if (!this.printData.length) this.isFinish = true
              this.goToPrint()
            }
          },
          preview: goToPrint.preview,
          printFrom: true,
          cb: _ => {
            if (!this.printData.length) this.isFinish = true
            this.goToPrint()
          },
        })
      }
    },
  },
}
