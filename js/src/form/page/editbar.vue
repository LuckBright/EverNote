<template>
  <div class="editbar">
    {{index}}
    <el-button type="text" size="mini" @click="$emit('edit', index)">编辑</el-button>
    <el-button type="text" size="mini" @click="$emit('delete', index)">删除</el-button>
    <el-button type="text" size="mini" @click="$emit('prev', index)">上移</el-button>
    <el-button type="text" size="mini" @click="$emit('next', index)">下移</el-button>
  </div>
</template>
<script>
  export default {
    props: ['index']
  }
</script>
<style scoped>
  .editbar {
    color: #999;
    font-size: 12px;

  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .el-button--mini {
    padding: 0px;
  }
</style>
