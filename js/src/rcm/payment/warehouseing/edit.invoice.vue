/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-19 17:20:36
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-11 20:31:38
 * 采付结算管理-- 入库付款详情-- 上传发票（编辑发票）
 */

<template>
<el-dialog title="上传发票" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
  <div style="min-height:200px;" class="p10 f14">
    <!-- 发票信息 -->
    <ever-form2 v-model="obj" ref="form" label-width="70px" class="mt20" :schema="schema" :nosubmit="true" :rules="rules">
    </ever-form2>
  </div>
  <!-- 弹框底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="submit" type="primary" :loading="loading">
      确定
    </el-button>
  </span>
</el-dialog>
</template>

<script>
import Schema from './invoice.schema'
import {
  updateInvoice
} from '../api/index'

const rules = {
  invoiceNo: [{
    required: true,
    message: '必填项',
    trigger: 'change'
  }],
  invoiceAmount: [{
    required: true,
    message: '必填项',
    trigger: 'change'
  }]
}
export default {
  props: {
    dataValue: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    const schema = Schema.filter(s => s.name !== 'operation')
    return {
      loading: false,
      schema,
      obj: this.$ever.createObjFromSchema(schema),
      rules
    }
  },
  watch: {
    dataValue: {
      handler() {
        this.obj = Object.assign({}, this.obj, this.dataValue)
      },
      immediate: true
    }
  },
  methods: {
    submit() {
      const form = this.$refs.form.$refs.form
      form.validate(valid => {
        if (valid) {
          this.loading = true
          const {
            invoiceNo,
            invoiceAmount,
            url,
            id
          } = this.obj
          updateInvoice({
            invoiceNo,
            invoiceAmount,
            url,
            id
          }).then(result => {
            const {
              head
            } = result
            if (head.errCode === 0) {
              this.$emit('update:visible', false)
              this.$emit('notifyReload') // 通知父组件更新列报表
              this.everSuccess('添加成功')
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('update:visible', v)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ui_dialog_02 .el-dialog .el-dialog__footer {
  text-align: center
}

.operation i:hover {
  font-weight: bold;
}
</style>
