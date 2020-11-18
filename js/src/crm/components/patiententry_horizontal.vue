<template>
  <div class="main-war add_user_info">
    <div class="l1">
      <el-row>
        <el-col :span="24">
          <div class="detail-war">
            <ever-form2
              :schema="schema"
              v-model="obj"
              :api="api"
              :rules="rules"
              label-position="right"
              ref="form"
              labelWidth="100px"
            >
              <template slot="patientName">
                <el-row v-if="isShowBirthdayIcon">
                  <el-col :span="21">
                    <el-input v-model.trim="obj.patientName" :disabled="true" placeholder="客户姓名" class="nameCom">
                      <template slot="suffix">
                        <idcard-read @getData="(data) => { autoReadIdCard(data) }"></idcard-read>
                      </template>
                    </el-input>
                  </el-col>
                  <el-col :span="2">
                    <i class="icon iconfont icon-bis iconbirthday"></i>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col :span="24">
                    <el-input v-model.trim="obj.patientName" :disabled="true" placeholder="客户姓名" class="nameCom">
                      <template slot="suffix">
                        <idcard-read @getData="(data) => { autoReadIdCard(data) }"></idcard-read>
                      </template>
                    </el-input>
                  </el-col>
                </el-row>
              </template>
              <template slot='idno'>
                <el-row>
                  <el-col :span="24">
                    <el-input v-model.trim="obj.idno" :disabled="true" placeholder="身份证号"></el-input>
                  </el-col>
                </el-row>
              </template>
              <template slot="birthday">
                <age v-model="obj.birthday" :age-show-text="obj.ageShowText" :disabled="true"></age>
              </template>
              <template slot="telephone">
                <sys-text v-model="obj.telephone" placeholder="座机号" :disabled="isDisabled"></sys-text>
              </template>
              <template slot="otherIdno">
                <other-papers v-model="obj.otherIdno" :disabled="isDisabled"></other-papers>
              </template>
              <template slot="familyMember">
                <contacts ref="contacts" v-model="obj.familyMember" :inline="true" :disabled="isDisabled" :isRequire="obj.contactsRequire"></contacts>
              </template>
              <template slot="unit">
                <div class="nearleft">g</div>
              </template>
              <template slot="mobile">
                <el-row>
                  <el-col :span="20">
                    <el-input
                      v-model="obj.mobile"
                      placeholder="请输入手机号"
                      :disabled="isDisabled ? isDisabled : checkedMobile"
                    ></el-input>
                  </el-col>
                  <el-col :span="3" class="ml5">
                    <el-checkbox v-model="checkedMobile" :disabled="isDisabled">暂无</el-checkbox>
                  </el-col>
                </el-row>
              </template>
              <div slot="default"></div>
            </ever-form2>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '../store/memberapi'
// import snapi from '../../workspace/store/userbaseapi'
import otherPapers from '../components/otherpapers'
import age from '@/components/age'
import contacts from '../components/contacts'
import { validateCardId, validateTelePhone } from '@/util/validate'
import idcardRead from '@/components/readdevice/idcard/idcard'

export default {
  /**
   * props                        字段含义
   * @param isBloodEdit           血型是否编辑
   * @param id                    患者id
   * @param value                 用户信息
   */
  props: ['id', 'isBloodEdit', 'value', 'isDisabled'],
  data () {
    let schema = [
      {
        name: 'patientName',
        comp: 'custom',
        span: 4,
        label: '姓名'
      },
      {
        name: 'isNewborn',
        comp: 'checkbox',
        span: 1,
        initValue: [],
        props: {
          options: [
            {value: '新生儿', label: '1'}
          ],
          disabled: true
        },
        labelWidth: '35px'
      },
      {
        name: 'birthWeight',
        span: 3,
        label: '出生体重',
        comp: 'ever-price',
        props: {
          placeholder: '出生体重',
          append: 'g',
          type: 'number',
          disabled: true
        }
      },
      {
        name: 'weight',
        span: 4,
        placeholder: '入院体重',
        label: '入院体重',
        comp: 'ever-price',
        props: {
          placeholder: '出生体重',
          append: 'g',
          type: 'number',
          disabled: true
        }
      },
      {
        comp: 'div',
        style: {
          height: '36px',
        },
        span: 12
      },
      {
        name: 'sex',
        span: 4,
        label: '性别',
        comp: 'sys-type',
        props: {
          code: 'GBT.2261.1',
          useValue: true,
          placeholder: '选择性别',
          disabled: true
        }
      },
      {
        name: 'idno',
        span: 4,
        comp: 'custom',
        label: '身份证号'
      },
      {
        name: 'birthday',
        comp: 'custom',
        span: 4,
        label: '出生日期'
      },
      {
        name: 'mobile',
        span: 4,
        placeholder: '请输入手机号',
        label: '手机号',
        comp: 'custom',
      },
      {
        name: 'telephone',
        comp: 'custom',
        span: 4,
        placeholder: '请输入座机号',
        label: '座机号'
      },
      {
        name: 'country',
        label: '国籍',
        span: 4,
        comp: 'sys-type',
        props: {
          code: 'GBT.2659',
          disabled: this.isDisabled
        }
      },
      {
        name: 'marry',
        label: '婚姻状况',
        span: 4,
        comp: 'sys-type',
        props: {
          code: 'GBT.2261.2',
          disabled: this.isDisabled
        }
      },
      {
        name: 'nation',
        label: '民族',
        span: 4,
        comp: 'sys-type',
        props: {
          code: 'GBT.3304',
          disabled: this.isDisabled
        }
      },
      {
        name: 'household',
        comp: 'everAddress',
        span: 4,
        label: '籍贯',
        props: {
          showDetialAddr: false,
          disabled: this.isDisabled
        }
      },
      {
        name: 'career',
        comp: 'sys-type',
        props: {
          code: 'GBT.2261.4',
          disabled: this.isDisabled
        },
        span: 4,
        label: '行政职称'
      },
      {
        name: 'companyTelephone',
        span: 4,
        label: '单位电话',
        props: {
          disabled: this.isDisabled
        }
      },
      {
        name: 'company',
        props: {
          maxLength: 3,
          disabled: this.isDisabled
        },
        span: 4,
        label: '单位名称'
      },
      {
        name: 'bloodType',
        label: '血型',
        span: 4,
        comp: 'sys-type',
        props: {
          code: 'CV04.50.005',
          disabled: this.isDisabled
        }
      },
      {
        name: 'birthAddress',
        comp: 'everAddress',
        label: '出生地',
        props: {
          disabled: this.isDisabled
        },
        span: 12
      },
      {
        name: 'workAddress',
        comp: 'everAddress',
        props: {
          disabled: this.isDisabled
        },
        span: 12,
        label: '工作地址'
      },
      {
        name: 'address',
        comp: 'everAddress',
        label: '现住址',
        props: {
          disabled: this.isDisabled
        },
        span: 12
      },
      {
        name: 'householdAddress',
        comp: 'everAddress',
        label: '户口地址',
        props: {
          disabled: this.isDisabled
        },
        span: 12
      },
      {
        name: 'familyMember',
        comp: 'custom',
        span: 24,
        label: '联系人'
      },
      {
        name: 'otherIdno',
        span: 24,
        comp: 'custom',
        label: '其他证件'
      }
    ]
    var obj = this.$ever.createObjFromSchema(schema)
    obj.sex = ''
    obj.address = ''
    obj.familyMember = []
    obj.idno = ''
    obj.contactsRequire = false
    return {
      schema,
      obj,
      api,
      // snapi,
      isDisable: false,
      cityOptions: [],
      addressTemp: [],
      addressObj: {},
      storagesn: '',
      objId: this.$route.params.id > -1 ? this.$route.params.id : null,
      isShowBirthdayIcon: false,
      need_contact_minage: this.$ever.getClinicConfig().need_contact_minage,
      rules: {
        name: [
          { required: false, message: '请输入姓名', trigger: 'change' },
          { min: 2, max: 32, message: '最长长度为32位字符', trigger: 'blur' }
        ],
        sex: [
          { required: false, message: '请选择性别', trigger: 'change' }
        ],
        birthday: [
          { required: false, message: '请填写出生日期', trigger: 'blur' }
        ],
        idno: [
          { required: false, validator: validateCardId, trigger: 'blur' }
        ],
        source: [
          { required: false, message: '请选择渠道来源', trigger: ['change', 'blur'] }
        ],
        levelId: [
          { required: false, message: '请选择客户级别', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: /^1[2345678]\d{9}$/, message: '请输入正确的手机号码' }
        ],
        telephone: [
          { required: false, validator: validateTelePhone, trigger: 'blur' }
        ],
        companyTelephone: [
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
          { required: false, message: '请填写职业', trigger: 'change' }
        ],
        workAddress: [
          { required: false, message: '请填写工作地址', trigger: 'blur' }
        ],
        address: [
          { required: false, message: '请填写联系地址', trigger: 'blur' }
        ],
        household: [
          { required: false, message: '请填写籍贯', trigger: 'blur' }
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
        familyMember: [
          { required: false, message: '请填写联系人', trigger: 'change' }
        ]
      },
      checkedMobile: false
    }
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    'value': {
      handler: function (val, oldval) {
        if (val) {
          this.getUser()
        }
      },
      immediate: true
    },
    'obj': {
      handler: function (val, oldVal) {
        this.$emit('formChange1', val)
      },
      deep: true
    },
    'obj.idno': {
      handler (val) {
        if (val && val.length === 18) {
          this.obj.sex = (val.charAt(16) % 2 === 0) ? '2' : '1'
        } else {
          if (!this.id) {
            // this.obj.sex = ''
            // this.obj.birthday = ''
          }
        }
      }
    },
    // 籍贯
    'addressTemp': {
      handler (newVal) {
        this.addressObj['province'] = newVal[0]
        this.addressObj['city'] = newVal[1]
        this.addressObj['county'] = newVal[2]
      },
      deep: true
    },
    'checkedMobile': {
      handler: function (flag) {
        this.rules.mobile[0].required = !flag
        this.obj.mobile = flag ? '' : this.obj.mobile
      }
    },
    'obj.isNewborn': {
      handler (val) {
        this.$ever.getFieldFromSchema(this.schema, 'birthWeight').props.disabled = !val.length
        this.$ever.getFieldFromSchema(this.schema, 'weight').props.disabled = !val.length
      },
      deep: true
    },
    'obj.birthday': {
      handler (val) {
        if (this.need_contact_minage && val) {
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
  methods: {
    getRequiredConfig (anonymous) {
      // 按用户身份获取校验规则
      let _this = this
      for (let item in _this.rules) {
        _this.rules[item][0].required = false
      }
      let params = {
        type: 4,
        anonymous: anonymous
      }
      this.api.getParam(params).then(rs => {
        if (rs.head.errCode === 0) {
          rs.data.forEach(item => {
            if (_this.rules[item]) {
              _this.rules[item][0].required = true
            }
          })
        }
      })
    },
    ationId (str) {
      let localData = window.sessionStorage.getItem('GBT.3304')
      if (!localData) {
        return 0
      }
      let opt = JSON.parse(localData, true).options
      let arr = opt.filter(item => {
        return item.name === str
      })
      return arr[0] ? arr[0].id : 0
    },
    // 读取身份证信息回显数据。modify by lvjiangtao@everjiankang.com
    autoReadIdCard (rs) {
      this.obj.name = rs.name
      this.obj.idno = rs.idCode
      this.obj.type = '1'
      this.obj.sex = rs.sex === '男' ? '1' : '2'
      this.obj.nation = this.getNationId(rs.nation + '族')
      this.obj.addressDetail = rs.address
      this.obj.householdAddressDetail = rs.address
    },
    isBirthday (date) {
      if (!date) {
        return false
      }
      let dateBirth = new Date(date)
      let monthBirth = dateBirth.getMonth()
      let dayBirth = dateBirth.getDate()
      let dateNow = new Date()
      // let dateNow = new Date('1993-01-07 00:00:00')
      let monthNow = dateNow.getMonth()
      let dayNow = dateNow.getDate()
      // console.log(monthBirth, monthNow, dayBirth, dayNow, '生日比较')
      if ((monthBirth === monthNow) && (dayBirth === dayNow)) {
        return true
      }
      return false
    },
    getUser () {
      if (this.value) {
        this.$nextTick(() => {
          this.obj = Object.assign({}, this.obj, this.value)
          this.checkedMobile = !this.obj.mobile
          this.obj.telephoneLeft = this.value.telephone ? this.value.telephone.split('-')[0] : ''
          this.obj.telephoneRight = this.value.telephone ? this.value.telephone.split('-')[1] : ''
          this.obj.isNewborn = (this.value.isNewborn && ['1']) || []
          this.obj.iden = this.value.idens
          this.obj.birthday = this.value.birthday
          this.obj.ageShowText = this.value.ageShowText
          this.obj.familyMember = this.value.familyMember ? JSON.parse(this.value.familyMember) : null
          this.obj.otherIdno = JSON.parse(this.value.otherIdno || '[]')
          if (this.value.familyMember) {
            this.$refs.contacts.setObj(this.obj.familyMember)
          }
        })
      }
    },
  },
  components: {
    otherPapers,
    contacts,
    age,
    idcardRead
  }
}
</script>

<style scoped>
.add_user_info .el-form-item__content {
  line-height: 30px;
}
.add_user_info .el-button {
  padding: 8px 10px;
}
.el-cascader {
  line-height: 32px;
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
.iconbirthday {
  margin-left: 5px;
  color: orange;
}
.add_user_info .nameCom /deep/ .el-input__inner {
  padding-right: 30px;
}
.iconSpan {
  color: #666;
}
.iconSpan:hover {
  color: #1c7bef;
}
.add_user_info /deep/ .is-disabled .el-input__inner,
.add_user_info /deep/ .is-disabled .el-input-group__append,
.add_user_info /deep/ .is-disabled .el-textarea__inner {
  color: #000;
  background: #ccc;
  border: 1px solid #bbb;
}
.add_user_info /deep/ .is-disabled input::-webkit-input-placeholder {
  color: #000;
}
.add_user_info /deep/ .el-checkbox {
  line-height: 32px;
}
</style>
