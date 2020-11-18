/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:48
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-20 15:17:04
 */
// 发药列表表格配置
import { tableColWidth } from '@/util/table-config'
import {
  showIcon,
  statusHtml,
} from '@/warehouse/views/util/html'
import {
  PLACEHOLDER_ICON,
  CHINESE_MEDICINE_TYPE,
  tableDefaultCellValue,
  AUDIT_STATUS,
  HOSPITAL_STATUS,
} from '@/warehouse/views/util/constant'
import {
  WEST_MEDICINE_TYPE,
} from '@/util/common'
// import { componentUpward } from '@/warehouse/views/util/index'
import storage from '@/util/storage'
import sysValue from '@/components/sysvalue'
import AdviceIcon from '@/warehouse/views/drug/component/advice.icon'
import ChineseMedicine from '@/warehouse/views/drug/component/chinese.medicine.vue'
import { TASK_TYPE, ORDER_STATUS } from '@/order/util/const.js'
import BackIconHTML from '@/warehouse/views/drug/columnpool/back.icon.html.js'
import materialShowName from '@/warehouse/page/components/material.show.name.vue'
import Vue from 'vue'
const filters = Vue.options.filters
const codeWidth = 130
/**
 * types: // 业务类型 (业务类型： 门诊／住院／超市收银／互联网商城等) => TASK_TYPE 3: 住院
 * orderType: // 单据类型 -- 订单任务数据 (DOCUMENT_TYPE) 0: 发药单  1: 退药单
 * chineseMedicine: 中药表格需要的字段
 */

/**
 * 用于当前表格列，需要展示在那些业务类型中
 * 获取业务类型  =>  用于当前类型展示需要的表格列
 *
 * @param {Array} omits 排除的参数
 */
function getTaskTypes (omits) {
  const obj = {}
  const key = omits.sort().join('')
  if (obj[key]) return obj[key]
  const types = TASK_TYPE.map(item => item.id)
  omits.forEach(omit => {
    let i = -1
    if ((i = types.findIndex(item => item === omit)) > -1) types.splice(i, 1)
  })
  return (obj[key] = types)
}
export default [
  {
    prop: 'custom_prop',
    label: '标识',
    slotName: 'custom_prop',
    width: 73,
    types: getTaskTypes([4, 5]),
    chineseMedicine: true,
    render (h, ctx, row, index) {
      const { orderType } = row
      // 退货标识
      if (orderType === 1) {
        return BackIconHTML(h, row)
      }
      return showIcon(h, row, PLACEHOLDER_ICON.slice(0, -1), false)
    }
  },
  {
    prop: 'commodityName',
    label: '商品名称',
    width: 400,
    types: [4],
  },
  {
    prop: 'name',
    chineseMedicine: true,
    label: '物资名称',
    slotName: 'name',
    render (h, ctx, row, index) {
      // TODO: taskItemList 是一个数组明细， 现今只有一条，后续如有展示明细，需进行再处理
      /**
       * cdssResult:cdss校验结果
       * exceptionCause:异常原因
       * rejectionReasons:驳回原因
       * description: 医生说明
       * dialogFlag: 编辑弹窗展示时需进行异常和驳回删除操作
       * identification: 异常标识
       * 删除驳回原因或删除异常原因abnormallyDeleteHandler
       * ctx.parent.abnormallyDeleteHandler(row, index, type=1) =>  type  1:驳回原因  0:异常原因
       */
      // row.pageType:发药页面标识 1任务审核
      // mainFlag:父子医嘱标识 1父医嘱  2子医嘱  lastMain:1最后一条子医嘱
      const { description, examineFlag, dialogFlag, pageType, identification, taskType, _sourceData = [], orderType } = row
      const { cdssResult, exceptionCause, materialName, icons, rejectionReasons, mainFlag, lastMain, localMaterialId } = row || {}
      // 转换一下驳回原因，医生说明存在并且驳回原因也存在时， 清空驳回原因， 不显示
      let rejectionReasonsInfo = rejectionReasons
      if (description && rejectionReasonsInfo && examineFlag === 0) rejectionReasonsInfo = ''
      return (!CHINESE_MEDICINE_TYPE.includes(`${taskType}`) || dialogFlag || orderType === 1) ? h('div',
        {
          class: {
            f_bold: true
          }
        },
        [
          h('div', [
            mainFlag > 0 && h(AdviceIcon, {
              class: {
                fl: true, mr5: true
              },
              props: {
                mainFlag,
                lastMain
              }
            }),
            h('div', [
              materialName && h(materialShowName, {
                props: {
                  materialName: materialName,
                  icons: icons,
                  localMaterialId
                },
                class: {
                  df: true
                }
              })
            ]),
          ]),
          cdssResult && h('div', { // csdd展示
            class: {
              df: true,
              dfc: true
            },
          },
            [
              h('div', {
                class: {
                  df: true, flex1: true
                },
                style: {
                  flex: '0 0 40px'
                }
              },
                [
                  h('span', { // cdss 标识
                    class: {
                      markIcon: true
                    },
                    style: {
                      background: '#eb9e05',
                    }
                  },
                    'CDSS')
                ]),
              h('div', {
                class: {
                  flex1: true
                },
                style: {
                  'line-height': '18px'
                }
              },
                [
                  h('div', { class: { flex1: true, cOrg: true } }, cdssResult) // cdss 内容
                ]),
            ]),
          (identification > 0 || dialogFlag) && exceptionCause && h('div', { // 异常展示
            class: {
              df: true,
              dfc: true
            },
          },
            [
              h('div', {
                class: {
                  df: true, flex1: true
                },
                style: {
                  flex: '0 0 40px'
                }
              },
                [
                  h('span', { // 异常标识
                    class: {
                      markIcon: true
                    },
                    style: {
                      background: '#e43'
                    }
                  },
                    '异常')
                ]),
              h('div',
                {
                  class: {
                    flex1: true
                  }
                },
                [
                  h('div', { //  异常内容
                    class: { flex1: true, red: true },
                    style: {
                      'line-height': '18px'
                    },
                    domProps: {
                      innerHTML: exceptionCause
                    }
                  })
                ]
              ),
            ]),
          (rejectionReasonsInfo && (pageType === 1 || pageType === undefined)) && h('div', { // 驳回原因:只有任务审核页面才显示驳回原因
            class: {
              df: true, dfc: true
            },
          },
            [
              h('div', {
                class: {
                  df: true, flex1: true
                },
                style: {
                  flex: '0 0 40px'
                }
              },
                [
                  h('span', {
                    class: {
                      markIcon: true
                    },
                    style: {
                      background: '#e43'
                    }
                  },
                    '驳回')
                ]),
              h('div',
                {
                  class: {
                    flex1: true
                  }
                },
                [
                  h('div', {
                    class: { flex1: true, red: true },
                    style: {
                      'line-height': '18px'
                    },
                    domProps: {
                      innerHTML: rejectionReasonsInfo
                    }
                  })
                ]
              ),
            ]),
          description && h('div', { // 医生说明：todo:在任务审核页面才需要展示  && row.pageType === 1
            class: {
              df: true,
              dfc: true
            },
          },
            [
              h('div', {
                class: {
                  df: true, flex1: true
                },
                style: {
                  flex: '0 0 40px'
                }
              },
                [
                  h('span', { // cdss 标识
                    class: {
                      markIcon: true
                    },
                    style: {
                      background: '#1c78ef',
                    }
                  },
                    '说明')
                ]),
              h('div', {
                class: {
                  flex1: true
                },
                style: {
                  'line-height': '18px'
                }
              },
                [
                  h('div', {
                    class: { flex1: true, cBlue: true },
                    domProps: {
                      innerHTML: description
                    }
                  }) // 医生强制审核通过原因说明
                ]),
            ])
        ]) : h(ChineseMedicine, {
          props: {
            multiLibrary: 1, // 门诊多库房操作 -  1：门诊 2： 住院
            metaData: row,
            tableData: _sourceData
          }
        })
    }
  },
  {
    prop: 'spec',
    label: '规格',
    slotName: 'spec',
    render (h, ctx, row, index) {
      const { spec } = row || {}
      return spec ? h('span', spec) : h('span', tableDefaultCellValue)
    },
    width: tableColWidth.name4W80
  },
  {
    prop: 'batchNum',
    label: '生产批次',
    width: 120,
    isBatch: true,
    types: [999],
    slotName: 'batchNum',
    render (h, ctx, row, index) {
      const { batchNum } = row || {}
      return h('span', batchNum || tableDefaultCellValue)
    }
  },
  {
    prop: 'sysBatchCode',
    label: '系统批号',
    width: 120,
    isBatch: true,
    types: [999],
    slotName: 'sysBatchCode',
    render (h, ctx, row, index) {
      const { sysBatchCode } = row || {}
      return h('span', sysBatchCode || tableDefaultCellValue)
    }
  },
  {
    prop: 'validityDate',
    label: '有效期',
    width: 120,
    types: [999],
    isBatch: true,
    slotName: 'validityDate',
    render (h, ctx, row, index) {
      const { validityDate } = row || {}
      return h('span', filters.formatDateByExp(validityDate, 'YYYY-MM-DD') || tableDefaultCellValue)
    }
  },
  {
    prop: 'price',
    label: '销售价',
    width: 80,
    types: [999],
    isBatch: true,
    slotName: 'price',
    render (h, ctx, row, index) {
      const { price } = row || {}
      return h('span', price || tableDefaultCellValue)
    }
  },
  {
    prop: 'num',
    label: '数量',
    orderType: 0,
    slotName: 'num',
    render (h, ctx, row, index) {
      const { packagUnitName, num } = row || {}
      return h('div', [
        num,
        packagUnitName
      ])
    },
    width: tableColWidth.name3W65
  },
  {
    prop: 'DOSAGE',
    label: '剂型',
    types: [3],
    slotName: 'DOSAGE',
    render (h, ctx, row, index) {
      const { dosageForm } = row || {}
      return dosageForm ? h(sysValue, {
        props: {
          code: dosageForm,
          type: 'THC_WH_DRUG_FORM'
        },
      }) : h('span', tableDefaultCellValue)
    },
    width: tableColWidth.dateW105
  },
  {
    prop: 'backNum',
    label: '退货数量',
    slotName: 'backNum',
    orderType: 1,
    render (h, ctx, row, index) {
      const { packagUnitName, num } = row || {}
      return h('div', [
        num,
        packagUnitName
      ])
    },
    width: tableColWidth.name4W80
  },
  {
    prop: 'createName',
    label: '申请人',
    orderType: 1,
    types: getTaskTypes([5]),
    width: tableColWidth.name5W90
  },
  {
    prop: 'measure',
    label: '每次用量',
    types: getTaskTypes([3, 4, 5]),
    orderType: 0,
    width: tableColWidth.name4W80,
    slotName: 'measure',
    render (h, ctx, row, index) {
      const { measure, measureUnitId } = row || {}
      return measure ? h('span', [
        measure,
        measureUnitId && h(sysValue, {
          props: {
            code: measureUnitId,
            type: 'THC_WH_DOSE_UNIT'
          },
        })
      ]) : h('span', tableDefaultCellValue)
    }
  },
  {
    prop: 'useFreq',
    label: '频次',
    types: getTaskTypes([3, 4, 5]),
    orderType: 0,
    slotName: 'useFreq',
    render (h, ctx, row, index) {
      const { useFreq } = row || {}
      return useFreq ? h(sysValue, {
        props: {
          code: useFreq,
          initoptions: JSON.parse(storage.getSessionStorage('FREQUENCY_LIST')) || []
        },
      }) : h('span', tableDefaultCellValue)
    },
    width: tableColWidth.name5W90
  },
  {
    prop: 'useDay',
    label: '天数',
    orderType: 0,
    types: getTaskTypes([3, 4, 5]),
    slotName: 'useDay',
    render (h, ctx, row, index) {
      const scope = row || {}
      return h('span', scope.useDay ? (filters.subZeroAndDot(scope.useDay) + '天') : tableDefaultCellValue)
    },
    width: tableColWidth.name2W54
  },
  {
    prop: 'channel',
    label: '给药途径',
    orderType: 0,
    types: getTaskTypes([3, 4, 5]),
    slotName: 'channel',
    render (h, ctx, row, index) {
      const scope = row || {}
      return WEST_MEDICINE_TYPE.includes(String(row.taskType)) ? h('div', [
        scope.employ && h(sysValue, {
          props: {
            code: scope.employ,
            type: 'CV06.00.102'
          },
        }),
        h('div', [scope.dropSpeed && h(sysValue, { // 滴速
          props: {
            code: scope.dropSpeed,
            type: 'THC_CPOE_DropRate'
          },
        })])
      ]) : h('span', tableDefaultCellValue)
    },
    width: tableColWidth.dateW105
  },
  {
    prop: 'orderCode',
    label: '处方号/业务单号',
    orderType: 0,
    types: getTaskTypes([3, 4, 5]),
    formatter: ({ row: { orderCode } }) => {
      return orderCode
    },
    width: codeWidth
  },
  // adviceExecuteCode => otherCode
  {
    prop: 'otherCode',
    label: '执行单号',
    orderType: 0,
    types: getTaskTypes([3, 4, 5]),
    width: codeWidth
  },
  {
    prop: 'status',
    width: tableColWidth.name4W80,
    label: '状态',
    slotName: 'status',
    chineseMedicine: true,
    types: getTaskTypes([4, 5]),
    render (h, ctx, row, index) {
      // 住院没有审核
      // examineFlag: 0 / 未审核 1 / 驳回 2 / 已审核
      const { type, examineFlag, orderType, status } = row
      let flagVal = examineFlag
      // 历史定义的枚举值在现有业务中 是反的， 需要逆转过来（审核）
      if (examineFlag === 0) {
        flagVal = 1
      } else if (examineFlag === 1) {
        flagVal = 0
      }
      // 退药状态
      if (orderType === 1) {
        // 驳回入库，后端会把examineFlag重置回1，状态更新为10
        if (examineFlag === 1 && status === 10) {
          return h('div', {
            class: {
              'cRed': true
            },
            domProps: {
              innerHTML: '拒收'
            }
          })
        }
        if (typeof flagVal === 'number' && flagVal < 2) {
          return h('div', {
            domProps: {
              innerHTML: idToName(flagVal, AUDIT_STATUS, 'color')
            }
          })
        }
        return h('div', {
          domProps: {
            innerHTML: idToName(status, ORDER_STATUS, 'color')
          }
        })
      }

      // 住院状态
      if (type === 3) {
        return h('div', {
          domProps: {
            innerHTML: idToName(status, HOSPITAL_STATUS, 'color')
          }
        })
      }
      let flagStatus
      // 门诊(线上、线下) 并且未审核通过 | 取消任务 (取消任务优先展示)
      if ([1, 2].includes(type) && ((flagStatus = status === 5) || examineFlag !== 2)) {
        return h('div', {
          domProps: {
            innerHTML: idToName(flagStatus ? status : flagVal, flagStatus ? ORDER_STATUS : AUDIT_STATUS, 'color')
          }
        })
      }
      // 门诊状态
      return h('div', { domProps: { innerHTML: statusHtml(ctx, Object.assign({}, row, { examineFlag: flagVal }), index) } })
    }
  },
]

/**
 * filters id 转换 name名称
 * formateValueToFnt
 * @param {*} id
 * @param {*} list
 * @param {*} showKey
 * @returns
 */
const idToName = function idToName (id, list, showKey) {
  return `<span class="${filters.formateValueToFnt(id, { list, showKey })}">${filters.formateValueToFnt(id, { list })}</span>`
}
