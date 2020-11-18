<template>
  <div class="dialog-wrap">
    <div class="dialog-layer" :style="'top:'+topMargin+'px'"></div>
    <div :class="{'full-dialog-body':true, 'open':openStatus }" :style="'width:100%'">
      <div :class="{'icon-layer-close': true, 'icon-layer-action': true,  } "
           :style="'right:' + contentWidth + 'px; top:'+topMargin+'px'" @click="closeDialog">
        <i :class="{'iconfont':true,'icon-shanchu':!second, 'ti-angle-left': second}"></i>
      </div>
      <div class="full-dialog-content"
           :style="'width:'+contentWidth+'px; height:calc( 100vh - '+topMargin+'px ); top:'+topMargin+'px'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'everFullDialog',
  data () {
    return {
      openStatus: false,
      contentWidth: 1190
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Boolean, String],
      default: false
    },
    second: {
      type: Boolean,
      default: false
    },
    leftMargin: {
      type: Number,
      default: 30
    },
    topMargin: {
      type: Number,
      default: 40
    }
  },
  methods: {
    closeDialog () {
      this.openStatus = false
      setTimeout(() => {
        this.$emit('change', false)
      }, 500)
      this.$emit('close')
      document.body.style.overflow = 'visible'
    }
  },
  created () {
    let bodywidth = document.body.scrollWidth
    this.contentWidth = bodywidth - this.leftMargin
  },
  mounted () {
    setTimeout(() => {
      this.openStatus = true
      document.body.style.overflow = 'hidden'
    }, 100)
  }
}
</script>
<style lang="less" scoped>

  .full-dialog-body {
    position: fixed;
    /*width: 1190px;*/
    /*height: 100vh;*/
    top: 0;
    right: 0;
    padding-left: 0;
    /*background: #fff;*/
    z-index: 1003;
    transform: translateX(100%);
    transition: all 500ms ease 0s;
    /*overflow-y: auto;*/
  }
  .dialog-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 990;
  }
  .full-dialog-body.open {
    transform: translateX(0);
    transition: all 500ms ease 0s;
  }
  .full-dialog-body .icon-layer-action {
    position: absolute;
    width: 30px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    /*left: -30px;*/
    top: 0;
    background-color: #538CF5;
    color: #fff;
    font-family: themify !important;
    font-size: 12px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  .full-dialog-content {
    position: fixed;
    width: 1190px;
    height: 100vh;
    top: 0;
    right: 0;
    padding-left: 0;
    background: #fff;
    z-index: 1003;
    overflow: auto;
  }
  .icon-layer-close {
    i {
      font-size: 12px;
    }
  }
</style>
