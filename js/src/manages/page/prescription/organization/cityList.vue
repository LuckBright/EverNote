<template>
  <div class="city-list">
    <el-radio-group v-model="radioValue" size="small" class="custom">
      <template v-for="city in citysList">
        <el-radio-button class="city-select-btn" :label="city.id" :key="city.id">{{city.name}}</el-radio-button>
      </template>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  props: {
    citysList: {
      type: Array,
      default: () => []
    },
    value: {
      type: String | Number,
      default: ''
    }
  },
  computed: {
    radioValue: {
      get (val) {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
        this.$emit('change', val)
        return val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.city-list {
  margin-top: 20px;
  .city-select-btn {
    margin-right: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px transparent solid;
    background-color: #e0e5eb;
    transition: all 0.2s;
    &:hover {
      border-color: #1c7bee;
    }
    /deep/ .el-radio-button__inner {
      background-color: transparent;
      border: none;
    }
  }
  /deep/ .is-active {
    border-color: #1c7bee;
    .el-radio-button__inner {
      background-color: #f0f5fa;
      color: #1c7bee;
    }
  }
}
</style>

