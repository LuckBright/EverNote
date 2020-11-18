<template>
  <div class="loading-container" v-if="loading">
    <div class="loading">
      <div class="content">
        <img :src="loadingGif">
        <slot name="title">
          <h2>补货计划系统生成中</h2>
        </slot>
        <!-- <p class="time">请耐心等待......{{loadingTime}}秒</p> -->
        <p class="time">请耐心等待......</p>
        <div class="tips" v-if="$slots.default && $slots.default.length">
          <p class="title">温馨提示：</p>
          <slot>
            <p>针对库存已预警的物资尽快创建采购申请；</p>
            <p>定期进行日常补货采购计划，确保物资数量稳定在安全库存区间内。</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['loading'],
    data () {
      return {
        loadingGif: 'static/assets/Loading-120.gif',
        loadingInter: null,
        loadingTime: 1
      }
    },
    mounted () {
      // this.startInterval()
    },
    methods: {
      startInterval () {
        clearInterval(this.loadingInter)
        this.loadingInter = setInterval(() => {
          if (this.loading) {
            this.loadingTime++
          } else {
            clearInterval(this.loadingInter)
          }
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  .loading-container {
    position: fixed;
    background: #fff;
    top: 85px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    .loading {
      position: relative;
      width: 440px;
      height: 100%;
      margin: 0 auto;
      .content {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        text-align: center;
        p {
          margin: 0;
        }
        img {
          width: 120px;
          height: 120px;
          border-radius: 60px;
        }
        h2 {
          margin: 20px 0 10px;
          font-size: 18px;
          color: #333;
          text-align: center;
          font-weight: bold;
        }
        .time {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin-bottom: 60px;
        }
        .tips {
          p {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin: 5px 0;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
