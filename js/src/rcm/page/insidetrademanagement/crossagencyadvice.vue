<template>
  <div class="layout_inner">
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :inline="true"
      :isQuery="true"
      @query="list(true)"
    >
      <div class="querybtnsRight">
        <el-button size="small" type="primary" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
        <el-button size="small" @click="exportFile">导出</el-button>
      </div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="结算单编号" prop="settleCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="开单机构" prop="clinicName"></el-table-column>
        <el-table-column label="开单科室" prop="orderDeptName"></el-table-column>
        <el-table-column label="执行机构" prop="exeClinicName"></el-table-column>
        <el-table-column label="患者" prop="patientName"></el-table-column>
        <el-table-column label="应收金额" prop="preFee" align="right">
          <template slot-scope="scope">{{scope.row.preFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="实收金额" prop="fee" align="right">
          <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="结算时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
      </el-table>
      <ever-pagination
        :current="current"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import { getCrossExeBillDetails, exportCrossExeBillDetails } from '@/rcm/store/insidetradesettlement/insidetradesettlement.js'
import storage from '@/util/storage'
let schema = [
  {
    name: 'startOrgId',
    label: '开单机构',
    comp: 'everOrgSelect',
    props: {
      isOrg: false, // 取所有机构
      clearable: true,
      type: 'select',
      fields: 'id',
      disabled: true
    },
    span: 6
  },
  {
    name: 'exeClinicId',
    label: '执行机构',
    comp: 'everOrgSelect',
    props: {
      isOrg: false, // 取所有机构
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 6
  },
  {
    label: '开始时间',
    name: 'startSettleDate',
    comp: 'datePicker',
    props: {
      outformat: 'yyyy-MM-dd',
      autoWidth: true
    },
    span: 6
  },
  {
    label: '结束时间',
    name: 'endSettleDate',
    comp: 'datePicker',
    props: {
      outformat: 'yyyy-MM-dd',
      autoWidth: true
    },
    span: 6
  }]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.startOrgId = storage.getLocalStorage('CLINICID')
    return {
      schema,
      queryObj,
      api: {
        list: getCrossExeBillDetails
      },
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetForm()
      this.list(true)
    },
    exportFile () {
      let params = {}
      let needParams = this.schema.slice(1).map(item => { return item.name })
      for (let i = 0, len = needParams.length; i < len; i++) {
        let key = needParams[i]
        if (this.queryObj[key]) {
          params[key] = this.queryObj[key]
        }
      }
      exportCrossExeBillDetails(params).then(res => {
        let fileId = res.data && res.data.fileId
        window.open(this.$ever.fileUrl2 + fileId)
      }, error => {
        console.log(error)
      })
    },
  }
}
</script>
<style scoped>
.querybtnsRight {
  float: right;
}
</style>
