<template>
  <div class="grouping-table">
    <el-input
      v-model="groupingName"
      placeholder="搜索商品分组名称"
      size="mini"
      class="grouping-dialog-input"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-table
      v-if="type === 1"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="分组名称"></el-table-column>
      <el-table-column prop="num" label="分组商品数"></el-table-column>
    </el-table>
    <el-table v-if="type === 2" :data="tableData" border style="width: 100%">
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.row.id">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分组名称"></el-table-column>
      <el-table-column prop="num" label="分组商品数"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="pageSize"
      :page-size="pagesize"
      :layout="pageLayout"
      :total="totalCount"
      background
    >
    </el-pagination>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from './api'

  export default {
    mixins: [ pagination ],
    props: {
      type: Number, // 判断多选还是单选
    },
    data () {
      return {
        groupingName: '',
        tableData: [],
        allInfo: [],
        timer: '',
        radio: '',
        rowInfo: {},
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      handleSelectionChange (val) {
        this.allInfo = val
      },

      // 获取列表数据
      getDataValues () {
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          name: this.groupingName,
        }
        api.groupListBySpuGroup(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            this.tableData = res.resultList
          }
        })
      },
    },
    watch: {
      groupingName (n, l) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getDataValues()
        }, 800)
      },
      radio (n, l) {
        this.rowInfo = this.tableData.filter(item => item.id === n)[0]
      },
    },
  }
</script>
<style lang="less" scoped>
  .grouping-table {
    margin-top: 10px;

    .grouping-dialog-input {
      width: 300px;
      margin-bottom: 15px;
    }
  }
</style>
