<template>
  <div :style="billStyle">
    <div :style="style.header">
      <div :style="style.h1">{{title}}</div>
      <billBarcode :style="style.billBarcode" :barCode="barCode" />
      <billPatient :style="style.billPatient" v-bind="patientMessage" />
    </div>
    <div :style="style.ul">
      <div :style="index === list.length - 1 ? Object.assign({}, style.li, style.liLast) : style.li" style=" padding: 5px 0" v-for="(item, index) in list" :key="index">
        <div class="clear: both;">
          <div :style="style.liDiv" style="width: 100%;">
            <wh-code-to-name
              :showIcon="false"
              :patchObj="{
                code: SEARCH_CODE[1],
                list: item[item.localSetting ? 'localSetting' : 'localSettingObject'].materialSkuObject.ext,
                isInfo: false
              }"
              :showSourceValue="item.source">
            </wh-code-to-name>
            <span v-if="item.outpatientDispenseItem">{{item.outpatientDispenseItem.num}}</span>
            <span v-else>{{item.num}}</span>
            <span v-if="item.localSetting" class="light-gray">{{parserJSON({data: item.localSetting.materialSkuObject.ext})}}</span>
            <span v-if="item.localSettingObject" class="light-gray">{{parserJSON({data: item.localSettingObject.materialSkuObject.ext})}}</span>
          </div>
          <!-- <div style="text-align: right; width: 20%!important;" :style="style.liDivRight">
            <span v-if="item.outpatientDispenseItem">{{item.outpatientDispenseItem.num}}</span>
            <span v-else>{{item.num}}</span>
            <span v-if="item.localSetting" class="light-gray">{{findBasesourceCode({arr: item.localSetting.materialSkuObject.materialPropertys})}}</span>
            <span v-if="item.localSettingObject" class="light-gray">{{findBasesourceCode({arr: item.localSettingObject.materialSkuObject.materialPropertys})}}</span>
          </div> -->
        </div>
        <!-- <div :style="style.liDiv"  style="width: 80%">货位：
          <span v-if="item.freightObject && item.freightObject.code">{{item.freightObject.code}}</span>
        </div> -->
      </div>
    </div>
    <div style="border-top: 1px solid #000; font-size: 14px; padding: 5px; margin-top: 5px;">
      剂数：<span style="font-size: 18px; font-weight: bold;">{{list[0].num / list[0].measure}} </span>剂
    </div>
    <div style=" margin-top: 10px; text-align: right; padding-top: 20px">.</div>
  </div>
</template>

<script>
import { mmConversionPx, SEARCH_CODE, SPU_SPEC_CODE, SPEC, patch, parserJSON } from '@/util/common'
import billPatient from './billPatient.vue'
import billBarcode from './billBarcode.vue'
import {bill, ul} from './style'
import {box, header, h1, billBarcode as styleBillBarCode, billPatient as styleBillPatient, li, liDiv, liDivLeft, liDivRight, liLast, isMine} from './stylePrescriptionList'
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
      width: 70,
      title: '备药单',
      newList: [],
      parserJSON,
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
      return Object.assign({width: `${this._width}px`}, this.style.bill, this.style.box)
    }
  },
  watch: {
    list: {
      handler: function (v) {
        let arr = []
        const sorted = this.groupBy(this.list, function (item) {
          return [item.id]
        })
        for (let i = 0; i < sorted.length; i++) {
          const item = sorted[i]
          const len = item.length
          for (let n = 0; n < len; n++) {
            if (n === len - 1) item[n].lastMine = true
            arr.push(item[n])
          }
        }
        this.newList = [...arr]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    groupBy (array, f) {
      const groups = {}
      array.forEach(function (o) {
        const group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map(function (group) {
        return groups[group]
      })
    },
    ...patch
  }
}
</script>
