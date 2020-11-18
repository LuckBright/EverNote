<template>
  <div>
    <ever-bread-crumb :name="isCreate ? '创建' : '编辑'" path="/manages/org/org"></ever-bread-crumb>
    <div class="layout_inner oa">
      <el-tabs v-model="activeName">
        <el-tab-pane label="互联网医院基本信息" name="info">
          <el-row>
            <el-col :span="24">
              <ever-form2
                v-loading="loading"
                class="upload-form"
                v-model="form"
                ref="form"
                :schema="schema"
                :rules="rules"
                label-width="300px"
              >
                <template slot="default">
                  <el-button :disabled="disableSave" type="primary" @click="save">保存</el-button>
                  <el-button v-if="!isCreate" type="danger" @click="del">删除</el-button>
                </template>
                <template slot="deptComment">
                  <!--              <ever-subject-select v-model="form.deptComment" multiple></ever-subject-select>-->
                  <el-select
                    class="w"
                    v-model="form.deptComment"
                    multiple
                    clearable
                    filterable>
                    <el-option
                      v-for="item in nationSubjectList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </template>
                <template slot="hosDigitalSign">
                  <ever-upload
                    ref="upload1" :upload-attrs="uploadAttrs1" btn-txt="上传文件（必填，png格式，不超过200KB）"></ever-upload>
                </template>
                <template slot="recordFeasibility">
                  <ever-upload ref="upload2" :upload-attrs="uploadAttrs2" btn-txt="上传文件（必填，pdf格式，不超过2MB）"></ever-upload>
                </template>
                <template slot="recordProve">
                  <ever-upload ref="upload3" :upload-attrs="uploadAttrs3" btn-txt="上传文件（必填，pdf格式，不超过2MB）"></ever-upload>
                </template>
                <template slot="recordRulesList">
                  <ever-upload
                    ref="upload4" :upload-attrs="uploadAttrs4" btn-txt="上传文件（必填，可以多选，pdf格式，不超过2MB）"></ever-upload>
                </template>
                <template slot="recordTopology">
                  <ever-upload ref="upload5" :upload-attrs="uploadAttrs5" btn-txt="上传文件（必填，pdf格式，不超过2MB）"></ever-upload>
                </template>
                <template slot="fileList">
                  <!--              <ever-upload ref="upload5" :upload-attrs="uploadAttrs5" btn-txt="上传文件（pdf格式，不超过2MB）"></ever-upload>-->
                  <el-col class="file-list-box">
                    <ever-form2
                      v-for="(fileForm,index) in fileFormList"
                      :ref="'fileForm' + fileForm.index"
                      v-model="fileForm.form"
                      :schema="fileForm.schema"
                      :rules="fileForm.rules"
                      :inline="true"
                      :key="fileForm.index"
                    >
                      <template slot="default">
                        <el-form-item>
                          <el-button
                            icon="el-icon-plus" v-if="index === fileFormList.length - 1"
                            @click="addFileForm(fileForm.index)"></el-button>
                          <el-button
                            icon="el-icon-minus" v-if="index !== 0" @click="minusFileForm(fileForm.index)"></el-button>
                        </el-form-item>
                      </template>
                      <template slot="file">
                        <ever-upload :upload-attrs="fileForm.uploadAttrs" btn-txt="上传文件（必填，pdf格式，不超过2MB）"></ever-upload>
                      </template>
                    </ever-form2>
                  </el-col>
                </template>
              </ever-form2>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="互联网医院监管数据" name="data">
          <el-row>
            <el-col :span="24">
              <ever-form2
                v-model="superviseForm"
                :schema="superviseSchema"
                ref="superviseForm"
                :rules="superviseRules"
                label-width="300px"
              >
                <template>
                  <el-button type="primary" class="supervise-form-btn" @click="saveSupervise">保存</el-button>
                  <el-button v-if="!isCreateConfig" type="danger" class="supervise-form-btn" @click="delSupervise">删除</el-button>
                </template>
              </ever-form2>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import { request } from '@/util/req'
  import { dateFormat, debounce } from '@/util/common'
  import urlMap from '@/manages/page/organization/utils/urls'
  import { webhSchema, webhRules } from '@/manages/page/organization/views/org/model'
  import '@/manages/page/organization/assets/less/index.less'
  import commonUrlMap from '@/util/urls'
  // import storage from '@/util/storage'
  // import globalUrlMap from '@/login/store/globalurls'

  const schema = webhSchema
  const fileRules = {
    file_type_code: [ { required: true, message: '必填项', trigger: 'change' } ],
    file_type_name: [ { required: true, message: '必填项', trigger: 'change' } ],
    file: [ { required: true, message: '必填项', trigger: 'change' } ],
  }
  const fileSchema = [
    {
      name: 'file_type_code',
      label: '文件编号',
    },
    {
      name: 'file_type_name',
      label: '文件名称',
    },
    {
      name: 'file',
      parentClass: 'custom-form-item',
      comp: 'custom',
    },
  ]
  // 监管数据
  const superviseSchema = [
    {
      name: 'superviseDataSubmitChannel',
      label: '监管数据报送通道',
      comp: 'sys-type',
      props: {
        code: 'THC_WH_WATCH_WAY',
        useObject: false,
      },
    },
    {
      name: 'superviseDataSubmitAddr',
      label: '监管数据报送地址',
    },
    {
      name: 'superviseDataSubmitOrgId',
      label: '监管数据报送机构ID',
    },
    {
      name: 'superviseDataSubmitKey',
      label: '监管数据报送密钥',
    },
    {
      name: 'ftpIp',
      label: 'ftpIp',
      parentClass: 'w'
    },
    {
      name: 'ftpPort',
      label: 'ftpPort',
      parentClass: 'w'
    },
    {
      name: 'ftpUserName',
      label: 'ftpUserName',
      parentClass: 'w'
    },
    {
      name: 'ftpPwd',
      label: 'ftpPwd',
      parentClass: 'w'
    },
    // 460000
  ]
  const superviseRules = {
    superviseDataSubmitChannel: [
      {
        required: true,
        message: '必填项',
        trigger: ['change', 'blur'],
      },
    ],
    superviseDataSubmitAddr: [
      {
        required: true,
        message: '必填项',
        trigger: ['change', 'blur'],
      },
    ],
    superviseDataSubmitOrgId: [
      {
        required: true,
        message: '必填项',
        trigger: ['change', 'blur'],
      },
    ],
    superviseDataSubmitKey: [
      {
        required: true,
        message: '必填项',
        trigger: ['change', 'blur'],
      },
    ],
  }
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      const fileForm = this.$ever.createObjFromSchema(fileSchema)
      const superviseForm = this.$ever.createObjFromSchema(superviseSchema)
      const me = this
      return {
        disableSave: false,
        isCreateConfig: true,
        tenantId: '',
        superviseRules,
        superviseForm,
        superviseSchema,
        activeName: 'info',
        nationSubjectList: [],
        loading: false,
        orgId: '',
        isCreate: true,
        schema,
        form,
        rules: webhRules,
        fileFormList: [
          {
            form: fileForm,
            schema: fileSchema,
            index: 0,
            rules: fileRules,
            fileId: '',
            uploadAttrs: {
              accept: '.pdf',
              multiple: false,
              limit: 1,
              'file-list': [],
              'before-upload' (file) {
                // 限制文件大小
                if (file && file.size > 2 * 1024 * 1024) {
                  me.$messageTips(me, 'error', '文件大小限制2MB')
                  return false
                }
              },
              'on-success' () {
              },
              'on-remove' () {
              },
            },
          },
        ],
        // 电子签章
        uploadAttrs1: {
          accept: '.png',
          multiple: false,
          limit: 1,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 200 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制200KB')
              return false
            }
          },
          'on-success' (res) {
            if (res.head.errCode === 0) {
              me.form.hosDigitalSign = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.hosDigitalSign = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs2: {
          accept: '.pdf',
          multiple: false,
          limit: 1,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 2 * 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制2MB')
              return false
            }
          },
          'on-success' (res) {
            if (res.head.errCode === 0) {
              me.form.recordFeasibility = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.recordFeasibility = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs3: {
          accept: '.pdf',
          multiple: false,
          limit: 1,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 2 * 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制2MB')
              return false
            }
          },
          'on-success' (res) {
            if (res.head.errCode === 0) {
              me.form.recordProve = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.recordProve = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs4: {
          accept: '.pdf',
          multiple: false,
          limit: 10,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 2 * 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制2MB')
              return false
            }
          },
          'on-success' (res, file, files) {
            if (res.head.errCode === 0) {
              me.form.recordRulesList = files.map(item => {
                // if (item.response) {
                //   return item.response.data.fileId
                // } else {
                //   return ''
                // }
                return me.getFileId(item)
              })
            }
          },
          'on-remove' () {
            me.form.recordRulesList = []
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs5: {
          accept: '.pdf',
          multiple: false,
          limit: 1,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 2 * 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制2MB')
              return false
            }
          },
          'on-success' (res) {
            if (res.head.errCode === 0) {
              me.form.recordTopology = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.recordTopology = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
      }
    },
    created () {
      const me = this
      // 查询当前机构的互联网医院信息
      this.orgId = this.$route.params.orgId
      this.tenantId = this.$route.params.tenantId
      request(urlMap.orgWebh.load, { thcOrgId: this.orgId }).then(res => {
        if (res.head.errCode === 0) {
          this.isCreate = !res.data
          this.loading = true
          if (this.isCreate) {
            // 初始化 fileFormList 的第一个文件成功钩子 和 删除钩子
            this.fileFormList[0].uploadAttrs['on-success'] = function (res) {
              if (res.head.errCode === 0) {
                me.fileFormList[0].fileId = res.data.fileId
                me.fileFormList[0].form.file = res.data.fileId
              }
            }
            this.fileFormList[0].uploadAttrs['on-remove'] = function () {
              me.fileFormList[0].fileId = ''
              me.fileFormList[0].form.file = ''
            }
          }
          this.form = Object.assign({}, this.form, res.data)
          if (res.data) {
            if (res.data.deptCommentList) {
              this.form.deptComment = JSON.parse(res.data.deptCommentList).map(item => item.dept_code)
            } else {
              this.form.deptComment = []
            }
            this.form.dateRange = [
              this.form.dateStart,
              this.form.dateEnd,
              // new Date(this.form.dateStart),
              // new Date(this.form.dateEnd),
            ]
            // 通过 fileIdJson 字段回显图片
            if (res.data.fileIdJson) {
              const fileIdJson = JSON.parse(res.data.fileIdJson)
              // 回显电子签章
              this.uploadAttrs1['file-list'] = [
                {
                  name: '电子签章.png',
                  url: `${this.$ever.fileUrl2}${fileIdJson.hosDigitalSign}`,
                },
              ]
              this.form.hosDigitalSign = fileIdJson.hosDigitalSign
              this.uploadAttrs2['file-list'] = [
                {
                  name: '可行性报告.jpg',
                  url: `${this.$ever.fileUrl2}${fileIdJson.recordFeasibility}`,
                },
              ]
              this.form.recordFeasibility = fileIdJson.recordFeasibility
              this.uploadAttrs3['file-list'] = [
                {
                  name: '执业许可证.jpg',
                  url: `${this.$ever.fileUrl2}${fileIdJson.recordProve}`,
                },
              ]
              this.form.recordProve = fileIdJson.recordProve
              this.uploadAttrs5['file-list'] = [
                {
                  name: '网络拓扑图.jpg',
                  url: `${this.$ever.fileUrl2}${fileIdJson.recordTopology}`,
                },
              ]
              this.form.recordTopology = fileIdJson.recordTopology
              // 医疗机构规章制度列表
              this.uploadAttrs4['file-list'] = fileIdJson.recordRulesList.split('_').map((item, index) => {
                return {
                  name: `医疗机构规章制度-${index + 1}.jpg`,
                  url: `${this.$ever.fileUrl2}${item}`,
                }
              })
              this.form.recordRulesList = fileIdJson.recordRulesList.split('_')
              // fileList
              this.fileFormList = JSON.parse(fileIdJson.fileList).map((item, index) => {
                return {
                  form: {
                    ...item,
                    file: item.file_content,
                  },
                  schema: fileSchema,
                  index: 0,
                  rules: fileRules,
                  fileId: item.file_content,
                  uploadAttrs: {
                    accept: '.pdf',
                    multiple: false,
                    limit: 1,
                    'file-list': [
                      {
                        name: `资质文件-${index + 1}.jpg`,
                        url: `${this.$ever.fileUrl2}${item.file_content}`,
                      },
                    ],
                    'before-upload' (file) {
                      // 限制文件大小
                      if (file && file.size > 2 * 1024 * 1024) {
                        me.$messageTips(me, 'error', '文件大小限制2MB')
                        return false
                      }
                    },
                    'on-success' (res) {
                      if (res.head.errCode === 0) {
                        me.fileFormList.find(f => f.index === index).fileId = res.data.fileId
                        me.fileFormList.find(f => f.index === index).form.file = res.data.fileId
                      }
                    },
                    'on-remove' () {
                      me.fileFormList.find(f => f.index === index).fileId = ''
                      me.fileFormList.find(f => f.index === index).form.file = ''
                    },
                    'on-preview' (file) {
                      me.previewFile(file)
                    },
                  },
                }
              })
            }
          }
          // 查询当前机构的签约互联网信息
          // request(globalUrlMap.internal.getOrgInternetConfig, {
          //   ...(storage.getLocalStorage('TENANTID') === this.orgId ? {
          //     tenantId: this.orgId,
          //     tenantOrgId: this.orgId,
          //   } : {
          //     tenantId: storage.getLocalStorage('TENANTID'),
          //     tenantOrgId: this.orgId,
          //   }),
          // }, 'get').then(resp => {
          //   if (resp.head.errCode === 0) {
          //     if (resp.data) {
          //       this.form = Object.assign({}, this.form, {
          //         orgName: resp.data.orgName,
          //       }, this.isCreate ? {
          //         orgCode: resp.data.orgMedicalInstitutionCode,
          //       } : {})
          //     }
          //   }
          // })
          this.$refs.form.$refs.form.clearValidate()
          this.loading = false
        }
      })
      this.searchNationSubjectList()
      // 查询资质数据
      this.searchMessage()
    },
    methods: {
      searchMessage () {
        request(urlMap.orgWebh.tsHospitalConfigLoad, {tenantOrgId: this.orgId}).then(res => {
          if (res.head.errCode === 0) {
            // 查出来如果是空的，表示创建，否则表示编辑
            this.isCreateConfig = !res.data
            if (!this.isCreateConfig) {
              this.superviseForm = {
                ...this.superviseForm,
                ...res.data,
              }
            }
          }
        })
      },
      getFileId (fileItem) {
        if (fileItem.response) {
          return fileItem.response.data.fileId
        } else if (fileItem.url) {
          return fileItem.url.slice(fileItem.url.lastIndexOf('=') + 1)
        }
        return ''
      },
      searchNationSubjectList () {
        request(commonUrlMap.valueSet.getValueListByCode, { setCode: [ 'CT08.00.002' ] }).then(res => {
          this.nationSubjectList = res.data.resultList
        })
      },
      previewFile (file) {
        if (file.response && file.response.data) {
          window.open(`${this.$ever.fileUrl2}${file.response.data.fileId}`, '_blank')
        } else if (file.url) {
          window.open(`${file.url}`, '_blank')
        }
      },
      async save () {
        // 判断输入类型
        if (isNaN(Number.parseInt(this.form.authBeds))) {
          this.$messageTips(this, 'error', '"编制床位"应为数字')
          return
        }
        if (isNaN(Number.parseInt(this.form.avgActualBeds))) {
          this.$messageTips(this, 'error', '"平均开放床位"应为数字')
          return
        }
        // 提示必填项
        if (!(this.form.hosDigitalSign && this.form.hosDigitalSign.length)) {
          this.$messageTips(this, 'error', '"互联网医院备案-电子签章"为必填项')
          return
        }
        if (!(this.form.recordFeasibility && this.form.recordFeasibility.length)) {
          this.$messageTips(this, 'error', '"互联网医院备案-可行性报告"为必填项')
          return
        }
        if (!(this.form.recordProve && this.form.recordProve.length)) {
          this.$messageTips(this, 'error', '"互联网医院执业许可证"为必填项')
          return
        }
        if (!(this.form.recordRulesList && this.form.recordRulesList.length)) {
          this.$messageTips(this, 'error', '"互联网医院备案-医疗机构规章制度列表"为必填项')
          return
        }
        if (!(this.form.recordTopology && this.form.recordTopology.length)) {
          this.$messageTips(this, 'error', '"互联网医院备案-网络拓扑图"为必填项')
          return
        }
        const valid = await this.$refs.form.$refs.form.validate()
        if (!valid) {
          return
        }
        const validList = await Promise.all(this.fileFormList.map(item => this.$refs['fileForm' + item.index][0].$refs.form.validate()))
        if (validList.some(valid => !valid)) {
          return
        }
        const params = Object.assign({}, this.form)
        if (params.dateRange) {
          params.dateStart = dateFormat(params.dateRange[0], 'YYYY-MM-DD')
          params.dateEnd = dateFormat(params.dateRange[1], 'YYYY-MM-DD')
        }
        if (params.deptComment && params.deptComment.length) {
          params.deptCommentList = JSON.stringify(params.deptComment.map(item => ({
            dept_code: item,
            dept_name: (this.nationSubjectList.find(n => n.code === item) || {}).name,
          })))
        }
        params.fileList = JSON.stringify(this.fileFormList.map(item => {
          return {
            file_type_code: item.form.file_type_code,
            file_type_name: item.form.file_type_name,
            file_content: item.fileId,
          }
        }))
        params.recordRulesList = params.recordRulesList.join('_')
        params.thcOrgId = this.orgId
        delete params.dateRange
        delete params.deptComment
        const me = this
        this.disableSave = true
        request(urlMap.orgWebh[me.isCreate ? 'insert' : 'update'], params).then(res => {
          me.disableSave = false
          if (res.head.errCode === 0) {
            me.$messageTips(me, 'success', '保存成功')
            me.$router.push({ name: 'org-org' })
          }
        })
      },
      addFileForm (index) {
        const fileForm = this.$ever.createObjFromSchema(fileSchema)
        const me = this
        this.fileFormList.push({
          index: index,
          form: fileForm,
          schema: fileSchema,
          rules: fileRules,
          fileId: '',
          uploadAttrs: {
            ...me.fileFormList[0].uploadAttrs,
            'file-list': [],
            'on-success' (res) {
              if (res.head.errCode === 0) {
                me.fileFormList.find(item => item.index === index).fileId = res.data.fileId
                me.fileFormList.find(item => item.index === index).form.file = res.data.fileId
              }
            },
            'on-remove' () {
              me.fileFormList.find(item => item.index === index).fileId = ''
              me.fileFormList.find(item => item.index === index).form.file = ''
            },
            'on-preview' (file) {
              me.previewFile(file)
            },
          },
        })
      },
      minusFileForm (index) {
        this.fileFormList = this.fileFormList.filter(item => item.index !== index)
      },
      del () {
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          request(urlMap.orgWebh.delete, { thcOrgId: this.orgId }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功')
              this.$router.push({ name: 'org-org' })
            }
          })
        })
      },
      saveSupervise: debounce(function () {
        this.$refs.superviseForm.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.superviseForm)
            request(urlMap.orgWebh[this.isCreateConfig ? 'tsHospitalConfigInsert' : 'tsHospitalConfigUpdate'], {
              ...params,
              tenantId: this.tenantId,
              tenantOrgId: this.orgId,
            }).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.$router.push({ name: 'org-org' })
              }
            })
          }
        })
      }),
      delSupervise () {
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          request(urlMap.orgWebh.tsHospitalConfigDelete, {id: this.superviseForm.id}).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功')
              this.$router.push({ name: 'org-org' })
            }
          })
        })
      },
    },
    watch: {
      'superviseForm.superviseDataSubmitChannel' (val) {
        let ftpIp = this.superviseSchema.find(item => item.name === 'ftpIp')
        let ftpPort = this.superviseSchema.find(item => item.name === 'ftpPort')
        let ftpUserName = this.superviseSchema.find(item => item.name === 'ftpUserName')
        let ftpPwd = this.superviseSchema.find(item => item.name === 'ftpPwd')
        if (val === '460000') {
          ftpIp.parentClass = 'w'
          ftpPort.parentClass = 'w'
          ftpUserName.parentClass = 'w'
          ftpPwd.parentClass = 'w'
        } else {
          ftpIp.parentClass = 'dn'
          ftpPort.parentClass = 'dn'
          ftpUserName.parentClass = 'dn'
          ftpPwd.parentClass = 'dn'
        }
      }
    }
  }
</script>
