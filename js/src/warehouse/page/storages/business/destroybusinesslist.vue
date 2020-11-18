<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          style="width: calc(100% - 110px)"
          ref="form"
          v-model="queryObj"
          :inline="true">
          <template slot="createTime">
            <ever-range-picker
              width="260px"
              dateType="daterange"
              :autoWidth="false"
              :clearable="true"
              :start.sync="queryObj.beginDate"
              :end.sync="queryObj.endDate"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
            <el-button size="small" @click="resetForm">重置</el-button>
          </template>
        </ever-form2>
        <el-button class="addbackcode" type="primary" size="small" @click="$router.push(`/storages/business/${isBatch ? 'destroybusinessaddbatch' : 'destroybusinessadd'}`)">新增销毁报废</el-button>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column
          show-overflow-tooltip
          prop="code"
          align="center"
          label="销毁报废单号"
          width="300"
        >
          <template slot-scope="scope">
            <span
              class="blue"
              @click="$router.push(scope.row.status == 101 ? `/storages/business/${isBatch ? 'destroybusinessaddbatch' : 'destroybusinessadd'}/${scope.row.id}` : `/storages/business/destroybusinessee/${scope.row.id}`)"
            >{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" prop="printCode"  width="100" v-if="printCodeSetting === 1"></el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="申请人">
          <template slot-scope="scope">
            <span v-if="scope.row.applicant">{{scope.row.applicant}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.applicantDate || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop align="center" label="业务状态">
          <template slot-scope="scope">
            <span
              v-if="scope.row.status"
            >{{setName(FULL_STATE.destroyReason, scope.row.status, true)}}</span>
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
import api from '../store/destroyscrapapi'
import list from '@/util/list'
import sets from '@/util/setstatusname'
import { FULL_STATE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import storage from '@/util/storage'
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
    label: '销毁报废单号',
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
    label: '申请日期',
    name: 'createTime',
    comp: 'custom'
  },
  {
    label: '业务状态',
    name: 'status',
    comp: 'select',
    props: {
      options: [{ id: '', name: '全部' }, ...FULL_STATE.destroyReason.filter(item => [101, 102, 104, 105].includes(item.id))]
    }
  }
]

export default {
  mixins: [list, sets, getstorage, storage, printCodeSettingMixmins],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      queryObj: obj,
      FULL_STATE
    }
  },
  methods: {
    resetForm () {
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
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
    }
  },
  activated () {
    this.list()
  },
  created () {
    this.querySchema = this.createdSchema(this.querySchema)
    this._info()
  }
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
