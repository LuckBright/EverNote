<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="12">
        <span class="title" @click="prevPage">
          <i class="el-icon-arrow-left"></i> 订单详情
        </span>
      </el-col>
      <el-col :span="12" align="right"></el-col>
    </el-row>
    <el-card class="orderdetail">
      <div class="buyinfo">
        <strong>购买人信息</strong>
        <p>
          购买人：
          <span>{{userInfo.name ? userInfo.name : '--'}}</span>
          <span>
            <sys-value type="GBT.2261.1" :code="userInfo.sex"></sys-value>
          </span>
          <span>{{userInfo.mobile}}</span>
          <span>{{userInfo.iden ? userInfo.iden.idNo : '--'}}</span>
        </p>
      </div>
      <div class="buyinfo">
        <strong>销售人信息</strong>
        <p>
          销售人：
          <span v-for="(item, i) in sellerInfo" :key="i">
            <span>{{item.name}}</span>
            <span>{{item.mobile}}</span>
            <span>{{item.jobNumber}}</span>
          </span>
          <span style="margin-left:20px;color:#999;">销售原因：</span>
          <span class="saleReason">{{obj.saleReason}}</span>
        </p>
      </div>
      <div class="buyinfo">
        <strong class="title">商品清单</strong>
        <div v-if="tableData.length">
          <div v-for="(item, i) in tableData" :key="i" class="goodslistcon">
            <el-row class="goodsitem">
              <el-col :span="6" class="goodsleft">
                <a :href="$ever.cardIndex + '/card/malldetails/' + item.product.id">
                  <img v-if="item.product.images" :src="`${$ever.fileUrl2}${item.product.images.split('#')[0]}`">
                  <img v-else :src="item.product.images | fixImgSrc(5)">
                </a>
                <h4 class="title">
                  <a
                    :href="$ever.cardIndex + '/card/malldetails/' + item.product.id"
                  >{{item.product.name}}</a>
                </h4>
              </el-col>
              <el-col :span="6" class="goodsright">
                <span class="count">
                  <em>{{item.amount}}</em>件
                </span>
                <span class="price">
                  ¥
                  <em>{{(item.singleOrigPrice) | formatToFinacial}}</em>
                </span>
              </el-col>
              <el-col :span="6" class="goodsright">
                实付单价
                <span class="price">
                  ¥
                  <em>{{(item.singleSalePrice) | formatToFinacial}}</em>
                </span>
              </el-col>
            </el-row>
            <el-row class="cardnumlist">
              <el-form
                ref="form"
                label-width="80px"
                v-if="item.goodsInfos.length && item.product.type === 1 || item.product.type === 2 || item.product.type === 7"
              >
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="卡券编号" v-if="item.product.type !== 7">{{item.goodsInfos[0].infoMap.code}}</el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item
                      label="绑定人"
                    >{{item.goodsInfos[0].infoMap.patientName ? item.goodsInfos[0].infoMap.patientName : '--'}}</el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-row>
          </div>
          <div class="orderpaydetail">
            <strong>订单信息</strong>
            <el-row>
              <el-col :span="5">
                订单编号
                <span>{{obj.sn}}</span>
              </el-col>
              <el-col :span="4">
                订单状态
                <span>
                  <sys-value type="THC_MALL_ORDER_STATUS" :code="obj.status"></sys-value>
                </span>
              </el-col>
              <el-col :span="6">
                下单时间
                <span>{{obj.createTime}}</span>
              </el-col>
              <el-col :span="5">
                付款时间
                <span>{{obj.payTime ? obj.payTime : '--'}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                商品总额
                <span>¥{{(obj.totalPrice) | formatToFinacial}}</span>
              </el-col>
              <el-col :span="6">
                减免金额
                <span>¥{{(obj.totalPrice - obj.payPrice) | formatToFinacial}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <p>
                  实付总额：
                  <span class="col97">¥{{(obj.payPrice) | formatToFinacial}}</span>
                </p>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="payBtn">
        <!-- <el-button type="primary" class="el-button">扫码支付</el-button> -->
        <el-button
          class="el-button"
          @click="cancleOrder($route.params.id)"
          v-if="obj.status === 0"
        >关闭订单</el-button>
        <print-btn code="THC_MALL_ORDER" key="THC_MALL_ORDER" lang="01" :params="paramsPrint">打印订单</print-btn>
      </div>
    </el-card>
  </div>
</template>
<script>
import api from '../store/orderapi'
import userbaseapi from '../../workspace/store/userbaseapi'
import { getStaffSettingInfoByStaffId } from '@/inpatient/components/doctor.state/api'
import PrintBtn from '@/print/components/printbtn'

export default {
  data () {
    return {
      obj: {},
      api: api,
      tableData: [],
      userInfo: {},
      sellerInfo: {},
      objId: this.$route.params.id,
      rules: {},
      paramsPrint: {
        patientId: '',
        id: this.$route.params.id
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.init()
    }
  },
  methods: {
    init () {
      api.getById(this.$route.params.id).then(result => {
        let data = result.data
        result.data.seller = JSON.parse(result.data.seller)
        this.obj = data
        this.paramsPrint.patientId = data.userId
        data.orderItems.map(item => {
          let goods = item.goodsInfos
          goods.map(n => {
            let bindUser = n.infoMap.patientId
            if (bindUser) {
              userbaseapi.getBaseInfoById(bindUser).then(res => {
                n.infoMap.patientName = res.data.name
              })
            }
          })
        })
        this.tableData = data.orderItems
        userbaseapi.getBaseInfoById(this.obj.userId).then(res => {
          if (res.data.mobile) {
            res.data.mobile = res.data.mobile.substring(0, 3) + '****' + res.data.mobile.substring(7)
          }
          if (res.data.iden) {
            res.data.iden = res.data.iden.idNo.substring(0, 6) + '********' + res.data.iden.idNo.substring(14)
          }
          this.userInfo = res.data
        })
        let sellerInfo = []
        this.obj.seller.map(item => {
          getStaffSettingInfoByStaffId({idList: [item.id]}).then(response => {
            if (response && response.length) {
              if (response[0].mobile) {
                response[0].mobile = response[0].mobile.substring(0, 3) + '****' + response[0].mobile.substring(7)
              }
              sellerInfo.push(response[0])
            }
          })
          this.sellerInfo = sellerInfo
        })
      })
    },
    cancleOrder (id) {
      this.$confirm('您确定要取消订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.cancel(id).then(result => {
          this.init()
        })
      }).catch(() => {
        return false
      })
    },
    prevPage () {
      window.history.go(-1)
    },
    goPay () {
      api.pay(this.objId).then(res => {
        console.log(res, '11111')
      })
    }
  },
  components: {
    PrintBtn
  }
}
</script>
<style scoped>
#mall .goodsitem .goodsleft h4.title {
  line-height: 60px;
}
.goodsright {
  line-height: 60px;
}
#mall .el-form-item {
  margin-bottom: 0;
}
.saleReason {
  display: -moz-inline-box;
  display: inline-block;
  width: 600px;
}
</style>
