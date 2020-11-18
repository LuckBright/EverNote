<template>
  <el-popover
    v-model="show"
    :placement="icon ? 'bottom': 'left'"
    width="350"
    :trigger="icon ? 'click': 'hover'">
      <template solt="title">
        <span class="title">{{name}}</span>
      </template>
      <div class="mainbox">
        <textviews :id="id" type="1" v-if="show"></textviews>
      </div>
      <span slot="reference" class="slot">
        <i class="el-icon-info" v-if="icon" style="color: #98AEC3;"></i>
        <a href="javascript:void(0)"  style="color:#1c7bef;" v-if="!icon">{{name}}</a>
      </span>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/appointapi'
import Textviews from '@/components/textviews.js'
export default {
  props: ['id', 'name', 'icon'],
  data () {
    return {
      api,
      show: false,
      currentDeptInfo: ''
    }
  },
  components: {
    Textviews
  }
}
</script>

<style scoped>
  .slot{cursor: pointer;}
  .title{font-size: 14px;color: #000000;font-weight: 700;}
</style>
