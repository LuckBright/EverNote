<template>
  <div :style="billStyle">
    <div :style="style.header">
      <div :style="style.h1">{{title}}</div>
      <billBarcode :style="style.billBarcode" :barCode="barCode" />
      <billPatient :style="style.billPatient" v-bind="patientMessage"/>
    </div>
    <div :style="style.ul">
      <div :style="index === list.length - 1 ? Object.assign({}, style.li, style.liLast) : style.li" v-for="(item, index) in list" :key="index">
        <div :style="style.liDiv" style="width: 85%;">
          <!-- 药品名称 -->
          <wh-code-to-name
            :isExt="true"
            :showIcon="false"
            :patchObj="{
              code: SEARCH_CODE,
              classifyId: item[item.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.classifyId,
              list: item[item.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.ext,
              isInfo: false
            }"
            :showSourceValue="item.source">
          </wh-code-to-name>
          <!-- 父子医嘱标签 -->
          <!-- mainFlag: 1  父医嘱 2子医嘱  mainFlag： 2 并且 lastMain：1 整条父子医嘱的结束 -->
          <div v-if="itemData(item).mainGroupId" :style="style.isMine">
            <span v-if="itemData(item).mainFlag == 1">┏</span>
            <span style="top: 5px" v-if="itemData(item).mainFlag == 2 && itemData(item).lastMain == 1">┗</span>
            <span v-if="itemData(item).mainFlag == 2 && itemData(item).lastMain !== 1">┣</span>
          </div>
        </div>
        <!-- 规格 * 物资spu包装规格 -->
        <div :style="style.liDiv">
          <div :style="style.liDivLeft">
            <span v-if="item.localSetting">
              {{parserJSON({data: item.localSetting.materialSkuObject.ext, property: SPEC})}}
              *
            </span>
            <span v-if="item.localSettingObject">
              {{parserJSON({data: item.localSettingObject.materialSkuObject.ext, property: SPEC})}}
              *
            </span>
            <wh-code-to-name
              :isExt="true"
              :showIcon="false"
              :patchObj="{
                code: SPU_SPEC_CODE,
                classifyId: item[item.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.classifyId,
                list: item[item.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.ext,
                isInfo: false
              }">
            </wh-code-to-name>
          </div>
          <!-- 数量 + 单位 -->
          <div :style="style.liDivRight" style="text-align: right">
            <span v-if="itemData(item).num">{{itemData(item).num}}</span>
            <span v-if="item.localSetting" class="light-gray">{{parserJSON({data: item.localSetting.materialSkuObject.ext})}}</span>
            <span v-if="item.localSettingObject" class="light-gray">{{parserJSON({data: item.localSettingObject.materialSkuObject.ext})}}</span>
          </div>
        </div>
        <!-- 货位 -->
        <div style="width: 85%" :style="style.liDiv">货位：
          <span v-if="item.freightObject && item.freightObject.code">{{item.freightObject.code}}</span>
        </div>
      </div>
    </div>
    <!-- 占位符 -->
    <div style="border-top: 1px solid #000; margin-top: 10px; text-align: right; padding-top: 50px">.</div>
  </div>
</template>

<script>
import { mmConversionPx, SEARCH_CODE, SPU_SPEC_CODE, SPEC, patch, parserJSON, parserComplex, objGet } from '@/util/common'
import billPatient from './billPatient.vue'
import billBarcode from './billBarcode.vue'
import { bill, ul } from './style'
import { box, header, h1, billBarcode as styleBillBarCode, billPatient as styleBillPatient, li, liDiv, liDivLeft, liDivRight, liLast, isMine } from './stylePrescriptionList'
export default {
  props: ['patientMessage', 'barCode', 'list'],
  components: {
    billPatient,
    billBarcode
  },
  data () {
    return {
      SEARCH_CODE,
      SPEC,
      SPU_SPEC_CODE,
      parserJSON,
      parserComplex,
      width: 70,
      title: '备药单',
      newList: [],
      style: {
        bill,
        box,
        header,
        h1,
        ul,
        li,
        liLast,
        liDiv,
        liDivLeft,
        liDivRight,
        isMine,
        billBarcode: styleBillBarCode,
        billPatient: styleBillPatient
      }
    }
  },
  computed: {
    _width () {
      return mmConversionPx(this.width) - 10
    },
    billStyle () {
      return Object.assign({ width: `${this._width}px` }, this.style.bill, this.style.box)
    },
  },
  watch: {
  },
  methods: {
    itemData (obj) {
      if (this.list.length) {
        if (obj.outpatientDispenseItem) {
          return objGet(obj, 'outpatientDispenseItem', {})
        } else return obj
      }
      return {}
    },
    ...patch
  }
}
</script>
