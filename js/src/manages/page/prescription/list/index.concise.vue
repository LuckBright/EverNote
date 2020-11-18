<template>
  <div class="list-left-concise">
    <div class="list-header">
      <div class="search-box">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      </div>
      <div class="btn-box" v-if="isCreate">
        <router-link :to="`/manages/${routeType}add`">
          <el-button type="primary" size="small" class="list-btn">新建</el-button>
        </router-link>
      </div>
    </div>
    <div class="service-list">
      <el-table
        v-loading="loading"
        :data="tableData"
        :row-class-name="handleRowClass">
        <el-table-column prop="name" label="项目名称" width="300"></el-table-column>
        <el-table-column prop="classification" label="系统分类" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.classification">--</span>
            <sys-value v-else type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.classification"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="finType" label="业务分类" align="center" v-if="routeType==='prescription'">
          <template slot-scope="scope">
            <span v-if="!scope.row.finType">--</span>
            <sys-value v-else type="THC_RCM_FIN_TYPE" :code="scope.row.finType"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="isAdvice" label="收费项" align="center" v-if="routeType==='prescription'">
          <template slot-scope="scope">
            <span v-if="!scope.row.isAdvice">--</span>
            <span v-else-if="scope.row.isAdvice===1">是</span>
            <span v-else>{{+String(scope.row.isAdvice)[1] ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="spec" label="规格" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.spec">--</span>
            <span v-else>{{scope.row.spec}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="unit" label="销售单位" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.unit">--</span>
            <sys-value v-else type="THC_WH_DOSE_UNIT" :code="scope.row.unit"></sys-value>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              class="editor-btn"
              size="small"
              type="text"
              v-if="isCreate"
              @click="edit(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container" v-show="listTotal > 20">
      <span class="office-count">共{{listTotal}}个{{routeType==='stack'?'组套':'医嘱项'}}</span>
      <el-pagination
        small
        class="list-pagination"
        layout="prev, pager, next, jumper"
        hide-on-single-page
        :page-size="20"
        :background="true"
        :total="listTotal"
        :current-page="curPage"
        :pager-count="5"
        @current-change="pageChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import mix from './prescriptionlist'
import sysvalue from '@/warehouse/store/sysvalueapi'
import {serviceSchema, serviceSetSchema} from './query.schema'
export default {
  mixins: [mix],
  data () {
    let schema = this.routeType === 'prescription' ? serviceSchema : serviceSetSchema
    let obj = this.$ever.createObjFromSchema(schema)
    if (this.routeType === 'prescription') {
      obj.isAdvice = []
    }
    obj.serviceClassificationList = []
    return {
      queryObj: obj,
      querySchema: schema
    }
  },
  created () {
    this.getClassOptions()
    this.getRouterQuery()
  },
  methods: {
    getClassOptions () {
      sysvalue.cascade(
        'THC_WH_OBJECT_TYPE', ['798']).then(options => {
          if (options[0] && options[0].children) {
            this.$ever.getFieldFromSchema(this.querySchema, 'serviceClassificationList').options = options[0].children
          }
        })
    },
    query (params) {
      this.curPage = 1
      this.querySearch(params)
    },
    // 获取医嘱项列表
    querySearch (type) {
      this.loading = true
      let params = {
        pagesize: 20,
        managerPermission: 1,
        filterMaterial: true
      }
      params = Object.assign({}, params, this.queryObj)
      if (this.routeType === 'prescription') {
        if (params.isAdvice.length === 2) {
          params.isAdviceList = [11]
        } else if (params.isAdvice[0] === 10) {
          params.isAdviceList = [10, 11]
        } else if (params.isAdvice[0] === 11) {
          params.isAdviceList = [1, 11]
        } else {
          params.isAdviceList = []
        }
        delete params.isAdvice
      }
      if (type) {
        params.offset = (this.curPage - 1) * 20
      } else {
        this.curPage = 1
      }
      // 缓存查询参数
      this.setRouterQuery()
      this.list(params).then(res => {
        this.tableData = res.data
        this.listTotal = res.totalCount
        if (res.data.length && !this.activeId) {
          this.activeId = res.data[0].id
          this.$emit('getRowInfo', res.data[0])
        }
        this.loading = false
      }).catch(() => {
        this.tableData = []
        this.listTotal = 0
        this.loading = false
      })
    },
    // 获取路由query参数
    getRouterQuery () {
      let search = this.$route.query.search
      let query = search ? JSON.parse(search) : {}
      Object.assign(this.queryObj, query)
      this.curPage = +query.page || 0
    },
    setRouterQuery () {
      let query = Object.assign({}, this.queryObj, {page: this.curPage || 1})
      this.$router.push({
        query: {
          search: JSON.stringify(query)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .list-left-concise {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    height: calc(100vh - 110px);
    .list-header {
      padding: 20px 5px;
      background-color: #e3e8ee;
      display: flex;
      flex-direction: row;
    }
    .search-check {
      display: inline-block;
    }
    // .list-input {
    //   width: 20%;
    //   display: inline-block;
    //   // margin-bottom: 15px;
    // }
    .type-select {
      width: 100%;
    }
    .list-btn {
      padding: 9px 15px;
      line-height: 13px;
      margin-top: 1px;
    }
    .btn-box {
      display: inline-block;
    }
    .list-table {
      margin: 0!important;
      border: none;
    }
    .service-list {
      overflow-y: auto;
      overflow-x: hidden;
      // flex: 1;
      /deep/ .el-table {
        margin-top: 0px;
      }
      /deep/ .row-actived {
        background-color: #1c7bee;
        color: #fff;
        .editor-btn {
          color: #fff
        }
        &:hover {
          color: #000;
          .editor-btn {
            color: #1c7bee
          }
        }
      }
    }
    .page-container {
      margin-top: 20px;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
    .page-input {
      display: inline-block;
      width: 35px;
    }
    .list-pagination {
      padding-top: 5px;
      box-sizing: border-box;
    }
    .office-count {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .search-box {
      margin-right: 10px;
    }
  }
</style>
