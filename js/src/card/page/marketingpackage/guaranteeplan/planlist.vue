<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="obj"
          ref="form"
          labelWidth="140px"
          label-position="right"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="patientInfo">
            <ever-patient-select-query
              v-model="obj.resourceId"
              ref="inputSeach"
            >
            </ever-patient-select-query>
          </template>
        </ever-form2>
      </div>
      <div>
      <el-table
        class="flex_column_full_hidden"
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="name"
          label="保障计划任务名称"
          min-width="130"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a
              @click="querydetail(scope.row)"
            >{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="resourceName"
          label="患者姓名"
        ></el-table-column>
        <el-table-column
          label="性别"
        >
          <template slot-scope="scope">
            <sys-value type="GBT.2261.1" :code="scope.row.extendInfo.sex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          label="出生日期"
          min-width="150"
        >
          <template slot-scope="scope">
            <div>
            {{scope.row.extendInfo.birthday | formatDateByExp('YYYY-MM-DD') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="计划任务执行"
          align="right"
        ><template slot-scope="scope">
            {{EXECUTESTATUS[scope.row.executeStatus]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="220"
        >
          <template slot-scope="scope">
            <el-button v-if="![3,4,6].includes(scope.row.executeStatus)" type="primary" @click="stopTask(scope.row.businessInstanceId)">终止任务</el-button>
            <!-- <el-button type="primary" @click="orderDetail(scope.row.packageId)">保障计划套餐</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="currentPage"
      :pagesize="pageSize"
      :page-sizes="pageSizes"
    >
    </ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/card/store/guaranteeplan/api.js'
import list from '@/util/list'
import {EXECUTESTATUS} from '@/card/util/cardcommon.js'
let querySchema = [
  {
    label: '保障计划任务名称',
    name: 'name',
  },
  {
    label: '患者',
    name: 'patientInfo',
    comp: 'custom'
  },
  {
    name: 'orderTime',
    label: '计划任务创建时间',
    comp: 'el-date-picker',
    props: {
      type: 'datetimerange',
      'range-separator': '至',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    label: '任务执行',
    name: 'status',
    comp: 'el-select',
    props: {
      options: [
        {
          value: '1',
          label: '未启动'
        },
        {
          value: '2',
          label: '已启动'
        },
        {
          value: '3',
          label: '完成'
        },
        {
          value: '4',
          label: '终止'
        },
        {
          value: '5',
          label: '失败'
        },
        {
          value: '6',
          label: '过期'
        },
        {
          value: '7',
          label: '未完成'
        }
      ]
    }
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      obj,
      querySchema,
      EXECUTESTATUS,
      tableData: [],
      offset: 0,
      currentPage: 0,
      pageSize: 50,
      pageSizes: [50],
      totalCount: 0,
      loading: false
    }
  },
  methods: {
    list () {
      let params = {
        name: this.obj.name,
        status: this.obj.status,
        resourceId: this.obj.resourceId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        startDate: this.obj.orderTime ? this.obj.orderTime[0] : '',
        endDate: this.obj.orderTime ? this.obj.orderTime[1] : ''
      }
      api.searchMaster(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data.resultList || []
          this.totalCount = rs.data.totalCount
        }
      })
    },
    orderDetail (id) {
      this.$router.push({
        path: '/kanban/orderdetails/' + id
      })
    },
    querydetail (val) {
      this.$router.push({
        path: 'plandetails/' + val.resourceId,
        query: {
          instanceId: val.businessInstanceId,
          status: val.executeStatus
        }
      })
    },
    stopTask (id) {
      api.stopMasterTask({
        id: id
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.list()
          this.$messageTips(this, 'success', '终止任务成功')
        }
      })
    },
    // handleSizeChange () {},
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
