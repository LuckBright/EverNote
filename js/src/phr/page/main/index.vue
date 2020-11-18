<template>
  <div class="main-container">
    <img class="main-bg" ref="mainBg" src="../../assets/img/main-bg.png" alt="">
    <div class="main-info-content">
      <div class="main-logo">
        {{$store.state.currentUser.tenantName}}集团
      </div>
      <div class="main-title">
        <div class="title-text">PHR个人健康记录平台</div>
      </div>
      <div class="main-menu-list">
        <div class="main-menu-item" v-for="(item, index) in mentList" :style="'z-index:' + (99 - index)">
          <svg class="icon svg-icon" aria-hidden="true">
            <use :xlink:href="`#icon-${item.icon}`"></use>
          </svg>
          <div class="menu-title">
            {{item.title}}
          </div>
          <div class="menu-text" :class="'m' + index">
            <div v-for="mitem in item.texts">{{mitem}}</div>
          </div>
          <router-link :to="item.url" class="enter-btn">进入</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const menuListData = [
  {
    url: '/phr/patientlist',
    icon: 'gerenjiankangshujuzhongxin',
    title: '个人健康数据中心',
    texts: [
      '以患者为中心的全程就诊记录',
      '支持跨机构、跨集团浏览查看',
      '提供检查/检验记录全程示踪',
    ]
  },
  {
    url: '/phr/datacontrol',
    icon: 'shujujiankongguanli',
    title: '数据监控管理',
    texts: [
      '展示各业务接口集成框架',
      '动态展示接口交互数据量',
      '实时展示接口交互状态',
    ]
  },
  {
    url: '/phr/chart',
    icon: 'shujutongjifenxi',
    title: '数据统计分析',
    texts: [
      '支持报表导出多种格式',
      '整合多种数据源管理',
      '丰富的报表展示形态',
    ]
  }
]
export default {
  data () {
    return {
      mentList: [...menuListData]
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  .main-container{
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff;
    .main-bg{
      position: absolute;
      right: 0;
      bottom: 0;
      height: 100%;
      padding-top: 90px;
      box-sizing: border-box;
      /*transform: translateX(-50%) translateY(-50%);*/
    }
    .main-info-content{
      position: relative;
      padding: 94px 0 0 50px;
      .main-logo{
        color: #707794;
        font-size: 28px;
        margin-bottom: 10px;
      }
      .main-title{
        color: #3E4DA8;
        font-size: 40px;
        height: 56px;
        line-height: 56px;
        font-weight: bold;
        margin-bottom: 75px;
        position: relative;
        display: inline-block;
        padding: 0 5px;
        left: -5px;
        .title-text{
          position: relative;
          z-index: 1;
        }
        &:after{
          content: '';
          display: block;
          width: 100%;
          background: #E7EEFF;
          height: 28px;
          bottom: 0;
          left: 0;
          position: absolute;
          z-index: 0;
        }
      }
      .main-menu-list{
        margin-left: 20px;
        .main-menu-item{
          width: 210px;
          height: 294px;
          background: #fff;
          box-shadow: 3px 0 20px 2px rgba(187,187,187,0.32);
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #fff;
          text-align: center;
          float: left;
          position: relative;
          margin-right: 30px;
          .icon{
            margin-top: 48px;
            height: 50px;
            width: 50px;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
          }
          .menu-title{
            color: #3F4DA8;
            font-size: 18px;
            margin: 15px 0 20px;
            font-weight: bold
          }
          .menu-text{
            font-size: 10px;
            color: #878D94;
            margin: 0 0 30px;
            -webkit-transform: scale(0.9);
            text-align: left;
            &.m0 {
              margin-left: 26px;
            }
            &.m1 {
              margin-left: 40px;
            }
            &.m2 {
              margin-left: 40px;
            }
            div{
              margin-bottom: 9px;
            }
          }
          .enter-btn{
            display: none;
          }
          &:hover{
            border: 1px solid #3E4DA8;
            .enter-btn{
              display: inline-block;
            }
            .enter-btn:hover{
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .enter-btn {
    display: inline-block;
    width: 84px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #EB5880;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    :hover{
      opacity: 0.8;
    }
  }
</style>
