<template>
  <div class="enter_tab_toggle">
    <!-- <div style="display: none">{{value}}</div> -->
    <ever-form-model
      class="ever_form_inline ever_form_01"
      :schema="schemaObj"
      v-model="setPrescription"
      :rules="rules"
      label-position="top"
      ref="form" @change="formChange">
    <span slot="medicineSelect">
      <service-select ref="medicineSelect" v-model="value.medicineSelect" :type="drugType" :providerId="providerId" :disabled="disabled" placeholder="请选择药品" value-key="localMaterialId"></service-select>
    </span>
      <div slot="handle" class="p_handle_btn">
        <span @click="delItem(index, drugData.length)">
          <i class="iconfont icon-delete"></i>
        </span>
        <a v-if="(drugData.length - 1) === index" @click="addItem" href="#" class="ever-enter-focus"><i class="iconfont icon-tianjia"></i></a>
      </div>
      <div slot="totalCount" class="total-count" v-if="value.medicineSelect && value.medicineSelect.id">
        <span v-if="value.totalCount > 0" class="mr10">库存 {{value.totalCount}}</span>
        <span v-if="!value.inStorage" class="error-msg">该药品尚未入院，无法提交处方</span>
        <template v-else><span v-if="value.totalCount === 0 || value.enoughStock === 1" class="error-msg">库存不足</span></template>
      </div>
    </ever-form-model>
  </div>
</template>
<script>
  import api from '@/workspace/store/medicalapi'
  import form from '@/util/form'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import {objFind, isNull} from '@/util/common'
  export default {
    props: ['value', 'index', 'schema', 'drugData', 'drugType', 'disabled', 'drugObj', 'tplType', 'rules', 'providerId'],
    mixins: [form],
    data () {
      let schemaObj = JSON.parse(JSON.stringify(this.schema))
      let obj = this.createObjFromSchema(schemaObj)
      return {
        api,
        obj,
        inStorage: false,
        loading: false,
        addIndex: this.drugData.length,
        schemaObj,
        objFind,
        formObj: {},
        computeProps: {
          unit: '',
          dayFreq: null,
          unitDosage: null,
          dosage: null,
          day: null,
          discount: null,
          discountUnit: null
        }
      }
    },
    computed: {
      setPrescription () {
        if (this.value) {
          if (this.value.medicineSelect && this.value.medicineSelect.id) {
            const medicineSelect = this.value.medicineSelect
            if (this.tplType === '2') {
              this.loading = true
              this.value.drugType = this.drugType
              this.value.localMaterialId = parseInt(medicineSelect.localMaterialId)
              this.value.materialName = medicineSelect.name
              this.value.money = medicineSelect.price
              this.value.amountUnit = medicineSelect.unit
              if (!this.value.localMaterialId) {
                this.loading = false
                return false
              }
              this.getFieldFromSchema(this.schemaObj, 'amount').append = this.value.amountUnitTxt = this.value.amountUnitName = medicineSelect.unitName
            } else if (this.tplType === '3') {
              this.value.errorMsg = ''
              this.value.drugType = this.drugType
              this.value.localMaterialId = parseInt(medicineSelect.localMaterialId)
              this.value.materialName = medicineSelect.name
              this.value.money = medicineSelect.price
              this.value.totalAmountUnit = medicineSelect.unit
              this.value.spec = medicineSelect.spec
              this.getFieldFromSchema(this.schemaObj, 'totalAmount').append = this.value.totalAmountUnitTxt = medicineSelect.unitName
              this.stock(this.value.localMaterialId)
            }
          }
        }
        return this.value
      }
    },
    methods: {
      formChange (name, obj) {
        this.formObj[name] = obj
        if (this.formObj.useFreq && this.formObj.useFreq.value) {
          this.computeProps.dayFreq = Number(this.formObj.useFreq.value)
        }
      },
      addItem (event) {
        event.preventDefault()
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('addItem')
          }
        })
      },
      delItem (index, len) {
        if (index === 0 && len === 1) {
          this.$emit('resetForm')
          this.$refs.form.$refs.form.resetFields()
        } else {
          this.$emit('delItem', index)
        }
      },
      stock (id) {
        let params = {
          localMaterialId: id,
          providerId: this.providerId,
          scene: 1
        }
        api.queryServiceStock(params).then(data => {
          if (data && data.drugObject) {
            this.value.drugId = data.globalMaterialId
            this.value.globalMaterialId = data.globalMaterialId
            this.value.singleAmountUnit = data.drugObject.unit
            if (!this.value.useFreq) {
              this.value.useFreq = data.drugObject.frequency
            }
            if (!this.value.useMethod) {
              let useWay = data.drugObject.useWay ? JSON.parse(data.drugObject.useWay) : ''
              this.value.useMethod = (useWay && useWay[0]) ? useWay[0] : ''
            }
            this.value.materialChemicalName = data.drugObject.byname
            this.value.unitDosage = data.drugObject.content || 0
            this.value.discount = data.unitGroupItemObject.discount || 0
            this.value.discountUnit = data.unitGroupItemObject.discountUnit || 0
            this.computeProps.unitDosage = this.value.unitDosage
            this.computeProps.discount = this.value.discount
            this.computeProps.discountUnit = this.value.discountUnit
            this.computeProps.day = this.value.totalUseDay
            this.computeProps.dosage = this.value.singleAmount
            sysvalue.getValByCode('THC_WH_DOSE_UNIT', this.value.singleAmountUnit).then(result => {
              if (result) {
                this.computeProps.unit = result
                this.value.singleAmountUnitTxt = result
                this.getFieldFromSchema(this.schemaObj, 'singleAmount').append = result
              }
            })
          }
        })
      }
    },
    watch: {
      'value.decoctionObj' (v) {
        if (!v) { return }
        this.value.decoction = v.id
        this.value.decoctionText = v.name
      },
      'value.singleAmount' (v) {
        this.computeProps.dosage = v || 0
      },
      'value.totalAmount' (v) {
        if (!v) { return false }
        if (!/^[0-9]*[1-9][0-9]*$/.test(v)) {
          this.value.totalAmount = 0
        }
      },
      'value.totalUseDay' (v) {
        if (!v) { return false }
        if (!/^[0-9]*[1-9][0-9]*$/.test(v)) {
          this.value.totalUseDay = 0
        }
        this.computeProps.day = this.value.totalUseDay || 0
      },
      'disabled' (val) {
        this.schemaObj.forEach(rs => {
          rs.disabled = val
        })
      },
      'computeProps': {
        handler (val) {
          if (val && !isNull(val.day) && !isNull(val.dayFreq) && !isNull(val.dosage) && !isNull(val.unitDosage) && !isNull(val.discount) && !isNull(val.discountUnit)) {
            let allTotal = ((val.discountUnit * 100) * (val.unitDosage * 100)) / 10000
            let total = 1
            if (allTotal > 0) {
              total = (val.day * val.dayFreq * val.dosage) / allTotal
              total = Math.ceil(total)
            }
            if (!this.value.copy) {
              this.value.totalAmount = total
            } else {
              this.value.copy = false
            }
          } else {
            this.value.copy = false
          }
        },
        deep: true
      },
      'schema': {
        handler () {
          this.schemaObj = JSON.parse(JSON.stringify(this.schema))
        },
        deep: true
      }
    }
  }
</script>
