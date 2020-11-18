

<template>
  <el-dialog title="选择用户" :visible.sync="dialogTableVisible" class="ui_dialog_02" :close-on-click-modal="false" width="70%">
    <ever-form2 ref="adduserForm" :schema="schema" v-model="queryObj" :isQuery="true" :inline="true" @query="list"></ever-form2>
    <el-table
      :data="tableData"
      @selection-change="setSelectData"
      ref="selectUserTable"
      row-key="id"
      max-height="400" border v-loading="loading">
      <el-table-column
        type="selection"
        :selectable="checkSelectable"
        reserve-selection
        width="50">
      </el-table-column>
      <el-table-column
        prop="patientNumber"
        label="用户编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        align="center"
        width="80">
        <template slot-scope="scope">
          {{scope.row.sex === '1' ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        align="center"
        min-width="120">
      </el-table-column>
      <el-table-column
        label="证件类型"
        align="center"
        width="80">
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
      :totalCount="totalCount" :current="current">
    </ever-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose">取消</el-button>
      <el-button type="primary" @click="onDialogSelect">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import list from '@/util/list'
import api from '@/warehouse/page/group/store/keyaccountmanage'
let schema = [
  {
    name: 'name',
    label: '姓名',
    props: {
      placeholder: '请输入姓名',
      clearable: true,
      filterable: true
    },
    span: 8
  },
  {
    name: 'mobile',
    label: '手机号',
    props: {
      placeholder: '请输入手机号',
      clearable: true,
      filterable: true
    },
    span: 8
  }
]
export default {
  mixins: [list],
  props: ['id'],
  data: function () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true // 把list的mounted调用关了
    return {
      schema: schema,
      queryObj: queryObj,
      tableData: [],
      dialogTableVisible: false,
      selectedData: [],
      welfareStaffs: {}, // 该福利方案下已有客户，已有的客户避免重复添加
      api,
      listApiName: 'getPatientList',
      listParams: {
        checkOrg: false
      }
    }
  },
  methods: {
    setSelectData (selection) {
      this.selectedData = selection
    },
    checkSelectable (row) {
      return !row.checked
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogSelect () {
      // 调接口保存数据
      let patientids = this.selectedData.map(item => item.id)
      let params = {
        programmeId: this.id,
        patientIds: patientids
      }
      this.api.addPatients(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          this.$bus.$emit('adduser:success')
          this.onDialogClose()
        }
      })
    },
    // 调接口查询该方案已经绑定过的所有人员，然后禁止选择
    getAllPatientsById () {
      this.welfareStaffs = {}
      let params = {programmeId: this.id}
      this.api.getAllPatientsByWelfare(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          res.data.map(item => {
            this.welfareStaffs[item] = true
          })
        }
      })
    },
    afterList () {
      this.tableData.map(item => {
        if (this.welfareStaffs[item.id]) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
    }
  },
  watch: {
    dialogTableVisible: {
      handler: async function (newVal) {
        if (newVal) {
          await this.getAllPatientsById()
          this.$refs.adduserForm.resetForm()
          await this.list(true)
          this.$nextTick(_ => {
            this.$refs.selectUserTable.clearSelection()
          })
        }
      }
    }
  }
}
</script>
