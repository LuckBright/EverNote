import Vue from 'vue'
Vue.directive('everClickOnce', {
  bind: function (el, binding, vnode) {
    el.onclick = function (e) {
      vnode.context[binding.expression] = true
      setTimeout(_ => {
        vnode.context[binding.expression] = false
      }, +binding.arg || 3000)
      e.preventDefault()
    }
  }
})
