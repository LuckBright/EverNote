// 富文本详情展示 （科室、人员详情）
import { arrange as axios } from '@/arrange/store/api'
export default {
  name: 'textViews',
  render (h, ctx) {
    return h('div', {
      class: {
        textViews: true
      },
      domProps: {
        innerHTML: this.html
      }
    })
  },
  props: {
    type: { // 1 科室 、 2 人员
      type: [String, Number],
      required: true,
      default: 1
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      html: ''
    }
  },
  created () {
    this.getTextViews()
  },
  methods: {
    getTextViews () {
      let url = this.type === '2' ? 'staff/getStaffListByIdList' : 'subject/getTenantSubjectListByIdList'
      axios.post('/thc-platform-core/out/' + url, {idList: [this.id]}).then(res => {
        this.html = this.type === '2' ? res.data[0].infoPhoto : res.data[0].infoText
      })
    }
  }
}
