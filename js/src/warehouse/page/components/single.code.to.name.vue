<!--
  全局物资模版单个code转换为获取物资单个属性组件 （todo：大家根据具体需求完善拓展）
  使用示例：<wh-single-code-to-name :patchObj="{list: scope.row.localSettingObject.materialSkuObject.materialPropertys}"></wh-single-code-to-name>
-->
<template>
  <span>
  <template v-if="isExt">
    {{(isUnit && CHINESE_MEDICINE_TYPE.includes(patchObj.list.classifyObject.id)) ? '-' : parserJSON({data: patchObj.list, property: patchObj.code || PACKAGE_CODE})}}
  </template>
  <template v-else>
    {{findBasesourceCode({arr: patchObj.list, code: patchObj.code, field: patchObj.field})}}
  </template>
  </span>
</template>

<script>
/**
 * patchObj
 * @param {array}   list       物资字段数组         require
 * @param {string}  code       需要查找的字段值
 * @param {string}  field      取name或者其他
 * @param {boolean} isExt         是否是新数据结构（ext）数据
 * @returns String
 */
import * as common from '@/util/common'
export default {
  props: {
    patchObj: {
      type: Object,
      default: () => ({})
    },
    isExt: {
      type: Boolean,
      default: false
    },
    isUnit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      PACKAGE_CODE: common.PACKAGE_CODE,
      parserJSON: common.parserJSON,
      CHINESE_MEDICINE_TYPE: common.CHINESE_MEDICINE_TYPE
    }
  },
  methods: {
    ...common.patch
  }
}
</script>
