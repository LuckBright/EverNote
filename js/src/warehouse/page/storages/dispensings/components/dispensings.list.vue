<template>
  <div>
    <div :class="isScroll ? 'patient_prescription noscroll' : 'patient_prescription'" v-if="dispenData.currentOutpatientDispense.length">
      <template v-if="dispenData.currentOutpatientDispenseClass.notError.length">
        <div class="patient_list" v-for="(item, index) in dispenData.currentOutpatientDispenseClass.notError" :key="index">
          <receipt-mail :itemData="item" v-if="item && item.outpatientDispenseList[0].mailFlag && item.outpatientDispenseList[0].mailAddressObject"></receipt-mail>
          <div class="patient_title f_bold pos_re">备药单号：{{item.code}}
            <span class="scrap" v-if="item.inUse === 2">（该备药单已作废）</span>
            <i class="oldcode ml20" v-if="item.oldCode">（原单号：{{item.oldCode}}）</i>
            <el-button type="text" v-if="[4, 5].includes(item.outpatientDispenseList[0].status)" @click="makeUpPrint(item)" class="opabsolute">补打备药单</el-button>
          </div>
          <div class="patient_box">
            <!-- <check-information
              :propData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
            ></check-information> -->
              <!-- :isSelect="$refs.search.searchObj.recipeCode === bill.recipeCode" -->
            <div v-for="(bill, bindex) in item.outpatientDispenseList" :key="'full' + bindex">
              <chinese-prescription
                :opdData="bill"
                :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
                :key="'full_chinese' + bindex"
                @updateDispenseStatus="abnormal"
                :patientData="bill.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"></chinese-prescription>
              <wast-prescription
                :key="'full_west' + bindex"
                v-else
                :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
                :code="bill.recipeCode"
                :identification="bill.identification"
                :itemId="bill.id"
                :mailState="bill.mailFlag"
                :date="bill.createTime"
                :excCode="bill.adviceExecuteId"
                :status="bill.status"
                :outOfStock="bill.outOfStock"
                :patientData="bill.outpatientDispenseItemList"
                :readOnly="item.inUse === 2"
                :storageRoomObject="item.storageRoomObject"
                :patientObject="bill.patientObject"
                :itemData="bill"
                :preparationId="item.id"
                :visitSn="bill.visitSn"
                :outTest="outTest"
                :testResult="testResult"
                @updateDispenseStatus="abnormal"
                @sendPrint="sendPrintParent"
              ></wast-prescription>

            </div>
            <div class="patient_footer">
              <el-button type="primary"
                @click="chengsStatus(item)"
                ref="wastPrescription"
                v-if="([4, 5].includes(item.outpatientDispenseList[0].status)) && dispenData.currentOutpatientDispenseClass.notError.length"
              >{{item.outpatientDispenseList[0].status === 4 ? '备药完成' : '审核并发药'}}</el-button>
            </div>
          </div>
        </div>
      </template>
      <div v-for="(item, index) in dispenData.currentOutpatientDispenseClass.error" :key="'error' + index">
        <div class="patient_list" v-if="dispenData.currentOutpatientDispenseClass.error.length">
          <receipt-mail :itemData="item" v-if="dispenData.currentOutpatientDispenseClass.error && dispenData.currentOutpatientDispenseClass.error[0].outpatientDispenseList[0].mailFlag"></receipt-mail>
          <div class="patient_title f_bold">备药单号：{{item.code}}
            <i class="oldcode ml20" v-if="item.oldCode">（原单号：{{item.oldCode}}）</i>
            <span class="scrap" v-if="item.inUse === 2">（该备药单已作废）</span>
          </div>
          <div class="patient_box">
            <!-- <check-information
              :propData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
            ></check-information> -->
            <template v-if="item.outpatientDispenseListSuccess.length">
              <div v-for="(bill, bindex) in item.outpatientDispenseListSuccess" :key="'success' + bindex">
                <chinese-prescription
                  :opdData="bill"
                  :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
                  :key="'success-chinese' + bindex"
                  @updateDispenseStatus="abnormal"
                  :patientData="bill.outpatientDispenseItemList"
                  v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"></chinese-prescription>
                <wast-prescription
                  v-else
                  :key="'success-west' + bindex"
                  :code="bill.recipeCode"
                  :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
                  :identification="bill.identification"
                  :itemId="bill.id"
                  :date="bill.createTime"
                  :excCode="bill.adviceExecuteId"
                  :status="bill.status"
                  :outOfStock="bill.outOfStock"
                  :preparationId="item.id"
                  :patientData="bill.outpatientDispenseItemList"
                  :readOnly="item.inUse === 2"
                  :storageRoomObject="item.storageRoomObject"
                  :patientObject="bill.patientObject"
                  :itemData="bill"
                  :visitSn="bill.visitSn"
                  :outTest="outTest"
                  :testResult="testResult"
                  @updateDispenseStatus="abnormal"
                  @sendPrint="sendPrintParent"
                ></wast-prescription>
              </div>
            </template>
            <div class="patient_title f_bold">以下为备药单中异常的处方</div>
            <template v-if="item.outpatientDispenseListError.length">
              <div class="design_error_table" v-for="(bill, bindex) in item.outpatientDispenseListError" :key="bindex">
                <chinese-prescription
                  :opdData="bill"
                  :key="'error-chinese' + bindex"
                  :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
                  @updateDispenseStatus="abnormal"
                  :patientData="bill.outpatientDispenseItemList"
                  v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"></chinese-prescription>
                <wast-prescription
                  v-else
                  :key="'error-west' + bindex"
                  :doctorData="dispenData.currentOutpatientDispense.length ? dispenData.currentOutpatientDispense[0].outpatientDispenseList[0] : (dispenData.prescription.notPrint.length ? dispenData.prescription.notPrint[0] : dispenData.prescription.print[0])"
                  :code="bill.recipeCode"
                  :identification="bill.identification"
                  :itemId="bill.id"
                  :date="bill.createTime"
                  :excCode="bill.adviceExecuteId"
                  :status="bill.status"
                  :outOfStock="bill.outOfStock"
                  :readOnly="item.inUse === 2"
                  :storageRoomObject="item.storageRoomObject"
                  :patientObject="bill.patientObject"
                  :itemData="bill"
                  :visitSn="bill.visitSn"
                  :outTest="outTest"
                  :testResult="testResult"
                  :patientData="bill.outpatientDispenseItemList"
                  @updateDispenseStatus="abnormal"
                  @sendPrint="sendPrintParent"
                ></wast-prescription>
              </div>
            </template>
            <div class="patient_footer">
              <el-button type="primary"
                v-if="[4, 5].includes(item.outpatientDispenseList[0].status) && item.outpatientDispenseListError.length && item.outpatientDispenseListSuccess.length"
                @click="updateRepeatOutpatientDispensePrint(item)"
              >重打备药单</el-button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- 邮寄组件 -->
    <mail-dialog
      :popData="popData"
      :visible.sync="dialogVisibleMail"
      :isClick="isClick"
      @sendMedicine="sendMedicine"
      >
    </mail-dialog>
  </div>
</template>

<script>
// 摆药单
import wastPrescription from '@/warehouse/page/storages/dispensings/components/west.prescription'
import checkInformation from '@/warehouse/page/storages/dispensings/components/check.information.vue'
import mailDialog from '@/warehouse/page/storages/components/maildialog'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import commonApi from '../store/dispensingcommonapi.js'
import chinesePrescription from './chinese.prescription'
import { CHINESE_MEDICINE_TYPE } from '@/util/common'
import '../opd/index.scss'
import api from '../../store/clinicapi'
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
  mixins: [getStorage],
  data () {
    return {
      CHINESE_MEDICINE_TYPE,
      dialogVisibleMail: false,
      isClick: false, // 状态控制
      clickBtnDispenseId: '',
      popData: {}
    }
  },
  methods: {
    sendPrintParent (data, code, adviceType, patientObject, storageRoomObject, doctorData) {
      this.$emit('sendPrintParent', data, code, adviceType, patientObject, storageRoomObject, doctorData)
    },
    sendMedicine (v, id, status) {
      let params = {
        dispenseId: id,
        status: status + 1,
        expressInformationList: v
      }
      api.updateDispenseStatus(params).then(res => {
        if (res.flag) {
          this.$messageTips(this, 'success', '发药完成')
          this.dialogVisibleMail = false
          this.$emit('abnormal', this.$parent.$refs.search.searchObj)
        }
      })
    },
    chengsStatus (data) {
      this.isClick = true
      if (data.outpatientDispenseList[0].status === 5 && data.outpatientDispenseList[0].mailFlag && data.outpatientDispenseList[0].mailAddressObject) {
        this.popData = data
        this.dialogVisibleMail = true
      } else {
        const params = {
          dispenseId: data.id,
          status: data.outpatientDispenseList[0].status + 1
        }
        api.updateDispenseStatus(params).then(res => {
          if (res.flag) {
            let tips = data.outpatientDispenseList[0].status === 4 ? '备药完成' : '发药完成'
            this.$messageTips(this, 'success', tips, '')
            this.$emit('abnormal', true)
          }
        })
      }
    },
    updateRepeatOutpatientDispensePrint (item) {
      let params = {
        dispenseId: item.id,
        storageRoomId: this.storageId
      }
      if (this.clickBtnDispenseId === item.id) return // 防止点击过快， 相同数据提交
      this.clickBtnDispenseId = item.id
      commonApi.updateRepeatOutpatientDispensePrint(params).then(res => {
        if (res) {
          //  调用打印
          let dispenseVoList = res.dispenseVoList[0].outpatientDispenseList
          let patientObject = res.dispenseVoList[0].patientObject
          let barCode = res.dispenseVoList[0].code
          this.$emit('repeatPrint', { dispenseVoList, patientObject, barCode, searchObj: this.$parent.$refs.search.searchObj })
          this.$messageTips(this, 'success', '重新打印备药单完成')
        }
      })
    },
    abnormal (data) {
      data && this.$emit('abnormal', true)
    },
    makeUpPrint (data) {
      this.$emit('makeUpPrint', data)
    }
  },
  components: {
    wastPrescription,
    chinesePrescription,
    checkInformation,
    mailDialog,
    receiptMail
  }
}
</script>

<style scoped>
/* .patient_title {
  padding-bottom: 10px;
} */
.patient_box .patient_title {
  padding: 10px 0
}
.oldcode{
  font-style: normal;
  color: #999;
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
</style>
