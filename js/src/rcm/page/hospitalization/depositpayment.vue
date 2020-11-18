<template>
  <div class="layout_inner">
    <ever-form2 :schema="schema" v-model="queryObj">
      <template slot="patientId">
        <ever-patient-select v-model="patientId" :allowCreate="true" @select="handleSelect"></ever-patient-select>
      </template>
      <div></div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column label="患者姓名" prop="patientName" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="押金余额" prop="accountBill">
          <template slot-scope="scope">{{scope.row.accountBill | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="押金状态" prop width="89">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.admitDepositStatus"
              size="mini"
              :class="className[scope.row.admitDepositStatus]"
            >{{ depositStatus[scope.row.admitDepositStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="患者状态" prop="status">
          <template slot-scope="scope">{{scope.row.status | formatStatus(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="年龄" prop="ageShowText"></el-table-column>
        <el-table-column label="性别" width="55">
          <template slot-scope="scope">{{scope.row.sex | formatSex}}</template>
        </el-table-column>
        <el-table-column label="住院号" prop="hospitalizedNumber"></el-table-column>
        <el-table-column label="科室" prop="admitDeptName"></el-table-column>
        <el-table-column label="病区" prop="inWardName"></el-table-column>
        <el-table-column label="操作" prop width="180">
          <template slot-scope="scope">
            <el-button
              v-if="chargeStatus.includes(`${scope.row.status}`)"
              type="primary"
              size="small"
              @click="payDeposit(scope.row)"
            >缴押金</el-button>
            <el-button type="primary" size="small" @click="depositDetail(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <pay :obj="obj" v-if="dialogVisible" :dialogVisible.sync="dialogVisible" @getdata="getdata"></pay>
  </div>
</template>

<script>
import list from '@/util/list'
import { everprint } from '@/util/common'
import { depositStatus, className, chargeStatus, hosStatus } from '@/rcm/page/hospitalization/hospitalization-config.js'
import { getPatientList, payDepositInBack } from '@/rcm/store/hospital/hospital'
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
    queryObj.statusList = chargeStatus
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
    payDeposit (row) {
      // 生成补缴押金的结算单
      let params = {
        patientId: row.patientId,  // 患者id
        ipNo: row.hospitalizedNumber, // 住院流水号
        fee: 0
      }
      payDepositInBack(params).then(data => {
        if (data.data) {
          this.obj.settleCode = data.data.settleCode
          this.obj.id = data.data.id
          this.obj.patientId = row.patientId
          this.obj.isDeposit = 1 // 是押金
          this.obj.unexefee = 0
          this.obj.totalFee = 0
          // 20200401，由于补缴押金设计缺陷，改成统一使用支付方式一支付，不再接受配置，bug26270
          this.dialogVisible = true
        } else {
          this.$notify({
            message: '补缴押金生成结算单失败'
          })
        }
      })
    },
    getdata () {
      this.dialogVisible = false
      this.$messageTips(this, 'success', '操作成功')
      setTimeout(() => {
        this.settlePrint(this.obj.id)
        this.list()
      }, 500)
    },
    async settlePrint (settlementId) {
      everprint('thc_rcm.ipdepositprint', { id: settlementId }, { preview: true })
    },
    depositDetail (row) {
      this.$router.push({
        path: '/adt/hospitalSettle/depositPayment/detail',
        query: {
          patientId: row.patientId,
          ipNo: row.hospitalizedNumber,
          ipStatus: row.status
        }
      })
    }
  },
  filters: {
    formatStatus (val, row) {
      return `${hosStatus[val]}${val === 2 && !row.admitDepositStatus ? '(未登记)' : ''}`
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
