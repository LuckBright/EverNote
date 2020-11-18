<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :span="6" @query="list(true)">
      <template slot="insuranceOrgId">
        <medicalOrgList v-model="queryObj.insuranceOrgId" @change="medicalOrgChange"></medicalOrgList>
      </template>
      <template slot="btns">
        <div class="btns">
          <el-button @click="list(true)" type="primary" size="small">查询</el-button>
          <el-button @click="resetForm" size="small">重置</el-button>
          <el-button type="primary" size="small" @click="presettleTimer">上传病案</el-button>
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
                  >
                    <el-table-column label="项目名称" prop="hisItemName"></el-table-column>
                    <el-table-column label="项目编码" prop="hisItemCode"></el-table-column>
                    <el-table-column label="剂型" prop="hisDosageForm"></el-table-column>
                    <el-table-column label="规格" prop="hisSpec"></el-table-column>
                    <el-table-column label="单价" prop="unitPrice"></el-table-column>
                    <el-table-column label="数量" prop="quantity"></el-table-column>
                    <el-table-column label="金额" prop="fee"></el-table-column>
                    <el-table-column label="项目等级" prop="chargeLevelName"></el-table-column>
                    <el-table-column label="计费时间" prop="accountTime"></el-table-column>
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
              <el-table-column label="结算单号" show-overflow-tooltip prop="settlementCode"></el-table-column>
              <el-table-column label="住院总金额" prop="totalFee"></el-table-column>
              <el-table-column label="社保支付金额" show-overflow-tooltip prop="medFundFee"></el-table-column>
              <el-table-column label="账户支付金额" prop="medPersonCountFee"></el-table-column>
              <el-table-column label="部分项目自付金额" prop="partItemSelfPay"></el-table-column>
              <el-table-column label="个人起付金额" prop="payLimit"></el-table-column>
              <el-table-column label="个人自费项目金额" prop="selfPayItemFee"></el-table-column>
              <el-table-column label="个人自付金额" prop="selfPayFee"></el-table-column>
              <el-table-column label="个人自负金额" prop="cash"></el-table-column>
              <el-table-column label="超统筹支付限额个人自付金额" prop="overallPayFee"></el-table-column>
              <el-table-column label="自费原因" prop="selfPayReason"></el-table-column>
              <el-table-column label="医疗机构分担金额" prop="hosPayFee"></el-table-column>
              <el-table-column label="结算日期" prop="settleDate"></el-table-column>
              <!-- <el-table-column label="操作" width="220" fixed="right">
                <template slot-scope="scope">
                  <slot name="innerOperations" :innerRow="scope.row"></slot>
                </template>
              </el-table-column> -->
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="treatType" label="医疗类别" width="90">
          <template slot-scope="scope">{{scope.row.treatType | treatType}}</template>
        </el-table-column>
        <el-table-column prop="visitNumber" label="就医登记号" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            {{scope.row.extendInfo && scope.row.extendInfo.jYDJH}}
          </template>
        </el-table-column>
        <el-table-column prop="insuranceHospitalizedNumber" label="医保住院号" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="personName" width="90" show-overflow-tooltip label="患者名称"></el-table-column>
        <el-table-column prop="cardNo" label="卡号" width="100"></el-table-column>
        <el-table-column prop="insuranceOrgName" show-overflow-tooltip label="保险机构"></el-table-column>
        <el-table-column prop="insuranceProductName" show-overflow-tooltip label="保险产品"></el-table-column>
        <el-table-column prop="uploadCaseStatus" label="医保类别" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.insuranceType | insuranceType}}</template>
        </el-table-column>
        <el-table-column prop="sectionName" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drName" width="90" show-overflow-tooltip label="门诊医生"></el-table-column>
        <el-table-column prop="managerDate" label="挂号日期" width="90"></el-table-column>
        <el-table-column prop="hospitalizedStartDate" label="入院日期" width="100"></el-table-column>
        <el-table-column prop="hospitalizedEndDate" label="出院日期" width="100"></el-table-column>
        <el-table-column prop="inDiagnosisName" label="入院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="outDiagnosisName" label="出院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uploadCaseStatus" label="病案状态" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.uploadCaseStatus | uploadCaseStatus}}</template>
        </el-table-column>
        <el-table-column prop="uploadCaseErrorMessage" show-overflow-tooltip label="失败原因" width="120"></el-table-column>
        <el-table-column prop="" label="网卡地址" show-overflow-tooltip></el-table-column>
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
    <medical-record-log
      v-if="medicalRecordVisi"
      :medicalRecordVisi.sync="medicalRecordVisi"
      :paramObj="queryObj"
    ></medical-record-log>
  </div>
</template>

<script>
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { settleStatus, tradeType, invoiceType, uploadStatus, uploadTradeType, medicalChargeLevel, medSettleTradeType, personType } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { gdcfybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import medicalRecordLog from './medical-record-log.vue'
import list from '@/util/list'
let schema = [
  {
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
  },
  {
    label: '住院号',
    name: 'visitNumber'
  },
  {
    label: '科室',
    name: 'sectionname',
    comp: 'everSubjectSelect',
    props: {
      type: 'select',
      fileds: ['id']
    }
  },
  {
    label: '挂号时间',
    name: 'managerDate',
    comp: 'everRangePicker',
    props: {
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    label: '交易类型',
    name: 'tradeType',
    comp: 'everSelect',
    props: {
      options: [],
      clearable: true
    }
  },
  {
    label: '病案状态',
    name: 'uploadCaseStatus',
    comp: 'everSelect',
    props: {
      options: [
        {id: '1', name: '已上传'},
        {id: '0', name: '未上传'}
      ],
      clearable: true
    }
  },
  {
    label: '',
    labelWidth: '0',
    name: 'btns',
    comp: 'custom',
    col: {
      style: 'text-align:right;'
    }
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
    },
    // 是否用在医保中心
    usedInMedicalCenter: Boolean
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.insuranceOrgId = gdcfybCode
    return {
      schema,
      queryObj,
      loading: false,
      dateType: ['managerDate'],
      medicalRecordVisi: false
    }
  },
  created () {
    this.$ever.getFieldFromSchema(
          this.schema,
          'tradeType'
        ).props.options = tradeType
  },
  methods: {
    list (flag) {
      this.loading = true
      let [dateTimeStart, dateTimeEnd] = this.queryObj.managerDate
      if (flag) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj, {
        dateTimeStart: this.timeFormat(dateTimeStart),
        dateTimeEnd: this.timeFormat(dateTimeEnd),
        pagesize: this.pagesize,
        offset: this.offset
      })
      this.filterParams(params)
      if (params.sectionname) {
        params.sectionname = params.sectionname.orgSubjectName
      }
      if (params.uploadCaseStatus) {
        params.uploadCaseStatus = params.uploadCaseStatus === '1'
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
    timeFormat (time) {
      return time && this.$moment(time).format(`YYYYMMDD`)
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
    },
    presettleTimer () {
      this.medicalRecordVisi = true
    }
  },
  filters: {
    treatType (val) {
      return val === '21' ? '普通住院' : val === '25' ? '门诊住院' : ''
    },
    insuranceType (val) {
      return val === 1 ? '本地' : val === 2 ? '异地' : ''
    },
    uploadCaseStatus (val) {
      return val ? '已上传' : '未上传'
    },
    settleStatus (val) {
      return settleStatus[val]
    },
    tradeType (val) {
      let index = tradeType.find(item => item.id === val)
      return index && index.name
    },
    invoiceType (val) {
      return invoiceType[val]
    },
    uploadStatus (val) {
      return uploadStatus[val]
    },
    uploadTradeType (val) {
      return uploadTradeType[val]
    },
    medicalChargeLevel (val) {
      return medicalChargeLevel[val]
    },
    medSettleTradeType (val) {
      return medSettleTradeType[val]
    },
    personType (val) {
      return personType[val]
    }
  },
  components: {
    medicalOrgList,
    medicalRecordLog
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
