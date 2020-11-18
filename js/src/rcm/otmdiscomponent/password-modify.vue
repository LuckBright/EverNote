<template>
  <el-dialog
    title="密码修改"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules">
      <template slot="oldPassword">
        <el-input v-model="queryObj.oldPassword" type="password"></el-input>
      </template>
      <template slot="passwordNew">
        <el-input v-model="queryObj.passwordNew" type="password"></el-input>
      </template>
      <template slot="passwordNewAgain">
        <el-input v-model="queryObj.passwordNewAgain" type="password"></el-input>
      </template>
      <div></div>
    </ever-form2>
    <div slot="footer" class="footer">
      <el-button size="small" type="primary" @click="handleConform">确认</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changePassWord } from '@/rcm/store/otmdiscomponent/hlj-api.js'
let schema = [{
  label: '请输入原密码',
  name: 'oldPassword',
  comp: 'custom'
},
{
  label: '请输入新密码',
  name: 'passwordNew',
  comp: 'custom'
},
{
  label: '请确认新密码',
  name: 'passwordNewAgain',
  comp: 'custom'
}]
export default {
  props: {
    passwordModify: [Boolean],
    oldPassword: {
      type: [Number, String],
      default () {
        return null
      }
    },
    macId: {
      type: [String],
      default () {
        return ''
      }
    },
    cardTypeInfo: {
      type: Object,
      default () {
        return {type: 0}
      }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.oldPassword = this.oldPassword
    return {
      prePassword: ['1234', '123456'],
      schema,
      queryObj,
      rules: {
        oldPassword: [{
          required: true,
          message: '请填写原密码',
          trigger: 'change'
        }],
        passwordNew: [{
          required: true,
          message: '请填写新密码',
          trigger: 'change'
        },
        {
          validator: (rule, value, callback) => {
            if ((value + '').length !== 6) {
              callback(new Error('新密码输入格式不正确，请重新输入！'))
            } else if (this.prePassword.includes(value)) {
              callback(new Error('原始密码不允许使用！'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }],
        passwordNewAgain: [{
          required: true,
          message: '请填写确认密码',
          trigger: 'change'
        },
        {
          validator: (rule, value, callback) => {
            if (value !== this.queryObj.passwordNew) {
              callback(new Error('新密码与确认密码不一致，请重新输入！'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    v: {
      get () {
        return this.passwordModify
      },
      set (newval) {
        this.$emit('update:passwordModify', newval)
      }
    }
  },
  watch: {
    'passwordModify': {
      handler (val) {
        if (!val) {
          this.queryObj.oldPassword = ''
          this.queryObj.passwordNew = ''
          this.queryObj.passwordNewAgain = ''
        }
      }
    }
  },
  methods: {
    handleConform () {
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            oldPassword: this.queryObj.oldPassword,
            newPassword: this.queryObj.passwordNew,
            macId: this.macId,
            readtype: this.cardTypeInfo.type
          }
          changePassWord(params).then(res => {
            this.$messageTips(this, 'success', '密码修改成功！')
            this.$emit('modifySuccess')
            this.$nextTick(_ => {
              this.v = false
            })
          }, error => {
            console.log('error', error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel () {
      this.v = false
    }
  },
}
</script>
