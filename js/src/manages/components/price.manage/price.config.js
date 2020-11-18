
import api from '@/rcm/store/tariffs/modify.price.api.js'

export function getPriceDecimal () {
  api.getTenant().then(res => {
    setPriceDecimal(+res.digitCapacity || 0)
  })
}

export function setPriceDecimal (val) {
  config.priceDecimal = val
}

export let config = {}

Object.defineProperty(config, 'priceDecimal', {
  _priceDecimal: null,
  get () {
    return this._priceDecimal
  },
  set (val) {
    this._priceDecimal = val
  }
})

export default {
  getPriceDecimal,
  setPriceDecimal
}

