<template>
  <div id="clinicprescription">
    <div class="prescription-layout">
      <!-- 患者列表 -->
      <div class="hospital-container">
        <dispen-search
          placeholder="处方单号/患者姓名"
          router="/storages/dispensingclinic/clinicquery"
          storageKey="CLINIC_QUERY"
        ></dispen-search>
      </div>
      <div class="pos_re">
        <div class="pr-l" :class="expandTable ? 'pr-l-w' : ''">
          <div class="patient-list">
            <div class="pt-params">
              <div>
                <el-row>
                  <el-col :span="14">
                    <ever-select
                      v-model="medicineStatus"
                      :options="handleDispensingStatus"
                      placeholder="请选择发药状态"
                      :disabled="fullscreenLoading"
                      :clearable="true"
                    ></ever-select>
                  </el-col>
                  <el-col :span="10">
                    <el-checkbox
                      class="fr medicine-check"
                      v-model="medicineCheck"
                      @change="hanndleMedicineCheck"
                      :disabled="fullscreenLoading"
                    >
                      <span class="blue">仅看异常</span>
                    </el-checkbox>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="patient-table pos_re">
            <el-button
              class="pos_ab"
              type="text"
              :class="expandTable ? 'i-zhankai' : ''"
              @click="expandTable = !expandTable"
            >
              <i class="iconfont icon-zhankai"></i>
            </el-button>
            <el-table
              v-loading.body="fullscreenLoading"
              :data.sync="patientData"
              style="width: 100%"
              :height="'calc(100vh - 248px)'"
              :stripe="false"
              highlight-current-row
              @selection-change="handleSelectionChange"
              @row-click="handleDetails"
              :row-class-name="patientTableRowClassName"
            >
              <el-table-column v-if="medicineStatus == 2" width="32" type="selection"></el-table-column>
              <el-table-column
                class-name="pointer"
                :width="medicineStatus == 2 ? '100' : '120'"
                label="姓名"
              >
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.outpatientDispense"
                  >{{scope.row.outpatientDispense.patientName}}</span>
                  <span v-if="scope.row.addCount" class="font red">+{{scope.row.addCount}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip width="90" class-name="pointer" label="科室">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.outpatientDispense"
                  >{{scope.row.outpatientDispense.providerName}}</span>
                </template>
              </el-table-column>
              <el-table-column class-name="pointer" label="医师">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.outpatientDispense.doctorName"
                  >{{scope.row.outpatientDispense.doctorName}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="expandTable" width="157" label="开单时间">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.outpatientDispense"
                  >{{scope.row.outpatientDispense.createTime | formatDateByExp}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="patient-handle" v-if="medicineStatus == 2">
            <el-button :disabled="printBatchData.length == 0" @click="printBatch" type="text">批量打印</el-button>
          </div>
        </div>
        <div class="pr-r">
          <div class="clinic-container" v-if="tableData.doctor">
            <!-- 患者信息 -->
            <div class="pos_re" v-if="currentVisitPatientId">
              <patient-header
                :patientId="currentVisitPatientId"
                :visitNumber="currentVisitNumber"
                :code="PATIENT_HEAD"
              ></patient-header>
              <history-btn @getLogList="getLogList"></history-btn>
            </div>
            <!-- 处方单 -->
            <div
              class="clinic-table"
              :class="[medicineStatus < 7 || medicineStatus == 1000 ? 'pad' : 'pad1']"
              v-if="tableData && tableData.outpatientDispenseInfo && tableData.outpatientDispenseInfo.length"
            >
              <div class="clinic_content">
                <el-checkbox-group v-model="checkedRecipeId" @change="handleCheck">
                  <div
                    class="table-content"
                    v-for="(item, index) in tableData.outpatientDispenseInfo"
                    :key="index"
                    :class="item[0].adviceType == TRADITIONAL_CHINESE_MEDICINE || item[0].adviceType == CHINESE_PATENT_MEDICINE ? 'table-tcm-content' : ''"
                  >
                    <!-- 标题 -->
                    <el-row type="flex" align="middle" justify="start" class="table_title mb10">
                      <el-col :span="24">
                        <span class="light-gray">科室：</span>
                        <span>{{item[0].providerName}}</span>
                        <span class="ml20 light-gray">医生：</span>
                        <span>{{item[0].doctorName}}</span>
                        <span class="ml20 light-gray">诊断名称：</span>
                        <span>{{curDiseaseName}}</span>
                        <el-button
                          style="margin-left: 10px !important;"
                          type="text"
                          @click="taskGoSendCrm(item[0])"
                        >诊疗记录</el-button>
                        <el-button
                          style="margin-left: 10px !important;"
                          type="text"
                          @click="reportOpen(item[0])"
                        >检查检验报告</el-button>
                        <span
                          class="ml20 blue f_bold"
                          v-if="item[0].status != 6 && item[0].status != 7 && item[0].isInvalid"
                        >{{item[0].isInvalid == 1 ? '超时，待与医生沟通' : '超过3日，不能发药'}}</span>
                      </el-col>
                    </el-row>
                    <el-row type="flex" align="middle" justify="start" class="table_title">
                      <el-col :span="24">
                        <el-checkbox
                          class="z_index"
                          :label="item"
                          v-if="!((medicineStatus >= 6 && medicineStatus < 1000) || item[0].status > 5)"
                        >
                          <span></span>
                        </el-checkbox>
                        <span>处方单号：{{item[0].recipeId}}</span>
                        <span
                          class="ml20"
                          v-if="item[0].adviceExecuteId"
                        >执行单号: {{item[0].adviceExecuteId}}</span>
                        <span
                          class="ml20 blue f_bold"
                        >{{setName(DISPENSING_STATUS, item[0].status)}}</span>
                        <span class="ml20">申请时间：</span>
                        <span v-if="item[0].createTime">{{item[0].createTime | formatDateByExp}}</span>
                      </el-col>
                    </el-row>
                    <!-- 表格 -->
                    <tcm-template
                      v-if="item[0].adviceType == TRADITIONAL_CHINESE_MEDICINE || item[0].adviceType == CHINESE_PATENT_MEDICINE"
                      :templateData="item[1]"
                    ></tcm-template>
                    <wm-template
                      v-else
                      @sendPrint="handlerSendPrint"
                      :tableData="item[1]"
                      :otherData="item[0]"
                      :tableCellClassName="tableCellClassName"
                      :showTips="dataSource == 1 && item[0].status > 3 && item[0].status < 7"
                      :curStatus="currentStatus"
                      :curInvalid="isInvalid"
                      curTypes="outpatient"
                      :curAdviceType="item[0].adviceType"
                    ></wm-template>
                  </div>
                </el-checkbox-group>
              </div>
              <!-- 操作 -->
              <div class="btn_footer">
                <el-row>
                  <el-col :span="24">
                    <div
                      v-if="medicineStatus < 6 || medicineStatus == 1000"
                      style="display: inline-block"
                    >
                      <el-checkbox v-model="all" @change="handleCheckAll">全选</el-checkbox>
                      <el-button
                        v-if="currentStatus == 2 && ((isInvalid != -1 && isInvalid != 2) || (isInvalid == -1 && notInvalid))"
                        @click="updateDispense(4)"
                        type="primary"
                        :disabled="btnDisn"
                      >打印</el-button>
                      <el-button
                        v-if="currentStatus == 4 && ((isInvalid != -1 && isInvalid != 2) || (isInvalid == -1 && notInvalid))"
                        @click="updateDispense(5)"
                        type="primary"
                        :disabled="btnDisn"
                      >摆药</el-button>
                      <el-button
                        v-if="currentStatus == 5 && isInvalid != -1 && isInvalid != 2"
                        @click="updateDispense(6)"
                        type="primary"
                        :disabled="btnDisn"
                      >{{isInvalid == 1 ? '医生已确认，发药' : '审核并发药'}}</el-button>
                      <el-button
                        v-if="currentStatus > 0 && currentStatus < 6 && ((isInvalid != -1 && isInvalid != 2) || (isInvalid == -1 && notInvalid))"
                        type="primary"
                        @click="handleException"
                        :disabled="btnDisn"
                      >异常</el-button>
                      <el-button
                        v-if="currentStatus < 1 && ((isInvalid != -1 && isInvalid != 2) || (isInvalid == -1 && notInvalid)) && checkedRecipeId.length"
                        @click="cancleException"
                        type="primary"
                        :disabled="btnDisn"
                      >撤回异常</el-button>
                    </div>
                    <div
                      style="display: inline-block"
                      class="ml10"
                      v-if="hnxdPrint && currentStatus > 3 && currentStatus < 7 && (isInvalid != 2)"
                    >
                      <el-button @click="handlePrintPutMedicine" type="primary">补打摆药单</el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <everNoData v-else class="no-data" tipTxt="暂无处方"></everNoData>
        </div>
      </div>
      <!-- 异常标记 -->
      <exception-dialog
        :exceptionData="exceptionData"
        :visible.sync="dialogVisible"
        @confirm="handleSave"
      ></exception-dialog>
      <!-- 操作记录 -->
      <control-record-dialog :recordData="controlData" :visible.sync="controlDialogVisible"></control-record-dialog>
      <!-- 检查检验报告 -->
      <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
      <jcp-print
        :key="jcpKey"
        ref="jcpPrint"
        hospitalType="1"
        :drugTableData="drugTableData"
        :nonPaternal="nonPaternal"
        :printPatientObj="printPatientObj"
        :fatherAdvice="fatherAdvice"
      ></jcp-print>
      <!-- <el-button type="danger" @click="handlerPrint">打印</el-button> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import api from '../store/clinicapi'
import { DISPENSING_STATUS, debounce, SEARCH_CODE, patch, SPU_SPEC_CODE, OUTPATIENT_DATASOUCE, DOSAGE, TRADITIONAL_CHINESE_MEDICINE, CHINESE_PATENT_MEDICINE, PATIENT_HEAD } from '@/util/common'
import setName from '@/util/setstatusname'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import wmTemplate from '@/warehouse/page/storages/components/wmtemplate'
import tcmTemplate from '@/warehouse/page/storages/components/tcmtemplate'
import exceptionDialog from '@/warehouse/page/storages/components/exceptiondialog'
import controlRecordDialog from '@/warehouse/page/storages/components/controlrecorddialog'
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import mixinsDespen from '../dispensinghospital/mixins_despen.js'
import medicinePrint from '@/warehouse/page/storages/util/medicineprint'
import patientHeader from '@/inpatient/components/common.head.js'
import reportDialog from '@/infusion/components/report.card.vue'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixins'

export default {
  mixins: [setName, getStorage, sendDrug, mixinsDespen, medicinePrint, drugPrintMixins],
  data () {
    return {
      api,
      checkDisable: [],
      medicineCheck: false,
      expandTable: false,
      all: false,
      dataSource: '',
      searchPatient: '',
      medicineStatus: 2,
      patientData: [],
      tableData: {},
      DOSAGE,
      DISPENSING_STATUS,
      SEARCH_CODE,
      SPU_SPEC_CODE,
      currentStatus: 0,
      isInvalid: 0,
      notInvalid: true, // 没有超过3日的
      cacheOptions: [], // 缓存患者列表
      curDiseaseName: '',
      currentPatientId: '', // 当前选中的患者id
      currentVisitPatientId: '', // 当前选中患者patientId
      currentPatient: null, // 当前患者
      currentVisitNumber: '', // 当前门诊号
      checkedRecipeId: [], // 处方单选择
      dialogVisible: false, // 异常标记弹窗
      exceptionData: [], // 异常数据
      exceptionVal: [], // 异常弹窗回传数据
      controlDialogVisible: false, // 操作记录弹窗
      controlData: [], // 操作记录数据
      printBatchData: [], // 批量打印数据
      multipleSelection: [], // 批量打印数据
      skipBaiYao: false, // 是否跳过摆药
      fullscreenLoading: false,
      TRADITIONAL_CHINESE_MEDICINE,
      CHINESE_PATENT_MEDICINE,
      PATIENT_HEAD,
      reportKey: false,
      btnDisn: false, // 点击btn是否可点击
      hnxdPrint: this.$ever.getClinicConfig().hnxdPrint // 打印机构类型
    }
  },
  created () {
    // 增加从客服工作站跳转无库房id
    if (this.storageId) {
      this.dataSource = this.$route.name !== 'clinicprescription' ? OUTPATIENT_DATASOUCE[0].id : OUTPATIENT_DATASOUCE[1].id
      this.visitList({})
      this.getSkipSetting()
    } else {
      this.$router.push('/storages?jumper=/storages/dispensingclinic/clinicprescription')
    }
  },
  computed: {
    // 过滤缺货状态
    handleDispensingStatus () {
      let tempStatusData = DISPENSING_STATUS.filter(v => {
        return v.id !== 3 && v.id !== 9 && v.id !== 10
      })
      return tempStatusData
    }
  },
  methods: {
    reportOpen (data) {
      this.reportKey = true
      this.$nextTick(_ => {
        this.$refs.reportDialog.openDialog(data)
      })
    },
    taskGoSendCrm (data) {
      window.open(this.$ever.crmIndex + '/crm/memberinfo/diagnosis/' + data.patientId, '_blank')
    },
    handlePrintPutMedicine: debounce(function () {
      if (!this.checkMultipleLength(this.checkedRecipeId)) return
      this.gatherPrintData({
        outpatientDispenseInfo: this.checkedRecipeId,
        patientObject: this.tableData.patientObject
      }, ['drugTableData'])
      // this.handleReprint({ types: 'outpatient', isMakeUp: true, arr: this.checkedRecipeId })
    }),
    // 查询是否摆药
    getSkipSetting () {
      let params = {
        storageRoomId: this.storageId,
        dispenseType: 1,
        type: 700
      }
      api.getDispenseSetting(params).then(res => {
        if (res && res.value === 1) this.skipBaiYao = true
      })
    },
    handleCheck (val) {
      this.all = val.length === this.tableData.outpatientDispenseInfo.length
      this.setMultipleSelectionData()
    },
    handleCheckAll (checked) {
      this.checkedRecipeId = []
      if (checked) {
        this.tableData.outpatientDispenseInfo.forEach((item) => {
          this.checkedRecipeId.push(item)
        })
      }
      this.setMultipleSelectionData()
    },
    setMultipleSelectionData () {
      this.multipleSelection = []
      this.checkedRecipeId.forEach((item) => {
        let index = this.tableData.outpatientDispenseInfo.findIndex(data => {
          return data[0].id === item[0].id
        })
        index > -1 && this.multipleSelection.push(this.tableData.outpatientDispenseInfo[index])
      })
    },
    // 查询患者
    handelSearchPatient () {
      this.medicineStatus = 2
      let searchParmams = { condition: this.searchPatient }
      this.visitList(searchParmams, true)
    },
    // 仅看异常患者checkbox - 过滤数据
    hanndleMedicineCheck: debounce(function () {
      if (this.medicineCheck) {
        this.patientData = this.cacheOptions.filter(v => {
          return v.outpatientDispense.identification === 1
        })
      } else {
        this.patientData = JSON.parse(JSON.stringify(this.cacheOptions))
      }
      this.handlePatientList()
    }),
    // 获取当前患者详情信息
    handleDetails: debounce(function (row, column, event) {
      this.jcpKey = row.outpatientDispense.id
      this.all = false
      this.multipleSelection = []
      this.checkedRecipeId = []
      this.dispenseList(row.outpatientDispense)
      this.resetAllStatus()
      this.currentPatient = row.outpatientDispense
      this.currentPatientId = row.outpatientDispense.id
      this.currentVisitPatientId = row.outpatientDispense.patientId
      this.currentVisitNumber = row.outpatientDispense.visitSn
      if (this.medicineStatus === 2) row.addCount = 0
    }),
    // 获取患者列表
    visitList (params, type) {
      this.fullscreenLoading = true
      this.printBatchData = []
      this.tableData = {}
      if (type) {
        this.medicineCheck = false
      }
      if (this.medicineStatus !== 1000) params.status = this.medicineStatus
      Object.assign(params, { storageRoomId: this.storageId, implementType: this.dataSource }, { condition: this.searchPatient })
      api.getVisitSnList(params).then(res => {
        this.fullscreenLoading = false
        res && res.forEach(item => {
          item.addCount = 0
        })
        if (res.length) {
          let cacheOptions = JSON.parse(JSON.stringify(res))
          this.cacheOptions = cacheOptions
          this.patientData = res
          this.searchPatient = ''
        } else {
          this.cacheOptions = []
          this.patientData = []
        }
        this.handlePatientList()
      })
    },
    // 处理患者列表 - 判断获取哪一个患者的处方信息
    handlePatientList () {
      if (this.patientData.length) {
        if (this.currentPatientId) { // 已选过患者
          let tempArr = this.patientData.filter(v => {
            return v.outpatientDispense.id === this.currentPatientId
          })
          if (tempArr.length) {
            this.currentPatient = tempArr[0].outpatientDispense
          } else {
            this.currentPatient = {}
          }
        } else { // 未选过患者
          this.currentPatient = this.patientData[0].outpatientDispense
          // this.currentPatientId = this.patientData[0].outpatientDispense.id
        }
        // 判断获取的列表是否含有当前患者
        if (Object.keys(this.currentPatient).length) {
          // this.dispenseList(this.currentPatient)
        } else {
          this.currentPatient = this.patientData[0].outpatientDispense
          this.currentPatientId = this.patientData[0].outpatientDispense.id
          // this.dispenseList(this.patientData[0].outpatientDispense)
        }
      } else {
        this.tableData = {}
      }
    },
    // 根据门诊号获取处方信息
    dispenseList (params) {
      this.fullscreenLoading = true
      this.tableData = {}
      Object.assign(this.tableData, { patientObject: {} })
      this.checkDisable = []
      let tempParams = JSON.parse(JSON.stringify(params))
      this.medicineStatus === 1000 ? delete tempParams.status : ''
      Object.assign(tempParams, { storageRoomId: this.storageId })
      api.getDispenseList(tempParams).then(res => {
        if (res) {
          this.fullscreenLoading = false
          this.tableData = res
          if (res.zhenDuan) {
            let diseaseName = JSON.parse(res.zhenDuan).ZHEN_DUAN && JSON.parse(JSON.parse(res.zhenDuan).ZHEN_DUAN)
            if (diseaseName && diseaseName[0]) this.curDiseaseName = diseaseName[0].diseaseName
          }
          res.outpatientDispenseInfo && res.outpatientDispenseInfo.forEach(item => {
            this.checkDisable.push(false)
            this.checkedRecipeId.push(item)
          })
          // 默认全选所有
          this.all = true
          this.setMultipleSelectionData()
          // this.tableData && this.tableData.outpatientDispenseInfo && this.handlePatientInfo(this.tableData)
        }
      })
    },
    // 患者表格checkbox
    handleSelectionChange (v) {
      this.printBatchData = v
    },
    // 批量打印
    printBatch () {
      this.jcpKey = this.curCount++
      let tempObj = {
        visitSns: [],
        status: 4,
        oldStatus: 2,
        implementType: this.dataSource
      }
      this.printBatchData.forEach(v => {
        tempObj.visitSns.push(v.outpatientDispense.visitSn)
      })
      this.api.updateDispenseType(tempObj).then(res => {
        if (res && res.length) {
          // batch 门诊批量打印 old
          // this.handleReprint({ types: 'batch', arr: res })

          // 打印数据收集 start
          this.nonPaternal = []
          this.fatherAdvice = []
          this.drugTableData = []
          res.forEach(patientData => { // 挂号单维度数据
            let dispensingList = []
            patientData.outpatientDispenseList && patientData.outpatientDispenseList.forEach(printData => { // 药品明细数据
              let advice = []
              printData.outpatientDispenseItemList.forEach(drugData => {
                // 按照人或者visitSn维度的（挂号的）摆药单  添加一个人的所有摆药单明细信息
                dispensingList.push(drugData)
                // 父子医嘱
                if ([1, 2].includes(drugData.isMine)) {
                  advice.push(drugData)
                } else {
                  this.nonPaternal.push({
                    storageRoomObj: res.storageRoomInfo,
                    tableData: drugData,
                    patientObj: Object.assign(patientData.patientObject, { hospitalizedNumber: patientData.hospitalizedNumber })
                  })
                }
              })
              if (advice.length) {
                this.fatherAdvice.push({ tableData: advice, barCode: printData.code, patientObj: Object.assign(patientData.patientObject, { hospitalizedNumber: patientData.hospitalizedNumber }) })
              }
            })
            // 按人维度添加摆药单  一个人一个单
            this.drugTableData.push({
              adviceType: patientData.adviceType,
              tableData: dispensingList,
              patientObj: Object.assign(patientData.patientObject, { hospitalizedNumber: patientData.hospitalizedNumber })
            })
          })
          // 打印数据收集 end
          this.$nextTick(_ => {
            this.handlerPrint()
          })
          this.visitList({}, true)
          this.$messageTips(this, 'success', '批量打印成功')
        }
      })
    },
    // 标记异常 - 弹窗
    handleException () {
      let outpatientDispenseIds = []
      this.checkedRecipeId.forEach(item => {
        outpatientDispenseIds.push(item[0].id)
      })
      this.api.getDispenseInfo({ outpatientDispenseIds }).then(res => {
        if (res) {
          this.exceptionData = res
          this.dialogVisible = true
        }
      })
    },
    // 标记异常 - 请求
    handleSave (val) {
      let params = []
      // 处理标记异常数据
      val.checkedItems.forEach(v => {
        let tempObj = {}
        tempObj.exceptionCause = val.inputVal
        tempObj.id = v.outpatientDispenseItem.id
        tempObj.identification = 1
        tempObj.relationId = v.outpatientDispenseItem.relationId
        tempObj.localMaterialId = v.outpatientDispenseItem.localMaterialId
        params.push(tempObj)
      })
      this.api.updateDispenseIdentification(params).then(res => {
        if (res.success === 0) {
          this.$messageTips(this, 'success', '标记异常成功')
          this.dialogVisible = false
          this.dispenseList(this.currentPatient)
          // this.visitList({}, true)
          // 撤销异常 清除所有选择项
          this.checkedRecipeId = []
        }
      })
    },
    // 打印 4 || 摆药 5 || 发药 6
    updateDispense: debounce(function (status) {
      if (!this.checkMultipleLength(this.checkedRecipeId)) return
      let tempObj = {
        outpatientDispenseIds: [],
        status: status
      }
      this.checkedRecipeId.forEach(v => {
        if (v[0].status < 6) {
          tempObj.outpatientDispenseIds.push(v[0].id)
        }
      })
      this.fullscreenLoading = true
      // 按钮置灰，不可点击
      this.btnDisn = true
      this.api.updateDispenseType(tempObj).then(res => {
        this.fullscreenLoading = false
        this.btnDisn = false
        if (res.success === 0) {
          this.$messageTips(this, 'success', `${status === 4 ? '打印' : status === 5 ? '摆药' : '发药'}成功`)
          if (status === 4) {
            // let checkedRecipeArr = JSON.parse(JSON.stringify(this.checkedRecipeId))
            // this.handleReprint({ types: 'outpatient', arr: checkedRecipeArr })
            this.gatherPrintData({
              outpatientDispenseInfo: this.checkedRecipeId,
              patientObject: Object.assign(this.tableData.patientObject, { hospitalizedNumber: this.tableData.hospitalizedNumber })
            })
          }
          if (this.skipBaiYao && status === 4) {
            this._updateTableDataStatus(tempObj.outpatientDispenseIds, 5)
          } else {
            this._updateTableDataStatus(tempObj.outpatientDispenseIds, tempObj.status)
          }
          // 获取选择状态和处方单状态
          let index = this.tableData && this.tableData.outpatientDispenseInfo.findIndex(item => {
            return item[0].status + '' === this.medicineStatus + ''
          })
          // 显示处方列表状态都不等于（medicineStatus）当前状态 删除左侧患者
          if (index === -1) {
            this.deleteFormArr(this.patientData, this.currentPatientId, true)
            this.deleteFormArr(this.cacheOptions, this.currentPatientId, true)
          }
          // 发药完成，删除处方列表
          // if (this.medicineStatus === 6) {
          //   tempObj.outpatientDispenseIds.forEach(item => {
          //     this.deleteFormArr(this.tableData.outpatientDispenseInfo, item.id)
          //   })
          // }
          // 清空右侧内容并判断左侧是否有患者单据
          // if (!this.tableData.outpatientDispenseInfo.length || status === 6) {
          //   this.patientData && this.patientData.length ? this.dispenseList(this.patientData[0].outpatientDispense) : this.tableData = {}
          // }
        }
      })
    }),
    deleteFormArr (arr, id, other) {
      let index = arr.findIndex(item => {
        return other ? item.outpatientDispense.id === id : item.id === id
      })
      index > -1 && arr.splice(index, 1)
    },
    _updateTableDataStatus (data, status) {
      data && data.length && data.forEach(item => {
        const index = this.tableData.outpatientDispenseInfo.findIndex(it => {
          return item === it[0].id
        })
        if (index > -1) {
          this.$set(this.tableData.outpatientDispenseInfo[index][0], 'status', status)
          this.currentStatus = status
          this.checkDisable[index] = true
          // this.resetAllStatus()
        }
      })
      // this.resetAllStatus()
      // this.visitList({}, true)
    },
    resetAllStatus () {
      this.multipleSelection = []
      this.checkedRecipeId = []
      this.all = false
    },
    // 撤回异常
    cancleException () {
      let params = []
      this.multipleSelection.forEach(value => {
        if (value[0].identification) {
          value[1].forEach(val => {
            let tempObj = {}
            if (val.outpatientDispenseItem.identification) {
              tempObj.exceptionCause = ''
              tempObj.id = val.outpatientDispenseItem.id
              tempObj.identification = 0
              tempObj.relationId = val.outpatientDispenseItem.relationId
              tempObj.localMaterialId = val.outpatientDispenseItem.localMaterialId
              params.push(tempObj)
            }
          })
        }
      })
      this.api.updateDispenseIdentification(params).then(res => {
        if (res.success === 0) {
          this.$messageTips(this, 'success', '撤回异常成功')
          this.resetAllStatus()
          this.dispenseList(this.currentPatient)
          // this.visitList({}, true)
        }
      })
    },
    // 操作记录
    getLogList () {
      this.api.getLogList({ visitSn: this.currentPatient.visitSn, implementType: this.dataSource }).then(res => {
        if (res) {
          this.controlData = res.dispenseLogListJson
          this.handleLogList(this.controlData)
          this.controlDialogVisible = true
        }
      })
    },
    // 处理操作记录数据
    handleLogList (data) {
      data.forEach(val => {
        if (val.dispenseLog.action !== '标记异常') {
          let _excute = []
          let _recipe = []
          val.dispenseLogListItemJson.forEach(v => {
            if (v.outpatientDispense.adviceExecuteId) {
              _excute.push(v.outpatientDispense.adviceExecuteId)
            } else if (v.outpatientDispense.recipeId) {
              _recipe.push(v.outpatientDispense.recipeId)
            }
          })
          val['_excute'] = _excute
          val['_recipe'] = _recipe
        }
      })
    },
    // 当前患者 - 添加class
    patientTableRowClassName ({ row }) {
      // return row.outpatientDispense.id === this.currentPatientId ? 'current-patient-row' : ''
    },
    // 发药异常标记 - 添加class
    tableCellClassName ({ row }) {
      return row.outpatientDispenseItem.identification ? 'danger-row' : ''
    },
    ...patch
  },
  watch: {
    // 发药状态选择
    'medicineStatus' (val) {
      let statusParmams
      val === 1000 ? statusParmams = {} : statusParmams = { status: val }
      this.visitList(statusParmams, true)
      this.resetAllStatus()
      this.currentStatus = val
    },
    // 'dialogVisible' (val) {
    //   if (!val) {
    //     this.resetAllStatus()
    //   }
    // },
    multipleSelection (v) {
      this.notInvalid = true // 没有超过3日的
      let isTrue = true // status 是否都一致
      let isAb = true // 是否是异常
      let isInvalid = true // 超时状态是否一致
      let leng = v.length
      let temp = leng && v[0][0].status || 0
      let tempAb = leng && v[0][0].identification || 0
      let tempIn = leng && v[0][0].isInvalid || 0
      this.currentStatus = 0
      if (leng) {
        if (!search(v, temp)) isTrue = false
        if (!search(v, tempAb, 'identification')) isAb = false
        if (!search(v, tempIn, 'isInvalid')) isInvalid = false
        if ((tempAb !== 1 && isTrue && isAb && leng >= 1)) {
          this.currentStatus = temp
          if (!isInvalid) { // 含有不同状态
            this.isInvalid = -1
          } else if (tempIn === 0 && isInvalid) { // 状态相同 - 0 - 不超时
            this.isInvalid = 0
          } else if (tempIn === 1 && isInvalid) { // 状态相同 - 1 - 超时，待与医生沟通
            this.isInvalid = 1
          } else if (tempIn === 2 && isInvalid) { // 状态相同 - 2 - 超过3日，不能发药
            this.isInvalid = 2
          }
        } else if (tempAb === 1 && isTrue && isAb && leng >= 1) {
          this.currentStatus = -1
          this.isInvalid = 1
        }
      }
      function search (data, val, name = 'status') {
        for (let i = 0; i < data.length; i++) {
          if (data[i][0][name] !== undefined && data[i][0][name] !== val) return false
        }
        return true
      }
      // 查询是否有过时异常
      v.forEach(val => {
        if (val[0]['isInvalid'] === 2) this.notInvalid = false // 含有超过3日的处方单
      })
    },
    '$route' (v) {
      this.expandTable = false
      this.dataSource = v.name !== 'clinicprescription' ? OUTPATIENT_DATASOUCE[0].id : OUTPATIENT_DATASOUCE[1].id
      this.visitList({})
      this.resetAllStatus()
      this.medicineStatus = 2
      this.searchPatient = ''
    },
    '$store.state.dispensing.doorData' (v) {
      if (v.implementType === this.dataSource) {
        let index = this.patientData.findIndex(item => {
          return item.outpatientDispense.visitSn === v.visitSn
        })
        if (index > -1) {
          let count = this.patientData[index].addCount + 1
          this.$set(this.patientData[index], 'addCount', count)
        } else if (this.medicineStatus === 2) {
          let tempObj = {
            addCount: 0,
            outpatientDispense: v
          }
          this.patientData.unshift(tempObj)
          this.dispenseList(v)
        }
      }
    }
  },
  components: {
    // patientInfo,
    JcpPrint,
    historyBtn,
    patientHeader,
    wmTemplate,
    tcmTemplate,
    exceptionDialog,
    controlRecordDialog,
    dispenSearch,
    reportDialog
  }
}
</script>

<style lang="less" scoped>
.font.red {
  transform: scale(0.7, 0.7);
  font-weight: bold;
  display: inline-block;
}
.medicine-check {
  line-height: 36px;
  height: 36px;
}
.no-data {
  margin-top: 200px;
}
.layout_box.el-main {
  position: relative;
}
.clinic_content {
  height: e("calc(100vh - 350px)");
  overflow-x: hidden;
}
.pad1 {
  .clinic_content {
    height: e("calc(100vh - 290px)");
    overflow-x: hidden;
  }
}
.pad {
  position: relative;
  .btn_footer {
    background: #fff;
    border-top: 1px solid #ccc;
    width: 100%;
    height: 60px;
    z-index: 9;
    margin-left: -15px;
    position: absolute;
    bottom: -50px;
    line-height: 60px;
    .el-row {
      padding: 0 20px;
      .el-checkbox {
        margin-right: 20px;
      }
    }
  }
}
#clinicprescription {
  .hospital-container .hospital-search {
    padding-bottom: 10px;
  }
}
</style>
