<template>
  <div id="opd" v-loading.fullscreen.lock="fullscreenLoading">
    <el-container class="hospital-container">
      <div class="custom-search-component">
        <dispen-search ref="search" placeholder="处方单号/患者姓名" @searchQuery="handleSearch"></dispen-search>
      </div>
    </el-container>
    <div
      v-if="tableData.currentOutpatientDispense.normal.length || tableData.currentOutpatientDispense.abnormal.length"
      class="dispense_container pos_re"
    >
      <div class="pos_re">
        <patient-header
          :patientId="currentVisitPatientId"
          :visitNumber="currentVisitNumber"
          :code="PATIENT_HEAD"
        ></patient-header>
        <history-btn @getLogList="getLogList"></history-btn>
      </div>
      <div class="patient_prescription">
        <div
          :class="[select[item.id].select ? 'select' : '', 'patient_list']"
          v-for="(item, index) in tableData.currentOutpatientDispense.normal.concat(tableData.currentOutpatientDispense.abnormal)"
          :key="index"
        >
          <receipt-mail
            style="marginLeft: -15px;"
            :itemData="[...item.normal, ...item.abnormal]"
            v-if="[...item.normal, ...item.abnormal] && [...item.normal, ...item.abnormal][0].mailFlag && [...item.normal, ...item.abnormal][0].mailAddressObject"
          ></receipt-mail>
          <div class="patient_title f_bold">
            备药单号：{{item.code}}
            <span class="scrap" v-if="item.inUse === 2">（该备药单已作废）</span>
            <span class="scrap" v-else-if="item.oldCode">（原单号：{{item.oldCode}}）</span>
          </div>
          <div class="patient_box">
            <!-- <check-information
                :propData="patientData"
            ></check-information>-->
            <div v-for="(bill, bindex) in item.normal.concat(item.cancel)" :key="bindex">
              <chinese-prescription
                :doctorData="patientData"
                :key="bindex"
                :opdData="bill"
                @updateDispenseStatus="abnormal($event, item.code)"
                :patientData="bill.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"
              ></chinese-prescription>
              <wast-prescription
                :doctorData="patientData"
                :key="bindex"
                v-else
                :code="bill.recipeCode"
                :isSelect="bill.select"
                :identification="bill.identification"
                :itemId="bill.id"
                :itemData="bill"
                :mailState="bill.mailFlag"
                :date="bill.createTime"
                :excCode="bill.adviceExecuteId"
                :status="bill.status"
                :patientData="bill.outpatientDispenseItemList"
                :readOnly="item.inUse === 2"
                :patientObject="item.patientObject"
                :storageRoomObject="item.storageRoomObject"
                :visitSn="bill.visitSn"
                :outTest="outTest"
                :testResult="testResult"
                @sendPrint="handlerSendPrint"
                @updateDispenseStatus="abnormal($event, item.code)"
              ></wast-prescription>
            </div>
            <div v-if="item.abnormal.length" class="patient_title f_bold mt10">以下为备药单中异常的处方</div>
            <div class="design_error_table" v-for="(bill, bindex) in item.abnormal" :key="bindex">
              <chinese-prescription
                :key="bindex"
                :doctorData="patientData"
                :opdData="bill"
                @updateDispenseStatus="abnormal($event, item.code)"
                :patientData="bill.outpatientDispenseItemList"
                v-if="CHINESE_MEDICINE_TYPE.includes(bill.adviceType)"
              ></chinese-prescription>
              <wast-prescription
                v-else
                :doctorData="patientData"
                :code="bill.recipeCode"
                :isSelect="bill.select"
                :identification="bill.identification"
                :itemId="bill.id"
                :itemData="bill"
                :mailState="bill.mailFlag"
                :date="bill.createTime"
                :excCode="bill.adviceExecuteId"
                :status="bill.status"
                :patientData="bill.outpatientDispenseItemList"
                :readOnly="item.inUse === 2"
                :patientObject="item.patientObject"
                :storageRoomObject="item.storageRoomObject"
                :visitSn="bill.visitSn"
                :outTest="outTest"
                :testResult="testResult"
                @sendPrint="handlerSendPrint"
                @updateDispenseStatus="abnormal($event, item.code)"
              ></wast-prescription>
            </div>
            <template v-if="!item.abnormal.length && !item.cancel.length">
              <div class="patient_footer">
                <el-button
                  type="primary"
                  @click="chengsStatus(item.id, item)"
                  v-if="[4, 5].includes(item.normal[0].status)"
                >{{item.normal[0].status === 4 ? '备药完成' : '审核并发药'}}</el-button>
              </div>
            </template>
            <template v-else>
              <div class="patient_footer">
                <el-button
                  type="primary"
                  v-if="[4, 5, 7].includes(item.abnormal.concat(item.cancel)[0].status) && item.normal.length"
                  @click="clear(item.id)"
                >重打备药单</el-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 邮寄组件 -->
    <mail-dialog
      :popData="popData"
      :visible.sync="dialogVisibleMail"
      :isClick="isClick"
      @sendMedicine="sendMedicine"
    ></mail-dialog>
    <control-record-dialog :recordData="controlData" :visible.sync="controlDialogVisible"></control-record-dialog>
    <jcp-print
      :key="jcpKey"
      ref="jcpPrint"
      hospitalType="1"
      :drugTableData="drugTableData"
      :nonPaternal="nonPaternal"
      :printPatientObj="printPatientObj"
      :fatherAdvice="fatherAdvice"
    ></jcp-print>
  </div>
</template>

<script>
// 收方发药
import api from '../../store/clinicapi'
import { PATIENT_HEAD, CHINESE_MEDICINE_TYPE } from '@/util/common'
import dispenSearch from '../components/dispen.search'
import wastPrescription from '@/warehouse/page/storages/dispensings/components/west.prescription'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import checkInformation from '@/warehouse/page/storages/dispensings/components/check.information.vue'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import controlRecordDialog from '@/warehouse/page/storages/components/controlrecorddialog'
import drugPrintMixins from '@/warehouse/page/storages/util/drugprintmixinsnew'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import receiptMail from '../components/receiptmail'
import mailDialog from '@/warehouse/page/storages/components/maildialog'
import chinesePrescription from '../components/chinese.prescription'
import skinTestMixins from '../mixins/skinTest.mixins'

export default {
  components: {
    receiptMail,
    mailDialog,
    dispenSearch,
    wastPrescription,
    patientHeader,
    historyBtn,
    checkInformation,
    controlRecordDialog,
    chinesePrescription,
    JcpPrint
  },
  mixins: [getStorage, drugPrintMixins, skinTestMixins],
  data () {
    return {
      api,
      PATIENT_HEAD,
      popData: {},
      isClick: false,
      dialogVisibleMail: false, // 邮寄信息弹窗
      CHINESE_MEDICINE_TYPE,
      currentVisitPatientId: '',
      fullscreenLoading: false,
      currentVisitNumber: '',
      tableData: {
        currentOutpatientDispense: {
          normal: [],
          abnormal: []
        }
      },
      // noRecipe: false,
      select: {},
      status: null,
      controlDialogVisible: false,  // *
      controlData: [] // 操作记录数据    *
    }
  },
  watch: {
    'currentVisitNumber' (v) {
      this.getOutPatientSkinTest(v)
    }
  },
  computed: {
    patientData () {
      return this.tableData.currentOutpatientDispense.normal.length ? this.tableData.currentOutpatientDispense.normal[0].normal[0] || this.tableData.currentOutpatientDispense.normal[0].abnormal[0] : this.tableData.currentOutpatientDispense.abnormal[0].abnormal[0] || this.tableData.currentOutpatientDispense.abnormal[0].normal[0]
    }
  },
  methods: {
    initTableData () {
      this.tableData = {
        currentOutpatientDispense: {
          normal: [],
          abnormal: []
        }
      }
    },
    sendMedicine (v, id, status) {
      let params = {
        dispenseId: id,
        status: status + 1,
        expressInformationList: v
      }
      const position = this.select[id].position
      api.updateDispenseStatus(params).then(res => {
        if (res.flag) {
          this.tableData.currentOutpatientDispense[position[0]][position[1]].normal.map(item => {
            item.status = params.status
            return item
          })
          this.dialogVisibleMail = false
          this.$messageTips(this, 'success', '发药成功', '')
        }
      })
    },
    async chengsStatus (billId, data) {
      if (data.normal[0].status === 4 || data.normal[0].status === 5 && !data.normal[0].mailFlag && !data.normal[0].mailAddressObject) {
        const params = {
          dispenseId: data.id,
          status: data.normal[0].status + 1
        }
        const position = this.select[billId].position
        if (!this.select[billId].dispenseIdList.length) {
          this.$messageTips(this, 'warning', '请先扫描处方再扫描备药单', '')
        } else if (this.select[billId].dispenseIdList.length < this.tableData.currentOutpatientDispense[position[0]][position[1]].normal.length) {
          try {
            await this.$confirm(`该备药单下还有未收的处方，确认要直接${params.status === 5 ? '备药' : '发药'}？`, '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            api.updateDispenseStatus(params)
              .then(res => {
                this.tableData.currentOutpatientDispense[position[0]][position[1]].normal.map(item => {
                  item.status = params.status
                  return item
                })
                this.$messageTips(this, 'success', `${params.status === 5 ? '备药' : '发药'}成功`, '')
              })
          } catch (err) { }
        } else {
          api.updateDispenseStatus(params).then(res => {
            this.tableData.currentOutpatientDispense[position[0]][position[1]].normal.map(item => {
              item.status = params.status
              return item
            })
            this.$messageTips(this, 'success', `${params.status === 5 ? '备药' : '发药'}成功`, '')
          })
        }
      } else {
        this.dialogVisibleMail = true
        this.popData = data
        this.isClick = true
      }
    },
    clear (billId) {
      const params = {
        dispenseId: billId,
        storageRoomId: this.storageId
      }
      const position = this.select[billId].position
      api.repeatDispensePrint(params)
        .then(res => {
          // 调用打印
          let dispenseVoList = res.dispenseVoList[0].outpatientDispenseList
          let patientObject = res.dispenseVoList[0].patientObject
          this.gatherPrintData({
            outpatientDispenseInfo: dispenseVoList,
            patientObject: Object.assign(patientObject, { barCode: res.dispenseVoList[0].code, visitSn: this.currentVisitNumber })
          })
          this.$messageTips(this, 'success', '重新打印备药单完成')
          this.handleSearch({ code: res.dispenseVoList[0].code }, res => {
            this.sort(res, '')
            const id = res[0].id
            this.select[id].select = Object.assign([], this.select[billId].select)
            this.select[id].dispenseIdList = Object.assign([], this.select[billId].dispenseIdList)

            this.tableData.currentOutpatientDispense[position[0]].splice(position[1], 1)
            res[0].normal.map((item, index) => {
              if (this.select[id].dispenseIdList.indexOf(item.recipeCode) !== -1) {
                item.select = true
              }
            })
            delete this.select[billId]
          })
        })
    },
    async handleSearch (data, callback) {
      if (!data.recipeId && !data.patient && !data.code) {
        this.$messageTips(this, 'warning', '请输入需要查询的处方单号或患者', '')
        return
      }
      const params = {
        storageRoomId: this.storageId
      }

      const searchValue = this.$refs.search.searchValue
      this.$refs.search.searchValue = ''

      if (data.recipeId) {
        this.status = 'recipe'
        params.recipeId = data.recipeId
      } else if (data.code) {
        this.status = 'code'
        params.code = data.code
      } else {
        this.status = 'refresh'
        params.patientId = data.patient.id
      }
      params.implementType = 2 // 收方发药只查询处方发药，不查询院内发药
      this.fullscreenLoading = true
      await api.getByAdviceDispense(params)
        .then(async res => {
          if (!Array.isArray(res)) return
          if (!res.length) {
            // 异常处理
            // this.noRecipe = true
            let errText = ''
            if (data.patient) {
              errText = '当前患者无处方单据！'
              this.$messageTips(this, 'warning', errText, '')
            }
            //  else if (data.code) {
            //   errText = '无该备药单！'
            // } else {
            //   errText = '该处方还未备药，暂不能进行发药！'
            // }
            this.initTableData()
            return
          }
          // this.noRecipe = false
          const newPatient = this.getPatient(res)
          if (this.currentVisitNumber === '' || newPatient.currentVisitNumber === this.currentVisitNumber) {
            Object.assign(this, this.getPatient(res))
            // this.select = {}
            // this.initTableData()
            setTimeout(() => {
              !callback ? this.sort(res, searchValue) : callback(res)
            }, 0)
          } else {
            try {
              await this.$confirm('当前操作未完成，继续将丢失已扫描信息，确认继续吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
              Object.assign(this, this.getPatient(res))
              this.select = {}
              this.initTableData()
              setTimeout(() => {
                this.sort(res, searchValue)
              }, 0)
            } catch (err) { }
          }
        })
      this.fullscreenLoading = false
    },
    // 获取用户信息
    getPatient (res) {
      const patient = res[0].outpatientDispenseList[0]
      return {
        currentVisitPatientId: patient.patientId,
        currentVisitNumber: patient.visitSn
      }
    },
    // 新数据 备药单 排序
    sort (res, searchValue) {
      res.map((bill, index) => {
        // 获取数据状态
        if (!this.select[bill.id]) {
          this.select[bill.id] = {
            select: this.status === 'code',
            position: [],
            dispenseIdList: this.status === 'recipe' ? [searchValue] : []
          }
          // 处方单状态分组
          const identification = this.dispenseSort(bill)

          if (identification) {
            this.select[bill.id].position = ['abnormal', this.tableData.currentOutpatientDispense.abnormal.length]
            this.tableData.currentOutpatientDispense.abnormal.push(bill)
          } else {
            this.select[bill.id].position = ['normal', this.tableData.currentOutpatientDispense.normal.length]
            this.tableData.currentOutpatientDispense.normal.push(bill)
          }
        } else {
          if (this.status === 'code') {
            this.select[bill.id].select = true
          } else if (this.status === 'recipe') {
            this.select[bill.id].dispenseIdList.indexOf(searchValue) === -1 && this.select[res[0].id].dispenseIdList.push(searchValue)
          }
          this.update(bill)
        }
      })
    },
    dispenseSort (bill) {
      const dispenseList = bill.outpatientDispenseList
      let identification = false
      bill.normal = []
      bill.abnormal = []
      bill.cancel = []
      dispenseList.map((dispense, dindex) => {
        // 获取处方单状态
        if (this.select[bill.id].dispenseIdList.indexOf(dispense.recipeCode) === -1) {
          dispense.select = false
        } else {
          dispense.select = true
        }

        // 设置备药单状态
        if (dispense.identification) {
          identification = true
          bill.abnormal.push(dispense)
        } else if (dispense.status === 7) {
          identification = true
          bill.cancel.push(dispense)
        } else {
          bill.normal.push(dispense)
        }
      })
      delete bill.outpatientDispenseList
      return identification
    },
    update (res) {
      res = res[0] || res
      if (this.select[res.id]) {
        const position = this.select[res.id].position
        this.dispenseSort(res)
        Object.assign(this.tableData.currentOutpatientDispense[position[0]][position[1]], res)
      }
    },
    abnormal (options, code) {
      this.handleSearch({ code }, (res) => {
        res = res[0]
        const dispenseList = res.outpatientDispenseList
        let abnormal = false
        for (let i = 0; i < dispenseList.length; i++) {
          if (dispenseList[i].identification) {
            abnormal = true
            break
          }
        }
        const position = Object.assign([], this.select[res.id].position)
        if (abnormal) {
          if (position[0] !== 'abnormal') {
            this.select[res.id].position = ['abnormal', this.tableData.currentOutpatientDispense.abnormal.length]
            this.tableData.currentOutpatientDispense.abnormal.push(
              this.tableData.currentOutpatientDispense.normal.splice(position[1])[0]
            )
          }
        } else {
          if (position[0] !== 'normal') {
            this.select[res.id].position = ['normal', this.tableData.currentOutpatientDispense.normal.length]
            this.tableData.currentOutpatientDispense.normal.push(
              this.tableData.currentOutpatientDispense.abnormal.splice(position[1])[0]
            )
          }
        }
        this.update(res)
      })
    },
    getLogList () {
      this.api.getLogList({ visitSn: this.currentVisitNumber }).then(res => {
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
            } else if (v.outpatientDispense.recipeCode) {
              _recipe.push(v.outpatientDispense.recipeCode)
            }
          })
          val['_excute'] = _excute
          val['_recipe'] = _recipe
        }
      })
    },
    _getCursor () {
      this.$nextTick(() => {
        this.$refs.search.$el.querySelectorAll('input.el-input__inner')[0].focus()
      })
    }
  },
  mounted () {
    this._getCursor()
  }
}
</script>

<style scoped>
#opd .dispense_container .patient_prescription {
  height: calc(100vh - 255px);
  background: none;
  margin-top: 15px;
  padding-bottom: 0;
}
.patient_list {
  background: #fff;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  padding: 15px;
  padding-bottom: 0;
}
.title {
  line-height: 30px;
  padding-bottom: 10px;
  color: #000;
}
.patient_box > .patient_footer {
  position: relative !important;
  left: 0 !important;
  bottom: 0 !important;
  padding: 0 !important;
  margin: 15px 0 !important;
}
#opd >>> .hospital-container .hospital-search > .el-col-18 {
  width: 75%;
}
#opd >>> .el-input {
  width: 100%;
}
.patient_box > .patient_title {
  border-left: none !important;
  padding-left: 0 !important;
}
span.scrap {
  padding-left: 15px !important;
  color: #999 !important;
}
</style>
