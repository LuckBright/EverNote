import api from '@/workspace/store/medicalapi'
export default {
  props: {
    value: Object,
    index: [Number, String]
  },
  data () {
    return {
      options: [],
      list: [],
      loading: false,
      diseaseCode: ''
    }
  },
  methods: {
    focusHandler () {
      let name = this.value[this.SHOU_SHU_NAME] || ''
      this.remoteMethod(name)
    },
    async remoteMethod (name) {
      this.loading = true
      name = name ? name.trim() : (this.value[this.SHOU_SHU_NAME] || '')
      const res = await api.searchDiagnose({
        type: 3,
        origId: this.$store.state.currentUser.organizationId,
        name: name
      })
      let data = []
      if (res && res.data && res.data.resultList) {
        data = res.data.resultList
        data.map(item => {
          item.name = item.diseaseName
          item.code = item.diseaseCode
          return item
        })
      }
      this.loading = false
      this.options = data
    },
    change (value) {
      if (value) {
        const { name, code } = value
        this.$emit('change', { name, code }, this.index)
      } else {
        this.$emit('change', { name: '', code: '' }, this.index)
      }
    }
  }
}
