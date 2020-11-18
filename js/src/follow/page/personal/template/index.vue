
<!-- 个人随访模板 -->
<template>
  <div class="common-inner">
    <el-container>
      <el-main class="common-el common-auto-height bgc-fff">
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
              :ext-btn-string="'新建模板'"
              :ext-class-name="'fr'"
              @extAction="toNewTemplate"
            >
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
          <!-- fixed-height="164" 164 = 头部查询条件框占高（50 + 76 + 15 = 141） + 表格区域到上下padding（10 * 2 = 20）+ 3个边框的高度（1 * 3 = 3）-->
          <div class="common-content">
            <ever-table
              ref="table"
              border
              :columns="columns"
              :url="url"
              :params="params"
              :show-index="true"
              index-label
              :fixed-height="23"
              fixed-elements="js-fixed-header"
              @update:params="changeParams"
              @eventChange="eventChange"
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
    <dialog-newcreate ref="Newcreate" @reload="reload" :isPerson="1"></dialog-newcreate>
  </div>
</template>

<script>
import urlMap from '@/util/urls'
import { FOLLOW_TEMPLATE, tableColWidth } from '@/util/table-config'
import { getRootRoute, statusFormatter } from '@/follow/util/fn'
// import { listDestValue } from '@/util/common'
// import { commonStatusList, jobCreateTypeList, isSystemList } from '@/follow/util/model'
import { commonStatusList, allSystemList } from '@/follow/util/model'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
import dialogNewcreate from '@/follow/page/template/dialog-newcreate'

const querySchema = [
  {
    name: 'status',
    label: '模板状态',
    comp: 'select',
    props: {
      options: commonStatusList,
    },
    placeholder: '',
  },
  {
    name: 'isSystem',
    label: '模板启动方式',
    comp: 'select',
    props: {
      options: allSystemList,
    },
    placeholder: '',
  }
]
export default {
  components: { dialogNewcreate },
  data: function () {
    // 查询科室信息
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.deptId = ''
    queryObj.status = 1
    return {
      url: urlMap.follow.template.findByCriteria,
      columns: [
        {
          prop: 'name',
          label: '模板名称',
          sortable: true,
          type: 'link',
          urlFormatter: ({ row }) => {
            return getRootRoute.bind(this)() + `/follow/personaltemplate/detail/${row.id}`
          },
        },
        // {
        //   prop: 'jobCreateTypeId',
        //   label: '任务生成方式',
        //   formatter: ({ value }) => listDestValue(jobCreateTypeList, value),
        //   width: tableColWidth.name6W105
        // },
        // {
        //   prop: 'isSystem',
        //   label: '自动匹配条件',
        //   formatter: ({ value }) => listDestValue(isSystemList, value),
        //   width: tableColWidth.name6W105
        // },
        // {
        //   prop: 'orgName',
        //   label: '创建机构',
        // },
        // {
        //   prop: 'creatorName',
        //   label: '创建人',
        //   width: tableColWidth.name7W120
        // },
        // {
        //   prop: 'createTime',
        //   label: '创建时间',
        //   sortable: true,
        //   width: tableColWidth.datetimeAllW160,
        // },
        {
          prop: 'status',
          label: '状态',
          formatter: ({ value }) => statusFormatter(value),
          width: tableColWidth.name6W105
        },
        {
          prop: 'isSystem',
          label: '模板启动方式',
          formatter: ({ value }) => {
            return value ? '手动' : '系统自动'
          },
          width: tableColWidth.name6W105
        },
        {
          prop: 'ever-op',
          type: 'btns',
          label: '操作',
          width: tableColWidth.name6W105,
          btns: [
            {
              prop: 'records',
              label: '操作日志',
            },
          ],
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
      pageType: '',
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
    '$route.params.type' (val) {
      this.pageType = val
      // this.$route.meta.thirdActiveIndex = '/follow/material/questionnaire/personal'
    }
  },
  created () {
    // this.$route.meta.thirdActiveIndex = '/follow/material/questionnaire/personal'
  },
  methods: {
    reload () {
      this.list()
    },
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
    list (searchFirstPage = true) {
      // 只有在点击查询时才查询，参数变化时不实时查询
      this.params = {
        type: 1,
        ...this.queryObj,
        categoryId: this.categoryId,
        _uuid: U(),
        searchFirstPage,
        doctorId: localStorage.getItem('USERID'),
        creatorId: localStorage.getItem('USERID')
      }
    },
    /* 在不使用queryObj作为params直接传入ever-table的情况下，保持表单与浏览器参数一致的方法 */
    /* 此方法在页面加载时会被调用 因为@upadte:params 在ever-table created的时候会被触发 */
    changeParams (params = {}) {
      this.queryObj = { ...this.queryObj, ...params }
      this.list(false)
    },
    reset () {
      this.$refs.form.resetForm()
      this.queryObj.deptId = ''
      this.queryObj.status = 1
      this.changeParams()
    },
    toNewTemplate () {
      this.$refs.Newcreate.open()
    },
    handleNodeClick (data) {
      const oldCategoryId = this.categoryId
      this.categoryId = data.id === 'all' ? '' : data.id
      this.categoryName = data.name
      if (this.categoryId !== oldCategoryId) {
        this.list()
      }
    }
  },
}
</script>

<style scoped lang="less">
</style>
