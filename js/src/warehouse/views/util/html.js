/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-10-31 11:18:37
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-06 15:24:20
 */
import Vue from 'vue'
import {
  ICONS,
  MAIL_FLAG,
  DISPENSE_STATUS,
  AUDIT_STATUS,
  BACK_STATUS,
  BACK_AUDIT_STATUS,
  HOSPITAL_ICON_FONT,
  CHINESE_MEDICINE_TYPE,
  tableDefaultCellValue as defaultFnt
} from './constant'
import UseSvg from '@/warehouse/views/drug/component/use.svg.vue'
// import RenderPopover from '@/warehouse/views/drug/component/render.popover.vue'
import postPopover from '@/warehouse/views/drug/rendercomp/postrender.js'
import { maxBy } from 'lodash'
/**
 * showIcon  展示发药标识图标html结构
 * @param {Object} row  当前行数据row
 * @param {Array} args  要展示的图标类型字段[a, b ,c]
 * @param {Boolean} showPosted  是否展示邮寄图标
 */
export const showIcon = (h, row, args, showPosted = false) => {
  const { taskType, _sourceData, shortage } = row
  let rowShortage = shortage
  if (CHINESE_MEDICINE_TYPE.includes(String(taskType)) && _sourceData) {
    // 中药集 _sourceData 中存在异常数据，就把当前 row 数据标记为 异常
    if (_sourceData.some(item => item.identification)) row.identification = 1
    if (_sourceData.some(item => item.shortage === 23)) rowShortage = 23
  }
  return h('div', args.map((icon, index) => {
    let posted = 0
    // 快递标识需要展示在第一个，并且是已邮寄
    if (index === 0 && row.mailFlag && showPosted) posted = ICONS.posted
    return h('span', {
      class: {
        'inline-block': true, w20: true
      }
    },
      [posted ? h(postPopover, {
        props: {
          row
        }
      }) : row[icon] ? h(UseSvg, {
        props: { // 缺货标记为23 并且 icon === 'shortage'
          href: ((icon === 'shortage' && rowShortage === 23) || (icon !== 'shortage' && row[icon])) && typeof ICONS[icon] === 'string' ? (posted || ICONS[icon]) : ICONS[icon][+row[icon]]
        }
      }) : '']
    )
  }))
}
// fn：statusHtml  静态参数配置 （权重池子）
const weightPool = [
  {
    examineFlag: AUDIT_STATUS.filter(flag => flag.id < 2),
    status: [DISPENSE_STATUS[3]]
  },
  {
    mailFlag: MAIL_FLAG
  },
  {
    status: DISPENSE_STATUS.filter((status, index) => index !== 3)
  },
  {
    backstatus: BACK_STATUS
  },
  {
    backauditstatus: BACK_AUDIT_STATUS
  }
]

/**
 * statusHtml 展示发药状态标题html结构
 * @param {Object} ctx  ctx render 上下文
 * @param {Object} row  当前行数据row
 * @param {Number} index  当前行数据index
 */
export const statusHtml = (ctx, row, index, source) => {
  /**
  * delivery:发货方式 (自取0、邮寄1、自备2)
  * mailFlag:邮寄标记 => MAIL_FLAG
  * status:发药状态 => DISPENSE_STATUS
  * isInvalid:是否超时标识 => IS_INVALID
  * examineFlag:审核标记 => AUDIT_STATUS
  * identification:异常标记 => IDENTIFICATION
  * shortage:缺货标记 => SHORTAGE
  */
  const { delivery, _sourceData, taskType } = row
  // 自备展示默认值"-"
  if (delivery === 2) return defaultFnt
  let html = ''
  let wrapHtml = ''
  let isTrue = true
  const typeLen = 3 // 三种发货方式
  let i = 0
  while (isTrue && i < typeLen) {
    const weight = weightPool[i]
    const keys = Object.keys(weight)
    // 邮寄数据包含无法到货 需要跳过邮寄的状态取正常状态
    if (delivery === 1 && [4].includes(row.status) && i === 1) {
      i++
      continue
    }
    for (let n = 0; n < keys.length; n++) {
      let key = keys[n]
      // 非邮寄， 并且找到key为邮寄字段mailFlag直接跳过进入下一次循环
      // 邮寄下， 状态为5时跳过进入下一次循环
      // 邮寄数据包含无法到货 需要跳过邮寄的状态取正常状态
      if ((key === 'mailFlag' && (delivery !== 1 || (delivery === 1 && [4, 5].includes(row.status)))) || (delivery === 1 && ![4].includes(row.status) && key !== 'mailFlag')) {
        continue
      }
      if (key === 'examineFlag' && row.status === 5) row.examineFlag = 2 // 处方未审核 cpoe直接取消处方 优先展示取消状态
      // if (key === 'mailFlag' && row.status === 5 && row.isInvalid === 2) row.status = 6 // 处方未邮寄 cpoe直接取消处方 优先展示取消状态
      // if (row.status === 5 && row.isInvalid === 2) row.status = 6 // 处方取消， 并且isInvalid是超时标识 = 2， 重置状态为6 显示超时取消
      // 查找中药中最大的 status 值(查找中药中最靓的仔)
      const maxStatus = CHINESE_MEDICINE_TYPE.includes(String(taskType)) && _sourceData && maxBy(_sourceData, o => o.status)
      // 状态为已取消并且超时标识为超时时，值设置为 6  超时取消
      const value = row.status === 5 && row.isInvalid === 2
      ? 6 : (maxStatus ? (delivery === 1 ? maxStatus.mailFlag : maxStatus.status)
      : row[key])
      if (
        weight[key] &&
        (
          html = Vue.prototype.$filters.formateValueToFnt(value, { list: weight[key] })
        )
      ) {
        wrapHtml = `<span class="${Vue.prototype.$filters.formateValueToFnt(value, { list: weight[key], showKey: 'color' })}">${html}</span>`
        isTrue = false
        break
      }
    }
    i++
  }
  // 退药状态显示管理
  if (source && source === 'back') {
    const { toExamine } = row
    const { examineFlag, status } = row
    let inow = false
    if (toExamine || (!toExamine && (status !== 20 || examineFlag === 2 || examineFlag === null))) inow = true
    html = Vue.prototype.$filters.formateValueToFnt(inow ? status : examineFlag, { list: weightPool[inow ? 3 : 4][inow ? 'backstatus' : 'backauditstatus'] })
    wrapHtml = `<span class="${Vue.prototype.$filters.formateValueToFnt(inow ? status : examineFlag, { list: weightPool[inow ? 3 : 4][inow ? 'backstatus' : 'backauditstatus'], showKey: 'color' })}">${html}</span>`
  }
  return html ? wrapHtml : defaultFnt
}

// omits 排除字段
// isPaitent 患者列表， 需要删除一个缺货菜单 或者 无法到货菜单
export const showIconFontHospital = (h, row, omits = [], isPaitent) => {
  const { taskType, _sourceData, shortage } = row

  if (CHINESE_MEDICINE_TYPE.includes(String(taskType)) && _sourceData) {
    // 中药集 _sourceData 中存在异常数据，就把当前 row 数据标记为 异常
    if (_sourceData.some(item => item.identification)) row.identification = 1
  }
  if (isPaitent) {
    if (shortage === 23) {
      omits.push('status') // 存在缺货
    } else {
      omits.push('shortage') // 存在无法到货
    }
  }
  return h('div', { class: { alg_r: true } }, HOSPITAL_ICON_FONT.filter(font => !omits.includes(font.id)).map(font => {
    const isValid = [font.name].flat().includes(row[font.id])
    return h('span', {
      class: {
        'inline-block': true, w20: true
      },
      attrs: {
        title: isValid ? font.title : ''
      }
    },
      [
        h(UseSvg, {
          props: {
            href: isValid ? font.iconfont : ''
          }
        })
      ])
  }))
}
