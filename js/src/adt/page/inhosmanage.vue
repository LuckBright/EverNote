<template>
  <div class="inhospital">
    <top-search @change="getInfoList" ref="searchRef" :flag="'inhospaital'"></top-search>
    <div class="table-box flex_col_1_hidden main-wrap">
      <el-table :data="tableData" :border="true" style="width: 100%">
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="manageBtn(scope.row)">操作</el-button>
            <el-button type="text" size="small" @click="deposit(scope.row)">押金管理</el-button>
            <el-button type="text" size="small" @click="cost(scope.row)">费用明细</el-button>
            <span
              class="tipStyle"
              v-if="Boolean(scope.row.promptDays) != ''"
            >{{scope.row.promptDays}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="姓名" width="100"></el-table-column>
        <el-table-column label="年龄" width="100">
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
        <el-table-column prop="inDeptName" label="科室" width="100"></el-table-column>
        <el-table-column prop="inWardName" label="病区" width="100"></el-table-column>
        <el-table-column prop="inBedName" label="床位" width="100"></el-table-column>
        <el-table-column prop="admitTime" label="入院时间" width="170"></el-table-column>
        <el-table-column prop="admitDays" label="住院天数" width="80"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" width="140"></el-table-column>
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
      tableData: [],
      total: 0,
      offset: 1,
      pagesize: 20,
      statusInfo: {
        3: '待入科',
        4: '已入科',
        5: '待转科',
        // 6: '待出科',
        7: '已出科',
        12: '退科'
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
      rowValue: ''
    }
  },
  components: {
    topSearch
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
    getInfoList (filterModel) {
      filterModel.inHosDate = filterModel.inHosDate === null ? '' : filterModel.inHosDate
      let params = {
        offset: (this.offset - 1) * this.pagesize,
        pagesize: this.pagesize,
        startDate: filterModel.inHosDate[0],
        endDate: filterModel.inHosDate[1]
      }
      params = Object.assign({}, params, filterModel)
      api.getSearchInhos(params).then(res => {
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
      let rcmObj = {
        id: row.id,
        patientId: row.patientId,
        ipNo: row.hospitalizedNumber,
        ipStatus: row.status,
        providerId: row.admitDeptId,
        settlementId: row.settlementId,
        ipSettleStatus: row.ipSettleStatus
      }
      this.$router.push({
        path: 'patientdialog',
        query: rcmObj
      })
    },
    deposit (row) {
      this.$router.push({
        path: 'hospitalSettle/depositPayment/detail',
        query: {
          patientId: row.patientId,
          ipNo: row.hospitalizedNumber,
          ipStatus: row.status
        }
      })
    },
    cost (row) {
      this.$router.push({
        path: 'hospitalSettle/settlementPay/detail',
        query: {
          patientId: row.patientId,
          ipNo: row.hospitalizedNumber,
          ipStatus: row.status,
          providerId: row.inDeptId
        }
      })
    }
  }
}
</script>
<style scoped>
.inhospital {
  height: calc(100% - 20px);
  background: white;
  padding: 10px 5px;
  overflow: auto;
}
.inhospital .table-box {
  overflow: auto;
  margin: 20px;
}
.inhospital .table-box .tipStyle {
  padding: 1px 3px;
  background: #c5c5c5;
  border-radius: 2px;
  color: #fff;
}
.inhospital .dialog {
  background: #ccc;
  position: fixed;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  padding: 5px;
  overflow: auto;
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
