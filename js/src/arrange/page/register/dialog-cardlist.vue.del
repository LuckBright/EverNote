<template>
  <div id="cardlist">
    <el-form class="query_form_wrap" :model="params" :inline="true">
      <el-form-item>
        <div style="width:360px">
          <ever-patient-select
            size="small"
            v-model="patientName"
            :allow-create="true"
            :grey-denies-dialog-show="true"
            @select="selectPatient"
          ></ever-patient-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          size="small"
          v-model="appointmentDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click.native="getTableData" size="small">查询</el-button>
        <el-button type @click="resetSearch" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border height="270" :data="tableData" style="width: 100%">
      <el-table-column prop="patientName" label="姓名" width="160"></el-table-column>
      <el-table-column prop="outpatientNumber" label="病案号"></el-table-column>
      <el-table-column align="center" prop="cardFee" label="卡费" width="160"></el-table-column>
      <el-table-column align="center" prop="benFee" label="工本费" width="160"></el-table-column>
      <el-table-column prop="operator" label="收费人" width="160"></el-table-column>
      <el-table-column prop="createTime" label="操作时间"></el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" align="right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'

export default {
  props: ['initPatient'],
  data () {
    return {
      api,
      showDialog: false,
      tableData: [],
      currentPage: 1,
      totalCount: 0,
      appointmentDate: '',
      patientName: '',
      params: {
        patientId: '',
        beginDate: '',
        endDate: '',
        sid: 0,
        pagesize: 20,
        offset: 0
      }
    }
  },
  watch: {
    'appointmentDate' (val) {
      this.params.beginDate = val
      this.params.endDate = val
      this.getTableData()
    },
    'patientName' (val) {
      if (!val) {
        this.params.patientId = ''
      }
    },
    'initPatient' (val) {
      this.params.patientId = val.id
      this.patientName = val.name
      this.getTableData()
    },
    'params': {
      handler () {
        this.getTableData()
      },
      deep: true
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.api.getServiceOrderList(this.params).then(rs => {
        this.tableData = rs.data
        this.totalCount = rs.totalCount
      })
    },
    selectPatient (val) {
      this.params.patientId = val.id
      this.getTableData()
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.getTableData()
    },
    resetSearch () {
      this.params.patientId = ''
      this.appointmentDate = ''
      this.patientName = ''
    }
  }
}
</script>
<style scoped>
#cardlist .el-table {
  margin-top: 0;
}
#cardlist .el-form-item{margin-bottom: 10px;}
#cardlist /deep/ .el-form-item__content {line-height: 32px;}
</style>
