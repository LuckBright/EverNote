<template>
  <div class="leave">
    <dialogCom
      v-model="visible"
      title="新生儿登记"
      :hospitalizedNumber="patient.hospitalizedNumber"
      @save="save"
      :dis="edit"
    >
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span="12"
        labelWidth="110px"
        label-position="right"
        ref="form"
        :nosubmit="true"
        :rules="rules"
        :allDisabled="edit"
      >
        <template slot="midwifeId">
          <el-select v-model="obj.midwifeId" clearable filterable placeholder="请选择" value-key="id" class='wb100'>
            <el-option
              v-for="item in nurseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="birth">
          <el-date-picker
          class='wb100'
            v-model="obj.birth"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            :pickerOptions="{
                disabledDate (time) {
                  return time.getTime() > Date.now()
                }
              }"
          ></el-date-picker>
        </template>
      </ever-form2>
      <el-row v-if="edit" class="back">
        {{obj.operatorName}}于{{$moment(obj.createTime).format('YYYY-MM-DD HH:mm')}}为{{obj.patientName}}办理新生儿登记
        <span
          @click="cancle"
        >取消登记</span>
      </el-row>
    </dialogCom>
  </div>
</template>
<script>
import dialogCom from './dialog.vue'
import api from '@/inpatient/store/resident.js'
import newapi from '@/inpatient/store/newresident.js'
let schema = [
  {
    name: 'patientName',
    span: 12,
    label: '婴儿姓名',
    props: {
      maxlength: 10
    }
  },
  {
    name: 'sex',
    label: '婴儿性别',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1',
      useValue: true,
      placeholder: '全部'
    }
  },
  {
    label: '出生日期',
    name: 'birth',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'deliveryType',
    label: '分娩方式',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'CV02.10.003',
      placeholder: '分娩方式'
    }
  },
  {
    name: 'neonateHeight',
    label: '出生身长',
    span: 12,
    props: {
      placeholder: '请输入身长'
    },
    slots: [
      {
        name: 'append',
        template: '<span>cm</span>'
      }
    ]
  },
  {
    name: 'neonateWeight',
    label: '出生体重',
    span: 12,
    props: {
      placeholder: '请输入体重'
    },
    slots: [
      {
        name: 'append',
        template: '<span>g</span>'
      }
    ]
  },
  {
    name: 'healthCondition',
    label: '健康状况',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'THC_ZYGZT_XSEDJ_JKQK'
    }
  },
  {
    name: 'apgar',
    label: 'Apgar评分',
    span: 12,
    props: {
      placeholder: '请输入Apgar评分'
    },
  },
  {
    name: 'gestationalAge',
    label: '出生孕周',
    span: 12,
    props: {
      placeholder: '请输入出生孕周',
      maxlength: 10
    },
  },
  {
    name: 'midwifeId',
    label: '接生者',
    span: 12,
    comp: 'custom',
    props: {
      options: [],
      valueKey: 'id'
    }
  },
]
export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.birth = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    function numberval (rule, value, callback) {
      if (rule.required && (value === '' || value === null)) {
        callback(new Error('请输入数字类型'))
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型'))
      } else {
        callback()
      }
    }
    let validate = (rule, value, callback) => {
      if (!value) {
        callback('请选择出生日期')
      } else if (this.$moment(value).valueOf() - this.$moment().valueOf() <= 0) {
        callback()
      } else {
        callback(new Error('不能大于当前时间'))
      }
    }
    return {
      api,
      newapi,
      schema,
      obj,
      visible: false,
      patient: {},
      rules: {
        patientName: [
          { required: true, message: '请输入婴儿姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择婴儿性别', trigger: 'change' }
        ],
        birth: [
          { required: true, trigger: 'blur', validator: validate }
        ],
        neonateWeight: [
          { required: true, validator: numberval, trigger: 'blur' },
          { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入整数或小数点后不超过两位的小数' }
        ],
        neonateHeight: [
          { required: true, validator: numberval, trigger: 'blur' },
          { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入整数或小数点后不超过两位的小数' }
        ],
        apgar: [
          { validator: numberval, trigger: 'blur' },
          { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入整数或小数点后不超过两位的小数' }
        ],
        deliveryType: [
          { required: true, message: '请选择分娩方式', trigger: 'select' }
        ],
        // midwifeId: [
        //   { required: true, message: '请选择接生人员', trigger: 'select' }
        // ]
      },
      edit: false,
      nurseOptions: [],
      item: {}
    }
  },
  watch: {

  },
  components: {
    dialogCom
  },
  created () {

  },
  methods: {
    async getInfoData (patient) {
      let res = await this.newapi.getNeonateById({
        id: patient.clickChild.id
      })
      if (res.head && res.head.errCode === 0) {
        this.obj = res.data
      }
    },
    async getDoctor () {
      let res = await this.api.getStaffListByCondition({
        orgIdList: [this.$store.state.currentUser.organizationId],
        typeCodeList: ['DOCTOR']
      })
      if (res.data && res.data.resultList) {
        this.nurseOptions = res.data.resultList || []
      }
    },
    open (patient, type) {
      this.patient = patient
      this.obj.patientName = patient.patientName + '婴'
      this.visible = true
      this.getDoctor()
      if (type) {
        this.getInfoData(patient)
        this.edit = true
      }
    },
    async save () {
      this.$refs.form.$refs.form.validate(async (valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.obj))
          obj.motherHospitalizedNumber = this.patient.hospitalizedNumber
          obj.motherPatientId = this.patient.patientId
          obj.birth = this.$moment(obj.birth).format('YYYY-MM-DD HH:mm:ss')
          obj.motherBedId = this.patient.bedId
          let res = await this.api.register(obj).catch(() => {
            this.$emit('success')
            this.visible = false
          })
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              type: 'success',
              message: '新生儿登记成功!'
            })
            this.$bus.$emit('global:listwating')
            this.$emit('success')
            this.visible = false
          }
        } else {
          this.$refs.form.autofocus()
        }
      })
    },
    async cancle () {
      let res = await this.newapi.unregister({
        id: this.patient.clickChild.id
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: '取消新生儿登记成功!'
        })
        this.visible = false
        this.$emit('success')
      }
    }

  }
}
</script>
<style lang='scss' scoped>
.leave {
  .wb100 {
    width: 100%;
  }
}
</style>
