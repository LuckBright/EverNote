<!-- 住院发药 任务打印 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <hospital-search :page-type="pageType" @query="queryHandler"></hospital-search>
    <el-container class="page_layout_full_hidden mt10">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 住院患者列表 -->
        <hospital-patient-list
          class="flex_scroll"
          name="getPatientTaskList"
          :key="pageType"
          :page-type="pageType"
          :show-checkbox="!listMode"
          :columns="leftColumns"
          @selection-change="selectionChangeHandler"></hospital-patient-list>
        <el-footer v-if="!listMode" class="alg_c bWhite bor_1 ptb10" style="border-top: none" :height="footerHeight">
          <el-button
            type="primary"
            size="small"
            :disabled="batchPrintBtnDisabled"
            @click="batchPrintHandler">批量打印</el-button>
        </el-footer>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <el-main class="flex_scroll main bWhite">
            <!-- 患者头组件 -->
            <hospital-patient-header
              v-if="!((listMode && !uddCode12Size && !uddCode2Size) || (!listMode && !uddCode12Size && !uddCode2Size && !noPrintCodeBoolean))"
              :patient-id="patientId"
              :visit-number="visitNumber"
              :term-type="termType"
              :implement-time="implementTime"
              :base-info="taskParams"
              :report-data="currentPatientObj">
            </hospital-patient-header>
            <!-- udd明细信息列表 -->
            <div :class="{bord_bottom10: uddCode12Size || uddCode2Size}" v-if="!listMode && noPrintCodeBoolean">
              <hospital-udd-list
                ref="nouddlist"
                :page-type="pageType"
                :columns="HospitalColumns"
                :table-data="sourceData.noPrintCode"
                @selection-change="selectionChangeHandler">
              </hospital-udd-list>
              <hospital-action-btn
                :disabled="printBtnDisabled"
                @hospital-action-btn="hospitalActionBtnHandler">
              </hospital-action-btn>
            </div>
            <!-- udd药包列表 待摆药 -->
            <div :class="{bord_bottom10: uddCode2Size}" v-if="uddCode12Size">
              <!-- status=3 备药标题 -->
              <state-ful status="3"></state-ful>
              <hospital-udd-list
                ref="uddlist"
                v-for="(value, key) in sourceData.preparation"
                :key="key"
                :show-checkbox="false"
                :is-udd-package="true"
                :page-type="pageType"
                :columns="HospitalColumns"
                :table-data="value">
              </hospital-udd-list>
              <!-- 摆药按钮 -->
              <hospital-action-btn
                :is-preparation="true"
                :is-udd-package="true"
                :is-invented="isInvented"
                :disabled="selectUddCode12Disabled"
                @hospital-action-btn="hospitalActionBtnHandler">
              </hospital-action-btn>
            </div>
            <!-- udd药包列表 待发药 -->
            <template v-if="uddCode2Size && refreshThePage">
              <!-- status=4 发药标题 -->
              <state-ful status="4"></state-ful>
              <hospital-udd-list
                ref="uddlist"
                v-for="(value, key) in sourceData.medicine"
                :key="key"
                @update-all-column="updateAllColumn"
                :show-checkbox="false"
                :is-udd-package="true"
                :page-type="pageType"
                :columns="HospitalColumns"
                :table-data="value">
              </hospital-udd-list>
              <!-- 发药按钮 -->
              <hospital-action-btn
                :is-udd-package="true"
                :is-invented="isInvented"
                :disabled="selectUddCode2Disabled"
                @hospital-action-btn="hospitalActionBtnHandler">
              </hospital-action-btn>
            </template>
            <template v-if="(listMode && !uddCode12Size && !uddCode2Size) || (!listMode && !uddCode12Size && !uddCode2Size && !noPrintCodeBoolean)">
              <ever-no-data :tip-txt="noDataTip"></ever-no-data>
            </template>
          </el-main>
          <!-- <hospital-action-btn
            v-if="listMode && (uddCode12Size || uddCode2Size)"
            :is-udd-package="true"
            :disabled="batchPrintBtnDisabled"
            @hospital-action-btn="hospitalActionBtnHandler">
          </hospital-action-btn> -->
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
export default {
  mixins: [getStorage, HospitalMethodsMixin],
  data () {
    return {
      pageType: 2,
      customParams: {}, // 自定义接口查询字段
    }
  },
  methods: {
    queryHandler (...rest) {
      console.log(rest, 'print')
    }
  }
}
</script>

