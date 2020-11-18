<template>
  <div class="common-title-box">
    <h2 class="h2">{{t}}</h2>
    <p class="p">{{d}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      t: {
        type: String
      },
      d: {
        type: String
      }
    },
    data () {
      return {
      }
    }
  }
</script>
<style scoped lang="less"></style>
