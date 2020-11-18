<template>
  <div class="like-container">
    <p>
      <el-input
        v-model="searchInput"
        style="width: 382px"
        size="small"
        placeholder="搜索已添加的商品名称"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </p>
    <div v-if="!showChecks">
      <el-table
        :data="tableData"
        style="width: 100%;margin-top: 10px"
        size="small"
        border
        highlight-current-row
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.spuId">{{
              ''
              }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top: 10px"
        size="small"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
      </el-table>
    </div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="pageSize"
      :page-size="pagesize"
      :layout="pageLayout"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>
<script>
  import api from './api'
  import pagination from '@/titanmall/mixins/pagination'

  export default {
    mixins: [ pagination ],
    props: [ 'upGoodsArr', 'showCheck' ],
    data () {
      return {
        api,
        searchInput: '',
        tableData: this.upGoodsArr.resultList,
        value: '',
        time: '',
        totalCount: this.upGoodsArr.totalCount,
        showChecks: !!this.showCheck,
        checkList: [],
        radio: '',
      }
    },
    methods: {
      getDataValues () {
        let params = {
          name: this.searchInput,
          currentPage: this.current,
          pageSize: this.pagesize,
          repeat: this.showCheck ? '2' : '1',
        }
        this.api.findSpuByName(params).then(res => {
          if (res) {
            this.tableData = res.resultList
            this.totalCount = res.totalCount
          }
        })
      },
      handleSelectionChange (r) {
        this.checkList = [ ...r ]
      },
    },
    watch: {
      searchInput (n, l) {
        this.current = 1
        if (this.time) clearTimeout(this.time)
        this.time = setTimeout(() => this.getDataValues(), 800)
      },
      radio (n, l) {
        this.value = this.tableData.filter(item => item.spuId === n)[0]
      },
    },
  }
</script>
<style lang="less" scoped>
  .like-container {
    margin: 10px 0;
  }
</style>
