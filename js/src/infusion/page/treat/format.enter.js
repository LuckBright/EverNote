
// import {domClickHandle} from '@/util/common'
export default {
  data () {
    return {

    }
  },
  methods: {
    formatEnter (data) {
      data = data || ''
      return data.replace(/\\r\\n/g, '<br/>')
    }
  }
}
