/* eslint-disable */
// import printersetapiApi from '@/warehouse/store/printersetapi'
import jcpTool from 'jcpjs'
import { getPaddingByMM, getTablePrintLine, resetTrackContent } from './editor.print'
import { Notification } from 'element-ui'
// import urlMap from '@/systemset/urls'
// import { request } from '@/util/req'
import staticvars from '@/store/staticvars'
import { editorCss } from '../../static/assets/editor.css.js'
import { isLocalHost } from '@/store/basehost'
// import slantLine from '@img/assets/slant_line.png'
// function arrayRecursion (arr, index, pageHeight, domArr) {
//   let itemHeight = 0
//   let outerHTMLstr = ''
//   let bigDom = ''
//   domArr = domArr || []
//   let isRepeat = false
//   let lastItem = 0
//   if (arr.length - index - 1 >= 0) {
//     for (let i = index; i < arr.length; i++) {
//       let _thatHeight = arr[i].offsetHeight
//       if (_thatHeight < pageHeight) {
//         itemHeight += _thatHeight
//         if (itemHeight <= pageHeight) {
//           outerHTMLstr += arr[i].outerHTML
//           lastItem = i + 1
//         } else {
//           isRepeat = true
//           break
//         }
//       } else {
//         bigDom = arr[i].outerHTML
//         lastItem = i + 1
//         isRepeat = true
//         break
//       }
//     }
//     domArr.push(outerHTMLstr)
//     if (bigDom) domArr.push(bigDom)
//     if (isRepeat) arrayRecursion(arr, lastItem, pageHeight, domArr)
//     return domArr
//   }
// }

/**
 * 病历编辑器内容打印
 * @param _this     Object    required vue 当前实例或组件中的this
 * @param config    Object required 杰创打印参数配置 具体看杰创文档
 * config = {
    documents: document, // 页面元素在
    settings: {
      paperName: 'A4'
    },
    printFrom: true,
    copyrights: '杰创软件拥有版权 www.jatools.com'
  }
 * @param domArr    Array    required 需要打印的dom 列表
 * [
 *  {
 *    dom: '',
 *    anotherRecord: 0 || 1,      另立专项
 *    anotherPage: 0 || 1   另起一页
 *  }
 * ]
*/

function removeSide (dom, sideName) {
  let side = dom.querySelectorAll(sideName)
  if (side && side.length) {
    for (let i = 0; i < side.length; i++) {
      side[i].remove()
    }
  }
}

// 替换反斜线样式
function replaceSlantLineStyle(tableWrap) {
  let slantLines = tableWrap.querySelectorAll(".slant-line")
  for (let i = 0; i < slantLines.length; i++) {
    let item = slantLines[i]
    item.style.position = 'relative'
    item.style.background = 'none'
    // 解决IE下高度无法撑满导致对角线无法对齐问题
    item.style.height = item.clientHeight + 'px'
    let img = document.createElement("img")
    img.src = '/web/static/assets/slant_line.png'
    // img.src = slantLine
    if (item.clientHeight < 50) {
      img.src = '/web/static/assets/slant_line2.png'
    }
    img.style.position = 'absolute'
    img.style.left = '0px'
    img.style.top = '0px'
    img.style.width = '100%'
    img.style.height = item.style.height // 避免img height: 100%时在IE下出现几像素空白
    img.style.zIndex = '10'
    item.appendChild(img)
  }
}

// export const computePageProps = (isPortrait, pageSize, pWidth, pHeight) => {
//   let width, height
//   if (pageSize) {
//     if (isPortrait) {
//       // 横向
//       switch (pageSize) {
//         case 'A4':
//           width = 1123
//           height = 794
//           break
//         case 'A5':
//           width = 794
//           height = 559
//           break
//         case 'P2':
//           width = 528
//           height = 528
//           break
//         default:
//           width = 1123
//           height = 794
//       }
//     } else {
//       switch (pageSize) {
//         case 'A4':
//           width = 794
//           height = 1123
//           break
//         case 'A5':
//           width = 559
//           height = 794
//           break
//         case 'P2':
//           width = 528
//           height = 528
//           break
//         default:
//           width = 794
//           height = 1123
//       }
//     }
//   } else {
//     width = pWidth
//     height = pHeight
//   }
//   return {
//     width,
//     height
//   }
// }

function setEditorPageContent (pageContent, printBody, item, editorMainStyle, contentHeight, appendIndex) {
  let modeName = item.track ? 'track__mode' : 'clear__mode'
  for (let i = 0; i < pageContent.length; i++) {
    let pageItem = pageContent[i]
    let content = pageItem.querySelector('.editor__page_content')
    content.style.padding = '0px'
    let itemDiv = document.createElement('div')
    itemDiv.className = `editor__main editor__paper print ${modeName}`
    itemDiv.innerHTML = item.header ? `${item.header}${content.outerHTML}` : content.outerHTML
    itemDiv.innerHTML = item.footer ? `${itemDiv.innerHTML}${item.footer}` : itemDiv.innerHTML
    itemDiv.id = `page${appendIndex}`
    itemDiv.style.height = `${contentHeight}px`
    for (let sitem in editorMainStyle) {
      if (editorMainStyle.hasOwnProperty(sitem)) itemDiv.style[sitem] = editorMainStyle[sitem]
    }
    printBody.appendChild(itemDiv)
    appendIndex += 1
  }
  return appendIndex
}
// function setInputHide (parent) {
//   let aInput = parent.querySelectorAll('input')
//   for (let i = 0; i < aInput.length; i++) {
//     aInput[i].style.display = 'none'
//   }
//   // aInput.style.display = 'none'
// }
export const jcpPrintEditor = (_this, config, settings = {}, domArr, done) => {
  config = config || {}
  let userAgent = window.navigator.userAgent
  let preview = config.preview
  if (config.preview !== undefined) delete config.preview
  let base = {
    paperName: 'A4',
    paperWidth: 210,
    paperHeight: 297,
    portrait: true,
    pagePadding: [10, 10, 10, 10],
    'font-size': 10.5,
    'font-family': 'SimSun,STSong',
    'line-height': 1.5
  }
  settings = {...base, ...settings}
  let editorStyleArr = ['font-size', 'font-family', 'line-height']
  let editorMainStyle = {}
  editorStyleArr.forEach(item => {
    let val = settings[item] ? settings[item] : base[item]
    if (val) {
      let append = item === 'font-size' ? 'pt' : ''
      editorMainStyle[item] = `${val}${append}`
    }
  })
  let printConfig = {
    documents: document,
    settings: {
      paperName: 'A4'
    },
    ...config,
    copyrights: '杰创软件拥有版权 www.jatools.com',
    done (res) {
      if (typeof done === 'function') {
        done()
      }
    }
  }
  if (settings) {
    if (settings.paperName) {
      printConfig.settings.paperName = settings.paperName
    }
    if (settings.paperWidth && settings.paperHeight) {
      printConfig.settings.paperWidth = settings.paperWidth
      printConfig.settings.paperHeight = settings.paperHeight
    }
    if (settings.pagePadding) {
      printConfig.padding = settings.pagePadding
    }
    if (settings.portrait !== undefined) {
      printConfig.settings.portrait = settings.portrait
    } else {
      printConfig.settings.portrait = true
    }
  }
  let pageProps = {
    width: printConfig.settings.paperWidth,
    height: printConfig.settings.paperHeight
  }
  let contentWidth = Math.ceil(pageProps.width * 3.78)
  let contentHeight = Math.ceil(pageProps.height * 3.78)
  // 设置打印边距
  let pagePadding = {}
  // 系统打印边距兼容
  let ieSpe = 0
  if (userAgent.indexOf('Windows NT 6.1') > -1) {
    ieSpe = 0.5
  } else if (userAgent.indexOf('Windows NT 10') > -1) {
    ieSpe = 1.5
  }
  if (printConfig.padding && printConfig.padding.length) {
    pagePadding = getPaddingByMM({ padding: printConfig.padding }, true)
    printConfig.padding = printConfig.padding.map(item => { return item })
    printConfig.settings.marginTop = printConfig.padding[0] ? printConfig.padding[0] - ieSpe : 0
    printConfig.settings.marginRight = printConfig.padding[1] ? printConfig.padding[1] - ieSpe : 0
    printConfig.settings.marginBottom = printConfig.padding[2] ? printConfig.padding[2] - ieSpe : 0
    printConfig.settings.marginLeft = printConfig.padding[3] ? printConfig.padding[3] - ieSpe : 0
    contentWidth = contentWidth - Math.ceil((printConfig.settings.marginRight + printConfig.settings.marginLeft) * 3.78)
    contentHeight = contentHeight - Math.ceil((printConfig.settings.marginTop + printConfig.settings.marginBottom) * 3.78)
    delete printConfig.padding
  }
  let printBody = document.getElementById('editorPrintBody')
  if (!printBody) {
    printBody = document.createElement('div')
    printBody.id = 'editorPrintBody'
    printBody.className = 'editor editor__main'
    printBody.style.height = '0px'
    printBody.style.position = 'absolute'
    printBody.style.top = '-999999px'
    printBody.style.left = '-999999px'
    document.body.appendChild(printBody)
  }
  for (let item in editorMainStyle) {
    if (editorMainStyle.hasOwnProperty(item)) printBody.style[item] = editorMainStyle[item]
  }
  printBody.style.width = Math.ceil(pageProps.width * 3.78) + 'px'
  printBody.style.padding = (pagePadding && pagePadding.padding) || ''
  printBody.innerHTML = ''
  let pageHeader = ''
  if (domArr && domArr.length) {
    let appendIndex = 1
    domArr.forEach((item, index) => {
      let modeName = item.track ? 'track__mode' : 'clear__mode'
      if (!item.track) item.dom = resetTrackContent(item.dom)
      if (index === 0) {
        let page = document.createElement('div')
        page.innerHTML = item.dom
        let imgArr = page.querySelectorAll('span[data-type="image"]')
        if (imgArr && imgArr.length) {
          imgArr.forEach(sitem => {
            let img = sitem.querySelector('img')
            sitem.style.width = img.width + 'px'
            sitem.style.height = img.height + 'px'
          })
        }
        let pageContent = page.querySelectorAll('.editor__page_wrap')
        // isPaginate判断是否为分页模式的文档打印
        if (pageContent && pageContent.length) {
          appendIndex = setEditorPageContent(pageContent, printBody, item, editorMainStyle, contentHeight, appendIndex)
        } else {
          page.id = `page${appendIndex}`
          for (let sitem in editorMainStyle) {
            if (editorMainStyle.hasOwnProperty(sitem)) page.style[sitem] = editorMainStyle[sitem]
          }
          page.className = `breakable editor__main print eval-here ${modeName}`
          // 不分页模式的文档 充第一个dom中获取header & footer
          let domHeader = page.querySelector('.editor__header')
          if (domHeader) {
            for (let item in editorMainStyle) {
              if (editorMainStyle.hasOwnProperty(item)) domHeader.style[item] = editorMainStyle[item]
            }
          }
          pageHeader = domHeader && domHeader.outerHTML || ''
          printConfig.header = {
            html: '<span></span>'
          }
          printConfig.evalClass = 'eval-here'
          let domFooter = page.querySelector('.editor__footer')
          let style =
            '<style>.editor__header,.editor__footer{position:relative;background-color:#fff;margin:0 auto;width:100%;font-family:SimSun,STSong;font-size:10.5pt;line-height:1.5;white-space:pre-wrap;word-break:break-all;word-wrap:break-word;-ms-word-wrap:break-word;overflow-wrap:break-word}.editor__header .tableWrapper,.editor__footer .tableWrapper{margin:0}.editor__header .tableWrapper td,.editor__footer .tableWrapper td{padding:0}*{margin:0;padding:0}.placeholder{visibility:hidden}.leftside,.rightside{display:none}.inputcontent:before{display:none}table{table-layout:auto;border-collapse:collapse;width:100%;margin:0}table td,table th{min-width:1em;border-style:solid;border-width:1px;border-color:#333;padding:5px;vertical-align:middle;box-sizing:border-box;position:relative}table td p,table th p{margin:0}table th{font-weight:bold;text-align:left}u{text-decoration:none;border-bottom:1px solid #000;padding:2px 0}.todo-checkbox,.todo-radio,li[data-type=todo_item] .todo-checkbox{padding:0 3px}h1{font-size:22pt}h2{font-size:18pt}h3{font-size:16pt}h4{font-size:14pt}h5{font-size:12pt}h6{font-size:10pt}.image-ctrl{display:inline-block;font-size:0;text-align:center;clear:both;float:none}.image-ctrl.align_center{display:block;margin:20px 0}.image-ctrl.align_left{float:left;margin-right:20px}.image-ctrl.align_right{float:right;margin-left:20px} input{display:none;}</style>'
          if (domFooter && !printConfig.footer) {
            // 打印控件显示问题解决
            domFooter.style.width = `${contentWidth}px`
            for (let item in editorMainStyle) {
              if (editorMainStyle.hasOwnProperty(item)) domFooter.style[item] = editorMainStyle[item]
            }
            domFooter.className = 'editor__footer print'
            removeSide(domFooter, '.leftside, .rightside')
            let parr = domFooter.querySelectorAll('p')
            parr.forEach(item => {
              if (!item.innerHTML.trim() || item.innerHTML === '<br>') {
                item.innerHTML = '&nbsp;'
              }
            })
            domFooter.innerHTML = domFooter.innerHTML.replace(/\s\s/g, '&ensp;&ensp;').replace(/&nbsp;/g, '&ensp;') + style
            printConfig.footer = {
              html: domFooter.outerHTML
            }
            domFooter.remove()
          }
          let table = page.querySelector('table')
          // 如果页面上有table需要以break-window的方式分页  则保留header
          if (table && table.hasAttribute('headerrows')) {
            table.id = 'break-table'
            page.setAttribute('break-window', '#break-table')
          } else {
            // 需要从组page的结构
            domHeader && domHeader.remove()
            page.setAttribute('break-window', `#break-page-${index}`)
            page.innerHTML = `${pageHeader}<div class="break-page" id="break-page-${index}">${page.innerHTML}</div>`
          }
          printBody.appendChild(page)
          appendIndex += 1
        }
      } else {
        const prevItem = domArr[index - 1]
        let page = document.createElement('div')
        page.innerHTML = item.dom
        let imgArr = page.querySelectorAll('span[data-type="image"]')
        if (imgArr && imgArr.length) {
          imgArr.forEach(sitem => {
            let img = sitem.querySelector('img')
            sitem.style.width = img.width + 'px'
            sitem.style.height = img.height + 'px'
          })
        }
        let pageContent = page.querySelectorAll('.editor__page_wrap')
        if (pageContent && pageContent.length) {
          // 只要是分页模式的  全部按已经分页的结果打印 不判断另立专项或另起一页
          appendIndex = setEditorPageContent(pageContent, printBody, item, editorMainStyle, contentHeight, appendIndex)
        } else {
          // 移除其他内容中的页眉页脚 如果有需求一次打印出现不同的页眉页脚 可以在这块取editor__header的内容每页重新设置页眉
          let domHeader = page.querySelector('.editor__header')
          let domFooter = page.querySelector('.editor__footer')
          if (domHeader) domHeader.remove()
          if (domFooter) domFooter.remove()
          // 当前记录为另起一页或者上一条记录为另立专项时新加入页
          if (item.anotherPage === 1 || prevItem.anotherRecord === 1) {
            page.className = `breakable editor__main print eval-here  ${modeName}`
            page.id = `page${appendIndex}`
            if (editorMainStyle) page.style = editorMainStyle
            page.setAttribute('break-window', `#break-page-${appendIndex}`)
            page.innerHTML = `${pageHeader}<div class="break-page" id="break-page-${appendIndex}">${page.innerHTML}</div>`
            printBody.appendChild(page)
            appendIndex += 1
          } else {
            const prevPage = printBody.lastChild
            let pageCon = prevPage.querySelector('.break-page')
            if (pageCon) {
              pageCon.innerHTML = pageCon.innerHTML + page.innerHTML
            } else {
              // 如果上一页不是自动分页页 则需要新建页面
              page.className = `breakable editor__main print eval-here ${modeName}`
              page.id = `page${appendIndex}`
              if (editorMainStyle) page.style = editorMainStyle
              page.setAttribute('break-window', `#break-page-${appendIndex}`)
              page.innerHTML = `${pageHeader}<div class="break-page" id="break-page-${appendIndex}">${page.innerHTML}</div>`
              printBody.appendChild(page)
              appendIndex += 1
            }
          }
        }
      }
    })
  }
  removeSide(printBody, '.leftside, .rightside')
  let todoContent = printBody.querySelectorAll('.todo-content')
  todoContent.forEach(item => {
    if (item.innerHTML.search(/\s{2}/) > -1) {
      item.innerHTML = item.innerHTML.replace(/\s{5}/g, '&ensp;')
      item.innerHTML = item.innerHTML.replace(/\s{4}/g, '&ensp;')
      item.innerHTML = item.innerHTML.replace(/\s{3}/g, '&ensp;')
    }
  })
  printBody.innerHTML = printBody.innerHTML.replace(/\s\s/g, '&ensp;&ensp;').replace(/&nbsp;/g, '&ensp;')
  let parr = printBody.querySelectorAll('p')
  parr.forEach(item => {
    if (!item.innerHTML.trim() || item.innerHTML === '<br>') {
      item.innerHTML = '&nbsp;'
    }
  })
  // 替换反斜线样式
  replaceSlantLineStyle(printBody)

  getTablePrintLine(printBody, settings)
  // .replace(/#p/g, '<span class="eval-here">#p</span>')
  // .replace(/#P/g, '<span class="eval-here">#P</span>')
  let speDom = printBody.querySelectorAll('[contenteditable="true"]')
  if (speDom && speDom.length) {
    for (let i = 0; i < speDom.length; i++) {
      speDom[i].removeAttribute('contenteditable')
    }
  }
  let pages = printBody.querySelectorAll('.editor__paper')
  if (pages && pages.length) {
    pages.forEach((paper, index) => {
      paper.innerHTML = paper.innerHTML.replace(/#p/g, index + 1).replace(/#P/g, pages.length)
    })
  }
  printConfig.documents = {
    pages: printBody.innerHTML,
    style: editorCss
  }
  delete printConfig.autoPrint
  console.log('editor打印参数：', printConfig)
  // mac 不调用杰创打印
  if (userAgent.indexOf('Mac OS') !== -1) return
  _this.$nextTick(_ => {
    if (preview) {
      jcpTool.getJCP().printPreview(printConfig)
    } else {
      if (config.autoPrint) {
        jcpTool.getJCP().print(printConfig, false)
      } else {
        jcpTool.getJCP().print(printConfig, true)
      }
    }
  })
}

/*
* 打印方法
 code 帆软报表code   必传    需要去bi系统内查询帆软的报表地址
 params 业务相关参数    非必传     如patientid，visitsn等等
 printParams 打印相关参数   非必传
  http://print.jatools.com/doc/
  参数列表：
    preview: true 需要预览，false 不需要预览
    printer: 选择打印机
    portrait: true为纵向打印，false为横向打印  默认纵向
    paperName: 纸张类型 A4
    marginTop: 上边距 单位mm
    marginRight: 右边距 单位mm
    marginBottom: 下边距 单位mm
    marginLeft: 左边距 单位mm
*/
export const frPrint = async function (
  code,
  params = {},
  printParams = {
    preview: false,
    settings: {
      portrait: true,
      paperName: 'A4',
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      noMargins: true
    }
  }
) {
  console.log('帆软打印方法废弃 code:', code)
  // let _tmpObj = await printersetapiApi.getPrinterSetByCode(code)
  // // 判断是否在系统设置下打印机设置配置模版
  // if (_tmpObj && _tmpObj.settings.printer) {
  //   Object.assign(printParams, _tmpObj)
  // }
  // let printObj = {
  //   code,
  //   params,
  //   printParams
  // }
  // frDoPrint(printObj)
}

/**
 * 帆软表单打印
 * @param print           require     object
 * print.code             require     string          打印报表编码
 * print.params           require     string          打印报表参数值   &__pi__=false默认已添加
 * @param width           unrequired  string          可视区域的宽度  如： '1000px'
 * @param height          unrequired  string          可视区域的高度  如： '1000px'
 * @param done            unrequired  function        回调函数
 *
 * #######################################################
 * frDoPrint({
    code: hisReportCode,
    params: `id=id`
  })
 */
export const frDoPrint = async function (print, width, height, done) {
  Notification({
    title: '提示',
    dangerouslyUseHTMLString: true,
    message:
      `<div style="text-align:left">打印单据code为：<br>` +
      print.code +
      `<br>请使用打印工具制作相关的单据！</div>`,
    // message: `部分打印模板丢失，请联系管理人员重新配置后进行打印！`,
    type: 'error',
    duration: 30000
  })
  //  2322中文  2323英文
  // let language = Storage.getLocalStorage('PRINT_LANG') || 'print_cn'
  // language = language === 'print_cn' ? '2322' : '2323'
//   const res = await request(urlMap.report.getByHisReportCode, { hisReportCode: print.code })
//
//   if (res && res.data) {
//     if (res.data.biReportUrlUser) {
//       // 使用配置的preview,如果没有返回，则
//       print.printParams = print.printParams
//       // print.printParams.preview = isNullOrUndefined(res.data.whetherPreview) ? false : Boolean(res.data.whetherPreview)
//       // 兼容frPrint上面的写法
//       if (typeof print.params === 'object') {
//         print.params.pp = encodeURIComponent(JSON.stringify(print.printParams))
//         print.params = Object.keys(print.params)
//           .map(v => {
//             return `${v}=${print.params[v]}`
//           })
//           .join('&')
//       } else if (typeof print.params === 'string') {
//         // 兼容直接调用frDoPrint的写法
//         let pp = encodeURIComponent(JSON.stringify(print.printParams))
//         print.params = print.params + '&pp=' + pp
//       }
//
//       print.params = print.params || ''
//       let src = `${res.data.biReportUrlUser}&__pi__=false&${print.params}`
//       let $iframe = document.createElement('iframe')
//       $iframe.id = new Date().getTime()
//       $iframe.style.width = width || '800px'
//       $iframe.style.height = height || '3000px'
//       $iframe.style.position = 'absolute'
//       $iframe.style.top = '-99999px'
//       $iframe.style.left = '-99999px'
//       if (window.navigator.userAgent.indexOf('Mac OS') === -1) {
//         document.body.appendChild($iframe)
//         $iframe.src = src
//         if (done) done(true)
//         setTimeout(_ => {
//           document.body.removeChild($iframe)
//         }, 10000000)
//       } else {
//         // mac测试方便
//         console.log('系统为mac无法自动调用打印插件，打印地址是：', src)
//       }
//     } else {
//       if (done) done(false)
//     }
//   } else {
//     Notification({
//       title: '提示',
//       dangerouslyUseHTMLString: true,
//       message:
//         `<div style="text-align:left">获取打印地址失败<br>单据code为：` +
//         print.code +
//         `<br>请于"机构设置工作站->分析报表注册"页面内检查该数据是否正常。</div>`,
//       // message: `部分打印模板丢失，请联系管理人员重新配置后进行打印！`,
//       type: 'warning',
//       duration: 8000
//     })
//     if (done) {
//       done(false)
//     }
//   }
}

/**
 * 打印
 * @param _this                   Object              required            vue 当前实例或组件中的this
 * @param pbody                   String              required            打印内容dom id
 * @param page                    Object              unrequired          打印配置参数
 * @param page.pagination         Boolean             unrequired          是否分页  默认为不分页，目前只支持A4、A5纸的分页横向和纵向打印
 * @param page.fixedHeader        Boolean             unrequired          是否固定头部
 * @param page.fixedFooter        Boolean             unrequired          是否固定底部
 * @param page.size               String              required            纸张类型
 * @param page.dir                String              unrequired          纸张方向  横向：landscape  纵向portrait
 * @param page.margin             Array               unrequired          打印内边距  Array[0]: top bottom ; [1]: left right  只有[0]为 top bottom left right  单位 cm
 * @param header                  String              unrequired          打印头部dom id
 * @param footer                  String              unrequired          打印底部dom id
 * @param done                    function            unrequired          回调函数
 */
export const doPrint = function (_this, pbody, page, header, footer, done) {
  // 4.11.1 打印方法清理 by lvjiangtao
  console.error('打印方法，切换到杰创打印框架上面，')
  // 组件DOM渲染完成执行
//   _this.$nextTick(_ => {
//     // 确保DOM完全显示
//     setTimeout(_ => {
//       let $iframe = document.getElementById('piframe')
//       let win
//       let doc
//       if (!$iframe) {
//         $iframe = document.createElement('iframe')
//         $iframe.id = 'piframe'
//         $iframe.style.width = '0px'
//         $iframe.style.height = '0px'
//         $iframe.style.position = 'absolute'
//         $iframe.style.top = '-99999px'
//         $iframe.style.left = '-99999px'
//         document.body.appendChild($iframe)
//         win = $iframe.contentWindow
//         doc = win.document || $iframe.contentDocument
//
//         // 加载页面样式
//         // doc.head.innerHTML = document.head.innerHTML
//       } else {
//         win = $iframe.contentWindow
//         doc = win.document || $iframe.contentDocument
//         doc.body.innerHTML = ''
//       }
//       // 加载页面样式
//       doc.head.innerHTML = ''
//       doc.head.innerHTML = document.head.innerHTML
//       let printCon = document.getElementById(pbody)
//       if (page) {
//         if (page.pagination) {
//           // 分页显示  固定头尾
//           let pageHeight = 0
//           let pagePadding = page.margin[0] ? (page.margin[0] / 0.025) * 2 : 0
//           let conHeight = printCon.clientHeight
//           // A4：210×297；A5：148×210 (mm)      1mm = 3.78px
//           let pageProps = computePageProps(page.dir === 'landscape', page.size)
//           pageHeight = pageProps.height
//           pageHeight = pageHeight - pagePadding
//           let pageRealHeight = pageHeight
//           let headerDom = document.getElementById(header)
//           let footerDom = document.getElementById(footer)
//           if (page.fixedHeader) {
//             pageHeight = pageHeight - headerDom.offsetHeight
//           }
//           if (page.fixedFooter) {
//             pageHeight = pageHeight - footerDom.offsetHeight
//           }
//           if (pageHeight >= conHeight) {
//             // 打印内容可以在一页打印  不分页
//             let iframeInner = document.createElement('div')
//             iframeInner.className = 'ever_print_inner'
//             iframeInner.style.height = pageRealHeight + 'px'
//             if (headerDom) iframeInner.innerHTML += headerDom.innerHTML
//             iframeInner.innerHTML += printCon.innerHTML
//             if (footerDom) {
//               if (footerDom.querySelector('#print_page_total_num')) {
//                 footerDom.querySelector('#print_page_num').innerHTML = 1
//               }
//               if (footerDom.querySelector('#print_page_total_num')) {
//                 footerDom.querySelector('#print_page_total_num').innerHTML = 1
//               }
//               iframeInner.innerHTML += footerDom.innerHTML
//             }
//             doc.body.appendChild(iframeInner)
//           } else {
//             // 打印内容超出一页  分页分割打印内容
//             let everPrintBody = printCon.querySelector('.page_content_wrap')
//             let printBody = document.createElement('div')
//             printBody.className = printCon.children[0].className
//             printBody.innerHTML = ''
//             // 打印内容分割  方便分页显示和页码统计
//             let domArr = arrayRecursion(everPrintBody.children, 0, pageHeight)
//             let totalPage = domArr.length
//             domArr.forEach((item, index) => {
//               let iframeInner = document.createElement('div')
//               iframeInner.className = 'ever_print_inner'
//               iframeInner.style.height = pageRealHeight + 'px'
//               if (headerDom) iframeInner.innerHTML += headerDom.innerHTML
//               printBody.innerHTML = item
//               iframeInner.innerHTML += printBody.outerHTML
//               if (footerDom) {
//                 footerDom.querySelector('#print_page_num').innerHTML = index + 1
//                 footerDom.querySelector(
//                   '#print_page_total_num'
//                 ).innerHTML = totalPage
//                 iframeInner.innerHTML += footerDom.innerHTML
//               }
//               doc.body.innerHTML += iframeInner.outerHTML
//             })
//           }
//         } else {
//           // 不分页  直接打印
//           let bodyHTML = ''
//           if (header) {
//             let headerDom = document.getElementById(header)
//             bodyHTML += headerDom.innerHTML
//           }
//           bodyHTML += printCon.innerHTML
//           if (footer) {
//             let footerDom = document.getElementById(footer)
//             bodyHTML += footerDom.innerHTML
//           }
//           doc.body.innerHTML = bodyHTML
//         }
//
//         // 页面打印配置
//         let margin = ''
//         if (page.margin && page.margin.length) {
//           margin = page.margin ? `${page.margin[0]}cm` : ''
//           margin = page.margin[1]
//             ? `${margin} ${page.margin[1]}cm`
//             : `${margin}`
//           margin = page.margin[2]
//             ? `${margin} ${page.margin[2]}cm`
//             : `${margin}`
//           margin = page.margin[3]
//             ? `${margin} ${page.margin[3]}cm`
//             : `${margin}`
//         }
//         margin = margin ? `margin:${margin};` : 'margin:0;padding:0'
//         let pageSize = page.size ? `${page.size}` : ''
//         pageSize = page.dir ? `${pageSize} ${page.dir}` : `${pageSize}`
//         pageSize = pageSize ? `size:${pageSize};` : ''
//         doc.body.innerHTML += `<style> @page { ${pageSize}${margin}}</style>`
//       } else {
//         // 不分页  直接打印
//         let bodyHTML = ''
//         if (header) {
//           let headerDom = document.getElementById(header)
//           bodyHTML += headerDom.innerHTML
//         }
//         bodyHTML += printCon.innerHTML
//         if (footer) {
//           let footerDom = document.getElementById(footer)
//           bodyHTML += footerDom.innerHTML
//         }
//         bodyHTML += `<style> @page {margin:0;padding:0}</style>`
//         doc.body.innerHTML = bodyHTML
//       }
//       // 确保iframe 内容渲染完毕
//       setTimeout(() => {
//         win.focus()
//         win.print()
//         if (done) done()
//       }, 1000)
//     }, 500)
//   })
}

function createIframe (src) {
  let $iframe = document.createElement('iframe')
  $iframe.id = 'new_print_iframe_' + Math.random()
  $iframe.name = 'print_' + Math.random()
  $iframe.style.position = 'absolute'
  $iframe.style.top = '-99999px'
  $iframe.style.left = '-99999px'
  $iframe.src = src
  document.body.appendChild($iframe)
  return $iframe
}

let printcb = {}
let printing = false
let printtime = -1
// code:  模板的code
// params：查询的json结构参数
// preview: 是否预览（选填）
// cb：打印结束回调（选填）
// eventCb：监听打印事件回调（选填）
export function everprint (code, params = {}, { preview = false, cb = _ => { }, eventCb = _ => { }, lang = null, printFrom = false } = {}) {
  if (printing) {
    Notification({
      title: '提示',
      message: '打印中，当前打印任务完成后可再次打印'
    })
    return false
  }
  printing = true
  printtime && clearTimeout(printtime)
  // 强制设置为false，预防没有触发回调
  printtime = setTimeout(_ => {
    printing = false
  }, 1000 * 20)
  let src = `${staticvars.prefix}/printer/?code=${code}`
  if (isLocalHost()) {
    if (!localStorage.getItem('printhost')) {
      localStorage.setItem('printhost', 'https://dev4.everjiankang.com.cn')
    }
    src = localStorage.getItem('printhost') + src
  }
  if (lang) {
    src += `&lang=${lang}`
  }
  if (printFrom) {
    src += `&printFrom=${printFrom}`
  }
  if (params) {
    src += `&params=${encodeURIComponent(JSON.stringify(params))}`
  }
  src += preview ? '&preview=true' : '&preview=false'
  let iframe = createIframe(src)
  printcb[iframe.name] = function (data) {
    // if (data.status === 'doc-stop') {
    //   printing = false
    // }
    // 打印完成删除 iframe，避免过多的 127.0.0.1 本地请求卡死 jcp
    // 延迟几秒移除iframe ，以确保 iframe 内 log 请求不被 cancel
    if (['printed', 'window-close', 'cancel-print'].indexOf(data.status) > -1) {
      printing = false
      // setTimeout(_ => {
      let removedIFrame = document.querySelector(`iframe[name="${data.name}"]`)
      removedIFrame && document.body.removeChild(removedIFrame)
      delete printcb[data.name]
      // }, 3000)
    }
    if (data.status !== 'printed') {
      eventCb(data.status)
    } else {
      cb()
    }
  }
  // 非打印完成的情况下也需要删除 iframe
  setTimeout(_ => {
    iframe && document.body.contains(iframe) && document.body.removeChild(iframe)
    delete printcb[iframe.name]
  }, 1000 * 60 * 5)
}

export function everprintlog (id, code, params, { preview = false, lang = null } = {}) {
  let src = `/printer/?id=${id}&code=${code}`
  if (lang) {
    src += `&lang=${lang}`
  }
  if (params) {
    src += `&params=${encodeURIComponent(JSON.stringify(params))}`
  }
  src += preview ? '&preview=true' : '&preview=false'
  createIframe(src)
}

window.addEventListener('message', function (e) {
  // const type = e.data && e.data.type
  // if (type && everprint.cb) {
  //   // 打印出来，print传递的 事件对象中只有一个type字段，有type 的时候直接传递过去
  //   // type: http://print.jatools.com/doc/    2.5.3    监听其他事件
  //   everprint.cb(type)
  // }
  if (e.data && e.data.status) {
    printcb[e.data.name] && printcb[e.data.name](e.data)
  } else if (e.data && e.data.errCode) {
    printing = false
    Notification({
      title: '打印错误',
      message: e.data.errMsg,
      type: 'error'
    })
  }
})
