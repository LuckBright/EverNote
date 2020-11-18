<template>
  <div>
    <el-aside
      class="no-box-sha common-el common-no-border common-max-height bgc-dark"
      width="300px"
    >
      <div class="common-box common-no-border-left">
        <div class="common-header">
          <span>模板列表</span>
          <a class="cBlue" v-if="activeName === '1' && $hasPermission('Auth_menu_follow_personaltemplate')" :href="this.$ever.followIndex + '/follow/personaltemplate'" target="_blank">完全自定义</a>
        </div>
        <div class="common-content padding-content">
          <el-tabs v-model="activeName">
            <el-tab-pane label="集团随访模板" name="0"></el-tab-pane>
            <el-tab-pane label="个人随访模板" name="1"></el-tab-pane>
          </el-tabs>
          <ever-form2
          class="gray-label-form add-inner-follow-form"
          v-model="queryObj"
          ref="patientForm"
          :schema="querySchema"
          :nosubmit="true"
          :inline="false"
          label-position="right"
          label-width="50"
          >
          <template slot="isSystem">
            <el-radio-group v-model="queryObj.isSystem">
              <el-radio
                v-for="item in allSystemList"
                :key="item.id"
                :label="item.id"
              >{{item.name}}
              </el-radio>
            </el-radio-group>
          </template>
          </ever-form2>
          <el-radio-group v-model="templateId">
            <div v-for="item in tableData" :key="item.id" class="template-radio">
              <el-radio :label="item.id">{{item.name}}</el-radio>
            </div>
          </el-radio-group>
          <el-pagination
            v-if="tableData&&tableData[0]"
            background
            small
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            class="pagination"
            :page-size="6"
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
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
import { allSystemList } from '@/follow/util/model'
const querySchema = [
  {
    name: 'isSystem',
    label: '匹配方式',
    comp: 'custom',
    props: {
      filter: 'filterIsSystem',
    },
  }
]
export default {
  props: ['patientObj', 'isOpen'],
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.isSystem = ''
    return {
      templateId: '',
      tableData: [],
      totalCount: '',
      offset: 0,
      pagesize: 5,
      currentPage: 1,
      querySchema,
      queryObj,
      allSystemList,
      activeName: '0',
      type: 1,
      creatorId: localStorage.getItem('USERID'),
      doctorId: localStorage.getItem('USERID')
    }
  },
  watch: {
    'templateId' (val) {
      this.$emit('getTemplateId', val)
    },
    'isOpen' (val) {
      if (!val) {
        this.templateId = ''
        this.tableData = []
        this.totalCount = ''
        this.currentPage = 1
      } else {
        this.activeName = '0'
        this.queryObj.isSystem = ''
        this.type = 0
        this.creatorId = ''
        this.doctorId = ''
        this.getTemplateList('')
      }
    },
    'queryObj.isSystem': {
      handler (val) {
        this.currentPage = 1
        this.getTemplateList(val)
      },
      deep: true,
    },
    'activeName': {
      handler (val) {
        this.$bus.$emit('followup:isShow', val)
        this.currentPage = 1
        if (val === '1') {
          this.type = 1
          this.creatorId = localStorage.getItem('USERID')
          this.doctorId = localStorage.getItem('USERID')
          this.getTemplateList(this.queryObj.isSystem)
        } else {
          this.type = 0
          this.creatorId = ''
          this.doctorId = ''
          this.getTemplateList(this.queryObj.isSystem)
        }
      },
      deep: true
    },
  },
  created () {
    this.type = 0
    this.creatorId = ''
    this.doctorId = ''
    this.getTemplateList('')
  },
  methods: {
    // 查询某个科室下的可用模板
    getTemplateList (isSystem) {
      let params = {
        patientId: this.patientObj.patientId,
        deptId: this.patientObj.providerId,
        visitNumber: this.patientObj.visitNumber,
        pagesize: 6,
        currentPage: this.currentPage,
        status: 1,
        isSystem: isSystem,
        type: this.type,
        creatorId: this.creatorId,
        doctorId: this.doctorId
      }
      if (params.patientId && params.deptId && params.visitNumber) {
        request(urlMap.follow.template.findByCriteria, params).then(res => {
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
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTemplateList(this.queryObj.isSystem)
    }
  },
}
</script>
<style lang="less" scoped>
.template-radio {
  margin-bottom: 15px;
}
.padding-content {
  padding: 10px 20px 0 20px;
}
.add-inner-follow-form{margin-bottom: 4px;}
.add-inner-follow-form .el-radio{margin-right: 10px;}
</style>
