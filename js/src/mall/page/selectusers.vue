<template>
  <el-dialog title="选择用户" :visible.sync="dialogTableVisible" class="ui_dialog_02">
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="list(true)"></ever-query-form>
    <el-table
      :data="tableData"
      @selection-change="setSelectData"
      @current-change="setCurrentData"
      ref="selectUserTable"
      row-key="id"
      max-height="400"
      border
    >
      <!-- <el-table-column
        type="selection"
        :selectable="checkSelectable"
        reserve-selection
        width="50">
      </el-table-column>-->
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="patientNumber" label="患者档案号">
        <template slot-scope="scope">
          {{scope.row.patientNumber && scope.row.patientNumber != 'temporary' ? scope.row.patientNumber : '--'}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="80">
        <template slot-scope="scope"><sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value></template>
      </el-table-column>
      <el-table-column prop="ageShowText" label="年龄" align="center" width="100"></el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center" min-width="120"></el-table-column>
      <el-table-column label="证件类型" align="center" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.idNo ? '身份证' : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件号码" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.idNo ? scope.row.idNo : '--'}}</span>
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
import api from '../../card/store/carditemapi'
import form from '../../util/form'
import utillist from '../../util/list'

let schema = [
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
  mixins: [form, utillist],
  data: function () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.offset = 0
    queryObj.pagesize = 20
    return {
      schema,
      api: api,
      querySchema: schema,
      queryObj: queryObj,
      tableData: [],
      selected: [],
      radioed: '',
      dialogTableVisible: false,
      selectData: [],
      key: '',
      selectNum: 1,
      selectedUser: []
    }
  },
  // created () {
  //   this.list()
  // },
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
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogSelect () {
      // this.$emit('selectUserVal', { key: this.key, data: this.selected })
      // this.dialogTableVisible = false
      if (this.selected.length) {
        this.$emit('selectUserVal', { key: this.key, data: this.selected })
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
    },
    list (refresh) {
      this.tableData = []
      if (refresh) {
        this.offset = 0
      }
      var params = Object.assign({}, this.queryObj, this.listParams)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.offset = this.offset
      params.pagesize = this.pagesize
      this.api.getPatientList(params).then(results => {
        if (results.data) {
          this.tableData = results.data.resultList
          this.totalCount = results.data.totalCount
          this.tableData.forEach((item, index) => {
            this.selectedUser.forEach(item1 => {
              if (item.id === item1.patientId) {
                item.checked = true
                // this.tableData.splice(index, 1, item1)
              }
            })
          })
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    }
  },
  watch: {
    dialogTableVisible (newVal) {
      if (newVal) {
        this.list(true)
      }
    }
  }
}
</script>
