<template>
  <el-dialog
    :title="onlySearch ? '' : '退库'"
    :visible.sync="visibleFlag"
    class="refundDialog ui_dialog_02"
    width="620px"
    @close="closeDialog"
  >
    <el-tabs v-model="activeName" class="pathTabs">
      <el-tab-pane v-if="!onlySearch" label="退库申请" name="1"></el-tab-pane>
      <el-tab-pane label="退库查询" name="2"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="applyData || []"
      v-show="activeName === '1'"
      :span-method="warraySpanMethod"
    >
      <el-table-column label="项目名称" width="200">
        <template slot-scope="scope">
          <el-table
            class="el-table-child no-border"
            :data="scope.row"
            style="width: 100%;margin: 0;"
            :show-header="false"
          >
            <el-table-column width="190" prop="serviceName">
              <template slot-scope="scopes">
                <template v-if="scope.row.length === 2">
                  <template v-if="scopes.$index === 0">
                    <i class="advice_main_icon">┏</i>
                    {{scopes.row.serviceName}}
                  </template>
                  <template v-if="scopes.$index === 1">
                    <i class="advice_main_icon">┗</i>
                    {{scopes.row.serviceName}}
                  </template>
                </template>
                <template v-else-if="scope.row.length > 2">
                  <template v-if="scopes.$index === 0">
                    <i class="advice_main_icon">┏</i>
                    {{scopes.row.serviceName}}
                  </template>
                  <template v-if="scopes.$index > 0 && scopes.$index < (scope.row.length - 1)">
                    <i class="advice_main_icon">┣</i>
                    {{scopes.row.serviceName}}
                  </template>
                  <template v-if="scopes.$index === (scope.row.length - 1)">
                    <i class="advice_main_icon">┗</i>
                    {{scopes.row.serviceName}}
                  </template>
                </template>
                <template v-else>{{scopes.row.serviceName}}</template>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scopes" width="115">
                共
                <span>{{scopes.row.quantity}}</span>
                <span>{{scopes.row.unitName}}</span>
              </template>
            </el-table-column>
            <el-table-column width="115">
              <template slot-scope="scopes">
                共
                <span>{{scopes.row.refundQuantity}}</span>
                <span>{{scopes.row.unitName}}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scopes">
                <el-input
                  v-model="scopes.row.refoundCount"
                  @change="val => {countChange(val, scopes.row)}"
                  :disabled="scopes.row.disabled || handleDisabled"
                ></el-input>
                <span>{{scopes.row.unitName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="总数量" width="115"></el-table-column>
      <el-table-column label="可退数量" width="115"></el-table-column>
      <el-table-column label="退库数量"></el-table-column>
    </el-table>
    <el-table :data="refundQueryData || []" v-show="activeName === '2'">
      <el-table-column prop="serviceName" label="项目名称" width="180"></el-table-column>
      <el-table-column label="退库数量" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.count">{{scope.row.count}}</span>
          <span v-else>0</span>
          <span>{{scope.row.unitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态">
        <template slot-scope="scope">
          <span>{{getStatus(scope.row.payStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行状态">
        <template slot-scope="scope">
          <span
            v-if="scope.row.adviceStatus && 
            OUTPATIENT_ADVICE_STATUS[String(scope.row.adviceStatus)] &&
            OUTPATIENT_ADVICE_STATUS[String(scope.row.adviceStatus)].txt"
          >{{OUTPATIENT_ADVICE_STATUS[String(scope.row.adviceStatus)].txt}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop='createTime' width="155">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDateByExp('YYYY/MM/DD HH:mm')}}
        </template>
      </el-table-column>
    </el-table>
    <el-row class="footarea" v-if="activeName === '1'">
      <el-col :span="13" align="right" class="printBills">
        <template
          v-if="isPrint && showPrint && data && data[0]"
        >
          <el-checkbox v-model="isPrintForm" label="打印退库单" :disabled="handleDisabled"></el-checkbox>
        </template>
      </el-col>
      <el-col :span="7" align="right" class="totalFee">
        <p>
          <span class="total">退库金额：</span>
          <span class="price">￥{{parseFloat(refundPrice).toFixed(2) || '0.00'}}</span>
        </p>
      </el-col>
      <el-col :span="4" align="right">
        <el-button type="primary" @click="submitEvent" :disabled="handleDisabled || !applyData.length">提交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import medicalapi from '@/workspace/store/medicalapi'
import { OUTPATIENT_ADVICE_STATUS } from '@/util/common'
import { singlePrint } from '@/inpatient/components/sendarea.print'
export default {
  props: {
    visible: Boolean,
    data: Array,
    baseInfo: Object,
    onlySearch: Boolean,
    isPrint: {
      type: Boolean,
      default: true
    },
    refundType: { // '1'-advice '2'-execute
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      medicalapi,                 // 接口所在api文件
      OUTPATIENT_ADVICE_STATUS,
      tableData: [],              // 展示的table数据
      applyData: [],
      isPrintForm: true,         // 是否打印退药单
      visibleFlag: false,         // dialog显示隐藏标识
      refundPrice: 0,
      activeName: '1',
      serviceOrderItems: [],
      excuteStatus: {
        '1': '待执行',
        '2': '已取消',
        '3': '已完成'
      },
      isGetQuery: false,
      refundQueryData: [],
      handleDisabled: false,
      refund: {
        a: '0'
      },
      typeArr: [303, 304, 3002, '303', '304', '3002']
    }
  },
  computed: {
    // 根据配置，判断是否显示退药单
    showPrint () {
      if (this.$ever.getClinicConfig().isPrintRefundForm === '1') {
        this.isPrintForm = false
      }
      return (this.$ever.getClinicConfig().isPrintRefundForm === '1')
    },
    currentData () {
      return this.data
    }
  },
  methods: {
    warraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [1, 4]
      } else if (columnIndex < 4) {
        return [0, 0]
      }
    },
    getRefundPrice () {
      this.refundPrice = 0
      this.tableData.forEach(item => {
        if (item.refoundCount && item.sellingPrice) {
          this.refundPrice += item.sellingPrice * item.refoundCount
        }
      })
    },
    // 根据医嘱id获取退库数据
    async getRefundDataByAdviceIds () {
      let params = {
        doctorAdviceIds: []
      }
      this.currentData.forEach(val => {
        params.doctorAdviceIds.push(val.id)
      })
      let result = await this.medicalapi.getServiceOrderItemsByAdviceIds(params)
      return result
    },
    // 根据执行单id获取退库数据
    async getRefundDataByExecuteIds () {
      let params = {
        executeIds: []
      }
      this.currentData.forEach(val => {
        params.executeIds.push(val.id)
      })
      let result = await this.medicalapi.getServiceOrderItemsByExecuteIds(params)
      return result
    },
    // 获取table数据
    async getRefundData () {
      let result
      switch (this.refundType) {
        case '1':
          result = await this.getRefundDataByAdviceIds()
          break
        case '2':
          result = await this.getRefundDataByExecuteIds()
          break
        default:
          result = await this.getRefundDataByAdviceIds()
      }
      if (result.head.errCode === 0 && result.data && result.data.length) {
        this.serviceOrderItems = result.data
        if (['303', '304'].includes(this.currentData[0].adviceType)) {
          this.submitEvent()
        } else {
          this.visibleFlag = true
        }
        this.tableData = result.data
        let n = 0
        this.tableData.forEach(item => {
          // item.refoundCount = ''
          if (item.dispenseStatus !== 190) {
            item.refundQuantity = 0
          }
          item.disabled = !item.refundQuantity
          if (!item.refundQuantity) {
            n++
          }
          this.$set(item, 'refoundCount', '')
        })
        if (n === this.tableData.length) {
          this.handleDisabled = true
        }
        this.applyData = [this.tableData]
      } else {
        this.tableData = []
        this.applyData = []
        return this.$messageTips(this, 'warning', '未获取到明细', '提示')
      }
    },
    // 提交
    async submitEvent () {
      let list = []
      if (['303', '304'].includes(this.currentData[0].adviceType)) {
        list = this.serviceOrderItems
      } else {
        let numError = false
        this.serviceOrderItems.forEach(item => {
          let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
          if (this.typeArr.includes(item.serviceClassification)) {
            reg = new RegExp(/^(([1-9][0-9]*)|0)(\.([0-9]{1,4}))?$/)
          }
          item.refoundCount = item.refoundCount ? Number(item.refoundCount) : ''
          if (item.refoundCount) {
            if (item.refoundCount > item.refundQuantity || !reg.test(item.refoundCount)) {
              numError = true
            } else {
              // item.allotNum = item.refoundCount
              list.push(item)
            }
          }
        })
        if (numError) {
          return this.$messageTips(this, 'warning', '退库数量有误，请修改后提交', '提示')
        }
        if (!list.length && !numError) {
          return this.$messageTips(this, 'warning', '请填写退库数量', '提示')
        }
      }
      this.handleDisabled = true
      let params = {
        details: []
      }
      list.forEach(item => {
        params.details.push({
          serviceId: item.serviceId,
          count: item.refoundCount,
          serviceName: item.serviceName,
          orderItemId: item.id,
          adviceId: item.adviceId
        })
      })
      let result = await this.medicalapi.applyRefund(params)
      if (result && result.head.errCode === 0) {
        this.visibleFlag = false
        this.$emit('update:visible', this.visibleFlag)
        this.$emit('submit')
        if (this.isPrintForm) {
          let ids = []
          let types = []
          this.currentData.forEach(val => {
            ids.push(val.id)
            if (!types.includes(val.serviceType)) {
              types.push(val.serviceType)
            }
          })
          let printParams = {
            visitNumber: this.baseInfo.visitSn,
            patientId: this.baseInfo.patientId,
            serviceType: types,
            doctorAdviceIds: ids,
            details: params.details
          }
          this.isPrint && singlePrint('TUI_YAO_DAN', printParams)
        }
      } else {
        this.handleDisabled = false
        this.$messageTips(this, 'warning', '退库失败，请重试', '提示')
      }
    },
    closeDialog () {
      this.visibleFlag = false
      this.$emit('update:visible', this.visibleFlag)
      this.$emit('close')
    },
    // 数量inputchange事件
    countChange (val, item) {
      let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
      if (this.typeArr.includes(item.serviceClassification)) {
        reg = new RegExp(/^(([1-9][0-9]*)|0)(\.([0-9]{1,4}))?$/)
      }
      if (val > item.refundQuantity) {
        return this.$messageTips(this, 'warning', '退库数量不能大于可退数量', '提示')
      }
      if (!(reg.test(val) || val === '0')) {
        return this.$messageTips(this, 'warning', '退库数量有误', '提示')
      }
      this.serviceOrderItems.forEach(value => {
        if (value.id === item.id) {
          // value.refoundCount = Number(val)
          this.$set(value, 'refoundCount', Number(val))
        }
      })
      this.getRefundPrice()
    },
    async getRefAdviceLogs () {
      let ids = []
      this.currentData.forEach(val => {
        ids.push(val.id)
      })
      let params = {}
      switch (this.refundType) {
        case '1':
          params.doctorAdviceIds = ids
          break
        case '2':
          params.executeIds = ids
          break
        default:
          params.doctorAdviceIds = ids

      }
      let result = await medicalapi.getRefAdviceLogs(params)
      this.isGetQuery = true
      if (result.head.errCode === 0 && result.data && result.data.length) {
        this.refundQueryData = result.data
        this.refundQueryData.forEach(item => {
          if (Number(item.adviceStatus) === 150) {
            this.handleDisabled = true
          }
        })
      } else {
        this.refundQueryData = []
      }
    },
    getStatus (status) {
      // 已记账状态 未支付 已支付 已退费
      switch (status) {
        case 0:
          if (this.refundType === '1') {
            return '未支付'
          }
          return '待支付'
        case 1:
          return '已支付'
        case -1:
          return '已退费'
        case -2:
          return '退费中'
        case -3:
          return '部分已退费'
        case -4:
          return '部分退费中'
        case -5:
          return '待退费'
        case -7:
          return '已取消'
        default:
          return '--'
      }
    },
  },
  watch: {
    'visible' (val) {
      if (val) {
        this.refundPrice = 0
        this.isGetQuery = false
        this.handleDisabled = false
        this.getRefundData()
        this.getRefAdviceLogs()
        this.activeName = this.onlySearch ? '2' : '1'
      }
      if (this.currentData.length && !['303', '304'].includes(this.currentData[0].serviceType)) {
        this.visibleFlag = val
      }
    },
    'activeName' (val) {
      if (val === '2' && !this.isGetQuery) {
        this.getRefAdviceLogs()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.refundDialog {
  padding: 20px;
  /deep/.el-dialog__title {
    font-size: 16px !important;
    line-height: 16px;
    color: #000 !important;
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    .el-table {
      border: 1px solid #ccc;
      .el-table__body-wrapper {
        max-height: 225px;
        overflow-y: auto;
        /deep/ .el-input {
          width: 50px;
          .el-input__inner {
            height: 26px !important;
            line-height: 26px !important;
          }
        }
      }
      .el-table-child{
         .el-table__body-wrapper {
           max-height: 1000px;// 两层table嵌套只是为了不出现滚动条
         }
      }
    }
    padding: 0 20px 20px;
    .el-table-child {
      border: none;
      /deep/.el-table__body {
        width: 100% !important;
      }
      /deep/ .el-table__row {
        td {
          &:first-child {
            .cell {
              padding-left: 0;
            }
          }
        }
        &:last-child {
          td {
            border-bottom: none !important;
          }
        }
      }
    }
  }
  .footarea {
    margin-top: 20px;
    height: 36px;
    .printBills {
      height: 100%;
      line-height: 50px;
    }
    .totalFee {
      height: 100%;
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-start;
      align-items: center;
      p {
        margin: 0;
        .total {
          color: #000000;
        }
        .price {
          font-size: 22px;
          color: #ee4433;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
