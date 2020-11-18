<template>
  <el-dialog :title="this.obj.id ? '编辑家庭医生' : '添加家庭医生'" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
    <ever-form2
      ref="sign"
      :schema="schema"
      v-model="obj"
      :api="api"
      :info="true"
      label-width="140px"
      :rules="rules">
      <div slot="default"></div>
    </ever-form2>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../../store/signapi'
let schema = [
  {
    name: 'doctorId',
    label: '签约医生姓名',
    comp: 'ever-staff-select',
    span: 12,
    props: {
      clearable: true,
      placeholder: '请输入签约医生姓名',
      params: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
      }
    },
  },
  {
    name: 'times',
    label: '签约时间',
    comp: 'everRangePicker',
    span: 24,
    parentClass: 'custom-form-item not-required'
  }
]
export default {
  props: {
    'patientId': {
      type: String,
      default: ''
    },
    'isedit': {
      type: Boolean,
      default: false
    },
    'signId': {
      type: String,
      default: ''
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.type = '1'
    obj.doctorId = ''
    obj.startTime = ''
    obj.endTime = ''
    return {
      schema,
      obj,
      api,
      dialogVisible: false,
      rules: {
        times: [{required: true, message: '请选择签约时间', trigger: 'change'}],
        doctorId: [{ required: true, message: '请输入签约医生姓名', trigger: 'change' }]
      },
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.$nextTick(_ => {
        !this.signId && this.reset()
        this.isedit && this.getById(this.signId)
      })
    },
    reset () {
      this.$refs.sign.$refs.form.resetFields()
      this.obj.doctorId = ''
      this.obj.startTime = ''
      this.obj.endTime = ''
      this.obj.id = ''
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      this.obj.patientId = this.patientId
      this.obj.startTime = this.obj.times[0]
      this.obj.endTime = this.obj.times[1]
      let request = this.obj.id ? api.modify : api.create
      this.$refs.sign.$refs.form.validate(valid => {
        valid && request(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$emit('update')
          }
        })
      })
    },
    getById (id) {
      api.getById({'id': id}).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.id = rs.data.id
          this.obj.doctorId = rs.data.doctorId
          this.obj.times = [rs.data.startTime, rs.data.endTime]
        }
      })
    }
  },
  components: {
  }
}
</script>
