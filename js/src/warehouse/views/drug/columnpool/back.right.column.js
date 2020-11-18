import { tableColWidth } from '@/util/table-config'
import {
  statusHtml
} from '@/warehouse/views/util/html'
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import sysValue from '@/components/sysvalue'
import BackIconHTML from './back.icon.html'
import BackDetails from './back.details'
import materialShowName from '@/warehouse/page/components/material.show.name.vue'
import Vue from 'vue'
const filters = Vue.options.filters
const bus = Vue.prototype.$bus
export default function columns () {
  return [
    {
      prop: 'custom_prop',
      label: '标识',
      slotName: 'custom_prop',
      align: 'center',
      width: 43,
      required: true,
      undraggable: true,
      render (h, ctx, row, index) {
        return BackIconHTML(h, row)
      }
    },
    {
      prop: 'name',
      label: '物资名称',
      slotName: 'name',
      required: true,
      undraggable: true,
      render (h, ctx, row, index) {
        /**
         * cdssResult:cdss校验结果
         * examineMsg: 驳回原因
         * examineMsg: 拒绝入库原因
         */
        const { materialName, localMaterialId, scene, icons, cdssResult, examineMsg, outHospitalizedStatus, status } = row || {}
        return h('div',
          {
            class: {
              f_bold: true
            }
          },
          [
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
            (examineMsg && status === 20) && h('div', { // 驳回展示
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
                    h('span', { // 标识
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
                    h('div', { //  驳回内容
                      class: { flex1: true, red: true },
                      style: {
                        'line-height': '18px'
                      },
                      domProps: {
                        innerHTML: examineMsg
                      }
                    })
                  ]
                ),
                (scene === 1 || (scene === 3 && outHospitalizedStatus && ![8, 9, 10, 11].includes(outHospitalizedStatus))) && h('div', { // 删除驳回原因
                  domProps: {
                    innerHTML: '<i class="iconfont icon-delete"></i>'
                  },
                  on: {
                    click: (e) => {
                      // 派发删除异常信息
                      bus.$emit('back:delete-exception-cause', row, e, index)
                    }
                  },
                  class: {
                    blue: true, cur: true, df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 15px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                }
                ),
              ]),
            (examineMsg && status === 22) && h('div', { // 拒收原因说明
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
                    h('span', {
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#f27700'
                      }
                    },
                      '拒收')
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
                      class: { flex1: true, cOrange: true },
                      domProps: {
                        innerHTML: examineMsg
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
          ])
      }
    },
    {
      prop: 'spec',
      label: '规格',
      slotName: 'spec',
      required: true,
      undraggable: true,
      render (h, ctx, row, index) {
        const { spec } = row || {}
        return spec ? h('span', spec) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.name4W80
    },
    {
      prop: 'type',
      label: '剂型',
      slotName: 'type',
      undraggable: true,
      render (h, ctx, row, index) {
        const { dosageForm } = row || {}
        return dosageForm ? h(sysValue, {
          props: {
            code: dosageForm,
            type: 'THC_WH_DRUG_FORM'
          },
        }) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.w150,
    },
    {
      prop: 'batchNum',
      label: '生产批号',
      width: 120,
      isBatch: true,
      undraggable: true,
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
      undraggable: true,
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
      isBatch: true,
      undraggable: true,
      slotName: 'validityDate',
      render (h, ctx, row, index) {
        const { validityDate } = row || {}
        return h('span', filters.formatDateByExp(validityDate, 'YYYY-MM-DD')) || tableDefaultCellValue
      }
    },
    {
      prop: 'price',
      label: '销售价',
      width: 80,
      isBatch: true,
      undraggable: true,
      slotName: 'price',
      render (h, ctx, row, index) {
        const { price } = row || {}
        return h('span', price || tableDefaultCellValue)
      }
    },
    {
      prop: 'num',
      label: '退货数量',
      slotName: 'num',
      undraggable: true,
      render (h, ctx, row, index) {
        const { num, packagUnitName } = row || {}
        return h('div', [
          num,
          packagUnitName
        ])
      },
      width: tableColWidth.name4W80,
    },
    {
      prop: 'operationName',
      label: '申请人',
      undraggable: true,
      slotName: 'operationName',
      render (h, ctx, row, index) {
        const { operationName, providerName } = row || {}
        return h('div', [
          operationName, `(${providerName})`
        ])
      },
      width: tableColWidth.w150,
    },
    {
      prop: 'status',
      label: '状态',
      undraggable: true,
      required: true,
      slotName: 'status',
      render (h, ctx, row, index) {
        const html = statusHtml(ctx, row, index, 'back')
        return h('div', { domProps: { innerHTML: html } })
      },
      width: tableColWidth.name4W80,
    },
    {
      prop: 'custom_details',
      label: '详情',
      slotName: 'custom_details',
      align: 'center',
      undraggable: true,
      width: 80,
      render (h, ctx, row, index) {
        return BackDetails(h, row)
      }
    },
  ]
}
