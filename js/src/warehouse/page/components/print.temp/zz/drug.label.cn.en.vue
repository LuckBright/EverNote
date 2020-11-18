<template>
  <div>
    <div v-if="lang == 'ch'" :style="styleObj.contentleft">
      <div>
        <div :style="styleObj.contentTop">
          <span :style="styleObj.name">
            <!-- 患者信息、患者档案号、出生日期 -->
            {{patientMessage.name}} | <span v-if="patientMessage">{{patientMessage.patientNumber}} |</span> {{patientMessage.birthday | formatDateByExp('MM/DD/YYYY')}}
          </span>
        </div>
        <div :style="styleObj.contentBottom">
          <span :style="styleObj.text" style="height: 28px">
            <!-- 卓正药签名 直接取，不需要再去拼接 -->
            <span v-if="data.localSetting && parserJSON({data: data.localSetting.materialSkuObject.ext, property: ZZ_DRUG_NAME_CH})">{{parserJSON({data: data.localSetting.materialSkuObject.ext, property: ZZ_DRUG_NAME_CH})}}</span>
            <span v-if="data.localSettingObject && parserJSON({data: data.localSettingObject.materialSkuObject.ext, property: ZZ_DRUG_NAME_CH})">{{parserJSON({data: data.localSettingObject.materialSkuObject.ext, property: ZZ_DRUG_NAME_CH})}}</span>
          </span>
          <span :style="styleObj.num">
            <!-- 药品数量和单位 -->
            <span>{{drugData.num}}</span>
            <span v-if="data.localSetting" class="light-gray">{{parserJSON({data: data.localSetting.materialSkuObject.ext})}}</span>
            <span v-if="data.localSettingObject" class="light-gray">{{parserJSON({data: data.localSettingObject.materialSkuObject.ext})}}</span>
          </span>
          <!-- 用药指导|频次|每次用量 start -->
          <span :style="styleObj.text">
            <!-- 用药指导 -->
            <span v-if="drugData.localSetting && parserJSON({data: drugData.localSetting.materialSkuObject.ext, property: DRUG_GUIDANCE_CH})"><span>{{parserJSON({data: drugData.localSetting.materialSkuObject.ext, property: DRUG_GUIDANCE_CH})}}</span> | </span>
            <span v-if="drugData.localSettingObject && parserJSON({data: drugData.localSettingObject.materialSkuObject.ext, property: DRUG_GUIDANCE_CH})"><span>{{parserJSON({data: drugData.localSettingObject.materialSkuObject.ext, property: DRUG_GUIDANCE_CH})}}</span> | </span>
            <!-- 频次 -->
            <span>
              <sys-value
              :initoptions="JSON.parse(FREQUENCY_LIST) || []"
              v-if="drugData.useFreq"
              :code="drugData.useFreq"
            ></sys-value> |
            </span>
            <span v-if="drugData.useFreqTxt">{{drugData.useFreqTxt}} </span>
            <span>每次<span v-html="countNum"></span></span>
          </span>
          <!-- 用法|频次|每次用量 end -->
        </div>
      </div>
      <div style="font-size: 10px; padding-top: 5px" :style="styleObj.entrust">
        <!-- 注意事项和嘱托 -->
        <span v-if="data.localSetting">{{parserJSON({data: data.localSetting.materialSkuObject.ext, property: DRUG_WARN_CODE})}}</span>
        <span v-if="data.localSettingObject">{{parserJSON({data: data.localSettingObject.materialSkuObject.ext, property: DRUG_WARN_CODE})}}</span>
        <!-- 嘱托 -->
        <span v-if="data.entrust">{{data.entrust}}</span>
        <!-- <div>使用前请充分摇匀 （测试文案， 无数据时展示）</div> -->
      </div>
    </div>
    <div v-if="lang == 'en'" :style="styleObj.contentleft">
      <div>
        <div :style="styleObj.contentTop">
          <span :style="styleObj.name">
            {{patientMessage.name}} | <span v-if="patientMessage">{{patientMessage.patientNumber}} |</span> {{patientMessage.birthday | formatDateByExp('MM/DD/YYYY')}}
          </span>
        </div>
        <div :style="styleObj.contentBottom">
          <span :style="styleObj.text" style="height: 28px">
            <span v-if="data.localSetting">
              <wh-code-to-name
                :showIcon="false"
                :patchObj="{
                  code: ZZ_DRUG_NAME_CN,
                  list: data.localSetting.materialSkuObject.ext,
                  isInfo: false
                }"
                :showSourceValue="data.source">
              </wh-code-to-name>
            </span>
            <span v-if="data.localSettingObject">
              <wh-code-to-name
                :showIcon="false"
                :patchObj="{
                  code: ZZ_DRUG_NAME_CN,
                  list: data.localSettingObject.materialSkuObject.ext,
                  isInfo: false
                }"
                :showSourceValue="data.source">
              </wh-code-to-name>
            </span>
          </span>
          <span :style="styleObj.num">
            <span>{{drugData.num}}</span>
            <span v-if="data.localSetting" class="light-gray">{{parserJSON({data: data.localSetting.materialSkuObject.ext})}}</span>
            <span v-if="data.localSettingObject" class="light-gray">{{parserJSON({data: data.localSettingObject.materialSkuObject.ext})}}</span>
          </span>
          <span :style="styleObj.text">
            <span v-if="drugData.localSetting && parserJSON({data: drugData.localSetting.materialSkuObject.ext, property: DRUG_GUIDANCE_CN})"><span>{{parserJSON({data: drugData.localSetting.materialSkuObject.ext, property: DRUG_GUIDANCE_CN})}}</span> | </span>
            <span v-if="drugData.localSettingObject && parserJSON({data: drugData.localSettingObject.materialSkuObject.ext, property: DRUG_GUIDANCE_CN})"><span>{{parserJSON({data: drugData.localSettingObject.materialSkuObject.ext, property: DRUG_GUIDANCE_CN})}}</span> | </span>
            <span>{{drugData.useFreqTxt}} | </span>
            <span>每次<span v-html="countNum"></span></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SEARCH_CODE, SPU_SPEC_CODE, WARN_CODE, STORAGE_EXPLAIN, IDENTIFICATION_CODE, TRADE_NAME, GENERAL_CODE, PACKAGE_TRANSFORM_CODE, ZHIJI_CODE, patch, COMPONENT_SPEC_CODE, ZZ_DRUG_NAME_CH, DRUG_GUIDANCE_CH, ZZ_DRUG_NAME_CN, DRUG_GUIDANCE_CN, DRUG_WARN_CODE, parserJSON } from '@/util/common'
import { styleObj } from './styleDrugLabel/styleDrugLabel'
import storage from '@/util/storage'
import { eachTime, getData } from './util/fraction.js'
export default {
  props: ['data', 'patientMessage'],
  data () {
    return {
      SEARCH_CODE,
      SPU_SPEC_CODE,
      parserJSON,
      WARN_CODE,
      TRADE_NAME,
      ZZ_DRUG_NAME_CH,
      DRUG_GUIDANCE_CN,
      DRUG_GUIDANCE_CH,
      ZZ_DRUG_NAME_CN,
      GENERAL_CODE,
      DRUG_WARN_CODE,
      COMPONENT_SPEC_CODE,
      STORAGE_EXPLAIN,
      IDENTIFICATION_CODE,
      PACKAGE_TRANSFORM_CODE,
      ZHIJI_CODE,
      FREQUENCY_LIST: storage.getSessionStorage('FREQUENCY_LIST'),
      lang: storage.getLocalStorage('LANG') || 'ch',
      styleObj
    }
  },
  computed: {
    countNum () {
      let localSettingObject = this.drugData.localSettingObject || this.drugData.localSetting
      let measureUnitId = this.drugData.measureUnitId
      let str = ''
      if (localSettingObject) {
        let spec = this.parserJSON({ data: localSettingObject.materialSkuObject.ext, property: COMPONENT_SPEC_CODE })
        str = eachTime(localSettingObject, measureUnitId, this.data.measure, spec)
      }
      return str
    },
    drugData () {
      return getData(this.data)
    }
  },
  methods: {
    ...patch,
  }
}
</script>

<style lang="less" scoped>
  .header{
    width: 100%;
    height: 30%;

    .headerText {
      display: inline-block;
      margin-top: 10px;
    }
  }
  .content{
    height: 35%;
    border-top: 1px solid #000;
    border-bottom: 2px solid #000;

    p{
      margin: 5px;
    }
  }
  .footer{
    height: 30%;
    font-size: 14px;

    p{
      margin: 5px;
    }
  }
  .footerCn{
    height: 30%;
    font-size: 12px;

    p{
      margin: 2px;
    }
  }
</style>
