<template>
  <div>
    <el-tooltip :placement="placement" v-if="content">
      <div slot="content" style="max-width: 300px;">
        {{content}}
      </div>
      <div class="ellipsis">
        {{content}}
      </div>
    </el-tooltip>
    <span v-else>无</span>
  </div>
</template>

<script>
export default {
  props: {
    placement: {
      type: String,
      default: 'top-start'
    },
    content: {
      type: String,
      default: ''
    }
  }
}

</script>
<style scoped>
.ellipsis{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
