<template>
  <div class="layout_inner">
    <div class="mb20" style="text-align:right;">
      <el-button type="primary" @click="visible = true">添加用户</el-button>
    </div>
    <el-table
      border
      v-loading.body="loading"
      :data="tableData">
      <el-table-column
        prop="userName"
        label="用户账号">
      </el-table-column>
      <el-table-column
        prop="displayName"
        label="用户名">
      </el-table-column>
      <!-- <el-table-column
        prop="userAuthCode"
        label="授权密码">
      </el-table-column> -->
      <el-table-column
        prop="executionDatetime"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="update(scope.row, scope.$index)">修改密码</el-button>
          <el-button type="text" @click="del(scope.row, scope.$index)" style="color:#e43;">移除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog 
    :title="title" 
    v-if="visible"
    :visible.sync="visible"
    :close-on-click-modal="false"
    >
     <ever-form2
        :schema="schema"
        v-model="obj"
        :rules="rules"
        :nosubmit="true"
        ref="form"
        :span="24"
        :info="true"
        labelWidth="80px"
        label-position="right"
      >
      <template slot="name">
        <el-input v-model="obj.name" :disabled="disabled" placeholder="请输入人员的登录账号"></el-input>
      </template>
     </ever-form2>
      <div slot="footer">
        <el-button type="primary" size="small" @click="handleSure">确定</el-button>
        <el-button size="small" @click="visible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/rcm/store/outpatient/auth.manage.api.js'
let schema = [
  {
    name: 'info',
    label: '用户账号',
    comp: 'ever-staff-select',
    props: {
      disabled: false,
      clearable: true,
      fields: ['id', 'name', 'mobile'],
      params: {
        everQueryType: 'out'
      }
    }
  },
  {
    label: '授权密码',
    name: 'userAuthCode',
    props: {
      autocomplete: 'new-password',
      type: 'password',
      placeholder: '请输入6位数字或字母',
      maxlength: 6
    }
  }
]
let validatePass = (rule, value, callback) => {
  let reg = /^[a-zA-Z0-9]{6}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入6位数字或字母'))
  }
}
let rules = {
  info: [{required: true, message: '请选择用户账号', trigger: 'change'}],
  userAuthCode: [{validator: validatePass, trigger: 'blur'}]
}
export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      schema,
      rules,
      loading: false,
      visible: false,
      disabled: false,
      title: '添加用户',
      tableData: []
    }
  },
  created () {
    this.list()
  },
  methods: {
    update (row) {
      this.$ever.getFieldFromSchema(this.schema, 'info').props.disabled = true
      this.title = '修改授权密码'
      this.obj.info = {
        id: row.userId,
        mobile: row.userName,
        name: row.displayName
      }
      this.obj.userAuthCode = row.userAuthCode
      this.disabled = true
      this.visible = true
    },
    handleSure () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            userId: this.obj.info.id,
            userName: this.obj.info.mobile,
            displayName: this.obj.info.name,
            userAuthCode: this.obj.userAuthCode
          }
          api.userAdd(params).then(rs => {
            if (!rs.head.errCode) {
              this.$messageTips(this, 'success', this.title + '成功')
              this.visible = false
              this.list()
            }
          })
        }
      })
    },
    del (row) {
      let title = `确定要移除 ${row.displayName} 吗？`
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          userId: row.userId
        }
        api.userDel(params).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '移除成功')
            this.list()
          }
        })
      })
    },
    list () {
      api.userList().then(rs => {
        this.tableData = rs.data
      })
    }
  },
  watch: {
    'visible': {
      handler (val) {
        if (!val) {
          this.$ever.getFieldFromSchema(this.schema, 'info').props.disabled = false
          this.obj.info = ''
          this.obj.userAuthCode = ''
          this.title = '添加用户'
          this.disabled = false
        }
      }
    }
  }
}
</script>

