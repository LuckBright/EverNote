/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-11-01 06:33:38
 * @LastEditTime: 2020-11-03 06:29:56
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
/**
 * 几乎所有的编程语言都支持数组类型，以为 数组 是最简单 的内存数据结构
*/

/**
* 创建和初始化数组 （这里就不说了）
*/

/**
 * 访问元素和迭代数组
 */

  // 求斐波那契数列的前 20 个数。已知斐波那契数列中的前两项是 1，从第三项开始每一项都等于前两项之和
  const fibonacci = []
  fibonacci[1] = 1
  fibonacci[2] = 1

  for (let i = 3; i < 20; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2]
  }
  console.log(fibonacci) //  [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]\

  // 斐波那契数列中不存在 0 ，这里直接略过

  /**
   * 往数组的开头插入元素
   */

// 首先需要腾出数组里的第一个元素的位置，把所有的元素向右移一位。可以循环数组中的元素，从最后一位开始，将对应的上一个元素 （i - 1）的值赋值给它（i），
// 依次处理，最后把想要的值赋值给第一个位置（索引 0 ）
// 跟 unshift 的执行是一样的
// Array.prototype.insertFirstPosition = function (value) {
//   for (let i = this.length; i >= 0; i--) {
//     this[i] = this[i - 1]
//   }
//   this[0] = value
// }
// let ary = [1, 2, 3, 4, 5]
// ary.insertFirstPosition(6)
// console.log(ary) // [6, 1, 2, 3, 4, 5]

/**
 * 移除数组的第一个元素
 * 元素整体右移一位，创建一个新数组，将不是 undefined 的元素 push 进新数组
 */

Array.prototype.reIndex = function (myArray) {
  const newArr = []
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i] !== undefined) newArr.push(myArray[i])
  }
  console.log(newArr)
  return newArr
}

Array.prototype.ZsPop = function () {
  for (let i = 0; i < this.length; i++) {
    this[i] = this[i + 1]
  }
  return this.reIndex(this)
}

/**
 * 二维数组
 * console.table(Array) 打印一个表单样式的数组，更好的理解数组的每一项
 */

 let twoAry = [
   [1, 2, 3],
   [4, 5, 6]
 ]
 console.table(twoAry)

