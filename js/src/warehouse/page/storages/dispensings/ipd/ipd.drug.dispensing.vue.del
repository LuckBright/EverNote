<template>
  <div
    class="hospital-container"
  >
    <!-- 患者信息 -->
    <div class="hospital-layout">
      <el-container>
        <el-aside width="280px" class="inner high">
          <el-table
            highlight-current-row
            ref="singleTable"
            :stripe="false"
            class="no-border"
            :data.sync="leftTableData"
            @row-click="handleClick"
            style="margin: 0"
            :row-class-name="patientTableRowClassName"
          >
            <el-table-column width="80" label="姓名">
              <template slot-scope="scope">
                {{scope.row.patientName}}
                <span v-if="scope.row.addCount" class="font red">+{{scope.row.addCount}}</span>
                </template>
            </el-table-column>
            <el-table-column width="80" label="床号">
              <template slot-scope="scope">{{scope.row.bedNum}}</template>
            </el-table-column>
            <el-table-column class-name="pointer" label="病区">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.spaceRecordObject"
                >{{findBasesourceCode({arr: scope.row.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            small
            class="prescription_pagination"
            :page-size="20"
            :disabled="!totalCount"
            :current-page.sync="currentPage"
            layout="prev, next"
            prev-text="上一页"
            next-text="下一页"
            @prev-click="pageClick('prev')"
            @next-click="pageClick('next')"
            :total="totalCount">
          </el-pagination>-->
        </el-aside>
        <el-main class="inner" v-if="rightTableData.length" style="background: none">
          <!-- 患者信息 -->
          <div class="pos_re" v-if="patientId || hospitalizedNumber" style="background: #fff;">
            <patient-header
              :patientId="patientId"
              :visitNumber="hospitalizedNumber"
              :code="PATIENT_HEAD"
            ></patient-header>
            <!-- <history-btn :visitSn="currentVisitNumber" :implementType="listQueryObj.implementType"></history-btn> -->
          </div>
          <el-row class="druglist">
            <div
              class="list-msg"
              style="padding-bottom:10px; background: #fff;"
              v-for="(parentItem, index) in rightTableData"
              :key="index"
            >
              <div
                class="patient_title"
              >{{parentItem.status | formateValueToFnt({list: DISPENSING_STATUS, defaultFnt:'无'})}}</div>
              <div class="list_box">
                <div class="list">
                  <div v-for="(item, index) in parentItem.newArr" :key="index">
                    <ipd-righttable
                      :itemData="item"
                      :outTest="!item.outTest"
                      :testResult="item.testResult"
                      :isSee="1"
                      :isIcon="true"
                      :isPrint="([4, 5].includes(parentItem.status) || (parentItem.status === 6 && item.isPrint === 1)) ? true : false"
                      @print="selectPrint"
                      @supplementPrint="supplementPrint"
                      @updateStatus="updateStatus"
                    ></ipd-righttable>
                  </div>
                </div>
              </div>
              <div
                class="list-btn"
                v-if="([4, 5].includes(parentItem.status) || (parentItem.status === 6 && !parentItem.isAllPrint))"
              >
                <el-row>
                  <el-col :span="24">
                    <div class="btn-container">
                      <el-checkbox
                        class="fl"
                        style="margin-left: 27px"
                        v-if="parentItem.newArr.length"
                        v-model="parentItem.allCheck"
                        @change="handleCheckAll(parentItem)"
                      >全选</el-checkbox>
                      <!-- <el-button v-if="tableData.length && errTableData.length" type="primary" @click="handlerSupplementPrint(false)" class="mr10">重新生成备药单</el-button> -->
                      <span>
                        <el-button type="primary" v-if="!parentItem.isAllPrint" @click="handleSinglePrint(parentItem)" :loading="dispensePrintLoading" class="patient_btn_width">打印</el-button>
                      </span>
                      <span class v-if="parentItem.status == 4">
                        <el-button class="patient_btn_width" type="primary" :loading="dispensePrintLoading" @click="updateDispensePrint(parentItem)">备药完成</el-button>
                      </span>
                      <span class v-if="parentItem.status == 5">
                        <el-button class="patient_btn_width" type="primary" :loading="dispensePrintLoading" @click="updateDispensePrint(parentItem)">发药</el-button>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <everNoData v-if="!rightTableData.length"></everNoData>
          </el-row>
        </el-main>
      </el-container>
    </div>
    <record-dialog :value.sync="dialogRecord" :tableData="recordTableData"></record-dialog>
    <jcp-print
      :key="jcpKey"
      ref="jcpPrint"
      :hospitalType="hospitalType"
      :liveTableData="liveTableData"
      :liveTableDataSummary="liveTableDataSummary"
      :liveNonFatherAdvice="liveNonFatherAdvice"
      :printPatientObj="printPatientObj"
      :liveType="liveType"
      :inpatientArea="inpatientArea"
      :fatherAdvice="fatherAdvice"
    ></jcp-print>
  </div>
</template>

<script>
import IpdRighttable from '../components/ipd.righttable'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import storage from '@/util/storage'
import api from '../store/hospitalapi'
import { DISPENSING_STATUS } from '@/util/warehouseconfig'
import { debounce, SPACE_CODE, SPEC_CODE, MATERILA_CODE, PATIENT_HEAD, patch, dateFormat, CHINESE_PATENT_MEDICINE, TRADITIONAL_CHINESE_MEDICINE, SEARCH_CODE } from '@/util/common'
import mixinsDespen from './mixins_despen'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import recordDialog from './record.dialog'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import adviceList from '@/inpatient/components/advice.list.vue'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixinsnew'
import patientHeader from '@/inpatient/components/common.head.js'
export default {
  mixins: [getStorage, mixinsDespen, sendDrug, hospitalPrintMixins],
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
      PATIENT_HEAD,
      searchTime: '',
      searchNextTime: '',
      uddDispenseId: '',
      input: '',
      recordTableData: [],
      baseInfo: [], // 患者基本信息，主要用到：doctorType，hospitalizedNumber，patientId （查看医嘱组件）
      dialogSlot: false,
      employCheck: [],
      drugPackInfo: {},
      implementTimeCheck: [],
      implementTimeList: [],
      employList: [],
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
      patientId: '',
      hospitalizedNumber: '',
      dispensePrintLoading: false
    }
  },
  created () {
    this.getSpaceList()
  },
  methods: {
    async updateDispensePrint (item) {    //  批量操作备药单
      // if (this.clickBtnDispenseId === item.id) return // 防止点击过快， 相同数据提交
      // this.clickBtnDispenseId = item.id
      let ids = this.handleIds(item)
      if (!ids.length) return this.$messageTips(this, 'warning', '请先选择药包')
      let params = {
        uddDispenseIds: ids,
        status: item.status + 1
      }
      this.dispensePrintLoading = true
      await api.updateUddStatusForCoordination(params).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', item.status === 4 ? '备药成功' : '审核发药完成')
          this.getRightList()
        } else {
          this.getRightList()
        }
        // this.clickBtnDispenseId = ''
      })
      this.dispensePrintLoading = false
    },
    supplementPrint (v) {
      let obj = Object.assign({}, v)
      delete obj.identification
      this.gatherPrintSingle(obj)
    },
    selectPrint (v) {
      this.rightTableData.map(parentItem => {
        let all = 0
        parentItem.newArr.map(item => {
          if (item.id === v.id) {
            item.checked = v.status
          }
          if (item.checked) all++
        })
        if (all === parentItem.newArr.length) {
          parentItem.allCheck = true
        } else {
          parentItem.allCheck = false
        }
      })
    },
    handleCheckAll (parentItem) {
      parentItem.newArr.forEach(item => {
        item.checked = parentItem.allCheck
      })
    },
    updateStatus (v, data) {
      this.getSpaceList()
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row && (row.cdssResult || row.identification)) {
        return 'mark-cdss-row'
      }
      return row && row.cdssResult ? 'noPad' : ''
    },
    // 过敏史
    allergenList (data) {
      let arr = []
      data.forEach(item => {
        item && arr.push(item.name)
      })
      return arr.join(', ') || '无'
    },
    async getSpaceList () {
      this.fullscreenLoading = true
      this.leftTableData = await api.getUddListForCoordinationByHospitalizedNum({
        storageRoomId: this.storageId,
        identification: 0
      }).then(res => {
        res && res.list && res.list.forEach(item => {
          item.addCount = 0
        })
        return res.list || []
      })
      if (!this.patientId && !this.hospitalizedNumber) {
        this.patientId = this.leftTableData.length ? this.leftTableData[0].patientId : ''
        this.hospitalizedNumber = this.leftTableData.length ? this.leftTableData[0].hospitalizedNumber : ''
        this.inpatientArea = this.leftTableData[0]
      }
      this.getRightList()
    },
    getRightList () {
      if (this.patientId && this.hospitalizedNumber) {
        this.getUddDispenseList()
      } else {
        this.rightTableData = []
        this.drugPackInfo = {}
      }
      this.fullscreenLoading = false
    },
    findArray (arr, str) {
      //  获取到的数组中区分 正常处方&异常处方 arr原数组  str要区分的匹配值
      let newArr = []
      let errArr = []
      arr.forEach(item => {
        if (item[str]) {
          errArr.push(item)
        } else {
          item.checked = true
          newArr.push(item)
        }
      })
      //  输出一个对象 newArr为正常处方  errArr为异常处方
      return { newArr: newArr, errArr: errArr }
    },
    //  右侧列表数据处理
    handlerRightData (resData) {
      let data = []
      for (let key in resData) {
        let params = Object.assign({
          oldList: resData[key],
          status: parseInt(key),
          allCheck: true,
          isAllPrint: false
        }, this.findArray(resData[key], 'identification'))
        let count = 0
        params.newArr.map(item => {
          if (item.isPrint === 2) {
            count++
          }
        })
        if (count === params.newArr.length) params.isAllPrint = true
        data.push(params)
      }
      this.rightTableData = data
      this.handleSkinTest(this.rightTableData)
    },
    getUddDispenseList: debounce(async function () {
      // 右侧单个病区的患者列表
      let res = await api.getUddListForCoordinationByVisitSn({
        storageRoomId: this.storageId, // 库房id
        patientId: this.patientId, // 患者id
        identification: 0,
        hospitalizedNumber: this.hospitalizedNumber // 病历id
      }).then(res => {
        if (res) {
          return res
        }
      })
      this.handlerRightData(res)
      // if (!this.rightTableData.length) {
      //   this._listClickOne()
      // }
    }),
    // 处理皮试结果数据 - 以患者为纬度处理，不可使用混入的方式（因为混入的是以药包为纬度）
    async handleSkinTest (data) {
      const skinTest = await api.getUddSkinTest({ hospitalizedNumber: this.hospitalizedNumber })
      data.forEach(value => {
        value.newArr.forEach(item => {
          const skinFlag = item.uddDispenseItemList.some(i => this.isSkinTestMaterial(i))
          if (skinFlag && skinTest.length) {
            this.$set(item, 'outTest', false)
            this.$set(item, 'testResult', skinTest)
          } else {
            this.$set(item, 'outTest', true)
            this.$set(item, 'testResult', [])
          }
        })
      })
    },
    _initData () {
      this.leftTableData = []
      this.rightTableData = []
      this.patientId = ''
      this.hospitalizedNumber = ''
    },
    _listClickOne () {
      let index = this.leftTableData.findIndex(item => {
        return item.patientId === this.patientId
      })
      this.leftTableData.splice(index, 1)
      if (this.leftTableData.length) {
        this.$nextTick(_ => {
          this.$refs.singleTable.$el.querySelectorAll('.el-table__row')[0].click()
        })
      } else {
        this._initData()
      }
    },
    handleClick (row) {
      // 点击左侧表格，选择患者
      this.patientId = row.patientId
      this.hospitalizedNumber = row.hospitalizedNumber
      if (this.hospitalizedNumber && this.patientId) this.getRightList()
      this.employCheck = []
      this.implementTimeCheck = []
      row.addCount = 0
      this.inpatientArea = row
      // console.log(this.inpatientArea)
    },
    _getSpaceList: debounce(function () {
      this.drugStatus = ''
      this.employCheck = []
      this.checkAllemploy = false
      this.checkAllTime = false
      this.implementTimeCheck = []
      this.getSpaceList()
    }),
    // 当前病区 - 添加class
    patientTableRowClassName ({ row }) {
      return row.hospitalizedNumber === this.hospitalizedNumber ? 'current-table-row' : ''
    },
    ...patch
  },
  watch: {
    '$store.state.dispensing.hospitalData' (v) {
      let index = this.leftTableData.findIndex(item => {
        return item.patientId === v.patientId
      })
      if (index > -1) {
        let count = this.leftTableData[index].addCount + 1
        this.$set(this.leftTableData[index], 'addCount', count)
        this.getUddDispenseList()
      } else {
        let storageRoomVuexID = storage.getLocalStorage('STORAGE_ID_VUEX')
        let storageID = storage.getLocalStorage('STORAGE_ID')
        let curStorageRoomId
        if (storageRoomVuexID) {
          curStorageRoomId = storageRoomVuexID
        } else {
          curStorageRoomId = storageID
        }
        if (v.storageRoomId === curStorageRoomId) {
          // 处方发药新患者自动刷新，并且提示+1
          if (!this.leftTableData.length) {
            this.getSpaceList()
          }
          this.leftTableData.unshift(v)
          this.leftTableData[0].addCount = 0
          let count = this.leftTableData[0].addCount + 1
          this.$set(this.leftTableData[0], 'addCount', count)
          // this.getUddDispenseList()
        }
        // this.getSpaceList()
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
    IpdRighttable,
    recordDialog,
    adviceList,
    dialogSlot,
    JcpPrint,
    patientHeader
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
  .inner {
    background: #fff;
  }
  .high {
    height: calc(100vh - 125px);
    margin: 10px 0;
  }
  .search_form {
    padding-bottom: 10px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
  .search_sty {
    float: left;
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
  color: #333;
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
.hospital-layout .list-msg {
  margin-top: 10px;
  /deep/ .patient_title{
    font-size: 18px;
    font-weight: bold;
    border-left: 5px solid #1c7bef;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.2)
  }
  .list_box{
    padding: 0 10px;
    overflow: hidden;
    height: auto;
    .list {
      padding-top: 10px;
    }
  }
}
.druglist{
  height: calc(100vh - 198px);
  overflow-y: scroll;
}
.hospital-layout .list-btn {
  position: initial;
  padding-left: 0;
}
.hospital-layout .list-btn .btn-container {
  width: auto;
}
</style>
