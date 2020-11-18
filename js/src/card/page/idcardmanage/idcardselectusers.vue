<template>
  <el-dialog title="选择用户" :visible.sync="dialogTableVisible" class="ui_dialog_02" :close-on-click-modal="false" width="70%">
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="searchUser(true)"></ever-query-form>
    <el-table
      :data="gridData"
      @selection-change="setSelectData"
      ref="selectUserTable"
      row-key="id"
      max-height="400"
      :border="false">
      <el-table-column
        type="selection"
        :selectable="checkSelectable"
        reserve-selection
        width="50">
      </el-table-column>
      <el-table-column
        prop="patientNumber"
        label="患者档案号"
      >
        <template slot-scope="scope">
          {{scope.row.patientNumber && scope.row.patientNumber != 'temporary' ? scope.row.patientNumber : '--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="80">
        <template slot-scope="scope">
          <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        prop="ageShowText"
        label="年龄"
        width="100">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="证件类型"
        width="80">
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
      :totalCount="totalCount" :current="current">
    </ever-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose">取消</el-button>
      <el-button type="primary" @click="onDialogSelect">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/card/store/carditemapi'
import form from '@/util/form'
import utillist from '@/util/list'
import userapi from '@/card/store/idcardUser'

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
  props: ['vipUsers'],
  data: function () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.offset = 0
    queryObj.pagesize = 20
    // queryObj.checkOrg = 'true'
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
      benefitId: 0,
      offset: 0,
      pagesize: 20,
      totalCount: 0,
      // pageSizes: [10, 20, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper'
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
      this.benefitId = initSelect.benefitId
      this.key = key
      this.selectNum = selectNum
      this.dialogTableVisible = true
      if (!this.$refs.selectUserTable) {
        return false
      }
      this.$refs.selectUserTable.clearSelection()
      if (initSelect.list && initSelect.list.length > 0) {
        initSelect.list.forEach(row => {
          this.$refs.selectUserTable.toggleRowSelection(row, true)
        })
      }
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogSelect () {
      if (this.selectNum && this.selectData.length > this.selectNum) {
        this.$messageTips(this, 'warning', '最多只能选择 ' + this.selectNum + ' 项')
      } else {
        this.$emit('selectUserVal', {key: this.key, benefitId: this.benefitId, data: this.selectData})
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
      this.selectData = []
      this.gridData = []
      // this.loading = true
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
        if (this.gridData && this.gridData.length > 0) {
          let params = {benefitId: this.benefitId, patientIds: []}
          this.gridData.forEach(item => {
            params.patientIds.push(item.id)
          })
          params.patientIds = params.patientIds.join(',')
          userapi.getVipUsers(params).then(results => {
            let selectedUser = results.data
            this.gridData.forEach((item, index) => {
              selectedUser.forEach(item1 => {
                if (item.id === item1.patientId) {
                  item.checked = true
                  this.gridData.splice(index, 1, item)
                }
              })
            })
          })
        }
      })
    }
  },
  watch: {
    dialogTableVisible (newVal) {
      if (newVal) {
        this.searchUser()
      }
    }
  }
}
</script>
