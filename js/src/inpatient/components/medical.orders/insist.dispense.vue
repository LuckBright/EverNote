<template>
  <el-dialog
    title="坚持发药"
    :visible.sync="visibleFlag"
    :close-on-click-modal="false" 
    :close-on-press-escape="false"
    class="insistDialog ui_dialog_02 spe"
    @close="closeDialog"
  >
  <div  @keydown.native='enter'  @keyup.native='enter'>
    请填写原因：<el-input
        class='input'
      placeholder="请填写原因"
      v-model="handleObj.reason"
      clearable>
    </el-input>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submit" type="primary" :disabled="!handleObj.reason">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data () {
    let handleSchema = [
      {
        name: 'reason',
        label: '请填写原因',
        comp: 'el-input'
      }
    ]
    let handleObj = this.$ever.createObjFromSchema(handleSchema)
    return {
      handleSchema,
      handleObj,
      visibleFlag: false,         // dialog显示隐藏标识
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    closeDialog () {
      this.visibleFlag = false
      this.handleObj = this.$ever.createObjFromSchema(this.handleSchema)
      this.$emit('update:visible', this.visibleFlag)
    },
    submit () {
      this.$emit('submit', this.handleObj)
    },
    enter (e) {
      if (e.keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        return false
      }
    }
  },
  watch: {
    'visible' (val) {
      this.visibleFlag = val
    }
  }
}
</script>
<style scoped lang="scss">
.insistDialog {
  .input{
    width: 50%;
  }
}
</style>
