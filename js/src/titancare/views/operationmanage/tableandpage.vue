<template>
  <div>
    <el-table
      v-loading.body="loading"
      ref="singleTable"
      :data="tableData"
      class="doctor-table"
      style="width: 100%"
      border
      highlight-current-row
      @row-click='rowClick'
      stripe>
      <el-table-column
        show-overflow-tooltip
        label="患者信息"
        prop="patientName">
        <template slot-scope="scope">
          <span>{{scope.row.patientName}} </span>
          <span> {{scope.row.gender === '1' ? "男" : '女'}} </span>
          <span> {{ scope.row.birthday ? ages(scope.row.birthday) : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开方日期"
        show-overflow-tooltip
        prop="createDate">
      </el-table-column>
      <el-table-column
        label="开方医生"
        show-overflow-tooltip
        prop="orderDoctorSignature">
      </el-table-column>
    </el-table>
    <el-pagination
      small
      class='pagination'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="offset"
      :page-size="pagesize"
      :pager-count='5'
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import api from '@/titancare/api/operation'
export default {
  data () {
    return {
      total: 0,
      pagesize: 5,
      offset: 1,
      loading: false,
      tableData: [],
      api
    }
  },
  methods: {
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      this.offset = val
      this.$emit('changePage')
    },
    searchList (obj, status, isDispensing) {
      this.loading = true
      this.tableData = []
      let newParams = ''
      if (!isDispensing) {
        let params = {
          auditStatus: status,
          currentPage: this.offset,
          pageSize: this.pagesize
        }
        if (this.$route.path === '/titancare/operation/expressmanage') {
          delete params.auditStatus
          params.dispensingStatus = status
        }
        newParams = Object.assign({}, params, obj)
      } else {
        let params = {
          dispensingStatus: status,
          currentPage: this.offset,
          pageSize: this.pagesize
        }
        newParams = Object.assign({}, params, obj)
      }
      api.getSearchInfo(newParams).then(res => {
        if (!res.errCode) {
          this.total = res.data.totalCount
          this.tableData = res.data.resultList
          this.loading = false
          if (this.tableData.length > 0) this.single(this.tableData[0])
        }
      })
    },
    rowClick (row) {
      this.$emit('changeRow', row)
    },
    ages (str) {
      let gender = ''
      let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (d.getFullYear() === Number(r[1]) && (d.getMonth() + 1) === Number(r[3]) && d.getDate() === Number(r[4])) {
        var Y = new Date().getFullYear()
        gender = (Y - r[1]) + '岁'
      }
      return gender
    },
    single (row) {
      this.$refs.singleTable.setCurrentRow(row)
      this.rowClick(row)
    }
  }
}
</script>
<style lang='less' scoped>
.pagination {
  float: right;
}
</style>
