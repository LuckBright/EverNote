<template>
  <div>
    <div class="clinic-container">
      <!-- 搜索框 -->
      <div class="clinic-search">
        <div>
          <dispen-search ref="inputSeach" placeholder="处方单号/患者姓名" @searchQuery="handleSearch" @seachAfterInquiry="handleAfterInquiry" :isAfterInquiry="isAfterInquiry"></dispen-search>
          <span class="ml20 f16" v-if="tableData.uncollectedOutpatientDispense.length || tableData.currentOutpatientDispense.length">该患者共有{{tableData.uncollectedOutpatientDispense.length + tableData.currentOutpatientDispense.length}}个处方</span>
        </div>
      </div>
      <!-- 患者信息 -->
      <div v-if="tableData.currentOutpatientDispense.length" class="pos_re">
        <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
        <history-btn @getLogList="getLogList"></history-btn>
      </div>
      <!-- 已收处方 -->
      <div v-if="tableData.currentOutpatientDispense.length" class="clinic-table">
        <p class="table-type">已收处方</p>
        <div class="table-content" v-for="(item, index) in tableData.currentOutpatientDispense" :key="index" :class="item[0].adviceType == TRADITIONAL_CHINESE_MEDICINE || item[0].adviceType == CHINESE_PATENT_MEDICINE ? 'table-tcm-content' : ''">
          <el-row type="flex" align="middle" justify="start" class="table_title mb10">
            <el-col :span="24">
              <span class="light-gray">科室：</span>
              <span>{{item[0].providerName}}</span>
              <span class="ml20 light-gray">医生：</span>
              <span>{{item[0].doctorName}}</span>
              <span class="ml20 light-gray">诊断名称：</span>
              <span>{{curDiseaseName}}</span>
              <el-button v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_treatmentrecord')" style="margin-left: 10px !important;" type="text" @click="taskGoSendCrm(item[0])">诊疗记录</el-button>
              <el-button v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')" style="margin-left: 10px !important;" type="text" @click="reportOpen(item[0])">检查检验报告</el-button>
              <span class="ml20 blue f_bold" v-if="item[0].status != 6 && item[0].status != 7 && item[0].isInvalid">{{item[0].isInvalid == 1 ? '超时，待与医生沟通' : '超过3日，不能发药'}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" justify="start" class="table_title">
            <el-col :span="24">
              <span>处方单号：{{item[0].recipeId}}</span>
              <span class="ml20" v-if="item[0].adviceExecuteId">执行单号：{{item[0].adviceExecuteId}}</span>
              <span class="ml20 blue f_bold">{{setName(DISPENSING_STATUS, item[0].status)}}</span>
              <span class="ml20">申请时间：</span>
              <span v-if="item[0].createTime">{{item[0].createTime | formatDateByExp}}</span>

            </el-col>
            <el-button v-if="item[0].status == 2 && ((item[0].isInvalid != -1 && item[0].isInvalid != 2) || (item[0].isInvalid == -1 && item[0].notInvalid))" @click="updateDispense(item, 4)" type="primary">打印</el-button>
            <el-button v-if="item[0].status == 4 && ((item[0].isInvalid != -1 && item[0].isInvalid != 2) || (item[0].isInvalid == -1 && item[0].notInvalid))" @click="updateDispense(item, 5)" type="primary">摆药</el-button>
            <el-button v-if="item[0].status == 5 && item[0].identification == 0 && item[0].isInvalid != 2" type="primary" @click="updateDispense(item, 6)">{{item[0].isInvalid == 1 ? '医生已确认，发药' : '审核并发药'}}</el-button>
            <el-button v-if="item[0].status > 3 && item[0].status < 7 && item[0].identification == 0 && item[0].isInvalid != 2" @click="handlePrintPutMedicine(item)" type="primary">补打摆药单</el-button>
          </el-row>
          <tcm-template v-if="item[0].adviceType == TRADITIONAL_CHINESE_MEDICINE || item[0].adviceType == CHINESE_PATENT_MEDICINE" :templateData="item[1]"></tcm-template>
          <wm-template v-else @sendPrint="handlerSendPrint" :tableData="item[1]" :otherData="item[0]" :tableCellClassName="tableCellClassName" :changeTableBg="medicineListCode" :curPutCode="item[0].dispense && item[0].dispense.code" :isMatchSearch="true" :curStatus="item[0].status" :curInvalid="item[0].isInvalid" curTypes="outpatient" :curAdviceType="item[0].adviceType"></wm-template>
        </div>
      </div>
      <!-- 未收处方 -->
      <div v-if="tableData.uncollectedOutpatientDispense.length" class="clinic-table">
        <p class="table-type">未收处方</p>
        <div class="table-content" v-for="(item, index) in tableData.uncollectedOutpatientDispense" :key="index" :class="item[0].adviceType == TRADITIONAL_CHINESE_MEDICINE || item[0].adviceType == CHINESE_PATENT_MEDICINE ? 'table-tcm-content' : ''">
          <el-row type="flex" align="middle" justify="start" class="table_title mb10">
            <el-col :span="24">
              <span class="light-gray">科室：</span>
              <span>{{item[0].providerName}}</span>
              <span class="ml20 light-gray">医生：</span>
              <span>{{item[0].doctorName}}</span>
              <span class="ml20 light-gray">诊断名称：</span>
              <span>{{curDiseaseName}}</span>
              <el-button v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_treatmentrecord')" style="margin-left: 10px !important;" type="text" @click="taskGoSendCrm(item[0])">诊疗记录</el-button>
              <el-button v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')" style="margin-left: 10px !important;" type="text" @click="reportOpen(item[0])">检查检验报告</el-button>
              <span class="ml20 blue f_bold" v-if="item[0].status != 6 && item[0].status != 7 && item[0].isInvalid">{{item[0].isInvalid == 1 ? '超时，待与医生沟通' : '超过3日，不能发药'}}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" justify="start" class="table_title">
            <el-col :span="24">
              <span>处方单号：{{item[0].recipeId}}</span>
              <span class="ml20" v-if="item[0].adviceExecuteId">执行单号： {{item[0].adviceExecuteId}}</span>
              <span class="ml20 blue f_bold">{{setName(DISPENSING_STATUS, item[0].status)}}</span>
              <span class="ml20">申请时间：</span>
              <span v-if="item[0].createTime">{{item[0].createTime | formatDateByExp}}</span>
            </el-col>
          </el-row>
          <tcm-template v-if="item[0].adviceType == TRADITIONAL_CHINESE_MEDICINE || item[0].adviceType == CHINESE_PATENT_MEDICINE" :templateData="item[1]"></tcm-template>
          <wm-template v-else @sendPrint="handlerSendPrint" :tableData="item[1]" :otherData="item[0]" :tableCellClassName="tableCellClassName" :curStatus="item[0].status" :curInvalid="item[0].isInvalid" curTypes="outpatient" :curAdviceType="item[0].adviceType"></wm-template>
        </div>
      </div>
      <!-- 无数据提示 -->
      <everNoData v-if="!tableData.currentOutpatientDispense.length" class="no-data" tipTxt="暂无处方"></everNoData>
    </div>
    <!-- 弹窗对话 -->
    <tips-dialog ref="dialog" title="提示" content="当前患者还有未发药处方，是否结束当前任务开始新的任务？" :function="confirm"></tips-dialog>
    <!-- 操作记录 -->
    <control-record-dialog :recordData="controlData" :visible.sync="controlDialogVisible"></control-record-dialog>
    <!-- 检查检验报告 -->
    <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
    <jcp-print :key="jcpKey" ref="jcpPrint" hospitalType="1" :drugTableData="drugTableData" :nonPaternal="nonPaternal" :printPatientObj="printPatientObj" :fatherAdvice="fatherAdvice"></jcp-print>
  </div>
</template>

<script>
import api from '../store/clinicapi'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import { patch, SEARCH_CODE, DOSAGE, SPU_SPEC_CODE, DISPENSING_STATUS, OUTPATIENT_DATASOUCE, debounce, TRADITIONAL_CHINESE_MEDICINE, CHINESE_PATENT_MEDICINE, PATIENT_HEAD } from '@/util/common'
import setName from '@/util/setstatusname'
import wmTemplate from '@/warehouse/page/storages/components/wmtemplate'
import tcmTemplate from '@/warehouse/page/storages/components/tcmtemplate'
import controlRecordDialog from '@/warehouse/page/storages/components/controlrecorddialog'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import medicinePrint from '@/warehouse/page/storages/util/medicineprint'
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import reportDialog from '@/infusion/components/report.card.vue'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixins'
import JcpPrint from '@/warehouse/page/components/jcp.print'
export default {
  mixins: [setName, getStorage, sendDrug, medicinePrint, drugPrintMixins],
  data () {
    return {
      api,
      SEARCH_CODE,
      DOSAGE,
      SPU_SPEC_CODE,
      DISPENSING_STATUS,
      OUTPATIENT_DATASOUCE,
      TRADITIONAL_CHINESE_MEDICINE,
      CHINESE_PATENT_MEDICINE,
      seachObj: {},
      isAfterInquiry: false,
      currentVisitPatientId: '',
      currentVisitNumber: '',
      curDiseaseName: '',
      tableData: {
        currentOutpatientDispense: [],
        uncollectedOutpatientDispense: []
      },
      currentDispenseIds: [], // 当前已发药的数组
      controlDialogVisible: false, // 操作记录弹窗
      controlData: [], // 操作记录数据
      skipBaiYao: false, // 是否跳过摆药
      medicineListSub: 'OCH', // 匹配摆药单code
      medicineListCode: '',
      PATIENT_HEAD,
      reportKey: false,
    }
  },
  created () {
    this._getCursor()
    this.getSkipSetting()
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
    handlePrintPutMedicine: debounce(function (data) {
      if (!data.length) return
      this._gatherSingleRePrint(data)
      // this.handleReprint({ types: 'outpatient', isMakeUp: true, arr: item, isQueryPrint: true })
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
    handleAfterInquiry () {
      this.isAfterInquiry = false
    },
    // 查询
    async handleSearch (data) {
      if (/^R/.test(data.searchValue)) {
        const recipeData = await api.phrGetByRecipeCode({ recipeCode: data.searchValue })
        data.searchValue = recipeData.id
      }
      Object.assign(this.seachObj, data)
      if (!data.searchSelect && !data.searchValue) {
        this.$messageTips(this, 'warning', '请输入需要查询的处方单号或患者')
        return
      }
      let seachCode = ''
      let params = { storageRoomId: this.storageId, startDate: this.seachObj.startDate, endDate: this.seachObj.endDate }
      if (!data.searchSelect) seachCode = data.searchValue
      this.medicineListCode = ''
      if (this._strSubstring(seachCode)) {
        this.medicineListCode = seachCode
        this._seachMedicineList(this.medicineListCode)
      } else {
        let currentCtr = this.checkSearchConfig(seachCode)
        if (currentCtr === 'dialog') {
          this.$refs.dialog.open()
        } else if (currentCtr === 'fetch') {
          data.searchSelect ? Object.assign(params, { patientId: data.searchSelect }) : Object.assign(params, { adviceExecuteId: data.searchValue })
          this.currentlist(params)
        }
      }
      this._getCursor()
    },
    // 判断查询信息
    checkSearchConfig (str) {
      // 默认
      let tempFlag = 'dialog'
      // 首次请求
      if (this.tableData.currentOutpatientDispense.length === 0) tempFlag = 'fetch'
      // 检查已收处方中是否有未发药的处方单
      if (str) {
        if (this.tableData.currentOutpatientDispense.length) {
          this.tableData.currentOutpatientDispense.forEach(v => {
            if (v[0].recipeId === str || v[0].adviceExecuteId === str) {
              tempFlag = 'exist'
            }
          })
        }
        // 检查未收处方中是否已存在当前查询的处方单号
        if (this.tableData.uncollectedOutpatientDispense.length) {
          let pushFlag = false
          this.tableData.uncollectedOutpatientDispense.forEach(v => {
            if (v[0].recipeId === str || v[0].adviceExecuteId === str) {
              // 记录当前数据的index
              tempFlag = 'push'
              // 状态为待发药 需要添加到已收处方列表中 - *状态不做控制*
              // if (v[0].status === 5) {
              pushFlag = true
              this.tableData.currentOutpatientDispense.push(v)
              // }
            }
          })
          // 从未收处方中移除已添加到已收处方的列表中
          if (pushFlag) {
            this.tableData.uncollectedOutpatientDispense = this.tableData.uncollectedOutpatientDispense.filter(v => {
              return v[0].recipeId !== str && v[0].adviceExecuteId !== str
            })
          }
        }
      }
      return tempFlag
    },
    // 获取列表
    currentlist (params) {
      // 初始化数据
      this.tableData = {
        doctor: {},
        currentOutpatientDispense: [],
        uncollectedOutpatientDispense: [],
        patientObject: {}
      }
      // 请求数据
      // this.isAfterInquiry = true
      this.api.getByAdviceId(params).then(res => {
        // this.isAfterInquiry = false
        if (res && res.patientObject) {
          this.currentVisitPatientId = res.patientObject.id
        }
        if (res && res.uncollectedOutpatientDispense) {
          res.currentOutpatientDispense.forEach((item, index) => {
            if (item[0].status === 7) {
              res.currentOutpatientDispense.splice(index, 1)
            }
          })
          res.uncollectedOutpatientDispense.forEach((item, index) => {
            if (item[0].status === 7) {
              res.uncollectedOutpatientDispense.splice(index, 1)
            }
          })
          if (!res.currentOutpatientDispense.length) {
            this.$messageTips(this, 'warning', '该处方已取消', '')
            return
          }
          if (res.currentOutpatientDispense.length && res.currentOutpatientDispense[0][0]) this.currentVisitNumber = res.currentOutpatientDispense[0][0].visitSn
          if (res.uncollectedOutpatientDispense.length && res.uncollectedOutpatientDispense[0][0]) this.currentVisitNumber = res.uncollectedOutpatientDispense[0][0].visitSn
          this.tableData.currentOutpatientDispense = res.currentOutpatientDispense
          this.tableData.uncollectedOutpatientDispense = res.uncollectedOutpatientDispense
          this.tableData.doctor = res.doctor
          this.tableData.patientObject = res.patientObject
          if (res.zhenDuan) {
            let diseaseName = JSON.parse(JSON.parse(res.zhenDuan).ZHEN_DUAN)
            if (diseaseName && diseaseName[0]) this.curDiseaseName = diseaseName[0].diseaseName
          }
        }
        // <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
        // <history-btn @getLogList="getLogList"></history-btn>
        console.log(this.currentVisitPatientId, '===currentVisitPatientId')
        console.log(this.currentVisitNumber, '===currentVisitNumber')
        console.log(this.getLogList, '===getLogList')
        console.log(JSON.stringify(this.tableData.currentOutpatientDispense))
      })
    },
    // 点击确定
    confirm () {
      let params = { storageRoomId: this.storageId, startDate: this.seachObj.startDate, endDate: this.seachObj.endDate }
      this.seachObj.searchSelect ? Object.assign(params, { patientId: this.seachObj.searchSelect }) : Object.assign(params, { adviceExecuteId: this.seachObj.searchValue })
      this.currentlist(params)
    },
    // 发药
    updateDispense: debounce(function (item, status) {
      let tempObj = {
        outpatientDispenseIds: [item[0].id],
        status: status
      }
      this.api.updateDispenseType(tempObj).then(res => {
        if (res.success === 0) {
          if (status === 4) {
            this._gatherSinglePrintData(item)
            // this.handleReprint({ types: 'outpatient', arr: item, isQueryPrint: true })
          }
          this.$messageTips(this, 'success', `${status === 4 ? '打印' : status === 5 ? '摆药' : '发药'}成功`)
          this.currentDispenseIds = []
          this.currentDispenseIds.push({ // 记录成功的处方单号
            recipeId: item[0].recipeId,
            adviceExecuteId: item[0].adviceExecuteId
          })
        }
      })
    }),
    // 操作记录
    getLogList () {
      this.api.getLogList({ visitSn: this.tableData.currentOutpatientDispense[0][0].visitSn }).then(res => {
        if (res && res.dispenseLogListJson) {
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
    // 发药异常标记
    tableCellClassName ({ row, rowIndex }) {
      return row.outpatientDispenseItem.identification ? 'danger-row' : ''
    },
    // 输入摆药单号匹配已收处方中摆药单号
    _seachMedicineList (code) {
      if (this.tableData.currentOutpatientDispense && this.tableData.currentOutpatientDispense.length) {
        let unMedicineList = []
        this.tableData.currentOutpatientDispense.forEach(item => {
          if (!item[0].dispense || item[0].dispense.code !== code) unMedicineList.push(item)
        })
        if (unMedicineList.length) {
          if (unMedicineList.length === this.tableData.currentOutpatientDispense.length) this.$messageTips(this, 'warning', '该摆药单与已收处方不符')
        }
      }
    },
    _strSubstring (str) {
      return /^(F|OTC)/.test(str)
      // return str.substring(0, 3)
    },
    _getCursor () {
      this.$nextTick(() => {
        this.$refs.inputSeach.$el.querySelectorAll('input.el-input__inner')[0].focus()
        this.isAfterInquiry = true
      })
    },
    ...patch
  },
  watch: {
    // 根据已发药的数组更改处方单状态
    'currentDispenseIds' (value) {
      value.forEach(val => {
        this.tableData.currentOutpatientDispense.forEach(v => {
          // if (val.recipeId === v[0].recipeId && val.adviceExecuteId === v[0].adviceExecuteId) v[0].status = 6
          if (val.recipeId === v[0].recipeId && val.adviceExecuteId === v[0].adviceExecuteId) {
            switch (v[0].status) {
              case 2: // 待打印
                if (this.skipBaiYao) { // 跳过摆药
                  v[0].status = 5
                } else {
                  v[0].status = 4
                }
                break
              case 4: // 待摆药
                v[0].status = 5
                break
              case 5: // 待发药
                v[0].status = 6
                break
            }
          }
        })
      })
    }
  },
  components: {
    reportDialog,
    historyBtn,
    patientHeader,
    wmTemplate,
    tcmTemplate,
    controlRecordDialog,
    tipsDialog,
    JcpPrint,
    dispenSearch
  }
}
</script>

<style lang="scss" scoped>
.no-data {
  margin-top: 200px;
}
</style>
