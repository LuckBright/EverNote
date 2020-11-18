<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="12">
        <span class="title" @click="prevPage"><i class="el-icon-arrow-left"></i> {{obj.name}}</span>
      </el-col>
      <el-col :span="12" align="right">
        <router-link to="/card/rechargebuy"><el-button class="cart">充值</el-button></router-link>
        <router-link to="/card/mallcarts"><el-button type="primary" class="cart"><i class="iconfont icon-sales-gouwuche"></i> 我的购物车</el-button></router-link>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col :span="24" class="goodsmain">
        <div class="block">
          <div class="goodsimages">
            <el-carousel trigger="click" height="285px">
              <el-carousel-item v-if="obj.imagesArr && obj.imagesArr.length">
                <el-image v-for="(item, i) in obj.imagesArr" :key="i" :src="`${$ever.fileUrl2}${item}`"></el-image>
              </el-carousel-item>
              <el-carousel-item v-else>
                <el-image src=""></el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <h4 class="title">{{obj.name}}</h4>
        <h4 class="title en">{{obj.enName}}</h4>
        <div class="pricewrap">
          <span class="price">商城价 <em>￥{{obj.salePrice | formatToFinacial}}</em></span>
          <span class="cost">市场价 <em>￥{{obj.origPrice | formatToFinacial}}</em></span>
        </div>
        <span class="smalllabel">商品规格 {{obj.productSkus ? obj.productSkus[0].specValue : '--'}}</span>
        <div class="clear">
          <span class="smalllabel selectnum">选择数量:</span>
          <div class="mb20 fl">
            <el-input-number size="small" v-model="goodsCount" :min="1" :max="obj.restStockNum ? obj.restStockNum : 9999999" controls-position="right"></el-input-number>
            <label>件</label>
            <label>库存{{obj.restStockNum != null ? obj.restStockNum + '件' : '充足'}}</label>
          </div>
        </div>
        <div class="buttons clear">
          <el-button @click="showPop('1')" v-if="obj.restStockNum != 0 && obj.status == 1">立即购买</el-button>
          <el-button type="primary" v-if="obj.restStockNum != 0 && obj.status == 1" :loading="loading" @click="showPop('2')"><i class="iconfont icon-sales-gouwuche"></i> 加入购物车</el-button>
          <el-button :plain="true" type="info" :disabled="true" v-else-if="obj.restStockNum == 0 && obj.status == 1">已售罄</el-button>
          <el-button :plain="true" type="info" :disabled="true" v-if="obj.status != 1">已下架</el-button>
        </div>
      </el-col>
      <el-col :span="24" class="goodsdetail" v-if="comment">
        <h3 class="title"><span>商品描述</span></h3>
        <article v-html="comment">
        </article>
      </el-col>
    </el-row>
    <el-dialog :title="msg.title"  :visible.sync="changePrice" class="ui_dialog_02 spe">
      <el-form  label-width="200px" :model="payForm" :rules="payRules"  ref="payForm">
        <el-form-item :label="msg.label" prop="singleSalePrice"><el-input v-model="payForm.singleSalePrice" type="number" placeholder="请输入金额"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add2Cart()"><i class="iconfont icon-tijiao"></i>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../store/indexapi'
  import cart from '../store/cartapi'
  export default {
    data () {
      return {
        api: api,
        totalCount: 100,
        goodsCount: 1,
        goodsTypeSelected: '',
        changePrice: false,
        loading: false,
        objId: this.$route.params.id,
        type: '',
        num: '',
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
        obj: {},
        comment: ''
      }
    },
    created () {
      if (this.objId) {
        api.getById(this.objId).then(result => {
          if (result.data.images) {
            result.data.imagesArr = result.data.images.split('#')
          }
          if (result.data.comment) {
            this.comment = result.data.comment
          }
          this.type = result.data.type
          this.obj = result.data
          if (result.data.type === 1) {
            this.msg = {
              title: '储值金额',
              label: '储值金额'
            }
          } else {
            this.msg = {
              title: '商品金额',
              label: '商品金额'
            }
          }
        })
        api.syncProductRestStockNum().then(res => {
        })
      }
    },
    methods: {
      // $router.push('/mallgoods/mallbuy/1/' + objId)
      showPop (i) {
        if (i === '2') {
          this.loading = true
        }
        if (this.obj.fixSalePrice) {
          this.changePrice = true
          this.num = i
        } else {
          this.num = i
          this.addBuy()
        }
      },
      add2Cart () {
        this.$refs.payForm.validate(valid => {
          if (valid) {
            let params = {
              productSkuId: this.obj.productSkus[0].id,
              amount: this.goodsCount,
              singleSalePrice: this.payForm.singleSalePrice
            }
            if (this.type === 2) {
              if (Number(params.singleSalePrice) < 0) {
                this.$message({
                  message: '输入金额不能为负数',
                  type: 'warning'
                })
                return false
              }
            } else {
              if (params.singleSalePrice < this.obj.origPrice) {
                this.$message({
                  message: '请输入不少于' + this.obj.origPrice + '的金额',
                  type: 'warning'
                })
                return false
              }
            }
            if (this.num === '2') {
              this.loading = true
            }
            cart.add2Cart(params).then(res => {
              if (res) {
                this.changePrice = false
                this.payForm = {
                  singleSalePrice: ''
                }
                if (this.num === '1') {
                  this.$router.push('/card/mallbuy/' + res.data.id)
                }
              }
            })
          }
        })
      },
      addBuy () {
        let params = {
          productSkuId: this.obj.productSkus[0].id,
          amount: this.goodsCount,
          singleSalePrice: this.obj.salePrice
        }
        if (this.num === '2') {
          this.loading = true
        }
        cart.add2Cart(params).then(res => {
          if (res) {
            this.loading = false
            this.changePrice = false
            this.payForm = {
              singleSalePrice: ''
            }
            if (this.num === '1') {
              this.$router.push('/card/mallbuy/' + res.data.id)
            }
          }
        })
      },
      prevPage () {
        window.history.go(-1)
      },
      setGoodsTypeSelected (val) {
        this.goodsTypeSelected = val
      }
    },
    watch: {
      'changePrice': function (val) {
        if (!val) {
          this.loading = false
        }
      }
    }
  }
</script>
<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #fff;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #fff;
  }
  .el-carousel__indicators{
    position: absolute;
    list-style: none;
    bottom: 0;
    left: 0%;
    -ms-transform: translateX(0%);
    transform: translateX(0%);
    margin: 0;
    padding: 0;
    z-index: 2;
    width: 100%;
    text-align: center;
  }
  .el-carousel__item {text-align: center; line-height: 340px;}
  #mall .goodsimages {border: 1px solid #ccc; }
  #mall .goodsimages img{width:100%; display: inline-block; vertical-align: middle;}
</style>
