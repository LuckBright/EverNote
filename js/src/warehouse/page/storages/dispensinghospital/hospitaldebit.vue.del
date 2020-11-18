<template>
  <div
    class="hospital-container"
    v-loading.fullscreen.lock="fullscreenLoading"
    style="margin-top: -1px"
  >
    <!-- 搜索框 -->
    <div class="hospital-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <dispen-search
            placeholder="药包编号/患者姓名"
            router="/storages/dispensinghospital/hospitalquery"
            storageKey="HOSPITAL_QUERY"
          ></dispen-search>
        </el-col>
      </el-row>
    </div>
    <!-- 患者信息 -->
    <div class="hospital-layout">
      <el-container>
        <el-aside width="280px" class="inner high">
          <div class="date_picker_box" id="data_picker">
            <el-row :gutter="10" type="flex" align="middle">
              <el-col :span="12">
                <date-picker
                  v-model="searchTime"
                  placeholder="选择日期"
                  :clearable="false"
                  outformat="yyyy-MM-dd HH:mm:ss"
                  @change="searchTimeChange"
                ></date-picker>
              </el-col>
              <el-col :span="12">
                <date-picker
                  v-model="searchNextTime"
                  placeholder="选择日期"
                  :clearable="false"
                  outformat="yyyy-MM-dd HH:mm:ss"
                  @change="searchNextTimeChange"
                ></date-picker>
              </el-col>
            </el-row>
          </div>
          <el-table
            highlight-current-row
            ref="singleTable"
            :stripe="false"
            :data.sync="leftTableData"
            @row-click="handleClick"
            :row-class-name="patientTableRowClassName"
          >
            <el-table-column class-name="pointer" label="病区">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.spaceRecordObject"
                >{{findBasesourceCode({arr: scope.row.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</span>
                <span v-if="scope.row.addCount" class="font red">+{{scope.row.addCount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="临时/长期" prop="counts" align="center" width="90"></el-table-column>
          </el-table>
        </el-aside>
        <el-main class="inner ml10" v-if="rightTableData.length || drugStatus >= 0">
          <el-form ref="form" label-width="80px" class="search_form bor_bom_1">
            <el-form-item label="给药途径:" v-if="employList.length">
              <div :class="{'bor_bom_1': implementTimeListNew.length}">
                <!-- <el-checkbox
                  class="search_sty"
                  v-model="checkAllemploy"
                  @change="handleCheckAllEmploy"
                >全选</el-checkbox>-->
                <el-radio-group v-model="employCheck" @change="handleEmployList">
                  <el-radio
                    v-for="item in employList"
                    :label="item.employ"
                    :key="item.employ"
                  >{{item.employTxt}}</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="执行时间:" v-if="implementTimeListNew.length">
              <div>
                <!-- <el-checkbox
                  class="search_sty"
                  :disabled="isDisabled"
                  v-model="checkAllTime"
                  @change="handleCheckAllTimeChange"
                >全选</el-checkbox>-->
                <el-radio-group
                  v-model="implementTimeCheck"
                  :disabled="isDisabled"
                  class="search_sty"
                  @change="handleImplementTime"
                >
                  <el-radio
                    v-for="item in implementTimeListNew"
                    :label="item.implementTime"
                    :key="item.implementTime"
                  >{{item.implementTimeTxt}}</el-radio>
                </el-radio-group>
                <el-checkbox
                  class="line"
                  v-model="checked"
                  @change="handleCheckNow"
                  label="now"
                >临时医嘱</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="药包状态:">
              <el-radio-group v-model="drugStatus" @change="drugStatusChange">
                <el-radio-button
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id"
                >{{item.name}}</el-radio-button>
              </el-radio-group>
              <el-checkbox
                class="ml20"
                true-label="1"
                false-label
                v-model="identification"
                label="仅看异常"
                @change="identificationChange"
              ></el-checkbox>
            </el-form-item>
          </el-form>
          <div>
            <el-row :gutter="10">
              <el-col :span="16">
                <el-table
                  v-loading="centerLoading"
                  :data="rightTableData"
                  ref="multipleTable"
                  :height="'calc(100vh - 370px)'"
                  border
                  highlight-current-row
                  @row-click="handleRowClick"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    :selectable="handleSelecTable"
                    v-if="isCheckBox"
                    type="selection"
                    width="40"
                  ></el-table-column>
                  <el-table-column width="68">
                    <template slot-scope="scope">
                      <i
                        v-if="scope.row.dateType == 1"
                        style="font-size: 15px"
                        class="iconfont icon-today blue"
                      ></i>
                      <el-tooltip
                        effect="dark"
                        v-if="scope.row.source == 3"
                        content="出院带药"
                        placement="top"
                      >
                        <svg class="icon f16" aria-hidden="true">
                          <use xlink:href="#icon-chuyuandaiyao"></use>
                        </svg>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="执行时间">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.termType"
                      >{{dateFormat(scope.row.implementTime, 'HH:mm')}}</span>
                      <span v-else style="color: #ff9c00" class="f_bold">临时医嘱</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="给药途径">
                    <template slot-scope="scope">
                      <span>
                        {{scope.row.employTxt}}
                        <sys-value
                          type="THC_CPOE_DropRate"
                          v-if="scope.row.dropSpeed"
                          :code="scope.row.dropSpeed"
                        ></sys-value>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="床号">
                    <template slot-scope="scope">
                      <span>{{scope.row.bedNum}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="患者姓名">
                    <template slot-scope="scope">
                      <span v-if="scope.row.patientObject">{{scope.row.patientObject.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="性别">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.patientObject"
                      >{{scope.row.patientObject.sex | formatSex}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="年龄">
                    <template slot-scope="scope">
                      <span v-if="scope.row.patientObject">{{scope.row.patientObject.age}}岁</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                      <span>{{setName(DISPENSING_STATUS, scope.row.status)}}</span>
                      <el-tooltip
                        v-if="scope.row.identification"
                        class="ml10"
                        effect="dark"
                        content="异常"
                        placement="right-end"
                      >
                        <i class="iconfont icon-tixing"></i>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="btn-container" v-if="rightTableData.length">
                  <div class v-if="drugStatus == '2'">
                    <el-button type="primary" @click="handleBatchPrint(false)">批量打印</el-button>
                    <span class="ml10">
                      <i class="el-icon-question blue mt5"></i>
                      <span class="light_gray f12">注：批量打印会打印上面选择的全部内容，并生成备药单</span>
                    </span>
                  </div>
                  <div class v-if="drugStatus == '4'">
                    <el-button type="primary" @click="handleFinish(false, 2)">备药完成</el-button>
                  </div>
                  <div class v-if="drugStatus == '5'">
                    <el-button type="primary" @click="handleBatchDrug(false, 1)">批量发药</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="table-item">
                  <h4>
                    药包信息
                    <span
                      class="operation"
                      v-if="drugPackInfo && drugPackInfo.adviceId && rightTableData.length"
                    ></span>
                  </h4>
                  <!-- <el-button type="text" @click="handelDiagnosis">诊断记录</el-button> -->
                  <div
                    class="bag-msg"
                    v-if="drugPackInfo && drugPackInfo.adviceId && rightTableData"
                  >
                    <div class="hr">
                      <p>
                        <span class="light-gray">UDD药包：</span>
                        {{drugPackInfo.code}}
                      </p>
                      <p>
                        <em
                          v-if="drugPackInfo.spaceRecordObject"
                        >{{findBasesourceCode({arr: drugPackInfo.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</em>
                        <em>{{drugPackInfo.bedNum}} 床</em>
                      </p>
                      <p v-if="drugPackInfo.patientObject">
                        <em>{{drugPackInfo.patientObject.name}}</em>
                        <em>({{drugPackInfo.patientObject.sex | formatSex}})</em>
                        <em>{{drugPackInfo.patientObject.age}}岁</em>
                        <em>
                          {{drugPackInfo.patientObject.weight}}
                          <template
                            v-if="drugPackInfo.patientObject.height"
                          >/{{drugPackInfo.patientObject.height}}</template>
                        </em>
                      </p>
                      <p v-if="drugPackInfo.hospitalizedNumber">
                        <span class="light-gray">住院号：</span>
                        {{drugPackInfo.hospitalizedNumber}}
                        <el-button v-if="$hasPermission('Auth_menu_treasury_hospitalization_seedoctorsadvice')" type="text" class="ml20" @click="handleLookAdvice">查看医嘱</el-button>
                      </p>
                      <p v-if="drugPackInfo.allergenList">
                        <span class="light-gray">过敏史：</span>
                        {{allergenList(drugPackInfo.allergenList)}}
                        <!--<a href="#">诊断记录</a>-->
                      </p>
                      <div
                        v-if="drugPackInfo.adviceType == TRADITIONAL_CHINESE_MEDICINE || drugPackInfo.adviceType == CHINESE_PATENT_MEDICINE"
                      >
                        <p
                          style="display:inline;margin-right:30px"
                          v-if="drugPackInfo.uddDispenseItemList && drugPackInfo.uddDispenseItemList.length"
                        >
                          <span
                            class="light-gray"
                            v-if="drugPackInfo.uddDispenseItemList[0].count"
                          >剂数：</span>
                          {{drugPackInfo.uddDispenseItemList[0].count}} 剂
                        </p>
                        <p
                          style="display:inline"
                          v-if="drugPackInfo.uddDispenseItemList && drugPackInfo.uddDispenseItemList.length"
                        >
                          <span
                            class="light-gray"
                            v-if="drugPackInfo.uddDispenseItemList[0].useFreqTxt"
                          >频次：</span>
                          {{drugPackInfo.uddDispenseItemList[0].useFreqTxt}}
                        </p>
                        <p
                          v-if="drugPackInfo.uddDispenseItemList && drugPackInfo.uddDispenseItemList.length"
                        >
                          <span class="light-gray">是否代煎:</span>
                          {{drugPackInfo.uddDispenseItemList[0].decoct ? '是' : '否'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{drugPackInfo.employTxt}}
                        </p>
                      </div>
                      <p>
                        <span v-if="drugPackInfo.termType" class="light-gray">预执行时间：</span>
                        <span
                          v-if="drugPackInfo.termType"
                        >{{dateFormat(drugPackInfo.implementTime, 'YYYY-MM-DD HH:mm')}}</span>
                        <el-tooltip
                          v-if="drugPackInfo.source === '3'"
                          class="f16"
                          style="vertical-align: middle;"
                          effect="dark"
                          content="出院带药"
                          placement="top"
                        >
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-chuyuandaiyao"></use>
                          </svg>
                        </el-tooltip>
                      </p>
                    </div>
                    <div
                      class="tcm-template"
                      v-if="drugPackInfo.adviceType == TRADITIONAL_CHINESE_MEDICINE || drugPackInfo.adviceType == CHINESE_PATENT_MEDICINE"
                    >
                      <el-row class="tcm-item">
                        <el-col
                          :span="24"
                          v-for="(item, index) in drugPackInfo.uddDispenseItemList"
                          :key="index"
                          :class="item.identification ? 'exception' : ''"
                        >
                          <el-col :span="16">
                            <span>
                              <wh-code-to-name
                                :showIcon="false"
                                :patchObj="{
                                  code: SEARCH_CODE[1],
                                  list: item.localSettingObject.materialSkuObject.materialPropertys,
                                  isInfo: false
                                }"
                              ></wh-code-to-name>
                            </span>
                            <div
                              v-if="item.identification"
                              class="red"
                            >异常原因：{{item.identificationTxt}}</div>
                          </el-col>
                          <el-col :span="8">
                            <span>{{item.measure}}/{{item.measureUnitName}}</span>
                            <span v-if="item.decoction">
                              <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="item.decoction"></sys-value>
                            </span>
                          </el-col>
                        </el-col>
                      </el-row>
                    </div>
                    <el-table
                      v-else
                      :data="drugPackInfo.uddDispenseItemList"
                      style="width: 100%"
                      :show-header="false"
                      :row-class-name="tableRowClassName"
                      max-height="200"
                    >
                      <el-table-column label>
                        <template slot-scope="scope">
                          <p v-if="scope.row.localSettingObject">
                            <wh-code-to-name
                              :showIcon="false"
                              :patchObj="{
                                code: [...MATERILA_CODE, SPEC_CODE],
                                list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                                isInfo: false
                              }"
                            ></wh-code-to-name>
                          </p>
                          <p>
                            <span class="warning" v-if="scope.row.cdssResult">
                              <i class="iconfont icon-wodebaojing red mr10 f12"></i>
                              {{scope.row.cdssResult}}
                            </span>
                          </p>
                          <p>
                            <span
                              class="warning"
                              v-if="scope.row.identification"
                            >异常原因：{{scope.row.identificationTxt}}</span>
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column label width="70" align="right">
                        <template slot-scope="scope">{{scope.row.num}}/{{scope.row.countUnit}}</template>
                      </el-table-column>
                    </el-table>
                    <div class="mt10 pb10 clear clearfix">
                      <p v-if="drugStatus==2 && !drugPackInfo.identification" class="fl">
                        <el-button type="primary" @click="handleSinglePrint">打印药包</el-button>
                        <el-button type="primary" @click="handleUnusual(true)">异常</el-button>
                      </p>
                      <p v-else-if="drugStatus==4 && !drugPackInfo.identification" class="fl">
                        <!-- 按药包打印 -->
                        <!-- 补打标签 -->
                        <el-button type="primary" @click="handleFinish(true, 2)">备药完成</el-button>
                        <el-button
                          v-if="printModel == 2 && (drugPackInfo.adviceType == TRADITIONAL_CHINESE_MEDICINE || drugPackInfo.adviceType == CHINESE_PATENT_MEDICINE)"
                          type="primary"
                          @click="printSinge({type: drugPackInfo.adviceType})"
                        >打印处方</el-button>
                        <el-button type="primary" @click="handlePrintDrugPack(drugPackInfo)">补打药包</el-button>
                        <el-button type="primary" @click="handleUnusual(true)">异常</el-button>
                      </p>
                      <p v-else-if="drugStatus==5 && !drugPackInfo.identification" class="fl">
                        <el-button type="primary" @click="handleBatchDrug(true, 1)">发药</el-button>
                        <el-button
                          v-if="printModel == 2 && (drugPackInfo.adviceType == TRADITIONAL_CHINESE_MEDICINE || drugPackInfo.adviceType == CHINESE_PATENT_MEDICINE)"
                          type="primary"
                          @click="printSinge({type: drugPackInfo.adviceType})"
                        >打印处方</el-button>
                        <el-button type="primary" @click="handlePrintDrugPack(drugPackInfo)">补打药包</el-button>
                        <el-button type="primary" @click="handleUnusual(true)">异常</el-button>
                      </p>
                      <p v-else-if="drugPackInfo.identification" class="fl">
                        <el-button type="primary" @click="cancelUnusual">撤销异常</el-button>
                      </p>
                      <p class="fr">
                        <el-button type="text" @click="showLogs(drugPackInfo)">操作记录</el-button>
                      </p>
                    </div>
                  </div>
                  <everNoData v-else class="no-data" tipTxt="暂无药包信息"></everNoData>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-main>
        <el-main class="inner ml10" v-else>
          <everNoData class="no-data"></everNoData>
        </el-main>
      </el-container>
    </div>
    <!-- 异常弹出框 -->
    <exception-dialog
      :exceptionData="unusualTableData"
      :visible.sync="dialogTableVisible"
      @confirm="saveUnusual"
    ></exception-dialog>
    <record-dialog :value.sync="dialogRecord" :tableData="recordTableData"></record-dialog>
    <dialog-slot width="90%" title="医嘱信息" :dialogSlot.sync="dialogSlot">
      <advice-list
        v-if="dialogSlot"
        :base-info="baseInfo"
        :no-operate="true"
        :show-add="false"
        :show-all="true"
      ></advice-list>
    </dialog-slot>
    <jcp-print
      :key="jcpKey"
      ref="jcpPrint"
      :hospitalType="hospitalType"
      :liveTableData="liveTableData"
      :liveNonFatherAdvice="liveNonFatherAdvice"
      :printPatientObj="printPatientObj"
      :liveType="liveType"
      :inpatientArea="inpatientArea"
      :fatherAdvice="fatherAdvice"
    ></jcp-print>
  </div>
</template>

<script>
import exceptionDialog from '../components/exceptiondialog'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import setName from '@/util/setstatusname'
import api from '../store/hospitalapi'
import { DISPENSING_STATUS } from '@/util/warehouseconfig'
import { debounce, SPACE_CODE, SPEC_CODE, MATERILA_CODE, patch, dateFormat, objGet, frPrint, CHINESE_PATENT_MEDICINE, TRADITIONAL_CHINESE_MEDICINE, SEARCH_CODE } from '@/util/common'
import mixinsDespen from './mixins_despen'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import recordDialog from './record.dialog'
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import adviceList from '@/inpatient/components/advice.list.vue'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixins'
const printParams = {
  preview: false,
  settings: {
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    marginLeft: 15
  }
}
export default {
  mixins: [getStorage, setName, mixinsDespen, sendDrug, hospitalPrintMixins],
  data () {
    return {
      nullText: '缺字段',
      fullscreenLoading: false,
      centerLoading: false,
      dialogRecord: false,
      dateFormat,
      DISPENSING_STATUS,
      SPACE_CODE,
      SPEC_CODE,
      MATERILA_CODE,
      searchTime: '',
      searchNextTime: '',
      uddDispenseId: '',
      input: '',
      recordTableData: [],
      baseInfo: [], // 患者基本信息，主要用到：doctorType，hospitalizedNumber，patientId （查看医嘱组件）
      dialogSlot: false,
      employCheck: '',
      drugPackInfo: {},
      implementTimeCheck: '',
      implementTimeList: '',
      employList: '',
      identification: '',
      leftTableData: [],
      rightTableData: [],
      isIndeterminate: false,
      checkAllemploy: false,
      checkAllTime: false,
      isDisabled: false,
      isCheckBox: true,
      checkNow: false,
      checked: [],
      unusualTableData: [],
      unusualVal: '',
      multipleSelection: [],
      statusList: [],
      drugStatus: 0,
      termType: '',
      dialogTableVisible: false,
      TRADITIONAL_CHINESE_MEDICINE,
      CHINESE_PATENT_MEDICINE,
      SEARCH_CODE,
      printModel: this.$ever.getClinicConfig().printModel, // 打印机构类型
      hnxdPrint: this.$ever.getClinicConfig().hnxdPrint // 海南打印机构类型
    }
  },
  created () {
    // 获取本地时间
    this.searchTime = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.searchNextTime = this.$moment().startOf('day').add(1, 'd').format('YYYY-MM-DD HH:mm:ss')
    this.getSpaceList()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row && (row.cdssResult || row.identification)) {
        return 'mark-cdss-row'
      }
      return row && row.cdssResult ? 'noPad' : ''
    },
    // 打印药包标签
    handlePrintDrugPack: debounce(function (data) {
      this.gatherPrintSingle(data)
      // this.handleReprint({ types: 'hospitalization', isSingle: true, curMine: true, data })
    }),
    // 查看医嘱
    handleLookAdvice () {
      this.baseInfo = this.drugPackInfo
      this.dialogSlot = true
    },
    printSinge ({ type }) {
      let tempArr = []
      this.drugPackInfo.uddDispenseItemList.map(v => {
        tempArr.push(`'${v.localMaterialId}'`)
      })
      let localmaterialIds = tempArr.join(',')
      if (type === TRADITIONAL_CHINESE_MEDICINE || type === CHINESE_PATENT_MEDICINE) {
        frPrint('thc_wh_hospitial_send_chinese_medchin', { id: this.drugPackInfo.id, localmaterialIds }, printParams)
      } else {
        frPrint('ZHU_YUAN_FA_YAO_UDD', { id: this.drugPackInfo.id, localmaterialIds }, printParams)
      }
    },
    drugStatusChange (val) {
      this.spaceId && this.getUddDispenseList()
      this.drugPackInfo = {}
      this.changeCheckBox(val)
    },
    searchTimeChange (val) {
      this._getSpaceList()
    },
    searchNextTimeChange (val) {
      this._getSpaceList()
    },
    identificationChange (val) {
      this.spaceId && this.getUddDispenseList()
    },
    // 过敏史
    allergenList (data) {
      let arr = []
      data.forEach(item => {
        item && arr.push(item.name)
      })
      return arr.join(', ') || '无'
    },
    showLogs (data) {
      let params = {
        identificationId: data.id,
        stoageRoomId: data.storageRoomId
      }
      api.getDispenseLogForUdd(params).then(res => {
        if (res) this.recordTableData = res
      })
      this.dialogRecord = true
    },
    changeCheckBox (val) {
      // 待打印，待备药，待发药状态有多选框
      if ((val === 2) || (val === 4) || (val === 5)) {
        this.isCheckBox = true
      } else {
        this.isCheckBox = false
      }
    },
    // 处理异常
    handleUnusual (flag) {
      this.fullscreenLoading = true
      let ids = []
      if (flag) {
        ids.push(this.drugPackInfo.id)
      } else {
        this.multipleSelection.forEach(item => {
          ids.push(item.id)
        })
      }
      api.getUddDispenseByIds({
        ids: ids.join(',')
      }).then(res => {
        if (res) {
          this.dialogTableVisible = true
          this.unusualTableData = res
          this.fullscreenLoading = false
        }
      })
    },
    // 取消异常
    async cancelUnusual () {
      const result = await api.updateUddDispense({
        id: this.drugPackInfo.id
      }).then(res => res)
      if (result.flag) {
        this.$messageTips(this, 'success', '取消异常成功')
        this.getUddDispenseList()
      }
    },
    // 保存异常
    async saveUnusual (data) {
      // 更新发药接口测试
      let params = []
      data.checkedItems.forEach((item) => {
        params.push({
          id: item.id,
          identification: 1,
          identificationTxt: data.inputVal,
          uddDispenseId: item.uddDispenseId
        })
      })
      const result = await api.updateUddDispenseItemList(params).then(res => res)
      if (result) this.getUddDispenseList()
      this.dialogTableVisible = false
    },
    // 给药途径 是否全选
    handleEmployList (data) {
      data.length === this.employList.length ? this.checkAllemploy = true : this.checkAllemploy = false
      this.spaceId && this.getUddDispenseList()
    },
    // 执行时间 是否全选
    handleImplementTime (data) {
      data.length === this.implementTimeList.length ? this.checkAllTime = true : this.checkAllTime = false
      this.spaceId && this.getUddDispenseList()
    },
    async getSpaceList () {
      this.fullscreenLoading = true
      // 左侧按时间查询病区列表
      this.leftTableData = await api.getSpaceList({
        // searchName: this.searchName,
        searchTime: this.searchTime,
        searchNextTime: this.$moment(this.searchNextTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        storageRoomId: this.storageId
      }).then(res => {
        res && res.forEach(item => {
          item.addCount = 0
        })
        return res
      })
      // this.searchName = ''
      this.spaceId = this.leftTableData && objGet(this.leftTableData[0], 'spaceRecordObject.id', '') ? this.leftTableData[0].spaceRecordObject.id : ''
      this.inpatientArea = this.leftTableData[0]
      this.getRightList()
      this.getStatusList()
    },
    getStatusList () {
      const params = {
        storageRoomId: this.storageId,
        dispenseType: this.dataSource
      }
      this.statusList = []
      api.getStatusList(params).then(res => {
        res.forEach(item => {
          let arr = item.status.split(',')
          let arr1 = arr[0].split(':')
          let arr2 = arr[1].split(':')
          this.statusList.push({
            id: +arr1[1],
            name: arr2[1].substring(2, arr2[1].length - 1)
          })
        })
        this.drugStatus = this.statusList[0].id
      })
    },
    async getRightList () {
      const params = {
        storageRoomId: this.storageId, // 库房id
        searchTime: this.searchTime, // 时间
        searchNextTime: this.$moment(this.searchNextTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'), // 时间
        spaceId: this.spaceId // 病区id
      }
      if (this.spaceId) {
        this.employList = await this.getSearchForList(Object.assign(params, { type: 'employ' })) || []
        this.implementTimeList = await this.getSearchForList(Object.assign(params, { type: 'implementTime' })) || []
        // 选择条件 -- 添加默认值
        if (this.employList.length) this.employCheck = this.employList[0].employ
        if (this.implementTimeList.length) this.implementTimeCheck = this.implementTimeList[0].implementTime
        this.getUddDispenseList()
      } else {
        this.rightTableData = []
        this.drugPackInfo = {}
      }
      this.fullscreenLoading = false
    },
    getSearchForList (params) {
      return api.getSearchForList(params).then(res => res)
    },
    getUddDispenseInfo (id) {
      // 获取药包信息
      api.getUddDispenseInfo(id).then(res => {
        this.drugPackInfo = res
      })
    },
    getUddDispenseList: debounce(async function () {
      // 右侧单个病区的患者列表
      this.rightTableData = await api.getUddDispenseList({
        // implementTimeList: this.implementTimeCheck, // 执行时间
        implementTime: this.implementTimeCheck, // 执行时间
        employ: this.employCheck, // 给药途径
        // employList: this.employCheck, // 给药途径
        storageRoomId: this.storageId, // 库房id
        searchTime: this.searchTime, // 时间
        searchNextTime: this.$moment(this.searchNextTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'), // 时间
        spaceId: this.spaceId, // 病区id
        status: this.drugStatus, // 药包状态
        termType: this.termType,
        // searchName: this.searchName,
        identification: this.identification // 仅看异常
      }).then(res => {
        return res.list || res
      })
      this.uddDispenseId = this.rightTableData.length ? this.rightTableData[0].id : ''
      if (this.uddDispenseId) {
        this.getUddDispenseInfo(this.uddDispenseId)
      } else {
        this.drugPackInfo = {}
      }
    }),
    handleClick (row) {
      // 点击左侧表格，选择病区
      this.spaceId = objGet(row, 'spaceRecordObject.id', '')
      this.drugStatus = this.statusList[0].id
      this.employ = ''
      this.implementTime = ''
      this.spaceId && this.getRightList()
      this.employCheck = ''
      this.implementTimeCheck = ''
      row.addCount = 0
      this.inpatientArea = row
    },
    handleCheckAllEmploy (val) {
      // 全选所有执行时间
      const employCheck = ''
      if (val) {
        this.employList.forEach(item => {
          employCheck.push(item.employ)
        })
      }
      this.employCheck = val ? employCheck : ''
      this.spaceId && this.getUddDispenseList()
    },
    handleCheckAllTimeChange (val) {
      // 全选所有执行时间
      const implementTimeCheck = ''
      if (val) {
        this.implementTimeList && this.implementTimeList.forEach(item => {
          implementTimeCheck.push(item.implementTime)
        })
      }
      this.implementTimeCheck = val ? implementTimeCheck : ''
      this.spaceId && this.getUddDispenseList()
    },
    handleCheckNow (val) {
      // 医嘱类型   医嘱类型：0、临时；1、长期(医嘱)
      this.termType = val ? 0 : ''
      this.checkAllTime = ''
      this.implementTimeCheck = ''
      val === true ? this.isDisabled = true : this.isDisabled = false
      this.spaceId && this.getUddDispenseList()
    },
    handleRowClick (row, column, event) {
      // 点击列表选中checkbox
      let index = this.multipleSelection.findIndex(item => {
        return item.id === row.id
      })
      if (index === -1) this.$refs.multipleTable.toggleRowSelection(row)
      if (row.id === this.uddDispenseId) return
      this.uddDispenseId = row.id
      this.getUddDispenseInfo(this.uddDispenseId)
    },
    handleSelecTable (row, index) {
      this.unusualVal = row.identification
      return !row.identification
    },
    handleSelectionChange (val) {
      // 对单个病区的患者列表进行多选
      this.multipleSelection = val
    },
    // 单个打印 （待打印 - 打印）
    handleSinglePrint () {
      this.fullscreenLoading = true
      api.updateUddStatus(this.drugPackInfo.id).then(res => {
        if (res.flag) {
          if (this.printModel === 2 && (this.drugPackInfo.adviceType === TRADITIONAL_CHINESE_MEDICINE || this.drugPackInfo.adviceType === CHINESE_PATENT_MEDICINE)) {
            // 保留gxkf 打印处方单
            this.printSinge({ type: this.drugPackInfo.adviceType })
          } else if (this.hnxdPrint) {
            this.gatherPrintSingle(this.drugPackInfo)
            // this.handlePrintDrugPack(this.drugPackInfo)
          }
          this.$messageTips(this, 'success', '打印成功')
          this.getRightList()
        }
        this.fullscreenLoading = false
      })
    },
    _getSpaceList: debounce(function () {
      this.drugStatus = ''
      this.employCheck = ''
      this.checkAllemploy = false
      this.checkAllTime = false
      this.implementTimeCheck = ''
      this.getSpaceList()
    }),
    // 当前病区 - 添加class
    patientTableRowClassName ({ row }) {
      return row.spaceId === this.spaceId ? 'current-table-row' : ''
    },
    ...patch
  },
  watch: {
    '$store.state.dispensing.hospitalData' (v) {
      let index = this.leftTableData.findIndex(item => {
        return item.spaceId === v.spaceId
      })
      if (index > -1) {
        let count = this.leftTableData[index].addCount + 1
        let countArr = this.leftTableData[index].counts.split('/')
        v.termType === 0 ? countArr[0] = +countArr[0] + 1 : countArr[1] = +countArr[1] + 1
        this.$set(this.leftTableData[index], 'addCount', count)
        this.$set(this.leftTableData[index], 'counts', countArr.join('/'))
      } else {
        let tempObj = v
        tempObj.addCount = 0
        // 医嘱类型：0、临时；1、长期(医嘱)
        tempObj.counts = tempObj.termType ? '0/1' : '1/0'
        this.leftTableData.unshift(tempObj)
      }
    }
  },
  computed: {
    implementTimeListNew () {
      this.implementTimeList && this.implementTimeList.forEach(item => {
        item.implementTimeTxt = dateFormat(item.implementTime, 'HH:mm')
      })
      return this.implementTimeList || []
    },
    drugPackStatus () {
      let list = this.DISPENSING_STATUS.filter(item => {
        return item.id !== 1 && item.id !== 3
      })
      return list
    }
  },
  components: {
    exceptionDialog,
    JcpPrint,
    recordDialog,
    adviceList,
    dialogSlot,
    dispenSearch
  }
}
</script>

<style lang="scss" scoped>
.font.red {
  font-weight: bold;
  display: inline-block;
}
.iconfont.icon-tixing {
  animation: twinkle 1s linear infinite;
}
@keyframes twinkle {
  0% {
    color: red;
    transform: scale(1);
  }
  50% {
    color: #eb9e05;
    transform: scale(1.5);
  }
  100% {
    color: red;
    transform: scale(1);
  }
}
#data_picker {
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 10px !important;
  }
}
.hospital-layout {
  .el-radio-group {
    .el-radio {
      margin-right: 20px;
    }
    .el-radio + .el-radio {
      margin-right: 20px;
      margin-left: 0;
    }
  }
  .date_picker_box {
    padding: 15px;
    padding-bottom: 5px;
  }
  .inner {
    background: #fff;
  }
  .high {
    height: calc(100vh - 150px);
  }
  .search_form {
    padding-bottom: 10px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
  .search_sty {
    // float: left;
    margin-right: 20px;
  }
  .table-item {
    border: 1px solid #ccc;
    margin-top: 10px;
    h4 {
      margin: 0;
      width: 100%;
      height: 40px;
      background: #eee;
      font-size: 16px;
      line-height: 40px;
      padding-left: 15px;
      box-sizing: border-box;
      .operation {
        float: right;
        margin-right: 15px;
        font-size: 14px;
        color: #1c7bef;
      }
    }
    .bag-msg {
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 10px;
      line-height: 26px;
      em {
        font-style: normal;
        margin-right: 10px;
      }
      .hr {
        margin-bottom: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
      }
      > ul {
        padding: 0;
        max-height: 150px;
        overflow-x: hidden;
      }
      .border {
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
        line-height: 40px;
      }
      .pt30 {
        text-align: center;
        padding-top: 0;
        padding-bottom: 15px;
      }
      .tip {
        color: #ee4433;
        line-height: 30px;
      }
    }
  }
}
.bor_bom_1 {
  display: inline-block;
  width: 100%;
}
.unusual-reason {
  display: flex;
  height: 36px;
  line-height: 36px;
  .title {
    color: red;
  }
  .el-input {
    width: 320px;
  }
}
.warning {
  color: red !important;
}
.el-table /deep/ .noPad .cell {
  padding-left: 0;
}
.row-status {
  &:after {
    content: " ";
    background: #1c7bef;
    width: 10px;
    height: 10px;
  }
}
.today {
  background: #1c7bef;
  color: #fff;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  padding: 1px;
  text-align: center;
  line-height: 16px;
  font-weight: bold;
  display: inline-block;
  font-size: 12px;
}
// 中药模版css
.tcm-template {
  background-color: #f0f0f0;
  font-size: 14px;
  color: #000;
  .tcm-item {
    padding: 10px 0 15px;
    > div {
      padding: 10px;
    }
    .exception {
      background-color: #ffc0c0;
      > div {
        padding-top: 5px;
      }
    }
  }
  .tcm-bottom {
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .span-label {
    color: #9ea09e;
  }
  .big {
    font-size: 18px;
  }
}
</style>
