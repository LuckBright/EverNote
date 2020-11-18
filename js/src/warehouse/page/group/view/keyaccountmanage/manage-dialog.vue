<template>
  <el-dialog title="选择用户" :visible.sync="dialogTableVisible" class="ui_dialog_02" :close-on-click-modal="false" width="70%">
    <ever-form2 ref="manageForm" :schema="querySchema" v-model="queryObj" :inline="true" :is-query="true" @query="list(true)">
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list(true)">查询</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="addusers">添加会员</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-table :data="tableData" height="320" row-key="id" border v-loading="loading">
      <el-table-column label="序号" width="50" type=index>
      </el-table-column>
      <el-table-column label="客户编号" prop="patientCode">
      </el-table-column>
      <el-table-column prop="patientName" label="姓名">
      </el-table-column>
      <el-table-column prop="patientSex" label="性别">
      </el-table-column>
      <el-table-column prop="patientAge" label="年龄">
      </el-table-column>
      <el-table-column prop="patientPhone" label="手机号">
      </el-table-column>
      <el-table-column prop="" width="100" label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="unBind(scope.row)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount" :current="current">
    </ever-pagination>
  </el-dialog>
</template>
<script>
import api from '@/warehouse/page/group/store/keyaccountmanage'
import list from '@/util/list'
let schema = [
  {
    name: 'patientId',
    label: '会员姓名',
    comp: 'ever-patient-select',
    props: {
      placeholder: '请输入姓名'
    },
    span: 8
  }
]
export default {
  mixins: [list],
  props: ['id'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true // 把list的mounted调用关了
    return {
      querySchema: schema,
      queryObj: queryObj,
      tableData: [],
      dialogTableVisible: false,
      api,
      listApiName: 'getPatientsByWelfare',
      listParams: {
        programmeId: this.id
      }
    }
  },
  mounted () {
    this.$bus.$off('adduser:success')
    this.$bus.$on('adduser:success', this.list)
  },
  methods: {
    unBind (row) {
      // 解绑
      let params = {
        programmeId: this.id,
        patientId: row.patientId
      }
      this.api.unBind(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '解绑成功')
          this.list()
        }
      })
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    addusers () {
      this.$emit('addusers')
    }
  },
  watch: {
    'dialogTableVisible': function (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(_ => {
          this.listParams.programmeId = this.id
          this.$refs.manageForm.resetForm() // 清空上次的搜索内容
          this.list(true)
        })
      }
    }
  }
}
</script>
