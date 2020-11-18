<template>
    <div class="dialog_refuse">
      <el-dialog 
        :visible="visible"
        width="500px"
        @close="close"
        title="提示"
        :close-on-click-modal="false"
        destroy-on-close>
        <p class="nextTitle">
          <i class="iconfont icon-beibohui1"></i>
          <span>您确定要执行{{command === '1' ? '拒绝' : '强制归还'}}操作吗？</span>
        </p>
        <el-form :model="form" :rules="rules" ref="refuseForm" label-position="left">
          <el-form-item label="拒绝原因" prop="reasonsForRejection" labelWidth="80px" v-if="command === '1'">
            <el-input v-model="form.reasonsForRejection" clearable placeholder="请输入拒绝原因"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="close" size="small">取消</el-button>
            <el-button type="primary" @click="submit" size="small">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    command: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        reasonsForRejection: ''
      },
    }
  },
  computed: {
    rules () {
      if (this.command === '1') {
        return {
          reasonsForRejection: [
            { required: true, message: '请输入拒绝原因', trigger: 'blur' },
            { max: 20, message: '最多输入20个字符', trigger: 'change' }
          ]
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.form.reasonsForRejection = ''
      }
    }
  },
  methods: {
    submit () {
      this.$refs['refuseForm'].validate((valid) => {
        if (valid) {
          let method = this.command === '1' ? 'refuseSubmit' : 'backSubmit'
          this.$emit('submit', method, this.form)
          this.$emit('update:visible', false)
        } else {
          return false
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog_refuse{   
  /deep/ .el-dialog__header {
    padding: 20px 20px 10px;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0 20px 20px;
    .nextTitle {
      margin: 0;
      font-weight: bold;
      line-height: 50px;
      font-size: 15px;
      .iconfont {
        color: #ee4433;
        margin-right: 10px;
        font-size: 17px;
      }
    }
    /deep/ .el-form {
      .btns {
        margin-bottom: 0;
        text-align: right;
      }
    }
  }
}
</style>
