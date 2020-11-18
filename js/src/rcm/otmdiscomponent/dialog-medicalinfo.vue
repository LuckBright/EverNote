<template>
  <span>
    <medical-content
      v-if="contentShow"
      :insuranceOrgId="insuranceOrgId"
      :macId="macId"
      :password="oldPassword"
      :dzsbkewm="dzsbkewm"
      :cardTypeInfo="cardTypeInfo"
      :scence="scence"
      v-bind="$attrs"
      :dialogmedicalinfovisible.sync="contentShow"
      @getMedDetails="confirmInfoFn"
    ></medical-content>
    <password-valid
      :passwordVisble.sync="passwordValid"
      @modifyPassword="modifyPassword"
      @confirm="passwordConfirm"
    ></password-valid>
    <password-modify
      :oldPassword="oldPassword"
      :passwordModify.sync="passwordModify"
      :cardTypeInfo="cardTypeInfo"
      :macId="macId"
      @modifySuccess="modifySuccess"
    ></password-modify>
    <el-dialog
      :append-to-body="true"
      :visible.sync="dialogVisible"
      title="二维码扫码"
    >
      <div class="erwm-content">
        <label>二维码</label>
        <el-input v-model="erwm" class="erwm"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="submit" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<script>
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import medicalContent from '@/rcm/otmdiscomponent/medicalinfo-content.vue'
import passwordValid from '@/rcm/otmdiscomponent/password-valid.vue'
import passwordModify from '@/rcm/otmdiscomponent/password-modify.vue'
import getMacAddress from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
export default {
  // insuranceOrgId医保机构ID,scence：0挂号，1门诊
  props: ['insuranceOrgId', 'scence', 'cardTypeInfo'],
  mixins: [getMacAddress],
  data () {
    return {
      orgList,
      contentShow: false,
      passwordValid: false,
      passwordModify: false,
      oldPassword: '',
      dialogVisible: false,
      erwm: '',
      dzsbkewm: ''
    }
  },
  watch: {
    'dialogVisible': {
      handler (val) {
        if (!val) {
          this.erwm = ''
        }
      }
    }
  },
  methods: {
    confirmInfoFn (val) {
      this.$emit('getMedDetails', val)
    },
    // 黑龙江医保密码确认
    passwordConfirm (password) {
      this.oldPassword = password
      // 将密码带过来一并读卡
      this.contentShow = true
    },
    // 要修改密码了
    modifyPassword (oldPassword) {
      this.oldPassword = oldPassword
      this.passwordModify = true
    },
    // 密码修改成功
    modifySuccess () {
      this.passwordValid = true
    },
    // 确定当前机构是要直接读卡还是需要校验密码, 如果黑龙江的二维码读卡方式则不用修改密码
    startOperate (isQR) {
      if (this.orgList[this.insuranceOrgId].passwordValid && !isQR) {
        // 需要密码校验
        this.passwordValid = true
      } else {
        // 直接读卡
        this.contentShow = true
      }
    },
    start (isQR) {
      if (isQR) { // 如果是二维码读卡，需要先弹扫码枪的扫出来的二维码弹窗
        this.dialogVisible = true
        this.$nextTick(_ => {
          document.querySelector('.erwm input').focus()
        })
      } else {
        this.startOperate(isQR)
      }
    },
    submit () {
      if (!this.erwm) {
        this.$messageTips(this, 'error', '二维码不能为空')
        return
      }
      this.dzsbkewm = this.erwm
      this.dialogVisible = false
      this.contentShow = true
    }
  },
  components: {
    passwordValid,
    passwordModify,
    medicalContent,
  }
}
</script>
<style lang="less" scoped>
  .erwm /deep/ .el-input {
    width: calc(100% - 50px);
  }
  .erwm-content {
    label {
      display: inline-block;
      width: 50px;
    }
    .el-input {
      width: 90%;
    }
  }
</style>
