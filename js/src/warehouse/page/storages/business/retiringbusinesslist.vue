<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          @query="list()">
          <template slot="date">
            <ever-range-picker
              :start.sync="queryObj.start"
              outformat="YYYY-MM-DD HH:mm:ss"
              :defaultTime="['00:00:00', '23:59:59']"
              :end.sync="queryObj.end">
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
              class="fr">新增退库</el-button>
          </template>
        </ever-form2>
      </div>
      <el-table
        border
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="code" width="300" label="退库单号">
          <template slot-scope="{ row: { id, code, status } }">
            <span
              class="blue"
              @click="$router.push(status === 61 ? `/storages/business/${path}?id=${id}` : '/storages/business/retiringbusiness/' + id)"
            >{{code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="toStorageRoom" label="收货库房"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="createName" label="申请人"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.createDate || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="业务状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{setName(FULL_STATE.stockback, scope.row.status, true)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop label="退返入库">
          <template slot-scope="scope">
            {{scope.row.inReturnStockStatus ? '有' : '无'}}
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
  </div>
</template>
<script>
import api from '../store/retiringapi'
import list from '@/util/list'
import setName from '@/util/setstatusname'
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
    label: '退库单号',
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
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      api,
      isisInvented: true,
      businessTypes: 'stockback',
      queryObj: obj
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
  computed: {
    path () {
      return this.isBatch ? 'retiringbusinaddbatch' : 'retiringbusinadd'
    }
  },
  created () {
    this.querySchema = this.createdSchema(this.querySchema)
    this._info()
  },
  activated () {
    this.list()
  },
  watch: {
    'queryObj.code': {
      handler (v) {
        this.query(this.queryObj)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.layout_inner {
  border: none;
  border-radius: 0;
}

.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>
