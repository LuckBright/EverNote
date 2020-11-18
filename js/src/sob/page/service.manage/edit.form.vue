<template>
  <div>
    <ever-bread-crumb
      v-if="isRouter"
      name="医嘱项目管理"
      :path="noHistoryPath()"
    ></ever-bread-crumb>
    <div class="layout_inner flex_col_1_auto">
      <div class="panel-body spe">
        <h4 v-if="isRouter">基本信息</h4>
        <el-row style="height:36px" v-if="!objId">
          <el-col :span="6" :offset="3">
            <el-radio class="radio" v-model="dataCreatFlag" label="0">新建</el-radio>
            <el-radio class="radio" v-model="dataCreatFlag" label="1">导入</el-radio>
          </el-col>
        </el-row>
        <div v-if="dataCreatFlag == 1">
          <el-row>
            <el-col :span="24" class="el-form-item__content">
              <el-form
                :model="queryObj"
                ref="form1"
                class="form"
                :inline="true"
                style="float: left;"
              >
                <template v-for="field in querySchema">
                  <el-form-item :label="field.label" :prop="field.name">
                    <template>
                      <sys-type
                        :code="field.code"
                        v-model="queryObj[field.name]"
                        placeholder="请选择耗材类型"
                        @input="changeType"
                      ></sys-type>
                    </template>
                  </el-form-item>
                </template>
              </el-form>
              <ever-remote-select
                v-model="queryDrugName"
                :remote-method="drugRemote"
                filterable
                remote
                @change="handleSelect"
                placeholder="请选择导入药品或器械"
                obj="true"
                ref="drugSelect"
                :showKeys="['spec', 'dosageForm', 'ratifyCode']"
                style="float: left; width: 50%; margin-top: 20px; margin-left: -20px"
              ></ever-remote-select>
            </el-col>
          </el-row>
          <div>
            <el-table :data="drugData" style="width: 100%" border>
              <el-table-column prop="id" label="id"></el-table-column>
              <el-table-column prop="name" label="药品名称"></el-table-column>
              <el-table-column prop="code" label="药品编码"></el-table-column>
              <el-table-column prop="spec" label="规格"></el-table-column>
              <el-table-column prop label="库存">
                <template slot-scope="scope">
                  <span>接口未知</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-append-filter">
              <p class="cell">
                <span class="tit">适应症及功能主治：</span>
                <span class="cnt">{{ drug.function }}</span>
              </p>
              <p class="cell">
                <span class="tit">成分：</span>
                <span class="cnt">{{ drug.element }}</span>
              </p>
              <p class="cell">
                <span class="tit">禁忌：</span>
                <span class="cnt">{{ drug.taboo }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 基本信息表单 -->
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          labelWidth="150px"
          label-position="right"
        >
          <template slot="nationTypeCode">
            <el-select
              v-model="obj.nationTypeCode"
              size="medium"
              filterable
              remote
              clearable
              :loading="loading"
              :value-key="obj.nationTypeCode"
              :disabled="belong === '2' ? true : false"
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
              placeholder="请选择病案首页分类(中医)"
              :props="{ checkStrictly: true }"
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
            labelWidth="120px"
          ></ever-form2>
        </template>
      </div>
      <div class="organization-table">
        <el-button v-if="belong === '1'" class="save-btn" type="primary" @click="submit" :disabled="disabled">保存</el-button>
      </div>
    </div>

    <div v-if="objId && !isManage" class="layout_inner spe2">
      <el-tabs class="ever_tabs_top">
        <el-tab-pane label="开单科室">
          <associate-dept
            :flag="1"
            :clinic-list="relateList"
            :belong="belong"
            :obj-detail="objDetail"
          ></associate-dept>
        </el-tab-pane>
        <el-tab-pane label="执行科室">
          <associate-dept
            :flag="2"
            :clinic-list="relateList"
            :belong="belong"
            :obj-detail="objDetail"
          ></associate-dept>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import api from '../../store/serviceeditapi'
import InsuranceDialog from '../../page/insurancedialog'
import workapi from '../../store/workingapi'
import insurapi from '../../store/insuranceapi'
import financialcontrolapi from '@/sob/store/financialcontrol'
import drug from '@/warehouse/store/drugapi'
import form from '@/util/form'
import haocai from '../service-haocai'
import associateDept from '../service-fee'
// import unitgroupitemapi from '@/warehouse/store/unitgroupitemapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import validator from '@/util/validator'
import materiaApi from '@/warehouse/store/materialapi'
import { HEALSCHEMA, getRule } from '@/sob/page/service.manage/service.schema'
import { createSchemaByItems } from '@/util/formcustom'
import { STENCIL_TYPE, MECHANISM_CODE, patch, isNull, objRemove, objFind } from '@/util/common'
import cascaderMedical from './cascader.medical.vue'

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
    let schema = JSON.parse(JSON.stringify(HEALSCHEMA))
    let schema1 = [
      {
        name: 'name',
        type: 'systype',
        code: 'THC_WH_OBJECT_TYPE',
        label: '导入药品或器械'
      }
    ]
    schema.map(item => {
      if (item.name === 'price' || item.name === 'code') {
        item.disabled = true
      }
      return item
    })
    if (this.$route.params && this.$route.params.belong === '2') {
      schema.map(item => {
        if (item.name !== 'isValid') {
          item.disabled = true
        }
        return item
      })
    }
    let obj = this.$ever.createObjFromSchema(schema)
    obj.unit = ''
    obj.serviceClassification = ''
    obj.serviceClassification1 = null
    obj.isValid = '1'
    // obj.relateOrgList1 = []
    // obj.relateOrgList = []
    RULES.price = [
      { required: true, message: '请填写价格', trigger: 'change' },
      { message: '长度在 1 到 11 个字符', trigger: 'change' },
      { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入整数或小数点后不超过两位的小数' }
    ]
    return {
      HEALTYPE: '798',
      STENCIL_TYPE,
      MECHANISM_CODE,
      isNull,
      schema: JSON.parse(JSON.stringify(schema)),
      querySchema: schema1,
      queryObj: this.$ever.createObjFromSchema(schema1),
      obj,
      api,
      workapi,
      insurapi,
      objId: this.$route.params.id,
      dataCreatFlag: '0',
      queryDrugName: {},
      queryDrug: '',
      drug: {},
      drugData: [],
      chargingItemData: [],
      orderData: [],
      chargingItemId: [],
      chargingItemForm: {
        insuranceOrgID: '',
        category: '',
        itemCode: ''
      },
      categoryOptions: [
        {
          label: '药品',
          value: 2
        },
        {
          label: '器械',
          value: 1
        }
      ],
      rules: JSON.parse(JSON.stringify(RULES)),
      isWarehouse: false,
      loading: false,
      insurs: [],
      multipleSelection: [],
      title: '',
      contentType: '',
      wuziTypeOptions: [],
      extendForm: {
        schema: [],
        obj: {},
        rules: []
      },
      templateId: '',
      objDetail: {},
      belong: this.$route.params.belong,
      doseUnitOpts: [],
      doseUnitObj: '',
      relateList: [],
      nationCodeList: [],
      isChange: true
    }
  },
  mounted () {
    // 保险列表
    this.fieldChange()
  },
  created () {
    // 判断是否在管理工作台
    this.isManage = this.$route.matched[0].meta.manage
    if (this.isManage) {
      this.belong = '1'
    } else {
      objRemove(this.schema, {name: 'isValid'})
    }
    this.$ever.getFieldFromSchema(this.schema, 'serviceClassification1').disabled = true
    sysvalue.cascade('THC_WH_OBJECT_TYPE').then(options => {
      this.wuziTypeOptions = options
      this.setWuziType()
      // this.getProvidersWithOut()
      // this.$ever.getFieldFromSchema(this.schema, 'serviceClassification1').options = options
    })
    this.fieldChange()
  },
  methods: {
    // ever-bread-crumb组件没有历史记录时调用path路径回退
    noHistoryPath () {
      let path
      if (this.$route.meta.thirdActiveIndex === '/manages/prescriptionconcise') {
        path = '/manages/prescriptionconcise'
      } else if (this.isManage) {
        path = '/manages/prescription'
      } else {
        path = (this.belong === '1' ? '/global' : '/warehouse') + '/services/' + this.belong
      }
      return path
    },
    async getProvidersWithOut () {
      let res = await api.getProvidersWithOut()
      this.$ever.getFieldFromSchema(this.schema, 'clinicAdjustAccountProvider').options = res
      this.$ever.getFieldFromSchema(this.schema, 'hospitalizedAdjustAccountProvider').options = res
    },
    async getNationTypeCodeList (params) {
      try {
        const res = await api.getNationTypeCodeList(params)
        if (res) {
          this.nationCodeList = res
        } else {
          this.nationCodeList = []
        }
      } catch (err) {
        this.nationCodeList = []
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
      _self.getNationTypeCodeList({ itemName: query })
    },
    submit () {
      this.disabled = true
      let serviceAttrList = []
      for (let item in this.extendForm.obj) {
        let data = {
          serviceId: this.objDetail.id,
          //            templateId: this.templateId,
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
      // 转换项目分类
      // this.obj.oneLevelType = this.obj.serviceClassification1[0]
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
      this.obj.serviceAttrList = serviceAttrList
      this.submitForm()
    },
    getItemById (treeArr, id, parent) {
      let p
      for (let i = 0; i < treeArr.length; i++) {
        if (treeArr[i].id === id) {
          p = parent
          return p
        }
        if (treeArr[i].children) {
          p = this.getItemById(treeArr[i].children, id, treeArr[i])
          if (p) {
            break
          }
        }
      }
      return p
    },
    afterSave (str, res) {
      if (res && res.success === 0) {
        this.disabled = false
        return false
      }
      this.$notify({
        title: '提示',
        message: `恭喜您，修改成功`,
        type: 'success'
      })
      if (this.afterSaveCallback) {
        this.afterSaveCallback()
        return
      }
      this.$router.push({
        path: this.$route.meta.thirdActiveIndex
      })
    },
    handleSelect (obj) {
      this.drugData = []
      this.obj.name = obj.name
      this.obj.displayName = obj.byname
      this.obj.price = obj.price
      this.obj.serviceType = '1'
      this.obj.spec = obj.spec
      this.obj.unit = obj.saleUnitId
      this.obj.localMaterialId = obj.localDrugSettingId || obj.localSettingId
      this.obj.servWareContentList = [{
        wareName: obj.name,
        wareType: this.contentType,
        wareId: obj.id,
        quantity: 1,
        unit: obj.unit || 1
      }]
      this.drug = obj
      this.drugData.push(obj)
    },
    _getInsuranceList () {
      this.insurapi.getById(this.objId).then(res => {
        if (res) {
          this.chargingItemData = res
        }
      })
    },
    handleSelectionChangeInsur (ids) {
      this.chargingItemId = []
      ids.forEach((item) => {
        this.chargingItemId.push(item.id)
      })
    },
    onAddInsurance () {
      this.title = '添加关联保险'
      if (this.objId) {
        this.title = '重新添加保险'
      }
      this.$refs.insurance.onDialogOpen()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    update (res) {
      if (res && res.id) {
        Object.assign(this.orderData, res)
      } else {
        this.orderData = [{}, {}]
      }
    },
    changeType (val) {
      this.contentType = val
      this._getServWareContentList(this.contentType)
    },
    _delay (delay) {
      delay = delay || 20
      setTimeout(() => {
        this.$refs.drugSelect.query('')
      }, delay)
    },
    _getServWareContentList (type) {
      // "id": 798,
      // "name": "诊疗项目",
      // "id": 294,
      // "name": "耗材",
      // "id": 296,
      // "name": "药品",
      // "id": 297,
      // "name": "体外诊断试剂",
      // "id": 298,
      // "name": "设备",
      // "id": 339,
      // "name": "房产",
      // "id": 340,
      // "name": "软件",
      switch (type) {
        case 294:
          this.drugRemote = (query) => {
            Object.assign(query, {
              offset: 0,
              pagesize: 20
            })
            return materiaApi.list(query)
          }
          this._delay()
          break
        case 296:
          this.drugRemote = (query) => {
            return drug.list(query)
          }
          this._delay()
          break
        case 238:
          this.drugRemote = this.api.getConsumptiveMaterialList
          this._delay()
          break
        case 236:
          this.drugRemote = this.api.getConsumptiveMaterialList
          this._delay()
          break
        case 3:
          this.$message.error('sssss')
          break
        default:
          this.drugRemote = (query) => {
            return drug.list({
              name: query
            })
          }
          this._delay()
          break
      }
    },
    fieldChange () {
      if (Number(this.dataCreatFlag) === 1) {
        this.isWarehouse = true
        this.queryObj.name = 296
        this.contentType = 296
        this._getServWareContentList(this.contentType)
        let i = this.schema.map(v => {
          return v.name
        }).indexOf('unit')
        this.schema.splice(i, 1)
      } else {
        this.isWarehouse = false
      }
    },
    setWuziType (val) {
      let pitem = this.getItemById(this.wuziTypeOptions, this.obj.serviceClassification)
      if (this.obj.serviceClassification) {
        if (pitem) {
          if (this.obj.threeServiceClassify) {
            this.obj.serviceClassification1 = [this.obj.serviceClassification, this.obj.threeServiceClassify]
          } else {
            this.obj.serviceClassification1 = [this.obj.serviceClassification]
          }
        } else {
          this.obj.serviceClassification1 = [this.obj.serviceClassification]
        }
        // 判断如果是诊疗项目，允许再次编辑，且只可选择诊疗项目内容
        if (pitem && pitem.id === '798') {
          let list = []
          this.wuziTypeOptions.filter(item => {
            if (item.id === '798') {
              list = item.children
            }
          })
          this.wuziTypeOptions = list
          // if (this.belong === '1') {
          //   this.$ever.getFieldFromSchema(this.schema, 'serviceClassification1').disabled = false
          // }
        }
        this.$ever.getFieldFromSchema(this.schema, 'serviceClassification1').options = this.wuziTypeOptions
      }
    },
    ...patch
  },
  components: {
    InsuranceDialog,
    haocai,
    validator,
    associateDept,
    cascaderMedical // 病案首页类型
  },
  watch: {
    dataCreatFlag (newVal) {
      this.fieldChange()
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
    'obj.serviceClassification': {
      handler: function (val) {
        if (val) {
          this.setWuziType(val)
        }
      }
    },
    'obj.isAdvices' (val) {
      if (!val) return
      let priceSchema = objFind(this.schema, {name: 'price'})
      let unitSchema = objFind(this.schema, {name: 'unit'})
      this.priceRules = {}
      priceSchema.disabled = true
      this.unitRules = this.rules.unit && this.rules.unit.length && this.rules.unit || this.unitRules
      if (val.length && val.includes(1)) {
        unitSchema.disabled = false
        this.rules.price = this.priceRules
        this.rules.unit = this.unitRules
      } else {
        // this.obj.price = ''
        this.obj.unit = ''
        unitSchema.disabled = true
        this.rules.price = []
        this.rules.unit = []
      }
      if (this.belong === '2') {
        unitSchema.disabled = true
      }
      if (val) {
        this.obj.isAdvice = true
      } else {
        this.obj.isAdvice = false
      }
    },
    'objDetail.healthServiceTemplate' (val) {
      if (val && val.id && val.schemaValue) {
        this.templateId = val.id
        let schemaObj = JSON.parse(val.schemaValue)
        let opts = {
          setValue: true,
          showItems: ['entrust', 'inremark', 'footnote', 'specimenType', 'checkGuidance', 'position', 'positionValueSet']
        }
        if (this.obj.serviceClassification === '2125') {
          opts.showItems = ['entrust', 'inremark', 'footnote', 'specimenType', 'checkGuidance']
        }
        if (this.belong === '2') {
          opts.disabled = true
        } else {
          opts.disabled = false
        }
        let extendForm = createSchemaByItems(schemaObj, opts)
        if (objFind(extendForm.schema, {name: 'specimenType'})) {
          extendForm.schema.unshift({
            name: 'specimenCount',
            label: '标本数量',
            comp: 'sys-text',
            props: {
              max: 9,
              min: 1,
              disabled: this.belong === '2' || false,
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
    'extendForm.obj.positionValueSet' (val) {
      if (val && val.setCode) {
        this.$ever.getFieldFromSchema(this.extendForm.schema, 'position').props.code = val.setCode
        if (this.isChange) {
          this.extendForm.obj.position = this.extendForm.obj.position || ''
        } else {
          this.isChange = false
        }
      }
    },
    'objDetail' (val) {
      if (!val) return
      this.$emit('serviceSuccess', val)
      if (val.price || val.price === 0) {
        this.obj.price = String(val.price)
      }
      // 处理isAdvices
      val.isAdvices = []
      if (val.isAdvice === 1) {
        val.isAdvice = '01'
      } else if (val.isAdvice === 0) {
        val.isAdvice = '00'
      } else {
        val.isAdvice = '' + val.isAdvice
      }
      let list = val.isAdvice.split('')
      list.forEach((item, index) => {
        if (item === '1') {
          val.isAdvices.push(this.$ever.getFieldFromSchema(this.schema, 'isAdvices').options[index].id)
        }
      })
      if (Number(val.outwardDeliveryFlag) === 1) {
        val.isAdvices.push(2)
      }
      this.obj.isAdvices = val.isAdvices
      // 获取国家编码
      if (val.nationTypeCode) {
        this.getNationTypeCodeList({ itemCode: val.nationTypeCode })
      }
      this.isChange = false
      if (val.finType === 'null' || !val.finType) {
        this.obj.finType = ''
      }
      // setTimeout(() => {
      //   if (val.relateOrgList && val.relateOrgList.length === this.clinicRecordList.length - 1) {
      //     this.obj.relateOrgList1 = this.clinicRecordList.filter(item => {
      //       return item.id === '-1'
      //     })
      //     val.relateOrgList.map(item => {
      //       item.id = String(item.orgId)
      //       item.name = item.orgName
      //       return item
      //     })
      //   } else {
      //     if (!this.obj.relateOrgList1.length) {
      //       val.relateOrgList.map(item => {
      //         item.id = String(item.orgId)
      //         item.name = item.orgName
      //         return item
      //       })
      //       this.obj.relateOrgList1 = val.relateOrgList
      //     }
      //     if (!val.relateOrgList) {
      //       this.obj.relateOrgList1 = []
      //     }
      //   }
      //   // 处理关联机构
      //   this.relateList = val.relateOrgList || []
      // }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  font-size: 12px;
}
.panel-body {
	/deep/ .el-form {
		.el-form-item__content {
			line-height: 37px;
		}
	}
}
.cell .tit {
  display: inline-block;
  width: 10em;
  text-align: right;
}

.organization-table {
  padding:0 13px;
  position: relative;
  .save-btn {
    position: absolute;
    right: 15px;
  }
}
</style>
