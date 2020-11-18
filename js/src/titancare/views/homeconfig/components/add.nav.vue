<template>
  <div class="add-nav">
    <AddContent
        v-show="!showAddItem"
        title="导航"
        @sureEdit="sureEdit"
        @sureClose="sureClose"
    >
      <div class="add-nav-content">
        <p class="box-section-title">展现形式</p>
        <section>
          <SelectNav @change="_edit" :gutter="20" :data="selectNavData" v-model="commonData.styleType"></SelectNav>
        </section>
      </div>
      <p class="box-section-title">可拖动排序，双击编辑</p>
      <section>
        <div :class="navlistStyle">
          <Draggable v-model="commonData.moduleArr" group="module" @change="onSort">
            <div class="nav-item" :key="index" v-for="(item, index) in commonData.moduleArr" @dblclick="editItem(item, index)">
              <BoxClose :showClose="commonData.moduleArr.length > 1" @close="delItem(index)">
                <div class="nav-item-content">
                  <div class="nav-icon">
                    <ever-image
                      style="width: 100%;height: 100%;"
                      :src="item.img"
                    >

                    </ever-image>
                  </div>
                  <p class="nav-title">{{item.title}}</p>
                  <p class="nav-desc" v-if="commonData.styleType === cellTypes.col">{{item.desc}}</p>
                </div>
              </BoxClose>
            </div>
          </Draggable>
        </div>
      </section>
      <section style="margin-bottom: 20px;">
        <div class="add-btn-wrap" :class="addBtnStyle" @click="addItem">
          <i class="el-icon-plus"></i>
        </div>
      </section>
    </AddContent>
    <AddNavNext
        v-if="showAddItem"
        :styleType="commonData.styleType"
        :editData="editItemData"
        @addSure="addItemSure"
        @addCancel="addItemCancel"
        @editSure="editItemSure"
    >
    </AddNavNext>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddContent from '../components/base/add.content'
import SelectNav from '../components/base/select.nav'
import AddNavNext from '../components/add.nav.next'
import BoxClose from '../components/base/box.close'

import { selectNavData, cellTypes } from '../assets/json/nav-types'
import { homeSection } from '../assets/json/homeSection'

import operation from '../mixins/operation'
import filePath from '../mixins/filePath'

let currentEditItem = -1

export default {
  name: 'add.nav',
  components: {
    Draggable,
    AddContent,
    SelectNav,
    AddNavNext,
    BoxClose
  },
  mixins: [operation, filePath],
  data () {
    return {
      cellTypes: cellTypes,
      selectNavData: selectNavData,
      commonData: {
        styleType: cellTypes.row,
        moduleArr: []
      },
      showAddItem: false,
      editItemData: null
    }
  },
  computed: {
    navlistStyle () {
      return this.commonData.styleType === cellTypes.col ? 'navlist-col' : 'navlist-row'
    },
    addBtnStyle () {
      return this.commonData.styleType === cellTypes.col ? 'add-btn-col' : 'add-btn-row'
    }
  },
  created () {
    this._setModuleInfo(homeSection.nav, '导航')
  },
  methods: {
    delItem (index) {
      this.commonData.moduleArr.splice(index, 1)
      this._edit()
    },
    editItem (data, index) {
      currentEditItem = index
      this.editItemData = data
      this.showAddItem = true
    },
    addItem () {
      this.showAddItem = true
    },
    editItemSure (data) {
      this.$set(this.commonData.moduleArr, currentEditItem, data)
      this.editItemData = null
      this.showAddItem = false
      this._edit()
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
    onSort () {
      this._edit()
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/css/form-list";
  section{
    padding: 0 20px;
  }
  .add-nav{
    width: 420px;
  }
  .add-btn-wrap{
    border-radius: 17px;
    background: #FFFFFF;
    border: 1px dashed #cccccc;
    font-size: 18px;
    text-align: center;
    color: #999;
    cursor: pointer;
  }
  .add-btn-row{
    width: 64px;
    height: 64px;
    line-height: 64px;
    margin-left: 6px;
  }
  .add-btn-col{
    height: 94px;
    line-height: 94px;
  }
  .navlist-row{
    .nav-item{
      display: inline-block;
      width: 20%;
      box-sizing: border-box;
      margin-bottom: 10px;
      text-align: center;
      .nav-item-content{
        text-align: center;
        line-height: 1;
        .nav-icon{
          width: 64px;
          height: 64px;
          display: inline-block;
          border-radius: 17px;
          overflow: hidden;
        }
        .nav-title{
          margin-top: 2px;
          font-size: 12px;
          color: #333333;
          text-align: center;
        }
      }
    }
  }
  .navlist-col{
    .nav-item{
      margin-bottom: 10px;
      background: #fff;
      box-sizing: border-box;
      border: 1px dashed #cccccc;
      .nav-item-content{
        position: relative;
        padding-left: 74px;
        margin: 15px;
        height: 64px;
        overflow: hidden;
        .nav-icon{
          width: 64px;
          height: 64px;
          border-radius: 17px;
          overflow: hidden;
          position: absolute;
          left: 0;
          top: 0;
        }
        .nav-title{
          margin-top: 14px;
          font-size: 14px;
          color: #333333;
        }
        .nav-desc{
          font-size: 12px;
          color: #798192;
          margin-top: 10px;
        }
      }
    }
  }
</style>
