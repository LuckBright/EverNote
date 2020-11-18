<template>
  <div>
    <ever-bread-crumb name="进销存查询" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div>
        <h4>
          <span>{{`${detailsName}`}}</span>
        </h4>
        <span class="table_date">{{dateSlot}}</span>
        <el-table
          :data="tableData"
          :expand-row-keys="entexpands"
          row-key="id">
          <el-table-column show-overflow-tooltip prop align="center" width="150" label="时间">
            <template slot-scope="scope">{{dateFormat(scope.row.operateDate, 'YYYY-MM-DD')}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="typeName" width="180" align="center" label="出入库类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="inNum" align="right" label="入库数量">
            <template slot-scope="scope">
              <span v-if="scope.row.inNum">{{scope.row.inNum}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="outNum" align="right" label="出库数量">
            <template slot-scope="scope">
              <span v-if="scope.row.outNum">{{scope.row.outNum}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop align="center" width="300" label="单号">
            <template slot-scope="scope">
              <a
                @click="$router.push(scope.row.type <= 12 && scope.row.type >= 5 || INSTOCK_TYPE.includes(scope.row.type) ? '/storages/entry/entryedit/' + scope.row.id + '?look=' + scope.row.id : '/storages/output/outputedit/' + scope.row.id + '?look=' + scope.row.id)"
              >{{scope.row.code}}</a>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop align="center" label="操作时间">
            <template slot-scope="scope">
              <span>{{scope.row.operateDate || '-'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="enter_table pos_re">
          <el-table
            v-if="tableTotal.length == 1"
            class="table_total"
            :data="tableTotal"
            :show-header="false"
            style="margin: 10px 0; margin-top: -12px; z-index: 1"
          >
            <el-table-column show-overflow-tooltip prop width="150" align="center" label>
              <template slot-scope="scope">
                <span>{{scope.row ? '总计' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop label width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="totalInNum" align="right" label>
              <template slot-scope="scope">
                <span v-if="scope.row.totalInNum">
                  {{scope.row.totalInNum}}{{tableData[0].unitName}}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop align="right" label>
              <template slot-scope="scope">
                <span v-if="scope.row.totalOutNum">
                  {{scope.row.totalOutNum}}{{tableData[0].unitName}}
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop label width="300" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop label></el-table-column>
          </el-table>
        </div>
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
import localdrugsettingapi from '@/warehouse/store/localdrugsettingapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import customList from '@/warehouse/page/storages/util/customList'
import { FULL_IN_OUT_TYPE, dateFormat, patch, PACKAGE_CODE } from '@/util/common'
import setName from '@/util/setstatusname'
import { INSTOCK_TYPE } from '@/warehouse/views/util/constant.js'

export default {
  mixins: [customList, setName, getstorage],
  data () {
    return {
      dateFormat,
      api,
      localdrugsettingapi,
      PACKAGE_CODE,
      INSTOCK_TYPE,
      dateSlot: '',
      detailsName: '',
      tableTotal: [],
      entexpands: []
    }
  },
  created () {
    if (this.$route.params.id) {
      let queryName = {}
      this.$route.query && this.$route.query.q ? queryName = JSON.parse(this.$route.query.q) : queryName = this.$route.query
      if (queryName.startDate && queryName.endDate) {
        this.dateSlot = `以下数据时间段：${dateFormat(queryName.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(queryName.endDate, 'YYYY-MM-DD')}`
      } else {
        this.dateSlot = ''
      }
      this.customList()
    }
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    customList: function (refresh) {
      if (refresh) {
        this.offset = 0
      }
      this._delArr()
      let params = {}
      if (this.$route.query && this.$route.query.q) {
        var queryUrl = JSON.parse(this.$route.query.q)
      }
      params.materialType = this.materialType
      params.startDate = queryUrl ? queryUrl.startDate : this.$route.query.startDate
      params.endDate = queryUrl ? queryUrl.endDate : this.$route.query.endDate
      params.localMaterialId = this.$route.params.id
      params.storageRoomId = this.storageId
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.api.getByList(params).then(res => {
        if (res && res.result) {
          this.detailsName = res.result.materialName || ''
          this.tableTotal = [{
            totalInNum: res.result.totalInNum,
            totalOutNum: res.result.totalOutNum
          }]
          let results = JSON.parse(JSON.stringify(res.result.resultList))
          for (let i = 0; i < results.length; i++) {
            if (results[i].type <= 12 && results[i].type >= 5 || INSTOCK_TYPE.includes(results[i].type)) {
              results[i].typeName = this.setName(FULL_IN_OUT_TYPE.intype, results[i].type, true)
            } else {
              results[i].typeName = this.setName(FULL_IN_OUT_TYPE.outtype, results[i].type, true)
            }
          }
          let resu = results
          JSON.parse(JSON.stringify(resu))
          for (let n = 0; n < resu.length; n++) {
            for (let m = n + 1; m < results.length; m++) {
              if (results[n].date && results[n].date === results[m].date) {
                delete results[m].date
              }
            }
          }
          this.tableData = results
          this.totalCount = res.totalCount
          this.entexpands.push(this.tableData[this.tableData.length - 1].id)
        } else {
          this.tableTotal = []
          this.tableData = []
          this.totalCount = 0
        }
        // this._encodeSearchParams(params)
      })
    },
    _delArr () {
      this.tableData = []
      this.tableTotal = []
    },
    _getTrEle (el) {
      var parent = el.parentNode
      if (parent && parent.nodeName === 'TR') {
        return parent
      } else if (parent) {
        return this._getTrEle(parent)
      }
    },
    ...patch
  }
}
</script>
<style lang="scss" scoped>
.table_date {
  font-size: 14px;
}
.h4 {
  margin-top: 32px;
}
.table_total {
  margin: 0;
}
.el-table /deep/ .el-table__expanded-cell {
  padding: 0;
}
.el-table /deep/ .el-icon {
  display: none;
}
.table_total /deep/ tr.el-table__row {
  background-color: #edf7ff;
}
</style>
