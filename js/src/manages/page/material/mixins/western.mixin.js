/*
  物资西药处理 mixins
*/
import * as enumConfig from '@/util/common'

export default {
  data () {
    return {
      enumConfig,
      slotName: '',
      isCreate: true,
      gMing: [{
        name: 'SXX19061000001BmIMC',
        label: '药物过敏源一级',
        comp: 'sys-type',
        span: 24,
        props: {
          options: [],
          code: 'THC_SYS_DRUG_ALLERGEN_PRIMARY',
          multiple: true,
          useObject: true,
          objSimple: true,
          disabled: !!this.objId && this.onlyRead,
          placeholder: '请输入药物过敏源一级'
        }
      }, {
        name: 'SXX19061000002BmaAT',
        label: '药物过敏源二级',
        comp: 'sys-type',
        span: 24,
        props: {
          options: [],
          code: 'THC_SYS_DRUG_ALLERGEN_SECONDARY',
          multiple: true,
          useObject: true,
          objSimple: true,
          disabled: !!this.objId && this.onlyRead,
          placeholder: '请输入药物过敏源二级'
        }
      }]
    }
  },
  methods: {
    westSubmitSkuDTOList (list, obj) {
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
        this.specTableData.forEach((item, index) => {
          list.push({
            ext: item,
            code: item.code,
            ifService: obj.ifService,
            splitFlag: index === 0 ? 0 : 1
          })
          if (obj['SXX000047'] && obj['SXX000047'].id !== item['SXX000048'].id && this.specTableData.length < 2 && this.isSplitFlat && this.specTableData[0]['SXX000049'] > 1) {
            list.push({
              ext: {
                'SXX000048': obj['SXX000047'],
                'SXX000049': '1',
                'SXX000050': '',
                'price': (this.specTableData[0]['SXX000049'] && this.specTableData[0].price) ? (Number(this.specTableData[0].price / Number(this.specTableData[0]['SXX000049']))).toFixed(this.digitCapacity) : '',
                'ceilingPrice': ''
              },
              code: item.code,
              ifService: obj.ifService,
              splitFlag: 1
            })
          }
        })
      }
    },
    beforeSeeWestObject (obj) {
      //  药理分类 查看数据回显
      // 默认剂量 添加单位
      if (this.objId && this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
        if (this.onlyRead) {
          this.fetchSeeDataStr(obj)
          if (obj[this.enumConfig.DOSE]) {
            switch (obj.ext['SXX000011'].id) {
              case '03':
                obj[this.enumConfig.DOSE] += obj['SXX000054']
                break
              case '01':
                obj[this.enumConfig.DOSE] += obj['SXX000053']
                break
              case '02':
                obj[this.enumConfig.DOSE] += obj['SXX000047']
                break
            }
          } else {
            obj[this.enumConfig.DOSE] = '-'
          }
        }
      }
    },
    defaultWestObjectData (data, cacheObj) {
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
        // 西药/中成药  剂量单位给默认值
        if (!this.objId) {
          this.$set(data.obj, 'SXX000011', { id: '01', name: '成分单位' })
          this.$set(data.obj, 'ifService', 2)
          // 医嘱图例说明数据 //
          this.legend = enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEIMGS[data.obj['SXX000011'].id]
        } else {
          if (!this.onlyRead && this.schemas[1] && this.schemas[1].schema) {
            let categoryRelations = this.schemas[1].schema.find(item => { return item.name === 'categoryMaterialRelationList' })
            categoryRelations.props.disabled = false
            if (cacheObj && typeof cacheObj['categoryMaterialRelationList'] === 'string') cacheObj['categoryMaterialRelationList'] = this.getByIdFormData.categoryMaterialRelationList
          }
        }
      }
    },
    watchListFn (filterCode, thisCode) {
      let newWatchkey = []
      this.watchKeyCallback.forEach(item => {
        if (!filterCode.includes(item.key)) {
          newWatchkey.push(item)
        }
        if (item.key === thisCode) item.cb = this.SXX00005354CallBack
      })
      this.watchKeyCallback = newWatchkey
    },
    thisSelectWatch (id) {
      switch (id) {
        case '03':
          this.watchListFn(['SXX000053'], 'SXX000054')
          break
        case '01':
          this.watchListFn(['SXX000054'], 'SXX000053')
          break
        case '02':
          this.watchListFn(['SXX000053', 'SXX000054'])
          break
      }
    },
    // 剂量单位 默认选择或者改变值的时候 切换对应的 schema
    updateZhijiId ({ id, code53, code54, isCreate }) {
      let isWatch = false
      if (id === '03' && !code54) {
        isWatch = true
      } else if (id === '01' && !code53) {
        isWatch = true
      } else if (id === '02' && (code54 || code53)) {
        isWatch = true
      }
      if (isCreate) isWatch = true
      if (isWatch) {
        // 医嘱图例说明数据
        this.legend = this.enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEIMGS[id]
        let aList = [...this.enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.MEDICINEOPTIONS[id]]
        let newAlist = []
        aList.forEach((item, index) => {
          if (index === (aList.length - 1)) {
            newAlist.push(item + ':24')
          } else {
            newAlist.push(item + ':8')
          }
        })
        // this.thisSelectWatch(id)
        this.schemas[3].schema = ['SXX000011:8']
        let pictureDescribe = [{ name: 'pictureDescribe', comp: 'custom', span: 16 }]
        this.schemas[3].schema = this.schemas[3].schema.concat(pictureDescribe, newAlist)
        if (!isCreate) {
          this.changeObj['SXX19030700003BLuIE'] = ''
          this.changeObj['SXX19030700004BLxfN'] = ''
          this.changeObj['SXX19011500001zpMoy'] = ''
          this.changeObj['SXX000017'] = ''
          this.changeObj['SXX000016'] = ''
        }
      }
    },
    //  选择 制剂单位/成分单位/成药单位   更新默认剂量后面的单位
    SXX000047CallBack: enumConfig.debounce(function ({ newVal, oldVal, obj }) {
      if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        let splitFlagData = this.specTableData.find(item => { return item.splitFlag !== 1 })
        // 处理 西药/中成药 修改制剂单位需要特殊处理
        if (this.objId && !this.onlyRead && oldVal && this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId) && this.specTableData.length > 1 && newVal.id === splitFlagData['SXX000048'].id) {
          obj['SXX000047'] = oldVal
          return this.$messageTips(this, 'warning', '填写规格有重复，请核对后在修改')
        }
        this.bozhuang = obj['SXX000047']
        if (obj['SXX000011'].id === '02' && obj['SXX000047'].id === newVal.id) this.specSelect(newVal, obj, 'SXX000047')
      }
    }),
    //  选择 制剂单位/成分单位/成药单位   更新默认剂量后面的单位
    SXX00005354CallBack: enumConfig.debounce(function ({ newVal, oldVal, obj }) {
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
        if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal) && obj['SXX000011'].id !== '02') {
          if (obj['SXX000011'].id === '01' && obj['SXX000053'].id === newVal.id) this.specSelect(newVal, obj)
          if (obj['SXX000011'].id === '03' && obj['SXX000054'].id === newVal.id) this.specSelect(newVal, obj)
        }
      }
    }),
    //  剂量单位 切换 更新对应的 schema
    SXX000011CallBack: enumConfig.debounce(function ({ newVal, oldVal, obj }) {
      if (!this.schemas[3]) return
      let findCode = this.schemas[3].schema.find(item => { return item === 'SXX000053:8' })
      let findCode2 = this.schemas[3].schema.find(item => { return item === 'SXX000054:8' })
      if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.updateZhijiId({ id: newVal.id, code53: findCode, code54: findCode2 })
        if (newVal.id === '03') {
          this.specSelect(obj['SXX000054'], obj)
        } else if (newVal.id === '01') {
          this.specSelect(obj['SXX000053'], obj)
        } else if (newVal.id === '02') {
          this.specSelect(obj['SXX000047'], obj, 'SXX000047')
        }
      }
    }),
    specSelect (newVal, obj, code) {
      const curSchema = this.templateObject.schema.find(item => {
        return item.name === this.enumConfig.DOSE
      })
      if (!newVal.name && (obj['SXX000053'].id || obj['SXX000054'].id || obj['SXX000047'].id)) this.slotName = obj['SXX000053'].name || obj['SXX000054'].name || obj['SXX000047'].name
      if ((!newVal.name && !this.isCreate) || this.slotName === newVal.name) return false
      if (curSchema && (!code || (code === 'SXX000047' && obj['SXX000011'].id === '02'))) {
        curSchema.slots = [{
          name: 'append',
          template: `<span>${newVal.name || this.slotName || ''}</span>`
        }]
        curSchema.span = 8
        this.slotName = newVal.name || this.slotName
      }
      const index = this.schemas[3].schema.findIndex(item => {
        let code = item.name ? this.enumConfig.DOSE : this.enumConfig.DOSE + ':8'
        return (item.name || item) === code
      })
      if (!code || (code === 'SXX000047' && obj['SXX000011'].id === '02')) {
        this.schemas[3].schema.splice(index, 1, curSchema)
      }
      if (this.isCreate) this.isCreate = false
    }
  },
  watch: {
    async 'classifyId' (v) {
      // 选择为 西药/中成药 更改schemas对应的操作
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(v)) {
        this.customSchema = []
        this.schemas = []
        this.isMultiColumn = this.isSimpleForm = true
        // 西药/中成药
        let thisSchemas = [...this.enumConfig.MATERIALTEMPLATE.WEST_TEMPLATE]
        // 右侧 增加 药物过敏源
        this.customSchema = JSON.parse(JSON.stringify(this.gMing))
        // 增加药理分类
        this.schemas = await this.createdFetchCategory(thisSchemas)
        // 默认选择 单位
        this.updateZhijiId({ id: this.objId ? this.getByIdFormData.ext['SXX000011'].id : '01', isCreate: true })
        // 右侧需要排除掉不需要展示的 schema  code
        this.filterRightKey = ['SXX000053', 'SXX000010', 'SXX000054', 'SXZ18101300003AVj2H', 'SXX18090500001zsshk', 'SXX18090500002zsOBI']
        // 西药/中成药      增加包装单位 对应的 schema
        this.specTableData = []
        this.bozhuang = ''
        this.specTableData.push(Object.assign({code: ''}, this.enumConfig.MATERIALTEMPLATE.WEST_OPTIONS.SPECSCHEMAARR))
      }
    },
    specTableData: {
      handler: enumConfig.debounce(function (v) {
        if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
          v.forEach((item, index) => {
            if (!this.objId && this.bozhuang.id && item['SXX000048'].id && item['SXX000048'].id === this.bozhuang.id && index === 0) {
              if (item['SXX000049'] !== '1') {
                this.$messageTips(this, 'warning', '制剂单位和包装单位相同时，包装转换比只能为1')
                item['SXX000049'] = '1'
              }
            }
            if (!this.objId && index === 0 && item['SXX000048'].id && this.bozhuang.id) {
              if (item['SXX000048'].id !== this.bozhuang.id && v.length < 2 && this.isSplitFlat && this.specTableData[0]['SXX000049'] > 1) {
                this.specTableData.push({
                  'SXX000048': this.bozhuang,
                  'SXX000049': '1',
                  'SXX000050': '',
                  'price': (this.specTableData[0]['SXX000049'] && this.specTableData[0].price) ? (Number(this.specTableData[0].price / Number(this.specTableData[0]['SXX000049']))).toFixed(this.digitCapacity) : '',
                  'ceilingPrice': '',
                  'code': ''
                })
              }
              if ((item['SXX000048'].id === this.bozhuang.id || this.specTableData[0]['SXX000049'] < 1.0001) && v.length === 2) {
                this.isSplitFlat = false
                this.specTableData.pop()
              }
            }
          })
        }
      }),
      deep: true
    },
    'isSplitFlat' (v) {
      if (v) {
        if (this.specTableData[0]['SXX000048'].id !== this.bozhuang.id && this.specTableData.length < 2 && this.isSplitFlat && this.specTableData[0]['SXX000049'] > 1) {
          this.specTableData.push({
            'SXX000048': this.bozhuang,
            'SXX000049': '1',
            'SXX000050': '',
            'price': (this.specTableData[0]['SXX000049'] && this.specTableData[0].price) ? (Number(this.specTableData[0].price / Number(this.specTableData[0]['SXX000049']))).toFixed(this.digitCapacity) : '',
            'ceilingPrice': '',
            'code': ''
          })
        }
      } else {
        if (this.specTableData.length === 2) {
          this.specTableData.pop()
        }
      }
    },
    'bozhuang' (v) {
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(this.classifyId)) {
        if (!this.objId && this.specTableData[0]['SXX000048'].id && v.id && this.specTableData[0]['SXX000048'].id === v.id) {
          this.specTableData[0]['SXX000049'] = '1'
          this.$messageTips(this, 'warning', '制剂单位和包装单位相同时，包装转换比只能为1')
        }
        if (!this.objId && this.specTableData[0]['SXX000048'].id && v.id) {
          if (this.specTableData[0]['SXX000048'].id !== v.id && this.specTableData.length < 2 && this.isSplitFlat && this.specTableData[0]['SXX000049'] > 1) {
            this.specTableData.push({
              'SXX000048': this.bozhuang,
              'SXX000049': '1',
              'SXX000050': '',
              'price': (this.specTableData[0]['SXX000049'] && this.specTableData[0].price) ? (Number(this.specTableData[0].price / Number(this.specTableData[0]['SXX000049']))).toFixed(this.digitCapacity) : '',
              'ceilingPrice': '',
              'code': ''
            })
          }
          if (this.specTableData[0]['SXX000048'].id === this.bozhuang.id && this.specTableData.length === 2) {
            this.isSplitFlat = false
            this.specTableData.pop()
          }
        }
        if (this.objId && this.specTableData.length > 1 && this.haveManage && !this.onlyRead) {
          let findIndex = this.changeObj.skuDTOList ? this.changeObj.skuDTOList.findIndex(item => {
            return item.splitFlag === 1
          }) : -1
          if (findIndex > -1) this.specTableData[findIndex]['SXX000048'] = v
        }
        if (this.objId && this.specTableData.length === 1 && this.haveManage && !this.onlyRead) {
          this.specTableData[0]['SXX000048'] = v
        }
        if (this.specTableData.length > 1) {
          this.specTableData[1]['SXX000048'] = v
        }
      }
    }
  }
}
