<template>
  <div>
    <ever-bread-crumb :name="subjectId === '-1' ? '创建科室' : '编辑科室'"></ever-bread-crumb>
    <div class="layout_inner oa">
      <div class="detail-title">{{subjectId === '-1' ? '创建科室' : form.name}}</div>
      <el-row :gutter="20">
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
                  <el-button v-if="!isConfig" type="primary" @click="save">保存</el-button>
                </el-form-item>
              </el-col>
            </template>
            <template slot="nationSubjectCode">
<!--              <sys-type code="CT08.00.002" :disabled="isConfig" v-model="form.nationSubjectCode" use-object obj-simple></sys-type>-->
              <el-cascader :options="nationSubjectList"
                           v-model="form.nationSubjectCode"
                           filterable
                           :filter-method="filterMethodCascader"
                           :disabled="isConfig"
                           :props="{emitPath: false, checkStrictly: true}"
                           clearable class="w">
              </el-cascader>
            </template>
            <template slot="subjectTypeCode">
              <sys-type code="THC_BASE_SUBJECT1" v-model="form.subjectTypeCode" :disabled="isConfig" type="cascader" use-object obj-simple
                        @value-change="subjectTypeCodeChange"></sys-type>
            </template>
            <template slot="infoText">
              <ever-editor
                menu="base"
                ref="htmlEditor"
                :html="form.infoText"
                :options="editorBaseOpts"
                :editable="!isConfig"
              ></ever-editor>
            </template>
            <template slot="tenantSubject">
              <el-cascader
                class="w"
                popper-class="tenantSubject-cascader"
                v-model="form.tenantSubject"
                :options="subjectList"
                :props="cascaderProps"
                :placeholder="tenantSubjectPlaceholder"
                filterable
                :disabled="isConfig"
                @change="changeTenantSubject"
              ></el-cascader>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="6">
          <ever-upload class="org-avatar-uploader" :upload-attrs="uploadAttrs">
            <img v-if="form.photo" :src="form.photo" class="avatar" alt="科室logo" @mouseenter="enterImg = true" @mouseleave="enterImg = false">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="form.photo && (enterImg || enterClose)" title="删除图片" @click="delPhoto" class="el-icon-circle-close" @mouseenter="enterClose = true" @mouseleave="enterClose = false"></i>
<!--            <img v-if="form.photo" :src="form.photo" class="avatar" alt="科室logo">-->
<!--            <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          </ever-upload>
          <p class="tac">科室logo</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import commonUrlMap from '@/util/urls'
  import urlMap from '@/manages/page/organization/utils/urls'
  import '@/manages/page/organization/assets/less/index.less'
  import storage from '@/util/storage'
  import EverEditor from 'evereditor'
  import { editorBaseOpts } from '@/util/common'
  import {statusList} from '@/manages/page/organization/views/staff/model'
  import {regs} from '@/manages/page/organization/utils/model'
  import {convertListToTree, changeToTreeList, getAllParentById, getCrtPath, isWarehouse, convertSingleFieldListToTree} from '@/manages/page/organization/utils/fns'
  import configUrlMap from '@/manages/page/configure/urls'
  import { convertCharToPinyin } from '@/components/pinyin.js'

  const schema = [
    {
      name: 'parentOrgSubjectCode',
      label: '父科室编码',
      props: {
        disabled: true,
      },
      span: 12,
    },
    {
      name: 'parentOrgSubjectName',
      label: '父科室名称',
      props: {
        disabled: true,
      },
      span: 12,
    },
    {
      name: 'orgSubjectCode',
      label: '机构科室代码',
      props: {disabled: false},
      span: 12,
    },
    {
      name: 'orgSubjectName',
      label: '机构科室名称',
      props: {disabled: false},
      span: 12,
    },
    {
      name: 'tenantSubjectCode',
      label: '集团科室代码',
      props: {disabled: false},
      span: 12,
    },
    {
      name: 'tenantSubjectName',
      label: '集团科室名称',
      span: 12,
    },
    {
      name: 'tenantSubject',
      label: '集团科室',
      comp: 'custom',
      span: 12,
    },
    {
      name: 'nationSubjectCode',
      label: '国家科室',
      comp: 'custom',
      // props: {
      //   code: 'CT08.00.002',
      //   useObject: true,
      //   objSimple: true,
      // },
      span: 12,
    },
    {
      name: 'subjectTypeCode',
      label: '科室类别',
      comp: 'custom',
      parentClass: 'w',
      span: 12,
    },
    {
      name: 'status',
      label: '状态',
      comp: 'select',
      parentClass: 'w',
      props: {
        options: statusList
      },
      span: 12,
    },
    {
      name: 'infoText',
      label: '科室详情',
      comp: 'custom',
      span: 24,
    },
  ]
  const rules = {
    orgSubjectCode: [
      {required: true, message: '必填项', trigger: 'change'},
      {pattern: regs.commonCode, message: '编码必须是字母或者数字或者下划线', trigger: 'change'},
    ],
    orgSubjectName: [
      {required: true, message: '必填项', trigger: 'change'},
      {max: 15, message: '长度限制15字以内', trigger: 'change'},
    ],
    tenantSubject: [
      {required: true, message: '必填项', trigger: 'change'},
    ],
    tenantSubjectCode: [
      {required: true, message: '必填项', trigger: 'change'},
      {pattern: regs.commonCode, message: '编码必须是字母或者数字或者下划线', trigger: 'change'},
    ],
    tenantSubjectName: [
      {required: true, message: '必填项', trigger: 'change'},
      {max: 15, message: '长度限制15字以内', trigger: 'change'},
    ],
    nationSubjectCode: [
      {required: true, message: '必填项', trigger: 'change'},
    ],
    subjectTypeCode: [
      {required: true, message: '必填项', trigger: 'blur'},
    ],
    // status: [
      // {required: true, message: '必填项', trigger: 'change'},
    // ],
  }
  export default {
    components: {EverEditor},
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.type1Code = ''
      form.type1Name = ''
      form.type2Code = ''
      form.type2Name = ''
      // form.nationSubjectCode = ''
      form.nationSubjectName = ''
      form.parentOrgSubjectName = ''
      form.photo = ''
      form.tenantSubjectObj = {}
      form.status = 'Y'
      const me = this
      return {
        schema,
        form,
        rules,
        subjectId: null,
        type: '',
        orgId: '',
        isTenant: '',
        originTsSubjectList: [],
        subjectList: [],
        tsSubjectDone: false,
        searchDone: false,
        editorBaseOpts,
        cascaderProps: {
          checkStrictly: true,
        },
        uploadAttrs: {
          accept: '.png,.jpg,.jpeg',
          multiple: false,
          fileList: [],
          showFileList: false,
          onSuccess (res) {
            if (res.head.errCode === 0) {
              me.form.photo = `${me.$ever.fileUrl2}${res.data.fileId}`
            }
          },
        },
        changeProp: {
          label: 'orgSubjectName',
          value: 'orgSubjectCode',
          id: 'orgSubjectCode',
          parentId: 'parentOrgSubjectCode',
        },
        pageFrom: '1',
        tenantSubjectPlaceholder: '请选择',
        enterImg: false,
        enterClose: false,
        isConfig: false,
        originNationSubjectList: [],
        nationSubjectList: [],
      }
    },
    created () {
      this.subjectId = this.$route.params.subjectId
      this.type = this.$route.params.type
      this.orgId = this.$route.params.orgId
      this.isTenant = this.$route.params.isTenant === '1'
      this.pageFrom = this.$route.params.from || '1'
      if (this.isTenant) {
        this.orgId = storage.getLocalStorage('TENANTID')
        this.searchNationSubject()
      }
      this.schema.forEach(item => {
        item.parentClass = 'w'
      })
      this.schema.find(item => item.name === 'orgSubjectCode').props.disabled = false
      this.schema.find(item => item.name === 'tenantSubjectCode').props.disabled = false
      // 对于集团科室
      if (this.isTenant) {
        // 隐藏机构科室
        this.schema.find(item => item.name === 'orgSubjectCode').parentClass = 'dn'
        this.schema.find(item => item.name === 'orgSubjectName').parentClass = 'dn'
        // 隐藏集团科室的选择框
        this.schema.find(item => item.name === 'tenantSubject').parentClass = 'dn'
        this.rules.tenantSubjectCode[0].required = true
        this.rules.tenantSubjectName[0].required = true
        this.rules.orgSubjectCode[0].required = false
        this.rules.orgSubjectName[0].required = false
        this.rules.tenantSubject[0].required = false
        this.rules.nationSubjectCode[0].required = true
        this.rules.subjectTypeCode[0].required = true
      } else {
        // 对于机构科室
        // 1. 隐藏集团科室的输入框
        this.schema.find(item => item.name === 'tenantSubjectCode').parentClass = 'dn'
        this.schema.find(item => item.name === 'tenantSubjectName').parentClass = 'dn'
        // 2. 隐藏国家科室的选择框
        this.schema.find(item => item.name === 'nationSubjectCode').parentClass = 'dn'
        // 3. 隐藏科室类型的选择框
        this.schema.find(item => item.name === 'subjectTypeCode').parentClass = 'dn'
        this.rules.tenantSubjectCode[0].required = false
        this.rules.tenantSubjectName[0].required = false
        this.rules.orgSubjectCode[0].required = true
        this.rules.orgSubjectName[0].required = true
        this.rules.tenantSubject[0].required = true
        this.rules.nationSubjectCode[0].required = false
        this.rules.subjectTypeCode[0].required = false
        // 4. 查询集团科室，作为级联选择框的数据
        this.searchTenantSubject()
      }
      if (this.type === 'editParent' || this.type === 'create') {
        // 编辑 或者 创建 顶级科室 隐藏父科室
        this.schema.find(item => item.name === 'parentOrgSubjectCode').parentClass = 'dn'
        this.schema.find(item => item.name === 'parentOrgSubjectName').parentClass = 'dn'
        this.form.parentOrgSubjectCode = '0'
      }
      if (this.type === 'edit' || this.type === 'editParent') {
        // 不允许编辑编码
        this.schema.find(item => item.name === 'orgSubjectCode').props.disabled = true
        this.schema.find(item => item.name === 'tenantSubjectCode').props.disabled = true
        // 编辑时查询数据
        this.search()
      }
      if (this.type === 'createSub') {
        // 创建子时查询父节点名称
        this.searchParent([urlMap.subject.load, {id: this.subjectId}])
      }
      if (isWarehouse()) {
        // 在机构设置工作站下：判断是否集中管控，若是集中管控，则隐藏新建按钮
        request(configUrlMap.list).then(res => {
          // 参照 @/util/warehouseconfig
          this.isConfig = (res.data.find(item => item.type === 106) || {}).isConfig === 1
          if (this.isConfig) {
            // this.uploadAttrs.disabled = true
            // this.schema.find(item => item.name === 'orgSubjectName').props.disabled = true
            // this.schema.find(item => item.name === 'tenantSubject').props.disabled = true
            this.setDisabled()
          }
        })
      } else {
        this.isConfig = false
      }
    },
    methods: {
      searchNationSubject () {
        request(commonUrlMap.valueSet.getValueListByCode, {setCode: ['CT08.00.002']}).then(res => {
          if (res.head.errCode === 0) {
            this.originNationSubjectList = res.data.resultList
            this.nationSubjectList = convertSingleFieldListToTree(res.data.resultList.map(item => {
              const pinyin = convertCharToPinyin(item.name)
              return {
                id: item.id,
                name: item.name,
                code: item.code,
                _py_quanpin: pinyin.quanpin,
                _py_shoupin: pinyin.shoupin,
              }
            }))
          }
        })
      },
      setDisabled () {
        this.uploadAttrs.disabled = true
        this.schema = this.schema.map(item => {
          return {
            ...item,
            props: {
              ...item.props,
              disabled: true,
            }
          }
        })
      },
      searchTenantSubject () {
        // 查询集团科室 供 新增机构科室时进行关联
        request(urlMap.subject.loadTenantSubjectListByOrgId, {
          orgId: this.orgId,
          orgUseTenantSubjectPermission: '1',
        }).then(res => {
          this.originTsSubjectList = res.data.pageList.map(item => ({...item, disabled: item.status === 'N'}))
          this.tenantSubjectPlaceholder = this.originTsSubjectList.length ? '请选择' : '请先到【集团科室-集团科室授权】菜单下做授权操作'
          this.subjectList = convertListToTree(changeToTreeList(res.data.pageList.map(item => ({...item, disabled: item.status === 'N'})), this.changeProp))
          this.tsSubjectDone = true
          this.setAsyncTsSubject()
        })
      },
      setAsyncTsSubject () {
        if (this.searchDone && this.tsSubjectDone) {
          const parentList = getAllParentById(changeToTreeList(this.originTsSubjectList, this.changeProp), this.form.tenantSubjectCode)
          this.form.tenantSubject = [...parentList.map(item => item.id), this.form.tenantSubjectCode]
        }
      },
      search () {
        request(urlMap.subject.load, {id: this.subjectId}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            // 回显国家学科
            // this.form.nationSubjectCode = {
            //   code: this.form.nationSubjectCode,
            //   name: this.form.nationSubjectName,
            // }
            // 回显科室类别
            this.form.subjectTypeCode = [
              this.form.type1Code,
              this.form.type2Code,
            ]
            if (!this.isTenant) {
              this.searchDone = true
              this.setAsyncTsSubject()
              this.form.tenantSubjectObj = {
                nationSubjectCode: this.form.nationSubjectCode,
                nationSubjectName: this.form.nationSubjectName,
                tenantSubjectCode: this.form.tenantSubjectCode,
                tenantSubjectName: this.form.tenantSubjectName,
              }
            }
            if (this.type === 'edit') {
              // 根据code查询机构
              this.searchParent([urlMap.subject.loadByOrgIdAndCode, {
                orgSubjectCode: this.form.parentOrgSubjectCode,
                orgId: this.orgId,
              }])
            }
          }
        })
      },
      searchParent (reqArgs) {
        request(...reqArgs).then(res => {
          if (res.head.errCode === 0 && res.data) {
            this.form.parentOrgSubjectCode = res.data.orgSubjectCode
            this.form.parentOrgSubjectName = res.data.orgSubjectName
          } else {
            this.form.parentOrgSubjectCode = '0'
          }
        })
      },
      save () {
        const params = {
          orgId: this.orgId,
          photo: this.form.photo,
          infoText: this.$refs.htmlEditor.getHtml(),
          type1Code: this.form.type1Code,
          type1Name: this.form.type1Name,
          type2Code: this.form.type2Code,
          type2Name: this.form.type2Name,
          parentOrgSubjectCode: this.form.parentOrgSubjectCode,
          status: this.form.status,
        }
        if (this.type === 'editParent' || this.type === 'create') {
          params.parentOrgSubjectCode = '0'
        }
        if (this.type === 'edit' || this.type === 'editParent') {
          params.id = this.form.id
        }
        // todo 各隐藏字段赋值先
        if (this.isTenant) {
          params.tenantSubjectCode = this.form.tenantSubjectCode
          params.tenantSubjectName = this.form.tenantSubjectName
          params.orgSubjectCode = this.form.tenantSubjectCode
          params.orgSubjectName = this.form.tenantSubjectName
          if (this.form.nationSubjectCode) {
            params.nationSubjectCode = this.form.nationSubjectCode
            params.nationSubjectName = this.originNationSubjectList.find(item => item.code === this.form.nationSubjectCode).name
          } else {
            params.nationSubjectName = ''
          }
        } else {
          params.orgSubjectCode = this.form.orgSubjectCode
          params.orgSubjectName = this.form.orgSubjectName
          params.tenantSubjectCode = this.form.tenantSubjectObj.tenantSubjectCode
          params.tenantSubjectName = this.form.tenantSubjectObj.tenantSubjectName
          params.nationSubjectCode = this.form.tenantSubjectObj.nationSubjectCode
          params.nationSubjectName = this.form.tenantSubjectObj.nationSubjectName
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            request(urlMap.subject[(this.type === 'edit' || this.type === 'editParent') ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                // this.$router.push({name: 'org-subject-manage', params: {orgId: this.isTenant ? '-1' : this.orgId}})
                window.history.back()
              }
            })
          }
        })
      },
      subjectTypeCodeChange (value) {
        this.form.type1Code = value[0].code
        this.form.type1Name = value[0].name
        this.form.type2Code = value[1].code
        this.form.type2Name = value[1].name
      },
      changeTenantSubject (value) {
        this.form.tenantSubjectObj = this.originTsSubjectList.find(item => item.orgSubjectCode === value[value.length - 1])
        this.form.type1Code = this.form.tenantSubjectObj.type1Code
        this.form.type1Name = this.form.tenantSubjectObj.type1Name
        this.form.type2Code = this.form.tenantSubjectObj.type2Code
        this.form.type2Name = this.form.tenantSubjectObj.type2Name
      },
      getCrtPath () {
        return getCrtPath()
      },
      delPhoto (e) {
        this.enterClose = false
        this.enterImg = false
        this.form.photo = ''
        this.uploadAttrs.fileList = []
        e.stopPropagation()
      },
      filterMethodCascader (node, keyword) {
        let item = node.data
        return item.name.includes(keyword) ||
          item._py_quanpin.includes(keyword) ||
          item._py_shoupin.includes(keyword)
      },
      // changeNationSubject (val) {
      //   const s = this.originNationSubjectList.find(item => item.code === val)
      //   this.form.nationSubject = {
      //     code: s.code,
      //     name: s.name,
      //   }
      // }
    },
  }
</script>
<style scoped lang="less">

</style>
