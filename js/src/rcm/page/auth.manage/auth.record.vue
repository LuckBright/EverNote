<template>
  <div class="layout_inner oa">
      <div class="main-head">
        <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :isQuery="true">
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="query(true)">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <el-table
        border
        v-loading.body="loading"
        :data="tableData">
        <el-table-column
          prop="name"
          label="授权类型">
        </el-table-column>
        <el-table-column
          prop="displayName"
          label="授权用户">
        </el-table-column>
        <el-table-column
          prop="modifyExeTime"
          label="授权结算单">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="settlementDetail(scope.row)">{{scope.row.settlementNo}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="authTime"
          label="授权时间">
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current">
        </ever-pagination>
      </el-row>
    </div>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/outpatient/auth.manage.api.js'
let schema = [
  {
    name: 'code',
    label: '授权类型',
    comp: 'el-select',
    props: {
      placeholder: '状态',
      options: []
    }
  },
  {
    name: 'settlementNo',
    label: '授权结算单'
  },
  {
    name: 'userId',
    label: '授权用户',
    comp: 'ever-staff-select',
    props: {
      disabled: false,
      clearable: true,
      params: {
        everQueryType: 'out'
      }
    }
  },
  {
    name: 'date',
    label: '授权时间',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj: obj,
      api,
      noHead: false,
      loading: false
    }
  },
  created () {
    this.getOptions()
    // this.getIsApproval()
  },
  methods: {
    getOptions () {
      api.authList().then(rs => {
        if (!rs.head.errCode) {
          rs.data.forEach(item => {
            item.id = item.code
          })
          this.$ever.getFieldFromSchema(this.schema, 'code').props.options = rs.data
        }
      })
    },
    settlementDetail (row) {
      location.href = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${row.patientId}&visitNumber=${row.visitNumber}&showDetail=0&settlementid=${row.settlementid}&showlist=true`
    },
    query () {
      this.handleCurrentChange(1)
    },
    list () {
      let params = {
        offset: this.offset,
        pagesize: this.pagesize
      }
      if (this.queryObj.code) {
        params.code = this.queryObj.code
      }
      if (this.queryObj.settlementNo) {
        params.settlementNo = this.queryObj.settlementNo
      }
      if (this.queryObj.userId) {
        params.userId = this.queryObj.userId
      }
      if (this.queryObj.date && this.queryObj.date[0]) {
        params.beginTime = this.queryObj.date[0] + ' 00:00:00'
        params.endTime = this.queryObj.date[1] + ' 23:59:59'
      }
      this.loading = true
      api.historyList(params).then(result => {
        if (!result.head.errCode) {
          this.tableData = result.data
          this.totalCount = result.total
          this.loading = false
        }
      })
    }
  }
}
</script>

