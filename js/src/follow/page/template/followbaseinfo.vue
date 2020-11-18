<template>
  <div class="follow-base-info">
    <!-- 模板信息tplFormModel -->
    <el-aside
      class="no-box-sha common-el common-no-border common-auto-header-height bgc-dark"
      width="380px"
    >
      <div class="common-box common-no-border-left">
        <div class="common-header">
          <span>模板信息</span>
          <el-button
            v-if="pagePattern === pattern.VIEW && !templateStatus && (isShow ? $hasPermission('Auth_menu_follow_settings') : true)"
            type="text"
            @click="changeBtn(pattern.EDIT)"
          >编辑</el-button>
          <el-button
            v-if="pagePattern === pattern.EDIT || pagePattern === pattern.CREATE"
            type="text"
            @click="saveinfo"
            :loading="saveLoading"
          >保存</el-button>
        </div>
        <div class="common-content">
          <ever-form2
            class="gray-label-form"
            v-model="tplFormModel"
            ref="tplForm"
            labelWidth="100px"
            :schema="tplSchema"
            :nosubmit="true"
            :rules="tplRules"
          >
            <template slot="categoryList">
              <el-cascader
                class="w"
                placeholder="输入分类名称可搜索..."
                :options="categoryCascaderList"
                v-model="tplFormModel.categoryList"
                filterable
              ></el-cascader>
            </template>
            <template slot="deptIsAll">
              <el-switch v-model="tplFormModel.deptIsAll" @change="changeDeptIsAll"></el-switch>
            </template>
            <template slot="deptList">
              <el-select
                class="w"
                v-model="tplFormModel.deptList"
                multiple
                filterable
                clearable
                value-key="id"
                reserve-keyword
                placeholder="请输入关键词"
              >
                <el-option
                  v-for="item in deptOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </template>
            <template slot="jobCreateTypeId">
              <el-radio-group v-model="tplFormModel.jobCreateTypeId">
                <el-radio
                  v-for="item in jobCreateTypeList"
                  :key="item.id"
                  :label="item.id"
                >{{item.name}}</el-radio>
              </el-radio-group>
            </template>
            <template slot="isSystem">
              <el-radio-group v-model="tplFormModel.isSystem">
                <el-radio
                  v-for="item in isSystemList"
                  :key="item.id"
                  :label="item.id"
                >{{item.name}}</el-radio>
              </el-radio-group>
            </template>
          </ever-form2>
        </div>
      </div>
      <!-- 适用患者patientFormModel -->
      <div class="common-box common-no-border-left">
        <div class="common-header common-border-top">
          <span>适用患者</span>
          <el-button 
            v-if="filedLength < 10 && pagePattern === pattern.VIEW && !templateStatus && (isShow ? $hasPermission('Auth_menu_follow_settings') : true)"
            size="mini" @click="showDialog(false)" type="text">
            <i class="iconfont icon-tianjia1 f12"></i>
            添加条件
          </el-button>
        </div>
        <div class="common-content">
          <!-- <custom-form ref="baseform" :templateId="templateId"></custom-form> -->
          <filed-baseinfo 
            ref="baseinfo" 
            :templateId="templateId" 
            @showDetail="showDetail"
            @showLength="showLength" 
            :showBtn="pagePattern === pattern.VIEW && !templateStatus && (isShow ? $hasPermission('Auth_menu_follow_settings') : true)">
          </filed-baseinfo>
        </div>
      </div>
    </el-aside>
    <dialog-setting ref="setting" :templateData="templateData" :echoData="echoData" @update="update"></dialog-setting>
  </div>
</template>
<script>
import { genderList, userTypeList, jobCreateTypeList, isSystemList, pattern, pattern2 } from '@/follow/util/model'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { debounce1 as debounce } from '@/util/common'
import { getAllParent, getNodeByValue, transferSchema, validateSpace } from '@/follow/util/fn'
import '@/follow/util/filters'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
// import organUrlMap from '@/manages/page/organization/utils/urls'
// import storage from '@/util/storage'
import filedBaseinfo from './filedbaseinfo.vue'
import dialogSetting from './dialog.setting.vue'
import eopApi from '@/csa/store/eop.js'
export default {
  components: {
    dialogSetting,
    filedBaseinfo
  },
  props: ['id', 'isEdit', 'categoryCascaderList', 'isShow'],
  data () {
    const tplSchema = [
      {
        name: 'name',
        label: '模板名称',
      },
      {
        name: 'description',
        label: '模板说明',
        comp: 'textarea',
      },
      // {
      //   name: 'categoryList',
      //   label: '模板分类',
      //   comp: 'custom',
      //   props: {
      //     filter: 'filterCategoryObj',
      //   },
      // },
      {
        name: 'deptIsAll',
        label: '适用全部科室',
        comp: 'custom',
        props: {
          filter: 'filterCommonBoolean',
        },
      },
      {
        name: 'deptList',
        label: '适用所选科室',
        comp: 'custom',
        props: {
          filter: 'filterMultipleInlineList',
        },
      },
      {
        name: 'jobCreateTypeId',
        label: '模板审核方式',
        comp: 'custom',
        props: {
          filter: 'filterJobCreateType',
        },
      },
      {
        name: 'isSystem',
        label: '模板启动方式',
        comp: 'custom',
        props: {
          filter: 'filterIsSystem',
        },
      }
    ]
    const tplFormModel = this.$ever.createObjFromSchema(tplSchema)
    const tplRules = {
      categoryList: [{ required: true, message: '必填项', trigger: 'change' }],
      name: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 40, message: '请输入2-40个字符', trigger: 'change' },
      ],
      description: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 100, message: '请输入2-100个字符', trigger: 'change' },
      ],
      deptList: [{ required: false, message: '必填项', trigger: ['blur', 'change'] }],
    }
    // 模板状态初始值
    tplFormModel.status = true
    tplFormModel.categoryList = []
    tplFormModel.categoryObjList = []
    tplFormModel.deptIsAll = true
    // 初始化时隐藏 deptList
    tplSchema.find(item => item.name === 'deptList').parentClass = 'dn'
    tplFormModel.jobCreateTypeId = 0
    const patientSchema = [
      {
        name: 'ageRange',
        label: '年龄',
        comp: 'custom',
        props: {
          filter: 'filterAgeRange',
        },
      },
      {
        name: 'genderId',
        label: '性别',
        comp: 'select',
        props: {
          options: genderList,
          filter: 'filterGenderId',
        },
      },
      {
        name: 'userType',
        label: '用户类型',
        comp: 'custom',
        props: {
          options: userTypeList,
          filter: 'filterUserType',
        },
      },
      {
        name: 'diagnosisList',
        label: '诊断',
        comp: 'custom',
        props: {
          filter: 'filterMultipleList',
        },
      },
      {
        name: 'doctorAdviceList',
        label: '医嘱',
        comp: 'custom',
        props: {
          filter: 'filterMultipleList',
        },
      }
    ]
    const patientFormModel = this.$ever.createObjFromSchema(patientSchema)
    patientFormModel.ageRange = {
      start: {
        year: 0,
        month: 0
      },
      end: {
        year: 130,
        month: 0
      }
    }
    patientFormModel.genderId = 0
    patientFormModel.diagnosisList = []
    patientFormModel.doctorAdviceList = []
    return {
      baseInfoId: '',
      templateId: this.$route.params.id,
      templateStatus: 1,
      pagePattern: pattern.VIEW, // 当前页面的模式
      pagePattern2: pattern2.VIEW, // 当前页面的模式
      patientFormModel,
      patientSchema,
      tplFormModel,
      templateObj: [],
      tplSchema,
      tplRules,
      pattern,
      pattern2,
      params: {
        baseInfoId: '',
        categoryCascaderList: []
      },
      jobCreateTypeList,
      saveLoading: false,
      deptOptions: [], // 科室数据
      diagnosisListLoading: false, // 诊断搜索框的加载效果
      diagnosisOptions: [], // 诊断搜索框的加载结果
      doctorAdviceListLoading: false, // 医嘱搜索框的加载效果
      doctorAdviceOptions: [], // 医嘱搜索框的加载结果
      isSystemList,
      templateData: {},
      filedData: {},
      echoData: {},
      type: 0,
      doctorId: '',
      filedLength: 0,
      categoryObj: {
        name: 'categoryList',
        label: '模板分类',
        comp: 'custom',
        parentClass: 'small-margin-parent',
        props: {
          filter: 'filterCategoryObj',
        }
      }
    }
  },
  watch: {
    'isEdit': {
      handler (val) {
        this.templateStatus = val
      }
    },
    'baseInfoId': {
      handler (val) {
        if (val) {
          this.params.baseInfoId = val
        } else {
          this.params.baseInfoId = ''
        }
      }
    },
    'categoryCascaderList': {
      handler (val) {
        if (val) {
          this.params.categoryCascaderList = val
        } else {
          this.params.categoryCascaderList = []
        }
      },
      deep: true
    },
    'params': {
      handler (val) {
        if (val.baseInfoId && val.categoryCascaderList) {
          this.reSearchCategoryList(val.baseInfoId)
        }
      },
      deep: true
    }
  },
  created () {
    if (this.$route.path.includes('personaltemplate/detail')) {
      this.type = 1
      this.doctorId = localStorage.getItem('USERID')
      this.tplSchema = [...this.tplSchema.filter(item => item.name !== 'categoryList')]
      this.tplRules.categoryList[0].required = false
    } else {
      this.type = 0
      this.doctorId = ''
      if (!this.tplSchema.some(item => item.name === 'categoryList')) {
        this.tplSchema.splice(2, 0, this.categoryObj)
        this.tplRules.categoryList[0].required = true
      }
    }
    this.getDeptOptions()
    this.getDetailById()
    this.templateId = this.$route.params.id
  },
  methods: {
    transferSchema (_schema, formModel, toView = false) {
      if (formModel === 'tplFormModel' && this.type === 0) {
        const categoryListItem = _schema.find(item => item.name === 'categoryList' || item.originName === 'categoryList')
        categoryListItem.originName = 'categoryList'
        if (toView) {
          categoryListItem.name = 'categoryObjList'
        } else {
          categoryListItem.name = 'categoryList'
        }
      }
      return transferSchema(_schema, toView)
    },
    async getDetailById () {
      if (this.templateId) {
        const template = await request(urlMap.follow.template.detailById, { id: this.templateId })
        this.templateObj = template.data
        // 模板基本信息
        this.tplFormModel.status = !!this.templateObj.baseInfo.status
        this.templateSearched = true
        this.baseInfoId = this.templateObj.baseInfo.categoryId
        this.tplFormModel.name = this.templateObj.baseInfo.name
        this.tplFormModel.description = this.templateObj.baseInfo.description
        this.tplFormModel.deptIsAll = this.templateObj.baseInfo.deptIsAll
        this.tplSchema.find(item => item.name === 'deptList').parentClass = this.templateObj.baseInfo.deptIsAll ? 'dn' : ''
        this.tplFormModel.deptList = this.templateObj.baseInfo.deptList || []
        this.tplFormModel.jobCreateTypeId = this.templateObj.baseInfo.jobCreateTypeId
        this.tplFormModel.isSystem = this.templateObj.baseInfo.isSystem
        // 患者信息
        const startYear = Math.floor(this.templateObj.baseInfo.ageMin / 12)
        const startMonth = this.templateObj.baseInfo.ageMin - startYear * 12
        const endYear = Math.floor(this.templateObj.baseInfo.ageMax / 12)
        const endMonth = this.templateObj.baseInfo.ageMax - endYear * 12
        this.patientFormModel.ageRange = {
          start: {
            year: startYear,
            month: startMonth
          },
          end: {
            year: endYear,
            month: endMonth
          }
        }
        this.patientFormModel.diagnosisList = this.templateObj.baseInfo.diagnosisList || []
        this.patientFormModel.doctorAdviceList = this.templateObj.baseInfo.doctorAdviceList || []
        // 给list选项赋值
        this.diagnosisOptions = this.templateObj.baseInfo.diagnosisList || []
        this.doctorAdviceOptions = this.templateObj.baseInfo.doctorAdviceList || []
        this.patientFormModel.genderId = this.templateObj.baseInfo.genderId
        this.patientFormModel.userType = this.templateObj.baseInfo.userType
        // 查询模式 患者信息，模板信息都是只读状态
        this.patientSchema = this.transferSchema(this.patientSchema, 'patientFormModel', true)
        this.tplSchema = this.transferSchema(this.tplSchema, 'tplFormModel', true)
        this.templateStatus = this.templateObj.baseInfo.status
        this.$emit('updateBaseInfo', template.data)
      }
    },
    // 当分类id和分类树都查询完成之后 递归查找分类id
    reSearchCategoryList (categoryId) {
      const node = getNodeByValue(this.categoryCascaderList, categoryId)
      if (node) {
        this.tplFormModel.categoryList = [...(getAllParent(node).map(item => item.id)), categoryId]
        this.tplFormModel.categoryObjList = [...getAllParent(node), node]
      } else {
        this.tplFormModel.categoryList = [] // 出现异常
        this.tplFormModel.categoryObjList = []
      }
    },
    changeBtn (_pattern) {
      if (this.pagePattern2 === pattern2.EDIT) {
        this.$confirm('您的适用患者部分尚未保存，是否确定离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.pagePattern2 = pattern2.VIEW
          this.patientSchema = this.transferSchema(this.patientSchema, 'patientFormModel', true)
        })
      } else {
        // 切换成编辑模式
        if (_pattern === pattern.EDIT) {
          this.pagePattern = _pattern
          // 切换为编辑时给list选项赋值
          // 表单均切换成编辑模式
          this.tplSchema = this.transferSchema(this.tplSchema, 'tplFormModel', false)
        } else {
          // 切换成查看模式
          // this.search()
        }
      }
    },
    changeBtn2 (_pattern) {
      // 切换成编辑模式
      if (this.pagePattern === pattern.EDIT) {
        this.$confirm('您的模板信息部分尚未保存，是否确定离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.pagePattern = pattern.VIEW
          this.tplSchema = this.transferSchema(this.tplSchema, 'tplFormModel', true)
        })
      } else {
        if (_pattern === pattern2.EDIT) {
          this.pagePattern2 = _pattern
          // 切换为编辑时给list选项赋值
          this.diagnosisOptions = this.patientFormModel.diagnosisList || []
          this.doctorAdviceOptions = this.patientFormModel.doctorAdviceList || []
          // 表单均切换成编辑模式
          // this.transferAllSchema(false)
          this.patientSchema = this.transferSchema(this.patientSchema, 'patientFormModel', false)
        } else {
          // 切换成查看模式1
          // this.search()
        }
      }
    },
    // 更新模板信息
    saveinfo: debounce(function () {
      // 开始校验数据
      this.$refs.tplForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        // 拼接保存入参
        const params = {
          id: this.templateId,
          categoryId: this.type ? '' : this.tplFormModel.categoryList[this.tplFormModel.categoryList.length - 1],
          name: this.tplFormModel.name,
          description: this.tplFormModel.description,
          deptIsAll: this.tplFormModel.deptIsAll,
          deptList: this.tplFormModel.deptList,
          jobCreateTypeId: this.tplFormModel.jobCreateTypeId,
          isSystem: this.tplFormModel.isSystem,
          // 其他
          isOrg: false, // 机构工作站还是集团工作站,如果是在集团工作站新建和编辑，该值为false，如果在机构工作站新建编辑，该值为true，一期只能由集团创建
        }
        this.saveLoading = true
        request(urlMap.follow.template.modify, params).then(res => {
          this.saveLoading = false
          if (res.head.errCode === 0) {
            this.templateId = res.data
            this.$messageTips(this, 'success', '保存成功!')
            this.pagePattern = pattern.VIEW
            this.transferAllSchema(true)
          }
        })
      })
    }, 200),
    transferAllSchema (toView = false) {
      this.patientSchema = this.transferSchema(this.patientSchema, 'patientFormModel', toView) // 适用患者
      this.tplSchema = this.transferSchema(this.tplSchema, 'tplFormModel', toView) // 模板信息
    }, // 增加子任务
    // 更新适用患者
    savepatients: debounce(function () {
      // 开始校验数据
      this.$refs.tplForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        // 年龄范围校验
        const ageMax = (this.patientFormModel.ageRange.end.month || 0) + (this.patientFormModel.ageRange.end.year || 0) * 12
        const ageMin = (this.patientFormModel.ageRange.start.month || 0) + (this.patientFormModel.ageRange.start.year || 0) * 12
        if (ageMax <= ageMin) {
          this.$messageTips(this, 'error', '请填写正确的年龄范围!')
          return
        }
        // 拼接保存入参
        const params = {
          ageMax,
          ageMin,
          id: this.templateId,
          diagnosisIsAll: !this.patientFormModel.diagnosisList.length,
          diagnosisList: this.patientFormModel.diagnosisList || [],
          doctorAdviceIsAll: !this.patientFormModel.doctorAdviceList.length,
          doctorAdviceList: this.patientFormModel.doctorAdviceList || [],
          genderId: this.patientFormModel.genderId,
          userType: this.patientFormModel.userType
        }
        this.saveLoading = true
        request(urlMap.follow.template.updateScope, params).then(res => {
          this.saveLoading = false
          if (res.head.errCode === 0) {
            this.templateId = res.data
            this.$messageTips(this, 'success', '保存成功!')
            // 加上id，当刷新页面时保持查看状态
            this.pagePattern2 = pattern2.VIEW
            // 表单转化为查看状态
            this.transferAllSchema(true)
            // 直接跳转到模板列表
            // this.$router.push(getRootRoute.bind(this)() + '/follow/template')
          }
        })
      })
    }, 200),
    // 远程搜索诊断
    searchDiagnosisList: debounce(function (query) {
      if (query !== '') {
        this.diagnosisListLoading = true
        request(urlMap.searchDiagnose, { name: query }, 'get').then(res => {
          this.diagnosisListLoading = false
          if (res.head.errCode === 0) {
            this.diagnosisOptions = this.patientFormModel.diagnosisList || []
            let resultList = res.data.resultList.map(item => ({
              id: item.diseaseCode,
              name: item.diseaseName,
            }))
            let diagnosisOptions1 = resultList.filter(item => !this.diagnosisOptions.some(ele => ele.id === item.id))
            this.diagnosisOptions = [...this.diagnosisOptions, ...diagnosisOptions1]
          }
        })
      }
    }, 200),
    // 远程搜索医嘱
    searchDoctorAdviceList: debounce(function (query) {
      if (query !== '') {
        this.doctorAdviceListLoading = true
        request(urlMap.searchForBrowser, {
          name: query,
          scene: 1, // 【卓正】只有门诊，如果有住院，这里需要再沟通接口
          pagesize: 20,
          offset: 0,
        }).then(res => {
          this.doctorAdviceListLoading = false
          if (res.head.errCode === 0) {
            if (res.data && res.data.map) {
              this.doctorAdviceOptions = this.patientFormModel.doctorAdviceList || []
              let resultList = res.data.map(item => ({
                id: item.id,
                name: item.name,
              }))
              let doctorAdviceOptions1 = resultList.filter(item => !this.doctorAdviceOptions.some(ele => ele.id === item.id))
              this.doctorAdviceOptions = [...this.doctorAdviceOptions, ...doctorAdviceOptions1]
            } else {
              this.doctorAdviceOptions = []
            }
          }
        })
      }
    }, 200),
    // 切换dept is all
    changeDeptIsAll (value) {
      // 改变deptList 的显示隐藏
      this.tplSchema.find(item => item.name === 'deptList').parentClass = value ? 'dn' : ''
      // 改变deptList 的是否必填
      this.tplRules.deptList[0].required = !value
    },
    // getDeptOptions () {
    //   request(organUrlMap.subject.loadTenantSubjectListByOrgId, {orgId: storage.getLocalStorage('TENANTID')}).then(res => {
    //     if (res.head.errCode === 0) {
    //       this.deptOptions = res.data && res.data.pageList ? res.data.pageList.filter(item => !!item).map(item => ({ id: item.orgSubjectCode, name: item.orgSubjectName })) : []
    //     }
    //   })
    // },
    getDeptOptions () {
      eopApi.getTenantSubjectListByCondition({
        orgIdList: [],
        status: 'Y'
      })
        .then(res => {
          if (res.data && res.data.resultList) {
            this.deptOptions = res.data.resultList.map(item => {
              return {
                id: item.tenantSubjectCode,
                name: item.tenantSubjectName
              }
            })
          }
        })
    },
    showDialog (val) {
      this.templateData = {
        templateId: this.templateId,
        templateName: this.tplFormModel.name
      }
      this.$refs.setting.open(val)
      this.echoData = !val && {}
    },
    update () {
      this.$refs.baseinfo._setFormInitData()
    },
    showDetail (val) {
      this.showDialog(true)
      this.echoData = val
    },
    showLength (val) {
      this.filedLength = val
    }
  }
}
</script>
<style scoped>
.common-box {
  border: none !important;
}
.el-select {
  width: calc(100% - 50px);
}
.follow-base-info .el-radio{margin-right: 12px;}
</style>
