/**
 * Factory 工厂模式
 */
  // 4.1 广告展现
  /**
   * 需求 广告资源投放
   * 一批是 java 绿色字体
   * 一批是 PHP 黄色字体 红色背景
   * 创建两个类，通过实例对象方式来完成
   */

  //  创建 JAVA 类
  // var Java = function (content) {
  //   // 将内容保存在 content 中
  //   this.content = content
  //   // 创建对象时，通过闭包直接执行，将内容需求的样式插入到页面内
  //   (function (content) {
  //     var div = document.createElement('div')
  //     div.innerHTML = content
  //     div.style.color = 'green'
  //     document.getElementById('container').appendChild(div)

  //   })(content)
  // }

  // 创建 PHP学科类
  // var Php = function (content) {
  //   // 将内容保存在 content 中
  //   this.content = content
  //   // 创建对象时，通过闭包直接执行，将内容需求的样式插入到页面内
  //   (function (content) {
  //     var div = document.createElement('div')
  //     div.innerHTML = content
  //     div.style.color = 'yellow'
  //     div.style.background = 'red'
  //     document.getElementById('container').appendChild(div)

  //   })(content)
  // }

  /**
   *  简单工厂模式 
   */

    // 创建 Java 类
    var Java = function (content) {
      // ....
    }

    // 创建 PHP学科类
    var Php = function (content) {
      // ....
    }

    // 学科类工厂
    function JobFactory (type, content) {
      switch (type) {
        case 'java':
          return new Java(content);
        case 'Php':
          return new Php(content)
        default:
          return {}
      }
    }

    // 使用方式
    JobFactory('java', 'dkkdkdahkjdh')

  /**
   * 以上行为可以实现需求，but em... 需求一变更就需要重复修改
   * 
   * 方案：使用安全模式类
   * 概念：安全模式类是说可以屏蔽使用这对类的错误使用造成的错误。例如 Dome 是一个类，需要使用其中 show 方法，但是使用的时候可能不知道是个类，直接去调用，但是拿不到其中的 show 方法
   */

  //  例子
  // var Demo = function () {}
  // Demo.prototype = {
  //   show: function () {
  //     console.log('成功获取')
  //   }
  // }
  // var d = new Demo()
  // d.show() // 成功获取
  // var d = Demo()
  // d.show() // Uncaught TypeError: Cannot read property 'show' of undefined

  /**
   * 解决方案：在构造函数开始时先判断当前对象 this 指代是不是类 (Demo) ，如果是则通过 new 关键字返回该对象，如果不是则直接返回 Dome 使其指向全局作用域
   */

  //  var Demo = function () {
  //    console.log(this)
  //    if (!(this instanceof Demo)) {
  //      return new Demo
  //    }
  //  }
  //  Demo.prototype = {
  //    show: function () {
  //      console.log('成功获取')
  //    }
  //  }
  //  var d = Demo()
  //  d.show()

  /**
   * 安全工厂使用方法
   */
  // 安全模式创建的工厂类
  var Factory = function (type, content) {
    if (this instanceof Factory) {
      var s = this[type][content]
      return s
    }
    return new Factory(type, content)
  }
  // 工厂原型中设置创建所有类型数据对象的基类
  Factory.prototype = {
    Java: function (content) {
      console.log(content)
      // var box = document.querySelector('.box')
      // box.innerHTML = content
    },
    JavaScript: function (content) {
      // ....
    },
    // 以后使用时，如果需求不停变更，只需修改写在 Factory 这个工厂类的原型里面就可以了
    // ...
  }

  // 正式使用
  var data = [
    { type: 'Java', content: 'java 哪家强' },
    { type: 'JavaScript', content: 'JavaScript 哪家强' }
  ]

  var a = Factory('Java', 'fff')
  a.Java('22')

