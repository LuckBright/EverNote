<template>
  <div>
    <commonTable
      ref="commonTable"
      :api="api"
      v-on="$listeners"
      :firstExpandRows.sync="firstExpandRows"
      @expandEvent="handleExpandEvent"
      @expandThirdlayer="expandThirdlayer"
      @selection-change="handleSelectionChange"
      @thirdPaginationSizeChange="thirdPaginationSizeChange"
      @thirdPaginationCurrentChange="thirdPaginationCurrentChange"
    >
      <!-- 顶层查询右侧按钮 -->
      <!-- 第一层的操作按钮 -->
      <template slot="outOperations" slot-scope="scope">
        <el-popover placement="top-start" trigger="hover">
          <template slot="default">
            <el-button type="primary" size="mini" @click="handleHasCard(true,scope.outRow)">有卡</el-button>
            <el-button type="primary" size="mini" @click="handleHasCard(false,scope.outRow)">无卡</el-button>
          </template>
          <el-button slot="reference" type="primary">读卡</el-button>
        </el-popover>
        <el-button
          type="primary"
          @click="modifyRegInfo(scope.outRow)"
          :disabled="!scope.outRow.cardNo || scope.outRow.tradeType=='-1'"
        >登记修改</el-button>
        <el-dropdown v-if="scope.outRow.registerId" @command="handleCommand">
          <span class="el-dropdown-link f12">
            更多
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="{ invoice: 'openDiagnosis', params:{row: scope.outRow,flag:true }}"
            >诊断信息维护</el-dropdown-item>
            <el-dropdown-item
              :command="{ invoice: 'openDiagnosis', params:{row: scope.outRow,flag:false }}"
            >诊断信息撤销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 第二层的操作按钮 -->
      <template slot="innerOperations" slot-scope="scope">
        <el-button
          type="primary"
          size="small"
          v-if="scope.innerRow.settleStatus!='1'&&scope.innerRow.parentRow.tradeType!='-1'"
          :disabled="scope.innerRow.uploadDisabled"
          @click="receiptUploadAgain(scope.innerRow)"
        >处方上传</el-button>
        <el-dropdown
          @command="handleCommand"
          v-if="scope.innerRow.settleStatus!='1'&&scope.innerRow.parentRow.tradeType!='-1'"
        >
          <span class="el-dropdown-link f12">
            更多
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :disabled="scope.innerRow.uploadDisabled"
              :command="{ invoice: 'receiptRetrate', params:{row: scope.innerRow} }"
            >处方撤销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 第三层的操作按钮 -->
    </commonTable>
    <modifyRegInfo
      v-if="medicalRegisterInfo"
      :medicalRegisterInfo.sync="medicalRegisterInfo"
      :paramObj="currentRow"
      @register-success="refresh"
    ></modifyRegInfo>
    <!-- 医保卡读卡信息弹窗 -->
    <dialogmedicalinfo
      :insuranceOrgId="insuranceOrgId"
      :hasCard="hasCard"
      @getMedDetails="getMedDetailsEvent"
      ref="medicalinfo"
    ></dialogmedicalinfo>
    <!-- 诊断信息弹框 -->
    <diagnosis-infomation
      :dialog-show.sync="diagnosisInfoShow"
      v-if="diagnosisInfoShow"
      :is-maintain="isMaintain"
      :row-data="rowData"
    ></diagnosis-infomation>
  </div>
</template>

<script>
import commonTable from '@/rcm/otmdiscomponent/sysqzyy-medical/hospital-manage/sysq-medical-manage-common.vue'
import modifyRegInfo from '@/rcm/otmdiscomponent/modify-medical-reginfo.vue'
import { getMedicalRegisterInfo } from '@/rcm/store/hospital/hospital'
import { receiptUploadAgain, preSettle } from '@/rcm/store/otmdiscomponent/hospital-medical.js'
import dialogmedicalinfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import { sysqzyyCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { receiptRetrate } from '@/rcm/store/otmdiscomponent/jljh-api.js'
import { medicalRegister, getPreSettlement, getSettlementItems, getSysqReReportStatus } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import DiagnosisInfomation from '../diagnosis/index.vue'
export default {
  name: 'sysqHospitalMedicalManage',
  data () {
    return {
      // 获取列表接口
      api: {
        list: getMedicalRegisterInfo,
      },
      // 获取第三层选中项
      selection: [],
      medicalRegisterInfo: false,
      hospitalSettleTimer: false,
      insuranceOrgId: '',
      // 记录第一层的当前操作行，便于往相关组件中传数据以及第二层预结算或者手动重传之后的刷新
      currentRow: {},
      // 记录第二层的当前操作行,便于第三层操作之后的刷新
      secondRow: {},
      orgList,
      firstExpandRows: [],
      // 三亚世侨医保默认有卡
      hasCard: true,
      diagnosisInfoShow: false,
      isMaintain: true // 信息维护
    }
  },
  computed: {
    rowData () {
      const { registerId, visitNumber, insuranceOrgId } = this.currentRow
      return {
        registerId,
        visitNumber,
        insuranceOrgId
      }
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
    // 获取第二层数据
    async getSecondLayerData (row, cb) {
      // 调接口懒加载直接放在row.children里面就行了
      row.loading = true
      let reReportFlag = true
      if (row.tradeType !== '-1') {
        let result = await this.getSysqReReportStatus(row)
        reReportFlag = result && result.data && result.data.status
      }
      let params = { visitNumber: row.visitNumber }
      getPreSettlement(params).then(res => {
        let result = (res.data && [res.data]) || []
        row.children = result.map(item => {
          item.loading = false // 给第三层的数据加上loading，展开时好等待
          item.expand = false // 设置二层数据展开状态
          item.uploadDisabled = !reReportFlag || false // 处方重传禁用标识
          // 设置处方重传轮询timer,rollQuery会给row设置timer
          reReportFlag ? null : this.rollQuery(row)
          item.parentRow = row
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
        // 如果没有数据的话，手动推入一条，以便展示预结算和处方重传按钮
        if (row.children.length === 0) {
          row.children.push({
            loading: false,
            expand: false,
            uploadDisabled: false,
            timer: null,
            parentRow: row,
            children: [],
            pageParams: {
              current: 1,
              pageSizes: [10, 20, 30, 50],
              pagesize: 20,
              offset: 0,
              totalCount: 0
            }
          })
        }
        row.loading = false
        if (typeof cb === 'function') {
          cb.call(this, row.children)
        }
      }).catch(err => {
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
    // 获取第三层数据
    getThirdLayerData (row) {
      // 第二层默认推入假数据，假数据展开时默认不调用接口
      if (!row.id) return
      row.loading = true
      let pageParams = row.pageParams
      let params = { visitNumber: row.visitNumber, ...pageParams }
      getSettlementItems(params).then(res => {
        // 增加上级Row的标识
        let resultList = res.data && res.data.resultList || []
        resultList.map(item => {
          item.parentRow = row
          return item
        })
        row.children = resultList
        row.pageParams.totalCount = res.data && res.data.totalCount
        row.loading = false
      }).catch(err => {
        console.log('err', err)
        row.loading = false
      })
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    // 以下实际的消息确认框处理事件
    handleHasCard (hasCard, row) {
      this.hasCard = hasCard
      this.readCard(row)
    },
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
      let params = { cardNo: data.socialCardNo, personNo: data.personNo, personName: data.name, visitNumber: this.currentRow.visitNumber, macId: data.macId, insuranceOrgId: data.insuranceOrgId, param: data }
      this.commonOperate('MedicalRegister', params)
    },
    // 三亚世侨保住院登记
    sysqzyyMedicalRegister (params) {
      medicalRegister(params).then(res => {
        this.$messageTips(this, 'success', '登记成功')
        // 读卡之后可以保证列表里有macId了
        this.$refs.commonTable.list()
      })
    },
    // 修改登记信息
    modifyRegInfo (row) {
      this.currentRow = row
      this.currentRow.insuranceOrgId = sysqzyyCode
      this.medicalRegisterInfo = true
    },
    // 诊断信息维护
    openDiagnosis (params) {
      this.currentRow = params.row
      this.isMaintain = params.flag
      this.diagnosisInfoShow = true
    },
    refresh () { // 刷新列表
      this.$refs.commonTable.list()
    },
    /** ****第二层操作开始****/
    handleCommand (command) {
      if (typeof this[command.invoice] === 'function') {
        this[command.invoice](command.params)
      }
    },
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
          if (this.secondRow.id && this.secondRow.expand) {
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
        this.$messageTips(this, 'success', '正在进行处方重传，请稍后')
        if (row.timer) {
          row.timer = null
        }
        row.timer = this.rollQuery(row)
      }).catch(err => {
        if (row.timer) {
          clearInterval(row.timer)
        }
        row.uploadDisabled = false
        console.log('err', err)
      })
    },
    // 处方全部撤销
    receiptRetrate ({ row }) {
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
      }, err => {
        row.uploadDisabled = false
        console.log(err)
      })
    },
    /** ****第二层操作结束****/
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
    },
    // 蛟河查询处方重传状态
    getSysqReReportStatus (row) {
      return getSysqReReportStatus({ ipNo: row.visitNumber || this.currentRow.visitNumber })
    },
    rollQuery (row) {
      let timerFn = (row) => {
        row.uploadDisabled = true
        row.timer = setInterval((row) => {
          this.getSysqReReportStatus(row).then(res => {
            let result = res.data
            if (result.status) {
              clearInterval(row.timer)
              row.uploadDisabled = false
              // 现在要把上传过程中出现错误的内容扔出来，所以改接口结构了
              if (result.error) {
                this.$messageTips(this, 'error', result.error)
              } else {
                // 重新获取第二层信息
                this.getSecondLayerData(this.currentRow, (children) => {
                  if (this.secondRow.id && this.secondRow.expand) {
                    let secondRow = children.filter(child => child.id === this.secondRow.id)
                    this.getThirdLayerData(secondRow && secondRow[0])
                  }
                }).then(
                  () => {
                    const visitNumber = row.visitNumber || row.parentRow.visitNumber
                    this.$messageTips(this, 'success', `就诊流水号为${visitNumber}的处方重传操作成功`)
                  }
                ).catch(err => {
                  clearInterval(row.timer)
                  row.uploadDisabled = false
                  console.log(err)
                })
              }
            }
          }).catch((err) => {
            clearInterval(row.timer)
            console.log('err', err)
          })
        }, 3000, row)
      }
      setTimeout(timerFn, 3000, row)
    }
  },
  components: {
    DiagnosisInfomation,
    commonTable,
    modifyRegInfo,
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
