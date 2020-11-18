<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      <div class="main-option">
        <router-link :to="{name: 'insuranceorgadd'}">
          <el-button type="primary">新建</el-button>
        </router-link>
      </div>
    </div>
    <el-table v-loading.body="loading" :data="tableData" border>
      <el-table-column prop="code" label="保险公司编号"></el-table-column>
      <el-table-column prop="insureOrgShortName" label="中文简称"></el-table-column>
      <el-table-column prop="insuranceOrgEnName" label="英文名称"></el-table-column>
      <el-table-column prop="telCode" label="公司电话"></el-table-column>
      <el-table-column prop="contact" label="联系人姓名"></el-table-column>
      <el-table-column prop="corpType" label="保险公司类型">
        <template slot-scope="scope">
          <sys-value type="THC_RCM_INSURANCE_TYPE" :code="scope.row.corpType"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="triggerMode" label="理赔触发事件">
        <template slot-scope="scope">
          <sys-value type="THC_RCM_CLAIM_EVENT" :code="String(scope.row.triggerMode)"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="420" align="center">
        <template slot-scope="scope">
          <router-link :to="{name: 'insuranceorg', params: {id: scope.row.id}}">
            <el-button size="small" type="primary">编辑</el-button>
          </router-link>
          <router-link :to="{name: 'insurstditemmedicals', params: {id: scope.row.id}}">
            <el-button size="small" type="success">药品信息维护</el-button>
          </router-link>
          <router-link :to="{name: 'insurstditemtreats', params: {id: scope.row.id}}">
            <el-button size="small" type="warning">诊疗项目维护</el-button>
          </router-link>
          <router-link :to="{name: 'insurancecontracts', params: {id: scope.row.id}}">
            <el-button size="small" type="info">协议维护</el-button>
          </router-link>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
  </div>
</template>
<script>
import api from '../store/insuranceorgapi'
import list from '../../util/list'

let schema = [
  {
    name: 'insuranceOrgID',
    label: '保险公司',
    type: 'select',
    options: []
  },
  {
    name: 'corpType',
    label: '保险公司类型',
    type: 'select',
    options: api.corpType
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj
    }
  },
  created () {
    var params = {
      corpType: '',
      insuranceOrgCnName: '',
      insureOrgShortName: '',
      offset: 0,
      pagesize: 200
    }
    api.list(params).then(result => {
      for (var insur of result.data) {
        insur.name = insur.insuranceOrgCnName
      }
      this.$ever.getFieldFromSchema(this.querySchema, 'insuranceOrgID').options = result.data
    })
  },
  methods: {},
  beforeCreate () {
    this.api = api
  }
}
</script>
