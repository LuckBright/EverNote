<!--
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-09-02 11:23:21
 * @LastEditTime: 2020-11-12 16:17:51
 * @LastEditors: by zhangsheng@everjiankang.com.cn
-->
<!-- 住院发药 任务打印 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <hospital-search :page-type="pageType" :isDispensing="true" @query="queryHandler"></hospital-search>
    <el-container class="page_layout_full_hidden mt10">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <hospital-patient-list
          class="flex_scroll"
          name="getPatientTaskList"
          :key="pageType"
          :page-type="pageType"
          :show-checkbox="true"
          :columns="leftColumns"
          @selection-change="selectionChangeHandler">
        </hospital-patient-list>
        <el-footer class="alg_c bWhite bor_1 ptb10" style="border-top: none" :height="footerHeight">
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
              v-if="noPrintCodeBoolean"
              :patient-id="patientId"
              :visit-number="visitNumber"
              :term-type="termType"
              :implement-time="implementTime"
              :base-info="taskParams"
              :report-data="currentPatientObj">
            </hospital-patient-header>
            <!-- udd明细信息列表 -->
            <template v-if="noPrintCodeBoolean && refreshThePage">
              <hospital-udd-list
                ref="nouddlist"
                :page-type="pageType"
                @update-all-column="updateAllColumn"
                :columns="HospitalColumns"
                :table-data="sourceData.noPrintCode"
                @selection-change="selectionChangeHandler">
              </hospital-udd-list>
            </template>
            <template v-else>
              <ever-no-data :tip-txt="noDataTip"></ever-no-data>
            </template>
          </el-main>
          <hospital-action-btn
            v-if="noPrintCodeBoolean"
            :disabled="printBtnDisabled"
            @hospital-action-btn="hospitalActionBtnHandler">
          </hospital-action-btn>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
export default {
  mixins: [HospitalMethodsMixin],
  data () {
    return {
      pageType: 1,
      noDataTip: '暂无打印任务',
      customParams: {}
    }
  },
  methods: {
    queryHandler (...rest) {
      console.log(rest, 'print')
    }
  },
}
</script>

