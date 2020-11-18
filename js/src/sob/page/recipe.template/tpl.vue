<template>
<!-- 个人模版/科室模版/病区模版 -->
  <div class="flex_column_full_hidden">
    <el-row class="main-head">
      <el-col :span="20">
        <el-input size="small" v-model="queryObj.templateName" class="serch-pretpl" placeholder="请输入模版名称"></el-input>
        <el-button size="small" type="primary" @click="search">查询</el-button>
      </el-col>
      <el-col class="main-option" :span="4">
        <el-button type="primary" @click="routelink">新建</el-button>
      </el-col>
    </el-row>
    <div class="flex_col_1_hidden main-wrap">
      <el-table style="margin-bottom: 10px;" class="tbl-list-table" height="100%" v-loading.body="loading" :data="tableData" :border="false">
        <el-table-column prop="templateName" label="模版名称"></el-table-column>
        <el-table-column v-if="this.role==='1'" min-width="100" prop="providerName" align="center" label="所属科室"></el-table-column>
        <el-table-column v-else-if="role==='2'" min-width="100" prop="areaName" align="center" label="所属病区"></el-table-column>
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
import api from '@/sob/store/tmpl.api.js'
import list from '@/util/list'

export default {
  props: {
    'visitType': Number,
    'tplType': String,
    // 'jurisdict': {
    //   type: Array,
    //   default: () => []
    // },
    role: { // '1'-医生 '2'-护士 医生要选择科室，护士要选择病区
      type: String,
      default: '1'
    }
  },
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
      this.jurisdict = this.getQuery() // 当前用户所属的病区或者科室信息
      if (!this.jurisdict) {
        this.tableData = []
        return
      }
      this.queryObj.templateType = this.tplType
      if (val === 1) { // visitType: 1-门诊 3-住院 5-计费
        this.queryObj.sceneType = 1 // 门诊处方模版
        this.queryObj.templateSource = 1 // 1 医嘱模板、2 补费模板
      } else if (val === 3) {
        this.queryObj.sceneType = 3 // 住院医嘱模版
        this.queryObj.templateSource = 1 // 1 医嘱模板、2 补费模板
      } else if (val === 5) {
        this.queryObj.sceneType = '' // 手术计费模版
        this.queryObj.templateSource = 2 // 1 医嘱模板、2 补费模板
      }
      if (this.role === '2') {
        this.queryObj.areaId = this.jurisdict.areaId
      } else {
        this.queryObj.providerId = this.jurisdict.providerId
      }

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
          this.list(true)
        })
      }).catch(() => {
        return false
      })
    },
    updateTemplate (id, index) {
      if (!this.jurisdict) {
        this.$messageTips(this, 'warning', `未获取到${this.role === '2' ? '病区' : '科室'}信息`)
        return
      }
      if (+this.visitType === 5) {
        this.$router.push({name: 'feeTemplateAdd', params: {id: id, visitType: this.visitType}, query: this.jurisdict})
      } else {
        this.$router.push({name: 'templateAdd', params: {id: id, visitType: this.visitType}, query: this.jurisdict})
      }
    },
    routelink () {
      if (!this.jurisdict) {
        this.$messageTips(this, 'warning', `未获取到${this.role === '2' ? '病区' : '科室'}信息`)
        return
      }
      if (+this.visitType === 5) {
        this.$router.push({name: 'feeTemplateAdd', params: {id: '-1', visitType: this.visitType}, query: this.jurisdict})
      } else {
        this.$router.push({name: 'templateAdd', params: {id: '-1', visitType: this.visitType}, query: this.jurisdict})
      }
    },
    getQuery () {
      let space = this.$route.matched[0].meta.space
      let spaceKey = localStorage.getItem(space + 'Key')
      if (spaceKey) {
        spaceKey = spaceKey.split(',')
      } else {
        return false
      }
      if (this.role === '2') {
        return {
          areaId: spaceKey[0],
          areaName: spaceKey[1],
          templateType: this.tplType
        }
      } else {
        return {
          providerId: spaceKey[0],
          providerName: spaceKey[1],
          templateType: this.tplType
        }
      }
    },
    search () {
      this.init(this.visitType)
      // if (this.jurisdict && this.jurisdict.length) {
      //   this.init(this.visitType)
      // }
    }
  },
  watch: {
    'visitType' (val) {
      this.init(this.visitType)
    },
    'tplType' (val) {
      this.init(this.visitType)
    }
  }
}
</script>
<style lang="scss" scoped>
  .main-head {
    /deep/.el-form {
      border: none;
      margin-bottom: 0;
    }
    .serch-pretpl {
      display: inline-block;
      width: 165px;
      margin-right: 10px;
    }
  }
  .main-wrap {
    padding-bottom: 80px;
  }
</style>

