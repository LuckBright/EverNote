<template>
  <div>
    <ever-bread-crumb name="药品分类" path="/warehouse/drugcategories"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <router-link to="drugcategoryadd">
            <el-button type="primary">新建</el-button>
          </router-link>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
        <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="engName" label="英文名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="category" label="分类">
          <template slot-scope="scope">
            <sys-value type="THC_WH_DRUG_CATALOG1" :code="scope.row.categoryOne"></sys-value>
            <span v-if="scope.row.categoryTwo">
              /
              <sys-value type="THC_WH_DRUG_CATALOG2" :code="scope.row.categoryTwo"></sys-value>
            </span>
            <span v-if="scope.row.categoryThree">
              /
              <sys-value type="THC_WH_DRUG_CATALOG3" :code="scope.row.categoryThree"></sys-value>
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="supersiveCategory" label="监管分类">
          <template slot-scope="scope">
            <sys-value type="THC_WH_DRUG_OTC" :code="scope.row.supersiveCategory"></sys-value>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/warehouse/drugcategories/' + scope.row.id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from '../store/drugcategoryapi'
import list from '@/util/list'

var querySchema = [
  {
    name: 'name',
    label: '分类名称'
  },
  {
    name: 'categoryOne',
    label: '一级分类',
    type: 'systype',
    code: 'THC_WH_DRUG_CATALOG1'
  },
  {
    startName: 'startTime',
    endName: 'endTime',
    name: 'daterange',
    type: 'daterange',
    dateType: 'daterange',
    label: '生效日期',
    format: 'unix',
    editable: false
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj: obj
    }
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
