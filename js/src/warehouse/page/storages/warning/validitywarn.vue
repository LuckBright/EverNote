<template>
  <div>
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <ever-form2
            :schema="querySchema"
            :inline="true"
            :is-query="true"
            @query="list()"
            :nosubmit="true"
            v-model="queryObj">
          </ever-form2>
        </div>
        <div class="color-cue">
          <ul>
            <li>
              <span class="cue cue-red"></span>一个月内过期
            </li>
            <li>
              <span class="cue cue-yellow"></span>三个月内过期
            </li>
            <li>
              <span class="cue cue-green"></span>六个月内过期
            </li>
          </ul>
        </div>
        <el-table
          v-loading.body="loading"
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop label="商品名称">
            <template slot-scope="scope">
              <material-show-name
                v-if="scope.row.materialName"
                :materialName="scope.row.materialName"
                :icons="scope.row.icons">
              </material-show-name>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            label="规格">
            <template slot-scope="scope">
              {{scope.row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="batchNum"
            width="200"
            align="center"
            label="生产批号"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="num" width="100" align="right" label="库存量"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="allotNum"
            width="100"
            align="right"
            label="预定量"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="usableNum"
            width="100"
            align="right"
            label="可用量"
          >
            <template slot-scope="scope">{{scope.row.num - scope.row.allotNum}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop width="200" align="center" label="有效期">
            <template slot-scope="scope">{{_setTIMEName(scope.row.validitySign)}}</template>
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
import api from '../store/validityapi'
import list from '@/util/list'
import { LOOKCODE, SPEC_CODE, patch } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'

const TIME = [{
  id: 1,
  name: '有效期<30天'
},
{
  id: 2,
  name: '有效期<90天'
},
{
  id: 3,
  name: '有效期<180天'
},
{
  id: 4,
  name: '有效期>=180天'
},
{
  id: 5,
  name: '已过期'
},
{
  id: 6,
  name: '全部'
}
]

let querySchema = [
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { filterOverdueRecord: true, materialType: '' }
    },
    style: 'width: 350px'
  },
  {
    name: 'validitySign',
    label: '效期预警',
    comp: 'ever-select',
    props: {
      options: TIME
    }
  }
]

export default {
  mixins: [list, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      SPEC_CODE,
      TIME,
      querySchema,
      queryObj: obj,
      LOOKCODE,
    }
  },
  methods: {
    handlerQuery () {
      this.list()
    },
    list: function (refresh) {
      this.loading = true
      if (refresh) {
        this.offset = 0
      }
      var params = Object.assign({}, this.queryObj, this.listParams)
      for (let key in params) {
        if (params[key] === '' || key === 'requestSwitch') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      try {
        this.api.warninglist(params).then(result => {
          this.loading = false
          if (result) {
            if ('list' in result) {
              this.tableData = result.list
            } else if ('data' in result) {
              this.tableData = result.data
            } else {
              this.tableData = result
            }
            this.totalCount = result.totalCount ? result.totalCount : 0
            if (this.tableData && 'resultList' in this.tableData) {
              this.totalCount = this.tableData.totalCount
              this.tableData = this.tableData.resultList
            }
            if (!this.tableData[0]) this.tableData = []
            this.afterList && this.afterList()
          }
        })
      } catch (err) {
        this.loading = false
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.validitySign === 1) {
        return 'cue-red'
      } else if (row.validitySign === 2) {
        return 'cue-yellow'
      } else if (row.validitySign === 3) {
        return 'cue-green'
      }
      return ''
    },
    _setTIMEName (id) {
      for (let i = 0; i < this.TIME.length; i++) {
        if (this.TIME[i].id === id) {
          return this.TIME[i].name
        }
      }
      return ''
    },
    _info () {
      this.querySchema[0].props.params.materialType = this.materialType
      this.querySchema[0].props.params.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
    },
    ...patch
  },
  created () {
    this._info()
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    '$route' (v, oV) {
      for (let key in this.queryObj) {
        this.queryObj[key] = ''
      }
      this.queryObj.materialType = this.materialType
      this.offset = 0
      this.totalCount = 1
      this.list()
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-default {
  border: none;
  border-radius: 0;
}
.color-cue {
  font-size: 12px;
  color: #999;
}
.color-cue ul {
  padding: 0;
  margin: 0;
}
.color-cue ul li {
  float: left;
  margin-right: 10px;
  line-height: 30px;
  list-style-type: none;
}
.color-cue ul li span.cue {
  width: 15px;
  height: 5px;
  display: inline-block;
  margin-right: 5px;
  border-radius: 5px;
}
.cue-red {
  background-color: #ee4433;
}
.el-table /deep/ .el-table__row.cue-red {
  color: #ee4433;
}
.el-table /deep/ .el-table__row.cue-yellow {
  color: #ff9c01;
}
.el-table /deep/ .el-table__row.cue-green {
  color: #67c23a;
}
.cue-yellow {
  background: #ff9c01;
}
.cue-green {
  background: #67c23a;
}
</style>
