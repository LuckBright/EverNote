<template>
  <el-dialog
    title="添加随访"
    :visible.sync="dialogVisible"
    class="ui_dialog_02"
    :before-close="closeEvent"
  >
    {{patientName}}
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="newFollowup"
      label-position="left"
    >
      <div slot="default"></div>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEvent">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import wapi from '@/arrange/store/appointapi'
// import sapi from '@/sob/store/service.panel'
let schema = [
  {
    name: 'name',
    label: '患者姓名'
  },
  {
    name: 'execDptId',
    label: '随访执行科室',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '请选择执行科室',
      filterable: true
    },
    span: 8
  },
  {
    name: 'execDoctorId',
    label: '执行人',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '请选择执行人',
      filterable: true
    },
    span: 8
  },
  {
    name: 'belongDptId',
    label: '归属科室',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '请选择归属科室',
      filterable: true
    },
    span: 8
  },
  {
    name: 'templateId',
    label: '随访计划',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '请选择随访计划',
      filterable: true
    }
  },
  {
    name: 'comment',
    label: '随访说明',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 300
    }
  }
]
export default {
  props: ['visible', 'patientIds'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.dptId = ''
    return {
      obj,
      api,
      wapi,
      schema,
      dialogVisible: false,
      patientName: '',
      rules: {
        name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        execDptId: [
          { required: true, message: '请选择执行科室', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择随访计划', trigger: 'change' }
        ],
        belongDptId: [
          { required: true, message: '请选择归属科室', trigger: 'change' }
        ]
      },
      patientSource: 1 // 患者来源 1：住院  2：门诊
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        this.dialogVisible = val
        let tempName = []
        this.patientIds &&
          this.patientIds.forEach(item => {
            tempName.push(item.patientName)
          })
        this.obj.name = tempName.join()
        this.getDpt()
        // this.getTemplate()
        // this.getDptinfo()
      },
      deep: true
    },
    'obj.execDptId': {
      handler: function (val) {
        this.getStaff(val)
      }
    },
    'obj.belongDptId': {
      handler: function (val) {
        this.getTemplate(val)
      }
    }
  },
  methods: {
    closeEvent () {
      this.$emit('close', false)
    },
    save () {
      this.$refs.newFollowup.$refs.form.validate(valid => {
        if (valid) {
          const patients = []
          this.patientIds.forEach(item => {
            const patient = {}
            patient.visitDptId = item.regProvId || item.provId
            patient.patientId = item.patientId
            patient.visitSn = item.visitSn
            if (this.patientSource === 1) {
              patient.dischargeTime = item.outHosDate
            } else {
              patient.visitTime = item.visitDate
            }
            patients.push(patient)
          })
          this.obj.patients = patients
          this.obj.patientSource = this.patientSource
          api.createFollowUp(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              if (rs.data.flag) {
                this.$messageTips(this, 'success', '创建成功')
              } else if (!rs.data.flag) {
                this.$messageTips(this, 'warning', '部分未成功')
              }
              this.$emit('update')
            }
          })
        }
      })
    },
    getDpt () {
      wapi
        .getWarehouseDeptList({
          codesMatchValues: [
            {
              codes: ['SXX000002'],
              value: ''
            }
          ]
        })
        .then(rs => {
          this.$ever.getFieldFromSchema(
            this.schema,
            'execDptId'
          ).props.options = rs.data
          this.$ever.getFieldFromSchema(
            this.schema,
            'belongDptId'
          ).props.options = rs.data
        })
    },
    getTemplate (val) {
      this.api.list({ dptId: val }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.templateId = ''
          this.$ever.getFieldFromSchema(
            this.schema,
            'templateId'
          ).props.options = rs.data.resultList
        }
      })
    },
    getStaff (id) {
      api
        .getStaff({
          relationId: id,
          relationType: 401
        })
        .then(rs => {
          this.$ever.getFieldFromSchema(
            this.schema,
            'execDoctorId'
          ).props.options = rs.data
        })
    }
    // getDptinfo () {
      // let params = {
      //   relationType: 401,
      //   relationId: this.$store.state.currentUser.userId
      // }
      // sapi.getLocalSectionVoBySearch(params).then(rs => {
      //   if (rs && rs.length > 0) {
      //     this.obj.dptId = rs[0].id
      //   }
      // })
    // }
  }
}
</script>
