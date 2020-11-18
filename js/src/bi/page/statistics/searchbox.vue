<!--  -->
<template>
  <div class="search-box" :class="{ active: visible }">
    <div class="search-controls">
      <span
        class="inline-block search-icon iconfont icon-shuxuegongzuotai-cha"
      ></span
      ><input
        class="search"
        type="text"
        v-model.trim="keyword"
        placeholder="请输入搜索内容"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="input"
      />
    </div>
    <div class="list-container" v-show="visible">
      <div class="ic oxhya">
        <div
          class="suggestions-inner-container inline-block ellipsis"
          v-for="item in data"
          :key="item.id"
          @click="selected(item, true)"
        >
          {{ item.name }}
        </div>
        <div class="alg_c" v-if="!data.length">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Array
  },
  data () {
    return {
      keyword: '',
      visible: false,
      data: [],
      allData: [],
    }
  },

  components: {},

  computed: {},

  created () {
  },
  watch: {
    keyword (val) {
      if (!val) this.data = this.allData
      this.data = this.data.filter(item => item.name.includes(val))
    },
    options (val) {
      this.data = [...val]
      this.allData = [...val]
    }
  },
  methods: {
    handleFocus () {
      this.visible = true
    },
    selected (item) {
      this.keyword = item.name
      this.visible = false
      this.$emit('change', item)
    },
    handleBlur (e) {
      let timer = setTimeout(() => {
        this.visible = false
        clearTimeout(timer)
      }, 150)
    },
  }
}

</script>
<style lang='scss' scoped>
.search-box {
  width: 280px;
  box-sizing: border-box;
  position: relative;
  font-size: 14px;
  margin-left: 10px;
  margin-top: 20px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  &.active {
    border: 1px solid #1c7bef;
    border-radius: 4px 4px 0px 0px;
    border-bottom: none;
  }
  &.active::after {
    content: '';
    position: absolute;
    display: block;
    width: 260px;
    height: 1px;
    z-index: 10;
    background-color: #eeeeee;
    margin-left: 10px;
  }
  .list-container {
    height: 276px;
    background-color: #ffffff;
    position: absolute;
    width: 280px;
    top: 30px;
    left: -1px;
    z-index: 6;
    border: 1px solid #1c7bef;
    border-top: none;
    border-radius: 0px 0px 4px 4px;
    padding: 10px 5px 10px 10px;
    box-sizing: border-box;
    // overflow-y: auto;
    /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
    .ic {
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
        background-color: #f5f5f5;
        border-radius: 50px;
      }
      /*定义滚动条的轨道，内阴影及圆角*/
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgb(239, 239, 239);
        border-radius: 50px;
        background-color: #f5f5f5;
      }
      /*定义滑块，内阴影及圆角*/
      &::-webkit-scrollbar-thumb {
        width: 3px;
        height: 50px;
        border-radius: 50px;
        -webkit-box-shadow: inset 0 0 6px rgb(248, 248, 248);
        background-color: #8f8f8f;
      }
    }

    .suggestions-inner-container {
      height: 28px;
      color: #333333;
      line-height: 28px;
      width: 100%;
      box-sizing: border-box;
      padding: 0px 10px;
      cursor: pointer;
      .name {
        margin-left: 38px;
        width: 80px;
      }
      .code {
        width: 150px;
      }
      .bir {
        width: 100px;
      }
      .id {
        width: 140px;
      }
      .item {
        margin-right: 5px;
      }
    }
    .suggestions-inner-container:hover {
      background: #1c7bef;
      border-radius: 4px;
      color: white;
    }
    .hover {
      background: #e7f2ff;
    }
  }
  .search-controls {
    margin: 1px 0px;
    height: 30px;
    .search {
      outline: none;
      width: 79%;
      box-sizing: border-box;
      height: 76%;
      border: 0px;
      margin: 4px 1px 0 0px;
      margin-left: 30px;
    }
    .search-icon {
      color: #767f93;
      position: absolute;
      font-size: 17px;
      top: 8px;
      left: 10px;
      cursor: auto;
    }
  }
}
</style>
