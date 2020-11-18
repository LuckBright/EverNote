import { getMacAddress } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import Vue from 'vue'
export default {
  data () {
    return {
      // 统一维护开发环境macId
      macId: process.env.NODE_ENV === 'development' ? '00-FF-51-4B-B6-34' : localStorage.getItem('macId'),
    }
  },
  methods: {
    getMacAddress () {
      if (this.macId) {
        this.$store.commit('setMacAddress', this.macId)
      } else {
        getMacAddress().then(res => {
          this.$store.commit('setMacAddress', res.data || '')
          this.macId = res.data
        }, err => {
          console.log('err', err)
        })
      }
    },
    define () {
      Object.defineProperty(Vue.prototype, 'macId', {
        configurable: true,
        get () {
          // if (!this.$store.state.macAddress) {
          //   // this.$messageTips(this, 'error', '未获取到macId，刷新后再试')
          //   this.loading = false
          //   throw new Error('未获取到macId，刷新后再试')
          // }
          return this.$store.state.macAddress
        }
      })
    }
  },
  created () {
    this.define()
    this.getMacAddress()
  },
}
