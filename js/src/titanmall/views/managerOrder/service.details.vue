<template>
  <div class="service-details-container">
    <div class="region">
      <div class="topTitle">
        <span>订单详情</span>
      </div>
      <el-row class="details-row">
        <el-col :span="6">
          <span class="span-color">订单编号</span>
          {{ order.orderCode || '--' }}
        </el-col>
        <el-col :span="5">
          <span class="span-color">下单时间</span>
          {{ order.orderTime || '--' }}
        </el-col>
        <el-col :span="5">
          <span class="span-color">支付时间</span>
          {{ order.payTime || '--' }}
        </el-col>
        <el-col :span="4">
          <span class="span-color">支付方式</span>
          {{ order.payTypeTxt || '--' }}
        </el-col>
      </el-row>
      <el-row class="details-row">
        <el-col>
          <span class="span-color">订单备注</span>
          {{ order.remark || '--' }}
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column
          prop="goodsName"
          label="商品"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="specification"
          label="规格"
          width="200px"
        ></el-table-column>
        <el-table-column label="单价" width="90px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="90px"
        ></el-table-column>
        <el-table-column label="商品总价" width="90px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column label="优惠" width="90px">
          <template slot-scope="scope">
            <span
              v-if="scope.row.totalPreferentialAmount"
            >- ￥{{ scope.row.totalPreferentialAmount }}</span
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="订单总价" width="90px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.totalOrderAmount }}
          </template>
        </el-table-column>
        <el-table-column label="实付款" width="90px">
          <template slot-scope="scope">
            <span>￥</span>
            {{ scope.row.realPayAmount }}
          </template>
        </el-table-column>
        <el-table-column label="服务码状态" width="220px">
          <template slot-scope="scope">
            <p v-for="(item, indexs) in scope.row.serviceVO" :key="indexs">
              服务码{{ ++indexs }} -- {{ item.serviceStatus }}

              <el-tooltip
                v-if="item.validationRemark"
                class="item"
                effect="dark"
                :content="item.validationRemark"
                placement="top-start"
              >
                <i class="el-icon-chat-dot-round" style="color: #1c7bef"></i>
              </el-tooltip>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatusTxt" label="订单状态" width="120px">
        </el-table-column>
      </el-table>
    </div>
    <div class="region" v-if="outTableData.length">
      <div class="topTitle">
        <span>退款信息</span>
      </div>
      <div
        class="details-info bg-color"
        v-for="(item, i) in outTableData"
        :key="i"
      >
        <el-row class="details-row">
          <el-col :span="6">
            <span class="span-color">退款编号</span>
            {{ item.refundCode }}
          </el-col>
          <el-col :span="4">
            <span class="span-color">申请时间</span>
            {{ item.applyTime }}
          </el-col>
        </el-row>
        <el-row class="details-row">
          <el-col>
            <span class="span-color">退款原因</span>
            {{ item.refundReason }}
          </el-col>
        </el-row>
        <el-row class="details-row">
          <el-col>
            <span class="span-color">退款说明</span>
            {{ item.refundDescription || '--' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span
              v-for="(t, index) in item.newImg"
              :key="index"
              style="margin-right: 10px"
            >
              <el-image
                style="width: 100px; height: 160px"
                :src="item.newImg[index]"
                :preview-src-list="item.newImg"
              >
              </el-image>
            </span>
          </el-col>
        </el-row>
        <el-table :data="item.arr" style="width: 100%" border>
          <el-table-column
            prop="goodsName"
            label="商品"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="specification"
            label="规格"
            width="200px"
          ></el-table-column>
          <el-table-column label="单价" width="120px">
            <template slot-scope="scope">
              <span>￥</span>
              {{ scope.row.unitPrice }}
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            width="90px"
          ></el-table-column>
          <el-table-column label="商品总价" width="120px">
            <template slot-scope="scope">
              <span>￥</span>
              {{ scope.row.totalAmount }}
            </template>
          </el-table-column>
          <el-table-column label="退款金额" width="120px">
            <template slot-scope="scope">
              <span>￥</span>
              {{ scope.row.applyAmount }}
            </template>
          </el-table-column>
          <el-table-column
            prop="applyStatusTxt"
            label="退款状态"
            width="120px"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './api'

  export default {
    props: [ 'id' ],
    data () {
      return {
        api,
        tableData: [],
        outTableData: [],
        order: {},
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      this.orderView()
    },
    methods: {
      orderView () {
        this.api.orderView(this.id).then(res => {
          if (res) {
            this.order = res.order
            res.orderDetails.forEach(item => {
              item.realPayAmount = this.$_narrowPrice(
                res.order.realPayAmount,
                100,
              )
              item.totalOrderAmount = this.$_narrowPrice(
                res.order.totalOrderAmount,
                100,
              )
              item.totalAmount = this.$_narrowPrice(item.totalAmount, 100)
              item.unitPrice = this.$_narrowPrice(item.unitPrice, 100)
              item.orderStatusTxt = res.order.orderStatusTxt
              // 优惠
              item.totalPreferentialAmount = this.$_narrowPrice(
                res.order.totalPreferentialAmount,
                100,
              )
            })
            this.tableData = res.orderDetails
            res.refundOrders.forEach(items => {
              if (items.picture && items.picture.length) {
                let urls = []
                items.picture.forEach(item => {
                  let url
                  if (item.includes('http')) {
                    url = item
                  } else {
                    url = this.imgCdn + item
                  }
                  urls.push(url)
                })
                items.newImg = [ ...urls ]
              }
              items.unitPrice = this.$_narrowPrice(items.unitPrice, 100)
              items.totalAmount = this.$_narrowPrice(items.totalAmount, 100)
              items.applyAmount = this.$_narrowPrice(items.applyAmount, 100)
              let arr = [ { ...items } ]
              items.arr = arr
            })
            this.outTableData = res.refundOrders
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .service-details-container {
    .details-info {
      padding: 20px;
    }

    .details-row {
      margin-bottom: 10px;
    }
  }
</style>
