<template>
  <div class="layout_inner">
    <el-button type="primary" @click="createInfo">新 建</el-button>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        :nosubmit="true"
        :inline="true"
        is-query="false"
        ref="form"
      >
        <template slot="out">
          <el-checkbox v-model="queryObj.status">是否启用</el-checkbox>
          <el-checkbox v-model="queryObj.isCheckIn">签到</el-checkbox>
        </template>
        <template slot="tenantDepts">
          <ever-subject-select :isOrg="true" type="select" ref="ss" v-model="queryObj.tenantDepts" :disabled="disabled" multiple></ever-subject-select>
        </template>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormApply()">保 存</el-button>
      </span>
    </el-dialog>
    <ever-table
      ref="table"
      :columns="allColumns"
      :fixed-height="60"
      @eventChange="eventChange"
      :data="tableData"
    ></ever-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
  </div>
</template>
<script>
import api from '@/arrange/store/triageapi'
import list from '@/util/list'
import storage from '@/util/storage'
export default {
  mixins: [list],
  data () {
    let schema = [
      {
        name: 'out',
        comp: 'custom'
      },
      {
        name: 'tenantDepts',
        label: '科室',
        comp: 'custom'
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.isTriage = ''
    queryObj.isCheckIn = ''
    queryObj.status = ''
    return {
      queryObj,
      schema,
      checkList: '',
      api,
      diagnosisOption: [],
      clinicId: storage.getStorageByClinic('CLINICID') || '',
      dialogVisible: false,
      params: {
        isTriage: '',
        isCheckIn: '',
        tenantDepts: [],
        status: '',
        id: ''
      },
      loading: false,
      tableData: [],
      title: '新建',
      disabled: false,
      allColumns: [
        {
          prop: 'status',
          label: '启用',
          formatter: ({ row }) => row.status ? '是' : '否'
        },
        {
          prop: 'isCheckIn',
          label: '签到',
          formatter: ({ row }) => row.isCheckIn ? '是' : '否'
        },
        {
          prop: 'tenantDeptName',
          label: '科室'
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          btns: [
            'edit'
          ]
        }
      ]
    }
  },
  created () {
    this.list()
  },
  methods: {
    submitFormApply () {
      this.queryObj.isTriage ? this.params.isTriage = 1 : this.params.isTriage = 0
      this.queryObj.isCheckIn ? this.params.isCheckIn = 1 : this.params.isCheckIn = 0
      this.queryObj.status ? this.params.status = 1 : this.params.status = 0
      this.params.tenantDepts = []
      this.queryObj.tenantDepts.forEach(element => {
        this.params.tenantDepts.push({ tenantDeptName: element.orgSubjectName, tenantDeptId: element.orgSubjectCode })
      })
      this.api.add(this.params).then(rs => {
        if (rs.data) {
          this.list()
          this.dialogVisible = false
        }
      })
    },
    list () {
      let params = { tenantDeptName: '', offset: this.offset, pagesize: this.pagesize }
      this.api.settinglist(params).then(rs => {
        this.tableData = rs.data.resultList
        this.totalCount = rs.data.totalCount
      })
    },
    createInfo () {
      this.title = '新建'
      this.dialogVisible = true
      this.disabled = false
      this.params.id = ''
      this.queryObj = {
        isTriage: '',
        isCheckIn: '',
        tenantDepts: [],
        status: '',
        id: ''
      }
    },
    eventChange ({ prop, row, col }) {
      if (prop === 'edit') {
        this.title = '编辑'
        this.dialogVisible = true
        this.disabled = true
        this.params.id = row.id
        if (row.isTriage) this.queryObj.isTriage = true
        if (row.isCheckIn) this.queryObj.isCheckIn = true
        if (row.status) this.queryObj.status = true
        this.queryObj.tenantDepts = [{ orgSubjectId: row.tenantDeptId, orgSubjectCode: row.tenantDeptId, orgSubjectName: row.tenantDeptName }]
      }
    }
  }
}
</script>
<style scoped>
</style>
