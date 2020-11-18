<template>
  <div :class="{'menu-box': true, 'three': moduleData.styleType === '3', 'one': moduleData.styleType === '1'}">
    <template v-for="(item, index) in moduleData.moduleArr">
      <div :class="{'menu-item': true}" :key="index">
        <div class="imgbox">
          <img :src="$ever.fileUrl2 + item.img" alt="" style="object-fit: cover;">
        </div>
        <div class="title-box">
          <div class="title-text">{{item.title}}</div>
          <div class="title-desc">{{item.desc}}</div>
        </div>
      </div>
    </template>
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
    sureShowMore () {
      this.showMore = !this.showMore
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  .menu-box{
    width: calc(~'100% + 10px');
    .font-size(24px);
    .padding(0, 0, 0, 0);
    /*background: #f1f1f1;*/
    .menu-item{
      display: inline-block;
      vertical-align: top;
      width: 50%;
      .padding(0, 20px, 20px, 0);
      box-sizing: border-box;
      .title-box{
        .margin(10px, 0, 0, 0);
        .title-text{
          .font-size(28px);
          font-weight: bold;
        }
        .title-desc{
          .line-height(30px);
          .max-height(60px);
          .font-size(24px);
          .margin(10px, 0, 0, 0);
          color: rgba(0,0,0,0.45);
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          /* autoprefixer: off */
          -webkit-box-orient: vertical;
        }
      }
      .imgbox{
        width: 100%;
        height: 0;
        padding-bottom: 70%;
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
    &.three{
      .menu-item{
        width: 33.3333333333%;
      }
    }
    &.one{
      .menu-item{
        width: 100%;
      }
      .imgbox{
        padding-bottom: 30%;
      }
    }
  }
</style>
