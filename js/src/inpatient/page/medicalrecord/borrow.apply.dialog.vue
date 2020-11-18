<template>
    <div class="dialog_apply">
      <el-dialog 
        :visible="visible"
        width="500px"
        @close="close"
        title="借阅申请信息"
        :close-on-click-modal="false"
        destroy-on-close>
        <el-form :model="form" :rules="rules" ref="applyForm" label-position="left">
          <el-form-item label="借阅目的" prop="borrowingPurpose" labelWidth="80px">
            <el-input v-model="form.borrowingPurpose" clearable placeholder="请输入借阅目的"></el-input>
          </el-form-item>
          <el-form-item label="借阅天数" prop="borrowingPeriod" labelWidth="80px">
            <el-input v-model.number="form.borrowingPeriod" clearable type="number" autocomplete="off"></el-input> <span class="tips">天</span>
          </el-form-item>
          <el-form-item labelWidth="80px">
            <el-checkbox v-model="form.borrowingMethod" :disabled="autoDisabled">自动审批借阅</el-checkbox> <span class="tips">（仅适用借阅本科室病历）</span>
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

import storage from '@/util/storage.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入借阅天数'))
      } else {
        let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
        if (!(reg.test(value) || value === '0')) {
          callback(new Error('借阅天数只能为正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {
        borrowingPurpose: '',
        borrowingPeriod: '',
        borrowingMethod: false
      },
      rules: {
        borrowingPurpose: [
          { required: true, message: '请输入借阅目的', trigger: 'blur' },
          { max: 20, message: '最多输入20个字符', trigger: 'change' }
        ],
        borrowingPeriod: [
          { required: true, message: '请输入借阅期限', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
          // { type: 'number', min: 1, message: '期限必须为数字值', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    autoDisabled () {
      let currentProvide = ''
      if (storage.getLocalStorage('residentKey')) {
        currentProvide = storage.getLocalStorage('residentKey').split(',')[0]
      } else if (storage.getLocalStorage('inpatientKey')) {
        currentProvide = storage.getLocalStorage('inpatientKey').split(',')[0]
      }
      if (this.data.dptId === currentProvide) {
        this.form.borrowingMethod = true
        return false
      } else {
        this.form.borrowingMethod = false
        return true
      }
    }
  },
  methods: {
    submit () {
      this.$refs['applyForm'].validate((valid) => {
        if (valid) {
          this.$emit('save', this.form)
          this.$emit('update:visible', false)
        } else {
          return false
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
      this.form.borrowingPurpose = ''
      this.form.borrowingPeriod = ''
      this.form.borrowingMethod = false
      this.$refs['applyForm'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog_apply{
  /deep/ .el-dialog__header {
    font-size: 14px;
    font-weight: 700;
    padding: 20px 20px 10px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
    /deep/ .el-form {
      .el-form-item {
        margin-bottom: 10px;
        &:nth-child(2) {
          margin-bottom: 0;
          .el-form-item__content {
            width: 132px;
          }
          /deep/ .el-input {
            width: 80px;
            margin-right: 6px;
          }
        }
      }
      .btns {
        margin-bottom: 0;
        text-align: right;
      }
    }
  }
}
</style>
