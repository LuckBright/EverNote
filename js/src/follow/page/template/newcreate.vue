<template>
  <div class="common-inner">
     <el-container>
      <el-main class="common-el common-no-border-top">
        <div class="wrap">
          <el-container class="bgc-fff">
            <div class="common-box common-no-border common-border-right common-border-bottom">
              <div class="common-header">
                <span class="common-text">创建模板</span>
              </div>
              <div class="common-content small-padding-left">
                <ever-form2
                  class="gray-label-form tplForm"
                  v-model="tplFormModel"
                  ref="tplForm"
                  label-position="right"
                  labelWidth="150px"
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
                      :props="{ checkStrictly: true }"
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
          </el-container>
          <div class="btn-warp">
            <el-button type="primary" size="small" class="btn-create" @click="save">创建模板</el-button>
            <el-button class="btn-cancel" size="small" @click="cancel">取消</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ageRangePicker from '@/components/agerangepicker'
import agePicker from '@/components/agepicker'
import westernMedicineList from '@/follow/components/western-medicine-list'
import bmi from '@/follow/components/bmi'
import shortFollowSyscode from '../../components/shortfollowsyscode'
import { genderList, jobCreateTypeList, isSystemList, diseaseGroup, pattern, pattern2 } from '@/follow/util/model'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { debounce1 as debounce } from '@/util/common'
import eopApi from '@/csa/store/eop.js'
import {
  convertListToTree,
  getRootRoute,
  validateSpace
} from '@/follow/util/fn'
import '@/follow/util/filters'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'

export default {
  // todo 如何解决页面先显示可输入状态，后显示不可输入状态的问题
  async created () {
    if (this.isPerson === 0) {
      this.type = 0
      this.doctorId = ''
      if (!this.tplSchema.some(item => item.name === 'categoryList')) {
        this.tplSchema.splice(2, 0, this.categoryObj)
        this.tplRules.categoryList[0].required = true
      }
    } else {
      this.type = 1
      this.doctorId = localStorage.getItem('USERID')
      this.tplSchema = [...this.tplSchema.filter(item => item.name !== 'categoryList')]
      this.tplRules.categoryList[0].required = false
    }
    const routeCategoryId = this.$route.params.categoryId
    // 加载科室数据
    this.getDeptOptions()
    // 获取模板分类
    request(urlMap.follow.syscode.findByTypeId, { typeId: 5 }).then(res => {
      if (res.head.errCode === 0) {
        this.categoryCascaderList = convertListToTree((res.data || []).map(item => ({
          ...item, value: item.id, label: item.name,
        })))
        this.categoryListSearched = true
        if (this.templateSearched && this.templateObj.baseInfo && this.templateObj.baseInfo.categoryId) {
          this.reSearchCategoryList(this.templateObj.baseInfo.categoryId)
        }
        if (routeCategoryId) {
          // 创建模板时需要关联出当前分类【点击创建模板时，选中的左侧分类】
          this.reSearchCategoryList(routeCategoryId)
        }
      }
    })
    this.templateId = this.$route.params.id
    if (this.templateId && this.templateId !== '-1') {
      this.pagePattern = pattern.VIEW // 查看
      // 查询模板信息
      this.search()
    } else {
      this.pagePattern = pattern.CREATE // 创建
    }
  },
  mounted () {
  },
  props: ['isOpen', 'isPerson'], // isPerson 是否是个人新建模板
  components: { ageRangePicker, agePicker, shortFollowSyscode, westernMedicineList, bmi },
  data () {
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
      },
      {
        name: 'diseaseGroup',
        label: '分组规则',
        comp: 'custom',
        props: {
          filter: 'filterDiseaseGroup',
        },
      },
    ]
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
      {
        name: 'deptIsAll',
        label: '适用全部科室',
        comp: 'custom',
        parentClass: 'small-margin-parent',
        props: {
          filter: 'filterCommonBoolean',
        },
      },
      {
        name: 'deptList',
        label: '适用科室',
        comp: 'custom',
        parentClass: 'small-margin-parent',
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
    const tplRules = {
      categoryList: [{ required: true, message: '必填项', trigger: 'change' }],
      name: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 40, message: '请输入2-40个字符', trigger: ['blur', 'change'] },
      ],
      description: [
        { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
        { min: 2, max: 100, message: '请输入2-100个字符', trigger: 'change' },
      ],
      deptList: [{ required: false, message: '必填项', trigger: ['blur', 'change'] }],
    }
    const ptRules = {
      userType: [{ required: false, message: '必填项', trigger: 'change' }],
    }
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
    patientFormModel.userType = 0
    patientFormModel.bmi = {
      min: 0,
      max: 0
    }
    const tplFormModel = this.$ever.createObjFromSchema(tplSchema)
    // 模板状态初始值
    tplFormModel.status = true
    tplFormModel.categoryList = []
    tplFormModel.categoryObjList = []
    tplFormModel.deptIsAll = true
    // 初始化时隐藏 deptList
    tplSchema.find(item => item.name === 'deptList').parentClass = 'dn'
    tplFormModel.jobCreateTypeId = 0
    tplFormModel.isSystem = 0
    return {
      // 从外部引入的值
      pattern,
      pattern2,
      // 从外部引入的值 end
      // 适用患者表单
      patientFormModel,
      patientSchema,
      // 模板信息表单
      tplFormModel,
      tplSchema,
      tplRules,
      ptRules,
      // 当前页面信息
      pagePattern: pattern.VIEW, // 当前页面的模式
      pagePattern2: pattern2.VIEW, // 当前页面的模式
      templateId: '', // 模板id
      templateObj: {
        nodeInfoList: [],
      }, // 模板对象
      defProps: { children: 'templateNodeMaterialList', label: 'name' },
      defaultExpandedKeys: [],
      nodeData: {}, // 当前被选中的阶段数据
      node: {}, // 当前被选中的阶段node
      subData: {}, // 当前被选中的任务子项数据
      subNode: {}, // 当前被选中的任务子项node
      // 任务节点的弹出框 end
      currentSysnode: '', // 当前模板的事件节点 一期一个模板只能有一个事件节点，当第一个阶段选择了一个事件节点之后，之后的阶段都不能改变事件节点了
      categoryCascaderList: [], // 分类级联数据
      deptOptions: [], // 科室数据
      saveLoading: false,
      categoryListSearched: false, // 分类已请求完成 标识
      templateSearched: false, // 模板已请求完成 标识
      tempOriginTaskFormModel: {}, // 临时存放 任务详情
      diagnosisListLoading: false, // 诊断搜索框的加载效果
      diagnosisOptions: [], // 诊断搜索框的加载结果
      doctorAdviceListLoading: false, // 医嘱搜索框的加载效果
      doctorAdviceOptions: [], // 医嘱搜索框的加载结果
      jobCreateTypeList,
      isSystemList,
      diseaseGroup,
      agePickerKey: U(),
      hideCancelButton: false,
      categoryObj: {
        name: 'categoryList',
        label: '模板分类',
        comp: 'custom',
        parentClass: 'small-margin-parent',
        props: {
          filter: 'filterCategoryObj',
        }
      },
      type: 0,
      doctorId: localStorage.getItem('USERID')
    }
  },
  watch: {
    'isOpen' (val) {
      if (val) {
        // 当前窗口打开后重新加载问卷的列表
        const routeCategoryId = this.$route.params.categoryId
        // 加载科室数据
        this.getDeptOptions()
        // 获取模板分类
        request(urlMap.follow.syscode.findByTypeId, { typeId: 5 }).then(res => {
          if (res.head.errCode === 0) {
            this.categoryCascaderList = convertListToTree((res.data || []).map(item => ({
              ...item, value: item.id, label: item.name,
            })))
            this.categoryListSearched = true
            if (this.templateSearched && this.templateObj.baseInfo && this.templateObj.baseInfo.categoryId) {
              this.reSearchCategoryList(this.templateObj.baseInfo.categoryId)
            }
            if (routeCategoryId) {
              // 创建模板时需要关联出当前分类【点击创建模板时，选中的左侧分类】
              this.reSearchCategoryList(routeCategoryId)
            }
          }
        })
      }
    }
  },
  methods: {
    reset () {
      this.tplFormModel = {
        name: '',
        description: '',
        categoryList: [],
        deptIsAll: true,
        deptList: [],
        jobCreateTypeId: 0,
        status: true,
        categoryObjList: []
      }
      this.diagnosisOptions = []
      this.doctorAdviceOptions = []
      this.patientFormModel = {
        ageRange: {
          start: {
            year: 0,
            month: 0
          },
          end: {
            year: 130,
            month: 0
          }
        },
        genderId: 0,
        userType: null,
        diagnosisList: [],
        doctorAdviceList: []
      }
    },
    cancel () {
      this.$emit('closeDialog')
    },
    save: debounce(function () {
      // 开始校验数据
      this.$refs.tplForm.$refs.form.validate(valid => {
        // this.$refs.patientForm.$refs.form.validate(validate => {
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
        const params = {}
        params.id = this.templateObj.id || ''
        params.baseInfo = {
          // 患者信息
          // ageMax,
          // ageMin,
          // userType: this.patientFormModel.userType || this.patientFormModel.userType === 0 ? this.patientFormModel.userType : '',
          // genderId: this.patientFormModel.genderId,
          // diagnosisList: this.patientFormModel.diagnosisList || [],
          // diagnosisIsAll: !this.patientFormModel.diagnosisList.length,
          // doctorAdviceList: this.patientFormModel.doctorAdviceList || [],
          // doctorAdviceIsAll: !this.patientFormModel.doctorAdviceList.length,
          // 模板信息
          status: this.tplFormModel.status ? 1 : 0,
          categoryId: this.tplFormModel.categoryList[this.tplFormModel.categoryList.length - 1],
          name: this.tplFormModel.name,
          description: this.tplFormModel.description,
          deptIsAll: this.tplFormModel.deptIsAll,
          deptList: this.tplFormModel.deptList,
          jobCreateTypeId: this.tplFormModel.jobCreateTypeId,
          isSystem: this.tplFormModel.isSystem,
          // 其他
          isOrg: false, // 机构工作站还是集团工作站,如果是在集团工作站新建和编辑，该值为false，如果在机构工作站新建编辑，该值为true，一期只能由集团创建
          // groupRule: this.tplFormModel.diseaseGroup,
          type: this.type,
          doctorId: this.doctorId
        }
        params.nodeInfoList = this.templateObj.nodeInfoList.map(item => {
          return {
            id: item.id || '',
            followUpTime: item.followUpTime,
            remindTime: item.remindTime,
            sysnodeId: item.sysnodeId,
            templateNodeMaterialList: item.templateNodeMaterialList.map((task) => {
              return {
                content: task.content,
                jobTypeId: task.jobTypeId,
                materialCategoryId: task.materialCategoryId || 5,
                name: task.name,
                id: task.id || '',
                templateNodeId: task.templateNodeId || '',
              }
            }),
          }
        })
        this.saveLoading = true
        request(urlMap.follow.template[this.templateObj.id ? 'modify' : 'create'], params).then(res => {
          this.saveLoading = false
          if (res.head.errCode === 0) {
            this.templateId = res.data
            this.$messageTips(this, 'success', '保存成功!')
            this.reset()
            this.$emit('reload')
            // 直接跳转到模板列表
            if (this.isPerson) {
              this.$router.push(getRootRoute.bind(this)() + `/follow/personaltemplate/detail/${this.templateId}`)
            } else {
              this.$router.push(getRootRoute.bind(this)() + `/follow/template/detail/${this.templateId}`)
            }
          }
        })
      })
    }, 200),
    back () {
      this.$router.push(getRootRoute.bind(this)() + '/follow/template')
    },
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
    // 切换dept is all
    changeDeptIsAll (value) {
      // 改变deptList 的显示隐藏
      this.tplSchema.find(item => item.name === 'deptList').parentClass = value ? 'dn' : ''
      // 改变deptList 的是否必填
      this.tplRules.deptList[0].required = !value
    },
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
  },
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  .tplForm.el-form {
    /deep/ .el-form-item--small.el-form-item:not(.custom-form-item) {
      margin-bottom: 10px;
    }
    /deep/
      .el-form-item--small.el-form-item:not(.custom-form-item).small-margin-parent {
      margin-bottom: 2px !important;
    }
    /deep/ .el-form-item__content {
      width: 460px;
      .el-input{
        width:460px;
      }
      .el-select {
        width: 460px;
      }
      .el-radio {
        margin-right: 20px;
      }
    }
  }
  .patientForm.el-form {
    max-height: 500px;
    overflow-y: auto;
    /deep/ .el-form-item--small.el-form-item:not(.custom-form-item) {
      margin-bottom: 10px;
    }
    /deep/ .el-form-item__content {
      .el-select {
        width: 280px;
      }
      .el-radio {
        margin-right: 10px;
      }
    }
  }
  .small-padding-left {
    padding-left: 10px !important;
  }
}

.box {
  width: 50%;
  padding: 20px;
  border: 1px solid #ccc;
}
.btn-warp {
  text-align: right;
}
.btn-create {
  margin: 4px auto;
  width: 76px;
}
.btn-cancel {
  margin-right: 20px;
  width: 76px;
}
.wid {
  width: 50% !important;
}
.common-inner {
  background-color: #ffffff;
}
.common-el.el-main {
  border: 0px solid #c0ccd9;
}
.common-text {
  font-size: 16px;
  color: #000000;
  font-weight: 700;
}
</style>
