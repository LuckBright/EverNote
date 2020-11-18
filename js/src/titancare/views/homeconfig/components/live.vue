<template>
  <div :class="{'menu-box': true}">
    <el-carousel  indicator-position="outside" :autoplay="false" :class="{ 'height1': (moduleData.showTheme === '0' || moduleData.showDesc === '0'), 'height2': (moduleData.showTheme === '0' && moduleData.showDesc === '0')}">
      <el-carousel-item v-for="(item, index) in liveList" :key="index" style="height: auto">
        <div :class="{'menu-item': true}" :key="index">
          <div class="imgbox">
            <img :src="item.videoFaceUrl" alt="" style="object-fit: cover;">
            <span class="live-status">
              <template v-if="item.auditStatus === 2">
                <img src="../../../assets/img/zhibozhong.png" alt="">待直播
              </template>
              <template v-if="item.auditStatus === 3">
                <img src="../../../assets/img/zhibozhong.png" alt="">直播中
              </template>
              <template v-if="item.auditStatus === 4">
                <img src="../../../assets/img/zhibozhong.png" alt="">已结束
              </template>
            </span>
          </div>
          <div class="title-box">
            <div class="title-text" v-show="moduleData.showTheme === '1'">{{item.liveTitle}}</div>
            <div class="title-desc" v-show="moduleData.showDesc === '1'">{{item.des}}</div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import api from '@/titancare/api/homeconfig/homeconfigapi'
export default {
  props: [ 'moduleData' ],
  data () {
    return {
      showMore: false,
      liveList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.getLiveList().then((res) => {
        this.liveList = res.data
        let hasNoEnd = this.liveList.find((item) => {
          return item.auditStatus !== 4
        })
        if (!hasNoEnd) {
          this.$emit('hideLive')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  /deep/ .el-carousel{
    height: 0; padding-bottom: calc(~'38% + 60px');
    overflow: hidden;
    &.height1 {
      padding-bottom: calc(~'38% + 40px');
    }
    &.height2 {
      padding-bottom: calc(~'38% + 20px') !important;
    }
  }
  /deep/ .el-carousel__container{
    height: 0; padding-bottom: calc(~'38% + 40px');
    overflow: hidden;
  }
  /deep/ .el-carousel__indicator{
    .el-carousel__button{
      background: #cccccc;
      width: 5px;
      height: 5px;
      border-radius: 200px;
    }
  }
  /deep/ img{
    border-radius: 10px;
  }
  /*/deep/ .el-carousel__indicators--outside button{*/
  /*  opacity: 1;*/
  /*}*/
  /deep/ .el-carousel__indicator.is-active button{
    background: #2F69F8;
    width: 10px;
  }
  /deep/ .el-carousel__indicator--horizontal{
    padding: 8px 4px 0px;
  }
  .menu-box{
    width: calc(~'100% + 10px');
    .font-size(24px);
    .padding(0, 0, 0, 0);
    /*background: #f1f1f1;*/
    .menu-item{
      display: inline-block;
      vertical-align: top;
      width: 100%;
      .padding(0, 20px, 10px, 0);
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
        padding-bottom: 38%;
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
        .live-status{
          display: block;
          position: absolute;
          right: 10px;
          top: 7px;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 16px;
          height: 16px;
          background: rgba(0,0,0,0.30);
          border-radius: 18px;
          .padding(4px, 10px, 4px, 0);
          img{
            height: 100%;
            width: auto;
            position: relative;
            display: inline-block;
            vertical-align: middle;
            top: -1px;
            margin-right: 1px;
          }
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
