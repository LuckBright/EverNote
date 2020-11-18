<template>
  <div>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            :inline="true"
            :is-query="true"
            @query="customList()">
            <template slot="default">
              <el-button type="primary" size="small" @click="customList">查询</el-button>
            </template>
            <template slot="uniqueCode">
              <el-input
                class="own"
                placeholder="唯一码"
                v-model="uniqueCode"
                @keyup.enter.native="handelUniqueCode"
                clearable
              ></el-input>
            </template>
          </ever-form2>
        </div>
        <div class="enter_info" v-if="!flag">请输入商品名称/唯一码和时间段</div>
        <div class="commodity_circulation" v-else>
          <div class="commodity_info">
            <h4>商品信息</h4>
            <div v-if="tradeName">
              <el-row>
                <el-col :span="2" align="right">
                  <span class="cGray">商品名称：</span>
                </el-col>
                <el-col :span="20">
                  <material-show-name v-if="tradeName.materialNameAll" :materialName="tradeName.materialNameAll" :icons="tradeName.icons"></material-show-name>
                </el-col>
              </el-row>
            </div>
            <p v-if="showUniqueCode && !queryObj.localMaterialId">
              <el-row>
                <el-col :span="2" align="right">
                  <span>唯一码：</span>
                </el-col>
                <el-col :span="20">
                  <span>{{showUniqueCode}}</span>
                </el-col>
              </el-row>
            </p>
          </div>
          <div class="circulation_info">
            <h4>流转信息</h4>
            <span class="table_date" v-if="dateSlot">{{dateSlot}}</span>
          </div>
          <el-table
            :data="tableData"
            :show-header="false"
            empty-text="暂无流转信息"
            style="width: 100%"
            :stripe="false"
          >
            <el-table-column show-overflow-tooltip width="50" prop label></el-table-column>
            <el-table-column show-overflow-tooltip width="200" prop label>
              <template slot-scope="scope">
                <span>{{scope.row.finishTime || ''}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="180" prop label>
              <template slot-scope="scope">
                <span>【{{scope.row.typeName}}】</span>
              </template>
            </el-table-column>
            <el-table-column prop label>
              <template slot-scope="scope">
                <span>{{scope.row.flowDescription}}。</span>
                <span class="ml10" v-if="scope.row.code">{{scope.row.intOrOutName}}
                  <a
                    @click="handelCodeUrl(scope.row.type, scope.row.codeId)"
                  >{{scope.row.code}}</a>
                </span>
              </template>
            </el-table-column>
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
import api from '../store/commodityflowapi'
// import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import customList from '@/warehouse/page/storages/util/customList'
import { searchDateMoment, FULL_IN_OUT_TYPE, dateFormat, patch, date2Timestamp } from '@/util/common'
import setName from '@/util/setstatusname'
import { REMOTE_METHODS_WIDTH, INSTOCK_TYPE } from '@/warehouse/views/util/constant'

let querySchema = [
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    style: REMOTE_METHODS_WIDTH,
    props: {
      params: { materialType: '' }
    },
  },
  {
    name: 'uniqueCode',
    comp: 'custom',
    label: '唯一码'
  },
  {
    name: 'startDate',
    label: '开始时间',
    props: {
      outformat: 'yyyy-MM-dd HH:mm:ss',
      placeholder: '选择日期',
    },
    comp: 'date',
  },
  {
    name: 'endDate',
    label: '结束时间',
    props: {
      type: 'date',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      placeholder: '选择日期',
    },
    comp: 'el-date-picker',
  }
]
export default {
  mixins: [customList, setName, getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj: obj,
      dateSlot: '',
      tradeName: null,
      flag: false,
      uniqueCode: '',
      showUniqueCode: '',
      noClearDate: true
    }
  },
  created () {
    this._info()
    if (this.queryObj.startDate) {
      this.dateSlot = `以下数据时间段：${dateFormat(this.queryObj.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(this.queryObj.endDate, 'YYYY-MM-DD')}`
    } else {
      this.dateSlot = ''
    }
  },
  methods: {
    customList: function (refresh) {
      this.dateSlot = `以下数据时间段：${dateFormat(this.queryObj.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(this.queryObj.endDate, 'YYYY-MM-DD')}`
      if (refresh) {
        this.offset = 0
      }
      if (!this.queryObj.localMaterialId && !this.uniqueCode) {
        return
      }
      let params = {}
      params.startDate = this.queryObj.startDate
      params.endDate = this.queryObj.endDate
      params.localMaterialId = this.queryObj.localMaterialId
      params.uniqueCode = this.uniqueCode
      params.materialType = this.materialType
      params.storageRoomId = this.storageId
      params.offset = this.offset
      params.pagesize = this.pagesize
      if (params.localMaterialId) {
        delete params.uniqueCode
        this.uniqueCode = ''
      } else {
        delete params.localMaterialId
      }
      this.api.list(params).then(res => {
        if (res && res.totalCount) {
          if (res.list) {
            let results = JSON.parse(JSON.stringify(res.list))
            this.flag = true
            this.tradeName = results[0]
            this.showUniqueCode = params.uniqueCode
            for (let i = 0; i < results.length; i++) {
              if ((results[i].type <= 12 && results[i].type >= 5) || INSTOCK_TYPE.includes(results[i].type)) {
                results[i].typeName = this.setName(FULL_IN_OUT_TYPE.intype, results[i].type, true)
                results[i].intOrOutName = '入库单号'
              } else {
                results[i].typeName = this.setName(FULL_IN_OUT_TYPE.outtype, results[i].type, true)
                results[i].intOrOutName = '出库单号'
              }
            }
            this.tableData = results
            this.totalCount = res.totalCount
          } else {
            this.tableData = []
            this.totalCount = 0
          }
          this._encodeSearchParams(params)
        } else {
          this.flag = false
          this.$messageTips(this, 'warning', '该商品流向查询结果为空')
        }
      })
    },
    handelUniqueCode () {
      this.flag = false
      if (!this.uniqueCode) {
        return this.$messageTips(this, 'warning', '唯一码为空')
      }
      this.queryObj.localMaterialId = null
      this.customList()
    },
    handelCodeUrl (type, id) {
      if (type <= 12 && type >= 5 || INSTOCK_TYPE.includes(type)) {
        this.$router.push('/storages/entry/entryedit/' + id + '?look=' + id)
      } else {
        this.$router.push('/storages/output/outputedit/' + id + '?look=' + id)
      }
    },
    _info () {
      this.querySchema[0].props.params.materialType = this.materialType
      this.querySchema[0].props.params.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
      if (!this.$route.query.q) {
        searchDateMoment(this.queryObj)
      } else if (this.$route.query.q) {
        this.offset = (this.current - 1) * this.pagesize
        let query = JSON.parse(this.$route.query.q)
        if (query && query.uniqueCode) {
          delete query.localMaterialId
          this.uniqueCode = query.uniqueCode
        }
        Object.assign(this.queryObj, query)
        this.customList()
      }
    },
    ...patch
  },
  watch: {
    'queryObj.startDate' (date) {
      if (!date) {
        this.dateSlot = ''
        return this.$messageTips(this, 'warning', '请选择时间段进行筛选')
      }
      if (date) {
        this.queryObj.startDate = dateFormat(this.queryObj.startDate, 'YYYY-MM-DD HH:mm:ss', 'startDay')
        this.dateSlot = `以下数据时间段：${dateFormat(this.queryObj.startDate, 'YYYY-MM-DD')}  至  ${dateFormat(this.queryObj.endDate, 'YYYY-MM-DD')}`
      }
    },
    'queryObj.endDate' (date) {
      if (this.queryObj.startDate && date) {
        this.queryObj.endDate = dateFormat(this.queryObj.endDate, 'YYYY-MM-DD HH:mm:ss', 'endDay')
        if (date2Timestamp(this.queryObj.startDate) > date2Timestamp(date)) {
          this.queryObj.endDate = ''
          return this.$messageTips(this, 'warning', '结束时间不能在开始时间前，请重新选择')
        }
      }
    },
    'queryObj.localMaterialId' (id) {
      if (!id) {
        this.flag = false
        this.uniqueCode = null
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

.enter_info {
  font-size: 14px;
  color: #48576a;
  padding: 150px 0;
  text-align: center;
}
.commodity_info > p {
  font-size: 14px;
  color: #48576a;
  margin-left: 20px;
  line-height: 32px;
}
.circulation_info > h4 {
  display: inline-block;
}
.circulation_info > span {
  margin-left: 12px;
  font-size: 14px;
  color: #48576a;
}
</style>
