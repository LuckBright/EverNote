<template>
  <el-dialog
    :visible.sync="dialogFlag"
    title="编辑患者信息"
    class="ui_dialog_02">
    <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" labelWidth="96px" nosubmit='true'>
      <template slot="basic">
        <span class="left_line"></span>
      </template>
       <template slot="isMedicalInsurance">
        <span>
          <el-radio-group v-model="obj.isMedicalInsurance">
            <el-radio class="radio" :label="0" disabled>非医保</el-radio>
            <el-radio class="radio" :label="1" disabled>医保</el-radio>
          </el-radio-group>
        </span>
      </template>
       <!-- <template slot="subsequentVisit">
        <span>
          <el-radio-group v-model="obj.subsequentVisit">
            <el-radio class="radio" :label="0" disabled>初诊</el-radio>
            <el-radio class="radio" :label="1" disabled>复诊</el-radio>
          </el-radio-group>
        </span>
      </template> -->
      <template slot="sex">
        <span>
          <el-radio-group v-model="obj.sex">
            <el-radio class="radio" :label="'1'" disabled>男</el-radio>
            <el-radio class="radio" :label="'2'" disabled>女</el-radio>
          </el-radio-group>
        </span>
      </template>
      <template slot="age">
        <span>
          {{obj.birthday | birthdayComputed}}
        </span>
      </template>
      <!-- <template  slot="contact_type">
        <el-form-item :prop="'relation.' + index + '.type'" :rules="{required: false, message: '请选择关系', trigger: 'change'}">
          <el-select v-model="obj.contactList" placeholder="关系">
              <el-option
                v-for="item in relationTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
      </template> -->
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" v-ever-click-once="disabled" :disabled="disabled" @click='updateBaseInfo'>保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import userbaseapi from '../store/userbaseapi'
  import sysvalue from '../../warehouse/store/sysvalueapi'
  // import mainheaderapi from '@/workspace/store/mainheaderapi'
  import moment from 'moment'

  let schema = [
    {
      name: 'basic',
      label: '基本信息',
      comp: 'custom',
      span: 24,
      props: {
        class: 'abc'
      }
    },
    {
      name: 'name',
      label: '患者姓名',
      props: {
        disabled: true
      }
    },
    {
      name: 'sex',
      label: '性别',
      comp: 'custom',
      props: {
        disabled: true
      }
    },
    {
      name: 'age',
      label: '年龄',
      comp: 'custom'
      // props: {
      //   disabled: true,
      //   append: '岁'
      // }
    },
    {
      name: 'patientNumber',
      label: '患者档案号',
      props: {
        disabled: true
      }
    },
    {
      name: 'outpatientNumber',
      label: '门诊档案号',
      props: {
        disabled: true
      }
    },
    {
      name: 'sn',
      label: '会员编号',
      props: {
        disabled: true
      }
    },
    {
      name: 'isMedicalInsurance',
      label: '患者身份',
      comp: 'custom'
    },
    {
      name: 'basic',
      label: '详细信息',
      comp: 'custom',
      span: 24,
      props: {
        class: 'abc'
      }
    },
    {
      name: 'iden',
      label: '证件类型',
      comp: 'idcard',
      props: {
        disabled: true
      }
    },
    {
      name: 'mobile',
      label: '手机号'
    },
    {
      name: 'contactList',
      label: '联系人类型',
      comp: 'userrel',
      span: 23
    },
    {
      name: 'telephone',
      label: '座机号'
    },
    {
      name: 'marry',
      label: '婚姻状况',
      comp: 'sys-type',
      props: {
        code: 'GBT.2261.2',
        disabled: true
      }
    },
    {
      name: 'sourceName',
      label: '渠道来源',
      props: {
        disabled: true
      }
    },
    {
      name: 'company',
      label: '工作单位'
    },
    {
      name: 'visitNumCount',
      label: '就诊次数',
      props: {
        disabled: true
      }
    }
    // {
    //   name: 'subsequentVisit',
    //   label: '就诊类型',
    //   comp: 'custom'
    // }
  ]

  export default {
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.pregnant = false
      obj.providerName = ''
      obj.contactList = []
      obj.result = []
      // obj.result = [{diseaseType: null, diseaseName: '疼痛', diseaseOrigId: '6025923', diagnoseType: 1, comment: '', diagnoseList: []}]
      var checkPhone = (rule, value, callback) => {
        // if (!value[0].type || !value[0].mobile) {
        //   return callback(new Error('必填项'))
        // } else {
        callback()
        // }
      }
      var validateMobile = (rule, value, callback) => {
        var regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!regMobile.test(value.trim())) {
          return callback(new Error('请正确输入11位手机号码'))
        } else {
          callback()
        }
        // this.obj.form.relation.map(v => {
        //   if (!v.mobile) {
        //     return callback(new Error('请输入手机号'))
        //   } else if (!regMobile.test(v.mobile.trim())) {
        //     return callback(new Error('请输入11位手机号码'))
        //   }
        //   callback()
        // })
      }
      var checkTelephone = (rule, value, callback) => {
        if (value) {
          value = String(value)
          let res = /^0\d{2,3}-\d{7,8}$/
          if (!res.test(value)) {
            callback(new Error('电话格式为000(0)-0000000(0)'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      // var checkResult = (rule, value, callback) => {
      //   if (value[0].diseaseOrigId === '') {
      //     return callback(new Error('必填项'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        disabled: false,
        dialogFlag: false,
        schema,
        obj,
        userbaseapi,
        optResult: [],
        resource: '',
        moment,
        relationTypes: [],
        rules: {
          contactList: [{required: false, message: '必填项', trigger: 'blur', validator: checkPhone}],
          mobile: [{required: false, message: '必填项', trigger: 'blur', validator: validateMobile}],
          telephone: [{required: false, message: '无效座机号', trigger: 'blur', validator: checkTelephone}]
          // providerId: [{required: true, message: '必填项', trigger: 'blur'}],
          // hospitalizedSource: [{required: true, message: '必填项', trigger: 'blur', type: 'number'}],
          // deposit: [{required: true, message: '必填项', trigger: 'blur', type: 'number'}]
        },
        hisReportCode: 'thc_phr.hospitalized_record_ZHW_20180413',
        baseInfoObj: {},
        id: ''
      }
    },
    methods: {
      close () {
        this.dialogFlag = false
        // this.$refs.form.$refs.form.resetFields()
      },
      async open () {
        let visitSn = this.$route.query.visitSn || this.$route.query.visitNumber
        userbaseapi.getPatitentById(this.$route.query.patientId, visitSn).then(result => {
          this.baseInfoObj = result
          if (result.contactList.length > 0) {
            result.contactList = result.contactList.filter((v, index) => {
              v.type = v.type + ''
              return v
            })
          }
          this.obj.name = result.name
          this.obj.sex = result.sex
          this.obj.age = result.age
          this.obj.patientNumber = result.patientNumber
          this.obj.outpatientNumber = result.outpatientNumber
          this.obj.patientID = result.id
          this.obj.sn = result.sn
          this.obj.mobile = result.mobile
          this.obj.telephone = result.telephone
          this.obj.iden = result.iden || {}
          this.obj.sourceName = result.sourceName
          this.obj.birthday = result.birthday
          this.obj.marry = result.marry || ''
          this.obj.company = result.company
          this.obj.contactList = result.contactList
          this.obj.visitNumCount = result.visitNumCount
          this.obj.subsequentVisit = result.subsequentVisit // 是否复诊  0否 1是
          this.obj.isMedicalInsurance = result.isMedicalInsurance
          this.dialogFlag = true
        })
      },
      async updateBaseInfo () {
        this.$refs.form.$refs.form.validate(async validate => {
          if (validate) {
            userbaseapi.getById(this.$route.query.patientId).then(async res => {
              let option = res.data
              option.id = this.$route.query.patientId
              option.company = this.obj.company
              option.mobile = this.obj.mobile
              option.telephone = this.obj.telephone
              option.contactList = this.baseInfoObj.contactList
              option.name = this.obj.name
              option.origId = this.baseInfoObj.origId
              let ress = await this.userbaseapi.append(option)
              if (ress.head.errCode === 0) {
                this.close()
                this.$notify({
                  title: '成功',
                  message: '修改信息成功',
                  type: 'success'
                })
              }
            })
          }
        })
        //  手机号 联系人类型 联系人电话 座机号 工作单位
      }
    },
    created () {
      sysvalue.listOnce('GBT.4761').then(result => {
        this.relationTypes = result
      })
    },
  }
</script>
<style scoped lang='scss'>
  .el-dialog .el-dialog__body {
    .el-col-24{
      .el-form-item{
        margin-bottom: 6px;
        position: relative;
        font-weight: 700;
        .left_line{
          position: absolute;
          width: 3px;
          height: 22px;
          background: #1c7bef;
          top: 9px;
          left: -85px;
        }
      }
    }
  }
</style>
