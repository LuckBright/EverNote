<template>
  <div class="like-container">
    <p>
      <el-input
        v-model="searchInput"
        style="width: 250px"
        size="small"
        placeholder="搜索已添加的商品名称"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button
        size="small" style="float: right" @click="addMallBtn"
      >添加展示商品
      </el-button
      >
    </p>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 10px"
      size="small"
      border
      max-height="600"
    >
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button
            type="text" @click="deletedInfo(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="sid" label="序号" width="70"></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      ></el-table-column>
    </el-table>
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
    <el-dialog
      :visible.sync="showUpDialog"
      width="50%"
      destroy-on-close
      title="已上架商品"
      :modal="false"
    >
      <up-goods
        ref="upGoodsRef"
        :upGoodsArr="upGoodsArr"
        :showCheck="1"
      ></up-goods>
      <p style="margin-top: 10px;">
        <el-button
          size="small" type="primary" @click="getUpDialog"
        >确 认
        </el-button
        >
        <el-button size="small" @click="showUpDialog = false">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import upGoods from './up.goods.vue'
  import api from './api'

  export default {
    mixins: [ pagination ],
    props: [ 'upGoodsArr', 'status', 'titleName' ],
    components: {
      upGoods,
    },
    data () {
      return {
        api,
        searchInput: '',
        tableData: [],
        totalCount: this.upGoodsArr.totalCount,
        time: '',
        index: '-1',
        showUpDialog: false,
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      // 获取瀑布流信息
      getDataValues () {
        let params = {
          goodsName: this.searchInput,
          currentPage: this.current,
          pageSize: this.pagesize,
          orderingRule: 2,
        }
        this.api.findInfiniteScrolling(params).then(res => {
          if (res) {
            this.tableData = res.infiniteList
            this.totalCount = res.totalCount
          }
        })
      },
      getUpDialog () {
        let spuIdList = []
        this.$refs.upGoodsRef.checkList.forEach(item => {
          spuIdList.push(item.spuId)
        })
        let params = {
          spuIdList: spuIdList,
          user: this.titleName.user,
          subheading: this.titleName.subheading,
          status: Number(this.status),
        }
        this.api.saveInfiniteScrolling(params).then(res => {
          if (res) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.showUpDialog = false
            this.getDataValues()
          }
        })
      },
      // 删除瀑布流数据
      deletedInfo (row) {
        this.$confirm('是否删除 ' + row.name, '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let params = '/' + row.spuId + '/' + Number(this.status)
            this.api.deleteInfiniteScrollingBySpuId(params).then(res => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                this.getDataValues()
              }
            })
          })
          .catch(() => {
          })
      },

      // 添加商品
      addMallBtn () {
        this.showUpDialog = true
        let params = {
          name: '',
          currentPage: 1,
          pageSize: 20,
          repeat: '2',
        }
        this.api.findSpuByName(params).then(res => {
          if (res) {
            this.$refs.upGoodsRef.tableData = res.resultList
            this.$refs.upGoodsRef.totalCount = res.totalCount
          }
        })
      },
    },
    watch: {
      searchInput (n, l) {
        if (this.time) clearTimeout(this.time)
        this.current = 1
        this.time = setTimeout(() => this.getDataValues(), 800)
      },
    },
  }
</script>
<style lang="less" scoped>
  .like-container {
    margin: 10px 0;
  }
</style>
