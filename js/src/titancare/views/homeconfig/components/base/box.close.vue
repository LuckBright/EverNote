<template>
<div class="close-box">
  <div class="close" @click.stop="close" v-if="showClose">
    <i class="el-icon-error"></i>
  </div>
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'box.close',
  props: {
    showClose: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
  .close-box{
    position: relative;
    display: inline-block;
    width: 100%;
    &:hover{
      .close{
        display: block;
      }
    }
    .close{
      display: none;
      position: absolute;
      width: 20px;
      height: 20px;
      top: -10px;
      right: -10px;
      cursor: pointer;
      line-height: 1;
      color: rgba(0, 0, 0, 0.45);
      z-index: 999;
      i{
        font-size: 20px;
      }
    }
  }

</style>
