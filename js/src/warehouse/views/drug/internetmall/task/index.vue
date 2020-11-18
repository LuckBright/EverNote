/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 16:36:00
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-07 09:55:02
 */

<template>
  <!-- 任务列表 -->
  <el-container>
    <el-container class="page_layout_full_hidden">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 查询框 -->
        <search :show-slot="true" @query="list" :value.sync="searchCode">
          <el-button type="primary" @click="batchSend">批量发货</el-button>
        </search>
        <!-- 左侧列表 -->
        <order-list
          ref="orderList"
          class="flex_scroll mt10"
          :checkbox-width="30"
          :cur-page="curPage"
          :list-columns="leftOrderColumns"
          :show-checkbox="true"
          :table-data="tableData"
          :loading="leftLoading"
          :key="curPage"
          :selectable="selectable"
          @row-click="handlerRowClick"
          @selection-change="handlerSelectionChange">
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
            <order-header
              class="p10"
              :types="[1, 3]"
              :head-obj="orderHeadObj">
            </order-header>
            <el-main class="">
              <!-- 订单列表 -->
              <order-detail :table-data="orderTableData"></order-detail>
              <el-row class="m10 alg_c mb10 mt10" align="center" v-if="!isRefund">
                <el-button type="primary" size="small" @click="openPostDialog(false)">发货</el-button>
              </el-row>
            </el-main>
          </template>
          <template v-else>
            <ever-no-data :tip-txt="noDataTip"></ever-no-data>
          </template>
        </el-container>
      </el-main>
    </el-container>
    <!-- 录入快递信息 -->
    <post-dialog
      v-if="tableData.length"
      ref="post"
      :table-data="selectionData"
      @confirm="confirmBatchSend">
    </post-dialog>
  </el-container>
</template>

<script>
import Methods from '@/warehouse/views/drug/internetmall/mixins/methods.js'
export default {
  mixins: [Methods],
  data () {
    return {
      noDataTip: '暂无任务',
      curPage: 'task',
      queryParams: {
        isSendFlag: 1
      },
      queryApiName: 'queryList', // 默认查询接口api名称
    }
  },
  methods: {
    selectable (row, index) {
      return !row.isRefund
    },
    /**
     * 批量发货操作
    */
    batchSend () {
      this.isBatch = true
      if (!this.selectionData.length) {
        return this.everWarning('请选择订单数据再发货')
      }
      this.openPostDialog(true)
    },
    /**
     * 确认批量发货
     * @param {Object}  obj   物流信息
     * @param {Array}   list  订单信息 + 物流单号信息
     * @param {Boolean} isBatch  是否批量
     * @param {Number} pricingModel 是否批次定价
    */
    confirmBatchSend ({ obj, list, isBatch }) {
      if (isBatch) {
        const { logisticsName, expressCompanyId, expressCode } = obj
        this.api.batchSend({
          logisticsName,
          expressCompanyId,
          expressCode,
          pricingModel: this.isBatch,
          logisticsDtos: list.map(item => ({ logisticsCode: item.logisticsCode, orderCode: item.orderCode }))
        }).then(res => {
          if (!res) return
          const { msg } = res
          if (!msg) {
            this.everSuccess('发货完成')
            this.closePostDialog()
            this.list(this.searchCode, true)
          } else {
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
              showCancelButton: false
            })
              .then(() => {
                this.closePostDialog()
                this.list(this.searchCode, true)
              })
              .catch(action => { })
          }
        }).finally(_ => {
          this.$refs.post && this.$refs.post.resetLoading()
        })
      } else {
        this.sendOrder(obj)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.pagination /deep/ .el-pagination .el-input__inner {
  height: 20px;
}
</style>
