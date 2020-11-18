<template>
  <div class="layout_inner">
    <el-row class="main-head">
      <!-- <el-col :span="20"> -->
        <!-- <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list()">
        </ever-form2> -->
      <!-- </el-col> -->
      <el-col class="main-option" :span="24">
        <router-link :to="{path: $route.meta.childNavPath}"><el-button type="primary">新建</el-button></router-link>
      </el-col>
    </el-row>
    <el-table
      v-loading.body="loading"
      :data="tableData"
      style="width: 100%"
      class="ever-table-wrap"
      :border="false">
      <el-table-column
        prop="templateName"
        label="模板名称">
      </el-table-column>
      <el-table-column
        label="关联类型">
        <template slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.threeServiceClassify || scope.row.serviceClassification"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        prop="scene"
        label="使用场景">
        <template slot-scope="scope">
          <span>{{scope.row.scene | getScene}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push($route.meta.childNavPath + `/${scope.row.id}`)">编辑</el-button>
          <ever-confirm :msg="'确定删除该项？'" action="删除" @confirm="del(scope.row.id, scope.row)"></ever-confirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </el-row>
  </div>
</template>

<script>
  import api from '@/sob/store/schema.relate'
  import list from '@/util/list'
  import { getName } from './template.scene'
  export default {
    mixins: [list],
    data () {
      // let schema = [
      //   {
      //     name: 'name',
      //     label: '模板名称'
      //   }
      // ]
      // let obj = this.$ever.createObjFromSchema(schema)
      return {
        api,
        tableData: []
        // querySchema: schema,
        // queryObj: obj
      }
    },
    filters: {
      getScene (id) {
        return getName(id)
      }
    }
  }
</script>
<style lang="scss" scoped>
.layout_inner {
  overflow: auto;
}
</style>

