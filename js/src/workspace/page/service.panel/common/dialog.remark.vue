<template>
  <div>
    <el-dialog 
      title="预约备注"
      :visible.sync="dialogVisible"
      class="ui_dialog_02 spe"
      width="395px">
        <ever-form2
        ref="remark"
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules">
          <div slot="default"></div>
          <template slot="symptom">
            <el-form-item style="margin-left:-120px;">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="obj.symptom"
                maxlength="70"
                :autosize="{ minRows: 2, maxRows: 6 }"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </template>
        </ever-form2>
        <div slot="footer" class="dialog-footer mt10">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/sob/store/service.panel'
let schema = [
  {
    name: 'symptom',
    comp: 'custom',
    span: 24
  }
]
export default {
  props: {
    patientData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.id = null
    return {
      schema,
      obj,
      api,
      dialogVisible: false,
      rules: {
        symptom: [{ required: false, message: '请填写预约备注', trigger: 'change' }],
      }
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.$nextTick(_ => {
        this.reset()
        this.setData(this.patientData)
      })
    },
    setData (val) {
      this.obj.id = val.id
      this.obj.symptom = val.symptom
    },
    reset () {
      this.$refs.remark.$refs.form.resetFields()
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      this.$refs.remark.$refs.form.validate(valid => {
        valid && api.updateSymptom(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$emit('update')
          }
        })
      })
    }
  }
}
</script>
<style scoped>
</style>

