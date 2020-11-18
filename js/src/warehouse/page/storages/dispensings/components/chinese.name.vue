<template>
  <span>
    <wh-code-to-name
      v-if="data.localSettingObject || data.localSetting"
      class="f_bold pr10"
      :isExt="true"
      :patchObj="{
        code: GENERAL_CODE,
        list: data[data.localSettingObject ? 'localSettingObject' : 'localSetting'].materialSkuObject.ext,
        isInfo: false
      }"
      :showSourceValue="data.source">
      </wh-code-to-name>
      <sub class="subs" v-if="data && data.measure">{{data.measure}}{{data.measureUnitName || data.measureUnit}}</sub>
      <sub class="subs" v-if="otherData && otherData.measure">{{otherData.measure}}{{otherData.measureUnitName || otherData.measureUnit}}</sub>
      <sup v-if="data && data.decoction" style="margin-left: -20px" class="sups">(<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="data.decoction"></sys-value>)</sup>
      <sup v-if="otherData && otherData.decoction" style="margin-left: -20px" class="sups">(<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="otherData.decoction"></sys-value>)</sup>
    <el-popover
      :key="getTime"
      v-if="data && data.identification"
      placement="bottom"
      title="异常原因:"
      width="300"
      trigger="hover"
      :content="bnormalReason || data.identificationTxt">
        <span v-html='filterClassifyList(data.classifyList)'></span>
        <span slot="reference" class="pointer">
          <svg class="icon " aria-hidden="true" style="font-size: 18px; height: 18px">
            <use xlink:href="#icon-yi"></use>
          </svg>
        </span>
    </el-popover>
    <el-popover
      :key="getTime"
      v-if="otherData && otherData.identification"
      placement="bottom"
      title="异常原因:"
      width="300"
      trigger="hover"
      :content="bnormalReason || otherData.identificationTxt">
        <span v-html='filterClassifyList(otherData.classifyList)'></span>
        <span slot="reference" class="pointer">
          <svg class="icon " aria-hidden="true" style="font-size: 18px; height: 18px">
            <use xlink:href="#icon-yi"></use>
          </svg>
        </span>
    </el-popover>
  </span>
</template>

<script>
import { patch, GENERAL_CODE, objGet } from '@/util/common'
import { setUpClassifyName } from '@/util/formcustom'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    otherData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      getTime: new Date().getTime(),
      GENERAL_CODE,
      setUpClassifyName
    }
  },
  computed: {
    bnormalReason () {
      let str
      if (objGet(this.data, 'exceptionCause', '')) {
        str = this.data.exceptionCause
      }
      if (objGet(this.otherData, 'outpatientDispenseItem.exceptionCause', '')) {
        str = this.otherData.outpatientDispenseItem.exceptionCause
      }
      return str
    }
  },
  methods: {
    filterClassifyList (list) {
      if (list && list.length) {
        let arr = []
        list.map((item, index) => {
          arr.push(`<div><span>${index + 1}、</span>${setUpClassifyName(item, true, 'childClassifyItem', 'contentText')}</div>`)
        })
        // 异常原因只有一条不显示前面的 1、
        if (arr.length === 1) {
          arr[0] = arr[0].replace(new RegExp('<span>1、</span>'), '')
        }
        return arr.join('')
      }
    },
    ...patch
  }
}
</script>

<style lang="less" scoped>
.sups {
  top: -0.6em;
}
.subs {
  bottom: -0.5em;
}
.pr10 {
  padding-right: 5px;
}
</style>
