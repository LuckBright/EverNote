<template>
  <div class="main">
    <div class="region form">
      <el-form
        :model="formObj"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品退货地址" prop="address">
          <el-input
            maxlength="50"
            class="input-width"
            v-model="formObj.address"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkmanName">
          <el-input
            maxlength="50"
            class="input-width"
            v-model="formObj.linkmanName"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            class="input-width"
            v-model="formObj.phone"
            size="small"
            oninput="value=value.replace(/[^\d-]/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="createBtn" type="primary" @click="addInfo">保存信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    data () {
      return {
        api,
        formObj: {
          address: '',
          phone: '',
          linkmanName: '',
        },
        rules: {
          address: [
            { required: true, message: '请输入退货地址', trigger: 'blur' },
          ],
          linkmanName: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ],
          phone: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur',
              type: 'string',
            },
            // { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
            // { pattern: /^1[34578]\d{9}$/, message: "请输入正确的手机号码" }
          ],
        },
        createBtn: false,
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      addInfo () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.createBtn = true
            this.api.createReturnAddress(this.formObj).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
              }
              setTimeout(() => {
                this.createBtn = false
              }, 1000)
            })
          } else {
            return false
          }
        })
      },
      getInfo () {
        this.api.getReturnAddress().then(res => {
          if (res) {
            this.formObj = { ...this.formObj, ...res }
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .form {
    /deep/ .el-form-item__label {
      width: 107px !important;
    }

    height: 90vh;

    .input-width {
      width: 294px;
    }

    .span-width {
      display: inline-block;
      font-size: 14px;
      color: #999;
      width: 90px;
      text-align: right;
      margin-right: 5px;
    }
  }
</style>
