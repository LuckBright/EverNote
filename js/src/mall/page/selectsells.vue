<template>
  <el-dialog title="选择用户" :visible.sync="dialogTableVisible" class="ui_dialog_02">
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      ref="form"
      :inline="true"
      :is-query="true"
      v-ever-bind-enter
      @query="list(true)"
    >
    </ever-form2>
    <el-table
      :data="tableData"
      @selection-change="setSelectData"
      @current-change="setCurrentData"
      ref="selectUserTable"
      row-key="id"
      max-height="400"
      border
    >
      <el-table-column type="selection" :selectable="checkSelectable" reserve-selection width="50"></el-table-column>
      <el-table-column prop="jobNumber" label="工号"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="genderCode" label="性别" align="center" width="80">
        <template slot-scope="scope"><sys-value type="GBT.2261.1" :code="scope.row.genderCode"></sys-value></template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center" min-width="120"></el-table-column>
      <el-table-column label="证件类型" align="center" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.cardName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件号码" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.cardNumber || '--'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose">
        <i class="iconfont icon-quxiao"></i>取消
      </el-button>
      <el-button type="primary" @click="onDialogSelect">
        <i class="iconfont icon-tijiao"></i>确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/warehouse/store/staffapi'
import list from '@/util/list'

let querySchema = [
  {
    name: 'name',
    label: '姓名',
    placeholder: '请输入姓名',
    span: 8
  },
  {
    name: 'mobile',
    label: '手机号',
    placeholder: '请输入手机号',
    span: 8
  }
]
export default {
  mixins: [list],
  data: function () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj,
      selected: [],
      radioed: '',
      dialogTableVisible: false,
      selectData: [],
      key: ''
    }
  },
  methods: {
    setCurrentData (val) {
      this.radioed = val
      this.selected = [val]
    },
    checkSelectable (row) {
      return !row.checked
    },
    onDialogOpen: function (key, initSelect) {
      this.key = key
      this.dialogTableVisible = true
      if (!this.$refs.selectUserTable) {
        return false
      }
      this.$refs.selectUserTable.clearSelection()
      if (initSelect && initSelect.length > 0) {
        initSelect.forEach(row => {
          this.$refs.selectUserTable.toggleRowSelection({id: row.id, name: row.userName}, true)
        })
      }
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogSelect () {
      // this.$emit('selectUserVal', {key: this.key, data: this.selected})
      // this.$emit('selectUserVal', { key: this.key, data: this.selectData })
      // this.dialogTableVisible = false
      if (this.selectData.length) {
        this.$emit('selectUserVal', { key: this.key, data: this.selectData })
        this.dialogTableVisible = false
      } else {
        this.$messageTips(this, 'warning', '请选择用户')
      }
    },
    setSelectData (selects) {
      this.selectData = selects
    },
    getSelectData: function () {
      return this.selectData
    }
  },
  watch: {
    dialogTableVisible (newVal) {
      if (newVal) {
        this.list(true)
      }
    },
    'queryObj': {
      handler (val) {
        val.name ? this.queryObj.nameList = [val.name] : this.queryObj.nameList = []
        val.mobile ? this.queryObj.mobileList = [val.mobile] : this.queryObj.mobileList = []
      },
      deep: true
    }
  }
}
</script>
