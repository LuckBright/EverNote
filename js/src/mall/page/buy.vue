<template>
	<div id="mall">
		<el-row class="top">
      <el-col :span="12">
        <span class="title" @click="prevPage"><i class="el-icon-arrow-left"></i> 填写并核对订单信息</span>
      </el-col>
      <el-col :span="12" align="right"></el-col>
    </el-row>
    <el-card>
      <div class="buyinfo">
        <strong>购买人信息</strong>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          @selectuser="selectUserBuyer"
          @objsaved="afterSave"
          label-position="right"
          ref="form">
        </ever-form-model>
      </div>
      <div class="buyinfo">
        <strong>销售人信息</strong>
  	    <ever-form-model
  	      :schema="schema1"
  	      v-model="obj1"
  	      :api="api"
  	      :rules="rules1"
  	      @objsaved="afterSave"
          @selectuser="selectUserSeller"
  	      label-position="right"
  	      ref="form1">
  	    </ever-form-model>
      </div>
	  	<strong class="title">商品清单</strong>
	  	<div v-if="tableData.length">
        <div v-for="(item, i) in tableData" :key="i" class="goodslistcon colorback">
          <el-row class="goodsitem">
            <el-col :span="10" class="goodsleft">
              <a :href="$ever.cardIndex + '/card/malldetails/' + item.dataMap.productId">
                <img v-if="item.dataMap.productImages" :src="`${$ever.fileUrl2}${item.dataMap.productImages.split('#')[0]}`">
                <img v-else :src="item.dataMap.productImages | fixImgSrc(5)">
              </a>
              <h4 class="title"><a :href="$ever.cardIndex + '/card/malldetails/' + item.dataMap.productId">{{item.dataMap.productName}}</a></h4>
            </el-col>
            <el-col :span="6" class="goodsright">
              <span class="count"> <em>{{item.obj.amount}}</em>件</span>
              <span class="price"> ¥<em>{{item.obj.singleSalePrice | formatToFinacial}}</em></span>
            </el-col>
            <el-col :span="8" class="goodsright">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="实付单价" class="mb0" prop="payPrice">
                  <el-input v-model="item.obj.singleSalePriceNew" placeholder="请输入实付单价" type="number" @blur="judgePrice(item.obj.singleSalePriceNew, item.obj.singleSalePrice)"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row class="couponsnum" v-if="item.dataMap.productType == 1 || item.dataMap.productType == 2 || item.dataMap.productType == 7">
            <el-form label-width="80px" ref="bindUserForm" v-for="(info, n) in item.GoodsInfo" :key="n + 1" :model="info">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="卡券编号" v-if="item.dataMap.productType != 7">
                    <el-input v-model="info.code" @blur="validCode(item.dataMap.productType, info.code, i, n)" type="number"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="绑定人" v-if="item.dataMap.productType != 7">
                    <span>
                      <label>
                        <el-tag
                        v-if="info.patientInfo.length > 0"
                        v-model="info.patientInfo"
                        @close="deleteCardUser(i, n)"
                        type="primary"
                        :closable="true"
                        close-transition>
                        {{info.patientInfo.length > 0 ? info.patientInfo[0].userName : ''}}
                        </el-tag>
                      </label>
                      <el-button size="small" @click="selectCardUser(i, n, 'cardInfo')">选择用户</el-button>
                    </span>
                  </el-form-item>
                  <el-form-item label="绑定人"
                    v-if="item.dataMap.productType === 7"
                    prop="patientInfo"
                    :rules="{
                      required: true, message: '请选择绑定人',  trigger: 'change', type: 'array'
                    }">
                    <span>
                      <label>
                        <el-tag
                        v-if="info.patientInfo.length > 0"
                        v-model="info.patientInfo"
                        @close="deleteCardUser(i, n)"
                        type="primary"
                        :closable="true"
                        close-transition>
                        {{info.patientInfo.length > 0 ? info.patientInfo[0].userName : ''}}
                        </el-tag>
                      </label>
                      <el-button size="small" @click="selectCardUser(i, n, 'cardInfo')">选择用户</el-button>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="">
                    <el-checkbox label="同购买人" v-model="info.isBuyer" :disabled="!obj.userInfo.length > 0" name="type" @change="handleChangeBuyer(i, n, info.isBuyer)"></el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
      </div>
	    <el-row :span="18" class="settlement">
	    	<el-col :span="18" class="line38">
	    		<el-col><span class="total">商品总金额：<em>¥{{total.price | formatToFinacial}}</em></span></el-col>
	    		<el-col><span class="free">减免金额: <em>¥{{(total.price - total.payPrice) | formatToFinacial}}</em></span></el-col>
          <el-col><span class="total">实付总金额：<em>¥{{total.payPrice | formatToFinacial}}</em></span></el-col>
        </el-col>
	  	</el-row>
      <div class="payBtn">
        <el-button type="primary" @click="submitForm()" :loading="submitLoading" class="el-button">提交订单</el-button>
      </div>
	  </el-card>
    <select-user-pop ref="selectuserbuyer" @selectUserVal="setSelectData"></select-user-pop>
    <select-seller-pop ref="selectuserseller" @selectUserVal="setSelectSellData"></select-seller-pop>
    <select-card-user ref="selectcarduser" @selectUserVal="setSelectCardData"></select-card-user>
    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <span>订单中部分商品已下架或已售罄<br>请返回购物车修改</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="toCart">返回购物车</el-button>
      <el-button  @click="dialogVisible = false">取消</el-button>
    </span>
  </el-dialog>
	</div>
</template>
<script>
  import api from '../store/cartapi'
  import form from '../../util/form'
  import selectUserPop from '../page/selectusers'
  import selectSellerPop from '../page/selectsells'
  import selectCardUser from '../page/selectcardusers'
  import card from '../../card/store/carditemapi'
  import gift from '../../card/store/giftbatchdetailapi'
  let schema = [
    {
      name: 'userInfo',
      type: 'selectuser',
      label: '选择用户',
      style: 'label',
      shareCount: 1,
      span: 24
    }
  ]
  let schema1 = [
    {
      name: 'sellerInfo',
      type: 'selectuser',
      label: '选择销售人',
      style: 'label',
      shareCount: 1,
      span: 8
    },
    {
      name: 'saleReason',
      label: '销售原因',
      placeholder: '销售原因',
      span: 6
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.createObjFromSchema(schema)
      obj.userInfo = []
      obj.userId = ''
      let obj1 = this.createObjFromSchema(schema1)
      obj1.sellerInfo = []
      obj1.seller = ''
      return {
        schema,
        schema1,
        obj: obj,
        obj1: obj1,
        submitLoading: false,
        isCodeExist: false,
        dialogVisible: false,
        i: '',
        n: '',
        api: api,
        // payForm: {
        //   payPrice: ''
        // },
        tableData: [],
        objIds: this.$route.params.ids,
        rules: {
          userInfo: [
            {required: true, message: '请选择购买人', trigger: 'change', type: 'array'}
          ]
        },
        rules1: {
          sellerInfo: [
            {required: true, message: '请选择销售人', trigger: 'change', type: 'array'}
          ],
          saleReason: [
            {required: true, message: '请填写销售原因', trigger: 'blur'},
            { min: 2, max: 100, message: '长度为2-100位字符', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      if (this.$route.params.ids) {
        api.getByIds(this.objIds).then(result => {
          let data = result.data
          for (let i = 0; i < data.length; i++) {
            let num = data[i].obj.amount
            data[i].obj.singleSalePriceNew = data[i].obj.singleSalePrice
            data[i].GoodsInfo = []
            for (let k = 0; k < num; k++) {
              data[i].GoodsInfo.push({
                code: '',
                patientId: '',
                patientInfo: [],
                isBuyer: ''
              })
            }
          }
          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].images) {
              result.data[i].dataMap.imagesArr = result.data[i].dataMap.productImages.split('#')
              result.data[i].dataMap.mainimages = result.data[i].dataMap.productImages.split('#')[0]
              this.$forceUpdate()
            }
          }
          this.tableData = data
          this.$forceUpdate()
        })
      }
    },
    methods: {
      toCart () {
        this.$router.push('/card/mallcarts')
      },
      judgePrice (salePrice, origPrice) {
        if (salePrice < 0 || salePrice > origPrice) {
          this.$message({
            type: 'warning',
            message: '实付单价请输入0～' + origPrice
          })
          return false
        }
      },
      validCode (type, code, i, n) {
        let params = {
          code: code
        }
        if (type === 1) {
          card.checkCodeExist(params).then(result => {
            if (result.data) {
              this.$message({
                type: 'error',
                message: '该卡号已存在'
              })
              this.isCodeExist = true
              return false
            } else {
              this.isCodeExist = false
            }
          })
        } else if (type === 2) {
          gift.checkCodeExist(params).then(result => {
            if (result.data) {
              this.$message({
                type: 'error',
                message: '该卡号已存在'
              })
              return false
            }
          })
        }
      },
      prevPage () {
        window.history.go(-1)
      },
      submitForm () {
        let flag = false
        let flag1 = false
        let flag2 = false
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            flag = true
          }
        })
        this.$refs.form1.$refs.form.validate(valid => {
          if (valid) {
            flag1 = true
          }
        })
        if (this.$refs.bindUserForm) {
          this.$refs.bindUserForm.map(item => {
            item.validate(valid => {
              if (valid) {
                flag2 = true
              }
            })
          })
        } else {
          flag2 = true
        }
        if (flag2 && flag1 && flag) {
          let orderItems = []
          for (let i = 0; i < this.tableData.length; i++) {
            let item = this.tableData[i]
            let GoodsInfo = []
            let goodsItem = {goodsInfos: []}
            goodsItem.productId = item.dataMap.productId
            goodsItem.productSkuId = item.obj.productSkuId
            goodsItem.singleOrigPrice = item.obj.singleSalePrice
            goodsItem.totalPrice = item.obj.singleSalePrice * item.obj.amount
            goodsItem.payPrice = this.total.payPrice
            goodsItem.amount = item.obj.amount
            goodsItem.singleSalePrice = item.obj.singleSalePriceNew
            if (Number(item.dataMap.status) === 0 || item.dataMap.restStockNum === 0) {
              this.dialogVisible = true
            }
            if (item.obj.singleSalePriceNew === '') {
              this.$message({
                type: 'warning',
                message: '请确保每条商品都有实付单价'
              })
              return false
            }
            item.GoodsInfo.map(li => {
              let lis = {infoMap: {}}
              if (li.patientInfo.length > 0) {
                // lis.patientInfo = li.patientInfo
                lis.infoMap.patientName = li.patientInfo[0].userName
                lis.infoMap.patientId = li.patientInfo[0].userId
              } else {
                // lis.patientInfo = this.obj.userInfo
                lis.infoMap.patientId = ''
                lis.infoMap.patientName = ''
              }
              lis.infoMap.code = li.code
              // if (li.isBuyer) {
              lis.infoMap.type = item.dataMap.productType
              lis.infoMap.thirdId = item.dataMap.productThirdId
              // }
              GoodsInfo.push(lis)
            })
            goodsItem.goodsInfos = GoodsInfo
            orderItems.push(goodsItem)
          }
          if (this.isCodeExist) {
            this.$message({
              type: 'warning',
              message: '有卡券编号已存在，请重新输入'
            })
            return false
          }
          let sellerArr = []
          this.obj1.sellerInfo.map(item => {
            sellerArr.push({id: item.id, name: item.userName})
          })
          this.submitLoading = true
          let params = {
            userId: this.obj.userInfo[0].userId,
            seller: JSON.stringify(sellerArr),
            saleReason: this.obj1.saleReason,
            totalPrice: this.total.price,
            payPrice: this.total.payPrice,
            orderItems: orderItems
          }
          api.createOrder(params).then(result => {
            this.submitLoading = false
            if (result && result.data && result.data.id) {
              this.$router.push('/card/orderdetails/' + result.data.id)
            } else if (result.head.errCode === 2078) {
              this.dialogVisible = true
            }
          })
        }
      },
      handleChangeBuyer (i, n, val) {
        if (!this.obj.userInfo.length) {
          this.$message({
            message: '请先选择购买人',
            type: 'warning'
          })
          return false
        } else {
          if (val) {
            this.tableData[i].GoodsInfo[n].patientId = this.obj.userId
            this.tableData[i].GoodsInfo[n].patientInfo = this.obj.userInfo
          } else {
            this.tableData[i].GoodsInfo[n].patientId = ''
            this.tableData[i].GoodsInfo[n].patientInfo = ''
          }
        }
      },
      deleteCardUser (i, n) {
        this.tableData[i].GoodsInfo[n].patientId = ''
        this.tableData[i].GoodsInfo[n].patientInfo = []
      },
      setSelectData (selected) {
        if (selected.data && selected.data.length) {
          let user = []
          selected.data.forEach(item => {
            user.push({id: item.id, userName: item.name, userId: item.id, status: 0})
          })
          this.obj.userInfo = user
        }
        // this.obj.userId = user.length > 0 ? user[0].id : ''
      },
      setSelectSellData (selected) {
        if (selected.data && selected.data.length) {
          let seller = []
          selected.data.forEach(item => {
            seller.push({id: item.id, userName: item.name, userId: item.id, status: 0})
          })
          this.obj1.sellerInfo = seller
        }
        // this.obj1.seller = seller.length > 0 ? seller[0].id : ''
      },
      setSelectCardData (selected) {
        if (selected.data && selected.data.length) {
          let cardUser = []
          selected.data.forEach(item => {
            cardUser.push({id: item.id, userName: item.name, userId: item.id, status: 0})
          })
          this.tableData[this.i].GoodsInfo[this.n].patientInfo = cardUser
          this.tableData[this.i].GoodsInfo[this.n].patientId = cardUser.length > 0 ? cardUser[0].id : ''
        }
      },
      selectCardUser (i, n, name) {
        this.$refs.selectcarduser.onDialogOpen(name)
        this.i = i
        this.n = n
      },
      selectUserBuyer (name) {
        this.$refs.selectuserbuyer.onDialogOpen(name)
      },
      selectUserSeller (name) {
        this.$refs.selectuserseller.onDialogOpen(name, this.obj1.sellerInfo)
      }
    },
    components: {
      selectUserPop,
      selectSellerPop,
      selectCardUser
    },
    watch: {
      'obj.userInfo': function (val) {
        this.tableData.map((item, i) => {
          item.GoodsInfo.map((info, j) => {
            if (info.isBuyer) {
              info.patientInfo = val
            }
          })
        })
      }
    },
    computed: {
      total () {
        let count = 0
        let price = 0
        let payPrice = 0
        this.tableData.forEach(item => {
          if (item.obj) {
            count += item.obj.amount
            price += item.obj.singleSalePrice * item.obj.amount
            payPrice += item.obj.singleSalePriceNew * item.obj.amount
          }
        })
        return {count: count, price: price, payPrice: payPrice}
      }
    }
  }
</script>
<style scoped>
#mall .goodsitem .goodsleft h4.title{ line-height: 60px;}
.goodsright{line-height: 60px;}
</style>
