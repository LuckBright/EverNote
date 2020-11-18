<template>
  <div class="supply" :class="showError && !currentSupplyValue ? 'error_num' : ''">
    <el-select v-model="currentSupplyValue" @change="handleSelect" :placeholder="placeholder || '请选择采购供应商'">
      <el-option
        v-for="item in supplyData"
        :key="item.supplierLocalId"
        :label="item.name"
        :value="item.supplierLocalId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    props: ['supplyData', 'placeholder', 'value', 'showError'],
    data () {
      return {
        currentSupplyValue: this.value
      }
    },
    created () {
      if (!this.value && this.supplyData.length) {
        this.currentSupplyValue = this.supplyData[0].supplierLocalId
        this.$emit('update:supplyValue', this.currentSupplyValue)
      }
    },
    methods: {
      handleSelect (val) {
        this.$emit('update:supplyValue', val)
      }
    },
    watch: {
      'value' (val) {
        this.currentSupplyValue = val
      }
    }
  }
</script>

<style lang="less" scoped>
  .supply .el-select { display: flex; }
  .error_num {
    /deep/ .el-input__inner {
      border: 1px solid #EE4433;
    }
  }
</style>
