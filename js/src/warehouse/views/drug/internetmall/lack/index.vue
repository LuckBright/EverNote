/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 16:35:55
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-21 18:49:40
 */

<template>
  <!-- 缺货任务 -->
  <el-container>
    <el-container class="page_layout_full_hidden">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 查询框 -->
        <search @query="list"></search>
        <!-- 左侧列表 -->
        <order-list
          ref="orderList"
          class="flex_scroll mt10"
          :checkbox-width="30"
          :cur-page="curPage"
          :list-columns="leftOrderColumns"
          :table-data="tableData"
          :loading="leftLoading"
          :key="curPage"
          @row-click="handlerRowClick">
        </order-list>
        <ever-pagination
          class="pagination"
          justify="center"
          layout="total, prev, pager, next, sizes"
          :pagesize="pagesize"
          :no-bg="true"
          :small="true"
          :pager-count="5"
          :total-count="totalCount"
          :current="current"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange">
        </ever-pagination>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap bWhite" v-loading="rightLoading">
          <template v-if="orderHeadObj.orderCode">
            <!-- 订单头 -->
            <order-header class="p10" :head-obj="orderHeadObj" :types="[1, 3]"></order-header>
            <el-main class="">
              <!-- 订单列表 -->
              <order-detail
                :table-data="orderTableData"
                :cur-page="curPage">
              </order-detail>
            </el-main>
          </template>
          <template v-else>
            <ever-no-data :tip-txt="noDataTip"></ever-no-data>
          </template>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Methods from '@/warehouse/views/drug/internetmall/mixins/methods.js'

export default {
  mixins: [Methods],

  data () {
    return {
      noDataTip: '暂无缺货任务',
      curPage: 'lack',
      queryParams: {
        stockoutFlag: 2
      },
      queryApiName: 'queryStockoutList'
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination /deep/ .el-pagination .el-input__inner {
  height: 20px;
}
</style>
