export default {
  data () {
    return {
      entexpands: []
    }
  },
  methods: {
    rowHover (row, column, cell, event) {
      if (this.obj.type && this.obj.type !== '15') {
        event.target.parentNode.classList.add('hover_rows')
      }
    },
    rowExpand (row, column, event) {
      if (this.obj.type && this.obj.type === '15') return
      if (row && !row.isManageAlone) return
      let trs = this.$refs.table.$el.children[2].getElementsByTagName('tr')
      let tr = this._getTrEle(event.target)
      for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove('bg_rows')
      }
      if (this.entexpands.indexOf(row.localMaterialId) < 0) {
        this.entexpands = []
        this.entexpands.push(row.localMaterialId)
        tr.classList.add('bg_rows')
      } else {
        this._removed(this.entexpands, row.localMaterialId)
      }
    },
    // 销毁报废
    rowDestroy (row, column, event) {
      if (!row.detailList) return
      let trs = this.$refs.table.$el.children[2].getElementsByTagName('tr')
      let tr = this._getTrEle(event.target)
      for (let i = 0; i < trs.length; i++) {
        trs[i].classList.remove('bg_rows')
      }
      if (this.entexpands.indexOf(row.localMaterialId) < 0) {
        this.entexpands = []
        this.entexpands.push(row.localMaterialId)
        tr.classList.add('bg_rows')
      } else {
        this._removed(this.entexpands, row.localMaterialId)
      }
    },
    _getTrEle (el) {
      var parent = el.parentNode
      if (parent && parent.nodeName === 'TR') {
        return parent
      } else if (parent) {
        return this._getTrEle(parent)
      }
    },
    _removed (data, val) {
      let index = data.indexOf(val)
      if (index > -1) {
        data.splice(index, 1)
      }
    }
  }
}
