1
import classifyapi from '@/warehouse/page/groupmaterial/store/classifyapi'
import { CLASSIFY_CLASS, PROPERTY_TYPE_FOR_TEMPLET, patch } from '@/util/common'
import { _findIndex, setUpClassifyName } from '@/util/formcustom'
import beforeRouterEnterMixins from '@/warehouse/page/storages/util/beforer.route.enter.js'
export default {
  mixins: [beforeRouterEnterMixins],
  data () {
    return {
      options1: [],
      options2: [],
      options3: [],
      CLASSIFY_CLASS,
      inUse: this.$route.query.inUse,
      tempObj: {},
      typeObj: {
        type1: '',
        type2: '',
        type3: ''
      },
      cacheObj: []
    }
  },
  created () {
    let params = {
      'parentId': '',
      'level': this.CLASSIFY_CLASS[0].id
    }
    this.classifyList(params)
  },
  methods: {
    classifyList (params) {
      // 门急诊工作站 只查询药品物资类型
      if (this.$route.path === '/workspace/druglist' && params.level === 1001) params.classifyId = '296'
      if (!params) return
      let index = 0
      params.systemType = this.systemType
      return classifyapi.list(params).then(result => {
        if (params && params.parentId) {
          let levelStr = params.level.toString()
          index = levelStr.substring(levelStr.length - 1) - 1
        }
        if (!result) result = []
        if (index === 0 && result[0] !== undefined) this.options1 = result
        if (index === 1 && result[0] !== undefined) this.options2 = result
        if (index === 2 && result[0] !== undefined) this.options3 = result
        return result
      })
    },
    templateTypeName (data) {
      return setUpClassifyName(data)
    },
    _watchCoding (val, name, type) {
      if (type === 1) this.options2 = this.options3 = []
      if (type === 2) this.options3 = []
      if (val) {
        this.classifyList({
          parentId: val,
          level: this.CLASSIFY_CLASS[type].id
        }).then(() => {
          if ((type === 1 && !this.options2[0]) || (type === 2 && !this.options3[0])) {
            this[name].classifyId = val
          }
        })
      } else {
        if (type === 2) {
          this.classifyList({
            parentId: this[name].type1,
            level: this.CLASSIFY_CLASS[type].id
          }).then(() => {
            if ((type === 1 && !this.options2[0]) || (type === 2 && !this.options3[0])) {
              this[name].classifyId = this[name].type1
            }
          })
        }
        if (type === 1) {
          this.$nextTick(() => {
            this.$bus.$emit('selectvalclear', true)
          })
        }
      }
      // if (type === 1 && !val) this[name].type2 = this[name].type3 = ''
      // if (type === 2 && !val) this[name].type3 = ''
    },
    // 物资字典单选
    _findSingle (val, key, flag, result, resultValues) {
      let singleArr = flag ? this._findPropertyType(key) : this._findPropertySkuType(key)
      let singleItemArr = []
      let singlePropertyValues = singleArr.templetPropertyValues || singleArr.templetDictPropertyValues
      if (singlePropertyValues && val) {
        for (let i = 0; i < singlePropertyValues.length; i++) {
          let singleItem = singlePropertyValues[i]
          delete singleItem.id
          if (singleItem.valueSetItemCode === val) {
            let cacheIndex = -1
            if (result) {
              // cacheIndex =
            } else {
              cacheIndex = this.cacheObj.length ? _findIndex(this.cacheObj, singleItem.valueSetItemCode, 'valueSetItemCode') : -1
            }
            if (cacheIndex > -1) {
              singleItemArr.push(this.cacheObj[cacheIndex])
            } else {
              singleItemArr.push(Object.assign(singleItem, { name: singleItem.valueSetItemName, propertyValueId: singleItem.valueSetItemCode }))
            }
          }
        }
        return singleItemArr
      }
    },
    // 物资字典多选
    _findMultiple (val, key, flag) {
      let multipleArr = flag ? this._findPropertyType(key) : this._findPropertySkuType(key)
      let multipleItemArr = []
      let multiplePropertyValues = multipleArr.templetPropertyValues || multipleArr.templetDictPropertyValues
      if (multiplePropertyValues && val) {
        for (let i = 0; i < multiplePropertyValues.length; i++) {
          let multipleItem = multiplePropertyValues[i]
          delete multipleItem.id
          let index1 = val.findIndex(item => {
            return multipleItem.valueSetItemCode === item
          })
          if (index1 > -1) {
            let cacheIndex = this.cacheObj.length ? _findIndex(this.cacheObj, multipleItem.valueSetItemCode, 'valueSetItemCode') : -1
            if (cacheIndex > -1) {
              multipleItemArr.push(this.cacheObj[cacheIndex])
            } else {
              multipleItemArr.push(Object.assign(multipleItem, { name: multipleItem.valueSetItemName, propertyValueId: multipleItem.valueSetItemCode }))
            }
          }
        }
        return multipleItemArr
      }
    },
    // 物资字典缓存数据
    _getResultPropertysList (data, flag, propertyValues) {
      let propertysList = flag ? data.materialDictPropertys || data.materialPropertys : data
      for (let i = 0; i < propertysList.length; i++) {
        let item = propertysList[i]
        if (item.materialDictPropertyValues || item.materialPropertyValues) {
          let propertysItem = item.materialDictPropertyValues || item.materialPropertyValues
          propertysItem && propertysItem.length && propertysItem.forEach(item1 => {
            this.cacheObj.push(item1)
          })
        } else {
          item[propertyValues] && item[propertyValues].length && item[propertyValues].forEach(item1 => {
            this.cacheObj.push(item1)
          })
        }
      }
    },
    _getSkuIdList (data) {
      let backData = []
      data.forEach(item => {
        backData.push(item.propertyValueId)
      })
      return backData
    },
    // 拆分必要项&非必要项
    _sttributeSplit (data, dict) {
      let classifyData = data
      let spu = []
      let unSpu = []
      let sku = []
      let unSku = []
      if (dict) {
        classifyData.templetDictPropertiesForCertainly && classifyData.templetDictPropertiesForCertainly.forEach(item => {
          if (item.type === PROPERTY_TYPE_FOR_TEMPLET[0].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            spu.push(item)
            classifyData.templetDictPropertiesForSpuCertainly = spu
          } else if (item.type === PROPERTY_TYPE_FOR_TEMPLET[1].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            sku.push(item)
            classifyData.templetDictPropertiesForSkuCertainly = sku
          }
        })
        classifyData.templetDictPropertiesForNotCertainly && classifyData.templetDictPropertiesForNotCertainly.length && classifyData.templetDictPropertiesForNotCertainly.forEach(item => {
          if (item.type === PROPERTY_TYPE_FOR_TEMPLET[0].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            unSpu.push(item)
            classifyData.templetDictPropertiesForSpuNotCertainly = unSpu
          } else if (item.type === PROPERTY_TYPE_FOR_TEMPLET[1].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            unSku.push(item)
            classifyData.templetDictPropertiesForSkuNotCertainly = unSku
          }
        })
      } else {
        classifyData.templetPropertiesForCertainly && classifyData.templetPropertiesForCertainly.forEach(item => {
          if (item.type === PROPERTY_TYPE_FOR_TEMPLET[0].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            spu.push(item)
            classifyData.templetPropertiesForSpuCertainly = spu
          } else if (item.type === PROPERTY_TYPE_FOR_TEMPLET[1].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            sku.push(item)
            classifyData.templetPropertiesForSkuCertainly = sku
          }
        })
        classifyData.templetPropertiesForNotCertainly && classifyData.templetPropertiesForNotCertainly.length && classifyData.templetPropertiesForNotCertainly.forEach(item => {
          if (item.type === PROPERTY_TYPE_FOR_TEMPLET[0].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            unSpu.push(item)
            classifyData.templetPropertiesForSpuNotCertainly = unSpu
          } else if (item.type === PROPERTY_TYPE_FOR_TEMPLET[1].id) {
            if (item.templetDictPropertyId) item.globalFlag = true
            unSku.push(item)
            classifyData.templetPropertiesForSkuNotCertainly = unSku
          }
        })
      }
      delete classifyData.templetDictPropertiesForCertainly
      delete classifyData.templetDictPropertiesForNotCertainly
      delete classifyData.templetPropertiesForCertainly
      delete classifyData.templetPropertiesForNotCertainly
      return classifyData
    },
    // 合并必要项&非必要项
    _mergeAttribute (data, spu, sku, noSpu, noSku, dict) {
      if (dict) {
        let templetDictPropertiesForCertainly = data[spu].concat(data[sku])
        let templetDictPropertiesForNotCertainly = data[noSpu].concat(data[noSku])
        Object.assign(data, {
          templetDictPropertiesForCertainly,
          templetDictPropertiesForNotCertainly
        })
      } else {
        let templetPropertiesForCertainly = data[spu].concat(data[sku])
        let templetPropertiesForNotCertainly = data[noSpu].concat(data[noSku])
        Object.assign(data, {
          templetPropertiesForCertainly,
          templetPropertiesForNotCertainly
        })
      }
      delete data[spu]
      delete data[sku]
      delete data[noSpu]
      delete data[noSku]
    },
    ...patch
  },
  watch: {
    'obj.type1' (val) {
      if (this.typeObj.type1 && this.typeObj.type1 !== val) this.obj.type2 = ''
      this.typeObj.type1 = val
      if (this.inUse === 'true') return
      this._watchCoding(val, 'obj', 1)
      // if (!val) {
      //   this.obj.classifyId = ''
      //   this.tempClassifyId = ''
      // }
      // debugger
      // console.log(this.obj.classifyId, 1)
    },
    'obj.type2' (val) {
      if (this.typeObj.type2 && this.typeObj.type2 !== val) this.obj.type3 = ''
      this.typeObj.type2 = val
      if (this.inUse === 'true') return
      this._watchCoding(val, 'obj', 2)
      // if (!val) {
      //   this.obj.classifyId = ''
      //   this.tempClassifyId = ''
      // }
      // debugger
      // console.log(this.obj.classifyId, 2)
    },
    'obj.type3' (val) {
      this.typeObj.type3 = val
      if (this.inUse === 'true') return
      this.obj.classifyId = val
      // debugger
      // console.log(this.obj.classifyId, 3)
    },
    'queryObj.type1' (val) {
      if (this.typeObj.type1 && this.typeObj.type1 !== val) this.queryObj.type2 = ''
      this.typeObj.type1 = val
      this._watchCoding(val, 'queryObj', 1)
      // bug 三级分类查询
      this.queryObj.classifyId = val
      // if (this.queryObj.name !== undefined) this.queryObj.name = ''
    },
    'queryObj.type2' (val) {
      if (this.typeObj.type2 && this.typeObj.type2 !== val) this.queryObj.type3 = ''
      this.typeObj.type2 = val
      this._watchCoding(val, 'queryObj', 2)
      let v = val
      this.queryObj.classifyId = v ? val : this.queryObj.type1
    },
    'queryObj.type3' (val) {
      let v = val
      this.queryObj.classifyId = v ? val : this.queryObj.type2
    }
  }
}
