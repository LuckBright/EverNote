<template>
  <div>
    <ever-bread-crumb name="表单模版数据管理" :showTitle="true" :path="`${rootPath}/forms`"></ever-bread-crumb>
    <div class="flex_column_full_hidden layout_inner">
      <div class="main-head">
        <div class="main-option">
          <router-link :to="`${rootPath}formschemas`">
            <el-button type="text">所有表单</el-button>
          </router-link>
          <router-link :to="`${rootPath}forms/`+$route.params.schemaId+'/-1'">
            <el-button type="primary">创建数据</el-button>
          </router-link>
        </div>
      </div>
      <div class="flex_col_1_hidden main-wrap">
        <el-table height="100%" border :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="400"></el-table-column>
          <template v-for="(element, index) in schema">
            <el-table-column :label="element.label" :key="index">
              <template slot-scope="scope">{{scope.row.data[element.name]}}</template>
            </el-table-column>
          </template>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="`${rootPath}forms/${scope.row.formTemplateId}/${scope.row.id}`">
                <el-button type="primary" size="small">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
import formapi from '../store/api'
import list from '@/util/list'
import { createSchema } from '@/util/formconverter'
export default {
  mixins: [list],
  data () {
    return {
      tableData: [],
      listApiName: 'getForms',
      api: formapi,
      schema: [],
      listParams: {
        templateId: this.$route.params.schemaId
      }
    }
  },
  created () {
    formapi.getTpl(this.$route.params.schemaId).then(result => {
      this.tpl = result
      console.log(result)
      this.schema = createSchema(this.tpl.element)
    })
  },
  computed: {
    rootPath () {
      return `${this.$route.matched[0].path}/`
    }
  }
}
</script>
