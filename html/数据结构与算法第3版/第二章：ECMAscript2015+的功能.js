/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-10-29 06:41:45
 * @LastEditTime: 2020-11-01 06:33:19
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
/**
 * 该章节主要讲述的功能
 * 使用 let 和 const 声明变量
 * 模板字符串
 * 解构
 * 展开运算符
 * 箭头函数： =>
 * 类
 * 模块
 */

// 用 let  替代 var 声明变量
// var framework = 'angular'
// var framework = 'react'
// console.log(framework) // 'react'

// 上面的代码输出 'react' 在同一作用域下 framework 被重复声明并赋值，可能会导致错误的输出

// let language = 'javascript'
// let language = 'Ruby!!' // 会抛出错误
// console.log(language)

// 会报错 因为崽同一作用域下已经声明过 language 变量

// const PI = '3.14163323'
// PI = 3.0 // 抛出错误

// const jsFramework = {
//   name: 'Angular'
// }
// // 尝试改变 jsFramework 变量的 name 属性
// jsFramework.name = 'React'
// console.log(jsFramework) // jsFramework = { name: 'React' }

// 对于非对象类型的变量，比如数、布尔、字符串，我们不可以改变变量的值。当遇到对象时, 只读的 const 允许修改或者重新赋值对象的属性
// 但变量本身的引用（内存中的引用地址）不可修改，也就是说不能对这个变量重新赋值

/**
 * let 和 const 的变量作用域
 */

//  例子

let movie = 'lord of the Rings'
// var movie = 'Batman v Superman' // 抛出错误, 变量已声明 (Uncaught SyntaxError: Identifier 'movie' has already been declared)

// 使用 var 会重新赋值
// var movie = 'lord of Rings'
// var movie = 'Batman v Superman'
// console.log(movie) // Batman v Superman

// function startWarsFan () {
//   const movie = 'Star Wars'
//   return movie
// }
// console.log(startWarsFan()) // Star Wars

// function marvelFan () {
//   movie = 'The Avengers'
//   return movie
// }
// console.log(marvelFan(), movie) // marvelFan()：The Avengers movie：The Avengers 在 marveFan 函数中被修改

/**
 * 声明展开和剩余参数
 * 在这里顺道讲解一下 apply 和 call
 */
function sum (x = 1, y = 2, z = 3) {
  return x + y + z
}

let params = [3, 4, 5]
// console.log(sum(...params))

/**
 * apply
 * 语法：
 *  Function.apply(thisArg, [argsArray])
 * 参数
 * thisAry
 *  必选的。在 func 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
 * argsArray
 *  可选的。一个数组或者类数组对象，(其中的数组元素将作为单独的参数传给 func 函数)。如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。
 * 返回值
 * 调用有指定this值和参数的函数的结果
 */

// sum.apply(undefined, params) // 12

// 在函数中，展开运算符（...）也可以代替 arguments，当做剩余参数使用。考虑一下例子
// function restParamaterFunction (x, y, ...a) {
//   return (x + y) * a.length
// }
// console.log(restParamaterFunction(1, 2, 'hello', true, 7)) // 9

// 以上代码合下面代码效果是相同的 （同样输出 9 ）
// function restParamaterFunction (x, y) {
//   // 从 arguments 里面 第 2 个开始截取，截取到末尾
//   var a = Array.prototype.slice.call(arguments, 2)
//   console.log(a)
//   return (x + y) * a.length
// }
// console.log(restParamaterFunction(1, 2, 'hello', true, 7)) // 9


/**
 * 增强的对象属性
 */

//  一次初始化多个变量
// let [x, y] = ['a', 'b']
// console.log(x, y)


// // 以上代码和下面代码是一样的
// var x = 'a'
// var y = 'b'

// // 数组结构也可以用来进行值的互换
// debugger
// [x, y] = [y, x]
// console.log(x, y)

/**
 * 
 * 划 重点 （数组解构换值前声明的变量一定要加分号！！！！！！！！！）
 */
let x = 1;
let y = 2;
[x, y] = [y, x]
console.log(x, y)

// 以上代码和下面代码是一样的

// var temp = x
// x = y
// y = temp
// console.log(x, y)

/**
 * 使用类进行面向对象编程
 */

// ES5 写法
// function Book (title, pages, isbn) {
//   this.title = title
//   this.pages = pages
//   this.isbn = isbn
// }
// Book.prototype.printTitle = function () {
//   console.log(this.title)
// }

// 以上 和 下面 输出结果一样
// ES6 写法
class Book {
  constructor (title, pages, isbn) {
    this.title = title
    this.pages = pages
    this.isbn = isbn
  }
  printTitle () {
    console.log(this.title)
  }
}

// 只需要使用 class 关键字，声明一个有 constructor 函数 和诸如 printTitle 等其他函数的类。ES6 的类是基于原型语法的语法糖

/**
 * 继承
 */

 class ITBook extends Book { // 使用 extends 继承 Book 类
   constructor (title, pages, isbn, tecnology) {
    super(title, pages, isbn) // 使用 super 引用父类的构造函数
    this.tecnology = tecnology
   }
   printTecnology () {
     console.log(this.tecnology)
   }
 }

//  let itBook = new ITBook('数据类型与算法', 32, '否', '继承')

/**
 * 属性存取器
 */


/**
 * 模块化
 * 导入 类 的时候，不需要将 类 名包裹在 {}。只有模块有多个成员的时候才使用 {}
 */

//  import { squareArea, cirleArea } from './util/demo.js'

//  console.log(squareArea(2), cirleArea(3))

/**
 * typescript (暂时跳过)
 */