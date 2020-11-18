<template>
  <div class="success-info" v-if="data.flag">
    <div class="info">
      <div class="content">
        <p class="title">{{data.title}}</p>
        <p class="code">采购申请单号：<span @click="$router.push(data.data.id)">{{data.data.code}}</span></p>
        <p>您创建的采购申请，可在对应仓库的业务模块中，查询采购申请详情。</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['data']
  }
</script>

<style lang="less" scoped>
  .success-info {
    position: fixed;
    background: #fff;
    top: 85px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    .info {
      position: relative;
      height: 100%;
      margin: 0 auto;
      .content {
        position: absolute;
        top: 50px;
        left: 50px;
        p {
          margin: 10px 0;
          font-size: 14px;
          color: #333;
        }
        .title {
          font-size: 18px;
          color: #018001;
        }
        .code {
          font-size: 18px;
          font-weight: bold;
          span {
            font-size: 14px;
            color: blue;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
