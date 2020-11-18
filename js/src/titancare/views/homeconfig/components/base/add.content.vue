<template>
<div class="box">
  <div class="box-header">
    <div class="box-close" @click="sureClose">
      <template v-if="$slots.icon">
        <slot name="icon"></slot>
      </template>
      <template v-else>
        <i class="el-icon-close"></i>
      </template>
    </div>
    <div class="box-title" :class="'box-title-' + titlePosition">
      <span class="title">{{title}}</span>
      <span v-if="subTitle" class="sub-title">{{subTitle}}</span>
    </div>
    <div class="box-options">
      <el-button v-if="showCloseBtn" size="small" @click="sureDel">删除</el-button>
      <el-button v-if="showSureBtn" type="primary" size="small" @click="sureEdit">确定</el-button>
    </div>
  </div>
  <div class="box-content">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'box',
  props: {
    title: String,
    subTitle: String,
    titlePosition: {
      type: String,
      default: 'center'
    },
    showCloseBtn: {
      type: Boolean,
      default: false
    },
    showSureBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    sureEdit () {
      this.$emit('sureEdit')
    },
    sureDel () {
      this.$emit('sureDel')
    },
    sureClose () {
      this.$emit('sureClose')
    },
  }
}
</script>

<style scoped lang="less">
  .box{
    background-color: #f5f5f5;
    min-width: 440px;
    min-height: 500px;
    .box-header{
      height: 48px;
      line-height: 48px;
      position: relative;
      text-align: center;
      border-bottom: 1px solid #CCCCCC;
      .box-title-left{
        text-align: left;
      }
      .box-title{
        padding: 0 60px;
        .title{
          font-size: 18px;
          color: #000000;
          font-weight: 600;
        }
        .sub-title{
          font-size: 14px;
          color: #999999;
          margin-left: 20px;
        }
      }
      .box-options{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
      }
      .box-close{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 20px;
        font-size: 20px;
        cursor: pointer;
        span{
          font-size: 14px;
          color: #333;
          vertical-align: bottom;
        }
      }
    }
    .box-content{
      max-height: 540px;
      overflow: auto;
    }
  }

</style>
