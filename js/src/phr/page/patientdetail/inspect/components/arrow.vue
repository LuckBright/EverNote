<!--  -->
<template>
  <div class="inline">
    <div v-if="direction === 'right' || direction === 'left'" class="horizon" :class="{small: small}">
      <div class="dash" :class="{doneBorder: done}">
        <span v-if="!done" class="text-going">待进行</span>
        <span v-else class="text-going done"></span>
<!--        耗时38分钟-->
        <i
          v-show="direction === 'right'"
          class="el-icon-caret-right arrow-right"
          :class="{done: done}"
        ></i>
        <i v-show="direction === 'left'" class="el-icon-caret-left arrow-left" :class="{done: done}"></i>
      </div>
    </div>
    <div v-if="direction === 'bottom'" class="slash-bottom" :class="{doneBorder: done}">
      <i class="el-icon-caret-bottom arrow-bottom" :class="{done: done}"></i>
    </div>
    <div v-if="direction === 'top'" class="slash-top" :class="{doneBorder: done}">
      <i class="el-icon-caret-bottom arrow-top" :class="{done: done}"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      default: 'right'
    },
    done: {
      type: Boolean
    },
    small: {
      default: false
    },
  },
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  mounted () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.inline {
  display: inline-block;
}
.text-going {
  font-size: 12px;
  color: #878d94;
  line-height: -9px;
  display: inline-block;
  position: relative;
  top: -30px;
}
.done {
  color: #4484c9;
}
.horizon {
  display: inline-block;
  width: 160px;
  height: 164px;
  position: relative;
  font-size: 22px;
  .dash {
    text-align: center;
    border-top: 1px dashed #b6b6b6;
    width: 154px;
    position: absolute;
    top: 81px;
  }
  .gery {
    color: #b6b6b6;
  }
  .arrow-right {
    position: absolute;
    top: -11px;
    right: -14px;
    color: #b6b6b6;
  }
  .arrow-left {
    position: absolute;
    top: -11px;
    left: -14px;
    color: #b6b6b6;
  }
  .done {
    color: #4484c9;
  }
  .doneBorder {
    border-top: 1px dashed #4484c9;
  }
}
.slash-bottom {
  position: absolute;
  right: -46px;
  top: 157px;
  width: 248px;
  height: 100px;
  border: dashed 1px #b6b6b6;
  border-color: #b6b6b6 transparent transparent transparent;
  border-radius: 50%/100px 100px 0 0;
  transform: rotate(92deg);
  font-size: 22px;
  color: #b6b6b6;
  .arrow-bottom {
    position: absolute;
    top: 20px;
    left: 205px;
    transform: rotate(-59deg);
  }
  .text-going {
    top: -30px;
    left: 104px;
  }
  .done {
    color: #4484c9;
  }
}
.slash-top {
  position: absolute;
  left: -46px;
  top: 169px;
  width: 248px;
  height: 100px;
  border: dashed 1px #b6b6b6;
  border-color: #b6b6b6 transparent transparent transparent;
  border-radius: 50%/100px 100px 0 0;
  transform: rotate(270deg);
  font-size: 22px;
  color: #b6b6b6;
  .arrow-top {
    position: absolute;
    top: 20px;
    left: 205px;
    transform: rotate(-59deg);
  }
  .text-going {
    top: -30px;
    left: 104px;
  }
  .done {
    color: #4484c9;
  }
  .doneBorder {
    border-top: 1px dashed #4484c9;
  }
}
.doneBorder {
  border-top: 1px dashed #4484c9;
}
.small {
  width: 66px;
  .dash {
    width: 66px;
  }
}
</style>
