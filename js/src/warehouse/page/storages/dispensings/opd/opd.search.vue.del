<template>
  <div id="opd">
    <el-container class="hospital-container">
      <div class="custom-search-component" :class="searchClassName">
        <dispen-search
          ref="search"
          placeholder="处方单号/患者姓名"
          @searchQuery="handleSearch"
        >
        </dispen-search>
      </div>
    </el-container>
    <!-- <everNoData v-if="!tableData.currentOutpatientDispense.length && !tableData.prescription.notPrint.length && !tableData.prescription.print.length" class="no-data" tipTxt="暂无处方"></everNoData> -->
    <div v-if="tableData.currentOutpatientDispense.length || tableData.prescription.notPrint.length || tableData.prescription.print.length" class="dispense_container pos_re">

      <div class="pos_re">
        <patient-header :patientId="currentVisitPatientId" :visitNumber="currentVisitNumber" :code="PATIENT_HEAD"></patient-header>
        <history-btn @getLogList="getLogList"></history-btn>
      </div>
      <div class="patient_prescription" v-if="tableData.prescription.notPrint.length || tableData.prescription.print.length">
        <div class="patient_list">
          <!-- <div v-if="tableData.prescription.notPrint.length" class="patient_title">未打印处方单明细</div> -->
          <div v-if="tableData.prescription.notPrint.length" class="patient_box">
            <check-information
              :propData="tableData.currentOutpatientDispense.length ? tableData.currentOutpatientDispense[0].outpatientDispenseList[0] : (tableData.prescription.notPrint.length ? tableData.prescription.notPrint[0] : tableData.prescription.print[0])"
            ></check-information>
            <wast-prescription
              v-for="(bill, bindex) in tableData.prescription.notPrint"
              :key="bindex"
              :code="bill.recipeId"
              :isSelect="$refs.search.searchObj.recipeId === bill.recipeId"
              :identification="bill.identification"
              :itemId="bill.id"
              :date="bill.createTime"
              :excCode="bill.adviceExecuteId"
              :status="bill.status"
              :patientData="bill.outpatientDispenseItemList"
              :visitSn="bill.visitSn"
              @updateDispenseStatus="abnormal"
              @print="print"
              @sendPrint="handlerSendPrint"
            ></wast-prescription>
            <!-- <div class="patient_footer">
              <el-button type="primary">打印备药单</el-button>
            </div> -->
          </div>
          <!-- <div v-if="tableData.prescription.print.length" class="patient_title">异常处方明细</div> -->
          <div v-if="tableData.prescription.print.length" class="patient_title danger">以下为异常处方</div>
          <div v-if="tableData.prescription.print.length" class="patient_box">
            <check-information
              :propData="tableData.currentOutpatientDispense.length ? tableData.currentOutpatientDispense[0].outpatientDispenseList[0] : (tableData.prescription.notPrint.length ? tableData.prescription.notPrint[0] : tableData.prescription.print[0])"
            ></check-information>
            <wast-prescription
              v-for="(bill, bindex) in tableData.prescription.print"
              :key="bindex"
              :code="bill.recipeId"
              :isSelect="$refs.search.searchObj.recipeId === bill.recipeId"
              :identification="bill.identification"
              :itemId="bill.id"
              :date="bill.createTime"
              :excCode="bill.adviceExecuteId"
              :status="bill.status"
              :patientData="bill.outpatientDispenseItemList"
              @sendPrint="handlerSendPrint"
              @updateDispenseStatus="abnormal"
            ></wast-prescription>
          </div>
        </div>
      </div>
      <div class="patient_prescription" v-if="tableData.currentOutpatientDispense.length">
        <!-- <div class="patient_title danger">1122233333</div> -->
        <div class="patient_list" v-if="tableData.currentOutpatientDispenseClass.notError.length" v-for="(item, index) in tableData.currentOutpatientDispenseClass.notError" :key="index">
          <div class="patient_title">备药单号：{{item.code}}<span class="scrap" v-if="item.inUse === 2">（该备药单已作废）</span></div>
          <div class="patient_box">
            <check-information
              :propData="tableData.currentOutpatientDispense.length ? tableData.currentOutpatientDispense[0].outpatientDispenseList[0] : (tableData.prescription.notPrint.length ? tableData.prescription.notPrint[0] : tableData.prescription.print[0])"
            ></check-information>
            <wast-prescription
              v-for="(bill, bindex) in item.outpatientDispenseList"
              :key="bindex"
              :code="bill.recipeId"
              :isSelect="$refs.search.searchObj.recipeId === bill.recipeId"
              :identification="bill.identification"
              :itemId="bill.id"
              :date="bill.createTime"
              :excCode="bill.adviceExecuteId"
              :status="bill.status"
              :patientData="bill.outpatientDispenseItemList"
              :readOnly="item.inUse === 2"
              @sendPrint="handlerSendPrint"
              @updateDispenseStatus="abnormal"
            ></wast-prescription>
            <div class="patient_footer" v-if="$route.name === 'opdaccepting' && ([4, 5].includes(item.outpatientDispenseList[0].status)) && tableData.currentOutpatientDispenseClass.notError.length">
              <el-button type="primary"
                @click="chengsStatus(item.id, item.outpatientDispenseList[0].status, tableData.identification[index])"
              >{{item.outpatientDispenseList[0].status === 4 ? '备药完成' : '审核并发药'}}</el-button>
            </div>
          </div>
        </div>
        <div class="patient_list" v-if="tableData.currentOutpatientDispenseClass.error.length" v-for="(item, index) in tableData.currentOutpatientDispenseClass.error" :key="index">
          <div class="patient_title">备药单号：{{item.code}}<span class="scrap" v-if="item.inUse === 2">（该备药单已作废）</span></div>
          <div class="patient_box">
            <check-information
              :propData="tableData.currentOutpatientDispense.length ? tableData.currentOutpatientDispense[0].outpatientDispenseList[0] : (tableData.prescription.notPrint.length ? tableData.prescription.notPrint[0] : tableData.prescription.print[0])"
            ></check-information>
            <template
              v-if="item.outpatientDispenseListSuccess.length"
              v-for="(bill, bindex) in item.outpatientDispenseListSuccess"
            >
              <wast-prescription
                :key="bindex"
                :code="bill.recipeId"
                :isSelect="$refs.search.searchObj.recipeId === bill.recipeId"
                :identification="bill.identification"
                :itemId="bill.id"
                :date="bill.createTime"
                :excCode="bill.adviceExecuteId"
                :status="bill.status"
                :patientData="bill.outpatientDispenseItemList"
                :readOnly="item.inUse === 2"
                @sendPrint="handlerSendPrint"
                @updateDispenseStatus="abnormal"
              ></wast-prescription>
            </template>
            <div class="patient_title danger">以下为备药单中异常的处方</div>
            <template
              v-if="item.outpatientDispenseListError.length"
              v-for="(bill, bindex) in item.outpatientDispenseListError"
            >
              <wast-prescription
                :key="bindex"
                :code="bill.recipeId"
                :isSelect="$refs.search.searchObj.recipeId === bill.recipeId"
                :identification="bill.identification"
                :itemId="bill.id"
                :date="bill.createTime"
                :excCode="bill.adviceExecuteId"
                :status="bill.status"
                :readOnly="item.inUse === 2"
                :patientData="bill.outpatientDispenseItemList"
                @sendPrint="handlerSendPrint"
                @updateDispenseStatus="abnormal"
              ></wast-prescription>
            </template>
            <div class="patient_footer" v-if="$route.name === 'opdaccepting'">
              <el-button type="primary"
                v-if="[4, 5].includes(item.outpatientDispenseList[0].status) && item.outpatientDispenseListError.length && item.outpatientDispenseListSuccess.length"
                @click="chengsStatus(item.id, item.outpatientDispenseList[0].status, true)"
              >重打备药单</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <control-record-dialog :recordData="controlData" :visible.sync="controlDialogVisible"></control-record-dialog>
  </div>
</template>

<script>
// 收方发药
import api from '../../store/clinicapi'
import { PATIENT_HEAD, TRADITIONAL_CHINESE_MEDICINE, CHINESE_PATENT_MEDICINE } from '@/util/common'
import dispenSearch from '../components/dispen.search'
import wastPrescription from '@/warehouse/page/storages/dispensings/components/west.prescription'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import checkInformation from '@/warehouse/page/storages/dispensings/components/check.information.vue'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import storage from '@/util/storage'
import controlRecordDialog from '@/warehouse/page/storages/components/controlrecorddialog'

const typeCollection = {
  opdaccepting: {
    api: 'getByAdviceDispense'
  },
  opdsearch: {
    api: 'searchByAdviceDispense'
  }
}

export default {
  components: {
    dispenSearch,
    wastPrescription,
    patientHeader,
    historyBtn,
    checkInformation,
    controlRecordDialog
  },
  mixins: [getStorage],
  data () {
    return {
      api,
      PATIENT_HEAD,
      TRADITIONAL_CHINESE_MEDICINE,
      CHINESE_PATENT_MEDICINE,
      isAfterInquiry: false,
      currentVisitPatientId: '',
      currentVisitNumber: '',
      publicPrintStatus: false,
      controlDialogVisible: false,
      controlData: [], // 操作记录数据
      printOptions: {
        id: [],
        visitSns: []
      },
      defaultSearch: false,
      tableData: {
        controlDialogVisible: false,
        currentOutpatientDispense: [],
        currentOutpatientDispenseClass: {
          notError: [],
          error: []
        },
        prescription: {
          notPrint: [],
          print: []
        },
        identification: []
      }
    }
  },
  watch: {
    '$route' () {
      this.$refs.search.searchObj = {}
      this.$refs.search.searchValue = ''
      this.tableData = {
        controlDialogVisible: false,
        currentOutpatientDispense: [],
        currentOutpatientDispenseClass: {
          notError: [],
          error: []
        },
        prescription: {
          notPrint: [],
          print: []
        },
        identification: []
      }
      this.$nextTick(_ => {
        this._getCursor()
      })
    }
  },
  computed: {
    searchClassName () {
      if (this.$route.name === 'opdsearch') return 'searchClassName'
      return ''
    }
  },
  methods: {
    print (data) {
      if (data.status) {
        this.printOptions.id.push(data.id)
        this.printOptions.visitSns.push(data.visitSn)
      } else {
        const index = this.printOptions.id.indexOf(data.id)
        this.printOptions.id.splice(index, 1)
        this.printOptions.visitSns.splice(index, 1)
      }
      // let listQueryObj = {
      //   implementType: 2,
      //   identification: ''
      // }
    },
    chengsStatus (id, status, identification) {
      let type = 'updateDispenseStatus'
      const params = {
        dispenseId: id
      }
      if (!identification) {
        type = 'repeatDispensePrint'
        params.storageRoomId = this.storageId
      } else {
        params.status = status + 1
      }
      api[type](params)
        .then(res => {
          this.handleSearch(this.$refs.search.searchObj)
        })
    },
    abnormal (data) {
      if (data) {
        this.handleSearch(this.$refs.search.searchObj)
      }
    },
    getLogList () {
      this.api.getLogList({ visitSn: this.tableData.currentOutpatientDispense[0] ? this.tableData.currentOutpatientDispense[0].outpatientDispenseList[0].visitSn : (this.tableData.prescription.notPrint[0] ? this.tableData.prescription.notPrint[0].visitSn : this.tableData.prescription.print[0].visitSn) }).then(res => {
        if (res && res.dispenseLogListJson) {
          this.controlData = res.dispenseLogListJson
          this.handleLogList(this.controlData)
          this.controlDialogVisible = true
        }
      })
    },
    handleLogList (data) {
      data.forEach(val => {
        if (val.dispenseLog.action !== '标记异常') {
          let _excute = []
          let _recipe = []
          val.dispenseLogListItemJson.forEach(v => {
            if (v.outpatientDispense.adviceExecuteId) {
              _excute.push(v.outpatientDispense.adviceExecuteId)
            } else if (v.outpatientDispense.recipeId) {
              _recipe.push(v.outpatientDispense.recipeId)
            }
          })
          val['_excute'] = _excute
          val['_recipe'] = _recipe
        }
      })
    },
    _strSubstring (str) {
      return /^(F|OTC)/.test(str)
    },
    handleSearch (data) {
      if (!data.recipeId && !data.patient && (this.$route.name === 'opdsearch' && !data.code)) {
        this.$messageTips(this, 'warning', '请输入需要查询的处方单号或患者')
        return
      }

      const params = {
        storageRoomId: this.storageId
      }
      if (data.recipeId) {
        if (this.$route.name === 'opdsearch') {
          params.code = data.recipeId
        } else {
          params.recipeId = data.recipeId
        }
      } else if (data.code) {
        params.code = data.code
      } else {
        params.patientId = data.patient.id
      }
      api[typeCollection[this.$route.name].api](params)
        .then(res => {
          if (!res.length) {
            let errText = '暂无处方！'
            // if (data.patient) {
            //   errText = '当前患者无处方单据！'
            // } else if (data.code) {
            //   errText = '无该备药单！'
            // } else {
            //   errText = '该处方还未备药，暂不能进行发药！'
            // }
            this.$messageTips(this, 'warning', errText, '')
            return
          }
          this.tableData = {
            controlDialogVisible: false,
            currentOutpatientDispense: [],
            prescription: {
              notPrint: [],
              print: []
            },
            currentOutpatientDispenseClass: {
              notError: [],
              error: []
            },
            identification: []
          }
          if ((this.$route.name === 'opdsearch' && params.code && !data.queryType) || this.$route.name === 'opdaccepting') {
            if (res.length) {
              this.currentVisitPatientId = res[0].outpatientDispenseList[0].patientId
              this.currentVisitNumber = res[0].outpatientDispenseList[0].visitSn
              this.tableData.currentOutpatientDispense = res
              this.tableData.currentOutpatientDispense.map((item, index) => {
                const _success = []
                const _error = []
                let identification = true
                for (let i in item.outpatientDispenseList) {
                  const bill = item.outpatientDispenseList[i]
                  if (bill.identification) {
                    identification = false
                    _error.push(bill)
                  } else {
                    _success.push(bill)
                  }
                }
                // outpatientDispenseList.concat(_error)
                // const arr = [].concat(outpatientDispenseList).concat(_error)

                if (identification) {
                  this.tableData.currentOutpatientDispenseClass.notError.push(item)
                } else {
                  item.outpatientDispenseListSuccess = _success
                  item.outpatientDispenseListError = _error
                  this.tableData.currentOutpatientDispenseClass.error.push(item)
                }
                // console.log(item.outpatientDispenseList, '------')
                // console.log(_item.outpatientDispenseList, '=======')
                // return _item
              })
            }
          } else {
            if (res.length) {
              this.currentVisitPatientId = res[0].patientId
              this.currentVisitNumber = res[0].visitSn
            }
            // this.tableData.prescription = res
            res.map((item, index) => {
              let identification = false // outpatientDispenseItemList
              for (let i = 0; i < item.outpatientDispenseItemList.length; i++) {
                if (item.outpatientDispenseItemList[i].identification === 1) {
                  identification = true
                  break
                }
              }

              if (!identification) {
                this.tableData.prescription.notPrint.push(item)
              } else {
                this.tableData.prescription.print.push(item)
              }
            })
          }
        })
    },
    handleAfterInquiry () {
      this.isAfterInquiry = false
    },
    billIsError (item, bill) {
      item.isErrors = true
      return bill
    },
    checkSearchConfig (str) {
      // 默认
      let tempFlag = 'dialog'
      // 首次请求
      if (this.tableData.currentOutpatientDispense.length === 0) tempFlag = 'fetch'
      // 检查已收处方中是否有未发药的处方单
      if (str) {
        if (this.tableData.currentOutpatientDispense.length) {
          this.tableData.currentOutpatientDispense.forEach(v => {
            if (v[0].recipeId === str || v[0].adviceExecuteId === str) {
              tempFlag = 'exist'
            }
          })
        }
        // 检查未收处方中是否已存在当前查询的处方单号
        if (this.tableData.uncollectedOutpatientDispense.length) {
          let pushFlag = false
          this.tableData.uncollectedOutpatientDispense.forEach(v => {
            if (v[0].recipeId === str || v[0].adviceExecuteId === str) {
              // 记录当前数据的index
              tempFlag = 'push'
              // 状态为待发药 需要添加到已收处方列表中 - *状态不做控制*
              // if (v[0].status === 5) {
              pushFlag = true
              this.tableData.currentOutpatientDispense.push(v)
              // }
            }
          })
          // 从未收处方中移除已添加到已收处方的列表中
          if (pushFlag) {
            this.tableData.uncollectedOutpatientDispense = this.tableData.uncollectedOutpatientDispense.filter(v => {
              return v[0].recipeId !== str && v[0].adviceExecuteId !== str
            })
          }
        }
      }
      return tempFlag
    },
    _getCursor () {
      this.$nextTick(() => {
        this.$refs.search.$el.querySelectorAll('input.el-input__inner')[0].focus()
      })
    }
  },
  created () {
    // console.log(, storage.removeLocalStorage, this.$route.query)
    if (this.$route.name === 'opdsearch') {
      let data = storage.getLocalStorage('opdsearch')
      if (data) {
        storage.removeLocalStorage('opdsearch')
        data = JSON.parse(data)
        this.defaultSearch = data.patient ? data.patient.name : data.recipeId
        this.handleSearch(data)
      }
    }
  },
  mounted () {
    if (this.defaultSearch) {
      this.$refs.search.changeSearchValue(this.defaultSearch)
      this.defaultSearch = false
    } else {
      this._getCursor()
    }
  }
}
</script>

<style scoped>
#opd .dispense_container .patient_prescription{
  height: calc(100vh - 295px);
  padding-bottom: 0;
}
.patient_title{
  /* margin-bottom: 10px; */
}
.patient_list{
  padding: 0 !important;
}
.patient_box{
  margin: 0 15px;
}
.patient_box > .patient_footer{
  position: relative !important;
  left: 0 !important;
  bottom: 0 !important;
  padding: 15px 0 !important;
}
#opd >>> .hospital-container .hospital-search > .el-col-18{
  width: 75%;
}
#opd >>> .el-input {
  width: 100%;
}
.patient_box > .patient_title{
  border-left: none !important;
  padding-left: 0 !important;
}
span.scrap{
  padding-left: 15px !important;
  color: #999 !important;
}
</style>
