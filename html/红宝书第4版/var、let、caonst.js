/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-11-14 06:33:59
 * @LastEditTime: 2020-11-14 07:00:47
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
/** var 声明作用域
 * 作用域提升
 */
/*
 function test () {
   message = 'hi' // 不使用 var 操作符 相当于在全局创建了一个 message 的变量，但是不推荐这么使用，很难维护，而且不利于排查问题
 }
 test()
//  var message // 创建了一个全局变量，函数 test 执行的时候发现内部作用域中没有定义 message 这个变量，会向上一层去寻找，直到找到全局
 console.log(message) // 'hi'
 */
/*
function test () {
  var age = 26 // 只存在于函数变量中 调用完就被销毁
}
test()
console.log(age) // age is not defined
*/

 /**
  * var 声明提升
  */
