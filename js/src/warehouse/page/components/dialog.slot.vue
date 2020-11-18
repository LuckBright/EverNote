<template>
  <el-dialog :title="title" :width="width || '50%'" :visible.sync="dialogVisible" :modal-append-to-body="false">
    <slot></slot>
    <slot name="footer"></slot>
  </el-dialog>
</template>
<script>
export default {
  props: ['title', 'width', 'dialogSlot'],
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    'dialogSlot' (v) {
      this.dialogVisible = v
    },
    'dialogVisible' (v) {
      !v && this.$emit('update:dialogSlot', false)
    }
  }
}
</script>

