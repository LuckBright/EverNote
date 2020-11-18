import { GOLBAL_VAL_MATERIL_NAME } from '@/util/common'
import storage from '@/util/storage'
const CLINICID = storage.getLocalStorage('CLINICID') || ''
export const columns = [
  {
    prop: 'managePermission',
    slotName: 'managePermission',
    label: '管理权',
    width: '100px',
    display: true,
    render (h, ctx, row) {
      return h('el-switch', {
        props: {
          value: row.managePermission,
          activeValue: 1,
          inactiveValue: 0,
          disabled: (row.parentCode === '0') || (this.clinicType === '0') || (row.clinicId + '' === CLINICID)
        },
        on: {
          input (val) {
            row.managePermission = val
          },
          change: (val) => {
            this.changeOrgService(row, val, 'managePermission')
          }
        }
      })
    }
  },
  {
    prop: 'state',
    slotName: 'state',
    label: '使用权',
    width: '100px',
    display: true,
    render (h, ctx, row) {
      return h('el-switch', {
        props: {
          value: row.state,
          activeValue: 1,
          inactiveValue: 0,
          disabled: this.clinicType === '0'
        },
        on: {
          input (val) {
            row.state = val
          },
          change: (val) => {
            this.changeOrgService(row, val, 'state')
          }
        }
      })
    }
  }
]

export const leftColumns = [
  {
    prop: 'name',
    label: '物资名称',
    type: 'component',
    sortable: true,
    component: {
      isSpecial: true,
      sourceKey: 'ext',
      name: 'sourceKey',
      standard: false,
      property: GOLBAL_VAL_MATERIL_NAME.NAME_ONE
    }
  },
  {
    prop: 'dosage',
    label: '剂型',
    type: 'component',
    width: 110,
    component: {
      isSpecial: true,
      sourceKey: 'ext',
      name: 'sourceKey',
      property: 'SXX000007'
    }
  },
  {
    prop: 'spec',
    label: '规格',
    type: 'component',
    width: 110,
    component: {
      isSpecial: true,
      sourceKey: 'ext',
      name: 'sourceKey',
      standard: true,
      property: [[]]
    }
  },
  {
    prop: 'classifyObject',
    label: '物资类别',
    type: 'component',
    width: 110,
    component: {
      isSpecial: true,
      sourceKey: 'ext',
      name: 'sourceKey',
      property: 'classifyObject'
    }
  },
  {
    slotName: 'opCol'
  }
]

