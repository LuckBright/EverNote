<template>
  <el-dialog
    :visible.sync="v"
    title="审批原因"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules">
      <div></div>
    </ever-form2>
    <div slot="footer" class="footer">
      <el-button size="small" type="primary" @click="handleSuccess" :disabled="loading">确认</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { prewarnApproval } from '@/rcm/store/otmdiscomponent/hlj-api.js'
const schema = [{
  label: '审批原因',
  name: 'approvalReason',
  props: {
    type: 'textarea',
  },
  span: 24
}]
const rules = {
  approvalReason: [{
    required: true,
    message: '请填写审批原因',
    trigger: 'change'
  }]
}
export default {
  props: {
    reasonShow: {
      type: [Boolean]
    },
    currentRow: {
      type: [Object],
      default: _ => { }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      rules,
      loading: false
    }
  },
  computed: {
    v: {
      get () {
        return this.reasonShow
      },
      set (val) {
        this.$emit('update:reasonShow', val)
      }
    },
  },
  methods: {
    handleSuccess () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 调接口保存
          let params = {
            approvalReason: this.queryObj.approvalReason,
            settlementId: this.currentRow.settlementId,
            macId: this.macId
          }
          prewarnApproval(params).then(res => {
            this.$messageTips(this, 'success', '操作成功')
            this.$emit('approval-success')
            this.v = false
          }, err => {
            console.log('err', err)
          })
        }
      })
    },
    // 取消
    cancel () {
      this.v = false
    }
  },
}
</script>
<style scoped>
.formArea {
  display: flex;
}
.labelText {
  width: 100px;
  text-align: right;
  line-height: 32px;
}
.labelContent {
  flex: 1;
  margin-left: 15px;
}
</style>

