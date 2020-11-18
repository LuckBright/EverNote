<template>
  <div class="main">
    <div class="region mall-form">
      <el-form
        :model="formObj"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="商城开通日期" class="row-text date-text">
          <span>{{ formObj.validStartTime }}</span>
        </el-form-item>
        <el-form-item label="商城有效期" class="row-text validEndTime-text">
          <span>{{ formObj.validEndTime }}</span>
          <el-button
            type="text"
            class="lf"
            @click="
              () => {
                $router.push('/titanmall/renew');
              }
            "
          >立即续费
          </el-button
          >
        </el-form-item>
        <el-form-item label="商城主页地址">
          <el-input
            style="width: 650px"
            v-model="formObj.mallUrl"
            size="small"
            :disabled="true"
          ></el-input>
          <el-button
            type="text"
            class="lf"
            v-clipboard:copy="formObj.mallUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制链接
          </el-button
          >
        </el-form-item>
        <el-form-item label="商城名称" prop="name">
          <el-input
            v-model="formObj.name"
            class="input-width"
            size="small"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <p class="logo">
          <span class="span-width">
            商城LOGO
          </span>
          <upload-file2
            class="logo-img"
            @success1="uploadSuccess"
            @change="fileList"
            @preview="preview"
            :list="formObj.imgUrl"
            :maxNum="1"
            previewInline="true"
            listType="picture-card"
          ></upload-file2>
          <el-dialog :visible.sync="previewVisible" append-to-body>
            <img width="100%" :src="previewImageUrl" alt/>
          </el-dialog>
          <span class="span-color img-tip">
            图片的高度不小于120px（不大于500px），宽度无硬性规定，建议保持比例的情况下小于400px以保持足够的识别度。（logo图案周围无空白不可侵犯区域）
          </span>
          <span
            class="img-bottom-tip span-color"
          >上传您商城logo图片，建议上传白色背景或者透明背景的PNG或者未经压缩的JPG图片。</span
          >
        </p>
        <el-form-item label="客服电话">
          <el-input
            class="input-width"
            size="small"
            maxlength="12"
            v-model="formObj.servicePhone"
            onkeyup="value=value.replace(/[^\d-]/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="客服微信">
          <el-input
            class="input-width"
            size="small"
            v-model="formObj.serviceWeChat"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="客服公众号">
          <el-input
            class="input-width"
            size="small"
            v-model="formObj.servicePublic"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺ID">
          {{ formObj.id }}
        </el-form-item>
      </el-form>
      <p class="z-add-btn">
        <el-button
          :disabled="disabledAddBtn"
          size="small"
          type="primary"
          @click="addInfo"
        >保存信息
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
        formObj: {
          servicePublic: '',
          serviceWeChat: '',
          servicePhone: '',
          mallUrl: '',
          name: '',
          imgUrl: [],
          validStartTime: '',
          validEndTime: '',
          logo: '',
          id: '',
        },
        rules: {
          name: [ { required: true, message: '请输入商城名称', trigger: 'blur' } ],
        },
        previewVisible: false,
        previewImageUrl: '',
        imgUrl: localStorage.getItem('IMGCDN'),
        disabledAddBtn: false,
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      onCopy (e) {
        this.$message({
          message: '复制成功',
          type: 'success',
        })
      },
      onError (e) {
        this.$message.error('复制失败')
      },
      async uploadSuccess (file) {
        // 上传成功赋值
        let textUrl = 'https://' + file.Location
        this.previewImageUrl = textUrl
        let url = await this.$_imgCut(textUrl, '210x68')
        this.formObj.imgUrl = [ { url, fileId: url } ]
        this.formObj.logo = textUrl
      },
      fileList (file) {
        // 删除赋值
        if (file.length === 0) {
          this.formObj.imgUrl = []
          this.formObj.logo = ''
        } else {
          this.formObj.imgUrl = file
        }
      },
      preview (file) {
        this.previewVisible = true
      },
      /**
       * 添加信息
       */
      addInfo () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.disabledAddBtn = true
            this.formObj.logo = this.formObj.logo.includes('.cn/') ? this.formObj.logo.split('.cn/')[1] : this.formObj.logo
            this.api.shopSave(this.formObj).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
              }
              this.getInfo()
              setTimeout(() => {
                this.disabledAddBtn = false
              }, 1000)
            })
          }
        })
      },
      /**
        获取商城信息
       */
      getInfo () {
        this.api.shopDetail().then(async res => {
          this.formObj = { ...this.formObj, ...res }
          if (res.logo) {
            let textUrl
            if (res.logo.includes('https')) {
              textUrl = res.logo
            } else {
              textUrl = this.imgUrl + res.logo
            }
            this.previewImageUrl = textUrl
            let url = await this.$_imgCut(textUrl, '210x68')
            this.formObj.imgUrl = [ { url, fileId: url } ]
          } else {
            this.formObj.imgUrl = []
            this.formObj.logo = ''
          }
        })
        this.formObj.mallUrl = this.$ever.mallHost + this.$ever.h5MallIndex + '/home?shop=' + localStorage.getItem('MALLSHOPID')
      },
    },
  }
</script>
<style lang="less" scoped>
  .mall-form {
    height: 90vh;

    /deep/ .el-form-item {
      margin-bottom: 20px;
    }

    .row-text {
      height: 30px;

      /deep/ .el-form-item__content {
        height: 30px;
        line-height: 36px;
      }
    }

    .date-text {
      margin-bottom: 10px!important;
    }

    .validEndTime {
      margin-bottom: 22px;
    }

    .input-width {
      width: 294px;
    }

    .span-width {
      display: inline-block;
      font-size: 14px;
      color: #606266;
      width: 90px;
      text-align: right;
      margin-right: 10px;
    }

    .img-tip {
      display: inline-block;
      width: 357px;
      margin-left: 10px;
      margin-top: 10px;
      font-size: 12px;
      vertical-align: top;
    }

    .img-bottom-tip {
      display: block;
      margin: 10px 0 10px 100px;
      font-size: 12px;
    }

    .lf {
      margin-left: 10px;
    }

    .logo {
      /deep/ .logo-img .el-upload-list__item.is-success {
        img {
          width: 147px;
          object-fit: fill;
        }
      }
    }
    .z-add-btn {
      padding-left: 100px;
    }
  }
</style>
