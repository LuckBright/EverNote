<template>
  <div :class="{'menu-box': true, 'three': true}">
      <template  v-for="(item, index) in videoList">
        <!--          style;文章样式：0：无图 1：一图 2：大图 3：3图-->
        <div :class="{'health-item': true, 'text-style-1':item.style === 1, 'text-style-2':item.style !== 1}" :key="index"  @click="goDetail(item.id)">
          <div class="item-img-box" v-if="item.style === 1">
            <img v-if="item.styleImg[0]" :src="$ever.fileUrl2 + item.styleImg[0]" style="object-fit: cover;" />
          </div>
          <div class="item-imgs-box"  v-if="item.style === 3">
            <div class="img-box" v-for="(imgitem) in item.styleImg" :key="imgitem">
              <img v-if="imgitem" :src="$ever.fileUrl2 + imgitem"  style="object-fit: cover;" />
            </div>
          </div>
          <div class="item-img-box"  v-if="item.style === 2">
            <img v-if="item.styleImg[0]" :src="$ever.fileUrl2 + item.styleImg[0]" style="object-fit: cover;" />
          </div>
          <div class="text-box">
            {{ item.title }}
          </div>
          <div class="text-time">
            <span v-for="(tagitme, tagindex) in item.tag.split(',')" :key="tagindex + 'tag'">{{tagitme}}</span>
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
      api.getNewsList({ offset: 0, pagesize: 10, status: 1, isRecommend: 1 }).then((res) => {
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
    .text-box{
      font-weight: bold;
      .padding(16px, 0, 0, 0)
    }
    /*width: calc( 100% + 10px );*/
    .health-item{
      .padding(0, 0, 0, 0);
      border-bottom: solid 1px #ededed;
      .font-size(28px);
      &:last-of-type{
        border-bottom: none;
      }
      margin: 0;
      .text-time{
        .font-size(24px);
        color: #999;
        .padding(14px, 0, 14px, 0);
        span{
          font-size: 10px;
          display: inline-block;
          .padding(8px, 10px, 6px, 10px);
          background: rgba(77, 143, 227, 0.22);
          .border-radius(4px);
          font-weight: normal;
          color: #1C7BEF;
          .margin(0px, 10px, 0 ,0);
          vertical-align: middle;
        }
      }
    }
    .text-style-1{
      position: relative;
      display: flex;
      .padding(16px, 0, 16px, 0);
      .item-img-box{
        .width(220px);
        .height(160px);
        flex-shrink: 0;
        img {
          display: block;
          width: 100%;
          height: 100%;
          .border-radius(5px);
        }
      }
      .text-box{
        font-weight: bold;
        .margin(-2px, 0, 0, 0);
        .padding(0, 0, 0, 20px);
        flex: 1;
        text-align: justify;
        .font-size(28px);
        position: relative;
      }
      .text-time{
        position: absolute;
        .left(240px);
        .bottom(10px);
      }
    }
    .text-style-2{
      .item-img-box{
        box-sizing: border-box;
        height: 0;
        width: 100%;
        padding-bottom: 35%;
        flex-shrink: 0;
        .margin(15px, 0, 15px, 0);
        position: relative;
        img {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          width: 100%;
          height: 100%;
          .border-radius(5px);
        }
      }
      .item-imgs-box{
        .margin(15px, 0, 0px, 0);
        display: flex;
        .height(160px);
        .img-box{
          flex: 1;
          .padding(0, 20px, 0px,0);
          &:last-of-type{
            padding-right: 0;
          }
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          .border-radius(5px);
        }
      }
    }
  }
</style>
