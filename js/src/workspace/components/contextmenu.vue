<template>
  <div class="textmenu" :style='style'>
    <ul>
      <template  v-for='li in menu'>
        <li :key='li.id + li.name' @mouseup.stop @click='click(li)' @mouseenter="mouseenter(li)" :class='li.disabled === true ? "dis" : ""'>{{li.name}}
          <i class="icon iconfont icon-next right"  v-if='li.child'></i>
        </li>
        <li class="border" v-if='li.border' :key='li.id'></li>
      </template>
    </ul>
    <div class="empty"> </div>
    <ul v-if='child.length > 0' class="rightul">
       <template  v-for='li in child'>
        <li :key='li.id' @mouseup.stop @click='click(li)' :class='li.disabled === true ? "dis" : ""'>{{li.name}}
        </li>
        <li class="border" v-if='li.border' :key='li.id'></li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    className: { // 需要定义右击自定义的class名字，全局时传空
      type: String
    },
    menu: {
      type: Array,
      default: function () {
        return [{ // 默认格式
          name: '无操作',
          id: '',
          disabled: true
        }]
      }
    }
  },
  data: function () {
    return {
      style: {
        visibility: 'hidden',
        top: 0,
        left: 0
      },
      indexItem: null,
      itemStr: null,
      child: []
    }
  },
  mounted () {
    document.removeEventListener('contextmenu', this.oncontextmenu)
    document.addEventListener('contextmenu', this.oncontextmenu)
    document.body.removeEventListener('mouseup', this.onmouseup)
    document.body.addEventListener('mouseup', this.onmouseup)
  },
  methods: {
    click (li) {
      if (li.disabled || li.child) return
      this.$emit('select', li, this.indexItem, this.itemStr)
      this.style.visibility = 'hidden'
    },
    index (e) {
      let index = null
      let domArr = this.className ? document.querySelectorAll('.' + this.className) : []
      e.path.forEach(element => {
        if (element.className && typeof element.className !== 'object' && element.className.indexOf(this.className) > -1) {
          for (let i = 0; i < domArr.length; i++) {
            if (domArr[i] === element)index = i
          }
        }
      })
      return index
    },
    oncontextmenu (e) {
      this.child = []
      if (!this.className) {
        e.preventDefault()
        return false
      }
      e.path.forEach(element => {
        if (!!element.className && typeof element.className !== 'object' && element.className.indexOf(this.className) > -1) {
          e.preventDefault()
          return false
        }
      })
    },
    onmouseup (e) {
      let show = false
      e.path.forEach(element => {
        if (element.className && typeof element.className !== 'object' && element.className.indexOf(this.className) > -1) {
          show = true
          this.itemStr = element.getAttribute('data')
        }
      })
      if (e.button === 2 && show) {    // 如果button=1（鼠标左键），button=2（鼠标右键），button=0（鼠标中间键）
        this.indexItem = this.index(e)
        this.$emit('menu', this.indexItem, this.itemStr)
        this.$nextTick(_ => {
          let y = e.y + 3 + 'px'
          let x = e.x + 3 + 'px'
          let height = this.menu.length * 25 + 20
          let widht = 110
          if (e.x + widht > document.body.clientWidth) x = e.x - widht - 3 + 'px'
          if (e.y + height > document.body.clientHeight) y = e.y - height - 3 + 'px'
          this.style.top = y// 鼠标点击时给div定位Y轴
          this.style.left = x  // 鼠标点击时给div定位X轴
          this.style.visibility = 'visible'    // 显示div盒子
        })
      } else {
        this.style.visibility = 'hidden'     // 否则不显示div盒子
      }
    },
    mouseenter (li) {
      this.child = li.child || []
    }
  }
}
</script>

<style scoped lang="less">
.textmenu{
  position: fixed;
  z-index: 9999;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.30);
  background-color: #fff;
  display: flex;
  ul{
    background: #fff;
    text-align: left;
    padding: 10px 5px;
    font-size: 12px;
    min-width: 100px;
    margin: 0;
    line-height: 25px;
    color: #333;
    cursor: pointer;
    .border{
        height: 1px;
        background: #ddd;
        margin: 5px 0;
    }
    li {
      padding: 0 5px;
      .right{
        color: rgb(187, 187, 187);
        font-size: 12px;
        vertical-align: baseline;
        padding-left: 7px;
      }
    }
    li:hover{
        color: #1C7BEF;
        .right{
          color:#1C7BEF;
        }
    }
    .dis{
      cursor: not-allowed;
      color: #999;
      &:hover{
        color: #999;
    }
    }
  }
  .empty{
    width: 1px;
    background-color: #DADCE0 ;
  }
}
</style>
