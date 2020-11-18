/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-10-31 11:19:00
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2019-11-21 19:27:15
 */

// todo: plugins
export default {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          _$loading: null
        }
      },
      // created () {
      //   console.log('created', this.$options.name)
      //   this.openFullScreen()
      // },
      // mounted () {
      //   this.closeFullScreen()
      // },
      // methods: {
      //   openFullScreen () {
      //     this._$loading = this.$loading({
      //       lock: true,
      //       text: 'Loading',
      //       spinner: 'el-icon-loading',
      //       background: 'rgba(255, 255, 255, 0.5)'
      //     })
      //   },
      //   closeFullScreen () {
      //     this._$loading.close()
      //   }
      // }
    })
  }
}
