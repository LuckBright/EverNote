 <template>
  <div class="hospital-container">
    <!-- 搜索框 -->
    <div class="hospital-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <dispen-search
            ref="ipdpresc"
            placeholder="备药单号"
            :isSearchUser="true"
            @searchQuery="handleSearch"
          ></dispen-search>
        </el-col>
      </el-row>
    </div>
    <!-- 患者信息 -->
    <el-container class="hospital-layout">
      <el-aside width="280px" class="inner high">
        <div class="date_picker_box">
          <el-row :gutter="20" type="flex" align="middle">
            <el-col :span="12">
              <ever-select v-model="drugStatus" :clearable="true" :options="drugPackStatus"></ever-select>
            </el-col>
            <el-col :span="12">
              <span class="f14">共 {{totalCount}} 条记录</span>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="leftLoading"
          ref="singleTable"
          :data="leftTableData"
          highlight-current-row
          :height="'calc(100vh - 270px)'"
          class="no-border"
          @current-change="handleCurrentChange"
          :row-class-name="patientTableRowClassName"
          style="width: 100%">
          <el-table-column
            class-name="pointer"
            prop="codes"
            label="批量备药单">
            <template slot-scope="scope">
              {{scope.row.codes}}
              <el-tooltip
                effect="dark"
                v-if="scope.row.identification == 2"
                content="异常"
                placement="top">
                <svg class="icon" aria-hidden="true" style="font-size: 18px; height: 18px">
                  <use xlink:href="#icon-yi"></use>
                </svg>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="药包数"
            width="70">
          </el-table-column>
        </el-table>
        <el-pagination
          class="alg_c prescription_pagination"
          small
          :page-size="20"
          :current-page.sync="currentPage"
          layout="prev, next"
          prev-text="上一页"
          next-text="下一页"
          @prev-click="pageClick('prev')"
          @next-click="pageClick('next')"
          :total="totalCount">
        </el-pagination>
      </el-aside>
      <el-main class="inner ml10">
        <div class="patient_title f_bold" v-if="tableData.length || errTableData.length">
          {{!dispenseObj.oldCode ? '备药单号' : '批量备药单号'}}：{{leftCode}}
          <span class="inUse ml5" v-if="inUse === 2">（该备药单已作废）</span>
          <span class="inUse ml5" v-if="dispenseObj.oldCode">（原单号：{{dispenseObj.oldCode}}）</span>
          <el-button type="text" v-if="!errTableData.length && dispenseSettingObject.uddDispenseSettingObject && dispenseSettingObject.uddDispenseSettingObject.dispensePreparePrint == 1" @click="handlerSupplementPrint(true)" class="fr">补打备药单</el-button>
        </div>
        <div class="list-msg">
          <div class="list_box">
            <div v-if="tableData.length" class="list">
              <div v-for="(item, index) in tableData" :key="index">
                <ipd-righttable
                  :itemData="item"
                  :thisIndex="tableData.length > 1 || errTableData.length ? index + 1 : 0"
                  :isSee="1"
                  :outTest="!item.outTest"
                  :testResult="item.testResult"
                  @supplementPrint="supplementPrint"
                  @updateStatus="updateStatus">
                </ipd-righttable>
              </div>
            </div>
            <div v-if="errTableData.length" class="list">
              <div v-for="(item, index) in errTableData" :key="index">
                <ipd-righttable
                  :itemData="item"
                  :thisIndex="tableData.length ? tableData.length + index + 1 : index + 1"
                  :isSee="1"
                  :outTest="!item.outTest"
                  :testResult="item.testResult"
                  @updateStatus="updateStatus">
                </ipd-righttable>
              </div>
            </div>
            <everNoData v-if="!tableData.length && !errTableData.length"></everNoData>
          </div>
          <!-- // (drugStatus==4 || drugStatus==5) &&  -->
          <div class="list-btn" v-if="tableData.length">
            <el-row>
              <el-col :span="24">
                <div class="btn-container">
                  <el-button v-if="tableData.length && errTableData.length" type="primary" @click="handlerSupplementPrint(false)" class="patient_btn_width mr10">重新生成备药单</el-button>
                  <span class="" v-if="drugStatus == 4 && !errTableData.length">
                    <el-button class="patient_btn_width" type="primary" @click="handleFinish(1)">备药完成</el-button>
                  </span>
                  <span class="" v-if="drugStatus == 5 && !errTableData.length">
                    <el-button class="patient_btn_width" type="primary" @click="handleFinish(2)">发药</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
    <jcp-print :key="jcpKey" ref="jcpPrint"
      :hospitalType="hospitalType"
      :liveTableData="liveTableData"
      :liveNonFatherAdvice="liveNonFatherAdvice"
      :printPatientObj="printPatientObj"
      :liveType="liveType"
      :inpatientArea="inpatientArea"
      :fatherAdvice="fatherAdvice"></jcp-print>
    <ipd-search-prescription
    ref="ipdsearch"
    :searchObject="searchObject"
    :opdSearchList="opdSearchList"
    @closeSearchPop="closeSearchPop"
    @updateSearchOpd="updateSearchIpd"></ipd-search-prescription>
  </div>
</template>

<script>
import IpdRighttable from '../components/ipd.righttable'
import ipdSearchPrescription from '../components/ipd.search.prescription'
import hospitalApi from '../store/hospitalapi'
import api from '../store/dispenseapi'
import { DISPENSING_STATUS, objGet, patch, SEARCH_CODE, SPU_SPEC_CODE, DOSAGE } from '@/util/common'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import mixinsDespen from './mixins_despen'
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixinsnew'
import './index.scss'
import { _findIndex } from '@/util/formcustom'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
export default {
  mixins: [getStorage, mixinsDespen, sendDrug, hospitalPrintMixins, dispenseSettingMixin],
  data () {
    return {
      SEARCH_CODE,
      SPU_SPEC_CODE,
      DOSAGE,
      DISPENSING_STATUS,
      input: '',
      leftTableData: [],
      drugStatus: '',
      leftLoading: false,
      fullscreenLoading: false,
      checked: false,
      dialogTableVisible: false,
      all: false,
      checkedList: [],
      opdSearchList: {},
      multipleSelection: [],
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      currentPage: 1,
      tableData: [],
      errTableData: [],
      leftId: '',
      leftCode: '',
      dispenseObj: {},
      searchObject: {},
      drugPackStatus: [],
      element: '',
      inUse: null,
      hospitalizedNumber: '',
      diglogContnet: '重新生成的备药单将不包含异常药包'
    }
  },
  created () {
    this.DISPENSING_STATUS.forEach(item => {
      let arr = [5, 6]
      if (objGet(this.dispenseSettingObject, 'uddDispenseSettingObject.dispensePrepare', '') === 1) arr.unshift(4)
      if (arr.includes(item.id)) this.drugPackStatus.push(item)
    })
    this.drugStatus = this.drugPackStatus[0].id
  },
  watch: {
    // 药包状态
    drugStatus: {
      handler: function () {
        this.checkedList = []
        this.offset = 0
        this.currentPage = 1
        if (this.drugStatus) this.getDispenseCodesList()
      },
      immediate: true
    }
  },
  components: {
    JcpPrint,
    IpdRighttable,
    tipDialog,
    dispenSearch,
    ipdSearchPrescription
  },
  methods: {
    closeSearchPop (v) {
      this.$nextTick(() => {
        this.$refs.ipdpresc.$el.querySelectorAll('input.el-input__inner')[0].focus()
      })
    },
    updateSearchIpd (v) {
      this.getDispenseCodesList()
    },
    handleSearch (v) {
      if (v.searchValue) {
        this.searchObject = v
        this.searchObject.storageRoomId = this.storageId
        api.getDispenseForUdd({ code: this.searchObject.searchValue, storageRoomId: this.storageId }).then(res => {
          if (res && res.code) {
            this.opdSearchList = res
            this.$refs.ipdsearch.dialogVisible = true
          } else {
            this.$messageTips(this, 'warning', '没有找到该备药单，请重试')
          }
        })
        this.$refs.ipdpresc.searchValue = ''
      }
    },
    supplementPrint (v) {
      let obj = Object.assign({}, v)
      delete obj.identification
      this.gatherPrintSingle(obj)
    },
    updateStatus (v, data) {
      let index = _findIndex(this.leftTableData, this.leftId)
      this.$set(this.leftTableData[index], 'identification', v === 'sign' ? 2 : 1)
      if (data) {
        this.$set(this.leftTableData[index], 'identification', 1)
      }
      this.getDispenseList()
    },
    pageClick (v) {
      if (v === 'prev') {
        this.offset = this.offset - this.pagesize
      } else {
        this.offset = this.offset + this.pagesize
      }
      this.getDispenseCodesList()
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row && row.cdssResult) {
        return 'mark-cdss-row'
      }
      return ''
    },
    handlerSupplementPrint (flag) { // 补打备药单
      if (flag) {
        this._rePrint()
      } else {
        this.$confirm('重新生成的备药单将不包含异常药包', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.diglogFunction()
        })
      }
    },
    diglogFunction () {
      api.reprintDispense({ id: this.leftId }).then(res => {
        if (res) {
          // this.$store.commit('updateDispenseCode', res.codes)
          this._rePrint()
          this.$messageTips(this, 'success', '重新生成备药单成功')
          this.getDispenseCodesList()
        }
      })
    },
    _rePrint () {
      this._initPrint()
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    ...patch,
    // 初始化状态
    resetStatus () {
      this.multipleSelection = []
      this.checkedList = []
      this.all = false
    },
    // 备药完成 / 批量发药和单个发药  (type = 1 备药完成  type = 2 发药)
    handleFinish (type) {
      const params = {
        id: this.leftId,
        status: this.drugStatus + 1, // 服务端自己取药包状态
        storageRoomId: this.storageId
      }
      api.updateStatus(params).then(res => {
        // 更改药包状态为待发药
        if (res.flag) {
          this.$messageTips(this, 'success', `${type === 1 ? '备药' : '发药'}完成`)
          this.searchName = ''
          this.getDispenseCodesList()
        } else {
          this.getDispenseList()
        }
      })
    },
    // 左侧列表
    async getDispenseCodesList () {
      // const despenCode = this.$store.state.dispensing.dispenseCode
      // if (despenCode) {
      //   this.searchName = despenCode
      //   this.offset = 0
      // }
      this.leftLoading = true
      const result = await api.getDispenseCodesList({
        storageRoomId: this.storageId,
        codes: this.searchName,
        status: this.drugStatus,
        offset: this.offset,
        pagesize: this.pagesize,
        relationType: 3 // 住院备药单
      })
      this.$store.commit('updateDispenseCode', '')
      this.leftLoading = false
      if (result.list && result.list.length) {
        this.leftTableData = result.list
        this.leftId = objGet(this.leftTableData[0], 'id', '')
        this.leftCode = objGet(this.leftTableData[0], 'codes', '')
        this.inUse = objGet(this.leftTableData[0], 'inUse', '')
        this.leftId && this.getDispenseList()
        this.inpatientArea = this.leftTableData[0]
        this.inpatientArea.barCode = this.inpatientArea.codes
      } else {
        this.leftTableData = []
        this.tableData = []
        this.errTableData = []
      }
      this.totalCount = result.totalCount ? result.totalCount : 0
    },
    // 右侧列表
    handleCurrentChange (data) {
      if (data) {
        this.inpatientArea = data
        this.inpatientArea.barCode = this.inpatientArea.codes
        this.leftId = data.id
        this.leftCode = data.codes
        this.inUse = data.inUse
        this.getDispenseList()
        this.multipleSelection = []
        this.checkedList = []
        this.all = false
      }
    },
    getDispenseList () {
      this.fullscreenLoading = true
      api.getDispenseList({ id: this.leftId }).then(res => {
        if (res.dispense) this.dispenseObj = res.dispense
        let countObject = this._findArray(res.list || [])
        this.tableData = countObject.newArr
        this.errTableData = countObject.errArr
        this.fullscreenLoading = false
        if (countObject.newArr.length || countObject.errArr.length) {
          this.hospitalizedNumber = (countObject.newArr[0] && countObject.newArr[0].hospitalizedNumber) || (countObject.errArr[0] && countObject.errArr[0].hospitalizedNumber)
          // currentHospitalizedNumber && this.getUddSkinTest(currentHospitalizedNumber)
          this.handleSkinTest(this.tableData)
          this.handleSkinTest(this.errTableData)
        }
      })
    },
    // 处理皮试结果数据 - 以患者为纬度处理，不可使用混入的方式（因为混入的是以药包为纬度）
    async handleSkinTest (data) {
      const skinTest = await hospitalApi.getUddSkinTest({ hospitalizedNumber: this.hospitalizedNumber })
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
    // 处理异常
    handleUnusual () {
      if (!this.checkMultipleLength()) return
      let ids = []
      this.multipleSelection.forEach((item) => {
        ids.push(item.id)
      })
      hospitalApi.getUddDispenseByIds({
        ids: ids.join(',')
      }).then(res => {
        if (res) {
          this.unusualTableData = res
          this.dialogTableVisible = true
          this.resetStatus()
        }
      })
    },
    // 取消异常
    async cancelUnusual (id) {
      const result = await hospitalApi.updateUddDispense({
        id
      }).then(res => res)
      if (result.flag) {
        this.$messageTips(this, 'success', '撤销异常成功')
        this.getDispenseList()
        this.resetStatus()
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
      const result = await hospitalApi.updateUddDispenseItemList(params).then(res => res)
      if (result) this.getDispenseList()
      this.dialogTableVisible = false
      this.resetStatus()
    },
    handleCheck (val) {
      let chekedCount = val.length
      this.all = chekedCount === this.tableData.length
      this.setMultipleSelectionData(val)
    },
    handleCheckAll (checked) {
      if (checked) {
        this.tableData.forEach((item, index) => {
          this.checkedList.push(index + 1)
        })
      } else {
        this.checkedList = []
      }
      this.setMultipleSelectionData(this.checkedList)
    },
    setMultipleSelectionData (data) {
      this.checkedList.forEach((item) => {
        this.multipleSelection.push(this.tableData[item - 1])
      })
    },
    // 当前病区 - 添加class
    patientTableRowClassName ({ row }) {
      return row.id === this.leftId ? 'current-table-row' : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.el-main{
  padding: 0px !important;
}
.patient_title {
  padding: 15px;
  padding-bottom: 0;
}
.hospital-layout{
  .list-msg{
    padding: 10px;
    // padding-bottom: 60px;
  }
}
.hospital-layout .list-msg .list_box {
    overflow-x: hidden;
    height: calc(100vh - 290px);
    padding-bottom: 60px;
}
.light {
  color: #1c7bef
}
.prescription_pagination /deep/ button{
  color: #409eff;
}
.prescription_pagination /deep/ button[disabled=disabled]{
  color: #c0c4cc;
}
.inUse{
  color: #999;
}
</style>
