<template>
  <div>
    <div class="logistics">
      <div class="log-item">
        <span>发药方式：</span>
        <span v-show="list.dispensingWay === 3">院外第三方发药</span>
        <span v-show="list.dispensingWay !== 3">院内发药</span>
      </div>
      <div class="log-item">
        <span>配送方式：</span>
        <template  v-if="list.dispensingWay === 3">
          <span v-if="list.recipelRoamOrderInfo">{{deliveryMethods[list.recipelRoamOrderInfo.deliveryMethod]}}</span>
          <span v-if="!list.recipelRoamOrderInfo">--</span>
        </template>
        <template  v-if="list.dispensingWay !== 3">
          <span>邮寄</span>
        </template>
      </div>
      <div class="log-item">
        <span>支付方式：</span>
        <template v-if="list.dispensingWay === 3">
          <span v-if="list.recipelRoamOrderInfo">{{payTypes[list.recipelRoamOrderInfo.payType]}}</span>
          <span v-if="!list.recipelRoamOrderInfo">--</span>
        </template>
        <template v-if="list.dispensingWay !== 3">
          <span>在线支付</span>
        </template>
      </div>
      <div  class="log-item"  v-show="list.dispensingWay === 3" >
        <span>供应商：</span>
        <span>{{list.adviceJson.recipelRoamSupplierName}}</span>
      </div>
      <div class="log-item" v-if="list.dispensingWay === 3">
        <span>医嘱订单状态：</span>
        <span  v-if="list.recipelRoamOrderInfo">{{executeStatus[list.recipelRoamOrderInfo.executeStatus]}}</span>
        <span  v-if="!list.recipelRoamOrderInfo">待确认</span>
      </div>
      <el-button class="log-btn" @click="showAddress(list.recipeId)">
        查看物流
      </el-button>
    </div>
    <div class="tipSee">
      <span class="label-info">开立时间：</span>
      <span class="value-info">{{list.createTime || '--'}}</span>
      <span class="label-info">支付时间：</span>
      <span class="value-info">{{list.payTime}}</span>
      <span class="label-info">处方号：</span>
      <span class="value-info">{{list.recipeCode || '--'}}</span>
      <el-button
          v-if="list.serviceType !== '800' && list.serviceType !== '801'"
          class="tip-btn"
          @click="seeClick(list.recipeId)"
      >
        查看电子处方
      </el-button>
    </div>
  </div>

</template>
<script>
import api from '@/titancare/api/orderdetail/index.js'

export default {
  props: ['list', 'info'],
  data () {
    return {
      deliveryMethods: {0: '邮寄', 1: '自提'},
      payTypes: {0: '在线支付', 1: '货到付款'},
      executeStatus: { 100: '待确认', 101: '已确认', 102: '待支付', 202: '待发货', 203: '无法发货', 300: '待签收', 301: '拒绝签收', 1000: '已完成', 900: '已完成' },
      api,
      status: {
        0: '待审核',
        1: '审核驳回',
        2: '审核通过'
      }
    }
  },
  methods: {
    showAddress (recipeId) {
      this.$router.push({
        path: '/titancare/operation/orderaddress',
        query: {
          recipeId: recipeId,
          visitNumber: this.info.visitNumber,
          settlementId: this.info.settlementId,
          orgId: this.info.orgId,
          dispensingWay: this.list.dispensingWay,
          recipelRoamSupplierCode: this.list.recipelRoamSupplierCode,
          recipelRoamOrderNum: this.list.recipelRoamOrderInfo ? this.list.recipelRoamOrderInfo.recipelRoamOrderNum : '',
          deliveryMethod: this.list.recipelRoamOrderInfo ? (this.list.recipelRoamOrderInfo.deliveryMethod + '') : ''
        }
      })
    },
    seeClick (id) {
      api.getElectronicRecipe({ 'recipeIds': [id] }).then(res => {
        try {
          if (res && res.length) {
            const obj = res[0]
            let url = ''
            if (obj.auditFileIds && obj.auditFileIds.length) {
              url = obj.auditFileIds[0]
            } else if (obj.fileIds && obj.fileIds.length) {
              url = obj.fileIds[0]
            }
            window.open(this.$ever.fileUrl2 + url)
          } else {
            this.$message.warning('暂无电子处方')
          }
        } catch (e) {
          this.$message.warning('暂无电子处方')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .logistics{
    margin-top: 20px;
    padding: 20px;
    background-color: #f0f5fa;
    color: #333;
    font-size: 14px;
    .log-item{
      display: inline-block;
      margin-right: 20px;
    }
    .log-btn{
      height: 24px;
      line-height: 3px;
      font-size: 12px;
      color: blue;
      background: #fff;
      border: 1px solid blue;
      border-radius: 2px;
      margin-top: 3px;
    }
  }
.tipSee {
  margin-top: 20px;
  font-size: 14px;
  line-height: 14px;
  .label-info {
    color: #999;
  }
  .value-info {
    color: #333;
    margin-right: 20px;
  }
  .tip-btn {
    height: 24px;
    line-height: 3px;
    font-size: 12px;
    color: #1c7bef;
    background: #fff;
    border: 1px solid #1c7bef;
    border-radius: 2px;
    margin-top: 3px;
  }
}
</style>
