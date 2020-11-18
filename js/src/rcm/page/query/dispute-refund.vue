<template>
  <div class="layout_inner">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="query(true)">查询</el-button>
        <el-button type="primary" size="small" @click="exportFile">导出</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table v-loading="loading" :data="tableData" border stripe>
      <el-table-column label="纠纷退费流水号" prop="flowNumber"></el-table-column>
      <el-table-column label="退费金额" prop="refundFee"></el-table-column>
      <el-table-column label="退费方式" prop="refundMethod"></el-table-column>
      <el-table-column label="患者姓名" prop="patientName"></el-table-column>
      <el-table-column label="门诊档案号" prop="outpatientNumber"></el-table-column>
      <el-table-column label="退费原因" prop="refundReason"></el-table-column>
      <el-table-column label="操作员" prop="createName"></el-table-column>
      <el-table-column label="授权人" prop="authorizerName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :pagesize="pagesize"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </div>
</template>

<script>
import list from '@/util/list'
import { disputeRefundList, exportFile } from '@/rcm/store/outpatient/disputerefund.js'
let schema = [{
  label: '创建时间',
  name: 'createTime',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      api: {
        list: disputeRefundList
      }
    }
  },
  methods: {
    query (flag) {
      this.loading = true
      this.handleParams()
      this.list(flag)
    },
    handleParams () {
      let [startTime, endTime] = this.queryObj.createTime
      this.queryObj.startTime = this.timeFormat(startTime)
      this.queryObj.endTime = this.timeFormat(endTime)
    },
    timeFormat (time) {
      return time && this.$moment(time).format(`YYYY-MM-DD`)
    },
    exportFile () {
      this.handleParams()
      var params = Object.assign({}, this.queryObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      exportFile(params).then(res => {
        if (res.data) {
          window.open(this.$ever.fileUrl2 + res.data)
        } else {
          this.$messageTips(this, 'error', '导出异常，稍后再试')
        }
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
}
</script>
