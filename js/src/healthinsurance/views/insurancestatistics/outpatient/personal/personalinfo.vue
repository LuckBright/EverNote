<template>
  <div class="layout_inner">
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
    <div class="middleLayer mt20 tright">
      <el-button class="btnRight" type="primary" size="small" @click="exportFile">数据导出</el-button>
    </div>
    <div slot="footer" class="footer pt20 mt20 bt">
      <el-button class="leftbtn" size="small" @click="readCard">读卡</el-button>
      <div style="float:right;">
        <el-button size="small" type="primary" @click="print">打印</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
    <password-valid
      v-if="passwordValid"
      :passwordVisble.sync="passwordValid"
      @modifyPassword="modifyPassword"
      @confirm="passwordConfirm"
    ></password-valid>
    <password-modify
      v-if="passwordModify"
      :oldPassword="oldPassword"
      :passwordModify.sync="passwordModify"
      :macId="macId"
      @modifySuccess="modifySuccess"
    ></password-modify>
  </div>
</template>

<script>
import { hljybCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { everprint } from '@/util/print.js'
import { selfAccountQuery } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import passwordValid from '@/rcm/otmdiscomponent/password-valid.vue'
import passwordModify from '@/rcm/otmdiscomponent/password-modify.vue'
export default {
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
    }
  },
  methods: {
    exportFile () {

    },
    readCard () {
      this.passwordValid = true
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
        macId: this.macId
      }
      selfAccountQuery(params).then(res => {
        Object.assign(this.personInfo, res.data)
        this.loading = false
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
  },
  components: {
    passwordValid,
    passwordModify
  }
}
</script>
<style scoped>
.el-row + .el-row {
  margin-top: 15px;
}
.labelText {
  padding-left: 15px;
}
.leftbtn {
  float: left;
}
.bt {
  border-top: 1px solid #cccccc;
}
.tright {
  text-align: right;
}
</style>

