<template>
  <div>
    <!-- 供应商头部展示 -->
    <ever-bread-crumb name="供应商信息" path="/goods/suppliers"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="border">
        <h2 class="ml20">
          {{getName}}
          <span class="cRed" v-if="!obj.tenantStatus">{{obj.msg}}</span>
        </h2>
      </div>
      <!-- 供应商tabs 切换页 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        class="ever_tabs_top">
        <el-tab-pane label="基本信息" name="essentialInfo">
          <supplier-info :isNew="false" @getSupplierName="getSupplierName"></supplier-info>
        </el-tab-pane>
        <el-tab-pane label="合同" name="contrct">
          <contract-info :isNew="false" :supplierId="obj.id" :showBtn="!!showBtn"></contract-info>
        </el-tab-pane>
        <el-tab-pane label="无合同物资管理" name="materialManage">
          <!-- <supplier-price :isNew="false"></supplier-price> -->
          <new-supplier-price></new-supplier-price>
        </el-tab-pane>
        <el-tab-pane label="机构自主采购单" name="purchasingOrder">
          <drugbuy-list :isNew="false"></drugbuy-list>
        </el-tab-pane>
        <el-tab-pane label="集中采购单" name="focusPurchasingOrder" v-if="obj.tentantId === obj.clinicId">
          <focus-drugbuy-list :isNew="false"></focus-drugbuy-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import supplierInfo from '@/warehouse/page/supplier.vue'
import supplierPrice from '@/warehouse/page/supplierprice.vue'
import newSupplierPrice from '@/warehouse/page/purchease/component/newsupplierprice.vue'
import drugbuyList from '@/warehouse/page/purchease/drugbuylist.vue'
import contractInfo from '@/warehouse/page/purchease/contract/contractmanagement.vue'
import focusDrugbuyList from '@/warehouse/page/purchease/focusdrugbuylist.vue'

export default {
  data () {
    return {
      activeName: 'essentialInfo',
      obj: '',
      showBtn: true
    }
  },
  components: {
    supplierInfo,
    supplierPrice,
    newSupplierPrice,
    drugbuyList,
    contractInfo,
    focusDrugbuyList
  },
  computed: {
    getName () {
      return this.obj.name
    }
  },
  created () {
    // 抽取公共属性，一次获取
    const { drug, addcon, supplier, focus } = this.$router.query || {}
    const activeName = {
      'drug': 'purchasingOrder',
      'focus': 'focusPurchasingOrder',
      'addcon': 'contrct',
      'supplier': 'essentialInfo'
    }
    this.activeName = activeName[drug || addcon || supplier || focus] || 'essentialInfo'
  },
  methods: {
    handleClick () { // 切换tab
      let { status, tenantStatus } = this.obj
      this.showBtn = status && tenantStatus
    },
    getSupplierName (obj) {
      this.obj = obj
    }
  },
}

</script>
<style lang="less" scoped>
.border {
  border: 1px solid #D7D7D7;
  margin-bottom: 20px;
  border-radius: 5px;
}
</style>
