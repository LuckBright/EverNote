<!--
  全局物资模版code转换为物资名称组件  （todo：大家根据具体需求完善拓展）
  引用示例：
  <wh-code-to-name
    :cType="1"
    :patchObj="{
      list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
      isInfo: false
    }"></wh-code-to-name>
-->
<template>
  <span v-if="patchObj.list" class="materialname">
    <b v-if="showSourceValue && showSourceValue === DRUG_SOURCE[1].id">【自备药】</b>
    <span class="mr5" v-if="isExt">{{parserComplex({
      data: patchObj.list,
      propertys: cType ? classType[cType] : patchObj.code,
      split: patchObj.split,
      key: patchObj.key,
      standard: patchObj.standard,
      classifyId: patchObj.classifyId }) || tableDefaultCellValue}}
      <!-- 2020.1.13王强提BUG要求把图标放在拼接文字后面 -->
      <!-- 物资毒麻精放&抗菌药物图标显示 -->
      <ever-specialIcons v-if="showIcon" :iconsData="patchObj.list"></ever-specialIcons>
      </span>
    <span class="mr5" v-else>{{_resetMaterialName({
      rows: patchObj.list,
      attributeValue: patchObj.attributeValue,
      code: cType ? classType[cType] : patchObj.code,
      isInfo: patchObj.isInfo,
      mark: patchObj.mark
      })}}
      <!-- 物资毒麻精放&抗菌药物图标显示 -->
      <ever-specialIcons v-if="showIcon" :iconsData="patchObj.list"></ever-specialIcons>
      </span>
    <!-- 药品说明书  "-->
    <i v-if="isSynopsis" @click="drugOpen(patchObj)" class="iconfont icon-shuoming"></i>
    <!-- 查看药品说明 -->
    <drug-instructions v-if="isSynopsis" ref="drugTips" :objData="patchObj"></drug-instructions>
    <slot></slot>
  </span>
</template>

<script>
/**
* patchObj
* @param {array} list            物资字段数组           require
* @param {array} [code=[]]       需要转义的字段默认为一个空数组，也可为字符串code
* @param {string} attributeValue 属性Value值
* @param {string} [mark=' - ']   分隔符
* @param {boolean} isInfo        是否需要默认code（默认为真）
* @param {boolean} isExt         是否是新数据结构（ext）数据
* @param {boolean} isSynopsis    是否需要展示说明书
* @param {boolean} standard      是否需要展示自定义物资规则(统一不展示，只有具体需要展示规则的才传入该字段)
*/

import * as common from '@/util/common'
import everSpecialIcons from '@/warehouse/page/components/whspecialicons'   //  cpoe调用组件 icon本身是在warehous全局下，cpoe调用单独引入   后期可以考虑main.js里面全局注册
import drugInstructions from '@/warehouse/page/storages/dispensings/components/drug.instructions'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
export default {
  props: {
    patchObj: {
      type: Object,
      default: () => ({})
    },
    cType: { // classType  选择物资名称显示种类（1， 2， 3...）===> GOLBAL_VAL_MATERIL_NAME: 定义好的物资显示方式
      type: Number,
      default: 0
    },
    showIcon: { // 是否显示特殊药品标识icon
      type: Boolean,
      default: true
    },
    showSourceValue: { // 显示医嘱来源 (1: 本院；2: 自备药；3: 出院带药；)
      type: String,
      default: ''
    },
    isExt: {
      type: Boolean,
      default: false
    },
    isSynopsis: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableDefaultCellValue,
      DRUG_SOURCE: common.DRUG_SOURCE,
      parserComplex: common.parserComplex,
      thisObjData: {},
      classType: {
        1: common.MATERILA_CODE,
        2: common.MATERILA_NAME_CODE,
        3: common.GOLBAL_VAL_MATERIL_NAME.NAME_ONE,
        4: common.GOLBAL_VAL_MATERIL_NAME.NAME_TWO,
        5: common.GOLBAL_VAL_MATERIL_NAME.NAME_THREE
      }
    }
  },
  methods: {
    drugOpen (data) {
      this.thisObjData = data
      this.$nextTick(_ => {
        this.$refs.drugTips.open()
      })
    },
    ...common.patch
  },
  components: {
    drugInstructions,
    everSpecialIcons
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/base.scss';
/deep/ .iconfont.icon-shuoming{
  font-size: 16px;
  padding: 0px;
  color: $blue_color;
}
.materialname{
  .icon-shuoming{
    font-weight: normal;
    visibility: hidden
  }
}
.materialname:hover{
  .icon-shuoming{
    visibility: inherit
  }
}
</style>

