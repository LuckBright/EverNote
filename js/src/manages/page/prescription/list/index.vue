<template>
  <div class="list-left">
    <div class="list-header">
      <el-cascader
        class="list-input type-select"
        ref="cascader"
        style="width: 100%"
        v-model="projectType"
        placeholder="系统分类"
        :options="typeOptions"
        clearable
        filterable
      ></el-cascader>
      <el-input class="list-input" v-model="searchName" placeholder="商品名/通用名" clearable></el-input>
      <div class="search-check">
        <el-checkbox v-model="prescription" false-label="0" true-label="1" label="医嘱项" v-if="routeType === 'prescription'"></el-checkbox>
        <el-checkbox v-model="charge" false-label="0" true-label="1" label="收费项" v-if="routeType === 'prescription'"></el-checkbox>
        <el-checkbox v-model="outward" false-label="0" true-label="1" label="外送"></el-checkbox>
      </div>
      <el-button type="primary" plain class="list-btn" @click="querySearch(false)">查询</el-button>
    </div>
    <div class="btn-box" v-if="isCreate">
      <router-link :to="`/manages/${routeType}add`">
        <el-button type="primary" plain class="list-btn">新建</el-button>
      </router-link>
    </div>
    <div class="service-list">
      <el-table
        style="width: 100%"
        class="list-table"
        v-loading="loading"
        :data="tableData"
        :row-class-name="handleRowClass"
        @row-click="(row) => getServiceInfo(row)">
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="classification" label="类型" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.classification">--</span>
            <sys-value v-else type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.classification"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="isAdvice" label="收费项" align="center" v-if="routeType==='prescription'"  width="70">
          <template slot-scope="scope">
            <span v-if="!scope.row.isAdvice">--</span>
            <span v-else-if="scope.row.isAdvice===1">是</span>
            <span v-else>{{+String(scope.row.isAdvice)[1] ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button
              class="editor-btn"
              size="small"
              v-if="isCreate"
              type="text"
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

export default {
  mixins: [mix]
}
</script>
<style lang="scss" scope>
  .list-left {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    height: calc(100vh - 110px);
    .list-header {
      padding: 20px 6%;
      background-color: #e3e8ee;
    }
    .search-check,
    .list-input {
      margin-bottom: 15px;
    }
    .type-select {
      width: 100%;
    }
    .list-btn {
      background-color: #fff;
      padding: 10px 20px;
    }
    .btn-box {
      padding: 20px 6%;
    }
    .list-table {
      margin: 0!important;
      border: none;
    }
    .service-list {
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1;
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
  }
</style>
