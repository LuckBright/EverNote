<template>
  <div>
    <el-table :data="data" style="width: 100%" max-height="200">
      <el-table-column label="选择" width="60" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.activechecked" @change="userCardArrSelectionChange($event,scope.$index)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="memberCardBatch.name" label="名称" align="center">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.batchType == 1 ? '储值卡' : '打折卡' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="endDate" label="有效期" align="center">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="storedMoney" label="可用余额" align="center">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="givedMoney" label="可用点卡" align="center">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="可用共享金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.memberCardShare ? (scope.row.memberCardShare.maxShareMoney - scope.row.memberCardShare.usedShareMoney || 0) : '' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    selectArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    userCardArrSelectionChange (val, index) {
      this.data.map((v, i) => {
        v.activechecked = false
        if (i === index) {
          v.activechecked = val
        }
      })
      let selectArr = this.data.filter(item => item.activechecked === true)
      this.$emit('cards:changed', selectArr, 'memberCardId')
    }
  }
}
</script>
