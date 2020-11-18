<template>
  <div class="reject">
    <techOpeartTitle v-model='dialog' title='拒绝执行' :patient='patient' @save='submit'>
      <el-form :model="obj"  :rules="rules" ref="ruleForm" label-width="100px">
        <el-col class="bottom_input">
            <el-form-item label="原因：" prop="reason">
              <sys-type
                  code="THC_CPOE_HOSP_NURES_NOT_EXCUTE_REASON"
                  placeholder="请选择不执行原因"
                  filterable="true"
                  v-model="obj.reason"
                ></sys-type>
            </el-form-item>
        </el-col>
        <el-col>
           <el-form-item label="备注：" prop="remark">
             <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              :maxlength='200'
              v-model="obj.remark">
            </el-input>
            </el-form-item>
        </el-col>
      </el-form>
    </techOpeartTitle>
  </div>
</template>
<script>
import api from '@/infusion/store/infusion.js'
import techOpeartTitle from './tech.opeart.title'
export default {
  props: {

  },
  data () {
    return {
      api,
      dialog: false,
      patient: null,
      ids: [],
      obj: {
        remark: '',
        reason: ''
      },
      rules: {
        reason: [
            { required: true, message: '请选择拒绝执行原因', trigger: 'change' }
        ]
      },
      reason: []
    }
  },
  computed: {

  },
  components: {
    techOpeartTitle
  },
  mounted () {
  },
  methods: {
    async submit () {
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
            operateCode: 'REJECT',
            remark: this.obj.remark,
            reason: this.obj.reason
          }
          console.log(params)
          let res = await this.api.rejectBatch(params)
          console.log(res)
          if (res && res.head && res.head.errCode === 0) {
            this.$notify({
              title: '成功',
              message: '拒绝执行提交成功',
              type: 'success'
            })
            this.dialog = false
            this.$emit('close')
          }
        }
      })
    },
    open (patient, ids, code) {
      this.ids = ids
      this.patient = patient
      this.dialog = true
      this.obj = {
        remark: '',
        reason: ''
      }
      this.$nextTick(_ => {
        this.$refs.ruleForm.resetFields()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.reject{
  /deep/ .el-form-item__label {
    display: inline-block;
      text-align: justify;
      text-align-last: justify;
      line-height: 30px;
      padding-left: 15px;
      &:before{
          content: "*";
          color: #fff;
          margin-right: 4px;
      }
  }
}
</style>
