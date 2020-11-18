<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="12">
        <span class="title"><i class="el-icon-arrow-left" @click="prevPage"></i> 我的购物车</span>
      </el-col>
      <el-col :span="12" align="right" class="cartcount"> 已选 <em class="count">{{total.count}}</em> 件商品 <span class="total"> 合计 <em>￥{{(total.price ) | formatToFinacial}}</em></span></el-col>
    </el-row>
    <div class="tabledata">
      <el-table
        @selection-change="handleSelectionChange"
        v-if="tableData.length"
        ref="cartstable"
        class="cartstable"
        :row-class-name="tableRowClassName"
        :data="tableData"
        >
        <el-table-column
          label="全选"
          type="selection"
          width="60"
          :selectable="checkSelectable">
        </el-table-column>
        <el-table-column
          label=""
          align="center"
          width="120">
          <template slot-scope="scope">
            <a :href="$ever.cardIndex + '/card/malldetails/' + scope.row.productId">
              <img v-if="scope.row.productImages" :src="`${$ever.fileUrl2}${scope.row.productImages.split('#')[0]}`">
              <img v-else :src="scope.row.productImages | fixImgSrc(5)">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="商品">
          <template slot-scope="scope">
            <p><a :href="$ever.cardIndex + '/card/malldetails/' + scope.row.productId">{{scope.row.productName}}</a></p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="specValue"
          width="160"
          label="规格">
          <template slot-scope="scope">
            <p>{{scope.row.specValue}}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="210"
          prop="singleSalePrice"
          label="单价">
          <template slot-scope="scope">
            <strong class="gray">￥ {{(scope.row.singleSalePrice) | formatToFinacial}}</strong>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="130"
          label="数量">
          <template slot-scope="scope">
            <el-input-number size="small" v-model="scope.row.amount" @change="(num) => {setGoodesPrice(scope.row, num)}" :min="1" :max="scope.row.restStockNum ? scope.row.restStockNum : 9999999" controls-position="right"></el-input-number>
            <span v-if="scope.row.restStockNum == 0 && scope.row.status == 1" style="color:#fa5555">无货</span>
            <span v-if="scope.row.status == 0" style="color:#fa5555">已下架</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="210"
          label="总价">
          <template slot-scope="scope">
            <strong class="red">￥ {{(scope.row.singleSalePrice * scope.row.amount) | formatToFinacial}}</strong>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="empty" class="emptydata" v-if="tableData.length==0">
        <div>
          <el-image src="../../../static/assets/kong.png"></el-image>
          <strong>购物车空空的哦~</strong>
          <p>返回 <router-link to="/card/mallindex">首页</router-link> 看看吧！</p>
        </div>
      </div>
      <el-row class="footbar" v-if="tableData.length>0">
        <el-col :span="3">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </el-col>
        <el-col :span="21" align="right" class="cartcount">
          已选 <em class="count">{{total.count}}</em> 件商品 <span class="total"> 合计 <em>￥{{(total.price) | formatToFinacial}}</em></span>
          <el-button type="primary" @click="toOrderPage">去结算</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped>
  .el-table .sold-out {
    background: #f3f3f3;
  }
  .emptydata {
    width: 100%;
    margin-top: 80px;
    display: flex;
    justify-content: center
  }
  #mall .cartstable /deep/ .el-table__body-wrapper table{
    margin: 0 !important;
  }
  #mall .cartstable /deep/ .el-table__header th{
    background-color: #eee;
  }
</style>
<script>
  import api from '../store/mallcartapi'
  import utillist from '../../util/list'
  export default {
    mixins: [utillist],
    data () {
      return {
        api: api,
        isIndeterminate: false,
        checkAll: false,
        selected: [],
        totalCount: 0,
        pagesize: 100,
        tableData: []
      }
    },
    created () {

    },
    mounted () {
      // this.resetTableStyle()
    },
    methods: {
      handleDelete (row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.checkAll = false
          return api.del(row.id)
        }).then(() => {
          this.list()
          this.checkAll = false
        })
      },
      tableRowClassName (row, rowIndex) {
        if (row.restStockNum === 0 || Number(row.status) === 0) {
          return 'sold-out'
        }
      },
      checkSelectable (row) {
        return !(row.restStockNum === 0 || Number(row.status) === 0)
      },
      prevPage () {
        window.history.go(-1)
      },
      resetTableStyle () {
        const width = this.$refs.cartstable.bodyWrapper.clientWidth
        setTimeout(() => {
          this.$refs.cartstable.bodyWrapper.children[0].style.width = (width - 40) + 'px'
          this.$refs.cartstable.bodyWrapper.getElementsByTagName('colgroup')[0].children[2].width -= 40
        }, 0)
      },
      setGoodesPrice (i, num) {
        let params = {
          id: i.id,
          cartId: i.cartId,
          productSkuId: i.productSkuId,
          amount: num,
          singleSalePrice: i.singleSalePrice
        }
        api.modify(params).then(res => {
        })
      },
      handleCheckAllChange (event) {
        if (event) {
          this.tableData.forEach(row => {
            if (row.restStockNum !== 0 && Number(row.status) !== 0) {
              this.$refs.cartstable.toggleRowSelection(row, true)
            }
          })
        } else {
          this.$refs.cartstable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        let tableArr = []
        this.selected = val
        for (let i = 0; i < this.tableData.length; i++) {
          let item = this.tableData[i]
          if (item.restStockNum !== 0 && Number(item.status) !== 0) {
            tableArr.push(item)
          }
          this.checkAll = this.selected.length === tableArr.length
        }
      },
      toOrderPage () {
        if (this.selected.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择商品'
          })
          return false
        } else {
          let ids = []
          this.selected.map(item => {
            ids.push(item.id)
          })
          let params = ids.join(',')
          api.getByIds(params).then(result => {
            if (result.head.errCode === 0) {
              this.$router.push('/card/mallbuy/' + ids)
            }
          })
        }
      }
    },
    computed: {
      total () {
        let count = 0
        let price = 0
        this.selected.forEach(item => {
          count += item.amount
          price += item.singleSalePrice * item.amount
        })
        return {count: count, price: price}
      }
    },
    watch: {
      'tableData' (val) {
        val.map(item => {
          if (item.restStockNum < item.amount) {
            let params = {
              id: item.id,
              cartId: item.cartId,
              productSkuId: item.productSkuId,
              amount: item.restStockNum,
              singleSalePrice: item.singleSalePrice
            }
            api.modify(params).then(res => {
            })
          }
        })
      }
    }
  }
</script>

