<template>
  <div class="common-inner">
    <el-container class="h">
      <el-main class="common-el h common-no-border-left">
        <div class="common-box js-fixed-header">
          <div class="common-content p20_20_15_20">
            <ever-form2
              class="gray-label-form"
              v-model="queryObj"
              ref="form"
              :schema="querySchema"
              :inline="true"
              :is-query="true"
              :has-ext="true"
              :ext-btn-string="'新建'"
              :ext-class-name="'fr'"
              @extAction="addTemplate"
            >
            </ever-form2>
          </div>
        </div>
        <div class="common-box common-border-top">
          <div class="common-content bgc-fff">
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
              :maxBtnCount="4"
            >
            </ever-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <dialog-add-template v-model="currentEditValue" :show.sync="showAdd" @success="list"></dialog-add-template>
    <el-dialog width="1000px" title="操作日志" :visible.sync="showLog">
      <ever-table
        ref="logTable"
        v-if="showLog"
        :columns="recordsColumns"
        :is-record-url-params="false"
        :show-index="true"
        :url="recordsUrl"
        :params="recordsParams"
      ></ever-table>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>
<script>
import urlMap from '@/util/urls'
import { request } from '@/util/req'
import { tableColWidth } from '@/util/table-config'
import { getDeptNames } from '@/follow/util/fn'
import { debounce1 as debounce } from '@/util/common'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import dialogAddTemplate from '@/follow/page/material/dialog-addtemplate.vue'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
const querySchema = [
  {
    name: 'deptIds',
    comp: 'ever-subject-select',
    label: '适用科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
      params: {
        orgIdList: []
      },
      isOrg: false
    }
  }
]
export default {
  components: { dialogAddTemplate },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.pagesize = 50
    queryObj.deptIds = ''
    return {
      querySchema,
      queryObj,
      request,
      showAdd: false,
      showLog: false,
      // url: urlMap.follow.materialPhone.findByCriteria,
      url: { url: 'findByCriteria', isStatic: false, prefix: 'follow-up/phoneTemplate/' },
      columns: [
        {
          prop: 'title',
          label: '模板名称',
        },
        {
          prop: 'content',
          label: '模板内容',

        },
        {
          prop: 'deptName',
          label: '适用科室',
          formatter: ({ value }) => getDeptNames(value),
        },
        {
          prop: 'creatorName',
          label: '创建人',
          // width: tableColWidth.name7W120
        },
        {
          prop: 'modifyTime',
          label: '最后修改时间',
          sortable: true,
          // width: tableColWidth.datetimeAllW160,
        },
        {
          prop: 'status',
          label: '模板状态',
          sortable: false,
          formatter: ({ value }) => {
            return value ? '启用' : '停用'
          }
        },
        {
          prop: 'type',
          label: '模板类型',
          sortable: false,
          formatter: ({ value }) => {
            return value ? '个人' : '集团'
          },
          width: tableColWidth.datetimeAllW160,
        },
        {
          prop: 'ever-op',
          type: 'btns',
          label: '操作',
          width: tableColWidth.w300,
          btns: ({ row }) => {
            return [
              {
                prop: 'openStatus',
                label: row.status ? '停用' : '启用',
                type: row.status ? 'danger' : 'primary'
              },
              {
                prop: 'editTemplate',
                label: '编辑',
                disabled: !!row.status
              },
              {
                prop: 'delTemplate',
                label: '删除',
              },
              {
                prop: 'records',
                label: '操作日志',
              }
            ]
          }
        },
      ],
      recordsColumns: [
        {
          prop: 'creatorName',
          label: '姓名',
        },
        {
          prop: 'createTime',
          label: '时间',
        },
        {
          prop: 'operation',
          label: '动作',
        },
        {
          prop: 'ip',
          label: 'IP',
        }
      ],
      recordsUrl: urlMap.follow.sysoperationLog.findPageByBizId,
      params: {},
      deptParams: {
        status: 'Y',
        orgIdList: [],
        type1CodeList: ['01'],
        type2CodeList: ['01.02', '01.03']
      },
      recordsParams: {},
      currentEditValue: ''
    }
  },
  created () {
    // console.log(urlMap)
  },
  watch: {
    'showAdd' (val) {
      if (!val) {
        this.currentEditValue = ''
      }
    },
    'queryObj': {
      handler (val) {
        this.list()
      },
      deep: true
    }
  },
  methods: {
    list (searchFirstPage = true) {
      // 只有在点击查询时才查询，参数变化时不实时查询
      this.params = {
        ...this.queryObj,
        categoryId: this.categoryId,
        _uuid: U(),
        searchFirstPage,
      }
    },
    changeParams (params = {}) {
      this.queryObj = { ...this.queryObj, ...params }
      this.list(false)
    },
    eventChange (val) {
      this.currentEditValue = val.row
      if (val.prop === 'editTemplate') {
        this.showAdd = true
      }
      if (val.prop === 'delTemplate') {
        this.delTemplate()
      }
      if (val.prop === 'openStatus') {
        this.enableTemplate()
      }
      if (val.prop === 'records') {
        this.records()
      }
    },
    addTemplate (val) {
      this.showAdd = true
    },
    delTemplate: debounce(function () {
      let url = 'follow-up/phoneTemplate/delete'
      this.$confirm('您确定要删除该模板数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request(url, {id: this.currentEditValue.id}).then(rs => {
          if (rs.data) {
            this.$messageTips(this, 'success', '模板已删除成功', '提示')
            this.list()
          }
        })
      })
    }),
    enableTemplate: debounce(function () {
      let url = 'follow-up/phoneTemplate/enable'
      this.request(url, {id: this.currentEditValue.id, status: !this.currentEditValue.status ? 1 : 0}).then(rs => {
        this.list()
      })
    }),
    records () {
      // 打开弹窗，查看操作日志
      this.showLog = true
      this.$nextTick(_ => {
        this.recordsParams = {
          bizId: this.currentEditValue.id,
          _uuid: U()
        }
      })
    }
  }
}
</script>
