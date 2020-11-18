<!--  -->
<template>
  <div>
    <div class="list" :class="code" v-if="!showChildren">
      <div
        :class="['item', { disable: item.disable }]"
        v-for="item in data"
        :key="item.id"
        @click="goInfo(item)"
      >
        {{ item.hisReportName }}
      </div>
      <div class="alg_c" v-if="!data.length">暂无数据</div>
    </div>
    <div class="list" v-if="showChildren">
      <div v-for="(item, index) in data" :key="item.name">
        <div class="item" @click="toggle(item)">
          <i class="icon" :class="`icon${index}`"></i>{{ item.name }}
          <i
            :class="[
              'fr',
              {
                'el-icon-arrow-down': !item.show,
                'el-icon-arrow-up': item.show,
              },
            ]"
          ></i>
        </div>
        <div class="list children" v-show="item.show">
          <div
            v-for="child in item.children"
            :key="child.id"
            :class="['item', { disable: child.disable }, 'child']"
            @click="goInfo(child)"
          >
            {{ child.hisReportName }}
          </div>
        </div>
        <div class="alg_c f14" v-if="!item.children.length" v-show="item.show">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    showTree: {
      default: false
    },
    code: String
  },
  data () {
    return {
    }
  },

  components: {},

  computed: {
    showChildren () {
      const data = this.data
      return data && data[0] && data[0].children
    },
  },

  created () {
  },

  methods: {
    toggle (item) {
      item.show = !item.show
    },
    goInfo (item, key) {
      if (item.disable) return
      this.$router.push({ name: 'bicatalog', query: { code: item.hisReportCode } })
    }
  }
}

</script>
<style lang='scss' scoped>
.list {
  &.medical_supplies,
  &.internet_hospital {
    height: 184px;
  }
  &.medical_skills,
  &.insurance {
    height: 160px;
  }
  .child {
    margin-left: 5px;
  }
  overflow: auto;
  height: 80%;
  padding: 0px 10px;
  .item {
    font-size: 14px;
    padding: 5px;
    cursor: pointer;
    .icon {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 8px;
      margin: 3px;
      margin-right: 6px;
    }
    .icon0 {
      background: #1c7bef;
    }
    .icon1 {
      background: #29afdb;
    }
    .icon2 {
      background: #37e4c8;
    }
    &:hover {
      background-image: linear-gradient(90deg, #1d7eef 3%, #22a2ef 100%);
      border-radius: 4px;
      .icon {
        background: white;
      }
    }
  }
  .disable {
    color: #cad2d7;
    cursor: not-allowed;
  }
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/

  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    border-radius: 50px;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  &::-webkit-scrollbar-track {
    border-radius: 50px;
    background-color: transparent;
  }
  /*定义滑块，内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    width: 3px;
    border-radius: 200px;
    background-image: linear-gradient(180deg, #3894e7 0%, #2369e5 100%);
  }
}
</style>
