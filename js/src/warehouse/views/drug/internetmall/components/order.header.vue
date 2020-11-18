/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 21:49:48
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-11 08:48:22
 */

<template>
  <!-- 订单头信息 -->
  <div class="flex">
    <!-- 第一行 姓名 + 店铺名 -->
    <el-row class="f18 f_bold list" v-if="headObj.patientName || headObj.name">
      <el-col :span="12">
        {{headObj.patientName || headObj.name}}
        <!-- 互联网商城 异常时，展示退款中 -->
        <template v-if="headObj.identification == 1 && source == 1">
          <span class="cRed pl30">退款中</span>
        </template>
        <template v-else>
          <span class="cGreen pl30" v-if="headObj.status == 2 && source == 1">待邮寄</span>
          <span class="cGreen pl30" v-if="headObj.status == 3">发货完成</span>
          <span class="cGreen pl30" v-if="headObj.status == 10">退货完成</span>
          <span class="cRed pl30" v-if="headObj.isRefund">退款中</span>
          <!-- 待定 互联网商城才展示 已取消状态 -->
          <span class="cRed pl30" v-if="headObj.status == 5 && source == 1">已取消</span>
        </template>
      </el-col>
      <!-- todo -->
      <el-col :span="12" align="right">
        {{headObj.mallName || headObj.orderSourceName}}
      </el-col>
    </el-row>
    <!-- 第二行 订单信息 => type == 1 -->
    <el-row class="f14 list" v-if="isShow(1) && (headObj.sourceCode || headObj.orderCode)">
      <el-col :span="6">
        <span class="cGray">订单编号：</span>
        <span>{{headObj.sourceCode || headObj.orderCode || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="6">
        <span class="cGray">下单时间：</span>
        <span>{{headObj.createTime || headObj.orderTime || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="6" v-if="source == 1">
        <span class="cGray">发货时间：</span>
        <span>{{headObj.createTime || headObj.orderTime || headObj.finishTime || tableDefaultCellValue}}</span>
      </el-col>
    </el-row>
    <!-- 退货信息 => type == 2 -->
    <el-row class="f14 list" v-if="isShow(2)">
      <el-col :span="8">
        <span class="cGray">退货单号：</span>
        <span>{{headObj.code || headObj.taskCode || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="8">
        <span class="cGray">退货时间：</span>
        <span>{{headObj.finishTime || headObj.createTime || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="8">
        <span class="cGray">订单编号：</span>
        <span>{{headObj.sourceCode || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="8">
        <span class="cGray">下单时间：</span>
        <span>{{headObj.orderTime || headObj.createTime || tableDefaultCellValue}}</span>
      </el-col>
    </el-row>
    <!-- 第三行 收货信息 -->
    <el-row class="f14 list" v-if="isShow(3)">
      <el-col :span="6">
        <span class="cGray">收货人：</span>
        <span>{{headObj.consignee || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="6">
        <span class="cGray">电话：</span>
        <span>{{headObj.phone || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="12">
        <span class="cGray">收货地址：</span>
        <ever-address v-model="headObj.address" :level="2" :convertToFnt="true"></ever-address>
      </el-col>
    </el-row>
    <!-- 第四行 发货信息 -->
    <el-row class="f14 list" v-if="isShow(4) && headObj.sendTime">
      <el-col :span="6">
        <span class="cGray">发货时间：</span>
        <span>{{headObj.sendTime || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="6">
        <span class="cGray">物流公司：</span>
        <span>{{headObj.logisticsName || tableDefaultCellValue}}</span>
      </el-col>
      <el-col :span="12">
        <span class="cGray">物流单号：</span>
        <span>{{headObj.logisticsCode || tableDefaultCellValue}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
export default {
  props: {
    source: { // 来源：1：第三方对接平台-订单数据 - 互联网商城 （不传入代表库房流程）2:超市收银
      type: [Number, String]
    },
    headObj: { // 具体展示内容对象
      type: Object,
      default: () => ({})
    },
    types: { // 定义当前页面是退货还是发货 => 1： 发货  2： 退货 3：收货 4：发货
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableDefaultCellValue
    }
  },
  methods: {
    isShow (type) {
      return this.types.includes(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.list /deep/ .el-col {
  line-height: 30px;
}
</style>
