<!--  -->
<template>
  <div class="center-box">
    <itemheading
      class="mb20"
      :icon-index="iconIndex"
      :title="title"
    ></itemheading>
    <cataloglist class="list" :data="data"></cataloglist>
  </div>
</template>

<script>
import itemheading from '@/bi/page/statistics/itemheading'
import cataloglist from '@/bi/page/statistics/cataloglist'
const titles = ['门诊报表', '住院报表', '供应链报表']
export default {
  name: 'centerItem',
  props: {
    data: Array,
    iconIndex: Number
  },
  data () {
    return {
      title: titles[this.iconIndex],
      catalog: [],
    }
  },

  components: {
    itemheading,
    cataloglist
  },

  computed: {},

  created () {
  },

  methods: {
  }
}

</script>
<style lang='scss' scoped>
.center-box {
  height: 558px;
  width: 244px;
  box-sizing: border-box;
  box-shadow: inset 0 1px 4px 0 #333fa8;
  border-radius: 10px;
  padding: 1px;
  border: 1px solid #4c6dc2;
  margin-top: 44px;
  background-color: #142451;
  .list {
    overflow: auto;
    height: 100%;
    padding: 0px;
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
  &:hover {
    padding: 0px;
    border: 2px solid transparent;
    background-origin: border-box;
    background-clip: padding-box, border-box;
    background-size: cover;
    box-shadow: 0 -1px 5px 0 #548bed;
    background-image: linear-gradient(#142451, #142451),
      linear-gradient(#37e4c9, #1c7bef);
    .heading {
      color: #13e7d5;
    }
  }
}
</style>
