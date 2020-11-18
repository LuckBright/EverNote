<template>
  <div>
    <ever-bread-crumb :name="isCreate ? '创建' : '编辑'" path="/manages/org/staff"></ever-bread-crumb>
    <div class="layout_inner oa">
      <el-row>
        <el-col :offset="2" :span="20">
          <ever-form2
            v-loading="loading"
            class="upload-form"
            v-model="form"
            ref="form"
            :schema="schema"
            :rules="rules"
            label-width="350px"
          >
            <template slot="default">
              <el-button type="primary" @click="save">保存</el-button>
              <el-button v-if="originData.docType === '诊疗医师' && originData.pracLevel === '执业医师'" type="primary" @click="send">发送</el-button>
              <el-button type="primary" @click="reSearch">日志</el-button>
              <el-button v-if="!isCreate" type="danger" @click="del">删除</el-button>
            </template>
            <!--            <template slot="workInst">-->
            <!--              <ever-org-select v-model="form.workInst"></ever-org-select>-->
            <!--            </template>-->
            <template slot="docType">
              <el-select v-model="form.docType" placeholder="请选择" @change="(val) => {changeDocType(val)}" class="w">
                <el-option
                  v-for="item in userTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            <template slot="docDept">
              <!--              此处查询的是集团的科室-->
              <ever-subject-select v-model="form.docDept" placeholder="编制科室" :is-org="false" :params="docDeptParams"></ever-subject-select>
            </template>
            <template slot="medPriceList">
              <el-col class="file-list-box">
                <ever-form2
                  v-for="(medForm,index) in medFormList"
                  :ref="'medForm' + medForm.index"
                  v-model="medForm.form"
                  :schema="medForm.schema"
                  :rules="medForm.rules"
                  :inline="true"
                  :key="medForm.index"
                >
                  <template slot="default">
                    <el-form-item>
                      <el-button icon="el-icon-plus" v-if="index === medFormList.length - 1" @click="addMedForm(medForm.index)"></el-button>
                      <el-button icon="el-icon-minus" v-if="index !== 0" @click="minusMedForm(medForm.index)"></el-button>
                    </el-form-item>
                  </template>
                </ever-form2>
              </el-col>
            </template>
            <template slot="workExperienceList">
              <el-col class="file-list-box work-list-box">
                <ever-form2
                  v-for="(workForm,index) in workFormList"
                  :ref="'workForm' + workForm.index"
                  v-model="workForm.form"
                  :schema="workForm.schema"
                  :rules="workForm.rules"
                  :inline="true"
                  :key="workForm.index"
                >
                  <template slot="default">
                    <el-form-item>
                      <el-button icon="el-icon-plus" v-if="index === workFormList.length - 1" @click="addWorkForm(workForm.index)"></el-button>
                      <el-button icon="el-icon-minus" v-if="index !== 0" @click="minusWorkForm(workForm.index)"></el-button>
                    </el-form-item>
                  </template>
                </ever-form2>
              </el-col>
            </template>
            <template slot="hosDigitalSign">
              <ever-upload ref="upload1" :upload-attrs="uploadAttrs1" btn-txt="上传文件（必填，png格式，不超过200KB）"></ever-upload>
            </template>
            <template slot="employFilesList">
              <ever-upload ref="upload41" :upload-attrs="uploadAttrs41" btn-txt="上传文件（必填，可以多选，jpg格式，不超过1M）"></ever-upload>
            </template>
            <template slot="certDocPracList">
              <ever-upload ref="upload42" :upload-attrs="uploadAttrs42" btn-txt="上传文件（必填，可以多选，jpg格式，不超过200KB）"></ever-upload>
            </template>
            <template slot="titleCertList">
              <ever-upload ref="upload43" :upload-attrs="uploadAttrs43" btn-txt="上传文件（必填，可以多选，jpg格式，不超过200KB）"></ever-upload>
            </template>
            <template slot="docCertList">
              <ever-upload ref="upload44" :upload-attrs="uploadAttrs44" btn-txt="上传文件（必填，可以多选，jpg格式，不超过200KB）"></ever-upload>
            </template>
            <template slot="docMultiSitedRecordList">
              <ever-upload ref="upload4" :upload-attrs="uploadAttrs4" btn-txt="上传文件（可以多选，jpg格式，不超过1M）"></ever-upload>
            </template>
            <template slot="digitalSign">
              <ever-upload ref="upload12" :upload-attrs="uploadAttrs12" btn-txt="上传文件（必填，jpg格式，不超过200KB）"></ever-upload>
            </template>
            <template slot="docPhoto">
              <ever-upload ref="upload21" :upload-attrs="uploadAttrs11" btn-txt="上传文件（必填，jpg格式，不超过200KB）"></ever-upload>
            </template>
            <template slot="idCardList">
              <ever-upload ref="upload5" :upload-attrs="uploadAttrs5" btn-txt="身份证正面（必填，jpg格式，不超过200KB）"></ever-upload>
              <ever-upload ref="upload51" :upload-attrs="uploadAttrs51" btn-txt="身份证反面（必填，jpg格式，不超过200KB）"></ever-upload>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="errorLogVisible" title="日志" width="600px">
      <div class="webh-user-error-log">
        {{errorLogData}}
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { request } from '@/util/req'
  import { dateFormat, listDestValue } from '@/util/common'
  import urlMap from '@/manages/page/organization/utils/urls'
  // import {webhSchema, webhRules} from '@/manages/page/organization/views/org/model'
  import { staffWebhSchema, staffWebhRules, geList, titleList, userTypeList } from '@/manages/page/organization/views/staff/model'
  import '@/manages/page/organization/assets/less/index.less'
  import storage from '@/util/storage'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  // import globalUrlMap from '@/login/store/globalurls'

  const schema = staffWebhSchema
  const medSchema = [
    {
      name: 'med_class_code',
      label: '项目编号'
    },
    {
      name: 'med_class_name',
      label: '项目名称'
    },
    {
      name: 'price',
      label: '项目价格'
    },
  ]
  const medRules = {
    med_class_code: [{ required: true, message: '必填项', trigger: 'change' }],
    med_class_name: [{ required: true, message: '必填项', trigger: 'change' }],
    price: [{ required: true, message: '必填项', trigger: 'change' }],
  }
  const workSchema = [
    {
      name: 'we_date_range',
      label: '起始日期',
      comp: 'date',
      parentClass: 'w',
      props: { type: 'daterange' }
    },
    {
      name: 'we_employer',
      label: '所在医院'
    },
    {
      name: 'we_title',
      label: '职称'
    },
    {
      name: 'we_certifier',
      label: '证明人'
    },
  ]
  const workRules = {
    we_date_range: [{ required: true, message: '必填项', trigger: 'change' }],
    we_employer: [{ required: true, message: '必填项', trigger: 'change' }],
    we_title: [{ required: true, message: '必填项', trigger: 'change' }],
    we_certifier: [{ required: true, message: '必填项', trigger: 'change' }],
  }
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.idCard1 = ''
      form.idCard2 = ''
      const medForm = this.$ever.createObjFromSchema(medSchema)
      const workForm = this.$ever.createObjFromSchema(workSchema)
      const me = this
      return {
        // 原始的 医师 数据
        originData: {},
        errorLogVisible: false,
        errorLogData: '',
        docDeptParams: {
          orgIdList: [],
        },
        titleList,
        userTypeList,
        loading: false,
        id: '',
        isCreate: true,
        schema,
        form,
        rules: staffWebhRules,
        // hosDigitalSignSrc: '',
        medFormList: [
          {
            form: medForm,
            schema: medSchema,
            index: 0,
            rules: medRules,
          }
        ],
        workFormList: [
          {
            form: workForm,
            schema: workSchema,
            index: 0,
            rules: workRules,
          }
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
        uploadAttrs11: {
          accept: '.jpg',
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
              me.form.docPhoto = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.docPhoto = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs12: {
          accept: '.jpg',
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
              me.form.digitalSign = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.digitalSign = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        // uploadAttrs2: {
        //   accept: '.pdf',
        //   multiple: false,
        //   limit: 1,
        //   'file-list': [],
        //   'before-upload' (file) {
        //     // 限制文件大小
        //     if (file && file.size > 2 * 1024 * 1024) {
        //       me.$messageTips(me, 'error', '文件大小限制2MB')
        //       return false
        //     }
        //   },
        //   'on-success' (res) {
        //     if (res.head.errCode === 0) {
        //       me.form.recordFeasibility = res.data.fileId
        //     }
        //   },
        //   'on-remove' () {
        //     me.form.recordFeasibility = ''
        //   },
        //   'on-preview' (file) {
        //     me.previewFile(file)
        //   },
        // },
        uploadAttrs4: {
          accept: '.jpg',
          multiple: false,
          limit: 10,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 1 * 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制1M')
              return false
            }
          },
          'on-success' (res, file, files) {
            if (res.head.errCode === 0) {
              me.form.docMultiSitedRecordList = files.map(item => {
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
            me.form.docMultiSitedRecordList = []
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs41: {
          accept: '.jpg',
          multiple: false,
          limit: 10,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 1 * 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制1M')
              return false
            }
          },
          'on-success' (res, file, files) {
            // console.log(files, 'employFilesList:files')
            if (res.head.errCode === 0) {
              me.form.employFilesList = files.map(item => {
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
            me.form.employFilesList = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs42: {
          accept: '.jpg',
          multiple: false,
          limit: 10,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 200 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制200KB')
              return false
            }
          },
          'on-success' (res, file, files) {
            if (res.head.errCode === 0) {
              me.form.certDocPracList = files.map(item => {
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
            me.form.certDocPracList = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs43: {
          accept: '.jpg',
          multiple: false,
          limit: 10,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 200 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制200KB')
              return false
            }
          },
          'on-success' (res, file, files) {
            if (res.head.errCode === 0) {
              me.form.titleCertList = files.map(item => {
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
            me.form.titleCertList = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs44: {
          accept: '.jpg',
          multiple: false,
          limit: 10,
          'file-list': [],
          'before-upload' (file) {
            // 限制文件大小
            if (file && file.size > 200 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制200KB')
              return false
            }
          },
          'on-success' (res, file, files) {
            if (res.head.errCode === 0) {
              me.form.docCertList = files.map(item => {
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
            me.form.docCertList = []
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs5: {
          accept: '.jpg',
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
              me.form.idCard1 = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.idCard1 = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
        uploadAttrs51: {
          accept: '.jpg',
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
              me.form.idCard2 = res.data.fileId
            }
          },
          'on-remove' () {
            me.form.idCard2 = ''
          },
          'on-preview' (file) {
            me.previewFile(file)
          },
        },
      }
    },
    created () {
      // 查询签约机构
      this.tenantId = storage.getLocalStorage('TENANTID')
      // 查询当前机构的互联网医院信息
      this.id = this.$route.params.id
      this.loading = true
      this.search()
    },
    methods: {
      search () {
        request(urlMap.staffWebh.load, { thcStaffId: this.id }).then(res => {
          if (res.head.errCode === 0) {
            this.isCreate = !res.data
            this.form = Object.assign({}, this.form, res.data)
            if (res.data) {
              this.originData = {
                docType: this.form.docType,
                pracLevel: this.form.pracLevel
              }
              this.form.qualifyOrNot = this.form.qualifyOrNot === '1'
              this.form.hosConfirmFlag = this.form.hosConfirmFlag === 1
              this.form.recordFlag = this.form.recordFlag === 1
              this.form.presRecordFlag = this.form.presRecordFlag === 1
              this.form.agreeTerms = this.form.agreeTerms === '1'
              // if (this.form.workInstCode) {
              //   this.form.workInst = this.form.workInstCode
              // }
              if (this.form.docDeptCode) {
                this.form.docDept = this.form.docDeptCode
              }
              if (this.form.docMultiSitedDateStart) {
                this.form.docMultiSitedDateRange = [
                  new Date(this.form.docMultiSitedDateStart),
                  new Date(this.form.docMultiSitedDateEnd),
                ]
              }
              if (this.form.medPriceList) {
                this.medFormList = JSON.parse(this.form.medPriceList).map((item, index) => {
                  return {
                    index,
                    form: item,
                    schema: medSchema,
                    rules: medRules,
                  }
                })
              }
              if (this.form.workExperienceList) {
                this.workFormList = JSON.parse(this.form.workExperienceList).map((item, index) => {
                  return {
                    index,
                    form: {
                      ...item,
                      we_date_range: [item.we_date_start, item.we_date_end]
                    },
                    schema: workSchema,
                    rules: workRules,
                  }
                })
              }
              // 回显文件
              if (res.data.fileIdJson) {
                const fileIdJson = JSON.parse(res.data.fileIdJson)
                // console.log(fileIdJson)
                // 电子章
                this.uploadAttrs1['file-list'] = [
                  {
                    name: '电子章.png',
                    url: `${this.$ever.fileUrl2}${fileIdJson.hosDigitalSign}`
                  }
                ]
                this.form.hosDigitalSign = fileIdJson.hosDigitalSign
                this.uploadAttrs41['file-list'] = fileIdJson.employFilesList.split('_').map((item, index) => {
                  return {
                    name: `互联网医院聘任合同-${index + 1}.jpg`,
                    url: `${this.$ever.fileUrl2}${item}`,
                  }
                })
                this.form.employFilesList = fileIdJson.employFilesList.split('_')
                this.uploadAttrs12['file-list'] = [
                  {
                    name: '数字签名留样.jpg',
                    url: `${this.$ever.fileUrl2}${fileIdJson.digitalSign}`
                  }
                ]
                this.form.digitalSign = fileIdJson.digitalSign
                const idCardList = fileIdJson.idCardList.split('_')
                this.uploadAttrs5['file-list'] = [
                  {
                    name: '身份证正面.jpg',
                    url: `${this.$ever.fileUrl2}${idCardList[0]}`
                  }
                ]
                this.form.idCard1 = idCardList[0]
                this.uploadAttrs51['file-list'] = [
                  {
                    name: '身份证反面.jpg',
                    url: `${this.$ever.fileUrl2}${idCardList[1]}`
                  }
                ]
                this.form.idCard2 = idCardList[1]
                this.form.idCardList = `${this.form.idCard1}_${this.form.idCard2}`
                // 医师执业证文件列表
                this.uploadAttrs42['file-list'] = fileIdJson.certDocPracList.split('_').map((item, index) => {
                  return {
                    name: `医师执业证文件-${index + 1}.jpg`,
                    url: `${this.$ever.fileUrl2}${item}`,
                  }
                })
                this.form.certDocPracList = fileIdJson.certDocPracList.split('_')
                // 医师职称文件列表
                this.uploadAttrs43['file-list'] = fileIdJson.titleCertList.split('_').map((item, index) => {
                  return {
                    name: `医师职称文件-${index + 1}.jpg`,
                    url: `${this.$ever.fileUrl2}${item}`,
                  }
                })
                this.form.titleCertList = fileIdJson.titleCertList.split('_')
                // 医师资格证文件列表
                this.uploadAttrs44['file-list'] = fileIdJson.docCertList.split('_').map((item, index) => {
                  return {
                    name: `医师资格证文件-${index + 1}.jpg`,
                    url: `${this.$ever.fileUrl2}${item}`,
                  }
                })
                this.form.docCertList = fileIdJson.docCertList.split('_')
                if (fileIdJson.docMultiSitedRecordList) {
                  this.uploadAttrs4['file-list'] = fileIdJson.docMultiSitedRecordList.split('_').map((item, index) => {
                    return {
                      name: `医师执业备案文件-${index + 1}.jpg`,
                      url: `${this.$ever.fileUrl2}${item}`,
                    }
                  })
                }
                this.form.docMultiSitedRecordList = fileIdJson.docMultiSitedRecordList.split('_')
                this.uploadAttrs11['file-list'] = [
                  {
                    name: '医师认证照片文件.jpg',
                    url: `${this.$ever.fileUrl2}${fileIdJson.docPhoto}`
                  }
                ]
                this.form.docPhoto = fileIdJson.docPhoto
                // this.form.workInst = {
                //   code: this.form.workInstCode,
                //   name: this.form.workInstName
                // }
                this.form.docDept = {
                  orgSubjectCode: this.form.docDeptCode,
                  orgSubjectName: this.form.docDeptName,
                }
              }
            }
            // 查询当前机构的签约互联网信息
            // request(globalUrlMap.internal.getOrgInternetConfig, { tenantId: this.tenantId, tenantOrgId: this.tenantId }, 'get').then(resp => {
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
            this.loading = false
            this.changeDocType(this.form.docType, false)
          }
        })
      },
      // 发送
      send () {
        request(urlMap.staffWebh.reportWebStaff, { thcStaffId: this.id }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '操作成功')
          } else {
            this.$messageTips(this, 'error', '操作失败')
          }
        })
      },
      // 查看日志：重新查一遍人员，只取错误信息展示
      reSearch () {
        request(urlMap.staffWebh.load, { thcStaffId: this.id }).then(res => {
          if (res.head.errCode === 0) {
            if (res.head.errMsg.includes('没有查询到对应的记录')) {
              this.$messageTips(this, 'error', '没有查询到对应的记录')
              return
            }
            this.errorLogData = res.data.reportLog || ''
            this.errorLogVisible = true
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
      previewFile (file) {
        if (file.response && file.response.data) {
          window.open(`${this.$ever.fileUrl2}${file.response.data.fileId}`, '_blank')
        } else if (file.url) {
          window.open(`${file.url}`, '_blank')
        }
      },
      async save () {
        // 提示必填项
        if (!(this.form.hosDigitalSign && this.form.hosDigitalSign.length)) {
          this.$messageTips(this, 'error', '"申请拟执业医疗机构-电子章"为必填项')
          return
        }
        if (!(this.form.employFilesList && this.form.employFilesList.length)) {
          this.$messageTips(this, 'error', '"互联网医院聘任合同列表(适合多张合同照片的情形)"为必填项')
          return
        }
        if (!(this.form.digitalSign && this.form.digitalSign.length)) {
          this.$messageTips(this, 'error', '"医师数字签名留样"为必填项')
          return
        }
        // 寻找bug 原因 引起医师身份证 即使填写了，也在某些情况下此提示
        // if (!(this.form.idCardList && this.form.idCardList.length)) {
        //   this.$messageTips(this, 'error', '"医师身份证文件列表"为必填项')
        //   return
        // }
        if (!(this.form.idCard1 && this.form.idCard2)) {
          this.$messageTips(this, 'error', '"医师身份证文件列表"为必填项')
          return
        }
        if (!(this.form.certDocPracList && this.form.certDocPracList.length)) {
          this.$messageTips(this, 'error', '"医师执业证文件列表"为必填项')
          return
        }
        if (!(this.form.titleCertList && this.form.titleCertList.length)) {
          this.$messageTips(this, 'error', '"医师职称证文件列表"为必填项')
          return
        }
        if (!(this.form.docCertList && this.form.docCertList.length)) {
          this.$messageTips(this, 'error', '"医师资格证文件列表"为必填项')
          return
        }
        if (!(this.form.docPhoto && this.form.docPhoto.length)) {
          this.$messageTips(this, 'error', '"医师认证照片文件"为必填项')
          return
        }
        // 给编制科室设置可判空的值
        if (!(this.form.docDept && this.form.docDept.orgSubjectCode)) {
          this.form.docDept = ''
        }
        if (this.medFormList && this.medFormList.length) {
          this.form.medPriceList = JSON.stringify(this.medFormList.map(med => {
            return {
              med_class_code: med.form.med_class_code,
              med_class_name: med.form.med_class_name,
              price: med.form.price,
            }
          }))
        }
        if (this.workFormList && this.workFormList.length) {
          this.form.workExperienceList = JSON.stringify(this.workFormList.map(work => {
            return {
              we_date_start: dateFormat(work.form.we_date_range[0], 'YYYY-MM-DD'),
              we_date_end: dateFormat(work.form.we_date_range[1], 'YYYY-MM-DD'),
              we_employer: work.form.we_employer,
              we_title: work.form.we_title,
              we_certifier: work.form.we_certifier,
            }
          }))
        }
        if (this.form.idCard1 && this.form.idCard2) {
          this.form.idCardList = `${this.form.idCard1}_${this.form.idCard2}`
        }
        const valid = await this.$refs.form.$refs.form.validate()
        if (!valid) {
          return
        }
        const validList = await Promise.all(this.medFormList.map(item => this.$refs['medForm' + item.index][0].$refs.form.validate()))
        if (validList.some(valid => !valid)) {
          return
        }
        const workValidList = await Promise.all(this.workFormList.map(item => this.$refs['workForm' + item.index][0].$refs.form.validate()))
        if (workValidList.some(valid => !valid)) {
          return
        }
        const params = Object.assign({}, this.form)
        if (params.geCode) {
          params.geName = listDestValue(geList, params.geCode)
        }
        // if (params.orgName) {
        //   // params.orgName = listDestValue(hospitalList, params.orgCode)
        // }
        if (params.nationCode) {
          let nationArr = await sysvalue.listOnce('GBT.3304')
          params.nationName = listDestValue(nationArr, params.nationCode)
        }
        if (params.nationalityCode) {
          let nationArr = await sysvalue.listOnce('GBT.2659')
          params.nationality = listDestValue(nationArr, params.nationalityCode)
        }
        if (params.titleCode) {
          params.titleName = listDestValue(titleList, params.titleCode)
        }
        if (params.pracRecDate) {
          params.pracRecDate = dateFormat(params.pracRecDate, 'YYYY-MM-DD')
        }
        if (params.certRecDate) {
          params.certRecDate = dateFormat(params.certRecDate, 'YYYY-MM-DD')
        }
        if (params.titleRecDate) {
          params.titleRecDate = dateFormat(params.titleRecDate, 'YYYY-MM-DD')
        }
        if (params.hosOpinionDate) {
          params.hosOpinionDate = dateFormat(params.hosOpinionDate, 'YYYY-MM-DD')
        }
        if (params.docMultiSitedDateRange) {
          params.docMultiSitedDateStart = dateFormat(params.docMultiSitedDateRange[0], 'YYYY-MM-DD')
          params.docMultiSitedDateEnd = dateFormat(params.docMultiSitedDateRange[1], 'YYYY-MM-DD')
        }
        params.thcStaffId = this.id
        if (Array.isArray(params.employFilesList)) {
          // params.employFilesList = JSON.stringify(params.employFilesList.map(file => ({ employ_files: file })))
          params.employFilesList = params.employFilesList.join('_')
        }
        if (Array.isArray(params.docMultiSitedRecordList) && params.docMultiSitedRecordList && params.docMultiSitedRecordList.length) {
          // params.docMultiSitedRecordList = JSON.stringify(params.docMultiSitedRecordList.map(file => ({ doc_multi_sited_record: file })))
          params.docMultiSitedRecordList = params.docMultiSitedRecordList.join('_')
        } else {
          params.docMultiSitedRecordList = ''
        }
        if (Array.isArray(params.certDocPracList)) {
          params.certDocPracList = params.certDocPracList.join('_')
        }
        if (Array.isArray(params.titleCertList)) {
          params.titleCertList = params.titleCertList.join('_')
        }
        if (Array.isArray(params.docCertList)) {
          params.docCertList = params.docCertList.join('_')
        }
        if (Array.isArray(params.recordRulesList)) {
          params.recordRulesList = params.recordRulesList.join('_')
        }
        params.qualifyOrNot = params.qualifyOrNot ? '1' : '0'
        params.hosConfirmFlag = params.hosConfirmFlag ? '1' : '0'
        params.recordFlag = params.recordFlag ? '1' : '0'
        params.presRecordFlag = params.presRecordFlag ? '1' : '0'
        params.agreeTerms = params.agreeTerms ? '1' : '0'
        // if (params.workInst) {
        //   params.workInstCode = params.workInst.code
        //   params.workInstName = params.workInst.name
        // }
        if (params.docDept) {
          params.docDeptCode = params.docDept.orgSubjectCode
          params.docDeptName = params.docDept.orgSubjectName
        }
        delete params.docMultiSitedDateRange
        delete params.docDept
        // delete params.workInst
        request(urlMap.staffWebh[this.isCreate ? 'insert' : 'update'], params).then(res => {
          // request(urlMap.staffWebh[this.isCreate ? 'insert' : 'update'], {...JSON.parse(`{"orgCode":"WEBH002","inDocCode":"1","docType":"审方药师","docName":"1","geCode":1,"nationCode":1,"docAddress":"1","docEdu":"大学","docPosition":"1","docComment":"1","titleCode":"3","workInst":{"id":"5000001","code":"5000001","name":"尚医至信"},"docDept":{"orgSubjectId":"4459988c8eff49f4b3ae164c4a8a2754","orgSubjectCode":"002001","orgSubjectName":" 神经外科"},"docTel":"1","idCard":"1","pracNo":"1","pracRecDate":"2019-10-15","certNo":"1","certRecDate":"2019-10-15","titleNo":"1","titleRecDate":"2019-10-08","pracType":"1","pracScopeApproval":"1","professional":"1","hosOpinion":"1","hosOpinionDate":"2019-10-08","medPriceList":"[{\\"med_class_code\\":\\"1\\",\\"med_class_name\\":\\"1\\",\\"price\\":\\"1\\"}]","hosDigitalSign":"5,edbee09a1a","employFilesList":"[{\\"employ_files\\":\\"1,eeb9f2446f\\"}]","digitalSign":"2,ef506e1590","idCardList":"[{\\"id_card\\":\\"5,f0fd881fd5\\"},{\\"id_card\\":\\"4,f16697363f\\"}]","certDocPracList":"[{\\"cert_doc_prac\\":\\"2,f2b01cd602\\"}]","titleCertList":"[{\\"title_cert\\":\\"7,f37f5d0474\\"}]","docCertList":"[{\\"doc_cert\\":\\"5,f41414a771\\"}]","docPhoto":"3,f586adc3c4","docMultiSitedRecordList":"","qualifyOrNot":"1","hosConfirmFlag":"1","recordFlag":"1","presRecordFlag":"1","agreeTerms":"1","orgName":"步洛健康互联网医院","idCard1":"","idCard2":"","recordRulesList":["6,f64b898883"],"geName":"男","nationName":"汉族","titleName":"住院医师","docMultiSitedDateStart":"2019-10-10","docMultiSitedDateEnd":"2019-11-20","thcStaffId":"4383256f9fc64de08bc85daa6576190a","workInstCode":"5000001","workInstName":"尚医至信","docDeptCode":"002001","docDeptName":" 神经外科"}`), thcStaffId: this.id}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            // this.$router.push({ name: 'org-staff' })
            this.search()
          }
        })
      },
      addMedForm (index) {
        const medForm = this.$ever.createObjFromSchema(medSchema)
        this.medFormList.push({
          index: index + 1,
          form: medForm,
          schema: medSchema,
          rules: medRules,
        })
      },
      minusMedForm (index) {
        this.medFormList = this.medFormList.filter(item => item.index !== index)
      },
      addWorkForm (index) {
        const workForm = this.$ever.createObjFromSchema(workSchema)
        this.workFormList.push({
          index: index + 1,
          form: workForm,
          schema: workSchema,
          rules: workRules,
        })
      },
      minusWorkForm (index) {
        this.workFormList = this.workFormList.filter(item => item.index !== index)
      },
      del () {
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request(urlMap.staffWebh.delete, { thcStaffId: this.id }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功')
              this.$router.push({ name: 'org-staff' })
            }
          })
        })
      },
      changeDocType (val, isClear = true) {
        if (isClear) {
          this.form.titleCode = ''
        }
        this.schema.find(item => item.name === 'titleCode').props.options = val === '审方药师' ? [
          { name: '药士', id: '7' },
          { name: '药师', id: '8' },
          { name: '主管药师', id: '9' },
          { name: '副主任药师', id: '10' },
          { name: '主任药师', id: '11' },
        ] : (val === '诊疗医师' ? [
          { name: '医师', id: '1' },
          { name: '医士', id: '2' },
          { name: '住院医师', id: '3' },
          { name: '主治医师', id: '4' },
          { name: '副主任医师', id: '5' },
          { name: '主任医师', id: '6' },
        ] : [])
      },
    },
  }
</script>
<style lang="less" scoped>
  /*.upload-form /deep/ .is-error {*/
  /*  .el-form-item__label {*/
  /*    color: #f18787;*/
  /*  }*/
  /*  button {*/
  /*    color: #f18787;*/
  /*  }*/
  /*}*/
</style>
