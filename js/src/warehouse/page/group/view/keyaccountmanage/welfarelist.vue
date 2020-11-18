<template>
  <div class="layout_inner">
    <div class="main-head">
      <div class="containerLeft">
        <ever-form2 :schema="schema" v-model="queryObj" :isQuery="true" :inline="true" :api="api" @query="list">
          <div></div>
        </ever-form2>
      </div>
      <el-button type="primary" @click="list" size="small">查询</el-button>
      <div class="containerRight">
        <router-link :to="{name: 'welfareadd'}">
          <el-button type="primary" size="small">新建</el-button>
        </router-link>
      </div>
      <div class="clearfix"></div>
    </div>
    <div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="productCode" label="方案编号"></el-table-column>
        <el-table-column prop="productName" label="方案名称"></el-table-column>
        <el-table-column prop="reimburseRate" label="报销比例"></el-table-column>
        <el-table-column prop="benefitRate" label="优惠比例"></el-table-column>
        <el-table-column prop="outpatientUpperLimit" label="门诊报销上限"></el-table-column>
        <el-table-column prop label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain @click="toEdit(scope.row.id)">编辑</el-button>
            <el-button size="small" type="primary" plain @click="manageItem(scope.row.id)">管理</el-button>
            <ever-confirm
            :msg="'确定要删除吗？'"
            @confirm="del(scope.row.id)"></ever-confirm>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <managedialog ref="manageusers" :id="welfareId" @addusers="addusers"></managedialog>
    <addusers ref="addusers" :id="welfareId"></addusers>
  </div>
</template>
<script>
import { welfareApi } from '@/warehouse/page/group/store/keyaccountmanage'
import list from '@/util/list'
import managedialog from './manage-dialog'
import addusers from './addusers'
let schema = [{
  label: '方案编号',
  name: 'productCode',
  props: {
    clearable: true
  },
  span: 12
},
{
  label: '方案名称',
  name: 'productName',
  props: {
    clearable: true
  },
  span: 12
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api: welfareApi,
      tableData: [],
      schema: schema,
      queryObj: queryObj,
      welfareId: undefined
    }
  },
  components: {
    managedialog,
    addusers
  },
  methods: {
    manageItem (id) {
      this.welfareId = id
      this.$refs.manageusers.dialogTableVisible = true
    },
    addusers () {
      this.$refs.addusers.dialogTableVisible = true
    }
  }
}
</script>

<style scoped>
.containerLeft {
  float: left;
  margin-right: 15px;
}
.containerRight {
  float: right;
}
.el-table .el-button+.el-button{
  margin-left: 0;
}
</style>
