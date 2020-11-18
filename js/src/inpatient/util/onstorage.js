export default {
  data () {
    return {
      storageEventList: {}
    }
  },
  methods: {
    addstorage (key, callback) {
      if (Object.keys(this.storageEventList).length === 0) window.addEventListener('storage', this.onstorage)
      this.storageEventList[key] = this.storageEventList[key] || []
      this.storageEventList[key].push(callback)
    },
    onstorage (e) {
      if (e.oldValue === e.newValue) return
      let key = e.key
      for (let element in this.storageEventList) {
        if (element === key) {
          this.storageEventList[element].forEach(ele => {
            ele(key, e.oldValue, e.newValue)
          })
        }
      }
    }
  },
  beforeDestroy () {
    if (Object.keys(this.storageEventList).length > 0)window.removeEventListener('storage', this.onstorage)
  },
}
