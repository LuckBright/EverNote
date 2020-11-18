<template>
<!--
  使用方法：<create-archives-dialog ref="archivesDialog" pageType="1" @getArchivesObj="handleArchivesObj"></create-archives-dialog>
  this.$refs.archivesDialog.open() // 打开快速建档
  handleArchivesObj(obj) // obj就是返回建档后信息
  pageType操作来源 1 会员管理，2 门诊预约 ，3 住院申请，4 住院办理，5 互联网医院，6 临时档 // 必传
-->
  <div>
    <el-dialog
      title="弹窗样式"
      width="410px"
      :visible.sync="dialogVisible"
      class="ui_dialog_01"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div style="font-size: 20px;background-color:f4f4f4;padding: 20px 10px;">
        <ever-form2
          style="margin-right: 20px; padding-right: 30px;"
          :schema="schema"
          v-model="obj"
          ref="form"
          :span="24"
          :rules="rules"
        >
          <template slot="title1">
            <h4 class="f16" style="line-height: 0px;">创建档案</h4>
          </template>
          <template slot="temporaryFlag" v-if="pageType != FILE_PAGE_TYPE[2].id && pageType != FILE_PAGE_TYPE[3].id">
            <el-checkbox v-model.trim="obj.temporaryFlag">创建正式档案</el-checkbox>
          </template>
          <template slot="name">
            <el-row>
              <el-col :span="24">
                <el-input v-model.trim="obj.name" placeholder="客户姓名" @blur="checkRepeat">
                  <template slot="suffix">
                    <idcard-read @getData="(data) => { autoReadIdCard(data) }"></idcard-read>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </template>
          <template slot="birthday">
            <!-- <age v-model="obj.birthday"></age> -->
            <age-birthday v-model="obj.birthday" :disabled="ageDisabled"></age-birthday>
          </template>
          <template slot="mobile">
            <el-row>
              <el-col :span="24">
                <el-input
                  v-model="obj.mobile"
                  placeholder="请输入手机号"
                  @blur="checkRepeat"
                ></el-input>
              </el-col>
              <!-- <el-col :span="3">
                <el-checkbox class="ml5" v-model="obj.checkedMobile">暂无</el-checkbox>
              </el-col> -->
            </el-row>
          </template>
          <template slot="contactName">
            <el-input v-model.trim="obj.contactName" placeholder="联系人姓名" :disabled="contactNameDisabled"></el-input>
          </template>
          <template slot="memerAdd">
            <el-button type="text" @click="handleRoute">填写更多档案信息 > </el-button>
          </template>
          <template slot="default">
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="submitForm()" :loading="loading">保存</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-col>
          </template>
        </ever-form2>
      </div>
    </el-dialog>
    <dialog-repeat-list ref="repeat" :tableData="repeatData" @updateInfo="updateInfo"></dialog-repeat-list>
  </div>
</template>

<script>
import { debounce } from '@/util/common'
import SourceCascader from '@/crm/components/sourcecascader'
import { CARD_ID_PATTERN, validatePhone, validateCardId } from '@/util/validate'
import DialogRepeatList from '@/crm/components/dialog.patient.repeatlist'
import { isRepeat, FILE_PAGE_TYPE } from '@/crm/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import memberApi from '@/crm/store/memberapi'
import idcardRead from '@/components/readdevice/idcard/idcard'
import ageBirthday from '@/crm/components/age.birthday'

export default {
  name: 'create-archives-dialog',
  props: {
    pageType: {
      type: String,
      default: FILE_PAGE_TYPE[0].id
    }
  },
  data () {
    let schema = [
      {
        name: 'title1',
        comp: 'custom'
      },
      {
        name: 'temporaryFlag',
        comp: 'custom'
      },
      {
        name: 'name',
        label: '姓名',
        comp: 'custom'
      },
      {
        name: 'sex',
        label: '性别',
        comp: 'sys-type',
        props: {
          code: 'GBT.2261.1',
          useValue: true,
          disabled: false
        }
      },
      {
        name: 'birthday',
        label: '年龄',
        comp: 'custom'
      },
      {
        name: 'mobile',
        comp: 'custom',
        label: '移动电话'
      },
      {
        name: 'visitCardType',
        label: '就诊卡类型',
        comp: 'ever-select',
        props: {
          options: [],
          placeholder: '就诊卡类型',
        }
      },
      {
        name: 'visitCardNo',
        label: '就诊卡号',
        props: {
          disabled: true
        }
      },
      {
        name: 'source',
        label: '渠道',
        comp: SourceCascader,
      },
      {
        name: 'idNo',
        label: '身份证号'
      },
      {
        name: 'contactType',
        label: '联系人类型',
        comp: 'sys-type',
        props: {
          code: 'GBT.4761',
          placeholder: '联系人类型'
        }
      },
      {
        name: 'contactName',
        label: '联系人姓名',
        comp: 'custom'
      },
      {
        name: 'contactMobile',
        label: '联系人电话',
        props: {
          disabled: true
        }
      },
      {
        name: 'memerAdd',
        comp: 'custom'
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.temporaryFlag = true
    return {
      dialogVisible: false,
      loading: false,
      ageDisabled: false,
      schema,
      obj,
      rules: {
        name: [
          { required: false, message: '必填', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在2-32个字符' }
        ],
        sex: [{ required: false, message: '必填', trigger: ['change', 'blur'] }],
        birthday: [{ required: false, message: '必填', trigger: 'blur' }],
        mobile: [
          { required: false, max: 11, validator: validatePhone, trigger: 'blur' }
        ],
        source: [
          { required: false, message: '必填', trigger: ['change', 'blur'] }
        ],
        idNo: [
          { required: false, validator: validateCardId, trigger: 'blur' }
        ],
        contactName: [
          { required: false, min: 2, max: 32, message: '长度在2-32个字符', trigger: 'blur' }
        ],
        contactMobile: [
          { required: false, max: 11, validator: validatePhone, trigger: 'blur' }
        ],
        contactType: [
          { required: false, message: '请选择联系人类型', trigger: 'change' }
        ]
      },
      repeatData: [],
      contactNameDisabled: true,
      tempObj: {},
      FILE_PAGE_TYPE,
      need_contact_minage: this.$ever.getClinicConfig().need_contact_minage
    }
  },
  created () {
    this.getRequiredConfig()
    memberApi.getCardType().then(rs => {
      if (rs.head.errCode === 0 && rs.data.length) {
        this.$ever.getFieldFromSchema(this.schema, 'visitCardType').props.options = rs.data
      }
    })
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.$nextTick(() => { // 清空下历史数据
        this.$refs.form.resetForm()
        this._clearSexBirthday()
      })
    },
    close () {
      this.dialogVisible = false
    },
    getRequiredConfig (type) { // 获取必填项校验规则
      let _this = this
      for (let item in _this.rules) {
        _this.rules[item][0].required = false
      }
      let params = {
        type: type || this.pageType
      }
      memberApi.getParam(params).then(rs => {
        if (rs.head.errCode === 0) {
          rs.data.forEach(item => {
            if (_this.rules[item]) {
              _this.rules[item][0].required = true
            }
          })
        }
      })
    },
    handleRoute () {
      let urlData = `${this.$ever.crmIndex}/crm/memberadd`
      window.open(urlData, '_blank')
    },
    updateInfo (val) {
      this.tempObj = val
      if (this.pageType === FILE_PAGE_TYPE[1].id || this.pageType === FILE_PAGE_TYPE[2].id || this.pageType === FILE_PAGE_TYPE[3].id) { // 门诊住院疑似重复客户特殊处理
        this.$emit('getArchivesObj', val)
        this.close()
      } else {
        let urlData = `${this.$ever.crmIndex}/crm/memberinfo/userinfo/memberinfoedit/${val.id}`
        window.open(urlData, '_blank')
      }
    },
    checkRepeat () {
      let objCheck = JSON.parse(JSON.stringify(this.obj))
      if ((objCheck.name && objCheck.name.length >= 2) || objCheck.mobile || objCheck.idNo) {
        isRepeat(objCheck, {}).then(rs => {
          if (rs && rs.length > 0) {
            this.repeatData = rs
            this.$refs.repeat.dialogVisible = true
          }
        })
      }
    },
    // 读取身份证信息回显数据。modify by lvjiangtao@everjiankang.com
    autoReadIdCard (rs) {
      this.obj.name = rs.name
      this.obj.idNo = rs.idCode
      this.obj.sex = rs.sex === '男' ? '1' : '2'
      this.obj.householdAddress = JSON.stringify({ addressDetail: rs.address })
      this.obj.avatarPic = rs.image
      this.obj.base64ImgPostFlag = true
      if (rs.nation) {
        sysvalue.listOnce('GBT.3304').then(res => {
          res.forEach(item => {
            if (item.name === rs.nation) {
              this.obj1.nation = item.code
            }
          })
        })
      }
    },
    submitForm: debounce(function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {}
          Object.assign(params, this.obj)
          if (this.obj.temporaryFlag) {
            params.temporary = '2'
            params.pageType = this.pageType
          } else {
            params.temporary = '1'
            params.pageType = '6'
          }
          this.loading = true
          memberApi.createFast(params).then(res => {
            if (res && res.data && res.data.id) {
              this.$emit('getArchivesObj', res.data)
              this.close()
              this.$messageTips(this, 'success', '建档成功')
              this.loading = false
            } else {
              this.loading = false
            }
          }).catch(err => {
            console.error(err)
            this.loading = false
          })
        }
      })
    }, 350),
    _clearSexBirthday () {
      this.$set(this.obj, 'sex', '')
      this.$set(this.obj, 'birthday', '')
      this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = false
      this.ageDisabled = false
    },
    contactsRequire (flag) {
      let contactsArr = ['contactType', 'contactName', 'contactMobile']
      for (let item of contactsArr) {
        this.rules[item][0].required = flag
      }
    }
  },
  watch: {
    'obj.temporaryFlag': {
      handler (val) {
        if (val) {
          this.getRequiredConfig()
        } else {
          this.getRequiredConfig('6')
        }
      }
    },
    'obj.contactType': {
      handler (val) {
        if (val) {
          this.contactNameDisabled = false
          this.$ever.getFieldFromSchema(this.schema, 'contactMobile').props.disabled = false
        } else {
          this.contactNameDisabled = true
          this.$ever.getFieldFromSchema(this.schema, 'contactMobile').props.disabled = true
          this.$set(this.obj, 'contactName', '')
          this.$set(this.obj, 'contactMobile', '')
        }
      }
    },
    'obj.visitCardType': {
      handler (val) {
        if (val) {
          this.$ever.getFieldFromSchema(this.schema, 'visitCardNo').props.disabled = false
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'visitCardNo').props.disabled = true
          this.$set(this.obj, 'visitCardNo', '')
        }
      }
    },
    'obj.idNo': { // 根据身份证判断是否性别&出生日期是否可输入
      handler (val) {
        if (val) {
          if (CARD_ID_PATTERN.test(val)) {
            this.obj.sex = (val.charAt(16) % 2 === 0) ? '2' : '1'
            this.obj.birthday = this.$moment(val.trim().substring(6, 14)).format('YYYY-MM-DD HH:mm:ss')
            let nowData = new Date()
            if (this.$moment(this.obj.birthday).valueOf() > this.$moment(nowData).valueOf()) {
              this._clearSexBirthday()
              this.$set(this.obj, 'idNo', '')
              this.$messageTips(this, 'warning', `出生日期不能大于今天（${this.$moment(nowData).format('YYYY-MM-DD')}）`)
            } else {
              this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = true
              this.ageDisabled = true
            }
          } else {
            this._clearSexBirthday()
          }
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'sex').props.disabled = false
          this.ageDisabled = false
          this.obj.sex = ''
          this.obj.birthday = ''
        }
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
              this.contactsRequire(day > 0)
            } else {
              this.contactsRequire(month > 0)
            }
          } else {
            this.contactsRequire(year > 0)
          }
        }
      },
      deep: true
    }
  },
  components: {
    SourceCascader,
    DialogRepeatList,
    idcardRead,
    ageBirthday
  }
}
</script>

<style lang="less" scoped>
.icon-spancard {
  position: absolute; right: 5px; top: 0px;
}
</style>
