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
    <div
      class="list-container"
      v-show="visible"
    >
      <div
        class="suggestions-inner-container inline-block ellipsis"
        v-for="item in options"
        :key="item.id"
        @click="selected(item, true)"
      >
        {{ item.name }}
      </div>
      <div class="alg_c" v-if="!options.length">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
export default {
  props: ['systematization'],
  data () {
    return {
      keyword: '',
      visible: false,
      options: [],
      data: [],
      allData: [],
    }
  },

  components: {},

  computed: {},

  created () {
    this.querySearch()
  },
  watch: {
    keyword (val) {
      this.querySearch(val)
      if (val.length === 0) {
        this.$emit('clearKeyword')
      }
    }
  },
  methods: {
    handleFocus () {
      this.visible = true
      this.querySearch()
    },
    querySearch(queryString) {
      let params = {
        name: queryString || '',
        type: this.$route.meta.type,
        systematization: this.systematization
      }
      request('/platform-extend/project/fuzzyQuery', params).then(res => {
        this.options = res.data.map(item => {
          return {
            name: item.name,
            id: item.id,
            defaultClassificationId: item.defaultClassificationId,
            systematization: item.systematization
          }
        })
      })
    },
    selected (item) {
      this.selectedItem = item
      this.keyword = item.name
      this.visible = false
      this.$emit('change', item)
    },
    handleBlur (e) {
      setTimeout(() => {
        this.visible = false
      }, 150)
    },
  }
}

</script>
<style lang='scss' scoped>
.search-box {
  width: 260px;
  margin: auto;
  box-sizing: border-box;
  position: relative;
  font-size: 14px;
  margin-left: 10px;
  margin: 20px 10px;
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
    background-color: #EEEEEE;
    margin-left: 10px;
  }
  .list-container {
    height: 276px;
    background-color: #ffffff;
    position: absolute;
    width: 260px;
    top: 30px;
    left: -1px;
    z-index: 6;
    border: 1px solid #1c7bef;
    border-top: none;
    border-radius: 0px 0px 4px 4px;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    .suggestions-inner-container {
      height: 28px;
      color: #333333;
      line-height: 28px;
      width: 100%;
      box-sizing: border-box;
      padding: 0px 10px;
      cursor: default;
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
