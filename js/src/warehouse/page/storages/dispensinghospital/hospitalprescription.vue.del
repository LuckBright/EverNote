 <template>
  <div class="hospital-container" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 搜索框 -->
    <div class="hospital-search">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input
            ref="inputSeach"
            v-model="searchName"
            clearable
            placeholder="请输入备药单号"
            @keyup.enter.native="handleSearch"
          ></el-input>
          <el-button @click="handleSearch">查询</el-button>
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
              <span class="f14">共 {{leftTableData.length}} 条记录</span>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="leftLoading"
          ref="singleTable"
          :data="leftTableData"
          highlight-current-row
          :height="'calc(100vh - 222px)'"
          @current-change="handleCurrentChange"
          :row-class-name="patientTableRowClassName"
          style="width: 100%"
        >
          <el-table-column class-name="pointer" prop="codes" label="批量备药单"></el-table-column>
          <el-table-column align="center" prop="count" label="药包数" width="70"></el-table-column>
        </el-table>
      </el-aside>
      <el-main class="inner ml10">
        <div class="list-msg">
          <div class="list_box">
            <el-checkbox-group v-model="checkedList" @change="handleCheck">
              <div v-if="tableData.length" class="list">
                <div v-for="(item, index) in tableData" :key="index">
                  <el-row :gutter="20" type="flex" justify="start" align="middle">
                    <el-col :span="1">
                      <strong
                        class="strong"
                        :class="{'light': checkedList[index] == index}"
                      >{{index + 1}}</strong>
                    </el-col>
                    <el-col :span="14">
                      <div class="title_info">
                        <label>UDD药包:</label>
                        <span>{{item.code}}</span>
                        <span v-if="item.spaceRecordObject">{{item.spaceRecordObject.name}}</span>
                        <label v-if="item.bedNum">床号:</label>
                        <span v-if="item.bedNum">{{item.bedNum}}</span>
                        <label v-if="item.implementTime">预执行时间:</label>
                        <span v-if="item.implementTime">
                          <template
                            v-if="item.implementTime"
                          >{{item.implementTime | formatDateByExp('YYYY-MM-DD')}}</template>
                          <strong class="f16">
                            <span
                              v-if="item.termType"
                            >{{item.implementTime | formatDateByExp('HH:mm')}}</span>
                            <span v-else>立即</span>
                          </strong>
                        </span>
                      </div>
                      <div class="title_info">
                        <span
                          v-if="item.patientObject"
                        >{{item.patientObject.name}} ({{item.patientObject.sex | formatSex}}) {{item.patientObject.age}}岁</span>
                        <span class="f_bold">{{item.employTxt}}</span>
                        <label v-if="item.hospitalizedNumber">住院号:</label>
                        <span v-if="item.hospitalizedNumber">{{item.hospitalizedNumber}}</span>
                        <el-button v-if="$hasPermission('Auth_menu_treasury_hospitalization_seedoctorsadvice')" type="text" class="ml20" @click="handleLookAdvice(item)">查看医嘱</el-button>
                        <label v-if="item.allergicHistory">过敏史:</label>
                        <span v-if="item.allergicHistory">{{item.allergicHistory}}</span>
                        <el-button
                          type="text"
                          @click="gatherPrintSingle(Object.assign(item, inpatientArea))"
                        >补打药包</el-button>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <!-- <el-button v-if="item.identification" type="primary" @click="cancelUnusual(item.id)">撤销异常</el-button> -->
                    </el-col>
                    <el-col :span="7" align="right" class="f14">
                      <!-- todo 代办 -->
                      <!-- <span class="record">诊断记录</span>
                      <span class="record">操作记录</span>-->
                      <span class="status">{{setName(DISPENSING_STATUS, item.status, true)}}</span>
                    </el-col>
                  </el-row>
                  <el-table
                    :data="item.uddDispenseItemList"
                    border
                    :row-class-name="tableRowClassName"
                    :stripe="false"
                  >
                    <el-table-column label="开单医生">
                      <template slot-scope="scope">
                        <span v-if="scope.row.doctorObject">{{scope.row.doctorObject.name}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="300" label="药品名称">
                      <template slot-scope="scope">
                        <span v-if="scope.row.localSettingObject">
                          <wh-code-to-name
                            :patchObj="{
                                code: [SEARCH_CODE[1], SEARCH_CODE[0]],
                                list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                                isInfo: false
                              }"
                          ></wh-code-to-name>
                        </span>
                        <p class="font red" v-if="scope.row.cdssResult">
                          <i class="iconfont icon-wodebaojing red mr10 f12"></i>
                          {{scope.row.cdssResult}}
                        </p>
                        <p
                          v-if="scope.row.identification"
                          class="font red"
                        >异常原因：{{scope.row.identificationTxt}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column width="160" align="center" label="规格">
                      <template slot-scope="scope">
                        <span v-if="scope.row.localSettingObject">
                          <wh-code-to-name
                            :showIcon="false"
                            :patchObj="{
                              code: [SPU_SPEC_CODE],
                              list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                              isInfo: false
                            }"
                          ></wh-code-to-name>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="剂型">
                      <template slot-scope="scope">
                        <wh-single-code-to-name
                          v-if="scope.row.localSettingObject"
                          :patchObj="{
                            list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                            code: DOSAGE
                          }"
                        ></wh-single-code-to-name>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="每次用量">
                      <template
                        slot-scope="scope"
                      >{{scope.row.measure}}{{scope.row.measureUnitName}}</template>
                    </el-table-column>
                    <!-- <el-table-column
                      prop="useFreqTxt"
                      align="center"
                      label="频次">
                    </el-table-column>-->
                    <el-table-column prop="num" align="right" label="数量"></el-table-column>
                    <el-table-column prop="countUnit" align="center" label="单位"></el-table-column>
                    <!-- <el-table-column
                      align="center"
                      width="100">
                      <template slot-scope="scope">
                        注释老的打印方法
                        <el-button type="text" @click="handleReprint({types: 'hospitalization', data: item, isSingle: true, curMine: true})" class="mr10">补打药包</el-button>
                      </template>
                    </el-table-column>-->
                    <!-- <el-table-column
                      prop="containerId"
                      align="center"
                      label="货位号">
                    </el-table-column>-->
                  </el-table>
                </div>
              </div>
              <everNoData v-if="!tableData.length"></everNoData>
            </el-checkbox-group>
          </div>
          <!-- // (drugStatus==4 || drugStatus==5) &&  -->
          <div class="list-btn" v-if="tableData.length">
            <el-row>
              <el-col :span="24">
                <div class="btn-container">
                  <!-- 注释老的打印方法 -->
                  <!-- <el-button type="primary" @click="handleReprint({types: 'hospitalization', data: {codes: leftCodes}, isSingle: true})" class="mr10">补打备药单</el-button> -->
                  <el-button type="primary" @click="handlerSupplementPrint" class="mr10">补打备药单</el-button>
                  <span class v-if="drugStatus == 4">
                    <el-button type="primary" @click="handleFinish(1)">备药完成</el-button>
                  </span>
                  <span class v-if="drugStatus == 5">
                    <el-button type="primary" @click="handleFinish(2)">发药</el-button>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 异常弹出框 -->
    <exception-dialog
      :exceptionData="unusualTableData"
      :visible.sync="dialogTableVisible"
      @confirm="saveUnusual"
    ></exception-dialog>
    <dialog-slot width="90%" title="医嘱信息" :dialogSlot.sync="dialogSlot">
      <advice-list
        v-if="dialogSlot"
        :base-info="baseInfo"
        :no-operate="true"
        :show-add="false"
        :show-all="true"
      ></advice-list>
    </dialog-slot>
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
import exceptionDialog from '../components/exceptiondialog'
import hospitalApi from '../store/hospitalapi'
import api from '../store/dispenseapi'
import { DISPENSING_STATUS, objGet, patch, SEARCH_CODE, SPU_SPEC_CODE, DOSAGE } from '@/util/common'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import mixinsDespen from './mixins_despen'
import setName from '@/util/setstatusname'
import medicinePrint from '@/warehouse/page/storages/util/medicineprint'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import adviceList from '@/inpatient/components/advice.list.vue'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixins'
export default {
  mixins: [getStorage, mixinsDespen, setName, sendDrug, medicinePrint, hospitalPrintMixins],
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
      unusualTableData: [],
      multipleSelection: [],
      tableData: [],
      leftCodes: '',
      baseInfo: [], // 患者基本信息，主要用到：doctorType，hospitalizedNumber，patientId （查看医嘱组件）
      dialogSlot: false,
      drugPackStatus: []
    }
  },
  created () {
    this.DISPENSING_STATUS.forEach(item => {
      if (this._objectFilter([this.DISPENSING_STATUS[0].id, this.DISPENSING_STATUS[1].id, this.DISPENSING_STATUS[5].id, this.DISPENSING_STATUS[6].id, this.DISPENSING_STATUS[7].id], item.id)) this.drugPackStatus.push(item)
    })
    this.drugStatus = 4
    this._getCursor()
  },
  watch: {
    // 药包状态
    drugStatus: {
      handler: function () {
        this.checkedList = []
        if (this.drugStatus) this.getDispenseCodesList()
      },
      immediate: true
    }
  },
  components: {
    exceptionDialog,
    JcpPrint,
    dialogSlot,
    adviceList
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (row && row.cdssResult) {
        return 'mark-cdss-row'
      }
      return ''
    },
    handlerSupplementPrint () { // 补打备药单
      this._initPrint()
      this.liveTableData = {
        tableData: this.tableData,
        barCode: this.leftCodes
      }
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    // 查看医嘱
    handleLookAdvice (data) {
      this.baseInfo = data
      this.dialogSlot = true
    },
    _objectFilter (array, key) {
      let inow = true
      for (let i = 0; i < array.length; i++) {
        if (key === array[i]) {
          inow = false
        }
      }
      return inow
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
        codes: this.leftCodes,
        // status: this.drugStatus, // 服务端自己取药包状态
        storageRoomId: this.storageId
      }
      api.updateStatus(params).then(res => {
        // 更改药包状态为待发药
        if (res.flag) {
          this.$messageTips(this, 'success', `${type === 1 ? '备药' : '发药'}完成`)
          this.getDispenseCodesList()
        }
      })
    },
    // 左侧列表
    async getDispenseCodesList () {
      this.leftLoading = true
      const result = await api.getDispenseCodesList({
        storageRoomId: this.storageId,
        codes: this.searchName,
        status: this.drugStatus,
        relationType: 3 // 住院备药单
      })
      this.leftLoading = false
      if (result.length) {
        this.leftTableData = result
        this.leftCodes = objGet(this.leftTableData[0], 'codes', '')
        this.leftCodes && this.getDispenseList()
        this.inpatientArea = this.leftTableData[0]
        this.inpatientArea.barCode = this.inpatientArea.codes
      } else {
        this.leftTableData = []
        this.tableData = []
      }
    },
    // 右侧列表
    handleCurrentChange (data) {
      if (data) {
        this.inpatientArea = data
        this.inpatientArea.barCode = this.inpatientArea.codes
        this.leftCodes = data.codes
        this.getDispenseList()
        this.multipleSelection = []
        this.checkedList = []
        this.all = false
      }
    },
    getDispenseList () {
      this.fullscreenLoading = true
      api.getDispenseList({ codes: this.leftCodes }).then(res => {
        this.tableData = res
        this.fullscreenLoading = false
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
        this.$messageTips(this, 'success', '取消异常成功')
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
    // 重新打印
    // handleReprint () {
    //   this.$messageTips(this, 'success', '重新打印')
    //   console.log('只调打印机， 执行打印操作')
    // },
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
      return row.codes === this.leftCodes ? 'current-table-row' : ''
    },
    _getCursor () {
      this.$nextTick(() => {
        this.$refs.inputSeach.$el.querySelectorAll('input.el-input__inner')[0].focus()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.hospital-container {
  .hospital-search {
    padding-bottom: 10px;
  }
}
.light {
  color: #1c7bef;
}
</style>

