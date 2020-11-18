<template>
      <!-- 只是dom -->
    <div v-show="false">
      <!-- 不干胶50*40 -->
      <div id="printDocument50_40" class="box">
        <div v-if="nonPaternal[0] && ![...CHINESE_MEDICINE_TYPE].includes(nonPaternal[0].adviceType) && objGet(processItemObject, 'dispensePaste', '') == 1">
          <div :id="'page' + (index + 1)" v-for="(print, index) in nonPaternal" :key="index" style="font-size: 9px; ">
            <!-- 100*40 -->
            <zz-drug-label
              v-if="objGet(processItemObject, 'processItemPasteObject.processItemPasteObject.value', '') == 2 && !CONSUMABLES_TYPE.includes(print.adviceType)"
              :patientMessage="print.patientObj"
              :data="print.tableData"
              :storageRoom="print.storageRoomObj"
            ></zz-drug-label>
            <!-- 50*40 -->
            <prescription-label
              v-if="objGet(processItemObject, 'processItemPasteObject.processItemPasteObject.value', '') == 1 && !CONSUMABLES_TYPE.includes(print.adviceType)"
              :patientMessage="print.patientObj"
              :drug="print.tableData"
              :storageRoom="print.storageRoomObj"
              :vertical="false">
            </prescription-label>
            <!-- 50*30 -->
            <prescription-label-gx
              v-if="objGet(processItemObject, 'processItemPasteObject.processItemPasteObject.value', '') == 3 && !CONSUMABLES_TYPE.includes(print.adviceType)"
              :patientMessage="print.patientObj"
              :drug="print.tableData"
              :storageRoom="print.storageRoomObj"
              :vertical="false">
            </prescription-label-gx>
          </div>
        </div>
      </div>
      <!-- 不干胶68*52 门诊父子医嘱 (住院父子医嘱) 公用一个comp -->
      <div id="printDocument68_52_opd" class="box">
        <div v-if="!liveType && fatherAdvice[0] && !CHINESE_MEDICINE_TYPE.includes(fatherAdvice[0].adviceType) && objGet(processItemObject, 'dispensePatient', '') == 1">
          <div :id="'page' + (index + 1)" v-for="(print, index) in fatherAdvice" :key="index" style="font-size: 9px;">
            <drug-label
              v-if="objGet(processItemObject, 'processItemPatientObject.value', '')"
              :patientMessage="print.patientObj"
              :drug="print.tableData"
              :type="hospitalType"
              :liveType="liveType"
              :barCode="print.barCode"
              :self="print.self"
            ></drug-label>
          </div>
        </div>
      </div>
      <!-- 不干胶68*52 住院父子医嘱 (门诊父子医嘱) 公用一个comp -->
      <div id="printDocument_ipd_live68_52" class="box">
        <div v-if="liveType && fatherAdvice[0] && !CHINESE_MEDICINE_TYPE.includes(fatherAdvice[0].adviceType) &&
        objGet(processItemObject, 'uddDispenseSettingObject.dispensePaste', '') == 1">
          <div :id="'page' + (index + 1)" v-for="(print, index) in fatherAdvice" :key="index" style="font-size: 9px;">
            <drug-label
              v-if="objGet(processItemObject, 'uddDispenseSettingObject.processItemPasteObject.value', '') == 1"
              :patientMessage="print.patientObj"
              :drug="print.tableData"
              :type="hospitalType"
              :liveType="liveType"
              :barCode="print.barCode"
              :self="print.self"
            ></drug-label>
          </div>
        </div>
      </div>
      <!-- 不干胶68*52  住院非父子医嘱 公用一个comp -->
      <div id="printDocument_non68_52" class="box">
        <div v-if="liveNonFatherAdvice[0] && !CHINESE_MEDICINE_TYPE.includes(liveNonFatherAdvice[0].adviceType) &&
        objGet(processItemObject, 'uddDispenseSettingObject.dispensePaste', '') == 1">
          <!-- liveType 为真，住院医嘱 -->
          <div :id="'page' + (index + 1)" v-for="(print, index) in liveNonFatherAdvice" :key="index" style="font-size: 9px;">
            <drug-label
              v-if="objGet(processItemObject, 'uddDispenseSettingObject.processItemPasteObject.value', '') == 1"
              :patientMessage="print.patientObj"
              :drug="print.tableData"
              :type="2"
              :liveType="liveType"
              :barCode="print.barCode"
              :self="print.self"
            ></drug-label>
          </div>
        </div>
      </div>
      <!-- 门诊打印 热敏 80 -->
      <div id="printDocument80" class="box">
        <!-- 本期无备药流程，故不显示备药单 -->
        <!-- <template v-if="objGet(processItemObject, 'dispensePreparePrint', '') == 1">
          <div :id="'page' + (index + 1)" v-for="(print, index) in drugTableData" :key="index">
            <prescription-list-chinese
              v-if="CHINESE_MEDICINE_TYPE.includes(print.adviceType)"
              :patientMessage="print.patientObj"
              :barCode="print.patientObj.barCode"
              :list="print.tableData"></prescription-list-chinese>
            <prescription-list
              v-else
              :patientMessage="print.patientObj"
              :barCode="print.patientObj.barCode"
              :list="print.tableData">
            </prescription-list>
          </div>
        </template> -->
      </div>
      <!-- 住院发药 - 批量摆药单条码 -->
      <div id="printDocument_live68_52" class="box">
        <template v-if="objGet(processItemObject, 'uddDispenseSettingObject.dispensePreparePrint', '') == 1">
          <div id="page1" v-if="liveTableData && liveTableData.tableData && inpatientArea.spaceRecordObject">
            <single-code
              :inpatientArea="inpatientArea"
              :printData="liveTableData"></single-code>
          </div>
        </template>
      </div>
      <!-- 住院发药A4 -->
      <div id="printDocumentA4" class="box">
        <template v-if="objGet(processItemObject, 'uddDispenseSettingObject.dispensePreparePrint', '') == 1">
          <div id="udd_page1" v-if="liveTableData && liveTableData.barCode" :key="liveTableDataKey" class="breakable" break-window="#win" style="width: 100%">
            <all-prescription-list
              :inpatientArea="inpatientArea"
              :barCode="liveTableData.barCode"
              :liveTableData="liveTableData.tableData"
            ></all-prescription-list>
          </div>
        </template>
      </div>
      <!-- 住院发药A4 按照病区汇总打印 -->
      <div id="printDocument_summary_A4" class="box">
        <template v-if="objGet(processItemObject, 'uddDispenseSettingObject.dispensePreparePrint', '') == 1">
          <div id="summary_page1" v-if="liveTableDataSummary && liveTableDataSummary.barCode" :key="liveTableDataSummaryKey" class="breakable" style="width: 100%">
            <all-prescription-list
              :inpatientArea="inpatientArea"
              :isSummary="true"
              :barCode="liveTableDataSummary.barCode"
              :liveTableData="liveTableDataSummary.tableData"
            ></all-prescription-list>
          </div>
        </template>
      </div>
    </div>
</template>
<script>
import jcpPrint from '@/warehouse/util/jcpprint'
import { SEARCH_CODE, patch, CHINESE_MEDICINE_TYPE, objGet, CONSUMABLES_TYPE } from '@/util/common'
import prescriptionList from '@/components/detailedList/prescriptionList.vue'
import prescriptionListChinese from '@/components/detailedList/prescriptionList.chinese'
import prescriptionLabel from '@/components/detailedList/prescriptionLabel'
import prescriptionLabelGx from '@/components/detailedList/prescription.label.gx'
import drugLabel from '@/components/detailedList/drugLabel'
import singleCode from '@/components/detailedList/singlecode'
import allPrescriptionList from '@/components/detailedList/allPrescriptionList'
import zzDrugLabel from '@/warehouse/page/components/print.temp/zz/drug.label'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
export default {
  mixins: [jcpPrint, dispenseSettingMixin],
  props: {
    inpatientArea: { // 病区
      type: Object,
      default: () => ({})
    },
    drugTableData: { // 热敏， 门诊 -- 全部药品信息 (80)
      type: Array,
      default: () => []
    },
    nonPaternal: { // 不干胶，非父子医嘱信息 (50*40)
      type: Array,
      default: () => []
    },
    hospitalType: { // 父子医嘱 -- 1 门诊打印 2 住院打印 (68*52)
      type: String,
      default: '1'
    },
    liveType: { // 是否住院医嘱-- false == 门诊打印 true == 住院打印 (68*52)
      type: Boolean,
      default: false
    },
    printPatientObj: { // 患者信息对象
      type: Object,
      default: () => ({})
    },
    fatherAdvice: { // 父子医嘱信息 （68*52）
      type: Array,
      default: () => []
    },
    liveNonFatherAdvice: { // 住院非父子医嘱 （68*52）
      type: Array,
      default: () => []
    },
    liveTableData: { // 住院摆药单数据 UDD药包维度 （A4）
      type: Object,
      default: () => ({})
    },
    liveTableDataSummary: { // 住院摆药单数据 药品维度 （A4）
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      processItemObject: objGet(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject', {}), // 库房发药配置
      SEARCH_CODE,
      objGet,
      CONSUMABLES_TYPE,
      CHINESE_MEDICINE_TYPE
    }
  },
  components: {
    prescriptionList,
    prescriptionLabel,
    prescriptionLabelGx,
    allPrescriptionList,
    drugLabel,
    singleCode,
    zzDrugLabel,
    prescriptionListChinese
  },
  computed: {
    liveTableDataSummaryKey () {
      return new Date().getTime() + this.liveTableDataSummary.barCode
    },
    liveTableDataKey () {
      return new Date().getTime() + this.liveTableData.barCode
    }
  },
  methods: {
    ...patch,
    /**
     * handlerPrint       调取打印机方法
     * @param arr {Array}
     {
       parentId: 父级DOM元素ID  ---- printDocument
       settings: 打印机配置参数
     }
     */
    handlerPrint (arr) {
      setTimeout(_ => {
        const DOMS = []
        arr.forEach(print => {
          DOMS.push({
            pages: document.querySelector(print.parentId) ? document.querySelector(print.parentId).innerHTML : '',
            settingsId: objGet(this.processItemObject, 'processItemPasteObject.processItemPasteObject.value', '') === '2' ? '标签100*40' : print.settingsId, // 临时解决办法，如果配置是卓正药签就走卓正药签的打印配置
            pageId: print.pageId
          })
        })
        this.playPrint(DOMS)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  float: left;
  margin-left: 20;
}
</style>
