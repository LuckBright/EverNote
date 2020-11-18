/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-07 15:38:10
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-25 10:56:16
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
        :inline="true"
        :is-query="true">
        <template slot="businessTime">
          <ever-range-picker
            dateType="daterange"
            width="260px"
            :noclear="true"
            :autoWidth="false"
            :start.sync="queryObj.startDate"
            :end.sync="queryObj.endDate"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-container class="page_layout_full_hidden mt10">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 左侧列表 -->
        <order-list
          class="flex_scroll"
          ref="orderList"
          :cur-page="curPage"
          :table-data="tableData"
          :loading="loading"
          :list-columns="leftColumns"
          :key="curPage"
          @row-click="handlerRowClick">
        </order-list>
        <ever-pagination
          justify="center"
          layout="total, prev, pager, next, jumper"
          :page-sizes="pageSizes"
          :no-bg="true"
          :pager-count="5"
          :total-count="totalCount"
          :current="current"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </ever-pagination>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap bWhite" v-loading="loadingRight">
          <template v-if="orderHeadObj.sourceCode">
            <!-- 订单头 -->
            <!-- types="2" 1:发货 2:退货 3:收货 4:发货 -->
            <order-header
              class="p10"
              :types="[2]"
              :head-obj="orderHeadObj"></order-header>
            <el-main>
              <!-- 订单列表 -->
              <order-detail
                :column-filter-fn="columnFilterFn"
                :cur-page="curPage"
                :table-data="orderTableData">
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
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import { dateFormat } from '@/util/common'
import Methods from '../mixins/methods'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'

const querySchema = [
  {
    label: '退货单号',
    style: 'width: 180px',
    name: 'code'
  },
  {
    label: '姓名',
    name: 'patientName'
  },
  {
    label: '物资名称',
    name: 'localMaterialId',
    comp: 'everRemoteMethod',
    props: {
      placeholder: REMOTE_METHODS_PLACEHOLDER,
      showKeys: true,
      api: getMaterialInfoApi,
      apiName: 'listlocal',
      clearOptions: true
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '退货日期',
    name: 'businessTime',
    comp: 'custom'
  },
]

export default {
  mixins: [Methods],
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    // 一个月前 加一天
    queryObj.startDate = dateFormat(this.$moment().subtract(1, 'months').add(1, 'd'), null, 'startDay')
    queryObj.endDate = dateFormat(Date.now(), null, 'endDay')
    return {
      noDataTip: '暂无退货任务',
      curPage: 'lack',
      querySchema,
      queryObj,
      listApiName: 'getBackList',
      detaialApiName: 'getBackTaskItem',
      initQueryObj: Object.assign({}, queryObj)
    }
  },
  methods: {
    columnFilterFn (columns) {
      return columns.slice(2)
    }
  }
}
</script>
