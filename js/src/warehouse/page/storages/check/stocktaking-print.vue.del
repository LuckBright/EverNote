<template>
  <div id="print">
    <div class="stockprint">
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">盘点计划单编号：{{obj.code}}</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">盘点药库：{{storageRoomArr.filter(v => {
            return v.id === obj.storageRoomId
          })[0] && storageRoomArr.filter(v => {
            return v.id === obj.storageRoomId
          })[0].name}}</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">盘点人员：{{obj.user}}</div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">盘点时间：{{obj.checkTime.split(' ')[0]}}</div></el-col>
    </el-row>
    <hr>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="lineNum"
        width="60"
        label="行号">
      </el-table-column>
      <el-table-column
        prop=""
        label="批准文号">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialVoObject.code}}</span> -->
          <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialVoObject.ratifyCode}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="商品名">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialVoObject.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="通用名">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialVoObject.byName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="规格">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject.materialVoObject">{{scope.row.localSettingObject.materialVoObject.packageInfo}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="batchNum"
        label="批号">
      </el-table-column>
      <el-table-column
        prop="manufacturer.name"
        label="厂商">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialVoObject.produceName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unitGroupItem.name"
        width="60"
        label="单位">
        <template slot-scope="scope">
          <span v-if="scope.row.localSettingObject">{{scope.row.localSettingObject.materialVoObject.packagUnitText}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stockNum"
        width="60"
        align="right"
        label="账面数量">
      </el-table-column>
      <el-table-column
        prop="num"
        width="60"
        align="right"
        label="实际数量">
      </el-table-column>
    </el-table>
  </div>
  </div>
</template>
<script>
import storageRoomApi from '@/warehouse/store/storageroomapi'
import drugstocktakingapi from '@/warehouse/store/drugstocktakingapi'
import { patch, SPEC_CODE, MATERILA_CODE, PRODUCER } from '@/util/common'
import setName from '@/util/setstatusname'
var schema = [
  {
    name: 'code',
    label: '盘点计划单编号',
    disabled: true
  },
  {
    name: 'storageRoomId',
    label: '盘点药库',
    type: 'select',
    options: [],
    disabled: true
  },
  {
    name: 'user',
    label: '盘点人员',
    disabled: true
  },
  {
    name: 'checkTime',
    label: '盘点时间',
    type: 'date',
    disabled: true,
    outformat: 'YYYY-MM-DD HH:mm:ss'
  }
]
export default {
  mixins: [setName],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      SPEC_CODE,
      PRODUCER,
      MATERILA_CODE,
      printinfo: {},
      tableData: [],
      storageRoomArr: []
    }
  },
  created () {
    storageRoomApi.list({ isInvented: 0 }).then(result => {
      this.storageRoomArr = result.list
    })
  },
  methods: {
    show (obj) {
      this.obj = obj
      this.getStockInfo().then(result => {
        this.obj.user = result.data.staff.name
        this.obj = Object.assign(this.obj, result.data)
        this.tableData = result.data.inventoryTakingItemVoList
      })
    },
    getStockInfo: function (refresh) {
      var params = Object.assign({}, this.params, { 'inventoryTakingId': this.obj.id })
      if (refresh) {
        this.offset = 0
      }
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = 100000
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      return drugstocktakingapi.getItemById(params).then(result => {
        return result
      })
    },
    ...patch
  }
}
</script>
<style lang="scss" scoped>
.stockprint{
  width:860px;
  margin:0 auto;
  font-size:12px;
  color:#000;
  /deep/ table{
    font-size: 13px;
    /deep/ td{
      padding: 7px 0;
    }
  }
}
</style>
