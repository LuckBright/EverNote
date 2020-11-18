<template>
  <div id="questionlist" class="layout_inner">
    <el-row class="main-head">
      <el-col :span="12">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      </el-col>
      <el-col :span="12" align="right">
        <el-button @click="linkCreatePage" type="primary">添加问卷</el-button>
      </el-col>
    </el-row>
    <div class="main-wrap">
      <el-table
        :data="tableData"
        border
        class="el-td-border">
        <el-table-column
          prop="sn"
          label="问卷ID"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="问卷名称"
          min-width="200"
          align="left">
        </el-table-column>
        <el-table-column
          label="适用部门"
          prop="dptName"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="创建人"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="linkDetailPage(scope.row.id)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteQuestion(scope.row.id, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
  </div>
</template>
<script>
  import api from '../store/questionapi'
  import depart from '../../warehouse/store/departmentapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'dptId',
      type: 'select',
      label: '适用部门',
      options: [{name: '全部'}],
      span: 4
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.query = ''
      return {
        api: api,
        depart: depart,
        querySchema: querySchema,
        queryObj: queryObj
      }
    },
    created () {
      this.getDptList()
    },
    methods: {
      search () {
        this.queryObj.dptId = -1
        this.query(this.queryObj)
      },
      linkCreatePage () {
        this.$router.push({name: 'createquestion', path: 'createquestion'})
      },
      linkDetailPage (id) {
        this.$router.push({name: 'questiondetail', path: 'questiondetail', query: {id: id}})
      },
      deleteQuestion (id, index) {
        this.$confirm('您确定要删除此问卷吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.del({id: id}).then(rs => {
            if (rs.head.errMsg === 'successful') {
              this.$notify({title: '成功', type: 'success', message: '删除成功!'})
              this.tableData.splice(index, 1)
            }
          })
        })
      },
      getDptList () {
        let dpt = this.$ever.getFieldFromSchema(querySchema, 'dptId')
        if (window.sessionStorage.getItem('THC_CC_DPT')) {
          dpt.options = JSON.parse(window.sessionStorage.getItem('THC_CC_DPT'), true)
          return false
        }
        this.depart.list().then(rs => {
          dpt.options = rs
          window.sessionStorage.setItem('THC_CC_DPT', JSON.stringify(rs))
        })
      }
    }
  }
</script>
