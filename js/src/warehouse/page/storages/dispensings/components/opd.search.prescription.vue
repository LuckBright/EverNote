<template>
  <el-dialog
    title
    :visible="dialogVisible"
    width="95%"
    :modal="false"
    class="opdsearch"
    v-loading.fullscreen.lock="loadingSw"
    :before-close="handleClose"
  >
    <!-- 右侧 -->
    <div v-if="tablePatientData.length">
      <!-- 患者信息 -->
      <div class="pos_re bor_1" v-if="patientId">
        <patient-header :patientId="patientId" :visitNumber="visitSn" :code="PATIENT_HEAD"></patient-header>
        <history-btn :visitSn="visitSn" :implementType="implementType"></history-btn>
      </div>
      <!-- 诊断基本信息 -->
      <div class="patient_prescription mt20">
        <div v-for="(item, index) in tablePatientData" :key="index + 'parent'">
          <div class="patient_title f_bold f16 clearfix">
            备药单号：{{item.code}}
            <i class="oldcode ml20" v-if="item.oldCode">（原单号：{{item.oldCode}}）</i>
            <el-button
              type="text"
              v-if="item.newArr.length
            && dispenseSettingObject.outPatientDispenseSettingObject
            && dispenseSettingObject.outPatientDispenseSettingObject.dispensePreparePrint == 1"
              @click="makeUpPrint(item)"
              class="patient_btn_width opabsolute fr"
            >补打备药单</el-button>
          </div>
          <div
            class="patient_list"
            v-for="(childItem, childIndex) in item.newArr"
            :key="childIndex + 'child'"
          >
            <chinese-prescription
              :doctorData="tablePatientData[0].outpatientDispenseList[0]"
              :opdData="childItem"
              :key="childIndex + 'cp'"
              @updateDispenseStatus="updateDispenseStatus"
              :patientData="childItem.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(childItem.adviceType)"
            ></chinese-prescription>
            <!--正常 单个处方详情信息 -->
            <wast-prescription
              v-else
              :doctorData="tablePatientData[0].outpatientDispenseList[0]"
              :key="childIndex + 'wp'"
              @sendPrint="handlerSendPrint"
              :patientObject="item.patientObject"
              :storageRoomObject="item.storageRoomObject"
              :itemData="childItem"
              :itemId="childItem.id"
              :date="childItem.createTime"
              :identification="childItem.identification"
              :status="childItem.status"
              :testResult="testResult"
              :outTest="outTest"
              :patientData="childItem.outpatientDispenseItemList"
              @updateDispenseStatus="updateDispenseStatus"
            ></wast-prescription>
          </div>
          <div class="patient_list" v-if="item.errArr && item.errArr.length">
            <div class="patient_title danger mt20 f_bold f16">以下为备药单中异常的处方</div>
          </div>
          <div
            class="patient_list mt10"
            v-for="(childItem, childIndex) in item.errArr"
            :key="childIndex + 'childError'"
          >
            <chinese-prescription
              :opdData="childItem"
              :doctorData="tablePatientData[0].outpatientDispenseList[0]"
              :key="childIndex + 'ce'"
              @updateDispenseStatus="updateDispenseStatus"
              :patientData="childItem.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(childItem.adviceType)"
            ></chinese-prescription>
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
              :testResult="testResult"
              :outTest="outTest"
              :appendBody="true"
              :patientData="childItem.outpatientDispenseItemList"
              @updateDispenseStatus="updateDispenseStatus"
            ></wast-prescription>
          </div>
          <div slot="footer" class="dialog-footer" v-if="[4, 5].includes(status)">
            <el-button
              :loading="dispensePrintLoading"
              type="primary"
              v-if="(status === 4 || status === 5) && item.newArr.length && item.errArr.length"
              @click="updateRepeatOutpatientDispensePrint(item)"
              class="patient_btn_width"
            >重打备药单</el-button>
            <el-button
              :loading="dispensePrintLoading"
              type="primary"
              v-if="status === 4 && !item.errArr.length"
              @click="updateDispensePrint(item)"
              class="patient_btn_width"
            >备药完成</el-button>
            <el-button
              :loading="dispensePrintLoading"
              type="primary"
              v-if="status === 5 && !item.errArr.length"
              @click="updateDispensePrint(item)"
              class="patient_btn_width"
            >审核并发药</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 打印组件 -->
    <jcp-print
      :key="jcpKey"
      ref="jcpPrint"
      hospitalType="1"
      :drugTableData="drugTableData"
      :nonPaternal="nonPaternal"
      :printPatientObj="printPatientObj"
      :fatherAdvice="fatherAdvice"
    ></jcp-print>
  </el-dialog>
</template>

<script>
import commonApi from '../store/dispensingcommonapi.js'
import clinicapi from '../../store/clinicapi.js'
import wastPrescription from '../components/west.prescription.vue'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import checkInformation from '../components/check.information'
import chinesePrescription from '../components/chinese.prescription'
import { PATIENT_HEAD, DISPENSING_STATUS, CHINESE_MEDICINE_TYPE } from '@/util/common'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
import skinTestMixins from '../mixins/skinTest.mixins'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import '../opd/index.scss'
export default {
  mixins: [dispenseSettingMixin, getstorage, skinTestMixins, drugPrintMixins],
  props: {
    opdsearchObj: {
      type: Object,
      default: () => ({})
    },
    opdSearchList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    wastPrescription,
    checkInformation,
    chinesePrescription,
    patientHeader,
    historyBtn,
    JcpPrint
  },
  data () {
    return {
      CHINESE_MEDICINE_TYPE,
      DISPENSING_STATUS,
      PATIENT_HEAD,
      status: 4,
      patientId: '',
      visitSn: '',
      clickBtnDispenseId: '',
      implementType: 2,
      dispensePrintLoading: false,
      dialogVisible: false,
      loadingSw: false,
      tablePatientData: []
    }
  },
  methods: {
    handlerSendPrint (v) {

    },
    async updateRepeatOutpatientDispensePrint (item) {
      let params = {
        dispenseId: item.id,
        storageRoomId: this.storageId
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
          this.opdsearchObj.code = res.dispenseVoList[0].code
          this.getList()
          this.$emit('updateSearchOpd', true)
        }
      })
      this.dispensePrintLoading = false
    },
    makeUpPrint (item) {
      //  调用打印
      this.JcpPrint = this.curCount++
      let dispenseVoList = item.outpatientDispenseList
      let patientObject = item.patientObject
      this.gatherPrintData({
        outpatientDispenseInfo: dispenseVoList,
        patientObject: Object.assign(patientObject, { barCode: item.code, visitSn: this.currentVisitNumber })
      }, ['drugTableData'])
    },
    updateDispenseStatus (v) {
      this.getList()
      this.$emit('updateSearchOpd', true)
    },
    findaTableData (res) {
      if (res && res.length) {
        res.forEach(item => {
          Object.assign(item, this._findArray(item.outpatientDispenseList, 'identification'))
        })
        this.status = res[0].outpatientDispenseList[0].status
        this.visitSn = res[0].outpatientDispenseList[0].visitSn
        this.patientId = res[0].outpatientDispenseList[0].patientId
        this.implementType = res[0].outpatientDispenseList[0].implementType
        this.tablePatientData = res
      } else {
        this.dialogVisible = false
      }
    },
    getList () {
      this.loadingSw = true
      clinicapi.getByAdviceDispense(this.opdsearchObj).then(res => {
        this.findaTableData(res)
        this.loadingSw = false
      })
    },
    async updateDispensePrint (item) {    //  批量操作备药单
      if (this.clickBtnDispenseId === item.id) return // 防止点击过快， 相同数据提交
      this.clickBtnDispenseId = item.id
      let params = {
        dispenseId: item.id,
        status: this.status + 1
      }
      this.dispensePrintLoading = true
      await commonApi.updateDispenseStatus(params).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', this.status === 4 ? '备药成功' : '审核发药完成')
          this.$emit('updateSearchOpd', true)
          this.getList()
          this.clickBtnDispenseId = ''
          // this.dialogVisible = false
        }
      })
      this.dispensePrintLoading = false
    },
    handleClose (v) {
      this.dialogVisible = false
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
    }
  },
  watch: {
    'dialogVisible' (v) {
      if (v) {
        // this.getList()
      } else {
        this.$emit('closeSearchPop', true)
        this.tablePatientData = []
      }
    },
    'visitSn' (v) {
      this.getOutPatientSkinTest(v)
    },
    'opdSearchList' (v) {
      this.findaTableData(v)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: center;
  margin-top: 15px;
  padding-top: 15px;
}
.opdsearch /deep/ .el-dialog {
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
  .patient_prescription {
    overflow-y: auto;
    height: 350px;
  }
}
</style>
