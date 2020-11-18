<template>
  <div class="textmenu" :style='style'>
    <ul>
      <template  v-for='li in menu'>
        <li :key='li.id + Math.random()' @mouseup.stop @click='click(li)' :class='li.disabled === true ? "dis" : ""' v-if="li.visible">{{li.name}}</li>
        <li class="border" v-if='li.border' :key='li.id + Math.random()'></li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'tree_contextmenu',
  props: {
    businessType: [String, Number],
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
      indexItem: null
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
      if (li.disabled) return
      this.$emit('select', li, this.indexItem)
      this.style.visibility = 'hidden'
    },
    index (e) {
      let index = null
      let domArr = document.querySelectorAll('.' + this.className)
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
      // 如果是机构设置工作站下的集团模版，return
      if (Number(this.businessType) === 0 && this.$route.meta.workshopTag === 'orgSetting') return
      let show = false

      // -------------创建模版组织弹框开始-----------------
      let stop = true
      e.path.forEach(e => {
        if (e.className === 'create_tpl') {
          stop = false
        }
      })
      if (!stop) return false
      // -------------创建模版组织弹框结束-----------------
      e.path.forEach(element => {
        if (element.className && typeof element.className !== 'object' && element.className.indexOf(this.className) > -1) {
          show = true
        }
      })
      if (e.button === 2 && show) {    // 如果button=1（鼠标左键），button=2（鼠标右键），button=0（鼠标中间键）
        this.indexItem = this.index(e)
        this.$emit('menu', this.indexItem)
        if (e.pageY < 163) {
          this.style.top = e.y - 110 + 'px'
        } else {
          this.style.top = e.y - 170 + 'px'
        }
           // 鼠标点击时给div定位Y轴
        this.style.left = e.x + 50 + 'px'  // 鼠标点击时给div定位X轴
        this.style.visibility = 'visible'    // 显示div盒子
      } else {
        this.style.visibility = 'hidden'     // 否则不显示div盒子
      }
    }
  }
}
</script>

<style scoped lang="less">
.textmenu{
  position: fixed;
  z-index: 9999;
  ul{
    background: #fff;
    text-align: center;
    padding: 10px 5px;
    font-size: 14px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.30);
    border-radius: 4px;
    min-width: 48px;
    margin: 0;
    line-height: 25px;
    color: #000;
    cursor: pointer;
    box-sizing: border-box;
    .border{
        height: 1px;
        background: #eee;
        margin: 6px 0;
    }
    li {
      min-width: 38px;
      border-radius: 4px;
      height: 28px;
      line-height: 28px;
      padding: 0 5px;
    }
    li:hover{
        color: #fff;;
        background: #1C7BEF;
    }
    .dis{
      cursor: not-allowed;
      color: #999;
      &:hover{
        color: #999;
        background: #fff;
    }
    }
  }
}
</style>
