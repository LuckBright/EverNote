<template>
  <el-dialog
    title="集团电话模板"
    id="addtemplate"
    center
    :visible.sync="showDialog"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="620px">
    <el-form :model="form" label-width="92px" ref="form" v-if="showDialog" label-position="right">
      <el-form-item label="选择科室：">
        <el-row>
          <el-col :span="16">
            <ever-subject-select  placeholder="选择科室" v-model="selectDept" type="select" :props="{size: 'small', collapseTags: false}" :disabled="form.deptIsAll" size="small" multiple></ever-subject-select>
          </el-col>
          <el-col :span="8" align="right"><el-checkbox v-model="form.deptIsAll">全部科室</el-checkbox></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="模板名称：" prop="name" :rules="rules.title">
        <el-input placeholder="模板名称" v-model.trim="form.name" class="W" size="small"></el-input>
      </el-form-item>
      <el-form-item label="模板内容：" prop="content" :rules="rules.content">
        <el-input v-model.trim="form.content" type="textarea" :rows="5" placeholder="模板内容"></el-input>
      </el-form-item>
      <el-form-item label="启用模板：">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" size="small" style="margin-top:-9px"></el-switch>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="small" @click="saveTemplate">保存</el-button>
        <el-button size="small" @click="showDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { request } from '@/util/req'
import { debounce1 as debounce } from '@/util/common'
import urlMap from '@/util/urls'
export default {
  props: ['value', 'show'],
  data () {
    return {
      showDialog: false,
      request,
      urlMap,
      selectDept: [],
      rules: {
        title: [
          { required: true, message: '请填写模板名称', trigger: 'blur' },
          { min: 2, max: 15, message: '请输入2-15个字符', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请填写模板内容', trigger: 'blur' },
          { min: 2, max: 120, message: '请输入2-120个字符', trigger: 'change' },
        ],
        optional: [
          {required: false}
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ],
        requiredDate: [
          { required: true, message: '必填项', trigger: ['change'], type: 'date' }
        ]
      },
      form: {
        deptList: [],
        name: '',
        status: 0,
        content: '',
        deptIsAll: true
      }
    }
  },
  watch: {
    'show' (val) {
      this.showDialog = val
      this.resetForm()
      if (val && this.value) {
        this.form.id = this.value.id
        this.form.name = this.value.title
        this.form.content = this.value.content
        this.form.status = this.value.status
        if (!this.value || this.value.deptId === 'ALL') {
          this.form.deptIsAll = true
          this.selectDept = []
        } else {
          this.form.deptIsAll = false
          let ids = this.value.deptId ? this.value.deptId.split(',') : []
          let names = this.value.deptName ? this.value.deptName.split(',') : []
          this.selectDept = ids.map((item, i) => {
            return {
              id: item,
              orgSubjectCode: item,
              orgSubjectName: names[i],
            }
          })
        }
      }
    },
    'showDialog' (val) {
      this.$emit('update:show', val)
    },
    'selectDept' (val) {
      if (!val || !val[0]) {
        this.form.deptList = []
        return false
      }
      this.form.deptList = val.map(item => {
        return {
          id: item.id,
          name: item.orgSubjectName
        }
      })
    },
    'form.deptIsAll' (val) {
      if (val) {
        this.selectDept = []
      }
    }
  },
  methods: {
    resetForm (val) {
      this.selectDept = []
      this.form = {
        id: '',
        deptList: [],
        name: '',
        status: 0,
        content: '',
        deptIsAll: true
      }
    },
    saveTemplate: debounce(function () {
      this.$refs.form.validate(vaild => {
        if (!vaild) {
          return false
        }
        let action = this.form.id ? 'update' : 'create'
        let actionText = this.form.id ? '修改' : '添加'
        this.request('follow-up/phoneTemplate/' + action, this.form).then(rs => {
          if (rs.data) {
            this.$messageTips(this, 'success', '模板已' + actionText + '成功', '提示')
            this.showDialog = false
            this.$emit('success', this.form)
          }
        })
      })
    })
  }
}
</script>

<style scoped>
  #addtemplate /deep/ .el-dialog__header {padding: 30px 10px 10px 10px;}
</style>

