<template>
  <div class="common-demo-box" ref="demoBox">
    <h3 class="h3" :id="t">
      {{t}}
<!--      <el-link :href="getHref(t)" type="primary">¶</el-link>-->
<!--      <el-button type="text" @click="changeAnchor(t)" size="mini">¶</el-button>-->
    </h3>
    <p class="p">{{d}}</p>
    <div class="show-panel">
      <div class="content">
        <slot></slot>
      </div>
      <div class="code-container" :style="'height: ' + getCodeContainerHeight()">
        <div class="code-description">
          <slot name="cd"></slot>
        </div>
        <div class="code-box">
          <slot name="code"></slot>
        </div>
      </div>
      <div class="op" @click="expanded = !expanded">
        <transition name="arrow-slide">
          <i :class="{'el-icon-caret-bottom': !expanded, 'el-icon-caret-top': expanded}"></i>
        </transition>
        <transition name="text-slide">
          <span>{{expanded ? '隐藏代码' : '显示代码'}}</span>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      t: {
        type: String
      },
      d: {
        type: String
      }
    },
    data () {
      return {
        expanded: false,
      }
    },
    computed: {
      codeContainerHeight () {
        const el = this.$el.getElementsByClassName('code-container')[0]
        if (el) {
          return this.$el.getElementsByClassName('code-description')[0].clientHeight + this.$el.getElementsByClassName('code-box')[0].clientHeight + 'px'
        } else {
          return 'auto'
        }
      }
    },
    methods: {
      getCodeContainerHeight () {
        if (this.expanded) {
          return this.codeContainerHeight
        } else {
          return 0
        }
      },
      // 锚点跳转失败。。。
      // getHref (t) {
      //   let href
      //   if (window.location.href.endsWith(this.$route.path)) {
      //     href = window.location.href + '#' + t
      //   } else {
      //     href = window.location.href.slice(0, window.location.href.lastIndexOf('#')) + '#' + t
      //   }
      //   return href
      // },
      // changeAnchor (t) {
      //   if (window.location.href.endsWith(this.$route.path)) {
      //     window.location.href = window.location.href + '#' + t
      //   } else {
      //     window.location.href = window.location.href.slice(0, window.location.href.lastIndexOf('#')) + '#' + t
      //   }
      // }
    }
  }
</script>
<style scoped lang="less"></style>
