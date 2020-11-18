<template>
  <div class="layout_inner">
    <ever-form2
      :schema="qschema"
      v-model="qObj"
      :inline="true"
      :is-query="true"
      @query="queryList()"
    ></ever-form2>
    <div class="main-wrap">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="tradeno" label="交易流水号" width="200"></el-table-column>
        <el-table-column prop="tradedate" label="交易时间" width="150"></el-table-column>
        <el-table-column prop="trademicode" label="医疗机构" width="100"></el-table-column>
        <el-table-column prop="itemcode" label="项目代码" width="200"></el-table-column>
        <el-table-column prop="itemname" label="项目名称" width="150"></el-table-column>
        <el-table-column prop="itemtypeTitle" label="业务分类" width="100"></el-table-column>
        <el-table-column prop="doseTitle" label="剂型" width="80"></el-table-column>
        <el-table-column prop="specification" label="规格" width="80"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import api from '../store/mainheaderdrugapi'
import list from '@/util/list'
export default {
  props: ['cardNum'],
  mixins: [list],
  data () {
    let qschema = [
      {
        name: 'itemname',
        label: '项目名称',
        comp: 'el-input',
        props: {
          placeholder: '请输入项目名称'
        }
      },
      {
        name: 'filterDuplicateData',
        label: '滤重处理',
        comp: 'sys-select',
        props: {
          type: 'singleCheckbox',
          labelNumber: true
        }
      }
    ]
    let qObj = this.$ever.createObjFromSchema(qschema)
    qObj.filterDuplicateData = 0
    return {
      api,
      qschema,
      qObj,
      icno: '',
      listParams: { 'icno': this.cardNum },
      tableData: [],
      noStoreQuery: true
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    queryList () {
      this.listParams = Object.assign(this.listParams, this.qObj)
      this.list()
    }
  }
}
</script>
