<template>
  <div>
    <el-dialog 
      title="要取消预约吗？"
      :visible.sync="dialogVisible"
      width="395px"
      class="cancel">
      <ever-form2 
        ref="cancelform"
        :schema="schema"
        v-model="obj"
        :rules="rules"
        class="pl10"
        :api="api"
        :label-position="'right'"
        :label-width="'76px'">
        <div slot="default"></div>
        <template slot="name">
          {{patientData.patientName}}
          <span class="ml5">
            {{patientData.patient && patientData.patient.patientNumber}}
          </span>
        </template>
        <template slot="birthday">
          <span v-if="patientData.patient && patientData.patient.age <= 1">
            {{patientData.patient && patientData.patient.birthday | birthdayComputed}}
          </span>
          <span v-else>
            {{patientData.patient && $moment(patientData.patient.birthday).format('YYYY-MM-DD')}}
            <span v-if="patientData.patientAge">
              {{patientData.patientAge}}岁
            </span>
          </span>
          {{patientData.patientSex | formatSex}}
        </template>
        <template slot="date">
          {{patientData.date && $moment(patientData.date).format('YYYY-MM-DD')}}
          <span class="ml5">
            {{patientData.startTimeStr}}
          </span>
          <span class="ml15" v-if="patientData.timeLength">
            ({{patientData.timeLength}}分钟)
          </span>
        </template>
        <template slot="cancelReason">
          <el-input type="textarea" v-model="obj.cancelReason" :maxlength="400" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </template>    
        <template slot="message">
          <el-switch
            v-model="sendMessage">
          </el-switch>
          <span class="ml20" style="color:#666;">自动发送：</span>
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="patientData.isSmsRemind">
          </el-switch>          
        </template>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeEvent">关 闭</el-button>
        <el-button plain  :disabled="disabled" @click="save">确认取消</el-button>
      </span>
    </el-dialog>
  </div>
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
    name: 'appointmentResourceName',
    comp: 'readonlyitem',
    label: '医生:'
  },
  {
    name: 'symptom',
    comp: 'readonlyitem',
    label: '备注:'
  },
  {
    name: 'cancelReason',
    comp: 'custom',
    label: '取消原因:'
  }
  // {
  //   name: 'message',
  //   comp: 'custom',
  //   label: '发送短信:'
  // }
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    patientData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      dialogVisible: false,
      schema,
      obj,
      api,
      sendMessage: '',
      disabled: false,
      rules: {
        cancelReason: [
          {
            required: true,
            message: '请填写取消原因',
            trigger: 'change'
          }
        ],
      }
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val
    },
    patientData: {
      handler: function (val) {
        if (val.doctorName && val.doctorName !== '') {
          this.obj.appointmentResourceName = val.deptName + '-' + val.doctorName
        } else {
          this.obj.appointmentResourceName = val.deptName
        }
        this.obj.name = val.patientName
        this.obj.symptom = val.symptom
        this.obj.cancelReason = val.cancelReason
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
      this.$refs.cancelform.$refs.form.validate(valid => {
        if (!valid) {
          this.disabled = false
          return false
        }
        api.cancelAppoint(
          {
            id: this.patientData.id,
            cancelReason: this.obj.cancelReason
          }
        ).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$emit('update')
          }
          this.disabled = false
        }).catch(e => {
          this.disabled = false
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cancel {
  /deep/ .el-textarea__inner {
    background: #FEF5BE;
  }
  /deep/ .el-dialog__header{padding-top: 20px;padding-left: 20px;padding-bottom: 5px;}
  /deep/ .el-dialog__headerbtn{top: 20px;}
  /deep/ .el-form-item__label{color:#999999;}
}
</style>
