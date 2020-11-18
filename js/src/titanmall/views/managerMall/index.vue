<template>
  <div>
    <div class="mall-container">
      <div class="bg-img">
        <img src="../../assets/img/bg.png"/>
      </div>
      <div class="mall">
        <div class="show-container">
          <div class="add-btn" @click="showBtn = !showBtn">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击开始添加模块"
              placement="top"
            >
              <span class="add-span">+</span>
            </el-tooltip>
            <div class="all-btn" v-if="showBtn">
              <p>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="bannerDialogBtn"
                >图片广告
                </el-button
                >
              </p>
              <p>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="pictureDialogBtn"
                >图文导航
                </el-button
                >
              </p>
              <p>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="isShowDialog('2', 'showDailyDialog', '每日特惠')"
                >每日特惠
                </el-button
                >
              </p>
              <p>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="twoInLineBtn"
                >商品推荐
              <p>（横排二）</p>
              </el-button>
              </p>
              <p>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="threeInLineBtn"
                >商品推荐
              <p>（横排三）</p>
              </el-button>
              </p>
              <p>
                <el-button
                  type="primary"
                  size="small"
                  class="btn"
                  @click="isShowDialog('5', 'showLikeDialog', '瀑布流')"
                >商品推荐
              <p>（瀑布流）</p>
              </el-button>
              </p>
            </div>
          </div>
          <draggable v-model="allInfo">
            <div v-for="(items, index) in allInfo" :key="index">
              <!-- 图文广告 -->
              <div class="box" v-if="items.type === '1'">
                <div class="left-tip">
                  <span class="left-close" @click="deleted(index)">x</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="拖拽排序"
                    placement="left-start"
                  >
                    <span
                      class="left-span" @click="modifBtn(items, index)"
                    >图片广告</span
                    >
                  </el-tooltip>
                </div>
                <div class="swiper">
                  <swiper :options="swiperOption" ref="mySwiper">
                    <swiper-slide v-for="(item, i) in items.data" :key="i">
                      <img
                        v-if="item.imgUrls.length"
                        class="swiper-img"
                        :src="item.imgUrls[0].url.includes('http') ? item.imgUrls[0].url : imgCdn + item.imgUrls[0].url"
                      />
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                  </swiper>
                </div>
              </div>
              <!-- 图文导航 -->
              <div class="box" v-if="items.type === '6'">
                <div class="left-tip">
                  <span class="left-close" @click="deleted(index)">x</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="拖拽排序"
                    placement="left-start"
                  >
                    <span
                      class="left-span" @click="modifBtn(items, index)"
                    >图文导航</span
                    >
                  </el-tooltip>
                </div>
                <div class="swiper-picture">
                  <swiper
                    v-if="items.rowNum === 1"
                    :options="pictureSwiperOption"
                    ref="mySwiper"
                  >
                    <swiper-slide>
                      <p
                        class="picture-box"
                        v-for="(item, i) in items.data.slice(0, 5)"
                        :key="i"
                      >
                        <span class="img-span">
                          <img
                            v-if="item.imgUrls.length"
                            class="picture-img"
                            :src="item.imgUrls[0].url.includes('http') ? item.imgUrls[0].url : imgCdn + item.imgUrls[0].url"
                          />
                        </span>

                        <span class="picture-name">{{ item.name }}</span>
                      </p>
                    </swiper-slide>
                    <swiper-slide v-if="items.data.length > 5">
                      <p
                        class="picture-box"
                        v-for="(item, i) in items.data.slice(5)"
                        :key="i"
                      >
                        <span class="img-span">
                          <img
                            v-if="item.imgUrls.length"
                            class="picture-img"
                            :src="item.imgUrls[0].url.includes('http') ? item.imgUrls[0].url : imgCdn + item.imgUrls[0].url"
                          />
                        </span>
                        <span class="picture-name">{{ item.name }}</span>
                      </p>
                    </swiper-slide>
                    <div class="swiper-scrollbar" slot="scrollbar"></div>
                  </swiper>

                  <div v-else>
                    <p
                      class="picture-box"
                      v-for="(item, i) in items.data"
                      :key="i"
                    >
                      <span class="img-span">
                        <img
                          v-if="item.imgUrls.length"
                          class="picture-img"
                          :src="item.imgUrls[0].url.includes('http') ? item.imgUrls[0].url : imgCdn + item.imgUrls[0].url"
                        />
                      </span>
                      <span class="picture-name">{{ item.name }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <!-- 每日特惠 -->
              <div class="box" v-else-if="items.type === '2'">
                <div class="left-tip">
                  <span class="left-close" @click="deleted(index)">x</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="拖拽排序"
                    placement="left-start"
                  >
                    <span
                      class="left-span" @click="modifBtn(items, index)"
                    >每日特惠</span
                    >
                  </el-tooltip>
                </div>
                <div class="right-box">
                  <p class="box-top">
                    <span class="label">每日特惠</span>
                    <span style="color: red">{{ countDowns }}</span>
                    <span class="right-label">火热抢购中</span>
                  </p>
                  <div class="box-imgs">
                    <div
                      class="new-imgs"
                      v-for="(img, i) in items.data"
                      :key="i"
                    >
                      <div class="items">
                        <img
                          v-if="img.imgUrls.length"
                          class="item"
                          :src="img.imgUrls[0].url.includes('http') ? img.imgUrls[0].url : imgCdn + img.imgUrls[0].url"
                        />
                      </div>
                      <span
                        v-if="img.lowPrice"
                      >￥{{ img.lowPrice | priceInfo }}</span
                      >
                      <span
                        class="old-price" v-if="img.heightsPrice"
                      >￥{{ img.heightsPrice | priceInfo }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- 横排二 -->
              <div class="box" v-else-if="items.type === '3'">
                <div class="left-tip">
                  <span class="left-close" @click="deleted(index)">x</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="拖拽排序"
                    placement="left-start"
                  >
                    <span
                      class="left-span" @click="modifBtn(items, index)"
                    >{{ items.titleName.user }}
                    </span>
                  </el-tooltip>
                </div>
                <div class="right-box">
                  <p class="box-top">
                    <span class="label">{{ items.titleName.user }}</span>
                    <span class="span-color" style="font-size: 12px">{{
                      items.titleName.subheading
                    }}</span>
                  </p>
                  <div class="box-imgs box-imgs-between">
                    <div
                      class="two-imgs"
                      v-for="(img, i) in items.newData"
                      :key="i"
                    >
                      <div class="name-box">
                        <p v-if="img.firstName" class="first-name">
                          {{ img.firstName }}
                        </p>
                        <p class="span-color last-name" v-if="img.secondName">
                          {{ img.secondName }}
                        </p>
                      </div>

                      <div class="items">
                        <img
                          class="item"
                          v-if="img.imgUrls.length"
                          :src="img.imgUrls[0].url.includes('http') ? img.imgUrls[0].url : imgCdn + img.imgUrls[0].url"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 横排三 -->
              <div class="box" v-else-if="items.type === '4'">
                <div class="left-tip">
                  <span class="left-close" @click="deleted(index)">x</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="拖拽排序"
                    placement="left-start"
                  >
                    <span class="left-span" @click="modifBtn(items, index)">{{
                      items.titleName.user
                    }}</span>
                  </el-tooltip>
                </div>
                <div class="right-box">
                  <p class="box-top">
                    <span class="label">{{ items.titleName.user }}</span>
                    <span class="span-color" style="font-size: 12px">{{
                      items.titleName.subheading
                    }}</span>
                  </p>
                  <div class="box-imgs">
                    <div
                      class="three-imgs"
                      v-for="(img, i) in items.newData"
                      :key="i"
                    >
                      <div class="items">
                        <img
                          class="item"
                          v-if="img.imgUrls.length"
                          :src="img.imgUrls[0].url.includes('http') ? img.imgUrls[0].url : imgCdn + img.imgUrls[0].url"/>
                      </div>
                      <span>{{ img.firstName }}</span>
                      <div class="span-color">{{ img.secondName }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </draggable>
          <!-- 瀑布流 -->
          <div v-for="(items, index) in allInfo" :key="index">
            <div class="box" v-if="items.type === '5'">
              <div class="left-tip">
                <span class="left-close" @click="deleted(index)">x</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="瀑布流"
                  placement="left-start"
                >
                  <span class="left-span" @click="pplBtn(items, index)">{{
                    items.titleName.user
                  }}</span>
                </el-tooltip>
              </div>
              <div class="right-box">
                <p class="box-top">
                  <span class="label">{{ items.titleName.user }}</span>
                  <span class="span-color" style="font-size: 12px">{{
                    items.titleName.subheading
                  }}</span>
                </p>
                <div class="box-imgs box-imgs-between">
                  <div
                    class="ppl-imgs"
                    v-for="(item, k) in items.data"
                    :key="k"
                  >
                    <div class="items">
                      <img class="item" :src="item.picture.includes('http') ? item.picture : imgCdn + item.picture"/>
                    </div>
                    <div class="label">
                      {{ item.name }}
                    </div>
                    <div class="price">¥{{ item.price | priceInfo }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 图片广告 -->
      <el-dialog
        :visible.sync="showImgDialog"
        width="688px"
        class="dialog"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div slot="title">
          <span class="title-tip">图片广告</span>
          <span
            class="title-span"
          >广告图建议尺寸 702*240
            像素图片，广告图按顺序轮播，最多上传10张图片。</span
          >
        </div>
        <img-dialog ref="imgDialogRef" :upGoodsArr="upGoodsArr"></img-dialog>
        <p style="margin-top: 10px;">
          <el-button
            type="primary" size="small" @click="getImgdialogObj"
          >确 认
          </el-button
          >
          <el-button
            size="small" @click="showImgDialog = false"
          >取 消
          </el-button
          >
        </p>
      </el-dialog>
      <!-- 每日特惠 -->
      <el-dialog
        :visible.sync="showDialog.showDailyDialog"
        width="620px"
        class="dialog"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div slot="title">
          <span class="title-tip">每日特惠</span>
          <span
            class="title-span"
          >广告图建议尺寸 160*160
            像素图片，并设置好商品划线价。显示售价默认取商品最低售价</span
          >
        </div>
        <daily-dialog
          ref="dailyDialogRef"
          :upGoodsArr="upGoodsArr"
        ></daily-dialog>
        <p style="margin-top: 10px;">
          <el-button
            size="small" type="primary" @click="getDailyDialogObj"
          >确 认
          </el-button
          >
          <el-button
            size="small" @click="showDialog.showDailyDialog = false"
          >取 消
          </el-button
          >
        </p>
      </el-dialog>
      <!-- 横排二 -->
      <el-dialog
        :visible.sync="showTwoDialog"
        width="583px"
        class="dialog line"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div slot="title">
          <span class="title-tip">{{ titleTwo }}</span>
          <span
            class="title-span"
          >广告图建议尺寸 342*184 像素图片，商品按顺序显示</span
          >
          <p class="title-name">
            <el-form
              :inline="true"
              :model="twoInLine"
              :rules="rules"
              ref="twoForm"
              class="demo-form-inline"
            >
              <el-form-item label="模块名称" prop="user">
                <el-input
                  v-model="twoInLine.user"
                  placeholder="请填写模块名称"
                  size="small"
                  maxlength="6"
                ></el-input>
              </el-form-item>
              <el-form-item label="副标题" style="margin-left: 20px">
                <el-input
                  v-model="twoInLine.subheading"
                  placeholder="请填写副标题"
                  size="small"
                  maxlength="12"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-form>
          </p>
        </div>
        <two-dialog ref="twoDialogRef" :upGoodsArr="upGoodsArr"></two-dialog>
        <p style="margin-top: 10px;">
          <el-button
            size="small" type="primary" @click="getTwoDialogObj"
          >确 认
          </el-button
          >
          <el-button
            size="small" @click="showTwoDialog = false"
          >取 消
          </el-button
          >
        </p>
      </el-dialog>
      <!-- 横排三 -->
      <el-dialog
        :visible.sync="showThreeDialog"
        width="583px"
        class="dialog line"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div slot="title">
          <span class="title-tip">{{ titleThree }}</span>
          <span class="title-span">广告图建议尺寸 224*165 像素图片</span>
          <p class="title-name">
            <el-form
              :inline="true"
              :model="threeInLine"
              :rules="rules"
              ref="threeForm"
              class="demo-form-inline"
            >
              <el-form-item label="模块名称" prop="user">
                <el-input
                  v-model="threeInLine.user"
                  placeholder="请填写模块名称"
                  size="small"
                  maxlength="6"
                ></el-input>
              </el-form-item>
              <el-form-item label="副标题" style="margin-left: 20px">
                <el-input
                  v-model="threeInLine.subheading"
                  placeholder="请填写副标题"
                  size="small"
                  maxlength="12"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-form>
          </p>
        </div>
        <three-dialog
          ref="threeDialogRef"
          :upGoodsArr="upGoodsArr"
        ></three-dialog>
        <p style="margin-top: 10px;">
          <el-button
            size="small" type="primary" @click="getThreeDialogObj"
          >确 认
          </el-button
          >
          <el-button
            size="small" @click="showThreeDialog = false"
          >取 消
          </el-button
          >
        </p>
      </el-dialog>
      <!-- 瀑布流 -->
      <el-dialog
        :visible.sync="showDialog.showLikeDialog"
        width="688px"
        class="line"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        destroy-on-close
        :before-close="getLikeDialogObj"
      >
        <div slot="title">
          <span class="title-tip">{{ titleppl }}</span>
          <span
            class="title-span"
          >此模块只能添加一个，模块默认位置为最后一个，可选择希望展示的上架商品</span
          >
          <p class="title-name">
            <el-form
              :inline="true"
              :model="pplInLine"
              :rules="rules"
              ref="linkForm"
              class="demo-form-inline"
            >
              <el-form-item label="模块名称" prop="user">
                <el-input
                  v-model="pplInLine.user"
                  placeholder="请填写模块名称"
                  size="small"
                  maxlength="6"
                ></el-input>
              </el-form-item>
              <el-form-item label="副标题" style="margin-left: 20px">
                <el-input
                  v-model="pplInLine.subheading"
                  placeholder="请填写副标题"
                  size="small"
                  maxlength="12"
                  style="width:200px"
                ></el-input>
              </el-form-item>
            </el-form>
          </p>
        </div>
        <like-dialog
          v-if="showDialog.showLikeDialog"
          :status="disabledUp"
          ref="likeDialogRef"
          :upGoodsArr="upGoodsArr"
          :titleName="pplInLine"
        ></like-dialog>
        <p style="margin-top: 10px;">
          <el-button
            size="small" type="primary" @click="getLikeDialogObj"
          >确 认
          </el-button
          >
          <!--          <el-button size="small" @click="showDialog.showLikeDialog = false"-->
          <!--            >取 消</el-button-->
          <!--          >-->
        </p>
      </el-dialog>
      <!--图文导航-->
      <el-dialog
        :visible.sync="showPictureDialog"
        width="583px"
        class="dialog line"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <div slot="title">
          <span class="title-tip">图文导航</span>
          <span class="title-span">图片建议尺寸 84*84 像素图片</span>
        </div>
        <picture-dialog
          ref="pictureRef"
          :upGoodsArr="upGoodsArr"
        ></picture-dialog>
        <p style="margin-top: 10px;">
          <el-button
            type="primary" size="small" @click="getPictureDialogObj"
          >确 认
          </el-button
          >
          <el-button
            size="small" @click="showPictureDialog = false"
          >取 消
          </el-button
          >
        </p>
      </el-dialog>
    </div>
    <p class="bottom-btn">
      <el-button
        :disabled="btnLoading" type="primary" size="small" @click="addAllInfo"
      >保存首页
      </el-button
      >
      <el-button
        size="small"
        :disabled="btnLoading || disabledUp"
        @click="upData"
        :class="{ 'up-btn': !disabledUp }"
      >上架
      </el-button
      >
    </p>
  </div>
</template>
<script>
  import imgDialog from './img.dialog.vue'
  import dailyDialog from './daily.dialog.vue'
  import likeDialog from './like.dialog.vue'
  import threeDialog from './three.dialog.vue'
  import twoDialog from './two.dialog.vue'
  import draggable from 'vuedraggable'
  import pictureDialog from './picture.dialog.vue'
  import api from './api'

  export default {
    components: {
      imgDialog,
      dailyDialog,
      likeDialog,
      threeDialog,
      twoDialog,
      draggable,
      pictureDialog,
    },
    data () {
      return {
        api,
        pplInLine: {
          user: '',
          subheading: '',
        },
        threeInLine: {
          user: '',
          subheading: '',
        },
        twoInLine: {
          user: '',
          subheading: '',
        },
        rules: {
          user: [ { required: true, message: '请输入模块名称', trigger: 'blur' } ],
        },
        showBtn: false,
        showImgDialog: false,
        titleppl: '商品推荐-瀑布流',
        titleThree: '商品推荐-横排三',
        showThreeDialog: false,
        showTwoDialog: false,
        titleTwo: '商品推荐-横排二',
        showPictureDialog: false,
        allInfo: [], // 总数据 type: 1/图片广告，2/每日特惠, 3/横排二, 4/横排三/ 5/瀑布流, 6/图片导航
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          // loop: true
        },
        pictureSwiperOption: {
          scrollbar: {
            el: '.swiper-scrollbar',
          },
        },
        showDialog: {
          showDailyDialog: false,
          showLikeDialog: false,
        },
        upGoodsArr: [],
        disabledUp: '',
        countDowns: '', // 倒计时
        pplList: [],
        // 首页模板
        templateArr: [
          {
            data: [
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641110967,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/4aba5b1df9794535b7b330b72a64cbaf.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/4aba5b1df9794535b7b330b72a64cbaf.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/4aba5b1df9794535b7b330b72a64cbaf.png',
                    status: 'success',
                  },
                ],
                selectValue: '',
                id: '',
                label: '',
                url: '',
              },
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641152031,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/273f3215c55a40718f6802861362d857.jpg',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/273f3215c55a40718f6802861362d857.jpg',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/273f3215c55a40718f6802861362d857.jpg',
                    status: 'success',
                  },
                ],
                selectValue: '',
                id: '',
                label: '',
                url: '',
              },
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641131106,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/80c121cc1fe3493ab57b902b92273c96.jpg',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/80c121cc1fe3493ab57b902b92273c96.jpg',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/80c121cc1fe3493ab57b902b92273c96.jpg',
                    status: 'success',
                  },
                ],
                selectValue: '',
                id: '',
                label: '',
                url: '',
              },
            ],
            type: '1',
          },
          {
            data: [
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641177077,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d627694d6560455b82c13ab36e98a8ca.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d627694d6560455b82c13ab36e98a8ca.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d627694d6560455b82c13ab36e98a8ca.png',
                    status: 'success',
                  },
                ],
                lowPrice: '8900',
                heightsPrice: '9900',
                id: '',
              },
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641180209,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/c727492f07fd496db96662133d153880.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/c727492f07fd496db96662133d153880.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/c727492f07fd496db96662133d153880.png',
                    status: 'success',
                  },
                ],
                lowPrice: '9900',
                heightsPrice: '12000',
                id: '',
              },
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641184483,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/ae41f26d991b474a8dc3ae06c910c157.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/ae41f26d991b474a8dc3ae06c910c157.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/ae41f26d991b474a8dc3ae06c910c157.png',
                    status: 'success',
                  },
                ],
                lowPrice: '300',
                heightsPrice: '1000',
                id: '',
              },
              {
                upGoodsName: '',
                imgUrls: [
                  {
                    uid: 1585641187942,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/271b706befbe44058b01c2d8caac32d8.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/271b706befbe44058b01c2d8caac32d8.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/271b706befbe44058b01c2d8caac32d8.png',
                    status: 'success',
                  },
                ],
                lowPrice: '4400',
                heightsPrice: '5500',
                id: '',
              },
            ],
            type: '2',
          },
          {
            titleName: {
              user: '新品专区',
              subheading: '精品上新 快速直发',
            },
            data: [
              {
                upGoodsName: '',
                firstName: '海盐热敷腰带',
                imgUrls: [
                  {
                    uid: 1585641217816,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/21108a6bb6e7458ca72b127d30531af4.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/21108a6bb6e7458ca72b127d30531af4.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/21108a6bb6e7458ca72b127d30531af4.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '全日康旗舰款套装',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '迷你除湿器',
                imgUrls: [
                  {
                    uid: 1585641240794,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a8559270216b42f1a1bff47d80483e2c.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a8559270216b42f1a1bff47d80483e2c.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a8559270216b42f1a1bff47d80483e2c.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '静音舒适新体验',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '蝴蝶按摩靠枕',
                imgUrls: [
                  {
                    uid: 1585641263049,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a7445890aad64464bef3f049ff495284.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a7445890aad64464bef3f049ff495284.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a7445890aad64464bef3f049ff495284.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '柔软支撑全新体验',
                url: '',
                label: '',
                selectValue: '',
              },
            ],
            rowNum: '1',
            type: '4',
            newData: [
              {
                upGoodsName: '',
                firstName: '海盐热敷腰带',
                imgUrls: [
                  {
                    uid: 1585641217816,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/21108a6bb6e7458ca72b127d30531af4.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/21108a6bb6e7458ca72b127d30531af4.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/21108a6bb6e7458ca72b127d30531af4.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '全日康旗舰款套装',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '迷你除湿器',
                imgUrls: [
                  {
                    uid: 1585641240794,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a8559270216b42f1a1bff47d80483e2c.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a8559270216b42f1a1bff47d80483e2c.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a8559270216b42f1a1bff47d80483e2c.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '静音舒适新体验',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '蝴蝶按摩靠枕',
                imgUrls: [
                  {
                    uid: 1585641263049,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a7445890aad64464bef3f049ff495284.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a7445890aad64464bef3f049ff495284.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/a7445890aad64464bef3f049ff495284.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '柔软支撑全新体验',
                url: '',
                label: '',
                selectValue: '',
              },
            ],
          },
          {
            titleName: {
              user: '精选推荐',
              subheading: '品质严选 质量保证',
            },
            data: [
              {
                upGoodsName: '',
                firstName: '碧生源清源茶',
                imgUrls: [
                  {
                    uid: 1585641313663,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/0800ec8c3bf74abbac8806a3bc697a07.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/0800ec8c3bf74abbac8806a3bc697a07.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/0800ec8c3bf74abbac8806a3bc697a07.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '领券最高减80',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '压缩雾化器',
                imgUrls: [
                  {
                    uid: 1585641341593,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/59a20e83aca743ee9ca5bb94719b0c60.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/59a20e83aca743ee9ca5bb94719b0c60.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/59a20e83aca743ee9ca5bb94719b0c60.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '火热直销',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '正骨推拿',
                imgUrls: [
                  {
                    uid: 1585641354015,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/026f16c4abf7453780da73bff6bcab68.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/026f16c4abf7453780da73bff6bcab68.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/026f16c4abf7453780da73bff6bcab68.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '上门服务随时可退',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '基因检测',
                imgUrls: [
                  {
                    uid: 1585641371237,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d235416ed8244a4c968efe8d672b65a3.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d235416ed8244a4c968efe8d672b65a3.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d235416ed8244a4c968efe8d672b65a3.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '热销1万份',
                url: '',
                label: '',
                selectValue: '',
              },
            ],
            rowNum: 2,
            type: '3',
            newData: [
              {
                upGoodsName: '',
                firstName: '碧生源清源茶',
                imgUrls: [
                  {
                    uid: 1585641313663,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/0800ec8c3bf74abbac8806a3bc697a07.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/0800ec8c3bf74abbac8806a3bc697a07.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/0800ec8c3bf74abbac8806a3bc697a07.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '领券最高减80',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '压缩雾化器',
                imgUrls: [
                  {
                    uid: 1585641341593,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/59a20e83aca743ee9ca5bb94719b0c60.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/59a20e83aca743ee9ca5bb94719b0c60.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/59a20e83aca743ee9ca5bb94719b0c60.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '火热直销',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '正骨推拿',
                imgUrls: [
                  {
                    uid: 1585641354015,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/026f16c4abf7453780da73bff6bcab68.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/026f16c4abf7453780da73bff6bcab68.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/026f16c4abf7453780da73bff6bcab68.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '上门服务随时可退',
                url: '',
                label: '',
                selectValue: '',
              },
              {
                upGoodsName: '',
                firstName: '基因检测',
                imgUrls: [
                  {
                    uid: 1585641371237,
                    upload: {
                      url:
                        'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d235416ed8244a4c968efe8d672b65a3.png',
                    },
                    url:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d235416ed8244a4c968efe8d672b65a3.png',
                    fileId:
                      'https://dev-img-cdn.everjiankang.com.cn/5000/mall/d235416ed8244a4c968efe8d672b65a3.png',
                    status: 'success',
                  },
                ],
                id: '',
                secondName: '热销1万份',
                url: '',
                label: '',
                selectValue: '',
              },
            ],
          },
        ],
        imgCdn: localStorage.getItem('IMGCDN'),
        btnLoading: false,
      }
    },
    filters: {
      priceInfo: (a, b = 100) => {
        if (!a) return a.toFixed(2)
        if (!a || !b) return
        let c = 0
        let d = 0
        try {
          c = a.toString().split('.')[1].length
        } catch (f) {
          //
        }
        try {
          d = b.toString().split('.')[1].length
        } catch (f) {
          //
        }
        const fenzi = Number(a.toString().replace('.', '')) * 10 ** (c + d)
        const fenmu = Number(b.toString().replace('.', '')) * 10 ** (c + d)
        return (fenzi / fenmu / 10 ** (c - d)).toFixed(2)
      },
    },
    created () {
      this.getDetails()
      this.getUpGoods()
      this.countDown()
    },
    methods: {
      /**
       获取首页数据
       */
      getDetails () {
        this.allInfo.length = 0
        this.api.getMallHomepageByShopId().then(res => {
          if (res && !res.id) {
            // 如果id没有， 显示模版
            this.allInfo = [ ...this.templateArr ]
          } else if (res && res.componentGoods) {
            let obj = JSON.parse(res.componentGoods)
            this.allInfo.unshift(...obj.list)
            this.disabledUp = Boolean(res.status)
          }
        })
        let params = {
          goodsName: '',
          currentPage: '1',
          pageSize: '9999',
          orderingRule: 1,
        }

        // 获取瀑布流数据
        this.api.findInfiniteScrolling(params).then(res => {
          if (res && res.infiniteList.length) {
            this.pplList.length = 0
            res.infiniteList.forEach(item => {
              let { spuId, picture, price, name } = item
              this.pplList.push({ spuId, picture, price, name })
            })
            let nObj = {
              data: this.pplList,
              type: '5',
              titleName: { user: res.user, subheading: res.subheading },
            }
            this.allInfo.push({ ...nObj })
          } else {
            if (res.user) {
              let nObj = {
                data: [],
                type: '5',
                titleName: { user: res.user, subheading: res.subheading },
              }
              this.allInfo.push({ ...nObj })
            }
          }
        })
      },
      /**
       * 获取轮播图数据
       */
      getImgdialogObj () {
        let data = this.isEmpty(this.$refs.imgDialogRef.imgArr)
        if (data.length) {
          let obj = {
            type: '1',
            data,
          }
          this.isPplDetail(obj, this.$refs.imgDialogRef.index)
        }
        this.showImgDialog = false
      },
      /**
       获取上架商品表格数据
       */
      getUpGoods () {
        let params = { name: '', currentPage: '1', pageSize: 20, repeat: '1' }
        this.api.findSpuByName(params).then(res => {
          if (res) {
            this.upGoodsArr = res
          }
        })
      },
      /**
       * 获取每日特惠数据
       */
      getDailyDialogObj () {
        let data = this.$refs.dailyDialogRef.imgArr
        let obj = {
          type: '2',
          data,
        }
        this.isPplDetail(obj, this.$refs.dailyDialogRef.index)
        this.countDown()
        this.showDialog.showDailyDialog = false
      },

      // 添加轮播
      bannerDialogBtn () {
        this.showImgDialog = true
        this.$nextTick(() => {
          this.$refs.imgDialogRef.imgArr = [
            {
              imgUrls: [],
              selectValue: '',
              url: '',
              label: '',
              upGoodsName: '',
              id: '',
            },
          ]
        })
      },

      // 添加横排二
      twoInLineBtn () {
        this.twoInLine.subheading = ''
        this.twoInLine.user = ''
        this.showTwoDialog = true
        let arr = []
        for (let i = 0; i < 2; i++) {
          arr.push({
            imgUrls: [],
            firstName: '',
            secondName: '',
            upGoodsName: '',
            id: '',
            selectValue: '',
            url: '',
            label: '',
          })
        }
        this.$nextTick(() => {
          this.$refs.twoDialogRef.imgArr = arr
        })
      },

      /**
       * 横排二
       */
      getTwoDialogObj () {
        this.$refs.twoForm.validate(valid => {
          if (valid) {
            let data = this.isEmpty(this.$refs.twoDialogRef.imgArr)
            if (data.length) {
              let obj = {
                type: '3',
                titleName: { ...this.twoInLine },
                data,
                rowNum: this.$refs.twoDialogRef.rowNum,
                newData: data.slice(0, this.$refs.twoDialogRef.rowNum * 2),
              }
              this.isPplDetail(obj, this.$refs.twoDialogRef.index)
            }
            this.showTwoDialog = false
            this.twoInLine.user = ''
            this.twoInLine.subheading = ''
          }
        })
      },

      // 添加横排三
      threeInLineBtn () {
        this.threeInLine.subheading = ''
        this.threeInLine.user = ''
        this.showThreeDialog = true
        let arr = []
        for (let i = 0; i < 3; i++) {
          arr.push({
            imgUrls: [],
            firstName: '',
            secondName: '',
            upGoodsName: '',
            id: '',
            label: '',
            url: '',
            selectValue: '',
          })
        }
        this.$nextTick(() => {
          this.$refs.threeDialogRef.imgArr = arr
        })
      },

      /**
       * 横排三
       */
      getThreeDialogObj () {
        this.$refs.threeForm.validate(valid => {
          if (valid) {
            let data = this.isEmpty(this.$refs.threeDialogRef.imgArr)
            if (data.length) {
              let obj = {
                type: '4',
                titleName: { ...this.threeInLine },
                data,
                rowNum: this.$refs.threeDialogRef.rowNum,
                newData: data.slice(0, this.$refs.threeDialogRef.rowNum * 3),
              }
              this.isPplDetail(obj, this.$refs.threeDialogRef.index)
            }
            this.showThreeDialog = false
            this.threeInLine.user = ''
            this.threeInLine.subheading = ''
          }
        })
      },
      /**
       * 获取瀑布流数据
       */
      async getLikeDialogObj () {
        let params = {
          goodsName: '',
          currentPage: 1,
          pageSize: 9999,
          orderingRule: 1,
        }
        let arr = await this.api.findInfiniteScrolling(params)
        this.pplList.length = 0
        let list = arr.infiniteList
        if (list.length) {
          this.$refs.linkForm.validate(valid => {
            if (valid) {
              let obj = {
                spuId: '',
                picture: '',
                price: '',
                name: '',
              }
              list.forEach(item => {
                obj.spuId = item.spuId
                obj.picture = item.picture
                obj.price = item.price
                obj.name = item.name
                this.pplList.push({ ...obj })
              })
              let newObj = {
                type: '5',
                titleName: { ...this.pplInLine },
                data: this.pplList,
              }
              if (this.$refs.likeDialogRef.index >= 0) {
                this.allInfo[this.$refs.likeDialogRef.index] = { ...newObj }
              } else {
                this.allInfo.push({ ...newObj })
              }
              this.showDialog.showLikeDialog = false
              this.pplInLine.user = ''
              this.pplInLine.subheading = ''
            }
          })
        } else {
          this.showDialog.showLikeDialog = false
        }
      },

      /***
       图文导航
       */
      pictureDialogBtn () {
        this.showPictureDialog = true
        this.$nextTick(() => {
          this.$refs.pictureRef.imgArr = [
            {
              imgUrls: [],
              selectValue: '',
              url: '',
              label: '',
              upGoodsName: '',
              id: '',
              name: '导航名称',
            },
          ]
        })
      },

      /**
       获取图片导航数据
       */
      getPictureDialogObj () {
        // let arr = this.$refs.pictureRef.imgArr
        let data = this.isEmpty(this.$refs.pictureRef.imgArr)
        if (data.length) {
          let obj = {
            type: '6',
            data,
            rowNum: this.$refs.pictureRef.rowNum,
          }
          this.isPplDetail(obj, this.$refs.pictureRef.index)
        }
        this.showPictureDialog = false
      },

      /**
       * 删除模块
       */
      deleted (index) {
        this.allInfo.splice(index, 1)
      },
      /**
       * 判断是否是每日特惠或瀑布流
       */
      isShowDialog (num, dialog, text) {
        let arr = this.allInfo.filter(items => items.type === num)
        if (arr.length) {
          this.$message({
            message: '警告，只能添加一条' + text,
            type: 'warning',
          })
        } else {
          this.showDialog[dialog] = true

          // 如果是每日特惠 初始原始值
          if (dialog === 'showDailyDialog') {
            let arr = []
            for (let i = 0; i < 4; i++) {
              arr.push({
                imgUrls: [],
                upGoodsName: '',
                lowPrice: '',
                heightsPrice: '',
                id: '',
              })
            }
            this.$nextTick(() => {
              this.$refs.dailyDialogRef.imgArr = arr
            })
          }
        }
      },
      /**
       判断是否有瀑布流数据
       */
      isPplDetail (obj, index) {
        if (index >= 0) {
          this.allInfo[index] = { ...obj }
        } else {
          let arr = this.allInfo.filter(item => {
            return item.type === '5'
          })
          if (arr.length) {
            this.allInfo.splice(this.allInfo.length - 1, 0, obj)
          } else {
            this.allInfo.push(obj)
          }
        }
      },

      // 判断添加是否有空值
      isEmpty (val) {
        let newArr = val.filter(items => {
          let valuesArr = Object.values(items)
          let itemArr = valuesArr.filter(item => {
            if (Array.isArray(item)) {
              if (item.length) return item
            } else {
              if (item) return item
            }
          })
          if (itemArr.length) {
            return items
          }
        })
        return newArr
      },

      /**
       * 保存首页
       */
      addAllInfo () {
        this.btnLoading = true
        let list = this.allInfo.filter(item => {
          return item.type !== '5'
        })
        let obj = {
          list: list,
        }
        let params = {
          componentGoods: JSON.stringify(obj),
        }
        this.api.createMallHomepage(params).then(res => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
            })
            this.getDetails()
          }
          setTimeout(() => {
            this.btnLoading = false
          }, 1000)
        })
        let pplList = this.allInfo.filter(item => {
          return item.type === '5'
        })
        if (pplList.length) {
          let spuIdList = []
          pplList[0].data.forEach(item => {
            spuIdList.push(item.spuId)
          })
          let paramsObj = {
            spuIdList,
            user: pplList[0].titleName.user,
            subheading: pplList[0].titleName.subheading,
          }
          this.api.createInfiniteScrolling(paramsObj).then(res => {
          })
        } else {
          let paramsObj = {
            spuIdList: [],
            user: '',
            subheading: '',
          }
          this.api.createInfiniteScrolling(paramsObj).then(res => {
          })
        }
      },
      /**
       上架首页
       */
      upData () {
        this.btnLoading = true
        this.api.updateMallHomePageOnShelf().then(res => {
          if (res) {
            this.$message({
              message: '上架成功',
              type: 'success',
            })
            this.getDetails()
          }
          setTimeout(() => {
            this.btnLoading = false
          }, 1000)
        })
      },
      /**
       修改模块
       */
      modifBtn (item, index) {
        switch (item.type) {
          case '1':
            this.showImgDialog = true
            this.$nextTick(() => {
              this.$refs.imgDialogRef.imgArr = JSON.parse(
                JSON.stringify(item.data),
              )
              this.$refs.imgDialogRef.index = index
            })
            break
          case '2':
            this.showDialog.showDailyDialog = true
            this.$nextTick(() => {
              this.$refs.dailyDialogRef.imgArr = JSON.parse(
                JSON.stringify(item.data),
              )
              for (let i = this.$refs.dailyDialogRef.imgArr.length; i < 4; i++) {
                this.$refs.dailyDialogRef.imgArr.push({
                  imgUrls: [],
                  upGoodsName: '',
                  lowPrice: '',
                  heightsPrice: '',
                  id: '',
                })
              }
              this.$refs.dailyDialogRef.index = index
            })
            break
          case '3':
            this.showTwoDialog = true
            item.data.forEach(items => {
              let keys = Object.keys(items)
              if (!keys.includes('url')) {
                items.url = ''
              }
            })
            this.$nextTick(() => {
              this.$refs.twoDialogRef.imgArr = JSON.parse(
                JSON.stringify(item.data),
              )
              this.$refs.twoDialogRef.index = index
              this.$refs.twoDialogRef.rowNum = item.rowNum
            })
            this.twoInLine = { ...item.titleName }
            break
          case '4':
            this.showThreeDialog = true
            item.data.forEach(items => {
              let keys = Object.keys(items)
              if (!keys.includes('url')) {
                items.url = ''
              }
            })
            this.$nextTick(() => {
              this.$refs.threeDialogRef.imgArr = JSON.parse(
                JSON.stringify(item.data),
              )
              this.$refs.threeDialogRef.index = index
              this.$refs.threeDialogRef.rowNum = item.rowNum
            })
            this.threeInLine = { ...item.titleName }
            break
          case '6':
            this.showPictureDialog = true
            this.$nextTick(() => {
              this.$refs.pictureRef.rowNum = item.rowNum
              this.$refs.pictureRef.index = index
              this.$refs.pictureRef.imgArr = JSON.parse(
                JSON.stringify(item.data),
              )
            })
            break
        }
      },
      // 修改瀑布流
      pplBtn (items, index) {
        this.showDialog.showLikeDialog = true
        this.pplInLine = { ...items.titleName }
        this.$nextTick(() => {
          this.$refs.likeDialogRef.index = index
        })
      },
      // 倒计时
      countDown () {
        function info (t) {
          // let newT = ''
          // return (newT = t < 10 ? '0' + t : t)
          return t < 10 ? '0' + t : t
        }

        setInterval(() => {
          let dayTime =
            new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
          let newTime = +new Date()
          let leftTime = (dayTime - newTime) / 1000
          let h = info(Math.floor((leftTime / (60 * 60)) % 24))
          let m = info(Math.floor((leftTime / 60) % 60))
          let s = info(Math.floor(leftTime % 60))
          this.countDowns = h + ':' + m + ':' + s
        }, 1000)
      },
    },
  }
</script>
<style lang="less" scoped>
  .swiper {
    .swiper-container {
      width: 375px;
      height: 150px;

      .swiper-img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .swiper-picture {
    .swiper-container {
      width: 375px;
      height: 100px;

      .swiper-scrollbar {
        width: 20% !important;
        left: 40% !important;

        & /deep/ .swiper-scrollbar-drag {
          background: #f5222d !important;
          border-radius: 3px !important;
        }
      }
    }

    .picture-box {
      display: inline-block;
      width: 60px;
      text-align: center;
      margin: 0 7px 10px;

      .img-span {
        display: inline-block;
        width: 100%;
        height: 60px;

        .picture-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .picture-name {
        font-size: 12px;
      }
    }
  }

  .mall-container {
    overflow: auto;
    .bg-img {
      margin: 0 auto;
      width: 375px;
      padding: 10px 10px 0;
      background: #fff;
    }

    .mall {
      width: 375px;
      min-height: 300px;
      padding: 10px;
      margin: 0 auto 50px;
      background: #fff;

      .show-container {
        position: relative;

        .add-btn {
          position: absolute;
          right: -60px;
          top: -8px;
          color: #1c7bef;
          cursor: pointer;

          .add-span {
            display: inline-block;
            width: 26px;
            height: 26px;
            line-height: 22px;
            color: #fff;
            background: #1c7bef;
            font-size: 20px;
            text-align: center;
            border-radius: 50%;
          }

          &::before {
            content: "";
            display: inline-block;
            width: 25px;
            height: 5px;
            border-top: 1px solid #1c7bef;
          }

          .all-btn {
            padding: 10px;
            background: #fff;
            position: absolute;
            top: -5px;
            right: -110px;
            border: 1px solid #e5e5e5;

            &::before {
              content: "";
              position: absolute;
              width: 7px;
              height: 7px;
              border: 1px solid #e5e5e5;
              transform: rotate(45deg);
              left: -5px;
              background: #fff;
              border-top: transparent;
              border-right: transparent;
            }

            p {
              margin: 10px 0;

              /deep/ .btn {
                width: 70px;
                padding: 5px;
              }
            }
          }
        }
      }

      .box {
        margin: 20px 0;
        position: relative;

        .left-tip {
          position: absolute;
          left: -109px;
          top: 0;
          color: #fff;
          font-size: 14px;
          height: 100%;
          border-right: 5px solid #1c7bef;

          .left-span {
            display: inline-block;
            padding: 5px;
            background: #1c7bef;
            width: 85px;
            text-align: center;
            cursor: pointer;
          }

          .left-close {
            position: absolute;
            top: -30px;
            right: 0px;
            width: 20px;
            height: 20px;
            background: #999;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            padding: 5px;
            cursor: pointer;
            display: none;

            &:hover {
              background: #1c7bef;
            }
          }

          &:hover .left-close {
            display: block;
          }
        }

        .right-box {
          width: 100%;
        }

        .box-top {
          height: 20px;
          line-height: 20px;

          .label {
            font-size: 18px;
            font-weight: 700;
            margin-right: 10px;
          }

          .right-label {
            font-size: 14px;
            float: right;
          }
        }

        .box-imgs {
          margin-top: 10px;
          display: flex;
          // justify-content: space-between;
          flex-wrap: wrap;
        }

        .box-imgs-between {
          justify-content: space-between;
        }
      }
    }

    .new-imgs {
      width: 85px;
      height: 125px;
      margin-left: 8px;

      .items {
        width: 100%;
        height: 85px;

        .item {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }

      .old-price {
        display: block;
        text-decoration: line-through;
        color: #999;
        font-size: 14px;
      }
    }

    .three-imgs {
      width: 120px;
      height: 115px;
      margin: 5px 0 5px 5px;

      .items {
        width: 100%;
        height: 70px;

        .item {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
    }

    .two-imgs {
      width: 180px;
      height: 110px;
      background: #f9f9f9;
      position: relative;
      margin: 5px 0;

      .name-box {
        padding-left: 15px;

        .first-name {
          margin-top: 17px;
        }
        .last-name {
          margin: 10px 45px 0 0;
        }
      }

      .items {
        width: 50px;
        height: 60px;
        position: absolute;
        bottom: 0;
        right: 0;

        .item {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
    }

    .ppl-imgs {
      width: 180px;
      margin: 5px 0;

      .items {
        width: 100%;
        height: 140px;

        .item {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }

      .label {
        font-size: 14px;
        margin: 10px;
      }

      .price {
        color: red;
        font-size: 20px;
        margin-left: 10px;
      }
    }

    .title-tip {
      font-size: 16px;
    }

    .title-span {
      font-size: 11px;
      margin-left: 10px;
      color: #999;
    }

    .title-name {
      margin: 20px 0 0;
    }

    /deep/ .line > .el-dialog > .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
      padding: 20px 10px 10px;
    }

    /deep/ .dialog > .el-dialog {
      background: #f5f5f5 !important;
    }
  }

  .bottom-btn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.23);
    text-align: center;
    position: fixed;
    bottom: -30px;
    left: 0;
    right: 0;
    z-index: 1;

    .up-btn {
      color: #000;
      border: 1px solid #999;
    }
  }
</style>
