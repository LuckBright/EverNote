<template>
  <div class="execute">
    <techOpeartTitle v-model='dialog' title='执行完成' :patient='patient' @save='submit'>
      <el-form :model="obj"  :rules="rules" ref="ruleForm" label-width="100px">
        <el-col class="bottom_input">
          <el-form-item label="执行人：" prop="executeBy">
              <treatDoctorList ref='treat'  v-model='obj.executeBy'  placeholder='请选择执行人'></treatDoctorList>
          </el-form-item>
        </el-col>
        <el-col>
           <el-form-item label="执行时间：" prop="completeTime">
              <el-date-picker
                v-model="obj.completeTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm'
                value-format='yyyy-MM-dd HH:mm:ss'
                placeholder="请选择执行时间">
              </el-date-picker>
            </el-form-item>
        </el-col>
      </el-form>
    </techOpeartTitle>
  </div>
</template>
<script>
import api from '@/infusion/store/infusion.js'
import techOpeartTitle from './tech.opeart.title'
import treatDoctorList from '@/infusion/page/treat/treat.doctor.list.vue'
export default {
  props: {

  },
  data () {
    return {
      api,
      dialog: false,
      rules: {
        completeTime: [
            { required: true, message: '请选择执行时间', trigger: 'change' }
        ],
        executeBy: [
            { required: true, message: '请选择执行人', trigger: 'change' }
        ]
      },
      obj: {
        executeBy: '',
        executeName: '',
        completeTime: ''
      },
      patient: {},
      ids: []
    }
  },
  computed: {

  },
  components: {
    techOpeartTitle,
    treatDoctorList
  },
  mounted () {
  },
  methods: {
    open (patient, ids) {
      this.patient = patient
      this.ids = ids
      this.dialog = true
      this.$nextTick(_ => {
        this.$refs.treat.first = false
        this.$refs.treat.remoteMethod()
        this.$refs.ruleForm.resetFields()
        this.obj.completeTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      })
    },
    submit () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let techValue = JSON.parse(localStorage.getItem('tech_value'))
          techValue.section = techValue.section || {}
          let params = {
            executeIds: this.ids, // string []
            actualExecuteRoomId: techValue.section.id, // string
            actualExecuteRoomName: techValue.section.name, // string
            actualExecuteProviderId: techValue.provider.id, // string
            actualExecuteProviderName: techValue.provider.name, // string
            executeBy: this.obj.executeBy,
            executeName: this.$refs.treat.getName(),
            completeTime: this.obj.completeTime,
            operateCode: 'EXECUTE',
          }
          let res = await this.api.executeBatch(params)
          if (res && res.head && res.head.errCode === 0) {
            this.$notify({
              title: '成功',
              message: '执行提交成功',
              type: 'success'
            })
            this.dialog = false
            this.$emit('close')
          }
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.execute{
  /deep/ .el-input, /deep/ .el-select{
    width: 100%;
    .el-input__inner{
      width: 100%;
    }
  }
}
</style>
