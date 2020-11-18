<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="true"
        :ext-btn-string="'新建'"
        :ext-class-name="'fr'"
        @extAction="toPage"
      >
        <template slot="default">
          <el-form-item>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :url="url"
      :params.sync="queryObj"
      :columns="columns"
      method="get"
      is-auto-height
      page-key="pageNo"
      :handle-result="handleResult"
      :handle-total="handleTotal"
      :max-btn-count="4"
      @eventChange="eventChange"
    ></ever-table>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/manages/page/survey/urls'
import { listDestValue } from '@/util/common'

const surveyStateList = [
  {
    id: 0,
    name: '设计中',
  },
  {
    id: 1,
    name: '执行中',
  },
  {
    id: 2,
    name: '已结束',
  },
]
const querySchema = [
  {
    name: 'surveyName',
    label: '问卷名称',
  },
  {
    name: 'surveyState',
    label: '问卷状态',
    comp: 'select',
    props: {
      options: surveyStateList,
    },
  },
]
export default {
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.orgId = ''
    return {
      querySchema,
      queryObj,
      url: urlMap.list,
      columns: [
        {
          prop: 'surveyName',
          label: '问卷名称',
        },
        {
          prop: 'answerNum',
          label: '回答次数',
        },
        {
          prop: 'createDate',
          label: '创建时间',
        },
        {
          prop: 'editDate',
          label: '更新时间',
        },
        {
          prop: 'surveyState',
          label: '问卷状态',
          width: 100,
          formatter ({ value }) {
            return listDestValue(surveyStateList, value)
          },
        },
        {
          prop: 'op',
          label: '操作',
          width: 300,
          type: 'btns',
          btns ({ row }) {
            return ['edit', {
              prop: 'report',
              label: '分析报告',
            },
              ...(row.surveyState === 1 ? [{
                prop: 'answer',
                label: '进行答卷'
              }] : []),
              'del']
          },
        },
      ],
    }
  },
  created () {
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    toPage () {
      this.$router.push({ name: 'surveyDetail', params: { surveyId: '-1' } })
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    del ({ id }) {
      request(urlMap.delete, { id }, 'get').then(res => {
        if (res.head.errCode === 0) {
          this.list()
          this.$messageTips(this, 'success', '删除成功')
        }
      })
    },
    edit ({ id }) {
      this.$router.push({ name: 'surveyDetail', params: { surveyId: id } })
    },
    report ({ id }) {
      window.open(`${this.$ever.managesIndex}/manages/survey/report/${id}`, '_blank')
    },
    answer ({ id }) {
      // window.open(`${this.$ever.managesIndex}/manages/survey/answer/${id}`, '_blank')
      window.open(`${this.$ever.api}/survey/response/dwsurvey.do?surveyId=${id}&defaultFlag=true`, '_blank')
    },
    handleResult (res) {
      return res.page ? (res.page.result || []) : []
    },
    handleTotal (res) {
      return res.page ? (res.page.totalItems || 0) : 0
    },
  },
}
</script>
