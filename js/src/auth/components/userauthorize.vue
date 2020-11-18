<template>
  <div>
    <!-- 页面直接嵌套模式 账户 -->
    <div class="cnt" v-if="showPattern">
      <p v-if="!showAccountForm" class="alg_c no_account">
        暂无账户信息，
        <el-button type="text" size="large" @click="handleOpenAccount()">开通账户</el-button>
      </p>
      <div v-else>
        <div class="mt10">
          <ever-form2
            :schema="schema"
            v-model="obj"
            ref="userInfo"
            :span="12"
            :rules="rules"
            :onSubmit="true"
          >
            <div slot="default"></div>
          </ever-form2>
          <el-button
            style="margin-left: 120px !important;"
            v-if="showModifyPass"
            type="text"
            @click="handleEditPassword"
          >修改账号信息</el-button>
        </div>
      </div>
      <div class="dialog-footer mt15" style="margin-left: 120px !important;" v-if="!showModifyPass">
        <el-button @click="handlePatternCancel">取消</el-button>
        <el-button type="primary" @click="updateUserInfo()">确定</el-button>
      </div>
    </div>
    <!-- 页面直接嵌套模式 授权 -->
    <div class="cnt" v-if="showWant">
      <p class="tit">已授权角色</p>
      <div class="roleList">
        <p class="empty" v-if="authorizedRole.length === 0">尚未授权</p>
        <el-tag
          v-else
          :key="index"
          v-for="(tag, index) in authorizedRole"
          closable
          :disable-transitions="true"
          @close="removeRoleForUser(tag)"
        >{{tag.name}}</el-tag>
      </div>
      <p class="tit">
        未授权角色
        <el-autocomplete
          class="inline-input"
          v-model="searchTag"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          placeholder="请输入内容"
          :popper-append-to-body="false"
          :clearable="true"
          @select="handleSelect"
        ></el-autocomplete>
      </p>
      <div class="roleList">
        <p class="empty" v-if="oldUnauthorizedRole.length === 0">所有角色已经授权</p>
        <el-tag
          v-else
          :key="index"
          :disable-transitions="true"
          v-for="(tag, index) in unauthorizedRole"
          @click="addRoleForUser(tag)"
        >{{tag.name}}</el-tag>
      </div>
    </div>
    <!-- 弹窗模式 -->
    <el-dialog
      v-else
      title="授权管理"
      class="ui_dialog_02"
      :append-to-body="true"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="cnt" v-if="!hideUserInfo">
        <p v-if="!showAccountForm" class="alg_c no_account">
          暂无账户信息，
          <el-button type="text" size="large" @click="handleOpenAccount()">开通账户</el-button>
        </p>
        <div v-else>
          <div class="mt10">
            <ever-form2
              :schema="schema"
              v-model="obj"
              ref="userInfo"
              :span="12"
              :rules="rules"
              :onSubmit="true"
            >
              <div slot="default"></div>
            </ever-form2>
            <el-button
              style="margin-left: 120px !important;"
              v-if="showModifyPass"
              type="text"
              @click="handleEditPassword"
            >修改账号信息</el-button>
          </div>
        </div>
      </div>
      <div class="cnt" v-loading="loading">
        <p class="tit">已授权角色</p>
        <div class="roleList">
          <p class="empty" v-if="authorizedRole.length === 0">尚未授权</p>
          <el-tag
            class="pointer"
            v-else
            :key="index"
            v-for="(tag, index) in authorizedRole"
            closable
            :disable-transitions="true"
            @close="removeRoleForUser(tag)"
          >{{tag.name}}</el-tag>
        </div>
        <p class="tit">
          未授权角色
          <el-autocomplete
            class="inline-input"
            v-model="searchTag"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            placeholder="请输入内容"
            :popper-append-to-body="false"
            :clearable="true"
            size="small"
            @select="handleSelect"
          ></el-autocomplete>
        </p>
        <div class="roleList">
          <p class="empty" v-if="oldUnauthorizedRole.length === 0">所有角色已经授权</p>
          <el-tag
            v-else
            :key="index"
            :disable-transitions="true"
            class="pointer"
            v-for="(tag, index) in unauthorizedRole"
            @click="addRoleForUser(tag)"
          >{{tag.name}}</el-tag>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="updateUserInfo()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import roleApi from '@/auth/store/roleapi'
import sessionApi from '@/auth/store/sessionapi'
import * as validateObj from '@/util/validate'
import { delObjIsNull } from '@/util/common'

let schema = [
  {
    name: 'loginName',
    label: '登录账号',
    props: {
      placeholder: '请输入登录账号'
    }
  },
  {
    name: 'nickname',
    label: '昵称',
    props: {
      placeholder: '请输入昵称'
    }
  },
  {
    name: 'displayName',
    label: '用户名',
    props: {
      placeholder: '请输入用户名'
    }
  },
  {
    name: 'telephoneNumber',
    label: '手机号',
    props: {
      placeholder: '请输入手机号'
    }
  },
]

let passSchema = [
  {
    name: 'password',
    label: '密码',
    props: {
      type: 'password',
      placeholder: '请输入密码'
    }
  },
  {
    name: 'password2',
    label: '再次输入密码',
    props: {
      type: 'password',
      placeholder: '请再次输入密码'
    }
  }
]

export default {
  props: {
    'userObj': {
      type: Object,
      default: function () {
        return {
          userId: '',
          organizationId: '',
          telephoneNumber: '',
          displayName: '',
          loginName: ''
        }
      }
    },
    'visible': {
      type: Boolean,
      default: false
    },
    'showPattern': {      //  账户信息展示模式  默认使用弹窗展示   true 页面直接嵌套账户信息
      type: Boolean,
      default: false
    },
    'showWant': {        //  授权信息展示模式  默认使用弹窗展示  true 页面直接嵌套授权信息
      type: Boolean,
      default: false
    },
    'value': {
      type: [Array, String],
      default: () => []
    },
    'getUserInfo': Function,
    hideUserInfo: {
      type: Boolean,
      default: false,
    }, // 是否隐藏
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.password = ''
    obj.password2 = ''
    var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,}$/
    let validatePass = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error('大于等于8位，大写字母、小写字母、数字、符号任三种组合!'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value && obj.password && value !== obj.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      schema,
      obj,
      showAccountForm: false,
      showModifyPass: true,
      searchTag: '',
      authorizedRole: this.value,
      unauthorizedRole: [],
      oldUnauthorizedRole: [],
      fullRoleList: [],
      roleIds: [],
      rules: {},
      allRules: {
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        nickname: [
          { required: false, message: '请输入昵称', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        telephoneNumber: [
          { required: true, validator: validateObj.validatePhone, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '8-20位，大写字母、小写字母、数字、符号任三种组合', min: 8, max: 20, trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { required: false, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      loading: true
    }
  },
  created () {
    // 根据是否显示账号信息，改变校验规则
    if (this.hideUserInfo) {
      this.rules = {}
    } else {
      this.rules = this.allRules
    }
    if (this.visible || this.showPattern || this.showWant) {
      this.getUserDetails()
    }
  },
  methods: {
    handleSelect (item) {
      console.log(item, '----')
    },
    querySearch (queryString, cb) {
      var restaurants = this.oldUnauthorizedRole
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      let nameArr = []
      results.forEach(item => {
        nameArr.push(item)
      })
      this.unauthorizedRole = nameArr
      // cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return ~(restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()))
      }
    },
    handleClose () {
      this.$emit('update:visible', false)
    },
    //  pattern 模式下 点击取消 切换到  开通或者账户展示页面
    handlePatternCancel () {
      if (this.obj.loginName && this.obj.telephoneNumber) {
        if (this.schema.length >= 6) this.schema.splice(-2, 3)
        this.schema = [...this.schema]
        this.getUserDetails()
      } else {
        this.showAccountForm = false
        this.showModifyPass = true
      }
    },
    // 查询用户状态 没开通账号或者开通账号，权限信息
    async getUserDetails () {
      // 检查传参是否正确
      if (!this.showWant ? !this.userObj.userId || (!this.userObj.organizationId && !this.showPattern) : !this.showWant) {
        this.$messageTips(this, 'error', `<div style="text-align:left">授权组件调用失败<br>参数为：{<br> userId：XXX // 必传<br> organizationId:XXX // 必传<br>}</div>`, '错误提示', 6000, true)
        this.$emit('update:visible', false)
        return
      }
      let res = await sessionApi.getUserDetails(this.userObj)
      this.getUserInfo && this.getUserInfo(res)
      let _roleIds = []
      // res.data = null
      if (res.head.errCode === 0) {
        if (res.data && res.data.userInfo) {
          Object.assign(this.obj, res.data.userInfo)
          this.showAccountForm = true
          this.showModifyPass = true
          _roleIds = res.data.roleIds
          this.schema[0].props.disabled = true
          this.schema[1].props.disabled = true
          this.schema[2].props.disabled = true
          this.schema[3].props.disabled = true
        } else {
          this.schema[0].props.disabled = false
          this.schema[1].props.disabled = false
          this.schema[2].props.disabled = false
          this.schema[3].props.disabled = false
        }
        // res.data.roleIds = ['zneQ2OXyoEKK7Za9BYK', '1', '2']
      }
      this.handleRoleList(_roleIds)
    },
    // 获取该机构下的角色列表 传参为 已经赋值的列表，如果不传或者传空表示尚未赋值
    handleRoleList (roleIds) {
      debugger
      let params = {
        offset: 0,
        pagesize: 1000
      }
      roleApi.list(params).then(res => {
        if (res.head.errCode === 0 && res.data && res.data.length > 0) {
          this.authorizedRole = []
          this.unauthorizedRole = []
          this.oldUnauthorizedRole = []
          this.fullRoleList = res.data
          res.data.forEach(role => {
            if (roleIds.includes(role.roleId)) {
              this.authorizedRole.push(role)
            } else {
              this.unauthorizedRole.push(role)
              this.oldUnauthorizedRole.push(role)
            }
          })
          this.oldUnauthorizedRole.forEach(item => {
            item.value = item.name
          })
          this.loading = false
        }
      })
    },
    // 点击权限列表把点击项添加到已授权区域
    addRoleForUser (tag) {
      this.authorizedRole.push(tag)
      let thisindex = this.unauthorizedRole.findIndex(item => {
        return item.roleId === tag.roleId
      })
      this.unauthorizedRole.splice(thisindex, 1)
      let oldIndex = this.oldUnauthorizedRole.findIndex(item => {
        return item.roleId === tag.roleId
      })
      this.oldUnauthorizedRole.splice(oldIndex, 1)
    },
    // 点击已授权列表取消授权
    removeRoleForUser (tag) {
      this.unauthorizedRole.push(tag)
      this.oldUnauthorizedRole.push(tag)
      let index = this.authorizedRole.findIndex(item => {
        return item.roleId === tag.roleId
      })
      this.authorizedRole.splice(index, 1)
    },
    // 显示开通账户弹窗
    handleOpenAccount () {
      this.showAccountForm = true
      this.showModifyPass = false
      if (this.schema.length >= 6) this.schema.splice(-2, 3)
      this.schema = [...this.schema, passSchema[0], passSchema[1]]
      this.rules.password[0].required = true
      this.rules.password2[0].required = true
      this.obj.telephoneNumber = this.userObj.telephoneNumber || ''
      this.obj.loginName = this.userObj.telephoneNumber || ''
    },
    handleEditPassword () {
      this.showModifyPass = false
      if (this.schema.length >= 6) this.schema.splice(-2, 3)
      this.schema = [...this.schema, passSchema[0], passSchema[1]]
      this.schema[0].props.disabled = false
      this.schema[1].props.disabled = false
      this.schema[2].props.disabled = false
      this.schema[3].props.disabled = false
    },
    // 修改账号密码，选择权限之后完成授权 提交/更新数据
    updateUserInfo () {
      const doSave = () => {
        let _resRoleIds = []
        this.authorizedRole.forEach(role => {
          _resRoleIds.push(role.roleId)
        })
        // 更新用户信息
        let params = delObjIsNull(Object.assign({}, this.obj, this.userObj, {
          roleIds: _resRoleIds
        }))
        sessionApi.createOrUpdate(params).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '提交成功')
            window.setTimeout(_ => {
              this.$emit('update:visible', false)
            }, 500)
            this.$emit('success', this.authorizedRole)
            if (this.showPattern) this.handlePatternCancel()
          }
        })
      }
      if (this.hideUserInfo) {
        doSave()
      } else {
        this.$refs.userInfo && this.$refs.userInfo.$refs.form.validate(valid => {
          if (valid) {
            doSave()
          }
        })
      }
    }
  },
  watch: {
    authorizedRole: {
      handler (newVal) {
        this.$emit('input', newVal)
      },
      deep: true,
      immediate: true
    },
    'searchTag' (v) {
      if (!v) {
        let oldNameArr = []
        this.oldUnauthorizedRole.forEach(item => {
          oldNameArr.push(item)
        })
        this.unauthorizedRole = oldNameArr
      }
    },
    'visible': {
      handler (val) {
        if (val) {
          this.showAccountForm = false
          this.showModifyPass = true
          this.searchTag = ''
          this.authorizedRole = []
          this.unauthorizedRole = []
          this.oldUnauthorizedRole = []
          this.fullRoleList = []
          this.roleIds = []
          this.getUserDetails()
        }
      }
    }
  }
}
</script>
<style scoped>
.cnt {
  border: 1px solid #bbb;
  margin: 20px;
  padding: 20px;
  min-height: 100px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.roleList {
  max-height: 200px;
  overflow: auto;
}
.tit {
  font-weight: bold;
  text-align: left;
  margin: 0 0 10px 0;
}
.empty {
  text-align: center;
  height: 32px;
  margin: 0;
}
.el-autocomplete /deep/ .is-loading {
  display: none !important;
}
</style>
