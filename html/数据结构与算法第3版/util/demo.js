/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-10-31 07:00:17
 * @LastEditTime: 2020-11-01 06:21:47
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
/**
 * 模块化示例
 */

//  普通写法
// r ** 2 (2的平方根)
//  const cirleArea = r => 3.14 * (r ** 2)

//  const squareArea = s => s * s

//  export { cirleArea, squareArea }

// export const cirleArea = r => 3.14 * (r ** 2)

// export const squareArea = s => s * s

// 只有一个变量需要导出的时候
export default class Book {
  constructor (name) {
    this.name = name
  }
  printName () {
    console.log(this.name)
  }
}