<!--
  //使用场景：拒绝入库需要增加拒绝入库原因
  <refuse-back-dialog :visible.sync="isShowDialog" @dialogConfirm="dialogConfirm"></refuse-back-dialog>
  :visible.sync="isShowDialog" // 弹窗是否展示 true/false
  @dialogConfirm="dialogConfirm" // 点击事件传值
-->
<template>
  <el-dialog
    :title="status == 7 ?'拒绝入库':'同意入库'"
    :visible.sync="visible"
    width="30%"
    center
    :modal-append-to-body="false"
    :before-close="handleClose">
    <div class="alg_c" v-if="status == 7">
      <p class="alg_l">请录入拒绝的原因</p>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </div>
    <div class="alg_c" v-if="status == 10">
      <p>确认同意退药入库</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancleClick">取 消</el-button>
      <el-button type="primary" :disabled="(status == 7 && !textarea.length) ? true : false" @click="confirmClose(status)">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkedItems: {
      type: Array,
      default: []
    },
    status: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      textarea: ''
    }
  },
  methods: {
    handleClose (done) {
      this.textarea = ''
      this.$emit('update:visible', false)
    },
    cancleClick () {
      this.$emit('update:visible', false)
      this.textarea = ''
    },
    confirmClose (status) {
      if (status === 7) {
        if (this.textarea) {
          this.checkedItems.map((item) => {
            item.status = status
            item.rejectionReason = this.textarea
          })
          this.dialogConfirm()
          this.$emit('update:visible', false)
          this.textarea = ''
        } else {
          this.$confirm(`请输入拒绝原因`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          }).catch(() => { })
        }
      } else if (status === 10) {
        this.checkedItems.map((item) => {
          item.status = status
        })
        this.dialogConfirm()
        this.$emit('update:visible', false)
      }
    },
    dialogConfirm () {
      this.$emit('dialogConfirm', this.checkedItems)
    }
  }
}
</script>

