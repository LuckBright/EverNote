<template>
  <div>
    <el-table :data="data" style="width: 100%" max-height="200">
      <el-table-column label="选择" width="60" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.activechecked" @change="benefitArrSelectionChange"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="名称" align="center">
        <template slot-scope="scope">
        {{scope.row.giftBatch.name}}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.giftBatch.type | benefitCardType}}
        </template>
      </el-table-column>
      <el-table-column prop="giftBatch.useStartTime" label="优惠券可用开始时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.giftBatch.useStartTime">{{$moment(scope.row.giftBatch.useStartTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="giftBatch.useEndTime" label="优惠券可用截止时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.giftBatch.useEndTime">{{$moment(scope.row.giftBatch.useEndTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动规则" align="center">
        <template slot-scope="scope">
          {{scope.row.giftBatch.type===1?`满${scope.row.giftBatch.threshold}元可用`:''}}
        </template>
      </el-table-column>
      <el-table-column prop="giftBatch.money" label="活动金额(元)" align="center">
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
  filters: {
    benefitCardType (type) {
      switch (Number(type)) {
        case 1:
          return '满减券'
        case 2:
          return '立减券'
        case 3:
          return '体验券'
      }
    }
  },
  methods: {
    benefitArrSelectionChange () {
      let selectArr = this.data.filter(item => item.activechecked === true)
      this.$emit('benefitcards:changed', selectArr, 'giftcardIds')
    }
  }
}
</script>
