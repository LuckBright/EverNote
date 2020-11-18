<template>
  <div id="clinicprescription">
    <div class="prescription-layout">
      <!-- 患者列表 -->
      <div class="hospital-container">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          @query="list"
          :rules="rules"
          :is-query="true">
          <template slot="hospitalizedAreaId">
            <el-select
              v-model="queryObj.hospitalizedAreaId"
              filterable
              :default-first-option="true"
              clearable
              remote
              :placeholder="'病区'"
              :remote-method="queryAreaId"
            >
              <el-option
                v-for="item in AreaList"
                :key="item.id"
                :label="item.name"
                :value="item.id || item.name"
              ></el-option>
            </el-select>
          </template>
          <template slot="doctorId">
            <el-select
              v-model="queryObj.doctorId"
              filterable
              clearable
              :default-first-option="true"
              remote
              :placeholder="'医生姓名'"
              :remote-method="queryDoctorId"
            >
              <el-option
                v-for="item in doctorList"
                :key="item.id"
                :label="item.name"
                :value="item.id || item.name"
              ></el-option>
            </el-select>
          </template>
          <template slot="patientMsg">
            <el-select
              v-model="queryObj.patientMsg"
              filterable
              clearable
              :default-first-option="true"
              remote
              :placeholder="'住院号/患者姓名'"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in patients"
                :key="item.id"
                :label="item.name"
                :value="item.id || item.name"
              ></el-option>
            </el-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="handlerQuery">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div class="pos_re">
        <div
          class="pr-l pr-l-w400"
          :class="visitType == 1 && expandTable ? 'pr-l-w' : visitType == 3 && expandTable ? 'pr-l-w2' : ''"
        >
          <div class="patient-table pos_re" style="margin-top: 10px;z-index: 999;background:#fff">
            <el-button
              class="pos_ab"
              type="text"
              style="top: 7px;right: 10px;"
              :class="expandTable ? 'i-zhankai' : ''"
              @click="expandTable = !expandTable"
            >
              <i class="iconfont icon-zhankai"></i>
            </el-button>
            <p style="height:46px;line-height:46px;margin:0;padding: 0 10px;">患者列表</p>
            <!-- 门诊 -->
            <el-table
              ref="opdTable"
              class="opdTable no-border"
              v-if="visitType == 1"
              v-loading.body="fullscreenLoading"
              :data.sync="patientData"
              style="width: 100%;margin-top: 0;margin-bottom: 0;"
              :height="'calc(100vh - 275px)'"
              @row-click="handleDetails"
              highlight-current-row
            >
              <el-table-column show-overflow-tooltip width="85" class-name="pointer" label="科室名称">
                <template slot-scope="scope">
                  <span v-if="scope.row.providerName">{{scope.row.providerName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                class-name="pointer"
                style="position:relative"
                width="100"
                label="医师"
              >
                <template slot-scope="scope">
                  <i v-if="scope.row.status === 2" class="iconfont icon-buheli"></i>
                  <span v-if="scope.row.doctorName">{{scope.row.doctorName}}</span>
                </template>
              </el-table-column>
              <el-table-column class-name="pointer" label="处方单号">
                <template slot-scope="scope">
                  <span v-if="scope.row.recipeCode">{{scope.row.recipeCode}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="expandTable" width="200" label="开方时间">
                <template slot-scope="scope">
                  <span v-if="scope.row.createTime">{{scope.row.createTime | formatDateByExp}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 住院 -->
            <el-table
              ref="opdTable"
              class="opdTable no-border"
              v-if="visitType == 3"
              v-loading.body="fullscreenLoading"
              :data.sync="patientData"
              style="width: 100%;margin-top: 0;margin-bottom: 0;"
              :height="'calc(100vh - 275px)'"
              highlight-current-row
              @row-click="handleDetails"
            >
              <el-table-column show-overflow-tooltip width="90" class-name="pointer" label="在院状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.hosStatus">{{scope.row.hosStatus | formateValueToFnt({list: HOSPITALI_TYPE})}}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                class-name="pointer"
                style="position:relative"
                width="90"
                label="患者"
              >
                <template slot-scope="scope">
                  <i v-if="scope.row.status === 2" class="iconfont icon-buheli"></i>
                  <span v-if="scope.row.patientName">{{scope.row.patientName}}</span>
                </template>
              </el-table-column>
              <el-table-column class-name="pointer" label="床号">
                <template slot-scope="scope">
                  <span v-if="scope.row.hospitalizedBedName">{{scope.row.hospitalizedBedName}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="expandTable" width="157" label="病区">
                <template slot-scope="scope">
                  <span v-if="scope.row.hospitalizedAreaName">{{scope.row.hospitalizedAreaName}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="expandTable" width="157" label="科室">
                <template slot-scope="scope">
                  <span v-if="scope.row.providerName">{{scope.row.providerName}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="expandTable" width="157" label="入院时间">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.hospitalizedTime"
                  >{{scope.row.hospitalizedTime | formatDateByExp}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <ever-pagination
              class="pagination"
              justify="center"
              layout="total, prev, pager, next, sizes"
              :pagesize="pagesize"
              :no-bg="true"
              :small="true"
              :pager-count="5"
              :total-count="totalCount"
              :current="current"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange">
            </ever-pagination>
          </div>
        </div>
        <div class="pr-r-w427">
          <div class="clinic-container" v-if="tableData.length">
            <!-- 患者信息 -->
            <div class="pos_re" v-if="currentVisitPatientId">
              <patient-header
                :patientId="currentVisitPatientId"
                :visitNumber="currentVisitNumber"
                :code="'016'"
              ></patient-header>
            </div>
            <!-- 处方单 -->
            <div
              class="clinic-table"
              :class="[medicineStatus < 7 || medicineStatus == 1000 ? 'pad' : 'pad1']"
              v-if="tableData.length"
            >
              <div class="clinic_content">
                <i v-if="commentStatus === 1" class="iconfont icon-heli"></i>
                <i v-if="commentStatus === 2" class="iconfont icon-buheli"></i>
                <div
                  class="table-content"
                  :class="CHINESE_MEDICINE_TYPE.includes(tableData[0].adviceType) ? 'table-tcm-content' : ''"
                >
                  <!-- 标题 -->
                  <el-row type="flex" align="middle" justify="start" class="table_title mb10">
                    <el-col :span="24">
                      <span v-if="visitType === 1">处方单号：{{tableData[0].recipeCode}}</span>
                      <span v-if="visitType === 3">医嘱项</span>
                      <span
                        class="ml20"
                        v-if="tableData[0].adviceExecuteId"
                      >执行单号： {{tableData[0].adviceExecuteId}}</span>
                      <span
                        class="ml20"
                        v-if="visitType === 1 && tableData[0].createTime"
                      >开方时间：{{tableData[0].createTimeAll | formatDateByExp}}</span>
                      <span class="ml5">科室：{{tableData[0].providerName}}</span>
                      <span class="ml5">医生：{{tableData[0].doctorName}}</span>
                      <el-button
                        v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_treatmentrecord')"
                        style="margin-left: 10px !important;"
                        type="text"
                        @click="taskGoSendCrm(tableData[0])"
                      >诊疗记录</el-button>
                      <el-button
                        v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')"
                        style="margin-left: 10px !important;"
                        type="text"
                        @click="reportOpen(tableData[0])"
                      >检查检验报告</el-button>
                    </el-col>
                  </el-row>
                  <!-- 表格 -->
                  <comment-tcm-template
                    v-if="CHINESE_MEDICINE_TYPE.includes(tableData[0].adviceType)"
                    :templateData="tableData"
                  ></comment-tcm-template>
                  <comment-wm-template
                    v-else
                    :tableData="tableData"
                    :tableCellClassName="tableCellClassName"
                    :showTips="dataSource == 1 && tableData[0].status > 3 && tableData[0].status < 7"
                    :curStatus="currentStatus"
                    :curInvalid="isInvalid"
                    curTypes="outpatient"
                    :curAdviceType="tableData[0].adviceType"
                  ></comment-wm-template>
                </div>
                <!-- 处方点评 -->
                <submit-comment :submitData="submitData" @submitComment="submitComment"></submit-comment>
              </div>
            </div>
          </div>
          <everNoData v-else class="no-data" :tipTxt="tipTxt"></everNoData>
        </div>
      </div>
      <!-- 异常标记 -->
      <!-- 操作记录 -->
      <control-record-dialog :recordData="controlData" :visible.sync="controlDialogVisible"></control-record-dialog>
      <!-- 检查检验报告 -->
      <report-dialog ref="reportDialog" v-if="reportKey" :reportKey.sync="reportKey"></report-dialog>
    </div>
  </div>
</template>

<script>
import api from '../util/outpatientcommentapi'
import { DISPENSING_STATUS, debounce, HOSPITALI_TYPE, SEARCH_CODE, patch, SPU_SPEC_CODE, DOSAGE, CHINESE_MEDICINE_TYPE, PATIENT_HEAD, CONSUMABLES_TYPE } from '@/util/common'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import commentWmTemplate from '../components/comment.wmtemplate'
import commentTcmTemplate from '../components/comment.tcmtemplate'
import exceptionDialog from '@/warehouse/page/storages/components/exceptiondialog'
import controlRecordDialog from '@/warehouse/page/storages/components/controlrecorddialog'
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import mixinsDespen from '../../storages/dispensinghospital/mixins_despen.js'
import patientHeader from '@/inpatient/components/common.head.js'
import reportDialog from '@/infusion/components/report.card.vue'
import submitComment from '../components/submitcomment.vue'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import selectInquireList from '@/warehouse/util/selectinquirelist'
// import packageapi from '@/crm/store/packageapi.js'
import residentapi from '@/inpatient/store/resident.js'
import staffapi from '@/warehouse/store/staffapi.js'
import { passport } from '@/card/store/passportapi'
import list from '@/util/list'
let outpatientQuerySchema = [
  {
    name: 'date',
    comp: 'ever-range-picker',
    label: '日期',
    props: {
      noclear: true
    }
  },
  {
    name: 'recipeId',
    type: 'text',
    label: '处方单号',
    props: {
      placeholder: '处方单号'
    }
  },
  {
    name: 'doctorId',
    label: '选择医生',
    comp: 'custom'
  },
  {
    name: 'patientId',
    label: '选择患者',
    comp: 'ever-patient-select',
    props: {
      placeholder: '患者姓名'
    }
  },
  {
    name: 'providerId',
    label: '选择科室',
    comp: 'ever-subject-select',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  }
]

let hospitalizationQuerySchema = [
  {
    name: 'time',
    label: '日期',
    comp: 'ever-range-picker',
    props: {
      noclear: true
    }
  },
  {
    name: 'hosStatus',
    label: '在院状态',
    comp: 'el-select',
    props: {
      placeholder: '在院状态',
      filterable: true,
      options: HOSPITALI_TYPE
    }
  },
  {
    name: 'doctorId',
    label: '选择医生',
    comp: 'custom'
  },
  {
    name: 'hospitalizedAreaId',
    label: '选择病区',
    comp: 'custom'
  },
  {
    name: 'patientMsg',
    label: '患者',
    comp: 'custom'
  },
  {
    name: 'providerId',
    label: '选择科室',
    comp: 'ever-subject-select',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  }
]

export default {
  mixins: [getStorage, sendDrug, mixinsDespen, selectInquireList, list],
  data () {
    return {
      api,
      queryObj: {},
      querySchema: [],
      rules: {},
      checkDisable: [],
      medicineCheck: false,
      expandTable: false,
      all: false,
      dataSource: '',
      searchPatient: '',
      medicineStatus: 2,
      patientData: [],
      tableData: {},
      DOSAGE,
      DISPENSING_STATUS,
      SEARCH_CODE,
      SPU_SPEC_CODE,
      HOSPITALI_TYPE,
      currentStatus: 0,
      isInvalid: 0,
      notInvalid: true, // 没有超过3日的
      cacheOptions: [], // 缓存患者列表
      curDiseaseName: '',
      currentPatientId: '', // 当前选中的患者id
      currentVisitPatientId: '', // 当前选中患者patientId
      currentPatient: null, // 当前患者
      currentVisitNumber: '', // 当前门诊号
      checkedRecipeId: [], // 处方单选择
      dialogVisible: false, // 异常标记弹窗
      exceptionData: [], // 异常数据
      exceptionVal: [], // 异常弹窗回传数据
      controlDialogVisible: false, // 操作记录弹窗
      controlData: [], // 操作记录数据
      printBatchData: [], // 批量打印数据
      multipleSelection: [], // 批量打印数据
      skipBaiYao: false, // 是否跳过摆药
      fullscreenLoading: false,
      CHINESE_MEDICINE_TYPE,
      PATIENT_HEAD,
      thisRoutePath: '',
      submitData: {},
      visitType: 1,
      hasComment: 1,
      commentStatus: 1,
      patients: [],
      reportKey: false,
      recipeTypeList: ['301', '302', '303', '304', ...CONSUMABLES_TYPE],
      doctorList: [],
      AreaList: [],
      tipTxt: '暂无处方',
      btnDisn: false, // 点击btn是否可点击
    }
  },
  created () {
    if (this.$route.path.indexOf('outpatientreview') !== -1) {
      this.visitType = 1
      this.tipTxt = '暂无处方'
    } else {
      this.visitType = 3
      this.tipTxt = '暂无医嘱'
    }
    this.$route.params.status === '1' ? this.hasComment = 2 : this.hasComment = 1
    if (this.visitType === 1) {
      this.handleStatusData(outpatientQuerySchema, 'date')
    } else {
      this.handleStatusData(hospitalizationQuerySchema, 'time')
    }

    this.$nextTick(() => {
      this._initDate()
      this.list({})
    })
  },
  methods: {
    handlerQuery () { // 点击查询
      this.current = 1
      this.offset = 0
      this.list({})
    },
    handleStatusData (schema, date) {
      this.querySchema = schema
      this.queryObj = this.$ever.createObjFromSchema(schema)
      this.rules[date] = [{ required: true, message: ' ' }]
    },
    _initDate () {
      for (let val in this.queryObj) {
        this.queryObj[val] = ''
      }
      if (this.visitType === 1) {
        this.queryObj.date = [
          this.$moment().add('month', 0).format('YYYY-MM') + '-01',
          this.$moment().startOf('day').format('YYYY-MM-DD')
        ]
      } else {
        this.queryObj.time = [
          this.$moment().add('month', 0).format('YYYY-MM') + '-01',
          this.$moment().startOf('day').format('YYYY-MM-DD')
        ]
      }
    },
    resetForm () {
      this.$refs.form.$refs.form.resetFields()
      this._initDate()
      this.list({})
    },
    async queryAreaId (query) {
      query = { name: query }
      const list = await residentapi.getSpaceRecordVoListForService(query)
      if (!list.head.errCode && list.data[0]) {
        this.AreaList = list.data
      } else {
        this.AreaList = []
      }
    },
    async queryDoctorId (query) {
      if (!query) {
        this.doctorList = []
        return
      }
      const params = {
        nameList: [query],
        typeCodeList: ['DOCTOR'],
        offset: 0,
        pagesize: 20,
      }
      const list = await staffapi.list(params)
      if (!list.head.errCode && list.data) {
        this.doctorList = list.data.resultList
      } else {
        this.doctorList = []
      }
    },
    remoteMethod (query) {
      query = query && String(query).trim() || this.patientName
      return passport.get('patient/searchFuzzy', {
        params: {
          keyword: query
        }
      }).then(results => {
        if (results.data.resultList && results.data.resultList.length) {
          this.patients = results.data.resultList
        } else if (this.visitType === 3) {
          this.patients = [{
            name: query,
            id: query
          }]
        } else {
          this.patients = []
        }
        return this.patients
      })
    },
    submitComment (v) {
      // 直接将 v 合并到  this.submitData 会导致 recipeId 被覆盖为null
      let params = Object.assign(this.submitData, { status: v.status, content: v.content, classifyList: v.classifyList })
      if (params.id) params.commentType = 2
      api.createdAndUpdate(params).then(res => {
        if (res && !params.id) {
          this.tableData = []
          let index = this.patientData.findIndex(item => {
            return item.recipeId === params.recipeId
          })
          if (index > -1) this.patientData.splice(index, 1)
          this.currentVisitPatientId = ''
          this.$messageTips(this, 'success', '保存成功')
          this.$nextTick(_ => {
            this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
          })
        } else {
          this.commentStatus = params.status
          this.patientData.forEach(v => {
            if (v.id === this.currentPatientId) {
              v.status = params.status
              // this.initTableListData(v)
            }
          })
          this.$messageTips(this, 'success', '保存成功')
        }
      })
    },
    reportOpen (data) {
      this.reportKey = true
      this.$nextTick(_ => {
        this.$refs.reportDialog.openDialog(data)
      })
    },
    taskGoSendCrm (data) {
      window.open(this.$ever.crmIndex + '/crm/memberinfo/diagnosis/' + data.patientId, '_blank')
    },
    // 获取当前患者详情信息
    handleDetails: debounce(function (row, column, event) {
      this.all = false
      this.checkedRecipeId = []
      this.submitData.recipeId = row.recipeId || row.hospitalizedNumber
      this.submitData.visitNumber = row.visitNumber || ''
      if (row.id) {
        this.submitData.id = row.id
      } else {
        delete this.submitData.id
      }
      this.submitData.commentType = row.id ? 2 : 1
      this.dispenseList(row.recipeId || row.hospitalizedNumber)
      this.currentPatient = row
      this.currentPatientId = row.id
      this.currentVisitPatientId = row.patientId
      this.currentVisitNumber = row.visitNumber
      this.commentStatus = row.status
      if (this.medicineStatus === 2) row.addCount = 0
    }),
    // 获取患者列表
    list (params, type) {
      params = params || {}
      if ((this.visitType === 3 && !this.queryObj.time.length) || (this.visitType === 1 && !this.queryObj.date.length)) {
        return
      }
      this.fullscreenLoading = true
      this.tableData = {}
      params.visitType = this.visitType
      this.submitData.recipeType = params.visitType
      params.recipeTypeList = this.recipeTypeList
      this.$nextTick(() => {
        Object.assign(params, this.queryObj)
        this.$route.params.status === '1' ? params.hasComment = 2 : params.hasComment = 1
        let apiName = 'adviceList'
        if (this.visitType === 3) {
          apiName = 'hospitalizedList'
          // params.hosStauts = ''
        } else {

        }
        params.pagesize = this.pagesize
        params.offset = this.offset
        if (params.time) delete params.time
        api[apiName](params).then(res => {
          this.fullscreenLoading = false
          this.totalCount = res.totalCount || 0
          res.length && res.forEach(item => {
            item.addCount = 0
          })
          if (res.length) {
            let cacheOptions = JSON.parse(JSON.stringify(res))
            this.cacheOptions = cacheOptions
            this.patientData = res
            this.searchPatient = ''
            this.initTableListData(res[0])
            this.$nextTick(_ => {
              this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
            })
          } else {
            this.cacheOptions = []
            this.patientData = []
            this.currentVisitPatientId = ''
          }
        })
      })
    },
    initTableListData (data) {
      this.dispenseList(data.recipeId || data.hospitalizedNumber)
      this.currentPatient = data
      this.currentPatientId = data.id
      this.currentVisitPatientId = data.patientId
      this.currentVisitNumber = data.visitNumber
      this.submitData.recipeId = data.recipeId || data.hospitalizedNumber
      this.submitData.visitNumber = data.visitNumber || ''
      this.commentStatus = data.status
      if (data.id) {
        this.submitData.id = data.id
      } else {
        delete this.submitData.id
      }
      this.submitData.commentType = data.id ? 2 : 1
    },
    // 根据门诊号获取处方信息
    dispenseList (params) {
      // this.fullscreenLoading = true
      this.tableData = {}
      Object.assign(this.tableData, { patientObject: {} })
      let apiName = 'getByRecipeIdAndAdviceType'
      let tempParams
      if (this.visitType === 3) {
        apiName = 'getByHospitalizedNumberAndAdviceType'
        tempParams = JSON.parse(JSON.stringify({ hospitalizedNumber: params }))
      } else {
        tempParams = JSON.parse(JSON.stringify({ recipeId: params }))
      }
      api[apiName](tempParams).then(res => {
        if (res) {
          // this.fullscreenLoading = false
          this.tableData = res
          if (res.zhenDuan) {
            let diseaseName = JSON.parse(JSON.parse(res.zhenDuan).ZD_MEN_ZHEN_ZHEN_DUAN)
            if (diseaseName && diseaseName[0]) this.curDiseaseName = diseaseName[0].diseaseName
          }

          res.outpatientDispenseInfo && res.outpatientDispenseInfo.forEach(item => {
            this.checkDisable.push(false)
            this.checkedRecipeId.push(item)
          })
          // 默认全选所有
          this.all = true
          // this.setMultipleSelectionData()
          // this.tableData && this.tableData.outpatientDispenseInfo && this.handlePatientInfo(this.tableData)
        }
      })
    },
    // 发药异常标记 - 添加class
    tableCellClassName ({ row }) {
      return row.identification ? 'danger-row' : ''
    },
    ...patch
  },
  watch: {
    'queryObj': {
      deep: true,
      handler (v) {
        if (this.visitType === 1) {
          this.queryObj.startDate = this.queryObj.date[0] + ' 00:00:00'
          this.queryObj.endDate = this.queryObj.date[1] + ' 00:00:00'
        } else {
          this.queryObj.startTime = this.queryObj.time[0] + ' 00:00:00'
          this.queryObj.endTime = this.queryObj.time[1] + ' 00:00:00'
        }
      }
    },
    'queryObj.doctorId': {
      handler (v) {
        this.list()
      },
      deep: true
    },
    '$route' (v) {
      // 重置分页参数
      this.current = 1
      this.offset = 0
      this.pagesize = 20
      this.$route.path.indexOf('outpatientreview') !== -1 ? this.visitType = 1 : this.visitType = 3
      this.expandTable = false
      if (this.visitType === 1) {
        this.handleStatusData(outpatientQuerySchema, 'date')
      } else {
        this.handleStatusData(hospitalizationQuerySchema, 'time')
      }
      this.$nextTick(() => {
        this._initDate()
        this.list({})
      })
      this.medicineStatus = 2
      this.searchPatient = ''
    }
  },
  components: {
    // patientInfo,
    patientHeader,
    commentWmTemplate,
    commentTcmTemplate,
    exceptionDialog,
    controlRecordDialog,
    dispenSearch,
    reportDialog,
    submitComment,
    historyBtn
  }
}
</script>

<style lang="less" scoped>
.pagination /deep/ .el-pagination .el-input__inner {
  height: 20px;
}
.el-table_2_column_8 .cell span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-table.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #fff;
}
.ever-tab .settle_inner .settlemenu {
  // border-radius: 0 !important;
  border-right: none;
  // background: #eee;
  li {
    // background: #eee;
    height: 40px;
    line-height: 40px;
  }
}
// .pr-l {
//   width: 400px;
// }
.pr-r-w427 {
  bottom: 0;
}
.pr-l-w {
  z-index: 999;
}
.pr-l-w2 {
  z-index: 999;
}
.medicine-check {
  line-height: 36px;
  height: 36px;
}
.no-data {
  margin-top: 200px;
}
.layout_box.el-main {
  position: relative;
}
.clinic_content {
  height: e('calc(100vh - 350px)');
  overflow-x: hidden;
  .icon-buheli,
  .icon-heli {
    font-size: 64px;
    position: absolute;
    right: 0;
    color: #ee4433;
    top: 0px;
    z-index: 999;
  }
  .icon-heli {
    color: #5cbc2c;
  }
}
.pad1 {
  .clinic_content {
    height: e('calc(100vh - 300px)');
    overflow-x: hidden;
    position: relative;
  }
}
.pad {
  position: relative;
  .clinic_content {
    position: relative;
  }
  .btn_footer {
    background: #fff;
    border-top: 1px solid #ccc;
    width: 100%;
    height: 60px;
    z-index: 9;
    margin-left: -15px;
    position: absolute;
    bottom: -50px;
    line-height: 60px;
    .el-row {
      padding: 0 20px;
      .el-checkbox {
        margin-right: 20px;
      }
    }
  }
}
#clinicprescription {
  .hospital-container {
    padding: 10px;
    background: #fff;
    border-radius: 0 0 3px 3px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /deep/ .el-form-item__error {
      display: none !important;
    }
  }
}
.prescription-layout .pr-l .patient-table /deep/ i.icon-buheli {
  color: #ee4433;
  font-size: 36px !important;
  position: absolute;
  left: -28px;
}
.opdTable {
  .cell {
    padding: 0 5px;
  }
}
</style>
