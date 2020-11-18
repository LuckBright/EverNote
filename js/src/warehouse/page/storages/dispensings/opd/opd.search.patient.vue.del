<template>
  <div id="opd">
    <!-- 搜索条件 -->
    <div class="hospital-container">
      <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" @query="visitList" :is-query="true">
        <template slot="doctorId">
          <el-select
          v-model="queryObj.doctorId"
          filterable
          clearable
          :default-first-option="true"
          remote
          :placeholder="'医生姓名'"
          :remote-method="queryDoctorId"
          @change="visitList({})"
          >
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.name"
              :value="item.id || item.name">
            </el-option>
          </el-select>
        </template>
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
        <div class="dispense_list pos_re" style="margin-top: -10px">
          <el-button class="pos_ab" style="top:-5px" type="text" :class="[expandTable ? 'i-zhankai' : '']" @click="expandTable = !expandTable">
            <i class="iconfont icon-zhankai"></i>
          </el-button>
          <el-table
            ref="opdTable"
            class="no-border"
            v-loading.body="fullscreenLoading"
            :data.sync="tableData"
            style="width: 100%;"
            :height="'calc(100vh - 200px)'"
            highlight-current-row
            @row-click="handleDetails">
            <el-table-column
              class-name="pointer"
              width="100"
              label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.patientName}}</span>
                <el-tooltip content="邮寄" placement="top" v-if="scope.row.mailFlag">
                  <svg class="icon f16" aria-hidden="true">
                    <use xlink:href="#icon-youji"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip
              width="110"
              class-name="pointer"
              label="科室">
              <template slot-scope="scope">
                <span>{{scope.row.providerName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              class-name="pointer"
              width="100"
              label="医师">
              <template slot-scope="scope">
                <span v-if="scope.row.doctorName">{{scope.row.doctorName}}</span>
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

      <!-- 右侧 -->
      <div class="pr-r">
        <div v-if="tablePatientData.currentOutpatientDispense.length || tablePatientData.prescription.notPrint.length || tablePatientData.prescription.print.length">
          <div class="pos_re">
            <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
            <history-btn :visitSn="currentVisitNumber" :implementType="listQueryObj.implementType"></history-btn>
          </div>
          <div class="result_high mt10">
            <prescription-list class="inner" id="compHigh"
              :isScroll="true"
              :dispenData="tablePatientData"
              :outTest="outTest"
              @sendPrintParent="handlerSendPrint"
              :testResult="testResult" @abnormal="abnormal"></prescription-list>
            <prescription-list class="inner" id="compHigh1"
              :isScroll="true"
              :outTest="outTest"
              :testResult="testResult"
              @sendPrintParent="handlerSendPrint"
              :dispenData="hospitalData" @abnormal="abnormal"></prescription-list>
            <dispensings-list
              :isScroll="true"
              :outTest="outTest"
              :testResult="testResult"
              @makeUpPrint="makeUpPrint"
              @repeatPrint="repeatPrint"
              @sendPrintParent="handlerSendPrint"
              class="inner"
              :dispenData="tablePatientData"
              @abnormal="abnormal"></dispensings-list>
          </div>
        </div>
      </div>
    </el-container>
    <jcp-print :key="jcpKey" ref="jcpPrint" hospitalType="1" :drugTableData="drugTableData" :nonPaternal="nonPaternal" :printPatientObj="printPatientObj" :fatherAdvice="fatherAdvice"></jcp-print>
  </div>
</template>

<script>
import commonApi from '../store/dispensingcommonapi.js'
// import clinicapi from '../../store/clinicapi.js'
import patientHeader from '@/inpatient/components/common.head.js'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import prescriptionList from '../components/prescription.list.vue'
import dispensingsList from '../components/dispensings.list.vue'
import packageapi from '@/crm/store/packageapi.js'
import { passport } from '@/card/store/passportapi'
import { PATIENT_HEAD, DISPENSING_STATUS, CHINESE_MEDICINE_TYPE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import skinTestMixins from '../mixins/skinTest.mixins'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import receiptMail from '../components/receiptmail'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import './index.scss'
let outpatientQuerySchema = [
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    label: '患者',
    props: {
      placeholder: '患者姓名'
    }
  },
  {
    name: 'doctorId',
    label: '医生',
    comp: 'custom',
    placeholder: '医生姓名'
  },
  {
    name: 'providerId',
    label: '科室',
    comp: 'el-select',
    props: {
      'default-first-option': true,
      placeholder: '科室',
      options: [],
      filterable: true
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
  mixins: [selectInquireList, getstorage, drugPrintMixins, skinTestMixins],
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
      tablePatientData: {
        controlDialogVisible: false,
        currentOutpatientDispense: [],
        currentOutpatientDispenseClass: {
          notError: [],
          error: []
        },
        prescription: {
          notPrint: [],
          print: []
        },
        identification: []
      },
      hospitalData: {
        currentOutpatientDispense: [],
        prescription: {
          notPrint: [],
          print: []
        },
        identification: []
      },
      offset: 0,
      totalCount: 0,
      pagesize: 20,
      firstCompHigh: 0,
      firstCompHigh1: 0,
      fullscreenLoading: false,
      expandTable: false,
      dispensePrintLoading: false,
      currentVisitPatientId: '',
      currentVisitNumber: '',
      routePatientId: this.$route.query.patientId
    }
  },
  created () {
    this.queryObj = this.$ever.createObjFromSchema(outpatientQuerySchema)
    this.querySchema = outpatientQuerySchema
    // 科室
    this._sentenceSelect(true).then(res => {
      if (res && res.length) {
        this.$ever.getFieldFromSchema(this.querySchema, 'providerId').props.options = res
      }
    })
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
      // this.queryObj.patientId = this.$route.query.patientId || '' 暂时干掉客服工作站跳转到患者查询患者姓名显示错误的问题，强哥说可以先干掉
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
        params = Object.assign({ patientId: data.patientId, visitSn: data.visitSn, storageRoomId: this.storageId })
      } else {
        params = Object.assign({ patientId: this.currentVisitPatientId, visitSn: this.currentVisitNumber, storageRoomId: this.storageId })
      }
      params.dispenseEndDate = this.queryObj.dispenseEndDate
      params.dispenseStartDate = this.queryObj.dispenseStartDate
      params.startDate = this.queryObj.startDate
      params.endDate = this.queryObj.endDate
      commonApi.getOutpatientDispenseListForPatient(params).then(res => {
        let dispenseList = res.dispenseList || []
        let outpatientDispenseList = res.outpatientDispenseList || []
        let hospitalDispenseList = res.outpatientDispenseHospitalList || []
        // 判断有误？？？已改为 watch -> currentVisitNumber
        // if (res.dispenseList && res.dispenseList.length) {
        //   this.getOutPatientSkinTest(this.currentVisitNumber)
        // }
        this.tablePatientData = {
          controlDialogVisible: false,
          currentOutpatientDispense: [],
          prescription: {
            notPrint: [],
            print: []
          },
          currentOutpatientDispenseClass: {
            notError: [],
            error: []
          },
          identification: []
        }
        this.hospitalData = {
          currentOutpatientDispense: [],
          prescription: {
            notPrint: [],
            print: []
          },
          identification: []
        }
        if (!dispenseList.length && !outpatientDispenseList.length) {
          let errText = '暂无该处方！'
          this.$messageTips(this, 'warning', errText, '')
          return
        }
        if (dispenseList.length) { // 摆药单维度数据
          this.tablePatientData.currentOutpatientDispense = dispenseList
          this.tablePatientData.currentOutpatientDispense.map((item, index) => {
            const _success = []
            const _error = []
            let identification = true
            for (let i in item.outpatientDispenseList) {
              const bill = item.outpatientDispenseList[i]
              if (bill.identification) {
                identification = false
                _error.push(bill)
              } else {
                _success.push(bill)
              }
            }
            if (identification) { // 异常
              this.tablePatientData.currentOutpatientDispenseClass.notError.push(item)
            } else {
              item.outpatientDispenseListSuccess = _success
              item.outpatientDispenseListError = _error
              this.tablePatientData.currentOutpatientDispenseClass.error.push(item)
            }
          })
        }
        if (outpatientDispenseList.length) { // 处方单维度(处方发药)
          this._setTableData(outpatientDispenseList, 'tablePatientData')
        }
        if (hospitalDispenseList.length) { // 处方单维度（院内发药）
          this._setTableData(hospitalDispenseList, 'hospitalData')
        }
        this.$nextTick(_ => {
          this.firstCompHigh = document.querySelector('#compHigh') ? document.querySelector('#compHigh').offsetHeight : 0 // 获取元素内容高度， 是否添加边距
          this.firstCompHigh1 = document.querySelector('#compHigh1') ? document.querySelector('#compHigh1').offsetHeight : 0 // 获取元素内容高度， 是否添加边距
        })
      })
    },
    _setTableData (originData, newData) {
      originData.map((item, index) => {
        let identification = false
        for (let i = 0; i < item.outpatientDispenseItemList.length; i++) {
          if (item.outpatientDispenseItemList[i].identification === 1) {
            identification = true
            break
          }
        }
        if (!identification) {
          item.checked = true
          this[newData].prescription.notPrint.push(item)
        } else {
          this[newData].prescription.print.push(item)
        }
      })
    },
    abnormal (data, obj) {
      data && this.handleDetails()
      obj && this.repeatPrint(obj)
    },
    repeatPrint (data) {
      this.jcpKey = this.jcpKeyCount++
      this.gatherPrintData({
        outpatientDispenseInfo: data.dispenseVoList,
        patientObject: Object.assign(data.patientObject, { barCode: data.barCode, visitSn: this.curVisitNumber })
      })
      // data.searchObj && this.handleSearch(this.$refs.search.searchObj)
    },
    makeUpPrint (item) {
      this.jcpKey = this.jcpKeyCount++
      //  调用打印
      let dispenseVoList = item.outpatientDispenseList
      let patientObject = item.patientObject ? this.patientObject : {}
      this.gatherPrintData({
        outpatientDispenseInfo: dispenseVoList,
        patientObject: Object.assign(patientObject, { barCode: item.code, visitSn: this.curVisitNumber })
      }, ['drugTableData'])
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
      params.patientId = params.patientId || this.routePatientId || ''
      this.fullscreenLoading = true
      commonApi.getAllPatientByVisitsnAndDoctor(params).then(res => {
        if (res && res.list && res.list.length) {
          this.tableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            this.$refs.opdTable && this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
          })
        } else {
          this.tableData = []
          this.totalCount = 0
          this.tablePatientData.currentOutpatientDispense = []
          this.tablePatientData.prescription.notPrint = []
          this.tablePatientData.prescription.print = []
          this.currentVisitPatientId = ''
          this.currentVisitNumber = ''
        }
        this.fullscreenLoading = false
        this.routePatientId = ''
        this.$router.push({query: {patientId: ''}})
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
    prescriptionList,
    dispensingsList,
    patientHeader,
    JcpPrint,
    receiptMail,
    historyBtn
  }
}
</script>

<style scoped lang="scss">
.result_high{
  overflow-y: auto;
  height: calc(100vh - 246px);
}
</style>
