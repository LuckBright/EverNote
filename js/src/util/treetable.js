export default {
  data: () => ({
    tableListData: [], // tableListData 展示数据的data
    foldList: [] // 该数组中的值 都会在列表中进行隐藏  死亡名单
  }),
  watch: {
    'tableData': {
      handler: function (val) {
        if (val) {
          this.tableListData = this.formatConversion([], val)
        }
      },
      immediate: true
    }
  },
  computed: {
    isUnfoldTree () {
      return this.unfoldTree === undefined ? true : this.unfoldTree // unfoldTree不存在时，默认为true不展开树，否则取unfoldTree值
    },
    /*********************************
     ** Fn: foldAllList
     ** Intro: 记录属性结构的首层节点
     ** Author: zyx
     *********************************/
    foldAllList () {
      return this.tableListData.map(x => x.__identity)
    }
  },
  methods: {
    /*********************************
      ** Fn: toggleFoldingStatus
      ** Intro: 切换展开 还是折叠
      ** @params: params 当前点击行的数据
      ** Author: zyx
    *********************************/
    toggleFoldingStatus (params) {
      this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
    },
    /*********************************
      ** Fn: toggleDisplayTr
      ** Intro: 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
      ** @params:
      ** Author: zyx
    *********************************/
    toggleDisplayTr ({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        let item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item) return 'display:none;'
      }
      return ''
    },
    /*********************************
      ** Fn: toggleFoldingClass
      ** Intro: 如果子集长度为0，则不返回字体图标。
      ** Intro: 如果子集长度为不为0，根据foldList是否存在当前节点的标识返回相应的折叠或展开图标
      ** Intro: 关于class说明：permission_placeholder返回一个占位符，具体查看class
      ** @params: params 当前行的数据对象
      ** Author: zyx
    *********************************/
    toggleFoldingClass (params) {
      return params.nodes.length === 0 ? 'permission_placeholder' : (this.foldList.indexOf(params.__identity) === -1 ? 'iconfont icon-domn' : 'iconfont icon-up')
    },
    /*********************************
      ** Fn: formatConversion
      ** Intro: 将树形接口数据扁平化
      ** @params: parent 为当前累计的数组  也是最后返回的数组
      ** @params: nodes 为当前节点仍需继续扁平子节点的数据
      ** @params: index 默认等于0， 用于在递归中进行累计叠加 用于层级标识
      ** @params: family 装有当前包含元素自身的所有父级 身份标识
      ** @params: elderIdentity 父级的  唯一身份标识
      ** Author: zyx
    *********************************/
    formatConversion (parent, nodes, index = 0, family = [], elderIdentity = 'x') {
      // nodes如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (nodes.length > 0) {
        nodes.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          this.$set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          this.$set(x, '__family', [...family, elderIdentity + '_' + i])
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          this.$set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          if (!this.isUnfoldTree) this.foldList.push(x.__identity) // 是否默认展开树
          x.nodes = x.nodes || x.children || x.child || x.childNodes || x.outOrgGetOrgAndChildrenResDTOList || '' // 支持children、nodes、child格式数据
          // 如果仍有子集，则进行递归
          if (x.nodes && x.nodes.length > 0) this.formatConversion(parent, x.nodes, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
        })
      } return parent
    }
  }
}
