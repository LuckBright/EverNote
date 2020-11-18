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
      v-bind="$attrs"
    >
      <!-- 第一层的操作按钮 -->
      <template slot="outOperations" slot-scope="scope">
        <el-button 
          type="primary" 
          @click="registerBtn(scope.outRow)"
          :disabled="['-1', '3'].includes(scope.outRow.tradeType)"
        >登记</el-button>
        <el-button
          type="primary"
          @click="modifyRegInfo(scope.outRow)"
          :disabled="['-1', '3'].includes(scope.outRow.tradeType)"
        >登记修改</el-button>
        <!-- :disabled="!scope.outRow.cardNo || scope.outRow.tradeType=='-1'" -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link f12">
            更多
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :disabled="!scope.outRow.inDiagnosisCode || ['-1', '3'].includes(scope.outRow.tradeType)"
              :command="{ invoice: 'cancelRegister', row: scope.outRow }"
            >撤销登记</el-dropdown-item>
            <el-dropdown-item
              :disabled="['-1'].includes(scope.outRow.tradeType)"
              :command="{ invoice: 'action', row: scope.outRow }"
            >上传病案</el-dropdown-item>
            <el-dropdown-item
              :disabled="['-1'].includes(scope.outRow.tradeType)"
              :command="{ invoice: 'cancelAction', row: scope.outRow }"
            >撤销病案</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 第三层的操作按钮 -->
      <template slot="thirdLayerRow">
      </template>
    </commonTable>
    <modifyRegInfo
      v-if="medicalRegisterInfo"
      :medicalRegisterInfo.sync="medicalRegisterInfo"
      :paramObj="currentRow"
      @register-success="refresh"
    ></modifyRegInfo>
    <cfMedicalTypeLog
      :row="row"
      @success="refresh"
      :medicalTypeVis.sync="medicalTypeVis">
    </cfMedicalTypeLog>
  </div>
</template>

<script>
import commonTable from '@/rcm/otmdiscomponent/gdgz-medical/gdgz-medical-manage-common.vue'
import modifyRegInfo from '@/rcm/otmdiscomponent/modify-medical-reginfo.vue'
import cfMedicalTypeLog from './cf-medical-type-log.vue'
import { getMedicalRegisterInfo } from '@/rcm/store/hospital/hospital'
import { settleList, selectSettleDtls, preSettle, cancelRegister } from '@/rcm/store/otmdiscomponent/hospital-medical.js'
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { cancelMedical, uploadMedical } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
export default {
  name: 'gdgzHospitalMedicalManage',
  data () {
    return {
      confirmData: {}, // 触发消息确认框的那行数据
      // 获取列表接口
      api: {
        list: getMedicalRegisterInfo,
      },
      // 获取第三层选中项
      selection: [],
      medicalRegisterInfo: false,
      insuranceOrgId: '',
      // 记录第一层的当前操作行，便于往相关组件中传数据以及第二层预结算或者手动重传之后的刷新
      currentRow: {},
      // 记录第二层的当前操作行,便于第三层操作之后的刷新
      secondRow: {},
      orgList,
      firstExpandRows: [],
      medicalTypeVis: false,
      row: {}
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
    getSecondLayerData (row, cb) {
      // 调接口懒加载直接放在row.children里面就行了
      row.loading = true
      let params = { visitNumber: row.visitNumber }
      settleList(params).then(res => {
        row.children = res.data.map(item => {
          item.loading = false // 给第三层的数据加上loading，展开时好等待
          item.expand = false // 设置二层数据展开状态
          item.uploadDisabled = false // 处方重传禁用标识
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
    // 获取第三层数据
    getThirdLayerData (row) {
      if (!row.id) return
      row.loading = true
      let pageParams = row.pageParams
      let params = { settleDocId: row.id, ...pageParams }
      selectSettleDtls(params).then(res => {
        // 增加上级Row的标识
        res.data.map(item => {
          item.parentRow = row
          return item
        })
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
    // 医保登记
    registerBtn (row) {
      this.row = row
      this.medicalTypeVis = true
    },
    handleCommand (command) {
      switch (command.invoice) {
        case 'cancelRegister': // 撤销登记
          this.cancelRegister(command.row)
          break
        case 'action': // 上传病案
          this.actionFn(command.row)
          break
        case 'cancelAction': // 撤销上传病案
          this.cancelActionFn(command.row)
          break
      }
    },
    actionFn (row) { // 上传病案
      let params = {
        snydActionParams: [
          {
            hospitalizedNumber: row.visitNumber,
            visitId: row.visitNumber,
            patientId: row.patientId,
            insuranceHospitalizedNumber: row.insuranceHospitalizedNumber
          }
        ]
      }
      uploadMedical(params).then(rs => {
        if (!rs.head.errCode && rs.data.length > 0 && !rs.data[0]['sbyy']) {
          this.$messageTips(this, 'succsee', '上传病案成功')
        } else {
          if (rs.data.length > 0 && rs.data[0]['sbyy']) {
            this.$messageTips(this, 'error', rs.data[0]['sbyy'])
          } else {
            this.$messageTips(this, 'error', '上传病案失败')
          }
        }
      }, rj => {
        this.$messageTips(this, 'error', '上传病案失败')
      })
    },
    cancelActionFn (row) { // 撤销上传病案
      console.log(row)
      let params = {
        snydActionParams: [
          {
            hospitalizedNumber: row.visitNumber,
            visitId: row.visitNumber,
            patientId: row.patientId
          }
        ]
      }
      cancelMedical(params).then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '撤销上传病案成功')
        }
      })
    },
    // 撤销登记
    cancelRegister (row) {
      const params = {
        visitNumber: row.visitNumber,
        insuranceOrgId: row.insuranceOrgId
      }
      cancelRegister(params).then(res => {
        if (!res.head.errCode) {
          this.$messageTips(this, 'success', '撤销登记成功')
          this.refresh()
        }
      }, err => {
        console.log('err', err)
      })
    },
    // 修改登记信息
    modifyRegInfo (row) {
      this.currentRow = row
      this.medicalRegisterInfo = true
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
          if (this.secondRow.id) {
            let secondRow = children.filter(child => child.id === this.secondRow.id)
            this.getThirdLayerData(secondRow && secondRow[0])
          }
        })
      }, err => {
        console.log(err)
      })
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
    cfMedicalTypeLog
  }
}
</script>
<style scoped>
.el-dropdown-menu__item.is-disabled {
  color: #bfcbd9;
  cursor: not-allowed;
}
</style>
