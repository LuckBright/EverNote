<template>
  <el-dialog
    v-if="visible"
    :visible.sync="visible"
    :title="title"
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
    return {
      visible: false,
      schema: [],
      queryobj: {},
      rules: {},
      loading: false,
      operateData: []
    }
  },
  methods: {
    open (data, config) {
      this.operateData = data
      if (config) {
        this.schema = config.schema
        this.queryobj = config.obj
        this.rules = config.rules
        this.getParams = config.getParams
      }
      this.visible = true
    },
    close (type) {
      this.operateData = []
      this.visible = false
      this.loading = false
      this.$emit('close', type)
    },
    async submit () {
      this.loading = true
      let isValid = await this.$refs.form.$refs.form.validate().then(res => res).catch(() => false)
      if (isValid) {
        let params = this.getParams && this.getParams(this.queryobj, this.operateData) || []
        api.updateOperationExecute(params).then(res => {
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
