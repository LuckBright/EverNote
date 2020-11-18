<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape='false'
    :show-close='false'
    width="420px">
    <div style="margin: -10px 0 0 10px">
      <div>单据取消后不能恢复，请确认是否取消?</div>
      <div>确认取消请填写取消原因</div>
      <el-input
        type="textarea"
        placeholder="请填写取消原因"
        v-model="textarea"
        maxlength="100"
        class="mheight"
        show-word-limit
      >
      </el-input>
    </div>
    <div class="alg_c mt10">
      <el-button type="primary" size="small" @click="handlerCancel" :disabled="!textarea">确定</el-button>
      <el-button type="primary" plain size="small" @click="dialogVisible = false">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    }
  },
  data () {
    return {
      dialogVisible: false,
      textarea: ''
    }
  },
  methods: {
    open () {
      this.textarea = ''
      this.dialogVisible = true
    },
    handlerCancel () {
      this.dialogVisible = false
      this.$emit('change', this.textarea)
    },
  },
}

</script>
<style scoped lang="less">
.mheight /deep/ .el-textarea__inner{
  height: 100px;
  margin-top: 10px;
}
</style>
