<template>
  <div :class="{'menu-box': true, 'portrait': moduleData.styleType === '2' }">
    <template v-for="(item, index) in moduleData.moduleArr">
      <div :class="{'menu-item': true}" :key="index" v-show="isShowIcon(index)">
        <div class="imgbox">
          <img :src="$ever.fileUrl2 + item.img" alt="">
        </div>
        <div class="title-box">
          <div class="title-text">{{item.title}}</div>
          <div v-if="moduleData.styleType === '2'" class="title-desc">{{item.desc}}</div>
        </div>
      </div>
    </template>
    <div v-if="moduleData.styleType === '1'" class="menu-item"  v-show="moduleData.moduleArr.length > 5" @click="sureShowMore">
      <div class="imgbox">
        <img src="../../../assets/img/morenav.png" alt="">
      </div>
      <div class="title-box">
        <span v-show="!showMore">更多</span>
        <span v-show="showMore">收起</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'moduleData' ],
  data () {
    return {
      showMore: false,
    }
  },
  methods: {
    isShowIcon (index) {
      if (this.moduleData.styleType === '2') {
        return true
      }
      if (this.moduleData.moduleArr.length <= 5) {
        return true
      }
      if (this.moduleData.moduleArr.length > 5 && this.moduleData.moduleArr.length <= 10 && index < 4) {
        return true
      }
      if (this.moduleData.moduleArr.length > 5 && this.moduleData.moduleArr.length <= 10 && index >= 4 && this.showMore) {
        return true
      }
      if (this.moduleData.moduleArr.length > 10 && index < 9) {
        return true
      }
      if (this.moduleData.moduleArr.length > 10 && index >= 8 && this.showMore) {
        return true
      }
      return false
    },
    sureShowMore () {
      this.showMore = !this.showMore
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  .menu-box{
    font-size: 0 !important;
    min-height: 50px;
    .padding(20px, 0px, 0, 30px);
    /*background: #f1f1f1;*/
    .menu-item{
      .font-size(24px);
      display: inline-block;
      text-align: center;
      width: 20%;
      .padding(0, 30px, 20px, 0);
      box-sizing: border-box;
      .title-box{
        .margin(20px, 0, 0, 0);
        .title-text{
          white-space: nowrap;
        }
      }
      .imgbox{
        width: 0;
        height: 0;
        padding: 50%;
        position: relative;
        .margin(0, 0, 0, 0);
        img{
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          .border-radius(10px)
        }
      }
    }
    &.portrait{
      padding: 0;
      .menu-item{
        display: flex;
        width: 100%;
        .height(220px);
        box-sizing: border-box;
        padding: 0;
        .margin(0, 0, 20px, 0);
        background: #E7EAEC;
        .imgbox{
          padding: 0;
          .width(150px);
          .height(150px);
          display: inline-block;
          flex-shrink: 0;
          .margin(30px, 0, 0, 30px);
        }
        .title-box{
          flex: 1;
          text-align: left;
          .padding(0, 0, 0, 20px);
          .margin(56px, 0, 0, 10px);
          .title-text{
            .margin(10px, 0, 16px, 0);
            font-weight: bold;
            .font-size(32px)
          }
          .title-desc{
            color: #999;
          }
        }
      }
    }
  }
</style>
