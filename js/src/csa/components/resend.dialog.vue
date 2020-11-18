<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    title="坚持发药"
    width="500px"
  >
    <div class="dialog-body">
      <ever-form2
        ref="form"
        :schema="schema"
        :rules="rules"
        :nosubmit="true"
        v-model="queryobj"
        label-position="right"
        labelWidth="80px"
      >
      </ever-form2>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="default" @click="close">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/csa/store/advice'

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    const schema = [{
      name: 'reason',
      label: '原因',
      span: 24,
      comp: 'el-input',
      props: {
        placeholder: '请输入原因',
        type: 'textarea'
      }
    }]
    return {
      visible: false,
      schema,
      queryobj: this.$ever.createObjFromSchema(schema),
      rules: {
        reason: [
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' },
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      loading: false,
      operateData: []
    }
  },
  methods: {
    open (data, config) {
      this.queryobj = this.$ever.createObjFromSchema(this.schema)
      this.operateData = data
      this.visible = true
    },
    close (type) {
      this.loading = false
      this.operateData = []
      this.visible = false
      this.$emit('close', type)
    },
    async submit () {
      this.loading = true
      let isValid = await this.$refs.form.$refs.form.validate().then(res => res).catch(() => false)
      if (isValid) {
        let params = {
          reason: this.queryobj.reason,
          adviceExecuteIdList: this.operateData
        }
        api.operationExecuteConfirmMaterials(params).then(res => {
          if (res) {
            this.$messageTips(this, 'success', '操作成功')
          }
          this.close(true)
        })
      } else {
        this.loading = false
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="">
  .dialog-body {
    width: 400px;
  }
  .dialog-footer {
    text-align: right;
  }
  .execute-time {
    width: 100%;
  }
</style>
