<template>
  <div class="bill" :style="billStyle" :class="{
    vertical
  }">
    <div style="border-bottom: 1px solid #000;">
      <billPatient v-bind="patientMessage" isPatientNumber="off" />
    </div>
    <div class="drug">
      <div v-if="drug.localSetting || drug.localSettingObject" style="overflow: hidden;margin-bottom: 3px;position: relative;">
        <div style="float:left; width: 80%;">
          <wh-code-to-name
            :isExt="true"
            :showIcon="false"
            :cType="3"
            :patchObj="{
              list: drug[drug.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.ext,
              isInfo: false
            }"
            :showSourceValue="drug.source">
          </wh-code-to-name>
        </div>
        <div style="position: absolute;right: 0; top: 0;bottom:0;width: 20%;">
          <div style="width: 100%;height: 100%;display: table;">
            <div style="display: table-cell; vertical-align: middle; text-align: right">
              <span v-if="drugData.num">{{drugData.num}}</span>
              <span v-if="drug.localSetting" class="light-gray">{{parserJSON({data: drug.localSetting.materialSkuObject.ext})}}</span>
              <span v-if="drug.localSettingObject" class="light-gray">{{parserJSON({data: drug.localSettingObject.materialSkuObject.ext})}}</span>
            </div>
          </div>
        </div>
      </div>
      <div>用法：
        <span>
          <sys-value type="CV06.00.102" :code="drugData.employ"></sys-value>
          <sys-value type="THC_CPOE_DropRate" v-if="drugData.dropSpeed" :code="drugData.dropSpeed"></sys-value>,
          <span v-if="drugData.useFreq"><sys-value :initoptions="JSON.parse(FREQUENCY_LIST) || []" :code="drugData.useFreq"></sys-value>,</span>
        </span>
        <span>每次<span v-html="countNum"></span></span>
      </div>
      <div v-if="drug.localSetting">贮藏说明：{{parserJSON({data: drug.localSetting.materialSkuObject.ext, property: STORAGE_EXPLAIN})}}</div>
      <div v-if="drug.localSettingObject">贮藏说明：{{parserJSON({data: drug.localSettingObject.materialSkuObject.ext, property: STORAGE_EXPLAIN})}}</div>
      <div v-if="drug.localSetting">特殊告知：{{parserJSON({data: drug.localSetting.materialSkuObject.ext, property: SPECIAL_NOTIFICATION})}}</div>
      <div v-if="drug.localSettingObject">特殊告知：{{parserJSON({data: drug.localSettingObject.materialSkuObject.ext, property: SPECIAL_NOTIFICATION})}}</div>
    </div>
  </div>
</template>
<script>
import { mmConversionPx, SEARCH_CODE, SPU_SPEC_CODE, SPECIAL_NOTIFICATION, STORAGE_EXPLAIN, patch, COMPONENT_SPEC_CODE, parserJSON, SPEC_CODE, SPEC, parserComplex, ZHIJI_CODE, PACKAGE_CODE, PACKAGE_TRANSFORM_CODE } from '@/util/common'
import billPatient from './billPatient.vue'
import { bill } from './style'
import storage from '@/util/storage'
import { eachTime, getData } from '@/warehouse/page/components/print.temp/zz/util/fraction.js'
export default {
  props: ['patientMessage', 'drug', 'vertical', 'storageRoom'],
  components: {
    billPatient
  },
  data () {
    return {
      printModel: this.$ever.getClinicConfig().printModel,
      SEARCH_CODE,
      parserJSON,
      ZHIJI_CODE,
      PACKAGE_CODE,
      PACKAGE_TRANSFORM_CODE,
      parserComplex,
      SPEC,
      SPEC_CODE,
      SPU_SPEC_CODE,
      SPECIAL_NOTIFICATION,
      STORAGE_EXPLAIN,
      width: 50,
      height: 30,
      FREQUENCY_LIST: storage.getSessionStorage('FREQUENCY_LIST'),
    }
  },
  methods: {
    ...patch
  },
  computed: {
    countNum () {
      let localSettingObject = this.drugData.localSettingObject || this.drugData.localSetting
      let str = ''
      let measureUnit = this.drugData.measureUnitId
      if (localSettingObject) {
        let spec = this.parserJSON({ data: localSettingObject.materialSkuObject.ext, property: COMPONENT_SPEC_CODE })
        str = eachTime(localSettingObject, measureUnit, this.drug.measure, spec)
      }
      return str
    },
    drugData () {
      return getData(this.drug)
    },
    _width () {
      return mmConversionPx(this.width) - 20
    },
    _height () {
      return mmConversionPx(this.height) - 10
    },
    billStyle () {
      return Object.assign({
        width: this._width + 'px',
        height: this._height + 'px'
      }, bill)
    }
  },
  created () {
    if (this.vertical) {
      const width = this.width
      this.width = this.height
      this.height = width
    }
  }
}
</script>
