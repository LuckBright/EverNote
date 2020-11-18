let zerospaceVal = 65279
/**
 * 获取页面打印边距
 * @param {*} page
 * @param {*} isJson
 */
export const getPaddingByMM = (page, isJson) => {
  let padding = ''
  if (page && page.padding && page.padding.length) {
    let paddingArr = []
    // 厘米和像素转化
    page.padding.map(item => {
      paddingArr.push(item * 3.78)
    })
    padding = paddingArr[0] ? `${paddingArr[0]}px` : '0px'
    padding = paddingArr[1]
      ? `${padding} ${paddingArr[1]}px`
      : paddingArr[1] === 0
      ? `${padding} 0px`
      : `${padding}`
    padding = paddingArr[2]
      ? `${padding} ${paddingArr[2]}px`
      : paddingArr[2] === 0
      ? `${padding} 0px`
      : `${padding}`
    padding = paddingArr[3]
      ? `${padding} ${paddingArr[3]}px`
      : paddingArr[3] === 0
      ? `${padding} 0px`
      : `${padding}`
  }
  if (isJson) {
    return {
      padding: padding ? `${padding}` : '0',
      margin: '0'
    }
  } else {
    padding = padding ? `padding:${padding};margin:0;` : 'margin:0;padding:0'
    return padding
  }
}

function getDatasetStr (dataset) {
  let str = ''
  for (let item in dataset) {
    if (dataset.hasOwnProperty(item)) {
      str += `data-${item}="${dataset[item]}" `
    }
  }
  return str
}
/**
 * 拆分dom递归
 * @param {*} node
 * @param {*} wrapBefore
 * @param {*} wrapAfter
 * @param {*} domArr
 */
function domSplit (node, wrapBefore, wrapAfter, domArr) {
  if (node.childNodes && node.childNodes.length) {
    for (let j = 0; j < node.childNodes.length; j++) {
      let jNodes = node.childNodes[j]
      if (jNodes.nodeType === 3) {
        let childText = jNodes.textContent.split('')
        childText = childText.forEach(item => {
          if (item.charCodeAt() !== zerospaceVal && item.trim()) {
            domArr.push(`${wrapBefore}${item}${wrapAfter}`)
          }
        })
      } else if (jNodes.nodeType === 1) {
        if (['radio_item', 'check_item'].includes(jNodes.dataset.type)) {
          domArr = domArr.concat([`${wrapBefore}${jNodes.outerHTML}${wrapAfter}`])
        } else {
          let jNodeDatasetStr = getDatasetStr(jNodes.dataset)
          let jWrapBefore = `${wrapBefore}<${jNodes.localName} class="${jNodes.className}" style="${jNodes.style.cssText}" ${jNodeDatasetStr}>`
          let jWrapAfter = `</${jNodes.localName}>${wrapAfter}`
          domArr = domSplit(jNodes, jWrapBefore, jWrapAfter, domArr)
        }
      }
    }
  }
  return domArr
}

/**
 * 拆分dom 以便获得dom矩阵数据
 * @param {*} node
 * @param {*} wrapBefore
 * @param {*} wrapAfter
 * @param {*} domArr
 */
export const getDomWrap = (node, wrapBefore, wrapAfter, domArr) => {
  wrapBefore = wrapBefore || ''
  wrapAfter = wrapAfter || ''
  if (['radio_item', 'check_item'].includes(node.dataset.type)) {
    domArr = domArr.concat([`${wrapBefore}${node.outerHTML}${wrapAfter}`])
  } else {
    let nodeDatasetStr = getDatasetStr(node.dataset)
    wrapBefore += `<${node.localName} class="${node.className}" style="${node.style.cssText}" ${nodeDatasetStr}>`
    wrapAfter = `</${node.localName}>${wrapAfter}`
    domArr = domSplit(node, wrapBefore, wrapAfter, domArr)
  }
  return domArr
}

/**
 * 将段落结构化
 * @param {*} paragraph
 * @param {*} isLast
 */
export const getBreakWrap = (paragraph, isLast) => {
  if (!paragraph || !paragraph.childNodes || !paragraph.childNodes.length) {
    return null
  }
  let left = paragraph.childNodes[0].getBoundingClientRect().left
  let breakDom = []
  let breakIndex = 0
  for (let j = 0; j < paragraph.childNodes.length; j++) {
    let rect = paragraph.childNodes[j].getBoundingClientRect()
    let prevRect = j > 0 ? paragraph.childNodes[j - 1].getBoundingClientRect() : null
    if (j !== 0 && (rect.left === left || (prevRect && rect.left < prevRect.left))) {
      breakIndex++
    }
    breakDom[breakIndex] = breakDom[breakIndex] || ''
    breakDom[breakIndex] += paragraph.childNodes[j].outerHTML
  }
  let tdDomArr = []
  if (breakDom && breakDom.length) {
    breakDom.forEach((item, index) => {
      let newParagraph = document.createElement('div')
      newParagraph.className = isLast && index === breakDom.length - 1 ? 'td_new_line no_bor' : 'td_new_line'
      newParagraph.style = paragraph.style.cssText || ''
      newParagraph.innerHTML = item
      tdDomArr.push(newParagraph)
    })
  }
  return tdDomArr
}
/**
 * 重新设置dom结构 获得该tr下面最长（高度）的单元格的dom结构
 * @param {*} lineTable
 * @param {*} normalHeight
 */
function getLineDom (lineTable, normalHeight) {
  let maxLineDomArr = []
  // 遍历每一行  得到划分行数最多的行
  for (let i = 0; i < lineTable.childNodes.length; i++) {
    let tr = lineTable.childNodes[i]
    let td = tr.querySelectorAll('td')
    if (td && td.length && tr.textContent.trim()) {
      let lineWrapArr = []
      let maxLineDom
      for (let j = 0; j < td.length; j++) {
        let item = td[j]
        let paragraph = item.querySelectorAll('p')
        let tdLine = []
        if (paragraph && paragraph.length) {
          for (let pindex = 0; pindex < paragraph.length; pindex++) {
            let pitem = paragraph[pindex]
            let domArr = []
            if (pitem.childNodes && pitem.childNodes.length) {
              for (let i = 0; i < pitem.childNodes.length; i++) {
                let node = pitem.childNodes[i]
                if (node.nodeType === 3) {
                  let childText = node.textContent.split('')
                  childText = childText.map(child => {
                    if (child.charCodeAt() !== zerospaceVal && child.trim()) {
                      domArr.push(`<span>${child}</span>`)
                    }
                  })
                  // if (node.textContent.length) domArr = domArr.concat(`<span>${node.textContent}</span>`)
                } else if (node.nodeType === 1) {
                  domArr = getDomWrap(node, '', '', domArr)
                }
              }
            } else {
              let childText = pitem.textContent.split('')
              if (childText && childText.length) {
                childText = childText.map(child => {
                  if (child.charCodeAt() !== zerospaceVal && child.trim()) {
                    domArr.push(`<span>${child}</span>`)
                  }
                })
              }
            }
            pitem.innerHTML = domArr.join('')
            let isLast = pindex === paragraph.length - 1 ? !0 : !1
            let newPitem = getBreakWrap(pitem, isLast)
            if (newPitem && newPitem.length) {
              pitem.innerHTML = ''
              let newHtml = ''
              newPitem.forEach(ndom => {
                newHtml += ndom.outerHTML
              })
              pitem.innerHTML = newHtml
              if (pitem.childNodes && pitem.childNodes.length) {
                for (let i = 0; i < pitem.childNodes.length; i++) {
                  let litem = pitem.childNodes[i]
                  let height = normalHeight
                  if (litem.clientHeight > normalHeight) {
                    height = Math.ceil(litem.clientHeight / normalHeight) * normalHeight
                  }
                  litem.style.height = height + 'px'
                  litem.style.lineHeight = height + 'px'
                }
              }
              tdLine = tdLine.concat(newPitem)
            }
          }
        }
        if (tdLine && tdLine.length) {
          lineWrapArr.push(tdLine)
        }
      }
      lineWrapArr.map(item => {
        if (!maxLineDom || item.length > maxLineDom.length) {
          maxLineDom = item
        }
      })
      maxLineDomArr.push(maxLineDom)
    }
  }
  return maxLineDomArr
}

/**
 * 重组每一个td(单元格)的dom结构
 * @param {*} maxLineDomArr
 * @param {*} lineTable
 * @param {*} normalHeight
 */
function setLineDom (maxLineDomArr, lineTable, normalHeight) {
  let tdIndex = 0
  let height = normalHeight
  let newParagraph = document.createElement('div')
  newParagraph.className = 'td_new_line'
  newParagraph.style.height = height + 'px'
  newParagraph.style.lineHeight = height + 'px'
  for (let j = 0; j < lineTable.childNodes.length; j++) {
    let tr = lineTable.childNodes[j]
    let td = tr.querySelectorAll('td')
    if (td && td.length && tr.textContent.trim()) {
      tdIndex++
      let curTdIndex = tdIndex - 1
      if (maxLineDomArr[curTdIndex] && maxLineDomArr[curTdIndex].length) {
        for (let m = 0; m < td.length; m++) {
          let item = td[m]
          let tdHeight = item.clientHeight
          let maxLineNum = tdHeight > height ? Math.floor(tdHeight / height) : 0
          let paragraph = item.querySelectorAll('p')
          let lineArr = item.querySelectorAll('.td_new_line')
          // 计算new line占多行的情况
          let extendNum = 0
          if (lineArr && lineArr.length) {
            for (let n = 0; n < lineArr.length; n++) {
              let line = lineArr[n]
              if (line.clientHeight > height) {
                let num = Math.ceil(line.clientHeight / height)
                extendNum += num - 1
              }
            }
          }
          let lineNum = (lineArr && lineArr.length) + extendNum
          if (paragraph && paragraph.length) {
            let tdInnerHTML = ''
            for (let pindex = 0; pindex < paragraph.length; pindex++) {
              let pitem = paragraph[pindex]
              if (lineNum < maxLineNum) {
                if (paragraph.length - 1 === pindex) {
                  let extandHtml = ''
                  for (let i = lineNum; i < maxLineNum; i++) {
                    extandHtml += newParagraph.outerHTML
                  }
                  pitem.innerHTML = pitem.innerHTML + extandHtml
                }
              }
              if (pitem.childNodes && pitem.childNodes.length) {
                for (let lindex = 0; lindex < pitem.childNodes.length; lindex++) {
                  let litem = pitem.childNodes[lindex]
                  if (paragraph.length - 1 === pindex && pitem.childNodes.length - 1 === lindex) {
                    litem.className = 'td_new_line no_bor'
                  } else {
                    litem.className = 'td_new_line'
                  }
                }
              }
              tdInnerHTML += pitem.innerHTML
            }
            item.innerHTML = tdInnerHTML
          }
        }
      }
    }
  }
}

/**
 * 获取划线表格DOM(由于一些计算是基于浏览器渲染后的dom实现，innerHTML的性能问题待解决)
 * @param {*} tableWrap
 * @param {*} page
 */
export const getTablePrintLine = async (tableWrap, settings) => {
  let fontSize = settings && settings['font-size'] || 10.5
  let lineHeight = settings && settings['line-height'] || 1.5
  let TD_NORMAL_HEIGHT = Math.ceil(fontSize * lineHeight * 1.33)
  let lineTables = tableWrap.querySelectorAll('table.line tbody')
  if (lineTables && lineTables.length) {
    lineTables.forEach(lineTable => {
      // 获取每一行拆分行数最大的 必须每一行都有
      let maxLineDomArr = getLineDom(lineTable, TD_NORMAL_HEIGHT)
      if (maxLineDomArr && maxLineDomArr.length) {
        setLineDom(maxLineDomArr, lineTable, TD_NORMAL_HEIGHT)
      }
    })
  } else {
    let tableCell = tableWrap.querySelectorAll('table[cellline="true"] .table_cell')
    if (tableCell && tableCell.length) {
      tableCell.forEach(cell => {
        let cellLineList = cell.querySelector('.cell_line__list')
        if (cellLineList) {
          cell.style.display = 'table-cell'
          cell.style.width = 'inherit'
          cell.style.height = cellLineList.clientHeight + 'px'
          cell.style.verticalAlign = 'inherit'
        }
      })
    }
  }
}

export const resetTrackContent = function (html) {
  let pageDOM = document.createElement('div')
  pageDOM.innerHTML = html
  // 痕迹删除的节点
  let deltedDom = pageDOM.querySelectorAll('[track="deleted"]')
  deltedDom.forEach(item => {
    item.remove()
  })
  // 痕迹删除的内容
  let deletedTrack = pageDOM.querySelectorAll('.editor__deleted')
  deletedTrack.forEach(item => {
    item.remove()
  })
  // 痕迹属性
  let trackMraks = pageDOM.querySelectorAll('.editor__trace_wrap')
  trackMraks.forEach(item => {
    if (item.hasAttribute('class')) item.removeAttribute('class')
    if (item.hasAttribute('data-added')) item.removeAttribute('data-added')
    if (item.hasAttribute('data-deleted')) item.removeAttribute('data-deleted')
    if (item.hasAttribute('data-same')) item.removeAttribute('data-same')
    if (item.hasAttribute('data-sameadded')) item.removeAttribute('data-sameadded')
  })

  return pageDOM.innerHTML
}
