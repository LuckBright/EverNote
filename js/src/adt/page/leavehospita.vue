<template>
  <!-- 出院管理列表 -->
  <div class="inhospital">
    <top-search @change="getInfoList" ref="searchRef" :flag="'leave'"></top-search>
    <div class="table-box flex_col_1_hidden main-wrap">
      <el-table :data="tableData" :border="true" style="width: 100%">
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="manageBtn(scope.row)"
              :disabled="scope.row.status === 7"
            >操作</el-button>
            <el-button
              type="text"
              size="small"
              @click="leaveHandle(scope.row.hospitalizedNumber)"
              :disabled="!(scope.row.status === 7)"
            >出院办理</el-button>
            <el-button
              type="text"
              size="small"
              @click="lock(scope.row)"
              :disabled="!(scope.row.status === 8)"
              :loading="loading"
            >办理取消</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="姓名"></el-table-column>
        <el-table-column label="年龄">
          <template
            slot-scope="scope"
          >{{scope.row.ageShowText}}</template>
        </el-table-column>
        <el-table-column label="性别" width="50">
          <template slot-scope="scope">
            <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column label="主要诊断" width="100" prop="mainDiagnosisName"></el-table-column>
        <el-table-column prop="admitDepositStatus" label="押金状态" width="89">
          <template slot-scope="scope">
            <div slot="reference">
              <el-tag
                size="medium"
                :class="className[scope.row.admitDepositStatus]"
              >{{ depositStatus[scope.row.admitDepositStatus] }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="insuranceCompanyName" label="医保类型"></el-table-column>
        <el-table-column prop="personTypeName" label="人员类别"></el-table-column>
        <el-table-column prop="inpatientNumber" label="病案号"></el-table-column>
        <el-table-column prop="status" label="患者状态" :formatter="status" width="80"></el-table-column>
        <el-table-column prop="inDeptName" label="科室"></el-table-column>
        <el-table-column prop="inWardName" label="病区"></el-table-column>
        <el-table-column prop="admitBedName" label="床位" width="100"></el-table-column>
        <el-table-column prop="admitTime" label="入院时间" width="170"></el-table-column>
        <el-table-column prop="dischargeTime" label="出院时间" width="170"></el-table-column>
        <el-table-column prop="admitDays" label="住院天数" width="80"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" width="120"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="offset"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        style="float:right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/adt/store/register'
import topSearch from '@/adt/page/topsearch'

export default {
  data () {
    return {
      api,
      tableData: [],
      total: 0,
      offset: 1,
      pagesize: 20,
      statusInfo: {
        4: '已入科',
        5: '待转科',
        6: '待出科',
        7: '已出科',
        8: '办理出院',
        9: '出院已结算'
      },
      depositStatus: {
        1: '未缴押金',
        2: '已缴押金',
        3: '押金警告',
        4: '押金透支'
      },
      className: {
        1: 'originBg',
        2: 'greenBg',
        3: 'originBg',
        4: 'redBg'
      },
      loading: false
    }
  },
  mounted () {
    this.$refs.searchRef.searchBtn()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.$refs.searchRef.searchBtn()
    },
    handleCurrentChange (val) {
      this.offset = val
      this.$refs.searchRef.searchBtn()
    },
    getInfoList (filterModel, flag) {
      filterModel.inHosDate = filterModel.inHosDate === null ? '' : filterModel.inHosDate
      this.offset = flag ? 1 : this.offset
      let params = {
        offset: (this.offset - 1) * this.pagesize,
        pagesize: this.pagesize,
        startDate: filterModel.inHosDate[0],
        endDate: filterModel.inHosDate[1]
      }
      params = Object.assign({}, params, filterModel)
      api.getOutSearch(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.total = res.data.totalCount
          this.tableData = res.data.resultList
        }
      })
    },
    status (row) {
      return this.statusInfo[row.status]
    },
    depositInfo (row) {
      return this.depositStatus[row.admitDepositStatus]
    },
    manageBtn (row) {
      this.$router.push({
        path: 'leavepatient',
        query: this.commonData(row)
      })
    },
    lock (row) {
      this.$confirm('您正在办理撤销出院操作，请确定是否撤销?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.loading = row.status !== 7
        this.api.locked({
          'hospitalizedNumber': row.hospitalizedNumber
        }).then(rs => {
          if (rs.head.errCode === 0) {
            if (row.status === 7) {
              this.$router.push({
                path: 'leavepatient',
                query: this.commonData(rs.data)
              })
            } else {
              this.$refs.searchRef.searchBtn()
              this.$messageTips(this, 'success', '办理取消操作成功')
              this.loading = false
            }
          }
        }).catch(e => {
          this.loading = false
        })
      }).catch(() => {
        // this.$messageTips(this, 'success', '办理取消操作取消')
        return false
      })
    },
    commonData (row) {
      let rcmObj = {
        id: row.id,
        patientId: row.patientId,
        ipNo: row.hospitalizedNumber,
        ipStatus: row.status,
        providerId: row.admitDeptId,
        settlementId: row.settlementId,
        ipSettleStatus: row.ipSettleStatus
      }
      return rcmObj
    },
    leaveHandle (val) {
      api.getDischargeInfo({
        hospitalizedNumber: val
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$router.push({
            path: 'leavepatient',
            query: this.commonData(rs.data)
          })
          this.$messageTips(this, 'success', '出院办理成功')
        }
      })
    }
  },
  components: {
    topSearch,
  },
}
</script>
<style scoped>
.inhospital {
  height: calc(100% - 20px);
  background: white;
  padding: 10px 5px;
  /* overflow: auto; */
}
.inhospital .table-box {
  margin: 20px;
  overflow: scroll;
}
.inhospital .table-box .tipStyle {
  padding: 1px 3px;
  background: #c5c5c5;
  border-radius: 2px;
  color: #fff;
}
.inhospital .dialog {
  display: flex;
  flex-direction: column;
  background: #ccc;
  position: fixed;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  padding: 5px;
  overflow: hidden;
}
.originBg {
  background: #fd9800;
  color: #fff;
}
.greenBg {
  background: #bfebaa;
  color: #fff;
}
.redBg {
  background: #ff192e;
  color: #fff;
}
</style>
