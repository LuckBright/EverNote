<template>
  <el-dialog
    title="退库"
    :visible.sync="visibleFlag"
    class="refundDialog ui_dialog_02"
    width="900px"
    @close="closeDialog"
  >
    <el-table
      :data="applyData || []"
      v-show="activeName === '1'"
      height='290'
      >
      <el-table-column label="物资名称"  prop="materialName" width="230">
      </el-table-column>
      <el-table-column label="已开数量" width="80px">
        <template slot-scope="scopes">
          共
          <span>{{scopes.row.num}}</span>
          <sys-value type="THC_WH_DOSE_UNIT" :code="scopes.row.unitId"/>
        </template>
      </el-table-column>
      <el-table-column label="可退数量" width="80px">
        <template slot-scope="scopes">
          共
          <span>{{scopes.row.allotNum}}</span>
          <sys-value type="THC_WH_DOSE_UNIT" :code="scopes.row.unitId"/>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="80px">
        <template slot-scope="scopes">
          {{scopes.row.spec}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scopes">
          {{getStatus(scopes.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="处方单号">
        <template slot-scope="scopes">
          {{scopes.row.adviceExecuteCode || '--'}}
        </template>
      </el-table-column>
      <el-table-column label="执行单号">
        <template slot-scope="scopes">
          {{scopes.row.doctorAdviceCode || '--'}}
        </template>
      </el-table-column>
      <el-table-column label="退库数量">
        <template slot-scope="scopes">
          <el-input
            v-if='typeArr.includes(scopes.row.taskType)'
            v-model="scopes.row.refoundCount"
            @change="val => {countChange(val, scopes.row)}"
            :disabled="scopes.row.disabled || handleDisabled"
          ></el-input>
          <el-input
          v-else
            v-model.number="scopes.row.refoundCount"
            @change="val => {countChange(val, scopes.row)}"
            :disabled="scopes.row.disabled || handleDisabled"
          ></el-input>
          <sys-value type="THC_WH_DOSE_UNIT" :code="scopes.row.unitId"/>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="footarea" v-if="activeName === '1'">
      <el-col :span="13" align="right" class="printBills">
      </el-col>
      <el-col :span="7" align="right" class="totalFee">
        <p>
          <span class="total">共退款：</span>
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
import { PAY_STATUS, OUTPATIENT_ADVICE_STATUS } from '@/util/common'
import storage from '@/util/storage'
import {DISPENSE_STATUS} from '@/warehouse/views/util/constant.js'
export default {
  props: ['visible', 'data', 'baseInfo'],
  data () {
    return {
      medicalapi,                 // 接口所在api文件
      PAY_STATUS,
      OUTPATIENT_ADVICE_STATUS,
      FREQUENCY_LIST: storage.getSessionStorage('FREQUENCY_LIST'),
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
      typeArr: [303, 304, 3002]
    }
  },
  computed: {
    // 根据配置，判断是否显示退药单
    showPrint () {
      if (this.$ever.getClinicConfig().isPrintRefundForm === '1') {
        this.isPrintForm = false
      }
      return (this.$ever.getClinicConfig().isPrintRefundForm === '1')
    }
  },
  created () {
  },
  methods: {
    getStatus (id) {
      let str = ''
      DISPENSE_STATUS.forEach(ele => {
        if (String(ele.id) === String(id)) {
          str = ele.name
        }
      })
      return str
    },
    warraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   return [1, 4]
      // } else if (columnIndex < 4) {
      //   return [0, 0]
      // }
    },
    getRefundPrice () {
      this.refundPrice = 0
      this.tableData.forEach(item => {
        if (item.refoundCount && item.price) {
          this.refundPrice += item.price * item.refoundCount
        }
      })
    },
    // 获取table数据
    async getRefundData () {
      let params = JSON.parse(JSON.stringify(this.baseInfo))
      let result = await this.medicalapi.storageRoomBackStocks(params)
      if (result.head.errCode === 0 && result.data && result.data.length) {
        this.serviceOrderItems = result.data
        this.visibleFlag = true
        this.tableData = result.data
        this.tableData.forEach(item => {
          item.disabled = !item.allotNum || item.source === 4
          this.$set(item, 'refoundCount', '')
        })
        this.applyData = this.tableData
      } else {
        this.tableData = []
        this.applyData = []
        return this.$messageTips(this, 'warning', '未获取到明细', '提示')
      }
    },
    // 提交
    async submitEvent () {
      let list = []

      let numError = false
      this.serviceOrderItems.forEach(item => {
        let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
        if (this.typeArr.includes(item.taskType)) {
          reg = new RegExp(/^(([1-9][0-9]*)|0)(\.([0-9]{1,4}))?$/)
        }
        item.refoundCount = item.refoundCount ? Number(item.refoundCount) : ''
        if (item.refoundCount) {
          if (item.refoundCount > item.allotNum || !reg.test(item.refoundCount)) {
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
      this.handleDisabled = true
      let params = {
        details: []
      }
      list.forEach(item => {
        params.details.push({
          serviceId: item.serviceId,
          count: item.refoundCount,
          serviceName: item.serviceName,
          orderItemId: item.orderItemId,
          adviceId: item.doctorAdviceId
        })
      })
      params.returnFrom = 2
      let result = await this.medicalapi.applyRefund(params).catch(_ => {
        console.log(_, 'catch')
      })
      if (result && result.head.errCode === 0) {
        this.visibleFlag = false
        this.$messageTips(this, 'success', '退库申请成功', '提示')
        this.$emit('update:visible', this.visibleFlag)
        this.$emit('submit')
        // if (this.isPrintForm) {
        //   let ids = []
        //   let types = []
        //   this.currentData.forEach(val => {
        //     ids.push(val.id)
        //     if (!types.includes(val.serviceType)) {
        //       types.push(val.serviceType)
        //     }
        //   })
        //   let printParams = {
        //     visitNumber: this.baseInfo.visitSn,
        //     patientId: this.baseInfo.patientId,
        //     serviceType: types,
        //     doctorAdviceIds: ids,
        //     details: params.details
        //   }
        // }
      } else {
        this.handleDisabled = false
        // this.$messageTips(this, 'warning', '退库失败，请重试', '提示')
      }
    },
    closeDialog () {
      this.visibleFlag = false
      this.$emit('update:visible', this.visibleFlag)
    },
    // 数量inputchange事件
    countChange (val, item) {
      let reg = new RegExp(/^[1-9]{1}[0-9]*$/)
      if (this.typeArr.includes(item.taskType)) {
        reg = new RegExp(/^(([1-9][0-9]*)|0)(\.([0-9]{1,4}))?$/)
      }
      if (val > item.allotNum) {
        return this.$messageTips(this, 'warning', '退库数量不能大于可退数量', '提示')
      }

      if (!(reg.test(val) || val === '0')) {
        return this.$messageTips(this, 'warning', '退库数量有误', '提示')
      }
      this.serviceOrderItems.forEach(value => {
        if (value.taskItemId === item.taskItemId) {
          // value.refoundCount = Number(val)
          this.$set(value, 'refoundCount', Number(val))
        }
      })
      this.getRefundPrice()
    },
    async getRefAdviceLogs () {
      let ids = []
      this.tableData.forEach(val => {
        ids.push(val.doctorAdviceId)
      })
      let result = await medicalapi.getRefAdviceLogs({ doctorAdviceIds: ids })
      this.isGetQuery = true
      if (result.head.errCode === 0 && result.data && result.data.length) {
        this.refundQueryData = result.data
        this.refundQueryData.forEach(item => {
          // if (Number(item.adviceStatus) === 150) {
          //   this.handleDisabled = true
          // }
        })
      } else {
        this.refundQueryData = []
      }
    }
  },
  watch: {
    'visible' (val) {
      if (val) {
        this.refundPrice = 0
        this.isGetQuery = false
        this.handleDisabled = false
        this.getRefundData()
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
        max-height: 300px;
        overflow-y: auto;
        /deep/ .el-input {
          width: 50px;
          .el-input__inner {
            height: 26px !important;
            line-height: 26px !important;
          }
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
