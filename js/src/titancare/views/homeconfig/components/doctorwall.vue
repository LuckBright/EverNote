<template>
  <div :class="{'menu-box': true}">
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
    white-space: nowrap;
    overflow: auto;
    .menu-item{
      display: inline-block;
      vertical-align: top;
      width: 30%;
      .padding(0, 20px, 20px, 0);
      box-sizing: border-box;
      .title-box{
        text-align: center;
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
        padding-bottom: 130%;
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
  .menu-box::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 3px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 3px;
  }
  .menu-box::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #999999;
  }
  .menu-box::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #f1f1f1;
  }
</style>
