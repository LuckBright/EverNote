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
                        <idcard-read @getData="autoReadIdCard"></idcard-read>
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
                        <idcard-read @getData="autoReadIdCard"></idcard-read>
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
import api from '@/crm/store/memberapi'
import age from '@/components/age'
import { validateCardId } from '@/util/validate'
import idcardRead from '@/components/readdevice/idcard/idcard'

export default {
  /**
   * props                        字段含义
   * @param id                    患者id
   * @param value                 用户信息
   */
  props: ['id', 'value', 'isDisabled'],
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
      }
    ]
    var obj = this.$ever.createObjFromSchema(schema)
    obj.sex = ''
    obj.address = ''
    obj.idno = ''
    // let validateAge = function (rule, value, callback) {
    //   if (!value || value.age === '' || value.birthday === '') {
    //     callback(new Error('请输入出生日期与年龄'))
    //   } else if (!/^\d+$/.test(value.age)) {
    //     callback(new Error('年龄数值非法'))
    //   } else {
    //     callback()
    //   }
    // }
    // let validateMonth = function (rule, value, callback) {
    //   if (value && value.isMonth && value.isMonth >= 12) {
    //     callback(new Error('月份应小于等于12'))
    //   } else if (value && value.isDay && value.isDay <= 30) {
    //     callback(new Error('年龄数值非法'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      schema,
      obj,
      api,
      isDisable: false,
      cityOptions: [],
      addressTemp: [],
      addressObj: {},
      storagesn: '',
      objId: this.$route.params.id > -1 ? this.$route.params.id : null,
      // validateMonth: validateMonth,
      // validateAge: validateAge,
      isShowBirthdayIcon: false,
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
    'checkedMobile': {
      handler: function (flag) {
        this.rules.mobile[0].required = !flag
        this.obj.mobile = flag ? '' : this.obj.mobile
      }
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
    },
    isBirthday (date) {
      if (!date) {
        return false
      }
      let dateBirth = new Date(date)
      let monthBirth = dateBirth.getMonth()
      let dayBirth = dateBirth.getDate()
      let dateNow = new Date()
      let monthNow = dateNow.getMonth()
      let dayNow = dateNow.getDate()
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
          this.obj.isNewborn = (this.value.isNewborn && ['1']) || []
          this.obj.iden = this.value.idens
          this.obj.birthday = this.value.birthday
          this.obj.ageShowText = this.value.ageShowText
        })
      }
    },
  },
  components: {
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
