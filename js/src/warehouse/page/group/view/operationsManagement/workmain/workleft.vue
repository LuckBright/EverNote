<template>
  <div class="left">
    <el-form :model="params" label-width="80px" class="bg">
      <el-form-item label="启用状态 :" class="item">
        <el-select v-model="params.status" class="wid">
          <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班次名称 :" class="item">
        <el-input v-model="params.name" placeholder="班次名称" class="wid"></el-input>
      </el-form-item>
       <el-form-item label="班次类型 :" class="item">
        <el-select v-model="params.categoryCode" class="wid" clearable>
          <el-option v-for="item in classesArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="onSearch(true)">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="bggray">
      <el-form label-width="97px" class="add">
        <el-form-item label>
          <el-button type="primary" plain @click="addnew">新增班次</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        highlight-current-row
        class="tableborder"
        :show-header="false"
        max-height="570"
        @row-click="handleRowChange"
      >
        <el-table-column prop="name" label="班次名称">
          <template slot-scope="scope">
            <el-button type="primary" plain class="firstbtn">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间">
          <template slot-scope="scope">
            <div
              class="divstyle"
              :class="scope.row.timeranges.length >1 && scope.row.timeranges.length !== (index+1) ?'border_bottom':''"
              v-for="(item,index) in scope.row.timeranges"
              :key="index"
            >{{item.startDate + '-' +item.endDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryCode" label="班次类型">
          <template slot-scope="scope">
            {{classesObj[scope.row.categoryCode]}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="current"
        :page-size="pagesize"
        :total="totalCount"
        class="page"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/workapi'
import { classesArr, classesObj } from './model.js'
export default {
  props: ['refresh'],
  watch: {
    'refresh' (v) {
      this.onSearch(true)
    }
  },
  data () {
    return {
      api,
      addnum: 0,
      offset: 0,
      pagesize: 10,
      current: 1,
      totalCount: 0,
      state: [{ value: 1, label: '启用中' }, { value: 2, label: '停用中' }],
      params: {
        name: '',
        status: 1,
        categoryCode: ''
      },
      tableData: [],
      classesArr,
      classesObj
    }
  },
  created () {
    this.onSearch(true)
  },
  methods: {
    handleRowChange (val) {
      this.$emit('chooseone', val)
    },
    addnew () {
      this.$emit('addnew', this.addnum++)
    },
    onSearch (val) {
      if (val) {
        this.offset = 0
        this.pagesize = 10
        this.current = 1
      }
      this.params.offset = this.offset
      this.params.pagesize = this.pagesize
      this.api.search(this.params).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data && rs.data.resultList
          this.totalCount = rs.data.totalCount
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1 // 切换size时，自动重置current
      this.offset = (this.current - 1) * this.pagesize
      this.onSearch()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.onSearch()
    }
  }
}
</script>
<style scoped>
.tableborder {
  border-left: none;
  border-right: none;
  width: 410px;
  margin: 0 auto;
}
.border_bottom {
  border-bottom: 1px solid #d0d6df;
}
.left /deep/ .el-pager li {
  min-width: 27.5px;
}
.bggray {
  background-color: #f6f7f9;
  padding-top: 10px;
}
.page {
  float: right;
  margin-top: 5px;
  margin-bottom: 5px;
}
.divstyle {
  margin: 0px 0px 0px 30px;
  padding: 0px;
  height: 35px;
  line-height: 35px;
}
.firstbtn {
  margin-left: 20px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bg {
  background: #e3e8ee;
  padding-top: 30px;
  padding-bottom: 1px;
  padding-left: 17px;
}
.wid {
  width: 350px;
}
.item {
  font-size: 14px;
  color: #999999;
}
</style>
