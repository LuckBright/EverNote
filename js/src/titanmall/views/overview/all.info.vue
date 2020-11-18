<template>
  <div class="layout_inner">
    <div class="region info" v-if="accountShow || priceShow || addressShow">
      <p>
        <b class="title-tip">消息通知</b>
      </p>
      <p class="top-info" v-if="accountShow">
        <el-button
          class="btn"
          @click="
            () => {
              $router.push('/titanmall/setting/pay');
            }
          "
        >去设置
        </el-button
        >
        <span>
          <i class="el-icon-warning"></i>
          恭喜您开通商城，请您及时设置您的收款账户，确保可以正常收取订单钱款。
        </span>
      </p>
      <p class="top-info" v-if="priceShow">
        <el-button
          @click="
            () => {
              $router.push('/titanmall/renew');
            }
          "
        >立即缴费
        </el-button
        >
        <span>
          <i class="el-icon-warning"></i>

          {{
            priceText === 'WAIT_OPEN'
              ? '店铺未支付，无法正常营业， 请您立即缴费'
              : '店铺已暂停服务， 无法正常营业， 请您立即续费。'
          }}
        </span>
      </p>
      <p class="top-info" v-if="addressShow">
        <el-button
          class="btn"
          @click="
            () => {
              $router.push('/titanmall/setting/returngoods');
            }
          "
        >去设置
        </el-button
        >
        <span>
          <i class="el-icon-warning"></i>
          恭喜您开通商城，请您及时设置您的商品退货地址。
        </span>
      </p>
    </div>
    <div class="region info">
      <p>
        <b class="title-tip">今日概况</b>
        <span class="span-color">更新时间 {{ upDateTime }}</span>
      </p>
      <div class="num-info">
        <div class="row-div">
          <div>
            <span class="span-color">支付订单数</span>
            <h1>
              {{ detailsObj.payOrderCount }}
              <img
                v-if="detailsObj.payOrderCount < yesterday.payOrderCount"
                src="../../assets/img/lower.png"
              />
              <img
                v-if="detailsObj.payOrderCount > yesterday.payOrderCount"
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{ yesterday.payOrderCount }}</span>
          </div>
          <div>
            <span class="span-color">支付金额（元）</span>

            <h1>
              {{ detailsObj.payAmount }}
              <img
                v-if="detailsObj.payAmount < yesterday.payAmount"
                src="../../assets/img/lower.png"
              />
              <img
                v-if="detailsObj.payAmount > yesterday.payAmount"
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{ yesterday.payAmount }}</span>
          </div>
          <div>
            <span class="span-color">客单价（元）</span>
            <h1>
              {{ detailsObj.avgOrderAmount }}
              <img
                v-if="detailsObj.avgOrderAmount < yesterday.avgOrderAmount"
                src="../../assets/img/lower.png"
              />
              <img
                v-if="detailsObj.avgOrderAmount > yesterday.avgOrderAmount"
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{ yesterday.avgOrderAmount }}</span>
          </div>
          <div>
            <span class="span-color">支付转化率</span>
            <h1>
              {{ detailsObj.payConvertRatio + '%' }}
              <img
                v-if="detailsObj.payConvertRatio < yesterday.payConvertRatio"
                src="../../assets/img/lower.png"
              />
              <img
                v-if="detailsObj.payConvertRatio > yesterday.payConvertRatio"
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{
              yesterday.payConvertRatio + '%'
            }}</span>
          </div>
        </div>
        <div class="row-div">
          <div>
            <span class="span-color">浏览量</span>
            <h1>
              {{ detailsObj.todayPageView }}
              <img
                v-if="detailsObj.todayPageView < detailsObj.yesterdayPageView"
                src="../../assets/img/lower.png"
              />
              <img
                v-if="detailsObj.todayPageView > detailsObj.yesterdayPageView"
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{ detailsObj.yesterdayPageView }}</span>
          </div>
          <div>
            <span class="span-color">累计客户数</span>
            <h1>
              {{ detailsObj.totalUserVisit }}
            </h1>
          </div>
          <div>
            <span class="span-color">新增客户数</span>
            <h1>
              {{ detailsObj.todayNewUserNum }}
              <img
                v-if="
                  detailsObj.todayNewUserNum < detailsObj.yesterdayNewUserNum
                "
                src="../../assets/img/lower.png"
              />
              <img
                v-if="
                  detailsObj.todayNewUserNum > detailsObj.yesterdayNewUserNum
                "
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{ detailsObj.yesterdayNewUserNum }}</span>
          </div>
          <div>
            <span class="span-color">商品访客数</span>
            <h1>
              {{ detailsObj.todaySpuUserView }}
              <img
                v-if="
                  detailsObj.todaySpuUserView < detailsObj.yesterdaySpuUserView
                "
                src="../../assets/img/lower.png"
              />
              <img
                v-if="
                  detailsObj.todaySpuUserView > detailsObj.yesterdaySpuUserView
                "
                src="../../assets/img/up.png"
              />
            </h1>
            <span class="span-color">昨日 </span>
            <span class="span-color">{{
              detailsObj.yesterdaySpuUserView
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './api'

  export default {
    data () {
      return {
        api,
        detailsObj: {
          todayNewUserNum: '',
          todayPageView: '',
          todaySpuUserView: '',
          totalUserVisit: '',
          yesterdayNewUserNum: '',
          yesterdayPageView: '',
          yesterdaySpuUserView: '',
          avgOrderAmount: '',
          payAmount: '',
          payConvertRatio: '',
          payOrderCount: '',
        },
        yesterday: {
          avgOrderAmount: '',
          payAmount: '',
          payConvertRatio: '',
          payOrderCount: '',
        },
        upDateTime: '',
        addressShow: false,
        accountShow: false,
        priceShow: false,
        priceText: '',
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        this.api.statsPerDayDetails().then(res => {
          if (res) {
            this.detailsObj = { ...this.detailsObj, ...res }
          }
        })
        this.api.orderStatsPerDay().then(res => {
          if (res) {
            let today = res.today
            if (today.payAmount === 0 || today.payOrderCount === 0) {
              today.avgOrderAmount = 0
            } else {
              today.avgOrderAmount = (
                today.payAmount /
                today.payOrderCount /
                100
              ).toFixed(2)
            }
            let yesterDay = res.yesterday
            if (yesterDay.payAmount === 0 || yesterDay.payOrderCount === 0) {
              yesterDay.avgOrderAmount = 0
            } else {
              yesterDay.avgOrderAmount = (
                yesterDay.payAmount /
                yesterDay.payOrderCount /
                100
              ).toFixed(2)
            }
            yesterDay.payAmount = this.$_narrowPrice(yesterDay.payAmount, 100)
            today.payAmount = this.$_narrowPrice(today.payAmount, 100)

            this.detailsObj = { ...this.detailsObj, ...today }

            this.yesterday = { ...this.yesterday, ...yesterDay }
          }
        })
        this.api.getCurrServerDateTime().then(res => {
          if (res) {
            this.upDateTime = res.date + ' ' + res.time
          }
        })
        this.api.getReturnAddress().then(res => {
          if (res) {
            this.addressShow = !res.address
          }
        })
        this.api.payConfigInfo().then(res => {
          if (res) {
            this.accountShow =
              !(res.wxPaySwitch === 1 || res.aliPaySwitch === 1)
          }
        })
        this.api.shopDetail().then(res => {
          if (res) {
            this.priceShow =
              !!(res.shopStatus === 'WAIT_OPEN' || res.shopStatus === 'EXPIRED')
            this.priceText = res.shopStatus
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .info {
    .title-tip {
      font-size: 16px;
      margin-right: 16px;
    }

    .num-info {
      display: flex;
      flex-direction: column;

      .row-div {
        margin: 30px 0 10px 80px;
        display: flex;

        & > div {
          flex-grow: 1;
          width: 25%;

          h1 {
            margin: 0;
          }
        }

        .upBg {
          color: red;
        }

        .xBg {
          color: green;
        }
      }
    }

    .top-info {
      height: 54px;
      line-height: 54px;
      border: 1px solid #b3d8ff;
      border-radius: 2px;
      background: #ecf5ff;
      padding-left: 20px;
      margin: 15px 0;

      span {
        margin-left: 30px;

        i {
          color: #1c7bef;
          display: inline-block;
          margin-right: 10px;
        }
      }

      .btn {
        width: 98px;
      }
    }
  }
</style>
