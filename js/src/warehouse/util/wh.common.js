import { patch } from '@/util/materilconfig'
export const whComFn = {

  /**
   * 科室级联数据转换
   * @param arr        需转换数据                  required
   * @param type       类型数据字段名称
   * @param settingObj patch获取模版数据类型proporty： 类型字段（机构、科室、人员等）attr:类型标签， code：全局code
   * @return Arrary    返回新数组
   */
  sectionMap (arr, type = 'sonLocalSections', settingObj) {
    arr.map(item => {
      if (settingObj) {
        item.name = patch._resetMaterialName({ rows: item[settingObj.property][settingObj.attr], code: settingObj.code })
      }
      // item.label = item.name
      item.value = item.id
      if (item[type] && item[type].length) {
        item.children = item[type]
        this.sectionMap(item[type], type, settingObj)
      }
    })
    return arr
  },
  /**
   * 处理schema需要的option数据
   * @param arr        需转换数据                  required
   * @param type       需要比对的类型数据
   * @return Arrary    返回新数组
   */
  optionMap (arr, type) {
    let newArr = []
    if (arr && arr.length) {
      arr.forEach(item => {
        if (item.relationType === type) {
          newArr.push(item)
        }
      })
    }
    return newArr
  },
  adviceResetData (list) { // 父子医嘱数据重排
    let aList = []
    list.map(item => {
      aList.push(Object.create(item))
    })
    let oMineObj = {}
    aList.forEach(item => {
      const mainGroupId = item.mainGroupId || (item.outpatientDispenseItemObject && item.outpatientDispenseItemObject.mainGroupId)
      if (mainGroupId) {
        if (!oMineObj[mainGroupId]) {
          oMineObj[[mainGroupId]] = {
            mineNum: 0,
            child: [item]
          }
        } else {
          oMineObj[mainGroupId].mineNum += 1
          oMineObj[mainGroupId].child.push(item)
        }
      }
    })
    return oMineObj
  }
}
