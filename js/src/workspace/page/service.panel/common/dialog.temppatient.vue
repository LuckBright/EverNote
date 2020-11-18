<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="395px"
    :before-close="closeEvent"
    class="patient">
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :info="true"
      :rules="rules"
      ref="forms"
      :label-width="'80px'">
      <div slot="default"></div>
      <template slot="date">
        {{$moment(obj.appointmentDate).format('YYYY-MM-DD')}}{{obj.appointmentEndtime}}
        <span class="ml5">
          {{patientData.appointmentStarttime}}
        </span>
        <span class="ml15" v-if="patientData.timeLength">
          {{patientData.timeLength}}分钟
        </span>
      </template>
      <template slot="patientSex">
        <el-radio-group v-model="obj.patientSex">
          <el-radio class="radio" label="1">男</el-radio>
          <el-radio class="radio" label="2">女</el-radio>
        </el-radio-group>
      </template>
      <template slot="birthday">
        <age v-model="obj.birthday"></age>
        <!-- <age
          class="mb5"
          v-model="obj.agebirthday"
          :iden="obj.idNo"
          :rules="{require: false, validator: validateAge, trigger: 'blur'}"
        ></age> -->
      </template>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="disabled" @click="save">完成建档并到诊</el-button>
      <el-button plain @click="closeEvent">返回</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import api from '@/sob/store/service.panel'
  import age from '@/components/age'

  let schema = [
    {
      name: 'date',
      comp: 'custom',
      label: '时间:'
    },
    {
      name: 'deptName',
      comp: 'readonlyitem',
      label: '科室:'
    },
    {
      name: 'appointmentDoctorName',
      comp: 'readonlyitem',
      label: '医生:'
    },
    {
      name: 'patientName',
      label: '患者姓名:'
    },
    {
      name: 'patientSex',
      label: '性别:',
      comp: 'custom'
    },
    {
      name: 'birthday',
      label: '出生日期:',
      comp: 'custom'
    },
    {
      name: 'patientMobile',
      label: '手机号码:'
    }
  ]
  export default {
    props: {
      patientData: {
        type: Object,
        default: () => {}
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      // obj.agebirthday = ''
      // let validateAge = function (rule, value, callback) {
      //   if (!value || value.age === '' || value.birthday === '') {
      //     callback(new Error('请输入出生日期与年龄'))
      //   } else if (!/^\d+$/.test(value.age)) {
      //     callback(new Error('年龄数值非法'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        obj,
        api,
        schema,
        // validateAge,
        dialogVisible: false,
        disabled: false,
        rules: {
          patientName: [
            { required: true, message: '请输入患者姓名', trigger: 'change' },
            { min: 2, max: 32, message: '长度为2-32位字符', trigger: 'change' }
          ],
          patientSex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          birthday: [
            { required: true, message: '请输入出生日期', trigger: 'change' }
          ],
          patientMobile: [
            { required: true, message: '请输入手机号', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      'visible': {
        handler: function (val) {
          this.dialogVisible = val
        },
        deep: true
      },
      'patientData': {
        handler: function (val) {
          this.setData(val)
        },
        deep: true
      }
    },
    methods: {
      setData (val) {
        this.obj.deptName = val.deptName
        this.obj.appointmentDoctorName = val.appointmentDoctorName
        this.obj.patientName = val.patientName
        this.obj.patientMobile = val.patientMobile
        this.obj.id = val.patientId
        this.obj.patientSex = val.patientSex
        this.obj.birthday = val.birthday
        // if (val.patient) {
        //   this.obj.agebirthday = {
        //     age: val.patient.age,
        //     isMonth: val.patient.isMonth,
        //     isDay: val.patient.isDay,
        //     birthday: val.patient.birthday
        //   }
        //   this.obj.birthday = val.patient.birthday
        // }
      },
      open () {
        this.dialogVisible = true
        this.disabled = false
        this.setData(this.patientData)
      },
      closeEvent () {
        this.dialogVisible = false
        this.$emit('close', false)
      },
      save () {
        this.obj.name = this.obj.patientName
        this.obj.sex = this.obj.patientSex
        this.obj.mobile = this.obj.patientMobile
        this.disabled = true
        this.$refs.forms.$refs.form.validate(valid => {
          valid && api.arrival({'visitNumber': this.patientData.visitNumber, 'patientInfo': this.obj}).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              this.dialogVisible = false
              this.$emit('update')
            }
          })
          this.disabled = false
        })
      }
    },
    components: {
      age
    }
  }
</script>
<style lang="scss" scoped>
  .patient {
    /deep/ .el-input__inner{background-color: #FEF5BE;}
    /deep/ .el-input{width: 280px;}
    /deep/ .el-form-item__label{color:#999999;}
    /deep/ .el-form:not(.custom-form) .el-form-item--small.el-form-item:not(.custom-form-item) {margin-bottom: 0px;}
  }
</style>

