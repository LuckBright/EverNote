<template>
  <div>
    <ever-bread-crumb :name="deptId === '-1' ? '创建部门' : '编辑部门'"></ever-bread-crumb>
    <div class="layout_inner oa">
      <div class="detail-title mb15">{{deptId === '-1' ? '创建部门' : form.deptName}}</div>
      <el-row>
        <el-col :span="18">
          <ever-form2
            v-model="form"
            ref="form"
            :schema="schema"
            :rules="rules"
            label-width="150px"
          >
            <template>
              <el-col>
                <el-form-item>
                  <el-button type="primary" @click="save">保存</el-button>
                </el-form-item>
              </el-col>
            </template>
            <template slot="infoText">
              <ever-editor
                menu="base"
                ref="htmlEditor"
                :html="form.infoText"
                :options="editorBaseOpts"
              ></ever-editor>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="6">
          <ever-upload class="org-avatar-uploader" :upload-attrs="uploadAttrs">
            <img v-if="form.photo" :src="dialogImageUrl" class="avatar" alt="部门logo" @mouseenter="enterImg = true" @mouseleave="enterImg = false">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="form.photo && (enterImg || enterClose)" title="删除图片" @click="delPhoto" class="el-icon-circle-close" @mouseenter="enterClose = true" @mouseleave="enterClose = false"></i>
          </ever-upload>
          <p class="tac">部门logo</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import EverEditor from 'evereditor'
  import { editorBaseOpts } from '@/util/common'
  import { regs } from '@/manages/page/organization/utils/model'
  import { getCrtPath } from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'
  const schema = [
    {
      name: 'parentDeptCode',
      label: '父部门编码',
      props: {
        disabled: true,
      },
      span: 12,
    },
    {
      name: 'parentDeptName',
      label: '父部门名称',
      props: {
        disabled: true,
      },
      span: 12,
    },
    {
      name: 'deptCode',
      label: '部门编码',
      span: 12,
    },
    {
      name: 'deptName',
      label: '部门名称',
      span: 12,
    },
    {
      name: 'deptNameEnglish',
      label: '部门英文名称',
      span: 12,
    },
    {
      name: 'infoText',
      label: '部门详情',
      comp: 'custom',
      span: 24,
    }
  ]
  const rules = {
    deptCode: [
      {required: true, message: '必填项', trigger: 'change'},
      {pattern: regs.commonCode, message: '部门编码必须是字母或者数字或者下划线', trigger: 'change'},
    ],
    deptName: [
      {required: true, message: '必填项', trigger: 'change'}
    ],
  }
  export default {
    components: {EverEditor},
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.photo = ''
      const me = this
      return {
        dialogImageUrl: '',
        schema,
        form,
        rules,
        deptId: null,
        orgId: null,
        type: '',
        editorBaseOpts,
        uploadAttrs: {
          accept: '.png,.jpg,.jpeg',
          multiple: false,
          fileList: [],
          showFileList: false,
          onSuccess (res) {
            if (res.head.errCode === 0) {
              me.form.photo = res.data.fileId
              me.dialogImageUrl = me.$ever.fileUrl2 + me.form.photo
            }
          },
        },
        enterImg: false,
        enterClose: false,
      }
    },
    created () {
      this.deptId = this.$route.params.deptId
      this.orgId = this.$route.params.orgId
      this.type = this.$route.params.type
      const parentDeptCodeItem = this.schema.find(item => item.name === 'parentDeptCode')
      const parentDeptNameItem = this.schema.find(item => item.name === 'parentDeptName')
      if (this.type === 'createSub') {
        if (this.deptId === '-1') {
          // 创建机构下的直接部门（一级部门）
          parentDeptCodeItem.parentClass = 'dn'
          parentDeptNameItem.parentClass = 'dn'
          this.form.parentDeptCode = '0'
        } else {
          parentDeptCodeItem.parentClass = 'w'
          parentDeptNameItem.parentClass = 'w'
          // 查询父部门的信息 (要创建的部门是this.deptId的子部门)
          this.searchParent([urlMap.dept.load, {id: this.deptId}])
        }
      } else {
        if (this.type === 'editParent') {
          this.form.parentDeptCode = '0'
          // 编辑机构下的直接部门（一级部门）
          parentDeptCodeItem.parentClass = 'dn'
          parentDeptNameItem.parentClass = 'dn'
        } else {
          parentDeptCodeItem.parentClass = 'w'
          parentDeptNameItem.parentClass = 'w'
        }
        this.search()
      }
    },
    methods: {
      search () {
        request(urlMap.dept.load, {id: this.deptId}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            if (this.form.photo) {
              this.dialogImageUrl = this.$ever.fileUrl2 + this.form.photo
            }
            // 根据code查询父部门信息 给父部门名称赋值
            this.searchParent([urlMap.dept.loadByOrgIdAndCode, {deptCode: this.form.parentDeptCode, orgId: this.orgId}])
          }
        })
      },
      searchParent (reqArgs) {
        request(...reqArgs).then(res => {
          if (res.head.errCode === 0) {
            if (res.data) {
              this.form.parentDeptCode = res.data.deptCode
              this.form.parentDeptName = res.data.deptName
            } else {
              this.form.parentDeptCode = '0'
            }
          }
        })
      },
      save () {
        const params = Object.assign({}, this.form)
        params.orgId = this.orgId
        params.infoText = this.$refs.htmlEditor.getHtml()
        delete params.parentDeptName
        request(urlMap.dept[(this.type === 'edit' || this.type === 'editParent') ? 'update' : 'insert'], params).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            // this.$router.push({name: 'org-dept'})
            window.history.back()
          }
        })
      },
      getCrtPath () {
        return getCrtPath()
      },
      delPhoto (e) {
        this.enterClose = false
        this.enterImg = false
        this.form.photo = ''
        this.dialogImageUrl = ''
        this.uploadAttrs.fileList = []
        e.stopPropagation()
      },
    },
  }
</script>
