<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" @query="list(true)" :span="6">
      <template slot="insuranceOrgId">
        <medicalOrgList v-model="queryObj.insuranceOrgId" @change="medicalOrgChange"></medicalOrgList>
      </template>
      <template slot="btns">
        <div class="btns">
          <el-button @click="list(true)" type="primary" size="small">查询</el-button>
          <el-button @click="resetForm" size="small">重置</el-button>
          <slot name="extendButtons"></slot>
        </div>
      </template>
      <div></div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table
        :data="tableData"
        border
        stripe
        row-key="id"
        :expand-row-keys="firstExpandRows"
        class="medicalTable"
        @expand-change="handleExpandClick"
        v-loading="loading"
      >
        <el-table-column prop type="expand">
          <template slot-scope="scope">
            <!-- 第二层 -->
            <el-table
              border
              stripe
              :data="scope.row.children"
              row-key="id"
              :expand-row-keys="scope.row.expandedRows"
              empty-text="暂无数据"
              @expand-change="handleExpandClickInner"
              v-loading="scope.row.loading"
            >
              <el-table-column type="expand" fixed="left">
                <template slot-scope="scope">
                  <!-- 第三层 -->
                  <el-table
                    :data="scope.row.children"
                    border
                    stripe
                    empty-text="暂无数据"
                    v-loading="scope.row.loading"
                    @selection-change="handleSelection"
                  >
                    <el-table-column label="就诊登记ID" prop="registerId" show-overflow-tooltip></el-table-column>
                    <el-table-column label="住院号" prop="visitNumber"></el-table-column>
                    <el-table-column label="收费项目种类" prop="feeItemCategory"></el-table-column>
                    <el-table-column label="收费类别" prop="feeCategory">
                      <template slot-scope="scope">{{scope.row.feeCategory | chargeType}}</template>
                    </el-table-column>
                    <el-table-column label="处方号" prop="recipeNo"></el-table-column>
                    <el-table-column label="处方日期" prop="recipeDate">
                      <template slot-scope="scope">{{scope.row.recipeDate | formatDate}}</template>
                    </el-table-column>
                    <el-table-column label="医院收费项目内码" prop="hisCode" show-overflow-tooltip></el-table-column>
                    <el-table-column label="收费项目中心编码" prop="feeItemCentralCode"></el-table-column>
                    <el-table-column label="医院收费项目名称" prop="hisFeeItemName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="单价" prop="unitPrice"></el-table-column>
                    <el-table-column label="数量" prop="quantity"></el-table-column>
                    <el-table-column label="剂型" prop="dose"></el-table-column>
                    <el-table-column label="规格" prop="spec"></el-table-column>
                    <el-table-column label="每次用量" prop="dosage"></el-table-column>
                    <el-table-column label="使用频次" prop="frequency"></el-table-column>
                    <el-table-column label="医生姓名" prop="doctorName"></el-table-column>
                    <el-table-column label="处方医师" prop="recipeDoctorCode"></el-table-column>
                    <el-table-column label="用法" prop="usage"></el-table-column>
                    <el-table-column label="单位" prop="unit"></el-table-column>
                    <el-table-column label="科室名称" prop="deptName"></el-table-column>
                    <el-table-column label="执行天数" prop="days"></el-table-column>
                    <el-table-column label="草药单复方标志" prop="compoundFlag"></el-table-column>
                    <el-table-column label="经办人" prop="operator"></el-table-column>
                    <el-table-column label="药品剂量单位" prop="dosageUnit"></el-table-column>
                    <el-table-column label="科室编码" prop="deptCode"></el-table-column>
                    <el-table-column label="顺序号" prop="seq"></el-table-column>
                    <el-table-column label="金额" prop="amount">
                      <template slot-scope="scope">{{scope.row.amount | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="全额自费标志" prop="fullCostMark"></el-table-column>
                    <el-table-column label="最小使用单位" prop="minUsageUnit"></el-table-column>
                    <el-table-column label="是否怀孕" prop="isPregnant"></el-table-column>
                    <el-table-column label="是否哺乳期" prop="isLactation"></el-table-column>
                    <el-table-column label="医保返回处方明细ID" prop="prescriptionDetailId"></el-table-column>
                    <el-table-column label="医保返回金额" prop="returnAmount">
                      <template slot-scope="scope">{{scope.row.returnAmount | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="医保返回自理金额" prop="returnSelfCareAmount">
                      <template
                        slot-scope="scope"
                      >{{scope.row.returnSelfCareAmount | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="医保返回自费金额" prop="returnSelfPaymentAmount">
                      <template
                        slot-scope="scope"
                      >{{scope.row.returnSelfPaymentAmount | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="医保返回超限价自付金额" prop="returnOverLimitPaymentAmount">
                      <template
                        slot-scope="scope"
                      >{{scope.row.returnOverLimitPaymentAmount | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="医保返回收费项目等级" prop="returnChargingItemLevel"></el-table-column>
                    <el-table-column label="医保返回全额自费标志" prop="returnFullCostMark"></el-table-column>
                    <el-table-column label="医保返回自费原因" prop="returnFullCostReason"></el-table-column>
                    <el-table-column label="医保返回医保限价" prop="returnInsuranceLimitPrice">
                      <template
                        slot-scope="scope"
                      >{{scope.row.returnInsuranceLimitPrice | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="医保返回自付比例" prop="returnSelfPaymentRatio"></el-table-column>
                    <el-table-column label="操作" width="220px" fixed="right">
                      <template slot-scope="scope">
                        <slot name="thirdLayerRow" :thirdLayerRow="scope.row"></slot>
                      </template>
                    </el-table-column>
                  </el-table>
                  <ever-pagination
                    style="margin-right:220px;"
                    :current="scope.row.pageParams.current"
                    :pagesize="scope.row.pageParams.pagesize"
                    :page-sizes="scope.row.pageParams.pageSizes"
                    @size-change="handleSizeChange_inner($event,scope.row)"
                    @current-change="handleCurrentChange_inner($event,scope.row)"
                    :totalCount="scope.row.pageParams.totalCount"
                  ></ever-pagination>
                </template>
              </el-table-column>
              <el-table-column label="住院号" prop="visitNumber" show-overflow-tooltip></el-table-column>
              <el-table-column label="待结算费用总额" prop="settledTotalExpenses">
                <template slot-scope="scope">{{scope.row.settledTotalExpenses | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="开发商标识" prop="developerLogo"></el-table-column>
              <el-table-column label="费用结算ID" prop="settlementId"></el-table-column>
              <el-table-column label="费用总额" prop="totalFee" min-width="90">
                <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次帐户支付" prop="accountPay">
                <template slot-scope="scope">{{scope.row.accountPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹支付金额" prop="fundPay" min-width="90">
                <template slot-scope="scope">{{scope.row.fundPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="大病支付" prop="seriousDiseasePay">
                <template slot-scope="scope">{{scope.row.seriousDiseasePay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员补助一档支付" prop="servantSubsidyFirstPay">
                <template slot-scope="scope">{{scope.row.servantSubsidyFirstPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员补助二档支付" prop="servantSubsidySecondPay">
                <template
                  slot-scope="scope"
                >{{scope.row.servantSubsidySecondPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员补助支付" prop="servantSubsidyPay">
                <template slot-scope="scope">{{scope.row.servantSubsidyPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="伤残补助支付" prop="disabilitySubsidyPay">
                <template slot-scope="scope">{{scope.row.disabilitySubsidyPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次现金支付" prop="cashPay" min-width="120">
                <template slot-scope="scope">{{scope.row.cashPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="自费费用" prop="selfPay" min-width="120">
                <template slot-scope="scope">{{scope.row.selfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="乙类自理费用" prop="classBSelfExpense">
                <template slot-scope="scope">{{scope.row.classBSelfExpense | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="超限价自付费用" prop="limitCost">
                <template slot-scope="scope">{{scope.row.limitCost | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="符合基本医疗费用" prop="meetBasicMedicalExpenses" min-width="90">
                <template
                  slot-scope="scope"
                >{{scope.row.meetBasicMedicalExpenses | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="起付标准自付" prop="standardSelfPay">
                <template slot-scope="scope">{{scope.row.standardSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入统筹费用" prop="inFundPay" min-width="90">
                <template slot-scope="scope">{{scope.row.inFundPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹分段自付" prop="overallSelfPay">
                <template slot-scope="scope">{{scope.row.overallSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入大病费用" prop="inSeriousDiseasePay">
                <template slot-scope="scope">{{scope.row.inSeriousDiseasePay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入公补费用" prop="inPublicPay">
                <template slot-scope="scope">{{scope.row.inPublicPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="大病自付" prop="seriousDiseaseSelfPay">
                <template slot-scope="scope">{{scope.row.seriousDiseaseSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补第一档个人自付" prop="publicFirstSelfPay">
                <template slot-scope="scope">{{scope.row.publicFirstSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补第二档个人自付" prop="publicSecondSelfPay">
                <template slot-scope="scope">{{scope.row.publicSecondSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补个人自付" prop="publicPaidSelfPay">
                <template slot-scope="scope">{{scope.row.publicPaidSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="超封顶线自付" prop="overLineSelfPay">
                <template slot-scope="scope">{{scope.row.overLineSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="住院次数" prop="hosCount"></el-table-column>
              <el-table-column label="药品费用" prop="medicineFee" min-width="120">
                <template slot-scope="scope">{{scope.row.medicineFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="诊疗项目费用" prop="diagnosisAndTreatmentFee" min-width="90">
                <template
                  slot-scope="scope"
                >{{scope.row.diagnosisAndTreatmentFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="服务设施费用" prop="serviceFacilitiesFee">
                <template slot-scope="scope">{{scope.row.serviceFacilitiesFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="政策外药品" prop="outPolicyDrug" min-width="120">
                <template slot-scope="scope">{{scope.row.outPolicyDrug | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="政策外诊疗项目" prop="outPolicyDiagnoseAndTreatment">
                <template
                  slot-scope="scope"
                >{{scope.row.outPolicyDiagnoseAndTreatment | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="政策外服务设施" prop="outPolicyServiceFacilities">
                <template
                  slot-scope="scope"
                >{{scope.row.outPolicyServiceFacilities | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="产前检查费" prop="prenatalExaminationFee">
                <template slot-scope="scope">{{scope.row.prenatalExaminationFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="药品自理费用" prop="selfCareFee" min-width="120">
                <template slot-scope="scope">{{scope.row.selfCareFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="特检自理费用" prop="specialInspectionFee">
                <template slot-scope="scope">{{scope.row.specialInspectionFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="特治自理费用" prop="specialFee">
                <template slot-scope="scope">{{scope.row.specialFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="药品自费费用" prop="drugSelfPay" min-width="120">
                <template slot-scope="scope">{{scope.row.drugSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="检查自费费用" prop="inspectionSelfPay">
                <template slot-scope="scope">{{scope.row.inspectionSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="治疗自费费用" prop="treatmentSelfPay">
                <template slot-scope="scope">{{scope.row.treatmentSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="床位费超限价金额" prop="bedLimitAmount">
                <template slot-scope="scope">{{scope.row.bedLimitAmount | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补第一档标准" prop="publicSubsidyFirstStandard">
                <template
                  slot-scope="scope"
                >{{scope.row.publicSubsidyFirstStandard | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补第二档标准" prop="publicSubsidySecondStandard">
                <template
                  slot-scope="scope"
                >{{scope.row.publicSubsidySecondStandard | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹基金支付比例" prop="fundSelfPayRatio"></el-table-column>
              <el-table-column label="公补第一档比例" prop="publicSubsidyFirstRation">
                <template
                  slot-scope="scope"
                >{{scope.row.publicSubsidyFirstRation | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补第二档比例" prop="publicSubsidySecondRation">
                <template
                  slot-scope="scope"
                >{{scope.row.publicSubsidySecondRation | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹封顶线" prop="overallCappingLine" min-width="110">
                <template slot-scope="scope">{{scope.row.overallCappingLine | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本年统筹支付累计" prop="thisYearTotalPayment">
                <template slot-scope="scope">{{scope.row.thisYearTotalPayment | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹分段个人实际支付" prop="overallPlanningSelfPay">
                <template slot-scope="scope">{{scope.row.overallPlanningSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="住院床日" prop="hosDays"></el-table-column>
              <el-table-column label="医疗待遇类别" prop="medicalTreatmentCategory">
                <template slot-scope="scope">{{scope.row.medicalTreatmentCategory | medicalType}}</template>
              </el-table-column>
              <el-table-column label="账户余额" prop="accountBalance">
                <template slot-scope="scope">{{scope.row.accountBalance | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹区号" prop="fundAreaCode"></el-table-column>
              <el-table-column label=" 其他个人自费金额" prop="otherSelfPay">
                <template slot-scope="scope">{{scope.row.otherSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="其他个人自付金额" prop="otherSelfPocket">
                <template slot-scope="scope">{{scope.row.otherSelfPocket | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="中药报销提高" prop="chineseMedicineIncrease"></el-table-column>
              <el-table-column label="带量采购药品差价" prop="quantityPurchasedDifferencePrice">
                <template
                  slot-scope="scope"
                >{{scope.row.quantityPurchasedDifferencePrice | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="带量采购药品差价返还医院" prop="quantityPurchasedReturnPrice">
                <template
                  slot-scope="scope"
                >{{scope.row.quantityPurchasedReturnPrice | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="带量采购药品差价返还基金" prop="quantityPurchasedReturnFund">
                <template
                  slot-scope="scope"
                >{{scope.row.quantityPurchasedReturnFund | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="带量采购药品差价返还个人" prop="quantityPurchasedReturnPersonal">
                <template
                  slot-scope="scope"
                >{{scope.row.quantityPurchasedReturnPersonal | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="个人最终支付" prop="selfFinalPay">
                <template slot-scope="scope">{{scope.row.selfFinalPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="医院垫付标志位" prop="hospitalPayMark"></el-table-column>
              <el-table-column label="中央分娩补贴" prop="centralChildbirthSubsidy">
                <template
                  slot-scope="scope"
                >{{scope.row.centralChildbirthSubsidy | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="商业保险支付金额" prop="insurancePay">
                <template slot-scope="scope">{{scope.row.insurancePay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="民政救助金额" prop="civilPay">
                <template slot-scope="scope">{{scope.row.civilPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="扶贫慈善兜底" prop="charityPay">
                <template slot-scope="scope">{{scope.row.charityPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="备注" prop="remark"></el-table-column>
              <el-table-column label="操作" width="220" fixed="right">
                <template slot-scope="scope">
                  <slot name="innerOperations" :innerRow="scope.row"></slot>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="treatType" label="医疗类别" width="90">
          <template slot-scope="scope">{{scope.row.treatType | treatType}}</template>
        </el-table-column>
        <el-table-column prop="doctorType" label="人员类别">
          <template slot-scope="scope">{{scope.row.doctorType}}</template>
        </el-table-column>
        <el-table-column prop="visitNumber" label="住院号" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="personName" width="90" show-overflow-tooltip label="患者名称"></el-table-column>
        <el-table-column prop="cardNo" label="卡号" width="110"></el-table-column>
        <el-table-column prop="insuranceOrgName" show-overflow-tooltip label="保险机构"></el-table-column>
        <el-table-column prop="insuranceProductName" show-overflow-tooltip label="保险产品"></el-table-column>
        <el-table-column prop="sectionName" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drName" width="90" show-overflow-tooltip label="医生姓名"></el-table-column>
        <el-table-column prop="managerDate" label="挂号日期" width="90">
          <template slot-scope="scope">{{scope.row.managerDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="hospitalizedStartDate" label="入院日期" width="90">
          <template slot-scope="scope">{{scope.row.hospitalizedStartDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="inDiagnosisName" label="入院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hospitalizedEndDate" label="出院日期" width="90">
          <template slot-scope="scope">{{scope.row.hospitalizedEndDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="outDiagnosisName" label="出院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="macId" label="网卡地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tradeType" label="交易类型" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.tradeType | tradeType}}</template>
        </el-table-column>
        <el-table-column prop="operatorName" width="90" show-overflow-tooltip label="操作员"></el-table-column>
        <el-table-column prop="outprop7" label="操作" width="220">
          <template slot-scope="scope">
            <slot name="outOperations" :outRow="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </div>
</template>

<script>
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { tradeType } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { medicalType, chargeType, treatType, birthFeeType } from '@/rcm/otmdiscomponent/config-js/sysqzyy-config.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import list from '@/util/list'
let schema = [{
  label: '医保中心',
  name: 'insuranceOrgId',
  comp: 'custom'
},
{
  label: '患者名称',
  name: 'personName',
  comp: 'ever-patient-select',
  props: {
    useText: true
  },
  span: 6
},
{
  label: '住院号',
  name: 'visitNumber',
  span: 6
},
{
  label: '科室',
  name: 'sectionname',
  comp: 'everSubjectSelect',
  props: {
    type: 'select',
    fileds: ['id']
  },
  span: 6
},
{
  label: '挂号时间',
  name: 'managerDate',
  comp: 'everRangePicker',
  span: 6,
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '入院时间',
  name: 'inHospitalDate',
  comp: 'everRangePicker',
  span: 6,
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '出院时间',
  name: 'outHospitalDate',
  comp: 'everRangePicker',
  span: 6,
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '',
  labelWidth: '0',
  name: 'btns',
  comp: 'custom',
  col: {
    style: 'text-align:right;'
  },
  span: 24
}]
export default {
  mixins: [list],
  props: {
    api: {
      type: [Object],
      default: _ => { }
    },
    afterList: {
      type: [Function],
      default: _ => { }
    },
    // 第二层默认展开的数据,第三层的在第二层的row.expandedRows里面了
    firstExpandRows: {
      type: [Array],
      default: _ => []
    },
    // 第三层分页
    thirdPagination: {
      type: [Object],
      default: _ => {
        return {
          current: 1,
          pageSizes: [10, 20, 30, 50],
          pagesize: 20,
          offset: 0
        }
      }
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.insuranceOrgId = sysqzyyCode
    return {
      schema,
      queryObj,
      sysqzyyCode,
      loading: false,
      dateType: ['managerDate', 'inHospitalDate', 'outHospitalDate']
    }
  },
  methods: {
    list (flag) {
      this.loading = true
      let [dateTimeStart, dateTimeEnd] = this.queryObj.managerDate
      let [inHospitalDateStart, inHospitalDateEnd] = this.queryObj.inHospitalDate
      let [outHospitalDateStart, outHospitalDateEnd] = this.queryObj.outHospitalDate
      if (flag) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj, {
        insuranceOrgId: this.sysqzyyCode,
        dateTimeStart: this.timeFormat(dateTimeStart, true),
        dateTimeEnd: this.timeFormat(dateTimeEnd, false),
        inHospitalDateStart: this.timeFormat(inHospitalDateStart, true),
        inHospitalDateEnd: this.timeFormat(inHospitalDateEnd, false),
        outHospitalDateStart: this.timeFormat(outHospitalDateStart, true),
        outHospitalDateEnd: this.timeFormat(outHospitalDateEnd, false),
        pagesize: this.pagesize,
        offset: this.offset
      })
      this.filterParams(params)
      if (params.sectionname) {
        params.sectionname = params.sectionname.orgSubjectName
      }
      this.api['list'](params).then(res => {
        this.loading = false
        this.$emit('update:firstExpandRows', [])
        this.tableData = res.data.map(item => {
          item.children = []
          item.loading = false // 方便内层展开时使用loading
          item.expand = false
          return item
        })
        this.totalCount = res.totalSize
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    filterParams (params) {
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      this.dateType.forEach((key) => {
        if (!params[key] || params[key].length < 2) {
          delete params[key]
        }
      })
    },
    resetForm () {
      this.$refs.form.resetForm()
    },
    // 展开第二层事件
    handleExpandClick (row, expandedRows) {
      this.$emit('expandEvent', row, expandedRows)
    },
    // 展开第三层事件
    handleExpandClickInner (row, expandedRows) {
      this.$emit('expandThirdlayer', row, expandedRows)
    },
    handleSelection (selection) {
      this.$emit('selection-change', selection)
    },
    timeFormat (time, startOrEnd) {
      return time && this.$moment(time).format(`YYYYMMDD${startOrEnd ? `000000` : `235959`}`)
    },
    // 三层数据分页,每页显示数量变更
    handleSizeChange_inner (val, row) {
      row.pageParams.pagesize = val
      row.pageParams.current = 1 // 切换size时，自动重置current
      row.pageParams.offset = (row.pageParams.current - 1) * row.pageParams.pagesize
      this.$emit('thirdPaginationSizeChange', row)
    },
    // 三层数据分页,当前页码变更
    handleCurrentChange_inner (val, row) {
      row.pageParams.current = val
      row.pageParams.offset = (val - 1) * row.pageParams.pagesize || 0
      this.$emit('thirdPaginationCurrentChange', row)
    },
    // 医保机构切换
    medicalOrgChange (val) {
      this.$emit('medicalOrgChange', val)
    }
  },
  filters: {
    treatType (val) {
      let index = treatType.find(item => item.id === val)
      return index && index.name
    },
    tradeType (val) {
      let index = tradeType.find(item => item.id === val)
      return index && index.name
    },
    medicalType (val) {
      return medicalType[val]
    },
    chargeType (val) {
      let index = chargeType.find(item => item.id === val)
      return index && index.name
    },
    birthFeeType (val) {
      let index = birthFeeType.find(item => item.id === val)
      return index && index.name
    },
    formatDate (val) {
      return val && val.substring(0, 8)
    }
  },
  components: {
    medicalOrgList
  }
}
</script>
<style scoped>
.btns {
  margin-left: 15px;
}
.medicalTable /deep/ td.el-table__expanded-cell {
  padding: 0 0 10px 50px;
}
</style>
