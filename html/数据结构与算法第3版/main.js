/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-10-29 06:41:45
 * @LastEditTime: 2020-10-29 06:55:17
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
var framework = 'angular'
var framework = 'react'
console.log(framework) // 'react'

// 上面的代码输出 'react' 在同一作用域下 framework 被重复声明并赋值，可能会导致错误的输出

let language = 'javascript'
let language = 'Ruby!!' // 会抛出错误
console.log(language)

// 会报错 因为崽同一作用域下已经声明过 language 变量

const PI = '3.14163323'
PI = 3.0 // 抛出错误

const jsFramework = {
  name: 'Angular'
}
// 尝试改变 jsFramework 变量的 name 属性
jsFramework.name = 'React'
console.log(jsFramework) // jsFramework = { name: 'React' }

// 对于非对象类型的变量，比如数、布尔、字符串，我们不可以改变变量的值。当遇到对象时, 只读的 const 允许修改或者重新赋值对象的属性
// 但变量本身的引用（内存中的引用地址）不可修改，也就是说不能对这个变量重新赋值
