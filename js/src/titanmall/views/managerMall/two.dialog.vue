<template>
  <div>
    <p style="margin-bottom: 10px">
      <span class="span-color">显示排数</span>
      <el-select v-model="rowNum" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </p>
    <draggable v-model="imgArr">
      <div class="region close" v-for="(items, index) in imgArr" :key="index">
        <span class="close-span" @click="handleDeleted(index)">X</span>
        <div class="daily-container">
          <div class="daily-img">
            <up-image
              :index="index"
              @addImg="addImg"
              :imgUrl="items.imgUrls.length ? items.imgUrls[0].url : ''"
              :isMany="false"
            ></up-image>
          </div>
          <div style="flex-grow: 1">
            <p class="mt">
              <span class="span-color span-w">主文案</span>
              <el-input
                v-model="items.firstName"
                size="small"
                class="input-w"
                maxlength="6"
              ></el-input>
            </p>
            <p class="mt">
              <span class="span-color span-w">副文案</span>
              <el-input
                v-model="items.secondName"
                size="small"
                class="input-w"
                maxlength="12"
              ></el-input>
            </p>
            <div>
              <p class="mt">
                <span class="span-color span-w">跳转路径</span>
                <el-select
                  v-model="items.selectValue"
                  placeholder="请选择"
                  size="small"
                  style="width: 81%"
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
              <p class="mt tag-text" v-if="items.selectValue">
                <span
                  :class="{
                    mr: true,
                    'span-w': true,
                    'span-color': true,
                    'tag-label': items.upGoodsName
                  }"
                >{{ items.label }}</span
                >
                <el-input
                  v-if="items.label === '跳转网址'"
                  v-model="items.url"
                  size="small"
                  class="input-w"
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
      </div>
    </draggable>
    <p v-if="imgArr.length < 6">
      <el-button size="small" @click="addMallBtn">添加商品</el-button>
    </p>
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
        imgArr: [
          // {
          //   imgUrls: [],
          //   firstName: "",
          //   secondName: "",
          //   upGoodsName: "",
          //   id: "",
          //   selectValue: "",
          //   url: "",
          //   label: ""
          // },
          // {
          //   imgUrls: [],
          //   firstName: "",
          //   secondName: "",
          //   upGoodsName: "",
          //   id: "",
          //   selectValue: "",
          //   url: "",
          //   label: ""
          // }
        ],
        rowNum: '1',
        options: [
          { value: 1, label: '1排' },
          { value: 2, label: '2排' },
          { value: 3, label: '3排' },
        ],
        showUpDialog: false,
        indexValue: '',
        index: '-1',
        groupDialog: false,
      }
    },
    methods: {
      uploadSuccess: function (file, index) {
        // 上传成功赋值
        this.imgArr[index].imgUrls = [
          { url: file.fileUrl, fileId: file.fileUrl },
        ]
      },
      fileList: function (file, index) {
        // 删除赋值
        if (file.length === 0) {
          this.imgArr[index].imgUrls = []
        } else {
          this.imgArr[index].imgUrls = file
        }
      },
      /**
       * 删除
       */
      handleDeleted (index) {
        this.imgArr.splice(index, 1)
      },
      getUpDialog () {
        this.imgArr[this.indexValue].upGoodsName = this.$refs.upGoodsRef.value.name
        this.imgArr[this.indexValue].id = this.$refs.upGoodsRef.value.spuId
        this.showUpDialog = false
      },
      /**
       * 删除标签
       */
      handleClose (tag, index) {
        this.imgArr[index].upGoodsName = ''
      },
      addGoods (index) {
        this.showUpDialog = true
        this.indexValue = index
      },
      /**
       添加商品
       */
      addMallBtn () {
        let obj = {
          imgUrls: [],
          firstName: '',
          secondName: '',
          upGoodsName: '',
          id: '',
          selectValue: '',
          url: '',
          label: '',
        }
        this.imgArr.push({ ...obj })
      },

      // 选择跳转路径
      changeSelect (val, index) {
        this.imgArr[index].url = ''
        this.imgArr[index].id = ''
        this.imgArr[index].upGoodsName = ''
        let newArr = this.selectOptions.filter(item => {
          return item.value === val
        })
        this.imgArr[index].label = newArr[0].label
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

      // 添加图片返回结果
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

      /deep/ .daily-img {
        margin-right: 10px;
        display: flex;
        justify-content: center;
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

    .mt {
      margin-top: 10px;
    }

    .mr {
      margin-right: 10px;
    }

    .input-w {
      width: 80%;
    }

    .span-w {
      display: inline-block;
      width: 60px;
      text-align: right;
    }
  }
</style>
