import Vue from 'vue'
Vue.directive('everBindEnter', {
  bind: function (el, binding, vnode) {
    const enterTabToggle = el
    let inputDOMArr = enterTabToggle.querySelectorAll('.el-input__inner, .el-button, textarea, .el-button--primary, .ever-enter-focus')
    let next = 0
    // inputDOM[0] && inputDOM[0].focus()
    el.onclick = function (e) {
      inputDOMArr = enterTabToggle.querySelectorAll('.el-input__inner, .el-button, textarea, .el-button--primary, .ever-enter-focus')
      let inputDOM = []
      // 排除diabled true 的元素
      inputDOMArr.forEach((item, index) => {
        if (!item.disabled && !item.className.includes('el-picker-panel__link-btn')) {
          if (item.parentElement.parentElement.contains(e.target)) {
            vnode.context.$root.everBindEnterIndex = index
          }
          inputDOM.push(item)
        }
      })
      vnode.context.$root.everBindEnterDom = inputDOM
      // button按钮 触发点击
      // resetHead： 调整位置 回退步数
      const { resetHead } = binding.value || {}
      if (resetHead !== undefined && e.target.className.split(' ').includes('el-button')) {
        next -= resetHead
        setTimeout(() => {
          inputDOM[next] && inputDOM[next].focus()
        }, 300)
      }
    }

    el.onkeydown = function (e) {
      inputDOMArr = enterTabToggle.querySelectorAll('.el-input__inner, .el-button, textarea, .el-button--primary, .ever-enter-focus')
      let inputDOM = []
      // 排除diabled true 的元素
      for (let item of inputDOMArr) {
        if (!item.disabled && !item.className.includes('el-picker-panel__link-btn')) {
          inputDOM.push(item)
        }
      }
      vnode.context.$root.everBindEnterDom = inputDOM
      let keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13 && !e.ctrlKey) {
        if (inputDOM && inputDOM.length) {
          inputDOM.forEach((item, index) => {
            let isValid = false
            if (item === e.target) {
              isValid = true
            } else {
              if (e.target.className.indexOf('el-select__input') !== -1 && e.target.parentElement.parentElement.contains(item)) {
                isValid = true
              }
            }
            if (isValid) {
              if (e.shiftKey) {
                next = (index - 1 < 0) ? 0 : (index - 1)
              } else {
                next = index + 1
              }
            }
          })
        }
        const { cycle, updateDOM } = binding.value || {}
        if (cycle) {
          if (next === inputDOM.length) {
            next = 0
          }
        } else {
          // 医嘱提交逻辑
          if (next === inputDOM.length && (vnode.data.staticClass === 'issued_orders_box' || vnode.data.ref === 'serviceCommon')) {
            inputDOM[next - 1] && inputDOM[next - 1].blur()
          }
        }
        // 解决日期组件第2个不focus的情况
        vnode.context.$root.everBindEnterDom = inputDOM
        vnode.context.$root.everBindEnterIndex = next
        setTimeout(() => {
          if (vnode.data.staticClass === 'issued_orders_box') {
            inputDOM[next] && inputDOM[next].focus() // 解决级联组件没有focus事件触发问题
            inputDOM[next] && inputDOM[next].click()
            return
          }
          // 解决页面v-if生成的DOM元素获取不到
          if (updateDOM) {
            inputDOM = enterTabToggle.querySelectorAll('.el-input__inner, .el-button, textarea, .el-button--primary, .ever-enter-focus')
          }
          inputDOM[next] && inputDOM[next].focus()
        }, 300)
      }
    }
  }
})

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// table的滚动加载
Vue.directive('loadmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
      let sign = 1
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value(scrollDistance)
      }
    })
  }
})
