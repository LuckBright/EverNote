<template>
  <div :class="{'menu-box': true, 'three': true}">
    <template v-for="(item, index) in videoList">
      <div :class="{'menu-item': true}" :key="index">
        <div class="imgbox">
          <img :src="item.coverUrl" alt="" style="object-fit: cover;">
          <img class="video-play-btn" src="../../../assets/img/homepause.png" alt="">
        </div>
        <div class="title-box">
          <div class="title-text">{{item.mark}}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import api from '@/titancare/api/homeconfig/homeconfigapi'
export default {
  props: [ 'videoData' ],
  data () {
    return {
      showMore: false,
      videoList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.getVideos().then((res) => {
        this.videoList = res.data.resultList
      })
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
    width: calc(~'100% + 10px');
    .font-size(24px);
    .padding(0, 0, 0, 0);
    /*background: #f1f1f1;*/
    .menu-item{
      display: inline-block;
      vertical-align: top;
      width: 33.3333333333%;
      .padding(0, 20px, 20px, 0);
      box-sizing: border-box;
      .title-box{
        .margin(10px, 0, 0, 0);
        .title-text{
          .font-size(24px);
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
        .video-play-btn{
          left: 50%;
          top: 50%;
          .width(70px);
          .height(70px);
          transform: translateX(-50%) translateY(-50%);
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
