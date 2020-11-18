<template>
  <el-dialog
    title="密码验证"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="formArea">
      <div class="labelText">
        <label>请输入密码</label>
      </div>
      <div class="labelContent">
        <el-input v-model="password" type="password"></el-input>
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button size="small" type="primary" @click="handleConform">确认</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    passwordVisble: [Boolean]
  },
  data () {
    return {
      password: '',
      prePassword: ['1234', '123456']
    }
  },
  watch: {
    'passwordVisble': {
      handler (val) {
        if (!val) {
          this.password = ''
        }
      }
    }
  },
  computed: {
    v: {
      get () {
        return this.passwordVisble
      },
      set (newval) {
        this.$emit('update:passwordVisble', newval)
      }
    }
  },
  methods: {
    handleConform () {
      if (!this.password) {
        this.$messageTips(this, 'error', '请填写密码')
        return false
      }
      if (this.prePassword.includes(this.password)) {
        this.$emit('modifyPassword', this.password)
        this.v = false
      } else {
        this.$emit('confirm', this.password)
        this.v = false
      }
    },
    cancel () {
      this.$emit('passwordCancel')
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
