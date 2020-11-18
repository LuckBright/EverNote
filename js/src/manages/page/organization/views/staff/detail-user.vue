<template>
  <div>
    <div v-if="(type === 'edit' && opened) || opening">
      <div class="account-title" v-if="!isDialog">账户信息</div>
      <ever-form2
        v-model="accountForm"
        ref="accountForm"
        :schema="accountSchema"
        :rules="accountRules"
        label-width="150px"
      >
        <template>
          <el-col>
            <el-form-item>
              <el-button v-if="!disabled" type="primary" @click="save()">保存账户信息</el-button>
              <el-button v-if="opening && !disabled" @click="cancel">取消</el-button>
              <el-button v-if="opened && !disabled" @click="resetPwd">重置密码</el-button>
            </el-form-item>
          </el-col>
        </template>
      </ever-form2>
    </div>
    <div class="account-open" v-else-if="type === 'edit' && !opened && !disabled">
      <el-button type="text" @click="openAccount">开通账号</el-button>
    </div>
    <el-dialog title="重置密码" :visible.sync="dialog" append-to-body>
      <ever-form2
        v-model="pwdForm"
        ref="pwdForm"
        :schema="pwdSchema"
        :rules="pwdRules"
      >
        <template slot="default">
          <div></div>
        </template>
      </ever-form2>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submitPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {accountSchema, accountRules} from '@/manages/page/organization/views/staff/model'
  import {getObjByExcludes} from '@/manages/page/organization/utils/fns'
  import { validatePassword } from '@/util/validate'

  const defaultPassword = 'Aa111111!'
  const pwdSchema = [
    {
      name: 'pwd',
      label: '重置密码'
    }
  ]
  const pwdRules = {
    pwd: [
      { required: true, message: '必填项', trigger: 'change' },
      { validator: validatePassword, trigger: 'change' },
    ]
  }
  export default {
    props: {
      type: String,
      id: String,
      staffInfo: Object,
      isDialog: Boolean,
      disabled: Boolean,
    },
    data () {
      const accountForm = this.$ever.createObjFromSchema(accountSchema)
      const pwdForm = this.$ever.createObjFromSchema(pwdSchema)
      pwdForm.pwd = defaultPassword
      // accountForm.telephoneNumber = ''
      return {
        opening: false,
        opened: false,
        accountSchema,
        accountForm,
        accountRules,
        pwdSchema,
        pwdForm,
        pwdRules,
        dialog: false,
      }
    },
    created () {
      if (this.type === 'edit') {
        // 查询账号详情
        this.search()
      }
      if (this.isDialog) {
        this.openAccount()
      }
    },
    watch: {
      disabled: {
        handler () {
          if (this.disabled) {
            this.accountSchema = this.accountSchema.map(item => {
              return {
                ...item,
                props: {
                  ...item.props,
                  disabled: true,
                }
              }
            })
          }
        },
        immediate: true,
      }
    },
    methods: {
      search () {
        request(urlMap.unify.getUserDetails, {
          userId: this.id,
        }).then(res => {
          if (res.head.errCode === 0) {
            this.opened = !!res.data
            if (this.opened) {
              this.accountSchema.find(item => item.name === 'password').parentClass = 'dn'
              this.accountRules.password[0].required = false
              this.accountForm.loginName = res.data.userInfo.loginName
              this.accountForm.nickname = res.data.userInfo.nickname
              this.accountForm.displayName = res.data.userInfo.displayName
              // if (this.staffInfo) {
              //   this.accountForm.telephoneNumber = this.staffInfo.mobile
              // }
              // this.accountForm.password = res.data.password
            } else {
              this.accountSchema.find(item => item.name === 'password').parentClass = 'w'
              this.accountRules.password[0].required = true
              if (this.staffInfo) {
                this.accountForm.loginName = this.staffInfo.mobile
                // this.accountForm.telephoneNumber = this.staffInfo.mobile
                this.accountForm.nickname = this.staffInfo.jobNumber
                this.accountForm.displayName = this.staffInfo.name
                this.accountForm.password = defaultPassword
              }
            }
          }
        })
      },
      openAccount () {
        this.opening = true
      },
      resetRules (reset) {
        if (this.opened && !reset) {
          // 修改
          this.accountRules = {
            loginName: [{ required: true, message: '必填项', trigger: 'change' }],
            nickname: [{ required: true, message: '必填项', trigger: 'change' }],
          }
        } else if (this.opening && !reset) {
          // 新增
          this.accountRules = {
            loginName: [{ required: true, message: '必填项', trigger: 'change' }],
            nickname: [{ required: true, message: '必填项', trigger: 'change' }],
            password: [
              { required: true, message: '必填项', trigger: 'change' },
              { validator: validatePassword, trigger: 'change' },
            ],
          }
        } else if (reset) {
          // 重置
          this.accountRules = {}
        }
      },
      save (reset = false) {
        // 新增时，表单 loginName nickname password 必填
        // 修改时，表单 loginName nickname 必填
        // 重置时，表单 都非 必填
        this.resetRules(reset)
        this.$nextTick(() => {
          this.$refs.accountForm.$refs.form.validate(valid => {
            if (valid) {
              let params = {
                organizationId: null,
                userId: this.id,
                isUpdateRoleInfo: 2,
                ...getObjByExcludes(this.accountForm, 'password'),
                ...(this.opened ? {} : {password: this.accountForm.password})
              }
              if (reset) {
                params = {
                  organizationId: null,
                  userId: this.id,
                  isUpdateRoleInfo: 2,
                  password: this.pwdForm.pwd,
                }
              }
              if (this.staffInfo) {
                params.telephoneNumber = this.staffInfo.mobile
              }
              request(urlMap.unify.createOrUpdateUserInfo, params).then(res => {
                if (res.head.errCode === 0) {
                  this.$messageTips(this, 'success', reset ? '密码重置成功' : '保存成功')
                  this.opened = true
                  if (this.isDialog) {
                    this.$emit('save')
                  } else {
                    this.opening = false
                  }
                  (this.accountSchema.find(item => item.name === 'password') || {}).parentClass = 'dn'
                  // this.accountRules.password[0].required = false
                }
                this.dialog = false
              })
            }
          })
        })
      },
      cancel () {
        if (this.isDialog) {
          this.$emit('close')
        } else {
          this.opening = false
        }
      },
      submitPwd () {
        this.$refs.pwdForm.$refs.form.validate(valid => {
          if (valid) {
            this.save(true)
          }
        })
      },
      resetPwd () {
        this.pwdForm.pwd = defaultPassword
        this.dialog = true
        // this.$confirm('是否将用户的密码重置为' + defaultPassword + '？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.save(true)
        // })
      },
    },
  }
</script>
