<template>
  <div class="imgtitle">
    <AddContent
        style="width: 440px;"
        v-show="!showAddItem"
        title="图片标题"
        :show-close-btn="!!editData.id"
        @sureEdit="sureEdit"
        @sureDel="sureDel"
        @sureClose="sureClose"
    >
      <div class="imgtitle-content">
        <p class="box-section-title">展现形式</p>
        <section style="margin-bottom: 20px;">
          <SelectNav :gutter="20" :data="selectNavData" v-model="commonData.styleType"></SelectNav>
        </section>
        <AddModuleTitle
            :show="commonData.showTitle"
            :title="commonData.title"
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
      </div>
      <p class="box-section-title">可拖动排序，双击编辑</p>
      <section>
        <el-row :gutter="elGutter">
          <Draggable v-model="commonData.moduleArr" group="module" @change="onSort">
            <el-col
                style="margin-bottom: 10px;"
                :span="elSpan"
                :key="index"
                v-for="(item, index) in commonData.moduleArr">
              <BoxClose style="width: auto;" :showClose="commonData.moduleArr.length > 1" @close="delItem(index)">
                <AddImgTitleItem
                    @dblclick.native="editItem(item, index)"
                    type="1"
                    :cell="commonData.styleType"
                    :itemData="item">
                </AddImgTitleItem>
              </BoxClose>
            </el-col>
          </Draggable>
          <el-col :span="elSpan">
            <AddImgTitleItem @click.native="addItem" :cell="commonData.styleType"></AddImgTitleItem>
          </el-col>
        </el-row>
      </section>
    </AddContent>
    <AddImgTitleNext
        v-if="showAddItem"
        :styleType="commonData.styleType"
        :editData="editItemData"
        @addSure="addItemSure"
        @addCancel="addItemCancel"
        @editSure="editItemSure"
    >
    </AddImgTitleNext>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddContent from './base/add.content'
import SelectNav from './base/select.nav'
import AddImgTitleItem from './add.imgtitle.item'
import AddImgTitleNext from './add.imgtitle.next'
import AddModuleTitle from './base/add.module.title'
import MuduleCtrl from './base/module.ctrl'
import BoxClose from './base/box.close'

import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'
import { selectNavData, cellTypes } from '../assets/json/img-title-types'

import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'

let currentEditItem = -1

export default {
  name: 'add.imgtitle',
  components: {
    AddContent,
    SelectNav,
    AddImgTitleItem,
    AddImgTitleNext,
    Draggable,
    AddModuleTitle,
    BoxClose,
    MuduleCtrl
  },
  mixins: [operation, moduleTitle],
  data () {
    return {
      selectNavData: selectNavData,
      commonData: {
        styleType: cellTypes.two,
        showTitle: moduleShowTtitle.hide,
        title: '',
        moduleArr: [],
      },
      showAddItem: false,
      editItemData: null
    }
  },
  computed: {
    elSpan () {
      return 24 / Number(this.commonData.styleType)
    },
    elGutter () {
      switch (this.commonData.styleType) {
        case cellTypes.one:
          return 0
        case cellTypes.two:
          return 12
        case cellTypes.three:
          return 8
        default:
          return 0
      }
    }
  },
  created () {
    this._setModuleInfo(homeSection.image, '图片标题')
  },
  methods: {
    editItem (data, index) {
      currentEditItem = index
      this.editItemData = data
      this.showAddItem = true
    },
    editItemSure (data) {
      this.$set(this.commonData.moduleArr, currentEditItem, data)
      this.editItemData = null
      this.showAddItem = false
      this._edit()
    },
    addItem () {
      this.showAddItem = true
    },
    addItemCancel () {
      this.showAddItem = false
      this.editItemData = null
    },
    addItemSure (data) {
      this.commonData.moduleArr.push(data)
      this.showAddItem = false
      this._edit()
    },
    delItem (index) {
      this.commonData.moduleArr.splice(index, 1)
      this._edit()
    },
    onSort () {
      this._edit()
    }
  }
}
</script>
<style>
  .add-item-content .el-textarea__inner{
    border: none;
    resize: none;
    padding: 10px 0;
    min-height: 40px !important;
    height: 40px;
    color: #333333;
  }
</style>
<style scoped lang="less">
  @import "../assets/css/form-list";
  section{
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .imgtitle-content{
    width: 440px;
  }
</style>
