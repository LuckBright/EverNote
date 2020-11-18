<template>
  <div class="layout_inner">
    <div class="save-info-box">
      <span>上次保存时间：{{ homeInfoData.lastSaveTime }}</span>
      <el-button size="small" @click="save('0')">保存</el-button>
      <el-button type="primary" size="small" @click="onLine">上线</el-button>
      <!-- <el-button type="default" size="small" @click="preView">预览</el-button> -->
      <el-tooltip class="item" effect="dark" :content="configUrl" placement="top">
        <el-button>复制网址</el-button>
        <el-button
          type="default"
          size="small"
          v-clipboard:copy="configUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制网址</el-button>
      </el-tooltip>
    </div>
    <div class="home-container">
      <div class="home-warp">
        <draggable ghostClass="drag-ghost" :forceFallback="true" handle=".drag-btn" dragClass="drag-ing" v-model="moduleList" group="module">
          <div class="module-item" v-for="(item, index) in moduleList" :key="index">
            <div class="add-btn-box" v-if="index === 0">
              <div class="btn" @click="showAdd(-1)">
                <i class="el-icon-arrow-right"></i><span>添加</span><i class="el-icon-arrow-left"></i>
              </div>
            </div>
            <div class="module-title" v-if="item.data && item.data.showTitle === '1'">
              {{item.data.title}}
            </div>
            <div class="module-item-box">
              <div class="config-button">
                <div class="drag-btn">
                  <i class="el-icon-d-caret"></i>
                </div>
                <div class="edit-btn" @click="showEdit('edit', item)">
                  <i class="el-icon-s-operation"></i>
                </div>
              </div>
              <template v-if="item.type === '1'">
                <search :moduleData="item.data"></search>
              </template>
              <template v-if="item.type === '2'">
                <carousel :moduleData="item.data"></carousel>
              </template>
              <template v-if="item.type === '99'">
                <menus :moduleData="item.data"></menus>
              </template>
              <template v-if="item.type === '3'">
                <imgtitle :moduleData="item.data"></imgtitle>
              </template>
              <template v-if="item.type === '4'">
                <shortvideo :moduleData="item.data"></shortvideo>
              </template>
              <template v-if="item.type === '5'">
                <doctorwall :moduleData="item.data"></doctorwall>
              </template>
              <template v-if="item.type === '6'">
                <doctoradvice :moduleData="item.data"></doctoradvice>
              </template>
              <template v-if="item.type === '7'">
                <news :moduleData="item.data"></news>
              </template>
              <template v-if="item.type === '8'">
                <live :moduleData="item.data" v-if="isShowLive || item.data.endIsHide !== '1'"  @hideLive="hideLive"></live>
                <div v-if="!isShowLive && item.data.endIsHide === '1'" class="module-hide"> 此模块直播已全部结束 并设置了隐藏 </div>
              </template>
            </div>
            <div class="drag-show">
              111
            </div>
            <div class="add-btn-box">
              <div class="btn" @click="showAdd(index)">
                <i class="el-icon-arrow-right"></i><span>添加</span><i class="el-icon-arrow-left"></i>
              </div>
            </div>
          </div>
        </draggable>
        <div style="text-align: center;" v-if="moduleList.length === 0">加载中...</div>
      </div>
    </div>
    <div class="upd-box" v-if="editDialogStatus">
      <div class="model"></div>
      <div class="upd-container">
        <AddSearch v-if="activeEditType === homeSection.search" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddSearch>
        <AddCarousel v-if="activeEditType === homeSection.carousel" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddCarousel>
        <AddImgTitle v-if="activeEditType === homeSection.image" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddImgTitle>
        <AddDoctorWall v-if="activeEditType === homeSection.doctorWall" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddDoctorWall>
        <AddDoctorRecom v-if="activeEditType === homeSection.doctorRecom" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddDoctorRecom>
        <AddVideo v-if="activeEditType === homeSection.video" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddVideo>
        <AddInformation v-if="activeEditType === homeSection.information" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddInformation>
        <AddLive v-if="activeEditType === homeSection.live" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddLive>
        <AddNav v-if="activeEditType === homeSection.nav" :editData="editData" @sureEdit="sureEdit" @sureDel="sureDel" @sureClose="sureClose"></AddNav>
      </div>
    </div>
    <div class="upd-box"  v-if="addDialogStatus">
      <div class="model"></div>
      <div class="upd-container">
        <addmodule @closeAdd="closeAdd" @goAdd="goAdd" :nowModuleList="moduleList"></addmodule>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import search from '../components/serach'
import carousel from '../components/carousel'
import menus from '../components/menu'
import doctoradvice from '../components/doctoradvice'
import doctorwall from '../components/doctorwall'
import imgtitle from '../components/imgtitle'
import shortvideo from '../components/shortvideo'
import live from '../components/live'
import news from '../components/news'
import addmodule from '../components/addmodule'
import demoData from '../assets/json/homejson'
import { homeSection } from '../assets/json/homeSection'
import AddCarousel from '../components/add.carousel'
import AddSearch from '../components/add.search'
import AddImgTitle from '../components/add.imgtitle'
import AddDoctorWall from '../components/add.doctor.wall'
import AddDoctorRecom from '../components/add.doctor.recom'
import AddVideo from '../components/add.video'
import AddInformation from '../components/add.information'
import AddLive from '../components/add.live'
import AddNav from '../components/add.nav'
import api from '@/titancare/api/homeconfig/homeconfigapi'
// import { prviewSimulationMobile } from '@/util/common'

export default {
  data () {
    return {
      isShowLive: true,
      homeSection,
      demoData,
      nowAddIndex: 0,
      addDialogStatus: false,
      editDialogStatus: false,
      moduleList: [], // demoData.homeData,
      editData: {},
      activeEditType: 0,
      homeInfoData: {},
      menuJson: {
        id: new Date().getTime(), // 时间戳
        type: homeSection.nav, // 导航
        data: {
          styleType: '1', // 1 横向 2纵向，
          moduleArr: [],
        }
      },
      configUrl: this.$ever.host + this.$ever.unionIndex + '/home?tenant=' + localStorage.getItem('TENANTID')
    }
  },
  watch: {
    editDialogStatus (val) {
      if (val) {
        this.$nextTick(() => {
          this.getUpdContainerStyle()
        })
      }
    },
    addDialogStatus (val) {
      if (val) {
        this.$nextTick(() => {
          this.getUpdContainerStyle()
        })
      }
    }
  },
  created () {
    this.getHomeInfo()
    // this.addDefaultModule()
  },
  methods: {
    getUpdContainerStyle () {
      let el = document.querySelector('.upd-container')
      let style = getComputedStyle(el, null)
      let width = style.width.replace('px', '')
      let height = style.height.replace('px', '')
      el.style.marginTop = -(parseInt(height) / 2) + 'px'
      el.style.marginLeft = -(parseInt(width) / 2) + 'px'
    },
    hideLive () {
      this.isShowLive = false
    },
    getHomeInfo () {
      api.getHomeInfo().then((res) => {
        this.homeInfoData = JSON.parse(res.data)
        this.moduleList = JSON.parse(JSON.parse(res.data).homeData)
      })
    },
    onLine () {
      this.$confirm('您确定将此模板上线吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.save('1')
      }).catch(() => {
        return false
      })
    },
    save (status) {
      let params = {
        status,
        homeData: this.moduleList
      }
      api.saveHomeInfo(params).then((res) => {
        if (res.errCode === 0) {
          this.getHomeInfo()
          let tip = '保存成功'
          if (status === '1') {
            tip = '上线成功'
          }
          this.$notify({
            title: '成功',
            message: tip,
            type: 'success'
          })
        }
      })
    },
    addDefaultModule () {
      let hasNav = this.moduleList.find((item) => {
        return item.type === '99'
      })
      if (!hasNav) {
        this.moduleList.push(this.menuJson)
      }
    },
    sureEdit (data) {
      if (this.nowAddIndex === -1) {
        let tempIndex = this.moduleList.findIndex((item) => {
          return item.id === data.id
        })
        if (tempIndex !== -1) {
          this.moduleList.splice(tempIndex, 1, data)
        }
      } else {
        this.moduleList.splice(this.nowAddIndex, 0, data)
      }
      this.sureClose()
    },
    sureDel (data) {
      let tempIndex = this.moduleList.findIndex((item) => {
        return item.id === data.id
      })
      if (tempIndex !== -1) {
        this.moduleList.splice(tempIndex, 1)
      }
      this.editDialogStatus = false
    },
    sureClose () {
      this.editDialogStatus = false
    },
    closeAdd () {
      this.addDialogStatus = false
    },
    showAdd (index) {
      this.nowAddIndex = index + 1
      this.addDialogStatus = true
    },
    goAdd (type) {
      let tempModule = this.moduleList.find((item) => {
        return item.type === type && ['4', '7', '8'].includes(type)
      })
      if (tempModule) {
        this.$message({
          message: '此模块只允许添加一次，请编辑或删除原模块',
          type: 'warning'
        })
        return
      }
      this.closeAdd()
      this.showEdit('add', { type })
    },
    showEdit (type, data = {}) {
      if (type === 'edit') {
        this.nowAddIndex = -1
      }
      this.activeEditType = data.type
      this.editData = data
      // this.editData.handelType = type
      this.editDialogStatus = true
    },
    // 操作系统复制成功提示
    onCopy () {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    // 复制失败提示
    onError () {
      this.$message.error('复制失败')
    },
    // 预览
    // preView () {
    //   prviewSimulationMobile(this.configUrl)
    // }
  },
  components: {
    draggable,
    search,
    menus,
    addmodule,
    AddCarousel,
    AddSearch,
    AddImgTitle,
    AddDoctorWall,
    AddDoctorRecom,
    AddVideo,
    AddInformation,
    AddLive,
    AddNav,
    carousel,
    imgtitle,
    shortvideo,
    live,
    doctoradvice,
    doctorwall,
    news,
  }
}
</script>
<style lang="less" scoped>
  @import "../assets/css/common";
  .layout_inner{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #f1f1f1;
    box-sizing: border-box;
    padding-top: 47px;
    padding-bottom: 47px;
    font-size: 14px;
    z-index: 99;
    .save-info-box{
      text-align: center;
      box-sizing: border-box;
      height: 60px;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      line-height: 60px;
      background: #ffffff;
      box-shadow: 0 0 5px 0 rgba(0,0,0,0.23);
      span{
        display: inline-block;
        margin-right: 20px;
      }
    }
    .upd-box{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 9;
      .upd-container{
        position: absolute;
        top: 50%;
        left: 50%;
        min-width: 440px;
        min-height: 500px;
        background: #F5F5F5;
      }
      .model{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
      }
    }
    .home-container{
      margin: 0 auto;
      width: 445px;
      background: transparent;
      max-height: calc(~'100% - 58px');
      padding-left: 71px;
      box-sizing: border-box;
      overflow: auto;
      position: relative;
      right: 39px;
      top: 33px;
      .home-warp{
        min-height: 100%;
        background: #fff;
        box-sizing: border-box;
        padding: 10px;
        /*/deep/ .el-input__icon{*/
        /*  width: 50px;*/
        /*  font-size: 28px;*/
        /*}*/
        /*/deep/ .el-input__inner{*/
        /*  padding-left: 60px;*/
        /*}*/
        .module-item{
          position: relative;
          width: 100%;
          /*.margin(0, 0 ,20px, 0);*/
          .margin(0, 0 ,10px, 0);
          .module-hide{
            background: #f1f1f1;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .module-title{
            .font-size(32px);
            font-weight: bold;
            .margin(0, 0 ,15px, 0);
          }
          .module-item-box{
            position: relative;
          }
          .add-btn-box{
            height: 10px;
            position: relative;
            z-index: 3;
            &:after{
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 2px;
              background: #1C7BEF;
              left: 0;
              top: 9px;
              display: none;
            }
            &:hover:after{
              display: block;
            }
            .btn{
              z-index: 2;
              left: 50%;
              transform: translateX(-50%);
              width: 157px;
              display: none;
              position: absolute;
              height: 28px;
              top: -5px;
              line-height: 30px;
              text-align: center;
              color: #1C7BEF;
              i{
                font-size: 19px;
                font-weight: bold;
                &.el-icon-arrow-right{ position: relative; top: 3px; right: -5px }
                &.el-icon-arrow-left{ position: relative; top: 3px; left: -5px }
              }
              span{
                display: inline-block;
                background: #1C7BEF;
                color: #fff;
                border-radius: 200px;
                cursor: pointer;
                width: 117px;
                text-align: center;
              }
            }
            &:hover{
              .btn{
                display: block;
              }
            }
          }
          .config-button{
            position: absolute;
            height: 100%;
            top: 0;
            left: -210px;
            width: 200px;
            .drag-btn,.edit-btn {
              font-size: 20px;
              color: #fff;
              text-align: center;
              line-height: 29px;
              cursor: pointer;
            }
            .drag-btn{
              width: 32px;
              height: 28px;
              position: absolute;
              top: 0;
              right: 6px;
              background: #1C7BEF;
              border-radius: 5px 0 0 5px;
              cursor: move;
            }
            .edit-btn{
              width: 28px;
              height: 28px;
              position: absolute;
              top: 0;
              right: 43px;
              background: #1C7BEF;
              border-radius: 5px;
            }
            &:after{
              content: '';
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              width: 6px;
              height: 100%;
              background: #1C7BEF;
            }
          }
        }
      }
    }
  }
  .drag-show{
    display: none;
    position: absolute;
    left: 62px;
    top: 0;
    padding-left: 110px;
    background: #1C7BEF;
    color: #fff;
    width: calc( 100% - 240px );
    border-radius: 10px;

  }
  .drag-ing{
    .module-item-box{
      /*opacity: 0;*/
      /*transform: scale(0.5) translateX(-50%) translateY(-50%);*/
      /*position: relative;*/
      /*left: -110px;*/
    }
    .drag-show{
      /*display: block;*/
      /*transform: scale(0.5) translateX(-50%) translateY(-50%);*/
    }
  }
  .home-container::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 3px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .home-container::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #999999;
  }
  .home-container::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #f1f1f1;
  }
</style>
