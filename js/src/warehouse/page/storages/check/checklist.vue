<template>
  <div>
    <div v-if="materialType == 298" class="layout_inner_reminder">
      <p class="reminder">功能完善中,敬请期待</p>
    </div>
    <div v-else class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
        </ever-query-form>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column show-overflow-tooltip
          prop=""
          label=""
          width="50">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop=""
          label="盘点单号">
          <template slot-scope="scope">
            <a @click="$router.push('/storages/check/checkstocktaking/' + scope.row.id + '/' + scope.row.status)">{{scope.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column show-overflow-tooltip
          prop="storageRoomName"
          label="盘点库房">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop=""
          label="盘点范围">
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryRange">{{setName(INVENTORY_RANGE, scope.row.inventoryRange)}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="status"
          label="状态">
          <template slot-scope="scope">
            {{setName(STOCKSTATUS, scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop=""
          label="盘点人">
          <template slot-scope="scope">
            <span v-if="scope.row.checkUserName">{{scope.row.checkUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="createTime"
          label="盘点时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{scope.row.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop=""
          label="确认人">
          <template slot-scope="scope">
            <span v-if="scope.row.auditUserName">{{scope.row.auditUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
          prop="auditTime"
          label="确认时间">
          <template slot-scope="scope">
            <span v-if="scope.row.auditTime">{{scope.row.auditTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :pagesize="pagesize"
          :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../../../store/drugstocktakingapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import { STOCKSTATUS, INVENTORY_RANGE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import printCodeSettingMixmins from '@/warehouse/page/storages/mixins/printCodeSetting.mixins.js'

var querySchema = [
  {
    name: 'checkTime',
    label: '盘点时间',
    type: 'date',
    outformat: 'yyyy-MM-dd HH:mm:ss',
    props: {
      defaultValue: new Date()
    }
  },
  {
    label: '序号',
    name: 'printCode',
    style: {
      width: '100px'
    }
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    options: [{ id: '', name: '全部' }, ...STOCKSTATUS]
  }
]

export default {
  mixins: [list, sets, getstorage, printCodeSettingMixmins],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj,
      STOCKSTATUS,
      INVENTORY_RANGE,
      tableData: [],
      params: { 'inOutstockType': 0, 'materialType': '' },
      delId: ''
    }
  },
  created () {
    this.querySchema = this.createdSchema(this.querySchema)
  },
}
</script>
<style lang="scss" scoped>
.layout_inner_reminder {padding: 20px; margin: 0 20px; border-radius: 4px; background: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); width: 90%; height: 80%; position: absolute; background-color: #fff;}
.reminder { position: absolute; left: 40%; top: 40%; font-size: 20px; }
</style>
