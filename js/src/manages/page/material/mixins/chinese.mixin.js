/*
  中药饮片/中药颗粒  物资处理
*/

export default {
  data () {
    return {
      price: {
        name: 'price',
        label: '销售价',
        comp: 'custom',
        span: 8
      },
      code: {
        name: 'code',
        label: '物资编码',
        comp: 'custom',
        span: 8
      },
      ceilingPrice: {
        name: 'ceilingPrice',
        label: '最高限价',
        comp: 'custom',
        span: 8
      }
    }
  },
  methods: {
    chinesePriceSetSku (params) {
      if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(this.classifyId) && params.skuDTOList.length) {
        params.skuDTOList[0].price = this.chinesePrice
        params.skuDTOList[0].ceilingPrice = this.chineseCeilingPrice
        params.skuDTOList[0].ext.price = this.chinesePrice
      }
    },
    chineseSubmitSkuDTOList (list, obj) {
      if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(this.classifyId)) {
        list.push({
          ext: {
            'SXX000048': obj['SXX000047'],
            'SXX000049': '1',
            'price': this.chinesePrice
          },
          ceilingPrice: this.chineseCeilingPrice,
          code: this.chinesCodeObj.code,
          ifService: obj.ifService,
          splitFlag: 0
        })
        obj.ceilingPrice = this.chineseCeilingPrice
        obj.price = this.chinesePrice
      }
    },
    defaultChineObjectData (data, cacheObj) {
      if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(this.classifyId)) {
        // 中药饮片/中药颗粒   剂量单位给默认值
        if (!this.objId) {
          let SXX000011Obj = data.schema.find(item => item.name === 'SXX000011')
          if (SXX000011Obj && SXX000011Obj.props.initOptions.length > 1) SXX000011Obj.props.initOptions = SXX000011Obj.props.initOptions.filter(item => item.id === '02')
          this.$set(data.obj, 'SXX000011', { id: '02', name: '制剂单位' })
          const findObj = data.schema.find(item => item.name === 'SXX000007') || {}
          this.$set(data.obj, 'SXX000007', findObj.props.initOptions[0])
          this.$set(data.obj, 'ifService', 2)
        } else {
          this.chinesePrice = this.getByIdFormData.skuDTOList[0].price || 0
          this.chineseCeilingPrice = this.getByIdFormData.skuDTOList[0].ceilingPrice || ''
          this.$set(data.obj, 'price', this.getByIdFormData.skuDTOList[0].price)
          if (!this.onlyRead && this.schemas && this.schemas[1] && this.schemas[1].schema) {
            let categoryRelations = this.schemas[1].schema.find(item => { return item.name === 'categoryMaterialRelationList' })
            categoryRelations.props.disabled = false
            if (cacheObj && typeof cacheObj['categoryMaterialRelationList'] === 'string') cacheObj['categoryMaterialRelationList'] = this.getByIdFormData.categoryMaterialRelationList
            // 中药cdss
            let cdssRuleRelation = this.schemas[1].schema.find(item => { return item.name === 'cdssRuleRelation' })
            cdssRuleRelation.props.disabled = false
          }
        }
      }
    },
    beforeSeeChineseObject (obj) {
      if (this.onlyRead && this.enumConfig.CHINESE_MEDICINE_TYPE.includes(this.classifyId)) {
        this.fetchSeeDataStr(obj)
        if (obj.cdssRuleRelation && typeof obj.cdssRuleRelation === 'object') {
          obj.cdssRuleRelation = obj.cdssRuleRelation.constantObjectPropertyName
        }
        obj.price = this.getByIdFormData.skuDTOList[0].price
        // 默认剂量 添加单位
        if (obj[this.enumConfig.DOSE]) {
          obj[this.enumConfig.DOSE] += obj['SXX000047']
        } else {
          obj[this.enumConfig.DOSE] = '-'
        }
      }
    },
    // 剂量单位 默认选择或者改变值的时候 切换对应的 schema
    updateChineZhijiId (id) {
      let aList = [...this.enumConfig.MATERIALTEMPLATE.CHINESE_OPTIONS.MEDICINEOPTIONS[id]]
      let newAlist = []
      aList.forEach((item, index) => {
        if (index === (aList.length - 1)) {
          newAlist.push(item + ':24')
        } else {
          newAlist.push(item + ':8')
        }
      })
      newAlist.splice(newAlist.length - 1, 0, this.ceilingPrice)
      // this.thisSelectWatch(id)
      this.schemas[3].schema = ['SXX000011:8', 'SXX000047:8']
      // let zhan = {name: 'spec', comp: 'custom', span: 8}
      // zhan = this.price
      this.schemas[3].slot = ['price', 'code', 'ceilingPrice']
      this.customLocalSchema = ['price', 'code', 'ceilingPrice']
      this.schemas[3].schema = this.schemas[3].schema.concat([this.price], newAlist, [this.code])
    }
  },
  watch: {
    async 'classifyId' (v) {
      if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(v)) {
        this.chinesePrice = ''
        this.chineseCeilingPrice = ''
        this.customSchema = []
        this.schemas = []
        this.isMultiColumn = this.isSimpleForm = true
        this.specTableData = []
        // 中药饮片/中药颗粒
        // 增加药理分类
        this.schemas = await this.createdFetchCategory(this.enumConfig.MATERIALTEMPLATE.CHINESE_TEMPLATE, v)
        // 右侧需要排除掉不需要展示的 schema  code
        this.filterRightKey = ['SXX000053', 'SXX000010', 'SXX000054', this.enumConfig.DOSE, 'SXZ18101300003AVj2H', 'SXX18090500001zsshk', 'SXX18090500002zsOBI']
        // 默认选择 为成分单位
        this.updateChineZhijiId('02')
      }
    }
  }
}
