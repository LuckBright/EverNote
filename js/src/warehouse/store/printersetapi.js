import storage from '@/util/storage'

// 根据帆软code获取打印机配置 生成打印方法里面的参数
function getPrinterSetByCode (code) {
  let _set = getById(code)
  let _res = {
    settings: {}
  }
  if (_set.preview === 2) {
    _res.preview = true
  } else if (_set.preview === 1) {
    _res.preview = false
  }
  if (_set.printer) {
    _res.settings.printer = _set.printer
  }
  if (_set.portrait === 2) {
    _res.settings.portrait = true
  } else if (_set.portrait === 1) {
    _res.settings.portrait = false
  }
  if (_set.paperName && _set.paperName !== '-1') {
    _res.settings.paperName = _set.paperName
  }
  if (_set.paperWidth) {
    _res.settings.paperWidth = _set.paperWidth
  }
  if (_set.paperHeight) {
    _res.settings.paperHeight = _set.paperHeight
  }
  return _res
}

// 获取code获取配置信息
function getById (code) {
  let arr = JSON.parse(storage.getLocalStorage('PrinterSetData')) || []
  let res = {}
  arr.forEach(item => {
    if (item.fanruanCode === code) {
      res = item
    }
  })
  return res
}

export default{
  getById,
  getPrinterSetByCode
}
