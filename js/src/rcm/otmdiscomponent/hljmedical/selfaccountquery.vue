<template>
  <el-dialog
    :visible.sync="v"
    title="医保账户查询"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    width="50%"
  >
    <div v-loading="loading">
      <el-row>
        <el-col :span="12">
          <span class="labelText">身份证号：</span>
          <span class="content">{{personInfo.idCard}}</span>
        </el-col>
        <el-col :span="12">
          <span class="labelText">姓名：</span>
          <span class="content">{{personInfo.name}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="labelText">出生日期：</span>
          <span
            class="content"
          >{{personInfo.birthday&&$moment(personInfo.birthday).format('YYYY-MM-DD')}}</span>
        </el-col>
        <el-col :span="12">
          <span class="labelText">性别：</span>
          <span class="content">{{personInfo.sex | formatSex}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="labelText">待遇类别：</span>
          <span class="content">{{personInfo.treatmentTypeName}}</span>
        </el-col>
        <el-col :span="12">
          <span class="labelText">卡号：</span>
          <span class="content">{{personInfo.icCard}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="labelText">个人编码：</span>
          <span class="content">{{personInfo.personalNo}}</span>
        </el-col>
        <el-col :span="12">
          <span class="labelText">账户余额：</span>
          <span class="content">{{personInfo.currentPersonalAccountBalance | formatToFinacial}}</span>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="footer">
      <el-popover v-if="insuranceOrgId === hljybCode" placement="top-start" trigger="hover">
        <template slot="default">
          <el-button type="primary" size="mini" @click="cardType(0)">读卡</el-button>
          <el-button type="primary" size="mini" @click="cardType(7)">电子凭证</el-button>
        </template>
        <template slot="reference">
          <slot>
            <el-button class="leftbtn" size="small">读卡</el-button>
          </slot>
        </template>
      </el-popover>
      <el-button v-else class="leftbtn" size="small" @click="readCard">读卡</el-button>
      <el-button size="small" type="primary" @click="print">打印</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
    <password-valid
      :passwordVisble.sync="passwordValid"
      @modifyPassword="modifyPassword"
      @confirm="passwordConfirm"
    ></password-valid>
    <password-modify
      :oldPassword="oldPassword"
      :passwordModify.sync="passwordModify"
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
  </el-dialog>
</template>

<script>
import { hljybCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { everprint } from '@/util/print.js'
import { selfAccountQuery } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import passwordValid from '@/rcm/otmdiscomponent/password-valid.vue'
import passwordModify from '@/rcm/otmdiscomponent/password-modify.vue'
import { changeReadType } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
export default {
  props: {
    insuranceOrgId: {
      type: String,
      default: ''
    },
    selfAccountShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      hljybCode,
      orgList,
      passwordValid: false,
      passwordModify: false,
      oldPassword: '',
      personInfo: {
        personalNo: '',
        idCard: '',
        name: '',
        sex: '',
        birthday: '',
        treatmentTypeCode: '',
        treatmentTypeName: '',
        icCard: '',
        currentPersonalAccountBalance: '',
      },
      dialogVisible: false,
      erwm: '',
      type: ''
    }
  },
  computed: {
    v: {
      get () {
        return this.selfAccountShow
      },
      set (val) {
        this.$emit('update:selfAccountShow', val)
      }
    },
  },
  methods: {
    readCard () {
      if (!this.insuranceOrgId) {
        this.$messageTips(this, 'error', '请先选择医保机构再进行医保读卡操作')
        return false
      }
      if (this.type === 7) {
        this.dialogVisible = true
      } else {
        this.passwordValid = true
      }
    },
    cardType (type) {
      this.type = type
      this.readCard()
      changeReadType({type: type}).then(rs => {})
    },
    print () {
      everprint('rcm-selfaccount-query', {
        password: this.oldPassword,
        insuranceOrgId: this.hljybCode,
        macId: this.macId
      }, { preview: true })
    },
    // 取消
    cancel () {
      this.v = false
    },
    // 黑龙江医保密码确认
    passwordConfirm (password) {
      this.oldPassword = password
      this.loading = true
      let params = {
        password: password,
        insuranceOrgId: this.hljybCode,
        macId: this.macId,
        dzsbkewm: this.erwm,
        readType: this.type
      }
      selfAccountQuery(params).then(res => {
        Object.assign(this.personInfo, res.data)
        this.loading = false
        this.dialogVisible = false
      }, err => {
        console.log('err', err)
        this.loading = false
      })
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
    submit () {
      if (!this.erwm) {
        this.$messageTips(this, 'error', '二维码不能为空')
        return
      }
      this.passwordConfirm('')
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
  components: {
    passwordValid,
    passwordModify
  }
}
</script>
<style lang="less" scoped>
.el-row + .el-row {
  margin-top: 15px;
}
.labelText {
  padding-left: 15px;
}
.leftbtn {
  float: left;
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

