<template>
  <div class="sort-input" @mouseenter="show = true" @mouseleave="show = false">
    <template v-if="comp === 'select'">
      <el-select :value="value" :placeholder="ph" class="w" @change="inputChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </template>
    <template v-else>
      <el-input :value="value" :placeholder="ph" @input="inputChange"></el-input>
    </template>
    <transition name="slide-fade">
      <span v-show="show">
        <el-button v-if="!hideUp" size="small" circle @click="handleClick('up')"><i class="iconfont icon-shangsheng"></i></el-button>
        <el-button v-if="!hideDown" size="small" circle @click="handleClick('down')"><i class="iconfont icon-xiajiang"></i></el-button>
      </span>
    </transition>
  </div>
</template>

<script>
  /**
   * @Description: 有排序按钮的输入框
   * @author fuyongbo@everjiankang.com
   * @date 2019-05-22
   */
  export default {
    props: {
      value: {
        type: [String, Number],
      },
      ph: String,
      hideUp: Boolean,
      hideDown: Boolean,
      comp: {
        type: String
      },
      options: {
        type: Array
      },
    },
    data () {
      return {
        show: false,
      }
    },
    methods: {
      handleClick (command) {
        this.$emit('sort', command)
      },
      inputChange (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    }
  }
</script>
<style lang="less" scoped>
  .sort-input {
    display: flex;
    & > span {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
