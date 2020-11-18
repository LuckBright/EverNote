<template>
  <div id="opd">
    <!-- <el-container class="hospital-container">
      <dispen-search
        placeholder="处方单号/患者姓名"
        :storageKey="true"
        router="/storages/dispensingopd/opdsearch">
      </dispen-search>
    </el-container> -->
    <el-container class="pos_re dispense_container">
      <div class="pr-l" :class="[expandTable ? 'pr-l-w' : '']">
        <ul class="dispense_tabs clearfix">
          <li :class="[dispenseType === 'opd' ? 'is-active' : '']" @click="dispenseType = 'opd'">处方发药</li>
          <li :class="[dispenseType === 'ipd' ? 'is-active' : '']" @click="dispenseType = 'ipd'">院内发药</li>
          <el-button class="pos_ab" type="text" :class="[expandTable ? 'i-zhankai' : '']" @click="expandTable = !expandTable">
            <i class="iconfont icon-zhankai"></i>
          </el-button>
        </ul>
        <div class="dispense_list pos_re" style="margin-top: -10px">
          <el-table
            ref="opdTable"
            v-loading.body="fullscreenLoading"
            :data.sync="tableData"
            style="width: 100%"
            :height="listHeight"
            highlight-current-row
            @row-click="handleDetails">
            <!-- <el-table-column
              v-if="!listQueryObj.identification && listQueryObj.identification === 0"
              width="32"
              type="selection">
            </el-table-column> -->
            <el-table-column
              class-name="pointer"
              label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.patientName}}</span>
                <span v-if="scope.row.addCount" class="font red">+{{scope.row.addCount}}</span>
                <el-tooltip content="邮寄" placement="top" v-if="scope.row.mailFlag && listQueryObj.implementType !== ''">
                  <svg class="icon f16" aria-hidden="true">
                    <use xlink:href="#icon-youji"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip
              width="90"
              class-name="pointer"
              label="科室">
              <template slot-scope="scope">
                <span>{{scope.row.providerName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              class-name="pointer"
              label="医师">
              <template slot-scope="scope">
                <span v-if="scope.row.doctorName">{{scope.row.doctorName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="expandTable"
              width="157"
              label="开单时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateByExp}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
          </el-pagination>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="pr-r" v-if="tablePatientData.length">
        <!-- 患者信息 -->
        <div class="pos_re" v-if="currentVisitPatientId">
          <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
          <history-btn :visitSn="currentVisitNumber" :implementType="listQueryObj.implementType"></history-btn>
        </div>

        <!-- 诊断基本信息 -->
        <div class="patient_prescription presciptbox">
          <div class="patient_prescription statusbox" v-for="(parentItem, index) in tablePatientData" :key="index">
            <!-- 邮寄组件 -->
            <mail-dialog
              v-if="parentItem.status === 5"
              :itemData="parentItem.oldList[0]"
              :listData="listDataIds"
              :ids="orderIds"
              :visible.sync="dialogVisibleMail"
              :isClick="isClick"
              @sendMedicine="sendMedicine">
            </mail-dialog>
            <receipt-mail :itemData="parentItem.oldList" v-if="parentItem.oldList[0].mailFlag && parentItem.oldList[0].mailAddressObject"></receipt-mail>
            <div class="patient_title" v-if="parentItem.status">
              {{parentItem.status | formateValueToFnt({list: DISPENSING_STATUS, defaultFnt:'无'})}}
            </div>
            <!-- 检查信息 -->
            <!-- <div class="doctor-info">
              <check-information :propData="parentItem.newArr[0] || parentItem.errArr[0]"></check-information>
            </div> -->
            <div class="patient_list" v-for="(item, index) in parentItem.newArr" :key="index">
              <!--正常处方 单个处方详情信息 -->
              <chinese-prescription
                :isPrint="([4, 5].includes(parentItem.status) || (parentItem.status === 6 && item.isPrint === 1)) ? true : false"
                @print="selectPrint"
                :opdData="item"
                :doctorData="item"
                @updateDispenseStatus="updateDispenseStatus"
                :patientData="item.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(item.adviceType)"></chinese-prescription>
              <wast-prescription
                v-else
                :doctorData="item"
                :itemData="item"
                :itemId="item.id"
                :isPrint="([4, 5].includes(parentItem.status) || (parentItem.status === 6 && item.isPrint === 1)) ? true : false"
                :date="item.createTime"
                :identification="item.identification"
                :status="item.status"
                :mailState="item.mailFlag"
                :outTest="outTest"
                :visitSn="currentVisitNumber"
                :testResult="testResult"
                :patientObject="item.patientObject"
                :patientData="item.outpatientDispenseItemList"
                @sendPrint="handlerSendPrint"
                @updateDispenseStatus="updateDispenseStatus"
                @print="selectPrint">
              </wast-prescription>
            </div>
            <div class="patient_footer" v-if="([4, 5].includes(parentItem.status) || (parentItem.status === 6 && !parentItem.isAllPrint))">
              <el-checkbox class="fl ml15 mt10" v-if="parentItem.newArr.length" v-model="parentItem.allCheck" @change="handleCheckAll(parentItem)">全选</el-checkbox>
              <el-button type="primary" v-if="!parentItem.isAllPrint" @click="dispensePrint(parentItem)" :loading="dispensePrintLoading" class="patient_btn_width">打印</el-button>
              <!-- <el-button :loading="dispensePrintLoading" type="primary" v-if="(listQueryObj.status === 4 || listQueryObj.status === 5) && item.newArr.length && item.errArr.length" @click="updateRepeatOutpatientDispensePrint(item)" class="patient_btn_width">重打备药单</el-button> -->
              <el-button :loading="dispensePrintLoading" type="primary" v-if="parentItem.status === 4 && !parentItem.errArr.length" @click="updateDispensePrint(parentItem)" class="patient_btn_width">备药完成</el-button>
              <el-button :loading="dispensePrintLoading" type="primary" v-if="parentItem.status === 5 && !parentItem.errArr.length" @click="updateDispensePrint(parentItem)" class="patient_btn_width">审核并发药</el-button>
            </div>
            <div class="patient_title danger f_bold f16" v-if="parentItem.errArr && parentItem.errArr.length">异常处方</div>
            <div class="patient_list" v-for="(item, index) in parentItem.errArr" :key="index">
              <!--异常处方 单个处方详情信息 -->
              <chinese-prescription
                @print="selectPrint"
                :opdData="item"
                :doctorData="item"
                @updateDispenseStatus="updateDispenseStatus"
                :patientData="item.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(item.adviceType)"></chinese-prescription>
              <wast-prescription
                v-else
                :itemData="item"
                :doctorData="item"
                :itemId="item.id"
                :date="item.createTime"
                :identification="item.identification"
                :status="item.status"
                :visitSn="currentVisitNumber"
                :mailState="item.mailFlag"
                :outTest="outTest"
                :testResult="testResult"
                :patientData="item.outpatientDispenseItemList"
                @updateDispenseStatus="updateDispenseStatus">
              </wast-prescription>
            </div>
          </div>
        </div>
      </div>
    </el-container>
    <!-- 打印组件 -->
    <jcp-print :key="jcpKey" ref="jcpPrint" hospitalType="1" :drugTableData="drugTableData" :nonPaternal="nonPaternal" :printPatientObj="printPatientObj" :fatherAdvice="fatherAdvice"></jcp-print>
  </div>
</template>

<script>
/* eslint-disable */
// 任务打印
import commonApi from '../store/dispensingcommonapi.js'
import dispenSearch from '../components/dispen.search'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import checkInformation from '../components/check.information'
import wastPrescription from '../components/west.prescription.vue'
import chinesePrescription from '../components/chinese.prescription'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { PATIENT_HEAD, CHINESE_MEDICINE_TYPE, DISPENSING_STATUS, debounce } from '@/util/common'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import receiptMail from '../components/receiptmail'
import setName from '@/util/setstatusname'
import storage from '@/util/storage'
import mailDialog from '@/warehouse/page/storages/components/maildialog'
import './index.scss'
import skinTestMixins from '../mixins/skinTest.mixins'
export default {
  mixins: [getstorage, drugPrintMixins, setName, skinTestMixins],
  data () {
    const listQueryObj = {
      implementType: 2,
      identification: 0
    }
    return {
      listQueryObj,
      expandTable: false,
      fullscreenLoading: false,
      tableData: [],
      orderIds: [],
      CHINESE_MEDICINE_TYPE,
      tablePatientData: {},
      selectVisitSnList: [],
      checkedRecipeId: [],
      totalCount: 0,
      offset: 0,
      pagesize: 20,
      currentPage: 1,
      PATIENT_HEAD,
      dialogVisibleMail: false, // 发药邮寄弹窗
      listDataIds: [], // 选择的发药邮寄的处方单的id
      DISPENSING_STATUS,
      currentVisitPatientId: '', // 当前选中患者patientId
      currentVisitNumber: '', // 当前门诊号
      currentVisitSn: '',
      clickBtnDispenseId: '',
      batchPrintLoading: false,
      dispensePrintLoading: false,
      isClick: false,
      dispenseType: 'opd' // 发药类型
    }
  },
  created () {
    this.listQueryObj.storageRoomId = this.storageId
    this._router(this.$route)
  },
  computed: {
    listHeight () {
      return this.$route.name === 'abnormalprint' ? `calc(100vh - 245px)` : `calc(100vh - 200px)`
    }
  },
  methods: {
    _router (v) {
      if (this.listQueryObj.status === 3) delete this.listQueryObj.status
      if (v.name === 'abnormalprint') {            //  异常处方
        this.listQueryObj.identification = 1
        this.listQueryObj.isPrint = ''
        this.listQueryObj.searchType = 3
        if (this.listQueryObj.searchType) delete this.listQueryObj.searchType
      } else if (v.name === 'opdtaskprint') {      //  正常处方
        this.listQueryObj.identification = 0
      } else if (v.name === 'opdshortage') {      //   缺货处方
        this.listQueryObj.identification = ''
        this.listQueryObj.status = 3
      }
      this._initData()
      this.getVisitSnList()
    },
    _initData () {
      this.offset = 0
      this.currentPage = 1
      this.tableData = []
      this.tablePatientData = {}
      this.currentVisitPatientId = ''
      this.currentVisitNumber = ''
    },
    _findArray (arr, str) {
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
    pageClick (v) {
      if (v === 'prev') {
        this.offset = this.offset - this.pagesize
        this.getVisitSnList()
      } else {
        this.offset = this.offset + this.pagesize
        this.getVisitSnList()
      }
    },
    selectPrint (v) {
      this.tablePatientData.map(parentItem => {
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
    handleIds (arr, isClick = false, print = false) {
      let ids = []
      arr.newArr.map(item => {
        if (item.checked && item.mailFlag && isClick) {
          ids.push(item.id)
        } else if (item.checked && !isClick) {
          if (print) {
            if (item.isPrint === 1) ids.push(item.id)
          } else {
            ids.push(item.id)
          }
        }
      })
      return ids
    },
    sendMedicine (v, id, status, isClick, ids) {
      let params = {
        outpatientDispenseIds: this.orderIds,
        status: status + 1,
        expressInformationList: v,
        visitSn: this.currentVisitNumber
      }
      this.dispensePrintLoading = true
      commonApi.updateDispenseStatusForCoordination(params).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', '审核发药完成')
          this.isClick = true
          this.handleDetails()
        } else {
          this.handleDetails()
        }
      })
      this.handleDetails()
      this.dispensePrintLoading = false
      this.dialogVisibleMail = false
    },
    updateDispensePrint: debounce(function (item) {  //  批量操作备药单
    if (item.status === 4 || item.status === 5 && !item.newArr[0].mailFlag && !item.newArr[0].mailAddressObject) {
      // if (this.clickBtnDispenseId === item.id) return // 防止点击过快， 相同数据提交
      // this.clickBtnDispenseId = item.id
      let ids = this.handleIds(item)
      if (!ids.length) return this.$messageTips(this, 'warning', '请先选择处方单')
      let params = {
        outpatientDispenseIds: ids,
        status: item.status + 1
      }
      this.dispensePrintLoading = true
       commonApi.updateDispenseStatusForCoordination(params).then(res => {
        if (res && res.flag) {
          this.$messageTips(this, 'success', item.status === 4 ? '备药成功' : '审核发药完成')
          this.handleDetails()
        } else {
          this.handleDetails()
        }
        // this.clickBtnDispenseId = ''
      })
    } else {
      this.isClick = true
      this.orderIds = this.handleIds(item)
      this.listDataIds = this.handleIds(item, this.isClick)
      this.dialogVisibleMail = true
    }
      this.dispensePrintLoading = false
    }),
    updateDispenseStatus (obj) {
      this.handleDetails()
      // if (this.listQueryObj.identification === 1 && this.tablePatientData.errArr.length === 1) {
      // if (this.tablePatientData.errArr[0].outpatientDispenseItemList.every(item => item.identification === 1)) return this._listClickOne()
      // }
    },
    async dispensePrint (data) {    //  打印处方单
      let ids = this.handleIds(data, false, true)
      if (!ids.length) return this.$messageTips(this, 'warning', '请先选择处方单')
      let params = {
        ids: ids,
        type: 2,
        storageRoomId: this.storageId
      }
      this.dispensePrintLoading = true
      await commonApi.printOutpatientDispenseAndItem(params).then(res => {
        if (res) {
          //  调用打印
          let dispenseVoList = res
          let patientObject = res[0].patientObject
          let storageRoomObject = res[0].storageRoomObject
          this.gatherPrintData({
            outpatientDispenseInfo: dispenseVoList,
            storageRoomObject,
            patientObject: Object.assign(patientObject, { visitSn: this.currentVisitNumber })
          }, ['nonPaternal', 'fatherAdvice'])
          //  打印完成 更新页面数据
          this.$messageTips(this, 'success', '打印成功')
          this.handleDetails()
        }
        this.dispensePrintLoading = false
      })
    },
    handleSelectionChange (v) {
      this.selectVisitSnList = []
      v.forEach(item => {
        item && this.selectVisitSnList.push(item.visitSn)
      })
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
        }, this._findArray(resData[key], 'identification'))
        let count = 0
        params.newArr.map(item => {
          if (item.isPrint === 2) {
            count++
          }
        })
        if (count === params.newArr.length) params.isAllPrint = true
        data.push(params)
      }
      this.tablePatientData = data
    },
    handleDetails (data) {
      let params
      // 点击列表选中checkbox
      // this.$refs.opdTable.toggleRowSelection(data)
      if (data) {
        data.addCount = 0
        this.currentVisitPatientId = data.patientId
        this.currentVisitNumber = data.visitSn
        params = Object.assign({ visitSn: data.visitSn }, this.listQueryObj)
      } else {
        params = Object.assign({ visitSn: this.currentVisitNumber }, this.listQueryObj)
      }
      if (!params.visitSn) return
      commonApi.getOutpatientDispenseListForCoordinationByVisitSn(params).then(res => {
        const keys = Object.keys(res)
        if (keys.includes('resultList')) {
          this._listClickOne()
        } else {
          this.handlerRightData(res)
          if (!this.tablePatientData.length) {
            this._listClickOne()
          }
        }
      })
    },
    _listClickOne () {
      let index = this.tableData.findIndex(item => {
        return item.visitSn === this.currentVisitNumber
      })
      this.tableData.splice(index, 1)
      if (this.tableData.length) {
        this.$nextTick(_ => {
          this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
        })
      } else {
        this._initData()
      }
    },
    //  获取左侧列表数据
    getVisitSnList () {
      let params = Object.assign({ offset: this.offset, pagesize: this.pagesize }, this.listQueryObj)
      commonApi.getOutpatientDispenseListForCoordination(params).then(res => {
        if (res && res.list) {
          res.list.map(item => {
            item.addCount = 0
          })
          this.tableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            if (res.totalCount) {
              this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
            }
          })
        } else {
          this._initData()
        }
      })
    }
  },
  watch: {
    'dispenseType' (v) {
      this._initData()
      if (v === 'opd') {
        this.listQueryObj.implementType = 2
        this.getVisitSnList()
      } else {
        this.listQueryObj.implementType = 1
        this.getVisitSnList()
      }
    },
    '$route' (v) {
      this._router(v)
      this.dispenseType = 'opd'
    },
    '$store.state.dispensing.doorData' (v) {
      if (v.implementType === this.listQueryObj.implementType) {
        let index = this.tableData.findIndex(item => {
          return item.visitSn === v.visitSn
        })
        if (index > -1) {
          let count = this.tableData[index].addCount + 1
          this.$set(this.tableData[index], 'addCount', count)
          this.handleDetails()
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
            if (!this.tableData.length) {
              this.getVisitSnList()
            }
            this.tableData.unshift(v)
            this.tableData[0].addCount = 0
            let count = this.tableData[0].addCount + 1
            this.$set(this.tableData[0], 'addCount', count)
            this.handleDetails()
          }
          // this.getVisitSnList()
        }
      }
    },
    'currentVisitNumber' (v) {
      this.getOutPatientSkinTest(v)
    }
  },
  components: {
    dispenSearch,
    patientHeader,
    checkInformation,
    historyBtn,
    wastPrescription,
    chinesePrescription,
    JcpPrint,
    receiptMail,
    mailDialog
  }
}
</script>

<style scoped lang="scss">
#opd .dispense_container .pr-r{
  height: calc(100vh - 110px);
  /deep/ .presciptbox{
    background: none;
    padding-bottom: 0;
    box-shadow: 0 0 0;
    height: calc(100vh - 185px);
    /deep/ .statusbox{
      height: auto; overflow: hidden;
      background: #fff;
      padding-bottom: 10px;
      margin-bottom: 20px;
      margin-top: 0;
      .patient_title{
        font-size: 18px;
        font-weight: bold;
        border-left: 5px solid #1c7bef;
        padding-left: 10px;
        height: 40px;
        line-height: 40px;
        box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.2)
      }
      /deep/ .patient_list{
        padding: 0;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 0px;
      }
      /deep/ .patient_footer{
        position: inherit;
      }
    }
  }
}
.font.red {
  position: absolute;
  right: 0;
  transform: scale(0.7, 0.7);
  font-weight: bold;
  display: inline-block;
}
</style>
