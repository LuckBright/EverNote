<template>
  <div>
    <ever-bread-crumb :name="staffId === '-1' ? '创建人员' : (isConfig ? '查看人员' : '编辑人员')"></ever-bread-crumb>
    <div class="layout_inner oa">
      <div class="detail-title">
        {{staffId === '-1' ? '创建人员' : form.name}}<span v-if="staffId !== '-1'" :class="[signed ? 'signed' : 'un-signed']">
          {{ signed ? '（已实名认证）' : '（未实名认证）' }}
        </span>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
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
                  <el-button type="primary" @click="save" v-if="type !== 'view' && !formDisabled">保存</el-button>
                </el-form-item>
              </el-col>
            </template>
            <template slot="titleBaseInfo">
              <div class="form-item-title">基本信息</div>
            </template>
            <template slot="type">
              <sys-type class="w" code="THC_WH_PERSON_CATEGORY" :disabled="formDisabled" v-model="form.type" use-object obj-simple @change="changeType"></sys-type>
            </template>
            <template slot="org">
              <el-cascader
                v-model="form.org"
                :options="orgOptions"
                :props="cascaderProps"
                filterable
                :disabled="formDisabled || isWarehousePage"
                clearable
                @change="changeOrg"
              ></el-cascader>
            </template>
            <template slot="dept">
              <el-cascader
                v-loading="loadingDept"
                v-model="form.dept"
                :options="deptOptions"
                :props="cascaderProps"
                :disabled="formDisabled"
                clearable
                filterable
              ></el-cascader>
            </template>
            <template slot="skillsTitle">
              <sys-type class="w" code="THC_WH_RYZC1" :disabled="formDisabled" v-model="form.skillsTitle" type="cascader" use-object obj-simple @value-change="skillsTitleChange"></sys-type>
            </template>
            <template slot="titlePracticeInfo">
              <div class="form-item-title">执业信息</div>
            </template>
            <template slot="orgList">
              <el-cascader
                class="w"
                v-model="form.orgList"
                :options="orgList"
                :props="cascaderMulProps"
                filterable
                :disabled="formDisabled"
                @change="changeMulOrg"
              ></el-cascader>
            </template>
            <template slot="subjectList">
              <el-cascader
                class="w"
                v-model="form.subjectList"
                :options="subjectList"
                :props="cascaderMulProps"
                :disabled="formDisabled"
                filterable
                @change="changeMulSubject"
              ></el-cascader>
            </template>
<!--            <template slot="tsStaffSickAreaDTOList">-->
<!--              <el-select class="w" v-model="form.tsStaffSickAreaDTOList" value-key="sickAreaCode" multiple>-->
<!--                <el-option v-for="item in sickAreaList" :key="item.sickAreaCode" :label="item.sickAreaName"-->
<!--                           :value="item"></el-option>-->
<!--              </el-select>-->
<!--            </template>-->
            <template slot="ageRange">
              <div class="df">
                <div class="f1">
                  <age-range-picker
                    :show-month="false"
                    class="staff-age-range"
                    empty
                    :disabled="formDisabled"
                    placeholder-end="最大接诊年龄"
                    placeholder-start="最小接诊年龄"
                    v-model="form.ageRange"></age-range-picker>
                </div>
                <div class="tip-age-wrap">
                  <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover">
                    <div>最小年龄：代表接诊年龄起点</div>
                    <div>最大年龄：代表接诊年龄上限</div>
                    <div>只填其中一项代表只做最小或者最大限制，两项都填代表只接诊区间内的患者</div>
                    <i slot="reference" class="el-icon-question pointer cOrange tip-age"></i>
                  </el-popover>
                </div>
              </div>
            </template>
            <template slot="titlePrescriptionInfo">
              <div class="form-item-title" :class="form.typeCode === 'DOCTOR' ? '' : 'dn'">处方权</div>
            </template>
            <template slot="recipePermissionValue">
              <el-switch v-model="form.recipePermissionValue" @change="changeRecipePermissionValue" :disabled="formDisabled"></el-switch>
            </template>
            <template slot="tsStaffPermission">
              <sys-type class="w" code="THC_BASE_STAFF_PERMISSION1"
                        :filtercodes="['01', '02']"
                        :disabled="formDisabled || !form.recipePermissionValue"
                        v-model="form.tsStaffPermission"
                        type="cascader"
                        multiple use-object obj-simple
                        @value-change="tsStaffPermissionChange"
                        @getOptions="getStaffPermissionOptions"
              ></sys-type>
            </template>
            <template slot="titleOtherInfo">
              <div class="form-item-title">其他</div>
            </template>
            <template slot="infoText">
              <el-select
                class="w"
                v-model="form.infoText"
                multiple
                filterable
                allow-create
                default-first-option
                value-key="code"
                :disabled="formDisabled"
                @change="changeInfoText"
                placeholder="输入擅长标签，以enter结束一个擅长标签的输入，可以输入多个擅长标签">
                <el-option
                  v-for="item in infoTextOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </template>
            <template slot="tsStaffFiles">
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
                      <el-button icon="el-icon-plus" v-if="!formDisabled && index === fileFormList.length - 1" @click="addFileForm(fileForm.index + 1)"></el-button>
                      <el-button icon="el-icon-minus" v-if="!formDisabled && ((index !== 0 && fileFormList.length === 1) || fileFormList.length > 1)" @click="minusFileForm(fileForm.index)"></el-button>
                    </el-form-item>
                  </template>
                  <template slot="fileId">
<!--                    {{fileForm.fileId !== '-1' && !!fileForm.fileId}}-->
<!--                    {{fileForm.fileId}}-->
                    <ever-upload :class="{'hide-btn': fileForm.fileId !== '-1' && !!fileForm.fileId}" :upload-attrs="fileForm.uploadAttrs" btn-txt="上传文件（非必填，不超过1MB）" :hide="fileForm.fileId !== '-1' && !!fileForm.fileId"></ever-upload>
                  </template>
                </ever-form2>
              </el-col>
            </template>
<!--            <template slot="text">-->
<!--              <ever-editor-->
<!--                menu="base"-->
<!--                ref="htmlEditor"-->
<!--                :html="form.infoText"-->
<!--                :options="editorOpts"-->
<!--              ></ever-editor>-->
<!--            </template>-->
<!--            <template slot="remark">-->
<!--              <ever-editor-->
<!--                menu="base"-->
<!--                ref="htmlEditor2"-->
<!--                :html="form.infoRemark"-->
<!--                :options="editorOpts2"-->
<!--              ></ever-editor>-->
<!--            </template>-->
            <template slot="iPhoto">
              <ever-editor
                menu="base"
                ref="htmlEditor3"
                :html="form.infoPhoto"
                :options="editorOpts3"
                :editable="!formDisabled"
              ></ever-editor>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="8">
          <ever-upload class="org-avatar-uploader" :upload-attrs="uploadAttrs">
            <img v-if="form.photo" :src="$ever.fileUrl2 + form.photo" class="avatar" alt="头像" @mouseenter="enterImg = true" @mouseleave="enterImg = false">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="form.photo && (enterImg || enterClose)" title="删除图片" @click="delPhoto" class="el-icon-circle-close photo" @mouseenter="enterClose = true" @mouseleave="enterClose = false"></i>
            <i v-if="form.photo && (enterImg || enterZoomIn)" title="查看图片" @click="viewPhoto" class="el-icon-zoom-in photo" @mouseenter="enterZoomIn = true" @mouseleave="enterZoomIn = false"></i>
          </ever-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <ever-form2
            v-model="personalForm"
            ref="personalForm"
            :schema="personalSchema"
            :rules="personalRules"
            label-width="150px"
          >
            <template>
              <el-col>
                <el-form-item></el-form-item>
              </el-col>
            </template>
            <template slot="card">
              <sys-type class="w" code="CV02.01.101" :disabled="formDisabled" v-model="personalForm.card" use-object obj-simple @change="changeCard"></sys-type>
            </template>
            <template slot="birthday">
              <el-date-picker
                class="wi"
                v-model="personalForm.birthday"
                placeholder="请选择"
                :picker-options="birthdayOpts"
                :disabled="formDisabled"
                type="date">
              </el-date-picker>
            </template>
          </ever-form2>
<!--          账号信息-->
          <detail-user :type="type" :id="staffId" :disabled="formDisabled" :staff-info="staff" v-if="type !== 'edit' || (type === 'edit' && searchDone)"></detail-user>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import baseUrlMap from '@/util/urls'
  import urlMap from '@/manages/page/organization/utils/urls'
  import buildingUrlMap from '@/warehouse/page/building/utils/urls'
  import {regs} from '@/manages/page/organization/utils/model'
  import DetailUser from '@/manages/page/organization/views/staff/detail-user'
  import {convertListToTree, changeToTreeList, getAllParentById, getCrtPath, isWarehouse, sortTreeListByIdList} from '@/manages/page/organization/utils/fns'
  import configUrlMap from '@/manages/page/configure/urls'
  import '@/manages/page/organization/assets/less/index.less'
  import {staffSchema, staffPersonalSchema, staffRules, staffPersonalRules} from '@/manages/page/organization/views/staff/model'
  import ageRangePicker from '@/components/agerangepicker'
  import EverEditor from 'evereditor'
  import { convertCharToPinyin } from '@/components/pinyin.js'
  import {dateFormat, editorBaseOpts} from '@/util/common'
  import storage from '@/util/storage'
  import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
  const schema = staffSchema
  const rules = staffRules
  const personalSchema = staffPersonalSchema
  const fileSchema = [
    {
      name: 'fileType',
      label: '证件类型',
      comp: 'sys-type',
      props: {
        code: 'THC_WH_PERSON_CERTIFICATE',
        useObject: true,
        objSimple: true,
        clearable: true,
        // filtercodes: ['03.02', '03.03', '03.04', '03.05']
      },
      parentClass: 'w_30',
    },
    {
      name: 'fileNo',
      label: '证件号码',
      parentClass: 'w_30',
    },
    {
      name: 'certificateTime',
      label: '注册日期',
      comp: 'date',
      parentClass: 'w_30',
    },
    {
      name: 'fileId',
      comp: 'custom',
    },
  ]
  const fileRules = {
    // fileType: [ { required: true, message: '必填项', trigger: 'change' } ],
    // fileNo: [ { required: true, message: '必填项', trigger: 'change' } ],
    // fileId: [ { required: true, message: '必填项', trigger: 'change' } ],
  }
  export default {
    components: {ageRangePicker, EverEditor, DetailUser},
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      const fileForm = this.$ever.createObjFromSchema(fileSchema)
      form.type = {code: 'DOCTOR', name: '医生'}
      form.org = []
      form.dept = []
      form.skillsTitle = []
      form.skillTitleList = [] // 选择之后的数据
      form.photo = ''
      form.tsStaffPermission = []
      form.tsStaffPermissionList = []
      form.orgList = []
      form.tsOrgList = [] // 对象数组
      form.subjectList = []
      form.tsSubjectList = [] // 对象数组
      form.ageRange = {
        start: {year: ''},
        end: {year: ''},
      }
      form.infoText = []
      form.infoRemark = ''
      form.servicesLanguage = []
      form.recipePermissionValue = true
      form.enableStatus = 'Y'
      const personalForm = this.$ever.createObjFromSchema(personalSchema)
      const me = this
      return {
        signed: false,
        // 表单相关
        schema,
        form,
        rules,
        originOrgList: [],
        originDeptList: [],
        orgOptions: [],
        deptOptions: [],
        loadingDept: false,
        originTsOrgList: [], // 原始执业机构数据
        originTsSubjectList: [], // 原始执业学科数据
        orgList: [], // 执业机构信息
        subjectList: [], // 执业专业信息
        dialogVisible: false,
        dialogImageUrl: '',
        uploadAttrs: {
          disabled: false,
          accept: '.png,.jpg,.jpeg',
          multiple: false,
          fileList: [],
          showFileList: false,
          'before-upload' (file) {
            if (file && file.size > 1024 * 1024) {
              me.$messageTips(me, 'error', '文件大小限制1M')
              return false
            }
          },
          onSuccess (res) {
            if (res.head.errCode === 0) {
              me.form.photo = res.data.fileId
            }
          },
        },
        imageUrl: '',
        cascaderProps: {
          checkStrictly: true,
        },
        cascaderMulProps: {
          checkStrictly: true,
          multiple: true,
        },
        editorBaseOpts,
        editorOpts2: editorBaseOpts,
        editorOpts3: editorBaseOpts,
        birthdayOpts: {
          disabledDate (now) {
            return now.getTime() > Date.now()
          }
        },
        personalSchema,
        personalForm,
        personalRules: staffPersonalRules,
        // 路由中的参数
        staffId: null,
        type: '',
        staff: null, // 根据staffId查询到的人员信息
        // 判断请求是否完成
        orgDone: false, // 组织机构是否请求完成
        tsOrgDone: false, // 执业机构是否请求完成
        tsSubjectDone: false, // 执业科室是否请求完成
        searchDone: false, // 查询是否完成
        tenantId: null,
        orgId: null,
        sickAreaList: [],
        pageFrom: '1', // 1 表示从人员列表过去 2 表示从人员授权过去 默认为 1
        enterImg: false,
        enterClose: false,
        enterZoomIn: false,
        isConfig: false, // 是否集中管控
        isOtherOrg: false, // 是否为其他机构人员
        fileFormList: [
          {
            form: fileForm,
            schema: fileSchema,
            index: 0,
            rules: fileRules,
            fileId: '',
            uploadAttrs: {
              accept: '.png,.jpeg,.jpg',
              multiple: false,
              limit: 1,
              'file-list': [],
              'before-upload' (file) {
                // 限制文件大小
                if (file && file.size > 1024 * 1024) {
                  me.$messageTips(me, 'error', '文件大小限制1MB')
                  return false
                }
              },
              'on-preview' (file) {
                me.previewFile(file)
              },
            },
          }
        ],
        infoTextOptions: [],
        creatingInfoTextList: [], // 暂存将要创建的擅长详情
        isWarehousePage: false,
        staffPermissionOptions: [],
      }
    },
    computed: {
      formDisabled () {
        return this.isConfig || this.isOtherOrg
      }
    },
    created () {
      this.tenantId = storage.getLocalStorage('TENANTID')
      this.orgId = storage.getStorageByClinic('CLINICID')
      this.staffId = this.$route.params.id
      this.type = this.$route.params.type
      this.pageFrom = this.$route.params.from || '1'
      const me = this
      this.fileFormList[0].uploadAttrs['on-success'] = function (res) {
        if (res.head.errCode === 0) {
          me.fileFormList[0].fileId = res.data.fileId === '-1' ? '' : res.data.fileId
          me.fileFormList[0].form.fileId = res.data.fileId === '-1' ? '' : res.data.fileId
        }
      }
      this.fileFormList[0].uploadAttrs['on-remove'] = function () {
        me.fileFormList[0].fileId = ''
        me.fileFormList[0].form.fileId = ''
      }
      if (this.staffId !== '-1') {
        this.search()
      } else {
        this.changeType({code: 'DOCTOR'})
      }
      this.initOptions()
      // if (this.type === 'view') {
      //   // 将页面切换为查看模式
      //   this.schema = transferSchema(this.schema, true)
      // }
      // 只在机构设置工作站下判断是否有集中管控
      if (isWarehouse()) {
        this.isWarehousePage = true
        // 在机构设置工作站下：判断是否集中管控，若是集中管控，则隐藏新建按钮
        request(configUrlMap.list).then(res => {
          // 参照 @/util/warehouseconfig
          this.isConfig = (res.data.find(item => item.type === 103) || {}).isConfig === 1
          if (this.isConfig) {
            this.setDisabled()
          }
        })
      } else {
        this.isConfig = false
      }
    },
    watch: {
      'form.name' (val) {
        if (!val) {
          this.form.namePinyin = ''
          this.form.nameEnglish = ''
        } else {
          const pinyin = convertCharToPinyin(val)
          this.form.namePinyin = pinyin.quanpin
          this.form.nameEnglish = convertCharToPinyin(val[0]).shoudaxie + ' ' + convertCharToPinyin(val.slice(1)).shoudaxie
        }
      },
    },
    methods: {
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
        this.personalSchema = this.personalSchema.map(item => {
          return {
            ...item,
            props: {
              ...item.props,
              disabled: true,
            }
          }
        })
        // 证件信息禁止修改
        this.fileFormList = this.fileFormList.map(item => {
          return {
            ...item,
            schema: item.schema.map(s => {
              return {
                ...s,
                props: {
                  ...s.props,
                  disabled: true,
                }
              }
            }),
            uploadAttrs: {
              ...item.uploadAttrs,
              disabled: true
            },
          }
        })
      },
      initOptions () {
        // 机构树
        request(urlMap.org.pageList).then(res => {
          if (res.head.errCode === 0) {
            this.originOrgList = res.data.pageList
            this.orgOptions = convertListToTree(changeToTreeList(res.data.pageList))
            this.orgDone = true
            this.setAsyncOrg()
          }
        })
        // 执业机构
        request(urlMap.org.loadWithChildsById, {id: this.tenantId}).then(res => {
          if (res.head.errCode === 0) {
            this.originTsOrgList = res.data.pageList
            this.orgList = convertListToTree(changeToTreeList(res.data.pageList))
            this.tsOrgDone = true
            this.setAsyncTsOrg()
          }
        })
        // 执业科室
        request(urlMap.subject.loadTenantSubjectListByOrgId, {
          orgId: this.tenantId,
        }).then(res => {
          this.originTsSubjectList = res.data.pageList
          this.subjectList = convertListToTree(changeToTreeList(res.data.pageList, {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'}))
          this.tsSubjectDone = true
          this.setAsyncTsSubject()
        })
        // 查询病区
        request(buildingUrlMap.sickArea.pageList).then(res => {
          if (res.head.errCode === 0) {
            this.sickAreaList = res.data.pageList.map(item => ({
              sickAreaId: item.id,
              sickAreaCode: item.sickAreaCode,
              sickAreaName: item.sickAreaName,
            }))
          }
        })
        this.searchInfoTextOptions()
      },
      searchInfoTextOptions () {
        // 擅长详情的值集
        request(baseUrlMap.valueSet.getValueSetItemsForWeb, {setCode: 'THC_STAFF_INFOTEXT'}).then(res => {
          if (res.head.errCode === 0) {
            this.infoTextOptions = res.data.map(item => ({code: item.code, name: item.name}))
          }
        })
      },
      search () {
        request(urlMap.staff.load, {id: this.staffId}).then(res => {
          if (res.head.errCode === 0) {
            const staff = res.data
            this.staff = staff
            this.signed = !!staff.signAccountId
            this.searchDone = true
            this.setAsyncOrg()
            this.setAsyncDept()
            this.setAsyncTsOrg()
            this.setAsyncTsSubject()
            this.changeType({code: staff.typeCode})
            this.changeCard({code: staff.cardCode})
            if (isWarehouse()) {
              if (staff.orgId !== storage.getStorageByClinic('CLINICID')) {
                this.isOtherOrg = true
                this.setDisabled()
              }
            }
            const me = this
            if (staff.tsStaffFileDTOList && staff.tsStaffFileDTOList.length) {
              this.fileFormList = staff.tsStaffFileDTOList.map((item, index) => {
                return {
                  form: {
                    ...item,
                    fileType: {
                      code: item.fileTypeCode === '-1' ? '' : item.fileTypeCode,
                      name: item.fileTypeName === '-1' ? '' : item.fileTypeName,
                    },
                    fileTypeCode: item.fileTypeCode === '-1' ? '' : item.fileTypeCode,
                    fileTypeName: item.fileTypeName === '-1' ? '' : item.fileTypeName,
                    fileNo: item.fileNo === '-1' ? '' : item.fileNo,
                    certificateTime: item.certificateTime === '' ? '' : item.certificateTime,
                  },
                  schema: fileSchema,
                  index,
                  rules: fileRules,
                  fileId: item.fileId === '-1' ? '' : item.fileId,
                  uploadAttrs: {
                    accept: '.png,.jpeg,.jpg',
                    multiple: false,
                    limit: 1,
                    'file-list': item.fileId === '-1' || !item.fileId ? [] : [
                      {
                        name: `${item.fileTypeName === '-1' ? '证件' : item.fileTypeName}.jpg`,
                        url: item.fileId === '-1' || item.fileId === '' ? '' : `${this.$ever.fileUrl2}${item.fileId}`,
                      }
                    ],
                    'before-upload' (file) {
                      // 限制文件大小
                      if (file && file.size > 1024 * 1024) {
                        me.$messageTips(me, 'error', '文件大小限制1MB')
                        return false
                      }
                    },
                    'on-success' (res) {
                      if (res.head.errCode === 0) {
                        me.fileFormList.find(f => f.index === index).fileId = res.data.fileId
                        me.fileFormList.find(f => f.index === index).form.fileId = res.data.fileId
                      }
                    },
                    'on-remove' () {
                      me.fileFormList.find(f => f.index === index).fileId = ''
                      me.fileFormList.find(f => f.index === index).form.fileId = ''
                    },
                    'on-preview' (file) {
                      me.previewFile(file)
                    },
                  },
                }
              })
            }
            // 特殊权限赋值
            const staffPermission = {
              tsStaffPermission: [],
              tsStaffPermissionList: [],
              surgicalOperation: {},
            }
            if (staff.tsStaffPermissionDTOList && staff.tsStaffPermissionDTOList.length) {
              const surgicalOperation = staff.tsStaffPermissionDTOList.find(item => item.type1Code === '03')
              // 如果有手术级别
              if (surgicalOperation) {
                // 如果有特殊权限
                if (staff.tsStaffPermissionDTOList.length !== 1) {
                  staffPermission.tsStaffPermission = staff.tsStaffPermissionDTOList.filter(item => item.type1Code !== '03').map(item => [
                    item.type1Code, item.type2Code,
                  ])
                  staffPermission.tsStaffPermissionList = staff.tsStaffPermissionDTOList.filter(item => item.type1Code !== '03').map(item => [
                    {code: item.type1Code, name: item.type1Name},
                    {code: item.type2Code, name: item.type2Name},
                  ])
                }
                staffPermission.surgicalOperation = {
                  id: surgicalOperation.id,
                  code: surgicalOperation.type2Code,
                  name: surgicalOperation.type2Name
                }
              } else {
                staffPermission.tsStaffPermission = staff.tsStaffPermissionDTOList.map(item => [
                  item.type1Code, item.type2Code,
                ])
                staffPermission.tsStaffPermissionList = staff.tsStaffPermissionDTOList.map(item => [
                  {code: item.type1Code, name: item.type1Name},
                  {code: item.type2Code, name: item.type2Name},
                ])
              }
            }
            // 表单赋值
            Object.assign(this.form, staff, {
              type: {
                code: staff.typeCode,
                name: staff.typeName,
              },
              gender: {
                code: staff.genderCode,
                name: staff.genderName,
              },
              status: {
                code: staff.statusCode,
                name: staff.statusName,
              },
              enableStatus: staff.status,
              // servicesLanguage: {
              //   code: staff.servicesLanguageCode,
              //   name: staff.servicesLanguageName,
              // },
              // 技能职称
              skillsTitle: staff.skillsTitle2Code ? [
                staff.skillsTitle1Code, staff.skillsTitle2Code,
              ] : [], // 用于回显
              skillTitleList: staff.skillsTitle2Code ? [
                {code: staff.skillsTitle1Code, name: staff.skillsTitle1Name},
                {code: staff.skillsTitle2Code, name: staff.skillsTitle2Name},
              ] : [], // 用于保存时取值
              ...staffPermission,
              // 特殊权限
              // ...(staff.tsStaffPermissionDTOList && staff.tsStaffPermissionDTOList.length ? {
              //   tsStaffPermission: staff.tsStaffPermissionDTOList.map(item => [
              //     item.type1Code, item.type2Code,
              //   ]),
              //   tsStaffPermissionList: staff.tsStaffPermissionDTOList.map(item => [
              //     {code: item.type1Code, name: item.type1Name},
              //     {code: item.type2Code, name: item.type2Name},
              //   ]),
              // } : {
              //   tsStaffPermission: [],
              //   tsStaffPermissionList: [],
              // }),
              ageRange: {
                start: {year: (staff.ageMinPatient === 0 ? '0' : (staff.ageMinPatient || ''))},
                end: {year: (staff.ageMaxPatient === 0 ? '0' : (staff.ageMaxPatient || ''))},
              },
              recipePermissionValue: staff.recipePermission === 'Y',
            }, !staff.infoRemark ? {
              infoRemark: ''
            } : {}, !staff.infoPhoto ? {
              infoPhoto: ''
            } : {}, !staff.infoText ? {
              infoText: []
            } : {
              infoText: staff.infoText.split(',').map(itItem => ({code: itItem}))
            })
            if (this.form.servicesLanguageCode) {
              this.form.servicesLanguage = this.form.servicesLanguageCode.split(',').map((item, index) => {
                return {
                  code: item,
                  name: this.form.servicesLanguageName ? this.form.servicesLanguageName.split(',')[index] : '',
                }
              })
            }
            this.setAsyncStaffPermission()
            Object.assign(this.personalForm, {
              card: {
                code: staff.cardCode,
                name: staff.cardName,
              },
              birthday: staff.birthday,
              cardNumber: staff.cardNumber,
              email: staff.email,
            })
          }
        })
      },
      previewFile (file) {
        if (file.response && file.response.data) {
          window.open(`${this.$ever.fileUrl2}${file.response.data.fileId}`, '_blank')
        } else if (file.url) {
          window.open(`${file.url}`, '_blank')
        }
      },
      setAsyncOrg () {
        if (this.orgDone) {
          if (this.searchDone) {
            const crt = this.originOrgList.find(item => item._id === this.staff.orgId)
            if (crt) {
              const parentList = getAllParentById(changeToTreeList(this.originOrgList), crt.code)
              this.form.org = [ ...parentList.map(item => item._id), this.staff.orgId ]
              this.form.orgList = [ ...parentList, crt ]
            }
          } else {
            // 新增时给组织机构赋值
            if (isWarehouse()) {
              const orgId = storage.getStorageByClinic('CLINICID')
              const crt = this.originOrgList.find(item => item._id === orgId)
              if (crt) {
                const parentList = getAllParentById(changeToTreeList(this.originOrgList), crt.code)
                this.form.org = [ ...parentList.map(item => item._id), orgId ]
                this.form.orgList = [ ...parentList, crt ]
                this.searchDept(orgId)
              }
            }
          }
        }
      },
      setAsyncDept () {
        this.searchDept(this.staff.orgId, () => {
          const crt = this.originDeptList.find(item => item._id === this.staff.deptId)
          if (crt) {
            const parentList = getAllParentById(changeToTreeList(this.originDeptList, {label: 'deptName', id: 'deptCode', parentId: 'parentDeptCode'}), crt.deptCode)
            this.form.dept = [...parentList.map(item => item._id), this.staff.deptId]
            this.form.deptList = [...parentList, crt]
          }
        })
      },
      setAsyncTsOrg () {
        // setTimeout 时，若使用箭头函数，在谷歌断点中，me 指向的是window，使用传统函数，则 me 指向的是 vue
        const me = this
        setTimeout(function () {
          if (me.searchDone && me.tsOrgDone && me.staff.tsStaffOrganizationDTOList && me.staff.tsStaffOrganizationDTOList.length && me.originTsOrgList && me.originTsOrgList.length) {
            const listForTree = changeToTreeList(me.originTsOrgList)
            const objList = sortTreeListByIdList(listForTree, me.staff.tsStaffOrganizationDTOList.map(item => item.orgCode))
            me.form.tsOrgList = objList.map(tsOrg => {
              const parentList = getAllParentById(listForTree, tsOrg.code)
              return [...parentList, {code: tsOrg.code, name: tsOrg.name, _id: tsOrg.id}]
            })
            me.form.orgList = me.form.tsOrgList.map(tsOrgList => tsOrgList.map(item => item._id))
          }
        }, 300)
      },
      setAsyncTsSubject () {
        if (this.searchDone && this.tsSubjectDone && this.staff.tsStaffSubjectDTOList && this.staff.tsStaffSubjectDTOList.length) {
          const listForTree = changeToTreeList(this.originTsSubjectList, {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'})
          const objList = sortTreeListByIdList(listForTree, this.staff.tsStaffSubjectDTOList.map(item => item.tenantSubjectCode))
          this.form.tsSubjectList = objList.map(tsSubject => {
            const parentList = getAllParentById(listForTree, tsSubject.tenantSubjectCode)
            return [...parentList, {tenantSubjectCode: tsSubject.tenantSubjectCode, tenantSubjectName: tsSubject.tenantSubjectName, tenantSubjectId: tsSubject._id, _id: tsSubject._id}]
          })
          this.form.subjectList = this.form.tsSubjectList.map(tsSubjectList => tsSubjectList.map(item => item._id))
        }
      },
      doSave () {
        // 判断证件信息是否合法
        if (this.fileFormList.length === 1) {
          // const formItem = this.fileFormList[0]
          // if (formItem.form.fileId || (formItem.form.fileType && formItem.form.fileType.code) || formItem.form.fileNo) {
          //   if (!(formItem.form.fileType && formItem.form.fileType.code)) {
          //     this.$messageTips(this, 'error', '证件信息-证件类型必填')
          //     return
          //   }
          //   if (!formItem.form.fileNo) {
          //     this.$messageTips(this, 'error', '证件信息-证件号码必填')
          //     return
          //   }
          //   if (!formItem.form.fileId) {
          //     this.$messageTips(this, 'error', '证件信息-文件必填')
          //     return
          //   }
          // }
          // if ((formItem.form.fileType && formItem.form.fileType.code) || formItem.form.fileNo) {
          //   if (!(formItem.form.fileType && formItem.form.fileType.code)) {
          //     this.$messageTips(this, 'error', '证件信息-证件类型必填')
          //     return
          //   }
          //   if (!formItem.form.fileNo) {
          //     this.$messageTips(this, 'error', '证件信息-证件号码必填')
          //     return
          //   }
            // if (!formItem.form.fileId) {
            //   this.$messageTips(this, 'error', '证件信息-文件必填')
            //   return
            // }
          // }
        } else {
          // 有多个证件，则每条记录都得全部填写
          // const formItem = this.fileFormList.find(item => !(item.form.fileId && item.form.fileType && item.form.fileType.code && item.form.fileNo))
          // if (formItem) {
          //   if (!(formItem.form.fileType && formItem.form.fileType.code)) {
          //     this.$messageTips(this, 'error', '证件信息-证件类型必填')
          //     return
          //   }
          //   if (!formItem.form.fileNo) {
          //     this.$messageTips(this, 'error', '证件信息-证件号码必填')
          //     return
          //   }
          //   if (!formItem.form.fileId) {
          //     this.$messageTips(this, 'error', '证件信息-文件必填')
          //     return
          //   }
          // }
          // const formItem = this.fileFormList.find(item => !(item.form.fileType && item.form.fileType.code && item.form.fileNo))
          // if (formItem) {
          //   if (!(formItem.form.fileType && formItem.form.fileType.code)) {
          //     this.$messageTips(this, 'error', '证件信息-证件类型必填')
          //     return
          //   }
          //   if (!formItem.form.fileNo) {
          //     this.$messageTips(this, 'error', '证件信息-证件号码必填')
          //     return
          //   }
            // if (!formItem.form.fileId) {
            //   this.$messageTips(this, 'error', '证件信息-文件必填')
            //   return
            // }
          // }
        }
        // const idCard = this.fileFormList.find(item => item.form.fileTypeCode === '01')
        // if (idCard) {
        //   if (idCard.form.fileNo) {
        //     if (!regs.idCard.test(idCard.form.fileNo)) {
        //       // 设置出现错误
        //       this.$messageTips(this, 'error', '身份证证件号码填写不合格')
        //       return
        //     }
        //   }
        // }
        const params = Object.assign({}, this.form, this.personalForm)
        // 判断身份证号是否符合要求
        if (params.card.code === '01' && params.cardNumber) {
          if (!regs.idCard.test(params.cardNumber)) {
            // 设置出现错误
            this.$messageTips(this, 'error', '身份证号码填写不合格')
            return
          }
        }
        if (params.type) {
          params.typeCode = params.type.code
          params.typeName = params.type.name
        }
        if (params.gender) {
          params.genderCode = params.gender.code
          params.genderName = params.gender.name
        }
        if (params.status) {
          params.statusCode = params.status.code
          params.statusName = params.status.name
        }
        if (params.card) {
          params.cardCode = params.card.code
          params.cardName = params.card.name
        }
        // if (params.servicesLanguage) {
        //   params.servicesLanguageCode = params.servicesLanguage.code
        //   params.servicesLanguageName = params.servicesLanguage.name
        // }
        if (params.dept && params.dept.length) {
          params.deptId = params.dept[params.dept.length - 1]
        } else {
          params.deptId = ''
        }
        if (params.org && params.org.length) {
          params.orgId = params.org[params.org.length - 1]
        }
        if (params.skillTitleList && params.skillTitleList.length === 2) {
          params.skillsTitle1Code = params.skillTitleList[0].code
          params.skillsTitle1Name = params.skillTitleList[0].name
          params.skillsTitle2Code = params.skillTitleList[1].code
          params.skillsTitle2Name = params.skillTitleList[1].name
        }
        if (!params.recipePermissionValue) {
          params.tsStaffPermission = []
          params.tsStaffPermissionList = []
        }
        let surgicalOperation = []
        if (params.surgicalOperation && params.surgicalOperation.code) {
          surgicalOperation = [
            [
              { 'id': '03', 'code': '03', 'name': '手术级别' },
              params.surgicalOperation
            ]
          ]
        }
        params.tsStaffPermissionList = (params.tsStaffPermissionList || []).concat(surgicalOperation)
        if (params.tsStaffPermissionList && params.tsStaffPermissionList.length) {
          params.tsStaffPermissionDTOList = params.tsStaffPermissionList.map(item => {
            return {
              type1Code: item[0].code,
              type1Name: item[0].name,
              type2Code: item[1].code,
              type2Name: item[1].name,
            }
          })
        } else {
          params.tsStaffPermissionDTOList = []
        }
        // 执业机构
        params.tsStaffOrganizationDTOList = params.tsOrgList.map(item => {
          item = item[item.length - 1]
          return {
            orgId: item._id,
            orgCode: item.code,
            orgName: item.name,
          }
        })
        // 执业科室
        params.tsStaffSubjectDTOList = params.tsSubjectList.map(item => {
          item = item[item.length - 1]
          return {
            tenantSubjectId: item._id,
            tenantSubjectCode: item.tenantSubjectCode,
            tenantSubjectName: item.tenantSubjectName,
          }
        })
        params.ageMinPatient = params.ageRange.start.year
        params.ageMaxPatient = params.ageRange.end.year
        if (typeof params.ageMinPatient === 'number' && typeof params.ageMaxPatient === 'number') {
          if (params.ageMaxPatient < params.ageMinPatient) {
            // 提示接诊年龄限制填写不合格
            this.$messageTips(this, 'error', '最大年龄必须大于等于最小年龄')
            return
          }
        }
        if (params.infoText && params.infoText.length) {
          params.infoText = params.infoText.map(item => {
            if (item.code) {
              return item.code
            } else {
              const creating = this.creatingInfoTextList.find(c => c.name === item)
              if (creating) {
                return creating.code
              }
            }
            return ''
          }).filter(item => !!item).join()
        } else {
          params.infoText = ''
        }
        // params.infoRemark = this.$refs.htmlEditor2.getHtml()
        params.infoPhoto = this.$refs.htmlEditor3.getHtml()
        params.birthday = params.birthday ? dateFormat(params.birthday, 'YYYY-MM-DD') : ''
        // if (params.servicesLanguage && params.servicesLanguage.length) {
        //   params.servicesLanguageCode = JSON.stringify(params.servicesLanguage.map(item => ({
        //     code: item.code,
        //     name: item.name
        //   })))
        // } else {
        //   params.servicesLanguageCode = JSON.stringify([])
        // }
        // 只要没有填写证件类型，证件编号，则该条记录会被过滤掉
        params.tsStaffFileDTOList = this.fileFormList.filter(item => !(!item.form.fileType.code && !item.form.fileType.name && !item.form.fileNo)).map(item => {
          return {
            fileId: item.fileId || '-1',
            fileTypeCode: item.form.fileType.code || '-1',
            fileTypeName: item.form.fileType.name || '-1',
            fileNo: item.form.fileNo || '-1',
            certificateTime: item.form.certificateTime ? dateFormat(item.form.certificateTime) : ''
          }
        })
        params.recipePermission = params.recipePermissionValue ? 'Y' : 'N'

        if (params.servicesLanguage && params.servicesLanguage.length) {
          params.servicesLanguageCode = params.servicesLanguage.map(item => item.code).join()
          params.servicesLanguageName = params.servicesLanguage.map(item => item.name).join()
        } else {
          params.servicesLanguageCode = ''
          params.servicesLanguageName = ''
        }
        params.status = params.enableStatus
        // 删除多余的参数
        delete params.servicesLanguage
        delete params.type
        delete params.gender
        delete params.enableStatus
        delete params.dept
        delete params.org
        delete params.deptList
        delete params.orgList
        delete params.subjectList
        delete params.skillTitleList
        delete params.skillsTitle
        delete params.tsStaffPermissionList
        delete params.tsStaffPermission
        delete params.tsOrgList
        delete params.tsSubjectList
        delete params.titleBaseInfo
        delete params.titlePracticeInfo
        delete params.titlePrescriptionInfo
        delete params.titleOtherInfo
        delete params.ageRange
        delete params.card
        // delete params.text
        delete params.servicesLanguage
        request(urlMap.staff[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            // this.$router.push({name: 'org-staff'})
            window.history.back()
          }
        })
      },
      save () {
        // 必填校验
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.$refs.personalForm.$refs.form.validate(pValid => {
              if (pValid) {
                this.doSave()
              }
            })
          }
        })
      },
      searchDept (orgId, cb) {
        this.loadingDept = true
        request(urlMap.dept.pageList, {orgId: orgId}).then(res => {
          if (res.head.errCode === 0) {
            this.originDeptList = res.data.pageList
            this.deptOptions = convertListToTree(changeToTreeList(res.data.pageList, {label: 'deptName', id: 'deptCode', parentId: 'parentDeptCode'}))
            if (cb) {
              cb.apply(this)
            }
          }
          this.loadingDept = false
        })
      },
      // 选择机构之后，需要根据机构查询部门
      changeOrg (value) {
        if (!value) return
        this.form.dept = []
        this.searchDept(value[value.length - 1])
      },
      changeMulOrg (value) {
        if (!value) return
        this.form.tsOrgList = value.map(item => item.map(id => this.originTsOrgList.find(s => s._id === id)))
      },
      changeMulSubject (value) {
        if (!value) return
        this.form.tsSubjectList = value.map(item => item.map(id => this.originTsSubjectList.find(s => s._id === id)))
      },
      skillsTitleChange (value) {
        this.form.skillTitleList = value
      },
      tsStaffPermissionChange (value) {
        this.form.tsStaffPermissionList = value
      },
      delPhoto (e) {
        this.enterClose = false
        this.enterImg = false
        this.form.photo = ''
        this.uploadAttrs.fileList = []
        e.stopPropagation()
      },
      viewPhoto (e) {
        this.dialogVisible = true
        this.dialogImageUrl = this.$ever.fileUrl2 + this.form.photo
        e.stopPropagation()
      },
      getCrtPath () {
        return getCrtPath()
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
                me.fileFormList.find(item => item.index === index).form.fileId = res.data.fileId
              }
            },
            'on-remove' () {
              me.fileFormList.find(item => item.index === index).fileId = ''
              me.fileFormList.find(item => item.index === index).form.fileId = ''
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
      changeRecipePermissionValue (value) {
        // this.form.tsStaffPermission = []
        // this.form.tsStaffPermissionList = []
      },
      changeType (value) {
        if (value && value.code) {
          if (value.code === 'DOCTOR') {
            this.schema.find(item => item.name === 'ageRange').parentClass = ''
            this.schema.find(item => item.name === 'recipePermissionValue').parentClass = ''
            this.schema.find(item => item.name === 'tsStaffPermission').parentClass = ''
            this.schema.find(item => item.name === 'surgicalOperation').parentClass = ''
            this.schema.find(item => item.name === 'appointmentNote').parentClass = ''
            this.schema.find(item => item.name === 'appointmentRemind').parentClass = ''
            this.schema.find(item => item.name === 'infoText').parentClass = ''
            this.schema.find(item => item.name === 'infoRemark').parentClass = ''
          } else {
            this.schema.find(item => item.name === 'ageRange').parentClass = 'dn'
            this.schema.find(item => item.name === 'recipePermissionValue').parentClass = 'dn'
            this.schema.find(item => item.name === 'tsStaffPermission').parentClass = 'dn'
            this.schema.find(item => item.name === 'surgicalOperation').parentClass = 'dn'
            this.schema.find(item => item.name === 'appointmentNote').parentClass = 'dn'
            this.schema.find(item => item.name === 'appointmentRemind').parentClass = 'dn'
            this.schema.find(item => item.name === 'infoText').parentClass = 'dn'
            this.schema.find(item => item.name === 'infoRemark').parentClass = 'dn'
          }
        }
      },
      changeCard (card) {
        if (card) {
          if (card.code === '01') {
            this.personalRules = {
              ...this.personalRules,
              cardNumber: [
                {
                  pattern: regs.idCard, message: '请输入正确的身份证号', trigger: 'change'
                }
              ]
            }
          } else {
            this.personalRules = {
              ...this.personalRules,
              cardNumber: []
            }
          }
        }
        // 切换时清空校验信息
        this.$refs.personalForm.$refs.form.clearValidate('cardNumber')
      },
      changeInfoText (val) {
        // 每次改变值时，对比出哪些数据是需要新加的数据
        const newItemList = val.filter(v => !v.code && !this.creatingInfoTextList.some(item => item.name === v))
        if (newItemList.length) {
          Promise.all(newItemList.map(item => {
            const uuCode = U()
            this.creatingInfoTextList.push({code: uuCode, name: item})
            return request(baseUrlMap.valueSet.createValueSetItem, {
              name: item,
              code: uuCode,
              setCode: 'THC_STAFF_INFOTEXT',
            })
          })).then(resList => {
            if (resList.every(res => res.head.errCode === 0)) {
              // 新的擅长详情静默创建成功，没有提示
            }
          })
        }
      },
      getStaffPermissionOptions (options) {
        this.staffPermissionOptions = options
        this.setAsyncStaffPermission()
      },
      setAsyncStaffPermission () {
        if (this.form.tsStaffPermission.length !== 0 && this.staffPermissionOptions.length !== 0) {
          // 根据树状数据，对 tsStaffPermissionDTOList 进行排序
          // console.log(this.staffPermissionOptions, '人员权限 原数据')
          // console.log(this.form.tsStaffPermission, '人员权限 要回显的数据')
          const sortedList = []
          for (let i = 0; i < this.staffPermissionOptions.length; i++) {
            const parent = this.staffPermissionOptions[i]
            if (parent.children && parent.children.length) {
              for (let j = 0; j < parent.children.length; j++) {
                const child = parent.children[j]
                this.form.tsStaffPermission.forEach(item => {
                  if (item[1] === child.id) {
                    sortedList.push(item)
                  }
                })
              }
            }
          }
          this.form.tsStaffPermission = sortedList
          // console.log(this.form.tsStaffPermission, '人员权限 要回显的数据 排完序后')
        }
      }
    },
  }
</script>
<style scoped lang="less">
  .signed {
    color: #efad1b;
  }
  .un-signed {
    color: #DD4A68;
  }
</style>
