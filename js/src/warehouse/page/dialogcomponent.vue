<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="ui_dialog_02">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      <el-table
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        max-height="300"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          show-overflow-tooltip
          prop="id"
          label="id"
          type="selection"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop label="物资名称">
          <template
            slot-scope="scope"
          >{{scope.row.drugObject ? scope.row.drugObject.name : scope.row.consumptiveMaterialObject ? scope.row.consumptiveMaterialObject.name : scope.row.equipmentObject.name}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="编号">
          <template
            slot-scope="scope"
          >{{scope.row.drugObject ? scope.row.drugObject.code : scope.row.consumptiveMaterialObject ? scope.row.consumptiveMaterialObject.code : scope.row.equipmentObject.code}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="规格">
          <template
            slot-scope="scope"
          >{{scope.row.drugObject ? scope.row.drugObject.spec : scope.row.consumptiveMaterialObject ? scope.row.consumptiveMaterialObject.spec : scope.row.equipmentObject.spec}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="型号">
          <template
            slot-scope="scope"
          >{{scope.row.drugObject ? scope.row.drugObject.model : scope.row.consumptiveMaterialObject ? scope.row.consumptiveMaterialObject.model : scope.row.equipmentObject.model}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop label="类型">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_TYPE" :code="scope.row.materialType"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="drugObject.spec || consumptiveMaterialObject.spec"
          label="生产厂商"
        >
          <template
            slot-scope="scope"
          >{{scope.row.manufacturerObject ? scope.row.manufacturerObject.name : ''}}</template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          <i class="iconfont icon-quxiao"></i>取消
        </el-button>
        <el-button type="primary" @click="submitForm(presonIds)">
          <i class="iconfont icon-tijiao"></i>确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var querySchema = [
  {
    name: 'name',
    label: '名称'
  }
]
export default {
  name: 'searchdialog',
  props: ['title', 'objid', 'api', 'typeid'],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    obj.materialType = this.typeid
    return {
      tableData: [],
      presonIds: [],
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      pageSizes: [10, 20, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      querySchema: querySchema,
      queryObj: obj,
      dialogTableVisible: false,
      current: 1
    }
  },
  methods: {
    submitForm (data) {
      this.$emit('submitAfter', data)
      this.onDialogClose()
    },
    checkSelectable (row) {
      return !row.departmentId
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      this.queryObj.name = ''
      this.queryObj.materialType = this.typeid
      this.list(true)
      this.dialogTableVisible = true
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.list()
    },
    handleCurrentChange (val) {
      this.offset = (val - 1) * this.pagesize
      this.list()
    },
    handleSelectionChange (val) {
      this.presonIds = []
      val.forEach(item => {
        if (item.drugObject) {
          item.drugObject.id = item.id
          item.drugObject.manufacturerObject = item.manufacturerObject
        } else if (item.consumptiveMaterialObject) {
          item.consumptiveMaterialObject.id = item.id
          item.consumptiveMaterialObject.manufacturerObject = item.manufacturerObject
        } else {
          item.equipmentObject.id = item.id
          item.equipmentObject.manufacturerObject = item.manufacturerObject
        }
        this.presonIds.push(item)
      })
    },
    query: function (queryObject) {
      this.queryObj = queryObject
      this.list(true)
    },
    list: function (refresh) {
      if (refresh) {
        this.offset = 0
      }
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.api.list(params).then(result => {
        this.tableData = result.list || result.data || result
        this.totalCount = result.totalCount
      })
    }
  }
}
</script>
