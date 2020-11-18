import listcols from '@/phr/assets/json/listcols'

export const formateColums = (columns, title, width = 'auto') => {
  let nowColdata = listcols[title]
  let tempColumns = [...columns]
  if (nowColdata) {
    let tempColObj = nowColdata.properties
    for (let k in tempColObj) {
      if (!(columns.find((item, index) => { return item.prop === k }))) {
        tempColumns.push({
          prop: k,
          label: tempColObj[k].description,
          hidden: true,
          width: width
        })
      }
    }
  }
  return tempColumns
}
