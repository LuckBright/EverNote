<template>
  <el-table :data="data" max-height="200">
    <el-table-column label="选择" width="60" align="center">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.activechecked" @change="activeCardArrSelectionChange($event,scope.$index)"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="name" label="名称" align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="startDate" label="活动开始时间" align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="endDate" label="活动结束时间" align="center">
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="discount" label="活动折扣(%)" align="center">
      <template slot-scope="scope">
        <span v-if='scope.row.discount'>{{`${scope.row.discount}%`}}</span>
        <span v-if='scope.row.discountRuleName'>{{`${scope.row.discountRuleName}`}}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="saleMoney" label="活动金额(元)" align="center">
      <template slot-scope="scope">
        <span v-if='scope.row.saleMoney'>
          {{`${scope.row.saleMoney}元`}}
        </span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip prop="remarks" label="备注" align="center">
      <template slot-scope="scope">
        <el-input v-model='scope.row.remarks' v-if='scope.row.remark&&scope.row.activechecked'></el-input>
      </template>
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
    }
  },
  methods: {
    activeCardArrSelectionChange (val, index) {
      this.data.map((v, i) => {
        v.activechecked = false
        if (i === index) {
          v.activechecked = val
        }
      })
      let selectArr = this.data.filter(item => item.activechecked === true)
      this.$emit('activityChanged', selectArr, 'promotionId')
    }
  }
}
</script>
