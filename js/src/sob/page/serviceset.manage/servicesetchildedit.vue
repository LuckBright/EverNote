<template>
  <el-dialog
    title="编辑套餐子项信息"
    :visible.sync="dialogTableVisible"
    class="ui_dialog_02 spe"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :inline="true" :model="obj" :rules="rules" class="demo-form-inline" ref="child">
      <el-form-item label="数量" prop="quantity">
        <sys-number type="number" v-model="obj.quantity" :field="{min: 1,max: 1000}"></sys-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('child')">
        <i class="icon iconfont icon-tijiao"></i>保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../../store/servicesetapi'

export default {
  name: 'servicesetchildedit',
  props: ['childData', 'setId'],
  data () {
    return {
      dialogTableVisible: false,
      obj: {
        quantity: 1
      },
      rules: {
        quantity: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      num: 0
    }
  },
  methods: {
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      setTimeout(() => {
        this.obj = Object.assign(this.obj, this.childData)
        this.num = this.obj.quantity
        this.dialogTableVisible = true
      }, 20)
    },
    onSubmit (formName) {
      var _this = this
      if (this.num === this.obj.quantity) {
        _this.onDialogClose()
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            serviceId: this.obj.id,
            serviceSetId: this.setId,
            quantity: this.obj.quantity
          }
          api.updateServSetItem(params).then((res) => {
            this.$messageTips(this, 'success', '修改成功', '提示')
            _this.$emit('update', res)
            _this.onDialogClose()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
