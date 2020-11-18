/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 16:35:32
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-07 11:22:36
 */

<template>
  <!-- 发货记录 -->
  <el-container>
    <div class="main-head">
      <ever-form2
        onsubmit="return false;"
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true">
        <template slot="businessTime">
          <ever-range-picker
            dateType="daterange"
            width="260px"
            :noclear="true"
            :autoWidth="false"
            :start.sync="queryObj.sendStartTime"
            :end.sync="queryObj.sendEndTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-container class="page_layout_full_hidden mt10">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 左侧列表 -->
        <order-list
          ref="orderList"
          class="flex_scroll"
          :checkbox-width="30"
          :cur-page="curPage"
          :list-columns="leftOrderColumns"
          :table-data="tableData"
          :loading="loading"
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
          <template v-if="orderHeadObj && orderHeadObj.orderCode">
            <!-- 订单头 -->
            <order-header class="p10" :head-obj="orderHeadObj" :types="[1, 3, 4]"></order-header>
            <el-main class="">
              <!-- 订单列表 -->
              <order-detail :table-data="orderTableData"></order-detail>
              <el-row class="m10 alg_c mb10 mt10" align="center">
                <el-button type="primary" size="small" @click="openPostDialog(false, true)">修改物流信息</el-button>
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
      v-if="tableData && tableData.length"
      ref="post"
      :is-send="false"
      :post-data="postData"
      @confirm="confirmPost">
    </post-dialog>
  </el-container>
</template>

<script>
import Methods from '../mixins/methods'
import list from '@/util/list'
import { dateFormat, debounce } from '@/util/common'
import GetStorage from '@/warehouse/page/storages/util/getstorage'
import { get } from 'lodash'

const querySchema = [
  {
    label: '订单编号',
    style: 'width: 180px',
    name: 'orderCode'
  },
  {
    label: '姓名',
    name: 'name'
  },
  {
    label: '下单日期',
    name: 'orderTime',
    comp: 'datePicker',
    props: {
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
  },
  {
    label: '发货日期',
    name: 'businessTime',
    comp: 'custom'
  },
]
/**
 * 此处list请求使用的 公共list方法
*/
export default {
  mixins: [Methods, list, GetStorage],
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    // 一个月前 加一天
    queryObj.sendStartTime = dateFormat(this.$moment().subtract(1, 'months').add(1, 'd'), null, 'startDay')
    queryObj.sendEndTime = dateFormat(Date.now(), null, 'endDay')
    queryObj.isSendFlag = 2 // "isSendFlag":2,  //必填, 1 查询未发货  2 查询已发货
    queryObj.requestSwitch = true
    return {
      noDataTip: '暂无任务',
      curPage: 'record',
      querySchema,
      queryObj,
      tableData: [],
      listParams: {
        isSendFlag: 2,
        storageRoomId: this.storageId
      },
      getCount: -1, // 当前请求次数
      notUseQuery: true,
      noRunListFn: true,
      noClearTableData: true,
      curData: {}, // 当前选中列表数据
      listApiName: 'queryCompletedList',
      initQueryObj: Object.assign({}, queryObj)
    }
  },
  watch: {
    queryObj: {
      handler: debounce(function () {
        if (this.queryObj.orderTime) {
          this.listParams.orderTime = dateFormat(this.queryObj.orderTime, null, 'endDay')
        } else {
          this.listParams.orderTime = ''
        }
        this.getCount++
        this.list()
      }, 500),
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 查无数据时，重置回上一次记录
    afterList (res) {
      const tableLength = res.length
      if (!tableLength && this.getCount) {
        this.tableData = this.oldTableData
        this.totalCount = this.oldTotalCount
        this.everWarning('暂无匹配的结果')
      } else if (tableLength) {
        this.curData = this.tableData[0]
        this.orderCode = this.curData.orderCode
        this.getOrderDetail(this.orderCode)
      }
      this.setCurrentRow()
      if (tableLength) {
        this.oldTableData = this.tableData.concat([])
        this.oldTotalCount = this.totalCount
      }
    },
    setCurrentRow () {
      this.$nextTick(_ => {
        let table
        if ((table = get(this.$refs, 'orderList.$refs.tableList.$refs.everTable', ''))) {
          table.setCurrentRow(this.curData)
        }
      })
    },
    handlerRowClick (row) {
      this.curData = row
      this.getOrderDetail(row.orderCode)
    },
    reset () {
      this.queryObj = Object.assign({}, this.initQueryObj)
    },
    /**
     * 修改物流信息完成
     * @param {Object}  obj   物流信息
    */
    confirmPost ({ obj }) {
      this.api.updateLogistics(Object.assign({}, obj, { orderCode: this.orderCode, expressInformationId: this.expressInformationId })).then(res => {
        if (res) {
          this.getOrderDetail(this.orderCode)
          this.closePostDialog()
          this.everSuccess('保存成功')
        }
      }).finally(_ => {
        this.$refs.post.resetLoading()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination /deep/ .el-pagination .el-input__inner {
  height: 20px;
}
</style>
