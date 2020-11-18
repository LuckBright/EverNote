<template>
  <div :class="{'menu-box': true, 'portrait': true}">
    <template v-for="(item, index) in doctorList">
      <div :class="{'menu-item': true}" :key="index" v-if="index < 5">
        <div class="imgbox">
          <img v-show="item.photo" :src="$ever.fileUrl2 + item.photo" alt="">
          <img v-show="!item.photo" src="../../../assets/img/avatardoctor.png" alt="">
        </div>
        <div class="title-box">
          <div class="title-text">{{item.name}}
            <span class="img-tag" v-show="item.categoryCode && item.categoryCode.includes('INQUIRY_VIDEO')">视频问诊</span>
            <span class="video-tag" v-show="item.categoryCode && item.categoryCode.includes('INQUIRY_IMAGE_TEXT')">图文问诊</span>
            <span class="video-tag" v-show="item.categoryCode && item.categoryCode.includes('CONSULT_ON_LINE')">在线咨询</span>
          </div>
          <div class="title-desc">{{item.tsStaffSubjectList[0] && (item.tsStaffSubjectList[0].orgSubjectName + ' | ') }}{{item.skillsTitle2Name}}</div>
          <div class="title-desc">介绍：{{item.infoRemark}}</div>
          <div class="title-span" v-if="item.infoText">
            <span v-for="(tagitem, tagindex) in (item.infoText.split(','))" :key="tagindex + 'tag'">
              {{tagitem}}
            </span>
          </div>
          <div class="title-line"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from '@/titancare/api/homeconfig/homeconfigapi'
export default {
  props: [ 'moduleData' ],
  data () {
    return {
      showMore: false,
      doctorList: []
    }
  },
  created () {
    this.getList()
  },
  watch: {
    'moduleData.moduleArr': {
      handler: function (v) {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    getList () {
      // this.moduleData.moduleArr
      api.searchDoctors({ outStaffGetStaffListByConditionReqDTO: { idList: this.moduleData.moduleArr } }).then((res) => {
        this.doctorList = res.data.resultList
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
    .font-size(24px);
    .padding(0, 0px, 0px, 30px);
    /*background: #f1f1f1;*/
    .menu-item{
      display: inline-block;
      text-align: center;
      width: 20%;
      .padding(0, 30px, 20px, 0);
      box-sizing: border-box;
      .title-box{
        .margin(20px, 0, 0, 0);
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
          .border-radius(200px)
        }
      }
    }
    &.portrait{
      padding: 0;
      .menu-item{
        display: flex;
        width: 100%;
        box-sizing: border-box;
        padding: 0;
        .margin(0, 0, 14px, 0);
        .imgbox{
          padding: 0;
          .width(100px);
          .height(100px);
          display: inline-block;
          flex-shrink: 0;
        }
        .title-box{
          flex: 1;
          text-align: left;
          .padding(0, 0, 0, 20px);
          .margin(0, 0, 0, 0);
          .title-text{
            .margin(10px, 0, 0, 0);
            font-weight: bold;
            .font-size(32px);
            span{
              font-size: 10px;
              display: inline-block;
              .padding(8px, 10px, 6px, 10px);
              background: #4D8FE3;
              .border-radius(4px);
              font-weight: normal;
              color: #fff;
              .margin(-8px, 0px, 0 ,0);
              vertical-align: middle;
              transform: scale(0.9);
              &.img-tag{
                background: #1FBAAE ;
              }
            }
          }
          .title-desc{
            .margin(16px, 0, 0, 0);
            color: rgba(0,0,0,0.45);
          }
          .title-span{
            .padding(12px, 0, 4px, 0);
            color: rgba(0,0,0,0.45);
            span{
              .padding(6px, 8px, 4px, 8px);
              display: inline-block;
              background: #f1f1f1;
              .border-radius(3px)
            }
          }
          .title-line{
            .padding(20px, 0, 0, 0);
            border-bottom: solid 1px #ededed;
          }
        }
      }
    }
  }
</style>
