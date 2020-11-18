<template>
  <AddContent
      title="直播"
      :show-close-btn="!!editData.id"
      @sureEdit="sureEdit"
      @sureDel="sureDel"
      @sureClose="sureClose"
  >
    <AddModuleTitle
        style="border-top: none;"
        :disabled="showMessage"
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
    <section>
      <Live @loaded="loadedLive" :moduleData="commonData"></Live>
    </section>
    <div class="form-list">
      <div class="form-item">
        <span class="form-item-left">显示直播主题</span>
        <div class="form-item-right">
          <el-switch
              @change="_edit"
              v-model="commonData.showTheme"
              :active-value="moduleShowTtitle.show"
              :inactive-value="moduleShowTtitle.hide">
          </el-switch>
        </div>
      </div>
      <div class="form-item">
        <span class="form-item-left">显示直播简介</span>
        <div class="form-item-right">
          <el-switch
              @change="_edit"
              v-model="commonData.showDesc"
              :active-value="moduleShowTtitle.show"
              :inactive-value="moduleShowTtitle.hide">
          </el-switch>
        </div>
      </div>
      <div class="form-item">
        <span class="form-item-left">直播结束后隐藏本模块</span>
        <div class="form-item-right">
          <el-switch
              @change="_edit"
              v-model="commonData.endIsHide"
              :active-value="moduleShowTtitle.show"
              :inactive-value="moduleShowTtitle.hide">
          </el-switch>
        </div>
      </div>
    </div>
  </AddContent>
</template>

<script>
import AddContent from './base/add.content'
import AddModuleTitle from './base/add.module.title'
import MuduleCtrl from './base/module.ctrl'
import Live from './live'

import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'

import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'

export default {
  name: 'add.video',
  components: {
    AddContent,
    Live,
    AddModuleTitle,
    MuduleCtrl
  },
  mixins: [operation, moduleTitle],
  data () {
    return {
      moduleShowTtitle: moduleShowTtitle,
      commonData: {
        showTitle: moduleShowTtitle.hide,
        title: '',
        showTheme: moduleShowTtitle.show,
        showDesc: moduleShowTtitle.show,
        endIsHide: moduleShowTtitle.hide
      },
      showMessage: false
    }
  },
  created () {
    this._setModuleInfo(homeSection.live, '直播')
  },
  methods: {
    loadedLive (data) {
      this.showMessage = data.length === 0
    }
  }
}
</script>

<style scoped lang="less">
  @import "../assets/css/form-list";

  section{
    padding: 20px;
    width: 440px;
    overflow: auto;
    box-sizing: border-box;
  }
</style>
