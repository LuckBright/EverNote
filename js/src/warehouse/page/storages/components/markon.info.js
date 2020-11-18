/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-09-29 19:17:38
 * @LastEditTime: 2020-10-21 12:47:09
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
import markonInput from '@/warehouse/page/storages/components/markon.input.vue'
import api from '@/warehouse/page/storages/store/enterapi.js'
let columnsCache = []
let bonusRate = {
  prop: 'bonusRate',
  label: '加成率%',
  width: 130,
  display: true,
}

// 获取维护价格表头
/**
 * @param {Array} columns 机构物资管理传入的价格体系列，不需要重复获取
 * @param {Boolean} noEntry 是否是库房采购入库使用
 */
export async function getPriceBaseColumns (columns = [], noEntry = false) {
  if (!columns.length && !noEntry) {
    let res = await api.getInStockItemPriceAndScene()
    columnsCache = res.priceList.map(item => ({
      label: item.sceneName,
      prop: item.scene
    }))
  } else {
    columnsCache = columns
  }
  // 如果没有基础价这一列，就没有加成率
  let baseCol = columnsCache.find(base => base.prop === 'base')
  return baseCol ? [bonusRate, ...columnsCache] : columnsCache
}

export async function getMarkonConfig (columns, noEntry) {
  let res = await Promise.all([getPriceBaseColumns(columns, noEntry)])
  return {
    columns: res[0]
  }
}

export function getMarkonColumns (columns) {
  if (!columns) {
    return []
  }
  let self = this
  return columns.map(item => {
    return Object.assign({}, item, {
      slotName: item.prop,
      width: `${100 + 10 * item.label.length}px`,
      display: true,
      render (h, ctx, row) {
        let type = 'edit'
        let rowBonusRate
        let tdKey = ctx.props.tdKey
        if (row.priceData && tdKey !== 'bonusRate') {
          let rowData = row.priceData[tdKey]
          rowBonusRate = {
            price: rowData ? row.priceData[tdKey].price : '',
            newPrice: rowData ? rowData.newPrice : ''
          }
        } else {
          rowBonusRate = row[tdKey] !== '' ? row[tdKey] : ''
        }
        if (ctx.props.disabled) {
          type = 'default'
        } else if (rowBonusRate && rowBonusRate.price && rowBonusRate.newPrice && tdKey !== 'bonusRate') {
          type = 'primary'
        }
        return h(markonInput, {
          props: {
            type,
            tdKey: tdKey,
            value: row.priceData ? tdKey === 'bonusRate' ? rowBonusRate : rowBonusRate.price : rowBonusRate,
            newPrice: row.priceData ? rowBonusRate.newPrice : null
          },
          on: {
            /**
             * @param {*} val 新价
             * @param {*} originalPrice 原价
             */
            change (val, originalPrice) {
              self.markonChange(val, tdKey, row, originalPrice, item.label)
            }
          }
        })
      }
    })
  })
}

export default {
  getMarkonColumns,
  getPriceBaseColumns,
  getMarkonConfig
}
