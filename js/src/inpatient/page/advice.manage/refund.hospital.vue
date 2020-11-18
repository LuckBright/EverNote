<template>
	<el-dialog
		title="退库申请"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :visible.sync="visible"
    v-if="visible"
    @close="close"
	>
    <el-table
      v-if="visible"
      ref="refundTable"
      :data="tableData"
      @selection-change="selectChange"
      style="width: 100%">
      <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
      <el-table-column prop="serviceName" label="项目名称" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="refundAble" label="可退数量">
        <span slot-scope="scope">{{scope.row.count + scope.row.countUnitName}}</span>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <!-- 退库执行单上没价格，先不展示退库金额 -->
      <div class="refund-money">退费金额：<label>¥{{refundMoney}}</label></div>
      <el-button type="primary"  @click="refund" :loading="loading">确定</el-button>
    </div>
	</el-dialog>
</template>
<script>

export default {
  data () {
    return {
      visible: false,
      tableData: [],
      loading: false,
      selectAdvice: []
    }
  },
  computed: {
    refundMoney () {
      if (!this.selectAdvice.length) {
        return '0.00'
      }
      let money = this.selectAdvice.reduce((total, item) => {
        return total + (item.count * item.price)
      }, 0)
      return money.toFixed(2)
    }
  },
  methods: {
    async show (list) {
      if (list && list.length) {
        let data = list.map(item => {
          let price
          item.adviceFeesDtoList.map(ele => {
            price = ele.serviceId === item.serviceId ? ele.price : price
          })
          return {
            serviceName: item.serviceName,
            status: item.dispenseStatus,
            id: item.id,
            count: +item.dispenseStatus === 190 ? item.count : 0,
            countUnitName: item.adviceJson.countUnitName,
            price: price
          }
        })
        this.tableData = data
      }
      this.visible = true
      this.$nextTick(() => {
        this.tableData.forEach(item => {
          +item.status === 190 && this.$refs.refundTable.toggleRowSelection(item)
        })
      })
    },
    close () {
      this.tableData = []
      this.visible = false
      this.loading = false
    },
    refund () {
      this.loading = true
      this.$emit('refund', this.selectAdvice, this.close)
    },
    selectChange (list) {
      this.selectAdvice = list
    },
    selectable (row) {
      if (+row.status === 190) {
        return true
      }
      return false
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
