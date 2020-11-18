<template>
  <div class="layout_inner">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" is-query="false" ref="form">
      <template slot="out">
        <el-checkbox v-model="queryObj.status">是否启用</el-checkbox>
        <el-checkbox v-model="queryObj.isCheckIn">签到</el-checkbox>
        <el-checkbox v-model="queryObj.isTriage">分诊</el-checkbox>
      </template>
      <template slot="tenantDepts">
        <el-select v-model="queryObj.tenantDepts" placeholder="请选择" multiple clearable>
          <el-option
            v-for="item in diagnosisOption"
            :key="item.id"
            :label="item.text"
            :value="`${item.text}|${item.id}`"
          ></el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-button type="primary" @click="submitFormApply()">保存</el-button>
      </template>
    </ever-form2>
    <ever-table
      :table-loading="loading"
      :isPagination="true"
      ref="table"
      :columns="columns"
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
      params: {
        isTriage: '',
        isCheckIn: '',
        tenantDepts: [],
        status: ''
      },
      loading: false,
      tableData: [],
      columns: [
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
          prop: 'isTriage',
          label: '分诊',
          formatter: ({ row }) => row.isTriage ? '是' : '否'
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
    this.depts()
    this.list()
  },
  methods: {
    submitFormApply () {
      this.queryObj.isTriage ? this.params.isTriage = 1 : this.params.isTriage = 0
      this.queryObj.isCheckIn ? this.params.isCheckIn = 1 : this.params.isCheckIn = 0
      this.queryObj.status ? this.params.status = 1 : this.params.status = 0
      this.params.tenantDepts = []
      this.queryObj.tenantDepts.forEach(element => {
        this.params.tenantDepts.push({ tenantDeptName: element.split('|')[0], tenantDeptId: element.split('|')[1] })
      })
      this.api.add(this.params).then(rs => {
        this.list()
        // this.queryObj.isTriage = ''
        // this.queryObj.isCheckIn = ''
        // this.queryObj.status = ''
        // this.queryObj.tenantDepts = ''
      })
    },
    list () {
      let params = { tenantDeptName: '', offset: this.offset, pagesize: this.pagesize }
      this.api.settinglist(params).then(rs => {
        this.tableData = rs.data.resultList
        this.totalCount = rs.data.totalCount
      })
    },
    depts () {
      this.api.queryGroupDepts().then(rs => {
        this.diagnosisOption = rs.data
      })
    },
    edit (row) {
      console.log(row)
    }
  }
}
</script>
<style scoped>
</style>
