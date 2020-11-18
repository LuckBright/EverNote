<template>
<span v-if="row[scene]">
  <span class="init-price">{{row[scene]['originalPrice'] || 0}}</span>
  <i class="el-icon-right green"></i>
  <span class="changed-price red">{{row[scene]['currentPrice'] || 0}}</span>
</span>
</template>

<script>
export default {
  props: {
    scene: String,
    row: {
      type: Object,
      default: () => ({ })
    }
  }
}
</script>
<style>
.green {
  color: green;
}
.red {
  color: red;
}
</style>

