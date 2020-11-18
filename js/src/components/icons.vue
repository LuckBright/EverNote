<template>
  <span class="small-icons" v-if="addOrDelette" :class="addOrDelette == PROPERTY_COMPARE[0].id ? 'color_add' : 'color_del'">{{addOrDelette == PROPERTY_COMPARE[0].id ? '新' : '删'}}</span>
</template>
<script>
import {PROPERTY_COMPARE} from '@/util/common'
export default {
  props: ['addOrDelette'],
  data () {
    return {
      PROPERTY_COMPARE
    }
  }
}
</script>
<style scoped>
.color_add {
  background: #1c7bef
}
.color_del {
  background: #e43
}
.small-icons {
  padding: 2px;
  border-radius: 2px;
  color: #fff;
  width: 16px;
  height: 16px;
  font-size: 14px;
  display: inline-block;
  line-height: 16px;
  margin-right: 8px;
  text-align: center;
}
</style>
