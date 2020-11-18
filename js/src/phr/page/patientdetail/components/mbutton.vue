<template>
  <button :class="'m-button '+ size " @click="handleClick" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    props: ['size', 'disabled'],
    methods: {
      handleClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="less" scoped>
  .m-button{
    background: #1c7bef;
    border-radius: 200px;
    color: #fff;
    border:none;
    padding: 0 10px;
    min-width: 60px;
    font-size: 14px;
    outline: 0 !important;
    height: 28px;
    line-height: 28px;
    &:focus{
      outline: 0 !important;
      background: rgba(28, 123, 239, 0.9);
    }
    &.large{
      height: 40px;
      line-height: 40px;
    }
    &:disabled{
      background: rgba(28, 123, 239, 0.6);
    }
  }
</style>
