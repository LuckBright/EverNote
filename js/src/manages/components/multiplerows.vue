<template>
  <div class="multiple-style" v-if="scopeRowExtList && scopeRowExtList.length">
    <el-row>
      <!-- 状态 -->
      <el-col v-if="true">
        <el-switch
          v-model="scopeRowExtList[0].status"
          :active-value="0"
          :inactive-value="1"
          @change="updateList">
        </el-switch>
      </el-col>
      <!-- 包装单位 售价 -->
      <el-col v-else-if="attr.type == 'packing'">
        <material-price
        v-if="scopeRowExtList[0]"
        :status="scopeRowExtList[0].status"
        v-model="scopeRowExtList[0]"
        @change="updateList">
        </material-price>
        <template v-else>-</template>
      </el-col>
      <!-- 制剂单位 售价 -->
      <el-col v-else-if="attr.type == 'preparation'">
        <material-price
        v-if="scopeRowExtList[1]"
        :status="scopeRowExtList[0].status"
        v-model="scopeRowExtList[1]"
        @change="updateList">
        </material-price>
        <template v-else>-</template>
      </el-col>
      <!-- 没有值的列 -->
      <el-col v-else-if="attr.type == 'withoutValue'">-</el-col>
    </el-row>
  </div>
</template>

<script>
import * as enumConfig from '@/util/common'
import materialPrice from '@/manages/components/material.price'
export default {
  props: {
    list: { // 传入列表
      type: Array,
      default () {
        return []
      }
    },
    attr: { // 组件参数
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      enumConfig,
      scopeRowExtList: this.list // 当前列表
    }
  },
  methods: {
    // 数据更新
    updateList () {
      if (this.scopeRowExtList.length > 1) this.scopeRowExtList[1].status = this.scopeRowExtList[0].status
      this.$emit('updateList')
    }
  },
  watch: {
    list: {
      handler (val) {
        this.scopeRowExtList = val
        if (this.scopeRowExtList.length > 1) this.scopeRowExtList[1].status = this.scopeRowExtList[0].status
        this.$forceUpdate()
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    materialPrice
  }
}
</script>

<style lang="scss" scoped>
  .el-table__body {
    .multiple-rows {
      padding: 0;
      .cell {
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  }
  .multiple-style {
    .el-row {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding: 5px 20px;
      .error {
        /deep/ .el-input__inner {
          border-color: red;
        }
      }
    }
    .el-row:last-child {
      border-bottom: none;
    }
  }
</style>
