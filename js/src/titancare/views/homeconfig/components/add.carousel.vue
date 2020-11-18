<template>
<div class="add-carousel">
  <AddContent
      v-show="showMainContent"
      title="轮播图"
      sub-title="建议上传尺寸为702*280像素"
      title-position="left"
      :show-close-btn="!!editData.id"
      @sureEdit="sureEdit"
      @sureDel="sureDel"
      @sureClose="sureClose"
  >
    <div class="add-carousel-content">
      <div class="">
        <p class="box-section-title">展现形式</p>
        <section style="margin-bottom: 20px;">
          <SelectNav :gutter="20" :data="selectNavData" v-model="commonData.styleType"></SelectNav>
        </section>
        <AddModuleTitle
            :show="commonData.showTitle"
            :title="commonData.title"
            placeholder="建议2-6个字"
            @showTitleChange="showTitleChange"
            @titleChange="titleChange"
        >
        </AddModuleTitle>
        <MuduleCtrl
          :showMp="showMp"
          :showH5="showH5"
          @showMpChange="showMpChange"
          @showH5Change="showH5Change"
        >
        </MuduleCtrl>
        <p class="box-section-title small">轮播图按顺序轮播，可拖动排序</p>
        <section class="carousel-list">
          <Draggable  v-model="commonData.moduleArr" group="module">
            <div class="carousel-item" :key="carousel.id" v-for="(carousel, index) in commonData.moduleArr">
              <BoxClose :showClose="commonData.moduleArr.length > 1" @close="delCarousel(index)">
                <div class="carousel-item-content">
                  <div class="content-left">
                    <template v-if="carousel.img">
                      <ImageCover
                          :preview-src-list="[normalizeFilePath(carousel.img)]"
                          :src="normalizeFilePath(carousel.img)"
                          @close="delImage(carousel)"
                      >
                        <div class="upload-box">
                          <ever-image style="width: 197px; height: 79px" :src="carousel.img"></ever-image>
                        </div>
                      </ImageCover>
                    </template>
                    <template v-else >
                      <Uploader :maxSize="1000" v-model="carousel.img">
                        <div class="upload-box dashed">
                          <i class="el-icon-plus"></i>
                          <span>上传图片</span>
                        </div>
                      </Uploader>
                    </template>
                  </div>
                  <div class="content-right">
                    <div class="content-right-item">
                      <span class="content-right-item-title">跳转分类</span>
                      <el-select v-model="carousel.goType" size="small" style="width: 258px;" @change="goTypeChange(index)">
                        <el-option :key="item.type" v-for="item in carouselTypes" :label="item.label" :value="item.type"></el-option>
                      </el-select>
                    </div>
                    <template v-if="carousel.goType === carouselType.ServicePage">
                      <div class="content-right-item">
                        <span class="content-right-item-title">功能页面</span>
                        <el-select v-model="carousel.goPath" size="small" style="width: 258px;">
                          <el-option :key="item.id" v-for="item in servicePages" :label="item.name" :value="item.attr1"></el-option>
                        </el-select>
                      </div>
                    </template>
                    <template v-else-if="carousel.goType === carouselType.GoodsDetail">
                      <div class="content-right-item">
                        <span class="content-right-item-title">上架商品</span>
                        <template v-if="carousel.goPathName">
                          <el-input
                              size="small"
                              style="width: 258px;"
                              disabled
                              v-model="carousel.goPathName">
                            <div slot="suffix" class="input-suffix" @click="delGoods(index)">
                              <i class="el-icon-circle-close"></i>
                            </div>
                          </el-input>
                        </template>
                        <template v-else>
                          <el-button type="primary" size="small" @click="addGoods(index)">添加商品</el-button>
                        </template>
                      </div>
                    </template>
                    <template v-else-if="carousel.goType === carouselType.GoodsGroup">
                      <div class="content-right-item">
                        <span class="content-right-item-title">商品分组</span>
                        <template v-if="carousel.goPathName">
                          <el-input
                              size="small"
                              style="width: 258px;"
                              disabled
                              v-model="carousel.goPathName">
                            <div slot="suffix" class="input-suffix" @click="delGoods(index)">
                              <i class="el-icon-circle-close"></i>
                            </div>
                          </el-input>
                        </template>
                        <template v-else>
                          <el-button type="primary" size="small" @click="addGoodsGruop(index)">添加分组</el-button>
                        </template>
                      </div>
                    </template>
                    <template v-else-if="carousel.goType === carouselType.Link">
                      <div class="content-right-item">
                        <span class="content-right-item-title">跳转网址</span>
                        <el-input v-model="carousel.goPath" style="width: 258px;" placeholder="请输入地址" size="small"></el-input>
                      </div>
                    </template>
                    <template v-else-if="carousel.goType === carouselType.ProtectionPlan">
                      <div class="content-right-item">
                        <span class="content-right-item-title">上架商品</span>
                        <template v-if="carousel.goPathName">
                          <el-input
                            size="small"
                            style="width: 258px;"
                            disabled
                            v-model="carousel.goPathName">
                            <div slot="suffix" class="input-suffix" @click="delGoods(index)">
                              <i class="el-icon-circle-close"></i>
                            </div>
                          </el-input>
                        </template>
                        <template v-else>
                          <el-button type="primary" size="small" @click="addProtectionPlan(index)">添加保障计划</el-button>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </BoxClose>
            </div>
          </Draggable>
        </section>
        <section v-show="commonData.moduleArr.length < 10">
          <div style="padding-bottom: 20px;">
            <el-button size="small" @click="addCarousel">
              <span>+</span> 添加轮播图
            </el-button>
            <p class="box-section-title" style="display: inline-block">最多可添加10张轮播图</p>
          </div>
        </section>
      </div>
    </div>
  </AddContent>
  <AddCarouselGoods
      v-if="showAddGoods"
      @addSure="addGoodsSure"
      @addCancel="addGoodsCancel"
  />
  <AddCarouselGoodsGroup
      v-if="showAddGoodsGroup"
      @addSure="addGoodsGruopSure"
      @addCancel="addGoodsGruopCancel"
  />
  <AddProtectionPlan
    v-if="showAddProtectionPlan"
    @addSure="addProtectionPlanSure"
    @addCancel="addProtectionPlanCancel"
  />
</div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddContent from './base/add.content'
import BoxClose from './base/box.close'
import Uploader from './base/uploader'
import SelectNav from './base/select.nav'
import MuduleCtrl from './base/module.ctrl'
import AddCarouselGoods from './service/add.carousel.goods'
import AddCarouselGoodsGroup from './service/add.carousel.goodsGroup'
import AddProtectionPlan from './service/add.protectionPlan'
import AddModuleTitle from './base/add.module.title'
import ImageCover from './base/image-cover'

import { selectNavData, carouselStyle, carouselTypes, carouselType } from '../assets/json/carousel-target-types'
import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'

import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'
import filePath from '../mixins/filePath.js'
import selectOptions from '../mixins/selectOptions.js'

const carouselItem = () => {
  return {
    img: '',
    goType: carouselType.ServicePage,
    goPath: '',
    goPathName: ''
  }
}

let currentGoodsIndex

export default {
  name: 'add.carousel',
  components: {
    AddContent,
    BoxClose,
    Uploader,
    MuduleCtrl,
    SelectNav,
    Draggable,
    AddCarouselGoods,
    AddCarouselGoodsGroup,
    AddModuleTitle,
    ImageCover,
    AddProtectionPlan
  },
  mixins: [operation, moduleTitle, filePath, selectOptions],
  data () {
    return {
      selectNavData: selectNavData,
      carouselTypes: carouselTypes,
      carouselType: carouselType,
      servicePages: [],
      commonData: {
        styleType: carouselStyle.big, // 1大图 2小图
        showTitle: moduleShowTtitle.hide,
        title: '',
        moduleArr: [
          carouselItem()
        ],
      },
      showAddGoods: false,
      showAddGoodsGroup: false,
      showAddProtectionPlan: false
    }
  },
  computed: {
    showMainContent () {
      return !this.showAddGoods && !this.showAddGoodsGroup && !this.showAddProtectionPlan
    }
  },
  created () {
    this._setModuleInfo(homeSection.carousel, '轮播图')
    this._getSelectOptions(['servicePages'])
  },
  methods: {
    addGoods (index) {
      currentGoodsIndex = index
      this.showAddGoods = true
    },
    addGoodsCancel () {
      this.showAddGoods = false
    },
    addGoodsSure (goods) {
      this.commonData.moduleArr[currentGoodsIndex].goPath = goods.id
      this.commonData.moduleArr[currentGoodsIndex].goPathName = goods.name
      this.showAddGoods = false
      this._edit()
    },
    addGoodsGruop (index) {
      currentGoodsIndex = index
      this.showAddGoodsGroup = true
    },
    addGoodsGruopCancel () {
      this.showAddGoodsGroup = false
    },
    addGoodsGruopSure (goodsGroup) {
      this.commonData.moduleArr[currentGoodsIndex].goPath = goodsGroup.id
      this.commonData.moduleArr[currentGoodsIndex].goPathName = goodsGroup.name
      this.showAddGoodsGroup = false
      this._edit()
    },
    addProtectionPlan (index) {
      currentGoodsIndex = index
      this.showAddProtectionPlan = true
    },
    addProtectionPlanCancel () {
      this.showAddProtectionPlan = false
    },
    addProtectionPlanSure (protectionPlan) {
      this.commonData.moduleArr[currentGoodsIndex].goPath = protectionPlan.id
      this.commonData.moduleArr[currentGoodsIndex].goPathName = protectionPlan.name

      this.showAddProtectionPlan = false
      this._edit()
    },
    delGoods (index) {
      this.commonData.moduleArr[index].goPath = ''
      this.commonData.moduleArr[index].goPathName = ''
      this._edit()
    },
    goTypeChange (index) {
      this.commonData.moduleArr[index].goPath = ''
      this.commonData.moduleArr[index].goPathName = ''
      this._edit()
    },
    addCarousel () {
      this.commonData.moduleArr.push(carouselItem())
      this._edit()
    },
    delCarousel (index) {
      if (this.commonData.moduleArr.length === 1) {
        return
      }
      this.commonData.moduleArr.splice(index, 1)
      this._edit()
    },
    delImage (data) {
      data.img = ''
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/css/form-list";
  .add-carousel-content{
    width: 610px;
  }
  section{
    padding: 0 20px;
  }
  .carousel-list{
    .carousel-item{
      margin-bottom: 10px;
      cursor: move;
      .carousel-item-content{
        width: 570px;
        height: 120px;
        background-color: #ffffff;
        overflow: hidden;
        box-sizing: border-box;
        padding: 18px;
        .content-left{
          float: left;
          .upload-box{
            width: 197px;
            height: 79px;
            border-radius: 10px;
            text-align: center;
            line-height: 79px;
            font-size: 14px;
            color: #999999;
            overflow: hidden;
          }
          .dashed{
            border: 1px dashed #979797;
          }
        }
        .content-right{
          margin-left: 10px;
          float: left;
          .content-right-item{
            height: 32px;
            &:first-child{
              margin-bottom: 10px;
            }
            .content-right-item-title{
              margin-right: 5px;
              display: inline-block;
              height: 32px;
              line-height: 32px;
              font-size: 14px;
              color: #999999;
            }
          }
        }
      }
    }
  }
  .input-suffix{
    display: inline-block;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    width: 30px;
  }
</style>
