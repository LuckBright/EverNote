<!-- 缺货任务 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <search @query="queryHandler" :mate="3"></search>
    <el-container class="page_layout_full_hidden">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 左侧列表查询组件 -->
        <!-- 患者列表组件 -->
        <list
          class="flex_scroll mt10"
          @aside-width="handlerAsideWidth"
          @row-click="handlerRowClick"
          :custom-params="customParams"
          :notify-mark="notifyMark"
          :query-obj="queryObj"
          :columns="listColumns"></list>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <template v-if="dispenseObj">
            <el-main class="flex_scroll main">
              <!-- 查询条件头组件 -->
              <check-group
                :show-common-component="!!dispenseObj"
                :process-config="processConfig"
                :report-data="reportData"
                @change="handlerChange">
              </check-group>
              <!-- 患者头组件 -->
              <patient-header :patient-id="patientId" class="mb10" :visit-number="visitNumber" :code="patientCode"></patient-header>
              <template v-for="(lists, key) in dispenseObj">
                <div class="radius mt10 bWhite main10" :key="key" v-if="lists">
                  <stateful :status="key" class="margin-padding"></stateful>
                  <template v-for="(data, index) in lists">
                    <medicine-list
                      ref="medicineList"
                      @delete-abnormally="abnormallyDeleteHandler"
                      @selection-change="selectionChangeHandler"
                      @save-after="saveAfterHandler"
                      @operator-func="operatorBtnFunc"
                      :key="index"
                      :page-type="pageType"
                      :operate-mode="operateMode"
                      :parent-index="index"
                      :meta-data="data"
                      :meta-data-list="lists"
                      :storage-room-list="storageRoomList"
                      :table-data="data.taskDtoList"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :columns="medicineColumns"></medicine-list>
                  </template>
                </div>
              </template>
              <template>
              </template>
            </el-main>
          </template>
          <template v-else>
            <ever-no-data :tip-txt="noDataTip"></ever-no-data>
          </template>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import MethodsMixin from '@/warehouse/views/drug/multilibrary/mixin/methods.mixin.js'
export default {
  mixins: [MethodsMixin],
  created () {
    // 因为缺货只会展示处方(明细)维度数据，审核展示模式固定为1 处方(明细)此处固定操作模式
    this.operateMode = 1
  },
  data () {
    return {
      STORAGE_MEDICINE_CONFIG,
      customParams: {
        shortage: 23,
        examineFlag: 2,
        status: [2, 3]
      },
      pageType: 3
    }
  }
}
</script>
