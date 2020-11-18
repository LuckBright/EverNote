import {configData, defaultItemConfig, components} from './configdata.js'

// 体温脉搏
const temperatureAndPulse = 'temperatureAndPulse'
// 疼痛等级
const pain = 'pain'
// 呼吸
const hx = 'hx'
// 新增的配置
// function setRange (item, data) {
//   if (item.nameEn !== temperatureAndPulse) return {}
//   let [temperatureMin, temperatureMax, pulseMin, pulseMax] = [34, 42.4, 20, 188]
//   item.pulseRange = {pulseMin, pulseMax}
//   item.temperatureRange = {temperatureMin, temperatureMax}
//   return item
// }

export let printRes = (key, value) => {
  if (components.includes(key)) return false
  console.log(key, value)
}
export class DataSourceAdapter {
  constructor (dataSource) {
    this.defaultItemConfig = JSON.parse(JSON.stringify(defaultItemConfig))
    this.initData(dataSource)
    this.addNewHeaderItem()
  }
  get bloodPressure () {
    let data = this.data.filter(item => item.nameEn === 'xueYa')[0]
    return {
      ...data,
      data: this.originalData.dynamicTable.data['xueYa']
    }
  }
  get breath () {
    let data = this.data.filter(item => item.nameEn === 'hx')[0]
    return {
      ...data,
      data: this.originalData.dynamicTable.data['hx'],
      top: this.chartType === 1 ? 600 : 100
    }
  }
  get temperatureAndPulse () {
    let data = this.data.filter(item => item.nameEn === temperatureAndPulse)[0]
    return {
      ...data,
      data: this.originalData.chartData || [],
      statusUp: this.originalData.statusUp || [],
      statusDown: this.originalData.statusDown || [],
      height: this.chartType === 1 ? 600 : 500,
      pulseRange: {
        pulseMin: this.tempPulseSection[2],
        pulseMax: this.tempPulseSection[3],
      },
      temperatureRange: {
        temperatureMin: this.tempPulseSection[0],
        temperatureMax: this.tempPulseSection[1],
      }
    }
  }
  get painData () {
    let painData = this.data.filter(item => item.nameEn === 'pain')[0]
    return {
      ...painData,
      data: this.originalData.painData || [],
      top: this.chartType === 1 ? 0 : 500,
      height: this.chartType === 1 ? 0 : 100
    }
  }
  get timeBarType () { // 时间轴
    return this.getTimeBarType()
  }
  get dynamicDataNames () {
    let names = []
    this.originalData.dynamicTable.header.forEach(item => {
      names.push(item.nameEn)
    })
    return names
  }
  get beginDate () {
    return this.beginTime
  }
  get dynamicColums () { // 动态数据
    let colums = []
    this.originalData.dynamicTable.header.forEach(item => {
      if (!['hx', 'xueYa'].includes(item.nameEn)) {
        colums.push(item.nameEn)
      }
    })
    return colums
  }
  get getData () {
    this.getTemperatureData()
    this.getPainData()
    this.getDynamicTable()
    return this.data.filter(item => item.show)
  }
  get startWithNum () {
    return this.startNum
  }
  initData (dataSource) {
    this.originalData = dataSource
    this.chartType = Number(dataSource.charType)
    this.beginTime = dataSource.beginTime
    this.startNum = JSON.parse(dataSource.timePeriodConfig)[0]
    this.tempPulseSection = JSON.parse(dataSource.tempPulseSection) || [34, 42.4, 20, 188]
    this.data = configData.map(item => {
      // 控制疼痛的显示隐藏
      if (this.chartType === 1) {
        if (item.nameEn === pain) {
          item.show = false
        } else {
          item.show = true
        }
      } else {
        item.show = true
      }
      // 传入开始时间
      item.beginTime = this.beginTime
      // 设置timebarType
      // if (item.nameEn === 'time') {
      //   item.timeBarType = this.getTimeBarType()
      // }
      item.startNum = this.startNum

      return {...item}
    })
    this.dyanmicTableHeader = this.originalData.dynamicTable.header
  }
  findItem (nameEn) {
    return configData.some(item => item.nameEn === nameEn)
  }
  addNewHeaderItem () {
    this.dyanmicTableHeader.forEach((item, index) => {
      if (!this.findItem(item.nameEn)) {
        if (index < 4) return console.error('请检查体温单配置,血压以上插入了非法数据', item)
        // console.log(item, index, '没找到')
        let newItem = Object.assign({}, this.defaultItemConfig, item)
        if (index === 4) {
          newItem.top = newItem.top * 2
        }
        if (item.nameEn === 'xueYa') {
          newItem.stepX = 12
        }
        this.data.push(newItem)
      }
    })
  }
  getTimeBarType () {
    const timeMode = this.originalData.timeMode || 24
    const timeConfig = JSON.parse(this.originalData.timePeriodConfig)
    const start = Number(timeConfig && timeConfig[0]) || 2
    // start2of24
    return `start${start}of${timeMode}`
  }
  getTemperatureData () {
    this.data.forEach(item => {
      if (item.nameEn === temperatureAndPulse) {
        // printRes(item.nameCn, this.originalData.chartData)
        // printRes('事件上', this.originalData.statusUp)
        // printRes('事件下', this.originalData.statusDown)
        // 体温脉搏相关数据
        item.data = this.originalData.chartData || []
        item.statusUp = this.originalData.statusUp || []
        item.statusDown = this.originalData.statusDown || []
        // 高度
        item.height = this.chartType === 1 ? 600 : 500
      }
    })
  }
  getPainData () {
    this.data.forEach(item => {
      if (item.nameEn === pain) {
        // printRes(item.nameCn, this.originalData.painData)
        item.data = this.originalData.painData || []
        item.top = this.chartType === 1 ? 0 : 500
        item.height = this.chartType === 1 ? 0 : 100
      }
    })
  }
  getNameCn () {
    let dyanmicTableHeader = this.originalData.dynamicTable.header
    this.data.map(item => {
      dyanmicTableHeader.map(sItem => {
        if (item.nameEn === sItem.nameEn) {
          item.nameCn = sItem.nameCn || item.defaultName
          return item.nameCn
          // console.log(item.nameEn, sItem.nameEn, item.nameCn)
        }
      })
    })
  }
  getDynamicTable () {
    let dyanmicTableData = this.originalData.dynamicTable.data
    let dataKeys = Object.keys(dyanmicTableData)
    this.data.forEach((item, index) => {
      if (dataKeys.includes(item.nameEn)) {
        item.data = dyanmicTableData[item.nameEn] || []
        this.getNameCn()
      }
      if (item.nameEn === hx) {
        item.top = this.chartType === 1 ? 600 : 100
      }
    })
  }
}
export let DataSourceSingle = (function () {
  let instance
  return function (data, reload) {
    if (reload) {
      instance = new DataSourceAdapter(data)
    }
    return instance
  }
})()
