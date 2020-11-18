

<template>
  <div id="opd">
    <el-container class="hospital-container">
      <dispen-search
        ref="ipdpresc"
        placeholder="备药单号"
        :isSearchUser="true"
        @searchQuery="handleSearch">
      </dispen-search>
    </el-container>
    <el-container class="pos_re dispense_container">
      <div class="pr-l" :class="[expandTable ? 'pr-l-w' : '']">
        <ul class="dispense_tabs clearfix">
          <li :class="[dispenseType === 'opd' ? 'is-active' : '']" @click="dispenseType = 'opd'">处方发药</li>
          <li :class="[dispenseType === 'ipd' ? 'is-active' : '']" @click="dispenseType = 'ipd'">院内发药</li>
          <el-button class="pos_ab" type="text" :class="[expandTable ? 'i-zhankai' : '']" @click="expandTable = !expandTable">
            <i class="iconfont icon-zhankai"></i>
          </el-button>
        </ul>
        <el-row class="dispense_pad pos_re">
          <el-col>
            <ever-select v-model="listQueryObj.status" :options="handleDispensingStatus" placeholder="请选择发药状态" :disabled="fullscreenLoading" :clearable="true"></ever-select>
          </el-col>
        </el-row>
        <div class="dispense_list pos_re" style="margin-top: -10px">
          <el-table
            ref="opdTable"
            v-loading.body="fullscreenLoading"
            :data.sync="tableData"
            style="width: 100%"
            :height="'calc(100vh - 290px)'"
            highlight-current-row
            class="no-border"
            @selection-change="handleSelectionChange"
            @row-click="handleDetails">
            <el-table-column
              class-name="pointer"
              :width="listQueryObj.status == 2 ? '100' : '120'"
              label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.patientName}}</span>
                <span v-if="scope.row.addCount" class="font red">+{{scope.row.addCount}}</span>
                <el-tooltip content="邮寄" placement="top" v-if="scope.row.mailFlag">
                  <svg class="icon f16" aria-hidden="true">
                    <use xlink:href="#icon-youji"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip
              width="90"
              class-name="pointer"
              label="科室">
              <template slot-scope="scope">
                <span>{{scope.row.providerName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              class-name="pointer"
              label="医师">
              <template slot-scope="scope">
                <span v-if="scope.row.doctorName">{{scope.row.doctorName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="expandTable"
              width="157"
              label="开单时间">
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
      <div class="pr-r" v-if="tablePatientData.length">
        <!-- 患者信息 -->
        <div class="pos_re" v-if="currentVisitPatientId">
          <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
          <history-btn :visitSn="currentVisitNumber" :implementType="listQueryObj.implementType"></history-btn>
        </div>
        <!-- 诊断基本信息 -->
        <div class="patient_prescription">
          <receipt-mail :itemData="tablePatientData[0]" v-if="tablePatientData[0].outpatientDispenseList[0].mailFlag"></receipt-mail>
          <div class="patient_list" v-for="(item, index) in tablePatientData" :key="index + 'parent'">
            <div class="patient_title f_bold pos_re">
              备药单号：{{item.code}}
              <i class="oldcode ml20" v-if="item.oldCode">（原单号：{{item.oldCode}}）</i>
              <el-button type="text" v-if="item.newArr.length
              && dispenseSettingObject.outPatientDispenseSettingObject
              && dispenseSettingObject.outPatientDispenseSettingObject.dispensePreparePrint == 1" @click="makeUpPrint(item)" class="patient_btn_width opabsolute">补打备药单</el-button>
            </div>
            <!-- 检查信息 -->
            <!-- <div class="doctor-info">
              <check-information :propData="tablePatientData[0].outpatientDispenseList[0]"></check-information>
            </div> -->
            <div v-for="(childItem, childIndex) in item.newArr" :key="childIndex + 'child'">
              <chinese-prescription
                :doctorData="tablePatientData[0].outpatientDispenseList[0]"
                :opdData="childItem"
                :key="childIndex + 'cp'"
                @updateDispenseStatus="updateDispenseStatus"
                :patientData="childItem.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(childItem.adviceType)"></chinese-prescription>
              <!--正常 单个处方详情信息 -->
              <wast-prescription
                v-else
                :doctorData="tablePatientData[0].outpatientDispenseList[0]"
                :key="childIndex + 'wp'"
                @sendPrint="handlerSendPrint"
                :patientObject="item.patientObject"
                :storageRoomObject="item.storageRoomObject"
                :itemData="childItem"
                :mailState="childItem.mailFlag"
                :itemId="childItem.id"
                :mailData="item"
                :date="childItem.createTime"
                :identification="childItem.identification"
                :status="childItem.status"
                :patientData="childItem.outpatientDispenseItemList"
                :visitSn="currentVisitNumber"
                :outTest="outTest"
                :testResult="testResult"
                @updateDispenseStatus="updateDispenseStatus">
              </wast-prescription>
            </div>
            <div class="patient_title f_bold mt10" v-if="item.errArr && item.errArr.length">
              以下为备药单中异常的处方
            </div>
            <div class="design_error_table" v-for="(childItem, childIndex) in item.errArr" :key="childIndex + 'childError'">
              <chinese-prescription
                :opdData="childItem"
                :doctorData="tablePatientData[0].outpatientDispenseList[0]"
                :key="childIndex + 'ce'"
                @updateDispenseStatus="updateDispenseStatus"
                :patientData="childItem.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(childItem.adviceType)"></chinese-prescription>
              <!--异常 单个处方详情信息 -->
              <wast-prescription
                v-else
                :key="childIndex + 'we'"
                :doctorData="tablePatientData[0].outpatientDispenseList[0]"
                @sendPrint="handlerSendPrint"
                :patientObject="item.patientObject"
                :storageRoomObject="item.storageRoomObject"
                :itemData="childItem"
                :itemId="childItem.id"
                :date="childItem.createTime"
                :identification="childItem.identification"
                :status="childItem.status"
                :patientData="childItem.outpatientDispenseItemList"
                :outTest="outTest"
                :testResult="testResult"
                @updateDispenseStatus="updateDispenseStatus">
              </wast-prescription>
            </div>
            <div class="patient_footer">
              <el-button :loading="dispensePrintLoading" type="primary" v-if="(listQueryObj.status === 4 || listQueryObj.status === 5) && item.newArr.length && item.errArr.length" @click="updateRepeatOutpatientDispensePrint(item)" class="patient_btn_width">重打备药单</el-button>
              <el-button :loading="dispensePrintLoading" type="primary" v-if="listQueryObj.status === 4 && !item.errArr.length" @click="updateDispensePrint(item)" class="patient_btn_width">备药完成</el-button>
              <el-button :loading="dispensePrintLoading" type="primary" v-if="listQueryObj.status === 5 && !item.errArr.length" @click="updateDispensePrint(item)" class="patient_btn_width">审核并发药</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-container>
    <!-- 邮寄组件 -->
    <mail-dialog
      :popData="popData"
      :visible.sync="dialogVisibleMail"
      :isClick="isClick"
      @sendMedicine="sendMedicine">
    </mail-dialog>
    <!-- 打印组件 -->
    <jcp-print :key="jcpKey" ref="jcpPrint" hospitalType="1" :drugTableData="drugTableData" :nonPaternal="nonPaternal" :printPatientObj="printPatientObj" :fatherAdvice="fatherAdvice"></jcp-print>
    <!-- 搜索备药单弹出框 -->
    <opd-search-prescription
      ref="opdsearch"
      :opdsearchObj="opdsearchObj"
      :opdSearchList="opdSearchList"
      @closeSearchPop="closeSearchPop"
      @updateSearchOpd="updateSearchOpd"></opd-search-prescription>
  </div>
</template>

<script>
// 任务打印
import commonApi from '../store/dispensingcommonapi.js'
import clinicapi from '../../store/clinicapi.js'
import dispenSearch from '../components/dispen.search'
import mailDialog from '@/warehouse/page/storages/components/maildialog'
import opdSearchPrescription from '../components/opd.search.prescription'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import checkInformation from '../components/check.information'
import wastPrescription from '../components/west.prescription.vue'
import chinesePrescription from '../components/chinese.prescription'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { PATIENT_HEAD, DISPENSING_STATUS, CHINESE_MEDICINE_TYPE, objGet } from '@/util/common'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import './index.scss'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
import receiptMail from '../components/receiptmail'
import skinTestMixins from '../mixins/skinTest.mixins'
export default {
  mixins: [getstorage, drugPrintMixins, dispenseSettingMixin, skinTestMixins],
  data () {
    let listQueryObj = {
      implementType: 2,
      status: ''
    }
    return {
      popData: {}, // 当前备药单
      dialogVisibleMail: false, //  填写邮寄信息弹窗
      listQueryObj,
      CHINESE_MEDICINE_TYPE,
      DISPENSING_STATUS,
      expandTable: false,
      fullscreenLoading: false,
      tableData: [],
      tablePatientData: [],
      selectVisitSnList: [],
      opdSearchList: [],
      opdsearchObj: {},
      medicineCheck: false,
      isClick: false,
      dispensePrintLoading: false,
      clickBtnDispenseId: '',
      totalCount: 0,
      PATIENT_HEAD,
      offset: 0,
      pagesize: 20,
      currentVisitPatientId: '', // 当前选中患者patientId
      currentVisitNumber: '', // 当前门诊号
      currentVisitSn: '',
      dispenseType: 'opd' // 发药类型
    }
  },
  created () {
    this._initRoute(this.$route.name)
    this.listQueryObj.storageRoomId = this.storageId
    this.listQueryObj.searchType = 1
    this.listQueryObj.status = this.handleDispensingStatus[0].id
    // this.getVisitSnList()
  },
  computed: {
    // 过滤缺货状态
    handleDispensingStatus () {
      let tempStatusData = DISPENSING_STATUS.filter(v => {
        let arr = [5, 6]
        if (objGet(this.dispenseSettingObject, 'outPatientDispenseSettingObject.dispensePrepare', '') === 1) arr.unshift(4)
        return arr.includes(v.id)
      })
      this.listQueryObj.status = tempStatusData[0].id
      return tempStatusData
    }
  },
  methods: {
    _initData () {
      this.tableData = []
      this.tablePatientData = []
      this.offset = 0
      this.currentVisitPatientId = ''
      this.currentVisitNumber = ''
      this.clickBtnDispenseId = ''
    },
    _findArray (arr, str) {
      //  获取到的数组中区分 正常处方和异常处方  arr原数组  str要区分的匹配值
      let newArr = []
      let errArr = []
      arr.forEach(item => {
        if (item.identification || item.status === 7) {
          errArr.push(item)
        } else {
          newArr.push(item)
        }
      })
      //  输出一个对象 newArr为正常处方  errArr为异常处方
      return { newArr: newArr, errArr: errArr }
    },
    closeSearchPop (v) {
      this.$nextTick(() => {
        this.$refs.ipdpresc.$el.querySelectorAll('input.el-input__inner')[0].focus()
      })
      this.opdsearchObj = {}
    },
    updateSearchOpd (v) {
      this.getVisitSnList()
    },
    handleSearch (v) {
      if (v.code) {
        this.opdsearchObj = v
        this.opdsearchObj.storageRoomId = this.storageId
        clinicapi.getByAdviceDispense(this.opdsearchObj).then(res => {
          if (res && res.length) {
            this.opdSearchList = res
            this.$refs.opdsearch.dialogVisible = true
          }
        })
        this.$refs.ipdpresc.searchValue = ''
      }
    },
    pageClick (v) {
      if (v === 'prev') {
        this.offset = this.offset - this.pagesize
        this.getVisitSnList()
      } else {
        this.offset = this.offset + this.pagesize
        this.getVisitSnList()
      }
    },
    makeUpPrint (item) {
      //  调用打印
      this.JcpPrint = this.curCount++
      let dispenseVoList = item.outpatientDispenseList
      let patientObject = item.patientObject || {}
      this.gatherPrintData({
        outpatientDispenseInfo: dispenseVoList,
        patientObject: Object.assign(patientObject, { barCode: item.code, visitSn: this.currentVisitNumber })
      }, ['drugTableData'])
    },
    // handleMedicineCheck () {
    //   this.medicineCheck ? this.listQueryObj.identification = 1 : delete this.listQueryObj.identification
    //   this.getVisitSnList()
    // },
    updateDispenseStatus (obj) {
      this.handleDetails()
    },
    // 发药邮寄下的审核并发药
    async sendMedicine (v, id, status, isClick) {
      let params = {
        dispenseId: id,
        status: this.listQueryObj.status + 1,
        expressInformationList: v
      }
      this.dispensePrintLoading = true
      commonApi.updateDispenseStatus(params).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', '审核发药完成')
          this.isClick = true
          this.handleDetails()
        } else {
          this.handleDetails()
        }
      })
      this.handleDetails()
      this.dispensePrintLoading = false
      this.dialogVisibleMail = false
    },
    async updateDispensePrint (item) {    //  批量操作备药单
      this.isClick = true
      if (item.outpatientDispenseList[0].status === 4 || item.outpatientDispenseList[0].status === 5 && !item.outpatientDispenseList[0].mailFlag && !item.outpatientDispenseList[0].mailAddressObject) {
        if (this.clickBtnDispenseId === item.id) return // 防止点击过快， 相同数据提交
        this.clickBtnDispenseId = item.id
        let params = {
          dispenseId: item.id,
          status: this.listQueryObj.status + 1
        }
        this.dispensePrintLoading = true
        commonApi.updateDispenseStatus(params).then(res => {
          if (res && res.flag) {
            this.$messageTips(this, 'success', this.listQueryObj.status === 4 ? '备药成功' : '审核发药完成')
            this.handleDetails()
          } else {
            this.handleDetails()
          }
        })
        this.dispensePrintLoading = false
      } else {
        this.popData = item
        this.dialogVisibleMail = true
      }
    },
    async updateRepeatOutpatientDispensePrint (item) {
      let params = {
        dispenseId: item.id,
        storageRoomId: this.listQueryObj.storageRoomId
      }
      this.dispensePrintLoading = true
      await commonApi.updateRepeatOutpatientDispensePrint(params).then(res => {
        if (res) {
          //  调用打印
          let dispenseVoList = res.dispenseVoList[0].outpatientDispenseList
          let patientObject = res.dispenseVoList[0].patientObject
          this.gatherPrintData({
            outpatientDispenseInfo: dispenseVoList,
            patientObject: Object.assign(patientObject, { barCode: res.dispenseVoList[0].code, visitSn: this.currentVisitNumber })
          })
          this.$messageTips(this, 'success', '重新打印备药单完成')
          this.handleDetails()
        }
      })
      this.dispensePrintLoading = false
    },
    handleSelectionChange (v) {
      this.selectVisitSnList = []
      v.forEach(item => {
        this.selectVisitSnList.push(item.visitSn)
      })
    },
    isClickData () { // 提取发药完成||备药完成删除当前数据方法
      let index = this.tableData.findIndex(item => {
        return item.visitSn === this.currentVisitNumber
      })
      this.tableData.splice(index, 1)
      if (this.tableData.length) {
        this.$nextTick(_ => {
          this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
        })
      } else {
        this._initData()
      }
    },
    handleDetails (data) {
      let params
      if (data) {
        this.currentVisitPatientId = data.patientId
        this.currentVisitNumber = data.visitSn
        params = Object.assign({ isPrint: data.isPrint, visitSn: data.visitSn, mailFlag: data.mailFlag }, this.listQueryObj)
      } else {
        params = Object.assign({ isPrint: 2, visitSn: this.currentVisitNumber }, this.listQueryObj)
      }
      commonApi.getDispenseByVisitSn(params).then(res => {
        if (res && res.length) {
          res.forEach(item => {
            Object.assign(item, this._findArray(item.outpatientDispenseList, 'identification'))
          })
          this.tablePatientData = res
        } else {
          if (this.isClick) {
            this.isClickData()
          }
        }
      })
    },
    getVisitSnList () {
      let params = Object.assign({ isPrint: 2, offset: this.offset, pagesize: this.pagesize }, this.listQueryObj)
      commonApi.getDispenseVisitSnList(params).then(res => {
        if (res && res.list) {
          this.tableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            this.$refs.opdTable && this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
          })
        } else {
          this._initData()
        }
      })
    },
    _initRoute (v) {
      if (v === 'opdprescription') {            //  处方发药
        this.listQueryObj.implementType = 2
        this.listQueryObj.status = this.handleDispensingStatus[0].id
      } else if (v === 'opdcompound') {      //  院内发药
        this.listQueryObj.implementType = 1
        this.listQueryObj.status = this.handleDispensingStatus[0].id
      }
    }
  },
  watch: {
    'dispenseType' (v) {
      this._initData()
      if (v === 'opd') {
        this.listQueryObj.implementType = 2
        this.getVisitSnList()
      } else {
        this.listQueryObj.implementType = 1
        this.getVisitSnList()
      }
    },
    // 发药状态选择
    'listQueryObj.status' (val) {
      this._initData()
      this.getVisitSnList()
    },
    '$route.name' (v) {
      this._initRoute(v)
      this.isClick = false
      this._initData()
      this.getVisitSnList()
    },
    'dialogVisibleMail': {
      handler (v) {
        if (this.listQueryObj.status === 5 && !v) {
          this.isClick = false
        }
      }
    },
    'currentVisitNumber' (v) {
      this.getOutPatientSkinTest(v)
    }
  },
  components: {
    mailDialog,
    dispenSearch,
    patientHeader,
    checkInformation,
    historyBtn,
    receiptMail,
    wastPrescription,
    chinesePrescription,
    JcpPrint,
    opdSearchPrescription
  }
}
</script>

<style scoped>
#opd .dispense_container .pr-r .patient_prescription .patient_footer{
  position: relative;
  left: 0;
  bottom: 0;
  z-index: 0;
}
.patient_prescription {
  height: calc(100vh - 220px)!important;
}
.patient_list {
  margin-bottom: 15px;
}
/* #opd .patient_title {
  padding-top: 15px;
  padding-bottom: 10px;
} */
.oldcode{
  font-style: normal;
  color: #999;
}
/* .patient_title.danger {
  margin-bottom: 10px!important;
}
.receipt-info {
  height: 30px;
  line-height: 30px;
  padding: 5px 15px;
}
.receipt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
}
.ml6 {
  margin-left: 6px;
}
} */
</style>
