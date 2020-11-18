<template>
  <div>
    <ever-bread-crumb name="使用详情" showTitle="使用详情"></ever-bread-crumb>
    <div class="layout_inner">
      <h3 class="pl10">{{$route.meta.type === 'plan' ? '项目信息：' : '套餐信息：'}}</h3>
      <div class="mb20">
        <label>{{$route.meta.type === 'plan' ? '保障计划名称：' : '套餐名称：'}}</label>
        {{packageName}}
      </div>
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :rules="rules"
        :is-query="true"
        :span="8"
        @query="list(true)"
      ></ever-form2>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="catalogName" label="目录"></el-table-column>
        <el-table-column align="center" prop="serviceName" label="项目名称"></el-table-column>
        <el-table-column align="center" prop="quality" label="数量"></el-table-column>
        <el-table-column align="center" prop="price" label="原价"></el-table-column>
        <el-table-column align="center" prop="priceDis" label="售价"></el-table-column>
        <el-table-column align="center" prop label="使用">
          <template slot-scope="scope" v-if="scope.row.useStatus">
            <span>{{scope.row.useStatus == STATUS_OF_USE[1].id ? STATUS_OF_USE[1].name : STATUS_OF_USE[2].name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="doctorName" label="开单医生"></el-table-column>
        <el-table-column align="center" prop="createTime" label="开单时间"></el-table-column>
        <el-table-column align="center" prop="clinicName" label="开单机构"></el-table-column>
      </el-table>
      <div style="text-align: right;" class="pt10">
        <el-button type="primary" @click="hendelHistory">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import { STATUS_OF_USE } from '@/util/common'
import packageApi from '@/crm/store/packageapi'
import api from '@/crm/store/usedetailsinfoapi'

let schema = [
  {
    label: '目录',
    name: 'catalogId',
    comp: 'ever-select',
    props: {
      placeholder: '目录',
      options: []
    }
  },
  {
    name: 'useStatus',
    label: '使用',
    comp: 'ever-select',
    props: {
      options: STATUS_OF_USE
    }
  },
  {
    name: 'beginDate',
    label: '开单开始时间',
    comp: 'datePicker',
    props: {
      showformat: 'yyyy-MM-dd HH:mm:ss',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    name: 'endDate',
    label: '开单结束时间',
    comp: 'datePicker',
    props: {
      showformat: 'yyyy-MM-dd HH:mm:ss',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    label: '项目名称',
    name: 'serviceId',
    comp: 'ever-select',
    props: {
      placeholder: '项目名称',
      options: []
    }
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      orderId: this.$route.params.id,
      setMealId: this.$route.params.setMealId,
      packageName: '',
      schema,
      queryObj: obj,
      rules: {},
      STATUS_OF_USE
    }
  },
  created () {
    this.initial()
    this.queryObj.orderId = this.orderId
    this.queryObj.setMealId = this.setMealId
    this.pagesize = 10000
  },
  methods: {
    async initial () {
      let json = await packageApi.searchOrderDetails({ setMealId: this.setMealId, orderId: this.orderId })
      let tableOfContentsObj = {}
      let projectNameObj = {}
      let tableOfContentsArr = []
      let projectNameArr = []
      this.packageName = json.data[0].setMealName
      json.data.forEach(item => {
        if (!tableOfContentsObj[item.setMealCatalogId]) {
          tableOfContentsObj[item.setMealCatalogId] = true
          tableOfContentsArr.push({ id: item.setMealCatalogId, name: item.setMealCatalogName })
        }
        if (!projectNameObj[item.serviceId]) {
          projectNameObj[item.serviceId] = true
          projectNameArr.push({ id: item.serviceId, name: item.serviceName })
        }
        this.$ever.getFieldFromSchema(this.schema, 'catalogId').props.options = tableOfContentsArr
        this.$ever.getFieldFromSchema(this.schema, 'serviceId').props.options = projectNameArr
      })
    },
    hendelHistory () {
      this.$router.go(-1)
    }
  },
  watch: {
    'queryObj.endDate' (val) {
      if (val) {
        let endTimeVal = val.substring(0, 10)
        this.$nextTick(() => {
          this.queryObj.endDate = endTimeVal + ' 23:59:59'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
h3 {
  border-left: 3px solid #1c7bef;
}
</style>

