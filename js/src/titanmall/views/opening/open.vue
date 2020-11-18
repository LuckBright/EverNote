<template>
  <div class="opening-box">
    <div class="opening-details">
      <p class="wd info">
        <el-steps :active="active" class="steps">
          <el-step title="商城信息"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </p>
      <div v-if="active === 1" class="wd">
        <el-form
          :model="mallObj"
          :rules="rules"
          ref="mallForm"
          label-width="100px"
        >
          <el-form-item label="商城名称" prop="title">
            <el-input
              v-model="mallObj.title"
              style="width: 300px"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="商城LOGO">
            <upload-file2
              @success1="uploadSuccess"
              @before="uploadBefore"
              @change="fileList"
              @preview="preview"
              class="logo-img"
              :list="mallObj.imgUrls"
              :maxNum="1"
              previewInline="true"
              listType="picture-card"
            ></upload-file2>
            <el-dialog :visible.sync="previewVisible" append-to-body>
              <img width="100%" :src="previewImageUrl" alt/>
            </el-dialog>
            <p class="span-color tip">
              上传LOGO，让您的商城品牌化，支持PNG、JPG格式，只能上传一张，上传后点击图片可替换已经上传的LOGO
            </p>
          </el-form-item>
        </el-form>
        <!--<p class="radio">
          <el-radio-group v-model="mallObj.radio">
            <el-radio label="1">我已阅读并同意</el-radio>
          </el-radio-group>
          <el-button type="text">《尚医商城软件订购和服务协议》</el-button>
        </p>-->
        <el-button
          :disabled="showCreateBtn"
          type="primary"
          @click="addMall"
          style="margin-left: 20px"
        >创建商城并使用
        </el-button
        >
      </div>
      <div v-else-if="active === 2" class="wd pay">
        <p>
          <span class="label">商城服务费</span>
          <span>￥{{ price }}/年</span>
        </p>
        <div class="qr-box">
          <p>
            <vue-qr :text="qrUrl" :size="200"></vue-qr>
          </p>
          <el-button @click="getPrice">刷新二维码</el-button>
        </div>
      </div>
      <div v-else class="wd success">
        <img src="../../assets/img/cg.png"/>
        <p>恭喜您开通商城成功，开始销售商品吧。</p>
        <el-button type="primary" @click="openOk">开始使用</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './api'

  export default {
    data () {
      return {
        api,
        active: 1,
        rules: {
          title: [ { required: true, message: '请输入商城名称', trigger: 'blur' } ],
        },
        mallObj: {
          title: '',
          imgUrls: [],
          radio: '',
        },
        qrUrl: '',
        price: '',
        timer: '',
        showCreateBtn: false,
        previewVisible: false,
        previewImageUrl: '',
      }
    },
    created () {
      if (localStorage.getItem('mallName')) {
        this.active = 2
        this.getPrice()
      }
    },
    methods: {
      addMall () {
        this.$refs.mallForm.validate(valid => {
          if (valid) {
            // if (this.mallObj.radio !== "1") {
            //   this.$message({
            //     showClose: true,
            //     message: "请阅读协议",
            //     type: "warning"
            //   });
            //   return;
            // }
            let params = {
              name: this.mallObj.title,
              logo: this.mallObj.imgUrls.length
                ? this.mallObj.imgUrls[0].logoUrl.split('.cn/')[1]
                : '',
            }
            this.api.shopCreate(params).then(res => {
              if (res) {
                ++this.active
                localStorage.setItem('MALLSHOPID', res.token)
                this.getPrice()
              }
            })
          }
        })
      },
      uploadSuccess: async function (file) {
        this.showCreateBtn = false
        // 上传成功赋值
        let textUrl = 'https://' + file.Location
        this.previewImageUrl = textUrl
        let url = await this.$_imgCut(textUrl, '210x68')
        this.mallObj.imgUrls = [ { url, fileId: url, logoUrl: textUrl } ]
      },
      fileList: function (file) {
        // 删除赋值
        if (file.length === 0) {
          this.mallObj.imgUrls = []
        } else {
          this.mallObj.imgUrls = file
        }
      },
      preview (file) {
        this.previewVisible = true
      },

      // 上传之前
      uploadBefore () {
        this.showCreateBtn = true
      },

      // 获取价格及二维码
      getPrice () {
        this.api.shopRenewOrderPrice().then(res => {
          if (res) {
            this.price = this.$_narrowPrice(res, 100)
            let params = {
              price: res,
            }
            this.api.shopRenewOrderCreate(params).then(res => {
              if (res) {
                this.qrUrl = res.charge.credential.pay_info.qr
                if (this.timer) {
                  clearInterval(this.timer)
                }
                this.getPayStatus(res.statementId)
              }
            })
          }
        })
      },
      // 获取订单状态
      getPayStatus (statementId) {
        let params = {
          orderNo: statementId,
        }
        this.timer = setInterval(() => {
          this.api.shopRenewOrderStatus(params).then(res => {
            if (res) {
              clearInterval(this.timer)
              ++this.active
            }
          })
        }, 3000)
      },
      openOk () {
        localStorage.setItem('showNav', '1')
        // this.$store.commit('setShowNav', '1')
        this.$router.push('/titanmall/allinfo')
      },
    },
    destroyed () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
  }
</script>
<style lang="less" scoped>
  .steps {
    /deep/ div:first-child {
      .el-step__head {
        width: 95% !important;
        margin-left: 20px !important;
      }
    }

    /deep/ .el-step__head.is-finish {
      color: #1c7bef !important;
      border-color: #1c7bef !important;
    }

    /deep/ .el-step__title.is-finish {
      color: #1c7bef !important;
    }
  }

  .opening-box {
    height: 90vh;
    padding: 10px;

    .opening-details {
      background: #fff;
      height: 85vh;
      padding: 30px 40px 0;
    }

    /deep/ .logo-img .el-upload-list__item.is-success {
      img {
        width: 147px;
        object-fit: fill;
      }
    }

    .wd {
      width: 50%;
      padding-left: 10px;
    }

    .tip {
      line-height: 25px;
      margin-top: 5px;
    }

    .info {
      padding-left: 25px;
      margin-bottom: 40px;
    }

    .pay {
      p {
        font-size: 18px;
        line-height: 18px;
        margin-bottom: 20px;
        padding-left: 15px;

        .label {
          color: #999;
          margin-right: 20px;
        }
      }

      .qr-box {
        text-align: center;

        p {
          width: 200px;
          padding: 20px;
          margin: 10px auto;
          border: 1px solid #e5e5e5;
        }
      }
    }

    .success {
      text-align: center;

      p {
        font-size: 18px;
        line-height: 18px;
        color: #333;
        margin-bottom: 20px;
      }
    }

    .radio {
      margin: 0 0 20px 20px;
    }
  }
</style>
