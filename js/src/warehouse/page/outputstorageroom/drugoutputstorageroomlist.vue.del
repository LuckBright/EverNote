<template>
  <div>
    <ever-bread-crumb name="药品出库" :path="`/goods/drugoutputstoragerooms/${$route.params.status}`"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <el-button
          type="text"
          class="success"
          @click="handleComplete"
        >{{$route.params.status == 20 ? '查看已完成的任务' : '返回待出库的任务' }}</el-button>
        <div class="main-option">
          <h4>
            <span v-if="$route.params.status == 20">待出库的任务</span>
            <span v-else>已经完成的任务</span>
          </h4>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column show-overflow-tooltip prop align="center" label="出库单号">
          <template slot-scope="scope">
            <span
              class="blue"
              @click="$router.push(scope.row.status == 20 ? `/goods/drugoutputstorageroom/${scope.row.id}` : `/goods/drugoutputstorageroomedit/${scope.row.id}?look=${scope.row.id}`)"
            >{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="type" align="center" label="出库类型">
          <template slot-scope="scope">{{setName(FULL_IN_OUT_TYPE.outtype, scope.row.type, true)}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="关联单据">
          <template slot-scope="scope">{{setName(FULL_ORDER_NAME.outtype, scope.row.type, true)}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" width="300" label="关联单号">
          <template slot-scope="scope">
            <span>{{scope.row.billCode}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" align="center" label="创建时间">
          <template
            slot-scope="scope"
          >{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="status" align="center" label="状态">
          <template slot-scope="scope">{{setName(FULL_STATE.outstock, scope.row.status, true)}}</template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import api from './outputstockapi'
import storageroomApi from '../../store/storageroomapi'
import getMaterialInfoApi from '../../store/getmaterialinfoapi'
import setName from '@/util/setstatusname'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import { DRUGTYPE, debounce, FULL_STATE, FULL_IN_OUT_TYPE, FULL_ORDER_NAME } from '@/util/common'
var querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    placeholder: REMOTE_METHODS_PLACEHOLDER,
    type: 'remotemethod',
    api: getMaterialInfoApi,
    params: { materialType: DRUGTYPE },
    showKeys: ['byname', 'spec', 'type', 'dosageForm'],
    showName: 'drugObject',
    apiName: 'listlocal',
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'storageRoomId',
    label: '库房名称',
    api: storageroomApi,
    type: 'remotemethod',
    initoptions: [],
    userType: true
  }
]

export default {
  mixins: [list, setName],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    // 'inOutstockType': 0,
    return {
      querySchema,
      queryObj: obj,
      FULL_STATE,
      FULL_IN_OUT_TYPE,
      FULL_ORDER_NAME,
      api,
      listParams: { 'materialType': DRUGTYPE, status: this.$route.params.status },
      inStockType: []
    }
  },
  methods: {
    handleComplete: debounce(function () {
      Number(this.$route.params.status) === 20 ? this.$router.push('/goods/drugoutputstoragerooms/21') : this.$router.push('/goods/drugoutputstoragerooms/20')
      this.listParams.status = this.$route.params.status
      this.handleCurrentChange()
    })
  }
}
</script>
<style lang="scss" scoped>
span.blue {
  color: #1c7bef;
  cursor: pointer;
}
span.blue:hover {
  text-decoration: underline;
}
.success {
  position: absolute;
  right: 40px;
  top: 80px;
}
.main-option h4 {
  margin: 0;
  line-height: 36px;
  height: 36px;
  text-align: left;
}
</style>
