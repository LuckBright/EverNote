<template>
  <div id="query">
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <ever-form2
          :schema="querySchema"
          :inline="true"
          @query="query"
          v-model="queryObj">
          <template slot="classifyId">
            <el-select v-model="queryObj.classifyId" :clearable="true" @visible-change="visibleChange" placeholder="商品分类">
              <el-option
                v-for="item in classifyIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
          <template slot="default">
            <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
          </template>
          </ever-form2>
        </div>
        <span class="table_date" v-if="dateSlot">{{dateSlot}}</span>
        <el-table
          v-loading.body="loading"
          :data="tableData"
          @cell-mouse-enter="rowHover"
          @cell-click="handleDetails"
          :stripe="false"
        >
          <el-table-column show-overflow-tooltip width="50">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
            align="center"
            width="120"
            label="货位号"
          >
            <template slot-scope="scope">
              <span>{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip v-else prop width="80" align="center" label="单位">
            <template slot-scope="scope">
              {{scope.row.unitName || '-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="140" label="规格">
            <template slot-scope="scope">
              {{scope.row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="right" label="入库数量">
            <template slot-scope="scope">
              <span v-if="scope.row.inNum">{{scope.row.inNum}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="right" label="出库数量">
            <template slot-scope="scope">
              <span v-if="scope.row.outNum">{{scope.row.outNum}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="right" label="库存数量">
            <template slot-scope="scope">
              {{scope.row.stockNum ? scope.row.stockNum : 0}}{{scope.row.unitName}}
            </template>
          </el-table-column>
          <el-table-column align="center" width="100" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="info" @click="handleDetails(scope.row)">详情</el-button>
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
  </div>
</template>
<script>
import api from '../store/enterpinliveapi'
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
import classifyapi from '@/warehouse/page/groupmaterial/store/classifyapi'
import list from '@/util/list'
import setName from '@/util/setstatusname'
import { searchDateMoment, dateFormat, patch, SEARCH_CODE, SPU_SPEC_CODE, PACKAGE_CODE, SPEC_CODE, PRODUCER, SPEC, APPROVAL_CODE, date2Timestamp } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'

let querySchema = [
  {
    name: 'classifyId',
    label: '商品分类',
    comp: 'custom',
    style: 'width: 120px',
    props: {
      options: []
    },
  },
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    props: {
      params: { materialType: '' },
    },
    style: REMOTE_METHODS_WIDTH
  },
  {
    name: 'supplierLocalId',
    comp: 'everRemoteMethod',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
    },
    label: '供应商'
  },
  {
    name: 'batchNum',
    label: '生产批号',
    props: {
      placeholder: '生产批号',
    },
    comp: 'text'
  },
  {
    name: 'startDate',
    label: '开始时间',
    props: {
      placeholder: '选择日期',
      type: 'date',
      outformat: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    comp: 'el-date-picker',
  },
  {
    name: 'endDate',
    label: '结束时间',
    props: {
      type: 'date',
      outformat: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd 23:59:59',
      placeholder: '选择日期',
    },
    comp: 'el-date-picker',
  }
]
export default {
  mixins: [list, setName, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj,
      dosageFormArr: [],
      dateSlot: '',
      SPEC,
      SEARCH_CODE,
      SPU_SPEC_CODE,
      APPROVAL_CODE,
      PACKAGE_CODE,
      PRODUCER,
      SPEC_CODE,
      noClearDate: true,
      classifyIdOptions: []
    }
  },
  created () {
    this.queryObj.requestSwitch = true
    searchDateMoment(this.queryObj)
    this._info()
    if (this.queryObj.startDate) {
      this.dateSlot = `以下数据时间段：${dateFormat(this.queryObj.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(this.queryObj.endDate, 'YYYY-MM-DD')}`
    } else {
      this.dateSlot = ''
    }
  },
  methods: {
    async visibleChange (val) {
      if (val && !this.classifyIdOptions.length) {
        await classifyapi.listclassify({ storageRoomId: this.storageId }).then(res => {
          this.classifyIdOptions = res
        })
      }
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    rowHover (row, column, cell, event) {
      event.target.parentNode.classList.add('hover_rows')
    },
    handleDetails (row) {
      let objUrl = {}
      if (row.localMaterialId) {
        objUrl.startDate = this.queryObj.startDate || ''
        objUrl.endDate = this.queryObj.endDate || ''
        let finalUrl = `${row.localMaterialId}?${this._encodeSearchParams(objUrl)}`
        this.$router.push('/storages/query/queryenterdetails/' + finalUrl)
      }
    },
    _info () {
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.materialType = this.materialType
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
    },
    _encodeSearchParams (obj) {
      const params = []
      Object.keys(obj).forEach((key) => {
        let value = obj[key]
        if (typeof value === 'undefined') {
          value = ''
        }
        params.push([key, encodeURIComponent(value)].join('='))
      })
      return params.join('&')
    },
    ...patch
  },
  watch: {
    'queryObj': {
      handler (v) {
        // this.queryObj.endDate = dateFormat(this.queryObj.endDate, 'YYYY-MM-DD HH:mm:ss', 'endDay')
        // this.queryObj.startDate = dateFormat(this.queryObj.startDate, 'YYYY-MM-DD HH:mm:ss', 'startDay')
        this.query(this.queryObj)
      },
      deep: true
    },
    'queryObj.startDate' (date) {
      if (date) {
        this.dateSlot = `以下数据时间段：${dateFormat(this.queryObj.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(this.queryObj.endDate, 'YYYY-MM-DD')}`
      } else {
        this.dateSlot = ''
      }
    },
    'queryObj.endDate' (date) {
      if (date) {
        if (date2Timestamp(this.queryObj.startDate) > date2Timestamp(date)) {
          this.queryObj.endDate = ''
          this.dateSlot = `以下数据时间段：${dateFormat(this.queryObj.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(this.queryObj.endDate, 'YYYY-MM-DD')}`
          return this.$messageTips(this, 'warning', '结束时间不能在开始时间前，请重新选择')
        }
      } else {
        this.dateSlot = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-default {
  border: none;
  border-radius: 0;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .hover_rows {
  cursor: pointer;
}
.el-table__body-wrapper /deep/ .el-table__row {
  cursor: pointer;
}
.el-table /deep/ .el-table__expanded-cell {
  padding: 0;
}
.el-table /deep/ .el-table__expanded-cell .el-table {
  margin: 0 -1px;
}
.el-table /deep/ .el-icon {
  display: none;
}
.el-table.table-option /deep/ .el-tooltip {
  padding: 0 10px 0 8px !important;
}
.table_date {
  font-size: 14px;
}
</style>
