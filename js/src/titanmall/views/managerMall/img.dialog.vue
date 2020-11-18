<template>
  <div>
    <draggable v-model="imgArr">
      <div class="region close" v-for="(items, index) in imgArr" :key="index">
        <span class="close-span" @click="handleDeleted(index)">X</span>
        <div class="img-container">
          <div class="up-img">
            <up-image
              :index="index"
              @addImg="addImg"
              :imgUrl="items.imgUrls.length ? items.imgUrls[0].url : ''"
              :isMany="false"
            ></up-image>
          </div>
          <div style="flex-grow: 1">
            <p>
              <span class="mr">跳转路径</span>
              <el-select
                v-model="items.selectValue"
                placeholder="请选择"
                size="small"
                @change="val => changeSelect(val, index)"
              >
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </p>
            <p v-if="items.selectValue" style="margin-top: 10px">
              <span :class="{ mr: true, 'tag-label': items.upGoodsName }">{{
                items.label
              }}</span>
              <el-input
                v-if="items.label === '跳转网址'"
                v-model="items.url"
                size="small"
                style="width: 80%"
                clearable
              ></el-input>
              <span v-else-if="items.label === '上架商品'" class="tag-text">
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
                  >{{ items.upGoodsName }}</el-tag
                  >
                </el-tooltip>
                <el-button
                  v-else
                  type="primary"
                  size="small"
                  @click="addGoods(index)"
                >添加商品</el-button
                >
              </span>
              <span v-else class="tag-text">
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
                  >{{ items.upGoodsName }}</el-tag
                  >
                </el-tooltip>
                <el-button
                  v-else
                  type="primary"
                  size="small"
                  @click="addGroup(index)"
                >添加分组</el-button
                >
              </span>
            </p>
          </div>
        </div>
      </div>
    </draggable>
    <el-button @click="handleAddImg" size="small">添加背景图</el-button>
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
    <el-dialog
      :visible.sync="groupDialog"
      width="50%"
      destroy-on-close
      title="请选择商品分组"
      :modal="false"
    >
      <grouping-table :type="2" ref="groupRef"></grouping-table>
      <p style="margin-top: 10px;">
        <el-button
          size="small" type="primary" @click="sendGroupBtn"
        >确 认
        </el-button
        >
        <el-button size="small" @click="groupDialog = false">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import upGoods from './up.goods.vue'
  import draggable from 'vuedraggable'
  import groupingTable from '@/titanmall/components/group.table'
  import upImage from '@/titanmall/components/upimage'

  export default {
    components: {
      upGoods,
      draggable,
      groupingTable,
      upImage,
    },
    props: [ 'upGoodsArr' ],
    data () {
      return {
        imgDialog: true,
        formObj: {
          fileArr: [],
        },
        selectOptions: [
          { value: 1, label: '上架商品' },
          { value: 2, label: '跳转网址' },
          { value: 3, label: '商品分组' },
        ],
        imgArr: [],
        showUpDialog: false,
        indexValue: '', // 下标
        index: '-1',
        groupDialog: false,
      }
    },
    methods: {
      // 添加图片返回结果
      addImg (index, url) {
        if (url) {
          this.imgArr[index].imgUrls = [ { url, fileId: url } ]
        } else {
          this.imgArr[index].imgUrls.length = 0
        }
      },

      changeSelect (val, index) {
        this.imgArr[index].url = ''
        this.imgArr[index].upGoodsName = ''
        let newArr = this.selectOptions.filter(item => {
          return item.value === val
        })
        this.imgArr[index].label = newArr[0].label
      },
      /**
       * 添加背景图
       */
      handleAddImg () {
        if (this.imgArr.length >= 10) return
        this.imgArr.push({
          imgUrls: [],
          selectValue: '',
          url: '',
          label: '',
          upGoodsName: '',
          id: '',
        })
      },
      /**
       * 删除
       */
      handleDeleted (index) {
        if (this.imgArr.length === 1) return
        this.imgArr.splice(index, 1)
      },
      /**
       * 删除标签
       */
      handleClose (tag, index) {
        this.imgArr[index].upGoodsName = ''
        this.imgArr[index].id = ''
      },
      addGoods (index) {
        this.showUpDialog = true
        this.indexValue = index
      },

      // 选择上架商品
      getUpDialog () {
        this.imgArr[ this.indexValue ].upGoodsName = this.$refs.upGoodsRef.value.name
        this.imgArr[this.indexValue].id = this.$refs.upGoodsRef.value.spuId
        this.showUpDialog = false
      },

      // 添加分组
      addGroup (index) {
        this.groupDialog = true
        this.indexValue = index
      },

      // 选择商品分组
      sendGroupBtn () {
        let obj = this.$refs.groupRef.rowInfo
        this.imgArr[this.indexValue].upGoodsName = obj.name
        this.imgArr[this.indexValue].id = obj.id
        this.groupDialog = false
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

    .img-container {
      display: flex;
      margin-bottom: 10px;

      /deep/ .upload-img .card_only .el-upload-list .el-upload-list__item {
        width: 190px;
        height: 70px;
      }

      .up-img {
        width: 190px;
        margin-right: 10px;

        /deep/ .imgs-container {
          .img-box {
            height: 70px;

            .el-image.img-container {
              height: 100%;
            }
          }

          .add-img {
            width: 190px;
            height: 70px;
            line-height: 70px;
          }
        }
      }

      .tag-label {
        position: relative;
        top: -12px;
      }

      .tag-text {
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

    .mr {
      margin-right: 10px;
    }
  }
</style>
