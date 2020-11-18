<template>
  <div class="layout_inner">
    <div>表单示例</div>
    <base-form></base-form>
    <hr>
    <div>特例表单示例</div>
    <strange-form></strange-form>
  </div>
</template>

<script>
  import baseForm from './demo/baseform.vue'
  import strangeForm from './demo/strangeform.vue'
  export default {
    components: {
      baseForm,
      strangeForm
    }
  }
</script>

