/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-10-31 11:18:45
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-10-31 11:50:22
 */
/**
* 工具方法定义
*/
import req from '@/util/req'
import storage from '@/util/storage'
import { compare } from '@/util/common'
import { MAX_COUNT, CHINESE_MEDICINE_TYPE } from './constant'
import { hanlderItems } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'
import { packSourceData } from '@/warehouse/views/drug/columnpool/dispensing.js'
const url = 'thc-platform-core/frequency/'
export const scrollToBottom = (parentDom = '#treeBox', treeDom = '#commonTree') => {
  setTimeout(_ => {
    const dom = document.querySelector(parentDom)
    const commonTree = document.querySelector(treeDom)
    const domHeight = dom.offsetHeight // 盒子高度
    let treeHeight = commonTree.offsetHeight // 树的历史高度
    dom.addEventListener('click', function (e) {
      setTimeout(function () {
        const top = dom.getBoundingClientRect().top // 元素上边距离页面上边的距离
        const newTreeHeight = commonTree.offsetHeight // 树的实时高度
        const scrollHeight = (newTreeHeight - treeHeight) > domHeight ? (domHeight - 50) : (newTreeHeight - treeHeight)
        if ((e.pageY - top) > (domHeight - 40) && treeHeight < newTreeHeight) {
          treeHeight = newTreeHeight
          dom.scrollTo(0, scrollHeight + dom.scrollTop)
        } else {
          treeHeight = 0
        }
      }, 300)
    }, true)
  }, 300)
}

/** wrapperProscription
 *  包装处方明细数据：
 * @param {Number} mode 2 按处方整单展示 1 处方明细维度
 * @returns Object
 */
export const wrapperProscription = (mode) => {
  if (mode === 2) { // 处方整单维度
    // pageType === 2 为收方发药界面
    return function (res, pageType) {
      if (res.finally) return null
      // 按处方维度拆分数据
      const prescriptionObj = {}
      Object.keys(res).forEach(key => {
        prescriptionObj[key] = {}
        const list = res[key]
        list.forEach((item, index) => {
          prescriptionObj[key][index] = {}
          item.taskDtoList.forEach(task => {
            // 解构处方号、处方单、医生名、开单时间、所属科室、状态、邮寄标识、任务类型<中药|西药>
            let { adviceExecuteCode = '', doctorName, createTime, providerName, status, mailFlag, taskType, orderCode, executeProviderName = '', finishTime = '' } = task
            // 补费 任务无sourceCode处方单号，使用业务单号代替处方单号（无处方单号合并处方时，会合并为一个空处方的sourceCode的任务明细）
            // if (source === 4) sourceCode = doctorAdviceCode
            // 处方单 + 执行单 合并处方集
            // const codeMap = sourceCode + adviceExecuteCode
            const codeMap = orderCode
            if (prescriptionObj[key][index][codeMap] || (prescriptionObj[key][index][codeMap] = [])) {
              // checked: 处方选择checkbox使用 default:true 默认可操作的数据都勾选上

              const obj = Object.assign({ checked: true }, item, { taskType, mailFlag, status, executeProviderName, providerName, createTime, finishTime, doctorName, orderCode, adviceExecuteCode, taskDtoList: task })
              prescriptionObj[key][index][codeMap].push(obj)
            }
          })
        })
      })
      // 重新整合数据
      const newResult = {}
      Object.keys(prescriptionObj).forEach(oneLevelKey => {
        // 合并处方数据
        const temp = []
        // 缺货处方数据
        const shortageData = []
        Object.keys(prescriptionObj[oneLevelKey]).forEach(twoLevelKey => {
          Object.keys(prescriptionObj[oneLevelKey][twoLevelKey]).forEach(threeLevelKey => {
            // lists 所有处方明细列表数据
            let lists = prescriptionObj[oneLevelKey][twoLevelKey][threeLevelKey]
            // identification: 添加异常字段
            // theLast: 自定义属性：同状态是否是最后一个处方（用于处方操作展示时，是否展示btn操作）
            const obj = Object.assign({ identification: 0, theLast: 0 }, lists[0], { taskDtoList: [] })
            if (lists.length > 1) {
              lists.forEach(data => {
                // identification:该明细为异常，该处方标记为异常
                const identification = data.taskDtoList.identification
                // shortage:该明细为缺货，该处方标记为缺货
                const shortage = data.taskDtoList.shortage
                if (shortage === 23) obj.shortage = shortage
                if (identification) obj.identification = identification
                obj.taskDtoList.push(data.taskDtoList)
              })
              if (obj.shortage === 23) {
                shortageData.push(obj)
              } else {
                temp.push(obj)
              }
            } else {
              const data = Object.assign({}, obj, { taskDtoList: [lists[0].taskDtoList], identification: lists[0].taskDtoList.identification, shortage: lists[0].taskDtoList.shortage })
              if (lists[0].taskDtoList.shortage === 23) {
                shortageData.push(data)
              } else {
                temp.push(data)
              }
            }
          })
        })
        // 是否有待出库
        const hasOut = temp.some(task => task.status === 2)
        // 是否有待邮寄的
        const hasMail = temp.some(task => !task.mailFlag)

        if ((hasOut && +oneLevelKey === 0) || (+oneLevelKey === 1 && hasMail)) {
          // 把缺货处方添加在最后
          temp.push(...shortageData)
        } else {
          // 所有处方都是已完结状态把缺货处方添加在最前面
          temp.unshift(...shortageData)
        }
        temp.sort(compare(+oneLevelKey === 0 ? 'status' : 'mailFlag'))
        for (let i = 0; i < temp.length; i++) {
          const cur = temp[i]
          const tempNext = temp[i + 1]
          const { delivery, taskType } = cur
          // 同状态下，下一条数据为真并且状态不相同 | 下一条数据不存在了， 那么当前就为该状态下最后一条
          if (
            (
              tempNext &&
              (
                (delivery === 0 &&
                  (
                    tempNext.status !== cur.status ||
                    tempNext.identification ||
                    (
                      tempNext.shortage === 23 ||
                      cur.shortage === 23
                    )
                  )
                ) ||
                (
                  delivery === 1 &&
                  (
                    tempNext.status > 3 ||
                    cur.status > 3 ||
                    tempNext.mailFlag !== cur.mailFlag ||
                    tempNext.identification ||
                    (
                      tempNext.shortage === 23 ||
                      cur.shortage === 23
                    )
                  )
                ) ||
                (
                  ( // 收方发药  没有指定库房的任务和有指定库房的任务分为一组 统一一个操作按钮 (没有指定库房，直接跳过)
                    pageType === 2 &&
                    tempNext.actualStorageRoomId &&
                    tempNext.actualStorageRoomId !== cur.actualStorageRoomId
                  ) ||
                  (
                    pageType !== 2 &&
                    tempNext.actualStorageRoomId !== cur.actualStorageRoomId
                  )
                ) ||
                tempNext.isOwnerOrg !== cur.isOwnerOrg)
            ) ||
            !tempNext
          ) cur.theLast = 1
          // 批次定价才需要进行处理合并
          const { sysBatchCode } = cur.taskDtoList[0] || {}
          if (sysBatchCode) {
            cur._isBatch = 1
            // 为了处理西药合并 单元格 给相同物资打上下标
            if (!CHINESE_MEDICINE_TYPE.includes(taskType)) {
              cur.taskDtoList = hanlderItems(cur.taskDtoList, (data, thisArr) => {
                data._summationNum = thisArr.reduce((prev, curr) => {
                  return prev + curr.num
                }, 0)
              })
            } else { // 类型为中药， 如果是多批次的，可能是多个物资id一样，这个时候需要合并一下
              // 中药包装数据 _sourceData
              cur.taskDtoList = packSourceData(cur.taskDtoList)
            }
          }
        }

        let sortField = ''
        switch (+oneLevelKey) {
          case 0:
            sortField = 'identification'
            break
          case 1:
            sortField = 'mailFlag'
            break
          default:
            sortField = ''
        }
        // 排序异常： 异常在后
        newResult[oneLevelKey] = sortField ? [...temp].sort(compare(sortField)) : [...temp]
      })
      console.log(newResult, 'newResult')
      return newResult
    }
  } else if (mode === 1) { // 处方明细维度
    return function (res) {
      // 明细维度也需要给物资打上下标,方便批次数据的合并
      Object.keys(res).forEach(oneLevelKey => {
        res[oneLevelKey].forEach(twoLevelKey => {
          const { taskType } = twoLevelKey.taskDtoList[0] || {}
          const _isBatch = twoLevelKey.taskDtoList.some(task => task.sysyBatchCode)
          twoLevelKey.taskType = taskType
          if (!CHINESE_MEDICINE_TYPE.includes(taskType)) {
            twoLevelKey.taskDtoList = hanlderItems(twoLevelKey.taskDtoList, (data, thisArr) => {
              if (_isBatch) {
                data._summationNum = thisArr.reduce((prev, curr) => {
                  return prev + curr.num
                }, 0)
              } else {
                data._summationNum = data.num
              }
            })
          } else {
            twoLevelKey.taskDtoList = packSourceData(twoLevelKey.taskDtoList)
          }
        })
      })
      return res
    }
  } else {
    return function (res) {
      return { msg: '没有该操作模式', data: res }
    }
  }
}

export const localToFixed = function localToFixed (str) { // 删除小数点后四位小数
  let _str = str // 保留原始数据
  if (~(str += '') && str.indexOf('.') > -1) {
    return str.split('.')[1] > 0 ? str : parseInt(str)
  }
  return _str
}

export const getUseFreq = async function () {
  // 获取频次全部数据
  const FREQUENCY_LIST = JSON.parse(storage.getSessionStorage('FREQUENCY_LIST'))
  if (!FREQUENCY_LIST) {
    const params = {
      isValid: 1
    }
    const res = await req.get(url + 'getFrequencysForSob', params)
    if (res && Array.isArray(res.data)) {
      storage.setSessionStorage('FREQUENCY_LIST', JSON.stringify(res.data))
      return res
    }
  }
}

const cacheComponentMap = new Map()
// 递归向上查找父组件(通过是否包含某个field | 组件name)
export const componentUpward = function componentUpward (ctx, field, name) {
  if (cacheComponentMap.has(name)) {
    return cacheComponentMap.get(name)
  }
  let parent = ctx.$parent
  let count = 0
  while (parent && count < MAX_COUNT) {
    count++
    if (parent[field] || (name && parent.$options.name === name)) {
      cacheComponentMap.set(name, parent)
      return cacheComponentMap.get(name)
    } else {
      parent = parent.$parent
    }
  }
}
