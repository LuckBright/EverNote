<template>
  <div>
    <el-dialog
      title="新增供应商"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :modal="false"
      :append-to-body="true"
      width="70%">
      <!-- 供应商 -->
      <supplier
        ref="supplier"
        :isNew="false"
        @submitSave="submitSave"
        :isContrct="true">
      </supplier>
      <!-- 底部按钮 -->
      <div class="alg_c">
        <el-button type="primary" @click="submit" style="width: 100px;">保存</el-button>
        <el-button @click="handlerCancel" style="width: 60px;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplier from '@/warehouse/page/supplier.vue'

export default {
  data () {
    return {
      dialogVisible: false,
      data: {}
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    submitSave (res) {
      this.data = res
    },
    submit () {
      this.$refs.supplier.submitForm()
      setTimeout(_ => {
        this.$nextTick(_ => {
          if (this.$refs.supplier.showContrct) {
            this.dialogVisible = false
            this.$emit('change', this.data)
          }
        })
      }, 1000)
    },
    handlerCancel () {
      this.dialogVisible = false
      this.$refs.supplier.init()
    }
  },
  components: {
    supplier
  }
}
</script>
