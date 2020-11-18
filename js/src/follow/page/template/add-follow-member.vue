<template>
<!-- 会员添加随访左侧模板 -->
  <div>
    <el-aside
      class="no-box-sha common-el common-no-border common-isMember-height bgc-dark"
      width="300px"
    >
      <div class="common-box common-no-border-left">
        <div class="common-header">
          <span>模板列表</span>
          <a class="cBlue" :href="this.$ever.followIndex + '/follow/template'" target="_blank">完全自定义</a>
        </div>
        <div class="common-content padding-content">
          <el-form :model="queryObj" ref="patientForm" label-position="left" label-width="100px" class="patientform">
            <el-form-item label="模板名称">
              <el-input v-model="queryObj.templateName" clearable size="small"></el-input>
            </el-form-item>
            <el-form-item label="模板分类">
              <el-cascader
              class="w"
              size="small"
              clearable
              popper-class="member-follow-cascader"
              placeholder="全部分类"
              :options="categoryCascaderList"
              v-model="categoryList"
              :props="{ checkStrictly: true }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="适用科室">
              <el-select
                class="w"
                size="small"
                v-model="queryObj.deptId"
                filterable
                clearable
                value-key="id"
                placeholder="全部科室"
              >
                <el-option
                  v-for="item in deptOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模板审核方式">
              <el-select v-model="queryObj.jobCreateTypeId" size="small">
                <el-option v-for="(item, i) in jobCreateTypeList" :value="item.id" :label="item.name" :key="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模板启动方式">
              <el-select v-model="queryObj.isSystem" size="small">
                <el-option v-for="(item, i) in allSystemList" :value="item.id" :label="item.name" :key="i"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div>
            <el-radio-group v-model="templateId" v-if="tableData &&tableData[0]">
              <div v-for="item in tableData" :key="item.id" class="template-radio">
                <el-radio :label="item.id">{{item.name}}</el-radio>
              </div>
            </el-radio-group>
            <div v-else class="ac">暂无数据</div>
          </div>
          <el-pagination
            v-if="tableData && tableData[0] && totalCount > 6"
            background
            small
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            class="pagination"
            :page-size="10"
            :total="Number(totalCount)"
        ></el-pagination>
        </div>
      </div>
    </el-aside>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { convertListToTree } from '@/follow/util/fn'
import { allSystemList, jobCreateTypeList } from '@/follow/util/model'
import eopApi from '@/csa/store/eop.js'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
export default {
  props: ['patientObj', 'isOpen'],
  data () {
    return {
      templateId: '',
      tableData: [],
      totalCount: '',
      offset: 0,
      pagesize: 10,
      currentPage: 1,
      categoryCascaderList: [],
      deptOptions: [],
      categoryList: [],
      queryObj: {
        type: 0,
        templateName: '',
        categoryId: '',
        deptId: '',
        isSystem: '',
        jobCreateTypeId: '',
        currentPage: 1,
        pagesize: 10,
        status: 1
      },
      allSystemList,
      jobCreateTypeList
    }
  },
  watch: {
    'templateId' (val) {
      if (val) {
        this.$emit('getTemplateId', val)
      } else {
        this.$emit('getTemplateId', '')
      }
    },
    'isOpen' (val) {
      if (!val) {
        this.templateId = ''
        this.categoryCascaderList = []
        this.tableData = []
        this.totalCount = ''
        this.currentPage = 1
        this.categoryList = []
      } else {
        this.getTree()
      }
    },
    'categoryList' (val) {
      if (val[0]) {
        this.queryObj.categoryId = val && val[0] ? val[val.length - 1] : []
      } else {
        this.queryObj.categoryId = ''
      }
    },
    'currentPage' (val) {
      this.queryObj.currentPage = val
    },
    'queryObj.templateName': {
      handler (val) {
        this.currentPage = 1
        this.getTemplateList()
      }
    },
    'queryObj.categoryId': {
      handler (val) {
        this.currentPage = 1
        this.getTemplateList()
      }
    },
    'queryObj.deptId': {
      handler (val) {
        this.currentPage = 1
        this.getTemplateList()
      }
    },
    'queryObj.isSystem': {
      handler (val) {
        this.currentPage = 1
        this.getTemplateList()
      }
    },
    'queryObj.jobCreateTypeId': {
      handler (val) {
        this.currentPage = 1
        this.getTemplateList()
      }
    }
  },
  created () {
    this.getTree()
    this.getDeptOptions()
  },
  methods: {
    // 查询分类可用模板
    getTemplateList () {
      request(urlMap.follow.template.findByCriteria, this.queryObj).then(res => {
        if (res.data && res.data.resultList && res.data.resultList[0]) {
          this.tableData = res.data.resultList
          this.totalCount = res.data.totalCount
          this.templateId = res.data.resultList[0].id
        } else {
          this.tableData = []
          this.totalCount = 0
          this.templateId = ''
        }
      })
    },
    handleCurrentChange (val) {
      this.queryObj.currentPage = val
      this.getTemplateList()
    },
    getTree () {
      request(urlMap.follow.syscode.findByTypeId, {typeId: 5}).then(res => {
        if (res.head.errCode === 0) {
          this.categoryCascaderList = convertListToTree((res.data || []).map(item => ({
            ...item, value: item.id, label: item.name,
          })))
          /*
          let val = this.categoryCascaderList[0].id
          this.$nextTick(_ => {
            this.queryObj.categoryList = [val]
          })
          */
          this.getTemplateList()
        } else {
          this.categoryCascaderList = []
        }
      })
    },
    changeIsSystem (val) {
      // console.log(val, 'changeIsSystem')
      // this.currentPage = 1
      // let data = this.queryObj.categoryList && this.queryObj.categoryList[0] ? this.queryObj.categoryList[this.queryObj.categoryList.length - 1] : []
      // this.getTemplateList(data, val)
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
    }
  }
}
</script>
<style lang="less" scoped>
.template-radio {
  margin-bottom: 15px;
}
.padding-content {
  padding: 20px 20px 0 20px;
}
.add-member-follow-form {margin-bottom: 20px;}
.ac {text-align: center;}
.patientform {margin-bottom: 20px;}
.patientform /deep/ .el-form-item {margin-bottom: 5px;}
.patientform /deep/ .el-form-item .el-form-item__label{height: 41px; line-height: 41px;}
</style>
