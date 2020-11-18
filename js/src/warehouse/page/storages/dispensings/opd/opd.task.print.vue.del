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
          <li :class="[dispenseType === 'mail' ? 'is-active' : '']" @click="dispenseType = 'mail'">发药邮寄</li>
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
            class="no-border"
            :height="listHeight"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @row-click="handleDetails">
            <el-table-column
              v-if="!listQueryObj.identification && listQueryObj.identification === 0"
              width="32"
              align="center"
              type="selection">
            </el-table-column>
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
          <div class="dispense_footer" v-if="!listQueryObj.identification && listQueryObj.outOfStock !== 23 && tableData.length">
            <el-button @click="batchPrint" type="text">批量打印</el-button>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="pr-r" v-if="tablePatientData.newArr">
        <!-- 患者信息 -->
        <div class="pos_re" v-if="currentVisitPatientId">
          <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
          <history-btn :visitSn="currentVisitNumber" :implementType="listQueryObj.implementType"></history-btn>
        </div>
        <!-- 诊断基本信息 -->
        <div class="patient_prescription" :style="autoCalcHeight">
          <receipt-mail :itemData="[...tablePatientData.errArr, ...tablePatientData.newArr]" v-if="[...tablePatientData.errArr, ...tablePatientData.newArr][0].mailFlag && [...tablePatientData.errArr, ...tablePatientData.newArr][0].mailAddressObject" style="marginLeft: -15px;"></receipt-mail>
          <div class="patient_title f_bold" v-if="tablePatientData.errArr && tablePatientData.errArr.length && $route.name != 'abnormalprint'">异常处方</div>
          <!-- 检查信息 -->
          <!-- <div class="doctor-info">
            <check-information :propData="tablePatientData.newArr[0] || tablePatientData.errArr[0]" :outTest.sync="skinTest"></check-information>
          </div> -->
          <div class="patient_list" v-for="(item, index) in tablePatientData.newArr" :key="index">
            <!--正常处方 单个处方详情信息 -->
            <chinese-prescription
              :doctorData="tablePatientData.newArr[0] || tablePatientData.errArr[0]"
              :isPrint="true"
              @print="selectPrint"
              :opdData="item"
              @updateDispenseStatus="updateDispenseStatus"
              :patientData="item.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(item.adviceType)"></chinese-prescription>
            <wast-prescription
              v-else
              :doctorData="tablePatientData.newArr[0] || tablePatientData.errArr[0]"
              :itemData="item"
              :itemId="item.id"
              :isPrint="true"
              :mailData="item"
              :date="item.createTime"
              :identification="item.identification"
              :status="item.status"
              :outOfStock="item.outOfStock"
              :patientData="item.outpatientDispenseItemList"
              @updateDispenseStatus="updateDispenseStatus"
              @print="selectPrint"
              :outTest="outTest"
              :testResult="testResult">
            </wast-prescription>
          </div>
          <div class="patient_footer" v-if="!listQueryObj.identification && listQueryObj.outOfStock !== 23 && tablePatientData.newArr.length">
            <el-checkbox class="fl ml15 mt10" v-model="all" @change="handleCheckAll">全选</el-checkbox>
            <el-button type="primary" @click="updateDispensePrint" :loading="dispensePrintLoading" class="patient_btn_width">打印</el-button>
          </div>
          <div class="patient_list design_error_table" v-for="(item, index) in tablePatientData.errArr" :key="index">
            <!--异常处方 单个处方详情信息 -->
            <chinese-prescription
              @print="selectPrint"
              :doctorData="tablePatientData.newArr[0] || tablePatientData.errArr[0]"
              :opdData="item"
              @updateDispenseStatus="updateDispenseStatus"
              :patientData="item.outpatientDispenseItemList"
              v-if="CHINESE_MEDICINE_TYPE.includes(item.adviceType)"></chinese-prescription>
            <wast-prescription
              v-else
              :doctorData="tablePatientData.newArr[0] || tablePatientData.errArr[0]"
              :itemData="item"
              :itemId="item.id"
              :date="item.createTime"
              :identification="item.identification"
              :status="item.status"
              :patientData="item.outpatientDispenseItemList"
              @updateDispenseStatus="updateDispenseStatus"
              :outTest="outTest"
              :testResult="testResult">
            </wast-prescription>
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
import storage from '@/util/storage'
import { PATIENT_HEAD, CHINESE_MEDICINE_TYPE } from '@/util/common'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import setName from '@/util/setstatusname'
import receiptMail from '../components/receiptmail'
import skinTestMixins from '../mixins/skinTest.mixins'
import './index.scss'

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
      all: true,
      tableData: [],
      CHINESE_MEDICINE_TYPE,
      tablePatientData: {},
      selectVisitSnList: [],
      checkedRecipeId: [],
      totalCount: 0,
      offset: 0,
      pagesize: 20,
      currentPage: 1,
      PATIENT_HEAD,
      cachaOutpatientDispenseIds: '', // 缓存当前点击的处方单 转成String
      currentVisitPatientId: '', // 当前选中患者patientId
      currentVisitNumber: '', // 当前门诊号
      currentVisitSn: '',
      batchPrintLoading: false,
      dispensePrintLoading: false,
      dispenseType: 'opd' // 发药类型
    }
  },
  created () {
    this.listQueryObj.storageRoomId = this.storageId
    this._router(this.$route)
  },
  computed: {
    autoCalcHeight () {
      return { height: `calc(100vh - ${this.$route.name === 'opdtaskprint' ? 265 : 280}px)` }
    },
    listHeight () {
      return this.$route.name === 'abnormalprint' ? `calc(100vh - 200px)` : `calc(100vh - 240px)`
    }
  },
  methods: {
    _router (v) {
      if (this.listQueryObj.outOfStock === 23) delete this.listQueryObj.outOfStock
      if (this.listQueryObj.searchType) delete this.listQueryObj.searchType
      if (v.name === 'abnormalprint') {            //  异常处方
        this.listQueryObj.identification = 1
        this.listQueryObj.isPrint = ''
        this.listQueryObj.searchType = 3
      } else if (v.name === 'opdtaskprint') {      //  正常处方
        this.listQueryObj.identification = 0
        this.listQueryObj.isPrint = 1
      } else if (v.name === 'opdshortage') {      //   缺货处方
        this.listQueryObj.identification = ''
        this.listQueryObj.outOfStock = 23
        this.listQueryObj.isPrint = 1
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
      let index = this.checkedRecipeId.findIndex(item => {
        return item.id === v.id
      })
      let newArrIndex = this.tablePatientData.newArr.findIndex(item => {
        return item.id === v.id
      })
      if (v && v.status) {
        this.checkedRecipeId.push(v)
      } else {
        this.checkedRecipeId.splice(index, 1)
      }
      this.tablePatientData.newArr[newArrIndex]['checked'] = v.print
      this.all = this.checkedRecipeId.length === this.tablePatientData.newArr.length
    },
    handleCheckAll (val) {
      if (val) {
        this.checkedRecipeId = [...this.tablePatientData.newArr]
      } else {
        this.checkedRecipeId = []
      }
      this.tablePatientData.newArr.forEach(item => {
        item.checked = val
      })
    },
    updateDispenseStatus (obj) {
      this.handleDetails()
      // if (this.listQueryObj.identification === 1 && this.tablePatientData.errArr.length === 1) {
      // if (this.tablePatientData.errArr[0].outpatientDispenseItemList.every(item => item.identification === 1)) return this._listClickOne()
      // }
    },
    async batchPrint () {     //  批量打印
      if (this.selectVisitSnList.length) {
        let params = Object.assign({
          isPrint: 1,
          visitSns: this.selectVisitSnList
        }, this.listQueryObj)
        this.batchPrintLoading = true
        await commonApi.updateDispensePrint(params).then(res => {
          if (res && res.dispenseVoList && res.dispenseVoList.length) {
            // 打印数据收集 start
            this.nonPaternal = []
            this.fatherAdvice = []
            this.drugTableData = []
            res.dispenseVoList.forEach(patientData => { // 挂号单维度数据
              let dispensingList = []
              patientData.outpatientDispenseList && patientData.outpatientDispenseList.forEach(printData => { // 药品明细数据
                let advice = []
                printData.outpatientDispenseItemList.forEach(drugData => {
                  // 按照人或者visitSn维度的（挂号的）备药单  添加一个人的所有备药单明细信息
                  dispensingList.push(Object.assign(drugData, { id: printData.id }))
                  // 父子医嘱
                  if ([1, 2].includes(drugData.isMine)) {
                    advice.push(drugData)
                  } else {
                    this.nonPaternal.push({
                      adviceType: printData.adviceType,
                      storageRoomObj: patientData.storageRoomObject,
                      tableData: Object.assign(drugData, { doctorData: { doctorName: printData.doctorName } }),
                      patientObj: Object.assign(patientData.patientObject, { hospitalizedNumber: patientData.hospitalizedNumber, visitSn: this.currentVisitNumber })
                    })
                  }
                })
                if (advice.length) {
                  this.fatherAdvice.push({
                    adviceType: printData.adviceType,
                    tableData: advice,
                    barCode: patientData.code,
                    patientObj: Object.assign(patientData.patientObject, { hospitalizedNumber: patientData.hospitalizedNumber, visitSn: this.currentVisitNumber })
                  })
                }
              })
              // 按人维度添加备药单  一个人一个单
              this.drugTableData.push({
                adviceType: patientData.adviceType,
                tableData: dispensingList,
                patientObj: Object.assign(patientData.patientObject, { barCode: patientData.code, hospitalizedNumber: patientData.hospitalizedNumber, visitSn: this.currentVisitNumber })
              })
            })
            // 打印数据收集 end
            this.$nextTick(_ => {
              this.handlerPrint()
            })
            this.$messageTips(this, 'success', '批量打印成功')
            this.getVisitSnList()
          }
        })
        this.batchPrintLoading = false
      }
    },
    async updateDispensePrint () {    //  打印处方单
      let outpatientDispenseIds = []
      this.checkedRecipeId.forEach(item => {
        outpatientDispenseIds.push(item.id)
      })
      const outpatientDispenseIdsString = outpatientDispenseIds.join('')
      if (outpatientDispenseIdsString === this.cachaOutpatientDispenseIds) return
      this.cachaOutpatientDispenseIds = outpatientDispenseIdsString
      if (!outpatientDispenseIds.length) {
        this.$messageTips(this, 'warning', '您当前没有选择处方，请选择处方后再点击打印')
        return
      }
      let params = Object.assign({
        outpatientDispenseIds: outpatientDispenseIds,
        isPrint: 1,
        visitSns: [this.currentVisitNumber]
      }, this.listQueryObj)
      this.dispensePrintLoading = true
      await commonApi.updateDispensePrint(params).then(res => {
        if (res && res.dispenseVoList) {
          //  调用打印
          const dispenseVoList = res.dispenseVoList[0].outpatientDispenseList
          const patientObject = res.dispenseVoList[0].patientObject
          const storageRoomObject = res.dispenseVoList[0].storageRoomObject
          this.gatherPrintData({
            outpatientDispenseInfo: dispenseVoList,
            storageRoomObject,
            patientObject: Object.assign(patientObject, { barCode: res.dispenseVoList[0].code, visitSn: this.currentVisitNumber })
          })
          //  打印完成 更新页面数据
          this.$messageTips(this, 'success', '打印成功')
          //  判断待打印数据是否已经打印完  删除左边列表当前👈数据
          if (res.dispenseVoList[0].outpatientDispenseList.length === this.tablePatientData.newArr.length && !this.tablePatientData.errArr.length) {
            this._listClickOne()
          } else {
            //  右边👉数据还有没打的  更新当前右侧数据
            this.handleDetails()
          }
        } else {
          this.handleDetails()
        }
      })
      this.dispensePrintLoading = false
    },
    handleSelectionChange (v) {
      this.selectVisitSnList = []
      v.forEach(item => {
        item && this.selectVisitSnList.push(item.visitSn)
      })
    },
    handleDetails (data) {
      let params
      // 点击列表选中checkbox
      this.$refs.opdTable.toggleRowSelection(data)
      if (data) {
        data.addCount = 0
        this.currentVisitPatientId = data.patientId
        this.currentVisitNumber = data.visitSn
        // 金祥说异常处方页面调用这个接口需要传  searchType: 3  其他地方不一定需要  2019.4.15.4：53
        params = Object.assign({ isPrint: data.isPrint, visitSn: data.visitSn, mailFlag: data.mailFlag }, this.listQueryObj)
      } else {
        params = Object.assign({ isPrint: 1, visitSn: this.currentVisitNumber, mailFlag: 0 }, this.listQueryObj)
      }
      if (!params.visitSn) return
      commonApi.getDispenseByVisitSn(params).then(res => {
        if (res && res.length) {
          this.tablePatientData = Object.assign({}, this._findArray(res, 'identification'))
          this.checkedRecipeId = [...this.tablePatientData.newArr]
          this.all = true
        } else {
          this._listClickOne()
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
          this.$refs.opdTable && this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
        })
      } else {
        this._initData()
      }
    },
    getVisitSnList () {
      let params = Object.assign({ isPrint: 1, offset: this.offset, pagesize: this.pagesize, mailFlag: 0 }, this.listQueryObj)
      commonApi.getDispenseVisitSnList(params).then(res => {
        if (res && res.list) {
          res.list.map(item => {
            item.addCount = 0
          })
          this.tableData = res.list
          this.totalCount = res.totalCount
          this.$nextTick(_ => {
            if (res.totalCount) {
              this.$refs.opdTable && this.$refs.opdTable.$el.querySelectorAll('.el-table__row')[0].click()
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
      let type
      let mail
      if (v === 'opd') {
        type = 2
        mail = 0
      } else if (v === 'ipd') {
        type = 1
        mail = 0
      } else {
        type = ''
        mail = 1
      }
      this.listQueryObj.implementType = type
      this.listQueryObj.mailFlag = mail
      this.getVisitSnList()
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
              setTimeout(_ => {
                this.getVisitSnList()
              })
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
    receiptMail
  }
}
</script>

<style lang="scss" scoped>
#opd .dispense_container .pr-l .dispense_tabs li {
  width: 33%;
}
.pr-l .patient_footer /deep/ .pos_ab {
  position: absolute;
}
.receipt-info {
  height: 30px;
  line-height: 30px;
  padding: 5px 15px;
}
.border1 {
  height: 30px;
  border-bottom: 1px solid #999;
}
.receipt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
}
.ml6 {
  margin-left: 6px;
}
.patient_prescription {
  background: #fff;
  padding: 15px!important;
  padding-bottom: 60px!important
}
.patient_prescription .patient_list {
  padding: 0!important
}
#opd .dispense_container .pr-r .patient_prescription .patient_footer {
  width: calc(100vw - 342px);
}
.font.red {
  position: absolute;
  right: 0;
  transform: scale(0.7, 0.7);
  font-weight: bold;
  display: inline-block;
}
</style>
