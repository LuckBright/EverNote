<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02" :modal="false">
    <div id="mobileselect">
      <el-row>
        <el-col :span="24">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        @selection-change="setSelectData"
        @current-change="setCurrentData"
        ref="selectUserTable"
        row-key="id"
        max-height="350"
        height="350"
        class="mb20"
        highlight-current-row
        border
      >
        <el-table-column prop="departmentObject.name" label="部门" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" min-width="120"></el-table-column>
        <el-table-column label="电话" align="center" max-width="480">
          <template slot-scope="scope">
            <span
              class="spancolor"
              v-if="scope.row.phone"
              @click="calling(scope.row)"
            >{{scope.row.phone}}</span>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        class="mb20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="saveSelectVal">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../../warehouse/store/staffapi'
import depart from '../../warehouse/store/departmentapi'
import utillist from '../../util/list'
let querySchema = [
  {
    name: 'departmentId',
    type: 'select',
    options: [],
    label: '',
    placeholder: '部门'
  },
  {
    name: 'phone',
    type: 'text',
    label: '手机号'
  }
]
export default {
  props: ['initdata', 'isradio', 'title', 'visible', 'patientId'],
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      api: api,
      depart,
      queryObj: queryObj,
      selected: [],
      radioed: '',
      tableData: [],
      dialogVisible: false
    }
  },
  watch: {
    radioed (val) {
      this.selected = [val]
    },
    visible (val) {
      this.dialogVisible = val
      return val && this.patientId && this.api.getById({
        id: this.patientId
      }).then(rs => {
        this.$nextTick(_ => {
          this.tableData.filter((item, index) => {
            if (item.id === rs.data.id) {
              this.$refs.selectUserTable.setCurrentRow(this.tableData[index])
            }
          })
        })
      })
    },
    dialogVisible (val) {
      this.$emit('update', val)
    }
  },
  created () {
    if (this.isradio) {
      this.radioed = this.initdata
    } else {
      this.selected = this.initdata || []
    }
    this.getDptList(querySchema, 'departmentId')
  },
  methods: {
    closeEvent () {
      this.$emit('close', false)
    },
    saveSelectVal () {
      this.$emit('select', this.selected)
    },
    setSelectData (val) {
      this.selected = val
    },
    setCurrentData (val) {
      this.radioed = val
      this.selected = [val]
    },
    pageAfter () {
      return this.selected && this.selected.forEach(row => {
        if (row) {
          this.$refs.selectUserTable.toggleRowSelection(row, true)
        }
      })
    },
    calling (val) {
      this.$emit('transfercall', val)
      this.dialogVisible = false
    },
    getDptList (schema, name) {
      let dpt = this.$ever.getFieldFromSchema(schema, name)
      this.depart.list().then(rs => {
        dpt.options = rs
      })
    }
  }
}
</script>
<style scoped>
#mobileselect .el-form {
  margin-left: -15px;
}
#mobileselect .el-form .el-form-item {
  margin-right: 0;
  margin-left: 15px;
}
#mobileselect .el-table td,
#mobileselect .el-table th {
  line-height: initial;
}
.spancolor {
  color: #1c7bef;
}
</style>
