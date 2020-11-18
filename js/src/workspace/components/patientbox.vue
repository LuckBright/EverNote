<template>
  <el-col :span="6" class="overtext line">
    <span class="label">{{label}}</span>
    <span class="content">{{content}}</span>
    <slot></slot>
  </el-col>
</template>

<script>
export default {
  name: 'patientBox',
  props: ['label', 'content']
}
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  width: 56px;
  height: 14px;
  font-size: 14px;
  text-align: right;
  color: #999999;
}
.content {
  display: inline-block;
  margin-left: 14px;
  color: #333333;
}
.line {
  line-height: 25px
}
</style>
