<template>
  <el-dialog
    :title="diagType ? '患者已到院？': '患者已离开？'"
    :visible.sync="dialogVisible"
    class="diagnosis"
    width="395px"
    :before-close="closeEvent"
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      class="pl10"
      :label-position="'left'"
      :label-width="'46px'"
    >
      <div slot="default"></div>
      <template slot="name">
        {{patientData.patientName}}
        <span
          class="ml5"
        >{{patientData.patient && patientData.patient.patientNumber}}</span>
      </template>
      <template slot="date">
        {{$moment(obj.appointmentDate).format('YYYY-MM-DD')}}
        <span
          class="ml5"
        >{{patientData.appointmentStarttime}}</span>
        <span class="ml15" v-if="patientData.timeLength">({{patientData.timeLength}}分钟)</span>
      </template>
      <template slot="birthday">
        <span
          v-if="patientData.patient && patientData.patient.age <= 1"
        >{{patientData.patient && patientData.patient.birthday | birthdayComputed}}</span>
        <span v-else>
          {{patientData.patient && $moment(patientData.patient.birthday).format('YYYY-MM-DD')}}
          <span
            v-if="patientData.patientAge"
          >{{patientData.patientAge}}岁</span>
        </span>
        {{patientData.patientSex | formatSex}}
      </template>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeEvent">取 消</el-button>
      <el-button plain :disabled="disabled" @click="save">{{diagType ? '确认到院' : '确认离开'}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/sob/store/service.panel'
let schema = [
  {
    name: 'name',
    comp: 'custom',
    label: '姓名:'
  },
  {
    name: 'birthday',
    comp: 'custom',
    label: '生日:'
  },
  {
    name: 'date',
    comp: 'custom',
    label: '时间:'
  },
  {
    name: 'doctorName',
    comp: 'readonlyitem',
    label: '医生:'
  },
  {
    name: 'symptom',
    comp: 'readonlyitem',
    label: '备注:'
  }
]
export default {
  props: {
    patientData: {
      type: Object,
      default: () => { }
    },
    visible: {
      type: Boolean,
      default: false
    },
    diagType: {
      type: Number,
      default: 0
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      api,
      schema,
      dialogVisible: false,
      disabled: false
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        this.dialogVisible = val
        if (!this.id) {
          this.obj.name = ''
          this.obj.id = ''
        }
      },
      deep: true
    },
    'patientData': {
      handler: function (val) {
        if (val.doctorName && val.doctorName !== '') {
          this.obj.doctorName = val.deptName + '-' + val.doctorName
        } else {
          this.obj.doctorName = val.deptName
        }
        this.obj.symptom = val.symptom
      },
      deep: true
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.disabled = false
    },
    closeEvent () {
      this.dialogVisible = false
    },
    save () {
      this.disabled = true
      const res = this.diagType === 1 ? api.arrival : api.leave
      res({ 'visitNumber': this.patientData.visitNumber }).then(rs => {
        this.dialogVisible = false
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          this.dialogVisible = false
          this.$emit('update')
        }
      })
    },
    getCategorydetail (id) {
      api.getCategorydetail({ 'id': id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.id = rs.data.id
          this.obj.name = rs.data.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.diagnosis {
  /deep/ .el-dialog__header {
    padding-top: 20px;
    padding-left: 20px;
    padding-bottom: 5px;
  }
  /deep/ .el-dialog__headerbtn {
    top: 20px;
  }
  /deep/
    .el-form:not(.custom-form)
    .el-form-item--small.el-form-item:not(.custom-form-item) {
    margin-bottom: 0px;
  }
  /deep/ .el-form-item__label {
    color: #999999;
  }
}
</style>
