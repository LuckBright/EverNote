<template>
  <el-dialog
    title="上次就诊查询"
    :visible.sync="v"
    width="70%"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :inline="true" labelWidth="80px">
      <template slot="btns">
        <el-button size="small" type="primary" @click="queryList">查询</el-button>
        <el-button size="small" @click="cancel">退出</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="summary">
      <span class="labelText">个人编号：</span>
      <span class="salary">{{personalNo}}</span>
      <span class="labelText">统筹金已累计支付：</span>
      <span class="salary">{{total | formatToFinacial}}</span>
      <span class="labelText">统筹金剩余金额：</span>
      <span class="salary">{{surplus | formatToFinacial}}</span>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-table :data="tableDataOrg" border stripe ref="table" v-loading="loading">
          <el-table-column label="机构编号" prop="orgNo"></el-table-column>
          <el-table-column label="定点机构编号" prop="medicalNo" show-overflow-tooltip></el-table-column>
          <el-table-column label="定点机构名称" prop="medicalName" show-overflow-tooltip></el-table-column>
          <el-table-column label="门诊发生时间" prop="medicalTime" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table :data="tableDataItem" border stripe>
          <el-table-column label="业务分类" prop="itemTypeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="项目编码" prop="itemHisCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="项目名称" prop="itemHisName" show-overflow-tooltip></el-table-column>
          <el-table-column label="数量" prop="itemHisNum" show-overflow-tooltip></el-table-column>
          <el-table-column label="规格" prop="itemHisSpec" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { specialDisLastQuery } from '@/rcm/store/otmdiscomponent/hlj-api.js'
const schema = [{
  label: '时间范围',
  name: 'dateRange',
  comp: 'everRangePicker',
  props: {
    autoWidth: true
  },
  span: 6
},
{
  label: '个人编号',
  name: 'personalNo',
  props: {
    disabled: true
  }
},
{
  label: '',
  labelWidth: '0',
  name: 'btns',
  comp: 'custom'
}]
export default {
  props: {
    lastVisit: {
      type: Boolean,
      default: false
    },
    personalNo: {
      type: String,
      default: ''
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.personalNo = this.personalNo
    // 默认时间本月开始到结束
    let startDay = this.$moment().format('YYYY-MM-01')
    let endDay = this.$moment(startDay).add('month', 1).add('days', -1).format('YYYY-MM-DD')
    queryObj.dateRange = [startDay, endDay]
    return {
      schema,
      queryObj,
      loading: false,
      tableDataOrg: [],
      tableDataItem: [],
      surplus: 0,
      total: 0
    }
  },
  computed: {
    v: {
      get () {
        return this.lastVisit
      },
      set (newval) {
        this.$emit('update:lastVisit', newval)
      }
    },
  },
  methods: {
    queryList () {
      this.loading = true
      let [startDay, endDay] = this.queryObj.dateRange
      let params = {
        personalNo: this.queryObj.personalNo,
        type: this.queryObj.type,
        startDay: startDay,
        endDay: endDay,
        macId: this.macId
      }
      for (let item in params) {
        if (!params[item]) {
          delete params[item]
        }
      }
      specialDisLastQuery(params).then(res => {
        let result = res.data
        this.tableDataOrg = result.org
        this.tableDataItem = result.item
        this.surplus = result.surplus
        this.total = result.total
        this.loading = false
      }, err => {
        console.log('err', err)
        this.loading = false
      })
    },
    cancel () {
      this.v = false
    }
  }
}
</script>
<style scoped>
.summary {
  margin: 15px 0;
}
.summary .salary {
  margin-right: 15px;
}
</style>
