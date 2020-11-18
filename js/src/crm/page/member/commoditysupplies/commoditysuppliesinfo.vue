<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="耗材" name="consumables">
        <supply-list></supply-list>
      </el-tab-pane>
      <el-tab-pane label="商品" name="commodity">
        <commodity-list></commodity-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SupplyList from '@/crm/page/member/commoditysupplies/supplylist'
import CommodityList from '@/crm/page/member/commoditysupplies/commoditylist'
export default {
  data () {
    return {
      activeName: 'consumables'
    }
  },
  created () {},
  methods: {
    handleClick (tab, event) {}
  },
  components: {
    SupplyList,
    CommodityList
  }
}
</script>
