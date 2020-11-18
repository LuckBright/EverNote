<template>
  <div class="goods-setting">
    <p>
      <span class="sale-label">总销量：</span> {{sale.totalSaleNum}}
      <span class="sale-label ml10">销售总额：</span> {{sale.totalSaleAmount}}
    </p>
    <el-table
      class="goods-table"
      :data="tableData"
      v-loading="tableLoading"
      border
      height="400"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="status === 0"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="序号" width="50" type="index"></el-table-column>
      <el-table-column label="商品照片" width="120">
        <template slot-scope="scope">
          <div
            :style="{backgroundImage:'url(' + (scope.row.goodsPicture.includes('http') ? scope.row.goodsPicture : imgCdn + scope.row.goodsPicture) + ')',backgroundSize:'cover',width:'60px',height:'60px',backgroundPosition:'center center' }"
          ></div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column v-if="status === 0" label="商品价格" width="120">
        <template slot-scope="scope">{{(scope.row.price/100) | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column v-if="status === 1" label="操作" width="90">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="recommendClick(scope.row)"
            :disabled="Boolean(scope.row.weatherRecommend)"
          >推荐</el-button
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
export default {
  mixins: [list],
  props: {
    status: { // 判断是否群聊 1/是 0/否
      type: Number,
      required: true
    }
  },
  data () {
    return {
      tableData: [],
      tableLoading: false,
      tenantId: localStorage.getItem('TENANTID'),
      liveObj: {},
      infoArr: [],
      sale: {
        totalSaleNum: 0,
        totalSaleAmount: 0
      },
      imgCdn: localStorage.getItem('IMGCDN')
    }
  },
  created () {
    this.liveObj = { ...JSON.parse(this.$route.query.liveRoom) }
    this.list()
    this.getSale()
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
    async getSale () {
      let params = {
        liveId: this.liveObj.id
      }
      api.liveSale(params).then(rs => {
        if (!rs.errCode) {
          this.sale = { ...this.sale, ...rs.data }
          this.sale.totalSaleAmount = rs.data.totalSaleAmount / 100
        }
      })
    },

    /**
     * 推荐
     * */
    recommendClick (row) {
      this.$emit('info', row)
    },

    /**
     * 多选
     * */
    handleSelectionChange (val) {
      this.infoArr = val
    }
  }
}
</script>
<style lang="less" scoped>
  .goods-setting {
    .sale-label {
      color: #000;
    }
    .ml10 {
      margin-left: 10px;
    }
    .goods-table {
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
