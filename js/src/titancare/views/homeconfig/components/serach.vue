<template>
  <div :class="{'serach': true, 'circle': moduleData.styleType === '2' }">
    <el-input
      placeholder="搜索医生"
      value="">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div>
</template>

<script>
export default {
  props: [ 'moduleData' ],
}
</script>

<style lang="less" scoped>
  .serach /deep/ input{
    border-radius: 0px;
    padding-left: 30px;
    border: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px
  }
  .circle /deep/ input{
    border-radius: 200px;
  }
</style>
