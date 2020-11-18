<template>
  <div id="slideWar" class="slideWindow" :style="style">
    <div class="btn"
      ref="triggleLeftFun"
      v-on:click.stop="triggleLeftFun()"
      @mousedown="mousedown($event, 'triggleLeftFun')"
      :style="{left: width + 'px'}"
    >
      <slot name="handler">{{btnStr}}</slot>
    </div>
    <div class="cnt" v-on:click.stop="stopClickEvent($event)" :style="{width: (width) + 'px'}">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
import { domClickHandle } from '@/util/common'
import mousemove from '@/util/mousemove'
export default {
  mixins: [mousemove],
  props: {
    // 飘窗宽度
    width: {
      type: [Number, String],
      default: 330
    },
    // 顶部占位
    paddingTop: {
      type: [Number, String],
      default: 40
    },
    // 滑块文案
    btnStr: {
      type: String,
      default: '患者列表'
    },
    // 是否展开/显示滑动区域
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      style: {
        left: 0
      },
      slideShow: false
    }
  },
  watch: {
    show (val) {
      this.slideShow = val
    },
    slideShow: {
      handler (val) {
        if (val) {
          this.style.left = '0px'
        } else {
          this.style.left = '-' + (this.width) + 'px'
        }
        this.$emit('modShow', val)
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.style.width = this.width + 'px'
    this.style.paddingTop = this.paddingTop + 'px'
    this.slideShow = this.show
    // if (this.show) {
    //   this.style.left = '0px'
    // } else {
    //   this.style.left = '-' + this.width + 'px'
    // }
  },
  methods: {
    triggleLeftFun () {
      if (this.moved) return // 移动的标记 mousemove里面定义的
      if (this.slideShow) {
        this.slideShow = false
      } else {
        this.$emit('getData')
        this.slideShow = true
      }
    },
    stopClickEvent (e) {
    },
  },
  mounted () {
    this.mousedownInit('triggleLeftFun')
    domClickHandle('navThirdList', _ => {
      if (this.moved) return
      this.slideShow = false
    })
  }
}
</script>
<style scoped lang="less">
// 左侧飘窗投影公用css
.slideWindow {
  background:#fff;
  position: fixed;
  top: 0;
  box-shadow: 10px 0px 10px rgba(0,0,0,.05);
  z-index: 101;
  transition: all ease-in .4s;
  width: 530px;
  height: 100%;
  box-sizing: border-box;
}
.slideWindow .cnt {
  height: 100%;
  width: 100%;
  padding: 0;
  overflow: hidden;
  // overflow-y: auto;
}
.slideWindow .btn {
  position: absolute;
  left: 530px;
  top: 120px;
  font-size: 12px;
  padding: 10px;
  background-color: #1c7bef;
  cursor: pointer;
  color: #ffffff;
  z-index:200;
  border-radius: 0 4px 4px 0;
}
</style>
