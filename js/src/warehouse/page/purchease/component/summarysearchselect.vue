<template>
  <el-dialog
    title="添加申请单"
    class="summary"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="80%">
    <div>
      <div>
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          @query="customList">
          <template slot="date">
            <ever-range-picker
              dateType="daterange"
              :autoWidth="false"
              width="260px"
              :start.sync="queryObj.startApplyDate"
              :end.sync="queryObj.endApplyDate"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="default">
            <el-button type="primary" size="small" @click="customList">查询</el-button>
            <el-button size="small" class="btnW" @click="handlerReset">重置</el-button>
          </template>
        </ever-form2>
      </div>
      <el-table
        border
        @selection-change="handleSelectionChange"
        :data="tableData">
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column width="60" align="center">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="采购申请单号"
          width="300">
          <template slot-scope="scope">
            <a @click="handlerRoute(scope.row)">{{scope.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="storageRoomName"
          label="收货仓库">
        </el-table-column>
        <el-table-column
          align="center"
          prop="applicantName"
          label="申请人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="applyTime"
          label="申请时间">
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="!summarySelect.length" @click="selectSummarylist">选择</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '../../storages/store/procurementapi'
import { request } from '@/util/req'
import urls from '@/manages/page/organization/utils/urls.js'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
var querySchema = [
  {
    name: 'applyCode',
    label: '采购申请单号',
  },
  {
    name: 'clinicId',
    label: '机构名称',
    comp: 'sys-select',
    props: {
      placeholder: '请选择机构',
      filterable: true,
      options: []
    }
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', splitFlag: 0 },
      needObjFlag: true
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'date',
    label: '申请时间',
    comp: 'custom',
  }
]
export default {
  props: {
    parentTableData: Array
  },
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      queryObj,
      querySchema,
      dialogVisible: false,
      tableData: [],
      summarySelect: [],
      initcondition: []
    }
  },
  created () {
    request(urls.org.getOrgListByCondition.url).then(res => {
      if (res.data && res.data.resultList && res.data.resultList.length) {
        res.data.resultList.forEach(item => {
          this.initcondition.push({
            id: item.id,
            name: item.name
          })
        })
        this.$ever.getFieldFromSchema(this.querySchema, 'clinicId').props.options = this.initcondition
      }
    })
  },
  methods: {
    customList: function (refresh) {
      this.tableData = []
      let params = Object.assign({}, this.queryObj)
      params.offset = 0
      params.pagesize = 9999
      params.auditFlag = '2'
      params.summaryStatus = '0'
      params.applyStatus = '815'
      let applyIds = []
      if (this.parentTableData.length) {
        this.parentTableData.forEach(item => { applyIds.push(item.id) })
      }
      params.applyIds = applyIds
      if (params.localMaterialId instanceof Object && params.localMaterialId.materialSkuId) {
        params.materialSkuId = params.localMaterialId.materialSkuId
        delete params.localMaterialId
      }
      this.api.queryApplyListByCondition(params).then(res => {
        if (res && res.list) {
          let results = JSON.parse(JSON.stringify(res.list))
          this.tableData = results
        } else {
          this.tableData = []
        }
      })
    },
    selectSummarylist () {
      this.$emit('selectSummarylist', this.summarySelect)
      this.dialogVisible = false
    },
    handlerReset () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
    },
    handleSelectionChange (val) {
      this.summarySelect = val
    },
    open () {
      this.dialogVisible = true
      this.customList()
    },
    handlerRoute (row) {
      this.$router.push(`/goods/focusprocurementdetail/${row.id}?operation=1`)
    }
  }
}
</script>

<style scoped lang="scss">
.summary{
  /deep/ .el-dialog__footer{ text-align: left}
}
</style>
