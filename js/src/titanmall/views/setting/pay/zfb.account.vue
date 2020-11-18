<template>
  <div class="main pay-box">
    <el-page-header
      @back="() => {
        $router.go(-1)
      }"
      content="支付宝收款账户"></el-page-header>
    <div class="region pay-container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商户应用ID" prop="aliAppId">
          <el-input
            v-model="ruleForm.aliAppId"
            class="input-wd"
            placeholder="请输入商户应用ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="商户私钥" prop="aliMchPriSecret">
          <el-input
            v-model="ruleForm.aliMchPriSecret"
            class="input-wd"
            placeholder="请输入商户私钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付宝公钥" prop="aliPubSecret">
          <el-input
            v-model="ruleForm.aliPubSecret"
            class="input-wd"
            placeholder="请输入支付宝公钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付宝支付手续费率" prop="channelRate4merchant">
          <el-input
            v-model="ruleForm.channelRate4merchant"
            class="input-wd"
            placeholder="请输入支付宝支付手续费率"
            :onkeyup="changeInput('channelRate4merchant')"
          ></el-input>
        </el-form-item>

        <!-- -->
        <p class="text-tip">
          请填写支付宝支付手续费率，例如千分之六填写： 0.006
          填写支付宝手续费率后账单会显示扣除手续费后的实收金额，便于对账使用。
        </p>
      </el-form>
      <p>
        <el-button
          size="small"
          type="primary"
          style="margin-left: 150px"
          @click="addInfo"
        >保存
        </el-button
        >
        <el-button
          size="small"
          @click="
            () => {
              $router.go(-1);
            }
          "
        >取消
        </el-button
        >
      </p>
    </div>
  </div>
</template>
<script>
  import api from '../api'
  import priceInfo from '@/titanmall/components/priceInfo'

  export default {
    data () {
      return {
        api,
        priceInfo,
        rules: {
          aliAppId: [
            { required: true, message: '请输入商户应用ID', trigger: 'blur' },
          ],
          aliMchPriSecret: [
            { required: true, message: '请输入商户私钥', trigger: 'blur' },
          ],
          aliPubSecret: [
            { required: true, message: '请输入支付宝公钥', trigger: 'blur' },
          ],
          channelRate4merchant: [
            {
              required: true,
              message: '请输入支付宝支付手续费率',
              trigger: 'blur',
            },
            { min: '0', max: '1', message: '利率大于0小于1', trigger: 'change' },
          ],
        },
        ruleForm: {
          aliAppId: '',
          aliMchPriSecret: '',
          aliPubSecret: '',
          channelRate4merchant: '',
        },
      }
    },
    created () {
      if (this.$route.query.aliAppId) {
        this.ruleForm.aliAppId = this.$route.query.aliAppId
        this.ruleForm.aliMchPriSecret = this.$route.query.aliMchPriSecret
        this.ruleForm.aliPubSecret = this.$route.query.aliPubSecret
        this.ruleForm.channelRate4merchant = this.$route.query.aliRate
      }
    },
    methods: {
      addInfo () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.api.saveAliPayInfo(this.ruleForm).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
                this.$router.push('/titanmall/setting/pay')
              }
            })
          }
        })
      },
      changeInput (val) {
        let value = this.ruleForm[val]
        this.ruleForm[val] = this.priceInfo(value, false)
      },
    },
  }
</script>
<style lang="less" scoped>
  .pay-box {
    margin-top: 10px;
    .input-wd {
      width: 294px;
    }

    /deep/ .el-form .el-form-item__label {
      width: 150px !important;
    }

    .text-tip {
      font-size: 12px;
      color: #999;
      padding-left: 150px;
      margin-bottom: 10px;
    }
  }
</style>
