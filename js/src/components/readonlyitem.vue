<template>
  <span
    v-if="filter && (value !== '' && value !== undefined && value != null)"
    v-html="$options.filters[filter](value, ...(filterParams || []))"
  ></span>
  <span
    v-else-if="formatter"
    :class="{'cGray':!formatter(value)}"
    v-html="formatter(value) || defaultTip"
  ></span>
  <!-- value = 0 会为假 -->
  <span
    :class="{'cGray': !value && typeof value != 'number' && !nocGray}"
    v-else
    v-html="(typeof value == 'number' ? value + '' : value) || defaultTip"
  ></span>
</template>

<script>
export default {
  props: ['value', 'filter', 'filterParams', 'defaultValue', 'nocGray', 'formatter'],
  computed: {
    defaultTip () {
      return this.defaultValue || '无'
    }
  }
}
</script>

<style scoped>
span {
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap !important;
}
</style>
