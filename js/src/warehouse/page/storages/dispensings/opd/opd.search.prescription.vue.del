<template>
  <div id="opd">
    <!-- 搜索条件 -->
    <div class="hospital-container">
      <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" @query="visitList" :is-query="true">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="visitList">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-container class="pos_re dispense_container">
      <div class="pr-l" :class="[expandTable ? 'pr-l-w' : '']">
        <div class="dispense_list pos_re" style="margin-top: -10px; width: 100%">
          <el-button class="pos_ab" style="top:-5px" type="text" :class="[expandTable ? 'i-zhankai' : '']" @click="expandTable = !expandTable">
            <i class="iconfont icon-zhankai"></i>
          </el-button>
          <el-table
            class="no-border"
            ref="opdTable"
            v-loading.body="fullscreenLoading"
            :data.sync="tableData"
            style="width: 100%"
            width="312px"
            :height="'calc(100vh - 200px)'"
            highlight-current-row
            @row-click="handleDetails">
            <el-table-column
              class-name="pointer"
              width="150"
              label="处方单号">
              <template slot-scope="scope">
                <span>{{scope.row.recipeCode}}</span>
              </template>
            </el-table-column>
            <el-table-column
              class-name="advicel"
              width="10">
              <template slot-scope="scope">
                <!-- 执行单号 -->
                <el-popover
                  class="positionAdvice"
                  v-if="scope.row.adviceExecuteId"
                  placement="right"
                  title
                  width="400"
                  trigger="hover"
                  content
                >
                  <span>
                    <span class="cGray6">执行单号：</span>
                    {{scope.row.adviceExecuteId}}
                  </span>
                  <span slot="reference">
                    <svg class="icon" style="font-size:30px; text-align:left; height: 18px" aria-hidden="true">
                      <use xlink:href="#icon-zhixingren"></use>
                    </svg>
                  </span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              class-name="pointer"
              label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.patientName}}</span>
                <!-- <span v-if="scope.row.addCount" class="font red">+{{scope.row.addCount}}</span> -->
                <el-tooltip content="邮寄" placement="top" v-if="scope.row.mailFlag">
                  <svg class="icon f16" aria-hidden="true">
                    <use xlink:href="#icon-youji"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              v-if="expandTable"
              width="157"
              label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateByExp}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            small
            class="prescription_pagination"
            :page-size="20"
            layout="prev, next"
            prev-text="上一页"
            next-text="下一页"
            @prev-click="pageClick('prev')"
            @next-click="pageClick('next')"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>

      <div class="pr-r" v-if="tablePatientData.id">
        <!-- 患者信息 -->
        <div class="pos_re" v-if="currentVisitPatientId">
          <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
          <history-btn :visitSn="currentVisitNumber" :implementType="listQueryObj.implementType"></history-btn>
        </div>

        <!-- 诊断基本信息 -->
        <div class="patient_prescription" v-if="tablePatientData">
          <div class="patient_list">
            <receipt-mail :itemData="[tablePatientData]" v-if="tablePatientData.mailFlag && tablePatientData.mailAddressObject" style="marginLeft: -15px;"></receipt-mail>
            <!--正常处方 单个处方详情信息 -->
            <chinese-prescription
              :doctorData="tablePatientData"
              :isPrint="false"
              @print="selectPrint"
              :opdData="tablePatientData"
              @updateDispenseStatus="updateDispenseStatus"
              :patientData="tablePatientData.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(tablePatientData.adviceType)"></chinese-prescription>
            <wast-prescription
              v-else
              :doctorData="tablePatientData"
              :itemData="tablePatientData"
              :itemId="tablePatientData.id"
              :isPrint="false"
              :patientObject="tablePatientData.patientObject"
              :storageRoomObject="tablePatientData.storageRoomObject"
              @sendPrint="handlerSendPrint"
              :mailState="tablePatientData.mailFlag"
              :visitSn="tablePatientData.visitSn"
              :date="tablePatientData.createTime"
              :identification="tablePatientData.identification"
              :status="tablePatientData.status"
              :outOfStock="tablePatientData.outOfStock"
              :patientData="tablePatientData.outpatientDispenseItemList"
              @updateDispenseStatus="updateDispenseStatus"
              @print="selectPrint"
              :outTest="outTest"
              :testResult="testResult">
            </wast-prescription>
          </div>
        </div>
      </div>
    </el-container>
    <!-- 打印组件 -->
    <jcp-print :key="jcpKey" ref="jcpPrint" hospitalType="1" :drugTableData="drugTableData" :nonPaternal="nonPaternal" :printPatientObj="printPatientObj" :fatherAdvice="fatherAdvice"></jcp-print>
  </div>
</template>

<script>
import commonApi from '../store/dispensingcommonapi.js'
import mixinsDespen from '../ipd/mixins_despen.js'
import packageapi from '@/crm/store/packageapi.js'
import { passport } from '@/card/store/passportapi'
import { PATIENT_HEAD, DISPENSING_STATUS, CHINESE_MEDICINE_TYPE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import chinesePrescription from '../components/chinese.prescription'
import checkInformation from '../components/check.information'
import patientHeader from '@/inpatient/components/common.head.js'
import wastPrescription from '../components/west.prescription.vue'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import skinTestMixins from '../mixins/skinTest.mixins'
import receiptMail from '../components/receiptmail'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import './index.scss'
let outpatientQuerySchema = [
  {
    name: 'recipeCode',
    label: '处方单号',
    placeholder: '处方单号',
    props: {
      clearable: true
    },
    style: 'width: 200px;'
  },
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'everRemoteMethod',
    props: {
      placeholder: REMOTE_METHODS_PLACEHOLDER,
      showKeys: true,
      api: getMaterialInfoApi,
      apiName: 'listlocal',
      isCodeBlood: true,
      clearOptions: true
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    label: '患者',
    props: {
      placeholder: '患者姓名'
    }
  },
  {
    name: 'opdDate',
    label: '发药日期',
    comp: 'ever-range-picker'
  },
  {
    name: 'applyDate',
    label: '申请日期',
    comp: 'ever-range-picker'
  }
]
export default {
  mixins: [getstorage, mixinsDespen, skinTestMixins, drugPrintMixins],
  data () {
    const listQueryObj = {
      implementType: 2
    }
    return {
      listQueryObj,
      PATIENT_HEAD,
      DISPENSING_STATUS,
      CHINESE_MEDICINE_TYPE,
      queryObj: {},
      querySchema: [],
      patients: [],
      doctorList: [],
      tableData: [],
      tablePatientData: {},
      offset: 0,
      totalCount: 0,
      pagesize: 20,
      fullscreenLoading: false,
      expandTable: false,
      dispensePrintLoading: false,
      currentVisitPatientId: '',
      recipeCode: '',
      currentVisitNumber: ''
    }
  },
  created () {
    this.queryObj = this.$ever.createObjFromSchema(outpatientQuerySchema)
    this.querySchema = outpatientQuerySchema
    this.$nextTick(() => {
      this._initDate()
      this.visitList()
    })
  },
  methods: {
    _initDate () {
      for (let val in this.queryObj) {
        this.queryObj[val] = ''
      }
      this.offset = 0
    },
    updateDispenseStatus (v) {
      this.handleDetails()
    },
    selectPrint (v) {

    },
    pageClick (v) {
      if (v === 'prev') {
        this.offset = this.offset - this.pagesize
        this.visitList(this.offset)
      } else {
        this.offset = this.offset + this.pagesize
        this.visitList(this.offset)
      }
    },
    resetForm () {
      this.$refs.form.$refs.form.resetFields()
      this._initDate()
      this.visitList()
    },
    handleDetails (data) {
      let params
      if (data) {
        this.currentVisitPatientId = data.patientId
        this.currentVisitNumber = data.visitSn
        this.recipeCode = data.code
        params = Object.assign({ code: data.code, storageRoomId: this.storageId })
      } else {
        params = Object.assign({ code: this.recipeCode, storageRoomId: this.storageId })
      }
      commonApi.getOneOutpatientDispense(params).then(res => {
        if (res.OutpatientDispense && res.OutpatientDispense.id) {
          this.tablePatientData = res.OutpatientDispense
        }
      })
    },
    dataAddChe (arr, start, end) {
      this.queryObj[start] = arr.length ? (arr[0] + ' 00:00:00') : ''
      this.queryObj[end] = arr.length ? (arr[1] + ' 00:00:00') : ''
    },
    visitList (offset) {
      this.queryObj.storageRoomId = this.storageId
      this.dataAddChe(this.queryObj.applyDate, 'startDate', 'endDate')
      this.dataAddChe(this.queryObj.opdDate, 'dispenseStartDate', 'dispenseEndDate')
      let params
      if (offset && typeof offset !== 'object') {
        params = Object.assign({}, this.queryObj, { offset: offset, pagesize: this.pagesize })
      } else {
        this.offset = 0
        params = Object.assign({}, this.queryObj, { offset: this.offset, pagesize: this.pagesize })
      }
      this.fullscreenLoading = true
      commonApi.getAllOutpatientDispense(params).then(res => {
        if (res && res.list && res.list.length) {
          this.tableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            this.$refs.opdTable && this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
          })
        } else {
          this.tableData = []
          this.totalCount = 0
          this.tablePatientData = {}
        }
        this.fullscreenLoading = false
      })
    },
    async queryDoctorId (query) {
      const params = {
        name: query,
        staffType: 39
      }
      const list = await packageapi.getStaffList(params)
      if (!list.head.errCode && list.data[0]) {
        this.doctorList = list.data
      } else {
        this.doctorList = []
      }
    },
    remoteMethod (query) {
      query = query && String(query).trim() || this.patientName
      return passport.get('patient/searchFuzzy', {
        params: {
          keyword: query
        }
      }).then(results => {
        if (results.data.resultList && results.data.resultList.length) {
          this.patients = results.data.resultList
        } else if (this.visitType === 3) {
          this.patients = [{
            name: query,
            id: query
          }]
        } else {
          this.patients = []
        }
        return this.patients
      })
    }
  },
  watch: {
    'currentVisitNumber' (v) {
      this.getOutPatientSkinTest(v)
    }
  },
  components: {
    patientHeader,
    wastPrescription,
    checkInformation,
    chinesePrescription,
    receiptMail,
    historyBtn,
    JcpPrint
  }
}
</script>

<style scoped lang="scss">
.patient_prescription {
  background: #fff;
}
#opd .dispense_container .pr-r .patient_prescription .patient_list{
  padding-bottom: 15px;
}
.advicel /deep/ .cell{
  padding: 0;
}
.positionAdvice {
  position: absolute;
  top: 2px;
  left: -15px;
}

</style>
