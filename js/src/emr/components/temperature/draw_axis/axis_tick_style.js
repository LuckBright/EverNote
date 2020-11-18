import {DataSourceSingle} from '../datasource_adapter.js'
export class AxisTickStyle {
  constructor () {
    this.arr2 = ['temperatureAndPulse', 'pain', 'hx', 'time']
    this.arr3 = ['xueYa']
    // 动态增加项目
    this.arr = DataSourceSingle().dynamicColums.filter(item => {
      return !this.arr2.includes(item) && !this.arr3.includes(item)
    })
  }
  getStrokeColor (name, index) {
    if (this.arr2.includes(name)) {
      if (name === 'hx' || name === 'time') {
        if (index % 6 === 0 && index !== 0) {
          return 'red'
        } else {
          return '#000'
        }
      }
      if (index % 6 === 0 && index !== 0) {
        return 'red'
      } else if (index === 0) {
        return '#000'
      } else {
        return '#ccc'
      }
    }
    if (this.arr.includes(name)) {
      if (index !== 0) {
        return 'red'
      } else {
        return '#000'
      }
    }
    if (this.arr3.includes(name)) {
      if (index % 2 === 0 && index !== 0) {
        return 'red'
      } else {
        return '#000'
      }
    }
  }
  getStrokeWidth (name, index) {
    if (this.arr2.includes(name)) {
      if (index % 6 === 0 && index !== 0) {
        return 2
      } else {
        return 1
      }
    }
    if (this.arr.includes(name)) {
      if (index !== 0) {
        return 2
      } else {
        return 1
      }
    }
    if (this.arr3.includes(name)) {
      if (index % 2 === 0 && index !== 0) {
        return 2
      } else {
        return 1
      }
    }
  }
}
