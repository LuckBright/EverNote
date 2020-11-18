<template>
  <span>
    <el-popover
      ref="popover"
      :title="title || '提示'"
      :placement="placement || 'top-start'"
      :width="width || '200'"
      :trigger="trigger || 'hover'">
      <slot name="content">
        {{content}}
      </slot>
    </el-popover>
    <el-button v-if="showType === 'button'" size="small" plain type="primary" v-popover:popover>{{btnText || '说明'}}</el-button>
    <i class="iconfont icon-tixing1 blue" v-if="showType === 'icon'" v-popover:popover>
      <span class="f14">{{btnText}}</span>
    </i>
  </span>
</template>
<script>
export default {
  props: {
    title: String,
    content: String,
    btnText: String,
    placement: String,
    width: String,
    popover: String || 'popover',
    showType: String || 'button',
    trigger: String
  }
}
</script>
<style lang="scss" scoped>
.f14{
  vertical-align: top;
  padding: 2px 0 0 3px;
}
</style>
