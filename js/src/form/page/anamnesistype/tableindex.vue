<template>
  <div class="h">
    <bing-li v-show="type === 'bingli'" :one-level-name="onePageName" :two-level-name="twoPageName"></bing-li>
    <base-info v-show="type === 'info'" :one-level-name="onePageName" :two-level-name="twoPageName"></base-info>
    <diagnosis-el v-show="type === 'diagnosis'" :one-level-name="onePageName" :two-level-name="twoPageName"></diagnosis-el>
    <paragraph-el v-show="type === 'paragraph'" :one-level-name="onePageName" :two-level-name="twoPageName"></paragraph-el>
    <sign-el v-show="type === 'sign'" :one-level-name="onePageName" :two-level-name="twoPageName"></sign-el>
    <other-el v-show="type === 'other'" :one-level-name="onePageName" :two-level-name="twoPageName"></other-el>
    <eye-el v-show="type === 'eye'" :one-level-name="onePageName" :two-level-name="twoPageName"></eye-el>
    <assess-el v-show="type === 'assess'" :one-level-name="onePageName" :two-level-name="twoPageName"></assess-el>
    <operation-el v-show="type === 'operation'" :one-level-name="onePageName" :two-level-name="twoPageName"></operation-el>
  </div>
</template>

<script>
import bingLi from './bingli'
import baseInfo from './baseinfo'
import diagnosisEl from './diagnosis'
import paragraphEl from './paragraph'
import signEl from './sign'
import otherEl from './other'
import eyeEl from './eye'
import assessEl from './assess'
import operationEl from './operation'

export default {
  props: {
    type: {
      type: String,
      default: 'bingli'
    }
  },
  data () {
    return {
      onePageName: '病历管理',
      twoPageName: '病历字典管理'
    }
  },
  components: {
    bingLi,
    baseInfo,
    diagnosisEl,
    paragraphEl,
    signEl,
    otherEl,
    eyeEl,
    assessEl,
    operationEl
  }
}
</script>

<style scoped lang="scss">
.h {
  height: 100%;
}
</style>

