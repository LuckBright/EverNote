<template>
  <div>
    <commonTable
      ref="commonTable"
      :api="api"
      :firstExpandRows.sync="firstExpandRows"
      @expandEvent="handleExpandEvent"
      @expandThirdlayer="expandThirdlayer"
      @selection-change="handleSelectionChange"
      @thirdPaginationSizeChange="thirdPaginationSizeChange"
      @thirdPaginationCurrentChange="thirdPaginationCurrentChange"
      v-on="$listeners"
    >
      <!-- 顶层查询右侧按钮 -->
      <template slot="extendButtons">
        <el-button type="primary" size="small" @click="presettleTimer">预结算设置</el-button>
      </template>
      <!-- 第一层的操作按钮 -->
      <template slot="outOperations" slot-scope="scope">
        <el-button type="primary" @click="readCard(scope.outRow)">读卡</el-button>
        <el-button
          type="primary"
          @click="modifyRegInfo(scope.outRow)"
          :disabled="!scope.outRow.cardno || scope.outRow.tradeType=='-1'"
        >登记修改</el-button>
      </template>
      <!-- 第二层的操作按钮 -->
      <template slot="innerOperations" slot-scope="scope">
        <el-button
          type="primary"
          size="small"
          v-if="scope.innerRow.settleStatus!='1'&&scope.innerRow.settleStatus!='3'"
          @click="preSettle(scope.innerRow)"
        >预结算</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="scope.innerRow.settleStatus!='1'&&scope.innerRow.settleStatus!='3'"
          :disabled="scope.innerRow.uploadDisabled"
          @click="receiptUploadAgain(scope.innerRow)"
        >处方重传</el-button>
        <el-button
          v-if="scope.innerRow.settleStatus!='1'&&scope.innerRow.settleStatus!='3'"
          :disabled="scope.innerRow.uploadDisabled"
          type="primary"
          size="small"
          @click="receiptAll(scope.innerRow)"
        >全部撤销</el-button>
      </template>
      <!-- 第三层的操作按钮 -->
    </commonTable>
    <modifyRegInfo
      v-if="medicalRegisterInfo"
      :medicalRegisterInfo.sync="medicalRegisterInfo"
      :paramObj="currentRow"
      @register-success="refresh"
    ></modifyRegInfo>
    <hospitalPresettleTimer
      v-if="hospitalSettleTimer"
      :hospitalSettleTimer.sync="hospitalSettleTimer"
    ></hospitalPresettleTimer>
    <!-- 医保卡读卡信息弹窗 -->
    <dialogmedicalinfo
      :insuranceOrgId="insuranceOrgId"
      @getMedDetails="getMedDetailsEvent"
      ref="medicalinfo"
    ></dialogmedicalinfo>
  </div>
</template>

<script>
import commonTable from '@/rcm/otmdiscomponent/jlsb-medical-manage/jlsb-medical-manage-common.vue'
import modifyRegInfo from '@/rcm/otmdiscomponent/modify-medical-reginfo.vue'
import hospitalPresettleTimer from '@/rcm/otmdiscomponent/hospital-presettle.vue'
import { preSettle, receiptUploadAgain } from '@/rcm/store/otmdiscomponent/hospital-medical.js'
import dialogmedicalinfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { jlsbMedicalReg, jlsbMedicalList, medicalSettleList, medicalSettleDtls } from '@/rcm/store/otmdiscomponent/jlsb-api.js'
import { receiptRetrate } from '@/rcm/store/otmdiscomponent/jljh-api.js'
export default {
  name: 'jlsbHospitalMedicalManage',
  data () {
    return {
      confirmMessage: '消息确认框',
      confirmType: 0, // 标识触发的消息确认框类型
      confirmData: {}, // 触发消息确认框的那行数据
      // 获取列表接口
      api: {
        list: jlsbMedicalList,
      },
      // 获取第三层选中项
      selection: [],
      medicalRegisterInfo: false,
      hospitalSettleTimer: false,
      dialogmedicalinfovisible: false, // 医保读卡弹窗
      insuranceOrgId: '',
      // 记录第一层的当前操作行，便于往相关组件中传数据以及第二层预结算或者手动重传之后的刷新
      currentRow: {},
      // 记录第二层的当前操作行,便于第三层操作之后的刷新
      secondRow: {},
      orgList,
      firstExpandRows: []
    }
  },
  methods: {
    // 展开二层时，懒加载数据
    handleExpandEvent (row, expandedRows) {
      // 记录当前第一层的数据
      this.currentRow = row
      this.firstExpandRows = expandedRows.map(item => item.id)
      row.expand = !row.expand
      // 加了是否展开的标识，如果已经关闭了，就不再调接口了
      if (!row.expand) {
        row.children = []
      } else {
        this.getSecondLayerData(row)
      }
    },
    getSecondLayerData (row, cb) {
      row.loading = true
      let params = { masterId: row.id }
      medicalSettleList(params).then(res => {
        row.children = res.data.map(item => {
          item.loading = false // 给第三层的数据加上loading，展开时好等待
          item.expand = false // 设置二层数据展开状态
          item.uploadDisabled = false // 第二层加上disabled
          item.children = []
          item.pageParams = {
            current: 1,
            pageSizes: [10, 20, 30, 50],
            pagesize: 20,
            offset: 0,
            totalCount: res.totalSize || 0
          }
          return item
        })
        // 20200806如果数据为空，后端负责推入空数据
        row.loading = false
        if (typeof cb === 'function') {
          cb.call(this, row.children)
        }
      }, err => {
        console.log('err', err)
        row.loading = false
      })
    },
    // 展开第三层事件
    expandThirdlayer (row, expandedRows) {
      this.secondRow = row
      // 记录展开的行
      row.expandRows = expandedRows.map(item => item.id)
      row.expand = !row.expand
      // 加了是否展开的标识，如果已经关闭了，就不再调接口了
      if (!row.expand) {
        row.children = []
      } else {
        this.getThirdLayerData(row)
      }
    },
    getThirdLayerData (row) {
      if (!row.id) return
      row.loading = true
      let pageParams = row.pageParams
      let params = { settleDocId: row.id, ...pageParams }
      medicalSettleDtls(params).then(res => {
        res.data.map(item => { item.parentRow = row })
        row.children = res.data
        row.pageParams.totalCount = res.totalSize
        row.loading = false
      }, err => {
        console.log('err', err)
        row.loading = false
      })
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    // 转发消息确认框处理事件
    handleSureMethod (data) {
      this.handlerMap[this.confirmType]['sureMethod'].call(this, data)
    },
    // 以下实际的消息确认框处理事件
    readCard (row) {
      this.currentRow = row
      this.insuranceOrgId = row.insuranceOrgId
      this.$nextTick(_ => {
        this.$refs.medicalinfo.start()
      })
    },
    // 医保登记
    getMedDetailsEvent (data) {
      if (data.personname !== this.currentRow.personName) {
        this.$messageTips(this, 'error', '医保卡信息与当前患者姓名不一致，不能进行医保结算')
        return false
      }
      let params = { cardNo: data.cardno, personNo: data.personno, personName: data.personName, visitNumber: this.currentRow.visitNumber, macId: data.macId, cardInfo: data }
      this.commonOperate('MedicalRegister', params)
    },
    // 吉林省保住院登记
    jlssbMedicalRegister (params) {
      jlsbMedicalReg(params).then(res => {
        this.$messageTips(this, 'success', '登记成功')
        // 读卡之后可以保证列表里有macId了
        this.$refs.commonTable.list()
      })
    },
    // 修改登记信息
    modifyRegInfo (row) {
      this.currentRow = row
      this.medicalRegisterInfo = true
    },
    // 预结算定时器
    presettleTimer () {
      this.hospitalSettleTimer = true
    },
    refresh () { // 刷新列表
      this.$refs.commonTable.list()
    },
    /** ****第二层操作开始****/
    // 手动预结算
    preSettle (row) {
      this.secondRow = row
      let params = {
        ipNo: row.visitNumber || this.currentRow.visitNumber,
        macId: this.macId
      }
      preSettle(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        // 重新获取第二层信息
        this.getSecondLayerData(this.currentRow, (children) => {
          if (!this.secondRow.id) {
            let secondRow = children.filter(child => child.id === this.secondRow.id)
            this.getThirdLayerData(secondRow && secondRow[0])
          }
        })
      }, err => {
        console.log(err)
      })
    },
    // 处方重传
    receiptUploadAgain (row) {
      this.secondRow = row
      row.uploadDisabled = true
      let params = {
        ipNo: row.visitNumber || this.currentRow.visitNumber,
        macId: this.macId
      }
      receiptUploadAgain(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        row.uploadDisabled = false
        // 重新获取第二层信息
        this.getSecondLayerData(this.currentRow, (children) => {
          if (!this.secondRow.id) {
            let secondRow = children.filter(child => child.id === this.secondRow.id)
            this.getThirdLayerData(secondRow && secondRow[0])
          }
        })
      }, err => {
        row.uploadDisabled = false
        console.log(err)
      })
    },
    // 全部撤销
    receiptAll (row) {
      this.secondRow = row
      row.uploadDisabled = true
      let params = {
        ipNo: row.visitNumber || this.currentRow.visitNumber,
        macId: this.macId
      }
      receiptRetrate(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        row.uploadDisabled = false
        // 重新获取第二层信息
        this.getSecondLayerData(this.currentRow, (children) => {
          if (this.secondRow.id && this.secondRow.expand) {
            let secondRow = children.filter(child => child.id === this.secondRow.id)
            this.getThirdLayerData(secondRow && secondRow[0])
          }
        })
      }).catch(err => {
        row.uploadDisabled = false
        console.log(err)
      })
    },
    /** ****第二层操作结束****/
    /** ****第三层操作开始****/
    /** ****第三层操作结束****/
    // 适应不同医保机构调用不同接口
    commonOperate (operation, params) {
      let method = this[this.orgList[this.insuranceOrgId].code + operation]
      if (typeof method === 'function') {
        method.call(this, params)
      }
    },
    // 三层数据分页size改变
    thirdPaginationSizeChange (row) {
      this.secondRow = row
      this.getThirdLayerData(this.secondRow)
    },
    // 三层数据页码改变
    thirdPaginationCurrentChange (row) {
      this.secondRow = row
      this.getThirdLayerData(this.secondRow)
    }
  },
  components: {
    commonTable,
    modifyRegInfo,
    hospitalPresettleTimer,
    dialogmedicalinfo
  }
}
</script>
<style scoped>
.el-dropdown-menu__item.is-disabled {
  color: #bfcbd9;
  cursor: not-allowed;
}
</style>
