<template>
  <div class="bill" id="drugLabel" :style="{
    fontFamily: 'Microsoft YaHei',
    width: `${_width}px`,
    height: `${_height}px`,
    background: '#fff'
  }">
    <div>
      <div style="padding: 2px 0; clear: both; padding-bottom: 2px">
        <!-- <div style="float: right; padding-right: 5px;"><billBarcode :showQrCode="true" :barCode="barCode" /></div> -->
        <div>
          <div style="overflow: hidden;">
            <billPatient v-bind="patientMessage" :fontSize="true" />
          </div>
          <div v-if="type == 2" style="overflow: hidden; font-size: 10px; line-height: 12px">
            <strong style="min-width: 40px;display: inline-block; font-size: 12px; line-height: 12px">{{self.bedNum}}</strong>
            <span style="display: inline-block; line-height: 12px" v-if="self.spaceRecordObject">{{findBasesourceCode({arr: self.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</span>
          </div>
          <div style="overflow: hidden; font-size: 10px; line-height: 12px; margin-top: -2px">
            <span v-if="type == 2">预执行时间:
              <div style="display: inline-block" v-if="self.implementTime">{{self.implementTime | formatDateByExp('YYYY-MM-DD')}}</div>
              <strong style="display: inline-block; padding-left: 3px; font-size: 12px">
                <span v-if="self.termType"> {{self.implementTime | formatDateByExp('HH:mm')}}</span>
                <span v-else> 立即</span>
              </strong>
            </span>
          </div>
          <div style="overflow: hidden; font-size: 12px; margin-top: 1px">
            <span style="float: left;">用法:
              <span v-if="drugData">
                <sys-value type="CV06.00.102" :code="drugData.employ">
                </sys-value> <sys-value type="THC_CPOE_DropRate" v-if="drugData.dropSpeed" :code="drugData.dropSpeed"></sys-value>
              </span>
              <span v-else-if="self">
                <sys-value type="CV06.00.102" :code="self.employ">
                </sys-value> <sys-value type="THC_CPOE_DropRate" v-if="self.dropSpeed" :code="self.dropSpeed"></sys-value>,
              </span>
              <!-- <span v-if="drugData">{{drugData.employtxt}} <sys-value type="THC_CPOE_DropRate" v-if="drugData.dropSpeed" :code="drugData.dropSpeed"></sys-value></span>
              <span v-else-if="self">{{self.employTxt}} <sys-value type="THC_CPOE_DropRate" v-if="self.dropSpeed" :code="self.dropSpeed"></sys-value></span> -->
            </span>
          </div>
        </div>
      </div>
      <div style="font-size: 12px; border-top: 1px solid #000; float: left; width: 85%">
        <!--
          type == 1 门诊医嘱
          type == 2 住院医嘱
        -->
        <div v-if="(type == 1 && !liveType) || (type == 2 && liveType)">
          <!-- 父子医嘱 -->
          <div style=" line-height: 13px;" v-for="(item, index) in drug" :key="index">
            <span>●</span>
            <wh-code-to-name
              :showIcon="false"
              :isExt="true"
              :cType="3"
              :patchObj="{
                list: item[item.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.ext
              }"
              :showSourceValue="findShowSourceValue(index, item)">
            </wh-code-to-name>
            <!-- <span v-if="item.localSetting">({{parserJSON({data: item.localSetting.materialSkuObject.ext, property: SPEC})}})</span>
            <span v-if="item.localSettingObject">({{parserJSON({data: item.localSettingObject.materialSkuObject.ext, property: SPEC})}})</span> -->
            <!-- <span v-if="item.localSetting" style="padding-left: 5px">{{_resetMaterialName({rows: item.localSetting.materialSkuObject.materialPropertys, code: [SPU_SPEC_CODE], isInfo: false})}}</span>
            <span v-if="item.localSettingObject" style="padding-left: 5px">{{_resetMaterialName({rows: item.localSettingObject.materialSkuObject.materialPropertys, code: [SPU_SPEC_CODE], isInfo: false})}}</span> -->
            <template v-if="_processItemPatientObject == 1">
              <span v-if="item.num"  style="padding-left: 5px">×{{item.num}}{{parserJSON({data: item.localSettingObject.materialSkuObject.ext})}}</span>
            </template>
            <template v-else>
              <span v-if="item.measure">(用量：<span v-html="countNum(item)"></span>)</span>
            </template>
          </div>
        </div>
        <!-- liveType  住院医嘱 -->
        <div v-if="type == 2 && !liveType">
          <!-- 非父子医嘱 -->
          <template>
            <div v-for="(item, index) in drug" :key="index" style="position: relative;overflow: hidden;">
              <div v-if="item.localSettingObject" style="float: left; width: 85%; line-height: 12px;">
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :cType="3"
                  :patchObj="{
                    list: item.localSettingObject.materialSkuObject.ext
                  }"
                  :showSourceValue="item.source">
                </wh-code-to-name>
                <span>
                  <!-- {{parserJSON({data: item.localSettingObject.materialSkuObject.ext, property: SPEC})}} -->
                  <!-- * -->
                  <!-- {{_resetMaterialName({rows: item.localSettingObject.materialSkuObject.materialPropertys, code: [SPU_SPEC_CODE], isInfo: false})}} -->
                </span>
                <!-- <strong v-if="item.measure">(剂量：<span v-html="countNum(item)"></span>)</strong> -->
              </div>
              <div style="position: absolute;width: 15%;top: 0;bottom: 0;right:0;text-align: right;">
                <div style="width: 100%; height: 100%;display: table;">
                  <div style="display:table-cell;vertical-align: middle;">{{item.num}}
                    {{parserJSON({data: item.localSettingObject.materialSkuObject.ext})}}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mmConversionPx,
  SEARCH_CODE,
  SPU_SPEC_CODE,
  SPEC, SPACE_CODE,
  patch,
  parserJSON,
  COMPONENT_SPEC_CODE,
  objGet} from '@/util/common'
import billPatient from './billPatient.vue'
import billBarcode from './billBarcode.vue'
import { eachTime } from '@/warehouse/page/components/print.temp/zz/util/fraction.js'
export default {
  props: ['patientMessage', 'barCode', 'drug', 'type', 'liveType', 'self'],
  components: {
    billPatient,
    billBarcode
  },
  data () {
    return {
      SEARCH_CODE,
      SPACE_CODE,
      parserJSON,
      SPU_SPEC_CODE,
      COMPONENT_SPEC_CODE,
      SPEC,
      width: 70,
      height: 60
    }
  },
  computed: {
    // 父子医嘱配置项（1所有，2，每次）
    _processItemPatientObject () {
      return objGet(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject.processItemPatientObject.value', '')
    },
    _width () {
      return mmConversionPx(this.width) - 10
    },
    _height () {
      return mmConversionPx(this.height)
    },
    drugData () {
      if (this.drug.length) {
        if (this.drug[0].outpatientDispenseItem) {
          return objGet(this.drug[0], 'outpatientDispenseItem', {})
        } else {
          return this.drug[0]
        }
      } else return {}
    }
  },
  methods: {
    countNum (item) {
      let localSettingObject = item.localSettingObject || item.outpatientDispenseItem.localSettingObject || item.localSetting
      let measureUnit = item.outpatientDispenseItem ? item.outpatientDispenseItem.measureUnitId : item.measureUnitId
      let str = ''
      if (localSettingObject) {
        let spec = this.parserJSON({ data: localSettingObject.materialSkuObject.ext, property: COMPONENT_SPEC_CODE })
        str = eachTime(localSettingObject, measureUnit, item.measure, spec)
      }
      return str
    },
    findShowSourceValue (index, item) {
      if (index === 0) {
        return item.source ? item.source : '1'
      } else {
        return '1'
      }
    },
    ...patch
  }
}
</script>
