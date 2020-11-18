<template>
  <div class="common-inner">
    <el-container class="h">
      <el-aside class="no-box-sha common-el h" width="320px">
        <div class="common-content p0">
          <ul class="status-group">
            <div
              v-for="item in taskStatus"
              :class="{'on':item.id === statusId}"
              :key="item.id"
              @click="changeStatus(item.id, item)">
            <li>
              <div>{{item.name}}</div>
            </li>
            </div>
          </ul>
        </div>
      </el-aside>
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
              :has-ext="false"
              :ext-class-name="'fr'"
            >
              <template slot="createDate">
                <ever-range-picker v-model="createDate"></ever-range-picker>
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
              method="get"
              fixed-elements="js-fixed-header js-classify"
              @update:params="changeParams"
            >
            <template slot="patientNumber" slot-scope="scope">
                <a
                style="color: #217DE3;"
                class="ellipsis"
                :href="$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + scope.row.patientId"
                target="_blank"
              >{{scope.row.patientNumber}}</a>
            </template>
            </ever-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- <dialog-follow-appoint ref="Followappoint"></dialog-follow-appoint> -->
  </div>
</template>

<script>
import urlMap from '@/util/urls'
// import organUrlMap from '@/manages/page/organization/utils/urls'
import { FOLLOW_TASK, tableColWidth } from '@/util/table-config'
import { listDestValue } from '@/util/common'
import { genderList, taskStatus } from '@/follow/util/model'
// import { getAgeByMonth } from '@/follow/util/fn'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import dialogFollowAppoint from '@/follow/page/template/dialog-follow-appoint'

const querySchema = [
  {
    name: 'businessTemplateName',
    label: '随访计划名',
    placeholder: '输入随访计划名',
    props: {
      clearable: true
    }
  },
  {
    name: 'name',
    label: '子任务名',
    placeholder: '输入子任务名',
    props: {
      clearable: true
    }
  },
  {
    name: 'resourceId',
    label: '患者姓名',
    comp: 'ever-patient-select-query',
    placeholder: '输入患者姓名',
    props: {
      clearable: true
    }
  },
  {
    name: 'creatorName',
    label: '创建人',
    placeholder: '输入创建人',
    props: {
      clearable: true
    }
  },
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'tenantDeptId',
    comp: 'ever-subject-select',
    label: '科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  },
  {
    name: 'createDate',
    label: '创建日期',
    comp: 'custom',
    placeholder: '',
  }
]
export default {
  components: { dialogFollowAppoint },
  data: function () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.tenantDeptId = ''
    queryObj.isOrg = true
    queryObj.startDate = ''
    queryObj.endDate = ''
    return {
      deptList: [],
      classify: null,
      taskStatus,
      url: urlMap.follow.task.selectMaterialJobList,
      detailUrl: this.$route.path,
      columns: [
        {
          prop: 'name',
          label: '任务名称',
          sortable: true,
          width: tableColWidth.name7W120,
          type: 'link',
          urlFormatter: ({ row }) => `/follow/taskmanage/detail/${row.businessInstanceId}?subtaskId=${row.id}`
        },
        // {
        //   prop: 'materialCategoryId',
        //   label: '子任务类型',
        //   // width: tableColWidth.w220,
        // },
        {
          prop: 'executeStatus',
          label: '任务状态',
          // width: tableColWidth.name6W105,
          formatter: ({ value }) => listDestValue(taskStatus, value)
        },
        {
          prop: 'executorName',
          label: '执行人'
        },
        {
          prop: 'jobName',
          label: '随访计划',
          type: 'link',
          urlFormatter: ({ row }) => `/follow/taskmanage/detail/${row.id}`
        },
        {
          prop: 'orgName',
          label: '机构',
        },
        {
          prop: 'tenantDeptName',
          label: '科室',
        },

        {
          prop: 'creatorName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'planStartTime',
          label: '计划执行时间',
        },
        {
          prop: 'resourceName',
          label: '患者姓名',
          width: tableColWidth.name7W120
        },
        {
          prop: 'extendInfo',
          label: '患者档案号',
          width: tableColWidth.w220,
          formatter: ({ value }) => {
            if (value.patientNumber === 'temporary') {
              return '--'
            } else {
              return value.patientNumber
            }
          }
        },
        {
          prop: 'extendInfo',
          label: '性别',
          width: tableColWidth.name2W54,
          formatter: ({ value }) => listDestValue(genderList, parseInt(value.sex))
        },
        {
          prop: 'extendInfo',
          label: '年龄',
          width: tableColWidth.name4W80,
          formatter: ({ value }) => value.age
        },
        {
          prop: 'executorName',
          label: '执行人',
        },
        {
          prop: 'executeTime',
          label: '执行时间',
        }
      ],
      querySchema,
      queryObj,
      configOption: {
        id: FOLLOW_TASK,
        onlyPageSize: true,
      },
      doctorList: [],
      params: {},
      categoryName: '全部',
      statusGroup: [
        { id: 1, name: '全部' },
        { id: 2, name: '待确认' }
      ],
      createDate: [],
      statusId: 0,
      statusData: [],
      clinicIdList: []
    }
  },
  mounted () {
  },
  created () {
    this.createDate = [this.$moment().subtract(1, 'months').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
  },
  watch: {
    $route (to, from) {
      this.detailUrl = to.path
    },
    '$store.state.resources': {
      handler () {
        this.queryObj.isOrg = true
        // this.querySchema.find(item => item.name === 'orgId').parentClass = !this.$hasPermission('Auth_menu_follow_taskmanage') ? 'dn' : ''
        this.list(false)
        // this.columns.find(item => item.prop === 'orgName').hidden = !this.$hasPermission('Auth_menu_follow_taskmanage')
      },
    },
    // 机构变化之后 科室的值要清空掉
    'queryObj.orgId' (val) {
      this.$ever.getFieldFromSchema(querySchema, 'tenantDeptId').props.params = {
        orgId: val
      }
      this.queryObj.tenantDeptId = ''
    },
    'createDate' (val) {
      if (val[0]) {
        this.queryObj.startDate = val[0]
        this.queryObj.endDate = val[1]
      } else {
        this.queryObj.startDate = ''
        this.queryObj.endDate = ''
      }
    }
  },
  methods: {
    open1 () {
      this.$refs.Followappoint.open()
    },
    changeStatus (val, item) {
      // this.findStatusGroupByCriteria()
      this.classify = item
      this.statusId = val
      this.queryObj.status = val
      this.list()
    },
    list (searchFirstPage = true) {
      // 只有在点击查询时才查询，参数变化时不实时查询
      delete this.queryObj.createDate
      this.params = {
        ...this.queryObj,
        _uuid: U(),
        // 该参数能够控制此次查询是否查第一页
        searchFirstPage,
      }
    },
    /* 在不使用queryObj作为params直接传入ever-table的情况下，保持表单与浏览器参数一致的方法 */
    /* 此方法在页面加载时会被调用 因为@upadte:params 在ever-table created的时候会被触发 */
    changeParams (params) {
      this.queryObj = { ...this.queryObj, ...params }
      this.statusId = this.queryObj.status || ''
      this.list(false)
    },
    reset () {
      this.createDate = []
      this.$refs.form.resetForm()
      this.changeParams()
      this.list()
    }
  }
}
</script>

<style scoped>
.status-group {
  margin: 0;
  padding: 0;
}
.status-group li {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #d9dee5;
  cursor: pointer;
}
.status-group li > div:nth-child(1) {
  margin-left: 48px;
}
.status-group li > div:nth-child(2) {
  margin-right: 12px;
}
.on {
  background: #2980e0;
  color: #ffffff;
}
.classify {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #000000;
  margin-top: 10px;
  font-weight: 700;
}
.el-form--inline /deep/ .el-form-item.dn {
  display: none;
}
</style>
