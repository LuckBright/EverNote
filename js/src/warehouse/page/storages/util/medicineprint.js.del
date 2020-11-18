/* eslint-disable */
// 发药打印公共js
const printParams = {
  preview: false,
  settings: {
    printer: null, // 设置选中的打印机
    portrait: true
  }
}
import { frPrint, CHINESE_MEDICINE_TYPE } from '@/util/common'
export default {
  data () {
    return {
      // 打印多个打印机数据整合
      printAll: []
    }
  },
  mounted () {
    // 判断某一个打印机打印完成，启动下一个打印任务
    let _this = this
    window.addEventListener('message', function (e) {
      if (e.data === 'printdone') {
        if (_this.printAll && _this.printAll.length) {
          let toPrint = _this.printAll.shift()
          let printObj = Object.assign({}, printParams.settings)
          let newPrintObj = Object.assign({}, printParams, { settings: printObj })
          if (toPrint) frPrint(toPrint.type, toPrint, newPrintObj)
        }
      }
    }, false)
  },
  methods: {
    /**
     * 1、门诊发药-摆药单（热敏纸）
        帆软表单编号：
        outpatient_01
        输入纸张宽度：80

        2、门诊发药-小药签
        outpatient_item_01
        输入纸张宽度：50
        输入纸张高度：40

        3、门诊发药-药签（父子医嘱）
        outpatient_item_is_min_01
        输入纸张宽度：68
        输入纸张高度：52

        4、住院发药-udd药包
        udd_outpatient_01
        输入纸张宽度：68
        输入纸张高度：52
     * props                        字段含义
     * @param types                 发药类型（outpatient：门诊，hospitalization：住院, blood:血库）
     * @param data                  数据（对象）
     * @param arr                   数据（数组）
     * @param code                  打印编码
     * @param isSingle              是否单个打印（补打药签）
     * @param curMine               当前父子医嘱
     * @param isMakeUp              只查询该账户所属内容
     * @param curAdviceType         当前类型（中药、西药）
     * @param isQueryPrint          是否处方查询类数据结构打印
     */
    // 打印单个
    handleReprint ({ types, data, isSingle, curMine, isMakeUp, arr, curAdviceType, isQueryPrint, code, paramName = 'id' }) {
      this.printAll = []
      // 门诊批量打印
      if (types === 'batch') {
        arr.forEach(print => {
          // 打印白药单
          let localMaterialIds = []
          let codes = []
          print.outpatientDispenseItemList.forEach(item => {
            // 区分中西药
            localMaterialIds.push(item.localMaterialId)
            codes.push(print.code)
            if (CHINESE_MEDICINE_TYPE.includes(item.adviceType)) {
              console.log('中药模版')
            } else {
              if ([1, 2].includes(item.isMine)) {
                // 父子医嘱
                this.printAll.push({ itemIds: item.id, localmaterialIds: item.localMaterialId, type: 'outpatient_item_is_min_01' })
              } else {
                this.printAll.push({ id: item.id, localmaterialIds: item.localMaterialId, type: 'outpatient_item_01' })
              }
            }
          })
          this.printAll.push({ code: codes, localmaterialIds: localMaterialIds.join("','"), type: 'outpatient_01' })
        })
      }
      // 门诊发药
      if (types === 'outpatient') {
        if (arr && !arr.length) return this.$messageTips(this, 'warning', '请选择需要打印的门诊摆药单')
        if (isSingle && curMine) {
          this.handelHospitalLabel({ data, curAdviceType })
        } else if (isSingle && !curMine) {
          this.handelPrescriptionLabel({ data, curAdviceType })
        } else if (isMakeUp) {
          this.handlePutMedicine({ arr, isQueryPrint })
        } else {
          this.handlePutMedicine({ arr, isQueryPrint })
          this.handelPrescriptionLabel({ arr, isQueryPrint })
          this.handelHospitalLabel({ arr, isQueryPrint })
        }
      }
      // 住院发药
      if (types === 'hospitalization') {
        if (isMakeUp) {
          this.handelDrugPack({ data })
        } else if (isSingle && curMine) {
          // 补打父子医嘱单(药包)
          this._isMain(data)
        } else if (isSingle) {
          // 补打摆药单
          this.handlePrintDispensing(data)
        } else {
          // 同时打印多台打印机多个任务列表
          this.handlePrintQueue({ data, arr })
        }
      }
      // 血库打印 (都是单个打印，如有特殊场景，需拓展方法)
      if (types === 'blood') {
        this.printAll.push({ id: data[paramName], type: code })
      }
      if (this.printAll.length) {
        let toPrint = this.printAll.shift()
        let printObj = Object.assign({}, printParams.settings, { printer: printerList[toPrint.type] })
        let newPrintObj = Object.assign({}, printParams, { settings: printObj })
        if (toPrint) frPrint(toPrint.type, toPrint, newPrintObj)
      }
    },
    // 打印摆药单 + 摆药单条码
    handlePrintDispensing (data) {
      this.printAll.push({ codes: data.codes, type: 'in_dispense_print' })
      this.printAll.push({ codes: data.codes, type: 'ZHU_YUAN_FA_YAO_BAI_YAO_DAN_HAO' })
    },
    handlePrintQueue ({ data, arr }) {
      if (data) {
        this.handlePrintDispensing(data)
      }
      if (arr.length) {
        arr.forEach(item => {
          // isMain 1 == 父医嘱  2 == 子医嘱  0 == 非父子医嘱
          this._isMain(item)
        })
      }
    },
    // 住院发药父子医嘱
    _isMain (data) {
      let type = ''
      type = data.isMain ? 'in_udd_dispense' : 'in_udd_dispense_no_child'
      this.printAll.push({ id: data.id, type })
    },
    handelDrugPack ({ data }) {
      if (data) {
        // 区分中西药
        if (CHINESE_MEDICINE_TYPE.includes(data.adviceType)) {
          console.log('中药模版')
        } else {
          this._hospitalDrugPack({ data })
        }
      } else { }
    },
    _hospitalDrugPack ({ data }) {
      if (data.uddDispenseItemList && data.uddDispenseItemList.length) {
        let drugPackIdArr = []
        let drugPackIdStr = ''
        data.uddDispenseItemList.forEach(item => {
          drugPackIdArr.push(item.localMaterialId)
        })
        drugPackIdStr = drugPackIdArr.join("','")
        if (drugPackIdArr.length) this.printAll.push({ id: data.id, localmaterialIds: drugPackIdStr, type: 'udd_outpatient_01' })
      }
    },
    // 门诊发药 start
    // 打印摆药单帆软(通过处方code调用打印模版) start
    handlePutMedicine ({ data, arr, isQueryPrint }) {
      let codes = []
      let localMaterialIds = []
      if (data || isQueryPrint) {
        let putData = ''
        isQueryPrint ? putData = arr : putData = data
        putData[1].forEach(item => {
          if (item.outpatientDispenseItem) localMaterialIds.push(item.outpatientDispenseItem.localMaterialId)
        })
        this._medicineList({ localMaterialIds, medicineCode: [putData[0].code] })
      } else if (arr) {
        arr.forEach(v => {
          // 区分中西药
          if (CHINESE_MEDICINE_TYPE.includes(v[0].adviceType)) {
            // console.log('中药模版')
          } else {
            codes.push(v[0].code)
          }
          v[1].forEach(item => {
            if (item.outpatientDispenseItem) {
              localMaterialIds.push(item.outpatientDispenseItem.localMaterialId)
            }
          })
        })
        // 中药打印 todo
        this._medicineList({ localMaterialIds, medicineCode: codes })
      }
    },
    // 打印门诊摆药单
    _medicineList ({ localMaterialIds, medicineCode }) {
      console.log(localMaterialIds, medicineCode)
      if (medicineCode && localMaterialIds.length) this.printAll.push({ code: medicineCode.join("','"), localmaterialIds: localMaterialIds.join("','"), type: 'outpatient_01' })
    },
    // 摆药单 end
    // 打印处方发药标签(通过数量调用打印模版) start
    handelPrescriptionLabel ({ data, arr, curAdviceType, isQueryPrint }) {
      if (data && curAdviceType) {
        // 区分中西药
        if (CHINESE_MEDICINE_TYPE.includes(curAdviceType)) {
          console.log('中药模版')
        } else {
          this.printAll.push({ id: data.outpatientDispenseItem.id, localmaterialIds: data.outpatientDispenseItem.localMaterialId, type: 'outpatient_item_01' })
          // this._prescriptionDispensingLabel({data})
        }
      } else if (arr) {
        if (isQueryPrint) {
          if (CHINESE_MEDICINE_TYPE.includes(arr[0].adviceType)) {
            console.log('中药模版')
          } else {
            this._prescriptionDispensingLabel({ data: arr[1] })
          }
        } else {
          arr.forEach(v => {
            // 区分中西药
            if (CHINESE_MEDICINE_TYPE.includes(v[0].adviceType)) {
              console.log('中药模版')
            } else {
              this._prescriptionDispensingLabel({ data: v[1] })
            }
          })
        }
      }
    },
    // 非父子医嘱
    _prescriptionDispensingLabel ({ data }) {
      data.forEach(item => {
        console.log(item.outpatientDispenseItem && ![1, 2].includes(item.outpatientDispenseItem.isMine))
        if (item.outpatientDispenseItem && ![1, 2].includes(item.outpatientDispenseItem.isMine)) this.printAll.push({ id: item.outpatientDispenseItem.id, localmaterialIds: item.outpatientDispenseItem.localMaterialId, type: 'outpatient_item_01' })
      })
    },
    // 处方发药end
    // 打印院内发药（根据isMine为 1 父，2 为子调用打印模版）start
    handelHospitalLabel ({ data, arr, curAdviceType, isQueryPrint }) {
      if (data && curAdviceType) {
        // 区分中西药
        if (CHINESE_MEDICINE_TYPE.includes(curAdviceType)) {
          console.log('中药模版')
        } else {
          this._hospitalLabelParmas({ data, curAdviceType })
        }
      } else if (arr) {
        if (isQueryPrint) {
          if (CHINESE_MEDICINE_TYPE.includes(arr[0].adviceType)) {
            console.log('中药模版')
          } else {
            this._hospitalLabelParmas({ data: arr })
          }
        } else {
          arr.forEach(v => {
            // 区分中西药
            if (CHINESE_MEDICINE_TYPE.includes(v[0].adviceType)) {
              console.log('中药模版')
            } else {
              this._hospitalLabelParmas({ data: v })
            }
          })
        }
      }
    },
    _hospitalLabelParmas ({ data, curAdviceType }) {
      let hospitalItemArr = []
      let hospitalLoclArr = []
      hospitalItemArr = curAdviceType ? this._reduceGetArr({ dataCur: data, parameter: 'id' }) : this._reduceGetArr({ dataCur: data[1], parameter: 'id' })
      hospitalLoclArr = curAdviceType ? this._reduceGetArr({ dataCur: data, parameter: 'localMaterialId' }) : this._reduceGetArr({ dataCur: data[1], parameter: 'localMaterialId' })
      if (hospitalItemArr.length && hospitalLoclArr.length && hospitalItemArr.length === hospitalLoclArr.length) {
        hospitalItemArr.forEach((item, i) => {
          this.printAll.push({ itemIds: item, localmaterialIds: hospitalLoclArr[i], type: 'outpatient_item_is_min_01' })
        })
      }
    },
    // 院内发药标签获取父子医嘱（id, localMaterialId)
    _reduceGetArr ({ dataCur, parameter }) {
      let reduceData = []
      let lastArr = []
      dataCur.forEach(item => {
        let outpatientDispenseItem = item.outpatientDispenseItem
        if ([1, 2].includes(outpatientDispenseItem.isMine)) lastArr.push(outpatientDispenseItem[parameter])
      })
      if (lastArr.length) reduceData.push(lastArr.join("','"))
      // 一个处方单号多个父子医嘱方法（勿删）
      // const lastArr = dataCur.reduce((total, cur) => {
      //   let outpatientDispenseItem = cur.outpatientDispenseItem
      //   if (outpatientDispenseItem.isMine === 1) {
      //     total.length > 0 ? reduceData.push(total.join("','")) : null
      //     total = []
      //   }
      //   if (outpatientDispenseItem.isMine === 1 || outpatientDispenseItem.isMine === 2) total.push(outpatientDispenseItem[parameter])
      //   return total
      // }, [])
      // if (lastArr.length) reduceData.push(lastArr.join("','"))
      return reduceData
    }
    // 院内发药 end
    // 门诊发药 end

    // 住院发药 start

    // 住院发药 end
  }
}
