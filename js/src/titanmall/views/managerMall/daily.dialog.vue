<template>
  <div>
    <draggable v-model="imgArr">
      <div class="region close" v-for="(items, index) in imgArr" :key="index">
        <span class="close-span" @click="handleDeleted(index)">X</span>
        <div class="daily-container">
          <div class="daily-img">
            <up-image
              :index="index"
              @addImg="addImg"
              :imgUrl="items.imgUrls.length ? items.imgUrls[0].url : ''"
              :ref="'upImageRef' + index"
              :isMany="false"
            ></up-image>
          </div>
          <div class="tag-box">
            <p class="tag-text">
              <span
                :class="{
                  'span-color': true,
                  'tag-label': items.upGoodsName
                }"
              >上架商品</span
              >
              <el-tooltip
                v-if="items.upGoodsName"
                effect="dark"
                :content="items.upGoodsName"
                placement="top"
              >
                <el-tag
                  class="tag"
                  closable
                  disable-transitions
                  @close="tag => handleClose(tag, index)"
                >{{ items.upGoodsName }}
                </el-tag
                >
              </el-tooltip>
              <el-button
                v-else
                type="primary"
                size="small"
                class="ml"
                @click="addGoods(index)"
              >添加商品
              </el-button
              >
            </p>
          </div>
        </div>
      </div>
    </draggable>
    <el-dialog
      :visible.sync="showUpDialog"
      width="50%"
      destroy-on-close
      title="已上架商品"
      :modal="false"
    >
      <up-goods ref="upGoodsRef" :upGoodsArr="upGoodsArr"></up-goods>
      <p style="margin-top: 10px;">
        <el-button
          size="small" type="primary" @click="getUpDialog"
        >确 认
        </el-button
        >
        <el-button size="small" @click="showUpDialog = false">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import upGoods from './up.goods.vue'
  import draggable from 'vuedraggable'
  import upImage from '@/titanmall/components/upimage'

  export default {
    components: {
      upGoods,
      draggable,
      upImage,
    },
    props: [ 'upGoodsArr' ],
    data () {
      return {
        imgDialog: true,
        formObj: {
          fileArr: [],
        },
        imgArr: [
          // {
          //   imgUrls: [],
          //   upGoodsName: "",
          //   lowPrice: "",
          //   heightsPrice: "",
          //   id: ""
          // },
          // {
          //   imgUrls: [],
          //   upGoodsName: "",
          //   lowPrice: "",
          //   heightsPrice: "",
          //   id: ""
          // },
          // {
          //   imgUrls: [],
          //   upGoodsName: "",
          //   lowPrice: "",
          //   heightsPrice: "",
          //   id: ""
          // },
          // {
          //   imgUrls: [],
          //   upGoodsName: "",
          //   lowPrice: "",
          //   heightsPrice: "",
          //   id: ""
          // }
        ],
        showUpDialog: false,
        index: '-1',
      }
    },
    methods: {
      /**
       * 删除
       */
      handleDeleted (index) {
        let ref = 'upImageRef' + index
        this.$refs[ref][0].url = ''
        this.handleClose('', index)
      },
      /**
       * 删除标签
       */
      handleClose (tag, index) {
        this.imgArr[index].upGoodsName = ''
        this.imgArr[index].lowPrice = ''
        this.imgArr[index].heightsPrice = ''
        this.imgArr[index].id = ''
      },
      addGoods (index) {
        this.showUpDialog = true
        this.indexValue = index
      },
      getUpDialog () {
        this.imgArr[ this.indexValue ].upGoodsName = this.$refs.upGoodsRef.value.name
        this.imgArr[ this.indexValue ].lowPrice = this.$refs.upGoodsRef.value.minimumPrice
        this.imgArr[ this.indexValue ].heightsPrice = this.$refs.upGoodsRef.value.markingPrice
        this.imgArr[this.indexValue].id = this.$refs.upGoodsRef.value.spuId
        this.showUpDialog = false
      },

      // 添加或删除图片返回结果
      addImg (index, url) {
        if (url) {
          this.imgArr[index].imgUrls = [ { url, fileId: url } ]
        } else {
          this.imgArr[index].imgUrls.length = 0
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .close {
    position: relative;

    &:hover .close-span {
      display: block;
    }

    .close-span {
      color: #fff;
      background: #999;
      border-radius: 50%;
      position: absolute;
      padding: 1px 5px;
      top: -5px;
      right: -5px;
      cursor: pointer;
      display: none;
    }

    .daily-container {
      display: flex;
      margin-bottom: 10px;

      /deep/ .daily-img {
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 10px;

        /deep/ .imgs-container .img-box {
          width: 74px;
          height: 74px;

          img {
            width: 74px;
            height: 74px;
          }
        }
      }

      .tag-box {
        display: flex;
        align-items: flex-end;

        .tag-text {
          .tag-label {
            position: relative;
            top: -12px;
          }

          .tag {
            max-width: 327px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            padding-right: 20px !important;

            /deep/ .el-tag__close.el-icon-close {
              position: absolute !important;
              right: 2px !important;
              top: 7px !important;
            }
          }
        }
      }
    }

    .ml {
      margin-left: 10px;
    }
  }
</style>
