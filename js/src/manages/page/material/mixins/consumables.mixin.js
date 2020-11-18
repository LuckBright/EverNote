/*
  耗材 物资处理
*/
import * as enumConfig from '@/util/common'
const selectNumArr = [0, 1, 2, 3]
const YnoAndYes = [{
  id: 1,
  label: '否'
}, {
  id: 2,
  label: '是'
}]
const noAndYes = [{
  id: 0,
  label: '否'
}, {
  id: 1,
  label: '是'
}]
const ifService = {
  name: 'ifService',
  comp: 'select',
  label: '生成医嘱项',
  props: {
    options: YnoAndYes
  },
  style: 'width:100%',
  span: 12
}
const ifCharge = {
  name: 'ifCharge',
  comp: 'select',
  label: '生成收费项',
  props: {
    options: noAndYes
  },
  style: 'width:100%',
  span: 12
}
const ifStance = {
  name: 'ifStance',
  comp: 'custom',
  label: '',
  span: 12
}
export default {
  data () {
    return {
      enumConfig,
      ifService,
      ifCharge,
      ifStance,
      defaultcheck: true,
      swit: 0
    }
  },
  methods: {
    consumablesSubmitSkuDTOList (list, obj) {
      if (this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        this.specTableData.forEach(item => {
          list.push({
            ext: item,
            ifService: obj.ifService,
            code: item.code,
            splitFlag: 0
          })
        })
      }
    },
    defaultConsumablesObject (data, only) {
      if (this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        data.obj['isExpiryDate'] = (!this.defaultcheck && this.objId) ? this.changeObj['isExpiryDate'] : '1'
        // data.obj['isManageAlone'] = 0
        data.obj['ifCharge'] = (!this.defaultcheck && this.objId) ? this.changeObj['ifCharge'] : selectNumArr[0]
        data.obj['ifService'] = (!this.defaultcheck && this.objId) ? this.changeObj['ifService'] : selectNumArr[1]
        // 耗材
        Object.assign(data.rules, {
          isExpiryDate: {required: true, message: '效期管理不能为空', trigger: 'change'},
          // isManageAlone: {required: true, message: '唯一码管理不能为空', trigger: 'change'}
        })
        if ([this.enumConfig.CONSUMABLES_MEDICAL_TYPE, '10008'].includes(this.classifyId)) {
          Object.assign(data.rules, {
            ifService: {
              required: true,
              message: '请选择是否生成医嘱',
              trigger: 'change'
            },
            ifCharge: {
              required: true,
              message: '生成收费项',
              trigger: 'change'
            }
          })
        }
        this.defaultcheck = false
      }
    },
    ifServiceAdd (id) {
      if (id === 3) id = selectNumArr[1]
      if (typeof id === 'string') return
      let aList = [...this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.IFSERVICE[id + '']]
      let newAlist = []
      aList.forEach((item, index) => {
        if (index === (aList.length - 1)) {
          newAlist.push(item + ':24')
        } else {
          newAlist.push(item + ':12')
        }
      })
      this.schemas[2].schema = id === selectNumArr[1] ? JSON.parse(JSON.stringify([ifService, ifCharge])) : JSON.parse(JSON.stringify([ifService, ifStance]))
      this.schemas[2].schema = this.schemas[2].schema.concat(newAlist)
    },
    ifServiceCallback: enumConfig.debounce(function ({newVal, oldVal, obj}) {
      let findCode = this.schemas[2].schema.length
      if (newVal === 3) {
        obj.ifService = selectNumArr[1]
        obj.ifCharge = selectNumArr[1]
      }
      if (newVal && newVal !== oldVal && this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        if (newVal === selectNumArr[2] && (findCode < 3 || obj.ifCharge === selectNumArr[1])) {
          this.ifServiceAdd(newVal)
          obj.ifCharge = selectNumArr[0]
        } else if (newVal === selectNumArr[1] && (findCode > 3 && obj.ifCharge === selectNumArr[0])) {
          this.ifServiceAdd(newVal)
          obj.ifCharge = selectNumArr[0]
        }
      }
    }),
    ifChargeCallback: enumConfig.debounce(function ({newVal, oldVal, obj}) {
      let findCode = this.schemas[2].schema.length
      if (obj.ifService === selectNumArr[1] && this.enumConfig.CONSUMABLES_TYPE.includes(this.classifyId)) {
        if (newVal === selectNumArr[1] && findCode < 3) {
          this.ifChargeAdd(newVal)
        } else if (newVal === selectNumArr[0] && findCode > 3) {
          this.ifChargeAdd(newVal)
        }
      }
    }),
    ifChargeAdd (id) {
      if (id === 3) id = selectNumArr[1]
      if (typeof id === 'string') return
      let aList = id === selectNumArr[1] ? [...this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.IFSERVICE['2']] : []
      let newAlist = []
      aList.forEach((item, index) => {
        if (index === (aList.length - 1)) {
          newAlist.push(item + ':24')
        } else {
          newAlist.push(item + ':12')
        }
      })
      this.schemas[2].schema = [ifService, ifCharge]
      if (id === 1) this.schemas[2].schema = this.schemas[2].schema.concat(newAlist)
    }
  },
  watch: {
    'classifyId' (v) {
      if (this.enumConfig.CONSUMABLES_TYPE.includes(v)) {
        this.watchKeyCallback.push({
          key: 'ifService',
          cb: this.ifServiceCallback
        })
        this.watchKeyCallback.push({
          key: 'ifCharge',
          cb: this.ifChargeCallback
        })
        this.customSchema = []
        this.schemas = []
        this.isMultiColumn = this.isSimpleForm = true
        // 耗材
        if (this.enumConfig.CONSUMABLES_MEDICAL_TYPE === v) {
          // 医疗耗材
          this.schemas = this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE
          this.schemas[2].schema = JSON.parse(JSON.stringify([ifService, ifCharge]))
          if (this.objId && this.getByIdFormData.ext.ifService) this.ifServiceAdd(this.getByIdFormData.ext.ifService)
          if (this.objId && this.getByIdFormData.ext.ifCharge === 1) this.ifChargeAdd(this.getByIdFormData.ext.ifCharge)
        } else {
          // 其他耗材
          let schema = [...this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE2]
          schema.splice(1, 0, this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE[1])
          if (v === '10008') {
            schema.splice(2, 0, this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_TEMPLATE[2])
            schema[2].schema = JSON.parse(JSON.stringify([ifService, ifCharge]))
            this.schemas = schema
            if (this.objId && this.getByIdFormData.ext.ifService) this.ifServiceAdd(this.getByIdFormData.ext.ifService)
            if (this.objId && this.getByIdFormData.ext.ifCharge === 1) this.ifChargeAdd(this.getByIdFormData.ext.ifCharge)
          } else {
            this.schemas = schema
          }
        }
        //  增加包装单位 对应的 schema
        this.specTableData = []
        this.specTableData.push(Object.assign({code: ''}, this.enumConfig.MATERIALTEMPLATE.CONSUMABLES_OPTIONS.SPECSCHEMAARR_TWO))
        // 右侧需要排除掉不需要展示的 schema  code
        this.filterRightKey = ['SXX19030500001ATTD', 'SXX19030500002ATVbr', 'SXX191130000017Bamr', 'SXX19030700005Ba2K', 'SXX19030500003ATXmC', 'SXX19030500004AU0JZ', 'SXX19030700004BLxfN', 'SXX19030700003BLuIE']
      }
    }
  }
}
