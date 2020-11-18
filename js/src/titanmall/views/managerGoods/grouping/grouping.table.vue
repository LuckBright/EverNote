<template>
  <div class="grouping-table">
    <p>共{{ totalCount }}件商品</p>
    <el-input
      v-model="goodsName"
      placeholder="搜索商品名称"
      size="mini"
      class="grouping-dialog-input"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column width="40px">
        <template slot-scope="scope">
          <i
            class="iconfont close-icon"
            @click="deleteInfo(scope.row)"
          >&#xe6e7;</i
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="title-img-box">
            <div class="img-box">
              <img
                class="img-wd"
                :src="scope.row.picture.includes('http') ? scope.row.picture : imgCdn + scope.row.picture"/>
            </div>
            <div class="label-box">
              <el-button class="goods-btn" type="text">{{
                scope.row.name
                }}
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160px"
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
      background
    >
    </el-pagination>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'

  export default {
    mixins: [ pagination ],
    props: {
      groupId: String,
    },
    data () {
      return {
        goodsName: '',
        tableData: [],
        timer: '',
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      // 获取表格数据
      getDataValues () {
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          groupId: this.groupId,
          name: this.goodsName,
        }
        api.spuGroupAddedSpuList(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            this.tableData = res.resultList
          }
        })
      },

      // 删除商品
      deleteInfo (row) {
        api.spuGroupDeleteSpuById(row.id).then(res => {
          if (res) {
            this.$message({
              message: '删除商品成功',
              type: 'success',
            })
            this.$emit('deleted')
            this.getDataValues()
          }
        })
      },
    },
    watch: {
      goodsName (n, l) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getDataValues()
        }, 700)
      },
    },
  }
</script>
<style lang="less" scoped>
  .grouping-table {
    .grouping-dialog-input {
      width: 300px;
      margin: 15px 0;
    }

    .close-icon {
      font-size: 16px;
      color: #1c7bef;
      cursor: pointer;
    }

    .title-img-box {
      display: flex;

      .img-box {
        width: 60px;
        height: 60px;

        .img-wd {
          width: 100%;
          height: 100%;
        }
      }

      .label-box {
        flex-grow: 1;
        width: 80%;
        margin-left: 20px;

        .goods-btn {
          width: 100%;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
