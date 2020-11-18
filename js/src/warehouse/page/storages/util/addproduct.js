import {floatTool} from '@/util/common'
export default {
  data () {
    return {
      clear: false
    }
  },
  methods: {
    // 检查该字段是否有值
    _fieldCompareCheck (arr, field) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][field]) {
          return false
        }
      }
      return true
    },
    // 字段比较  arr 数组   filed 比较的字段   val  比较的具体值
    _fieldCompare (arr, field, val) {
      // if (val === '') return true
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][field] + '' === val + '') {
          return false
        }
      }
      return true
    },
    _pushUniqueCode (data, list, itemName) {
      if (!list.item.length) {
        this._pushUniqueCodeData(list.item[0], data, itemName)
        return
      }
      for (let i = 0; i < list.item.length; i++) {
        let item = list.item[i]
        if (data.localMaterialId === item.localMaterialId) {
          return this._pushUniqueCodeData(item, data, itemName)
        }
      }
    },
    _pushUniqueCodeData (item, data, itemName) {
      let name = itemName || 'inStockItemDetailStockContainerList'
      item[name] = item[name] || []
      // item ? item[itemName] = item[itemName] || [] : item.inStockItemDetailStockContainerList = item.inStockItemDetailStockContainerList || []
      for (let i = 0; i < data[name].length; i++) {
        let uniqueCodeArr = data[name][i]
        item[name].push({
          uniqueCode: uniqueCodeArr.uniqueCode,
          ownUniqueCodes: uniqueCodeArr.ownUniqueCodes,
          batchNum: uniqueCodeArr.batchNum,
          produceDate: uniqueCodeArr.produceDate,
          validityDate: uniqueCodeArr.validityDate,
          stockFlag: 1,
          inStockId: this.$route.params.id,
          inStockItemId: item.id,
          num: 1
        })
      }
      item.num = item[name].length
      item.totalPrice = floatTool.multiply(item.num, item.price)
    },
    _modifyData (data, list) {
      data.consumptiveMaterialObject && delete data.consumptiveMaterialObject
      data.drugObject && delete data.drugObject
      data.equipmentObject && delete data.equipmentObject
      list.item.push(data)
      this.clear = true
    },
    _resetData (data, list) {
      for (let i = 0; i < list.item.length; i++) {
        let item = list.item[i]
        if (!item.batchNum && item.localMaterialId === data.localMaterialId) {
          Object.assign(item, data)
        }
      }
      this.clear = true
    },
    _plusOrIntegerNum (data) {
      const float = /^(\+)?\d+(\.\d+)?/
      const parse = /^(\+)?\d*$/
      let dataType = data.localSettingObject ? data.localSettingObject.classifyId : ''
      if (dataType !== 303 && dataType !== 304) {
        if (!parse.test(data.num)) {
          this.data.num = ''
          return 'integer'
        }
      } else {
        if (!float.test(data.num)) {
          this.data.num = ''
          return 'plus'
        }
      }
    }
  }
}
