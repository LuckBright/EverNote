<template>
  <div id="mall">
    <el-row class="top">
      <el-col>
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <router-link to="/card/rechargebuy"><el-button class="cart">充值</el-button></router-link>
              <router-link to="/card/mallcarts"><el-button type="primary" class="cart"><i class="iconfont icon-sales-gouwuche"></i> 我的购物车</el-button></router-link>
            </el-form-item>
          </template>
        </ever-form2>
      </el-col>
    </el-row>
    <el-menu class="el-menu-demo top-menu" mode="horizontal" menu-trigger="click" @open="handleOpen" :unique-opened="true"  @select="handleSelect">
      <el-menu-item index="1">全部</el-menu-item>
      <el-submenu :index="String(item.id)" v-for="(item, i) in menuUl" :key="i">
        <template slot="title">{{item.name}}</template>
        <el-menu-item :index="String(key.id)" v-for="(key, j) in item.menuLi" :key="j">{{key.name}}</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-row class="totalcount">
      <el-col :span="24">
        共有 <span>{{totalCount}}</span> 个商品
      </el-col>
    </el-row>
    <el-row v-if="tableData && tableData.length" class="goodsitem backfff" v-for="(item, i) in tableData" :key="i">
      <el-col :span="22" class="goodsleft">
        <a :href="$ever.cardIndex + '/card/malldetails/' + item.id">
          <img v-if="item.images" :src="`${$ever.fileUrl2}${item.images.split('#')[0]}`">
          <img v-else :src="item.images | fixImgSrc(5)">
        </a>
        <h4 class="title"><a :href="$ever.cardIndex + '/card/malldetails/' + item.id">{{item.name}}</a></h4>
        <span class="price">商城价 <em>￥{{(item.salePrice) | formatToFinacial}}</em></span>
      </el-col>
      <el-col :span="2" class="goodsright" align="center">
        <el-button @click="toCart(item)" :loading="item.loading">
          <i class="iconfont icon-sales-gouwuche"></i>
        </el-button>
      </el-col>
      <div class="goodsitem_hr"></div>
    </el-row>
    <el-row class="page">
      <el-col :span="24">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-col>
    </el-row>
    <el-dialog :title="msg.title"  :visible.sync="changePrice" class="ui_dialog_02 spe">
      <el-form  label-width="200px" :model="payForm" :rules="payRules"  ref="payForm">
        <el-form-item :label="msg.label" prop="singleSalePrice"><el-input v-model="payForm.singleSalePrice" type="number" placeholder="请输入金额"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add2Cart(obj)"><i class="iconfont icon-tijiao"></i>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../store/indexapi'
  import utillist from '../../util/list'
  import cart from '../store/cartapi'
  let querySchema = [
    {
      name: 'name',
      label: '商品名称',
      props: {
        placeholder: '请输入商品名称'
      },
      style: 'width: 400px'
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        api: api,
        querySchema,
        queryObj: queryObj,
        totalCount: 0,
        menuUl: [],
        menuLi: [],
        obj: {},
        msg: {
          titie: '',
          label: ''
        },
        payForm: {
          singleSalePrice: ''
        },
        payRules: {
          singleSalePrice: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { min: 1, max: 6, message: '长度在不能大于6个字符', trigger: 'blur' }
          ]
        },
        changePrice: false,
        tableData: []
      }
    },
    created () {
      api.list({status: '1'}).then(result => {
        result.data.resultList.map(item => {
          item.loading = false
        })
        this.tableData = result.data.resultList
        this.$forceUpdate()
      })
      api.syncProductRestStockNum().then(res => {
      })
      api.getIndexLevel({parentId: 1, status: 1}).then(result => {
        this.menuUl = result.data
      })
    },
    methods: {
      handleOpen (key, keyPath) {
        var num
        this.menuUl.map((item, i) => {
          if (item.id === String(key)) {
            num = i
          }
        })
        api.getByLevel({parentId: key}).then(result => {
          this.menuUl[num].menuLi = result.data
          this.$forceUpdate()
        })
      },
      add2Cart (item) {
        this.$refs.payForm.validate(valid => {
          if (valid) {
            let params = {
              productSkuId: item.productSkus[0].id,
              amount: 1,
              singleSalePrice: this.payForm.singleSalePrice
            }
            if (item.type === 2) {
              if (Number(params.singleSalePrice) < 0) {
                this.$message({
                  message: '输入金额不能为负数',
                  type: 'warning'
                })
                return false
              }
            } else if (item.type === 1) {
              if (Number(params.singleSalePrice) < item.productSkus[0].origPrice) {
                this.$message({
                  message: '请输入不少于' + item.productSkus[0].origPrice + '的金额',
                  type: 'warning'
                })
                return false
              }
            }
            item.loading = true
            cart.add2Cart(params).then(res => {
              if (res) {
                item.loading = false
                this.changePrice = false
                this.payForm = {
                  singleSalePrice: ''
                }
              }
            })
          }
        })
      },
      toBuy (item) {
        let params = {
          productSkuId: item.productSkus[0].id,
          amount: 1,
          singleSalePrice: item.salePrice
        }
        if (item.type === 2) {
          if (Number(params.singleSalePrice) < 0) {
            this.$message({
              message: '输入金额不能为负数',
              type: 'warning'
            })
            return false
          }
        } else if (item.type === 1) {
          if (Number(params.singleSalePrice) < item.productSkus[0].origPrice) {
            this.$message({
              message: '请输入不少于' + item.productSkus[0].origPrice + '的金额',
              type: 'warning'
            })
            return false
          }
        }
        item.loading = true
        cart.add2Cart(params).then(res => {
          if (res) {
            item.loading = false
            this.changePrice = false
            this.payForm = {
              singleSalePrice: ''
            }
          }
        })
      },
      toCart (item) {
        Object.assign(this.obj, item)
        if (item.fixSalePrice) {
          if (item.type === 1) {
            this.changePrice = true
            this.msg = {
              title: '储值金额',
              label: '储值金额'
            }
          } else {
            this.changePrice = true
            this.msg = {
              title: '商品金额',
              label: '商品金额'
            }
          }
        } else {
          this.toBuy(item)
        }
      },
      handleSelect (key, keyPath) {
        let param
        if (key === '1') {
          param = {
            status: 1
          }
        } else {
          param = {
            productCategoryId: key,
            status: '1',
            offset: 0,
            pagesize: 20
          }
        }
        api.list(param).then(result => {
          this.tableData = result.data.resultList || []
          this.totalCount = result.data.totalCount || 0
        })
      },
      addCart (obj) {}
    },
    components: {
      // menuNav
    }
  }
</script>
<style scoped>
</style>
