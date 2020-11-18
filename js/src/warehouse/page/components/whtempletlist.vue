<template>
  <div class="flex_column_full_hidden">
    <div class="layout_inner pos_re flex_column_full_hidden">
      <div class="flex_column_full_hidden">
        <!-- <el-button type="primary" class="pos_ab right" @click="handelCreateTemplate">关联分类</el-button> -->
        <ever-form2 :schema="schema" v-model="queryObj" ref="form" :inline="true" @query="query(queryObj)">
          <template slot="classifyId">
            <ever-select width="180px" v-model="queryObj.type1" filterable placeholder="一级分类" :clearable="true" :options="options1" class="queryClass"></ever-select>
            <ever-select width="180px" v-if="queryObj.type1 && options2.length" filterable v-model="queryObj.type2" placeholder="二级分类" :clearable="true" :options="options2" class="queryClass"></ever-select>
            <ever-select width="180px" v-if="queryObj.type2 && options3.length" filterable v-model="queryObj.type3" placeholder="三级分类" :clearable="true" :options="options3" class="queryClass"></ever-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="default" @click="query(queryObj)"><i class="el-icon-search"></i>查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
        <div class="things-header">
          <ul>
            <li>{{customType + '类型'}}</li>
            <li>模版名称</li>
            <li>操作</li>
          </ul>
        </div>
        <templet-tree :tableData="tableData" @handleHistory="handleHistory" :systemType="systemType" :customPath="customPath" :customPathsee="customPathsee" :customPathList="customPathList" :propertyPath="propertyPath"></templet-tree>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/groupmaterial/store/templetapi'
import classify from '@/warehouse/util/classify'
import templetTree from '@/warehouse/page/components/templettree'

let schema = [
  {
    name: 'classifyId',
    label: '',
    comp: 'custom'
  }
]
export default {
  props: ['systemType', 'backEditRoute', 'customType', 'customPath', 'customPathsee', 'customPathList', 'propertyPath'],
  mixins: [classify],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.type1 = ''
    queryObj.type2 = ''
    queryObj.type3 = ''
    queryObj.systemType = this.systemType
    return {
      api,
      schema,
      queryObj,
      tableData: [],
      loading: false
    }
  },
  created () {
    this.systemType = Number(this.systemType)
    this.getTempletList()
    this.$ever.getFieldFromSchema(this.schema, 'classifyId').label = `${this.customType + '类型'}`
  },
  methods: {
    query (queryObject) {
      this.queryObj = queryObject
      this.getTempletList()
    },
    handelCreateTemplate () {
      this.$router.push(this.backEditRoute)
    },
    handleHistory ({store, data}) {
      // let correspondId = data.id
      // let params = {
      //   correspondId,
      //   objectName: 'TempletDict'
      // }
      // modifyRecordApi.list(params).then(result => {
      //   this.$refs.history.open(result)
      // })
    },
    getTempletList () {
      this.loading = true
      this.api.list(this.queryObj).then(result => {
        if (result && result.length) {
          this.tableData = result
        } else {
          this.tableData = []
        }
        this.loading = false
      })
    }
  },
  watch: {
    'queryObj.classifyId' (val) {
      this.$bus.$on('selectvalclear', (val) => {
        this.query(this.queryObj)
      })
      this.$nextTick(() => {
        this.$bus.$off('selectvalclear')
      })
      this.query(this.queryObj)
    }
  },
  components: {
    templetTree
  }
}
</script>
<style scoped lang="scss">
.min-high { min-height: 600px}
.right { right: 20px}
.create_template {left: 50%; top: 50%; margin: -44px 0 0 -18px;}
</style>

