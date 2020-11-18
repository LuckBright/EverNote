<template>
  <div class="main pay-box">
    <el-page-header
      @back="() => {
        $router.go(-1)
      }"
      content="微信收款账户"></el-page-header>
    <div class="region">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="微信商户ID" prop="wxMchId">
          <el-input
            v-model="ruleForm.wxMchId"
            class="input-wd"
            placeholder="请输入微信商户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="微信商户API秘钥" prop="wxMchSecret">
          <el-input
            v-model="ruleForm.wxMchSecret"
            class="input-wd"
            placeholder="请输入微信商户API秘钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="微信支付手续费率" prop="wxRate">
          <el-input
            v-model="ruleForm.wxRate"
            class="input-wd"
            placeholder="请输入微信支付手续费率"
          ></el-input>
        </el-form-item>
        <p class="text-tip">
          请填写微信支付手续费率，例如千分之六填写： 0.006
          填写微信手续费率后账单会显示扣除手续费后的实收金额，便于对账使用。
        </p>
        <el-form-item label="apiclient_cert.pem" prop="wxCertPem">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="headers"
            :on-remove="
              (file, fileList) =>
                handleRemove(file, fileList, 'wxCertPemList', 'wxCertPem')
            "
            :file-list="fileObj.wxCertPemList"
            :on-success="
              (response, file, fileList) =>
                handleSuccess(
                  response,
                  file,
                  fileList,
                  'wxCertPemList',
                  'wxCertPem'
                )
            "
            :before-upload="file => handleBefore(file, 'apiclient_cert.pem')"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="apiclient_cert.p12" prop="wxCertP12">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="headers"
            :on-remove="
              (file, fileList) =>
                handleRemove(file, fileList, 'wxCertP12List', 'wxCertP12')
            "
            :file-list="fileObj.wxCertP12List"
            :on-success="
              (response, file, fileList) =>
                handleSuccess(
                  response,
                  file,
                  fileList,
                  'wxCertP12List',
                  'wxCertP12'
                )
            "
            :before-upload="file => handleBefore(file, 'apiclient_cert.p12')"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="apiclient_key.pem" prop="wxKeyPem">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="headers"
            :on-remove="
              (file, fileList) =>
                handleRemove(file, fileList, 'wxKeyPemList', 'wxKeyPem')
            "
            :file-list="fileObj.wxKeyPemList"
            :on-success="
              (response, file, fileList) =>
                handleSuccess(
                  response,
                  file,
                  fileList,
                  'wxKeyPemList',
                  'wxKeyPem'
                )
            "
            :before-upload="file => handleBefore(file, 'apiclient_key.pem')"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
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
          @click="
            () => {
              $router.go(-1);
            }
          "
          size="small"
        >取消
        </el-button
        >
      </p>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    data () {
      return {
        api,
        rules: {
          wxMchId: [
            { required: true, message: '请输入微信商户ID', trigger: 'blur' },
          ],
          wxMchSecret: [
            { required: true, message: '请输入微信商户API秘钥', trigger: 'blur' },
          ],
          wxRate: [
            {
              required: true,
              message: '请输入微信支付手续费率',
              trigger: 'blur',
            },
          ],
          wxKeyPem: [ { required: true, message: '请上传文件', trigger: 'blur' } ],
          wxCertPem: [ { required: true, message: '请上传文件', trigger: 'blur' } ],
          wxCertP12: [ { required: true, message: '请上传文件', trigger: 'blur' } ],
        },
        ruleForm: {
          wxMchId: '',
          wxMchSecret: '',
          wxRate: '',
          wxKeyPem: '',
          wxCertPem: '',
          wxCertP12: '',
          channelRate4merchant: '',
        },
        fileObj: {
          wxCertPemList: [],
          wxCertP12List: [],
          wxKeyPemList: [],
        },
        headers: {
          'x-tenant-id': localStorage.getItem('TENANTID'),
          'x-access-token': localStorage.getItem('TOKEN'),
          'x-channel': 'THC-PLATFORM-MANAGEMENT',
        },
        action: `${ location.origin }/api-ih/titan-cms/base/fs/multiUpload`,
      }
    },
    created () {
      if (this.$route.query.wxMchId) {
        this.ruleForm = { ...this.ruleForm, ...this.$route.query }
        this.fileObj.wxCertPemList = [
          {
            url: this.ruleForm.wxCertPem,
            name: '',
          },
        ]
        this.fileObj.wxCertP12List = [
          {
            url: this.ruleForm.wxCertP12,
            name: '',
          },
        ]
        this.fileObj.wxKeyPemList = [
          {
            url: this.ruleForm.wxKeyPem,
            name: '',
          },
        ]
      }
    },
    methods: {
      addInfo () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.ruleForm.channelRate4merchant = this.ruleForm.wxRate
            this.api.saveWxPayInfo(this.ruleForm).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
                this.$router.go(-1)
              }
            })
          }
        })
      },
      handleRemove (file, fileList, index, key) {
        this.fileObj[index].length = 0
        this.ruleForm[key] = ''
      },
      handleSuccess (response, file, fileList, index, key) {
        this.fileObj[index] = fileList
        this.ruleForm[key] = fileList[0].response.data.fileId
      },

      // 上传之前
      handleBefore (file, name) {
        if (file.name === name) {
          return true
        } else {
          this.$message.error(`请上传过名为${ name }的文件`)
          return false
        }
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

    /deep/ .el-form-item__content {
      margin-left: 150px !important;
      width: 30%;
    }
  }
</style>
