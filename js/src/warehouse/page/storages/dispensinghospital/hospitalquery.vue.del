<template>
  <div class="hospital-container" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 搜索框 -->
    <div class="hospital-search">
      <div>
        <dispen-search
          ref="inputSeach"
          placeholder="药包编号/患者姓名"
          @searchQuery="handleSearch"
          @seachAfterInquiry="handleAfterInquiry"
          :isAfterInquiry="isAfterInquiry"
        ></dispen-search>
      </div>
    </div>
    <!-- 患者信息 -->
    <el-container class="hospital-layout">
      <el-aside width="280px" class="inner high">
        <div class="date_picker_box">
          <el-row :gutter="20">
            <el-col :span="12">
              <ever-select v-model="status" :clearable="true" :options="drugPackStatus"></ever-select>
            </el-col>
            <el-col :span="12">
              <ever-select v-model="termType" :clearable="true" :options="TERM_TYPE"></ever-select>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col justify="center" align="middle">
              <div class="f14 pt10">共 {{totalCount}} 条记录</div>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="leftLoading"
          ref="singleTable"
          :data="leftTableData"
          highlight-current-row
          :height="'calc(100vh - 252px)'"
          @current-change="handleCurrentChange"
          :row-class-name="patientTableRowClassName"
          style="width: 100%"
        >
          <el-table-column width="170" class-name="pointer" label="病区">
            <template slot-scope="scope">
              <span
                v-if="scope.row.spaceRecordObject"
              >{{findBasesourceCode({arr: scope.row.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</span>
            </template>
          </el-table-column>
          <el-table-column property="b" label="姓名">
            <template slot-scope="scope">
              <!-- <sys-value :initoptions="TERM_TYPE" :code="`${scope.row.termType + ''}`"></sys-value> -->
              <span v-if="scope.row.patientObject">{{scope.row.patientObject.name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main class="inner ml10">
        <div class="list-msg">
          <div class="list_box">
            <u-d-d-single
              :obj="obj"
              @showLogs="showLogs"
              @handelMakeUpdebounce="handelMakeUpdebounce"
              class="list"
              :loading.sync="loading"
            ></u-d-d-single>
          </div>
        </div>
        <div class="alg_c">
          <p v-if="obj.status == 2 && !obj.identification">
            <el-button type="primary" @click="handleBatchPrint(true)">打印药包</el-button>
            <el-button type="primary" @click="handleUnusual(true)">异常</el-button>
          </p>
          <p v-else-if="obj.status == 4 && !obj.identification">
            <el-button type="primary" @click="handleFinish(true, 2)">备药完成</el-button>
            <el-button type="primary" @click="handlePrintDrugPack(obj)">补打药包</el-button>
            <el-button type="primary" @click="handleUnusual(true)">异常</el-button>
          </p>
          <p v-else-if="obj.status == 5 && !obj.identification">
            <el-button type="primary" @click="handleBatchDrug(true, 1)">发药</el-button>
            <el-button type="primary" @click="handlePrintDrugPack(obj)">补打药包</el-button>
            <el-button type="primary" @click="handleUnusual(true)">异常</el-button>
          </p>
          <p v-else-if="obj.status > 5">
            <el-button type="primary" @click="handlePrintDrugPack(obj)">补打药包</el-button>
          </p>
          <p v-else-if="obj.identification">
            <el-button type="primary" @click="cancelUnusual">撤销异常</el-button>
          </p>
        </div>
      </el-main>
    </el-container>
    <!-- 异常弹出框 -->
    <exception-dialog
      :exceptionData="unusualTableData"
      :visible.sync="dialogTableVisible"
      @confirm="saveUnusual"
    ></exception-dialog>
    <record-dialog :value.sync="dialogRecord" :tableData="recordTableData"></record-dialog>
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
import { TERM_TYPE, DISPENSING_STATUS, objGet, patch, SEARCH_CODE, SPU_SPEC_CODE, SPACE_CODE, DOSAGE, debounce } from '@/util/common'
import api from '../store/hospitalapi.js'
import setName from '@/util/setstatusname'
import storage from '@/util/storage'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import recordDialog from './record.dialog'
import exceptionDialog from '../components/exceptiondialog'
import dispenseApi from '../store/dispenseapi.js'
import mixinsDespen from './mixins_despen'
import medicinePrint from '@/warehouse/page/storages/util/medicineprint'
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import UDDSingle from '@/warehouse/page/storages/components/uddsingle'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixins'
import getstorage from '@/warehouse/page/storages/util/getstorage'
export default {
  mixins: [sendDrug, setName, mixinsDespen, medicinePrint, hospitalPrintMixins, getstorage],
  data () {
    return {
      loading: false,
      DOSAGE,
      fullscreenLoading: false,
      leftLoading: false,
      dialogRecord: false,
      dialogTableVisible: false,
      SPACE_CODE,
      SPU_SPEC_CODE,
      SEARCH_CODE,
      TERM_TYPE,
      unusualTableData: [],
      recordTableData: [],
      DISPENSING_STATUS,
      checked: '',
      searchObj: '',
      isAfterInquiry: false,
      status: '',
      termType: '',
      leftTableData: [],
      totalCount: 0,
      obj: {},
      hospitalQuery: 3, // handleSearch 使用
      currentId: '',
    }
  },
  created () {
    if (storage.getLocalStorage('HOSPITAL_QUERY')) {
      this.searchObj = JSON.parse(storage.getLocalStorage('HOSPITAL_QUERY'))
      this.getUddList(this.searchObj)
    } else {
      this.getUddList()
    }
    this._getCursor()
  },
  computed: {
    drugPackStatus () {
      let list = this.DISPENSING_STATUS.filter(item => {
        return item.id !== 9 && item.id !== 10
      })
      return list
    }
  },
  components: {
    recordDialog,
    exceptionDialog,
    dispenSearch,
    JcpPrint,
    UDDSingle
  },
  watch: {
    'this.$store.state.dispensing.storageConfig': {
      handler: function (v) {
        console.log(v, 1)
      },
      deep: true
    },
    status () {
      this.getUddList(this.searchObj)
    },
    termType () {
      this.getUddList(this.searchObj)
    }
  },
  methods: {
    ...patch,
    // 医嘱类型change事件
    termChange (val) {
      this.getUddList(this.searchObj)
    },
    // 打印药签
    handelMakeUpdebounce: debounce(function ({ data, types, curMine, isSingle, curAdviceType }) {
      this.handleReprint({ data, types, curMine, isSingle, curAdviceType })
    }),
    // 补打药包标签
    handlePrintDrugPack: debounce(function (data) {
      this.gatherPrintSingle(data)
      // this.handleReprint({ types: 'hospitalization', isSingle: true, curMine: true, data })
    }),
    // 批量打印/打印
    handleBatchPrint (flag, num) {
      this.fullscreenLoading = true
      const params = [{
        id: this.obj.id,
        status: this.obj.status,
        code: this.obj.code,
        identification: this.obj.identification,
        storageRoomId: this.obj.storageRoomId,
        spaceId: this.obj.spaceId
      }]
      dispenseApi.createUddPrint(params).then(res => {
        // 更改药包状态为待摆药
        if (res && res.information) {
          this.getUddInfo(this.obj.id)
          this.jcpKey = this.jcpCount++
          this._initPrint()
          this.inpatientArea = this.obj
          res.information.uddDispenseList.forEach(item => {
            item = Object.assign(item, this.inpatientArea)
            this.resetGatherPrintData(item)
          })
          this.liveTableData = {
            tableData: res.information.uddDispenseList,
            barCode: res.information.codes
          }
          this.$nextTick(_ => {
            this.handlerPrint()
            this.$messageTips(this, 'success', '打印成功')
          })
          // let types = 'hospitalization'
          // let arr = res.information.uddDispenseList
          // let data = { codes: res.information.codes }
          // if (res.information.codes) {
          //   this.handleReprint({ types, data, arr })
          // } else {
          //   this.handleReprint({ arr, types })
          // }
        }
        this.fullscreenLoading = false
      })
    },
    // 备药完成
    handleFinish () {
      this.fullscreenLoading = true
      const params = [{
        id: this.obj.id,
        status: this.obj.status,
        code: this.obj.code,
        identification: this.obj.identification,
        storageRoomId: this.obj.storageRoomId
      }]
      api.updateUddList(params).then(res => {
        // 更改药包状态为待发药
        if (res.flag) {
          this.$messageTips(this, 'success', '备药完成')
          this.getUddInfo(this.obj.id)
        }
        this.fullscreenLoading = false
      })
    },
    // 发药
    handleBatchDrug () {
      this.fullscreenLoading = true
      const params = [{
        id: this.obj.id,
        status: this.obj.status,
        code: this.obj.code,
        identification: this.obj.identification,
        storageRoomId: this.obj.storageRoomId
      }]
      api.updateEndUddList(params).then(res => {
        // 更改药包状态为发药完成 num = 1 住院发药页面 num = 2 摆药单页面
        if (res.flag) {
          this.$messageTips(this, 'success', '发药完成')
          this.getUddInfo(this.obj.id)
        }
        this.fullscreenLoading = false
      })
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
    // 取消异常
    async cancelUnusual () {
      this.fullscreenLoading = true
      const result = await api.updateUddDispense({
        id: this.obj.id
      }).then(res => res)
      if (result.flag) {
        this.$messageTips(this, 'success', '取消异常成功')
        this.getUddList(this.searchObj)
        this.fullscreenLoading = false
      }
    },
    // 处理异常
    handleUnusual () {
      this.fullscreenLoading = true
      let ids = []
      ids.push(this.obj.id)
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
      if (result) this.getUddList(this.searchObj)
      this.dialogTableVisible = false
    },
    handleAfterInquiry () {
      this.isAfterInquiry = false
    },
    // 查询
    handleSearch (data) {
      this.searchObj = data
      this.getUddList(data)
    },
    async getUddList (data) {
      const params = {
        status: this.status,
        termType: this.termType,
        storageRoomId: this.storageId
      }
      if (data) {
        data.searchSelect ? Object.assign(params, { patientId: data.searchSelect, startDate: data.startDate, endDate: data.endDate }) : Object.assign(params, { searchName: data.searchValue, startDate: data.startDate, endDate: data.endDate })
      }
      storage.removeLocalStorage('HOSPITAL_QUERY')
      this._getCursor()
      this.leftLoading = true
      const result = await api.getUddList(params).then(res => res)
      this.leftLoading = false
      if (objGet(result, 'list', '')) {
        this.leftTableData = result.list
        this.totalCount = result.totalCount
        const id = this.leftTableData[0].id
        id && this.getUddInfo(id)
        this.currentId = id
      } else {
        this.leftTableData = []
        this.obj = {}
        this.totalCount = 0
      }
    },
    getUddInfo (id) {
      this.loading = true
      api.getUddDispenseInfo(id).then(res => {
        if (objGet(res, 'id', '')) this.obj = res
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      if (val) {
        objGet(val, 'id', '') && this.getUddInfo(val.id)
        this.currentId = val.id
      }
    },
    // 当前病区 - 添加class
    patientTableRowClassName ({ row }) {
      return row.id === this.currentId ? 'current-table-row' : ''
    },
    _getCursor () {
      this.$nextTick(() => {
        this.$refs.inputSeach.$el.querySelectorAll('input.el-input__inner')[0].focus()
        this.isAfterInquiry = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hospital-layout {
  position: relative;
  .list-msg {
    padding-bottom: 0px;
    .list_box {
      height: calc(100vh - 215px);
    }
  }
}
</style>
