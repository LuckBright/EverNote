<!--
  <skin-test :prop-data="itemData"></skin-test>
  :prop-data="itemData" //皮试结果数据
-->
<template>
  <el-popover placement="bottom" min-width="350" v-if="true" trigger="hover">
    <template>
      <div class="l-h clearfix" v-for="(item, i) in propData" :key="i">
        <wh-code-to-name
          v-if="item.localSettingObject"
          :showIcon="false"
          :patchObj="{
            code: MATERILA_CODE,
            list: item.localSettingObject.materialSkuObject.ext,
            isInfo: false
          }"
        ></wh-code-to-name>
        <span
          class="ml10 f14 fr"
          v-if="item.taskLog && item.taskLog.remark"
        >{{`【${item.taskLog.remark}】`}}</span>
        <span class="ml10 f14 fr" v-else>
          【
          <span class="cGray6">暂无结果</span>】
        </span>
      </div>
    </template>
    <el-button type="text" slot="reference">
      <svg class="icon skin_icon" aria-hidden="true">
        <use xlink:href="#icon-pishuo"></use>
      </svg>
      <span class="cBlack f_nor">皮试结果</span>
    </el-button>
  </el-popover>
</template>

<script>
import { MATERILA_CODE } from '@/util/common'
export default {
  props: {
    visitSn: {
      type: String,
      default: ''
    },
    propData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      MATERILA_CODE,
      result: []
    }
  }
}
</script>

<style scoped lang="scss">
.skin_icon {
  width: 14px;
  height: 14px;
}
.l-h {
  height: 30px;
}
.danger /deep/ .skin_icon {
  color: #ff0000;
  border: 1px solid #ff0000;
}
</style>
