<template>
  <div class="everCheck">
    <el-row>
      <el-col :span="6">
        <el-row class="setFont">
          <el-col :span="8" class="settle_label">订单编号：</el-col>
          <el-col :span="16">{{item.orderNo}}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-table :data="item.detail" ref="resettle_table" @selection-change="handleSelectionChange" :key="item.orderNo">
      <el-table-column type="selection" label="序号" width="55" v-if="isShowCheck">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="goodsName" label="名称">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="singleOrigPrice" label="单价">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="count" label="数量">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="flowFee" label="金额">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: {}
    },
    checked: {
      type: Boolean,
      required: {}
    },
    index: {
      type: Number,
      required: {}
    },
    isShowCheck: {
      type: Boolean,
      required: {}
    }
  },
  data () {
    return {
      checkList: ''
    }
  },
  watch: {
    item: {
      handler: function (n, o) {},
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSelectionChange (val) {
      val = JSON.parse(JSON.stringify(val))
      this.$emit('listenCheckData', val, this.index)
    },
    toggleSelection (select) {
      this.item.detail.forEach(v => {
        this.$refs.resettle_table.toggleRowSelection(v, select)
      })
    }
  }
}
</script>
<style scoped>
.setFont {
  font-size: 14px;
}
.everCheck /deep/ .el-table__row .el-checkbox {
  display: none;
}
</style>
