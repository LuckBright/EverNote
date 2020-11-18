import false from 'ever-comp';
<template>
  <el-dialog
    width="420px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :modal="true"
    :show-close="true"
    title="版本更新"
    center>
    <div class="update-tip">
      <div>
        发现新版本，建议您点击“更新系统”按钮刷新浏览器使用，继续使用可能会导致部分不能正确使用。
      </div>
      <slot name="tip" v-if="showTip"></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭，继续使用</el-button>
      <el-button type="primary" @click="handleReload()">更新系统</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      dialogVisible: false,
      showTip: false
    }
  },
  created () {
    if (localStorage.getItem('debug') === 1) {
      this.showTip = true
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    handleReload () {
      window.location.reload()
    }
  }
}
</script>
