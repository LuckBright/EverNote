<template>
<el-form :model="form" ref="tplName" label-width="0px" :rules="rules" class="check_form_name custom-form">
    <el-form-item label="" prop="name">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
</el-form>
</template>
<script>
import templateManageUrl from '@/emr/urls'
import urlsfortech from '@/infusion/urlsfortech.js'
import { request } from '@/util/req'
import storage from '@/util/storage'
export default {
  name: 'check_tpl_name',
  props: {
    name: {// 考虑编辑回显的情况
      type: String
    },
    space: {
      type: String,
      default: ''
    },
    checkNameParams: {
      type: Object,
      default () {
        return {// 此组件涉及到的参数
          businessId: '',
          businessType: '',
          categoryId: ''
        }
      }
    }
  },
  data () {
      // 检测名称是否有冲突
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入模版名称'))
      }
      if (value === this.name) { // 处理编辑模版反显名称的情况
        callback()
      }

      let obj = {
        name: value,
        businessId: this.checkNameParams.businessId,
        businessType: this.checkNameParams.businessType,
        categoryId: this.checkNameParams.categoryId
      }

      if (this.checkNameParams.businessType === '3') {
        obj.orgId = storage.getLocalStorage('CLINICID')
      }
      request(this.templateManageUrl.templateManage.checkName, obj).then(res => {
        if (res.data) {
          return callback(new Error('模版名称有冲突'))
        } else {
          callback()
        }
      })
    }
    return {
      templateManageUrl,
      form: {
        name: ''
      },
      rules: {
        name: [
            { required: true, validator: checkName, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'form.name': {
      handler (newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  created () {
    if (this.space === 'tech') this.templateManageUrl = urlsfortech
    this.form.name = this.name ? this.name : ''
  },
  methods: {
    submitForm () {
      this.$refs['tplName'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs['tplName'].resetFields()
    }
  }
}
</script>
