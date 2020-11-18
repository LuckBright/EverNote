<template>
  <div>
    <div class="dispensing_print_header">
      <div class="left">
        <img :src="qrcodeUrl">
        <qrcode id="canvasId" :value="headerData.qrcodeStr"></qrcode>
        <div class="title">
          <p>妇产科一病区</p>
          <p>摆药单号：{{headerData.num}}</p>
        </div>
      </div>
      <div class="center"><h1>{{headerData.printTitle}}</h1></div>
      <div class="right">
        <p>第 1 / 1 页</p>
        <p>打印时间：{{headerData.printDate}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['headerData'],
    data () {
      return {
        qrcodeUrl: ''
      }
    },
    watch: {
      headerData: {
        handler (val) {
          this.$nextTick(() => {
            this.qrcodeUrl = document.querySelector('#canvasId').toDataURL()
          })
          // setTimeout(() => {
          //   this.qrcodeUrl = document.querySelector('#canvasId').toDataURL()
          // }, 0)
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dispensing_print_header {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    > div {
      height: 60px;
    }
    p {
      margin: 0;
    }
    .left {
      display: flex;
      img {
        height: 100%;
      }
      canvas {
        position: absolute;
        z-index: -1;
      }
      .title {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          margin-left: 10px;
        }
      }
    }
    .center {
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
    }
  }
</style>
