<template>
  <el-dialog
  width="500px"
  class="copy-survey"
  :title="title"
  :visible.sync="visible"
  >
    <!--
    <ever-form2
      class="gray-label-form"
      v-model="qtFormModel"
      ref="qtForm"
      :schema="qtSchema"
      :nosubmit="true"
      :label-position="'top'"
      :rules="qtRules">
      <template slot="categoryList" v-if="pageType === 'group'">
        <el-form-item label="分类">
          <el-cascader
            class="w"
            placeholder="输入分类名称可搜索..."
            :options="categoryCascaderList"
            v-model="qtFormModel.categoryList"
            filterable
            :props="{ checkStrictly: true }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </template>
      <template slot="deptIsAll">
        <el-switch v-model="qtFormModel.deptIsAll" @change="changeDeptIsAll"></el-switch>
      </template>
      <template slot="deptList">
        <el-select
          class="w"
          v-model="qtFormModel.deptList"
          multiple
          filterable
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
      <template slot="diagnosisList">
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
        >
          <el-option
            v-for="item in diagnosisOptions"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </template>
    </ever-form2>
    -->
    <el-form :model="qtFormModel" label-position="top" ref="qtForm">
      <el-form-item label="问卷/量表名称" prop="name" :rules="qtRules.name">
        <el-input v-model="qtFormModel.name" placeholder="请输入问卷/量表名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categoryList" :rules="qtRules.categoryList" v-if="pageType === 'group'">
        <el-cascader
          size="small"
          class="w"
          placeholder="输入分类名称可搜索..."
          :options="categoryCascaderList"
          v-model="qtFormModel.categoryList"
          filterable
          :props="{ checkStrictly: true }"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="适用全部科室" prop="deptIsAll">
        <el-switch v-model="qtFormModel.deptIsAll" @change="changeDeptIsAll" size="small"></el-switch>
      </el-form-item>
      <el-form-item label="适用所选科室" prop="deptList">
        <el-select
          size="small"
          class="w"
          v-model="qtFormModel.deptList"
          multiple
          filterable
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
      </el-form-item>
      <el-form-item label="诊断" prop="diagnosisList">
        <el-select
          size="small"
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
    <div class="">
      <el-button type="primary" @click="copy">复制问卷并编辑</el-button>
      <el-button @click="visible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { convertListToTree, validateSpace, getNodeByValue } from '@/follow/util/fn'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { debounce1 as debounce } from '@/util/common'
import eopApi from '@/csa/store/eop.js'
export default {
  data () {
    const qtSchema = [
      {
        name: 'name',
        label: '问卷/量表名称',
        props: {
        }
      },
      {
        name: 'categoryList',
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
    return {
      visible: false,
      title: '复制问卷',
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
      node: {},
      qtSchema,
      qtRules: {
        name: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], validator: validateSpace },
          { min: 2, max: 40, message: '请输入2-40个字符', trigger: 'change' },
        ],
        categoryList: [{ required: this.$route.params.type === 'group', message: '必填项', trigger: 'change' }]
      },
      pageType: this.$route.params.type,
      diagnosisListLoading: false,
      diagnosisOptions: [],
      categoryCascaderList: [],
      deptOptions: [],
      categoryListSearched: false, // 分类已请求完成 标识
      questionSearched: false, // 问卷素材已请求完成 标识
      id: '',
      thirdQnaireId: ''
    }
  },
  created () {
    this.getDeptOptions()
    // this.getCategoryCascaderList()
  },
  watch: {
    visible (val) {
      if (!val) {
        this.reset()
      }
    },
    '$route.params.type' (val) {
      this.pageType = val
    }
  },
  methods: {
    copy: debounce(function (query) {
      this.$refs.qtForm.validate(valid => {
        if (!valid) {
          return
        }
        this.qtFormModel.categoryId = this.node.id || ''
        this.qtFormModel.categoryName = this.node.name || ''
        let params = {
          id: this.id,
          categoryId: this.qtFormModel.categoryId,
          categoryName: this.qtFormModel.categoryName,
          deptIsAll: this.qtFormModel.deptIsAll,
          deptList: this.qtFormModel.deptList,
          diagnosisIsAll: false,
          diagnosisList: this.qtFormModel.diagnosisList,
          name: this.qtFormModel.name,
          status: 1,
          thirdQnaireId: this.thirdQnaireId || ''
        }
        request(urlMap.follow.materialQnaire.copyNewSurvey, params).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '复制成功!')
            this.visible = false
            let id = res.data
            this.$router.push(`/follow/material/questionnaire/${this.pageType}/detail/${id}/${this.qtFormModel.categoryId}`)
          } else {
            // this.$messageTips(this, 'error', res.head.errMsg)
          }
        })
      })
    }),
    open (val) {
      this.visible = true
      this.id = val.id
      this.thirdQnaireId = val.thirdQnaireId
      this.getCategoryCascaderList()
    },
    close () {
      this.visible = false
      this.id = ''
      this.thirdQnaireId = ''
    },
    reset () {
      this.qtFormModel = {
        name: '',
        deptIsAll: false,
        deptList: [],
        diagnosisIsAll: false,
        diagnosisList: [],
        categoryList: [],
        thirdQnaireId: ''
      }
    },
    closeDialog () {
      this.close()
    },
    reload () {
      this.close()
      this.$emit('reload')
    },
    handleChange (id) {
      // 当分类变化获取分类的name
      let categoryId = this.qtFormModel.categoryList[this.qtFormModel.categoryList.length - 1]
      this.node = getNodeByValue(this.categoryCascaderList, categoryId)
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
    searchDiagnosisList: debounce(function (query) {
      if (query !== '') {
        this.diagnosisListLoading = true
        request(urlMap.searchDiagnose, { name: query || '' }, 'get').then(res => {
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
          }
        })
      }
    }, 200),
    changeDeptIsAll (value) {
      // 改变deptList 的显示隐藏
      this.qtSchema.find(item => item.name === 'deptList').parentClass = value ? 'dn' : ''
    },
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.copy-survey{}
</style>

