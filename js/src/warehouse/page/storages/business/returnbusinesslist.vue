<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        style="width: calc(100% - 110px)"
        ref="form"
        :schema="querySchema"
        v-model="queryObj"
        :inline="true">
        <template slot="createTime">
          <ever-range-picker
            width="260px"
            dateType="daterange"
            :autoWidth="false"
            :noclear="true"
            :start.sync="queryObj.beginDate"
            :end.sync="queryObj.endDate"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          <el-button size="small" @click="retsetQuery">重置</el-button>
        </template>
      </ever-form2>
      <el-button class="addbackcode" type="primary" size="small" @click="$router.push(`/storages/business/returnbusinessadd`)">新增采购退货</el-button>
    </div>
    <el-table v-loading.body="loading" :data="tableData" border>
      <el-table-column show-overflow-tooltip prop="code" align="center" label="采购退货单号" width="300">
        <template slot-scope="scope">
          <span
            class="blue"
            @click="$router.push(`/storages/business/${scope.row.status === 71 ? 'returnbusiness' : 'returnbusinessee'}/${scope.row.id}`)"
          >{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
      <el-table-column show-overflow-tooltip align="left" prop="supplierName" label="供应商"></el-table-column>
      <el-table-column show-overflow-tooltip prop align="center" label="申请人">
        <template slot-scope="scope">
          <span v-if="scope.row.applicantName">{{scope.row.applicantName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createDate" align="center" label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="预计退货总金额">
        <template slot-scope="scope">
          <span v-if="scope.row.totalPrice != null">{{scope.row.totalPrice | formatToFinacial(4)}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="实际退货总金额">
        <template slot-scope="scope">
          <span v-if="scope.row.outTotalPrice != null">{{scope.row.outTotalPrice | formatToFinacial(4)}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="status" align="center" label="业务状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status">{{setName(FULL_STATE.return, scope.row.status, true)}}</span>
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
import api from '../store/givebackapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import { FULL_STATE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
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
    label: '采购退货单号',
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
    label: '供应商',
    name: 'supplierLocalId',
    comp: 'ever-remoteMethod',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
      params: { showflag: 1 },
      // isSilentQuery: true old
    }
  },
  {
    label: '申请日期',
    name: 'createTime',
    comp: 'custom'
  },
  {
    label: '业务状态',
    name: 'status',
    comp: 'select',
    props: {
      options: [{ id: '', name: '全部' }, ...FULL_STATE.return]
    }
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
      FULL_STATE
    }
  },
  methods: {
    retsetQuery () {
      this.queryObj.beginDate = ''
      this.queryObj.endDate = ''
      this.$refs.form.resetForm()
      this.query(this.queryObj)
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    _info () {
      this.querySchema[0].props.params.materialType = this.materialType
      this.querySchema[0].props.params.storageRoomId = this.storageId
      this.querySchema[0].showName = this.SHOWNAME
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
    }
  },
  created () {
    this.querySchema = this.createdSchema(this.querySchema)
    this._info()
  },
}
</script>
<style lang="scss" scoped>
.layout_inner {
  border: none;
  border-radius: 0;
}
.main-head{
  position: relative;
  .addbackcode{
    position: absolute;
    top: 0;
    right: 0;
  }
}
.main-option h4 {
  margin: 0;
  float: left;
  line-height: 36px;
}
</style>
