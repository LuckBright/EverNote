/*
  药理分类 处理
*/
const categoryRelations = {
  name: 'categoryMaterialRelationList',
  label: '药理分类',
  comp: 'whCascaderMulti',
  span: 12,
  props: {
    options: [],
    disabled: false,
    userObject: false,
    searchPlaceholder: '请输入药理分类',
    placeholder: '请输入药理分类'
  }
}
const cdssRuleRelation = {
  name: 'cdssRuleRelation',
  label: '中药CDSS',
  comp: 'ever-select',
  props: {
    options: [],
    disabled: false,
    needObjFlag: true,
    customValue: 'constantObjectPropertyName'
  },
  span: 12
}
export default {
  data () {
    return {
      categoryRelations,
      cdssRuleRelation,
      zycfOptions: [],
      options: [],
      thisArrList: []
    }
  },
  methods: {
    fetchSeeDataStr (obj) {
      let arr = []
      if (this.getByIdFormData.categoryMaterialRelationList) {
        arr = [...this.getByIdFormData.categoryMaterialRelationList]
      }
      let arrString = this.findArrString(this.getArrObjectList(arr)) || ''
      obj.categoryMaterialRelationList = arrString
    },
    findArrString (arr) {
      let strArr = []
      arr.length && arr.forEach(item => {
        strArr.push(this.enumConfig.parserJSON({ data: { list: item }, property: 'list', connect: '/' }))
      })
      return strArr.join(';')
    },
    findArrObject (obj, ids) {
      this.thisArrList.push(obj)
      obj.children && obj.children.length && obj.children.forEach(item => {
        if (ids.includes(item.id)) {
          if (item.children && item.children.length) {
            this.findArrObject(item, ids)
          } else {
            this.thisArrList.push(item)
          }
        }
      })
    },
    getArrObjectList (val) {
      let arrObject = []
      val.length && val.forEach(ids => {
        this.thisArrList = []
        this.options.forEach(item => {
          if (ids.includes(item.id)) {
            this.findArrObject(item, ids)
            arrObject.push(this.thisArrList)
          }
        })
      })
      return arrObject
    },
    async createdFetchCategory (data, classifyId) {
      if (!this.options.length) {
        this.options = await this.materialApi.categoryList().then(res => {
          return res
        })
      }
      let schema = [...data]
      // 增加中药十八反、十九畏
      if (classifyId) {
        if (!this.zycfOptions.length) {
          this.zycfOptions = await this.materialApi.searchRuleEngineConstant({constantBiztypeCode: 'warehouse', constantObjectTypeCode: 'zhongyaochengfen'}).then(res => {
            return res.map(item => Object.assign({id: item.constantObjectPropertyCode}, item))
          })
        }
        this.cdssRuleRelation.props.options = this.enumConfig.whComFn.sectionMap(this.zycfOptions, 'cdssRuleRelation')
        this.cdssRuleRelation.props.disabled = this.onlyRead
        let zycfIndex = schema[1].schema.findIndex(v => v === 'cdssRuleRelation')
        if (~zycfIndex) schema[1].schema.splice(zycfIndex, 1, this.cdssRuleRelation)
      }
      // 处理药理分类组件
      this.categoryRelations.props.options = this.enumConfig.whComFn.sectionMap(this.options, 'pharmacologyCategories')
      this.categoryRelations.props.disabled = (!!this.objId && !this.onlyRead)
      let categoryRelationsIndex = schema[1].schema.findIndex(v => v === 'categoryMaterialRelationList')
      if (~categoryRelationsIndex) schema[1].schema.splice(categoryRelationsIndex, 1, this.categoryRelations)
      return schema
    }
  }
}
