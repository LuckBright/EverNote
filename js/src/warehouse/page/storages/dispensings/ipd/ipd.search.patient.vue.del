<template>
  <div id="ipd">
    <!-- 搜索条件 -->
    <div class="hospital-container">
      <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" @query="visitList" :is-query="true">
        <template slot="doctorId">
          <el-select
          v-model="queryObj.doctorId"
          filterable
          clearable
          remote
          :default-first-option="true"
          :placeholder="'医生姓名'"
          :remote-method="queryDoctorId"
          @change="visitList({})"
          >
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.name"
              :value="item.id || item.name">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="visitList">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <!-- 患者信息 -->
    <el-container class="hospital-layout">
      <div class="inner high pos_re" :class="[expandTable ? 'pr-l pr-l-w' : 'pr-l']">
        <el-button class="pos_ab" type="text" :class="[expandTable ? 'i-zhankai' : '']" @click="expandTable = !expandTable">
          <i class="iconfont icon-zhankai"></i>
        </el-button>
        <el-table
          v-loading="leftLoading"
          ref="ipdTable"
          class="no-border"
          :data="leftTableData"
          highlight-current-row
          :height="'calc(100vh - 200px)'"
          @row-click="handleDetails"
          style="width: 100%; margin-top: 0px">
          <el-table-column
            width="120"
            class-name="pointer"
            label="姓名">
            <template slot-scope="scope">
              {{scope.row.patientName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="bedNum"
            label="床号"
            width="60">
          </el-table-column>
          <el-table-column
            align="center"
            label="病区"
            width="132">
            <template slot-scope="scope">
              {{scope.row.patientHospitalizedObject ? scope.row.patientHospitalizedObject.hospitalizedAreaName : ''}}
            </template>
          </el-table-column>
          <el-table-column
            v-if="expandTable"
            align="left"
            label="入院时间"
            width="160">
            <template slot-scope="scope">
              {{scope.row.patientHospitalizedObject ? scope.row.patientHospitalizedObject.hospitalizedTime : ''}}
            </template>
          </el-table-column>
          <el-table-column
            v-if="expandTable"
            align="left"
            label="出院时间"
            width="160">
            <template slot-scope="scope">
              {{scope.row.patientHospitalizedObject ? scope.row.patientHospitalizedObject.hospitalizedOutTime : ''}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          small
          class="alg_c prescription_pagination"
          :page-size="20"
          layout="prev, next"
          prev-text="上一页"
          next-text="下一页"
          @prev-click="pageClick('prev')"
          @next-click="pageClick('next')"
          :total="totalCount">
        </el-pagination>
      </div>
      <div class="inner ml10 backnone pr-r">
        <div class="pos_re mb15 padding10" v-if="rightTableData.length">
          <patient-header :patientId="rightTableData[0].patientId" :visitNumber="rightTableData[0].hospitalizedNumber" :code="PATIENT_HEAD"></patient-header>
        </div>
        <div class="list-msg">
          <div class="list_box">
            <div v-if="rightTableData.length" class="list">
              <div v-for="(item, index) in rightTableData" :key="index">
                <ipd-righttable
                  :itemData="item"
                  :isSee="1"
                  :outTest="!item.outTest"
                  :testResult="item.testResult"
                  @supplementPrint="supplementPrint"
                  @updateStatus="updateStatus">
                </ipd-righttable>
              </div>
            </div>
            <everNoData v-if="!rightTableData.length"></everNoData>
          </div>
        </div>
      </div>
    </el-container>
    <jcp-print :key="jcpKey" ref="jcpPrint"
      :hospitalType="hospitalType"
      :liveTableData="liveTableData"
      :liveNonFatherAdvice="liveNonFatherAdvice"
      :printPatientObj="printPatientObj"
      :liveType="liveType"
      :inpatientArea="inpatientArea"
      :fatherAdvice="fatherAdvice"></jcp-print>
  </div>
</template>

<script>
import api from '../store/dispenseapi'
import patientHeader from '@/inpatient/components/common.head.js'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import IpdRighttable from '../components/ipd.righttable'
import packageapi from '@/crm/store/packageapi.js'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import hospitalApi from '../store/hospitalapi'
import skinTestMixins from '../mixins/skinTest.mixins'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import { patch, PATIENT_HEAD } from '@/util/common'
import mixinsDespen from './mixins_despen'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixinsnew'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
let outpatientQuerySchema = [
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    label: '患者',
    style: 'width: 120px',
    props: {
      placeholder: '患者姓名'
    }
  },
  {
    name: 'doctorId',
    label: '医生',
    comp: 'custom',
    placeholder: '医生姓名'
  },
  {
    name: 'spaceId',
    label: '病区',
    comp: 'el-select',
    props: {
      placeholder: '病区',
      options: [],
      filterable: true
    }
  },
  {
    name: 'ipdDate',
    label: '预执行时间',
    comp: 'ever-range-picker'
  },
  {
    name: 'startDates',
    label: '入院日期',
    comp: 'ever-range-picker'
  },
  {
    name: 'endDates',
    label: '出院日期',
    comp: 'ever-range-picker'
  }
]
export default {
  mixins: [selectInquireList, getStorage, mixinsDespen, skinTestMixins, sendDrug, hospitalPrintMixins, dispenseSettingMixin],
  data () {
    return {
      PATIENT_HEAD,
      queryObj: {},
      inpatientArea: {},
      querySchema: [],
      doctorList: [],
      leftTableData: [],
      rightTableData: [],
      leftLoading: false,
      expandTable: false,
      offset: 0,
      pagesize: 20,
      totalCount: 0
    }
  },
  created () {
    this.queryObj = this.$ever.createObjFromSchema(outpatientQuerySchema)
    this.querySchema = outpatientQuerySchema
    // 病室
    this._areaSelect().then(res => {
      if (res && res.length) {
        this.$ever.getFieldFromSchema(this.querySchema, 'spaceId').props.options = res
      }
    })
    this.visitList()
  },
  methods: {
    ...patch,
    supplementPrint (v) {
      let obj = Object.assign({}, v)
      delete obj.identification
      this.gatherPrintSingle(obj)
    },
    updateStatus (v) {
      this.handleDetails()
    },
    handleDetails (data) {
      let params = Object.assign({}, this.queryObj)
      if (data) {
        this.hospitalizedNumber = data.hospitalizedNumber
        params = Object.assign(params, { hospitalizedNumber: data.hospitalizedNumber })
      } else {
        params = Object.assign(params, { hospitalizedNumber: this.hospitalizedNumber })
      }
      delete params.startTime
      delete params.endTime
      delete params.startOutTime
      delete params.endOutTime
      delete params.offset
      delete params.pagesize
      api.getUddDispenseByPatientList(params).then(res => {
        if (res.length) {
          this.rightTableData = res
          this.handleSkinTest(this.rightTableData)
        } else {
          this.rightTableData = []
        }
      })
    },
    // 处理皮试结果数据 - 以患者为纬度处理，不可使用混入的方式（因为混入的是以药包为纬度）
    async handleSkinTest (data) {
      const skinTest = await hospitalApi.getUddSkinTest({ hospitalizedNumber: data[0].hospitalizedNumber })
      data.forEach(item => {
        const skinFlag = item.uddDispenseItemList.some(i => this.isSkinTestMaterial(i))
        if (skinFlag && skinTest.length) {
          this.$set(item, 'outTest', false)
          this.$set(item, 'testResult', skinTest)
        } else {
          this.$set(item, 'outTest', true)
          this.$set(item, 'testResult', [])
        }
      })
    },
    dataAddChe (arr, start, end) {
      this.queryObj[start] = arr.length ? (arr[0] + ' 00:00:00') : ''
      this.queryObj[end] = arr.length ? (arr[1] + ' 00:00:00') : ''
    },
    visitList (offset) {
      let params
      this.queryObj.storageRoomId = this.storageId
      this.dataAddChe(this.queryObj.ipdDate, 'searchTime', 'searchNextTime')
      this.dataAddChe(this.queryObj.startDates, 'startTime', 'endTime')
      this.dataAddChe(this.queryObj.endDates, 'startOutTime', 'endOutTime')
      if (offset && typeof offset !== 'object') {
        params = Object.assign({}, this.queryObj, { offset: offset, pagesize: this.pagesize })
      } else {
        this.offset = 0
        params = Object.assign({}, this.queryObj, { offset: this.offset, pagesize: this.pagesize })
      }
      this.leftLoading = true
      api.getUddDispenseByPatient(params).then(res => {
        if (res && res.list && res.list.length) {
          this.leftTableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            this.$refs.ipdTable && this.$refs.ipdTable.$el.querySelectorAll('.el-table__row')[0].click()
          })
          this.inpatientArea = this.leftTableData[0]
        } else {
          this.leftTableData = []
          this.rightTableData = []
          this.inpatientArea = {}
        }
        this.leftLoading = false
      })
    },
    pageClick (v) {
      if (v === 'prev') {
        this.offset = this.offset - this.pagesize
        this.visitList(this.offset)
      } else {
        this.offset = this.offset + this.pagesize
        this.visitList(this.offset)
      }
    },
    _initDate () {
      for (let val in this.queryObj) {
        this.queryObj[val] = ''
      }
      this.offset = 0
    },
    resetForm () {
      this.$refs.form.$refs.form.resetFields()
      this._initDate()
      this.visitList()
    },
    async queryDoctorId (query) {
      const params = {
        name: query,
        staffType: 39
      }
      const list = await packageapi.getStaffList(params)
      if (!list.head.errCode && list.data[0]) {
        this.doctorList = list.data
      } else {
        this.doctorList = []
      }
    }
  },
  components: {
    IpdRighttable,
    patientHeader,
    JcpPrint
  }
}
</script>

<style scoped lang="scss">
.hospital-layout .backnone{
  background: none;
  padding:0!important;
  .list-msg{
    background: #fff;
    padding: 10px;
    .list_box{
      height: calc(100vh - 263px);
    }
  }
}
</style>
