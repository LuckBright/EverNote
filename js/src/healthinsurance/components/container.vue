/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-04 14:28:52
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-05 11:09:33
 * 左右两侧布局，左侧可收起 solt
 */

<template>
  <el-container class="pos_re page_layout_full">
    <!-- 小按钮 -->
    <div class="pos_ab" :style="{'left': asideLeft + 'px'}" @click="handleSlide">
      <el-button size="small" type="primary" class="leftBtn">
        <i :class="this.aside ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
      </el-button>
    </div>
    <!-- 左侧栏 -->
    <el-aside v-if="aside" :width="asideLeft + 'px'" class="no-box-sha mr10 page_layout_full">
      <slot name="aside">
        aside
      </slot>
    </el-aside>

    <!-- 右侧栏 -->
    <el-main style="margin-top: 0; padding: 0!important" class="page_layout_full">
      <slot name="main">
        main
      </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      aside: true,
      asideLeft: this.width
    }
  },
  methods: {
    handleSlide () {
      this.aside = !this.aside
      this.asideLeft = this.aside ? this.width : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.leftBtn {padding: 4px}
</style>
