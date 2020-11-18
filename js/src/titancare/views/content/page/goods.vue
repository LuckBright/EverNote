<template>
  <div class="layout_inner">
    <ever-bread-crumb></ever-bread-crumb>
    <div class="wrap">
      <el-input placeholder="商品名称" v-model="name" clearable class="widthinput"></el-input>
      <el-button type="primary" @click="list(true)">查询</el-button>
      <el-table
        class="eltable"
        ref="eltable"
        border
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="商品照片" width="120">
          <template slot-scope="scope">
            <div
              :style="{backgroundImage:'url(' + scope.row.picture + ')',backgroundSize:'cover',width:'100px',height:'100px',backgroundPosition:'center center' }"
            ></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="600"></el-table-column>
        <el-table-column label="商品价格" width="120">
          <template slot-scope="scope">{{(scope.row.price/100) | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
      <div class="footer">
        <el-button type="primary" @click="save()">确定</el-button>
        <el-button plain @click="cancel()">取消</el-button>
      </div>
    </div>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pagesize="pagesize"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
  </div>
</template>
<script>
import { debounce } from '@/titancare/utils/common'
import api from '@/titancare/api/content/index'
import list from '@/titancare/mixins/list'

export default {
  mixins: [list],
  data () {
    return {
      api,
      name: '',
      tableData: [],
      currentRow: '',
      token: '', // 获取店铺token  拼接到header
      domain: '', // 获取商品的域名
      link: '' // 商品链接
    }
  },
  async created () {
    await this.getToken()
    await this.shopDomain()
    this.list()
  },
  methods: {
    getToken () {
      return this.api.list().then(rs => {
        if (rs.errCode === 0 && rs.data) {
          this.token = rs.data[0].token
        }
      })
    },
    shopDomain () {
      return this.api.shopDomain().then(rs => {
        if (rs.errCode === 0) {
          this.domain = rs.data
        }
      })
    },
    save: debounce(function () {
      if (!this.currentRow) {
        this.$notify({
          title: '警告',
          message: '请选择一个商品',
          type: 'warning'
        })
        return false
      }
      this.currentRow.type = 'not'
      let goods = {
        goodsDesc: this.currentRow.name,
        goodsId: this.currentRow.id,
        goodsPrice: this.currentRow.price,
        photoUrl: this.currentRow.picture,
        shop: this.currentRow.shop,
        link: 'https://' + this.domain + '/web/mall/#/goods?id=' + this.currentRow.id + '&shop=' + this.token + '&shop=' + this.currentRow.shop
      }
      this.$router.push({ name: 'videodetail', query: { goods: JSON.stringify(goods), type: this.$route.query.type, queryobj: this.$route.query.queryobj, id: this.$route.query.id } })
    }),
    list () {
      let params = {}
      params.data = {
        currentPage: this.current,
        offset: this.offset,
        pagesize: this.pagesize,
        name: this.name
      }
      // params.config = {
      //   headers: {
      //     'token': this.token
      //   }
      // }
      this.api.recommendList(params).then(rs => {
        if (rs.errCode === 0 && rs.data && rs.data.resultList) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.tableData = []
        }
      })
    },
    handleCurrentChange (row) {
      // 兼容row为null报错
      if (!row) {
        return
      }
      this.tableData.forEach((item) => {
        if (item.id !== row.id) {
          item.checked = false
        } else {
          item.checked = true
        }
      })
      this.currentRow = row
    },
    // 返回
    close () {
      this.$router.go(-1)
    },
    cancel () {
      this.close()
    }
  }
}
</script>
<style lang='less' scoped>
.layout_inner {
  padding: 20px;
  margin-right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin-top: none;
  .topClose {
    color: #666;
    margin: 0;
    span {
      cursor: pointer;
    }
    &:hover {
      color: #1c7bef;
    }
  }
  .wrap {
    margin-top: 10px;
    .widthinput {
      width: 220px;
      margin-right: 15px;
    }
    .eltable {
      margin-top: 15px;
      width: 100%;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .footer {
      text-align: left;
    }
  }
}
</style>
