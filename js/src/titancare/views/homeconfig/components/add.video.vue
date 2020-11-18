<template>
  <AddContent
      title="短视频"
      :show-close-btn="!!editData.id"
      :show-sure-btn="!showMessage"
      @sureEdit="sureEdit"
      @sureDel="sureDel"
      @sureClose="sureClose"
  >
    <AddModuleTitle
        style="border-top: none;"
        :show="commonData.showTitle"
        :title="commonData.title"
        :disabled="showMessage"
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
      <ShortVideo @loaded="loadedVideo"></ShortVideo>
    </section>
  </AddContent>
</template>

<script>
import AddContent from './base/add.content'
import AddModuleTitle from './base/add.module.title'
import MuduleCtrl from './base/module.ctrl'
import ShortVideo from './shortvideo'

import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'

import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'

export default {
  name: 'add.video',
  components: {
    AddContent,
    ShortVideo,
    AddModuleTitle,
    MuduleCtrl
  },
  mixins: [operation, moduleTitle],
  data () {
    return {
      commonData: {
        showTitle: moduleShowTtitle.hide,
        title: ''
      },
      showMessage: false
    }
  },
  created () {
    this._setModuleInfo(homeSection.video, '短视频')
  },
  methods: {
    loadedVideo (videos) {
      this.showMessage = videos.length === 0
    }
  }
}
</script>

<style scoped>
  section{
    padding: 20px;
    width: 440px;
    overflow: auto;
    box-sizing: border-box;
  }
</style>
