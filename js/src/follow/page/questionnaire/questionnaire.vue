<template>
  <div class="common-inner">
    <el-container>
      <el-aside class="no-box-sha common-el common-auto-height bgc-gray" width="320px" v-if="pageType==='group'">
        <follow-syscode @nodeClick="handleNodeClick" :typeId="1"></follow-syscode>
      </el-aside>
      <el-main class="common-el common-auto-height common-no-border-left bgc-fff">
        <div class="common-box js-fixed-header bgc-gray">
          <div class="common-header common-no-border-bottom fs20">{{categoryName}}</div>
          <div class="common-content p0_20_15_20">
            <ever-form2
              class="gray-label-form"
              v-model="queryObj"
              ref="form"
              :schema="querySchema"
              :inline="true"
              :is-query="true"
              :has-ext="true"
              :ext-btn-string="'新建问卷/量表'"
              :ext-class-name="'fr'"
              @extAction="toNewTemplate"
            >
              <!-- <template slot="deptIds">
                <el-select v-model="queryObj.deptIds" clearable filterable placeholder="请选择科室">
                  <el-option
                    v-for="item in deptList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </template> -->
              <template slot="sicknessIds">
                <disease v-model="queryObj.sicknessIds"></disease>
              </template>
              <template slot="default">
                <el-form-item>
                  <el-button type="primary" @click="list()">查询</el-button>
                  <el-button @click="reset()">重置</el-button>
                </el-form-item>
              </template>
            </ever-form2>
          </div>
        </div>
        <div class="common-box common-border-top">
          <div class="common-content">
            <ever-table
              ref="table"
              border
              :columns="columns"
              :url="url"
              :params.sync="queryObj"
              :show-index="true"
              index-label
              :fixed-height="23"
              fixed-elements="js-fixed-header"
              @eventChange="eventChange"
              :maxBtnCount="3"
            ></ever-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog width="1000px" title="操作日志" :visible.sync="dialog.visible">
      <ever-table
        :columns="recordsColumns"
        :is-record-url-params="false"
        :show-index="true"
        :url="recordsUrl"
        :params="recordsParams"
      ></ever-table>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <dialog-copy ref="copyNewSurvey"></dialog-copy>
  </div>
</template>

<script>
import urlMap from '@/util/urls'
import { FOLLOW_TEMPLATE, tableColWidth } from '@/util/table-config'
import { getRootRoute, getDeptNames } from '@/follow/util/fn'
import followSyscode from '../../components/followsyscode'
import dialogCopy from '../../components/dialog-copy'
import disease from '../../components/disease'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { surveyStatus } from '@/follow/util/model'
import { listDestValue, debounce1 as debounce } from '@/util/common'
import { request } from '@/util/req'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'

const querySchema = [
  {
    name: 'name',
    label: '问卷/量表名称',
    placeholder: '输入问卷/量表名称',
  },
  {
    name: 'deptIds',
    comp: 'ever-subject-select',
    label: '科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
      params: {
        orgIdList: []
      },
      isOrg: false
    }
  },
  {
    name: 'sicknessIds',
    label: '疾病',
    comp: 'custom',
  },
  {
    name: 'status',
    label: '状态',
    comp: 'select',
    props: {
      options: surveyStatus,
    },
  },
]
export default {
  components: { followSyscode, disease, dialogCopy },
  data: function () {
    // 查询科室信息
    // this.remoteDeptList()
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.deptIds = ''
    queryObj.type = this.$route.params.type === 'group' ? 0 : 1
    return {
      url: urlMap.follow.materialQnaire.findByCriteria,
      pageType: this.$route.params.type,
      columns: [
        {
          prop: 'name',
          label: '问卷/量表名称',
          sortable: true,
          type: 'link',
          urlFormatter: ({ row }) => {
            return getRootRoute.bind(this)() + `/follow/material/questionnaire/${this.pageType}/detail/${row.id}/${row.categoryId || 0}/?isView=1`
          },
        },
        {
          prop: 'deptNames',
          label: '适用科室',
          formatter: ({ value }) => getDeptNames(value),
          // width: tableColWidth.name7W120
        },
        {
          prop: 'sicknessNames',
          label: '适用疾病',
          // width: tableColWidth.name7W120
        },
        {
          prop: 'creatorName',
          label: '创建人',
          // width: tableColWidth.name7W120
        },
        {
          prop: 'modifyTime',
          label: '最后修改时间',
          sortable: false,
          // width: tableColWidth.datetimeAllW160,
        },
        {
          prop: 'status',
          label: '状态',
          // width: tableColWidth.name3W65,
          formatter: ({ value }) => listDestValue(surveyStatus, value)
        },
        {
          prop: 'ever-op',
          type: 'btns',
          label: '操作',
          width: tableColWidth.w220,
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'records',
                label: '操作日志',
              },
              {
                prop: 'goIframe',
                label: '查看数据',
              },
              {
                prop: 'copyNewSurvey',
                label: '复制问卷',
              }
            ]
            if (row.status === 0) {
              let btns = [
                {
                  prop: 'goDetail',
                  label: '编辑',
                },
                {
                  prop: 'changeStatus',
                  label: '发布问卷',
                },
              ]
              baseBtns = [...baseBtns, ...btns]
            }
            if (row.status === 1) {
              let btns = [
                {
                  prop: 'changeStatus',
                  label: '取消发布',
                },
                {
                  prop: 'stopStatus',
                  label: '结束问卷',
                }
              ]
              baseBtns = [...baseBtns, ...btns]
            }
            return baseBtns
          }
        },
      ],
      querySchema,
      queryObj,
      configOption: {
        // 此处的id一定用自己定义的，不能用和其他人相同的
        id: FOLLOW_TEMPLATE,
        onlyPageSize: true,
      },
      params: {},
      categoryId: '',
      categoryName: '全部',
      dialog: {
        visible: false,
      },
      recordsColumns: [
        {
          prop: 'creatorName',
          label: '操作人',
        },
        {
          prop: 'ip',
          label: 'IP',
        },
        {
          prop: 'operation',
          label: '操作类型',
        },
        {
          prop: 'createTime',
          label: '操作时间',
        },
      ],
      recordsUrl: urlMap.follow.sysoperationLog.findPageByBizId,
      recordsParams: {
        bizId: '',
      },
      deptList: [],
    }
  },
  watch: {
    '$route.params.type': {
      handler: function (val) {
        this.pageType = val
        // 修正三级菜单的active状态
        this.$bus.$emit('nav:changeThirdActiveHasParam', '/follow/material/questionnaire/' + this.pageType)
        this.queryObj.type = val === 'group' ? 0 : 1
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // this.$route.meta.thirdActiveIndex = '/follow/material/questionnaire/group'
  },
  methods: {
    copyNewSurvey: debounce(function (row) {
      this.$refs.copyNewSurvey.open({id: row.id, thirdQnaireId: row.thirdQnaireId})
    }),
    goDetail (row) {
      this.$router.push(`/follow/material/questionnaire/${this.pageType}/detail/${row.id}/${row.categoryId}/`)
    },
    changeStatus: debounce(function (row) {
      request(urlMap.follow.materialQnaire.updateStatus, { id: row.id, status: row.status ? 0 : 1 }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '成功!')
          this.list(false)
        } else {
          // this.$messageTips(this, 'error', res.head.errMsg)
        }
      })
    }),
    stopStatus: debounce(function (row) {
      request(urlMap.follow.materialQnaire.updateStatus, { id: row.id, status: 2 }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '成功!')
          this.list(false)
        } else {
          // this.$messageTips(this, 'error', res.head.errMsg)
        }
      })
    }),
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    records (row) {
      // 打开弹窗，查看操作日志
      this.dialog.visible = true
      setTimeout(() => {
        this.recordsParams.bizId = row.id
        this.recordsParams._uuid = U()
      })
    },
    goIframe (row) {
      window.open(`${this.$ever.host}/web/survey-pc/pc.html#/survey/analyse/${row.thirdQnaireId}`, '_blank')
    },
    list (searchFirstPage = true) {
      // 只有在点击查询时才查询，参数变化时不实时查询
      /*
      this.params = {
        ...this.queryObj,
        categoryId: this.categoryId,
        _uuid: U(),
        searchFirstPage,
      } */
      this.$refs.table.list(searchFirstPage)
    },
    /* 在不使用queryObj作为params直接传入ever-table的情况下，保持表单与浏览器参数一致的方法 */
    /* 此方法在页面加载时会被调用 因为@upadte:params 在ever-table created的时候会被触发 */
    reset () {
      this.$refs.form.resetForm()
      // this.queryObj.deptIds = ''
      // this.changeParams()
    },
    toNewTemplate () {
      this.$router.push(getRootRoute.bind(this)() + '/follow/material/questionnaire/' + this.pageType + '/' + 'detail/-1/' + this.categoryId)
    },
    handleNodeClick (data) {
      const oldCategoryId = this.categoryId
      this.categoryId = data.id === 'all' ? '' : data.id
      this.categoryName = data.name
      if (this.categoryId !== oldCategoryId) {
        this.list()
      }
    }
  }
}
</script>

<style scoped>
</style>
