<template>
  <div>
    <div :class="isScroll ? 'patient_prescription noscroll' : 'patient_prescription'" v-if="dispenData.prescription.notPrint.length || dispenData.prescription.print.length">
      <div class="patient_list">
        <receipt-mail :itemData="[...dispenData.prescription.notPrint, ...dispenData.prescription.print]" v-if="[...dispenData.prescription.notPrint, ...dispenData.prescription.print][0].mailFlag && [...dispenData.prescription.notPrint, ...dispenData.prescription.print][0].mailAddressObject" style="marginLeft: -15px;"></receipt-mail>
        <div v-if="dispenData.prescription.notPrint.length" class=" pb10">
          <!-- <check-information
            :propData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
          ></check-information> -->
          <div v-for="(bill, bindex) in dispenData.prescription.notPrint" :key="bindex + 'notPrint'">
            <chinese-prescription
              :opdData="bill"
              :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
              :isSelect="bill.select"
              :isPrint="false"
              :key="'chinese-not-print' + bindex"
              @print="print"
              @updateDispenseStatus="abnormal"
              :patientData="bill.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"></chinese-prescription>
            <wast-prescription
              v-else
              :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
              :key="'west-not-print' + bindex"
              :code="bill.recipeCode"
              :identification="bill.identification"
              :itemId="bill.id"
              :isPrint="false"
              :mailState="bill.mailFlag"
              :checked="bill.checked"
              :date="bill.createTime"
              :excCode="bill.adviceExecuteId"
              :status="bill.status"
              :outOfStock="bill.outOfStock"
              :itemData="bill"
              :patientData="bill.outpatientDispenseItemList"
              :visitSn="bill.visitSn"
              :outTest="outTest"
              :testResult="testResult"
              @updateDispenseStatus="abnormal"
              @print="print"
              @sendPrint="sendPrintParent"
              :storageRoomObject="bill.storageRoomObject"
              :patientObject="bill.patientObject"
            ></wast-prescription>
          </div>
          <!-- 数据查询  为了兼容单人协作  暂时去掉了打印生成备药单操作 -->
          <div class="patient_footer">
            <!-- <div v-if="checkedRecipeId[0]">
              <el-checkbox class="fl" v-model="all" @change="handleCheckAll">全选</el-checkbox>
              <el-button type="primary" @click="updateDispensePrint" class="patient_btn_width">打印</el-button>
            </div> -->
          </div>
        </div>
        <div v-if="dispenData.prescription.print.length" class="patient_title f_bold">以下为异常处方</div>
        <div v-if="dispenData.prescription.print.length" class="patient_box" style="padding-bottom: 15px">
          <!-- <check-information
            :propData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
          ></check-information> -->
          <div class="design_error_table" v-for="(bill, bindex) in dispenData.prescription.print" :key="bindex + 'print'">
            <chinese-prescription
              :opdData="bill"
              :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
              :key="'chinese-print' + bindex"
              @updateDispenseStatus="abnormal"
              :patientData="bill.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"></chinese-prescription>
            <wast-prescription
              v-else
              :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
              :key="'west-print' + bindex"
              :code="bill.recipeCode"
              :identification="bill.identification"
              :itemId="bill.id"
              :mailState="bill.mailFlag"
              :itemData="bill"
              :date="bill.createTime"
              :excCode="bill.adviceExecuteId"
              :status="bill.status"
              :storageRoomObject="bill.storageRoomObject"
              :patientObject="bill.patientObject"
              :outOfStock="bill.outOfStock"
              :outTest="outTest"
              :testResult="testResult"
              :patientData="bill.outpatientDispenseItemList"
              @updateDispenseStatus="abnormal"
              @sendPrint="sendPrintParent"
            ></wast-prescription>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// 处方单
import wastPrescription from '@/warehouse/page/storages/dispensings/components/west.prescription'
import checkInformation from '@/warehouse/page/storages/dispensings/components/check.information.vue'
import commonApi from '../store/dispensingcommonapi.js'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import chinesePrescription from './chinese.prescription'
import { CHINESE_MEDICINE_TYPE } from '@/util/common'
import '../opd/index.scss'
import receiptMail from '../components/receiptmail'
export default {
  props: {
    dispenData: {
      type: Object,
      default () {
        return {}
      }
    },
    outTest: {
      type: Boolean,
      default: true
    },
    isScroll: {
      type: Boolean,
      default: false
    },
    testResult: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mixins: [getstorage],
  data () {
    return {
      checkedRecipeId: [],
      CHINESE_MEDICINE_TYPE,
      cachaOutpatientDispenseIds: '',
      all: false
    }
  },
  created () {
    this.renderInitSelect(true)
  },
  methods: {
    sendPrintParent (data, code, adviceType, patientObject, storageRoomObject, doctorData) {
      this.$emit('sendPrintParent', data, code, adviceType, patientObject, storageRoomObject, doctorData)
    },
    abnormal (data) {
      data && this.$emit('abnormal', true)
    },
    print (v) {
      let index = this.checkedRecipeId.findIndex(item => {
        return item.id === v.id
      })
      if (v && v.status) {
        this.checkedRecipeId.push(v)
      } else {
        this.checkedRecipeId.splice(index, 1)
      }
      this.all = this.checkedRecipeId.length === this.dispenData.prescription.notPrint.length
    },
    updateDispensePrint () {    //  打印处方单
      let outpatientDispenseIds = []
      this.checkedRecipeId.forEach(item => {
        outpatientDispenseIds.push(item.id)
      })
      const outpatientDispenseIdsString = outpatientDispenseIds.join('')
      if (outpatientDispenseIdsString === this.cachaOutpatientDispenseIds) return
      this.cachaOutpatientDispenseIds = outpatientDispenseIdsString
      if (!outpatientDispenseIds.length) {
        this.$messageTips(this, 'warning', '当前没有可以打印的处方单')
        return
      }
      let params = Object.assign({
        outpatientDispenseIds: outpatientDispenseIds,
        isPrint: 1,
        implementType: this.dispenData.prescription.notPrint[0].implementType,
        visitSns: [this.dispenData.prescription.notPrint[0].visitSn]
      }, { storageRoomId: this.storageId })
      commonApi.updateDispensePrint(params).then(res => {
        if (res) {
          //  调用打印
          let dispenseVoList = res.dispenseVoList[0].outpatientDispenseList
          let patientObject = res.dispenseVoList[0].patientObject
          let barCode = res.dispenseVoList[0].code
          //  打印完成 更新页面数据
          this.$emit('abnormal', true, { dispenseVoList, patientObject, barCode, searchObj: true })
          this.$messageTips(this, 'success', '打印成功')
          this.all = true
        }
      })
    },
    handleCheckAll (val) {
      if (val) {
        this.renderInitSelect()
      } else {
        this.checkedRecipeId = []
      }
      this.dispenData.prescription.notPrint.forEach(item => {
        item.checked = val
      })
    },
    renderInitSelect (flag) { // 初始化选中状态!=发要完成（status）数据
      this.dispenData.prescription.notPrint.map(print => {
        if (![3, 6].includes(print.status)) this.checkedRecipeId.push(print)
      })
      if (flag) {
        this.all = this.dispenData.prescription.notPrint.length === this.checkedRecipeId.length
      }
    }
  },
  components: {
    wastPrescription,
    chinesePrescription,
    checkInformation,
    receiptMail
  }
}
</script>
