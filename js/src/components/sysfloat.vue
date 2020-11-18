<template>
  <span>
    <el-input
      v-model="select"
      :disabled="disabled"
      :placeholder="placeholder"
      type="number"
      :size="size"
    >
      <template slot="prepend" v-if="usePrepend">{{ usePrepend }}</template>
      <template slot="append" v-if="useAppend">{{ useAppend }}</template>
    </el-input>
  </span>
</template>

<script>
export default {
  props: ['value', 'disabled', 'placeholder', 'usePrepend', 'change', 'useAppend', 'size'],
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', Number(newVal))
      },
      get () {
        return this.value === 0 ? 0 : this.value === '' ? '' : Number(this.value).toFixed(2)
      }
    }
  }
}
</script>
