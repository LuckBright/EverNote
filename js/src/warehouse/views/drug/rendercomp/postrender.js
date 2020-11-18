/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-13 11:27:06
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-20 15:52:23
 */
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import RenderPopover from '@/warehouse/views/drug/component/render.popover.vue'
import { ICONS } from '@/warehouse/views/util/constant.js'
export default {
  props: {
    row: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      cacheList: {},
      changtaskids: [],
      request: false
    }
  },
  mounted () {
    this.$bus.$on('ids', e => {
      this.changtaskids = e
    })
  },
  methods: {
    handlerContent (content, self) {
      if (self.value) return
      const { taskId: id, pageType } = content
      if (id) {
        let flag = self.newContent = this.cacheList[id]
        let index = this.changtaskids.findIndex(task => task === id)
        if (flag && (pageType !== 4 || !~index)) {
          return
        }
        dispenseApi.getExpressInformationList({ orderIds: [id] }).then(res => {
          if (res && res.length) {
            const arr = []
            let bigger = res.length > 1
            res.forEach((item, index) => {
              arr.push(`<div class="${index > 0 ? 'mt10' : ''}">
                <div class="fl" v-if="${bigger}">${index + 1}、</div><div class="inline-block">
                <div>物流公司：${item.expressCompanyName}</div>
                <div>物流单号：${item.expressNumber}</div>
                ${item.deliveryBy ? `<div>配送人姓名：${item.deliveryBy}</div>` : ''}
                ${item.deliveryPhone ? `<div>配送人电话：${item.deliveryPhone}</div>` : ''}
                ${item.description ? `<div>备注：${item.description}</div>` : ''}</div>
              </div>`)
            })
            this.cacheList[id] = self.newContent = arr.join('')
            ~index && this.changtaskids.splice(index, 1)
          } else {
            self.newContent = '<div class="alg_c">暂未查到邮寄信息</div>'
          }
        })
      }
    }
  },
  render (h) {
    const _this = this
    return h(RenderPopover, {
      props: {
        href: ICONS.posted,
        width: 260,
        placement: 'right',
        trigger: 'click'
      },
      on: {
        async click (self) {
          if (!_this.row.taskId) return
          self.newContent = '<div class="cGray alg_c">加载中...</div>'
          _this.handlerContent(_this.row, self)
        }
      }
    })
  }
}

