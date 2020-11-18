export default {
  methods: {
    findStatusName (num) {
      let index = this.setStatusName.findIndex(item => {
        return item.id === num
      })
      return index > -1 ? this.setStatusName[index].name : ''
    },
    // data  array   匹配数据
    // id    number  id
    // hide  bool    是否显示新建
    // or    bool    false  取id判断 否则 取value判断
    setName (data, id, hide, or) {
      if (data === undefined) {
        return ''
      }
      let index = data.findIndex(item => {
        if (item.id) {
          if (typeof item.id === 'string') {
            return item.id === id + ''
          } else {
            return item.id === id
          }
        }
        return item.value === id + ''
      })
      if (index >= 0) {
        return or ? data[index].value : data[index].name || data[index].label
      }
      if (hide) {
        return ''
      }
      return '新建'
    },
    adviceResetData (list) { // 父子医嘱数据重排
      const aData = [...list]
      let oMineObj = {}
      aData.slice(0).map(item => {
        if (!oMineObj[item.adviceId || item.outpatientDispenseItemObject.adviceId]) {
          oMineObj[[item.adviceId || item.outpatientDispenseItemObject.adviceId]] = {
            mineNum: 0,
            child: [item]
          }
        } else {
          oMineObj[item.adviceId || item.outpatientDispenseItemObject.adviceId].mineNum += 1
          oMineObj[item.adviceId || item.outpatientDispenseItemObject.adviceId].child.push(item)
        }
      })
      return JSON.parse(JSON.stringify(oMineObj))
    },
  }
}
