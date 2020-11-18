<template>
	<el-dialog
		title="退费"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :visible.sync="visible"
    v-if="visible"
	>
    <el-table
      v-if="visible"
      :data="tableData"
      style="width: 100%">
      <el-table-column prop="serviceName" label="收费项目" width="270px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="count" label="总数量"></el-table-column>
      <el-table-column prop="refundAble" label="可退数量">
				<!-- <span slot-scope="scope">{{scope.row.count - scope.row.orderItemRefundQuantity}}</span> -->
      </el-table-column>
      <el-table-column v-if="tableData[0].dispenseStatus !== null" prop="status" label="出库状态">
        <span slot-scope="scope">{{getStatus(scope.row.dispenseStatus)}}</span>
      </el-table-column>
      <el-table-column label="退费数量">
        <el-input-number
          slot-scope="scope"
          :controls="false"
          v-model="refundCount"
          class="refund-count"
          :disabled="!scope.row.refundAble || scope.row.dispenseStatus === 0 || !isFeesPortion"
          :precision="['303', '304'].includes(scope.row.serviceType) ? 2 : 0"
          :min="0"
          :max="scope.row.refundAble"></el-input-number>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <div class="refund-money">退费金额：<label>¥{{refundMoney}}</label></div>
      <el-button type="primary"  @click="refund" :loading="loading">确定</el-button>
    </div>
	</el-dialog>
</template>
<script>
import orderApi from '@/inpatient/components/issued.orders/api.js'

export default {
  props: {
    partReturn: { // 支持部分退费
      type: Function
    }
  },
  data () {
    return {
      visible: false,
      refundCount: 0,
      tableData: [],
      loading: false,
      isFeesPortion: true
    }
  },
  computed: {
    refundMoney () {
      let row = this.tableData[0]
      if (!row) {
        return '0.00'
      }
      let money = this.refundCount * (row.price || 0)
      return money.toFixed(2)
    }
  },
  methods: {
    async show (list) {
      if (list && list.length) {
        let data = list[0]
        this.isFeesPortion = await this.getIsFeesPortion(data)
        data.orderItemQuantity = data.orderItemQuantity || 0
        data.orderItemRefundQuantity = data.orderItemRefundQuantity || 0
        data = Object.assign({}, data, {
          refundAble: (data.orderItemQuantity - data.orderItemRefundQuantity) || 0
        })
        this.refundCount = data.refundAble || ''
        this.tableData = [data]
      }
      this.visible = true
    },
    // 获取支持部分退配置
    async getIsFeesPortion (data) {
      let isPart = false
      let res = await orderApi.searchCheckConfig({
        code: 'IS_FEES_PORTION',
        defaultValue: '1'
      })
      if (res && +res.value) {
        isPart = true
      } else {
        isPart = false
      }
      if (isPart && this.partReturn) {
        isPart = this.partReturn(data)
      }
      return isPart
    },
    close () {
      this.tableData = []
      this.visible = false
      this.loading = false
    },
    refund () {
      if (!this.refundCount) {
        this.$messageTips(this, 'warning', '退库数量只能输入大于零的数字')
        return
      }
      if (this.refundCount > this.tableData[0].refundAble) {
        this.$messageTips(this, 'warning', '退库数量不能大于可退数量')
      }
      this.loading = true
      this.$emit('refund', this.tableData[0], this.refundCount, this.close)
    },
    getStatus (status) {
      switch (status) {
        case 0:
          return '待出库'
        case 190:
          return '已出库'
        case 160:
          return '已退库'
        default:
          return '--'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer {
    text-align: right;
  }
  .refund-count {
    width: 80px;
  }
  .refund-money {
    display: inline-block;
    font-size: 14px;
    margin-right: 10px;
    label {
      font-weight: 700;
      font-size: 18px;
      color: red;
    }
  }
</style>
