<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="ui_dialog_02">
      <ever-form-model
        :schema="schema"
        v-model="obj"
        :rules="rules"
        ref="form"
        label-position="right"
      ></ever-form-model>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">
          <i class="iconfont icon-tijiao"></i>保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'workingdialog',
  props: ['schema', 'title', 'api', 'rules', 'obj'],
  data () {
    return {
      dialogTableVisible: false
    }
  },
  methods: {
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      this.dialogTableVisible = true
    },
    submitForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.api.createOrUpdate(this.obj).then(result => {
            this.$emit('objsaved')
            this.$messageTips(this, 'success', '提交成功')
          })
          this.onDialogClose()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
