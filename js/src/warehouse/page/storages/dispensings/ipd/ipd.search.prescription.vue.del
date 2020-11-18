<template>
  <div id="ipd">
    <!-- 搜索条件 -->
    <div class="hospital-container">
      <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" @query="visitList" :is-query="true">
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
      <div class="inner high pos_re" :class="[expandTable ? 'pr-l pr-l-w2' : 'pr-l']">
        <el-button class="pos_ab" type="text" :class="[expandTable ? 'i-zhankai' : '']" @click="expandTable = !expandTable">
          <i class="iconfont icon-zhankai"></i>
        </el-button>
        <el-table
          v-loading="leftLoading"
          class="no-border"
          ref="ipdTable"
          :data="leftTableData"
          highlight-current-row
          :height="'calc(100vh - 200px)'"
          @row-click="handleDetails"
          style="width: 100%; margin-top: 0px">
          <el-table-column
            width="180"
            class-name="pointer"
            label="药包号">
            <template slot-scope="scope">
              {{scope.row.code}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="patientName"
            label="姓名"
            width="132">
          </el-table-column>
          <el-table-column
            v-if="expandTable"
            align="left"
            prop="implementTime"
            label="预执行时间"
            width="160">
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
        <div class="pos_re mb15 padding10" v-if="rightTableDataObject.patientId">
          <patient-header :patientId="rightTableDataObject.patientId" :visitNumber="rightTableDataObject.hospitalizedNumber" :code="PATIENT_HEAD"></patient-header>
        </div>
        <div class="list-msg">
          <div class="list_box">
            <div class="list" v-if="rightTableDataObject.id">
              <div>
                <ipd-righttable
                  :itemData="rightTableDataObject"
                  :isSee="1"
                  :outTest="skinFlag && outTest"
                  :testResult="skinFlag ? testResult : []"
                  @supplementPrint="supplementPrint"
                  @updateStatus="updateStatus">
                </ipd-righttable>
              </div>
            </div>
            <everNoData v-if="!rightTableDataObject.id"></everNoData>
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
import IpdRighttable from '../components/ipd.righttable'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import { patch, TERM_TYPE, PATIENT_HEAD } from '@/util/common'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import skinTestMixins from '../mixins/skinTest.mixins'
import mixinsDespen from './mixins_despen'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixinsnew'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
let outpatientQuerySchema = [
  {
    name: 'code',
    label: '药包号',
    props: {
      clearable: true
    },
    style: 'width: 200px;'
  },
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'everRemoteMethod',
    props: {
      placeholder: REMOTE_METHODS_PLACEHOLDER,
      showKeys: true,
      api: getMaterialInfoApi,
      apiName: 'listlocal',
      isCodeBlood: true,
      clearOptions: true
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'patientId',
    comp: 'ever-patient-select',
    label: '患者',
    props: {
      placeholder: '患者姓名'
    }
  },
  {
    name: 'termType',
    label: '医嘱类型',
    comp: 'el-select',
    props: {
      options: TERM_TYPE,
      filterable: true
    }
  },
  {
    name: 'ipdDate',
    label: '预执行时间',
    comp: 'ever-range-picker'
  }
]
export default {
  mixins: [selectInquireList, getStorage, skinTestMixins, mixinsDespen, sendDrug, hospitalPrintMixins, dispenseSettingMixin],
  data () {
    return {
      PATIENT_HEAD,
      queryObj: {},
      rightTableDataObject: {},
      inpatientArea: {},
      querySchema: [],
      leftTableData: [],
      leftLoading: false,
      expandTable: false,
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      skinFlag: false,
      id: ''
    }
  },
  created () {
    this.queryObj = this.$ever.createObjFromSchema(outpatientQuerySchema)
    this.querySchema = outpatientQuerySchema
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
    pageClick (v) {
      if (v === 'prev') {
        this.offset = this.offset - this.pagesize
        this.visitList(this.offset)
      } else {
        this.offset = this.offset + this.pagesize
        this.visitList(this.offset)
      }
    },
    handleDetails (data) {
      let params = { id: data ? data.id : this.id }
      if (data) {
        this.id = data.id
      }
      api.getUddDispenseInfo(params).then(res => {
        if (res.id) {
          this.rightTableDataObject = res
          // 请求皮试结果
          let currentHospitalizedNumber = res.hospitalizedNumber
          this.getUddSkinTest(currentHospitalizedNumber)
          // 查看是否含有皮试属性的物资
          this.haveTestMaterial(this.rightTableDataObject)
        }
      })
    },
    haveTestMaterial (data) {
      this.skinFlag = data.uddDispenseItemList.some(i => this.isSkinTestMaterial(i))
    },
    dataAddChe (arr, start, end) {
      this.queryObj[start] = arr.length ? (arr[0] + ' 00:00:00') : ''
      this.queryObj[end] = arr.length ? (arr[1] + ' 00:00:00') : ''
    },
    visitList (offset) {
      let params
      this.queryObj.storageRoomId = this.storageId
      this.dataAddChe(this.queryObj.ipdDate, 'implementStartTime', 'implementEndTime')
      if (offset && typeof offset !== 'object') {
        params = Object.assign({}, this.queryObj, { offset: offset, pagesize: this.pagesize })
      } else {
        this.offset = 0
        params = Object.assign({}, this.queryObj, { offset: this.offset, pagesize: this.pagesize })
      }
      this.leftLoading = true
      api.getAllUddDispenseList(params).then(res => {
        if (res && res.list && res.list.length) {
          this.leftTableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            this.$refs.ipdTable && this.$refs.ipdTable.$el.querySelectorAll('.el-table__row')[0].click()
          })
          this.inpatientArea = this.leftTableData[0]
        } else {
          this.leftTableData = []
          this.totalCount = 0
          this.rightTableDataObject = {}
          this.inpatientArea = {}
        }
        this.leftLoading = false
      })
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
