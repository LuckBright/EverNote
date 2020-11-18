<!-- 住院发药 任务打印 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <hospital-search :simple-search="true" :isDispensing="isDispensing" @query="queryHandler"></hospital-search>
    <el-container class="page_layout_full_hidden mt10">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 住院患者列表 -->
        <hospital-patient-list
          class="flex_scroll"
          :key="pageType"
          :isDispensing="isDispensing"
          :page-type="pageType"
          :columns="leftColumns">
        </hospital-patient-list>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <el-main class="flex_scroll main bWhite">
            <template v-if="noPrintCodeBoolean">
              <!-- 患者头组件 -->
              <hospital-patient-header
                :patient-id="patientId"
                :visit-number="visitNumber"
                :term-type="termType"
                :implement-time="implementTime"
                :base-info="taskParams"
                :isDispensing="isDispensing"
                :report-data="currentPatientObj">
              </hospital-patient-header>
            </template>
            <!-- udd明细信息列表 -->
            <div :class="{bord_bottom10: uddCode12Size || uddCode2Size}" v-if="noPrintCodeBoolean && refreshThePage">
              <hospital-udd-list
                ref="nouddlist"
                @update-all-column="updateAllColumn"
                :page-type="pageType"
                :show-checkbox="false"
                :columns="HospitalColumns"
                :table-data="sourceData.noPrintCode">
              </hospital-udd-list>
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
            </div>
            <!-- udd药包列表 待发药 -->
            <template v-if="uddCode2Size">
              <!-- status=4 发药标题 -->
              <state-ful status="4"></state-ful>
              <hospital-udd-list
                ref="uddlist"
                v-for="(value, key) in sourceData.medicine"
                :key="key"
                :show-checkbox="false"
                :is-udd-package="true"
                :page-type="pageType"
                :columns="HospitalColumns"
                :table-data="value">
              </hospital-udd-list>
            </template>
            <template v-if="(!uddCode12Size && !uddCode2Size && !noPrintCodeBoolean)">
              <ever-no-data :tip-txt="noDataTip"></ever-no-data>
            </template>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
export default {
  mixins: [HospitalMethodsMixin],
  props: {
    isDispensing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pageType: 3,
      noDataTip: '暂无缺货任务',
      apiName: this.isDispensing ? 'getLackUddRecords' : 'getLackUddRecord', // 接口名称
      queryField: []
    }
  },
  methods: {
    queryHandler (...rest) {
      console.log(rest, 'lack')
    }
  },
}
</script>

