<template>
  <div class="common-inner">
    <el-container>
      <el-header class="common-el bgc-fff">
        <div class="common-box">
          <div class="common-header h60">
            <div>
              <el-button size="small" @click="backTo">返回</el-button>
            </div>
            <div>
              <el-button
                type="primary"
                v-if="surveyId && !isView"
                size="small"
                @click="goSave"
                :loading="saveLoading"
                :disabled="isView"
              >保存</el-button>
              <el-button v-if="pagePattern !== pattern.CREATE && !isView"  :disabled="isView" size="small" @click="del">删除</el-button>
            </div>
          </div>
        </div>
      </el-header>
      <el-main class="common-el common-no-border-top bgc-fff h">
        <el-container class="h">
          <el-aside class="no-box-sha common-el h common-no-border" width="400px">
            <div class="common-box common-no-border-left h bgc-fff">
              <div class="common-content h">
                <el-form :model="qtFormModel" ref="qtForm" class="gray-label-form" label-position="top" :rules="qtRules">
                  <el-form-item label="'问卷/量表名称" prop="name" :rule="qtRules.name">
                    <el-input size="small" v-model="qtFormModel.name"></el-input>
                  </el-form-item>
                  <el-form-item label="分类" prop="categoryList" :rule="qtRules.categoryList" v-if="pageType === 'group'">
                     <el-cascader
                      class="w"
                      placeholder="输入分类名称可搜索"
                      :options="categoryCascaderList"
                      v-model="qtFormModel.categoryList"
                      filterable
                      :props="{ checkStrictly: true }"
                      @change="handleChange"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="适用全部科室">
                    <el-switch v-model="qtFormModel.deptIsAll" @change="changeDeptIsAll"></el-switch>
                  </el-form-item>
                  <el-form-item label="适用所选科室">
                    <el-select
                      class="w"
                      v-model="qtFormModel.deptList"
                      multiple
                      filterable
                      clearable
                      value-key="id"
                      reserve-keyword
                      placeholder="请输入关键词"
                      :disabled="isView"
                    >
                      <el-option
                        v-for="item in deptOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="诊断">
                    <el-select
                      v-model="qtFormModel.diagnosisList"
                      filterable
                      clearable
                      remote
                      multiple
                      value-key="id"
                      :reserve-keyword="false"
                      placeholder="请输入关键词"
                      :remote-method="searchDiagnosisList"
                      :loading="diagnosisListLoading"
                      :disabled="isView"
                    >
                      <el-option
                        v-for="item in diagnosisOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-aside>
          <el-main class="common-el common-no-border common-border-left">
            <el-container class="h">
              <div class="question-shade" v-if="!surveyId">
                <div class="question-circle" @click="createQt">
                  <div>
                    <i class="icon iconfont icon-edit cGreen"></i>
                    <div class="edit-btn">编辑问卷内容</div>
                  </div>
                </div>
              </div>
              <el-container class="h"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.4)">
                <iframe ref="followSurvey" id="RMid" v-if="surveyId && editUrl" :src="editUrl" class="questionIframe"></iframe>
                <!-- <iframe ref="followSurvey" id="RMid" v-show="surveyId && editUrl" :src="editUrl" class="questionIframe"></iframe> -->
              </el-container>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { pattern, followMap } from '@/follow/util/model'
import { convertListToTree, getRootRoute, getAllParent, getNodeByValue, transferSchema, validateSpace } from '@/follow/util/fn'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { debounce1 as debounce } from '@/util/common'
// import storage from '@/util/storage'
// import organUrlMap from '@/manages/page/organization/utils/urls'
import eopApi from '@/csa/store/eop.js'
export default {
  data () {
    let isView = !!this.$route.query.isView
    const qtSchema = [
      {
        name: 'name',
        label: '问卷/量表名称',
        props: {
          disabled: isView
        }
      },
      {
        name: 'categoryList',
        label: '分类',
        comp: 'custom',
        props: {
          filter: 'filterCategoryObj',
        }
      },
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
        name: 'diagnosisList',
        label: '诊断',
        comp: 'custom',
        parentClass: 'view-item-parent',
        props: {
          filter: 'filterMultipleList',
        },
      }
    ]
    let categoryRule = this.$route.params.type === 'group' ? [{ required: true, message: '必填项', trigger: 'change' }] : [{ required: false }]
    return {
      diagnosisListLoading: false,
      isLoad: false,
      pattern,
      pagePattern: pattern.VIEW,
      saveLoading: false,
      // 模板信息表单
      qtFormModel: {
        name: '',
        deptIsAll: false,
        deptList: [],
        diagnosisIsAll: false,
        diagnosisList: [],
        categoryList: [],
        thirdQnaireId: ''
      },
      qtSchema,
      qtRules: {
        name: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
          { min: 2, max: 40, message: '请输入2-40个字符', trigger: 'change' },
        ],
        categoryList: categoryRule
      },
      diagnosisOptions: [],
      deptOptions: [],
      categoryListSearched: false, // 分类已请求完成 标识
      questionSearched: false, // 问卷素材已请求完成 标识
      categoryCascaderList: [],
      routeCategoryId: this.$route.params.categoryId,
      qtId: this.$route.params.id,
      pageType: this.$route.params.type,
      questionObj: {},
      node: {},
      surveyId: '',
      loading: true,
      isView: !!this.$route.query.isView,
      followMap
    }
  },
  mounted () {
    window.addEventListener('message', this.getListen, false)
    this.$route.meta.thirdActiveIndex = '/follow/material/questionnaire/' + this.pageType
  },
  destroyed () {
    window.removeEventListener('message', this.getListen)
  },
  watch: {
    'surveyId' (val) {
      if (val) {
        // this.getAnswerNumBySurveyId(val)
        let _this = this
        this.$nextTick(_ => {
          document.getElementById('RMid').onload = function () {
            _this.loading = false
          }
        })
      }
    },
    '$route.params.type': {
      handler (val) {
        this.pageType = val
        // this.$route.meta.thirdActiveIndex = '/follow/material/questionnaire/' + val
        // 修正三级菜单的active状态
        this.$bus.$emit('nav:changeThirdActiveHasParam', '/follow/material/questionnaire/' + this.pageType)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    if (this.qtId && this.qtId !== '-1') {
      this.pagePattern = pattern.VIEW // 查看
      // 查询问卷素材信息
      // this.search()
    } else {
      this.pagePattern = pattern.CREATE // 创建
    }
    this.getDeptOptions()
    this.getCategoryCascaderList()
  },
  computed: {
    editUrl () {
      return this.$ever.host + this.followMap.design + this.surveyId
    }
  },
  methods: {
    getListen (e) {
      if (e.data && e.data.type === 'submit-error') {
        this.saveLoading = false
        return false
      }
      if (e.data && e.data.from === 'Survey' && e.data.type === 'submit-done') {
        this.save()
      }
    },
    // 创建问卷（传问卷名字，获取问卷id）
    createQt () {
      this.$refs.qtForm.validate(valid => {
        if (!valid) {
          return
        }
        request(urlMap.survey.create, { surveyName: this.qtFormModel.name, surveyTypeCode: '005', surveyTypeName: '随访' }, 'post').then(res => {
          if (res.data && res.data.surveyId) {
            this.surveyId = res.data.surveyId
          }
        })
      })
    },
    goSave () {
      this.saveLoading = true
      const iframe = this.$refs.followSurvey
      const msg = {
        data: {},
        from: 'Survey-save',
        fromIP: window.location.origin,
        type: 'save',
      }
      iframe.contentWindow.postMessage(msg, '*') // 'http://192.168.248.85:8090'
    },
    save: debounce(function () {
      // console.log('点击保存')
      this.$refs.qtForm.validate(valid => {
        // console.log('进入校验')
        if (!valid) {
          this.saveLoading = false
          return
        }
        this.qtFormModel.categoryId = this.node && this.node.id ? this.node.id : ''
        this.qtFormModel.categoryName = this.node && this.node.name ? this.node.name : ''
        let params = {
          id: this.qtId && this.qtId !== '-1' ? this.qtId : '',
          categoryId: this.qtFormModel.categoryId,
          categoryName: this.qtFormModel.categoryName,
          deptIsAll: this.qtFormModel.deptIsAll,
          deptList: this.qtFormModel.deptList,
          diagnosisIsAll: false,
          diagnosisList: this.qtFormModel.diagnosisList,
          name: this.qtFormModel.name,
          status: 1,
          type: this.pageType === 'group' ? 0 : 1,
          thirdQnaireId: this.surveyId || ''
        }
        request(urlMap.follow.materialQnaire[this.qtId && this.qtId !== '-1' ? 'update' : 'create'], params).then(res => {
          if (res.head.errCode === 0) {
            this.saveLoading = false
            this.$messageTips(this, 'success', '保存成功!')
            this.$router.push(getRootRoute.bind(this)() + '/follow/material/questionnaire/' + this.pageType)
          } else {
            this.saveLoading = false
          }
          // else {
          //   if (res && res.head && res.head.errMsg) {
          //     this.$messageTips(this, 'error', res.head.errMsg)
          //   }
          // }
        })
      })
    }, 200),
    changeBtn (_pattern) {
      if (_pattern === pattern.EDIT) {
        this.pagePattern = _pattern
        // 切换为编辑时给list选项赋值
        this.diagnosisOptions = this.qtFormModel.diagnosisList || []
        // 表单均切换成编辑模式
        this.transferAllSchema(false)
      }
    },
    del () {
      this.$confirm('问卷删除后将无法恢复，是否继续操作？', '提示', {
        confirmButtonText: '继续删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        request(urlMap.follow.materialQnaire.delete, { id: this.qtId }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功!')
            this.back()
          }
        })
      })
    },
    backTo () {
      if (this.isView) {
        this.back()
      } else {
        this.$confirm('您尚未保存，是否确定离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.back()
        })
      }
    },
    back () {
      this.$router.push(getRootRoute.bind(this)() + '/follow/material/questionnaire/' + this.pageType)
    },
    handleChange (id) {
      // 当分类变化获取分类的name
      let categoryId = this.qtFormModel.categoryList[this.qtFormModel.categoryList.length - 1]
      this.node = getNodeByValue(this.categoryCascaderList, categoryId)
    },
    async search () {
      const question = await request(urlMap.follow.materialQnaire.detail, { id: this.qtId })
      if (question.head.errCode === 0) {
        this.questionObj = question.data
        this.qtFormModel = {
          deptIsAll: this.questionObj.deptIsAll,
          deptList: this.questionObj.deptList || [],
          diagnosisIsAll: false,
          diagnosisList: this.questionObj.diagnosisList || [],
          name: this.questionObj.name || '',
          status: 1,
          thirdQnaireId: this.questionObj.thirdQnaireId,
          categoryId: this.questionObj.categoryId
        }
        this.surveyId = this.questionObj.thirdQnaireId
        // 回显诊断list
        this.diagnosisOptions = this.qtFormModel.diagnosisList || []
        this.qtSchema = this.transferSchema(this.qtSchema, 'qtFormModel', false)
        // 判断是否隐藏科室
        this.qtSchema.find(item => item.name === 'deptList').parentClass = this.questionObj.deptIsAll ? 'dn' : ''
        if (this.categoryListSearched && this.categoryCascaderList.length) {
          this.reSearchCategoryList(this.questionObj.categoryId)
        }
      }
    },
    getDeptOptions () {
      // request(organUrlMap.subject.loadTenantSubjectListByOrgId, {orgId: storage.getLocalStorage('TENANTID')}).then(res => {
      //   if (res.head.errCode === 0) {
      //     this.deptOptions = res.data && res.data.pageList ? res.data.pageList.filter(item => !!item).map(item => ({ id: item.orgSubjectCode, name: item.orgSubjectName })) : []
      //   }
      // })
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
    getCategoryCascaderList () {
      request(urlMap.follow.syscode.findByTypeId, { typeId: 1 }).then(res => {
        if (res.head.errCode === 0) {
          this.categoryCascaderList = convertListToTree((res.data || []).map(item => ({
            ...item, value: item.id, label: item.name,
          })))
          this.categoryListSearched = true
          if (this.routeCategoryId) {
            // 创建问卷素材时需要关联出当前分类【点击创建问卷素材时，选中的左侧分类】
            this.reSearchCategoryList(this.routeCategoryId)
          }
          if (this.qtId && this.qtId !== '-1') {
            this.search()
          }
        }
      })
    },
    // 当分类id和分类树都查询完成之后 递归查找分类id
    reSearchCategoryList (categoryId) {
      // debugger
      this.node = getNodeByValue(this.categoryCascaderList, categoryId)
      if (this.node) {
        this.qtFormModel.categoryList = [...(getAllParent(this.node).map(item => item.id)), categoryId]
        this.qtFormModel.categoryObjList = [...getAllParent(this.node), this.node]
      } else {
        this.qtFormModel.categoryList = [] // 出现异常
        this.qtFormModel.categoryObjList = []
      }
    },
    transferAllSchema (toView = false) {
      this.qtSchema = this.transferSchema(this.qtSchema, 'qtFormModel', toView)
    },
    transferSchema (_schema, formModel, toView = false) {
      if (formModel === 'qtFormModel') {
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
    changeDeptIsAll (value) {
      // 改变deptList 的显示隐藏
      this.qtSchema.find(item => item.name === 'deptList').parentClass = value ? 'dn' : ''
    },
    searchDiagnosisList: debounce(function (query) {
      if (query !== '') {
        this.diagnosisListLoading = true
        request(urlMap.searchDiagnose, { name: query || '', type: 0 }, 'get').then(res => {
          this.diagnosisListLoading = false
          if (res.head.errCode === 0) {
            this.diagnosisOptions = this.qtFormModel.diagnosisList || []
            let resultList = res.data.resultList.map(item => ({
              id: item.id,
              diseaseCode: item.diseaseCode || '',
              name: item.diseaseName,
              diseaseCodeCategory: item.diseaseCodeCategory || '',
            }))
            let diagnosisOptions1 = resultList.filter(item => !this.diagnosisOptions.some(ele => ele.id === item.id))
            this.diagnosisOptions = [...this.diagnosisOptions, ...diagnosisOptions1]
            // let arr1 = [{ id: 1, name: '网' }, { id: 2, name: '二位' }]
            // let arr2 = [{ id: 1, name: '问问' }, { id: 3, name: '多少' }, { id: 44, name: '多少' }, { id: 45, name: '多少' }]
            // let add = arr2.filter(item => !arr1.some(ele => ele.id === item.id))
            // console.log(add)
          }
        })
      }
    }, 200)
  }
}
</script>
<style scoped>
.view-inline-item {
  display: block;
}
.el-form /deep/.el-form-item .el-form-item__content .view-inline-item {
  display: block;
}
.common-box > .common-content {
  box-sizing: border-box !important;
}
.questionIframe {
  width: 100%;
  border-width: 0px;
}
.question-shade {
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.question-circle {
  width: 114px;
  height: 114px;
  border-radius: 50%;
  background: #1c7bef;
  text-align: center;
  justify-content: center;
  align-items: center;
  align-content: center;
  cursor: pointer;
}
.question-circle > div {
  margin-top: 30px;
}
.question-shade .iconfont {
  font-size: 30px;
  color: #ffffff;
}
.edit-btn {
  font-size: 14px;
  color: #f8f9fa;
}
</style>
