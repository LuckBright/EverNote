<template>
  <el-dialog
    title="选择用户"
    :visible.sync="dialogTableVisible"
    class="ui_dialog_02"
    :close-on-click-modal="false"
    width="70%"
  >
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="searchUser(true)"></ever-query-form>
    <el-table
      :data="gridData"
      @selection-change="setSelectData"
      ref="selectUserTable"
      row-key="id"
      max-height="400"
      border
    >
      <el-table-column type="selection" :selectable="checkSelectable" reserve-selection width="50"></el-table-column>
      <el-table-column
        prop="patientNumber"
        label="患者档案号"
      >
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
          <span v-if="!scope.row.iden">--</span>
          <sys-value type="CV02.01.101" v-if="scope.row.iden" :code="scope.row.iden.type"></sys-value>
        </template>
      </el-table-column>
      <el-table-column label="证件号码" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.iden ? scope.row.iden.idNo : '--'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
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
import api from '../store/carditemapi'
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
    queryObj.checkOrg = 'true'
    return {
      schema,
      api: api,
      querySchema: schema,
      queryObj: queryObj,
      gridData: [],
      dialogTableVisible: false,
      selectData: [],
      key: '',
      selectNum: 1,
      selectedUser: []
    }
  },
  // created () {
  //   this.searchUser()
  // },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.searchUser()
    },
    handleCurrentChange (val) {
      this.offset = (val - 1) * this.pagesize
      this.searchUser()
      // return this.pageAfter && this.pageAfter(this.pagesize)
    },
    checkSelectable (row) {
      return !row.checked
    },
    onDialogOpen: function (key, initSelect, selectNum) {
      this.key = key
      this.selectNum = selectNum
      this.selectedUser = initSelect
      this.dialogTableVisible = true
      if (!this.$refs.selectUserTable) {
        return false
      }
      this.$refs.selectUserTable.clearSelection()
      if (initSelect && initSelect.length > 0) {
        initSelect.forEach(row => {
          this.gridData.forEach(item => {
            if (row.patientId === item.id) {
              this.$refs.selectUserTable.toggleRowSelection(item, true)
            }
          })
        })
      }
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogSelect () {
      let num = 0
      this.selectedUser.forEach(item => {
        if (Number(item.status) === 0) {
          num = num + 1
        }
      })
      if (this.selectNum && (this.selectData.length + num) > this.selectNum) {
        this.$message.warning({ message: '最多只能选择 ' + this.selectNum + ' 项', duration: 1000 })
      } else {
        this.$emit('selectUserVal', { key: this.key, data: this.selectData })
        this.onDialogClose()
      }
    },
    setSelectData (selects) {
      this.selectData = selects
    },
    getSelectData: function () {
      return this.selectData
    },
    searchUser (refresh) {
      this.gridData = []
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
        this.gridData = results.data.resultList || []
        this.totalCount = results.data.totalCount || 0
        if (this.gridData && this.gridData.length) {
          this.gridData.forEach((item, index) => {
            this.selectedUser.forEach(item1 => {
              if (item.id === item1.patientId) {
                item.checked = true
                // this.gridData.splice(index, 1, item1)
              }
            })
          })
        } else {
          this.gridData = []
        }
      })
    }
  },
  watch: {
    dialogTableVisible (newVal) {
      if (newVal) {
        this.searchUser(true)
      }
    }
  }
}
</script>
