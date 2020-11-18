<template>
  <div class="main">
    <div class="transaction">
      <div class="region">
        <p class="topTitle">订单/交易设置</p>
        <p class="row-p">
          <span class="label-span">待付款订单取消时间</span>
          <span>拍下后未付款订单</span>
          <el-input
            v-model="formObj.orderCancelTime"
            maxlength="4"
            size="small"
            class="input-wd"
            oninput="value=value.replace(/[^\d]/,'')"
            @blur="inputBlur('orderCancelTime')"
          ></el-input>
          <span>分钟内未付款，自动取消订单</span>
        </p>
        <p class="row-p">
          <span class="label-span">发货后自动确认收货时间</span>
          <span>发货后</span>
          <el-input
            v-model="formObj.orderFinishTime"
            size="small"
            class="input-wd"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/,'')"
            @blur="inputBlur('orderFinishTime')"
          ></el-input>
          <span>天，买家自动确认收货</span>
        </p>
        <p class="row-p">
          <span class="label-span">退货自动同意申请时间</span>
          <span>买家发起退货申请后</span>
          <el-input
            v-model="formObj.refundApproveTime"
            size="small"
            class="input-wd"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/,'')"
            @blur="inputBlur('refundApproveTime')"
          ></el-input>
          <span>天，商家自动同意退货申请</span>
        </p>
        <p class="row-p">
          <span class="label-span">退货自动确认收货时间</span>
          <span>买家发货后</span>
          <el-input
            v-model="formObj.refundLogisticsTime"
            size="small"
            class="input-wd"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/,'')"
            @blur="inputBlur('refundLogisticsTime')"
          ></el-input>
          <span>天，商家自动确认收货</span>
        </p>
      </div>
      <div class="region">
        <p class="topTitle">商品设置</p>
        <div class="goods">
          <p class="goods-label">商品页销量</p>
          <div>
            <template>
              <el-radio
                v-model="formObj.showSalesVolume" label="1"
              >展示
              </el-radio
              >
              <el-radio
                v-model="formObj.showSalesVolume" label="0"
              >不展示
              </el-radio
              >
              <span
                class="goods-tip"
              >选择展示后，将根据商品实际销量进行展示，也可选择下方其他销量展示方式。</span
              >
            </template>
          </div>
        </div>
        <div class="goods goods-num" v-if="formObj.showSalesVolume === '1'">
          <p class="goods-label"></p>
          <div>
            <template>
              <p>
                <el-radio v-model="formObj.showNumOrM" label="1">
                  销量达
                  <el-input
                    :disabled="disabled"
                    v-model.trim="formObj.salesVolumeNum"
                    oninput="value=value.replace(/[^\d]/,'')"
                    size="small"
                    class="input-s"
                    style="width: 120px"
                    maxlength="8"
                  >
                    <template slot="append">件</template>
                  </el-input
                  >
                  时显示
                </el-radio>
                <span
                  class="goods-tip mg-bt"
                >选择后，若商品销量达到设定值后将展示销量。如：设定值为30，则销量≥30件后展示该商品销量。</span
                >
              </p>
              <p>
                <el-radio v-model="formObj.showNumOrM" label="2">
                  商品以
                  <el-input
                    :disabled="!disabled"
                    v-model.trim="formObj.salesVolumeMin"
                    oninput="value=value.replace(/[^\d]/,'')"
                    size="small"
                    class="input-s"
                    style="width: 120px"
                    maxlength="8"
                  >
                    <template slot="append">件</template>
                  </el-input
                  >
                  至
                  <el-input
                    :disabled="!disabled"
                    v-model.trim="formObj.salesVolumeMax"
                    oninput="value=value.replace(/[^\d]/,'')"
                    size="small"
                    class="input-s"
                    style="width: 120px"
                    maxlength="8"
                  >
                    <template slot="append">件</template>
                  </el-input
                  >
                  之间的随机基数提升销量
                </el-radio>
                <span
                  class="goods-tip"
                >选择后，以设置数值的随机基数为商品增加销量。如：设定值为100至200件，则商品会以100至200之间的随机数为该商品销量基数，后续购买产生的销量在基数上递增。</span
                >
              </p>
            </template>
          </div>
        </div>
        <!--<div class="goods">
          <p class="goods-label">更多商品推荐</p>
          <div>
            <template>
              <p>
                <el-radio v-model="formObj.recommSpu" label="1">开启</el-radio>
                <el-radio v-model="formObj.recommSpu" label="0">关闭</el-radio>
                <span class="goods-tip mg-bt"
                  >基于用户医疗大数据智能推荐合适的商品</span
                >
              </p>
              <p v-if="formObj.recommSpu === '1'">
                <el-checkbox-group v-model="formObj.showCgy">
                  <el-checkbox label="showZfcgy">支付成功页</el-checkbox>
                  <el-checkbox label="showSpxqy">商品详情页</el-checkbox>
                  <el-checkbox label="showDdxqy">订单详情页</el-checkbox>
                  <el-checkbox label="showWlxqy">物流详情页</el-checkbox>
                </el-checkbox-group>
              </p>
            </template>
          </div>
        </div>-->
      </div>
      <div class="region">
        <p class="topTitle">短信设置</p>
        <div class="z-msg">
          <p>
            <el-checkbox v-model="formObj.sendDeliveryMsg">发货提醒</el-checkbox>
          </p>
          <span class="span-color">勾选对应选项后给买家自动发送短信提醒</span>
        </div>
      </div>
      <div class="region">
        <p class="topTitle">营销设置</p>
        <div class="goods">
          <p class="goods-label">二级分销模式</p>
          <div>
            <template>
              <el-radio
                v-model="formObj.distribution" :label=1
              >开启
              </el-radio
              >
              <el-radio
                v-model="formObj.distribution" :label=0
              >关闭
              </el-radio
              >
              <span
                class="goods-tip"
              >开启后买家可以通过邀请码邀请其他买家并获得分销奖励。</span
              >
            </template>
          </div>
        </div>
      </div>
      <p class="send-btn">
        <el-button
          :disabled="disabledAddBtn"
          class="btn-class"
          type="primary"
          size="small"
          @click="sendBtn"
        >保存信息
        </el-button
        >
      </p>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    data () {
      return {
        formObj: {
          orderCancelTime: '',
          orderFinishTime: '',
          refundApproveTime: '',
          refundLogisticsTime: '',
          showSalesVolume: '0',
          showNumOrM: '1',
          salesVolumeNum: '',
          salesVolumeMax: '',
          salesVolumeMin: '',
          sendDeliveryMsg: false,
          distribution: 0
        },
        // recommSpu: "0",
        // showCgy: []
        disabled: false,
        disabledAddBtn: false,
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      // 输入框失去焦点判断空或0
      inputBlur (val) {
        if (!this.formObj[val] || this.formObj[val] === '0') {
          this.formObj[val] = 1
        }
      },

      // 获取数据信息
      async getInfo () {
        let info = await api.tradeGet()
        if (info) this.formObj = { ...this.formObj, ...info }
        if (this.formObj.showNumOrM === '1') {
          this.formObj.salesVolumeMax = ''
          this.formObj.salesVolumeMin = ''
        }
      },

      // 保存
      sendBtn () {
        if (this.formObj.showSalesVolume === '0') {
          this.formObj.salesVolumeMax = ''
          this.formObj.salesVolumeMin = ''
          this.formObj.salesVolumeNum = ''
        }
        // if (this.formObj.recommSpu === "0") {
        //   this.formObj.showCgy = [];
        // }
        this.disabledAddBtn = true
        api.tradeSave(this.formObj).then(res => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
            })
          }
          setTimeout(() => {
            this.disabledAddBtn = false
          }, 1000)
        })
      },

      checkoutStatus (n) {
        if (n === '2') {
          this.disabled = true
          this.formObj.salesVolumeNum = ''
        } else {
          this.disabled = false
          this.formObj.salesVolumeMax = ''
          this.formObj.salesVolumeMin = ''
        }
      },
    },
    watch: {
      'formObj.showNumOrM': function (n, o) {
        this.checkoutStatus(n)
      },
      'formObj.showSalesVolume': function (n, o) {
        if (n === '0') {
          this.formObj.salesVolumeNum = ''
          this.formObj.salesVolumeMax = ''
          this.formObj.salesVolumeMin = ''
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .transaction {
    padding-bottom: 50px;

    .row-p {
      margin-bottom: 16px;

      .label-span {
        display: inline-block;
        width: 190px;
        color: #999;
        text-align: right;
        margin-right: 10px;
      }

      .input-wd {
        width: 60px;
        margin: 0 10px;

        /deep/ .el-input__inner {
          text-align: center !important;
          padding: 0 10px !important;
        }
      }

      .btn-class {
        margin-left: 320px;
      }
    }

    .goods {
      display: flex;

      .goods-label {
        width: 105px;
        text-align: right;
        margin-right: 10px;
        color: #999;
      }

      .goods-tip {
        display: block;
        color: #999;
        font-size: 14px;
        margin-top: 5px;
      }

      .mg-bt {
        margin-bottom: 15px;
      }
    }

    .goods-num {
      background-color: rgba(0, 0, 0, 0.02);
      padding: 10px 0;
      margin-bottom: 12px;
    }

    .input-s {
      width: 120px;
      margin: 0 5px;
    }

    .send-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      padding-left: 130px;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.23);
      z-index: 1;
    }
    .z-msg {
      padding-left: 25px;
      p {
        margin-bottom: 10px;
      }
    }
  }
</style>
