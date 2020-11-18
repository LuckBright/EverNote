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
            :height="'calc(100vh - 205px)'"
            :stripe="false"
            @row-click="handleDetails"
            :row-class-name="patientTableRowClassName"
          >
            <el-table-column width="120" class-name="pointer" label="姓名">
              <template slot-scope="scope">
                <span v-if="scope.row.patientName">{{scope.row.patientName}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="90" class-name="pointer" label="科室">
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
                    <span class="ml5">{{item.outpatientDispenseObject.providerName}}</span>
                    <span class="ml10 light-gray">医生：</span>
                    <span class="ml5">{{item.outpatientDispenseObject.doctorName}}</span>
                    <span class="ml10 light-gray">诊断名称：</span>
                    <span class="ml10">{{curDiseaseName}}</span>
                    <el-button
                      style="margin-left: 10px !important;"
                      type="text"
                      @click="reportOpen(item.outpatientDispenseObject)"
                    >检查检验报告</el-button>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" justify="start" class="table_title">
                  <el-col :span="24">
                    <span>处方单号</span>
                    <span class="ml20">{{item.outpatientDispenseObject.recipeId}}</span>
                    <span
                      class="ml20"
                      v-if="item.outpatientDispenseObject.adviceExecuteId"
                    >执行单号 {{item.outpatientDispenseObject.adviceExecuteId}}</span>
                    <span class="ml20">申请时间</span>
                    <span class="ml20" v-if="item.createTime">{{item.createTime | formatDateByExp}}</span>
                  </el-col>
                </el-row>
                <tcm-template
                  v-if="item.outpatientDispenseObject.adviceType === '303' || item.outpatientDispenseObject.adviceType === '304'"
                  :templateData="item.backStocksItemDtoList"
                ></tcm-template>
                <wm-template
                  :tableData="item.backStocksItemDtoList"
                  :tableCellClassName="tableCellClassName"
                  modelType="backdrug"
                ></wm-template>
              </div>
            </div>
            <!-- 操作 -->
            <div class="btn_footer" v-if="backStatus === 9">
              <el-row>
                <el-col :span="24">
                  <div class="alg_c">
                    <el-button @click="confirmBack(10)" type="primary">同意入库</el-button>
                    <el-button @click="confirmBack(7)">拒绝入库</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <everNoData v-else class="no-data" tipTxt="暂无处方"></everNoData>
      </div>
    </div>
    <!-- 检查检验报告 -->
    <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
    <!-- 弹窗提醒 -->
    <tips-dialog
      ref="dialog"
      :title="`${dialogObj.title}入库`"
      :content="`确认${dialogObj.title}退药入库`"
      :function="dialogConfirm"
    ></tips-dialog>
  </div>
</template>

<script>
import api from '../store/clinicapi'
import tipsDialog from '@/warehouse/page/components/tipsdialog'
import { PATIENT_HEAD } from '@/util/common'
import setName from '@/util/setstatusname'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import wmTemplate from '@/warehouse/page/storages/components/wmtemplate'
import tcmTemplate from '@/warehouse/page/storages/components/tcmtemplate'
import patientHeader from '@/inpatient/components/common.head.js'
import reportDialog from '@/infusion/components/report.card.vue'
import DrugBackSearch from '../components/drug.back.search'
import drugBackMixins from '../mixins/backdrug.mixins.js'
export default {
  mixins: [setName, getStorage, drugBackMixins],
  data () {
    return {
      searchPatient: '',
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
      dialogObj: { // 弹窗
        title: '',
        type: ''
      }
    }
  },
  mounted () {
    this.getBackStocksVisitSnList(this.backStatus)
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
        storageRoomId: this.storageId,
        backStatus: this.backStatus,
        patientId: data.patientId,
        visitSn: data.visitSn
      }).then(res => {
        if (Array.isArray(res.outpatientDispenseList) && res.outpatientDispenseList.length) {
          this.tableData = res.outpatientDispenseList
        }
        if (res.zhenDuan) {
          let diseaseName = JSON.parse(JSON.parse(res.zhenDuan).ZHEN_DUAN)
          if (diseaseName && diseaseName[0]) this.curDiseaseName = diseaseName[0].diseaseName
        }
      })
    },
    // 同意或拒绝入库
    confirmBack (status) {
      if (status === 10) {
        this.dialogObj.title = '同意'
      } else {
        this.dialogObj.title = '拒绝'
      }
      this.dialogObj.type = status
      this.$refs.dialog.open()
    },
    // 入库请求
    dialogConfirm () {
      api.updateBackStocks({
        id: this.currentDataId,
        status: this.dialogObj.type
      }).then(res => {
        if (res) this.getBackStocksVisitSnList(this.backStatus)
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
    }
  },
  watch: {
    backStatus (val) {
      this.getBackStocksVisitSnList(val)
    }
  },
  components: {
    DrugBackSearch,
    patientHeader,
    wmTemplate,
    tcmTemplate,
    tipsDialog,
    reportDialog
  }
}
</script>

<style lang="less" scoped>
.no-data {
  margin-top: 200px;
}
.layout_box.el-main {
  position: relative;
}
.clinic_content {
  height: e("calc(100vh - 320px)");
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
    background: #fff;
    border-top: 1px solid #ccc;
    width: 100%;
    height: 60px;
    z-index: 9;
    margin-left: -15px;
    position: absolute;
    bottom: -61px;
    line-height: 60px;
    .el-row {
      padding: 0 20px;
    }
  }
}
</style>
