<!-- 发药记录 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <search @query="listHandler" :mate="4" :other-args="queryObj"></search>
    <el-container class="page_layout_full_hidden mt10">
      <!-- 左侧列表查询组件 -->
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 患者列表组件 -->
        <list
          class="flex_scroll"
          @aside-width="handlerAsideWidth"
          @row-click="handlerRowClick"
          name="getTaskList"
          :page-type="pageType"
          :status-list="statusList"
          :contain-obj="containObj"
          :custom-params="customParams"
          :query-obj="queryObj"
          :columns="filterColumns"></list>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <template v-if="dispenseObj">
            <el-main class="flex_scroll main">
              <!-- 查询条件头组件 -->
              <check-group
                :show-common-component="!!dispenseObj"
                :process-config="processConfig"
                :page-type="pageType"
                :cancel="cancel !== 5"
                :prescription-prams="prescriptionPrams"
                :report-data="reportData"
                @change="handlerChange"></check-group>
              <!-- 患者头组件 -->
              <patient-header :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
              <template v-for="(lists, key) in dispenseObj">
                <div class="radius mt10 bWhite main10 pos_re" :key="key" v-if="lists && refreshThePage">
                  <stateful :status="key" class="margin-padding"></stateful>
                  <div v-for="(data, index) in lists" class="pos_re mb10" :key="index">
                    <el-button
                      type="primary"
                      size="small"
                      class="pos_ab mail_btn"
                      plain
                      :key="index + 'button'"
                      v-if="data.delivery === 1 && (
                        (data.scene !== 5 && !index) ||
                        (data.scene === 5 && (!index || (index && data.addressId !== lists[index - 1].addressId))))"
                      @click="mailDataSave(key, index)">邮寄信息</el-button>
                    <medicine-list
                      :ref="'medicineList' + key"
                      @delete-abnormally="abnormallyDeleteHandler"
                      @selection-change="selectionChangeHandler"
                      @save-after="saveAfterHandler"
                      @operator-func="operatorBtnFunc"
                      :key="index"
                      @update-all-column="updateAllColumn"
                      :page-type="pageType"
                      :operate-mode="operateMode"
                      :parent-index="index"
                      :meta-data="data"
                      :show-checkbox="data.delivery === 1"
                      :meta-data-list="lists"
                      :storage-room-list="storageRoomList"
                      :table-data="data.taskDtoList"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :columns="medicineColumns"></medicine-list>
                  </div>
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
      <!-- 邮寄弹窗 -->
      <mail-dialog
        ref="mailDialog"
        :page-type="pageType"
        :visitSn="visitNumber"
        :ids="mailIds">
      </mail-dialog>
    </el-container>
  </el-container>
</template>

<script>

import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import MethodsMixin from '@/warehouse/views/drug/multilibrary/mixin/methods.mixin.js'
import { dateFormat } from '@/util/common'
export default {
  mixins: [MethodsMixin],
  data () {
    return {
      // name: 'getBatchNotesInfo',
      STORAGE_MEDICINE_CONFIG,
      queryObj: {
        outStockStartDate: dateFormat(Date.now(), null, 'startDay'),
        outStockEndDate: dateFormat(Date.now(), null, 'endDay')
      },
      statusList: [3],
      pageType: 4, // 发药页面
      customParams: {}
    }
  },
  computed: {
    filterColumns () {
      return this.listColumns.slice(1)
    }
  },
  created () {

  },
  methods: {
    listHandler (query) {
      this.queryObj = Object.assign({}, query)
    }
  }
}
</script>

<style lang="less" scoped>
.mail_btn {
  left: 0;
  top: 5px;
  padding: 5px 10px;
}
</style>
