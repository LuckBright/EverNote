<template>
  <el-table :data="data" style="width: 100%" ref="benefitCardArr" max-height="200">
    <el-table-column label="选择" width="60" align="center">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.activechecked" @change="idCardArrSelectionChange($event,scope.$index)"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="benefit.name" label="名称" align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="endDate" label="有效期" align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="benefit.discount" label="折扣" align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="benefit.overlayGiftcard" label="是否和优惠券同时使用" align="center">
      <template slot-scope="scope">{{ scope.row.benefit && scope.row.benefit.overlayGiftcard === 1 ? '是' : '否'}}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="benefit.overlayMemberCard" label="是否和储蓄卡同时使用" align="center">
      <template slot-scope="scope">{{ scope.row.benefit && scope.row.benefit.overlayMemberCard === 1 ? '是' : '否'}}</template>
    </el-table-column>
  </el-table>
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
    idCardArrSelectionChange (val, index) {
      this.data.map((v, i) => {
        v.activechecked = false
        if (i === index) {
          v.activechecked = val
        }
      })
      let selectArr = this.data.filter(item => item.activechecked === true)
      this.$emit('idcards:changed', selectArr, 'benefitCardId')
    }
  }
}
</script>

