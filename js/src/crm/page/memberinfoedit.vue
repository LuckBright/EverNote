<template>
  <div id="usereditinfo" class="user_info_edit">
    <el-row class="title">
      <el-col>
        <span class="name">基本信息</span>
        <lock-patientinfo @update="updateSecret"></lock-patientinfo>
        <reset-lock></reset-lock>
        <span class="ml20">
          <el-checkbox v-model="anonymous" label="匿名用户"></el-checkbox>
        </span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="21">
        <ever-form2
          class="form-required-color"
          :schema="schema"
          v-model="obj"
          labelWidth="100px"
          label-position="right"
          ref="userinfo"
          :rules="rules"
          @objsaved="afterSave">
          <template slot="name">
            <el-row>
              <el-col :span="12">
                <el-input v-model.trim="obj.name" placeholder="客户姓名" :disabled="isDisabled"></el-input>
              </el-col>
              <el-col :span="4" align="right">
                <idcard-read :disabled="readIdDisabled" @getData="(data) => { autoReadIdCard(data) }">
                  <span slot="default">
                    <el-button slot="default" :disabled="readIdDisabled" type="text">实名读取</el-button>
                  </span>
                </idcard-read>
              </el-col>
            </el-row>
          </template>
          <template slot="engName">
            <el-input
              v-if="obj.patientNumber !== 'temporary'"
              v-model="obj.engName"
              placeholder="请输入英文名"
              :maxlength="40"
              :disabled="isDisabled"
            ></el-input>
            <el-input v-else v-model="obj.engName" placeholder="请输入英文名" :maxlength="40"></el-input>
          </template>
          <template slot="sex">
            <sys-type v-model="obj.sex" code="GBT.2261.1" :useValue="true" :disabled="isSexDisabled"></sys-type>
          </template>
          <template slot="idNo">
            <el-input
              v-if="CARD_ID_PATTERN.test(obj.idNo)"
              v-model="obj.idNo"
              :disabled="isDisabled"
              placeholder="请输入身份证号"
            ></el-input>
            <el-input v-else v-model="obj.idNo" placeholder="请输入身份证号"></el-input>
          </template>
          <template slot="agebirthday">
            <!-- <age v-model="obj.birthday" :age-show-text="obj.ageShowText"></age> -->
            <age-birthday v-model="obj.birthday" :disabled="isDisableBirthday"></age-birthday>
          </template>
          <template slot="mobile">
            <el-row>
              <el-col :span="20">
                <el-input
                  v-model="obj.mobile"
                  placeholder="请输入手机号"
                  v-on:input="inputTrigger"
                  :disabled="checkedMobile"
                ></el-input>
              </el-col>
              <el-col :span="3" class="ml5">
                <el-checkbox v-model="checkedMobile">暂无</el-checkbox>
              </el-col>
            </el-row>
          </template>
          <template slot="telephone">
            <sys-text v-model="obj.telephone" placeholder="座机号"></sys-text>
          </template>
          <template slot="idens">
            <other-papers v-model="obj.idens"></other-papers>
          </template>
          <template slot="contactMobile">
            <contacts ref="contacts" v-model="obj.contactList" :is-require="obj.contactsRequire"></contacts>
          </template>
          <template slot="guardianList">
            <contacts ref="guardian" v-model="obj.guardianList"></contacts>
          </template>
          <template slot="source">
            <source-cascader v-model="obj.source" v-if="$hasPermission('Auth_dom_rcm_selectsource')"></source-cascader>
            <source-cascader v-else :disabled="isDisable" v-model="obj.source"></source-cascader>
          </template>
          <template slot="director">
            <div @click="showpersonPop">
              <el-input placeholder="请选择会员经理" v-model="directorName"></el-input>
            </div>
          </template>
          <person-select
            ref="person"
            title="客户经理"
            :visible="personPop"
            :initdata="mangerList"
            @close="closepersonPop"
            @select="setdirector"
            :isradio="true"
            @update="updatePerson"
          ></person-select>
          <template slot="objLabelList">
            <el-tag
              v-for="(tag,i) in tags"
              :key="i"
              closable
              :disable-transitions="false"
              @close="removeTag(tag)"
            >{{tag.labelName}}</el-tag>
            <el-autocomplete
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              :fetch-suggestions="querySearch"
              :select-when-unmatched="true"
              @select="handleSelect"
            ></el-autocomplete>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
          </template>
          <template slot="default">
            <el-col style="margin-left: 100px;">
              <el-button type="primary" @click="save">
                <i class="iconfont icon-baocunweimoban" style="font-size:12px;"></i> 保存
              </el-button>
              <el-button @click="cancle()">
                <i class="iconfont icon-quxiao" style="font-size:12px;margin-right:5px;"></i>取消
              </el-button>
            </el-col>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="3">
        <div class="img-con">
          <p class="img-title">头像</p>
          <div class="img-avt">
            <ever-upload1 v-model="obj.avatarPic" ref="upload" :limit="1" @success="handleUpdataUserAvt" :key="currentKey"></ever-upload1>
          </div>
        </div>
      </el-col>
    </el-row>

    <upload-Headimg
      ref="headimg"
      :visible.sync="isShowUpload"
      @close="closeDiaglog"
      :uploadImgType="uploadImgType"
      @update="updateHeadImg"
    ></upload-Headimg>
    <activity-list ref="activitylist" :dialogvisible="classPop" @close="closeTypePop"></activity-list>
  </div>
</template>
<script>
import api from '../store/memberapi'
import tagapi from '../store/tagapi'
import personSelect from '../page/personselect'
import activityList from '../page/activitylist'
import otherPapers from '../components/otherpapers'
import medicalNumber from '../components/medicalnumber'
import contacts from '../components/contacts'
import { CARD_ID_PATTERN, validateTelePhone, MOBILE_PATRN_MEMBER, validateEnglishName } from '@/util/validate'
import age from '@/components/age'
import uploadHeadimg from '@/crm/components/upload.headimg'
import lockPatientinfo from '@/crm/components/lock.patientinfo'
import resetLock from '@/crm/components/reset.lock'
import { validateMobile } from '@/crm/util/common'
import SourceCascader from '@/crm/components/sourcecascader'
import sysvalue from '@/warehouse/store/sysvalueapi'
import axios from 'axios'
import { request } from '@/util/req'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import upconfig from '@/components/everuploadconfig'
import idcardRead from '@/components/readdevice/idcard/idcard'
import ageBirthday from '@/crm/components/age.birthday'

let schema = [
  {
    name: 'name',
    label: '姓名',
    comp: 'custom',
    span: 12
  },
  {
    name: 'sex',
    comp: 'custom',
    span: 6,
    label: '性别'
  },
  {
    name: 'idNo',
    span: 12,
    placeholder: '证件号',
    comp: 'custom',
    label: '身份证号'
  },
  {
    name: 'agebirthday',
    comp: 'custom',
    span: 12,
    label: '年龄'
  },
  {
    name: 'source',
    comp: 'custom',
    span: 12,
    label: '渠道来源'
  },
  {
    name: 'mobile',
    label: '手机号',
    comp: 'custom',
    span: 12
  },
  {
    name: 'telephone',
    comp: 'custom',
    span: 12,
    placeholder: '请输入座机号',
    label: '座机号'
  },
  {
    name: 'engName',
    span: 12,
    props: {
      maxlength: 40,
      placeholder: '请输入英文名',
    },
    comp: 'custom',
    label: '英文名'
  },
  {
    name: 'objLabelList',
    comp: 'custom',
    label: '标签',
    span: 24
  },
  {
    name: 'remark',
    label: '备注',
    type: 'el-input',
    props: {
      placeholder: '',
      max: 200
    },
    span: 24
  },
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
    span: 6,
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
    props: {
      filterable: true,
      clearable: true
    },
    span: 24,
    label: '工作地址'
  },
  {
    name: 'householdAddress',
    comp: 'everAddress',
    label: '户口地址',
    span: 24
  },
  {
    name: 'address',
    comp: 'everAddress',
    label: '联系地址',
    span: 24
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
    span: 6,
    max: 30,
    label: 'Email'
  },
  {
    name: 'idens',
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
    label: '联系人',
    comp: 'custom',
    placeholder: '',
    span: 24
  },
  {
    name: 'guardianList',
    comp: 'custom',
    span: 18,
    label: '监护人'
  }
]
export default {
  mixins: [upconfig],
  props: ['userid', 'printFlag'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.avatarPic = ''
    obj.sex = ''
    obj.address = ''
    obj.householdAddress = ''
    obj.birthAddress = ''
    obj.facePic = ''
    obj.secret = false
    obj.guardianList = []
    obj.contactsRequire = false
    let validateAge = function (rule, value, callback) {
      if (!value || value.age === '' || value.birthday === '') {
        callback(new Error('请输入出生日期与年龄'))
      } else if (!/^\d+$/.test(value.age)) {
        callback(new Error('年龄数值非法'))
      } else {
        callback()
      }
    }
    return {
      currentKey: new Date().getTime(),
      validateAge,
      schema,
      obj,
      baseInfoObj: {},
      baseObj: {},
      api,
      tagapi,
      showActivity: false,
      classPop: false,
      personPop: false,
      photoId: true,
      inputVisible: false,
      isDisable: true,
      anonymous: false,
      inputValue: '',
      activiyvalue: '',
      activityId: '',
      directorId: '',
      directorName: '',
      sourceName: '',
      source: '',
      tags: [],
      mangerList: [],
      objLabelList: [],
      restaurants: [],
      isDisabled: false,
      patientId: this.$route ? this.$route.params.patientId : this.userid,
      picValue: '',
      faceValue: '',
      bId: '',
      // sourcePop: false,
      isShowUpload: false,
      uploadImgType: '',
      camURL: '',
      previews: '../../../static/assets/avtarbg.png',
      rules: {
        idNo: [
          { required: false, validator: this.validateIdNo, trigger: 'blur' }
        ],
        name: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 32, message: '最长长度为32位字符', trigger: 'blur' }
        ],
        sex: [
          { required: false, message: '请选择性别', trigger: 'blur' }
        ],
        birthday: [
          { required: false, message: '请填写出生日期', trigger: ['change', 'blur'] }
        ],
        source: [
          { required: false, message: '请选择渠道来源', trigger: 'change', type: 'string' }
        ],
        levelId: [
          { required: false, message: '强选择客户级别', trigger: 'change' }
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
          { required: false, message: '请选择国籍', trigger: 'change' }
        ],
        nation: [
          { required: false, message: '请选择民族', trigger: 'change' }
        ],
        language: [
          { required: false, message: '请选择常用语言', trigger: 'change' }
        ],
        bloodType: [
          { required: false, message: '请选择血型', trigger: 'change' }
        ],
        marry: [
          { required: false, message: '请选择婚姻状况', trigger: 'change' }
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
          { required: false, message: '请填写其他证件', trigger: 'change' }
        ],
        contactMobile: [
          { required: false, message: '请填写联系人', trigger: 'change' }
        ],
        engName: [
          { required: false, validator: validateEnglishName, trigger: 'blur' },
        ]
      },
      CARD_ID_PATTERN,
      checkedMobile: false,
      isSexDisabled: false, // 性别disabled
      isDisableBirthday: false,
      isIdNoChange: false, // 判断编辑时idNo是否有值
      readIdDisabled: false, // 是否可以读身份证
      need_contact_minage: this.$ever.getClinicConfig().need_contact_minage,
    }
  },
  methods: {
    // 上传头像直接更新passport数据，因为需要更新头部数据，用bus的方式通知出去
    handleUpdataUserAvt (val) {
      api.updataUserAvt({
        id: this.patientId,
        pic: val.fileId
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '头像上传成功')
          this.$bus.$emit('update:head-userAvatar', val.fileId)
        }
      })
    },
    getRequiredConfig (anonymous) {
      let _this = this
      let ansArr = ['idNo', 'householdAddress', 'address', 'contactMobile', 'source']
      this.api.getParam({ 'type': 1, 'anonymous': anonymous }).then(rs => {
        if (rs.head.errCode === 0) {
          if (anonymous) {
            ansArr.forEach(item => {
              if (_this.rules[item]) {
                _this.rules[item][0].required = false
              }
            })
          } else {
            rs.data.forEach(item => {
              if (anonymous) {
                _this.rules[item][0].required = true
              } else {
                if (_this.rules[item]) {
                  _this.rules[item][0].required = true
                }
              }
            })
          }
        }
      })
    },
    async save () {
      if (this.obj.avatarPic && this.obj.avatarPic.startsWith('data:image/')) {
        let tempData = {
          base64: this.obj.avatarPic
        }
        var data = new URLSearchParams()
        for (var o in tempData) {
          data.append(o, tempData[o])
        }
        let res = await axios({
          url: this.action,
          method: 'post',
          headers: this.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
          data: data
        })
        if (res.head.errCode === 0) {
          this.baseInfoObj.avatarPic = res.data.fileId
          delete this.obj.avatarPic
        }
      }
      this.$refs.userinfo.$refs.form.validate(valid => {
        if (valid) {
          this.obj.contactList && this.obj.contactList.forEach(item => {
            if (item.type === '' || item.name === '') {
              delete this.obj.contactList
            } else {
              this.baseInfoObj.contactList = this.obj.contactList
            }
          })
          this.obj.guardianList && this.obj.guardianList.forEach(item => {
            if (item.type === '' || item.name === '') {
              delete this.obj.guardianList
            } else {
              this.baseInfoObj.guardianList = this.obj.guardianList
            }
          })
          this.obj.mobile = this.obj.mobile ? this.obj.mobile.replace(/-/g, '') : ''
          this.obj.language = this.obj.language ? this.obj.language : ''
          Object.assign(this.baseInfoObj, this.obj)
          this.baseInfoObj.id = this.bId
          this.baseInfoObj.birthday = this.obj.birthday
          this.baseInfoObj.isIgnoreMobile = this.checkedMobile
          if (this.isIdNoChange && this.baseInfoObj.idNo) this.baseInfoObj.secret = true
          this.api.append(this.baseInfoObj, this.objLabelList).then(rs => {
            if (rs.head.errCode === 0) {
              this.$bus.$emit('updataHead', true)
              this.$bus.$emit('update:head-userAvatar', this.obj.avatarPic)
              this.$router.push({ path: '/crm/memberinfo/userinfo/memberbaseinfo/' + this.patientId })
            }
          })
        }
      })
    },
    cancle () {
      this.$router.push({ path: '/crm/memberinfo/userinfo/memberbaseinfo/' + this.patientId })
    },
    afterSave () {
      this.$router.push('/workspace/tasks')
    },
    getUser () {
      api.getBaseInfoById({ 'patientId': this.patientId, 'needIden': true, 'checkRelate': true }).then(result => {
        this.baseObj = result.data
        this.bId = this.baseObj.id
        let paramsObj = {}
        Object.assign(paramsObj, this.baseObj)
        if (!paramsObj.mobile) this.checkedMobile = true
        this.$refs.contacts.setObj(paramsObj.contactList ? paramsObj.contactList : [])
        this.$refs.guardian.setObj(paramsObj.guardianList ? paramsObj.guardianList : [])
        // paramsObj.birthday = obj.birthday
        // paramsObj.agebirthday = {
        //   age: paramsObj.age,
        //   isMonth: paramsObj.isMonth,
        //   isDay: paramsObj.isDay,
        //   birthday: paramsObj.birthday,
        //   isHour: paramsObj.isHour,
        //   ageShowText: paramsObj.ageShowText
        // }
        paramsObj.type += ''
        this.source = paramsObj.source
        this.sourceName = paramsObj.sourceName ? paramsObj.sourceName : ''
        this.faceValue = paramsObj.facePic
        if (paramsObj.member) {
          this.directorName = paramsObj.member ? paramsObj.member.directorName : ''
          this.directorId = paramsObj.member ? paramsObj.member.directorId : ''
          this.mangerList.push(paramsObj.member.directorId)
          this.activityId = paramsObj.member ? paramsObj.member.activityId : ''
          this.activiyvalue = paramsObj.member ? paramsObj.member.activityName : ''
          paramsObj.wechat = paramsObj.member ? paramsObj.member.wechat : ''
          paramsObj.weibo = paramsObj.member ? paramsObj.member.weibo : ''
          paramsObj.qq = paramsObj.member ? paramsObj.member.qq : ''
          paramsObj.email = paramsObj.member ? paramsObj.member.email : ''
        }
        if (paramsObj.member && paramsObj.member.creator) {
          if (paramsObj.member.creator === parseInt(this.$store.state.currentUser.userId)) {
            this.isDisable = false
          } else {
            this.getStaff(paramsObj.member.creator)
          }
        }
        if (paramsObj.member && paramsObj.member.objLabelList) {
          paramsObj.member.objLabelList.map(v => {
            return this.tags.push(v) && this.objLabelList.push(v)
          })
        }
        paramsObj.language = paramsObj && paramsObj.language
        this.anonymous = paramsObj.anonymous
        if (!paramsObj.idNo) {
          this.isIdNoChange = true
        }
        Object.assign(this.obj, paramsObj)
        // let a = this.$moment(this.obj.birthday).format('YYYY-MM-DD')
        // if (this.obj.birthtime) {
        //   this.agetype = 'datetime'
        //   this.obj.birthday = a + ' ' + this.obj.birthtime
        // }
        // console.log(this.obj.birthday, 'bbbb')
      })
    },
    showpersonPop () {
      this.personPop = true
    },
    closepersonPop () {
      this.personPop = false
    },
    updatePerson (val) {
      this.personPop = val
    },
    closeTypePop () {
      this.$refs.classlist.dialog = false
      this.getClassList(schema, 'typeId')
    },
    popUploadDialog (val) {
      this.$refs.headimg.dialog = true
      this.uploadImgType = val
    },
    setdirector (users) {
      users.forEach(user => {
        this.directorName = (user.departmentObject === undefined) ? ' ' + user.name : user.departmentObject.name + '  ' + user.name
        this.directorId = user.id
      })
      this.personPop = false
    },
    removeTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      this.objLabelList.splice(this.objLabelList.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      let arr = []
      this.tags.forEach(item => {
        arr.push(item.labelName)
      })
      if (inputValue) {
        if (arr.includes(inputValue)) {
          this.$messageTips(this, 'warning', '此标签已添加过，请勿重复添加')
          return false
        }
        this.tagapi.createOrGet({ 'name': inputValue }).then(rs => {
          this.tags.push({ labelId: rs.data.id, labelName: rs.data.name })
          this.objLabelList.push({ labelId: rs.data.id, lableName: rs.data.name })
        })
      }
      this.inputVisible = false
      this.inputValue = ''
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
    getStaff (id) {
      request(orgUrlMap.staff.getStaffListByIdList, { idList: [id] }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data.length && res.data[0].id === parseInt(this.$store.state.currentUser.userId)) {
            this.isDisable = false
          } else {
            this.isDisable = true
          }
        }
      })
    },
    // 读取身份证信息回显数据。modify by lvjiangtao@everjiankang.com
    autoReadIdCard (rs) {
      this.obj.name = rs.name
      this.obj.idNo = rs.idCode
      this.obj.type = '1'
      this.obj.sex = rs.sex === '男' ? '1' : '2'
      if (rs.nation) {
        sysvalue.listOnce('GBT.3304').then(res => {
          res.forEach(item => {
            if (item.name === rs.nation) {
              this.obj.nation = item.code
            }
          })
        })
      }
      this.obj.avatarPic = rs.image
      this.$bus.$emit('update:head-userAvatar', rs.image)
    },
    updateHeadImg (val) {
      if (val) {
        this.faceValue = val
        this.picValue = val
      }
    },
    closeDiaglog (val) {
      this.$refs.headimg.dialog = val
    },
    updateSecret (val) {
      this.obj.secret = val
    },
    inputTrigger () {
      this.$set(this.obj, 'mobile', validateMobile(this.obj.mobile))
    },
    validateIdNo (rule, value, callback) {
      if (value && !CARD_ID_PATTERN.test(value)) {
        callback(new Error('请输入正确的身份证号码 如:330326197001019296(X)'))
      } else if (!value) {
        if (!this.obj.agebirthday.birthday) {
          this.obj.agebirthday = {
            age: this.baseObj.age,
            isMonth: this.baseObj.isMonth,
            isDay: this.baseObj.isDay,
            birthday: this.baseObj.birthday,
            ageShowText: this.baseObj.ageShowText
          }
        }
        callback()
      } else {
        callback()
      }
    }
  },
  mounted () {
    this.tagapi.list({ highFrequency: 0, status: 0 }).then(rs => {
      this.restaurants = rs.data.resultList
    })
  },
  created () {
    this.getRequiredConfig()
    if (this.patientId) {
      this.getUser()
    }
    // 监听一个其他组件更新头像的方法，主要是患者头部信息和修改页面头像要联动修改，用bus的方式互相通知
    this.$bus.$on('update:profile-userAvatar', val => {
      this.currentKey = new Date().getTime()
      this.obj.avatarPic = val
    })
  },
  watch: {
    'obj': {
      handler: function (val, oldVal) {
        this.showFaceUpload = this.obj.faceId
        this.obj.mobile = val.mobile ? val.mobile.replace(/(\d)(?=(?:\d{4})+$)/g, '$1-') : ''
      },
      deep: true
    },
    'userid': function (val) {
      this.patientId = this.userid
      this.getUser()
    },
    'activiyvalue': {
      handler: function (val) {
        if (typeof val !== 'string') {
          this.activityId = val
        }
      }
    },
    'obj.idNo': {
      handler (val) {
        if (val) {
          if (CARD_ID_PATTERN.test(val)) {
            this.obj.sex = (val.charAt(16) % 2 === 0) ? '2' : '1'
            this.obj.birthday = this.$moment(val.substring(6, 14)).format('YYYY-MM-DD')
            this.isSexDisabled = true
            this.isDisableBirthday = true
            this.sexFlag = true
          } else {
            this.sexFlag = false
            if (!this.isDisabled) {
              this.isSexDisabled = false
            }
            this.isDisableBirthday = false
            this.obj.sex = this.baseObj.sex
            this.obj.birthday = this.baseObj.birthday
          }
        } else {
          if (this.obj.secret) {
            this.isSexDisabled = false
            this.isDisableBirthday = false
          }
        }
      },
      immediate: true
    },
    'obj.secret': {
      handler: function (val) {
        if (val) {
          this.isDisabled = false
          if (!this.sexFlag) {
            this.isSexDisabled = false
            this.isDisableBirthday = false
            this.readIdDisabled = false
          }
        } else {
          this.isDisabled = true
          this.isSexDisabled = true
          this.isDisableBirthday = true
          this.readIdDisabled = true
        }
      },
      deep: true
    },
    'anonymous': {
      handler: function (val) {
        this.obj.anonymous = val
        this.getRequiredConfig(val)
      }
    },
    'checkedMobile': {
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
              this.obj.contactsRequire = day > 0
            } else {
              this.obj.contactsRequire = month > 0
            }
          } else {
            this.obj.contactsRequire = year > 0
          }
        }
      },
      deep: true
    }
  },
  components: {
    personSelect,
    activityList,
    otherPapers,
    medicalNumber,
    contacts,
    age,
    uploadHeadimg,
    lockPatientinfo,
    resetLock,
    SourceCascader,
    idcardRead,
    ageBirthday
  }
}
</script>
<style scoped>
.user_info_edit .ctrlBtns div:first-child {
  float: left;
  margin-right: 10px;
}
.user_info_edit h5 {
  height: 16px;
  line-height: 16px;
  border-left: 2px solid #1c7bef;
  padding-left: 10px;
  font-size: 16px;
  font-weight: normal;
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
  margin-right: 10px;
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 408px;
  vertical-align: bottom;
}
.sourcespan {
  font-size: 14px;
  color: #999;
  margin-left: -120px;
  line-height: 40px;
  height: 40px;
}
.savebtn {
  padding-bottom: 20px;
  padding-left: 20px;
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
