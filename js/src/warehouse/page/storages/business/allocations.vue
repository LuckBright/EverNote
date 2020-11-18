<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        :inline="true"
        class="form"
        @query="list()">
        <template slot="date">
          <ever-range-picker
            :start.sync="queryObj.applicantStartTime"
            outformat="YYYY-MM-DD HH:mm:ss"
            :defaultTime="['00:00:00', '23:59:59']"
            :end.sync="queryObj.applicantEndTime">
          </ever-range-picker>
        </template>
        <template slot="default">
          <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          <el-button size="small" @click="handlerReset">重置</el-button>
          <el-button
            type="primary"
            size="small"
            style="margin-bottom: 5px;"
            @click="$router.push(`/storages/business/${path}`)"
            class="fr">新增调拨</el-button>
        </template>
      </ever-form2>
    </div>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        show-overflow-tooltip
        prop="code"
        align="center"
        label="调拨单号">
        <template slot-scope="scope">
          <span
            class="blue"
            @click="$router.push(`/storages/business/${scope.row.status === 108 ? `${path}?id=` : 'allocationess/'}` + scope.row.id)"
          >{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="toStorageRoom"
        label="收货库房"
      ></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="applicantName" label="申请人"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="申请时间">
        <template slot-scope="scope">
          {{scope.row.applicantTime || '-'}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="status" label="业务状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status">{{scope.row.status | formateValueToFnt({list: FULL_STATE.allocation})}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="status" label="退返入库">
        <template slot-scope="scope">
          {{scope.row.inReturnStockStatus ? '有' : '-'}}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
  </div>
</template>

<script>
import list from '@/util/list'
import setName from '@/util/setstatusname'
import api from '../store/allocationapi.js'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import receiptTableListMixins from '@/warehouse/page/storages/mixins/receipt.table.list.mixins.js'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'

let querySchema = [
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', filterOverdueRecord: true },
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '调拨单号',
    name: 'code'
  },
  {
    label: '序号',
    name: 'printCode',
    style: {
      width: '100px'
    }
  },
  {
    label: '收货库房',
    name: 'toStorageRoomId',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    name: 'date',
    label: '申请日期',
    comp: 'custom',
    style: 'width: 360px;',
    class: 'data_picker',
  },
  {
    label: '业务状态',
    name: 'status',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    label: '退返入库',
    name: 'isHaveReturn',
    comp: 'sys-select',
    style: 'width: 100px;',
    props: {
      options: [{ id: '', name: '全部' }, { id: 1, name: '有' }, { id: 0, name: '无' }]
    }
  }
]

export default {
  mixins: [list, setName, receiptTableListMixins, printCodeSettingMixmins],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.applicantStartTime = ''
    queryObj.applicantEndTime = ''
    return {
      queryObj,
      querySchema,
      api,
      businessTypes: 'allocation',
      tableData: []
    }
  },
  created () {
    this.querySchema = this.createdSchema(this.querySchema)
    this._info()
  },
  computed: {
    path () {
      return this.isBatch ? 'allocationaddbatch' : 'allocationadd'
    }
  },
  methods: {
    handlerReset () {
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
      this.query(this.queryObj)
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
  },
  activated () {
    this.list()
  },
}

</script>
<style lang="less" scoped>
.form {
  /deep/ .data_picker .el-date-editor {
    width: 360px !important;
  }
}
</style>
