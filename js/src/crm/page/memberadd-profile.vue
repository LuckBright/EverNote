<template>
  <div class="main-war add_user_info">
    <el-row class="title">
      <el-col>
        <span class="name">基本信息</span>
        <span class="ml30">
          <el-checkbox v-model="obj.anonymous" label="匿名用户"></el-checkbox>
        </span>
      </el-col>
    </el-row>
    <div class="l1">
      <el-row>
        <el-col :span="16">
          <div class="userinfo">
            <ever-form2
              class="form-required-color"
              ref="userinfo"
              label-position="right"
              :schema="schema"
              v-model="obj"
              :span="12"
              :rules="rules"
            >
              <template slot="name">
                <el-row>
                  <el-col :span="24">
                    <el-input v-model.trim="obj.name" placeholder="客户姓名" @blur="checkRepeat">
                      <template slot="suffix">
                        <idcard-read @getData="autoReadIdCard"></idcard-read>
                      </template>
                    </el-input>
                    <!-- <span class="icon-spancard" @click="autoReadIdCard">
                      <i class="icon iconfont icon-menzhen-shenfenzheng"></i>
                    </span> -->
                  </el-col>
                </el-row>
              </template>
              <template slot="source">
                <source-cascader v-model="obj.source" placeholder="渠道来源"></source-cascader>
              </template>
              <template slot="mobile">
                <el-row>
                  <el-col :span="20">
                    <el-input
                      v-model="obj.mobile"
                      placeholder="请输入手机号"
                      @blur="checkRepeat"
                      v-on:input="inputTrigger"
                      :disabled="obj.checkedMobile"
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox class="ml5" v-model="obj.checkedMobile">暂无</el-checkbox>
                  </el-col>
                </el-row>
              </template>
              <template slot="birthday">
                <!-- <age v-model="obj.birthday" :disabled="disabled"></age> -->
                <age-birthday v-model="obj.birthday" :disabled="disabled"></age-birthday>
              </template>
              <template slot="telephone">
                <sys-text v-model="obj.telephone" placeholder="座机号"></sys-text>
              </template>
              <template slot="remark">
                <el-input
                  v-model="obj.remark"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 4}"
                  placeholder="请输入备注"
                ></el-input>
              </template>
              <template slot="objLabelList">
                <div class="fixFirstMargin">
                  <el-tag
                    :key="tag"
                    v-for="tag in tags"
                    closable
                    :disable-transitions="false"
                    @close="removeTag(tag)"
                  >{{tag}}</el-tag>
                  <div v-if="inputVisible" style="display:inline-block">
                    <el-autocomplete
                      class="input-new-tag"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      :fetch-suggestions="querySearch"
                      :select-when-unmatched="true"
                      @select="handleSelect"
                    ></el-autocomplete>
                  </div>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
                </div>
              </template>
              <template slot="default">
                <span></span>
              </template>
            </ever-form2>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="img-con">
            <p class="img-title">头像</p>
            <div class="img-avt">
              <ever-upload1 v-model="obj.avatarPic" ref="upload" :limit="1"></ever-upload1>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="!isAppoint">
        <el-col>
          <h3 class="title-base">就诊卡</h3>
          <ever-form2
            :schema="schema2"
            v-model="obj2"
            :api="api"
            :rules="rules"
            label-position="right">
            <template slot="visitNos">
              <medical-number v-model="obj2.visitNos"></medical-number>
            </template>
            <div slot="default"></div>
          </ever-form2>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="detail-war" v-show="infoDetailShowFlag">
            <h3 class="title-base">更多信息</h3>
            <ever-form2
              ref="moreinfo"
              class="form-required-color"
              :schema="schema1"
              v-model="obj1"
              :api="api"
              :rules="rules"
              label-position="right">
              <template slot="iden">
                <other-papers v-model="obj1.iden"></other-papers>
              </template>
              <template slot="contactMobile">
                <contacts v-model="obj1.contactList" :is-require="obj1.contactsRequire"></contacts>
              </template>
              <template slot="unit">
                <div class="nearleft">g</div>
              </template>
              <div slot="default"></div>
            </ever-form2>
          </div>
        </el-col>
        <el-col>
          <a
            href="javascript:;"
            class="bottom-btn more"
            :class="infoDetailShowFlag ? 'on' : ''"
            @click="infoDetailShow()"
          >更多信息</a>
        </el-col>
      </el-row>
    </div>
    <hr />
    <activity-list ref="activitylist" :dialogvisible="classPop" @close="closeTypePop"></activity-list>
    <upload-Headimg
      ref="headimg"
      :visible.sync="isShowUpload"
      :uploadImgType="uploadImgType"
      @close="closeDiaglog"
      @update="updateHeadImg"
    ></upload-Headimg>
    <dialog-repeatlist ref="repeat" :tableData="repeatData" @updateInfo="updateInfo"></dialog-repeatlist>
  </div>
</template>

<script>
import api from '../store/memberapi'
import macapi from '../store/memberactivityapi'
import tagapi from '../store/tagapi'
// import snapi from '../../workspace/store/userbaseapi'
import webcam from '../../workspace/page/webcam'
import VueCropper from 'vue-cropper'
import personSelect from '../page/personselect'
import activityList from '../page/activitylist'
import otherPapers from '../components/otherpapers'
import medicalNumber from '../components/medicalnumber'
import age from '@/components/age'
import contacts from '../components/contacts'
import { validateCardId, validateTelePhone, MOBILE_PATRN_MEMBER, validateEnglishName, validateEmail, CARD_ID_PATTERN } from '@/util/validate'
import uploadHeadimg from '@/crm/components/upload.headimg'
import dialogRepeatlist from '@/crm/components/dialog.patient.repeatlist'
import { isRepeat, validateMobile } from '@/crm/util/common'
import SourceCascader from '@/crm/components/sourcecascader'
import sysvalue from '@/warehouse/store/sysvalueapi'
import IdcardRead from '@/components/readdevice/idcard/idcard'
import ageBirthday from '@/crm/components/age.birthday'

let schema = [
  {
    name: 'name',
    comp: 'custom',
    span: 12,
    label: '姓名'
  },
  {
    name: 'sex',
    span: 12,
    label: '性别',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1',
      useValue: true
    }
  },
  {
    name: 'mobile',
    span: 12,
    comp: 'custom',
    label: '手机号'
  },
  {
    name: 'telephone',
    label: '座机号',
    comp: 'custom',
    props: {
      placeholder: '请输入座机号'
    }
  },
  {
    name: 'source',
    label: '渠道来源',
    comp: 'custom'
  },
  {
    name: 'birthday',
    comp: 'custom',
    label: '年龄'
  },
  {
    name: 'engName',
    max: 40,
    label: '英文名'
  },
  {
    name: 'idNo',
    placeholder: '证件号',
    label: '身份证号'
  },
  {
    name: 'objLabelList',
    label: '标签',
    comp: 'custom'
  },
  {
    name: 'remark',
    label: '备注',
    comp: 'custom',
    span: 24
  }
]

let schema1 = [
  {
    name: 'country',
    label: '国家',
    span: 6,
    comp: 'sys-type',
    props: {
      code: 'GBT.2659'
    }
  },
  {
    name: 'nation',
    label: '民族',
    span: 6,
    comp: 'sys-type',
    props: {
      code: 'GBT.3304'
    }
  },
  {
    name: 'language',
    span: 6,
    label: '常用语言',
    comp: 'sys-type',
    props: {
      code: 'THC_SYS_LANGUAGE'
    }
  },
  {
    name: 'bloodType',
    label: '血型',
    span: 5,
    comp: 'sys-type',
    props: {
      code: 'CV04.50.005'
    }
  },
  {
    name: 'marry',
    label: '婚姻状况',
    span: 6,
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.2'
    }
  },
  {
    name: 'career',
    span: 6,
    label: '行政职称',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.4'
    }
  },
  {
    name: 'company',
    span: 6,
    label: '工作单位'
  },
  {
    name: 'workAddress',
    comp: 'everAddress',
    span: 20,
    label: '工作地址'
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 4
  },
  {
    name: 'householdAddress',
    comp: 'everAddress',
    label: '户口地址',
    span: 20
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 4
  },
  {
    name: 'address',
    comp: 'everAddress',
    label: '联系地址',
    span: 20
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 4
  },
  {
    name: 'wechat',
    placeholder: '微信号',
    span: 6,
    max: 30,
    label: '微信号'
  },
  {
    name: 'weibo',
    placeholder: '微博昵称',
    span: 6,
    max: 30,
    label: '微博昵称'
  },
  {
    name: 'qq',
    placeholder: 'QQ号码',
    span: 6,
    max: 30,
    label: 'QQ'
  },
  {
    name: 'email',
    placeholder: 'Email',
    span: 5,
    max: 30,
    label: 'Email'
  },
  {
    name: 'iden',
    span: 24,
    comp: 'custom',
    label: '其他证件'
  },
  {
    name: 'birthAddress',
    comp: 'everAddress',
    span: 18,
    label: '出生地址'
  },
  {
    name: 'nativeAddress',
    comp: 'everAddress',
    span: 18,
    label: '籍贯地址'
  },
  {
    name: 'contactMobile',
    comp: 'custom',
    span: 24,
    label: '联系人'
  },
  {
    name: 'guardianList',
    comp: contacts,
    span: 18,
    label: '监护人'
  }
]
let schema2 = [
  {
    name: 'visitNos',
    span: 24,
    comp: 'custom',
    label: '就诊卡'
  }
]
export default {
  props: ['isComponent', 'patient'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    var obj1 = this.$ever.createObjFromSchema(schema1)
    var obj2 = this.$ever.createObjFromSchema(schema2)
    obj.sex = ''
    obj.avatarPic = ''
    obj.objLabelList = []
    obj.base64ImgPostFlag = false
    obj.anonymous = false
    obj.agebirthday = ''
    obj.birthday = ''
    // 联系人
    obj1.address = ''
    obj1.contactList = []
    obj1.guardianList = []
    obj1.contactsRequire = false
    obj.checkedMobile = false
    return {
      api,
      // snapi,
      macapi,
      tagapi,
      schema,
      schema1,
      schema2,
      obj,
      obj1,
      obj2,
      isAppoint: true,
      // validateMonth: validateMonth,
      // validateAge: validateAge,
      infoDetailShowFlag: false,
      photoId: true,
      classPop: false,
      isShowUpload: false,
      inputVisible: false,
      camURL: '',
      inputValue: '',
      imgViewUrl: '',
      faceViewUrl: '',
      uploadImgType: '',
      tags: [],
      restaurants: [],
      objLabelList: [],
      activiOptions: [],
      tempObj: {},
      repeatData: [],
      objId: this.$route.params.id > -1 ? this.$route.params.id : null,
      need_contact_minage: this.$ever.getClinicConfig().need_contact_minage,
      rules: {
        name: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 32, message: '长度为2-32位字符', trigger: 'blur' }
        ],
        sex: [
          { required: false, message: '请选择性别', trigger: ['blur', 'change'] }
        ],
        birthday: [
          { required: false, message: '请填写出生日期', trigger: ['blur', 'change'] }
        ],
        idNo: [
          { required: false, validator: validateCardId, trigger: 'blur' }
        ],
        source: [
          { required: false, message: '请选择渠道来源', trigger: ['change', 'blur'] }
        ],
        levelId: [
          { required: false, message: '强选择客户级别', trigger: ['change', 'blur'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 14, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: MOBILE_PATRN_MEMBER, message: '请输入正确的手机号码' }
        ],
        telephone: [
          { required: false, validator: validateTelePhone, trigger: 'blur' }
        ],
        country: [
          { required: false, message: '请选择国籍', trigger: ['change', 'blur'] }
        ],
        nation: [
          { required: false, message: '请选择民族', trigger: ['change', 'blur'] }
        ],
        language: [
          { required: false, message: '请选择常用语言', trigger: ['change', 'blur'] }
        ],
        bloodType: [
          { required: false, message: '请选择血型', trigger: ['change', 'blur'] }
        ],
        marry: [
          { required: false, message: '请选择婚姻状况', trigger: ['change', 'blur'] }
        ],
        career: [
          { required: false, message: '请填写职业', trigger: 'blur' }
        ],
        company: [
          { required: false, message: '请填写工作单位', trigger: 'blur' }
        ],
        companyMobile: [
          { required: false, message: '请填写单位电话', trigger: 'blur' }
        ],
        workAddress: [
          { required: false, message: '请填写工作地址', trigger: 'blur' }
        ],
        address: [
          { required: false, message: '请填写联系地址', trigger: 'blur' }
        ],
        householdAddress: [
          { required: false, message: '请填写户口地址', trigger: 'blur' }
        ],
        birthAddress: [
          { required: false, message: '请填写出生地址', trigger: 'blur' }
        ],
        iden: [
          { required: false, message: '请填写其他证件', trigger: ['change', 'blur'] }
        ],
        contactMobile: [
          { required: false, message: '请填写联系人', trigger: ['change', 'blur'] }
        ],
        wechat: [
          { required: false, message: '请输入正确的微信号', trigger: 'blur' },
          { max: 30, pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/, message: '请输入正确的微信号' }
        ],
        qq: [
          { required: false, message: '请输入正确的qq号码', trigger: 'blur' },
          { max: 30, pattern: /^[1-9]\d{4,9}$/, message: '请输入正确的qq号码' }
        ],
        email: [
          { required: false, validator: validateEmail, trigger: 'blur' },
        ],
        engName: [
          { required: false, validator: validateEnglishName, trigger: 'blur' },
        ]
      },
      checkedMobile: false,
      disabled: false
    }
  },
  created () {
    this.setInitValue()
    if (this.$route.path.indexOf('/crm/register') > -1) {
      this.isAppoint = true
    } else if (this.$route.path.indexOf('/crm/memberadd') > -1) {
      this.isAppoint = false
    }
    this.getRequiredConfig()
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    'obj': {
      handler: function (val, oldVal) {
        if (val.agebirthday && val.agebirthday.birthday) {
          this.obj.birthday = val.agebirthday.birthday
        }
        this.$emit('formChange1', val)
      },
      deep: true
    },
    'obj1': {
      handler: function (val, oldVal) {
        this.$emit('formChange2', val)
      },
      deep: true
    },
    'obj2': {
      handler: function (val, oldVal) {
        this.$emit('formChange3', val)
      },
      deep: true
    },
    'obj.idNo': {
      handler (val) {
        if (CARD_ID_PATTERN.test(val)) {
          this.obj.sex = (val.charAt(16) % 2 === 0) ? '2' : '1'
          this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = true
          this.obj.birthday = this.$moment(val.substring(6, 14)).format('YYYY-MM-DD')
          this.disabled = true
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = false
          this.obj.sex = ''
          this.obj.birthday = ''
          this.disabled = false
        }
      }
    },
    'patient' () {
      this.setInitValue()
    },
    'obj.anonymous': {
      handler: function (val) {
        this.obj.anonymous = val
        this.getMousSn(val)
        this.getRequiredConfig(val)
      },
      deep: true
    },
    'obj.checkedMobile': {
      handler: function (flag) {
        this.rules.mobile[0].required = !flag
        if (flag) this.obj.mobile = ''
      }
    },
    'obj.birthday': {
      handler (val) {
        if (this.need_contact_minage) {
          let year = this.$moment(val).year() - (this.$moment(new Date()).year() - this.need_contact_minage)
          if (year === 0) {
            let month = this.$moment(val).month() - this.$moment(new Date()).month()
            if (month === 0) {
              let day = this.$moment(val).date() - this.$moment(new Date()).date()
              this.obj1.contactsRequire = day > 0
            } else {
              this.obj1.contactsRequire = month > 0
            }
          } else {
            this.obj1.contactsRequire = year > 0
          }
        }
      },
      deep: true
    }
  },
  methods: {
    setInitValue () {
      if (this.patient && (!this.patient.patientOrg || !this.patient.patientOrg.outpatientNumber)) {
        this.obj.id = this.patient.id
        // this.obj.agebirthday = this.patient.agebirthday
        this.obj.birthday = this.patient.birthday
        this.obj.name = this.patient.name
        this.obj.sex = this.patient.sex
        this.obj.mobile = this.patient.mobile
        this.obj.remark = this.patient.remark
        this.obj.idNo = this.patient.idNo
        this.obj.source = this.patient.source
        this.obj.anonymous = this.patient.anonymous
        this.obj.member = this.patient.member
        this.objLabelList = this.patient.member && this.patient.member.objLabelList ? this.patient.member.objLabelList.map(item => {
          return item.labelId
        }) : []
        this.tags = this.patient.member && this.patient.member.objLabelList ? this.patient.member.objLabelList.map(item => {
          return item.labelName
        }) : []
      } else {
        this.obj.id = ''
        // this.obj.agebirthday = ''
        this.obj.sex = ''
        this.obj.birthday = ''
        this.obj.mobile = ''
        this.obj.remark = ''
        this.obj.idNo = ''
        this.obj.source = ''
        this.obj.member = null
        this.objLabelList = []
        this.tags = []
      }
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
    infoDetailShow () {
      this.infoDetailShowFlag = !this.infoDetailShowFlag
    },
    popUploadDialog (val) {
      this.$refs.headimg.dialog = true
      this.uploadImgType = val
    },
    closeTypePop () {
      this.$refs.classlist.dialog = false
      this.getClassList(schema, 'typeId')
    },
    removeTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue.length > 20) {
        this.$messageTips(this, 'warning', '标签内容最多不超过20个字符')
      } else {
        if (inputValue) {
          if (this.tags.includes(inputValue)) {
            this.$messageTips(this, 'warning', '此标签已添加过，请勿重复添加')
            return false
          }
          this.tagapi.createOrGet({ name: inputValue }).then(rs => {
            this.tags.push(rs.data.name)
            this.objLabelList.push(rs.data.id)
          })
          this.obj.objLabelList = this.objLabelList ? this.objLabelList : []
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    },
    querySearch (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.handleInputConfirm()
    },
    autoReadIdCard (idObj) {
      this.obj.name = idObj.name
      this.obj.idNo = idObj.idCode
      this.obj.type = '1'
      this.obj.sex = idObj.sex === '男' ? '1' : '2'
      this.obj1.householdAddress = JSON.stringify({ addressDetail: idObj.address })
      this.obj.avatarPic = idObj.image
      this.obj.base64ImgPostFlag = true
      if (idObj.nation) {
        sysvalue.listOnce('GBT.3304').then(res => {
          res.forEach(item => {
            if (item.name === idObj.nation) {
              this.obj1.nation = item.code
            }
          })
        })
      }
      this.obj.avatarPic = idObj.image
    },
    updateHeadImg (val) {
      if (val) {
        this.faceViewUrl = val
        this.imgViewUrl = val
      }
    },
    closeDiaglog (val) {
      this.$refs.headimg.dialog = val
    },
    getMousSn (flag) {
      api.getMousSn().then(rs => {
        if (rs.head.errCode === 0) {
          if (flag) {
            this.obj.name = '匿名' + rs.data.date + '-' + rs.data.sn
          } else {
            this.obj.name = ''
          }
        }
      })
    },
    updateInfo (val) {
      this.tempObj = val
      this.$router.push({ path: '/crm/memberinfo/userinfo/memberinfoedit/' + val.id })
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
      if (val.agebirthday.birthday) {
        this.obj.birthday = val.agebirthday.birthday
      }
    },
    inputTrigger () {
      this.$set(this.obj, 'mobile', validateMobile(this.obj.mobile))
    },
    handleChangeBirthday (obj) {
      if (obj && obj.birthday) {
        Object.assign(this.obj, {
          agebirthday: obj,
          birthday: obj.birthday || ''
        })
      } else {
        Object.assign(this.obj, {
          agebirthday: {},
          birthday: ''
        })
      }
    }
  },
  mounted () {
    this.tagapi.list({ highFrequency: 0, status: 0 }).then(rs => {
      if (rs.head.errCode === 0) {
        this.restaurants = rs.data.resultList
      }
    })
  },
  components: {
    webcam,
    VueCropper,
    personSelect,
    activityList,
    otherPapers,
    medicalNumber,
    contacts,
    age,
    uploadHeadimg,
    dialogRepeatlist,
    SourceCascader,
    IdcardRead,
    ageBirthday
  }
}
</script>

<style lang="less" scoped>
.uploadImgView {
  width: 70%;
  height: 300px;
  margin-top: 15px;
  float: left;
  background: #ddd;
  border: 1px solid #ddd;
  background: #f6f6f6;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}
.uploadImgView img {
  max-width: 100%;
  max-height: 100%;
}
.ctrlBtns div:first-child {
  float: left;
  margin-right: 10px;
}
.add_user_info .img-con {
  position: absolute;
  top: 0;
  right: 0;
  width: 33%;
  text-align: center;
}
.add_user_info .img-con .userAvatarWar {
  display: inline-block;
  margin: 0 4%;
}
.add_user_info .title-base {
  font-size: 16px;
  color: #000;
  border-left: 2px solid #1c7bef;
  padding-left: 10px;
  margin: 15px 0 10px 15px;
}
.add_user_info /deep/ .userinfo {
  .el-form /deep/ .el-form-item {
    line-height: 33px;
    height: 33px;
  }
}
.vue-cropper.avatar_crop {
  width: 70% !important;
  height: 300px !important;
  margin-top: 15px;
  float: left;
  background: #ddd !important;
  border: 1px solid #ddd;
}
.upload_crop_preview {
  float: left;
  margin: 15px 0 0 50px !important;
  overflow: hidden;
}
.upload_crop_preview div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ddd;
  border-radius: 50%;
  margin: 0 auto 15px;
}
.upload_crop_preview div img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.preview-1 {
  width: 100px;
  height: 100px;
}
.preview-2 {
  width: 80px;
  height: 80px;
}
.preview-3 {
  width: 60px;
  height: 60px;
}
.el-tag {
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);
  white-space: nowrap;
  padding: 0 10px;
  border-radius: 4px;
  margin-left: 10px;
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}
.button-new-tag {
  margin-left: 10px;
  width: 75px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.sourcediv {
  font-size: 14px;
  color: #999;
  margin-left: -120px;
  line-height: 40px;
  height: 40px;
  visibility: hidden;
}
.nearleft {
  margin-left: -110px;
  font-size: 14px;
  color: #999;
}
.fixFirstMargin .el-tag:first-child {
  margin-left: 0;
}
.fixFirstMargin .button-new-tag:first-child {
  margin-left: 0;
}
.img-con {
  text-align: center;
}
.img-title {
  margin: 0 0 10px;
  text-align: center;
  font-size: 14px;
}
.img-avt {
  height: 134px;
}
</style>
