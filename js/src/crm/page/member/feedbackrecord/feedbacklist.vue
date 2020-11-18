<template>
  <div id="feedbacklist">
    <el-row>
      <el-col align="right">
        <el-button  @click="linkCreatePage" type="primary">添加反馈</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      class="el-td-border"
      highlight-current-row>
      <el-table-column
        label="类型"
        width="120"
        align="center">
        <template slot-scope="scope">
          <sys-value type="THC_FEEDBACK_TYPE" :code="scope.row.type"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="content"
        label="反馈内容"
        align="center"
        max-width="180">
      </el-table-column>
      <el-table-column
        label="涉及机构"
        align="center"
        width="200">
        <template slot-scope="scope">
          {{scope.row.dptNames || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        label="涉及科室"
        align="center"
        width="200">
        <template slot-scope="scope">
          {{scope.row.dptNames || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="涉及人员"
        max-width="200">
        <template slot-scope="scope">
          {{scope.row.handleNames || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="处理人员"
        max-width="200">
        <template slot-scope="scope">
          {{scope.row.handleNames || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="反馈时间"
        align="center"
        width="240">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="接待人"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="处理状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          <sys-value type="THC_FEEDBACK_STATUS" :code="scope.row.status.toString()"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button size="small" @click="linkDetailPage(scope.row.id, scope.row.status)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
  </div>
</template>
<script>
  import api from '@/crm/store/feedbackapi'
  import list from '@/util/list'
  export default {
    mixins: [list],
    data () {
      // let queryObj = this.$ever.createObjFromSchema(querySchema)
      // queryObj.patientId = this.$route.params.patientId
      return {
        api,
        queryObj: {
          patientId: this.$route.params.patientId
        }
      }
    },
    created () {},
    methods: {
      linkDetailPage (id, status) {
        if (status === 1) {
          window.location.href = this.$ever.crmIndex + '/crm/feedbackhandle?id=' + id
        } else if (status === 4) {
          window.location.href = this.$ever.crmIndex + '/crm/feedcompete?id=' + id
        } else {
          window.location.href = this.$ever.crmIndex + '/crm/feedbackdetail?id=' + id
        }
      },
      linkCreatePage () {
        window.location.href = this.$ever.crmIndex + '/crm/createfeedback'
      }
    }
  }
</script>
