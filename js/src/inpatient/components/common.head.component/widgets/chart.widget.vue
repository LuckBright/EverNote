<template>
  <span :class="[
    'common-head-item-container',
     'common-head-item-container-' + itemConfig.paramKey,
      'common-head-item-container-rule-' + itemData.rule,
       'common-head-item-container-' + itemConfig.paramKey + itemData.rule,
       'common-head-item-container-exception-type-' + exceptionType,
       ]"><!--    label--><span
    class="common-head-def-label"><slot name="label">{{itemConfig.paramValue}}：</slot></span><!--    默认slot 要显示的值--><span
    class="common-head-def-value"><slot>{{itemConfig.value || '--'}}</slot></span><!--    单位--><span
    class="common-head-def-value"><slot name="unit"></slot><span
    class="common-head-def-value" v-if="itemData.rule === 1 || itemData.rule === -1"><i v-if="itemData.rule === 1" class="icon iconfont icon-jiantou1 common-head-exception-icon up"></i>
        <i v-if="itemData.rule === -1" class="icon iconfont icon-jiantou-xiangxia common-head-exception-icon down"></i></span></span><slot name="chart"><span
    title="" @click="viewChart" class="icon iconfont common-head-icon common-head-icon-chart" :class="useTransparent ? 'icon-PHR-quxiantufanbai': 'icon-PHR-quxiantu'"></span></slot>
  </span>
</template>
<script>
  export default {
    props: {
      itemConfig: {
        type: Object,
      },
      itemData: {
        type: Object,
        default () {
          return {}
        },
      },
      useTransparent: {
        type: Boolean,
        default: true,
      },
      // 异常之后显示的背景颜色
      // 1. 橙色
      // 2. 红色
      exceptionType: {
        type: Number,
        default: 1,
      }
    },
    data () {
      return {}
    },
    methods: {
      viewChart () {
      },
    },
  }
</script>
<style></style>
