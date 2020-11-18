<template>
  <div class="layout_inner">
    <div class="tableUpper">
      <ever-form2 :schema="schema" v-model="queryObj" label-width="80px">
        <template slot="btns">
          <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        </template>
        <div></div>
      </ever-form2>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        :highlight-current-row="true"
        @row-click="rowClick"
      >
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="register(scope.row)">登记</el-button>
            <el-button type="primary" size="small" @click="detail(scope.row)">明细</el-button>
            <el-button type="primary" size="small" @click="approval(scope.row)">审批</el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="scope.row.settleStatus==1"
              @click="deleteApproval(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="卡号" prop="icCard"></el-table-column>
        <el-table-column label="医保流水号" prop="medicareSerialNo" show-overflow-tooltip></el-table-column>
        <el-table-column label="门诊号" prop="visitNumber" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" prop="name" width="90"></el-table-column>
        <el-table-column label="性别" prop="sex" width="60">
          <template slot-scope="scope">{{scope.row.sex | formatSex}}</template>
        </el-table-column>
        <el-table-column label="出生日期" prop="birthday"></el-table-column>
        <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip></el-table-column>
        <el-table-column label="人员身份" prop="treatmentTypeName"></el-table-column>
        <el-table-column label="单位编码" prop="unitNo" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="warningStatus">
          <template slot-scope="scope">{{scope.row.warningStatus | warningStatus}}</template>
        </el-table-column>
        <el-table-column label="审核时间" prop="approvalTime"></el-table-column>
        <el-table-column label="审核原因" prop="approvalReason"></el-table-column>
        <el-table-column label="就诊时间" prop="visitTime" width="160" :formatter="timeFormatter"></el-table-column>
        <el-table-column label="诊断" prop="diagnose"></el-table-column>
        <el-table-column label="医生" prop="doctorName"></el-table-column>
        <el-table-column label="就诊科室" prop="visitDept"></el-table-column>
        <el-table-column label="结算状态" prop="settleStatus">
          <template slot-scope="scope">{{scope.row.settleStatus | settleStatus}}</template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :current="current"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
    <div class="tableLower">
      <div class="discription">
        <div class="titleLeft">费用明细</div>
        <div class="btnRight">
          <el-button type="primary" size="small" @click="showDetail">查看门诊消费</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="detailTable">
        <el-table :data="detailData" border stripe>
          <el-table-column label="收费类别" prop="chargeTypeName"></el-table-column>
          <el-table-column label="项目等级" prop="chargeItemLevel">
            <template slot-scope="scope">{{scope.row.chargeItemLevel | convertLevel}}</template>
          </el-table-column>
          <el-table-column label="编码" prop="number" show-overflow-tooltip></el-table-column>
          <el-table-column label="名称" prop="name" min-width="200px"></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="数量" prop="count"></el-table-column>
          <el-table-column label="金额" prop="amount">
            <template slot-scope="scope">{{scope.row.amount | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="自付比例" prop="personalPayRate"></el-table-column>
          <el-table-column label="自付金额" prop="personalPay">
            <template slot-scope="scope">{{scope.row.personalPay | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="支付限额" prop="limitPay"></el-table-column>
          <el-table-column label="医保内费用" prop="medicareFee">
            <template slot-scope="scope">{{scope.row.medicareFee | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="医保外费用" prop="medicareOutFee">
            <template slot-scope="scope">{{scope.row.medicareOutFee | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="剂型编码" prop="doseCode"></el-table-column>
          <el-table-column label="每次用量" prop="dosage"></el-table-column>
          <el-table-column label="使用频次" prop="useFrequency"></el-table-column>
          <el-table-column label="执行天数" prop="executeDays"></el-table-column>
        </el-table>
      </div>
      <div class="summary">
        <span class="labelText">费用合计：</span>
        <span class="salary">{{totalFee | formatToFinacial}}</span>
        <span class="labelText">医保内：</span>
        <span class="salary">{{medicalSum | formatToFinacial}}</span>
        <span class="labelText">医保外：</span>
        <span class="salary">{{medicalOutSum | formatToFinacial}}</span>
      </div>
    </div>
    <!-- 审批原因 -->
    <approval-reason
      v-if="ReasonShow"
      :reasonShow.sync="ReasonShow"
      :currentRow="currentRow"
      @approval-success="approvalSuccess"
    ></approval-reason>
    <!-- 门诊消费明细 -->
    <resumeDetail
      v-if="resumeDetailShow"
      :resumeDetailShow.sync="resumeDetailShow"
      :currentRow="currentRow"
    ></resumeDetail>
  </div>
</template>

<script>
import list from '@/util/list'
import approvalReason from '@/rcm/otmdiscomponent/hljmedical/approvalreason.vue'
import { prewarnList, prewarnReg, prewarnDetail, prewarnDelete } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { warningStatus, settleStatus } from '@/rcm/otmdiscomponent/config-js/hlj-base-config.js'
import resumeDetail from '@/rcm/otmdiscomponent/hljmedical/resumeDetail.vue'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
const schema = [{
  label: '保险机构',
  name: 'insuranceOrgId',
  comp: medicalOrgList,
  span: 4
},
{
  label: '登记时间',
  name: 'registerTime',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  },
  span: 4
},
{
  label: '预警状态',
  name: 'warningStatus',
  comp: 'ever-select',
  props: {
    options: warningStatus
  },
  span: 4
},
{
  label: '结算状态',
  name: 'settleStatus',
  comp: 'ever-select',
  props: {
    options: settleStatus
  },
  span: 4
},
{
  label: '患者',
  name: 'patientId',
  comp: 'everPatientSelect',
  span: 4
},
{
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom',
  span: 4
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.startTime = ''
    queryObj.endTime = ''
    return {
      schema,
      queryObj,
      tableData: [],
      detailData: [],
      currentRow: null,
      ReasonShow: false, // 审批原因
      resumeDetailShow: false, // 门诊消费明细
      api: {
        list: prewarnList
      },
      loading: false,
      lowerLoading: false
    }
  },
  methods: {
    rowClick (row, column, event) {
      this.currentRow = row
    },
    register (row) {
      this.currentRow = row
      let params = {
        personalNo: row.personalNo,
        name: row.name,
        idCard: row.idCard,
        icCard: row.icCard,
        deptName: row.visitDept,
        doctorName: row.doctorName,
        macId: this.macId
      }

      this.loading = true
      prewarnReg(params).then(res => {
        this.loading = false
        this.list(false)
      }, err => {
        console.log('err', err)
        this.loading = false
      })
    },
    detail (row) {
      this.lowerLoading = true
      this.currentRow = row
      let params = {
        personalNo: row.personalNo,
        outpatientSerialNo: row.medicareSerialNo,
        macId: this.macId
      }
      prewarnDetail(params).then(res => {
        this.detailData = res.data
        this.lowerLoading = false
      }, err => {
        console.log('err', err)
        this.lowerLoading = false
      })
    },
    approval (row) {
      this.currentRow = row
      this.ReasonShow = true
    },
    deleteApproval (row) {
      this.currentRow = row
      let params = {
        settlementId: row.settlementId,
        personalNo: row.personalNo,
        outpatientSerialNo: row.visitNumber,
        macId: this.macId
      }
      prewarnDelete(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.list()
      }, err => {
        console.log('err', err)
      })
    },
    // 查看明细
    showDetail () {
      if (!this.currentRow) {
        this.$messageTips(this, 'error', '请先选择一行')
        return false
      }
      this.resumeDetailShow = true
    },
    // 审批成功
    approvalSuccess (reason) {
      this.list()
    },
    timeFormatter (row, column, cellValue, index) {
      return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  watch: {
    'queryObj.registerTime': {
      handler: function (val) {
        let [startDay, endDay] = val
        this.queryObj.startTime = startDay && this.$moment(startDay).format('YYYY-MM-DD HH:mm:ss')
        this.queryObj.endTime = endDay && this.$moment(endDay).format('YYYY-MM-DD HH:mm:ss')
      },
      immediate: true
    }
  },
  computed: {
    totalFee () {
      return this.medicalSum + this.medicalOutSum
    },
    medicalSum () {
      return this.detailData.reduce((total, item) => {
        total += item.medicareFee
        return total
      }, 0)
    },
    medicalOutSum () {
      return this.detailData.reduce((total, item) => {
        total += item.medicareOutFee
        return total
      }, 0)
    }
  },
  filters: {
    warningStatus (val) {
      let result = warningStatus.find(item => item.id === val)
      return result && result.name
    },
    settleStatus (val) {
      let result = settleStatus.find(item => item.id === val)
      return result && result.name
    },
    convertLevel (val) {
      switch (val) {
        case '1':
          return '甲级'
        case '2':
          return '乙级'
        case '3':
          return '丙级'
        default:
          return '--'
      }
    }
  },
  components: {
    approvalReason,
    resumeDetail,
    medicalOrgList
  }
}
</script>
<style scoped>
.titleLeft {
  float: left;
  font-weight: bold;
  line-height: 32px;
}
.btnRight {
  float: right;
}
.summary {
  text-align: right;
}
</style>
