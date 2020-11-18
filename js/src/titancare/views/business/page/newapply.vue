<template>
  <el-dialog
    title="添加账号"
    center
    :visible.sync="v"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :rules="rules" labelWidth="100px">
      <div slot="default"></div>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button @click="v = false">取 消</el-button>
      <el-button type="primary" :disabled="btnDis" @click="sureAddNew">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { requestIh } from '@/util/req'
import urlMap from '@/titancare/utils/urls.js'
import { validatePhone } from '@/util/validate'

const schema = [
  {
    label: '姓名',
    name: 'username',
    props: {
      placeholder: '请输入姓名'
    }
  },
  {
    name: 'gender',
    label: '性别',
    comp: 'sys-type',
    props: {
      placeholder: '请选择性别',
      clearable: true,
      code: 'GBT.2261.1',
      useValue: true
    }
  },
  {
    label: '手机号',
    name: 'telephone',
    props: {
      placeholder: '请输入手机号',
      clearable: true,
      maxlength: 11,
    }
  },
  {
    name: 'manageOrg',
    label: '管理机构',
    comp: 'ever-org-select',
    props: {
      type: 'select',
      fields: ['id', 'name']
    }
  }
]

const rules = {
  username: [
    { required: true, message: '请填写姓名', trigger: 'change' }
  ],
  telephone: [
    { required: true, validator: validatePhone, trigger: ['change'] }
  ],
  manageOrg: [
    {
      required: true,
      validator: function (rule, value, callback) {
        if (!value.id || !value.name) {
          callback(new Error('请选择管理机构'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

export default {
  props: ['visible'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      rules,
      btnDis: false,
      orgList: []
    }
  },
  methods: {
    handleClose (done) {
      this.v = false
    },
    sureAddNew () {
      this.btnDis = true
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          let params = this.queryObj
          params.managementOrgId = params.manageOrg.id
          params.managementOrgName = params.manageOrg.name
          requestIh(urlMap.daily.createDailyPushAccount, params).then(res => {
            this.btnDis = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.$emit('addnew')
            this.v = false
          }, err => {
            this.btnDis = false
            console.log('err', err)
          })
        } else {
          this.btnDis = false
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.form.resetForm()
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        if (!val) {
          this.resetForm()
        }
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>
