<template>
  <i class="f12 iconfont icon-guanlian2" v-if="mainFlag == 1"></i>
  <i class= "f12 iconfont icon-guanlian1" v-else-if="mainFlag == 2 && lastMain"></i>
  <i class="f12 iconfont icon-guanlian" v-else-if="mainFlag == 2"></i>
</template>

<script>
export default {
  props: {
    mainFlag: Number, // 父子医嘱标识 1父医嘱  2子医嘱
    lastMain: Number // 1最后一条子医嘱
  }
}
</script>
