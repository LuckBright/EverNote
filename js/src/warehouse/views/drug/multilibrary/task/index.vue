<!-- 任务列表 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <search @query="queryHandler" :mate="2"></search>
    <el-container class="page_layout_full_hidden">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 左侧列表查询组件 -->
        <!-- 患者列表组件 -->
        <list
          class="flex_scroll mt10"
          @aside-width="handlerAsideWidth"
          @row-click="handlerRowClick"
          name="getTaskList"
          :contain-obj="containObj"
          :status-list="statusList"
          :query-obj="queryObj"
          :custom-params="customParams"
          :page-type="pageType"
          :notify-mark="notifyMark"
          :columns="listColumns"></list>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <!-- 查询条件头组件 -->
          <check-group
            :show-common-component="!!dispenseObj"
            :process-config="processConfig"
            :report-data="reportData"
            :page-type="pageType"
            :prescription-prams="prescriptionPrams"
            @change="handlerChange"></check-group>
          <template v-if="dispenseObj">
            <el-main class="flex_scroll main showScroll">
              <!-- 患者头组件 -->
              <patient-header :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
              <div :key="renderKey">
              <template v-for="(lists, key) in dispenseObj">
                <div class="radius mt10 bWhite main10" :key="key + visitNumber" v-if="lists && refreshThePage">
                  <stateful :status="key" class="margin-padding"></stateful>
                  <div v-for="(data, index) in lists" :key="index">
                    <medicine-list
                      :ref="'medicineList' + key"
                      @delete-abnormally="abnormallyDeleteHandler"
                      @selection-change="selectionChangeHandler"
                      @save-after="saveAfterHandler"
                      @operator-func="operatorBtnFunc"
                      @update-all-column="updateAllColumn"
                      :key="index"
                      :page-type="pageType"
                      :show-checkbox="operateMode == 1"
                      :operate-mode="operateMode"
                      :parent-index="index"
                      :parent-key="key"
                      :meta-data="data"
                      :meta-data-list="lists"
                      :storage-room-list="storageRoomList"
                      :table-data="data.taskDtoList"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :columns="medicineColumns"></medicine-list>
                      <action-buttons
                        v-if="pageType == 5 && key == 1 && data.scene === 5 && (!lists[index + 1] || (lists[index + 1] && data.addressId !== lists[index + 1].addressId))"
                        @operator-func="operatorBtnFunc"
                        :page-type="pageType"
                        :parent-index="index"
                        :selection-table="recordSelected"
                        :delivery="Number(key)"
                        :is-invented="isInvented"
                        :meta-data-list="lists">
                      </action-buttons>
                  </div>
                  <!--:has-reject="hasReject" -->
                  <!-- <div style=" height: 40px; "></div> -->
                  <!-- <div style="position: fixed; bottom: 10px; background: #fff; height: 50px; display: block; width: calc(100% - 445px); z-index: 99" class="bor_top_1"> -->
                    <action-buttons
                      v-if="pageType == 5 && (!key || (key && lists[0].scene !== 5))"
                      @operator-func="operatorBtnFunc"
                      :page-type="pageType"
                      :selection-table="recordSelected"
                      :delivery="Number(key)"
                      :is-invented="isInvented"
                      :meta-data-list="lists">
                    </action-buttons>
                  <!-- </div> -->
                </div>
              </template>
            </div>
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
      :visitSn="visitNumber"
      :ids="mailIds"
      @mail-func="mailFunc">
    </mail-dialog>
    </el-container>
  </el-container>
</template>

<script>
import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import MethodsMixin from '@/warehouse/views/drug/multilibrary/mixin/methods.mixin.js'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
export default {
  // getStorage 就为了取一个 isInvented 是否虚拟库房
  mixins: [MethodsMixin, getStorage],
  data () {
    return {
      pageType: 5,
      refreshThePage: true,
      renderKey: '1',
      STORAGE_MEDICINE_CONFIG,
      customParams: {},
      statusList: [2, 3, 4],
      mailIds: []
    }
  }
}
</script>
