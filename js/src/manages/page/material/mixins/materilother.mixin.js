/*
  物资其他类型
*/
// import classify from '@/warehouse/util/classify'
export default {
  // mixins: [classify],
  data () {
    return {
      temlateData: {},
      materialDictSku: [],
      medicalOrder: 1,
      tempTableData: [],
      skuTableData: [],
      thisKeysForSku: [],
      tableData: [],
      cacheObj: [],
      // 基础价
      basePrice: '',
      noOtherMaterialCode: ['503', '504', '7778fdf0cc0b4bff8328cb7307da3c54', 'c9a969e9-1962-4bfd-a9aa-093f1c6fd362']
    }
  },
  methods: {
    materialOtherCheckSkuDTOObject (obj) {
      let check = false
      if (!this.objId) {
        if ((this.materialDictSku === undefined || this.materialDictSku.length === 0)) {
          check = true
          this.$messageTips(this, 'warning', '请先选择规格', ' ')
        }
        if (this.materialDictSku && this.materialDictSku.length) {
          this.materialDictSku.forEach(item => {
            if (!item.ifService) {
              check = true
              this.$messageTips(this, 'warning', '已选规格中有医嘱项目必填，请核对后再保存', ' ')
            }
            if (item.price === '' && !this.objId && item.ifService && item.ifService === this.enumConfig.yesno[1].id) {
              check = true
              this.$messageTips(this, 'warning', '已选规格中有基础价必填，请核对后再保存', ' ')
            }
          })
        }
      }
      return check
    },
    submitParamsMaterialOtherSku (list, obj) {
      if (this.noOtherMaterialCode.includes(this.classifyId)) {
        let newSkuList = JSON.parse(JSON.stringify(this.materialDictSku))
        if (this.objId) newSkuList = JSON.parse(JSON.stringify(this.tableData))
        if (newSkuList && newSkuList.length) {
          // 处理sku
          newSkuList.forEach(item => {
            item.ext = {}
            item.materialDictPropertys.forEach(v => {
              if (Array.isArray(v.materialDictPropertyValues)) {
                item.ext[v.propertyCode] = { id: v.materialDictPropertyValues[0].valueSetItemCode, name: v.materialDictPropertyValues[0].valueSetItemName }
              } else {
                item.ext[v.propertyCode] = v.propertyValue
              }
            })
            if (typeof item.price === 'number') item['price'] = String(item.price)
            item.ext['price'] = item.price
            item.splitFlag = 0
            delete item.keysForSku
            delete item.code
            delete item.materialDictPropertys
            if (!this.objId) {
              list.push(item)
            } else {
              list.forEach(listChild => {
                if (listChild.id === item.ext.id) {
                  for (let key in listChild.ext) {
                    listChild.ext[key] = item.ext[key]
                  }
                }
              })
            }
          })
          obj.ifService = list[0].ifService
        }
      }
    },
    createdMaterialOtherSku (temlateData, result, only) {
      if (this.noOtherMaterialCode.includes(this.classifyId)) {
        this.temlateData = result
        if (result.keysForSku && result.keysForSku.length) {
          this.skuTableData = this._tableHeaders(result.keysForSku, result.templetPropertiesForSku || result.templetDictPropertiesForSku, only)
          this.thisKeysForSku = result.keysForSku
          let tempInit = {}
          for (let i = 0; i < this.skuTableData.length; i++) {
            let item = this.skuTableData[i]
            // sku去重判断增加属性当前index,和code
            this.enumConfig.CHECK_CODE.forEach((checkItem, i) => {
              if (item.prop === checkItem.code) {
                item.checkIndex = i
                item.checkCode = checkItem.code
              }
            })
            tempInit[item.prop] = item.value
          }
          this.tempTableData = [tempInit]
        }
        if (temlateData.length > 1) {
          this.tableData = temlateData
          this.tableData.splice(0, 1)
        }
      }
    },
    defaultOtherData (data) {
      if (this.noOtherMaterialCode.includes(this.classifyId)) {
        this.materialDictSku = []
        this.tableData = []
        data.obj['isExpiryDate'] = '1'
        data.obj['isManageAlone'] = 0
        this.medicalOrder = 1
        if (this.classifyId === 'c9a969e9-1962-4bfd-a9aa-093f1c6fd362') {
          data.obj['isManageAlone'] = 1
          this.medicalOrder = 2
        } else {
          data.obj['sccc'] = ' '
          data.schema = data.schema.concat([{ name: 'sccc', parentClass: 'label-title', comp: 'readonlyitem', label: '管理方式', span: 24 }, ...this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE[1].schema])
          if (this.objId) {
            if (this.onlyRead) {
              data.schema[data.schema.length - 1].comp = 'readonlyitem'
            } else {
              data.schema[data.schema.length - 1].comp = 'select'
            }
          } else {
            data.schema[data.schema.length - 1].comp = 'select'
          }
          data.rules = Object.assign(data.rules, {
            isExpiryDate: { required: true, message: '效期管理不能为空', trigger: 'change' },
            // isManageAlone: {required: true, message: '唯一码管理不能为空', trigger: 'change'}
          })
        }
      }
    },
    beforeSeeMaterialOtherObject (obj) {
      if (this.noOtherMaterialCode.includes(this.classifyId)) {
        // 编辑
        if (this.objId) {
          // // 处理SKU
          this.getByIdFormData.skuDTOList.reverse().forEach(item => {
            this.medicalOrder = item.ifService || 1
            this.basePrice = item.price || ''
            let tempExt = JSON.parse(JSON.stringify(item.ext))
            for (let key in tempExt) {
              if (typeof tempExt[key] === 'object') tempExt[key] = tempExt[key].id
            }
            tempExt.id = item.id
            this.handleSaveSku(tempExt)
          })
        }
      }
    },
    // 选择表格数据
    handleSelectionChange (tab) {
      this.materialDictSku = tab
    },
    handleCancleSku (row) {
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格&医嘱项目
      this.medicalOrder = ''
      this.basePrice = ''
    },
    handleEdit (data, index) {
      let tempInit = {}
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      for (let i = 0; i < this.thisKeysForSku.length; i++) {
        let item = data.keysForSku && data.keysForSku[i].propertyCode ? data.keysForSku[i].propertyCode : this.thisKeysForSku[i]
        tempInit[item] = this._returnPropertyVal(item, row)
      }
      tempInit.id = data.id
      tempInit.index = index + 1
      tempInit.code = data.code
      this.skuTableData.forEach(item => {
        item['globalFlag'] = this.onlyRead
      })
      this.medicalOrder = data.ifService
      this.basePrice = data.price
      this.tempTableData = [tempInit]
    },
    handleSaveSku (data) {
      let params = {
        code: '',
        materialDictSpuId: this.objId || '',
        materialDictPropertys: [],
        keysForSku: this.thisKeysForSku
      }
      // 判断医嘱项目&基础价是否为空
      if (!this.medicalOrder) return this.$messageTips(this, 'warning', '医嘱项目必填，请核对后再保存', ' ')
      // if (!this.basePrice && this.medicalOrder === this.enumConfig.yesno[1].id) return this.$messageTips(this, 'warning', '基础价必填，请核对后再保存', ' ')
      // 遍历当前行字段「key」
      for (let keys in data) {
        for (let i = 0; i < this.skuTableData.length; i++) {
          let item = this.skuTableData[i]
          if (item.prop === keys && item.isMust && !data[keys]) {
            this.$messageTips(this, 'warning', item.label + '必填，请核对后再保存', ' ')
            return
          }
          if (data.id) item.globalFlag = true
        }
        let val = data[keys]
        let listParams = {}
        if (!val) {
          if (this._findPropertySkuType(keys).propertyType === this.enumConfig.GLOBAL_ATTR[2].id || this._findPropertySkuType(keys).propertyType === this.enumConfig.GLOBAL_ATTR[3].id) {
            listParams.materialDictPropertyValues = []
          } else {
            listParams.propertyValue = ''
          }
        } else {
          if (val.constructor !== Array) {
            if (this._findPropertySkuType(keys).propertyType === this.enumConfig.GLOBAL_ATTR[2].id) {
              listParams.materialDictPropertyValues = this._findSingle(val, keys)
            } else {
              listParams.propertyValue = val
            }
          } else {
            listParams.materialDictPropertyValues = this._findMultiple(val, keys)
          }
        }
        params.materialDictPropertys.push(Object.assign({
          propertyCode: keys,
          propertyType: this._findPropertySkuType(keys).propertyType,
          propertyRelationCode: this._findPropertySkuType(keys).propertyRelationCode,
          type: this.enumConfig.PROPERTY_TYPE_FOR_TEMPLET[1].id
        }, listParams))
      }
      // 基础价格&医嘱项目
      Object.assign(params, { ifService: this.medicalOrder, price: this.basePrice, id: data.id })
      if (this.medicalOrder === this.enumConfig.yesno[0].id) params.price = ''
      !params.materialDictSpuId && delete params.materialDictSpuId
      if (this.tempTableData[0].index) {
        this.$set(this.tableData, this.tempTableData[0].index - 1, params)
      } else {
        this.tableData.unshift(params)
        this.checkSkuListInfo()
      }
      for (let val in this.tempTableData[0]) {
        this.tempTableData[0][val] = ''
      }
      // 清空基础价格&医嘱项目
      // this.medicalOrder = ''
      this.basePrice = ''
    },
    checkSkuListInfo () {
      this.$nextTick(() => {
        this.$refs.skutablelist.toggleRowSelection(this.tableData[0], true)
      })
    },
    _returnPropertyVal (name, data) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.propertyCode === name) {
          if (item.propertyType === this.enumConfig.GLOBAL_ATTR[3].id || item.propertyType === this.enumConfig.GLOBAL_ATTR[2].id) {
            if (item.propertyType === this.enumConfig.GLOBAL_ATTR[2].id) {
              return item.materialDictPropertyValues[0].valueSetItemCode || []
            } else {
              return this._getSkuIdList(item.materialDictPropertyValues) || []
            }
          } else {
            return item.propertyValue
          }
        }
      }
      return ''
    },
    _getSkuIdList (data) {
      let backData = []
      data.forEach(item => {
        backData.push(item.valueSetItemCode)
      })
      return backData
    },
    _findPropertyType (val) {
      let obj = this.temlateData.templetPropertiesForSpu || this.temlateData.templetDictPropertiesForSpu || this.temlateData.templetProperties
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _findPropertySkuType (val) {
      let obj = this.temlateData.templetPropertiesForSku || this.temlateData.templetDictPropertiesForSku
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i]
        if (item.propertyCode === val) return item
      }
      return ''
    },
    _tableHeaders (keys, data, flag) {
      let arr = []
      for (let i = 0; i < keys.length; i++) {
        let item = keys[i]
        let { label, options, type, value, isMust, certainly, apiUrl, globalFlag } = this._findPropertValue(item, data, flag)
        arr.push({
          label,
          prop: item,
          options,
          type,
          value,
          isMust,
          certainly,
          apiUrl,
          globalFlag
        })
      }
      return arr
    },
    _findPropertValue (id, data, flag) {
      let index = data.findIndex(item => {
        return item.propertyCode === id
      })
      let label = data[index].propertyName || data[index].valueSetName || (data[index].propertyObject ? data[index].propertyObject.name : '')
      let options = []
      let isMust = data[index].isMust
      let certainly = data[index].certainly
      let propertyValues = data[index].templetPropertyValues || data[index].templetDictPropertyValues
      if (propertyValues) {
        for (let i = 0; i < propertyValues.length; i++) {
          let item = propertyValues[i]
          options.push({
            id: item.valueSetItemCode || item.valueSetItemCode,
            name: item.valueSetItemName || (item.propertyValueObject ? item.propertyValueObject.name : '未知')
          })
        }
      }
      // todo: 值集切换 propertyObject 被删除 (api、url已不存在)
      let apiUrl = data[index].propertyObject && data[index].propertyObject.valueUrl
      let type = data[index].propertyType
      let value = ''
      let globalFlag = false
      if (!flag) globalFlag = data[index].certainly === this.enumConfig.PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY[0].id
      if (type === this.enumConfig.GLOBAL_ATTR[3].id) value = []
      return { label, options, type, value, isMust, certainly, apiUrl, globalFlag }
    },
    _setColumnName (data, name) {
      let row = data.materialDictPropertys ? data.materialDictPropertys : data.materialPropertys
      let index = row.findIndex(item => {
        return item.propertyCode === name
      })
      let value = ''
      if (index > -1) {
        if ((row[index].propertyType === this.enumConfig.GLOBAL_ATTR[2].id || row[index].propertyType === this.enumConfig.GLOBAL_ATTR[3].id) && row[index].materialDictPropertyValues && row[index].materialDictPropertyValues.length) {
          let tempArr = []
          for (let i = 0; i < row[index].materialDictPropertyValues.length; i++) {
            let item = row[index].materialDictPropertyValues[i]
            tempArr.push(item.valueSetItemName || (item.propertyValueObject && item.propertyValueObject.name) || '')
          }
          row[index].propertyType === this.enumConfig.GLOBAL_ATTR[2].id ? value = tempArr.join(' ') : value = tempArr.join(',')
        } else if (row[index].propertyType === this.enumConfig.GLOBAL_ATTR[5].id) {
          value = row[index].specialName ? row[index].specialName : row[index].propertyValue ? row[index].propertyValue : '-'
        } else if (row[index].propertyType === this.enumConfig.GLOBAL_ATTR[6].id) {
          value = row[index].propertyValue ? this.enumConfig.dateFormat(row[index].propertyValue, 'YYYY-MM-DD') : ''
        } else if (row[index].propertyType === this.enumConfig.GLOBAL_ATTR[10].id) {
          if (row[index].propertyValue) {
            let cityStr = JSON.parse(row[index].propertyValue)
            value += cityStr.citysName ? `${cityStr.citysName} ${cityStr.addressDetail}` : cityStr.addressDetail
          }
        } else {
          value = row[index].propertyValue
        }
      }
      return value
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
              cacheIndex = this.cacheObj.length ? this.formCustom._findIndex(this.cacheObj, singleItem.valueSetItemCode, 'valueSetItemCode') : -1
            }
            if (cacheIndex > -1) {
              singleItemArr.push(this.cacheObj[cacheIndex])
            } else {
              singleItemArr.push(singleItem)
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
            let cacheIndex = this.cacheObj.length ? this.formCustom._findIndex(this.cacheObj, multipleItem.valueSetItemCode, 'valueSetItemCode') : -1
            if (cacheIndex > -1) {
              multipleItemArr.push(this.cacheObj[cacheIndex])
            } else {
              multipleItemArr.push(multipleItem)
            }
          }
        }
        return multipleItemArr
      }
    },
  },
  watch: {
    'classifyId' (v) {
      // 血液/医疗器械/办公设备
      if (this.noOtherMaterialCode.includes(v)) {
        this.isSimpleForm = false
        this.isMultiColumn = false
      }
    }
  }
}
