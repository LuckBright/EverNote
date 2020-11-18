<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="ui_dialog_02">
      <el-row class="mb20">
        <el-col :span="24">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        ref="serviceTable"
        @selection-change="handleSelectionChange"
        row-key="id"
        max-height="354"
        height="354"
        class="mb20"
        :stripe="false"
        tooltip-effect="dark"
      >
        <el-table-column prop="id" reserve-selection type="selection"></el-table-column>
        <el-table-column prop="name" label="收费项目名称"></el-table-column>
        <el-table-column prop="serviceClassification" label="类别">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格"></el-table-column>
        <el-table-column prop="unitName" label="包装单位"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import servapi from '../store/servicesetapi'
import api from '../store/serviceapi'
import utillist from '../../util/list'
let schema = [
  {
    name: 'id',
    type: 'text',
    label: '项目编号'
  },
  {
    name: 'name',
    type: 'text',
    label: '项目名称'
  },
  {
    name: 'serviceClassification',
    type: 'systype',
    code: 'THC_WH_OBJECT_SUB_TYPE',
    useValue: false,
    label: '物资分类'
  }
]
export default {
  name: 'servicesdialog',
  props: ['title', 'categoryOptions', 'objId'],
  mixins: [utillist],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      servapi,
      querySchema: schema,
      queryObj: obj,
      dialogTableVisible: false,
      noStoreQuery: true,
      totalCount: 0,
      tableData: [],
      selected: []
    }
  },
  watch: {
    dialogTableVisible (val) {
      if (val) {
        window.setTimeout(() => {
          this.selected = []
          this.$refs.serviceTable.clearSelection()
        }, 0)
      }
    }
  },
  methods: {
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      this.dialogTableVisible = true
      this.api.list()
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    onSubmit () {
      let data = this.tableData
      let ids = []
      this.selected.forEach(item => {
        ids.push(item.id)
      })
      let obj = {
        servSetId: this.objId,
        serviceId: ids
      }
      if ((data && !data[0]) || ids.length === 0) {
        this.$notify({
          title: '选择收费项目',
          message: '请您选择您要添加的Service',
          type: 'warning'
        })
        return false
      }
      this.servapi.createServSetItem(obj).then(rs => {
        if (rs.head.errCode === 0) {
          this.selected = []
          console.log(rs, 'create')
        }
      }).then(_ => {
        // this._getServiceSetItemList()
        this.$emit('selectChange', this.selected)
      })
      // Promise.all([a]).then(_ => {
      //   this.$emit('selectChange', this.selected)
      // })
      this.onDialogClose()
    },
    _getServiceSetItemList () {
      servapi.getServiceSetItemList(this.objId).then(res => {
        if (res && res[0]) {
          // Object.assign(this.itemData, res).splice()
          this.itemData = res
        }
      })
    },
    pageAfter () {
      return this.selected && this.selected.forEach(row => {
        if (row) {
          this.$refs.serviceTable.toggleRowSelection(row, true)
        }
      })
    }
  }
}
</script>
