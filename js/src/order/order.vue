/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:48:05
 * @Last Modified by:   xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-02 10:48:05
 */

<template>
  <div class="page_layout_full_hidden layout_box">
    <keep-alive class="flex_column_full_hidden station_layout_wrap drugstore" v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view class="flex_column_full_hidden station_layout_wrap drugstore" v-else></router-view>
  </div>
</template>


<script>
import session from '@/util/session'
import '@/warehouse/page/assets/index.scss'
import '@/warehouse/views/drug/assets/index.scss'
import '@/warehouse/views/drug/assets/index.less'
import { getUseFreq } from '@/warehouse/views/util/index'

export default {
  mixins: [session],
  created () {
    getUseFreq() // 获取所有用药频次
  },
}
</script>
