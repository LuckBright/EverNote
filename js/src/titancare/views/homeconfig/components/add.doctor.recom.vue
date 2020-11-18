<template>
  <div>
    <AddContent
        style="width: 440px;"
        v-show="!showAddDoctor"
        title="医生推荐"
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
      <p class="box-section-title">可拖动排序</p>
      <section>
        <Draggable v-model="doctorList" group="module" @change="onSort">
          <BoxClose :showClose="commonData.moduleArr.length > 1" :key="item.id + index" v-for="(item, index) in doctorList" @close="delDoctor(index)">
            <div class="doctor-item dashed">
              <div class="doctor-item-content">
                <div class="avatar-wrap">
                  <ever-image :placeholder='avatar' :src="item.photo"></ever-image>
                </div>
                <div class="title-wrap">
                  <span class="title">{{item.name}}</span>
                  <div class="desc">{{item.tsStaffSubjectList[0] ? item.tsStaffSubjectList[0].orgSubjectName + ' | ' : ''}} {{item.skillsTitle2Name}}</div>
                  <div class="desc sl" style="margin-top: 6px;">介绍：{{item.infoRemark}}</div>
                  <div v-if="item.infoText" class="label-wrap">
                    <i class="i-label2" :key="index" v-for="(label, index) in item.infoText.split(',')">{{label}}</i>
                  </div>
                </div>
              </div>
            </div>
          </BoxClose>
        </Draggable>
      </section>
      <section style="margin-bottom: 20px;">
        <div class="add-wrap dashed" @click="addDoctor">
          <i class="el-icon-plus"></i>
        </div>
      </section>
    </AddContent>
    <AddDoctorWallList
            v-if="showAddDoctor"
            @selectSure="selectSure"
            @selectCancel="selectCancel"
    >
    </AddDoctorWallList>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddContent from './base/add.content'
import AddModuleTitle from './base/add.module.title'
import MuduleCtrl from './base/module.ctrl'
import AddDoctorWallList from './add.doctor.wall.list'
import BoxClose from './base/box.close'
import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'
import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'
import filePath from '../mixins/filePath'
import api from '@/titancare/api/homeconfig/homeconfigapi'
import avatar from '@img/assets/avatar.png'

export default {
  name: 'add.doctor.recom',
  components: {
    AddContent,
    AddModuleTitle,
    AddDoctorWallList,
    BoxClose,
    Draggable,
    MuduleCtrl
  },
  mixins: [operation, moduleTitle, filePath],
  data () {
    return {
      showAddDoctor: false,
      commonData: {
        showTitle: moduleShowTtitle.hide,
        title: '',
        moduleArr: []
      },
      doctorList: []
    }
  },
  created () {
    this.avatar = avatar
    this._setModuleInfo(homeSection.doctorRecom, '医生推荐')
    this._getDoctorList()
  },
  methods: {
    addDoctor () {
      this.showAddDoctor = true
    },
    selectSure (data) {
      this.commonData.moduleArr.push(data.id)
      this._getDoctorList()

      this.showAddDoctor = false
      this._edit()
    },
    selectCancel () {
      this.showAddDoctor = false
    },
    delDoctor (index) {
      this.commonData.moduleArr.splice(index, 1)
      this.doctorList.splice(index, 1)
      this._edit()
    },
    onSort () {
      this.commonData.moduleArr = this.doctorList.map(item => item.id)
      this._edit()
    },
    _getDoctorList () {
      if (this.commonData.moduleArr.length === 0) return
      let params = {
        offset: 0,
        pagesize: this.commonData.moduleArr.length
      }
      params.outStaffGetStaffListByConditionReqDTO = {
        idList: this.commonData.moduleArr
      }
      api.searchDoctors(params).then(res => {
        this.doctorList = res.data.resultList
      })
    }
  }
}
</script>
<style>
  .el-avatar--large{
    width: 50px;
    height: 50px;
    line-height: 50px;
  }
</style>
<style scoped lang="less">
  section{
    padding: 0 20px;
  }
  .add-wrap{
    height: 136px;
    text-align: center;
    line-height: 136px;
    font-size: 24px;
    border-radius: 4px;
    cursor: pointer;
    background: #fff;
  }
  .dashed{
    border: 1px dashed #979797;
  }
  .form-list{
    border-top: none;
  }
  .doctor-item{
    padding: 15px;
    margin-bottom: 10px;
    cursor: move;
    background: #fff;
    .doctor-item-content{
      position: relative;
      padding-left: 62px;
      .avatar-wrap{
        position: absolute;
        left: 0;
        top: -2px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        text-align: center;
        .el-image{
          height: 100%;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .title-wrap{
        margin-top: 3px;
        line-height: 1;
        .title{
          font-size: 16px;
          color: #333;
        }
        .i-label{
          font-size: 12px;
          border-radius:2px;
          padding: 2px 3px;
          color: #fff;
        }
        .i-label-blue{
          background: #5D8FDD;
        }
        .i-label-gree{
          background: #3DB6D0;
        }
      }
      .desc{
        font-size: 12px;
        color: rgba(0,0,0,0.45);
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        line-height: 1.5;
        max-height: 38px;
      }
      .label-wrap{
        margin-top: 6px;
        .i-label2{
          display: inline-block;
          box-sizing: border-box;
          background: #F5F6F7;
          border-radius: 3px;
          padding: 3px 4px;
          margin-right: 6px;
          font-style: normal;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
</style>
