<template>
  <el-dialog
    title="售后申请"
    :visible.sync="dialogFlag"
    class="ui_dialog_02 spe order_return"
    :before-close="close">
    <div style="height:300px;text-align: center;font-size: 20px">
      <el-row>
         <el-col :span="6" align="left" class="top">{{curOrderObj.createTime}}</el-col>
         <el-col :span="8" align="left" class="top">订单号： <span>{{curOrderObj.sn}}</span></el-col>
      </el-row>
      <div class="br1">
        <el-row class="goods">
          <el-col :span="6">
            <h4>商品图片</h4>
          </el-col>
          <el-col :span="14">
            <h4>名称</h4>
          </el-col>
          <el-col :span="4">
            <h4>数量</h4>
          </el-col>
        </el-row>
        <el-row class="googsitem">
          <el-col :span="4" v-if="saleObj.product">
            <el-image style="width: 80px; height: 60px;" v-if="saleObj.product.images" :src="`${$ever.fileUrl2}${saleObj.product.images.split('#')[0]}`" :preview-src-list="saleObj.product.images.split('#')"></el-image>
            <el-image style="width: 80px; height: 60px;" v-else src=""></el-image>
          </el-col>
          <el-col :span="16" v-if="saleObj.product">{{saleObj.product.name ? saleObj.product.name : '--'}}</el-col>
          <el-col :span="4">{{saleObj.amount}}</el-col>
        </el-row>
      </div>
      <el-form :model="objForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="服务类型" prop="type" class="c0 checkbox_group">
          <el-checkbox-group v-model="objForm.type">
            <el-checkbox-button :label="2" :key="2">退款</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="申请数量" prop="amount" class="c0 checkbox_group" v-if="saleObj.product && saleObj.product.type != 7">
          <el-checkbox-group v-model="objForm.amount">
            <el-checkbox-button v-for="goods in saleObj.goodsInfos" :label="goods.id" :key="goods.id" :disabled="goods.status != 1">{{goods.sn}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="申请原因" prop="returnReason" class="c0 checkbox_group">
          <el-input v-model="objForm.returnReason" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button @click="submit" :loading="loading" type="primary">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import api from '../store/indexapi'

  export default {
    props: ['curOrderObj'],
    data () {
      return {
        dialogFlag: false,
        loading: false,
        saleObj: {},
        objForm: {
          type: [2],
          amount: [],
          returnReason: ''
        },
        orderId: '',
        orderItemId: '',
        singleReturnPrice: '',
        returnAmount: '',
        returnPrice: '',
        rules: {
          type: [
            {type: 'array', required: true, message: '必须项', trigger: 'change'}
          ],
          amount: [
            {type: 'array', required: true, message: '必选项', trigger: 'change'}
          ],
          returnReason: [
            { required: true, message: '必填项', trigger: 'change' }
          ]
        }
      }
    },
    beforeCreate () {
      this.api = api
    },
    created () {
    },
    watch: {
    },
    methods: {
      open (orderId, orderItemId) {
        this.objForm = {
          type: [2],
          amount: [],
          returnReason: ''
        }
        this.orderId = orderId
        this.orderItemId = orderItemId
        this.dialogFlag = true
        this.getDetail(orderItemId)
      },
      close () {
        this.$refs.ruleForm.resetFields()
        this.dialogFlag = false
      },
      submit () {
        let amount = ''
        let ids = []
        if (this.saleObj.product.type === 7) {
          amount = this.saleObj.goodsInfos.length
          this.saleObj.goodsInfos.map(item => {
            ids.push(item.id)
          })
        } else {
          amount = this.objForm.amount.length
          ids = this.objForm.amount
        }
        this.returnAmount = this.objForm.amount.length
        this.returnPrice = this.singleReturnPrice * amount
        // this.returnPrice = this.singleReturnPrice * this.returnAmount
        let params = {
          type: 2,
          orderId: this.orderId,
          orderItemId: this.orderItemId,
          singleReturnPrice: this.singleReturnPrice,
          returnAmount: amount,
          returnPrice: this.returnPrice,
          returnReason: this.objForm.returnReason,
          goodsInfoIds: ids
        }
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            api.createReturn(params).then(res => {
              this.loading = false
              if (res.head.errCode === 0) {
                this.dialogFlag = false
                this.$emit('aftersave')
              }
            })
          }
        })
      },
      getDetail (orderItemId) {
        api.getByIdOrderItem(orderItemId).then(res => {
          if (res.head.errCode === 0) {
            this.$forceUpdate()
            this.saleObj = res.data
            this.singleReturnPrice = res.data.singleSalePrice
            this.$forceUpdate()
          }
        })
      }
    }
  }
</script>
<style scoped>
.order_return .top{font-size: 12px;color: #999;margin-bottom: 10px;}
.order_return .top span{color: #000}
.order_return .br1{border: 1px solid #EEEEEE;margin-bottom: 20px;}
.order_return .line34{line-height: 40px;font-size: 14px;}
.order_return .check{}
.order_return .goods h4{margin:0;background: #ebedef;line-height: 50px;font-size: 16px;color: #000;font-weight: bold;padding: 0 20px;}
.order_return .googsitem{padding: 10px 20px;}
.order_return .googsitem .el-col{line-height: 60px;color: #000;font-size: 14px;}
.order_return .googsitem .el-col img{vertical-align: middle;}
.order_return .checkbox_group {line-height: 40px;text-align: left;height: auto;}
.order_return .checkbox_group /deep/ .el-checkbox-button__inner{border-radius: 2px;background: #FFFFFF;border: 1px solid #ddd;color: #000;padding: 5px 15px;}
.order_return .checkbox_group /deep/ .is-checked .el-checkbox-button__inner{border: 1px solid #1C7BEF;color: #1C7BEF;}
.order_return .checkbox_group /deep/ .el-checkbox-button{margin-right: 10px;}
</style>
