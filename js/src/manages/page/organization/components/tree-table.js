import Vue from 'vue'

export default Vue.component('tree-table', {
  render (h) {
    const elTree = h('el-tree', {
      ref: 'tree',
      ...this.treeProps,
      props: {
        ...this.treeProps.props,
        nodeKey: 'id',
      },
      class: (this.treeProps.class || '') + ' tree-table',
      scopedSlots: {
        default: props => h('div', {class: (this.contentClass || '') + ' node-content'}, this.$scopedSlots.default(props))
      },
    })
    const header = this.headerColumns ? h('div', {class: 'tree-table-header'}, this.headerColumns.map((item, index) => {
      return h('div', getHeaderProp.bind(this)(item, index), item.slot ? this.$slots[item.slot] : [item.label])
    })) : null
    return h('div', getWrapProp(), [
      ...(header ? [header] : []),
      elTree,
    ])
  },
  mounted () {
    // 最优方案：使用 mutationObserver 监听 .el-tree 容器，在高度变化时，判断容器的滚动条是否会出现，如果出现，则设置 last的样式 为padding-left 25px
    // 次优方案：初始化的时候判断是否出现滚动条，不监听高度变化
    this.testScroll()
    window.addEventListener('resize', this.testScroll, true)
  },
  methods: {
    testScroll () {
      setTimeout(() => {
        const elTree = this.$refs.tree
        if (elTree && elTree.$el) {
          const el = elTree.$el
          this.hasScroll = el.scrollHeight > el.clientHeight
        }
      }, 1000)
    }
  },
  destroyed () {
    // 风险提示：这里移除resize的监听是否会对其他resize监听造成影响？ 2019-10-17
    window.removeEventListener('resize', this.testScroll)
  },
  data () {
    return {
      hasScroll: false,
    }
  },
  props: {
    treeProps: {
      type: Object,
    },
    headerColumns: {
      type: Array,
    },
    contentClass: {
      type: String,
    }
  },
})

function getHeaderProp (item, index) {
  const style = {
    width: typeof item.width === 'string' ? item.width : item.width,
  }
  return {class: (item.class || '') + ' tree-table-header-item' + (index === (this.headerColumns || []).length - 1 ? ' last' + ' ' + (this.hasScroll ? ' has-scroll' : ' ') : ''), ...item.props, style}
}

function getWrapProp () {
  return {class: 'tree-table-wrap'}
}
