<!-- 客服工作站 当日挂号-建档 by @zhenghongtao@everjiankang.com.cn -->
<template>
  <div class="page_layout_full" id="patientinfo">
    <div class="flex_column_full_hidden body">
      <template v-if="!isEdit || !patient">
        <ever-form2
          class="flex_layout_scroll form-required-color"
          :schema="schema"
          v-model="obj"
          :span="24"
          :api="api"
          :rules="rules"
          :info="true"
          style="margin-left:0px;"
          ref="patientmini"
          labelWidth="78px">
          <div slot="default" class="photo">
            <img :src="obj.avatarPic ? $ever.imgurl + obj.avatarPic : previews" />
          </div>
          <template slot="anonymous">
            <el-checkbox v-model="obj.anonymous" class="mgr10"></el-checkbox>
            <span>匿名建档</span>
            <lock-patientinfo @update="updateSecret"></lock-patientinfo>
            <reset-lock></reset-lock>
          </template>
          <template slot="name">
            <el-row>
              <el-col :span="24">
                <el-input
                  v-model.trim="obj.name"
                  placeholder="客户姓名"
                  @blur="checkRepeat"
                  :disabled="!obj.secret"
                >
                  <template slot="suffix">
                    <idcard-read @getData="(data) => { autoReadIdCard(data) }"></idcard-read>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </template>
          <template slot="mobile">
            <el-row>
              <el-col :span="20">
                <el-input
                  v-model="obj.mobile"
                  placeholder="请输入手机号"
                  @blur="checkRepeat"
                  v-on:input="inputTrigger"
                  :disabled="checkedMobile"
                ></el-input>
              </el-col>
              <el-col :span="3" class="ml5">
                <el-checkbox v-model="checkedMobile">暂无</el-checkbox>
              </el-col>
            </el-row>
          </template>
          <template slot="idNo">
            <el-input v-model="obj.idNo" placeholder="证件号" :disabled="isDisabled"></el-input>
          </template>
          <template slot="sex">
            <sys-type :disabled="!isSexDisabled" v-model="obj.sex" code="GBT.2261.1" :useValue="true"></sys-type>
          </template>
          <template slot="birthday">
            <age v-model="obj.birthday" :disabled="isDisableBirthday"></age>
            <!-- <age
              v-model="obj.agebirthday"
              :iden="obj.idNo"
              :rules="{require: false, validator: validateAge, trigger: 'blur'}"
              :disabled="!isDisableBirthday"
            ></age> -->
          </template>
          <template slot="visitCards">
            <el-form-item label="卡号" style="margin-left:-78px;" v-display="cardDisplay">
              <el-row>
                <el-col :span="8">
                  <el-select
                    v-model="obj.visitType"
                    placeholder="请选择"
                    style="width:100%;"
                    clearable
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="(item, i) in cardArr"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="16">
                  <div class="ml10">
                    <el-input
                      v-model="obj.no"
                      placeholder="请输入新的就诊卡号"
                      :maxlength="20"
                      style="width:100%;"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </template>
          <template slot="kinship">
            <el-select v-model="obj.kinship" placeholder="请选择客户关系" :clearable="true">
              <el-option
                v-for="item in kinshipData"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </template>
        </ever-form2>
        <div class="footer">
          <el-button type="primary" @click="save">保存</el-button>
          <!-- <el-button @click="cancle">取消</el-button> -->
          <el-button @click="cancle" v-if="obj.id">取消</el-button>
          <el-button @click="clear" v-if="!obj.id">清空</el-button>
          <div @click="showmore" class="mgt40">
            <span v-if="this.isShow" class="cBlue fr cur">展开更多信息></span>
            <span v-else class="cBlue fr cur">收起更多信息></span>
          </div>
        </div>
      </template>
      <keep-alive  v-else>
        <patient-info
          :obj="obj1"
          :isBirthday="isShowBirth"
          :isShow="isEdit"
          :cityData="cityData"
          @changeEdit="changeEdit"
        ></patient-info>
      </keep-alive>
    </div>
    <upload-Headimg
      ref="headimg"
      :visible.sync="isShowUpload"
      @close="closeDiaglog"
      :uploadImgType="uploadImgType"
      @update="updateHeadImg"
    ></upload-Headimg>
    <dialog-repeatlist ref="repeat" :tableData="repeatData" @updateInfo="updateInfo"></dialog-repeatlist>
  </div>
</template>
<script>
import api from '@/crm/store/memberapi'
import appointapi from '@/arrange/store/appointapi'
import age from '@/components/age'
import moment from 'moment'
import citys from '@/util/citys'
import lockPatientinfo from '@/crm/components/lock.patientinfo'
import resetLock from '@/crm/components/reset.lock'
import uploadHeadimg from '@/crm/components/upload.headimg'
import dialogRepeatlist from '@/crm/components/dialog.patient.repeatlist'
import patientInfo from '@/crm/components/patientinfo.readonly'
import { isRepeat, validateMobile } from '@/crm/util/common'
import { everprint, validateCardId, MOBILE_PATRN_MEMBER } from '@/util/common'
import { CARD_ID_PATTERN } from '@/util/validate'
import SourceCascader from '@/crm/components/sourcecascader'
import idcardRead from '@/components/readdevice/idcard/idcard'

let schema = [
  {
    name: 'anonymous',
    comp: 'custom'
  },
  {
    name: 'name',
    comp: 'custom',
    label: '姓名',
    span: 18
  },
  {
    name: 'sex',
    comp: 'custom',
    parentClass: 'custom-form-item',
    label: '性别'
  },
  {
    name: 'mobile',
    comp: 'custom',
    label: '手机号'
  },
  {
    name: 'idNo',
    span: 24,
    label: '身份证',
    comp: 'custom'
  },
  {
    name: 'birthday',
    comp: 'custom',
    span: 24,
    label: '出生日期'
  },
  {
    name: 'visitCards',
    comp: 'custom'
  },
  {
    name: 'country',
    label: '国籍',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'GBT.2659'
    }
  },
  {
    name: 'nation',
    label: '民族',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'GBT.3304'
    }
  },
  {
    name: 'marry',
    label: '婚姻',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.2'
    }
  },
  {
    name: 'medicalType',
    label: '医保',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'THC_CRM_INSURE'
    }
  },
  {
    name: 'kinship',
    label: '关系',
    span: 12,
    comp: 'custom'
  },
  {
    name: 'source',
    label: '来源',
    span: 12,
    comp: SourceCascader,
    props: {
      placeholder: '来源'
    }
  },
  {
    name: 'address',
    comp: 'everAddress',
    label: '住址',
    span: 24
  }
]
export default {
  props: ['patient'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    // let validateAge = function (rule, value, callback) {
    //   if (rule.required && (!value || value.age === '' || value.birthday === '')) {
    //     callback(new Error('请输入出生日期与年龄'))
    //   } else if (!/^\d+$/.test(value.age)) {
    //     callback(new Error('年龄数值非法'))
    //   } else {
    //     callback()
    //   }
    // }
    let _this = this
    let validateAddress = function (rule, value, callback) {
      if (!rule.required) return callback()
      let newVal = JSON.parse(value)
      if (!_this.obj.anonymous && newVal && newVal.addressDetail === '' || newVal.addressDetail === undefined) {
        callback(new Error('请输入详细地址'))
      } else {
        callback()
      }
    }
    obj.country = 'GJDQ_CHN'
    obj.nation = '664'
    obj.isShow = false
    obj.secret = true
    obj.address = ''
    obj.avatarPic = ''
    obj.birthday = ''
    obj.sex = ''
    obj.source = ''
    obj.marry = ''
    obj.visitType = ''
    obj.no = ''
    obj.visitCards = []
    return {
      api,
      obj,
      obj1: {},
      moreData: {},
      schema,
      appointapi,
      cardbookCode: 'CUSTOMER_LABEL_MEMBER',
      isEdit: false,
      show3: false,
      isShow: true,
      isShowUpload: false,
      isShowBirth: false,
      isDisabled: false,
      cardDisplay: false,
      repeatData: [],
      tempObj: {},
      // validateAge,
      validateAddress,
      patientName: '',
      uploadImgType: '',
      sexRadio: '',
      cityData: [],
      kinshipData: [],
      cardArr: [],
      previews: '/static/assets/avtarbg.png',
      hnFlag: this.$ever.getClinicConfig().memberModel,
      rules: {
        name: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 32, message: '长度为2-32位字符', trigger: 'blur' }
        ],
        sex: [
          { required: false, message: '请选择性别', trigger: ['change', 'blur'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 14, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: MOBILE_PATRN_MEMBER, message: '请输入正确的手机号码' }
        ],
        idNo: [
          { required: false, validator: validateCardId, trigger: 'blur' }
        ],
        birthday: [
          { required: false, message: '请填写出生日期', trigger: 'change' }
        ],
        country: [
          { required: false, message: '请选择国籍', trigger: 'change' }
        ],
        nation: [
          { required: false, message: '请选择民族', trigger: 'change' }
        ],
        medicalType: [
          { required: false, message: '请选择医保类型', trigger: 'change' }
        ],
        source: [
          { required: false, message: '请选择渠道来源', trigger: ['change', 'blur'] }
        ],
        marry: [
          { required: false, message: '请选择婚姻状况', trigger: 'change' }
        ],
        address: [
          { required: false, validator: validateAddress, message: '请填写联系地址', trigger: 'blur' }
        ]
      },
      checkedMobile: false,
      isDisableBirthday: false,
      isSexDisabled: true
    }
  },
  watch: {
    'patient': {
      handler: function (val) {
        if (val) {
          if (val.anonymous) this.getMousSn(val.anonymous)
          this.patientName = val.name
          this.obj1 = val
          this.obj1.birthday = val.birthday ? moment(val.birthday).format('YYYY-MM-DD') : ''
          if (val.birthday) {
            this.isShowBirth = moment(val.birthday).format('MM-DD') === this.$moment().format('MM-DD')
            if (this.isShowBirth) {
              this.$notify({
                customClass: 'el-notification right birContainer',
                iconClass: 'icon iconfont icon-bis cOrg',
                message: '今天是患者生日，请注意',
                duration: 3000
              })
            }
          }
          this.isEdit = true
          this.$emit('update')
          val.isShow = false
          this.$bus.$emit('showmore', val)
        } else {
          this.isEdit = false
          this.reset()
        }
      }
    },
    'obj.anonymous': {
      handler: function (val) {
        this.getMousSn(val)
        this.getRequiredConfig(val)
      }
    },
    'obj': {
      handler: function (val) {
        this.obj.birthday = val.birthday || ''
        if (val.sex) this.sexRadio = val.sex
        if (val.birthday && this.$moment().diff(val.birthday, 'years') < 14 && !val.anonymous) {
          this.$bus.$emit('show-border', true)
        }
        if (val.id) this.cardDisplay = true
      },
      deep: true
    },
    'isEdit': {
      handler: function (val) {
        if (!val) {
          !this.obj.address && this.getOrgAdress()
          this.getAllKinship()
        }
      },
      immediate: true
    },
    'sexRadio': {
      handler: function (val) {
        this.obj.sex = val
      }
    },
    'checkedMobile': {
      handler: function (flag) {
        this.rules.mobile[0].required = !flag
        if (flag) this.obj.mobile = ''
      }
    },
    'obj.idNo': {
      handler (val) {
        if (CARD_ID_PATTERN.test(val)) {
          this.obj.sex = (val.charAt(16) % 2 === 0) ? '2' : '1'
          this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = true
          this.obj.birthday = this.$moment(val.substring(6, 14)).format('YYYY-MM-DD')
          this.isSexDisabled = true
          this.isDisableBirthday = true
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = false
          if (!this.obj.secret) {
            this.isSexDisabled = true
            this.isDisableBirthday = false
          }
          this.obj.sex = ''
          this.obj.birthday = ''
          this.obj.sex = this.obj1.sex
          this.obj.birthday = this.obj1.birthday
        }
      }
    },
    // 'obj.idNo': {
    //   handler (val) {
    //     if (val) {
    //       if (CARD_ID_PATTERN.test(val)) {
    //         this.obj.sex = (val.charAt(16) % 2 === 0) ? '2' : '1'
    //         this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = true
    //         this.isSexDisabled = false
    //         this.isDisableBirthday = false
    //       } else {
    //         this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = false
    //         if (!this.obj.secret) {
    //           this.isSexDisabled = true
    //           this.isDisableBirthday = true
    //         }
    //         this.obj.sex = this.obj1.sex
    //         this.obj.agebirthday = {
    //           age: this.obj1.age,
    //           isMonth: this.obj1.isMonth,
    //           isDay: this.obj1.isDay,
    //           birthday: this.obj1.birthday,
    //           isHour: this.obj1.isHour,
    //           ageShowText: this.obj1.ageShowText
    //         }
    //       }
    //     }
    //   }
    // }
  },
  created () {
    this.getRequiredConfig()
    citys.getData().then(result => {
      this.cityData = result
    })
    this.$bus.$on('editmores', val => {
      this.moreData = val
    })
    this.$bus.$on('appoint:pay', (e) => {
      if (e) {
        this.reset()
      }
    })
    this.$bus.$on('moreshow', val => {
      this.obj.isShow = false
      this.isShow = val
    })
    if (this.hnFlag === '2') {
      this.isDisabled = true
    }
    this.getCardType()
  },
  directives: {
    display: {
      binding: function (el, binding, value) {
        if (binding.value) {
          el.parentNode.parentNode.style = 'display:none'
        } else {
          el.parentNode.parentNode.style = 'display:block'
        }
      },
      update: function (el, binding, value) {
        if (binding.value) {
          el.parentNode.parentNode.style = 'display:none'
        } else {
          el.parentNode.parentNode.style = 'display:block'
        }
      }
    }
  },
  methods: {
    updateSecret (val) {
      this.obj.secret = val
      this.isDisableBirthday = val
      this.isSexDisabled = val
    },
    getRequiredConfig (anonymous) {
      let _this = this
      let ansArr = ['idNo', 'householdAddress', 'address', 'contactMobile', 'birthday', 'medicalType', 'source', 'marry']
      this.api.getParam({ 'type': 1, 'anonymous': anonymous }).then(rs => {
        if (rs.head.errCode === 0) {
          rs.data.forEach(item => {
            if (_this.rules[item] && anonymous) {
              _this.rules[item][0].required = true
            } else {
              if (_this.rules[item]) {
                _this.rules[item][0].required = true
              }
            }
          })
          if (anonymous) {
            ansArr.forEach(item => {
              if (_this.rules[item]) {
                _this.rules[item][0].required = false
              }
            })
          }
        }
      })
    },
    changeEdit () {
      this.obj = Object.assign({}, this.obj, this.obj1)
      this.isEdit = false
      this.obj.mobile = this.obj1.mobile ? this.obj1.mobile.replace(/(\d)(?=(?:\d{4})+$)/g, '$1-') : ''
      this.obj.secret = false
      this.isDisableBirthday = false
      this.isSexDisabled = false
    },
    // 读取身份证信息回显数据。modify by lvjiangtao@everjiankang.com
    autoReadIdCard (rs) {
      let tempObj = {}
      if (rs.address) {
        api.getAddress({ 'address': rs.address }).then(res => {
          if (res.head.errCode === 0) {
            tempObj['province'] = res.provinceCode
            tempObj['county'] = res.countyCode
            tempObj['city'] = res.cityCode
            tempObj['addressDetail'] = res.addressDetail
            this.obj.householdAddress = tempObj
            this.$bus.$emit('showmore', this.obj)
          }
        })
      }
      this.obj.name = rs.name
      this.obj.idNo = rs.idCode
      this.obj.avatarPic = rs.image
      this.obj.type = '1'
      this.obj.sex = rs.sex === '男' ? '1' : '2'
      this.uploadImgType = 'img'
      this.$refs.headimg.beginUploadImg(this.obj.avatarPic, this.uploadImgType)
    },
    save () {
      delete this.moreData.mobile
      this.obj = Object.assign({}, this.obj, this.moreData)

      let concatFlag = !this.obj.anonymous && this.hnFlag === '2' && (this.$moment().diff(this.obj.birthday, 'years') < 14)
      if (concatFlag) {
        this.obj.contactList && this.obj.contactList.forEach(item => {
          if (item.type === '' || item.name === '' || item.mobile === '') {
            delete this.obj.contactList
            return false
          }
        })
      }
      if (concatFlag && !this.obj.contactList) {
        this.$messageTips(this, 'warning', '14岁以下儿童需要填写联系人关系、姓名和手机号')
        return false
      }
      this.obj.telephone = ''
      this.obj.birthday = this.obj.agebirthday || ''
      this.obj.mobile = this.obj.mobile ? this.obj.mobile.replace(/-/g, '') : ''
      this.obj.sex = this.sexRadio
      if (this.obj.visitType) {
        let tempObj = {
          type: this.obj.visitType,
          no: this.obj.no
        }
        this.obj.visitCards = []
        this.obj.visitCards.push(tempObj)
      }
      this.$refs.patientmini.$refs.form.validate(valid => {
        valid && api.createMemeber(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.$emit('success', rs.data)
            if (!this.cardDisplay) {
              everprint(this.cardbookCode, { patientId: this.patientId }, {
                preview: true,
                cb: _ => {
                  console.log('打印完成')
                },
                lang: '01'
              })
            }
            this.isEdit = true
            this.obj1 = rs.data
            if (rs.data.anonymous) this.getMousSn()
            rs.data['isShow'] = false
            this.isShow = true
            this.$bus.$emit('showmore', rs.data)
            this.moreData = {}
          }
        })
      })
    },
    clear () {
      this.reset()
      this.obj.sex = ''
      this.sexRadio = ''
      this.obj.anonymous = false
      this.$bus.$emit('_clearAll:patientmore')
    },
    cancle () {
      if (this.patient) {
        this.obj1 = Object.assign({}, this.patient)
        this.isEdit = true
        if (!this.isShow) {
          this.obj.isShow = !this.obj.isShow
          this.$bus.$emit('showmore', this.obj)
          this.isShow = true
        }
      }
    },
    showmore () {
      this.obj.isShow = !this.obj.isShow
      this.isShow = !this.obj.isShow
      if (!this.obj.contactList) this.obj.contactList = []
      // todo 数据过滤只传 更多信息中的数据key
      let tempObj = Object.assign({}, this.obj)
      Object.keys(tempObj).forEach(item => {
        this.schema.filter(el => {
          if (el.name === item) {
            delete tempObj[item]
          }
          delete tempObj['secret']
        })
      })
      this.$bus.$emit('showmore', tempObj)
    },
    getMousSn (flag) {
      api.getMousSn().then(rs => {
        if (rs.head.errCode === 0) {
          if (flag && !this.obj.name) {
            this.obj.name = '匿名' + rs.data.date + '-' + rs.data.sn
          }
        }
      })
    },
    async getOrgAdress () {
      let rs = await api.getOrgAdress()
      this.obj.address = rs.data || []
    },
    getAllKinship () {
      api.getAllKinship().then(rs => {
        this.kinshipData = rs.data || []
      })
    },
    updateHeadImg (val) {
      if (val) {
        this.obj.avatarPic = val
      }
    },
    closeDiaglog (val) {
      this.$refs.headimg.dialog = val
    },
    updateInfo (val) {
      this.tempObj = val
      this.$bus.$emit('change:patientName', val.id)
    },
    checkRepeat () {
      let val = { ...this.obj }
      if ((val.name && val.name.length >= 2) || val.mobile || val.socialSecurityNo || val.idNo) {
        val.mobile = val.mobile ? val.mobile.replace(/-/g, '') : ''
        isRepeat(val, this.tempObj).then(rs => {
          if (rs && rs.length > 0) {
            this.repeatData = rs
            this.$refs.repeat.dialogVisible = true
          }
        })
      }
    },
    reset () {
      this.obj.id = ''
      this.obj.name = ''
      this.obj.mobile = ''
      this.obj.idNo = ''
      this.obj.sex = ''
      this.sexRadio = ''
      this.obj.kinship = ''
      this.obj.birthday = ''
      // Object.keys(this.obj.agebirthday).forEach(key => {
      //   this.obj.agebirthday[key] = ''
      // })
      this.obj.nation = ''
      this.obj.marry = ''
      this.obj.medicalType = ''
      this.obj.address = ''
      this.obj.source = ''
      this.obj.country = 'GJDQ_CHN'
      this.obj.nation = '664'
      this.obj.no = ''
      this.cardDisplay = false
      this.obj.visitType = this.cardArr[0].id
      this.obj.secret = true
      this.obj.no = ''
      this.getOrgAdress()
      // 新增重置 情况tempObj logic
      Object.keys(this.tempObj).forEach(key => {
        this.tempObj[key] = ''
      })
      if (!this.isShow) {
        this.obj.isShow = !this.obj.isShow
        this.$bus.$emit('showmore', this.obj)
        this.isShow = true
      }
    },
    inputTrigger () {
      this.$set(this.obj, 'mobile', validateMobile(this.obj.mobile))
    },
    sexChange (e) {
      this.obj.sex = e
    },
    getCardType () {
      this.api.getCardType().then(rs => {
        if (rs.data[0]) {
          this.cardArr = rs.data
          this.obj.visitType = rs.data[0].id
          this.obj.no = ''
        }
      })
    }
  },
  components: {
    age,
    lockPatientinfo,
    resetLock,
    uploadHeadimg,
    dialogRepeatlist,
    patientInfo,
    SourceCascader,
    idcardRead
  }
}
</script>

<style scoped>
.header strong.title {
  padding-left: 6px;
  border-left: 3px solid #1c7bef;
  font-size: 16px;
  color: #000;
  line-height: 36px;
}
.body {
  font-size: 14px;
  line-height: 1.5;
  position: relative;
}
.body .el-form .el-row .el-col .el-form-item .el-form-item__label {
  margin-bottom: 0;
  width: 100px;
}
.body .el-form /deep/ .el-form-item__label {
  width: 100px;
  height: 32px !important;
}
.body .el-form /deep/ .el-form-item__content {
  line-height: 33px;
  height: 33px;
}
.body .photo {
  width: 70px;
  height: 70px;
  position: absolute;
  right: 0px;
  top: 40px;
}
.body .photo img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.footer {
  height: 36px;
  line-height: 36px;
  padding-top: 10px;
  padding-left: 78px;
  border-top: 1px solid #eee;
}

.mgt40 {
  margin-top: -36px;
}
#patientinfo .icon-bis {
  color: #f5a623;
  margin-left: -140px;
  position: relative;
  top: -2px;
}
</style>
