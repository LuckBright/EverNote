<template>
  <div>
    <div class="bg">
        <el-row class="pd20">
          <el-col :span="20">
            <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" :is-query="true" @query="list(true)"></ever-form2>
          </el-col>
        </el-row>
        <el-row class="pd20">
          <el-col :span="20">
            <el-table
              :data="tableData"
              border>
              <el-table-column
                prop="id"
                label="体检ID"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                prop="id"
                label="客户类型"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                prop="id"
                label="企业信息"
                width="120"
                align="center">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
                width="120">
              </el-table-column>
              <el-table-column
                label="创建人"
                align="center"
                width="120">
                <template slot-scope="scope">
                  <label v-if="scope.row.patient.name">{{scope.row.patient.name}}</label>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="content"
                align="center"
                label="体检状态"
                min-width="200">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="体检时间"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="120">
                <template slot-scope="scope">
                  <a href="">查看</a>
                </template>
              </el-table-column>
            </el-table>
            <ever-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :totalCount="totalCount">
            </ever-pagination>
          </el-col>
        </el-row>
    </div>
  </div>
</template>
<script>
  import api from '../store/snsapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'type',
      comp: 'ever-range-picker',
      label: '体检时间',
      span: 3
    },
    {
      name: 'status',
      label: '状态',
      comp: 'ever-select',
      props: {
        options: [
          {id: 0, name: '待预约'},
          {id: 1, name: '待体检'}
        ]
      },
      span: 3
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        api: api,
        querySchema: querySchema,
        queryObj: queryObj,
        selected: []
      }
    }
  }
</script>
<style scoped>
  .settle_inner .settlemenu { background: #F8F8F8; font-family: PingFangSC-Semibold; font-size: 16px; color: #000; line-height: 16px; padding: 0 10px; border-bottom: 1px solid #eee; border-radius: 4px 4px 0 0;}
  .settlemenu .el-menu-item { padding: 0 15px;}
  .settlemenu .el-menu-item { height: 50px; line-height: 50px; border-bottom: 3px solid transparent;display:inline-block; }
  .settlemenu .el-menu-item:hover, .settlemenu .el-menu-item.is-active { background-color: #F8F8F8; border-bottom: 3px solid #1c7bef; }
  .bg{background-color:#fff;}
  .pdl20{padding-left:20px;}
  .pd20{padding:20px;}
  .pdr20{padding-right:20px;}
</style>
