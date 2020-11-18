<template>
  <div class="prescription-layout">
    <!-- 搜索框 -->
    <drug-back-search
      :searchPatient.sync="searchPatient"
      @handelSearchPatient="handelSearchPatient"
    ></drug-back-search>
    <div class="pos_re">
      <div class="pr-l" :class="expandTable ? 'pr-l-w' : ''">
        <div class="patient-list">
          <div class="pt-params">
            <div>
              <el-row>
                <el-col :span="24">
                  <ever-select
                    v-model="backStatus"
                    :options="backStatusOptions"
                    placeholder="请选择退药状态"
                  ></ever-select>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="patient-table pos_re">
          <el-button
            class="pos_ab"
            type="text"
            :class="expandTable ? 'i-zhankai' : ''"
            @click="expandTable = !expandTable"
          >
            <i class="iconfont icon-zhankai"></i>
          </el-button>
          <el-table
            :data.sync="patientData"
            style="width: 100%"
            :height="'calc(100vh - 210px)'"
            :stripe="false"
            class="no-border"
            @row-click="handleDetails"
            :row-class-name="patientTableRowClassName"
          >
            <el-table-column width="100" class-name="pointer" label="姓名">
              <template slot-scope="scope">
                <span v-if="scope.row.patientName">{{scope.row.patientName}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="110" class-name="pointer" label="科室">
              <template slot-scope="scope">
                <span v-if="scope.row.providerName">{{scope.row.providerName}}</span>
              </template>
            </el-table-column>
            <el-table-column class-name="pointer" label="医师">
              <template slot-scope="scope">
                <span v-if="scope.row.doctorName">{{scope.row.doctorName}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="expandTable" width="157" label="开单时间">
              <template slot-scope="scope">
                <span v-if="scope.row.createTime">{{scope.row.createTime | formatDateByExp}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pr-r">
        <div class="clinic-container" v-if="tableData.length">
          <!-- 患者信息 -->
          <div class="pos_re">
            <patient-header
              :patientId="currentVisitPatientId"
              :visitNumber="currentVisitNumber"
              :code="PATIENT_HEAD"
            ></patient-header>
          </div>
          <!-- 处方单 -->
          <div class="clinic-table" :class="[backStatus === 9 ? 'pad' : 'pad1']">
            <!-- 检查信息 -->
            <!-- <div class="doctor-info">
              <check-information :propData="tableData[0]"></check-information>
            </div>-->
            <div class="clinic_content">
              <div
                class="table-content"
                v-for="(item, index) in tableData"
                :key="index"
                :class="item.outpatientDispenseObject.adviceType === '303' || item.outpatientDispenseObject.adviceType === '304' ? 'table-tcm-content' : ''"
              >
                <!-- 标题 -->
                <el-row type="flex" align="middle" justify="start" class="table_title mb10">
                  <el-col :span="24">
                    <span class="light-gray">科室：</span>
                    <span>{{item.outpatientDispenseObject.providerName}}</span>
                    <span class="ml10 light-gray">医生：</span>
                    <span>{{item.outpatientDispenseObject.doctorName}}</span>
                    <span
                      class="ml15"
                      v-if="backStatus === 9 && item.outpatientDispenseObject.dispenseFinishTime">
                      <span class="cGray6">发药时间：</span>
                      {{item.outpatientDispenseObject.dispenseFinishTime}}
                    </span>
                    <span class="ml10 light-gray">诊断名称：</span>
                    <span>{{curDiseaseName}}</span>
                    <span class="ml10">
                      <el-button type="text" @click="reportOpen(item.outpatientDispenseObject)">
                        <i class="iconfont icon-baogao"></i>
                        <span class="cBlack f_nor">检查检验</span>
                      </el-button>
                    </span>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" justify="start" class="table_title">
                  <el-col :span="24" style="line-height: 30px">
                    <!-- 状态图标 -->
                    <span v-if="backStatus && backStatus !== undefined" class="fl mr10">
                      <svg class="icon" style="font-size:58px; height: 30px" aria-hidden="true">
                        <use :xlink:href="'#' + iconName"></use>
                      </svg>
                    </span>
                    <span class="light-gray fl">处方单号：</span>
                    <strong class="fl">{{item.outpatientDispenseObject.recipeCode}}</strong>
                    <span class="fl ml10" style="display: block;width: 30px;height: 18px;">
                      <el-popover
                        v-if="item.outpatientDispenseObject.adviceExecuteId"
                        placement="top"
                        title
                        width="400"
                        trigger="hover"
                        content
                      >
                        <span>
                          <span class="cGray6">执行单号：</span>
                          {{item.outpatientDispenseObject.adviceExecuteId}}
                        </span>
                        <span slot="reference">
                          <svg class="icon" style="font-size:30px; height: 18px" aria-hidden="true">
                            <use xlink:href="#icon-zhixingren"></use>
                          </svg>
                        </span>
                      </el-popover>
                      <!--  -->
                    </span>
                    <!-- <span class="ml20" v-if="item.outpatientDispenseObject.adviceExecuteId"><span class="light-gray">执行单号：</span> {{item.outpatientDispenseObject.adviceExecuteId}}</span> -->
                    <span class="ml10 light-gray">申请时间：</span>
                    <span v-if="item.createTime">{{item.createTime | formatDateByExp}}</span>
                  </el-col>
                </el-row>
                <tcm-template
                  v-if="item.outpatientDispenseObject.adviceType === '303' || item.outpatientDispenseObject.adviceType === '304'"
                  :templateData="item.backStocksItemDtoList"
                ></tcm-template>
                <wm-template
                  :showSelectable="showSelectable"
                  :tableData="item.backStocksItemDtoList"
                  :tableCellClassName="tableCellClassName"
                  modelType="backdrug"
                  :adviceType="item.outpatientDispenseObject.adviceType"
                  @selectOpbBack="bandleSelect"
                ></wm-template>
              </div>
            </div>
            <!-- 操作 -->
            <div class="btn_footer" v-if="backStatus === 9">
              <el-row>
                <el-col :span="24">
                  <div class="alg_c">
                    <el-button @click="confirmDialog(10)" type="primary" :loading="isChecked">同意入库</el-button>
                    <el-button @click="confirmDialog(7)" :loading="isChecked">拒绝入库</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <everNoData v-else class="no-data" tipTxt="暂无处方"></everNoData>
        <back-dialog
          :visible.sync="isShowDialog"
          :checkedItems="checkedItems"
          :status="dialogStatus"
          @dialogConfirm="dialogConfirm"
        ></back-dialog>
      </div>
    </div>
    <!-- 检查检验报告 -->
    <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
  </div>
</template>

<script>
import api from '../store/opdapi'
import { PATIENT_HEAD, DISPENSING_STATUS } from '@/util/common'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import wmTemplate from '@/warehouse/page/storages/components/wmtemplate'
import tcmTemplate from '@/warehouse/page/storages/components/tcmtemplate'
import patientHeader from '@/inpatient/components/common.head.js'
import reportDialog from '@/infusion/components/report.card.vue'
import DrugBackSearch from '../components/drug.back.search'
import drugBackMixins from '../mixins/backdrug.mixins.js'
import backDialog from '../components/back.dialog'
export default {
  mixins: [getStorage, drugBackMixins],
  data () {
    return {
      searchPatient: '',
      DISPENSING_STATUS,
      expandTable: false,
      PATIENT_HEAD,
      controlData: [], // 操作记录数据 ======
      patientData: [],
      currentDataId: '',
      currentVisitPatientId: '',
      currentVisitNumber: '',
      tableData: [],
      curDiseaseName: '',
      backStatus: 9,
      reportKey: false,
      isShowDialog: false,
      checkedItems: [],
      showSelectable: false,
      dialogStatus: 10,
      isChecked: false
    }
  },
  mounted () {
    this.getBackStocksVisitSnList(this.backStatus)
  },
  computed: {
    iconName () {
      const name = this.$filters.formateValueToFnt(this.backStatus, {
        list: DISPENSING_STATUS,
        showKey: 'iconName'
      })
      return name
    }
  },
  methods: {
    // 查询
    handelSearchPatient () {
      this.getBackStocksVisitSnList(this.backStatus)
    },
    // 获取左侧患者列表
    getBackStocksVisitSnList (status) {
      this.patientData = []
      this.tableData = []
      api.getBackStocksVisitSnList({
        recipeId: this.searchPatient.trim(),
        backStatus: status,
        storageRoomId: this.storageId
      }).then(res => {
        if (Array.isArray(res) && res.length) {
          this.patientData = res
          this.handleDetails(res[0])
        }
      })
    },
    // 点击事件
    handleDetails (data) {
      this.currentDataId = data.id
      this.currentVisitPatientId = data.patientId
      this.currentVisitNumber = data.visitSn
      this.fetchVisitTable(data)
    },
    // 获取右边表格数据
    fetchVisitTable (data) {
      api.getBackStocksOutpatientDispenseList({
        id: data.id,
        storageRoomId: this.storageId,
        backStatus: this.backStatus,
        patientId: data.patientId,
        visitSn: data.visitSn
      }).then(res => {
        if (Array.isArray(res.outpatientDispenseList) && res.outpatientDispenseList.length) {
          this.tableData = res.outpatientDispenseList
          res.outpatientDispenseList.forEach((item) => {
            if (item.outpatientDispenseObject.adviceType === '303' || item.outpatientDispenseObject.adviceType === '304') {
              this.checkedItems.push(...item.backStocksItemDtoList)
            }
          })
        }
        if (res.zhenDuan) {
          let diseaseName = JSON.parse(JSON.parse(res.zhenDuan).ZHEN_DUAN)
          if (diseaseName && diseaseName[0]) this.curDiseaseName = diseaseName[0].diseaseName
        }
      })
    },
    // 同意或拒绝入库
    confirmDialog (status) {
      this.isChecked = true
      if (this.checkedItems.length) {
        this.dialogStatus = status
        this.isShowDialog = true
        this.isChecked = false
      } else {
        this.$messageTips(this, 'warning', '请选择具体明细后再操作')
        this.isChecked = false
      }
    },
    // 入库请求
    dialogConfirm (val) {
      api.updateBackStocks(val).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '操作成功')
          this.checkedItems = []
          this.getBackStocksVisitSnList(this.backStatus)
        }
      })
    },
    // 检查检验报告
    reportOpen (data) {
      this.reportKey = true
      this.$nextTick(_ => {
        this.$refs.reportDialog.openDialog(data)
      })
    },
    tableCellClassName ({ row }) {
      // return row.outpatientDispenseItem.identification ? 'danger-row' : ''
    },
    // 高亮显示
    patientTableRowClassName ({ row }) {
      return row.id === this.currentDataId ? 'current-patient-row' : ''
    },
    bandleSelect (val) {
      this.checkedItems = val
    }
  },
  watch: {
    backStatus (val) {
      if (val === 10) { // 退药完成状态 不显示select
        this.showSelectable = true
      } else {
        this.showSelectable = false
      }
      this.getBackStocksVisitSnList(val)
    }
  },
  components: {
    DrugBackSearch,
    patientHeader,
    wmTemplate,
    tcmTemplate,
    reportDialog,
    backDialog
  }
}
</script>

<style lang="less" scoped>
.no-data {
  margin-top: 200px;
}
.clinic-table {
  // border-radius: 3px 3px 0 0;
  background: #fff;
  padding-bottom: 60px;
}
.layout_box.el-main {
  position: relative;
}

.clinic_content {
  height: e("calc(100vh - 308px)");
  overflow-x: hidden;
}

.pad1 {
  .clinic_content {
    height: e("calc(100vh - 280px)");
    overflow-x: hidden;
  }
}

.pad {
  position: relative;
  .btn_footer {
    width: 100%;
    height: 60px;
    z-index: 9;
    margin-left: -16px;
    position: absolute;
    bottom: 0px;
    line-height: 60px;
    border-top: none;
    .el-row {
      padding: 0 20px;
    }
  }
}
.prescription-layout .pr-l-w{
  z-index: 105;
}
.prescription-layout .pr-r{
  overflow: hidden;
}
</style>
