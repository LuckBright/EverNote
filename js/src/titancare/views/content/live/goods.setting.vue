<template>
  <div class="goods-setting">
    <template>
      <el-select
        v-model.trim="goodsArr"
        multiple
        filterable
        size="small"
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="ml10" size="small" type="primary" @click="addClickBtn">添加商品</el-button>
    </template>
    <el-table
      class="goods-table"
      :data="tableData"
      v-loading="tableLoading"
      border
      height="400"
      size="small"
    >
      <el-table-column label="序号" width="50" type="index"></el-table-column>
      <el-table-column label="商品照片" width="120">
        <template slot-scope="scope">
          <div
            :style="{backgroundImage:'url(' + (scope.row.goodsPicture.includes('http') ? scope.row.goodsPicture : imgCdn + scope.row.goodsPicture) + ')',backgroundSize:'cover',width:'60px',height:'60px',backgroundPosition:'center center' }"
          ></div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column label="商品价格" width="120">
        <template slot-scope="scope">{{(scope.row.price/100) | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作" width="70">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="deleteGoods(scope.row)"
          >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <p style="text-align: right">
      <el-pagination
        class='pagination'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="pagesize"
        :page-sizes="[20, 30, 50]"
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </p>
  </div>
</template>
<script>
import list from '@/titancare/mixins/list'
import api from '@/titancare/api/content/live'
import goodsApi from '@/titancare/api/content'
export default {
  mixins: [list],
  data () {
    return {
      goodsArr: [],
      options: [],
      loading: false,
      tableData: [],
      tableLoading: false,
      liveObj: {},
      tenantId: localStorage.getItem('TENANTID'),
      imgCdn: localStorage.getItem('IMGCDN')
    }
  },
  created () {
    this.liveObj = { ...JSON.parse(this.$route.query.liveRoom) }
    this.list()
  },
  methods: {
    list () {
      let params = {
        currentPage: this.current,
        pageSize: this.pagesize,
        tenantId: this.tenantId,
        liveRecordId: this.liveObj.id
      }
      api.searchLiveGoods(params).then(rs => {
        if (!rs.errCode) {
          this.totalCount = rs.data.totalCount
          this.tableData = rs.data.resultList
        }
      })
    },
    remoteMethod (val) {
      if (val) {
        let params = {
          data: {
            currentPage: this.current,
            pageSize: 9999,
            name: val
          }
        }
        goodsApi.recommendList(params).then(rs => {
          if (!rs.errCode) {
            this.options = rs.data.resultList
          }
        })
      }
    },
    /**
     * 添加商品
     * */
    addClickBtn () {
      if (!this.goodsArr.length) {
        this.$message.error('请选择推荐商品')
      } else {
        let list = []
        this.goodsArr.forEach(items => {
          let arr = this.options.filter(item => {
            if (item.id === items) {
              return item
            }
          })
          list = [...list, ...arr]
        })
        let params = {
          tenantId: this.tenantId,
          liveRecordId: this.liveObj.id,
          goodsList: list
        }
        api.batchAddLiveGoods(params).then(rs => {
          if (!rs.errCode) {
            this.$message.success('添加成功')
            this.list()
            this.goodsArr = []
          }
        })
      }
    },

    /**
     * 移除商品
     * */
    deleteGoods (row) {
      let params = {
        tenantId: this.tenantId,
        liveRecordId: this.liveObj.id,
        goodsId: row.goodsId
      }
      api.deleteLiveGoodsById(params).then(rs => {
        if (!rs.errCode) {
          this.$message.success('移除成功')
          this.list()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.goods-setting {
  .ml10 {
    margin-left: 10px;
  }
  .goods-table {
    margin-top: 10px;
    width: 100%;
    .title-img-box {
      display: flex;
      .img-box {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
        .img-wd {
          width: 100%;
          height: 100%;
        }
      }
      .label-box {
        flex-shrink: 1;
        flex-grow: 1;
        width: 60%;
        margin-left: 20px;
        line-height: 60px;
      }
    }
  }
}
</style>
