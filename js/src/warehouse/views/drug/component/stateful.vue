<template>
  <div class="pos_re p_h bWhite">
    <div class="pos_ab triangle-right"></div>
    <div class="pos_ab mark f_bold">
      <template v-if="showName">{{showName}}</template>
      <template v-else>{{status | formateValueToFnt({list: SEND_MODE.concat(HOSPITAL_SEND_MODE), defaultFnt: '暂无'})}}</template>
    </div>
  </div>
</template>

<script>
import { SEND_MODE, HOSPITAL_SEND_MODE } from '@/warehouse/views/util/constant.js'
export default {
  props: {
    showName: String,
    status: [Number, String]
  },
  data () {
    return {
      SEND_MODE,
      HOSPITAL_SEND_MODE
    }
  }
}
</script>

<style lang="scss" scoped>
.p_h {
  height: 30px
}
%pos {
  left: 0;
  top: 0;
}
.mark {
  width: 100px;
  top: 7px;
  left: 7px
}
.triangle-right {
  @extend %pos;
  width: 0;
  height: 0;
  border-right: 180px solid transparent;
  border-top: 40px solid #ddd;
}
</style>
