import api from '@/manages/api/price'
import priceInput from '@/manages/components/price.manage/price.input.vue'
import { getPriceDecimal } from '@/manages/components/price.manage/price.config.js'

let columnsCache = []

// 获取价格体系不同维度价格
export async function getPriceAndPrice (params, byType, sysBatchCodeList) {
  /**
   * byType item-根据收费项查价格 org-根据机构查价格
   * itemId 收费项id
   * orgIdList 机构id列表 /pricemanage/pricing/query/show/tenant
   * itemIdList 机构id
   * orgId 收费项ID列表 /pricemanage/pricing/query/show/org
   */
  if (byType === 'org') {
    if (!params.orgIdList) {
      console.error('没有机构id')
    }
    let res = await api.getPriceByOrg(params)
    let orgObj = {}
    params.orgIdList.forEach(item => (orgObj[item] = {}))
    res.forEach(item => {
      let obj = orgObj[item.orgId]
      obj[item.scene] = item
    })
    return orgObj
  }
  if (byType === 'item') {
    if (!params.itemIdList) {
      console.error('没有收费项id')
    }
    let res = sysBatchCodeList ? await api.getOrgBatchPrice(Object.assign(params, { sysBatchCodeList })) : await api.getPriceByItem(params)
    let itemObj = {}
    params.itemIdList.forEach(item => (itemObj[item] = {}))
    res.forEach(item => {
      let obj = itemObj[item.itemId]
      obj[item.scene] = item
    })
    return itemObj
  }
}

// 获取维护价格表头
export async function getPriceBaseColumns () {
  if (columnsCache.length) {
    return JSON.parse(JSON.stringify(columnsCache))
  }
  let res = await api.getPriceColumns()
  columnsCache = res.map(item => ({
    label: item.sceneName,
    prop: item.scene
  }))
  return JSON.parse(JSON.stringify(columnsCache))
}

export async function getPriceConfig (params, byType, sysBatchCodeList) {
  let res = await Promise.all([getPriceAndPrice(params, byType, sysBatchCodeList), getPriceBaseColumns()])
  return {
    data: res[0],
    columns: res[1]
  }
}

/**
 * @param {*} columns
 * @param {*} data
 * @param {*} key 使用权字段
 */
export function getPriceColumns (columns, data, key = 'usePermission', disabled) {
  if (!data || !columns) {
    return []
  }
  // 获取价格精度配置
  getPriceDecimal()
  let self = this
  return columns.map(item => {
    return Object.assign({}, item, {
      slotName: item.prop,
      width: `${100 + 8 * item.label.length}px`,
      display: true,
      render (h, ctx, row) {
        // price-当前售价 newPrice-调价后价格
        let status = row[key]
        let type = 'edit'
        let rowPrice = row.priceData[ctx.props.tdKey]
        if (rowPrice) {
          if (rowPrice.price === 0) {
            rowPrice.price = '0'
          }
          if (rowPrice.originalPrice === 0) {
            rowPrice.originalPrice = '0'
          }
          if (rowPrice.newPrice === 0) {
            rowPrice.newPrice = '0'
          }
        }
        if (!status) {
          type = 'delete'
        } else if (rowPrice && rowPrice.newPrice) {
          type = 'primary'
        } else if (disabled) {
          type = 'default'
        }
        return h(priceInput, {
          props: {
            type,
            disabled,
            value: rowPrice && (rowPrice.price || rowPrice.originalPrice) || '',
            newPrice: rowPrice && rowPrice.newPrice || ''
          },
          on: {
            change (val) {
              if (!val) {
                return
              }
              self.priceChange(row.orgId, Object.assign({}, val, {
                scene: ctx.props.tdKey,
                sceneName: ctx.props.tdKeyName
              }))
            }
          }
        })
      }
    })
  })
}
export const priceTd = () => {
  // 获取价格精度配置
  getPriceDecimal()
  return {
    name: 'colTd',
    functional: true,
    props: {
      id: String,
      row: Object,
      tdKey: String,
      tdKeyName: String,
      change: Function,
      disabled: Boolean
    },
    render (h, ctx) {
      // price-当前售价 newPrice-调价后价格
      let type = 'edit'
      let row = ctx.props.row
      let rowPrice = row[ctx.props.tdKey]
      if (rowPrice) {
        if (rowPrice.price === 0) {
          rowPrice.price = '0'
        }
        if (rowPrice.originalPrice === 0) {
          rowPrice.originalPrice = '0'
        }
        if (rowPrice.newPrice === 0) {
          rowPrice.newPrice = '0'
        }
      }
      if (rowPrice && rowPrice.newPrice) {
        type = 'primary'
      } else {
        type = 'edit'
      }
      if (ctx.props.disabled) {
        type = 'default'
      }
      return h(priceInput, {
        props: {
          type,
          value: rowPrice && rowPrice.price || '',
          newPrice: rowPrice && rowPrice.newPrice || ''
        },
        on: {
          change (val) {
            if (!val) {
              return
            }
            ctx.props.change && ctx.props.change(row.orgId, Object.assign({}, val, {
              scene: ctx.props.tdKey,
              sceneName: ctx.props.tdKeyName,
              itemId: ctx.props.id
            }))
          }
        }
      })
    }
  }
}

export default {
  getPriceAndPrice,
  getPriceBaseColumns,
  getPriceConfig,
  getPriceColumns
}
