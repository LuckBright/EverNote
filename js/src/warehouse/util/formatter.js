import * as fn from '@/util/materilconfig'
/**
 *  numUintFormatter
 *  element ui el-table  :formatter
 * 数量单位一起展示（后端高表数据查询单位引用materilconfig中patch方法）
 *
 * @param {*} row
 * @param {*} column
 * @param {*} cellValue
 * @param {*} index
 * @returns string
 */
export const numUintFormatter = function (row, column, cellValue, index) {
  let skuArr = []
  if (row.localSettingObject && row.localSettingObject.materialSkuObject && row.localSettingObject.materialSkuObject.materialPropertys) {
    skuArr = row.localSettingObject.materialSkuObject.materialPropertys
  }
  const unitName = fn.patch.findBasesourceCode({ arr: skuArr }) || ''
  if (cellValue >= 0) {
    return cellValue + ` ${unitName}`
  }
  return '-'
}
