<template>
  <div class="layout_inner">
    <ever-form2 ref="queryform" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="visitType">
        <ever-select :options="visitTypeOptions" v-model="queryObj.visitType" @select="list(true)"></ever-select>
      </template>
      <template slot="btns">
        <el-button type="primary" size="small" @click="list">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" border stripe>
      <el-table-column label="序号" prop type="index" width="60"></el-table-column>
      <el-table-column label="医疗类别" prop="curetype"></el-table-column>
      <el-table-column v-if="queryObj.visitType=='0'" label="门诊流水号" prop="visitNumber" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleShowDetail(scope.row)"
          >{{scope.row.visitNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="queryObj.visitType=='1'" label="住院流水号" prop="visitNumber" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleShowDetail(scope.row)"
          >{{scope.row.visitNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="queryObj.visitType=='2'" label="就诊流水号" prop="visitNumber" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleShowDetail(scope.row)"
          >{{scope.row.visitNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="收据号" prop="feeno" width="100"></el-table-column>
      <el-table-column label="交易类型" prop="dealype">
        <template slot-scope="scope">{{scope.row.dealype>0?'正交易':'负交易'}}</template>
      </el-table-column>
      <el-table-column label="结算日期" prop="tradedate" width="90">
        <template slot-scope="scope">{{scope.row.tradedate | timeFormatter}}</template>
      </el-table-column>
      <el-table-column
        label="诊断疾病编码"
        v-if="['0','2'].includes(queryObj.visitType)"
        prop="diagnosisCode"
      ></el-table-column>
      <el-table-column v-else label="出院疾病编码" prop="diagnosisCode"></el-table-column>
      <el-table-column
        v-if="['0','2'].includes(queryObj.visitType)"
        label="诊断疾病名称"
        prop="diagnosisName"
      ></el-table-column>
      <el-table-column v-else label="出院诊断疾病名称" prop="diagnosisName"></el-table-column>
      <el-table-column label="科室名称" prop="sectionname"></el-table-column>
      <el-table-column v-if="queryObj.visitType=='0'" width="90" label="就诊时间" prop="billdate">
        <template slot-scope="scope">{{scope.row.billdate | timeFormatter}}</template>
      </el-table-column>
      <el-table-column v-else label="入院时间" width="90" prop="billdate">
        <template slot-scope="scope">{{scope.row.billdate | timeFormatter}}</template>
      </el-table-column>
      <el-table-column v-if="queryObj.visitType=='0'" width="90" label="就诊结束时间" prop="endBilldate"></el-table-column>
      <el-table-column v-else label="出院时间" width="90" prop="endBilldate">
        <template slot-scope="scope">{{scope.row.endBilldate | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="费用合计" prop="totalFee">
        <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="账户支付" prop="personCountpay">
        <template slot-scope="scope">{{scope.row.personCountpay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="统筹支付" prop="overallPay">
        <template slot-scope="scope">{{scope.row.overallPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="个人支付" prop="selfpay">
        <template slot-scope="scope">{{scope.row.selfpay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="公务员统筹支付" prop="functionarySubsidyPay">
        <template slot-scope="scope">{{scope.row.functionarySubsidyPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="离休统筹支付" prop="leaveSubsidyPay">
        <template slot-scope="scope">{{scope.row.leaveSubsidyPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="工伤统筹支付" prop="injuryJobFee">
        <template slot-scope="scope">{{scope.row.injuryJobFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="生育统筹支付" prop="babyFee">
        <template slot-scope="scope">{{scope.row.babyFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="本次事业工伤统筹支付" prop="thisInjuryJobFee">
        <template slot-scope="scope">{{scope.row.thisInjuryJobFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="本次照顾费统筹支付" prop="thisTakeFee">
        <template slot-scope="scope">{{scope.row.thisTakeFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="目录内费用合计" prop="basicMedicalFee">
        <template slot-scope="scope">{{scope.row.basicMedicalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="起付线" prop="minFee">
        <template slot-scope="scope">{{scope.row.minFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="基本医疗是否封顶" prop="isCapp">
        <template slot-scope="scope">{{scope.row.isCapp>0?'已封顶':'未封顶'}}</template>
      </el-table-column>
      <el-table-column label="单病种标志" prop="diseaseSpeciesSettlement">
        <template slot-scope="scope">{{scope.row.diseaseSpeciesSettlement==0?'否':'是'}}</template>
      </el-table-column>
      <el-table-column v-if="queryObj.visitType<2" label="结算人次" prop="settlementPersonTimes"></el-table-column>
      <el-table-column v-if="queryObj.visitType<2" label="本次定点医疗机构分担" prop="medicalFee">
        <template slot-scope="scope">{{scope.row.medicalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column v-if="queryObj.visitType<2" label="本次商业保险支付金额" prop="commercialFee">
        <template slot-scope="scope">{{scope.row.commercialFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.dealype>0"
            type="primary"
            size="small"
            @click="deleteSettleInfo(scope.row)"
          >删除结算信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
    <detail-dialog v-if="showDetail" :visible.sync="showDetail" :params="currentRow"></detail-dialog>
  </div>
</template>

<script>
import { querySettleInfo, queryHosInfo, queryAll, deleteSettleInfo } from '@/rcm/store/otmdiscomponent/jljh-api.js'
import { jljhCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import list from '@/util/list'
import DetailDialog from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/settlement-detail.vue'
import personno from '@/rcm/otmdiscomponent/personno.vue'
const schema = [{
  label: '个人编号',
  name: 'personno',
  comp: personno,
  props: {
    insuranceOrgId: jljhCode
  },
  span: 6
},
{
  label: '查询时间',
  name: 'queryDate',
  comp: 'everRangePicker',
  span: 6,
  props: {
    defaultTime: [],
    noclear: true,
    autoWidth: true
  }
},
{
  label: '就诊类型',
  name: 'visitType',
  comp: 'custom',
  span: 6
},
{
  label: '',
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom',
  span: 6
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let endDay = this.$moment()
    let startDay = this.$moment(endDay).add('month', -1)
    queryObj.queryDate = [startDay, endDay]
    queryObj.visitType = '2'
    queryObj.requestSwitch = true
    return {
      schema,
      queryObj,
      rules: {
        personno: [{
          required: true,
          message: '请先选择个人编号',
          trigger: 'change'
        }]
      },
      tableData: [],
      visitTypeOptions: [{
        id: '0',
        name: '门诊结算'
      },
      {
        id: '1',
        name: '住院结算'
      },
      {
        id: '2',
        name: '全部'
      }],
      showDetail: false,
      currentRow: {},
      insuranceOrgId: jljhCode,
      hospitalNo: orgList[jljhCode]['HosCode']
    }
  },
  methods: {
    list (refresh) {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (refresh) {
            this.current = 1
            this.offset = 0
          }
          var params = Object.assign({ macId: this.macId, insuranceOrgId: this.insuranceOrgId, hospitalNo: this.hospitalNo }, this.queryObj)
          if (this.queryObj.queryDate && this.queryObj.queryDate.length > 0) {
            params.startDay = this.$moment(this.queryObj.queryDate[0]).format('YYYYMMDD')
            params.endDay = this.$moment(this.queryObj.queryDate[1]).format('YYYYMMDD')
          }
          this.listApiName(params).then(res => {
            this.tableData = res.data && res.data.infos
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    handleShowDetail (row) {
      this.currentRow = row
      this.showDetail = true
    },
    deleteSettleInfo (row) {
      const confirmMessage = `<span style="display:inline-block;float:left;margin-right:15px;">
          <i class="icon iconfont icon-yuangan" style="font-size:60px;vertical-align:-0.7em;color:orange;"></i>
        </span>
        <span>
          注：本操作会删除医保段结算记录；删除操作后需要继续结算，请确认是否继续！
        </span>
      </div>`
      this.$confirm(confirmMessage, {
        center: true,
        dangerouslyUseHTMLString: true
      }).then(_ => {
        let params = {
          visitNumber: row.visitNumber,
          feeno: row.feeno,
          treatType: row.curetype,
          tradedate: row.tradedate,
          managerName: this.$store.state.currentUser.name,
          macId: this.macId,
          insuranceOrgId: this.insuranceOrgId
        }
        deleteSettleInfo(params).then(res => {
          this.$messageTips(this, 'success', '操作成功')
          this.list()
        }).catch((err) => {
          console.log('err', err)
        })
      })
    }
  },
  computed: {
    listApiName () {
      switch (this.queryObj.visitType) {
        case '0':
          return querySettleInfo
        case '1':
          return queryHosInfo
        case '2':
          return queryAll
        default:
          return queryAll
      }
    }
  },
  components: {
    DetailDialog,
    personno
  },
  filters: {
    timeFormatter (val) {
      return val && val.substring(0, 8)
    }
  }
}
</script>
<style scoped>
.el-message-box__message p div.iconLeft {
  float: left;
}
.el-message-box__message p div.messageRight {
  float: right;
}
</style>
