import Vue from 'vue'
Vue.directive('tableScrollMore', {
  bind (el, binding, vnode) {
    let scrollDom = el.querySelector('.el-table__body-wrapper')
    el.tableOffset = binding.value.tableOffset || 20
    el.tableSize = binding.value.tableSize || 20
    el.initial = true
    el.tableScroll = function () {
      let childDom = el.querySelectorAll('.el-table__row')
      if (childDom[el.tableOffset] && this.scrollTop + this.offsetHeight >= childDom[el.tableOffset].offsetTop + childDom[el.tableOffset].offsetHeight) {
        el.tableOffset += el.tableSize
        childDom.forEach((item, index) => {
          if (index > el.tableOffset) {
            item.style.display = 'none'
          } else {
            if (index < (el.tableOffset - el.tableSize * 2)) {
              item.style.display = 'none'
            } else {
              item.style.display = 'table-row'
            }
          }
        })
      }
      if (this.scrollTop <= 0) {
        el.tableOffset -= el.tableSize
        childDom.forEach((item, index) => {
          if (index < (el.tableOffset - el.tableSize * 2)) {
            item.style.display = 'none'
          } else {
            if (index > (el.tableOffset + el.tableSize * 2)) {
              item.style.display = 'none'
            } else {
              item.style.display = 'table-row'
            }
          }
        })
        if (el.tableOffset > el.tableSize) this.scrollTop = childDom[el.tableOffset - el.tableSize].offsetTop
      }
    }
    scrollDom.addEventListener('scroll', el.tableScroll, false)
  },
  componentUpdated (el, binding) {
    let childDom = el.querySelectorAll('.el-table__row')
    if (childDom.length && (binding.value.tableReset || el.initial)) {
      el.initial = false
      el.tableOffset = el.tableSize
      let scrollDom = el.querySelector('.el-table__body-wrapper')
      scrollDom.scrollTop = 0
      childDom.forEach((item, index) => {
        if (index > el.tableSize) {
          item.style.display = 'none'
        } else {
          item.style.display = 'table-row'
        }
      })
    }
  },
  unbind (el) {
    let scrollDom = el.querySelector('.el-table__body-wrapper')
    scrollDom.removeEventListener('scroll', el.tableScroll, false)
  }
})
