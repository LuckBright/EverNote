<template>
  <el-dialog :visible.sync="visible">
    <div class="message">
      <div class="leftText">原票号:</div>
      {{message}}
      <div class="clearfix"></div>
    </div>
    <div class="message">
      <div class="leftText">新票号:</div>
      <div class="rightContent">
        <el-input v-model="newbillNumber"></el-input>
      </div>
      <div class="clearfix"></div>
    </div>
    <div slot="footer">
      <el-button type="primary" size="small" @click="handleSure">确定</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    message: {
      type: [String],
      default: ''
    },
  },
  data () {
    return {
      newbillNumber: '',
      visible: false
    }
  },
  methods: {
    showConfirmBox () {
      this.$confirm(this.message || '', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('sure')
      }).catch(() => {
        this.$emit('cancel')
      })
    },
    showPrompt () {
      this.visible = true
    },
    handleSure () {
      if (this.newbillNumber === '') {
        this.$messageTips(this, 'error', '请输入新票据号')
        return false
      } else {
        this.$emit('sure', this.newbillNumber)
      }
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.message {
  line-height: 36px;
}
.message .leftText {
  float: left;
  width: 70px;
}
.message .rightContent {
  margin-left: 70px;
}
.message .rightContent input {
  line-height: 36px;
  width: 100%;
  padding: 10px;
}
.message .clearfix {
  clear: both;
}
</style>
