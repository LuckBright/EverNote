<template>
<!-- 科室模版 -->
  <div class="flex_column_full_hidden" id="pretpl">
    <el-row class="main-head">
      <el-col :span="20">
        <!-- <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form> -->
        <el-input size="small" v-model="queryObj.templateName" class="serch-dpttpl" placeholder="请输入模版名称"></el-input>
        <el-button size="small" type="primary" @click="search">查询</el-button>
      </el-col>
      <el-col class="main-option" :span="4">
        <!-- <router-link :to="{name: 'templateDptAdd', params: {visitType: this.visitType}}"> -->
        <el-button type="primary" @click="routelink">新建</el-button>
        <!-- </router-link> -->
      </el-col>
    </el-row>
    <div class="flex_col_1_hidden main-wrap">
      <el-table height="100%" v-loading.body="loading" :data="tableData" :border="false">
        <!-- <el-table-column type="index" label="序号" width="60" align="center"></el-table-column> -->
        <el-table-column prop="templateName" label="模版名称"></el-table-column>
        <el-table-column min-width="100" prop="providerName" align="center" label="所属科室"></el-table-column>
        <el-table-column width="150" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="updateTemplate(scope.row.id, scope.$index)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteTemplate(scope.row.id, scope.$index)"
            >删除</el-button>
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
</template>

<script>
import api from '@/sob/store/tmpl.api.js'
import list from '@/util/list'
import storage from '@/util/storage'

export default {
  props: ['visitType', 'dpts'],
  mixins: [list],
  data () {
    return {
      api,
      queryObj: {
        templateName: ''
      },
      tableData: []
    }
  },
  created () {
    this.init(this.visitType)
    this.queryObj.requestSwitch = true
  },
  methods: {
    init (val) {
      this.type = 2
      this.queryObj.templateType = 2
      if (val === 1) { // visitType: 1-门诊 3-住院 5-计费
        this.queryObj.sceneType = 1 // 门诊处方模版
        this.queryObj.templateSource = 1
      } else if (val === 3) {
        this.queryObj.sceneType = 3 // 住院医嘱模版
        this.queryObj.templateSource = 1
      } else if (val === 5) {
        this.queryObj.sceneType = '' // 手术计费模版
        this.queryObj.templateSource = 2 // 1 医嘱模板、2 补费模板 
      }
      if (!this.dpts || !this.dpts.length) {
        return
      }
      this.queryObj.providerIdList = this.dpts
      this.list(true)
    },
    deleteTemplate (id, index) {
      this.$confirm('您确定要删除此模版吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.del(id).then(rs => {
          this.$messageTips(this, 'success', '模版已删除成功', '成功')
          this.tableData.splice(index, 1)
        })
      }).catch(() => {
        return false
      })
    },
    updateTemplate (id, index) {
      storage.removeLocalStorage('prescriptionTemplateType')
      if (+this.visitType === 5) {
        this.$router.push({name: 'feeTemplateAdd', params: {id: id, visitType: this.visitType}, query: {type: this.type}})
      } else {
        this.$router.push({name: 'templateAdd', params: {id: id, visitType: this.visitType}, query: {type: this.type}})
      }
    },
    routelink () {
      if (+this.visitType === 5) {
        this.$router.push({name: 'feeTemplateAdd', params: {id: '-1', visitType: this.visitType}, query: {type: this.type}})
      } else {
        this.$router.push({name: 'templateAdd', params: {id: '-1', visitType: this.visitType}, query: {type: this.type}})
      }
    },
    search () {
      if (this.dpts && this.dpts.length) {
        this.init(this.visitType)
      }
    }
  },
  watch: {
    'visitType' () {
      this.init(this.visitType)
    },
    'dpts': {
      handler (val) {
        if (val && val.length) {
          this.queryObj.providerIdList = val
          this.list(true)
        }
      },
      deep: true
    }
  },
}
</script>
<style lang="scss" scoped>
  .main-head {
    /deep/.el-form {
      border: none;
      margin-bottom: 0;
    }
    .serch-dpttpl {
      display: inline-block;
      width: 165px;
      margin-right: 10px;
    }
  }
</style>

