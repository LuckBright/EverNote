<template>
  <div class="register-h5">
    <div class="register-form">
      <div class="bg">
        <img src="../../assets/img/bgs.png" width="100%" alt>
      </div>
      <div class="form-wrap">
        <div v-if="isNotregiste">
          <el-form
            ref="baseForm"
            :disabled="isPC"
            :model="queryObj"
            :rules="rules"
            :inline="true"
            :hide-required-asterisk="false"
          >
            <div class="public-title">基本信息 Basic information</div>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="name" class="nomargin-bottom">
                  <label class="cGreen">
                    姓名 Full name
                    <span class="star">*</span>
                  </label>
                  <el-input v-model="queryObj.name" placeholder="请填写姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="sex" class="nomargin-bottom">
                  <label class="cGreen">
                    性别 Gender
                    <span class="star">*</span>
                  </label>
                  <ul class="pay-ul gender-ul">
                    <li v-for="item in genderOption" :key="item.id" @click="chooseGender(item)">
                      <div class="separate lh16">
                        <div class>
                          <i
                            class="icon iconfont cGreen"
                            :class="genderId === item.id?'icon-wancheng':'cilcle'"
                          ></i>
                        </div>
                        <div class="cBlack ml5">{{item.name}}</div>
                      </div>
                    </li>
                  </ul>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="birthday">
                  <label class="cGreen">
                    出生日期 Date of Birth
                    <span class="star">*</span>
                  </label>
                  <div>
                    <H5input
                      v-if="!isPC"
                      type="date"
                      :value.sync="queryObj.birthday"
                      :isError="isError"
                      :disabled="isPC"
                    ></H5input>
                    <div v-else style="height:30px;line-height：30px;">
                      <div v-if="queryObj.birthday">{{queryObj.birthday}}</div>
                      <div v-else style="color:#BBBBBB;">请输入出生日期</div>
                    </div>
                    <div style="width:100%;border-bottom:1px solid #BBBBBB;margin-top:3px;"></div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label>
                  <label :class="queryObj.country?'cGray':'cBlack12'">国籍 Nationality</label>
                  <H5select
                    v-if="!isPC"
                    code="GBT.2659"
                    v-model="queryObj.country"
                    :setValue="queryObj.country"
                    :disabled="isPC"
                  ></H5select>
                  <div v-else class="bb1 h30">
                    <span v-if="country">{{country}}</span>
                    <span v-else class="cGray fz14">请输入国籍</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="public-title">联系方式 Phone & Email</div>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="mobile">
                  <label class="cGreen">
                    移动电话 Cell Phone
                    <span class="star">*</span>
                  </label>
                  <el-input v-model="queryObj.mobile" placeholder="请填写移动电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="email">
                  <label :class="queryObj.email?'cGray':'cBlack12'">电子邮件 Email</label>
                  <el-input v-model="queryObj.email" placeholder="请填写电子邮件"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="public-title">紧急联系信息 Emergency Contact</div>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="contactName">
                  <label :class="queryObj.contactName?'cGray':'cBlack12'">紧急联系人 Contact name</label>
                  <el-input v-model="queryObj.contactName" placeholder="请填写紧急联系人姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label prop="contactMobile">
                  <label :class="queryObj.contactMobile?'cGray':'cBlack12'">移动电话 Cell Phone</label>
                  <el-input v-model="queryObj.contactMobile" placeholder="请填写移动电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label>
                  <label
                    :class="queryObj.contactType?'cGray':'cBlack12'"
                  >与患者关系 Relationship to Patient</label>
                  <H5select
                    v-if="!isPC"
                    code="GBT.4761"
                    v-model="queryObj.contactType"
                    :setValue="queryObj.contactType"
                    :disabled="isPC"
                  ></H5select>
                  <div v-else class="bb1 h30">
                    <span v-if="contactType">{{contactType}}</span>
                    <span v-else class="cGray fz14">请输入与患者关系</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form ref="payForm" :model="queryObj" :inline="true">
            <el-row>
              <el-col :span="24" class="al">
                <el-form-item label>
                  <div class="public-title">付款方式 Method for Payment</div>
                  <ul class="pay-ul">
                    <li v-for="item in payOption" :key="item.id" @click="choose(item)">
                      <div class="separate lh16">
                        <div class="cBlack">
                          <span class="circle_span"></span>
                          {{item.name}}
                        </div>
                        <div class="lh16">
                          <i
                            class="icon iconfont cGreen"
                            :class="payId === item.id?'icon-wancheng':'cilcle'"
                          ></i>
                        </div>
                      </div>
                    </li>
                  </ul>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-if="!isNotregiste" class="finished">
          <div>
            <i class="icon iconfont icon-wancheng cGreen"></i>
            <p class="fz18 cBlack">{{staticTips.title}}</p>
            <p class="fz14 cGray99">{{staticTips.content}}</p>
          </div>
        </div>
        <div v-if="isNotregiste" class="btn" width="100%">
          <el-button v-if="$route.query.isShow === 'true' || !isPC" type="primary" @click="onSubmit" class="btnwidth">提交</el-button>
        </div>
        <H5tips v-if="visible" @getType="getType"></H5tips>
        <!-- <H5tips @getType="getType"></H5tips> -->
      </div>
    </div>
  </div>
</template>
<script>
import H5select from '@/follow/components/h5-select'
import H5input from '@/follow/components/h5-input'
import H5tips from '@/follow/components/h5-tips'
import storage from '@/util/storage'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import sysvalue from '@/warehouse/store/sysvalueapi'

// import urlMap1 from '@/login/store/urls'
import globalUrlMap from '@/login/store/globalurls'
import { baseHost } from '@/store/basehost'
import sessionapi from '@/auth/store/sessionapi'
// import api from '@/html5/store/tplform.js'
import { isPc } from '@/util/common'

export default {
  components: { H5select, H5input, H5tips },
  async beforeRouteEnter (to, from, next) {
    if (!isPc()) {
      var tenantId = ''
      // 拼好全局环境的地址，获取该租户的配置信息（租户id，登录页面logo，租户名称）
      let _tmpHost = (baseHost.host.indexOf('//') > -1) ? baseHost.host.substring(baseHost.host.indexOf('//') + 2) : baseHost.host
      let tenantInfo = await request(globalUrlMap.clinicset.getWebConfig, {
        domainName: _tmpHost
      }, 'get')
      if (tenantInfo.head.errCode === 0) {
        tenantId = tenantInfo.data.tenantId
        if (tenantId) {
          // storage.setLocalStorage('TENANTID', tenantId)
          const params = {
            name: 'bpm',
            password: 'bpm_task_token',
            organizationId: tenantId
          }
          let b = await sessionapi.login(params)
          if (b.data && b.data.token) {
            storage.setLocalStorage('TOKEN', b.data.token)
          }
        }
      }
    }
    next(vm => {
      vm.patientId = to.query.patientId
      vm.visitNumber = to.query.visitNumber
      let patientId = vm.getParams('patientId')
      let visitNumber = vm.getParams('visitNumber')
      let creatTime = vm.getParams('creatTime')
      let externalId = vm.getParams('materialId')
      // 'dd0zJZuK5F9lKatYGTa' ||
      request(urlMap.follow.patientRegister.checkByPatientId, {
        patientId: patientId,
        sendTime: creatTime || new Date().getTime(),
        visitNumber: visitNumber,
        externalId: externalId
      }).then((res) => {
        if (res.head.errCode === 0) {
          if (res.data === 0) { // 未填写过登记表
            vm.isNotregiste = true
          } else if (res.data === 1 || res.data === 3) { // 三个自然日或者到诊失效
            if (!isPc()) {
              vm.isNotregiste = false
              vm.staticTips.content = '客户登记表已过期'
              vm.staticTips.title = '已过期'
            } else {
              vm.isNotregiste = true
            }
          } else if (res.data === 2) { // 已经完成了客户登记表的填写
            vm.isNotregiste = false
            if (!isPc()) {
              vm.isNotregiste = false
            } else {
              vm.isNotregiste = true
            }
          }
        }
      })
    })
  },
  async beforeCreate () {
  },
  mounted () {
  },
  created () {
    // this.getCountry()
    // this.getContacts()
    // let patientId = this.$route.params.id || ''
    let patientId = this.$route.params.id || this.getParams('patientId')
    this.getPatient(patientId)
  },
  data () {
    return {
      genderOption: [
        { id: '1', name: '男' },
        { id: '2', name: '女' }
      ],
      params: {
        patientId: '',
        visitNumber: '',
        creatTime: ''
      },
      patientId: '',
      visitNumber: '',
      value: '',
      isNotregiste: true, // 是否可以
      visible: false,
      staticTips: {
        title: '填写完成',
        content: '您已完成客户登记表的填写'
      },
      queryObj: {
        name: '',
        sex: '',
        birthday: '',
        country: '',
        mobile: '',
        contactName: '',
        contactMobile: '',
        contactType: '',
        paymentWay: ''
      },
      payOption: [
        { id: 1, name: '保险直接结算 Insurance Direct Billing' },
        { id: 2, name: '自费  Self Pay' },
        { id: 3, name: '保函  Guarantee Letter' },
        { id: 4, name: '家庭会员卡  Membership Card' },
      ],
      payId: '',
      genderId: '',
      isError: false,
      isPC: isPc(),
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '必填', trigger: 'blur', type: 'string' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '格式有误' }
        ],
        email: [
          { required: false, message: '必填', trigger: 'blur' },
          { max: 30, pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '格式有误' }
        ],
        contactMobile: [
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '格式有误' }
        ],
        contactName: [
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
      },
      countryDate: [],
      contactsDate: [],
      country: '',
      contactType: '',
      tenantId: ''
    }
  },
  watch: {
    'queryObj.name' (val, old) {
      if (val && val.length > 10) {
        this.queryObj.name = old
      }
    },
    'queryObj.contactName' (val, old) {
      if (val && val.length > 10) {
        this.queryObj.contactName = old
      }
    },
    'queryObj.mobile' (val, old) {
      if (val && val.length > 11) {
        this.queryObj.mobile = old
      }
    },
    'queryObj.contactMobile' (val, old) {
      if (val && val.length > 11) {
        this.queryObj.contactMobile = old
      }
    }
  },
  filters: {
  },
  methods: {
     // 获取当前环境对应的 登录logo，租户id，租户名称，租户选择皮肤
    async getTenantInfo () {
      // 拼好全局环境的地址，获取该租户的配置信息（租户id，登录页面logo，租户名称）
      let tenantInfo = await request(globalUrlMap.clinicset.getWebConfig, {
        domainName: localStorage.getItem('saashost') || baseHost.host
      }, 'get')
      if (tenantInfo.head.errCode === 0) {
        console.log(tenantInfo, 'tenantInfo')
      }
    },
    getPatient (patientId) {
      request(urlMap.follow.patientRegister.getByPatientId, {
        patientId: patientId || this.params.patientId,
      }, 'get').then((res) => {
        if (res && res.data) {
          this.queryObj = res.data
          this.genderId = this.queryObj.sex
          this.payId = this.queryObj.paymentWay
          if (this.queryObj.country) {
            sysvalue.listOnce('GBT.2659').then(result => {
              this.countryDate = result
              this.countryDate.filter(v => {
                if (v.code === this.queryObj.country) {
                  this.country = v.name
                }
              })
            })
          }
          if (this.queryObj.contactType) {
            sysvalue.listOnce('GBT.4761').then(result => {
              this.contactsDate = result
              this.contactsDate.filter(v => {
                if (v.code === this.queryObj.contactType) {
                  this.contactType = v.name
                }
              })
            })
          }
        }
      })
    },
    getParams (name) {
      let url = decodeURIComponent(this.$route.fullPath)
      // console.log('url===' + url)
      var result = url.match(new RegExp('[\\?\\&]' + name + '=([^\\&]+)', 'i'))
      if (result === null || result.length < 1) {
        return ''
      }
      return result[1]
    },
    getType (val) {
      if (val) {
        this.visible = false
        var patientId = this.getParams('patientId')
        var visitNumber = this.getParams('visitNumber')
        var creatTime = this.getParams('creatTime')
        var externalId = this.getParams('materialId')
        let params = {
          patientId: patientId,
          visitNumber: visitNumber,
          creatTime: creatTime,
          externalId: externalId,
          ...this.queryObj
        }
        // console.log('params:', params)
        request(urlMap.follow.patientRegister.create, params).then((res) => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '提交成功', '提示')
            this.visible = false
            this.isNotregiste = false
            // alert('提交成功' + this.isNotregiste)
          } else {
            // todo
            this.$messageTips(this, 'error', '提交失败', '稍后请重试')
            // alert(res + 'else')
          }
        }).catch(err => {
          // todo
          this.$messageTips(this, 'error', '提交失败', '稍后请重试')
          console.error(err)
          // alert(err + 'catch')
        })
      } else {
        this.visible = false
      }
    },
    onSubmit () {
      this.$refs.baseForm.validate(valid => {
        if (valid) {
          if (!this.queryObj.birthday) {
            this.isError = true
            this.visible = false
          } else {
            this.isError = false
            this.visible = true
          }
        }
      })
    },
    chooseGender (item) {
      if (this.isPC) {
        return
      }
      this.genderId = item.id
      this.queryObj.sex = item.id
    },
    choose (item) {
      if (this.isPC) {
        return
      }
      this.payId = item.id
      this.queryObj.paymentWay = item.id
    }
  }
}
</script>
<style lang="scss" scoped>
//移动端字体图标兼容问题
@font-face {
  font-family: "iconfont";
  src: url("../../../assets/theme/iconfont/iconfont.eot"); /* IE9*/
  src: url("../../../assets/theme/iconfont/iconfont.svg#iconfont") format("svg"),
    /* iOS 4.1- */ url("../../../assets/theme/iconfont/iconfont.woff")
      format("woff"),
    /* chrome、firefox */ url("../../../assets/theme/iconfont/iconfont.ttf")
      format("truetype"); /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
}
// .iconfont{
//     font-family:"iconfont" !important;
//     font-size:16px;font-style:normal;
//     -webkit-font-smoothing: antialiased;
//     -webkit-text-stroke-width: 0.2px;
//     -moz-osx-font-smoothing: grayscale;
//   }
body {
  margin: 0;
  padding: 0;
}
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.register-h5 {
  font-size: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  // 修改验证的样式
  .el-form:not(.custom-form) {
    /deep/ .el-form-item:not(.custom-form-item) {
      .el-form-item__content {
        .el-form-item__error {
          color: red !important;
          border: 0 none;
          background-color: transparent;
          margin-top: -33px;
        }
        .el-form-item__error::before {
          display: none;
        }
      }
    }
  }
  .el-form:not(.custom-form) {
    /deep/ .el-form-item.is-error:not(.not-required) {
      .el-input input {
        background-color: #ffffff;
      }
    }
  }
  .cGreen {
    color: #1eb4b6;
    font-size: 12px;
  }
  .cGray {
    color: #bbbbbb;
    font-size: 12px;
  }
  .cGray99 {
    color: #999999;
  }
  .cBlack12 {
    color: #333333;
    font-size: 12px;
  }
  .cBlack {
    color: #333333;
  }
  .fz18 {
    font-size: 18px;
    font-weight: 700;
  }
  .fz14 {
    font-size: 14px;
  }
  .fz16 {
    font-size: 16px;
  }
  .lh16 {
    line-height: 16px;
  }
  .ml5 {
    margin-left: 5px;
  }
  .bb1 {
    border-bottom: 1px solid #bbbbbb;
  }
  .h30 {
    height: 30px;
  }
  .register-form {
    background: #e7e7eb;
    position: relative;
    max-width: 500px;
    .form-wrap {
      position: relative;
      left: 0px;
      margin: 0 16px;
      margin-top: -400px;
    }
    .el-form {
      background: #fff;
      border-radius: 8px;
      padding: 30px 15px;
      .nomargin-bottom {
        margin-bottom: 0px;
      }
      .star {
        color: #f83737;
        font-size: 16px;
      }
      .public-title {
        font-size: 16px;
        color: #333333;
        font-weight: 700;
        margin-bottom: 20px;
        border-left: 4px solid #1eb4b6;
        padding-left: 5px;
        line-height: 16px;
      }
      /deep/ .el-form-item.is-required:not(.not-required) {
        .el-input input {
          background-color: #ffffff;
        }
        .el-radio__inner {
          background-color: #ffffff;
        }
        .is-checked .el-radio__inner {
          background-color: #1c7bef;
        }
      }
      .pay-ul {
        padding: 0px;
        li {
          // list-style: disc;
          // color: #1EB4B6;
          margin-top: 20px;
        }
        .separate {
          display: flex;
          justify-content: space-between;
          line-height: 16px;
          i {
            font-size: 16px;
            vertical-align: middle;
          }
          .circle_span {
            display: inline-block;
            width: 4px;
            height: 4px;
            border-radius: 2px;
            background-color: #1eb4b6;
            vertical-align: middle;
            margin-right: 6px;
          }
          .cilcle {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 1px solid #1eb4b6;
            border-radius: 8px;
            vertical-align: middle;
          }
        }
      }
      .gender-ul {
        display: inline-block;
        margin: 0px;
        margin-left: 15px;
        li {
          list-style: none;
          display: inline-block;
        }
        li:nth-child(2) {
          margin-left: 10px;
          .separate {
            div:nth-child(1) {
              margin-left: 5px;
            }
          }
        }
      }
    }
    .el-form:nth-child(2) {
      margin-top: 10px;
    }
    .el-input {
      /deep/ .el-input__inner {
        border: 0 none;
        border-bottom: 1px solid #bbbbbb;
        border-radius: 0px;
        height: 30px;
        padding: 0px;
      }
    }
    .el-input.is-disabled {
      /deep/ .el-input__inner {
        background-color: #ffffff;
      }
    }
    .finished {
      height: 468px;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px 15px;
      margin-bottom: 60px;
      text-align: center;
      div {
        margin-top: 80px;
      }
      i {
        font-size: 65px;
      }
      .fz18 {
        margin-bottom: 10px;
      }
    }
    input {
      border: 0 none;
      border-bottom: 1px solid #bbbbbb;
      border-radius: 0px;
      height: 30px;
    }
    .el-form {
      /deep/ .el-form-item {
        width: 100%;
        .el-form-item__content {
          width: 100%;
          line-height: none;
        }
      }
    }
  }
  .btn {
    margin-top: 15px;
    margin-bottom: 40px;
    .btnwidth {
      width: 100%;
      height: 50px;
      background: #00aaad;
      border: 1px solid #00aaad;
      border-radius: 4px;
    }
  }
}
/deep/ .el-message-box__wrapper {
  .el-message-box {
    .el-message-box__btns {
      display: flex !important;
      .el-message-box__btns {
        .el-button--small {
          width: 50% !important;
        }
      }
    }
  }
}
.el-message-box .el-message-box--center /deep/ .el-message-box__btns {
  display: flex !important;
}
input::input-placeholder {
  color: #bbbbbb;
  font-weight: 400;
}
::-webkit-input-placeholder {
  color: #bbbbbb;
  font-weight: 400;
}

@media screen and (max-width: 500px) {
  .register-h5 .register-form .form-wrap {
    margin-top: -260px;
  }
}
.el-form:not(.custom-form)
  .el-form-item:not(.custom-form-item)
  /deep/
  .el-form-item__content
  .el-form-item__error {
  right: 6px;
}
</style>
