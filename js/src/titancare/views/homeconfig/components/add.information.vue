<template>
  <AddContent
      title="资讯"
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
      <News @loaded="loadedNews"></News>
    </section>
  </AddContent>
</template>

<script>
import AddContent from './base/add.content'
import AddModuleTitle from './base/add.module.title'
import MuduleCtrl from './base/module.ctrl'
import News from './news'

import { homeSection, moduleShowTtitle } from '../assets/json/homeSection'

import operation from '../mixins/operation'
import moduleTitle from '../mixins/moduleTitle'

export default {
  name: 'add.video',
  components: {
    AddContent,
    News,
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
    this._setModuleInfo(homeSection.information, '资讯')
  },
  methods: {
    loadedNews (data) {
      this.showMessage = data.length === 0
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
