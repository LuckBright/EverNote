<template>
  <div>
    <!-- 审核弹窗 -->
    <el-dialog
    title="审核"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape='false'
    :show-close='true'
    width="420px">
      <el-input
        type="textarea"
        placeholder="请填写审核意见，驳回必填"
        v-model="textarea"
        maxlength="100"
        class="mheight"
        show-word-limit>
      </el-input>
      <div class="alg_c mt10">
        <el-button type="primary" size="small" @click="handlerConsent(1)" :loading="loding">同意</el-button>
        <el-button type="primary" size="small" @click="handlerConsent(0)" :disabled="!textarea" :loading="loding">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    loding: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      textarea: '', // 审核原因
      dialogVisible: false
    }
  },
  methods: {
    handlerConsent (val) {
      this.$emit('handlerConsent', val, this.textarea)
    }
  },
  watch: {
    'visible' (val) {
      this.dialogVisible = val
    },
    'dialogVisible' (val) {
      if (!val) this.textarea = ''
      this.$emit('update:visible', val)
    }
  }
}

</script>
<style scoped lang="scss">
.mheight /deep/ .el-textarea__inner{
  height: 200px;
}
</style>
