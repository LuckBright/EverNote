<template>
  <div class="prescription_wrap">
    <ever-form2 class="ever_form_spe label_bold" ref="tplForm" :schema="schema" v-model="obj" :rules="rules" labelWidth="80px">
      <template slot="dptId">
        <el-radio-group v-model="obj.dptId">
          <template v-if="dptData && dptData.length" v-for="item,index in dptData">
            <el-radio :label="item.id">{{item.name}}</el-radio>
          </template>
        </el-radio-group>
      </template>
      <template slot="content">
      </template>
      <template slot="default"></template>
    </ever-form2>
    <div class="prescribe_box spe">
      <div class="prescribe_item">
        <el-form class="ever_form_spe" v-if="tplType === '2'">
          <span class="require_star">*</span>
          <el-form-item style="display: inline-block">
            <el-radio-group v-model="drugType" :disabled="disabled">
              <el-radio :label="303">中药饮片</el-radio>
              <el-radio :label="304">中药颗粒</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="prescribe_form_box">
          <el-row class="prescribe_form_head">
            <template v-if="tplType === '2'">
              <el-col v-for="item,index in CHINESE.schema" :key="index" :span="item.span"><em class="require_star" v-if="!item.norequire">*</em>{{item.hname}}</el-col>
            </template>
            <template v-else-if="tplType === '3'">
              <el-col v-for="item,index in WESTERN.schema" :key="index" :span="item.span"><em class="require_star" v-if="!item.norequire">*</em>{{item.hname}}</el-col>
            </template>
          </el-row>
          <div class="prescribe_form">
            <template v-for="(sitem, index) in drugData">
              <medicine-form v-ever-bind-enter :key="index" ref="drugform" v-model="drugData[index]" :schema="drugSchema" :obj="schemaObj" :index="index" :drug-data="drugData" :drug-obj="drugObj" :drug-type="drugType" :tpl-type="tplType" :rules="formRules" :disabled="disabled" @addItem="addItem" @delItem="delItem" @resetForm="resetForm" :providerId="obj.dptId"></medicine-form>
            </template>
          </div>
          <div class="prescribe_form_footer" v-if="tplType === '2'">
            <ever-form-model
              :schema="drugObjSchema"
              v-model="drugObj"
              label-width="50px"
              :rules="chirules"
              label-position="right"
              ref="drugObjForm"
              v-ever-bind-enter>
            </ever-form-model>
          </div>
        </div>
        <div class="prescribe_form_handle mt20">
          <el-button type="primary" @click="submitForm">保存</el-button><el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/sob/store/casecontentapi'
  import apidept from '@/sob/store/casecontentdeptapi'
  import department from '@/sob/store/departmentstaffapi'
  import form from '@/util/form'
  import storage from '@/util/storage'
  import medicineForm from './medicine.form'
  import {formCheckPositiveInt} from '@/util/validate'
  export default {
    data () {
      let schema = [
        {
          name: 'dptId',
          label: '所属科室',
          comp: 'custom'
        },
        {
          name: 'name',
          label: '模版名称',
          span: 6,
          props: {
            placeholder: '请输入模版名称',
            maxlength: 20
          }
        },
        {
          name: 'content',
          label: '处方内容',
          comp: 'custom'
        }
      ]
      let CHINESE = {
        init: {
          medicineSelect: '',
          amount: '',
          decoctionObj: '',
          totalCount: '',
          totalMoney: 0
        },
        schema: [
          {
            type: 'custom',
            name: 'medicineSelect',
            placeholder: '选择药品',
            className: 'clear-mb',
            hname: '药品名',
            loading: false,
            span: 12
          },
          {
            type: 'number',
            name: 'amount',
            placeholder: '填写剂量',
            hname: '剂量',
            append: '克',
            step: 0.1,
            min: 0.1,
            span: 5
          },
          {
            code: 'THC_SYS_DECOCTINGMETHOD',
            name: 'decoctionObj',
            type: 'systype',
            placeholder: '选择煎法',
            hname: '煎法',
            norequire: true,
            useObject: true,
            cache: true,
            span: 5
          },
          {
            type: 'custom',
            name: 'handle',
            hname: '操作',
            norequire: true,
            span: 2
          }
        ],
        objSchema: [
          {
            type: 'checkbox',
            label: '代煎',
            name: 'decoct',
            options: [{id: 1, name: ''}],
            span: 2
          },
          {
            code: 'CV06.00.102',
            type: 'systype',
            placeholder: '用法',
            label: '用法',
            name: 'useMethodObj',
            useObject: true,
            cache: true,
            span: 4
          },
          {
            code: 'CV06.00.228',
            type: 'systype',
            placeholder: '用药频次',
            label: '频次',
            name: 'useFreqObj',
            useObject: true,
            cache: true,
            span: 4
          },
          {
            label: '剂数',
            type: 'inputnumber',
            name: 'totalAmount',
            min: 1,
            max: 999,
            placeholder: '填写剂数',
            span: 5
          },
          {
            code: 'THC_SYS_PRESCRIPTION_SOURCE',
            type: 'systype',
            label: '渠道',
            useValue: true,
            clearable: true,
            name: 'source',
            span: 4
          },
          {
            label: '备注',
            name: 'comment',
            placeholder: '填写备注',
            span: 5,
            max: 200
          }
        ],
        rules: {
          medicineSelect: [
            {required: true, message: '必填项', trigger: 'change', type: 'object'}
          ],
          amount: [
            {required: true, message: '必填项，大于 0.1', trigger: 'change', type: 'number', min: 0.1}
          ]
        }
      }
      let WESTERN = {
        init: {
          comment: '',
          errorMsg: '',
          localMaterialId: '',
          materialName: '',
          medicineSelect: '',
          singleAmount: '',
          source: 1,
          spec: '',
          totalAmount: '',
          totalCount: '',
          totalUseDay: '',
          useFreq: '',
          useMethod: '',
          groupId: ''
        },
        schema: [
          {
            type: 'custom',
            name: 'medicineSelect',
            placeholder: '选择药品',
            className: 'clear-mb',
            hname: '药品名',
            loading: false,
            span: 4
          },
          {
            code: 'CV06.00.102',
            type: 'systype',
            placeholder: '用法',
            hname: '用法',
            filterable: true,
            name: 'useMethod',
            cache: true,
            span: 3,
            refValue: 'noRequire'
          },
          {
            type: 'number',
            name: 'singleAmount',
            placeholder: '剂量',
            hname: '剂量',
            span: 3,
            append: '片',
            step: 0.001
          },
          {
            code: 'CV06.00.228',
            type: 'systype',
            placeholder: '用药频次',
            hname: '用药频次',
            filterable: true,
            name: 'useFreq',
            cache: true,
            span: 3,
            refValue: 'noRequire'
          },
          {
            name: 'totalUseDay',
            type: 'number',
            placeholder: '天数',
            hname: '天数',
            span: 3,
            append: '天',
            step: 1
          },
          {
            name: 'totalAmount',
            placeholder: '数量',
            hname: '数量',
            span: 3,
            append: '盒',
            type: 'number',
            step: 1
          },
          {
            name: 'comment',
            placeholder: '填写备注',
            hname: '备注',
            norequire: true,
            span: 3,
            max: 50
          },
          {
            type: 'custom',
            name: 'handle',
            hname: '操作',
            norequire: true,
            span: 1
          }
        ],
        rules: {
          medicineSelect: [
            { required: true, message: '必填项', trigger: 'change', type: 'object' }
          ],
          totalAmount: [
            { required: true, message: '必填项，大于1的整数', trigger: 'change', type: 'number', min: 1 }
          ],
          singleAmount: [
            { required: true, message: '必填项，大于0.001', trigger: 'change', type: 'number', min: 0.001 }
          ],
          useMethod: [
            { required: true, message: '必填项', trigger: 'change', type: 'number' }
          ],
          useFreq: [
            { required: true, message: '必填项', trigger: 'change', type: 'number' }
          ],
          totalUseDay: [
            { required: true, message: '必填项，大于1的整数', trigger: 'change', type: 'number', min: 1 }
          ]
        }
      }
      let obj = this.$ever.createObjFromSchema(schema)
      let drugObj = {}
      if (this.tplType === '2') {
        drugObj = this.createObjFromSchema(JSON.parse(JSON.stringify(CHINESE.objSchema)))
        drugObj.source = 1
      }
      return {
        obj,
        schema,
        CHINESE,
        WESTERN,
        schemaObj: null,
        drugData: [JSON.parse(JSON.stringify(CHINESE.init))],
        drugObj,
        drugType: 303,
        subBtnDisabled: true,
        dptData: null,
        tplData: null,
        rules: {
          dptId: [{required: true, message: '必填项', trigger: 'change', type: 'number'}],
          name: [{required: true, message: '必填项', trigger: 'change'}],
          content: [{required: true, message: ' '}]
        },
        chirules: {
          useMethodObj: [
            {required: true, message: '必填项', trigger: 'change', type: 'object'}
          ],
          useFreqObj: [
            {required: true, message: '必填项', trigger: 'change', type: 'object'}
          ],
          totalAmount: [
            {required: true, validator: formCheckPositiveInt, trigger: 'change'}
          ]
        },
        disabled: false
      }
    },
    props: ['tplType', 'belongType', 'pageType', 'dataId', 'pPath', 'userId'],
    mixins: [form],
    components: {
      medicineForm
    },
    beforeDestroy () {
      let skey = `TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`
      storage.removeLocalStorage(skey)
      if (this.dataId && Number(this.dataId) > 0) {
        skey = `TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}_${this.dataId}`
        storage.removeLocalStorage(skey)
      }
    },
    computed: {
      drugObjSchema () {
        if (this.tplType === '2') {
          return JSON.parse(JSON.stringify(this.CHINESE.objSchema))
        }
      },
      drugSchema () {
        let drugObj = storage.getLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`)
        drugObj = drugObj ? JSON.parse(drugObj) : ''
        let schema = JSON.parse(JSON.stringify(this.CHINESE.schema))
        if (this.tplType === '2') {
          schema = JSON.parse(JSON.stringify(this.CHINESE.schema))
        } else if (this.tplType === '3') {
          schema = JSON.parse(JSON.stringify(this.WESTERN.schema))
        }
        if (drugObj.dptId) this.obj.dptId = drugObj.dptId
        if (drugObj.dptId) this.obj.name = drugObj.name
        return schema
      },
      formRules () {
        if (this.tplType === '2') {
          return JSON.parse(JSON.stringify(this.CHINESE.rules))
        } else if (this.tplType === '3') {
          return JSON.parse(JSON.stringify(this.WESTERN.rules))
        }
      },
      api () {
        return this.belongType === '1' ? api : apidept
      }
    },
    async created () {
      this.changeDrugType(this.tplType)
      if (this.dataId && Number(this.dataId) > 0) {
        let res = await this.api.getById(this.dataId)
        if (res && res.data) {
          this.initDrugData(res.data)
        }
      } else {
        if (this.$route.params.tpl) {
          this.initDrugData(this.$route.params.tpl)
        } else {
          await this.getDepts()
        }
      }
    },
    methods: {
      async getDepts () {
        this.dptData = []
        const res = await department.getDepts(this.userId)
        if (res && res.data && res.data.length) {
          res.data.forEach(item => {
            this.dptData.push({id: item.provider.id, name: item.provider.name})
          })
          if (!this.obj.dptId) {
            this.obj.dptId = this.dptData[0].id
          }
        }
      },
      initDrugData (data) {
        let obj = JSON.parse(data.content)
        this.dptData = [
          {id: data.dptId, name: data.dptName}
        ]
        if (this.tplType === '2') {
          this.drugType = obj.drugType
        }
        this.obj.dptId = data.dptId
        this.obj.name = data.name
        if (this.dataId && Number(this.dataId) > 0) {
          storage.setLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}_${this.dataId}`, JSON.stringify(obj))
        } else {
          storage.setLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`, JSON.stringify(obj))
        }
        this.formatDrugData(JSON.parse(JSON.stringify(obj.recipeItems)))
      },
      setDrugObj () {
        if (this.userId) {
          this.$nextTick(_ => {
            let drugObj = storage.getLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`)
            this.cloneDrugData(JSON.parse(drugObj))
          })
        }
      },
      getDrugInit () {
        if (this.tplType === '2') {
          return JSON.parse(JSON.stringify(this.CHINESE.init))
        } else if (this.tplType === '3') {
          return JSON.parse(JSON.stringify(this.WESTERN.init))
        }
      },
      addItem () {
        let newItem = this.getDrugInit()
        this.drugData.push(newItem)
        this.$nextTick(_ => {
          this.subBtnDisabled = true
          this.$refs.drugform[this.$refs.drugform.length - 1].$el.querySelectorAll('.el-input__inner')[0].focus()
        })
      },
      delItem (index) {
        this.drugData.splice(index, 1)
        this.formatDrugData()
      },
      resetForm () {
        let newItem = this.getDrugInit()
        this.formatDrugData([newItem])
        this.$refs.drugform[0].$refs.form.$refs.form.resetFields()
      },
      cloneDrugData (data) {
        if (data) {
          let nitem = JSON.parse(JSON.stringify(data))
          nitem.id && delete nitem.id
          if (this.tplType === '2') {
            nitem.useFreqObj = {
              id: nitem.useFreq,
              name: nitem.useFreqName
            }
            nitem.useMethodObj = {
              id: nitem.useMethod,
              name: nitem.useMethodName
            }
          }
          this.drugObj = nitem
          this.$refs.drugform[0].$refs.form.$refs.form.resetFields()
          this.formatDrugData(nitem.recipeItems)
        }
      },
      formatDrugData (data) {
        const _self = this
        data = data || _self.drugData
        if (data.length) {
          data.map(item => {
            if (this.tplType === '2') {
              if (item.localMaterialId) {
                item.medicineSelect = {
                  id: item.localMaterialId,
                  name: item.materialName,
                  localMaterialId: item.localMaterialId,
                  unit: item.amountUnit,
                  unitName: item.amountUnitName || item.amountUnitTxt,
                  price: Number(item.money)
                }
              } else {
                item.medicineSelect = ''
              }
              if (item.decoction) {
                item.decoctionObj = {
                  id: item.decoction,
                  name: item.decoctionText
                }
              } else {
                item.decoctionObj = ''
              }
              item.drugType = item.drugType || Number(this.drugType || 303)
            } else if (this.tplType === '3') {
              if (item.localMaterialId) {
                item.medicineSelect = {
                  id: item.localMaterialId,
                  name: item.materialName,
                  price: item.money,
                  unit: item.totalAmountUnit,
                  localMaterialId: item.localMaterialId,
                  unitName: item.totalAmountUnitTxt,
                  spec: item.spec,
                  unitDosage: item.unitDosage,
                  discount: item.discount,
                  discountUnit: item.discountUnit
                }
              } else {
                item.medicineSelect = ''
              }
            }
            return item
          })
          _self.drugData = JSON.parse(JSON.stringify(data))
        }
      },
      changeDrugType (val) {
        if (val === '2') {
          this.drugType = 303
        } else if (val === '3') {
          this.drugType = [301, 302]
        }
      },
      checkFormValid () {
        const _self = this
        let isValid = true
        _self.$refs.drugform.forEach(item => {
          item.$refs.form.$refs.form.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (this.tplType === '2') {
          _self.$refs.drugObjForm.$refs.form.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        }
        return isValid
      },
      submitForm () {
        const _self = this
        let skey = `TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`
        if (this.dataId && Number(this.dataId) > 0) {
          skey = `TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}_${this.dataId}`
          this.obj.id = this.dataId
        }
        let isValid = true
        isValid = this.checkFormValid()
        if (isValid) {
          this.obj.content = JSON.stringify(this.drugObj)
          this.obj.type = Number(this.tplType)
//          if (this.tplType === '2') this.obj.chiRecipeType = (this.drugType === 303) ? 1 : 2
          _self.$refs.tplForm.$refs.form.validate((v) => {
            if (v) {
              return this.api.createOrUpdate(this.obj).then(_ => {
                storage.removeLocalStorage(skey)
                this.cancel()
              })
            }
          })
        }
      },
      cancel () {
        this.$router.replace(this.pPath)
      }
    },
    watch: {
      'tplType' (val) {
        this.changeDrugType(val)
      },
      'drugType' (val, oval) {
        if (this.tplType === '2') {
          if (this.drugObj.recipeItems.length && this.drugObj.recipeItems[0].drugType !== val && this.drugObj.recipeItems[0].medicineSelect) {
            this.$notify({message: '无法同时包含颗粒和饮片类型药品，需求清空已经保存的药品', type: 'error'})
            this.drugType = oval
          }
        }
        this.drugObj.drugType = this.drugType
      },
      'drugData': {
        handler (val) {
          if (val.length) {
            let arr = []
            val.map((v, index) => {
              if (arr.indexOf(v.localMaterialId) > -1) {
                this.$notify({message: '相同的药品已经添加', type: 'warn'})
                v.medicineSelect = ''
                let newItem = this.getDrugInit()
                val[index] = newItem
                this.$refs.drugform[index].$refs.form.$refs.form.resetFields()
                console.log('---1---')
                this.formatDrugData()
                this.$refs.drugform[index].$refs.form.$el.getElementsByTagName('input')[0].focus()
                return
              } else {
                arr.push(v.localMaterialId)
              }
            })
            let drugObj = storage.getLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`)
            if (this.dataId && Number(this.dataId) > 0) {
              drugObj = storage.getLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}_${this.dataId}`)
            }
            drugObj = drugObj ? JSON.parse(drugObj) : {}
            drugObj.recipeItems = val
            this.drugObj.drugType = this.drugType
            this.drugObj = Object.assign({}, this.drugObj, drugObj)
          }
        },
        deep: true
      },
      'drugObj': {
        handler (val) {
          if (this.userId) {
            if (val && val.recipeItems && val.recipeItems.length) {
              let data = Object.assign({}, val, this.obj)
              storage.setLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`, JSON.stringify(data))
            } else {
              storage.removeLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`)
            }
          }
        },
        deep: true
      },
      'obj': {
        handler () {
          let data = Object.assign({}, this.drugObj, this.obj)
          storage.setLocalStorage(`TEMPLATE_${this.userId}_${this.tplType}_${this.belongType}`, JSON.stringify(data))
        },
        deep: true
      }
    }
  }
</script>
