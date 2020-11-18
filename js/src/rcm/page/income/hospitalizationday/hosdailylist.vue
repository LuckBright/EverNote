<template>
  <div class="patientList" :class="{isShowPatienList:isShow}">
    <div class="btn" @click="showPatient" :class="{isShowPatienListBtn:isShow}">住院日结列表</div>
    <div class="settle_body payStyle">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :is-query="true"
          @query="list()"
        >
          <template slot="dailySettleTime">
            <ever-range-picker
              :start.sync="queryObj.startDate"
              :end.sync="queryObj.endDate"
              :autoWidth="true"
              @change="list()"
            ></ever-range-picker>
          </template>
          <template slot="buttons">
            <el-button type="primary" @click="list()">查询</el-button>
          </template>
          <div></div>
        </ever-form2>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="calc(100vh - 228px)"
        @row-click="showDetail"
        class="no-border table-hover-blue highlight-current-row"
      >
        <el-table-column prop="code" label="日结流水号" min-width="180"></el-table-column>
        <el-table-column prop="settlementCount" label="结算单数量" align="right" width="90"></el-table-column>
        <el-table-column prop="settlementCountFee" label="结算合计金额" align="right" width="100"></el-table-column>
        <el-table-column prop="create_time" label="结账时间" width="140"></el-table-column>
      </el-table>
      <ever-pagination
        class="pagecomponent"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :small="true"
        :layout="'prev, pager, next'"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/rcm/store/income/hosdaily'
let schema = [
  {
    label: '日结时间',
    name: 'dailySettleTime',
    comp: 'custom',
    span: 20
  },
  {
    label: '',
    labelWidth: '0',
    name: 'buttons',
    comp: 'custom',
    span: 4
  }
]
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.startDate = this.$moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
    obj.endDate = this.$moment().format('YYYY-MM-DD 23:59:59')
    return {
      tableData: [],
      querySchema: schema,
      queryObj: obj,
      isShow: false,
      pageSizes: [10, 20, 30, 50],
      pagesize: 20,
      pageIndex: 1,
      totalCount: 0,
      depositeObj: {},
      ipCasherObj: {}
    }
  },
  methods: {
    showPatient () {
      this.isShow = !this.isShow
      if (this.isShow === true) {
        this.queryObj.startDate = this.$moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
        this.queryObj.endDate = this.$moment().format('YYYY-MM-DD 23:59:59')
        // 更新待入院患者列表
        this.list()
      }
    },
    // 患者列表
    async list () {
      if (!this.queryObj.startDate && !this.queryObj.endDate) {
        this.tableData = []
        return false
      }
      let params = {
        offset: (this.pageIndex - 1) * this.pagesize || '0',
        pagesize: this.pagesize || '20',
        startDate: this.queryObj.startDate ? this.$moment(this.queryObj.startDate).format('YYYY-MM-DD 00:00:00') : '',
        endDate: this.queryObj.endDate ? this.$moment(this.queryObj.endDate).format('YYYY-MM-DD 23:59:59') : ''
      }
      let result = {}

      result = await api.getIpCloseList(params)
      if (result.head && result.head.errCode === 0) {
        this.tableData = result.data && result.data.list
        this.tableData.map((item) => {
          item.settlementCountFee = Number(item.settlementCountFee).toFixed(2)
          item.create_time = this.$moment(item.create_time).format('YYYY-MM-DD HH:mm')
        })
        this.totalCount = result.data && result.data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.list()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.list()
    },
    showDetail (row) {
      // 通过url传出id，让父组件去调用接口，
      // 如果要通过emit的话，直接刷新，父组件会失去内容
      this.$router.replace({
        path: this.$route.path,
        query: { id: row.id }
      })
      this.isShow = false
    }
  }
}
</script>
<style scoped>
.patientList {
  height: 100vh;
  width: 500px;
  position: fixed;
  transition: all linear 0.3s;
  left: -500px;
  top: 0;
  z-index: 100;
  padding: 85px 0;
  border: 1px solid #ccc;
  box-sizing: border-box;
  /* overflow-y: auto; */
  overflow-x: visible;
  background-color: #fff;
  box-shadow: 10px 0 10px rgba(0, 0, 0, 0.05);
}
.isShowPatienList {
  transition: all linear 0.3s;
  left: 0px;
  right: auto;
}
.patientList .isShowPatienListBtn.btn {
  transition: all linear 0.3s;
  left: 500px;
}
.patientList .payStyle {
  width: 500px;
  background-color: #fff;
}
.patientList .btn {
  transition: all linear 0.3s;
  position: fixed;
  left: 0px;
  top: 30%;
  width: 10px;
  font-size: 12px;
  padding: 10px 10px;
  background-color: #1c7bef;
  cursor: pointer;
  color: #ffffff;
  z-index: 200;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.patientList .isShowPatienListBtn {
  transition: all linear 0.3s;
  left: 500px;
}
.patientList .main-head {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 0;
}
.patientList .main-head .el-form {
  border-bottom: none;
}
.patientList .main-title {
  margin: 10px 0 0 20px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}
.patientList /deep/ .el-form-item {
  margin: 5px 10px 5px 5px;
}
.patientList /deep/ .form.ever_query_from .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.patientList /deep/ .el-input__inner,
.el-textarea__inner {
  padding: 0 10px;
  /* padding-right: 30px; */
}
.patientList .payStyle /deep/ .el-table .cell,
.el-table th > div {
  padding: 0 5px !important;
}
.el-table__body tr.current-row > td {
  background-color: #bedeff;
}
.patientList /deep/ .el-table__body tr:hover > td {
  color: white;
  background-color: #1c7bef !important;
}
.patientList .pagecomponent {
  position: absolute;
  bottom: 10px;
  right: 5px;
}
</style>

