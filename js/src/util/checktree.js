
export default {
  data () {
    return {
      treeArr: []
    }
  },
  created () {
  },
  methods: {
    handleCheckChange (data, node) {
      // console.log(data)
      let item = {
        rootId: this.getRootNode(this.treeData, node).data.id,
        id: data.id
      }
      if (node.checked) {
        this.additem(item, node)
      } else {
        this.delitem(item, node)
      }
    },
    initTree (arr, ids) {
      for (let i = 0; i < ids.length; i++) {
        let item = {
          rootId: this.getRootId(arr, ids[i]),
          id: ids[i]
        }
        // console.log(item, 'item')
        this.treeArr.push(item)
      }
      return this.treeArr
    },
    getRootId (arr, id) {
      let currentNode = this.getNode(arr, id)
      console.log('currentNode', currentNode)
      let rootNode = this.getRoot(currentNode, id, arr)
      return rootNode.id
    },
    // 获取根的id
    getRootNode (arr, node) {
      for (var i = 0; i < arr.length; i++) {
        if (node.parent.parent == null) {
          return node
        } else {
          var n = this.getRootNode(arr, node.parent)
          if (n) {
            return n
          }
        }
      }
    },
    additem: function (item, node) {
      if (!this.haveitem(node)) {
        this.treeArr.push(item)
      } else {
        let index = this.getindex(node)
        if (index !== -1) {
          this.treeArr.splice(index, 1, item)
        }
      }
      return this.treeArr
    },
    delitem: function (item, node) {
      let index = this.getindex(node)
      if (index !== -1) {
        this.treeArr.splice(index, 1)
      }
      return this.treeArr
    },
    emptyTree () {
      this.treeArr = []
    },
    getTreeIds () {
      let ids = []
      this.treeArr.forEach((item, index) => {
        ids.push(item.id)
      })
      return ids
    },
    // 判断是否存在同一个根下
    haveitem: function (node) {
      let currentRootId = this.getRootNode(this.treeData, node).data.id
      let tree = this.treeArr
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].rootId === currentRootId) {
          return true
        }
      }
      return false
    },
    // 获取当前node的index
    getindex: function (node) {
      let currentRootId = this.getRootNode(this.treeData, node).data.id
      let tree = this.treeArr
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].rootId === currentRootId) {
          return i
        }
      }
      return -1
    },
    // 同级替换
    isEqual (item) {
      let tree = this.treeArr
      if (item.parentId === null) {
        return false
      }
      for (let i = 0; i < tree.length; i++) {
        if (item.parentId === tree[i].parentId) {
          let index = this.getindex(tree[i])
          this.treeArr.splice(index, 1, item)
          return false
        }
      }
    },
    // 存在父级
    isparent: function (item) {
      let tree = this.treeArr
      for (let i = 0; i < tree.length; i++) {
        if (item.parentId === tree[i].id) {
          return true
        }
      }
    },
    // 存在子集
    isChild: function (item) {
      let tree = this.treeArr
      for (let i = 0; i < tree.length; i++) {
        if (item.id === tree[i].parentId) {
          return true
        }
      }
    },
    getParentIndex (item) {
      let tree = this.treeArr
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === item.parentId) {
          return i
        }
      }
      return -1
    },
    getNode (arr, id) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i]
        }
        if (arr[i].children) {
          var n = this.getNode(arr[i].children, id)
          if (n) {
            return n
          }
        }
      }
    },
    getRoot (item, id, arr) {
      console.log(item)
      // if (!item) return false
      if (item.parentId === null) {
        return item
      } else {
        if (item.parentId) {
          item = this.getNode(arr, item.parentId)
          // console.log('进行中', item)
          return this.getRoot(item, id, arr)
        }
      }
    }
  }
}

