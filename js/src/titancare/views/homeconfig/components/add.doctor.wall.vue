<template>
  <div>
    <AddContent
        v-show="!showAddDoctor"
        title="专家墙"
        :show-close-btn="!!editData.id"
        @sureEdit="sureEdit"
        @sureDel="sureDel"
        @sureClose="sureClose"
    >
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
      <p class="box-section-title">可拖动排序，双击编辑</p>
      <section>
        <div class="doctor-list menu-box">
          <Draggable v-model="commonData.moduleArr" group="module" @change="onSort">
            <div class="doctor-item" :key="item.id" v-for="(item, index) in commonData.moduleArr" @dblclick="editDoctor(item, index)">
              <BoxClose :showClose="commonData.moduleArr.length > 1" @close="delDoctor(index)">
                <div class="img-wrap">
                  <ever-image style="width: 100%;height: 100%;" :src="item.img"></ever-image>
                </div>
                <p class="title">{{item.title}}</p>
                <p class="desc">{{item.desc}}</p>
              </BoxClose>
            </div>
          </Draggable>
        </div>
      </section>
      <section v-show="commonData.moduleArr.length < 10">
        <div style="padding-bottom: 20px;margin-top: 16px;">
          <el-button size="small" @click="addDoctor">
            <span>+</span> 添加专家位
          </el-button>
          <p class="box-section-title" style="display: inline-block">专家位数量在4-10之间</p>
        </div>
      </section>
    </AddContent>
    <AddDoctorWallNext
        v-if="showAddDoctor"
        :editData="currentDoctor"
        @editSure="editDoctorSure"
        @addSure="addDoctorSure"
        @addCancel="addDoctorCancel"
    >
    </AddDoctorWallNext>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddContent from './base/add.content'
import AddDoctorWallNext from './add.doctor.wall.next'
import BoxClose from './base/box.close'
import AddModuleTitle from './base/add.module.title'
import MuduleCtrl from './base/module.ctrl'

import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'

import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'
import filePath from '../mixins/filePath'

let currentIndex = -1

export default {
  name: 'add.doctor.wall',
  components: {
    Draggable,
    AddContent,
    AddDoctorWallNext,
    BoxClose,
    AddModuleTitle,
    MuduleCtrl
  },
  mixins: [operation, moduleTitle, filePath],
  data () {
    return {
      commonData: {
        showTitle: moduleShowTtitle.hide,
        title: '',
        moduleArr: [],
      },
      showAddDoctor: false,
      currentDoctor: null
    }
  },
  created () {
    this._setModuleInfo(homeSection.doctorWall, '专家墙')
  },
  methods: {
    addDoctor () {
      this.showAddDoctor = true
    },
    addDoctorSure (data) {
      this.commonData.moduleArr.push(data)
      this.showAddDoctor = false
      this._edit()
    },
    addDoctorCancel () {
      this.showAddDoctor = false
      this.currentDoctor = null
    },
    editDoctor (data, index) {
      currentIndex = index
      this.currentDoctor = { ...data }
      this.showAddDoctor = true
    },
    editDoctorSure (data) {
      this.$set(this.commonData.moduleArr, currentIndex, data)
      this.showAddDoctor = false
      this.currentDoctor = null
      this._edit()
    },
    delDoctor (index) {
      this.commonData.moduleArr.splice(index, 1)
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
  .form-list{
    border-top: none;
  }
  .doctor-list{
    white-space: nowrap;
    width: 400px;
    overflow-x: auto;
    padding: 10px 0;
    .doctor-item{
      display: inline-block;
      margin-right: 15px;
      cursor: pointer;
      .img-wrap{
        width: 96px;
        height: 128px;
        border-radius: 10px;
        overflow: hidden;
      }
      .title{
        line-height: 1;
        margin-top: 10px;
        font-size: 14px;
        color: #333333;
        text-align: center;
      }
      .desc{
        margin-top: 8px;
        line-height: 1;
        font-size: 12px;
        color: rgba(0,0,0,0.45);
        text-align: center;
      }
    }
  }
  .menu-box::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 3px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 3px;
  }
  .menu-box::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #999999;
  }
  .menu-box::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #f1f1f1;
  }
  .box-section-title{
    margin-left: -10px;
  }
</style>
