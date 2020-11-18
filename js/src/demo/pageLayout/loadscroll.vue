<template>
  <div class="layout_inner">
    <div style="border: 1px solid #ccc; padding: 20px">
      <h1>彩色ICON</h1>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-weibiaoti-"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-QR"></use>
      </svg>
    </div>

    <div class="panel-body">
      <div style="height: 300px; overflow-x: hidden;
  border: 1px solid #ccc;">
        <!--  :probe-type="probeType" :listen-scroll="listenScroll" -->
        <scroll class="wrapper" :data="data" @scroll="scroll" :pullup="pullup" :pulldown="pulldown"
          @pulldown="pulldownFn"
          @scrollToEnd="loadData" :probe-type="probeType" :listen-scroll="listenScroll">
          <ul class="content" slot="main">
            <li v-for="(item, index) in data" :key="index">{{item.name}}</li>
          </ul>
          <!-- 加载中提示slot未完成 -->
        </scroll>
      </div>
    </div>
    <todo-list></todo-list>
    <div></div>
  </div>
</template>
<script>
// import BScroll from 'better-scroll'
import scroll from './scroll'
import todoList from './todolist'

export default {
  data () {
    return {
      data: [],
      scrollY: 0,
      pullup: true,
      pulldown: true,
      probeType: 1,
      listenScroll: true
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    pulldownFn () {
      console.log('下拉刷新')
    },
    scroll (pos) {
      console.log('scroll', pos)
      this.scrollY = pos.y
    },
    loadData () {
      console.log('上拉加载')
      // requestData().then((res) => {
      for (let i = 0; i < 20; i++) {
        this.data.push({id: i + 1, name: 'name' + (i + 1)})
      }
      // })
    }
  },
  watch: {
    scrollY (newY) {
      console.log(newY)
    }
  },
  components: {
    scroll,
    todoList
  }
}
</script>
<style style="less" scoped>
.icon { font-size: 64px}

/* 滚动加载必须添加以上css */
.wrapper{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.content li {
  list-style:none;
  width: 100%;
  text-align: center;
}
</style>
