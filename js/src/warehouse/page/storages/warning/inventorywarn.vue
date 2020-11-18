<template>
  <div class="layout_inner">
    <div class="main-head pos_re">
      <ever-form2
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        @query="list(true)"
        :nosubmit="true"
        v-model="queryObj">
        <template slot="materialType">
          <el-select v-model="queryObj.materialType" @change="list(true)" :clearable="true" @visible-change="visibleChange" placeholder="物资分类">
            <el-option
              v-for="item in classifyIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </ever-form2>
      <div class="pos_ab head-btn-right">
          <doc-download
            @downFile="downFile"
            @exportStatus="changeStatus"
            ref="exportExcel"
            :size="'small'"
            btnTxt="导出"
          ></doc-download>
        <!-- <h4>库存预警管理</h4> -->
        <el-button
          type="primary"
          size="small"
          v-if="$hasPermission('Auth_menu_treasury_businessmanagement_warning_creatpurchase') && $hasPermission('Auth_menu_material') && $hasPermission('Auth_menu_goods_purchase_apply')"
          @click="handleRoute"
        >生成采购申请</el-button>
        <el-button
          type="primary"
          size="small"
          v-else-if="warningType === 'apply' && $hasPermission('Auth_menu_treasury_businessmanagement_warning_creatClaim')"
          @click="$router.push('/storages/business/applybusinessadd/new?alert=true')"
        >新增申领任务</el-button>
        <el-button
          type="primary"
          size="small"
          @click="$router.push('/storages/warning/inventorymanage')">库存预警管理</el-button>
      </div>
    </div>
    <el-table
      v-loading.body="loading"
      ref="tr"
      :data="tableData"
      highlight-current-row
      row-key="id"
      :expand-row-keys="entexpands"
      @cell-mouse-enter="rowEnter"
      @row-click="rowExpand"
      type="expand"
      border
      style="width: 100%"
    >
      <el-table-column type="expand" width="10">
        <template slot-scope="props">
          <div class="box-card">
            <div v-for="(items, index) in props.row.outStockList" :key="index" class="text item">
              <el-row>
                <el-col :span="6">{{'出库单'}}</el-col>
                <el-col :span="12">{{items.code}}</el-col>
                <el-col :span="6">{{items.outSupplyingNum}}</el-col>
              </el-row>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物资分类" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.classifyId | formateValueToFnt({list: MATERIA_TYPE_OPTIONS})}}
        </template>
      </el-table-column>
      <el-table-column prop label="物资名称">
        <template slot-scope="scope">
          <material-show-name
            v-if="scope.row.materialName"
            :materialName="scope.row.materialName"
            :icons="scope.row.icons">
          </material-show-name>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        width="120"
        align="center"
        label="规格">
        <template slot-scope="scope">
          <span>{{scope.row.spec || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop width="120" align="center" label="安全库存">
        <template slot-scope="scope">
          <el-input
            v-if="editId == scope.row.id"
            v-model="scope.row.safeNum"
            type="number"
            @blur="handleChangeSafe(scope.row.safeNum, scope.$index)"
          ></el-input>
          <span
            v-else
          >{{scope.row.safeNum ? scope.row.safeNum : (scope.row.safeNum) == 0 ? '0' : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop align="center" width="120" label="最小库存">
        <template slot-scope="scope">
          <div class="editId">
            <el-input
              v-if="editId == scope.row.id"
              v-model="scope.row.minNum"
              type="number"
              @blur="handleChangeMin(scope.row.minNum, scope.$index)"
            ></el-input>
            <span
              v-else
            >{{scope.row.minNum ? scope.row.minNum : (scope.row.minNum) == 0 ? '0' : '-'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际库存" width="80" prop="actualStore"></el-table-column>
      <el-table-column show-overflow-tooltip prop="usableNum" width="80" align="right" label="可用库存"></el-table-column>
      <el-table-column label="待发货" align="center" width="80" prop="notSend"></el-table-column>
      <el-table-column show-overflow-tooltip prop width="120" align="right" label="建议补货数量">
        <template slot-scope="scope">
          <span>{{floatTool.add(floatTool.subtract(scope.row.notSend, scope.row.actualStore), scope.row.safeNum)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上次供应商"
        width="120"
        prop="lastSupplier"
        align="center">
      </el-table-column>
      <el-table-column
        label="上次入库价"
        width="120"
        prop="lastInstockPrice"
        align="center">
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot-scope="scope">
          <div v-if="editId != scope.row.id">
            <el-button @click="handleLeast(scope.row, scope.$index)" size="small" type="primary">编辑</el-button>
          </div>
          <div v-else>
            <el-button
              size="small"
              type="success"
              @click="handleChangeLeast(scope.row, scope.$index)"
            >确认</el-button>
            <el-button size="small" type="danger" @click="cancelEdit()">取消</el-button>
          </div>
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
import api from '../store/storagealertedapi'
import storagemanageapi from '../store/storagemanageapi'
import classifyapi from '@/warehouse/page/groupmaterial/store/classifyapi'
import list from '@/util/list'
import sysvalue from '@/warehouse/store/sysvalueapi'
import setName from '@/util/setstatusname'
import { debounce, floatTool, FULL_IN_OUT_TYPE, SPEC_CODE, patch, MATERIA_TYPE_OPTIONS } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import storage from '@/util/storage'
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant.js'
let regu = /^[0-9]+$/
let querySchema = [
  {
    name: 'materialType',
    label: '物资分类',
    comp: 'custom',
    props: {
      options: []
    },
    span: 3
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { filterOverdueRecord: true, classifyIds: [] }
    },
    style: 'width: 350px'
  },
]

export default {
  mixins: [list, getstorage, setName],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      SPEC_CODE,
      storagemanageapi,
      querySchema,
      queryObj: obj,
      entexpands: [],
      dosageFormArr: [],
      FULL_IN_OUT_TYPE,
      MATERIA_TYPE_OPTIONS,
      floatTool,
      editId: '',
      storageIndex: null,
      minNumStorage: null,
      safeNumStorage: null,
      obtainData: [],
      classifyIdOptions: [{id: '', name: '全部'}]
    }
  },
  activated () {
    this.classifyIdOptions = [{id: '', name: '全部'}]
  },
  created () {
    this._info()
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  computed: {
    // 当前库房的物资分类
    materialTypeList () {
      let storageType = storage.getStorageByClinic('MATERIAL_TYPE') || []
      let arr = []
      if (storageType.length) {
        arr = MATERIA_TYPE_OPTIONS.filter(key => storageType.includes(key.id))
      }
      return arr
    }
  },
  watch: {
    'queryObj.materialType' (val) {
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.classifyIds = val ? [val] : []
    }
  },
  methods: {
    async visibleChange (val) {
      if (val && this.classifyIdOptions.length === 1) {
        await classifyapi.listclassify({ storageRoomId: this.storageId }).then(res => {
          this.classifyIdOptions = this.classifyIdOptions.concat(res || [])
        })
      }
    },
    changeStatus () {
      this.everSuccess('导出成功')
    },
    downFile () { // 导出
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        page: this.page,
        storageRoomId: this.storageId
      }
      Object.assign(params, this.queryObj)
      api.exportExcel(params).then(res => {
        if (res) {
          this.$refs.exportExcel.downfile(DOWNLOAD_FILE + res.fileName)
        }
      })
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    handleRoute () { // 预警跳转综合工作站采购申请
      this.$router.push(`/goods/procurementdetail?storageRoomId=${this.storageId}`)
    },
    submitRevise: debounce(function (data) {
      let params = {
        id: data.stockAmountId,
        safe: data.safeNum,
        min: data.minNum
      }
      this.storagemanageapi.create(params).then(res => {
        if (res) {
          this.editId = ''
          this.list()
        }
      })
    }),
    cancelEdit: debounce(function () {
      this.editId = ''
      if (this.safeNumStorage === null) {
        delete this.tableData[this.storageIndex].safeNum
      } else {
        this.$set(this.tableData[this.storageIndex], 'safeNum', this.safeNumStorage)
      }
      if (this.minNumStorage === null) {
        delete this.tableData[this.storageIndex].minNum
      } else {
        this.$set(this.tableData[this.storageIndex], 'minNum', this.minNumStorage)
      }
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    }),
    rowEnter (row, column, cell, event) {
      event.target.parentNode.classList.add('hover_rows')
    },
    rowExpand (row, column, event) {
      if (this.entexpands.indexOf(row.id) < 0 && row.outStockList.length && !this.editId) {
        this.entexpands = []
        this.entexpands.push(row.id)
      } else {
        this._removed(this.entexpands, row.id)
      }
    },
    handleLeast (data, index) {
      if (this.storageIndex !== null && this.storageIndex >= 0) {
        this.tableData[this.storageIndex].safeNum = this.obtainData[this.storageIndex].safeNum
        this.tableData[this.storageIndex].minNum = this.obtainData[this.storageIndex].minNum
      }
      this.editId = data.id
      this.storageIndex = index
      this.safeNumStorage = data.safeNum ? data.safeNum : Number(data.safeNum) === 0 ? 0 : null
      this.minNumStorage = data.minNum ? data.minNum : Number(data.minNum) === 0 ? 0 : null
    },
    handleChangeSafe (num, index) {
      if (!regu.test(num)) {
        this.tableData[index].safeNum = ''
        this.$messageTips(this, 'warning', '安全库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
    },
    handleChangeMin (num, index) {
      if (!regu.test(num)) {
        this.tableData[index].minNum = ''
        this.$messageTips(this, 'warning', '安全库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
    },
    handleChangeLeast (data, index) {
      if (!regu.test(data.safeNum)) {
        this.$messageTips(this, 'warning', '安全库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
      if (!regu.test(data.minNum)) {
        this.$messageTips(this, 'warning', '最小库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
      this.submitRevise(data)
    },
    _removed (data, val) {
      let index = data.indexOf(val)
      if (index > -1) {
        data.splice(index, 1)
      }
    },
    _getTrEle (el) {
      var parent = el.parentNode
      if (parent && parent.nodeName === 'TR') {
        return parent
      } else if (parent) {
        return this._getTrEle(parent)
      }
    },
    _info () {
      this.$ever.getFieldFromSchema(this.querySchema, 'materialType').props.options = this.materialTypeList
      this.querySchema[1].props.params.storageRoomId = this.storageId
    },
    _obtainData () {
      if (this.tableData && this.tableData[0]) {
        let obtainData = JSON.parse(JSON.stringify(this.tableData))
        this.obtainData = obtainData
      }
    },
    ...patch
  },
  beforeUpdate () {
    this.$nextTick(function () {
      this._obtainData()
    })
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
.el-table /deep/ .el-icon {
  display: none;
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
.el-table /deep/ .el-table__expanded-cell {
  padding: 10px!important
}
.box-card {
  width: 480px;
  height: 100%;
  padding: 10px;
  background-color: #edf7ff;
  position: relative;
  right: 10px;
  float: right;
  border-radius: 4px;
}
.box-card:after,
.box-card:before {
  border: solid transparent;
  content: " ";
  height: 0;
  position: absolute;
  width: 0;
}
.box-card:before {
  border-width: 10px;
  border-bottom-color: #edf7ff;
  top: -20px;
  right: 100px;
}
.text {
  font-size: 14px;
}
.item {
  padding: 0 20px;
}
.el-col {
  text-align: center;
}
.el-table {
  /deep/ .el-table__expand-column{
    width: 0px;
    border-right: 0;
    .el-table__expand-icon{
      width: 0;
      height: 0;
      overflow: hidden;
      font-size: 0px;
    }
  }
}
</style>
