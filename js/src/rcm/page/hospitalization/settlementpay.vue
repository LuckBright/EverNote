<template>
  <div class="layout_inner">
    <ever-form2 :schema="schema" v-model="queryObj">
      <template slot="patientId">
        <ever-patient-select v-model="patientId" @select="handleSelect"></ever-patient-select>
      </template>
      <div></div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" border stripe>
        <el-table-column label="操作" prop>
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status>=4&&scope.row.status<=8"
              type="primary"
              size="small"
              @click="goToPay(scope.row)"
            >结算收费</el-button>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="patientName" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="年龄" prop="ageShowText" width="90"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">{{scope.row.sex | formatSex}}</template>
        </el-table-column>
        <el-table-column label="押金状态" prop>
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.admitDepositStatus"
              size="mini"
              :class="className[scope.row.admitDepositStatus]"
            >{{ depositStatus[scope.row.admitDepositStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="医保类型" prop="insuranceCompanyName" width="120"></el-table-column>
        <el-table-column label="人员类别" prop="personTypeName"></el-table-column>
        <el-table-column label="病案号" prop="inpatientNumber" width="150"></el-table-column>
        <el-table-column label="患者状态" prop="status">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="科室" prop="admitDeptName" width="90"></el-table-column>
        <el-table-column label="病区" prop="inWardName" width="90"></el-table-column>
        <el-table-column label="床位" prop="inBedName"></el-table-column>
        <el-table-column label="入院时间" prop="admitTime" width="160"></el-table-column>
        <el-table-column label="出院时间" prop="dischargeTime" width="160"></el-table-column>
        <el-table-column label="住院天数" prop="admitDays"></el-table-column>
        <el-table-column label="联系电话" prop="mobile" width="120"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import list from '@/util/list'
import { depositStatus, className, chargeStatus, hosStatus } from '@/rcm/page/hospitalization/hospitalization-config.js'
import { getPatientList } from '@/rcm/store/hospital/hospital'
import pay from '@/rcm/page/pay/payhospitalization'
const schema = [{
  label: '患者姓名',
  labelWidth: '80px',
  name: 'patientId',
  comp: 'custom',
  span: 6
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom',
  span: 6
}]
export default {
  mixins: [list],
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      patientId: '',
      depositStatus,
      className,
      chargeStatus,
      tableData: [],
      api: {
        list: getPatientList
      },
      // 过滤可以结算的数据
      listParams: {
        statusList: ['4', '5', '6', '7', '8']
      },
      obj: {
        // 弹窗类型1押金2收费
        FeeType: 1,
        settleCode: '', // 结算单号
        id: '', // 结算单id
        isDeposit: 1, // 是押金
        unexefee: 0,
        totalFee: 0,
        paymethodArr: [],
        payObj: {
          paymethod: 1,
          remark: '',
          flowfee: 0,
          auth_code: ''
        },
      },
      dialogVisible: false
    }
  },
  methods: {
    handleSelect (item) {
      this.queryObj.patientId = item.id
      this.list(true)
    },
    goToPay (row) {
      this.$router.push({
        path: '/adt/hospitalSettle/settlementPay/detail',
        query: {
          patientId: row.patientId,
          ipNo: row.hospitalizedNumber,
          ipStatus: row.status,
          providerId: row.admitDeptId,
        }
      })
    }
  },
  filters: {
    formatStatus (val) {
      return hosStatus[val]
    }
  },
  components: {
    pay
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
.main-wrap {
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
