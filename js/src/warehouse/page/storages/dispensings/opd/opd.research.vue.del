<template>
  <div id="opd" v-loading.fullscreen.lock="fullscreenLoading">
    <el-container class="hospital-container">
      <div class="custom-search-component searchClassName">
        <dispen-search
          ref="search"
          placeholder="处方单号/患者姓名"
          @searchQuery="handleSearch"
        >
        </dispen-search>
      </div>
    </el-container>
    <div v-if="tableData.currentOutpatientDispense.length || tableData.prescription.notPrint.length || tableData.prescription.print.length">
      <div class="pos_re">
        <patient-header :patientId="curPatientId" :visitNumber="curVisitNumber" :code="PATIENT_HEAD"></patient-header>
        <!-- <history-btn @getLogList="getLogList"></history-btn> -->
      </div>
      <div class="result_high mt15">
        <prescription-list class="inner" id="compHigh"
          :dispenData="tableData"
          :outTest="outTest"
          :testResult="testResult" @abnormal="abnormal"></prescription-list>
        <prescription-list class="inner" id="compHigh1" :class="{
            mt40: firstCompHigh
          }"
          :outTest="outTest"
          :testResult="testResult"
          :dispenData="hospitalData" @abnormal="abnormal"></prescription-list>
        <dispensings-list
          :outTest="outTest"
          :testResult="testResult"
          @makeUpPrint="makeUpPrint"
          @repeatPrint="repeatPrint"
          @sendPrintParent="handlerSendPrint"
          class="inner"
          :class="{
            mt40: firstCompHigh1
          }"
          :dispenData="tableData"
          @abnormal="abnormal"></dispensings-list>
        <!-- <div
          id="compHigh"
          class="inner" :is="firstComp" :dispenData="tableData"
          @abnormal="abnormal"></div>
        <div
          id="compHigh1"
          :class="{
            mt40: firstCompHigh
          }"
          class="inner" :is="firstComp" :dispenData="hospitalDispenseList"
          @abnormal="abnormal"></div>
        <div class="inner"
          :is="lastComp"
          :class="{
            mt40: firstCompHigh1
          }"
          :dispenData="tableData"
          @abnormal="abnormal"></div> -->
      </div>
    </div>
    <jcp-print :key="jcpKey" ref="jcpPrint" hospitalType="1" :drugTableData="drugTableData" :nonPaternal="nonPaternal" :printPatientObj="printPatientObj" :fatherAdvice="fatherAdvice"></jcp-print>
  </div>
</template>

<script>
import dispenSearch from '../components/dispen.search'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import prescriptionList from '../components/prescription.list.vue'
import dispensingsList from '../components/dispensings.list.vue'
import { PATIENT_HEAD } from '@/util/common'
import api from '../../store/clinicapi'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import skinTestMixins from '../mixins/skinTest.mixins'

import './index.scss'
export default {
  mixins: [getStorage, drugPrintMixins, skinTestMixins],
  data () {
    return {
      jcpKey: '',
      jcpKeyCount: 1,
      PATIENT_HEAD,
      curPatientId: '',
      curVisitNumber: '',
      fullscreenLoading: false,
      firstComp: 'prescriptionList',
      lastComp: 'dispensingsList',
      firstCompHigh: 0,
      firstCompHigh1: 0,
      currentVisitNumber: '',
      tableData: {
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
      patientId: ''
    }
  },
  created () {
    this.patientId = this.$route.query.patientId
    if (this.patientId) this.handleSearch({ patient: { id: this.patientId } })
  },
  methods: {
    _initComp () { // 默认优先展示处方单
      // 第一个处方单
      this.firstComp = 'prescriptionList'
      // 第二个摆药单
      this.lastComp = 'dispensingsList'
      this.firstCompHigh = 0
      this.firstCompHigh1 = 0
    },
    async handleSearch (data) {
      if (!data) return
      this._initComp() // 初始化处方单和摆药单展示位置
      const params = {
        storageRoomId: this.storageId
      }
      const reg = /^H./ // H开头的摆药单号
      if (data && (reg.test(data.recipeId) || reg.test(data.code))) {
        this.firstComp = 'dispensingsList'
        this.lastComp = 'prescriptionList'
      }
      if (data.recipeId) {
        params.code = data.recipeId
      } else if (data.code) {
        params.code = data.code
      } else if (data.patient) {
        params.patientId = data.patient.id
      } else {
        this.tableData.currentOutpatientDispense = []
        this.tableData.prescription.notPrint = []
        this.tableData.prescription.print = []
        this.$messageTips(this, 'warning', '请输入需要查询的处方单号或患者姓名', '')
        return
      }
      this.fullscreenLoading = true
      await api.searchByAdviceDispense(params)
        .then(res => {
          let dispenseList = res.dispenseList || []
          let outpatientDispenseList = res.outpatientDispenseList || []
          let hospitalDispenseList = res.outpatientDispenseHospitalList || []
          // 判断有误？？？已改为 watch -> currentVisitNumber
          // if (res.dispenseList && res.dispenseList.length) {
          //   let currentVisitNumber = res.dispenseList[0].outpatientDispenseList[0].visitSn
          //   this.getOutPatientSkinTest(currentVisitNumber)
          // }
          this.tableData = {
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
            this.curPatientId = dispenseList[0].outpatientDispenseList[0].patientId
            this.curVisitNumber = dispenseList[0].outpatientDispenseList[0].visitSn
            this.tableData.currentOutpatientDispense = dispenseList
            this.tableData.currentOutpatientDispense.map((item, index) => {
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
                this.tableData.currentOutpatientDispenseClass.notError.push(item)
              } else {
                item.outpatientDispenseListSuccess = _success
                item.outpatientDispenseListError = _error
                this.tableData.currentOutpatientDispenseClass.error.push(item)
              }
            })
          }
          if (outpatientDispenseList.length) { // 处方单维度(处方发药)
            this._setTableData(outpatientDispenseList, 'tableData')
          }
          if (hospitalDispenseList.length) { // 处方单维度（院内发药）
            this._setTableData(hospitalDispenseList, 'hospitalData')
          }
          this.$nextTick(_ => {
            this.firstCompHigh = document.querySelector('#compHigh') ? document.querySelector('#compHigh').offsetHeight : 0 // 获取元素内容高度， 是否添加边距
            this.firstCompHigh1 = document.querySelector('#compHigh1') ? document.querySelector('#compHigh1').offsetHeight : 0 // 获取元素内容高度， 是否添加边距
          })
        })
      this.fullscreenLoading = false
    },
    _setTableData (originData, newData) {
      this.curPatientId = originData[0].patientId
      this.curVisitNumber = originData[0].visitSn
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
      data && this.handleSearch(this.$refs.search.searchObj)
      obj && this.repeatPrint(obj)
    },
    makeUpPrint (item) {
      this.jcpKey = this.jcpKeyCount++
      //  调用打印
      let dispenseVoList = item.outpatientDispenseList
      let patientObject = item.patientObject
      this.gatherPrintData({
        outpatientDispenseInfo: dispenseVoList,
        patientObject: Object.assign(patientObject, { barCode: item.code, visitSn: this.curVisitNumber })
      }, ['drugTableData'])
    },
    repeatPrint (data) {
      this.jcpKey = this.jcpKeyCount++
      this.gatherPrintData({
        outpatientDispenseInfo: data.dispenseVoList,
        patientObject: Object.assign(data.patientObject, { barCode: data.barCode, visitSn: this.curVisitNumber })
      })
      data.searchObj && this.handleSearch(this.$refs.search.searchObj)
    },
    getLogList () {
      api.getLogList({ visitSn: this.tableData.currentOutpatientDispense[0] ? this.tableData.currentOutpatientDispense[0].outpatientDispenseList[0].visitSn : (this.tableData.prescription.notPrint[0] ? this.tableData.prescription.notPrint[0].visitSn : this.tableData.prescription.print[0].visitSn) }).then(res => {
        if (res && res.dispenseLogListJson) {
          this.controlData = res.dispenseLogListJson
          this.handleLogList(this.controlData)
          this.controlDialogVisible = true
        }
      })
    }
  },
  watch: {
    'currentVisitNumber' (v) {
      this.getOutPatientSkinTest(v)
    }
  },
  components: {
    dispenSearch,
    dispensingsList,
    prescriptionList,
    patientHeader,
    JcpPrint,
    historyBtn
  }
}
</script>

<style scoped>
.result_high {
  height: calc(100vh - 255px);
  overflow-y: auto;
}
</style>
