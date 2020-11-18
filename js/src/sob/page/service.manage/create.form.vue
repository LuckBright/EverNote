<template>
  <div>
    <ever-bread-crumb name="医嘱项目管理" :path="path" v-if="isRouter"></ever-bread-crumb>
    <div class="layout_inner flex_col_1_auto">
      <div class="panel-body spe">
        <h4 v-if="isRouter">基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
          labelWidth="150px"
        >
          <template slot="nationTypeCode">
            <el-select
              v-model="obj.nationTypeCode"
              size="medium"
              filterable
              remote
              clearable
              :loading="loading"
              style="width:100%"
              :remote-method="suggest"
              placeholder="请选择国家编码"
              popper-class="service_select"
              @clear="clear"
              ref="select"
              @focus="selectFocus"
            >
              <el-option
                v-for="item in nationCodeList"
                :value="item.itemCode"
                :label="item.itemName"
                :key="item.itemCode"
              ></el-option>
            </el-select>
          </template>
          <template slot="medicalRecordClassify">
            <cascader-medical
              v-model="obj.medicalRecordClassify"
              size="medium"
              filterable
              remote
              clearable
              style="width:100%"
              placeholder="请选择病案首页分类"
              :props="{ checkStrictly: true }"
              code="THC_CPOE_ZYBASYFYLX"
              :disabled="true"
              @focus="selectFocus"
            ></cascader-medical>
          </template>
          <template slot="medicalRecordClassifyZy">
            <cascader-medical
              v-model="obj.medicalRecordClassifyZy"
              size="medium"
              filterable
              remote
              clearable
              style="width:100%"
              :props="{ checkStrictly: true }"
              placeholder="请选择病案首页分类(中医)"
              code="THC_CPOE_ZYBASYFYLX_ZY"
              :disabled="true"
              @focus="selectFocus"
            ></cascader-medical>
          </template>
        </ever-form-model>
        <template v-if="extendForm && extendForm.schema && extendForm.schema.length">
          <h4 class="mt20">扩展信息</h4>
          <ever-form2
            :schema="extendForm.schema"
            v-model="extendForm.obj"
            label-position="right"
            :nosubmit="true"
            labelWidth="80px"
          ></ever-form2>
        </template>
      </div>
      <div class="panel-footer">
        <div>
          <el-button
            style="margin-left: 140px; !important"
            type="primary"
            :loading="btnLoading"
            @click="submit"
          >保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../store/serviceeditapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import form from '@/util/form'
import financialcontrolapi from '@/sob/store/financialcontrol'
import localsettingapi from '@/warehouse/store/localdrugsettingapi'
import { createSchemaByItems } from '@/util/formcustom'
import { setDisabled, unDisabled, patch, isNull, objFind } from '@/util/common'
import { HEALSCHEMA, DRUGSCHEMA, DRUGSCHEMAREMOTE, MATERIALSCHEMAREMOTE, getRule } from './service.schema'
import cascaderMedical from './cascader.medical.vue'
import { cloneDeep } from 'lodash'
import { getPriceDecimal, config } from '@/manages/components/price.manage/price.config.js'

let RULES = getRule()
export default {
  mixins: [form],
  props: {
    isRouter: {
      type: Boolean,
      default: true
    },
    afterSaveCallback: Function
  },
  data () {
    const HEALTYPE = '798'
    const DRUGTYPE = '296'
    const MATERIALTYPE = '294'
    const UNITTYPE = '293'
    let schema = []
    let querySchema = []
    let obj = {}
    let queryObj = {}
    obj.serviceClassification = ''
    obj.serviceClassification1 = null
    obj.isValid = '1'
    // obj.serviceBelongType = 1
    obj.isAdvices = [0]
    obj.nationTypeCode = ''
    // obj.relateOrgList1 = []
    // obj.relateOrgList = []
    RULES.price = [
      { required: true, message: '请填写价格', trigger: 'blur' },
      // { message: '长度在 1 到 11 个字符', trigger: 'blur' },
      { validator: this.checkPrice.bind(this), trigger: 'blur' }
    ]
    return {
      HEALTYPE,
      DRUGTYPE,
      MATERIALTYPE,
      UNITTYPE,
      RULES,
      isNull,
      querySchema,
      queryObj,
      loading: false,
      queryDrugName: {},
      drug: {},
      drugData: [],
      activeName: HEALTYPE,
      schema,
      api,
      obj,
      wuziTypeOptions: [],
      activeOpts: [HEALTYPE],
      rules: cloneDeep(RULES),
      extendForm: {
        schema: [],
        obj: {},
        rules: []
      },
      templateId: '',
      subDisable: false,
      nationCodeList: [],
      zhenliaoThird: [],
      path: '',
      btnLoading: false
    }
  },
  created () {
    if (this.$route.meta.thirdActiveIndex === '/manages/prescriptionconcise') {
      this.path = '/manages/prescriptionconcise'
    } else if (this.$route.meta.thirdActiveIndex === '/manages/prescription') {
      this.path = '/manages/prescription'
    } else {
      this.path = '/group/services/1'
    }
    // 判断是否在管理工作台
    this.isManage = this.$route.matched[0].meta.manage
    sysvalue.cascade('THC_WH_OBJECT_TYPE').then(options => {
      this.wuziTypeOptions = options
      this._info()
      // this.getProvidersWithOut()
    })
    // 获取价格精度配置
    getPriceDecimal()
  },
  methods: {
    // 检查价格的精度
    checkPrice (rule, value, callback) {
      let priceDecimal = config.priceDecimal || 0
      let reg = new RegExp(`^([1-9]\\d*|0)(\\.\\d{0,${priceDecimal || 0}})?$`)
      if (!reg.test(value)) {
        if (!priceDecimal) {
          callback(new Error(`请输入整数`))
        } else {
          callback(new Error(`请输入整数或小数点后不超过${priceDecimal}位的小数`))
        }
      } else {
        callback()
      }
    },
    submit () {
      this.btnLoading = true
      let serviceAttrList = []
      for (let item in this.extendForm.obj) {
        let data = {
          // templateId: this.templateId,
          fieldCode: item
        }
        if (this.extendForm.obj[item] && this.extendForm.obj[item] instanceof Object) {
          data.defValue = this.extendForm.obj[item].id
          data.defNameValue = this.extendForm.obj[item].setName
        } else {
          data.defValue = this.extendForm.obj[item]
        }
        if (this.extendForm.obj[`${item}ValueSet`]) {
          data.valueSetJson = JSON.stringify(this.extendForm.obj[`${item}ValueSet`])
          data.valueSetCode = this.extendForm.obj[`${item}ValueSet`].setCode
        }
        serviceAttrList.push(data)
      }
      this.obj.serviceAttrList = serviceAttrList
      // 转换项目分类
      this.obj.oneLevelType = '798'
      this.obj.serviceClassification = this.obj.serviceClassification1[0]
      this.obj.threeServiceClassify = this.obj.serviceClassification1[1]
      // 转换isAdvice值
      const n = this.$ever.getFieldFromSchema(this.schema, 'isAdvices').options.length - 1
      let list = (new Array(n)).fill(0)
      let outFlag = false
      this.obj.isAdvices.forEach((item) => {
        if (item < 2) {
          list[item] = '1'
        } else {
          outFlag = true
        }
      })
      this.obj.isAdvice = list.join('')
      this.obj.outwardDeliveryFlag = outFlag ? 1 : 0
      this.submitForm().then((res) => {
        if (res.head.errCode === 0) {
          if (!this.isRouter) {
            this.$emit('success', res.data)
          } else {
            this.$notify({
              title: '提示',
              message: `恭喜您，创建成功`,
              duration: 1000,
              type: 'success',
              onClose: () => {
                if (this.afterSaveCallback) {
                  this.afterSaveCallback()
                  return
                }
                this.$router.push({
                  path: this.$route.meta.thirdActiveIndex
                })
              }
            })
          }
        }
        this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
    },
    async getNationTypeCodeList (val) {
      try {
        const res = await api.getNationTypeCodeList({ itemName: val })
        if (res) {
          this.nationCodeList = res
        } else {
          this.nationCodeList = []
        }
      } catch (err) {
        this.nationCodeList = []
        console.log(err)
      }
    },
    selectFocus () {
      this.obj.nationTypeCode = ''
    },
    clear () {
      this.obj.nationTypeCode = ''
    },
    suggest (query) {
      const _self = this
      if (isNull(query)) {
        _self.options = []
        return
      }
      _self.getNationTypeCodeList(query)
    },
    async getServiceItems (val) {
      if (val && !['300', '301', '302', '303', '304', '800', '801', '802', '867', '1124', '2125', '798', '799', '10003', '3002', '3001'].includes(val)) {
        val = '867'
      }
      const res = await api.getServiceItems({ serviceClassification: val })
      if (res && res.schemaValue) {
        this.templateId = res.id
        let schemaObj = JSON.parse(res.schemaValue)
        let opts = {
          setValue: true,
          showItems: ['entrust', 'inremark', 'footnote', 'specimenType', 'checkGuidance', 'position', 'positionValueSet']
        }
        if (val === '2125') {
          opts.showItems = ['entrust', 'inremark', 'footnote', 'specimenType', 'checkGuidance']
        }
        opts.disabled = false
        let extendForm = createSchemaByItems(schemaObj, opts)
        if (objFind(extendForm.schema, {name: 'specimenType'})) {
          extendForm.schema.unshift({
            name: 'specimenCount',
            label: '标本数量',
            comp: 'sys-text',
            props: {
              max: 9,
              min: 1,
              disabled: false,
              type: 'number',
              field: {
                max: 9,
                min: 1,
                limitInteger: true
              }
            },
            span: 6
          })
          extendForm.obj.specimenCount = this.obj.specimenCount || 1
        }
        extendForm.schema.forEach(val => {
          val.props.clearable = true
        })
        this.extendForm = extendForm
      }
    },
    handleSelect (obj) {
      this.drugData = []
      this.obj.name = obj.drugObject ? obj.drugObject.name : obj.consumptiveMaterialObject.name
      this.obj.displayName = obj.drugObject ? obj.drugObject.byname : obj.consumptiveMaterialObject.byname
      this.obj.price = obj.price
      this.obj.serviceType = '1'
      this.obj.spec = obj.drugObject ? obj.drugObject.spec : obj.consumptiveMaterialObject.spec
      let index = obj.item.findIndex(item => {
        return item.unitType === this.UNITTYPE
      })
      // this.obj.unit = obj.item[index].unitGroupItemObject.id
      if (obj.item[index].unitGroupItemObject && obj.item[index].unitGroupItemObject.name) {
        this.obj.unit = obj.item[index].unitGroupItemObject.name
      }
      this.obj.localMaterialId = obj.id
      if (obj.drugObject) {
        this.obj.serviceClassification1 = [this.DRUGTYPE, obj.drugObject.drugType]
      } else if (obj.consumptiveMaterialObject) {
        this.obj.serviceClassification1 = [this.MATERIALTYPE, obj.consumptiveMaterialObject.consumptiveType]
      }
      this.obj.serviceClassification = obj.drugObject ? obj.drugObject.drugType : obj.consumptiveMaterialObject.consumptiveType
      this.obj.servWareContentList = [{
        wareName: obj.drugObject ? obj.drugObject.name : obj.consumptiveMaterialObject.namee,
        wareType: this.contentType,
        wareId: obj.drugObject ? obj.drugObject.id : obj.consumptiveMaterialObject.id,
        quantity: 1,
        unit: obj.drugObject ? obj.drugObject.name : obj.consumptiveMaterialObject ? obj.consumptiveMaterialObject.name : 1
      }]
      this.drug = obj
      this.$ever.getFieldFromSchema(this.schema, 'unit').options = obj.unitGroupItemList
      this.drugData.push(obj)
    },
    checkValidPoint (rule, value, callback) {
      var reg = /^([1-9]\d*|0)(\.\d{1,2})?$/
      if (!value.match(reg)) {
        callback(new Error('请输入整数或小数点后不超过两位的小数'))
      } else {
        callback()
      }
    },
    submitForm () {
      return new Promise((resolve, reject) => {
        if (this.$refs.selfvalidate) {
          let comps = this.$refs.selfvalidate
          if (!Array.isArray(comps)) {
            comps = [comps]
          }
          for (let i = 0; i < comps.length; i++) {
            if (typeof comps[i].validate === 'function') {
              comps[i].validate(valid => {
                if (!valid) {
                  return reject('validate false')
                }
              })
            }
          }
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.api.createOrUpdate(this.obj, this.isWarehouse).then(result => {
              // if (result.head.errCode === 0) {
              //   this.afterSave('objsaved', result)
              // }
              resolve(result)
            }).catch(_ => {
              this.disabled = false
              reject('save error')
            })
          } else {
            this.disabled = false
            setTimeout(() => {
              var isError = document.getElementsByClassName('is-error')
              if (isError.length) {
                isError[0].querySelector('input').focus()
              }
            }, 1)
            reject('validate error')
          }
        })
      })
    },
    _tabQueryList (query) {
      return localsettingapi.getlist(query)
    },
    handleClick (tab, event) {
      if (tab.name === this.activeOpts[0]) return
      this.activeOpts.push(tab.name)
      this.$confirm('切换会清空您已经填写的资料，是否确认切换?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activeOpts.shift()
        this.drugData = []
        this.queryObj = {}
        this.drug = {}
        this.drugRemote = (query) => {
          if (!query) {
            query = { name: '不支持默认数据列表查询' }
          }
          query = Object.assign({}, query, { materialType: Number(tab.name) })
          return this._tabQueryList(query)
        }
        this._info()
      }).catch(() => {
        this.activeOpts.pop()
        this.activeName = this.activeOpts[0]
        return false
      })
    },
    // 查询药品或耗材列表
    _getContentList (type) {
      this.drugRemote = (query) => {
        return localsettingapi.getlist({ name: query, materialType: this.activeName })
      }
      this._delay()
    },
    // 过滤物资分类
    _setSchemaParmas (type, str) {
      this.obj.serviceClassification1 = []
      this.typeOpts = []
      this.wuziTypeOptions.forEach((item) => {
        if (item.id === String(type)) {
          this.typeOpts = item.children
        }
      })
      let typeOptsArr = []
      this.typeOpts.forEach((item) => {
        if (item.name !== '协定方') {
          typeOptsArr.push(item)
        }
      })
      this.$ever.getFieldFromSchema(this.schema, str).options = typeOptsArr
    },
    _info () {
      var arr = ['unit']
      var arr2 = ['localMaterialId']
      this.schema = []
      if (this.activeName === this.HEALTYPE) {
        this.schema = HEALSCHEMA
        this._setSchemaParmas(this.HEALTYPE, 'serviceClassification1')
        unDisabled(arr, this.schema)
        // this.rules = RULES
      } else if (this.activeName === this.DRUGTYPE) {
        this.schema = DRUGSCHEMA
        this.querySchema = DRUGSCHEMAREMOTE
        this._setSchemaParmas(this.DRUGTYPE, 'serviceClassification1')
        setDisabled(arr, this.schema)
        setDisabled(arr2, this.schema)
        this.rules = RULES
      } else if (this.activeName === this.MATERIALTYPE) {
        this.schema = DRUGSCHEMA
        this.querySchema = MATERIALSCHEMAREMOTE
        this._setSchemaParmas(this.MATERIALTYPE, 'serviceClassification1')
        setDisabled(arr, this.schema)
        setDisabled(arr2, this.schema)
        // this.rules = RULES
      }
      this.obj = Object.assign({}, this.$ever.createObjFromSchema(this.schema), this.obj)
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.queryObj.name = ''
    },
    ...patch
  },
  watch: {
    'obj.serviceClassification1' (val) {
      if (val && val.length) {
        if (val[val.length - 1] === '2124' || val[val.length - 1] === '832' || val[val.length - 1] === '2467') {
          this.obj.isAdvices = [this.obj.isAdvices[0]]
        } else {
          this.obj.isAdvices.push(1)
        }
        this.getServiceItems(val[0])
      }
    },
    'obj.finType' (val) {
      if (val && val.length) {
        financialcontrolapi.getByFinType({finType: val}).then(res => {
          this.obj.clinicReceiptType = res.clinicReceiptType
          this.obj.hospitalizedReceiptType = res.hospitalizedReceiptType
          this.obj.medicalRecordClassify = res.medicalRecordClassify
          this.obj.medicalRecordClassifyZy = res.medicalRecordClassifyZy
        })
      }
    },
    '$route.params.belong' (val) {
      this.belong = val
    },
    'extendForm.obj.positionValueSet' (val) {
      if (val && val.setCode) {
        this.extendForm.obj.position = ''
        this.$ever.getFieldFromSchema(this.extendForm.schema, 'position').props.code = val.setCode
      }
    },
    'obj.isAdvices' (val) {
      if (!val) return
      let priceSchema = objFind(this.schema, {name: 'price'})
      let unitSchema = objFind(this.schema, {name: 'unit'})
      this.priceRules = this.rules.price.length && this.rules.price || this.priceRules
      this.unitRules = this.rules.unit && this.rules.unit.length && this.rules.unit || this.unitRules
      if (val.length && val.includes(1)) {
        priceSchema.disabled = false
        unitSchema.disabled = false
        this.rules.price = this.priceRules
        this.rules.unit = this.unitRules
      } else {
        this.obj.price = ''
        this.obj.unit = ''
        priceSchema.disabled = true
        unitSchema.disabled = true
        this.rules.price = []
        this.rules.unit = []
      }
    },
  },
  components: {
    cascaderMedical // 病案首页类型
  }
}
</script>

<style lang="scss" scoped>
.cell {
  font-size: 12px;
}
.cell .tit {
  display: inline-block;
  width: 10em;
  text-align: right;
}
.panel-body {
  /deep/ .organization {
    height: calc(100vh - 400px);
  }
	/deep/ .el-form {
		.el-form-item__content {
			line-height: 37px;
		}
	}
}
</style>
